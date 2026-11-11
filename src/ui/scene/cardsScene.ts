import * as THREE from "three";

export interface SceneCard {
  name: string;
  image: string;
}

const CARD_W = 1.4;
const CARD_H = 2;
const TEX_W = 256;
const TEX_H = 366;

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
}

/** Draws a parchment card (portrait + name) on a canvas; the texture updates once the portrait loads. */
function cardTexture(card: SceneCard): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const g = canvas.getContext("2d")!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const draw = (img?: HTMLImageElement) => {
    g.clearRect(0, 0, TEX_W, TEX_H);
    roundRect(g, 4, 4, TEX_W - 8, TEX_H - 8, 22);
    g.fillStyle = "#f2e6c9";
    g.fill();
    g.lineWidth = 6;
    g.strokeStyle = "#d1a03a";
    g.stroke();
    roundRect(g, 18, 18, TEX_W - 36, 250, 16);
    g.fillStyle = "#2a1d12";
    g.fill();
    if (img) {
      g.save();
      roundRect(g, 18, 18, TEX_W - 36, 250, 16);
      g.clip();
      // Square illustrations fill the window (cover).
      const s = Math.max(TEX_W - 36, 250);
      g.drawImage(img, 18 + (TEX_W - 36 - s) / 2, 18 + (250 - s) / 2, s, s);
      g.restore();
    }
    g.fillStyle = "#1f1830";
    g.font = "700 30px Cinzel, Georgia, serif";
    g.textAlign = "center";
    g.fillText(card.name, TEX_W / 2, 318);
    texture.needsUpdate = true;
  };

  draw();
  const img = new Image();
  img.onload = () => draw(img);
  img.src = card.image;
  return texture;
}

function backTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const g = canvas.getContext("2d")!;
  roundRect(g, 4, 4, TEX_W - 8, TEX_H - 8, 22);
  g.fillStyle = "#2d2154";
  g.fill();
  g.lineWidth = 6;
  g.strokeStyle = "#d1a03a";
  g.stroke();
  g.fillStyle = "#d1a03a";
  g.font = "800 120px Cinzel, Georgia, serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("?", TEX_W / 2, TEX_H / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

interface Floater {
  group: THREE.Group;
  speed: number;
  spin: THREE.Vector3;
  sway: number;
  phase: number;
}

/** Mounts slowly floating character cards behind the UI. Returns a cleanup function. */
export function mountCardsScene(container: HTMLElement, cards: readonly SceneCard[]): () => void {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 10;

  const geometry = new THREE.PlaneGeometry(CARD_W, CARD_H);
  const back = backTexture();
  const backMaterial = new THREE.MeshBasicMaterial({ map: back, transparent: true });
  const fronts = cards.map((c) => new THREE.MeshBasicMaterial({ map: cardTexture(c), transparent: true }));

  // Visible height at depth z, used to spread and recycle cards.
  const viewHeight = (z: number) => 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (camera.position.z - z);

  const floaters: Floater[] = [];
  const count = Math.max(cards.length, 14);
  for (let i = 0; i < count; i++) {
    const group = new THREE.Group();
    group.add(new THREE.Mesh(geometry, fronts[i % fronts.length]));
    const backMesh = new THREE.Mesh(geometry, backMaterial);
    backMesh.rotation.y = Math.PI;
    group.add(backMesh);
    const z = -2 - Math.random() * 8;
    const h = viewHeight(z);
    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    group.position.set((Math.random() - 0.5) * h * aspect, (Math.random() - 0.5) * h, z);
    group.rotation.set((Math.random() - 0.5) * 0.6, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.8);
    scene.add(group);
    floaters.push({
      group,
      speed: 0.12 + Math.random() * 0.18,
      spin: new THREE.Vector3((Math.random() - 0.5) * 0.15, 0.15 + Math.random() * 0.25, (Math.random() - 0.5) * 0.1),
      sway: 0.2 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    });
  }

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize);

  const clock = new THREE.Clock();
  let frame = 0;
  const tick = () => {
    const dt = Math.min(clock.getDelta(), 0.1);
    const t = clock.elapsedTime;
    for (const f of floaters) {
      const { group } = f;
      group.position.y += f.speed * dt;
      group.position.x += Math.sin(t * 0.4 + f.phase) * f.sway * dt;
      group.rotation.x += f.spin.x * dt;
      group.rotation.y += f.spin.y * dt;
      group.rotation.z += f.spin.z * dt;
      const h = viewHeight(group.position.z);
      // Recycle below the screen once the card leaves through the top.
      if (group.position.y > h / 2 + CARD_H) {
        group.position.y = -h / 2 - CARD_H;
        group.position.x = (Math.random() - 0.5) * h * camera.aspect;
      }
    }
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };

  // Pause when the tab is hidden: no work in the background.
  const onVisibility = () => {
    cancelAnimationFrame(frame);
    if (!document.hidden) {
      clock.getDelta();
      frame = requestAnimationFrame(tick);
    }
  };
  document.addEventListener("visibilitychange", onVisibility);
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
    geometry.dispose();
    back.dispose();
    backMaterial.dispose();
    for (const m of fronts) {
      m.map?.dispose();
      m.dispose();
    }
    renderer.dispose();
    renderer.domElement.remove();
  };
}

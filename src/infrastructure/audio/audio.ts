/**
 * Music and sound effects, routed through Web Audio gain nodes
 * (iOS Safari ignores HTMLMediaElement.volume, gain nodes work everywhere).
 * Every file is optional: a missing or broken file stays silent.
 */

const base = import.meta.env.BASE_URL;

/** Single source for audio file names: drop the files in public/audio/. */
export const MUSIC_FILES = {
  menu: `${base}audio/music-menu.mp3`,
  game: `${base}audio/music-game.mp3`,
} as const;

export const SFX_FILES = {
  click: `${base}audio/sfx-click.mp3`,
  select: `${base}audio/sfx-select.mp3`,
  accuse: `${base}audio/sfx-accuse.mp3`,
  wrong: `${base}audio/sfx-wrong.mp3`,
  win: `${base}audio/sfx-win.mp3`,
  lose: `${base}audio/sfx-lose.mp3`,
} as const;

export type MusicTrack = keyof typeof MUSIC_FILES;
export type SoundEffect = keyof typeof SFX_FILES;

export interface Volumes {
  master: number;
  music: number;
  sfx: number;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private buffers = new Map<SoundEffect, Promise<AudioBuffer | null>>();
  /** One element per track, created once inside the unlocking gesture (iOS needs it). */
  private musicEls = new Map<MusicTrack, HTMLAudioElement>();
  private track: MusicTrack | null = null;
  private volumes: Volumes = { master: 1, music: 1, sfx: 1 };

  /** Browsers only allow sound after a user gesture: call this on the first pointerdown. */
  unlock(): void {
    if (!this.ctx) {
      const Ctx = globalThis.AudioContext ?? (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain.connect(this.master);
      this.sfxGain.connect(this.master);
      this.master.connect(this.ctx.destination);
      this.applyVolumes();
      for (const track of Object.keys(MUSIC_FILES) as MusicTrack[]) {
        const el = new Audio(MUSIC_FILES[track]);
        el.loop = true;
        el.preload = "auto";
        this.ctx.createMediaElementSource(el).connect(this.musicGain);
        this.musicEls.set(track, el);
      }
      this.startMusic();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume().catch(() => {});
  }

  setVolumes(volumes: Volumes): void {
    this.volumes = volumes;
    this.applyVolumes();
  }

  playMusic(track: MusicTrack | null): void {
    if (track === this.track) return;
    this.track = track;
    this.startMusic();
  }

  playSfx(name: SoundEffect): void {
    const { ctx, sfxGain } = this;
    if (!ctx || !sfxGain || this.volumes.sfx === 0 || this.volumes.master === 0) return;
    void this.buffer(name).then((buffer) => {
      if (!buffer) return;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(sfxGain);
      source.start();
    });
  }

  private applyVolumes(): void {
    const { master, music, sfx } = this.volumes;
    if (this.master) this.master.gain.value = master;
    if (this.musicGain) this.musicGain.gain.value = music;
    if (this.sfxGain) this.sfxGain.gain.value = sfx;
  }

  private buffer(name: SoundEffect): Promise<AudioBuffer | null> {
    let pending = this.buffers.get(name);
    if (!pending) {
      const ctx = this.ctx!;
      pending = fetch(SFX_FILES[name])
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(r.statusText))))
        .then((data) => ctx.decodeAudioData(data))
        .catch(() => null);
      this.buffers.set(name, pending);
    }
    return pending;
  }

  private startMusic(): void {
    for (const [track, el] of this.musicEls) {
      if (track === this.track) {
        // Missing file or autoplay refusal: stay silent.
        void el.play().catch(() => {});
      } else {
        el.pause();
        el.currentTime = 0;
      }
    }
  }
}

export const audio = new AudioEngine();

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Expert puzzles are searched among many candidates: the generator tests need more room than the 5s default.
  test: { testTimeout: 30_000 },
});

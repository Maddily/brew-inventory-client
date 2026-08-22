import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Enables global test methods like expect, describe, and it
    globals: true,
    environment: "jsdom",
    setupFiles: "./test-setup.js",
  },
});

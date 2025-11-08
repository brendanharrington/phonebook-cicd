/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5001",
      "/health": "http://localhost:5001",
      "/info": "http://localhost:5001",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["../tests/setupTests.js"],
    include: ["../tests/unit/**/*.test.{js,mjs,jsx}"],
  },
});

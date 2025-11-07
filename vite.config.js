import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "client",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/health": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/info": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://j3wvqmh5-8800.uks1.devtunnels.ms",
        changeOrigin: true,
      },
    },
  },
});

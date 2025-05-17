import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/epson/direct-print": {
        target: "https://print-station-alpha.infra-2.96digital.de",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path,
      },
    },
  },
  plugins: [react()],
});

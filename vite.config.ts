import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: "dist",
    rollupOptions: {
      // external: ["@/components/ui/tabs", "@/components/ui/input"],
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
    watch: {
      exclude: ["node_modules/**", "dist/**"],
      include: ["src/**", "public/**"],
    },
  },
  plugins: [react()],
  publicDir: "public",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: true,
    port: 3000,
    watch: {
      interval: 1000,
      usePolling: true,
    },
  },
});

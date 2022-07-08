import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import writeBootstrapPlugin from "./util/setBootstrap";

export default defineConfig({
  build: {
    outDir: "./build",
    lib: {
      entry: "components/ImageWithPreview.tsx",
      formats: ["cjs"],
      fileName: () => "ImageWithPreview.js",
      name: "imageWithPreview",
    },

    //minify: false,
    rollupOptions: {
      external: ["react", "react-dom", "next", "next/script"],
    },
  },
  plugins: [react(), writeBootstrapPlugin()],
});

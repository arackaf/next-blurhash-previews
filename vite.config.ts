import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import writeBootstrapPlugin from "./util/setBootstrap";

export default defineConfig({
  build: {
    target: "es2022",
    outDir: "./build",
    lib: {
      entry: "components/imageWithPreview.tsx",
      formats: ["cjs"],
      fileName: () => "imageWithPreview.js",
      name: "imageWithPreview",
    },
    //minify: false,
    rollupOptions: {
      external: ["react", "react-dom", "next", "next/script"],
    },
  },
  plugins: [react(), writeBootstrapPlugin()],
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    target: "es2022",
    outDir: "./build",
    emptyOutDir: false,
    lib: {
      entry: "components/ImageWithPreview.tsx",
      formats: ["cjs"],
      fileName: () => "imageWithPreview.js",
      name: "imageWithPreview",
    },
    minify: false,
  },
  plugins: [react()],
});

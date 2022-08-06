import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    target: "es2022",
    outDir: "./build",
    emptyOutDir: false,
    lib: {
      entry: "components/workerScript.ts",
      formats: ["cjs"],
      fileName: () => "workerScript.js",
      name: "workerScript",
    },
    //minify: false,
  },
  plugins: [react()],
});

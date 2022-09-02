import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    target: "es2022",
    outDir: "./build",
    emptyOutDir: false,
    lib: {
      entry: "components/NextWrapper.tsx",
      formats: ["es"],
      fileName: () => "NextWrapper.js",
      name: "NextWrapper",
    },
    //minify: false,
  },
  plugins: [react()],
});

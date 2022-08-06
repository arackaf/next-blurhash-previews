import fs from "fs";

let BootstrapModule = fs.readFileSync(
  "./components/imagePreviewBootstrap.tsx",
  "utf8"
);

const wcScript = fs.readFileSync("./build/imageWithPreview.js", "utf8");
const workerScript = fs.readFileSync("./build/workerScript.js", "utf8");

BootstrapModule = BootstrapModule.replace(
  "/*WC*/",
  wcScript.replace(/[\r\n]\s*$/, "").replace(/`/g, "\\`")
)
  .replace(
    "/*WORKER*/",
    workerScript.replace(/[\r\n]\s*$/, "").replace(/`/g, "\\`")
  )
  .replace(/\${/g, "\\${");

fs.writeFileSync("./imagePreviewBootstrap.js", BootstrapModule);

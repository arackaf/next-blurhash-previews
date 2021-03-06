import fs from "fs";

export default function writeBootstrapScript() {
  return {
    name: "write-bootstrap-script",
    closeBundle() {
      let BootstrapModule = fs.readFileSync(
        "./components/imagePreviewBootstrap.tsx",
        "utf8"
      );
      const bootstrapScript = fs.readFileSync(
        "./build/imageWithPreview.js",
        "utf8"
      );
      BootstrapModule = BootstrapModule.replace(
        "/*HERE*/",
        bootstrapScript.replace(/[\r\n]\s*$/, "").replace(/`/g, "\\`")
      ).replace(/\${/g, "\\${");
      fs.writeFileSync("./imagePreviewBootstrap.js", BootstrapModule);
    },
  };
}

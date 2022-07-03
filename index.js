import fs from "fs";
import { reporter } from "vfile-reporter";
import { remark } from "remark";

import retextSentenceSpacing from "./plugin.js";

const buffer = fs.readFileSync("example.md");

async function run() {
  remark()
    .use(retextSentenceSpacing)
    .process(buffer)
    .then((file) => {
      fs.writeFileSync("output.md", file.toString());
    });
}

run();

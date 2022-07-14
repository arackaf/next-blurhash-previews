#!/usr/bin/env node

import fs from "fs";
import path, { dirname } from "path";
import { reporter } from "vfile-reporter";
import { remark } from "remark";

import retextSentenceSpacing from "./remark-plugin.js";

import { fileURLToPath } from "url";

const __dirname = process.cwd();
const buffer = fs.readFileSync(path.join(__dirname, "example.md"));

async function run() {
  remark()
    .use(retextSentenceSpacing)
    .process(buffer)
    .then(file => {
      fs.writeFileSync("./output.md", file.toString());
    });
}

run();

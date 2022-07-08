#!/usr/bin/env node

import fs from "fs";
import path, { dirname } from "path";
import { reporter } from "vfile-reporter";
import { remark } from "remark";

import retextSentenceSpacing from "../plugin.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);
const buffer = fs.readFileSync(path.join(__dirname, "example.md"));

async function run() {
  remark()
    .use(retextSentenceSpacing)
    .process(buffer)
    .then((file) => {
      fs.writeFileSync("output.md", file.toString());
    });
}

run();

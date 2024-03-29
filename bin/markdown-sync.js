#!/usr/bin/env node

import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { reporter } from "vfile-reporter";
import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkStringify from "remark-stringify";

import glob from "glob";
import colors from "colors";

import { blurhashPlugin } from "./remark-plugin.js";

const directoryProcess = process.cwd();

const allArgs = process.argv;
const inputGlob = allArgs.at(-1);

const files = glob.sync(inputGlob, { root: directoryProcess });

const publicPath = path.resolve(directoryProcess, "public");

if (fs.existsSync(publicPath)) {
  console.log(colors.blue(`Found path to public folder at: ${publicPath}\n\n`));
  run();
} else {
  console.log(
    colors.red(
      `\nERROR: Could not find Next's public directory to resolve images from. Looking for:\n\n${publicPath}\n\nEnsure you run this command from your Next application.\n`
    )
  );
}

async function runFile(file) {
  const buffer = fs.readFileSync(file);

  return new Promise(res => {
    remark()
      .use(blurhashPlugin(publicPath))
      .use(remarkFrontmatter)
      .use(remarkStringify, {
        fences: true,
      })
      .process(buffer)
      .then(outputFile => {
        fs.writeFileSync(file, outputFile.toString());
        res();
      });
  });
}

async function run() {
  for (const file of files) {
    console.log(colors.blue(`Processing file: ${file}\n`));
    await runFile(file);
    console.log(colors.blue(`${file} finished\n`));
  }
}

//run();

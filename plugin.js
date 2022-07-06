import fs from "fs";
import path, { dirname } from "path";

import sharp from "sharp";
import { encode, isBlurhashValid } from "blurhash";

import { visit } from "unist-util-visit";
import { visitParents } from "unist-util-visit-parents";

import HTMLParser from "node-html-parser";
import prettier from "prettier";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function retextSentenceSpacing() {
  return (tree, file, done) => {
    visitParents(tree, "image", async (node, ancestors) => {
      const { url } = node;

      //const resolvedPath = path.join(process.cwd(), url);
      const resolvedPath = path.join(__dirname, url);
      console.log(resolvedPath);

      const image = sharp(resolvedPath);
      const dimensions = await image.metadata();

      const { width, height } = dimensions;
      console.log(height, width);

      image
        .raw()
        .ensureAlpha()
        .toBuffer((err, buffer) => {
          console.log("got buffer");
          try {
            if (err) {
              console.log("Error getting buffer", err);
            } else {
              const blurhash = encode(new Uint8ClampedArray(buffer), width, height, 4, 4);
              if (isBlurhashValid(blurhash)) {
                console.log({ blurhash, w: width, h: height });
              } else {
                return console.log("FAIL");
              }
            }
          } catch (err) {
            return console.log("FAIL", err);
          }
        });

      const parent = ancestors[ancestors.length - 1];
      const index = parent.children.indexOf(node);

      const newNode = HTMLParser.parse(`<div>
        <img />
        <span>Hey there 2</span>
        </div>`);

      parent.children[index] = {
        type: "html",
        value: prettier.format(newNode.outerHTML, { parser: "html" }).trimEnd(),
      };

      setTimeout(() => {
        done();
      }, 3000);
      //parent.children[index] = replacement;

      // parent.children.push({
      //   type: "html",
      //   value: `<div><img /><span>Hey there</span></div>`,
      //   position: node.position,
      // });
    });
  };
}

import path from "path";
import { visitParents } from "unist-util-visit-parents";
import HTMLParser from "node-html-parser";
import prettier from "prettier";

import colors from "colors";

import { getBlurhash } from "./generateBlurhash.js";

export const blurhashPlugin = publicPath => () => {
  return (tree, file, done) => {
    let outstanding = 0;

    visitParents(tree, "image", async (node, ancestors) => {
      let { url: imagePath } = node;
      if (!/http/.test(imagePath)) {
        imagePath = path.resolve(publicPath, imagePath);
      }

      console.log(colors.blue(`Attempting ${imagePath}...`));

      try {
        outstanding++;

        const blurHash = await getBlurhash(imagePath);

        console.log(
          colors.green(`Finished processing ${imagePath}\n\t`, blurHash)
        );

        const parent = ancestors[ancestors.length - 1];
        const index = parent.children.indexOf(node);

        const newNode = HTMLParser.parse(`<div>
        <img />
        <span>Hey there 2</span>
        </div>`);

        parent.children[index] = {
          type: "html",
          value: prettier
            .format(newNode.outerHTML, { parser: "html" })
            .trimEnd(),
        };
      } catch (er) {
        console.log(colors.red(`Error processing ${imagePath}\n\t`, er));
      } finally {
        outstanding--;
        setTimeout(() => {
          if (outstanding === 0) {
            done();
          }
        }, 1);
      }
    });

    setTimeout(() => {
      if (outstanding === 0) {
        done();
      }
    }, 1);
  };
};

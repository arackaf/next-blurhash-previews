import { visitParents } from "unist-util-visit-parents";
import HTMLParser from "node-html-parser";
import prettier from "prettier";

import colors from "colors";

import { getBlurhash } from "./generateBlurhash.js";

export default function retextSentenceSpacing() {
  return (tree, file, done) => {
    let outstanding = 0;

    visitParents(tree, "image", async (node, ancestors) => {
      const { url } = node;

      console.log(colors.blue(`Attempting ${url}...`));

      try {
        outstanding++;
        const blurHash = await getBlurhash(url);

        console.log(colors.green(`Finished processing ${url}\n\t`, blurHash));

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
        console.log(colors.red(`Error processing ${url}\n\t`, er));
      } finally {
        outstanding--;
        setTimeout(() => {
          if (outstanding === 0) {
            done();
          }
        }, 1);
      }
    });
  };
}

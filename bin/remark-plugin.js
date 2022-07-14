import { visitParents } from "unist-util-visit-parents";

import HTMLParser from "node-html-parser";
import prettier from "prettier";

import { getBlurhash } from "./generateBlurhash.js";

export default function retextSentenceSpacing() {
  return (tree, file, done) => {
    visitParents(tree, "image", async (node, ancestors) => {
      const { url } = node;

      const blurHash = await getBlurhash(url);

      console.log("SUCCESS", blurHash);

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

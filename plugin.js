import { visit } from "unist-util-visit";
import { visitParents } from "unist-util-visit-parents";

import HTMLParser from "node-html-parser";
import prettier from "prettier";

export default function retextSentenceSpacing() {
  return (tree, file) => {
    visitParents(tree, "text", (node, ancestors) => {
      if (node.value === "Yo") {
        const replacement = {
          type: "text",
          value: "Hello\nWorld\nFoo\nBar\n",
        };

        const parent = ancestors[ancestors.length - 1];
        const index = parent.children.indexOf(node);

        const newNode = HTMLParser.parse(`<div>
        <img />
        <span>Hey there</span>
        </div>`);

        parent.children[index] = {
          type: "html",
          value: prettier.format(newNode.outerHTML, { parser: "html" }).trimEnd(),
        };
        //parent.children[index] = replacement;

        // parent.children.push({
        //   type: "html",
        //   value: `<div><img /><span>Hey there</span></div>`,
        //   position: node.position,
        // });
      }
    });
  };
}

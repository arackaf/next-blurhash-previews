import { visit } from "unist-util-visit";
import { visitParents } from "unist-util-visit-parents";

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
        parent.children[index] = {
          type: "html",
          value: `<div>
  <img />
  <span>Hey there</span>
</div>`,
          position: node.position,
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

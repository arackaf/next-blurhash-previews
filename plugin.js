import { visit } from "unist-util-visit";

export default function retextSentenceSpacing() {
  return (tree, file) => {
    visit(tree, "html", (node) => {
      console.log(node.type);
    });
  };
}

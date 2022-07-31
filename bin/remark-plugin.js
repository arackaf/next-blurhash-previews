import path from "path";
import { visitParents } from "unist-util-visit-parents";

import colors from "colors";

import { getBlurhash } from "./generateBlurhash.js";

export const blurhashPlugin = publicPath => () => {
  return (tree, file, done) => {
    let outstanding = 0;

    visitParents(tree, "image", async (node, ancestors) => {
      let { url: imagePath, alt } = node;

      const originalImg = imagePath;
      if (!/http/.test(imagePath)) {
        if (imagePath.startsWith("/")) {
          imagePath = imagePath.substr(1);
        }

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

        const newNode = `
<blurhash-image url="${originalImg}" preview='${JSON.stringify(blurHash)}'>
  <img alt="${alt || ""}" src="${originalImg}" slot="image" />
  <canvas width="${blurHash.w}" height="${blurHash.h}" slot="preview"></canvas>
</blurhash-image>`.trim();

        parent.children[index] = {
          type: "html",
          value: newNode,
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

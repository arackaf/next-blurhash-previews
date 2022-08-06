import fs from "fs";
import path from "path";

import sharp from "sharp";
import fetch from "node-fetch";
import { encode, isBlurhashValid } from "blurhash";

const __dirname = process.cwd();

export async function getSharpImage(imgPath) {
  if (/^http/.test(imgPath)) {
    const buffer = await fetch(imgPath)
      .then(fetchResponse => fetchResponse.arrayBuffer())
      .then(ab => Buffer.from(ab));

    return sharp(buffer);
  } else {
    const ext = path.extname(imgPath);
    const dir = path.dirname(imgPath);
    const basename = path.basename(imgPath, ext);

    const previewOption = path.join(dir, basename + "-preview" + ext);
    console.log("Trying preview", previewOption);

    if (fs.existsSync(previewOption)) {
      console.log("Preview found");
      return sharp(previewOption);
    }

    return sharp(imgPath);
  }
}

export async function getBlurhash(path) {
  const blurhashImage = await getSharpImage(path);
  const dimensions = await blurhashImage.metadata();

  const { width, height } = dimensions;

  return new Promise((res, rej) => {
    blurhashImage
      .raw()
      .ensureAlpha()
      .toBuffer((err, buffer) => {
        try {
          if (err) {
            console.log("Error getting buffer", err);
          } else {
            const blurhash = encode(
              new Uint8ClampedArray(buffer),
              width,
              height,
              4,
              4
            );
            if (isBlurhashValid(blurhash)) {
              return res({ blurhash, w: width, h: height });
            } else {
              console.log("FAIL");
              return rej("FAIL");
            }
          }
        } catch (err) {
          console.log("FAIL", err);
          return rej("FAIL", err);
        }
      });
  });
}

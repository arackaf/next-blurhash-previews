import fs from "fs";
import path from "path";
import colors from "colors";

import sharp from "sharp";
import fetch from "node-fetch";
import { encode, isBlurhashValid } from "blurhash";

const __dirname = process.cwd();

async function getSharpImage(imgPath) {
  if (/^http/.test(imgPath)) {
    const buffer = await fetch(imgPath)
      .then(fetchResponse => fetchResponse.arrayBuffer())
      .then(ab => Buffer.from(ab));

    return sharp(buffer);
  } else {
    const ext = path.extname(imgPath);
    const dir = path.dirname(imgPath);
    const basename = path.basename(imgPath, ext);

    const realImage = sharp(imgPath);

    const previewOption = path.join(dir, basename + "-preview" + ext);
    console.log(colors.blue("Trying preview", previewOption));

    if (fs.existsSync(previewOption)) {
      console.log(colors.green("Preview found"));

      return [realImage, sharp(previewOption)];
    }

    return [realImage];
  }
}

export async function getBlurhash(path) {
  const [blurhashImage, previewImage] = await getSharpImage(path);
  const dimensions = await blurhashImage.metadata();

  const { width: displayWidth, height: displayHeight } = dimensions;
  let { width, height } = dimensions;

  if (previewImage) {
    const dimensions = await previewImage.metadata();

    ({ width, height } = dimensions);
  }

  return new Promise((res, rej) => {
    (previewImage ?? blurhashImage)
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
              return res({
                blurhash,
                w: width,
                h: height,
                dw: displayWidth,
                dh: displayHeight,
              });
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

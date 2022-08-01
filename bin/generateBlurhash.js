import sharp from "sharp";
import fetch from "node-fetch";
import { encode, isBlurhashValid } from "blurhash";

import path from "path";
const __dirname = process.cwd();

export async function getSharpImage(imgPath) {
  if (/^http/.test(imgPath)) {
    const buffer = await fetch(imgPath)
      .then(fetchResponse => fetchResponse.arrayBuffer())
      .then(ab => Buffer.from(ab));

    return sharp(buffer);
  } else {
    return sharp(imgPath);
  }
}

export async function getBlurhash(path) {
  let blurhashImage = await getSharpImage(path);
  const dimensions = await blurhashImage.metadata();

  const { width, height } = dimensions;
  let blurhashW = width;
  let blurhashH = height;

  if (width > 200) {
    const newBuffer = await blurhashImage.resize(200).toBuffer();
    blurhashImage = sharp(newBuffer);

    let newMetadata = await blurhashImage.metadata();
    blurhashW = newMetadata.width;
    blurhashH = newMetadata.height;
    console.log("Adjustied", blurhashW, blurhashH);
  } else {
    console.log("Not adjusting", path, width);
  }

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
              blurhashW,
              blurhashH,
              4,
              4
            );
            if (isBlurhashValid(blurhash)) {
              return res({
                blurhash,
                dw: width,
                dh: height,
                w: blurhashW,
                h: blurhashH,
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

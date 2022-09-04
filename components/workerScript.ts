import { decode } from "blurhash/dist/esm";

addEventListener("message", evt => {
  const { canvas, width, height, blurhash } = evt.data;

  const start = +new Date();
  const pixels = decode(blurhash, width, height);
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);
  const end = +new Date();
});

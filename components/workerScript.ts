import { decode } from "blurhash/dist/esm";

addEventListener("message", evt => {
  console.log(evt);

  const { canvas, width, height, blurhash } = evt.data;

  const p = new Promise(res => setTimeout(res, 5000));
  Promise.resolve(p).then(() => {
    console.log("Encoding", blurhash);
    const start = +new Date();
    const pixels = decode(blurhash, width, height);
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
    const end = +new Date();
    console.log("Done Encoding", blurhash, end - start);
  });
});

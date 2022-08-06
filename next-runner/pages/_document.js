import Document, { Html, Head, Main, NextScript } from "next/document";
import { imagePreviewBootstrap, src } from "next-blurhash-previews";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          {imagePreviewBootstrap}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

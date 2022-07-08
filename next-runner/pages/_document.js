import Document, { Html, Head, Main, NextScript } from "next/document";
import { imagePreviewBootstrap, src } from "next-blurhash-previews";

import Script from "next/script";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          {imagePreviewBootstrap}
        </body>
      </Html>
    );
  }
}

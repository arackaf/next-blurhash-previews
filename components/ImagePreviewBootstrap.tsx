import { createElement } from "react";
import Script from "next/script";

export const imagePreviewBootstrap = createElement(Script, {
  dangerouslySetInnerHTML: { __html: `(() => { /*HERE*/ })();` },
  strategy: "beforeInteractive",
});

import { createElement } from "react";

export const imagePreviewBootstrap = createElement("script", {
  dangerouslySetInnerHTML: { __html: `(() => { /*HERE*/ })();` },
});

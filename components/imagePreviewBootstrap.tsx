import { createElement, Fragment } from "react";

export const imagePreviewBootstrap = createElement(
  Fragment,
  {},
  createElement("script", {
    id: "next-blurhash-worker-script",
    type: "javascript/worker",
    dangerouslySetInnerHTML: { __html: `(() => { /*WORKER*/ })();` },
  }),
  createElement("script", {
    dangerouslySetInnerHTML: { __html: `(() => { /*WC*/ })();` },
  })
);

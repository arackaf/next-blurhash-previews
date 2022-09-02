import React, {
  useEffect,
  useRef,
  createElement,
  cloneElement,
  Children,
} from "react";

export const NextWrapper = props => {
  const wcRef = useRef(null);

  const { blurhash, width, height } = props;

  const json = JSON.stringify({ w: width, h: height, blurhash });
  const wcProps = { preview: json };
  if (props.sync) {
    wcProps.sync = true;
  }

  return createElement(
    "blurhash-image",
    {
      ref: wcRef,
      ...wcProps,
    },
    cloneElement(Children.only(props.children), { slot: "image" }),
    createElement("canvas", { width, height, slot: "preview" })
  );
};

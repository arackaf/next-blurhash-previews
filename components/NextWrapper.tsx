import React, { useEffect, useRef } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["blurhash-image"]: any;
    }
  }
}

export const ImageWithPreview = (props: any) => {
  const wcRef = useRef<any>(null);

  const { preview } = props;
  const { w, h } = JSON.parse(preview);

  useEffect(() => {
    wcRef.current.activate();
  }, []);

  return (
    <blurhash-image ref={wcRef} {...props}>
      <img style={{ display: "none" }} />
      <canvas width={w} height={h}></canvas>
    </blurhash-image>
  );
};

import { useEffect, useRef } from "react";

export const ImageWithPreview = (props: any) => {
  const wcRef = useRef(null);

  const { preview } = props;
  const { w, h } = JSON.parse(preview);

  useEffect(() => {
    wcRef.current.activate();
  }, []);

  return (
    <uikit-image ref={wcRef} {...props}>
      <img style={{ display: "none" }} />
      <canvas width={w} height={h}></canvas>
    </uikit-image>
  );
};

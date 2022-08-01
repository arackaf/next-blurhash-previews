import { decode } from "../node_modules/blurhash/dist/esm/index";

type blurhash = {
  w: number;
  h: number;
  dw: number;
  dh: number;
  blurhash: string;
};

class ImageWithPreview extends HTMLElement {
  sd: ShadowRoot;
  mo?: MutationObserver;

  static observedAttributes = ["preview"];

  get #imgEl(): any {
    return this.querySelector("img");
  }
  get #canvasEl(): any {
    return this.querySelector("canvas");
  }

  constructor() {
    super();

    this.sd = this.attachShadow({ mode: "open" });
    this.sd.innerHTML = `<slot name="preview"></slot>`;
  }

  #checkReady = () => {
    if (this.#imgEl && this.#canvasEl) {
      this.mo?.disconnect();

      if (this.#imgEl.complete) {
        this.#imgLoad();
      } else {
        this.#updatePreview();
        this.#imgEl.addEventListener("load", this.#imgLoad);
      }

      return true;
    }
  };

  connectedCallback() {
    if (!this.#checkReady()) {
      this.mo = new MutationObserver(this.#checkReady);
      this.mo.observe(this, {
        subtree: true,
        childList: true,
        attributes: false,
      });
    }
  }

  #imgLoad = () => {
    //this.sd.innerHTML = `<slot name="image"></slot>`;
  };

  attributeChangedCallback(name) {
    if (this.#canvasEl && name === "preview") {
      const time = this.#updatePreview();
      console.log(this.getAttribute("preview"), this.getAttribute("url"), time);
    }
  }

  #updatePreview() {
    const previewObj = JSON.parse(this.getAttribute("preview")!);

    const start = +new Date();
    updateBlurHashPreview(this.#canvasEl, previewObj);
    const end = +new Date();
    return end - start;
  }
}

if (!customElements.get("blurhash-image")) {
  customElements.define("blurhash-image", ImageWithPreview);
}

function updateBlurHashPreview(canvasEl: HTMLCanvasElement, preview: blurhash) {
  const { w, h, dw, dh } = preview;

  canvasEl.width = w;
  canvasEl.height = h;

  const pixels = decode(preview.blurhash, w, h);
  const ctx = canvasEl.getContext("2d")!;
  const imageData = ctx.createImageData(w, h);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  console.log("base64", canvasEl.toDataURL());
}

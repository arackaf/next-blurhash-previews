import { decode } from "blurhash/dist/esm";

type blurhash = { w: number; h: number; blurhash: string };

class ImageWithPreview extends HTMLElement {
  sd: ShadowRoot;
  mo?: MutationObserver;

  static observedAttributes = ["preview"];

  #connected = false;
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
    this.#connected = true;
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
    setTimeout(() => {
      this.sd.innerHTML = `<slot name="image"></slot>`;
    }, 19000);
  };

  attributeChangedCallback(name) {
    if (this.#canvasEl && name === "preview") {
      this.#updatePreview();
    }
  }

  #updatePreview() {
    if (!this.#connected || !this.getAttribute("preview")) {
      return;
    }

    const previewObj = JSON.parse(this.getAttribute("preview")!);
    updateBlurHashPreview(this.#canvasEl, previewObj);
  }
}

if (!customElements.get("blurhash-image")) {
  customElements.define("blurhash-image", ImageWithPreview);
}

function updateBlurHashPreview(canvasEl: HTMLCanvasElement, preview: blurhash) {
  const { w: width, h: height, blurhash } = preview;
  canvasEl.width = width;
  canvasEl.height = height;

  const worker = new Worker("/canvas-worker.js");

  const offscreen = (canvasEl as any).transferControlToOffscreen();
  worker.postMessage({ canvas: offscreen, width, height, blurhash }, [
    offscreen,
  ]);

  return;
  const pixels = decode(blurhash, width, height);
  const ctx = canvasEl.getContext("2d")!;
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);
}

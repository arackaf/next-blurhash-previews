import { decode } from "blurhash/dist/esm";
type blurhash = { w: number; h: number; blurhash: string };

declare global {
  interface HTMLCanvasElement {
    transferControlToOffscreen(): this & Transferable;
  }
}

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

      console.log("checkready", this.#imgEl.complete);

      setInterval(() => {
        console.log("checkready interval", this.#imgEl.complete);
      }, 100);
      if (this.#imgEl.complete) {
        this.#imgLoad();
      } else {
        this.#updatePreview();
        this.#imgEl.addEventListener("load", this.#imgLoad);
      }

      return 1;
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
    console.log("imgLoad - should work", this.#imgEl.complete);
    this.sd.innerHTML = `<slot name="image"></slot>`;
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
    updateBlurHashPreview(
      this.hasAttribute("sync"),
      this.#canvasEl,
      previewObj
    );
  }
}

if (!customElements.get("blurhash-image")) {
  customElements.define("blurhash-image", ImageWithPreview);
}

const workerBlob = new Blob(
  [document.querySelector("#next-blurhash-worker-script")!.textContent!],
  { type: "text/javascript" }
);
const worker = new Worker(window.URL.createObjectURL(workerBlob));

function updateBlurHashPreview(
  sync: boolean,
  canvasEl: HTMLCanvasElement,
  preview: blurhash
) {
  const { w: width, h: height, blurhash } = preview;
  canvasEl.width = width;
  canvasEl.height = height;

  if (sync) {
    const start = +new Date();

    const pixels = decode(blurhash, width, height);
    const ctx = canvasEl.getContext("2d")!;
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);

    const end = +new Date();
    console.log("Done Encoding Sync", blurhash, end - start);
  } else if (canvasEl.transferControlToOffscreen) {
    const offscreen = canvasEl.transferControlToOffscreen();
    worker.postMessage({ canvas: offscreen, width, height, blurhash }, [
      offscreen,
    ]);
  }
}

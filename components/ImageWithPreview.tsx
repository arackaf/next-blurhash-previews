import { decode } from "../node_modules/blurhash/dist/esm/index";

type blurhash = { w: number; h: number; blurhash: string };

class ImageWithPreview extends HTMLElement {
  sd: ShadowRoot;
  mo?: MutationObserver;

  static observedAttributes = ["preview", "url"];

  get imgEl(): any {
    return this.querySelector("img");
  }
  get canvasEl(): any {
    return this.querySelector("canvas");
  }

  constructor() {
    super();

    this.sd = this.attachShadow({ mode: "open" });
    this.sd.innerHTML = `<slot name="preview"></slot>`;
  }

  checkReady = () => {
    if (this.imgEl && this.canvasEl) {
      this.mo?.disconnect();
      this.ready();
      return true;
    }
  };

  connectedCallback() {
    if (!this.checkReady()) {
      this.mo = new MutationObserver(this.checkReady);
      this.mo.observe(this, {
        subtree: true,
        childList: true,
        attributes: false,
      });
    }
  }

  ready() {
    if (this.imgEl.complete) {
      this.imgLoad();
    } else {
      this.updatePreview();
      this.imgEl.addEventListener("load", this.imgLoad);
    }
  }

  imgLoad = () => {
    this.sd.innerHTML = `<slot name="image"></slot>`;
  };

  attributeChangedCallback(name) {
    if (this.canvasEl && name === "preview") {
      this.updatePreview();
    }
  }

  updatePreview() {
    const previewObj = JSON.parse(this.getAttribute("preview")!);
    updateBlurHashPreview(this.canvasEl, previewObj);
  }
}

if (!customElements.get("blurhash-image")) {
  customElements.define("blurhash-image", ImageWithPreview);
}

function updateBlurHashPreview(canvasEl: HTMLCanvasElement, preview: blurhash) {
  const { w: width, h: height } = preview;

  canvasEl.width = width;
  canvasEl.height = height;

  const pixels = decode(preview.blurhash, width, height);
  const ctx = canvasEl.getContext("2d")!;
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);
}

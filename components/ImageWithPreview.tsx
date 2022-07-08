import { decode } from "../node_modules/blurhash/dist/esm/index";

type blurhash = { w: number; h: number; blurhash: string };

class ImageWithPreview extends HTMLElement {
  isReady: boolean = false;
  loaded: boolean = false;
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
      this.ready();
      this.mo?.disconnect();
    }
    return this.isReady;
  };

  connectedCallback() {
    if (!this.checkReady()) {
      this.mo = new MutationObserver(this.checkReady);
      this.mo.observe(this, { subtree: true, childList: true, attributes: false });
    }
  }

  ready() {
    this.isReady = true;
    this.updatePreview();
    if (this.imgEl.complete) {
      this.onImageLoad();
    }
    this.imgEl.addEventListener("load", this.onImageLoad);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.isReady) {
      return;
    }

    if (name === "preview") {
      this.updatePreview();
    } else if (name === "url") {
      this.loaded = false;
    }

    this.render();
  }

  updatePreview() {
    const previewObj = JSON.parse(this.getAttribute("preview")!);
    updateBlurHashPreview(this.canvasEl, previewObj);
  }

  onImageLoad = () => {
    if (this.getAttribute("url") !== this.imgEl.src) {
      setTimeout(() => {
        this.loaded = true;
        this.render();
      }, 1500);
    }
  };

  render() {
    this.sd.innerHTML = `<slot name="${this.loaded ? "image" : "preview"}"></slot>`;
  }
}

if (!customElements.get("uikit-image")) {
  customElements.define("uikit-image", ImageWithPreview);
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

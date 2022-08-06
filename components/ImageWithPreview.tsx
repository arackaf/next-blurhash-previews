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
    updateBlurHashPreview(this.#canvasEl, previewObj);
  }
}

if (!customElements.get("blurhash-image")) {
  customElements.define("blurhash-image", ImageWithPreview);
}

var worker;

function updateBlurHashPreview(canvasEl: HTMLCanvasElement, preview: blurhash) {
  const { w: width, h: height, blurhash } = preview;
  canvasEl.width = width;
  canvasEl.height = height;

  if (true) {
    if (!worker) {
      const workerBlob = new Blob(
        [document.querySelector("#next-blurhash-worker-script")!.textContent!],
        { type: "text/javascript" }
      );
      worker = new Worker(window.URL.createObjectURL(workerBlob));
    }
    const offscreen = (canvasEl as any).transferControlToOffscreen();
    worker.postMessage({ canvas: offscreen, width, height, blurhash }, [
      offscreen,
    ]);
  }
}

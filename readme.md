[![npm version](https://img.shields.io/npm/v/next-blurhash-previews.svg?style=flat)](https://www.npmjs.com/package/next-blurhash-previews)

# next-blurhash-previews

This library ships a web component that shows a blurhash preview for an image while it loads. It does not wait until SSR hydration is complete before showing the loaded image, when ready. This means if your browser has the image cached, it will show immediately. 

It works in both markdown files and React pages; it supports synchronous Blurhash encoding, and OffscreanCanvas to encode on a background thread. Lastly, it's fully SSR friendly, since it exposes a component to synchronously register the web component. It does this by placing an inline, synchronous script on your page with the web component's registration (the total script is only 5K minified, _before_ gzip).

This differs from Next's Image component, which can receive a `placeholder="blur"` attribute, in a few ways: this will work in Markdown (without requiring MDX), and it does not wait until hydration is complete to show the underlying image. Again, if the browser has it cached, and ready to go, the image will show immediately, before hydration; more on this below. 

## Installation

```
npm i next-blurhash-previews
```

## Registering the web component

To use a web component, you have to register it. Just add this import

```js
import { imagePreviewBootstrap } from "next-blurhash-previews";
```

and then render it anywhere *before* your content. For example, in your _document.js file

```jsx
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="scheme3">
        <Head />
        <body className="line-numbers">
          {imagePreviewBootstrap}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

This will add a blocking script to your page. This is usually bad for perf, but this script is just 5kb minified, total (before gzip).

## Generating markdown image previews

This library will parse your markdown files, detect any images, and for each, create a blurhash preview, and replace the original markdown image with a web component that renders a blurhash preview while the image loads. It will include all the light dom content needed to prevent hydration errors.

To do this, go to your terminal and run

```
npx blurhash-markdown "glob/to/markdown/files/**/*.md"
```

make sure you wrap the path in quotes.

If you have an image like this

```markdown
![alt text](/path/img1.png)
```

it should be transformed into something like this

```html
<blurhash-image url="/path/img1.png" preview='{"blurhash":"U8S6SsD*%gt6IVM|xuRj~qWBM{RjxtoIWBWC","w":300,"h":162,"dw":364,"dh":196}'>
  <img alt="alt text" width="364" height="196" src="/path/img1.png" slot="image" />
  <canvas width="300" height="162" style="width: 364px; height: auto;" slot="preview"></canvas>
</blurhash-image>
```

If you're wondering why the sizes on the canvas are so weird, it's because ...

### Using a smaller image for markdown previews

These blurhash previews need to be decoded on the client. By default, this library will use OffscreenCanvas so the decoding happens on a background thread, but regardless, the faster the better. If you'd like to use a smaller image for the preview (especially advisable if you're using larger images to compensate for dpi), have the name be identical, but with a -preview added on the end, and that'll be the image used for the preview. The proper size (of the preview) will be on the canvas, by necessity, with css sizing the canvas up to where it needs to be to match the actually displayed image (the one without the -preview). This works extremely well for the blurhash previews. In my testing, you'd have to size the image down absurdly small before the sizing makes any kind of difference on the blurry preview.

## Using in React pages

Using this web component in a React page works, but it's not yet completely polished.

Parsing React components in order to transform images into the `blurhash-image` web component would be significantly more difficult, and manually rendering the web component content from above would not be feasible. Instead, there's a React component you can render, which will handle all of this for you. Import it from here

```js
import { NextWrapper } from "next-blurhash-previews";
```

and then render it like this

```js
<NextWrapper blurhash="L9Fhx14T144o5Q01~p-5lVD%x[tl" width="125" height="125">
  <Image src={AvatarImg} height={125} width={125} loading="eager" />
</NextWrapper>
```

This will emit the same web component content you saw above.

You need to pass the blurhash preview yourself. In the future there'll likely be another npx command you can run to get the preview, but for now you can just use the [blurhash](https://blurha.sh/) page. There's not (yet) any way to build a preview on a smaller image, and have css size it up, like with the markdown tools above. For now, just use the same image. 

As children, pass the actual image you want rendered. Do **not** use Next's image component. This React wrapper adds a slot attribute to the child you pass; unfortunately, Next passes that slot attribute down to the underlying image tag, instead of the root wrapper, which breaks this. That said, Next's experimental image 

```js
import Image from "next/future/image";
```

works fine, which is what's used above. Make **sure** you specify `loading="eager"`, otherwise the image will be hidden in the shadow dom, and will never actually load.

## How does this differ from Next's own Image component, which supports `placeholder="blur"` 

As of this writing, Next's Image component renders a `span` container element, with content inside that renders the blurry preview. When hydration happens, code runs to detect whether the image is loaded, set a loaded handler if not, and, when the image becomes available, removes the preview. That means the blurry preview will **always** be visible for at least an instant, until hydration runs, even if the browser has the image loaded.

Next's experimental image 

```js
import Image from "next/future/image";
```

does better. This renders a single img tag, with an inline style setting the background image to a preview. This means that, when the img loads, it'll just show, and cover up the background image. When hydration happens, code runs to remove this background image preview once the image is loaded. This means that, if the image is cached, the preview background will exist on the image for an instant, while the actual image is showing in your browser. This is absolutely fine, but it's also, presumably, why the experimental image does *not* blur the preview, even with th props of `placeholder="blur"` set; instead the background preview, as of this writing, from my testing, is just a solid color. The likely reason is that, if it added a style of `filter:blur`, it would blur your *actual* image, when it loaded, until hydration happened (which removes all of the background styles).

There's also the question of how Next's background image preview would interact with a partially transparent image. If the image were to load, and display before hydration, while the background preview were still showing, and the shown image were partially transparent, the background preview would likely "bleed through" onto your real image, until hydration.

## How does this web component work?

The web component that's rendered creates a shadow dom, which switches between the preview, and the image by changing a slot attribute within the shadow dom content. This avoids hydration errors since React, by design, does not inspect a custom element's shadow dom content when determining hydration errors. See [this thread](https://github.com/facebook/react/issues/23381#issuecomment-1176540026) for more context.

## Blurhash uses Canvas

The web component will render a canvas with the blurhash preview while the image is loading. Make sure you add any styles to your page necessary. If you're applying responsive sizing to the underlying image, make sure you do so for the canvas element, too. If you're adding a border radius to the underlying image, make sure you do so for the canvas element. And so on.

## Blurhash decoding 

By default the blurhash decoding will happen on a background thread, using OffscrenCanvas. This is to prevent your main thread from blocking while all your images decode. This is usually a fast process, but if there's a lot of large images, it can easily become a problem. If your browser (like Safari) does not support OffscrenCanvas, it'll just render a canvas element. Even if it does, the canvas element might show for an instant before the decoding is done, so set some sort of plain background gradient in css.

If you'd lke to do synchronous decoding (for example, for an above-the-fold image) just add `sync={true}` to the React wrapper, or add the `sync` attribute to the web component that's generated in your markdown file (re-running the generation npx script will *not* overwrite this)
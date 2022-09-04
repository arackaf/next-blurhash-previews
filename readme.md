# next-blurhash-previews

This library exposes a web component that shows a blurhash preview for an image, until the underlying image loads. It works in both markdown files and regular React pages, it supports synchronous Blurhash encoding, and also OffscreanCanvas to encode on a background thread. Lastly, it's fully SSR friendly, since it exposes a component to place a synchronous, inline script on your page to register the web component (the total script is only 5K minified, _before_ gzip).

This differs from Next's Image component, which can receive a `placeholder="blur"` attribute in a few ways: it will work in Markdown (without requiring MDX setup), and it does not wait until hydration is complete to show the underlying image, if the browser has it cached, and ready to go. More on this below. For now, let's get to installation and usage.

## Installation

```
npm i next-blurhash-previews
```

## Registering the web component

To use a web component, you have to register it. Just add this import

```js
import { imagePreviewBootstrap } from "next-blurhash-previews";
```

and then render it anywhere before your content, for example in your \_document.js file.

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

This will add a blocking script to your page. This is absolutely bad for perf in the general case, but this script is just 5kb minified, total (before gzip).

## Generating markdown image previews

This library will parse your markdown files, detect any images, and for each, create a blurhash preview, and replace the original markdown image with a web component rendering the preview, and also the image. It will include all the light dom content needed to prevent hydration errors.

To do this, go to your terminal and run

```
npx blurhash-markdown "glob/to/markdown/files/**/*.md"
```

make sure you wrap the path in quotes.

If you have an image of this

```markdown
![alt text](/path/img1.png)
```

if should be transformed into something like this

```html
<blurhash-image url="/path/img1.png" preview='{"blurhash":"U8S6SsD*%gt6IVM|xuRj~qWBM{RjxtoIWBWC","w":300,"h":162,"dw":364,"dh":196}'>
  <img alt="alt text" width="364" height="196" src="/path/img1.png" slot="image" />
  <canvas width="300" height="162" style="width: 364px; height: auto;" slot="preview"></canvas>
</blurhash-image>
```

If you're wondering why the sizes on the canvas are so weird, it's because ...

### Using a smaller image for markdown previews

These blurhash previews need to be decoded on the client. By default, this library will use OffscreenCanvas so the decoding happens on a background thread, but regardless, the faster the better. If you'd like to use a smaller image for the preview (especially advisable if you're using larger images to compensate for dpi), have the name be identical, but with a -preview added on, and that'll be the image used for the preview, with css sizing the canvas up to where it needs to be. This works extremely well for the blurhash previews. In my testing, you have'd have to size the image down absurdly small before the sizing makes any kind of difference.

## Using in React pages

Using this web component in a React page works, but it's not yet completely polished.

Parsing React in order to transform images into the `blurhash-image` web component would be significantly more difficult, and manually rendering the content from above would not be feasible. Instead, there's a React component you can render, which will handle all of this for you. Import it from here

```js
import { NextWrapper } from "next-blurhash-previews";
```

and then render it like this

```js
<NextWrapper blurhash="L9Fhx14T144o5Q01~p-5lVD%x[tl" width="125" height="125">
  <Image src={AvatarImg} height={125} width={125} loading="eager" />
</NextWrapper>
```

You need to pass the blurhash preview yourself. In the future there'll likely be another npx command you can run to get the preview, but for now you can just use the [blurhash](https://blurha.sh/) page. There's not (yet) any way to build a preview on a smaller image, and have css size it up, like with markdown above. For now, use an image with the sizes you specify. 

As children, pass the actual image you want rendered. Do *not* use Next's image component. The React wrapper adds a slot attribute, but unfortunately Next passes that slot attribute on to the underlying image tag, instead of the root wrapper, which breaks how this works. That said, Next's experimental image 

```js
import Image from "next/future/image";
```

works fine, which is what's used above. Make **sure** you specify `loading="eager"` otherwise the image will be hidden in the shadow dom, and will never actually load.
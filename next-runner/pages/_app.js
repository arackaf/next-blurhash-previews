import { imagePreviewBootstrap } from "next-static-image-previews";
import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {imagePreviewBootstrap}
        <meta name="qqppppqpqpqp"></meta>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

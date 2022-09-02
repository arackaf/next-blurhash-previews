import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import FutureImage from "next/future/image";
import { NextWrapper } from "next-blurhash-previews";

import { useState } from "react";

export default function Home() {
  const [val, setVal] = useState(0);

  return (
    <div className={styles.container}>
      Root
      <NextWrapper
        sync={true}
        blurhash="L9Fhx14T144o5Q01~p-5lVD%x[tl"
        width="100"
        height="100"
      >
        <FutureImage
          src="/avatar-hq.jpg"
          width="100"
          height="100"
          loading="eager"
        />
      </NextWrapper>
      <br />
      <br />
      <button onClick={() => setVal(x => x + 1)}>Refresh</button>
      {val}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <br />

        <hr />

        <br />
        <br />

        {null && (
          <div>
            <blurhash-image
              key={val}
              url="/dynamo-introduction/img1.png"
              preview='{ "w": 364, "h": 196, "blurhash": "L8S6SsD*%gt7IVM|tRRj~qWBM{NG" }'
            >
              <img slot="image" src="/dynamo-introduction/img1.png" />
              <canvas slot="preview" width="364" height="196"></canvas>
            </blurhash-image>
            <blurhash-image
              key={val + 2}
              url="/dynamo-introduction/img5a.png"
              preview='{ "w": 500, "h": 139, "blurhash": "LnPGmj_zIA:KS}j[s:ay-VWVRjay" }'
            >
              <img slot="image" src="/dynamo-introduction/img5a.png" />
              <canvas slot="preview" width="500" height="139"></canvas>
            </blurhash-image>
            <blurhash-image
              key={val + 5}
              url="https://d193qjyckdxivp.cloudfront.net/medium-covers/573d1b97120426ef0078aa92/fcb820e4-36e3-4741-a3de-6994c46a66cc.jpg"
              preview='{ "w": 106, "h": 160, "blurhash": "U38|kkTJ01}A;{Or57;N01NG+?IW01rX^NAW" }'
            >
              <img
                slot="image"
                src="https://d193qjyckdxivp.cloudfront.net/medium-covers/573d1b97120426ef0078aa92/fcb820e4-36e3-4741-a3de-6994c46a66cc.jpg"
              />
              <canvas slot="preview" width="106" height="160"></canvas>
            </blurhash-image>
          </div>
        )}
      </div>
    </div>
  );
}

import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { useState } from "react";

export default function Home() {
  const [val, setVal] = useState(0);

  return (
    <div className={styles.container}>
      Root
      <br />
      <button onClick={() => setVal(x => x + 1)}>Refresh</button>
      {val}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <blurhash-image
          url="/dynamo-introduction/img15-sized.png"
          preview='{"blurhash":"U}Gb#PxuWBofWBofWBV@RjofWBV@~qt7WBof","w":10,"h":3}'
        >
          <img
            alt="Dynamo gsi query"
            width="10"
            height="3"
            src="/dynamo-introduction/img15-sized.png"
            slot="image"
          />
          <canvas width="10" height="3" slot="preview"></canvas>
        </blurhash-image>
        <br />

        <xx-blurhash-image
          url="/dynamo-introduction/img15-sized.png"
          preview='{"blurhash":"U+Jko;t7RjWBD%ofRjax~qa|j[fQaefkofof","w":1000,"h":343}'
        >
          <img
            alt="Dynamo gsi query"
            width="1000"
            height="343"
            src="/dynamo-introduction/img15-sized.png"
            slot="image"
          />
          <canvas width="1000" height="343" slot="preview"></canvas>
        </xx-blurhash-image>

        <hr />

        <br />
        <br />
        <xx-blurhash-image
          key={val}
          url="/dynamo-introduction/img1.png"
          preview='{ "w": 364, "h": 196, "blurhash": "L8S6SsD*%gt7IVM|tRRj~qWBM{NG" }'
        >
          <img slot="image" src="/dynamo-introduction/img1.png" />
          <canvas slot="preview" width="364" height="196"></canvas>
        </xx-blurhash-image>
        <xx-blurhash-image
          key={val + 2}
          url="/dynamo-introduction/img5a.png"
          preview='{ "w": 500, "h": 139, "blurhash": "LnPGmj_zIA:KS}j[s:ay-VWVRjay" }'
        >
          <img slot="image" src="/dynamo-introduction/img5a.png" />
          <canvas slot="preview" width="500" height="139"></canvas>
        </xx-blurhash-image>
        <xx-blurhash-image
          key={val + 5}
          url="https://d193qjyckdxivp.cloudfront.net/medium-covers/573d1b97120426ef0078aa92/fcb820e4-36e3-4741-a3de-6994c46a66cc.jpg"
          preview='{ "w": 106, "h": 160, "blurhash": "U38|kkTJ01}A;{Or57;N01NG+?IW01rX^NAW" }'
        >
          <img
            slot="image"
            src="https://d193qjyckdxivp.cloudfront.net/medium-covers/573d1b97120426ef0078aa92/fcb820e4-36e3-4741-a3de-6994c46a66cc.jpg"
          />
          <canvas slot="preview" width="106" height="160"></canvas>
        </xx-blurhash-image>
      </div>
    </div>
  );
}

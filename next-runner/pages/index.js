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
      <button onClick={() => setVal((x) => x + 1)}>Refresh</button>
      {val}
      <uikit-image key={val} url="/dynamo-introduction/img1.png" preview='{ "w": 364, "h": 196, "blurhash": "L8S6SsD*%gt7IVM|tRRj~qWBM{NG" }'>
        <img slot="image" src="/dynamo-introduction/img1.png" />
        <canvas slot="preview" width="364" height="196"></canvas>
      </uikit-image>
      <uikit-image key={val + 9} url="/dynamo-introduction/img5a.png" preview='{ "w": 2244, "h": 622, "blurhash": "LnPGmj_zIA:KS}j[s:ay-VWVRjay" }'>
        <img slot="image" src="/dynamo-introduction/img5a.png" />
        <canvas slot="preview" width="2244" height="622"></canvas>
      </uikit-image>
    </div>
  );
}

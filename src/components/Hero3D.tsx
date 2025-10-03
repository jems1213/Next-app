"use client";
import React, { useEffect } from "react";
import styles from "../app/page.module.css";

export default function Hero3D({ src }: { src: string }) {
  useEffect(() => {
    if (!document.querySelector('script[data-model-viewer]')) {
      const s = document.createElement('script');
      s.setAttribute('type', 'module');
      s.setAttribute('src', 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js');
      s.setAttribute('data-model-viewer', 'true');
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div className={styles.heroModelWrap}>
      {/* @ts-ignore custom element */}
      <model-viewer
        src={src}
        alt="3D shoe"
        camera-controls
        auto-rotate
        interaction-prompt="none"
        exposure="1"
        shadow-intensity="1"
        className={styles.modelViewer}
      />
    </div>
  );
}

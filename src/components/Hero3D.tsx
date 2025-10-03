"use client";
import React, { useEffect, useState } from "react";
import styles from "../app/page.module.css";

export default function Hero3D({ src }: { src: string }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // if model-viewer already registered
    if (typeof customElements !== 'undefined' && customElements.get('model-viewer')) {
      setReady(true);
      return;
    }

    // try to load the module script once
    if (!document.querySelector('script[data-model-viewer]')) {
      const s = document.createElement('script');
      s.setAttribute('type', 'module');
      s.setAttribute('src', 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js');
      s.setAttribute('data-model-viewer', 'true');
      s.onload = () => {
        if (typeof customElements !== 'undefined' && customElements.get('model-viewer')) setReady(true);
        else setFailed(true);
      };
      s.onerror = () => setFailed(true);
      document.head.appendChild(s);
    } else {
      // script exists but maybe not registered yet; wait briefly
      const t = setTimeout(() => {
        if (typeof customElements !== 'undefined' && customElements.get('model-viewer')) setReady(true);
        else setFailed(true);
      }, 1200);
      return () => clearTimeout(t);
    }

    // fallback timeout if load takes too long
    const timeout = setTimeout(() => {
      if (!ready) setFailed(true);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [ready]);

  if (failed) {
    return (
      <div className={styles.heroModelWrap}>
        <img src="/next.svg" alt="product preview" className={styles.modelViewerPlaceholder} />
      </div>
    );
  }

  if (!ready) {
    return <div className={styles.heroModelWrap} />;
  }

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

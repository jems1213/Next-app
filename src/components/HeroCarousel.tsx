"use client";
import React from 'react';
import Hero3DClient from './Hero3DClient';
import styles from '../app/page.module.css';

export default function HeroCarousel({ models }: { models: { src: string; fallback?: string; alt?: string }[] }) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % models.length);
    }, 4000);
    return () => clearInterval(t);
  }, [paused, models.length]);

  function prev() {
    setIndex((i) => (i - 1 + models.length) % models.length);
  }
  function next() {
    setIndex((i) => (i + 1) % models.length);
  }

  return (
    <div className={styles.heroCarousel}>
      <div className={styles.heroModelWrap}>
        <Hero3DClient src={models[index].src} fallbackImage={models[index].fallback} />
      </div>

      <div className={styles.heroControls} aria-hidden={false}>
        <button aria-label="Previous slide" onClick={prev} className={styles.heroControlButton}>
          ‹
        </button>

        <div className={styles.heroDots}>
          {models.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              className={[styles.heroDot, i === index ? styles.activeDot : ''].filter(Boolean).join(' ')}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

        <button aria-label="Next slide" onClick={next} className={styles.heroControlButton}>
          ›
        </button>

        <button aria-label="Pause slideshow" onClick={() => setPaused((p) => !p)} className={styles.heroControlButton}>
          {paused ? '▶' : '▮▮'}
        </button>
      </div>
    </div>
  );
}

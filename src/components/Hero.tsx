"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Hero3DClient from "./Hero3DClient";
import "./Hero.css";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const slides = [
    {
      title: "Step Into Style",
      subtitle: "NEW COLLECTION 2025",
      description: "Discover the latest trends in premium footwear",
      cta: "Shop Now",
      image: "",
      bgColor: "#f5f5f5",
      textColor: "#000",
      threeD: true,
      modelUrl:
        "https://cdn.builder.io/o/assets%2Fad449939a7dd4bddae2e1ca210d150b7%2F46e23d39ee9a412ba423c502db72469a?alt=media&token=f333f103-13c5-421d-bde6-75a53f118aea&apiKey=ad449939a7dd4bddae2e1ca210d150b7",
    },
    {
      title: "Executive Collection",
      subtitle: "BUSINESS ELEGANCE",
      description: "Professional footwear for the modern executive",
      cta: "Explore",
      image: "",
      bgColor: "#071023",
      textColor: "#fff",
      threeD: true,
      modelUrl:
        "https://cdn.builder.io/o/assets%2F6a0d17144ec44352910fe93bc426f48e%2Fdce3d7b51e7345a9a4e2cd678522cc44?alt=media&token=b3c718c7-e14f-4882-bcca-13bb55672655&apiKey=6a0d17144ec44352910fe93bc426f48e",
    },
    {
      title: "Performance Engineered",
      subtitle: "ATHLETIC INNOVATION",
      description: "Cutting-edge technology for peak performance",
      cta: "View Tech",
      image: "",
      bgColor: "#e74c3c",
      textColor: "#fff",
      threeD: true,
      modelUrl:
        "https://cdn.builder.io/o/assets%2F3c18b0444cd749efb807f80093d75ea4%2F04b421f72b3e4403b02a7f829f85faf7?alt=media&token=7fcc8d84-88a4-4df1-abb1-7d7ac5fb5c71&apiKey=3c18b0444cd749efb807f80093d75ea4",
    },
  ];

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoPlay) return;
    intervalRef.current = window.setInterval(() => {
      setCurrentSlide((s) => (s + 1) % slides.length);
    }, 8000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoPlay]);

  const goTo = (index: number) => setCurrentSlide(index);
  const next = () => setCurrentSlide((s) => (s + 1) % slides.length);
  const prev = () => setCurrentSlide((s) => (s - 1 + slides.length) % slides.length);

  return (
    <section className={`hero hero-variant-${currentSlide}`}>
      <div className="hero-container">
        <div className="hero-content">
          <h2 className="hero-subtitle">{slides[currentSlide].subtitle}</h2>
          <h1 className="hero-title">
            {slides[currentSlide].title.split(" ").map((w, i) => (
              <span key={i} className="hero-title-word">
                {w} 
              </span>
            ))}
          </h1>
          <p className="hero-text">{slides[currentSlide].description}</p>

          <div>
            <Link href="/shop">
              <button className="hero-button">
                {slides[currentSlide].cta} <span className="button-icon">→</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="hero-image-container">
          {slides[currentSlide].threeD ? (
            <div className="hero-3d-wrap">
              <Hero3DClient src={slides[currentSlide].modelUrl} fallbackImage="/next.svg" />
            </div>
          ) : (
            <img className="hero-image" src={slides[currentSlide].image} alt={slides[currentSlide].title} />
          )}
        </div>
      </div>

      <div className="hero-controls">
        <button className="control-button prev" onClick={prev} aria-label="Previous slide">‹</button>
        <div className="pagination-dots">
          {slides.map((_, i) => (
            <button key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} onClick={() => goTo(i)} aria-label={`Go to slide ${i+1}`} />
          ))}
        </div>
        <button className="control-button next" onClick={next} aria-label="Next slide">›</button>
        <button className="autoplay-button" onClick={() => setAutoPlay((p) => !p)} aria-label={autoPlay ? 'Pause slideshow' : 'Play slideshow'}>
          {autoPlay ? '▮▮' : '▶'}
        </button>
      </div>
    </section>
  );
}

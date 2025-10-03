import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { getProducts } from "../lib/fakeStore";
import ProductListClient from "../components/ProductListClient";
import React from "react";
import Hero3DClient from "../components/Hero3DClient";
import dynamic from 'next/dynamic';
const Hero = dynamic(() => import('../components/Hero'), { ssr: false });

export default async function Home() {
  const products = await getProducts();

  return (
      <div className={styles.page}>
        <header>
          {/* New hero implemented as client component */}
          {/* @ts-ignore */}
          <div id="hero-root">
            {/* Render client-only hero */}
          </div>
        </header>

        <main className={styles.main}>
          <h2 className={styles.title} id="products">Product Listing</h2>
          <p className={styles.lead}>Server-side rendered with ISR (revalidates every 60s)</p>

          <ProductListClient products={products} />
        </main>

        <footer className={styles.footer}>
          <p>Products provided by FakeStore API — revalidated with ISR.</p>
        </footer>
      </div>
  );
}

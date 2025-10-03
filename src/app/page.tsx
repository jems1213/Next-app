import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { getProducts } from "../lib/fakeStore";
import ProductListClient from "../components/ProductListClient";
import React from "react";
import dynamic from 'next/dynamic';
const Hero3D = dynamic(() => import('../components/Hero3D'), { ssr: false, loading: () => <div style={{width:320,height:320}} /> });

export default async function Home() {
  const products = await getProducts();

  return (
      <div className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroInner + ' ' + styles.heroContentRow}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>Discover smart products, beautifully presented</h1>
              <p className={styles.heroLead}>Modern, responsive store with subtle motion and delightful interactions.</p>
            </div>

            {/* 3D hero model */}
            {/* default model chosen: Nike Air Zoom Pegasus demo */}
            <React.Suspense fallback={<div style={{width:320,height:320}} />}>
              {/* @ts-ignore Server -> Client boundary, dynamic import not required since Hero3D is client component */}
              <Hero3D src="https://cdn.builder.io/o/assets%2F3c18b0444cd749efb807f80093d75ea4%2F04b421f72b3e4403b02a7f829f85faf7?alt=media&token=7fcc8d84-88a4-4df1-abb1-7d7ac5fb5c71&apiKey=3c18b0444cd749efb807f80093d75ea4" />
            </React.Suspense>

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

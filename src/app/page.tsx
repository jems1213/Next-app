import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { getProducts } from "../lib/fakeStore";
import ProductListClient from "../components/ProductListClient";

export default async function Home() {
  const products = await getProducts();

  return (
    <CartProvider>
      <div className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>Discover smart products, beautifully presented</h1>
            <p className={styles.heroLead}>Modern, responsive store with subtle motion and delightful interactions.</p>

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
    </CartProvider>
  );
}

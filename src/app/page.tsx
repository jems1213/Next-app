import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { getProducts } from "../lib/fakeStore";
import { CartProvider } from "../context/cart";
import ProductListClient from "../components/ProductListClient";

export default async function Home() {
  const products = await getProducts();

  return (
    <CartProvider>
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.title}>Product Listing</h1>
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

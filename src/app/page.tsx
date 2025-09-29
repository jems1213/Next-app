import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { getProducts } from "../lib/fakeStore";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Product Listing</h1>
        <p className={styles.lead}>Server-side rendered with ISR (revalidates every 60s)</p>

        <section className={styles.grid}>
          {products.map((p: any) => (
            <article key={p.id} className={styles.card}>
              <Link href={`/products/${p.id}`} className={styles.cardLink}>
                <div className={styles.imageWrap}>
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={240}
                    height={240}
                    className={styles.productImage}
                  />
                </div>
                <h2 className={styles.productTitle}>{p.title}</h2>
                <p className={styles.productPrice}>${p.price.toFixed(2)}</p>
              </Link>
            </article>
          ))}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>Products provided by FakeStore API — revalidated with ISR.</p>
      </footer>
    </div>
  );
}

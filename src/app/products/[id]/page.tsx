import Image from "next/image";
import Link from "next/link";
import styles from "../../page.module.css";
import { getProduct } from "../../../lib/fakeStore";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.lead}>&larr; Back to products</Link>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div className={styles.imageWrap}>
            <Image src={product.image} alt={product.title} width={360} height={360} className={styles.productImage} />
          </div>

          <div style={{ maxWidth: 640 }}>
            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
            <p style={{ marginTop: 12 }}>{product.description}</p>
            <p style={{ marginTop: 12, color: 'var(--gray-alpha-200)' }}><strong>Category:</strong> {product.category}</p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Product details fetched with ISR (60s).</p>
      </footer>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import ProductDetailClient from '../../../components/ProductDetailClient';
import styles from "../../page.module.css";
import productStyles from "../product.module.css";
import { getProduct } from "../../../lib/fakeStore";

export default async function ProductPage(props: { params: { id: string } }) {
  // await params (Next may pass a thenable)
  const params = await (props as any).params as { id: string };

  let product: any = null;
  try {
    product = await getProduct(params.id);
  } catch (e) {
    return (
      <div className={`${styles.page} ${styles.pageCompact}`}>
        <main className={styles.main}>
          <Link href="/" className={styles.backLink}>&larr; Back to products</Link>
          <div style={{ padding: 20 }}>
            <h1 className={styles.title}>Product not found</h1>
            <p className={styles.lead}>We couldn't load that product. It may not exist or the external API failed. Try again later.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`${styles.page} ${styles.pageCompact}`}>
      <section className={productStyles.productSection}>
        <div className={productStyles.backdrop} />
        <div className={productStyles.container}>
          <Link href="/" className={styles.backLink}>&larr; Back to products</Link>

          <div className={productStyles.grid}>
            <div className={productStyles.media}>
              <Image src={product.image} alt={product.title} width={640} height={640} className={productStyles.mediaImage} unoptimized />
            </div>

            <div className={productStyles.info}>
              <h1 className={productStyles.title}>{product.title}</h1>
              <p className={productStyles.price}>${product.price.toFixed(2)}</p>
              <p className={productStyles.description}>{product.description}</p>
              <p className={productStyles.meta}><strong>Category:</strong> {product.category}</p>

              <div className={productStyles.controls}>
                {/* client-side controls */}
                {/* @ts-ignore Server -> Client prop */}
                <ProductDetailClient product={product} />

                <div className={productStyles.buttons}>
                  <button className={`btn btn-primary ${productStyles.animatedButton}`} aria-label="Buy now">Buy now</button>
                  <button className={`btn ${productStyles.ghostButton} ${productStyles.animatedButton}`} aria-label="Add to wishlist">Add to wishlist</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p className={styles.lead}>Product details fetched with ISR (60s).</p>
      </footer>
    </div>
  );
}

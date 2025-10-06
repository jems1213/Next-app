import Image from "next/image";
import Link from "next/link";
import ProductDetailClient from '../../../components/ProductDetailClient';
import ProductDescriptionClient from '../../../components/ProductDescriptionClient';
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
      <div className={`${styles.page}`}>
        <main className={styles.main}>
          <Link href="/" prefetch={false} className={`${styles.backLink} ${productStyles.backLinkTopLeft}`}>&larr; Back to products</Link>
          <div style={{ padding: 20 }}>
            <h1 className={styles.title}>Product not found</h1>
            <p className={styles.lead}>We couldn't load that product. It may not exist or the external API failed. Try again later.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`${styles.page}`}>
      <section className={productStyles.productSection}>
        <div className={productStyles.backdrop} />
        <div className={productStyles.container}>
          <Link href="/" prefetch={false} className={`${styles.backLink} ${productStyles.backLinkTopLeft}`}>&larr; Back to products</Link>

          <div className={productStyles.card}>
            <div className={productStyles.media}>
              <Image src={product.image} alt={product.title} width={320} height={320} className={productStyles.mediaImage} unoptimized />
            </div>

            <div className={productStyles.info}>
              <h1 className={productStyles.title}>{product.title}</h1>
              <p className={productStyles.price}>${product.price.toFixed(2)}</p>
              <ProductDescriptionClient description={product.description} />
              <p className={productStyles.meta}><strong>Category:</strong> {product.category}</p>

              <div className={productStyles.controls}>
                {/* client-side controls */}
                {/* @ts-ignore Server -> Client prop */}
                <ProductDetailClient product={product} />

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

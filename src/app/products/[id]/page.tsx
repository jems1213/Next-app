import Image from "next/image";
import Link from "next/link";
import ProductDetailClient from '../../../components/ProductDetailClient';
import styles from "../../page.module.css";
import { getProduct } from "../../../lib/fakeStore";

export default async function ProductPage(props: { params: { id: string } }) {
  // params may be a thenable in some Next versions; await to be safe
  const { params } = (await props) as { params: { id: string } };
  let product: any = null;
  try {
    product = await getProduct(params.id);
  } catch (e) {
    // graceful fallback: show an error page content instead of crashing JSON parse
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <Link href="/" className={styles.backLink}>&larr; Back to products</Link>
          <div style={{ padding: 40 }}>
            <h1 className={styles.title}>Product not found</h1>
            <p className={styles.lead}>We couldn't load that product. It may not exist or the external API failed. Try again later.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>&larr; Back to products</Link>

        <div className={styles.productDetailWrap}>
          <div className={styles.imageWrap}>
            <Image src={product.image} alt={product.title} width={360} height={360} className={styles.productImage} unoptimized />
          </div>

          <div className={styles.detailContent}>
            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
            <p className={styles.detailDescription}>{product.description}</p>
            <p className={styles.detailMeta}><strong>Category:</strong> {product.category}</p>

            {/* client-side controls: add to cart, quantity, etc. */}
            {/* @ts-ignore Server -> Client prop */}
            <ProductDetailClient product={product} />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Product details fetched with ISR (60s).</p>
      </footer>
    </div>
  );
}

import Link from "next/link";
import styles from "../page.module.css";

export default function OrderPage({ params }: { params: { id: string } }) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Order placed</h1>
        <p>Your order <strong>{params.id}</strong> was placed successfully.</p>
        <p>
          <Link href="/">Back to products</Link>
        </p>
      </main>

      <footer className={styles.footer}>
        <p>Thank you for your purchase.</p>
      </footer>
    </div>
  );
}

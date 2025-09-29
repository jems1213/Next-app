import { cookies } from "next/headers";
import Link from "next/link";
import styles from "../page.module.css";
import dynamic from "next/dynamic";

const CheckoutShell = dynamic(() => import('./CheckoutShell'), { ssr: false });

export default function CheckoutPage() {
  const cookieStore = cookies();
  const cartCookie = cookieStore.get("cart")?.value ?? "[]";
  let items = [] as any[];
  try {
    items = JSON.parse(decodeURIComponent(cartCookie));
  } catch {}

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>&larr; Back</Link>

        <h1 className={styles.title}>Checkout</h1>

        <CheckoutShell initialItems={items} />
      </main>

      <footer className={styles.footer}>
        <p>Confirm your order before placing it.</p>
      </footer>
    </div>
  );
}

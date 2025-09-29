import { cookies } from "next/headers";
import Link from "next/link";
import styles from "../page.module.css";
import CheckoutShell from './CheckoutShell';

export default async function CheckoutPage() {
  const cookieStore = await cookies();
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

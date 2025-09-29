import { cookies } from "next/headers";
import Link from "next/link";
import styles from "../page.module.css";
import CheckoutForm from "./CheckoutForm";

export default function CheckoutPage() {
  const cookieStore = cookies();
  const cartCookie = cookieStore.get("cart")?.value ?? "[]";
  let items = [] as any[];
  try {
    items = JSON.parse(decodeURIComponent(cartCookie));
  } catch {}

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>&larr; Back</Link>

        <h1 className={styles.title}>Checkout</h1>

        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <ul>
              {items.map((it: any) => (
                <li key={it.id} style={{ marginBottom: 8 }}>
                  {it.title} x {it.quantity} — ${ (it.price * it.quantity).toFixed(2) }
                </li>
              ))}
            </ul>
            <p style={{ fontWeight: 700 }}>Total: ${total.toFixed(2)}</p>

            <CheckoutForm items={items} total={total} />
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Confirm your order before placing it.</p>
      </footer>
    </div>
  );
}

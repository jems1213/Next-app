import CartClient from './CartClient';
import styles from '../page.module.css';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default function CartPage() {
  const cookieStore = cookies();
  const cartCookie = cookieStore.get('cart')?.value ?? '[]';
  let items = [] as any[];
  try {
    items = JSON.parse(decodeURIComponent(cartCookie));
  } catch {}

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>&larr; Back</Link>
        <h1 className={styles.title}>Your Cart</h1>
        <p className={styles.lead}>Review items in your cart and proceed to checkout.</p>

        {/* pass server-side snapshot to avoid hydration mismatch */}
        <CartClient initialItems={items} />
      </main>

      <footer className={styles.footer}>
        <p>Your cart is persisted in local storage for demo purposes.</p>
      </footer>
    </div>
  );
}

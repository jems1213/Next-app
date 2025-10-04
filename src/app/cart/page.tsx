import CartClient from './CartClient';
import styles from '../page.module.css';
import cartPageStyles from './cartPage.module.css';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function CartPage() {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get('cart')?.value ?? '[]';
  let items = [] as any[];
  try {
    items = JSON.parse(decodeURIComponent(cartCookie));
  } catch {}

  return (
    <div className={`${styles.page} ${styles.pageCompact}`} style={{ padding: 0, margin: 0 }}>
      <header className={styles.heroInner} style={{ paddingTop: 120, paddingLeft: 24 }}>
        <h1 className={styles.heroTitle} style={{ paddingLeft: 4 }}>Your Cart</h1>
        <p className={styles.heroLead} style={{ paddingLeft: 4 }}>Review items in your cart and proceed to checkout.</p>
      </header>

      <main className={styles.main} style={{ paddingTop: 24, gap: 18 }}>
        <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto', padding: '0 12px 0 24px' }}>
          <Link href="/" className={styles.backLink} style={{ display: 'inline-block', marginBottom: 6, marginTop: 12, paddingLeft: 8 }}>&larr; Back</Link>
          <CartClient initialItems={items} />
        </div>
      </main>

      <footer className={styles.footer}>
        <p style={{ margin: 0 }}>Your cart is persisted in local storage for demo purposes.</p>
      </footer>
    </div>
  );
}

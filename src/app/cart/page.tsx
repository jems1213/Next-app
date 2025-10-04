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
    <div className={`${styles.page} ${styles.pageCompact}`} style={{padding: 0, margin: 0}}>
      <main className={`${styles.main} ${cartPageStyles.noTopPadding}`} style={{padding: '12px 16px'}}>
        <Link href="/" className={styles.backLink} style={{marginBottom: 4, display: 'inline-block'}}>&larr; Back</Link>
        <h1 className={styles.title} style={{marginTop: 4}}>Your Cart</h1>
        <p className={styles.lead} style={{marginTop: 6}}>Review items in your cart and proceed to checkout.</p>

        {/* pass server-side snapshot to avoid hydration mismatch */}
        <CartClient initialItems={items} />
      </main>

      <footer className={styles.footer}>
        <p>Your cart is persisted in local storage for demo purposes.</p>
      </footer>
    </div>
  );
}

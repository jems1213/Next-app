import CartClient from './CartClient';
import styles from '../page.module.css';

export default function CartPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Your Cart</h1>
        <p className={styles.lead}>Review items in your cart and proceed to checkout.</p>

        <CartClient />
      </main>

      <footer className={styles.footer}>
        <p>Your cart is persisted in local storage for demo purposes.</p>
      </footer>
    </div>
  );
}

import OrdersClient from './OrdersClient';
import styles from '../page.module.css';

export default function OrdersPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Your orders</h1>
        <p className={styles.lead}>A list of orders you have placed from this browser.</p>

        <OrdersClient />
      </main>

      <footer className={styles.footer}>
        <p>Orders are stored locally for demo purposes.</p>
      </footer>
    </div>
  );
}

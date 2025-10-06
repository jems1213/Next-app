import styles from '../page.module.css';
import OrdersClient from './OrdersClient';

export default function OrdersPage() {
  return (
    <div className={`${styles.page} ${styles.pageCompact}`} style={{ padding: 0, margin: 0 }}>
      <header className={styles.heroInner} style={{ paddingTop: 120, paddingLeft: 24 }}>
        <h1 className={styles.heroTitle} style={{ paddingLeft: 4 }}>Your orders</h1>
        <p className={styles.heroLead} style={{ paddingLeft: 4 }}>A list of orders you have placed from this browser.</p>
      </header>

      <main className={styles.main} style={{ paddingTop: 24, gap: 18 }}>
        <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto', padding: '0 12px 0 24px' }}>
          <OrdersClient />
        </div>
      </main>

      <footer className={styles.footer}>
        <p style={{ margin: 0 }}>Orders are stored in the connected database.</p>
      </footer>
    </div>
  );
}

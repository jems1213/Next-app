import styles from '../page.module.css';
import AccountClient from './AccountClient';

export default function AccountPage() {
  return (
    <div className={`${styles.page} ${styles.pageCompact}`} style={{ padding: 0, margin: 0 }}>
      <header className={styles.heroInner} style={{ paddingTop: 120, paddingLeft: 24 }}>
        <h1 className={styles.heroTitle} style={{ paddingLeft: 4 }}>My Account</h1>
        <p className={styles.heroLead} style={{ paddingLeft: 4 }}>Manage your profile, orders and settings.</p>
      </header>

      <main className={styles.main} style={{ paddingTop: 24, gap: 18 }}>
        <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto', padding: '0 12px 0 24px' }}>
          <AccountClient />
        </div>
      </main>
    </div>
  );
}

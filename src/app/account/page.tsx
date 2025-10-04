import styles from '../page.module.css';
import AccountClient from './AccountClient';

export default function AccountPage() {
  return (
    <div className={[styles.page, styles.pageCompact, styles.accountPageReset].filter(Boolean).join(' ')}>
      <header className={[styles.heroInner, styles.accountHeroHeader].filter(Boolean).join(' ')}>
        <h1 className={[styles.heroTitle, styles.accountHeroTitlePadding].filter(Boolean).join(' ')}>My Account</h1>
        <p className={[styles.heroLead, styles.accountHeroLeadPadding].filter(Boolean).join(' ')}>Manage your profile, orders and settings.</p>
      </header>

      <main className={[styles.main, styles.accountMainSpacing].filter(Boolean).join(' ')}>
        <div className={styles.accountInnerContainer}>
          <AccountClient />
        </div>
      </main>
    </div>
  );
}

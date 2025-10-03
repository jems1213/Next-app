import React from 'react';
import styles from '../page.module.css';
import css from './help.module.css';

export default function Help() {
  return (
    <div className={styles.page}>
      <header className={styles.heroInner}>
        <h1 className={styles.heroTitle}>Help & Support</h1>
        <p className={styles.heroLead}>Find answers to common questions or contact our support team.</p>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>Frequently Asked Questions</h2>
        <section className={css.faqWrap}>
          <details>
            <summary className={css.faqSummary}>Shipping & Delivery</summary>
            <p className={css.faqText}>We offer free shipping on orders over $50. Delivery times vary by location.</p>
          </details>

          <details>
            <summary className={css.faqSummary}>Returns & Exchanges</summary>
            <p className={css.faqText}>Returns accepted within 30 days with original packaging.</p>
          </details>

          <details>
            <summary className={css.faqSummary}>Contact</summary>
            <p className={css.faqText}>Email us at support@example.com or use the contact form.</p>
          </details>
        </section>
      </main>
    </div>
  );
}

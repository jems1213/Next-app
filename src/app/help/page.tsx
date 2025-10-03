import React from 'react';
import styles from '../page.module.css';

export default function Help() {
  return (
    <div className={styles.page}>
      <header className={styles.heroInner}>
        <h1 className={styles.heroTitle}>Help & Support</h1>
        <p className={styles.heroLead}>Find answers to common questions or contact our support team.</p>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>Frequently Asked Questions</h2>
        <section style={{ maxWidth: 1000, width: '100%', display: 'grid', gap: 16 }}>
          <details>
            <summary style={{ fontWeight: 700 }}>Shipping & Delivery</summary>
            <p style={{ color: 'var(--gray-alpha-100)' }}>We offer free shipping on orders over $50. Delivery times vary by location.</p>
          </details>

          <details>
            <summary style={{ fontWeight: 700 }}>Returns & Exchanges</summary>
            <p style={{ color: 'var(--gray-alpha-100)' }}>Returns accepted within 30 days with original packaging.</p>
          </details>

          <details>
            <summary style={{ fontWeight: 700 }}>Contact</summary>
            <p style={{ color: 'var(--gray-alpha-100)' }}>Email us at support@example.com or use the contact form.</p>
          </details>
        </section>
      </main>
    </div>
  );
}

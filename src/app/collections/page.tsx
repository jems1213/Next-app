import React from 'react';
import styles from '../page.module.css';
import Link from 'next/link';
import { getProducts } from '../../lib/fakeStore';

export default async function Collections() {
  const products = await getProducts();
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className={styles.page}>
      <header className={styles.heroInner}>
        <h1 className={styles.heroTitle}>Collections</h1>
        <p className={styles.heroLead}>Shop by curated collections and categories.</p>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>Browse Collections</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, width: '100%', maxWidth: 1100 }}>
          {categories.map((c) => (
            <Link key={c} href="/shop" className={styles.card}>
              <div style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 8, fontWeight: 700 }}>{c}</h3>
                <p style={{ color: 'var(--gray-alpha-100)' }}>Explore products in the {c} collection.</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

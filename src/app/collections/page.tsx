import React from 'react';
import styles from '../page.module.css';
import Link from 'next/link';
import css from './collections.module.css';
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
        <div className={css.collectionsGrid}>
          {categories.map((c) => (
            <Link key={c} href="/shop" className={css.collectionCard}>
              <div>
                <h3 className={css.collectionTitle}>{c}</h3>
                <p className={css.collectionDesc}>Explore products in the {c} collection.</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

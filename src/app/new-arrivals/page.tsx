import React from 'react';
import styles from '../page.module.css';
import ProductListClient from '../../components/ProductListClient';
import { getProducts } from '../../lib/fakeStore';

export default async function NewArrivals() {
  const products = await getProducts();
  // treat newest items as those with highest id
  const newest = [...products].sort((a, b) => b.id - a.id).slice(0, 12);

  return (
    <div className={`${styles.page} ${styles.pageCompact}`}>
      <header className={styles.heroInner}>
        <h1 className={styles.heroTitle}>New Arrivals</h1>
        <p className={styles.heroLead}>Fresh styles added recently — curated picks for you.</p>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>Latest Products</h2>
        <p className={styles.lead}>Hand-selected new arrivals from our catalog.</p>
        {/* @ts-ignore Server -> Client boundary */}
        <ProductListClient products={newest} />
      </main>
    </div>
  );
}

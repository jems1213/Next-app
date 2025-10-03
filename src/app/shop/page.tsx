import React from 'react';
import styles from '../page.module.css';
import ProductListClient from '../../components/ProductListClient';
import { getProducts } from '../../lib/fakeStore';

export default async function Shop() {
  const products = await getProducts();

  return (
    <div className={styles.page}>
      <header className={styles.heroInner}>
        <h1 className={styles.heroTitle}>Shop</h1>
        <p className={styles.heroLead}>Browse our full selection of products. Use the filters to find what you love.</p>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>All Products</h2>
        <p className={styles.lead}>Server-side rendered and searchable.</p>
        {/* @ts-ignore */}
        <ProductListClient products={products} />
      </main>
    </div>
  );
}

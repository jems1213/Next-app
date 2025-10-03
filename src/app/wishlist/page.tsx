"use client";
import React from 'react';
import styles from '../page.module.css';
import Link from 'next/link';

export default function Wishlist() {
  return (
    <div className={`${styles.page} ${styles.pageCompact}`}>
      <header className={styles.heroInner}>
        <h1 className={styles.heroTitle}>Wishlist</h1>
        <p className={styles.heroLead}>Your saved items — keep track of pieces you love.</p>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>Saved for later</h2>
        <p className={styles.lead}>You haven't added any items to your wishlist yet.</p>
        <Link href="/shop" className={styles.ctas}>← Browse products</Link>
      </main>
    </div>
  );
}

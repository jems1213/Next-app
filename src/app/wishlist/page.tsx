"use client";
import React from 'react';
import styles from '../page.module.css';
import Link from 'next/link';
import { useCart } from '../../context/cart';

export default function Wishlist() {
  const { savedItems, moveToCart, removeFromSaved } = useCart();

  return (
    <div className={`${styles.page} ${styles.pageCompact}`}>
      <header className={styles.heroInner}>
        <h1 className={styles.heroTitle}>Wishlist</h1>
        <p className={styles.heroLead}>Your saved items — keep track of pieces you love.</p>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>Saved for later</h2>

        {savedItems && savedItems.length > 0 ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {savedItems.map((it) => (
              <div key={it.id} className={styles.card} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Link href={`/products/${it.id}`} className={styles.itemThumbLink} style={{ display: 'inline-flex' }}>
                  {it.image ? (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img src={it.image} alt={it.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                  ) : (
                    <div style={{ width: 80, height: 80, borderRadius: 8, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.title?.[0] ?? 'P'}</div>
                  )}
                </Link>

                <div style={{ flex: 1 }}>
                  <Link href={`/products/${it.id}`} style={{ fontWeight: 700 }}>{it.title}</Link>
                  <div className={styles.heroLead} style={{ marginTop: 6 }}>${Number(it.price).toFixed(2)}</div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn" onClick={() => moveToCart(it.id)}>Add to cart</button>
                  <button className="btn" onClick={() => removeFromSaved(it.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className={styles.lead}>You haven't added any items to your wishlist yet.</p>
            <Link href="/shop" className={styles.ctas}>← Browse products</Link>
          </>
        )}
      </main>
    </div>
  );
}

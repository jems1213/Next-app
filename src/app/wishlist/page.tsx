"use client";
import React, { useEffect, useState } from 'react';
import styles from '../page.module.css';
import Link from 'next/link';
import { useCart } from '../../context/cart';

export default function Wishlist() {
  const { savedItems, moveToCart, removeFromSaved } = useCart();
  const [displayItems, setDisplayItems] = useState<any[] | null>(null);

  useEffect(() => {
    // prefer context state, but fallback to localStorage in case of timing issues
    if (savedItems && savedItems.length > 0) {
      setDisplayItems(savedItems);
      return;
    }
    try {
      const raw = localStorage.getItem('saved_cart');
      if (raw) setDisplayItems(JSON.parse(raw));
      else setDisplayItems([]);
    } catch {
      setDisplayItems([]);
    }
  }, [savedItems]);

  return (
    <div className={`${styles.page} ${styles.pageCompact}`}>
      <header className={styles.heroInner}>
        <h1 className={styles.heroTitle}>Wishlist</h1>
        <p className={styles.heroLead}>Your saved items — keep track of pieces you love.</p>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>Saved for later</h2>

        {displayItems === null ? (
          <p className={styles.lead}>Loading wishlist...</p>
        ) : displayItems.length > 0 ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {displayItems.map((it) => (
              <div key={it.id} className={styles.card} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Link href={`/products/${it.id}`} className={styles.itemThumbLink} style={{ display: 'inline-flex' }}>
                  {it.image ? (
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
                  <button className="btn" onClick={() => { removeFromSaved(it.id); setDisplayItems((s) => (s || []).filter((x) => x.id !== it.id)); }}>Remove</button>
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

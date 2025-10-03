"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../context/cart';
import styles from '../app/page.module.css';

export default function ProductDetailClient({ product }: { product: any }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [done, setDone] = useState(false);

  function onAdd() {
    setAdding(true);
    try {
      addItem({ id: product.id, title: product.title, price: Number(product.price), image: product.image }, qty);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className={styles.productActions}>
      <div className={styles.priceRow}>
        <div className={styles.productPriceLarge}>${Number(product.price).toFixed(2)}</div>
        <div className={styles.ratingBadge}>{product.rating?.rate ?? 4.5} ★</div>
      </div>

      <div className={styles.controlsGroup}>
        <label className={styles.label}>Quantity</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            aria-label="Quantity"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
            className={styles.qtyInput}
          />

          <button className={styles.addButton} onClick={onAdd} disabled={adding}>
            {adding ? 'Adding...' : 'Add to cart'}
          </button>
        </div>
      </div>

      {done && <div className={styles.successBadge}>Added to cart</div>}

      <div style={{ marginTop: 12 }}>
        <LinkBar />
      </div>
    </div>
  );
}

function LinkBar() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/" className="link">← Back to products</a>
      <a href="/cart" className="link">View cart</a>
    </div>
  );
}

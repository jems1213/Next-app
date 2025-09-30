"use client";
import React from 'react';
import { useCart } from '../../context/cart';
import Link from 'next/link';
import styles from '../page.module.css';

export default function CartClient({ initialItems }: { initialItems?: any[] }) {
  const { items, removeItem, clear, totalQuantity } = useCart();

  // Use initialItems on first render to avoid hydration mismatch
  const displayItems = (items && items.length) ? items : (initialItems ?? []);
  const total = displayItems.reduce((s, i) => s + i.price * i.quantity, 0);

  if (!displayItems || displayItems.length === 0) {
    return (
      <div className={styles.card}>
        <p>Your cart is empty.</p>
        <p>
          <Link href="/">Browse products</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.cartList}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 className={styles.title}>Cart ({totalQuantity})</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={styles.addButton} onClick={() => clear()}>Clear</button>
          <Link href="/checkout" className={styles.cartPill}>Checkout</Link>
        </div>
      </div>

      <ul className={styles.orderItems}>
        {items.map((it) => (
          <li key={it.id} className={styles.summaryItem} style={{ alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {it.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.image} alt={it.title} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
              )}
              <div style={{ minWidth: 220 }}>{it.title}</div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div>{it.quantity} × ${it.price.toFixed(2)}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={styles.addButton} onClick={() => removeItem(it.id)}>Remove</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.summaryTotal} style={{ marginTop: 12 }}>
        <div>Total</div>
        <div className={styles.productPrice}>${total.toFixed(2)}</div>
      </div>
    </div>
  );
}

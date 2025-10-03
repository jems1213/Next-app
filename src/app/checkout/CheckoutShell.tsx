"use client";
import React, { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import styles from "../page.module.css";
import DebugCart from './DebugCart';

export default function CheckoutShell({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState<any[]>(initialItems ?? []);

  useEffect(() => {
    // if server didn't provide items, try reading from localStorage
    if ((!items || items.length === 0) && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('cart');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        }
      } catch {}
    }
  }, []);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div>
      {items.length === 0 ? (
        <div className={styles.card}>
          <p>Your cart is empty.</p>
          <p>Please add products to continue to checkout.</p>
          <DebugCart />
        </div>
      ) : (
        <div className={styles.checkoutContainer}>
          <section className={`${styles.checkoutForm} reveal`}>
            <h2 className={styles.sectionTitle}>Shipping & Payment</h2>
            <CheckoutForm items={items} total={total} />
          </section>

          <aside className={`${styles.orderSummary} reveal`}>
            <h3 className={styles.sectionTitle}>Order Summary</h3>
            <div className={styles.sumCard}>
              <ul className={styles.orderItems}>
                {items.map((it: any) => (
                  <li key={it.id} className={styles.summaryItem}>
                    <div>{it.title}</div>
                    <div>{it.quantity} × ${it.price.toFixed(2)}</div>
                  </li>
                ))}
              </ul>

              <div className={styles.summaryTotal}>
                <div>Total</div>
                <div className={styles.productPrice}>${total.toFixed(2)}</div>
              </div>
            </div>

            <DebugCart />
          </aside>
        </div>
      )}
    </div>
  );
}

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
        <div>
          <p>Your cart is empty.</p>
          <DebugCart />
        </div>
      ) : (
        <div>
          <ul>
            {items.map((it: any) => (
              <li key={it.id} style={{ marginBottom: 8 }}>
                {it.title} x {it.quantity} — ${ (it.price * it.quantity).toFixed(2) }
              </li>
            ))}
          </ul>
          <p style={{ fontWeight: 700 }}>Total: ${total.toFixed(2)}</p>

          <CheckoutForm items={items} total={total} />
          <DebugCart />
        </div>
      )}
    </div>
  );
}

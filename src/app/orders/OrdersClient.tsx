"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";

export default function OrdersClient() {
  const [orders, setOrders] = useState<any[] | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("orders") ?? "[]";
      const parsed = JSON.parse(raw);
      setOrders(Array.isArray(parsed) ? parsed : []);
    } catch {
      setOrders([]);
    }
  }, []);

  function clearAll() {
    try {
      localStorage.removeItem("orders");
    } catch {}
    setOrders([]);
  }

  function removeOne(id: string) {
    const next = (orders || []).filter((o) => o.id !== id);
    try {
      localStorage.setItem("orders", JSON.stringify(next));
    } catch {}
    setOrders(next);
  }

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (orders === null) return <p>Loading orders...</p>;

  return (
    <div>
      {orders.length === 0 ? (
        <div className={styles.card}>
          <p>No orders yet.</p>
          <p>
            <Link href="/">Browse products</Link>
          </p>
        </div>
      ) : (
        <div className={styles.ordersList}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button className={styles.addButton} onClick={clearAll}>Clear all</button>
          </div>

          {orders.map((o) => (
            <article key={o.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <Link href={`/order/${o.id}`} className={styles.backLink}>Order #{o.id}</Link>
                  <div className={styles.orderMeta}>{new Date(o.createdAt).toLocaleString()} • {o.items.length} items</div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div className={styles.productPrice}>${Number(o.total).toFixed(2)}</div>
                  <button className={styles.cartPill} onClick={() => toggle(o.id)} aria-expanded={!!expanded[o.id]}>
                    {expanded[o.id] ? "Hide" : "Details"}
                  </button>
                  <button className={styles.addButton} onClick={() => removeOne(o.id)}>Remove</button>
                </div>
              </div>

              {expanded[o.id] && (
                <ul className={styles.orderItems}>
                  {o.items.map((it: any, idx: number) => (
                    <li key={idx}>
                      {it.title} x {it.quantity} — ${ (it.price * it.quantity).toFixed(2) }
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

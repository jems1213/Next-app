"use client";
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";
import { useCart } from "../../context/cart";

export default function OrdersClient() {
  const [orders, setOrders] = useState<any[] | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { addItem } = useCart();

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

  function reorder(order: any) {
    try {
      (order.items || []).forEach((it: any) => {
        // items saved with numeric id in cart; ensure types
        addItem({ id: Number(it.id), title: it.title, price: Number(it.price), image: it.image || '' }, it.quantity || 1);
      });
      // provide a small visual hint by storing a 'lastAdded' marker on the order (local only)
      alert('Added items to cart from order ' + order.id);
    } catch (e) {
      console.error(e);
    }
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
          <div className={styles.ordersControls}>
            <button className={styles.clearButton} onClick={clearAll}>Clear all orders</button>
          </div>

          {orders.map((o) => (
            <article key={o.id} className={styles.orderCardAlt}>
              <div className={styles.orderCardTop}>
                <div className={styles.orderCardInfo}>
                  <Link href={`/order/${o.id}`} className={styles.orderLink}>Order #{o.id}</Link>
                  <div className={styles.orderMeta}>{new Date(o.createdAt).toLocaleString()} • {o.items.length} items</div>
                </div>

                <div className={styles.orderCardActions}>
                  <div className={styles.orderTotal}>${Number(o.total).toFixed(2)}</div>
                  <button className={styles.detailToggle} onClick={() => toggle(o.id)} aria-expanded={!!expanded[o.id]}>
                    {expanded[o.id] ? 'Hide items' : 'View items'}
                  </button>
                  <button className={styles.reorderButton} onClick={() => reorder(o)}>Reorder</button>
                  <button className={styles.removeButton} onClick={() => removeOne(o.id)}>Remove</button>
                </div>
              </div>

              {expanded[o.id] && (
                <div className={styles.orderItemsGrid}>
                  {(o.items || []).map((it: any, idx: number) => (
                    <div key={idx} className={styles.orderItemRow}>
                      <Link href={`/products/${it.id}`} className={styles.itemThumbLink}>
                        {it.image ? (
                          // use simple img here; existing codebase uses img tags elsewhere
                          <img src={it.image} alt={it.title} className={styles.itemThumb} />
                        ) : (
                          <div className={styles.itemThumbPlaceholder}>{it.title?.[0] ?? 'P'}</div>
                        )}
                      </Link>

                      <div className={styles.itemDetails}>
                        <Link href={`/products/${it.id}`} className={styles.itemTitle}>{it.title}</Link>
                        <div className={styles.itemMeta}>{it.quantity} × ${Number(it.price).toFixed(2)}</div>
                      </div>

                      <div className={styles.itemLineTotal}>${(Number(it.price) * Number(it.quantity || 1)).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

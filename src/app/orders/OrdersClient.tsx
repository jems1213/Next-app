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
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) {
          if (mounted) setOrders([]);
          return;
        }
        const rows = await res.json();
        const arr = Array.isArray(rows) ? rows.map((r: any) => ({
          id: r.id,
          items: (r.items && r.items.items) ? r.items.items : (r.items || []),
          total: Number(r.total || 0),
          createdAt: r.created_at || r.createdAt || new Date().toISOString(),
        })) : [];
        if (mounted) setOrders(arr);
      } catch (e) {
        if (mounted) setOrders([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function clearAll() {
    try {
      await fetch('/api/orders', { method: 'DELETE' });
    } catch {}
    setOrders([]);
  }

  async function removeOne(id: string) {
    try {
      await fetch('/api/orders', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      setOrders((prev) => (prev || []).filter((o) => o.id !== id));
    } catch (e) {
      console.error(e);
    }
  }

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function reorder(order: any) {
    try {
      (order.items || []).forEach((it: any) => {
        addItem({ id: Number(it.id), title: it.title, price: Number(it.price), image: it.image || "" }, it.quantity || 1);
      });
      // small visual cue
      window.alert("Added items to cart from order " + order.id);
    } catch (e) {
      console.error(e);
    }
  }

  if (orders === null) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: 0, margin: 0 }}>
      {orders.length === 0 ? (
        <div className={styles.card} style={{ padding: 12, margin: 0 }}>
          <p style={{ margin: 0 }}>No orders yet.</p>
          <p style={{ marginTop: 8 }}>
            <Link href="/">Browse products</Link>
          </p>
        </div>
      ) : (
        <div className={styles.ordersList} style={{ padding: 0, margin: 0 }}>
          <div className={styles.ordersControls} style={{ display: 'flex', justifyContent: 'flex-end', padding: '6px 0', marginBottom: 6 }}>
            <button onClick={clearAll} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', padding: '8px 10px', borderRadius: 6, cursor: 'pointer' }} aria-label="Clear all orders">Clear all orders</button>
          </div>

          {orders.map((o) => (
            <article key={o.id} className={styles.orderCardAlt} style={{ marginBottom: 10, padding: 10 }}>
              <div className={styles.orderCardTop} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div className={styles.orderCardInfo} style={{ paddingRight: 8 }}>
                  <Link href={`/order/${o.id}`} className={styles.orderLink} style={{ fontWeight: 700 }}>Order #{o.id}</Link>
                  <div className={styles.orderMeta} style={{ color: 'var(--color-muted)', fontSize: 13 }}>{new Date(o.createdAt).toLocaleString()} • {o.items.length} items</div>
                </div>

                <div className={styles.orderCardActions} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className={styles.orderTotal} style={{ fontWeight: 800 }}>${Number(o.total).toFixed(2)}</div>

                  <button onClick={() => toggle(o.id)} aria-expanded={!!expanded[o.id]} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.04)', padding: '8px 10px', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M3 12h18" /><path d="M12 3v18" /></svg>
                    <span style={{ fontSize: 13 }}>{expanded[o.id] ? 'Hide items' : 'View items'}</span>
                  </button>

                  <button onClick={() => reorder(o)} style={{ background: '#CFB464', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', color: '#0b1020', display: 'inline-flex', gap: 8, alignItems: 'center' }} aria-label="Reorder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M3 12h18" /><path d="M12 3v18" /></svg>
                    <span style={{ fontSize: 13 }}>Reorder</span>
                  </button>

                  <button onClick={() => removeOne(o.id)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', padding: '8px 10px', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', gap: 8, alignItems: 'center' }} aria-label="Remove order">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M3 6h18" /><path d="M8 6v14" /><path d="M16 6v14" /></svg>
                    <span style={{ fontSize: 13 }}>Remove</span>
                  </button>
                </div>
              </div>

              {expanded[o.id] && (
                <div className={styles.orderItemsGrid} style={{ marginTop: 8 }}>
                  {(o.items || []).map((it: any, idx: number) => (
                    <div key={idx} className={styles.orderItemRow} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <Link href={`/products/${it.id}`} className={styles.itemThumbLink} style={{ display: 'inline-flex' }}>
                        {it.image ? (
                          <img src={it.image} alt={it.title} className={styles.itemThumb} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
                        ) : (
                          <div className={styles.itemThumbPlaceholder} style={{ width: 64, height: 64, borderRadius: 8, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.title?.[0] ?? 'P'}</div>
                        )}
                      </Link>

                      <div className={styles.itemDetails} style={{ flex: 1 }}>
                        <Link href={`/products/${it.id}`} className={styles.itemTitle} style={{ fontWeight: 700 }}>{it.title}</Link>
                        <div className={styles.itemMeta} style={{ color: 'var(--color-muted)' }}>{it.quantity} × ${Number(it.price).toFixed(2)}</div>
                      </div>

                      <div className={styles.itemLineTotal} style={{ fontWeight: 700 }}>${(Number(it.price) * Number(it.quantity || 1)).toFixed(2)}</div>
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

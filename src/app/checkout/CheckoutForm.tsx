"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

export default function CheckoutForm({ items, total }: { items: any[]; total: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', postal: '', country: '', card: '' });
  const router = useRouter();

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email.includes('@')) return 'Valid email is required';
    if (!form.address.trim()) return 'Address is required';
    return null;
  }

  async function placeOrder() {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = { items, total, customer: { ...form } };
      const res = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to place order');
      const data = await res.json();


      // clear cart storage and cookie (client-side)
      try {
        localStorage.removeItem('cart');
      } catch {}
      document.cookie = 'cart=; path=/; max-age=0';

      setSuccess(data.id);

      // small delay to show success then redirect
      setTimeout(() => router.push(`/order/${data.id}`), 900);
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setLoading(false);
    }
  }

  return (
    <div className={styles.checkoutFormInner}>
      {success ? (
        <div className={styles.successMessage} role="status">
          <h3>Order placed</h3>
          <p>Your order <strong>{success}</strong> was received. Redirecting…</p>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); placeOrder(); }} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full name</label>
            <input className={styles.input} value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.label}>Address</label>
            <input className={styles.input} value={form.address} onChange={(e) => update('address', e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>City</label>
            <input className={styles.input} value={form.city} onChange={(e) => update('city', e.target.value)} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Postal code</label>
            <input className={styles.input} value={form.postal} onChange={(e) => update('postal', e.target.value)} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Country</label>
            <input className={styles.input} value={form.country} onChange={(e) => update('country', e.target.value)} />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.label}>Card (mock)</label>
            <input className={styles.input} value={form.card} onChange={(e) => update('card', e.target.value)} placeholder="•••• •••• •••• ••••" />
          </div>

          <div className={styles.formFooter}>
            <div className={styles.totalSmall}>Total: <strong>${total.toFixed(2)}</strong></div>
            <button type="submit" disabled={loading} className={styles.placeButton}>
              {loading ? 'Placing order…' : `Place order ($${total.toFixed(2)})`}
            </button>
          </div>

          {error && <div className={styles.errorText} role="alert">{error}</div>}
        </form>
      )}
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutForm({ items, total }: { items: any[]; total: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function placeOrder() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total }),
      });
      if (!res.ok) throw new Error('Failed to place order');
      const data = await res.json();
      // clear cart storage and cookie (client-side)
      try {
        localStorage.removeItem('cart');
      } catch {}
      document.cookie = 'cart=; path=/; max-age=0';
      router.push(`/order/${data.id}`);
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={placeOrder} disabled={loading} style={{ padding: '10px 14px', borderRadius: 8 }}>
        {loading ? 'Placing order...' : `Place order ($${total.toFixed(2)})`}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

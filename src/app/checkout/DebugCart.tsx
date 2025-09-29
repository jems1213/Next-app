"use client";
import React, { useEffect, useState } from 'react';

export default function DebugCart() {
  const [local, setLocal] = useState<string | null>(null);
  const [cookie, setCookie] = useState<string | null>(null);
  const [serverCookie, setServerCookie] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLocal(localStorage.getItem('cart'));
    } catch {}
    setCookie(document.cookie);

    fetch('/api/debug')
      .then((r) => r.json())
      .then((d) => setServerCookie(d.cookie || null))
      .catch(() => setServerCookie('error'));
  }, []);

  return (
    <details style={{ marginTop: 12 }}>
      <summary>Debug: cart state</summary>
      <div style={{ marginTop: 8 }}>
        <div><strong>localStorage.cart</strong>: <pre style={{ whiteSpace: 'pre-wrap' }}>{String(local)}</pre></div>
        <div><strong>document.cookie</strong>: <pre style={{ whiteSpace: 'pre-wrap' }}>{String(cookie)}</pre></div>
        <div><strong>/api/debug cookie header</strong>: <pre style={{ whiteSpace: 'pre-wrap' }}>{String(serverCookie)}</pre></div>
      </div>
    </details>
  );
}

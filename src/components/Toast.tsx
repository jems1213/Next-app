"use client";
import React, { useEffect, useState } from 'react';

type ToastMessage = { id: number; message: string; type?: 'success' | 'info' | 'error' };

export default function ToastRoot() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    function onToast(e: Event) {
      try {
        // support CustomEvent with detail
        const ce = e as CustomEvent;
        const detail = ce.detail || {};
        const message = detail.message || String(detail || '');
        const type = detail.type || 'info';
        const id = Date.now() + Math.floor(Math.random() * 1000);
        setToasts((s) => [...s, { id, message, type }]);
        // auto remove after 3s
        setTimeout(() => {
          setToasts((s) => s.filter((t) => t.id !== id));
        }, 3000);
      } catch (err) {
        // ignore
      }
    }
    window.addEventListener('app-toast', onToast as EventListener);
    return () => window.removeEventListener('app-toast', onToast as EventListener);
  }, []);

  if (!toasts.length) return null;

  return (
    <div style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ minWidth: 220, maxWidth: 360, background: 'rgba(11,16,32,0.96)', color: '#fff', padding: '10px 14px', borderRadius: 8, boxShadow: '0 10px 30px rgba(2,6,23,0.4)', borderLeft: `4px solid ${t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : '#CFB464'}` }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : 'Notice'}</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>{t.message}</div>
        </div>
      ))}
    </div>
  );
}

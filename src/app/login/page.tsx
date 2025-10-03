"use client";
import React, { useState } from 'react';
import styles from '../page.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Signed in (demo).');
  }

  return (
    <div className={`${styles.page} ${styles.pageCompact}`}>
      <header className={styles.heroInner}>
        <h1 className={styles.heroTitle}>Sign In</h1>
        <p className={styles.heroLead}>Access your account to view orders, wishlist and more.</p>
      </header>

      <main className={styles.main}>
        <form onSubmit={submit} style={{ maxWidth: 520, width: '100%', display: 'grid', gap: 12 }}>
          <label>
            Email
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </label>
          <button className="btn btn-primary" type="submit">Sign In</button>
          {msg && <p>{msg}</p>}
        </form>
      </main>
    </div>
  );
}

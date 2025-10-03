"use client";
import React, { useState } from 'react';
import styles from '../page.module.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Account created (demo). You can now sign in.');
  }

  return (
    <div className={`${styles.page} ${styles.pageCompact}`}>
      <header className={styles.heroInner}>
        <h1 className={styles.heroTitle}>Register</h1>
        <p className={styles.heroLead}>Create an account to save your wishlist and track orders.</p>
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
          <button className="btn btn-primary" type="submit">Create account</button>
          {msg && <p>{msg}</p>}
        </form>
      </main>
    </div>
  );
}

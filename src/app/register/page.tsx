"use client";
import React, { useState } from 'react';
import pageStyles from '../page.module.css';
import styles from '../login/login.module.css';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Account created (demo). You can now sign in.');
  }

  return (
    <div className={`${pageStyles.page} ${pageStyles.pageCompact}`}>
      <section className={styles.authSection}>
        <div className={styles.backdrop} />
        <div className={styles.orbit} />
        <span className={styles.spark} />
        <span className={styles.spark} />
        <span className={styles.spark} />

        <div className={styles.authWrap}>
          <header className={styles.authHeader}>
            <h1 className={styles.title}>Create account</h1>
            <p className={styles.lead}>Create an account to save your wishlist and track orders.</p>
          </header>

          <div className={styles.authCard}>
            <form onSubmit={submit} className={styles.authForm} aria-label="Register form">
              <div className={styles.fieldGroup}>
                <label htmlFor="email" className={styles.fieldLabel}>Email</label>
                <input
                  id="email"
                  className={styles.inputControl}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="password" className={styles.fieldLabel}>Password</label>
                <input
                  id="password"
                  className={styles.inputControl}
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button className={`btn btn-primary ${styles.submitButton}`} type="submit">Create account</button>
              {msg && <p className={styles.metaMsg}>{msg}</p>}

              <p className={styles.smallNote}>
                Already have an account? <Link href="/login">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

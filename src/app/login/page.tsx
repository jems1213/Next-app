"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth';
import pageStyles from '../page.module.css';
import styles from './login.module.css';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [msg, setMsg] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signIn(email, password);
      setMsg('Signed in (demo).');
      router.push('/');
    } catch (err) {
      setMsg('Sign in failed.');
    }
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
            <h1 className={styles.title}>Sign In</h1>
            <p className={styles.lead}>Access your account to view orders, wishlist and more.</p>
          </header>

          <div className={styles.authCard}>
            <form onSubmit={submit} className={styles.authForm} aria-label="Sign in form">
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className={styles.rowActions}>
                <label>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />{' '}
                  Remember me
                </label>
                <Link href="/help" className={styles.linkMuted}>Forgot password?</Link>
              </div>

              <button className={`btn btn-primary ${styles.submitButton}`} type="submit">Sign In</button>
              {msg && <p className={styles.metaMsg}>{msg}</p>}

              <p className={styles.smallNote}>
                New here? <Link href="/register">Create an account</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

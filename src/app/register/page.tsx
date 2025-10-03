"use client";
import React, { useState } from 'react';
import pageStyles from '../page.module.css';
import styles from '../login/login.module.css';
import Link from 'next/link';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Demo success
    setMsg('Account created (demo). You can now sign in.');
  }

  const canSubmit = firstName.trim() && lastName.trim() && email.trim() && password && confirmPassword && password === confirmPassword;

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
                <label htmlFor="firstName" className={styles.fieldLabel}>First name</label>
                <input
                  id="firstName"
                  className={styles.inputControl}
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="lastName" className={styles.fieldLabel}>Last name</label>
                <input
                  id="lastName"
                  className={styles.inputControl}
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

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

              <div className={styles.fieldGroup}>
                <label htmlFor="confirmPassword" className={styles.fieldLabel}>Confirm password</label>
                <input
                  id="confirmPassword"
                  className={styles.inputControl}
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div role="alert" className={styles.metaMsg} style={{color: '#ef4444'}}>{error}</div>}

              <button className={`btn btn-primary ${styles.submitButton}`} type="submit" disabled={!canSubmit}>Create account</button>
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

"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../app/layout.module.css';
import { BRAND } from '../lib/site';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function validateEmail(v: string) {
    return /^\S+@\S+\.\S+$/.test(v);
  }

  async function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setStatus('sending');
    try {
      await new Promise((r) => setTimeout(r, 500));
      setStatus('success');
      setMessage('Subscribed — thanks!');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong.');
    }
  }

  return (
    <footer className={styles['k-footer']} role="contentinfo" aria-label="Site footer">
      <div className={styles['k-footerInner']}>
        <div className={styles['k-footerGrid']}>
          <div className={styles['k-footerCol']}>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <div className={styles['k-brandMark']} aria-hidden>👟</div>
              <div style={{fontWeight:700}}>kharido</div>
            </div>
            <p className={styles['k-brandIntro']} style={{marginTop:8}}>Your destination for curated sneakers — new drops, classics and exclusive collabs.</p>
          </div>

          <div className={styles['k-footerCol']}>
            <h4 className={styles['k-footerColTitle']}>Explore</h4>
            <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:6}}>
              <li><Link href="/new-arrivals">New Arrivals</Link></li>
              <li><Link href="/shop">Shop</Link></li>
              <li><Link href="/collections">Collections</Link></li>
              <li><Link href="/help">Help</Link></li>
            </ul>
          </div>

          <div className={styles['k-footerCol']}>
            <h4 className={styles['k-footerColTitle']}>Support</h4>
            <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:6}}>
              <li><Link href="/help">Help</Link></li>
              <li><Link href="/account">My Account</Link></li>
              <li><Link href="/orders">My Orders</Link></li>
              <li><Link href="/wishlist">Wishlist</Link></li>
            </ul>
          </div>

          <div className={styles['k-footerCol']}>
            <h4 className={styles['k-footerColTitle']}>Stay in the loop</h4>
            <form className={styles['k-newsletter']} onSubmit={onSubscribe} aria-label="Subscribe to newsletter">
              <label className="sr-only" htmlFor="footer-email">Email for newsletter</label>
              <input id="footer-email" className={styles['k-input']} placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" aria-required="true" />
              <button type="submit" className={styles['k-button']} aria-disabled={status === 'sending'} style={{marginLeft:8}}>
                {status === 'sending' ? 'Saving...' : 'Subscribe'}
              </button>
            </form>
            <div role="status" aria-live="polite" style={{marginTop:8, color: status === 'error' ? '#FFB4AB' : '#C7F9D9'}}>
              {message}
            </div>
          </div>
        </div>

        <div className={styles['k-footerBottom']}>
          <div className={styles['k-trustRow']}>
            <div className={styles['k-trustBadge']}>✓ Secure Checkout</div>
            <div className={styles['k-trustBadge']}>✓ Free Returns</div>
            <div className={styles['k-trustBadge']}>✓ 100% Authentic</div>
          </div>

          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div className={styles['k-paymentLogos']} aria-hidden>
              <div className="logo">Visa</div>
              <div className="logo">MC</div>
              <div className="logo">PayPal</div>
              <div className="logo">GPay</div>
            </div>
            <div style={{color:'#9CA3AF'}}>© 2025 Kharido. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

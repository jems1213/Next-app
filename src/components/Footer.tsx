"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../app/layout.module.css';
import { BRAND } from '../lib/site';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showTop, setShowTop] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 220);
    }
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      // demo: emulate network
      await new Promise((r) => setTimeout(r, 700));
      setStatus('success');
      setMessage('Thanks — you are subscribed!');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  function toggleSection(key: string) {
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));
  }

  return (
    <footer className={styles['k-footer']} role="contentinfo" aria-label="Site footer">
      <div className={styles['k-footerInner']}>
        <div className={styles['k-footerGrid']}>
          <div className={styles['k-footerCol']}>
            <div className={styles['k-brand']}>
              <div className={styles['k-brandMark']} aria-hidden>
                👟
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{BRAND}</h3>
                <p className={styles['k-brandIntro']}>Your destination for curated sneakers — new drops, classics and exclusive collabs.</p>
              </div>
            </div>

            <div>
              <h4 className={styles['k-footerColTitle']}>Stay in the loop</h4>
              <p style={{ color: '#D1D5DB', marginTop: 6 }}>Sign up for release alerts, early access and special offers.</p>
              <form className={styles['k-newsletter']} onSubmit={onSubscribe} aria-label="Subscribe to newsletter">
                <label className="sr-only" htmlFor="footer-email">Email for newsletter</label>
                <div className={styles['k-newsletter'] + ' ' + styles['k-inputIcon']} style={{ flex: 1 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" width="16" height="16" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                    <path d="M3 8.5v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                    <polyline points="3 8.5 12 13 21 8.5" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input id="footer-email" className={styles['k-input']} placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" aria-required="true" />
                </div>
                <button type="submit" className={styles['k-button']} aria-disabled={status === 'sending'}>
                  {status === 'sending' ? 'Saving...' : 'Subscribe'}
                </button>
              </form>

              <div role="status" aria-live="polite" style={{ marginTop: 8 }}>
                {status === 'error' ? <div style={{ color: '#FFB4AB' }}>{message}</div> : null}
                {status === 'success' ? <div style={{ color: '#C7F9D9' }}>{message}</div> : null}
              </div>

              <div className={styles['k-social']} aria-label="Follow us">
                <a href="#" aria-label="Follow us on Facebook"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.15h-1.1c-1.08 0-1.42.67-1.42 1.35V12h2.42l-.39 2.9h-2.03v7A10 10 0 0 0 22 12"/></svg></a>
                <a href="#" aria-label="Follow us on Instagram"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.5A4.5 4.5 0 1 0 16.5 13 4.5 4.5 0 0 0 12 8.5zM17.5 6a1 1 0 1 0 .001 2.001A1 1 0 0 0 17.5 6z"/></svg></a>
                <a href="#" aria-label="Follow us on X (Twitter)"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M22 5.92c-.63.28-1.3.48-2 .57a3.48 3.48 0 0 0-6 2v.28A9.9 9.9 0 0 1 3 5.1a3.5 3.5 0 0 0 1.08 4.66c-.52 0-1-.16-1.44-.4v.04a3.5 3.5 0 0 0 2.8 3.43c-.3.08-.6.12-.92.12-.22 0-.43-.02-.63-.06A3.5 3.5 0 0 0 6.5 18a7 7 0 0 1-4.3 1.5c-.28 0-.56-.02-.83-.06A9.9 9.9 0 0 0 8 21c6.07 0 9.4-5.02 9.4-9.4v-.43c.64-.46 1.15-1.04 1.56-1.7a6.9 6.9 0 0 1-1.96.53z"/></svg></a>
                <a href="#" aria-label="Follow us on YouTube"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.7-.9-2.1-1-2.9-.2-7.6-.2-7.6-.2s-4.7 0-7.6.2c-.4 0-1.3.1-2.1 1-.6.7-.8 2.4-.8 2.4S0 8 0 9.8v2.4C0 14.3.2 15.9.2 15.9s.2 1.7.8 2.4c.8.9 1.9.9 2.4 1 1.8.1 7.6.2 7.6.2s4.7 0 7.6-.2c.4 0 1.3-.1 2.1-1 .6-.7.8-2.4.8-2.4s.2-1.6.2-3.4v-2.4c0-1.8-.2-3.6-.2-3.6zM9.8 15.5V8.5l6.2 3.5-6.2 3.5z"/></svg></a>
              </div>
            </div>
          </div>

          <div className={styles['k-footerCol']}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 className={styles['k-footerColTitle']}>Explore</h4>
              <button className="sr-only" onClick={() => toggleSection('explore')} aria-expanded={!!openSections.explore} aria-controls="explore-links">Toggle</button>
            </div>
            <nav id="explore-links" className={styles['k-footerLinks']} aria-label="Explore links">
              <Link href="/new-arrivals">New Arrivals</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/collections">Collections</Link>
              <Link href="/help">Help</Link>
            </nav>
          </div>

          <div className={styles['k-footerCol']}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 className={styles['k-footerColTitle']}>Support</h4>
              <button className="sr-only" onClick={() => toggleSection('support')} aria-expanded={!!openSections.support} aria-controls="support-links">Toggle</button>
            </div>
            <nav id="support-links" className={styles['k-footerLinks']} aria-label="Support links">
              <Link href="/help">Help</Link>
              <Link href="/login">Account</Link>
              <Link href="/account">My Account</Link>
              <Link href="/orders">My Orders</Link>
              <Link href="/wishlist">Wishlist</Link>
              <Link href="/cart">Cart</Link>
            </nav>
          </div>

          <div className={styles['k-footerCol']}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 className={styles['k-footerColTitle']}>Company & Legal</h4>
              <button className="sr-only" onClick={() => toggleSection('company')} aria-expanded={!!openSections.company} aria-controls="company-links">Toggle</button>
            </div>
            <nav id="company-links" className={styles['k-footerLinks']} aria-label="Company links">
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/sitemap">Sitemap</Link>

              <div style={{ marginTop: 8 }}>
                <h5 style={{ margin: '8px 0 6px', fontSize: 13, color: '#D1D5DB' }}>Follow us</h5>
                <div className={styles['k-social']}>
                  <a href="#" aria-label="Follow us on Facebook">FB</a>
                  <a href="#" aria-label="Follow us on Instagram">IG</a>
                  <a href="#" aria-label="Follow us on X">X</a>
                  <a href="#" aria-label="Follow us on YouTube">YT</a>
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div className={styles['k-footerBottom']}>
          <div className={styles['k-trustRow']}>
            <div className={styles['k-trustBadge']}>✓ Secure Checkout</div>
            <div className={styles['k-trustBadge']}>✓ Free Returns</div>
            <div className={styles['k-trustBadge']}>✓ 100% Authentic Sneakers</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className={styles['k-paymentLogos']} aria-hidden>
              <div className="logo">Visa</div>
              <div className="logo">MC</div>
              <div className="logo">PayPal</div>
              <div className="logo">GPay</div>
              <div className="logo">Apple</div>
            </div>

            <div style={{ color: '#9CA3AF' }}>© 2025 Kharido. All rights reserved.</div>
          </div>
        </div>
      </div>

      {showTop ? (
        <button className={styles['k-backToTop']} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          ↑
        </button>
      ) : null}
    </footer>
  );
}

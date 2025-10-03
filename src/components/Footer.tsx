"use client";
import React from 'react';
import Link from "next/link";
import styles from "../app/layout.module.css";
import { BRAND } from '../lib/site';

export default function Footer() {
  function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    // lightweight demo feedback
    alert('Subscribed (demo)');
  }

  return (
    <footer className={`${styles.footer} ${styles.footerAnimate}`} role="contentinfo">
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrandCol}>
            <div className={styles.brandMarkSmall} aria-hidden>👟</div>
            <div>
              <h3 style={{margin:0, fontSize:20, fontWeight:800}}>{BRAND}</h3>
              <p className={styles.textMuted} style={{marginTop:6, maxWidth:320}}>Your destination for curated sneakers — new drops, classics and exclusive collabs.</p>
            </div>
          </div>

          <nav className={styles.footerCol} aria-label="Explore">
            <h4 className={styles.footerColTitle}>Explore</h4>
            <Link href="/new-arrivals">New Arrivals</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/help">Help</Link>
          </nav>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Account</h4>
            <Link href="/account">My Account</Link>
            <Link href="/orders">My Orders</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/cart">Cart</Link>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Stay in the loop</h4>
            <p className={styles.textMuted} style={{marginBottom:8}}>Sign up for release alerts, early access and special offers.</p>
            <form className={styles.newsletterForm} onSubmit={onSubscribe}>
              <input aria-label="Email for newsletter" placeholder="Enter your email" className={styles.newsletterInput} type="email" />
              <button className={`btn ${styles.newsletterButton}`} type="submit" style={{background:'#fff', color:'var(--color-foreground)', fontWeight:700}}>Subscribe</button>
            </form>

            <div className={styles.socialIcons}>
              <a aria-label="facebook" href="#">Facebook</a>
              <a aria-label="instagram" href="#">Instagram</a>
              <a aria-label="twitter" href="#">Twitter</a>
              <a aria-label="youtube" href="#">YouTube</a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerInner} style={{borderTop:'1px solid var(--muted-border)', marginTop:22, paddingTop:18}}>
        <div className={styles.textMuted}>© {new Date().getFullYear()} {BRAND} — All rights reserved.</div>
        <div className={styles.footerLinks}>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/sitemap">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}

import React from "react";
import Link from "next/link";
import styles from "../app/layout.module.css";
import { BRAND } from '../lib/site';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div>© {new Date().getFullYear()} {BRAND}</div>
        <div className={styles.footerLinks}>
          <Link href="/">Products</Link>
          <Link href="/checkout">Checkout</Link>
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a>
        </div>
      </div>
    </footer>
  );
}

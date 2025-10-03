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
          <span>Professional Store</span>
        </div>
      </div>
    </footer>
  );
}

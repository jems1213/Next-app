import Link from "next/link";
import styles from "../app/layout.module.css";
import { BRAND } from '../lib/site';

export default function Footer() {
  return (
    <footer className={`${styles.footer} ${styles.footerAnimate}`}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrandCol}>
          <div className={styles.brandMarkSmall} aria-hidden>👟</div>
          <div>
            <div style={{fontWeight:700}}>{BRAND}</div>
            <div className={styles.textMuted}>Premium sneakers and accessories</div>
          </div>
        </div>

        <div className={styles.footerCols}>
          <nav className={styles.footerCol} aria-label="Quick links">
            <h4 className={styles.footerColTitle}>Shop</h4>
            <Link href="/new-arrivals">New Arrivals</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/collections">Collections</Link>
          </nav>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Help</h4>
            <Link href="/help">Support</Link>
            <Link href="/checkout">Checkout</Link>
            <Link href="/register">Create account</Link>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Stay in touch</h4>
            <form className={styles.newsletterForm} onSubmit={(e)=>{e.preventDefault();alert('Subscribed (demo)')}}>
              <input aria-label="Email" placeholder="Your email" className={styles.newsletterInput} />
              <button className={`btn btn-primary ${styles.newsletterButton}`} type="submit">Subscribe</button>
            </form>
            <div className={styles.socialIcons}>
              <a aria-label="twitter" href="#">Twitter</a>
              <a aria-label="instagram" href="#">Instagram</a>
              <a aria-label="facebook" href="#">Facebook</a>
            </div>
          </div>
        </div>

      </div>

      <div className={styles.footerInner} style={{borderTop:'1px solid var(--muted-border)', marginTop:16, paddingTop:18}}>
        <div className={styles.textMuted}>© {new Date().getFullYear()} {BRAND}. All rights reserved.</div>
        <div className={styles.footerLinks}>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}

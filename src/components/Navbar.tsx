"use client";
import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../context/cart";
import styles from "../app/layout.module.css";
import FetchGuard from "./FetchGuard";
import { BRAND } from '../lib/site';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalQuantity, savedItems } = useCart();
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const brandName = BRAND || 'SneakerHub';

  return (
    <header className={styles.header}>
      <FetchGuard />
      <nav className={[styles.navbar, scrolled && styles.navbarScrolled].filter(Boolean).join(' ')} aria-label="Main navigation">
        <div className={styles.navInner}>
          <Link href="/" prefetch={false} className={styles.brandLink} aria-label="Home">
            <span className={styles.brandEmoji}>👟</span>
            <span className={styles.brandTitle}>{brandName}</span>
          </Link>

          <div className={styles.centerNav}>
            <ul className={styles.navList} role="navigation">
              <li className={styles.navItem}><Link href="/new-arrivals" prefetch={false}>New Arrivals <span className={styles.navPill}>New</span></Link></li>
              <li className={styles.navItem}><Link href="/shop" prefetch={false}>Shop</Link></li>
              <li className={styles.navItem}><Link href="/collections" prefetch={false}>Collections</Link></li>
              <li className={styles.navItem}><Link href="/help" prefetch={false}>Help</Link></li>
            </ul>
          </div>

          <div className={styles.navActions}>
            <Link href="/wishlist" prefetch={false} aria-label="View wishlist" className={styles.iconButton}>
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              {mounted && savedItems && savedItems.length > 0 ? <span className={styles.wishlistBadge}>{savedItems.length}</span> : null}
            </Link>

            <Link href="/cart" prefetch={false} aria-label="View cart" className={styles.iconButton}>
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              {mounted && typeof totalQuantity === 'number' && totalQuantity > 0 ? <span className={styles.cartBadge}>{totalQuantity}</span> : null}
            </Link>

            <Link href="/login" prefetch={false} className={styles.signInButton}>Sign In</Link>
          </div>
        </div>

        <button className={styles.menuButton} aria-label="Open menu">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </nav>
    </header>
  );
}

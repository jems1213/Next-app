"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import styles from "../app/layout.module.css";
import FetchGuard from "./FetchGuard";
import { BRAND } from '../lib/site';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalQuantity, savedItems } = useCart();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
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

  const accountRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handlePointer(e: MouseEvent | TouchEvent) {
      if (!accountRef.current) return;
      const target = e.target as Node | null;
      if (!target) return;
      if (accountRef.current.contains(target)) return;
      setMenuOpen(false);
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('touchstart', handlePointer);
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('touchstart', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const brandName = BRAND || 'SneakerHub';

  return (
    <header className={styles.header}>
      <FetchGuard />
      <nav className={[styles.navbar, scrolled && styles.navbarScrolled].filter(Boolean).join(' ')} aria-label="Main navigation" style={{padding: '6px 12px'}}>
        <div className={styles.navInner} style={{padding: '0 12px', gap: 8}}>
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

            {mounted && user ? (
              <div ref={accountRef} className={styles.accountAvatarButton}>
                <button aria-label="Account" className={`${styles.iconButton} ${styles.accountAvatarBtn}`} onClick={() => setMenuOpen((s) => !s)}>
                  <div className={styles.accountAvatar}>
                    {user.avatar ? <img src={user.avatar} alt={user.name} /> : <span aria-hidden>{user.name?.charAt(0)?.toUpperCase()}</span>}
                  </div>
                </button>

                {menuOpen ? (
                  <div className={styles.accountMenu}>
                    <div className={styles.accountHeader}>
                      <div className={styles.accountName}>{user.name}</div>
                      <div className={styles.accountEmail}>{user.email}</div>
                    </div>

                    <div className={styles.accountMenuList}>
                      <Link href="/account" className={styles.accountMenuItem} onClick={() => setMenuOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" /><path d="M6 20v-1c0-2.2 3.134-4 6-4s6 1.8 6 4v1" /></svg>
                        <span>My Account</span>
                      </Link>

                      <Link href="/orders" className={styles.accountMenuItem} onClick={() => setMenuOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7h18" /><path d="M6 7v13" /><path d="M18 7v13" /><path d="M9 7v13" /></svg>
                        <span>My Orders</span>
                      </Link>

                      <Link href="/wishlist" className={styles.accountMenuItem} onClick={() => setMenuOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                        <span>Wishlist</span>
                      </Link>

                      <Link href="/cart" className={styles.accountMenuItem} onClick={() => setMenuOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /></svg>
                        <span>Cart</span>
                      </Link>

                      <button onClick={() => { signOut(); setMenuOpen(false); }} className={styles.accountMenuItem}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 16l4-4m0 0l-4-4m4 4H7" /><path d="M7 8v8" /></svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link href="/login" prefetch={false} className={styles.signInButton}>Sign In</Link>
            )}
          </div>
        </div>

        <button className={styles.menuButton} aria-label="Open menu">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </nav>
    </header>
  );
}

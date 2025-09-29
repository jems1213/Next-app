"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../context/cart";
import styles from "../app/layout.module.css";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalQuantity } = useCart();
  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const search = q.trim();
    if (search) router.push(`/?q=${encodeURIComponent(search)}`);
    else {
      if (pathname !== '/') router.push('/');
    }
  }

  return (
    <header className={styles.header}>
      <nav className={styles.navbar} aria-label="Main navigation">
        <div className={styles.brand}>
          <Link href="/" aria-label="Home">
            <img src="/next.svg" alt="Logo" className={styles.brandLogo} />
          </Link>
          Shop
        </div>

        <div className={styles.navLinks} role="navigation" aria-hidden={false}>
          <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>Products</Link>
          <Link href="/orders">Orders</Link>
        </div>

        <form className={styles.searchForm} onSubmit={onSubmit} role="search">
          <input
            className={styles.searchInput}
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search products"
          />
        </form>

        <Link href="/checkout" className={styles.cartLink} aria-label="Cart">
          Cart{mounted ? (typeof totalQuantity === 'number' ? ` (${totalQuantity})` : '') : ''}
        </Link>
      </nav>
    </header>
  );
}

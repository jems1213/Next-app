"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../app/page.module.css";
import { useCart } from "../context/cart";

export default function ProductListClient({ products }: { products: any[] }) {
  const { addItem, totalQuantity } = useCart();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [mounted, setMounted] = useState(false);
  const [qDebounced, setQDebounced] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // debounce query input
  useEffect(() => {
    const t = setTimeout(() => setQDebounced(query), 220);
    return () => clearTimeout(t);
  }, [query]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered = products.filter((p) => {
    const matchesQ = p.title.toLowerCase().includes(qDebounced.toLowerCase());
    const matchesC = category === "all" ? true : p.category === category;
    return matchesQ && matchesC;
  });

  // reveal on scroll for cards
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(`.${styles.card}`)) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('in-view');
      });
    }, { threshold: 0.08 });
    els.forEach((el) => {
      el.classList.add('reveal');
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, [filtered]);

  function handleAdd(p: any, btnRef: HTMLButtonElement | null) {
    addItem({ id: p.id, title: p.title, price: p.price, image: p.image });
    if (btnRef) {
      btnRef.classList.add('pulse');
      setTimeout(() => btnRef.classList.remove('pulse'), 360);
    }
  }

  return (
    <div>
      <div className={styles.filtersBar}>
        <input
          className={styles.searchField}
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products"
        />

        <select
          className={styles.categorySelect}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className={styles.cartShortcut}>
          <Link href="/cart" className={styles.cartPill}>
            Cart{mounted ? ` (${totalQuantity})` : ''}
          </Link>
        </div>
      </div>

      <section className={styles.grid}>
        {filtered.map((p) => (
          <article key={p.id} className={styles.card}>
            <Link href={`/products/${p.id}`} className={styles.cardLink}>
              <div className={styles.imageWrap}>
                <Image src={p.image} alt={p.title} width={240} height={240} className={styles.productImage} unoptimized loading="lazy" />
              </div>
              <h3 title={p.title} className={styles.productTitle}>{p.title}</h3>
              <p className={styles.productCategory}>{p.category}</p>
              <p className={styles.productPrice}>${p.price.toFixed(2)}</p>
            </Link>

            <div className={styles.controlsGroup}>
              <button
                ref={(el) => { /* ref placeholder for per-button animation */ }}
                className={styles.addButton}
                onClick={(e) => handleAdd(p, e.currentTarget)}
                aria-label={`Add ${p.title} to cart`}
              >
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

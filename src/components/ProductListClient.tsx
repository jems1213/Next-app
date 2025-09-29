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

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered = products.filter((p) => {
    const matchesQ = p.title.toLowerCase().includes(query.toLowerCase());
    const matchesC = category === "all" ? true : p.category === category;
    return matchesQ && matchesC;
  });

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
          <Link href="/checkout" className={styles.cartPill}>
            Cart{mounted ? ` (${totalQuantity})` : ''}
          </Link>
        </div>
      </div>

      <section className={styles.grid}>
        {filtered.map((p) => (
          <article key={p.id} className={styles.card}>
            <Link href={`/products/${p.id}`} className={styles.cardLink}>
              <div className={styles.imageWrap}>
                <Image src={p.image} alt={p.title} width={240} height={240} className={styles.productImage} unoptimized />
              </div>
              <h3 className={styles.productTitle}>{p.title}</h3>
              <p className={styles.productPrice}>${p.price.toFixed(2)}</p>
            </Link>

            <div className={styles.controlsGroup}>
              <button
                className={styles.addButton}
                onClick={() => addItem({ id: p.id, title: p.title, price: p.price, image: p.image })}
              >
                Add
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../app/page.module.css";
import { useCart } from "../context/cart";
import WishlistButton from "./WishlistButton";

export default function RelatedProducts({ products }: { products: any[] }) {
  const { addItem } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function handleAdd(p: any, btnRef: HTMLButtonElement | null) {
    addItem({ id: p.id, title: p.title, price: p.price, image: p.image });
    try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: `${p.title} added to cart.`, type: 'success' } })); } catch (e) {}
    if (btnRef) {
      btnRef.classList.add('pulse');
      setTimeout(() => btnRef.classList.remove('pulse'), 360);
    }
  }

  if (!products || products.length === 0) return null;

  return (
    <section>
      <h2 style={{ margin: '12px 0 8px' }}>Related products</h2>
      <section className={styles.grid}>
        {products.map((p) => (
          <article key={p.id} className={styles.card}>
            <WishlistButton product={p} />

            <Link href={`/products/${p.id}`} prefetch={false} className={styles.cardLink}>
              <div className={styles.imageWrap}>
                <Image src={p.image} alt={p.title} width={240} height={240} className={styles.productImage} unoptimized loading="lazy" />
              </div>
              <h3 title={p.title} className={styles.productTitle}>{p.title}</h3>
              <p className={styles.productCategory}>{p.category}</p>
              <p className={styles.productPrice}>${p.price.toFixed(2)}</p>
            </Link>

            <div className={styles.controlsGroup}>
              <button
                ref={(el) => { /* placeholder */ }}
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
    </section>
  );
}

"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/cart';
import styles from '../app/page.module.css';

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const { addItem, addToSaved } = useCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [done, setDone] = useState(false);

  // size & color UI (falls back to sensible defaults when product has none)
  const sizes = product?.sizes ?? ['S', 'M', 'L', 'XL'];
  const colors = product?.colors ?? ['Black', 'White', 'Gray', 'Blue'];
  const [size, setSize] = useState<string>(sizes[0]);
  const [color, setColor] = useState<string>(colors[0]);

  function onAdd() {
    setAdding(true);
    try {
      addItem({ id: product.id, title: product.title, price: Number(product.price), image: product.image, options: { size, color } }, qty);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } finally {
      setAdding(false);
    }
  }

  function onBuyNow() {
    // add to cart and navigate to cart/checkout
    addItem({ id: product.id, title: product.title, price: Number(product.price), image: product.image, options: { size, color } }, qty);
    router.push('/cart');
  }

  function onAddToWishlist() {
    addToSaved({ id: product.id, title: product.title, price: Number(product.price), image: product.image, options: { size, color } });
  }

  return (
    <div className={styles.productActions}>
      <div className={styles.priceRow}>
        <div className={styles.productPriceLarge}>${Number(product.price).toFixed(2)}</div>
        <div className={styles.ratingBadge}>{product.rating?.rate ?? 4.5} ★</div>
      </div>

      <div className={styles.optionRow}>
        <div className={styles.optionLabel}>Size</div>
        <div className={styles.sizeList} role="list">
          {sizes.map((s: string) => (
            <button
              key={s}
              type="button"
              role="listitem"
              aria-pressed={size === s}
              className={`${styles.sizeOption} ${size === s ? styles.sizeSelected : ''}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.optionRow}>
        <div className={styles.optionLabel}>Color</div>
        <div className={styles.swatchList} role="list">
          {colors.map((c: string) => (
            <button
              key={c}
              type="button"
              role="listitem"
              aria-pressed={color === c}
              className={`${styles.swatch} ${color === c ? styles.swatchSelected : ''}`}
              onClick={() => setColor(c)}
              aria-label={c}
            >
              <span className={styles.swatchInner} />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controlsGroup}>
        <label className={styles.label}>Quantity</label>
        <div className={styles.qtyRow}>
          <input
            aria-label="Quantity"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
            className={styles.qtyInput}
          />

          <button className={styles.addButton} onClick={onAdd} disabled={adding}>
            {adding ? 'Adding...' : 'Add to cart'}
          </button>
        </div>
      </div>

      <div className={styles.buttonRow}>
        <button className={`btn btn-primary ${styles.animatedButton}`} onClick={onBuyNow}>Buy now</button>
        <button className={`btn ${styles.ghostButton} ${styles.animatedButton}`} onClick={onAddToWishlist}>Add to wishlist</button>
      </div>

      {done && <div className={styles.successBadge}>Added to cart</div>}

    </div>
  );
}

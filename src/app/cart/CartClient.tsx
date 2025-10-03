"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/cart";
import styles from "./cart.module.css";

export default function CartClient({ initialItems }: { initialItems?: any[] }) {
  const { items, savedItems, addItem, removeItem, updateItem, clear, totalQuantity, saveForLater, moveToCart } = useCart();

  const displayItems = (items && items.length) ? items : (initialItems ?? []);

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [shippingCountry, setShippingCountry] = useState("US");
  const [shippingZip, setShippingZip] = useState("");
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [showMini, setShowMini] = useState(false);

  const subtotal = useMemo(() => displayItems.reduce((s, i) => s + i.price * i.quantity, 0), [displayItems]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon === "SAVE10") return subtotal * 0.10;
    if (appliedCoupon === "SAVE20") return subtotal * 0.20;
    return 0;
  }, [appliedCoupon, subtotal]);

  const shipping = useMemo(() => {
    if (appliedCoupon === "FREESHIP") return 0;
    if (shippingCost !== null) return shippingCost;
    return 0;
  }, [appliedCoupon, shippingCost]);

  const total = Math.max(0, subtotal - discount + shipping);

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    if (code === "SAVE10" || code === "SAVE20" || code === "FREESHIP") {
      setAppliedCoupon(code);
      setCoupon("");
    } else {
      // invalid coupon simple UX
      setAppliedCoupon(null);
      setCoupon("");
      alert("Invalid coupon code");
    }
  }

  function estimateShipping() {
    // simple estimator
    const country = shippingCountry;
    let cost = 0;
    if (country === "US") cost = 5;
    else if (country === "CA") cost = 10;
    else cost = 15;
    // simple zipcode modifier
    if (shippingZip && shippingZip.match(/\d{5}/)) cost = Math.max(0, cost - 2);
    setShippingCost(cost);
  }

  if (!displayItems || displayItems.length === 0) {
    return (
      <div className={styles.emptyCard}>
        <h3 className={styles.emptyTitle}>Your cart is empty</h3>
        <p className={styles.emptyLead}>Find something you love and add it to your cart.</p>
        <Link href="/" className={styles.browseButton}>Browse products</Link>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Shopping Cart</h2>
        <div className={styles.headerActions}>
          <button className={styles.clearButton} onClick={() => { if (confirm('Clear cart?')) clear(); }}>Clear cart</button>
          <button className={styles.miniToggle} onClick={() => setShowMini((s) => !s)} aria-pressed={showMini}>{showMini ? 'Hide' : 'Mini'}</button>
        </div>
      </div>

      <ul className={styles.itemsList}>
        {displayItems.map((it) => (
          <li key={it.id} className={styles.itemRow}>
            <div className={styles.itemMedia}>
              {it.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.image} alt={it.title} className={styles.itemImage} />
              ) : (
                <div className={styles.fallbackImage} />
              )}
            </div>

            <div className={styles.itemInfo}>
              <div className={styles.itemTitle}>{it.title}</div>
              <div className={styles.itemMeta}>
                <div className={styles.itemPrice}>${it.price.toFixed(2)}</div>
                <div className={styles.quantityControl}>
                  <button className={styles.qtyBtn} onClick={() => updateItem(it.id, Math.max(0, it.quantity - 1))} aria-label={`Decrease ${it.title}`}>−</button>
                  <input className={styles.qtyInput} type="number" min={1} value={it.quantity} onChange={(e) => updateItem(it.id, Number(e.target.value) || 1)} />
                  <button className={styles.qtyBtn} onClick={() => updateItem(it.id, it.quantity + 1)} aria-label={`Increase ${it.title}`}>+</button>
                </div>
              </div>

              <div className={styles.itemActions}>
                <button className={styles.linkButton} onClick={() => saveForLater(it.id)}>Save for later</button>
                <button className={styles.ghostButton} onClick={() => removeItem(it.id)}>Remove</button>
                <Link href={`/products/${it.id}`} className={styles.viewButton}>View</Link>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {savedItems && savedItems.length > 0 && (
        <div className={styles.savedSection}>
          <h3 className={styles.savedTitle}>Saved for later</h3>
          <ul className={styles.savedList}>
            {savedItems.map((s) => (
              <li key={s.id} className={styles.savedRow}>
                <div className={styles.savedInfo}>{s.title}</div>
                <div className={styles.savedActions}>
                  <button className={styles.primaryButton} onClick={() => moveToCart(s.id, 1)}>Move to cart</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.rightColumn}>
        <div className={styles.couponRow}>
          <input className={styles.input} placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
          <button className={styles.applyButton} onClick={applyCoupon}>Apply</button>
        </div>

        <div className={styles.shippingRow}>
          <div className={styles.shippingTitle}>Estimate shipping</div>
          <select className={styles.input} value={shippingCountry} onChange={(e) => setShippingCountry(e.target.value)}>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="IN">India</option>
            <option value="AU">Australia</option>
            <option value="OTHER">Other</option>
          </select>
          <input className={styles.input} placeholder="Postal code" value={shippingZip} onChange={(e) => setShippingZip(e.target.value)} />
          <button className={styles.estimateButton} onClick={estimateShipping}>Estimate</button>
          {shippingCost !== null && <div className={styles.shippingResult}>Estimated: ${shippingCost.toFixed(2)}</div>}
        </div>

        <div className={styles.summaryRow}>
          <div className={styles.summaryLine}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className={styles.summaryLine}><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
          <div className={styles.summaryLine}><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
          <div className={styles.summaryTotal}><span>Total</span><strong>${total.toFixed(2)}</strong></div>
          <Link href="/checkout" className={styles.checkoutButton}>Proceed to checkout</Link>
        </div>
      </div>

      {/* Mini cart preview */}
      <div className={`${styles.miniCart} ${showMini ? styles.miniOpen : ""}`} aria-hidden={!showMini}>
        <div className={styles.miniHeader}>Mini cart ({totalQuantity})</div>
        <ul className={styles.miniItems}>
          {displayItems.slice(0, 5).map((it) => (
            <li key={it.id} className={styles.miniItem}>
              <div className={styles.miniTitle}>{it.title}</div>
              <div className={styles.miniQty}>{it.quantity} × ${it.price.toFixed(2)}</div>
            </li>
          ))}
        </ul>
        <div className={styles.miniFooter}>
          <Link href="/cart" className={styles.viewCartButton}>View cart</Link>
          <Link href="/checkout" className={styles.checkoutPill}>Checkout</Link>
        </div>
      </div>
    </div>
  );
}

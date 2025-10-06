"use client";
import React from 'react';
import styles from '../app/page.module.css';
import { useCart } from '../context/cart';

export default function WishlistButton({ product }: { product: any }) {
  const { savedItems, addToSaved, removeFromSaved } = useCart();
  const exists = savedItems.some((s) => String(s.id) === String(product.id));
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // hide floating wishlist icon on standalone product detail pages
  if (mounted && typeof window !== 'undefined' && window.location.pathname.startsWith('/products/')) {
    return null;
  }

  const renderedExists = mounted ? exists : false;

  function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (exists) {
      removeFromSaved(product.id);
      try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: `${product.title} removed from wishlist.`, type: 'info' } })); } catch (e) {}
    } else {
      addToSaved({ id: product.id, title: product.title, price: product.price, image: product.image });
      try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: `${product.title} added to wishlist.`, type: 'success' } })); } catch (e) {}
    }
  }

  return (
    <button
      className={`${styles.wishlistIcon} ${renderedExists ? 'hearted' : ''}`}
      onClick={toggle}
      aria-pressed={renderedExists}
      aria-label={renderedExists ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {renderedExists ? (
        <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z" fill="white" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )}
    </button>
  );
}

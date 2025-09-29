"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  id: number;
  title: string;
  price: number;
  image?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
  totalQuantity: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readCartFromStorage(): CartItem[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("cart");
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function writeCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
    // keep a cookie copy so server-side pages can access cart
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(items))}; path=/; max-age=3600`;
  } catch {}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readCartFromStorage());

  useEffect(() => {
    writeCartToStorage(items);
  }, [items]);

  useEffect(() => {
    // sync across tabs
    function onStorage(e: StorageEvent) {
      if (e.key === "cart") {
        setItems(readCartFromStorage());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = (item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        copy[idx].quantity += qty;
      } else {
        copy.push({ ...item, quantity: qty });
      }
      return copy;
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clear = () => setItems([]);

  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, totalQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

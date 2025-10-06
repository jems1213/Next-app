"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  id: number;
  title: string;
  price: number;
  image?: string;
  quantity: number;
  options?: Record<string, string>;
};

type CartContextValue = {
  items: CartItem[];
  savedItems: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, quantity: number) => void;
  clear: () => void;
  totalQuantity: number;
  saveForLater: (id: number) => void;
  addToSaved: (item: Omit<CartItem, "quantity">) => void;
  removeFromSaved: (id: number) => void;
  moveToCart: (id: number, qty?: number) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readJsonStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJsonStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readJsonStorage<CartItem[]>("cart", []));
  const [savedItems, setSavedItems] = useState<CartItem[]>(() => readJsonStorage<CartItem[]>("saved_cart", []));

  useEffect(() => {
    writeJsonStorage("cart", items);
    // keep a cookie copy so server-side pages can access cart
    try {
      document.cookie = `cart=${encodeURIComponent(JSON.stringify(items))}; path=/; max-age=3600`;
    } catch {}
  }, [items]);

  useEffect(() => {
    writeJsonStorage("saved_cart", savedItems);
  }, [savedItems]);

  useEffect(() => {
    // sync across tabs
    function onStorage(e: StorageEvent) {
      if (e.key === "cart") setItems(readJsonStorage("cart", []));
      if (e.key === "saved_cart") setSavedItems(readJsonStorage("saved_cart", []));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Rehydrate from localStorage on mount to ensure client-side state reflects any items added earlier
  useEffect(() => {
    try {
      setItems(readJsonStorage("cart", []));
      setSavedItems(readJsonStorage("saved_cart", []));
    } catch {}
  }, []);

  const addItem = (item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const copy = [...prev];
      const normalize = (o?: Record<string, string>) => JSON.stringify(o || {});
      const idx = copy.findIndex((i) => i.id === item.id && normalize(i.options) === normalize((item as any).options));
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

  const updateItem = (id: number, quantity: number) => {
    setItems((prev) => {
      const copy = prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i));
      return copy.filter((i) => i.quantity > 0);
    });
  };

  const clear = () => setItems([]);

  const saveForLater = (id: number) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx < 0) return prev;
      const item = prev[idx];
      setSavedItems((s) => {
        const exists = s.find((x) => x.id === id);
        if (exists) return s;
        return [...s, { ...item, quantity: 1 }];
      });
      const next = prev.filter((i) => i.id !== id);
      return next;
    });
  };

  // add any item directly to saved items (wishlist) without removing from cart
  const addToSaved = (item: Omit<CartItem, 'quantity'>) => {
    setSavedItems((s) => {
      const exists = s.find((x) => x.id === item.id);
      if (exists) return s;
      return [...s, { ...item, quantity: 1 }];
    });
  };

  const moveToCart = (id: number, qty = 1) => {
    setSavedItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx < 0) return prev;
      const item = prev[idx];
      addItem({ id: item.id, title: item.title, price: item.price, image: item.image }, qty);
      return prev.filter((i) => i.id !== id);
    });
  };

  const removeFromSaved = (id: number) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, savedItems, addItem, removeItem, updateItem, clear, totalQuantity, saveForLater, addToSaved, removeFromSaved, moveToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

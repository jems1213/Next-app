"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import OrdersClient from "../orders/OrdersClient";
import { useCart } from "../../context/cart";
import styles from "./profile.module.css";

const MENU = [
  "Profile",
  "My Orders",
  "Wishlist",
  "Addresses",
  "Payment Methods",
  "Account Settings",
];

function readJson<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function ProfilePage() {
  const { signOut } = useAuth();
  const { savedItems, moveToCart, removeFromSaved } = useCart();
  const [active, setActive] = useState<string>("Profile");

  // Addresses state
  const [addresses, setAddresses] = useState<any[]>(() => readJson<any[]>("addresses", []));
  const [addressForm, setAddressForm] = useState({ label: "Home", fullName: "", street: "", city: "", state: "", zip: "", country: "", phone: "" });

  // Payment methods
  const [cards, setCards] = useState<any[]>(() => readJson<any[]>("payment_methods", []));
  const [cardForm, setCardForm] = useState({ name: "", number: "", expiry: "" });

  // Account settings
  const [prefs, setPrefs] = useState(() => readJson<{ newsletter: boolean; marketing: boolean }>("preferences", { newsletter: true, marketing: false }));
  const [connected, setConnected] = useState<{ provider: string; connected: boolean }[]>(() => readJson("connected_accounts", [{ provider: "Google", connected: false }, { provider: "GitHub", connected: false }]));
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => writeJson("addresses", addresses), [addresses]);
  useEffect(() => writeJson("payment_methods", cards), [cards]);
  useEffect(() => writeJson("preferences", prefs), [prefs]);
  useEffect(() => writeJson("connected_accounts", connected), [connected]);

  function addAddress(e?: React.FormEvent) {
    e?.preventDefault();
    const id = Date.now().toString(36);
    setAddresses((s) => [...s, { id, ...addressForm }]);
    setAddressForm({ label: "Home", fullName: "", street: "", city: "", state: "", zip: "", country: "", phone: "" });
  }

  function removeAddress(id: string) {
    setAddresses((s) => s.filter((a) => a.id !== id));
  }

  function addCard(e?: React.FormEvent) {
    e?.preventDefault();
    const id = Date.now().toString(36);
    const last4 = cardForm.number.replace(/\D/g, "").slice(-4);
    setCards((s) => [...s, { id, name: cardForm.name, last4, expiry: cardForm.expiry }]);
    setCardForm({ name: "", number: "", expiry: "" });
  }

  function removeCard(id: string) {
    setCards((s) => s.filter((c) => c.id !== id));
  }

  function toggleConnected(provider: string) {
    setConnected((c) => c.map((x) => (x.provider === provider ? { ...x, connected: !x.connected } : x)));
  }

  function updatePassword(e?: React.FormEvent) {
    e?.preventDefault();
    if (password.next.length < 6) {
      window.alert("Password must be at least 6 characters");
      return;
    }
    if (password.next !== password.confirm) {
      window.alert("Passwords do not match");
      return;
    }
    // demo: store a simple encoded password (NOT secure)
    writeJson("account_password", btoa(password.next));
    setPassword({ current: "", next: "", confirm: "" });
    window.alert("Password updated");
  }

  return (
    <section className={styles.profileSection}>
      <div className={styles.profileContainer}>
        <aside className={styles.sidebar} aria-label="Profile navigation">
          <div className={styles.userHeader}>
            <div className={styles.userAvatar} aria-hidden>
              <span>J</span>
            </div>
            <div className={styles.userMeta}>
              <div className={styles.userName}>javiyajems</div>
              <div className={styles.userEmail}>javiyajems@gmail.com</div>
            </div>
          </div>

          <nav className={styles.menu} role="tablist" aria-orientation="vertical">
            {MENU.map((label) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={active === label}
                className={`${styles.menuItem} ${active === label ? styles.menuItemActive : ""}`}
                onClick={() => setActive(label)}
              >
                <span className={styles.menuBullet} />
                <span className={styles.menuLabel}>{label}</span>
              </button>
            ))}

            <button
              type="button"
              className={`${styles.menuItem} ${styles.signOut}`}
              onClick={signOut}
            >
              <span className={styles.menuBullet} />
              <span className={styles.menuLabel}>Sign Out</span>
            </button>
          </nav>

          <div className={styles.sidebarFooter}>
            <span className={styles.memberSinceLabel}>Member since</span>
            <span className={styles.memberSinceDate}>7/1/2025</span>
          </div>
        </aside>

        <div className={styles.content}>
          <h1 className={styles.pageTitle}>{active}</h1>

          <div className={styles.card}>
            {active === "Profile" && (
              <>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Username</div>
                  <div className={styles.infoValue}>javiyajems</div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Email</div>
                  <div className={styles.infoValue}>javiyajems@gmail.com</div>
                </div>
              </>
            )}

            {active === "My Orders" && (
              <div>
                {/* Reuse OrdersClient to show stored orders */}
                <OrdersClient />
              </div>
            )}

            {active === "Wishlist" && (
              <div>
                <p className="text-muted">Your wishlist items will be shown here.</p>
              </div>
            )}

            {active === "Addresses" && (
              <div>
                <p className="text-muted">Manage your shipping and billing addresses.</p>
              </div>
            )}

            {active === "Payment Methods" && (
              <div>
                <p className="text-muted">Add, remove and manage saved payment cards.</p>
              </div>
            )}

            {active === "Account Settings" && (
              <div>
                <p className="text-muted">Update password, preferences and connected accounts.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

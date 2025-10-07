"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import OrdersClient from "../orders/OrdersClient";
import { useCart } from "../../context/cart";
import styles from "./profile.module.css";
import ConfirmDialog from "../../components/ConfirmDialog";

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
  const { signOut, user: authUser, update } = useAuth();
  const { savedItems, moveToCart, removeFromSaved } = useCart();
  const [active, setActive] = useState<string>("Profile");
  const [mounted, setMounted] = useState(false);
  const [confirmSignOutOpen, setConfirmSignOutOpen] = useState(false);

  const [serverUser, setServerUser] = useState<any | null>(null);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  const [serverWishlistCount, setServerWishlistCount] = useState<number | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');

  async function saveEmail() {
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailDraft }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to update');
      const json = await res.json();
      if (json && json.user) {
        setServerUser(json.user);
        setEditingEmail(false);
        try { update({ name: json.user.name, email: json.user.email }); } catch {}
      }
    } catch (e: any) {
      window.alert(e?.message || 'Failed to update email');
    }
  }

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

  useEffect(() => {
    setMounted(true);
  }, []);

  // fetch profile info (created_at, orders count)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/profile', { credentials: 'include' });
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        if (json && json.user) {
          setServerUser(json.user);
          setOrdersCount(json.ordersCount ?? null);
          setServerWishlistCount(json.wishlistCount ?? null);
          setNameDraft(json.user.name || json.user.email.split('@')[0] || '');
          // update auth context name if missing
          if (authUser && (!authUser.name || authUser.name !== json.user.name)) {
            try { update({ name: json.user.name }); } catch {}
          }
        }
      } catch (e) {}
    })();
    return () => { mounted = false; };
  }, [authUser?.email]);

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

  async function saveName() {
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameDraft }),
      });
      if (!res.ok) throw new Error('Failed to update name');
      const json = await res.json();
      if (json && json.user) {
        setServerUser(json.user);
        try { update({ name: json.user.name }); } catch {}
        setEditingName(false);
      }
    } catch (e: any) {
      window.alert(e?.message || 'Failed to update');
    }
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

  return (<>
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
              onClick={() => setConfirmSignOutOpen(true)}
            >
              <span className={styles.menuBullet} />
              <span className={styles.menuLabel}>Sign Out</span>
            </button>
          </nav>

          <div className={styles.sidebarFooter}>
            <span className={styles.memberSinceLabel}>Member since</span>
            <span className={styles.memberSinceDate}>{serverUser?.created_at ? new Date(serverUser.created_at).toLocaleDateString() : '—'}</span>
          </div>
        </aside>

        <div className={styles.content}>
          <h1 className={styles.pageTitle}>{active}</h1>

          <div className={styles.card}>
            {active === "Profile" && (
              <>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Username</div>
                  <div className={styles.infoValue}>
                    {editingName ? (
                      <form onSubmit={(e) => { e.preventDefault(); saveName(); }} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} />
                        <button className="btn btn-primary" type="submit">Save</button>
                        <button type="button" className="btn" onClick={() => { setEditingName(false); setNameDraft(serverUser?.name || authUser?.email?.split('@')[0] || ''); }}>Cancel</button>
                      </form>
                    ) : (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div>{serverUser?.name || authUser?.name || (authUser?.email || '—').split('@')[0]}</div>
                        <button className="btn" onClick={() => { setEditingName(true); setNameDraft(serverUser?.name || authUser?.name || (authUser?.email || '').split('@')[0] || ''); }}>Edit</button>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Email</div>
                  <div className={styles.infoValue}>
                    {editingEmail ? (
                      <form onSubmit={(e) => { e.preventDefault(); saveEmail(); }} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input value={emailDraft} onChange={(e) => setEmailDraft(e.target.value)} />
                        <button className="btn btn-primary" type="submit">Save</button>
                        <button type="button" className="btn" onClick={() => { setEditingEmail(false); setEmailDraft(serverUser?.email || authUser?.email || ''); }}>Cancel</button>
                      </form>
                    ) : (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div>{serverUser?.email || authUser?.email || '—'}</div>
                        <button className="btn" onClick={() => { setEditingEmail(true); setEmailDraft(serverUser?.email || authUser?.email || ''); }}>Edit</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account stats */}
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Account created</div>
                  <div className={styles.infoValue}>{serverUser?.created_at ? new Date(serverUser.created_at).toLocaleDateString() : (mounted ? '—' : '—')}</div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Total orders</div>
                  <div className={styles.infoValue}>{ordersCount !== null ? ordersCount : (mounted ? '—' : '—')}</div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Total wishlisted</div>
                  <div className={styles.infoValue}>{serverWishlistCount !== null ? serverWishlistCount : (mounted ? (savedItems ? savedItems.length : 0) : 0)}</div>
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
              <div className={styles.wishlistList}>
                {savedItems && savedItems.length > 0 ? (
                  savedItems.map((it) => (
                    <div key={it.id} className={styles.wishlistRow}>
                      <div className={styles.wishlistThumb}>
                        {it.image ? <img src={it.image} alt={it.title} /> : <div className={styles.wishlistPlaceholder}>{it.title?.[0] ?? 'P'}</div>}
                      </div>
                      <div className={styles.wishlistInfo}>
                        <div className={styles.wishlistTitle}>{it.title}</div>
                        <div className="text-muted">${Number(it.price).toFixed(2)}</div>
                      </div>
                      <div className={styles.wishlistActions}>
                        <button className="btn" onClick={() => moveToCart(it.id)}>Add to cart</button>
                        <button className="btn" onClick={() => removeFromSaved(it.id)}>Remove</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">Your wishlist is empty.</p>
                )}
              </div>
            )}

            {active === "Addresses" && (
              <div>
                <form onSubmit={addAddress} className={styles.formGrid}>
                  <label>
                    Label
                    <input value={addressForm.label} onChange={(e) => setAddressForm((s) => ({ ...s, label: e.target.value }))} />
                  </label>
                  <label>
                    Full name
                    <input value={addressForm.fullName} onChange={(e) => setAddressForm((s) => ({ ...s, fullName: e.target.value }))} />
                  </label>
                  <label>
                    Street
                    <input value={addressForm.street} onChange={(e) => setAddressForm((s) => ({ ...s, street: e.target.value }))} />
                  </label>
                  <label>
                    City
                    <input value={addressForm.city} onChange={(e) => setAddressForm((s) => ({ ...s, city: e.target.value }))} />
                  </label>
                  <label>
                    State
                    <input value={addressForm.state} onChange={(e) => setAddressForm((s) => ({ ...s, state: e.target.value }))} />
                  </label>
                  <label>
                    ZIP
                    <input value={addressForm.zip} onChange={(e) => setAddressForm((s) => ({ ...s, zip: e.target.value }))} />
                  </label>
                  <label>
                    Country
                    <input value={addressForm.country} onChange={(e) => setAddressForm((s) => ({ ...s, country: e.target.value }))} />
                  </label>
                  <label>
                    Phone
                    <input value={addressForm.phone} onChange={(e) => setAddressForm((s) => ({ ...s, phone: e.target.value }))} />
                  </label>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" type="submit">Add address</button>
                  </div>
                </form>

                <div style={{ marginTop: 12 }}>
                  {addresses.length === 0 ? <p className="text-muted">No saved addresses.</p> : (
                    addresses.map((a) => (
                      <div key={a.id} className={styles.addressRow}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{a.label}</div>
                          <div className="text-muted">{a.fullName} · {a.phone}</div>
                          <div className="text-muted">{a.street}, {a.city}, {a.state} {a.zip}, {a.country}</div>
                        </div>
                        <div>
                          <button className="btn" onClick={() => removeAddress(a.id)}>Remove</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {active === "Payment Methods" && (
              <div>
                <form onSubmit={addCard} className={styles.formGrid}>
                  <label>
                    Name on card
                    <input value={cardForm.name} onChange={(e) => setCardForm((s) => ({ ...s, name: e.target.value }))} />
                  </label>
                  <label>
                    Card number
                    <input value={cardForm.number} onChange={(e) => setCardForm((s) => ({ ...s, number: e.target.value }))} placeholder="•••• •••• •••• 4242" />
                  </label>
                  <label>
                    Expiry
                    <input value={cardForm.expiry} onChange={(e) => setCardForm((s) => ({ ...s, expiry: e.target.value }))} placeholder="MM/YY" />
                  </label>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" type="submit">Add card</button>
                  </div>
                </form>

                <div style={{ marginTop: 12 }}>
                  {cards.length === 0 ? <p className="text-muted">No saved cards.</p> : (
                    cards.map((c) => (
                      <div key={c.id} className={styles.addressRow}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{c.name} •••• {c.last4}</div>
                          <div className="text-muted">Expires {c.expiry}</div>
                        </div>
                        <div>
                          <button className="btn" onClick={() => removeCard(c.id)}>Remove</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {active === "Account Settings" && (
              <div>
                <form onSubmit={updatePassword} className={styles.formStack}>
                  <label>
                    Current password
                    <input type="password" value={password.current} onChange={(e) => setPassword((s) => ({ ...s, current: e.target.value }))} />
                  </label>
                  <label>
                    New password
                    <input type="password" value={password.next} onChange={(e) => setPassword((s) => ({ ...s, next: e.target.value }))} />
                  </label>
                  <label>
                    Confirm new password
                    <input type="password" value={password.confirm} onChange={(e) => setPassword((s) => ({ ...s, confirm: e.target.value }))} />
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" type="submit">Update password</button>
                  </div>
                </form>

                <div style={{ marginTop: 16 }}>
                  <h3 style={{ margin: '8px 0' }}>Preferences</h3>
                  <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="checkbox" checked={prefs.newsletter} onChange={(e) => setPrefs((p) => ({ ...p, newsletter: e.target.checked }))} />
                    <span>Subscribe to newsletter</span>
                  </label>
                  <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="checkbox" checked={prefs.marketing} onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))} />
                    <span>Marketing emails</span>
                  </label>
                </div>

                <div style={{ marginTop: 16 }}>
                  <h3 style={{ margin: '8px 0' }}>Connected accounts</h3>
                  {connected.map((c) => (
                    <div key={c.provider} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8 }}>
                      <div>{c.provider}</div>
                      <div>
                        <button className="btn" onClick={() => toggleConnected(c.provider)}>{c.connected ? 'Disconnect' : 'Connect'}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    <ConfirmDialog
      open={confirmSignOutOpen}
      title="Sign out"
      message="Are you sure you want to sign out?"
      confirmLabel="Sign out"
      cancelLabel="Cancel"
      onCancel={() => setConfirmSignOutOpen(false)}
      onConfirm={() => { setConfirmSignOutOpen(false); signOut(); }}
    />
  </>
  );
}

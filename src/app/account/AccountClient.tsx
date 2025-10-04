"use client";
import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/auth';
import { useCart } from '../../context/cart';
import styles from './account.module.css';

export default function AccountClient() {
  const { user, update, signOut } = useAuth();
  const { savedItems, addItem } = useCart();
  const [tab, setTab] = useState<'profile'|'orders'|'wishlist'|'address'|'payment'|'settings'>('profile');
  // Show sensible defaults server-side so the sidebar is populated immediately
  const [mounted, setMounted] = useState(false);
  const [firstName, setFirstName] = useState('javiyajems');
  const [lastName, setLastName] = useState('Jems');
  const [email, setEmail] = useState('javiyajems@gmail.com');
  const [avatar, setAvatar] = useState('https://ui-avatars.com/api/?name=javiyajems&background=111827&color=ffffff&size=64');
  const [orders, setOrders] = useState<any[] | null>(null);

  React.useEffect(() => {
    // load persisted orders (client-only)
    try {
      const raw = localStorage.getItem('orders') ?? '[]';
      const parsed = JSON.parse(raw);
      setOrders(Array.isArray(parsed) ? parsed.slice().reverse() : []);
    } catch {
      setOrders([]);
    }

    // mark mounted and hydrate form fields from auth user
    setMounted(true);
    if (user) {
      const parts = (user.name || '').split(' ');
      setFirstName(parts[0] || firstName);
      setLastName(parts[1] || lastName);
      setEmail(user.email || email);
      setAvatar(user.avatar || avatar);
    }
  }, [user]);


  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    update({ name: `${firstName} ${lastName}`.trim(), avatar });
    try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Profile updated', type: 'success' } })); } catch (e) {}
  }

  function reorder(order: any) {
    try {
      (order.items || []).forEach((it: any) => {
        addItem({ id: Number(it.id), title: it.title, price: Number(it.price), image: it.image || '' }, it.quantity || 1);
      });
      try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Items added to cart from order', type: 'success' } })); } catch (e) {}
    } catch (e) { console.error(e); }
  }

  // Smoothly animate container height when switching tabs to avoid jumps
  const accountContentRef = useRef<HTMLDivElement | null>(null);
  const contentInnerRef = useRef<HTMLDivElement | null>(null);

  function handleTabChange(newTab: typeof tab) {
    const container = accountContentRef.current;
    const inner = contentInnerRef.current;
    if (!container || !inner) {
      setTab(newTab);
      return;
    }

    const fromHeight = inner.getBoundingClientRect().height;
    container.style.height = `${fromHeight}px`;
    // Force reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    container.offsetHeight;

    setTab(newTab);

    requestAnimationFrame(() => {
      const toHeight = contentInnerRef.current?.getBoundingClientRect().height ?? fromHeight;
      container.style.transition = 'height 260ms ease';
      container.style.height = `${toHeight}px`;

      const onEnd = () => {
        container.style.height = '';
        container.style.transition = '';
        container.removeEventListener('transitionend', onEnd);
      };
      container.addEventListener('transitionend', onEnd);
    });
  }

  return (
    <div className={styles.accountContainer}>
      <aside className={styles.accountSidebar}>
        <div className={styles.userSummary}>
          <img src={avatar} alt="Avatar" className={styles.userAvatar} />
          <h3 className={styles.accountUserName}>{mounted ? (user?.name || `${firstName} ${lastName}`.trim()) : `${firstName} ${lastName}`}</h3>
          <p className={styles.accountUserEmail}>{mounted ? (user?.email || email) : email}</p>
        </div>

        <section className={styles.sidebarSection} aria-label="Account navigation">
          <nav className={styles.accountNav}>
            <button onClick={() => handleTabChange('profile')} className={`${styles.navItem} ${tab==='profile' ? styles.navButtonActive : ''}`}>
              <svg className={styles.navIconSvg} viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path><path d="M6 20v-1c0-2.2 3.134-4 6-4s6 1.8 6 4v1"></path></svg>
              <span className={styles.navButtonLabel}>Profile</span>
            </button>

            <button onClick={() => handleTabChange('orders')} className={`${styles.navItem} ${tab==='orders' ? styles.navButtonActive : ''}`}>
              <svg className={styles.navIconSvg} viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M3 7h18" /><path d="M6 7v13" /><path d="M18 7v13" /><path d="M9 7v13" /></svg>
              <span className={styles.navButtonLabel}>My Orders</span>
            </button>

            <button onClick={() => handleTabChange('wishlist')} className={`${styles.navItem} ${tab==='wishlist' ? styles.navButtonActive : ''}`}>
              <svg className={styles.navIconSvg} viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              <span className={styles.navButtonLabel}>Wishlist {mounted && savedItems?.length ? `(${savedItems.length})` : ''}</span>
            </button>

            <button onClick={() => handleTabChange('address')} className={`${styles.navItem} ${tab==='address' ? styles.navButtonActive : ''}`}>
              <svg className={styles.navIconSvg} viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span className={styles.navButtonLabel}>Address</span>
            </button>

            <button onClick={() => handleTabChange('payment')} className={`${styles.navItem} ${tab==='payment' ? styles.navButtonActive : ''}`}>
              <svg className={styles.navIconSvg} viewBox="0 0 24 24" aria-hidden focusable="false"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              <span className={styles.navButtonLabel}>Payment Methods</span>
            </button>

            <button onClick={() => handleTabChange('settings')} className={`${styles.navItem} ${tab==='settings' ? styles.navButtonActive : ''}`}>
              <svg className={styles.navIconSvg} viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.27 17.4l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.68 0 1.25-.43 1.51-1A1.65 1.65 0 0 0 3.2 5.6L3.14 5.54A2 2 0 0 1 5.97 2.71l.06.06c.5.5 1.18.66 1.82.33.56-.26 1.19-.4 1.82-.4H12c.63 0 1.26.14 1.82.4.64.33 1.32.17 1.82-.33l.06-.06A2 2 0 0 1 20.73 6.6l-.06.06c-.27.68-.11 1.36.33 1.82.26.26.4.83.4 1.51V10c0 .63-.14 1.26-.4 1.82-.44.46-.6 1.14-.33 1.82l.06.06A2 2 0 0 1 19.4 15z" /></svg>
              <span className={styles.navButtonLabel}>Account Settings</span>
            </button>

            <button onClick={() => { signOut(); try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Signed out', type: 'info' } })); } catch(e){} }} className={`${styles.navItem} ${styles.logout}`}>
              <svg className={styles.navIconSvg} viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M17 16l4-4m0 0l-4-4m4 4H7" /><path d="M7 8v8" /></svg>
              <span className={styles.navButtonLabel}>Sign Out</span>
            </button>
          </nav>
        </section>
      </aside>

      <section className={styles.accountContent} ref={accountContentRef}>
        <div ref={contentInnerRef} className={styles.contentInner}>
        {tab === 'profile' && (
          <div>
            <h2 className={styles.panelTitle}>Profile Information</h2>
            {/* Render form only after client mount to prevent SSR/CSR mismatch */}
            {mounted ? (
              <form onSubmit={saveProfile} className={styles.profileForm}>
                <label className={styles.formLabel}>
                  User Photo (URL)
                  <input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." className={styles.input} />
                </label>

                <div className={styles.formRow}>
                  <label className={`${styles.formLabel} ${styles.formLabelHalf}`}>
                    First Name
                    <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} className={styles.input} />
                  </label>
                  <label className={`${styles.formLabel} ${styles.formLabelHalf}`}>
                    Last Name
                    <input value={lastName} onChange={(e)=>setLastName(e.target.value)} className={styles.input} />
                  </label>
                </div>

                <label className={styles.formLabel}>
                  Email
                  <input value={email} onChange={(e)=>setEmail(e.target.value)} className={styles.input} />
                </label>

                <div className={styles.mutedText}>Member Since: 7/1/2025</div>

                <div className={styles.formActions}>
                  <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Save profile</button>
                  <button type="button" onClick={() => { setFirstName('javiyajems'); setLastName('Jems'); setEmail('javiyajems@gmail.com'); setAvatar(''); }} className={styles.btn}>Reset</button>
                </div>
              </form>
            ) : (
              <div className={styles.placeholderBox} />
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h2 className={styles.panelTitle}>My Orders</h2>
            <p className={styles.mutedText}>View your past orders. (Demo: persisted locally)</p>

            <div className={styles.centerPadded}>
              <div className={styles.orderList}>
                {orders && orders.length > 0 ? (
                  orders.slice(0, 3).map((o: any) => (
                    <div key={o.id} className={styles.orderCard}>
                      <div>
                        <div className={styles.orderMeta}>Order #{o.id}</div>
                        <div className={styles.orderMetaSmall}>{new Date(o.createdAt).toLocaleString()} • {(o.items||[]).length} items</div>
                      </div>

                      <div className={styles.orderActions}>
                        <a href={`/order/${o.id}`} className={`${styles.btn} ${styles.smallUnderlineLink}`}>View</a>
                        <button onClick={() => reorder(o)} className={`${styles.btn} ${styles.btnPrimary}`}>Reorder</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.orderCard}>
                    <div className={styles.orderMeta}>No orders yet.</div>
                    <div className={styles.orderMetaSmall}>Find something you love and place an order.</div>
                    <div style={{ marginTop: 8 }}><a href="/shop" className={`${styles.btn} ${styles.btnPrimary}`}>Shop products</a></div>
                  </div>
                )}

                <div>
                  <a href="/orders" className={`${styles.btn} ${styles.smallUnderlineLink}`}>Go to Orders page to see full order history.</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'wishlist' && (
          <div>
            <h2>Wishlist</h2>
            <p className={styles.mutedText}>Items you've saved for later.</p>
            <p className={styles.centerPadded}>Go to <a href="/wishlist">Wishlist page</a> for full view.</p>
          </div>
        )}

        {tab === 'address' && (
          <div>
            <h2>Addresses</h2>
            <p className={styles.mutedText}>Manage your shipping addresses.</p>
            <div className={styles.centerPadded}>
              <div className={styles.orderCard}>
                <div className={styles.orderMeta}>Home</div>
                <div className={styles.orderMetaSmall}>No addresses yet.</div>
                <div className={styles.orderActions}><button className={`${styles.btn} ${styles.btnPrimary}`}>Add address</button></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'payment' && (
          <div>
            <h2>Payment methods</h2>
            <p className={styles.mutedText}>Add or remove payment methods.</p>
            <div className={styles.centerPadded}>
              <div className={styles.orderCard}>
                <div className={styles.orderMeta}>No saved cards</div>
                <div className={styles.orderActions}><button className={`${styles.btn} ${styles.btnPrimary}`}>Add payment method</button></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div>
            <h2>Account settings</h2>
            <p className={styles.mutedText}>Security and preferences.</p>
            <div className={styles.centerPadded}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" /> Receive marketing emails
              </label>
            </div>
          </div>
        )}
        </div>
      </section>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = { background: 'transparent', border: 'none', padding: '8px 10px', textAlign: 'left', cursor: 'pointer', borderRadius: 6, color: 'var(--foreground)' };
const activeBtnStyle: React.CSSProperties = { ...navBtnStyle, background: 'rgba(255,255,255,0.02)', fontWeight: 700 };
const inputStyle: React.CSSProperties = { padding: '10px 12px', borderRadius: 8, border: '1px solid var(--muted-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--foreground)' };

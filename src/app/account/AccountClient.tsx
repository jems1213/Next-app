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
            <button onClick={() => handleTabChange('profile')} className={`${styles.navItem} ${tab==='profile' ? styles.active : ''}`}>
              <span className={styles.navIcon}>🏷️</span>
              Profile
            </button>

            <button onClick={() => handleTabChange('orders')} className={`${styles.navItem} ${tab==='orders' ? styles.active : ''}`}>
              <span className={styles.navIcon}>📦</span>
              My Orders
            </button>

            <button onClick={() => handleTabChange('wishlist')} className={`${styles.navItem} ${tab==='wishlist' ? styles.active : ''}`}>
              <span className={styles.navIcon}>💖</span>
              Wishlist {mounted && savedItems?.length ? `(${savedItems.length})` : ''}
            </button>

            <button onClick={() => handleTabChange('address')} className={`${styles.navItem} ${tab==='address' ? styles.active : ''}`}>
              <span className={styles.navIcon}>📍</span>
              Address
            </button>

            <button onClick={() => handleTabChange('payment')} className={`${styles.navItem} ${tab==='payment' ? styles.active : ''}`}>
              <span className={styles.navIcon}>💳</span>
              Payment Methods
            </button>

            <button onClick={() => handleTabChange('settings')} className={`${styles.navItem} ${tab==='settings' ? styles.active : ''}`}>
              <span className={styles.navIcon}>⚙️</span>
              Account Settings
            </button>

            <button onClick={() => { signOut(); try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Signed out', type: 'info' } })); } catch(e){} }} className={`${styles.navItem} ${styles.logout}`}>
              <span className={styles.navIcon}>↩️</span>
              Sign Out
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
                  <label className={styles.formLabel} style={{flex:1}}>
                    First Name
                    <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} className={styles.input} />
                  </label>
                  <label className={styles.formLabel} style={{flex:1}}>
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
                  <button type="submit" className="btn btn-primary">Save profile</button>
                  <button type="button" onClick={() => { setFirstName('Javiya'); setLastName('Jems'); setEmail('javiyajems@gmail.com'); setAvatar(''); }} className="btn">Reset</button>
                </div>
              </form>
            ) : (
              <div style={{height:220}} />
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h2 className={styles.panelTitle}>My Orders</h2>
            <p className={styles.mutedText}>View your past orders. (Demo: persisted locally)</p>

            <div style={{ marginTop: 12 }}>
              <div className={styles.orderList}>
                {orders && orders.length > 0 ? (
                  orders.slice(0, 3).map((o: any) => (
                    <div key={o.id} className={styles.orderCard}>
                      <div>
                        <div style={{ fontWeight: 800 }}>Order #{o.id}</div>
                        <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>{new Date(o.createdAt).toLocaleString()} • {(o.items||[]).length} items</div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <a href={`/order/${o.id}`} className="btn" style={{ padding: '8px 10px' }}>View</a>
                        <button onClick={() => reorder(o)} className="btn btn-primary" style={{ padding: '8px 10px', background: '#CFB464', color: '#0b1020', border: 'none' }}>Reorder</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.orderCard}>
                    <div style={{ fontWeight: 700 }}>No orders yet.</div>
                    <div style={{ color: 'var(--color-muted)', marginTop: 6 }}>Find something you love and place an order.</div>
                    <div style={{ marginTop: 8 }}><a href="/shop" className="btn btn-primary">Shop products</a></div>
                  </div>
                )}

                <div>
                  <a href="/orders" className="btn" style={{ textDecoration: 'underline' }}>Go to Orders page to see full order history.</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'wishlist' && (
          <div>
            <h2>Wishlist</h2>
            <p className={styles.mutedText}>Items you've saved for later.</p>
            <p style={{ marginTop: 8 }}>Go to <a href="/wishlist">Wishlist page</a> for full view.</p>
          </div>
        )}

        {tab === 'address' && (
          <div>
            <h2>Addresses</h2>
            <p className={styles.mutedText}>Manage your shipping addresses.</p>
            <div style={{ marginTop: 12 }}>
              <div className={styles.orderCard}>
                <div style={{ fontWeight: 700 }}>Home</div>
                <div style={{ color: 'var(--color-muted)' }}>No addresses yet.</div>
                <div style={{ marginTop: 8 }}><button className="btn btn-primary">Add address</button></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'payment' && (
          <div>
            <h2>Payment methods</h2>
            <p className={styles.mutedText}>Add or remove payment methods.</p>
            <div style={{ marginTop: 12 }}>
              <div className={styles.orderCard}>
                <div style={{ fontWeight: 700 }}>No saved cards</div>
                <div style={{ marginTop: 8 }}><button className="btn btn-primary">Add payment method</button></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div>
            <h2>Account settings</h2>
            <p className={styles.mutedText}>Security and preferences.</p>
            <div style={{ marginTop: 12 }}>
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

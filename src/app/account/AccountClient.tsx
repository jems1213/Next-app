"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/auth';
import { useCart } from '../../context/cart';
import styles from './account.module.css';

export default function AccountClient() {
  const { user, update, signOut } = useAuth();
  const { savedItems, addItem } = useCart();

  const [tab, setTab] = useState<'profile'|'orders'|'wishlist'|'address'|'payment'|'settings'>('profile');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('https://www.gravatar.com/avatar/?d=mp');
  const [orders, setOrders] = useState<any[] | null>(null);

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts[1] || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || avatar);
    }

    try {
      const raw = localStorage.getItem('orders') ?? '[]';
      const parsed = JSON.parse(raw);
      setOrders(Array.isArray(parsed) ? parsed.slice().reverse() : []);
    } catch {
      setOrders([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function saveProfile(e?: React.FormEvent) {
    if (e) e.preventDefault();
    update?.({ name: `${firstName} ${lastName}`.trim(), avatar });
    try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Profile updated', type: 'success' } })); } catch (e) {}
  }

  function handleReorder(order: any) {
    try {
      (order.items || []).forEach((it: any) => {
        addItem?.({ id: Number(it.id), title: it.title, price: Number(it.price), image: it.image || '' }, it.quantity || 1);
      });
      try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Items added to cart from order', type: 'success' } })); } catch (e) {}
    } catch (e) { console.error(e); }
  }

  return (
    <div className={styles.container} data-testid="account-root">
      <aside className={styles.sidebar} aria-label="Account sidebar">
        <div className={styles.sidebarHeader}>
          <img className={styles.avatar} src={avatar} alt={`${user?.name || firstName} avatar`} />
          <div className={styles.userMeta}>
            <div className={styles.userName}>{user?.name || `${firstName} ${lastName}`.trim()}</div>
            <div className={styles.userEmail}>{user?.email || email}</div>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Account navigation">
          <button className={[styles.navItem, tab==='profile' && styles.active].filter(Boolean).join(' ')} onClick={() => setTab('profile')}>Profile</button>
          <button className={[styles.navItem, tab==='orders' && styles.active].filter(Boolean).join(' ')} onClick={() => setTab('orders')}>My Orders</button>
          <button className={[styles.navItem, tab==='wishlist' && styles.active].filter(Boolean).join(' ')} onClick={() => setTab('wishlist')}>Wishlist{savedItems?.length ? ` (${savedItems.length})` : ''}</button>
          <div className={styles.divider} />
          <button className={[styles.navItem, tab==='address' && styles.active].filter(Boolean).join(' ')} onClick={() => setTab('address')}>Address</button>
          <button className={[styles.navItem, tab==='payment' && styles.active].filter(Boolean).join(' ')} onClick={() => setTab('payment')}>Payment Methods</button>
          <button className={[styles.navItem, tab==='settings' && styles.active].filter(Boolean).join(' ')} onClick={() => setTab('settings')}>Account Settings</button>
          <button className={[styles.navItem, styles.logout].filter(Boolean).join(' ')} onClick={() => { signOut?.(); try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Signed out', type: 'info' } })); } catch(e){} }}>Sign Out</button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.memberSinceLabel}>Member since</div>
          <div className={styles.memberSince}>7/1/2025</div>
        </div>
      </aside>

      <section className={styles.content}>
        {tab === 'profile' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Profile Information</h2>
            <form onSubmit={saveProfile} className={styles.form}>
              <label className={styles.label}>User Photo (URL)
                <input value={avatar} onChange={(e) => setAvatar(e.target.value)} className={styles.input} />
              </label>

              <div className={styles.row}>
                <label className={styles.labelHalf}>First Name
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={styles.input} />
                </label>
                <label className={styles.labelHalf}>Last Name
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={styles.input} />
                </label>
              </div>

              <label className={styles.label}>Email
                <input value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} />
              </label>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>Save profile</button>
              </div>
            </form>

            <aside className={styles.summary} aria-hidden>
              <div className={styles.summaryAvatar}><img src={avatar} alt="Avatar preview" /></div>
              <div className={styles.summaryName}>{user?.name || `${firstName} ${lastName}`.trim()}</div>
              <div className={styles.summaryEmail}>{user?.email || email}</div>

              <div className={styles.stats}>
                <div className={styles.stat}>Wishlist {savedItems?.length ?? 0}</div>
                <div className={styles.stat}>Orders {orders ? orders.length : 0}</div>
              </div>

              <div className={styles.quickLinks}>
                <Link href="/orders"><button className={styles.quickLink}>View Orders</button></Link>
                <Link href="/wishlist"><button className={styles.quickLink}>Open Wishlist</button></Link>
                <button className={styles.quickLink} onClick={() => setTab('settings')}>Account Settings</button>
              </div>
            </aside>
          </div>
        )}

        {tab === 'orders' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>My Orders</h2>
            <div className={styles.ordersList}>
              {orders && orders.length > 0 ? orders.map((o: any) => (
                <div key={o.id} className={styles.orderCard}>
                  <div className={styles.orderInfo}>
                    <div>Order #{o.id}</div>
                    <div className={styles.orderMetaSmall}>{new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                  <div className={styles.orderActions}>
                    <a href={`/order/${o.id}`} className={styles.underLink}>View</a>
                    <button onClick={() => handleReorder(o)} className={styles.btnPrimary}>Reorder</button>
                  </div>
                </div>
              )) : (
                <div className={styles.empty}>No orders yet.</div>
              )}
            </div>
          </div>
        )}

        {tab === 'wishlist' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Wishlist</h2>
            <p className={styles.muted}>Items you've saved for later.</p>
            <div className={styles.center}><Link href="/wishlist"><button className={styles.btnPrimary}>Open wishlist</button></Link></div>
          </div>
        )}

        {tab === 'address' && (
          <div className={styles.card}><h2 className={styles.cardTitle}>Addresses</h2><p className={styles.muted}>Manage your shipping addresses.</p></div>
        )}

        {tab === 'payment' && (
          <div className={styles.card}><h2 className={styles.cardTitle}>Payment methods</h2><p className={styles.muted}>Add or remove payment methods.</p></div>
        )}

        {tab === 'settings' && (
          <div className={styles.card}><h2 className={styles.cardTitle}>Account settings</h2><p className={styles.muted}>Security and preferences.</p></div>
        )}
      </section>
    </div>
  );
}

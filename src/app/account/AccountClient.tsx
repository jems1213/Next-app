"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/auth';
import { useCart } from '../../context/cart';
import styles from './account.module.css';

export default function AccountClient() {
  const { user, update, signOut } = useAuth();
  const { savedItems, addItem } = useCart();

  const [tab, setTab] = useState<'profile'|'orders'|'wishlist'|'address'|'payment'|'settings'>('profile');
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [firstName, setFirstName] = useState('javiyajems');
  const [lastName, setLastName] = useState('Jems');
  const [email, setEmail] = useState('javiyajems@gmail.com');
  const [avatar, setAvatar] = useState('https://www.gravatar.com/avatar/?d=mp');
  const [orders, setOrders] = useState<any[] | null>(null);

  const accountContentRef = useRef<HTMLDivElement | null>(null);
  const contentInnerRef = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Hydrate client-only state
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('orders') ?? '[]';
      const parsed = JSON.parse(raw);
      setOrders(Array.isArray(parsed) ? parsed.slice().reverse() : []);
    } catch {
      setOrders([]);
    }

    if (user) {
      const parts = (user.name || '').split(' ');
      setFirstName(parts[0] || firstName);
      setLastName(parts[1] || lastName);
      setEmail(user.email || email);
      setAvatar(user.avatar || avatar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Smooth height animation preserved
  function animateSwitch(newTab: typeof tab) {
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

    setIsAnimating(true);

    // fade out content
    inner.classList.add(styles.fadeOut);

    setTimeout(() => {
      setTab(newTab);
      // after render, measure new height
      requestAnimationFrame(() => {
        const toHeight = contentInnerRef.current?.getBoundingClientRect().height ?? fromHeight;
        container.style.transition = 'height 300ms ease';
        container.style.height = `${toHeight}px`;

        // fade in
        inner.classList.remove(styles.fadeOut);
        inner.classList.add(styles.fadeIn);

        const onEnd = () => {
          container.style.height = '';
          container.style.transition = '';
          container.removeEventListener('transitionend', onEnd);
          inner.classList.remove(styles.fadeIn);
          setIsAnimating(false);
        };

        container.addEventListener('transitionend', onEnd);
      });
    }, 220);
  }

  function handleTabChange(newTab: typeof tab) {
    if (newTab === tab) return;
    animateSwitch(newTab);
  }

  return (
    <div className={styles.accountContainer} data-testid="account-root">
      <aside className={[styles.accountSidebar, collapsed ? styles.sidebarCollapsed : ''].filter(Boolean).join(' ')}>
        <div className={styles.sidebarTop}>
          <div className={styles.userSummaryCompact}>
            <img src={avatar} alt="User avatar" className={styles.userAvatar} />
            <div className={styles.userMeta}>
              <div className={styles.accountUserName}>{mounted ? (user?.name || `${firstName} ${lastName}`.trim()) : `${firstName} ${lastName}`}</div>
              <div className={styles.accountUserEmail}>{mounted ? (user?.email || email) : email}</div>
            </div>
          </div>

          <button className={styles.collapseToggle} onClick={() => setCollapsed((s) => !s)} aria-expanded={!collapsed} aria-label="Toggle sidebar">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth={1.5}><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        <nav className={styles.accountNav} aria-label="Account navigation">
          <button onClick={() => handleTabChange('profile')} className={[styles.navItem, tab==='profile' && styles.navActive].filter(Boolean).join(' ')}>
            <svg className={styles.navIconSvg} viewBox="0 0 24 24" aria-hidden><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path><path d="M6 20v-1c0-2.2 3.134-4 6-4s6 1.8 6 4v1"></path></svg>
            <span className={styles.navLabel}>Profile</span>
          </button>

          <button onClick={() => handleTabChange('orders')} className={[styles.navItem, tab==='orders' && styles.navActive].filter(Boolean).join(' ')}>
            <svg className={styles.navIconSvg} viewBox="0 0 24 24" aria-hidden><path d="M3 7h18" /><path d="M6 7v13" /><path d="M18 7v13" /><path d="M9 7v13" /></svg>
            <span className={styles.navLabel}>My Orders</span>
          </button>

          <button onClick={() => handleTabChange('wishlist')} className={[styles.navItem, tab==='wishlist' && styles.navActive].filter(Boolean).join(' ')}>
            <svg className={styles.navIconSvg} viewBox="0 0 24 24" aria-hidden><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            <span className={styles.navLabel}>Wishlist {mounted && savedItems?.length ? `(${savedItems.length})` : ''}</span>
          </button>

          <div className={styles.navDivider} />

          <button onClick={() => handleTabChange('address')} className={[styles.navItem, tab==='address' && styles.navActive].filter(Boolean).join(' ')}>
            <svg className={styles.navIconSvg} viewBox="0 0 24 24" aria-hidden><path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <span className={styles.navLabel}>Address</span>
          </button>

          <button onClick={() => handleTabChange('payment')} className={[styles.navItem, tab==='payment' && styles.navActive].filter(Boolean).join(' ')}>
            <svg className={styles.navIconSvg} viewBox="0 0 24 24" aria-hidden><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
            <span className={styles.navLabel}>Payment Methods</span>
          </button>

          <button onClick={() => handleTabChange('settings')} className={[styles.navItem, tab==='settings' && styles.navActive].filter(Boolean).join(' ')}>
            <svg className={styles.navIconSvg} viewBox="0 0 24 24" aria-hidden><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.27 17.4l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.68 0 1.25-.43 1.51-1A1.65 1.65 0 0 0 3.2 5.6L3.14 5.54A2 2 0 0 1 5.97 2.71l.06.06c.5.5 1.18.66 1.82.33.56-.26 1.19-.4 1.82-.4H12c.63 0 1.26.14 1.82.4.64.33 1.32.17 1.82-.33l.06-.06A2 2 0 0 1 20.73 6.6l-.06.06c-.27.68-.11 1.36.33 1.82.26.26.4.83.4 1.51V10c0 .63-.14 1.26-.4 1.82-.44.46-.6 1.14-.33 1.82l.06.06A2 2 0 0 1 19.4 15z" /></svg>
            <span className={styles.navLabel}>Account Settings</span>
          </button>

          <button onClick={() => { signOut(); try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Signed out', type: 'info' } })); } catch(e){} }} className={[styles.navItem, styles.logoutHighlight].filter(Boolean).join(' ')}>
            <svg className={styles.navIconSvg} viewBox="0 0 24 24" aria-hidden><path d="M17 16l4-4m0 0l-4-4m4 4H7" /><path d="M7 8v8" /></svg>
            <span className={styles.navLabel}>Sign Out</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.smallMuted}>Member since</div>
          <div className={styles.smallMutedBold}>7/1/2025</div>
        </div>
      </aside>

      <section className={styles.accountContent} ref={accountContentRef}>
        <div ref={contentInnerRef} className={styles.contentInner} aria-live="polite">
          {tab === 'profile' && (
            <div className={styles.panelCard}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Profile Information</h2>
                <div className={styles.panelActions}>
                  <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={saveProfile}>Save profile</button>
                </div>
              </div>

              <div className={styles.panelGrid}>
                <div>
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

                    </form>
                  ) : (
                    <div className={styles.placeholderBox} />
                  )}
                </div>

                <aside className={styles.summaryCard} aria-hidden>
                  <div className="avatarPreview">
                    <img src={avatar} alt="Avatar preview" />
                    <div>
                      <div className={styles.summaryName}>{mounted ? (user?.name || `${firstName} ${lastName}`) : `${firstName} ${lastName}`}</div>
                      <div className={styles.summaryEmail}>{mounted ? (user?.email || email) : email}</div>
                    </div>
                  </div>

                  <div className={styles.statList}>
                    <div className={styles.statBadge}>Wishlist {mounted && savedItems?.length ? `(${savedItems.length})` : '(0)'}</div>
                    <div className={styles.statBadge}>Orders {orders ? orders.length : 0}</div>
                  </div>

                  <div className={styles.quickLinks}>
                    <button className={styles.quickLink} onClick={() => handleTabChange('orders')}>View Orders</button>
                    <button className={styles.quickLink} onClick={() => handleTabChange('wishlist')}>Open Wishlist</button>
                    <button className={styles.quickLink} onClick={() => handleTabChange('settings')}>Account Settings</button>
                  </div>
                </aside>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className={styles.panelCard}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>My Orders</h2>
                <div className={styles.panelActions}><button className={styles.btn}>View all</button></div>
              </div>

              <div className={styles.panelGrid}>
                <div>
                  {orders && orders.length > 0 ? (
                    <div className={styles.ordersGrid}>
                      {orders.map((o: any) => (
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
                      ))}
                    </div>
                  ) : (
                    <div className={styles.orderCard}>
                      <div className={styles.orderMeta}>No orders yet.</div>
                      <div className={styles.orderMetaSmall}>Find something you love and place an order.</div>
                      <div className={styles.spacedTop}><a href="/shop" className={`${styles.btn} ${styles.btnPrimary}`}>Shop products</a></div>
                    </div>
                  )}
                </div>

                <aside className={styles.summaryCard}>
                  <div className={styles.summaryName}>Order quick actions</div>
                  <div className={styles.quickLinks}>
                    <button className={styles.quickLink} onClick={() => window.location.href = '/shop'}>Shop now</button>
                    <button className={styles.quickLink} onClick={() => window.location.href = '/orders'}>Order history</button>
                  </div>
                </aside>
              </div>
            </div>
          )}

          {tab === 'wishlist' && (
            <div className={styles.panelCard}>
              <div className={styles.panelHeader}><h2 className={styles.panelTitle}>Wishlist</h2></div>
              <div className={styles.panelGrid}>
                <div>
                  <p className={styles.mutedText}>Items you've saved for later.</p>
                  <div className={styles.centerPadded}><a href="/wishlist" className={`${styles.btn} ${styles.btnPrimary}`}>Open wishlist</a></div>
                </div>

                <aside className={styles.summaryCard}>
                  <div className={styles.summaryName}>Tips</div>
                  <div className={styles.smallMuted}>Move items to cart quickly or save for later</div>
                  <div className={styles.quickLinks}>
                    <button className={styles.quickLink} onClick={() => handleTabChange('orders')}>Check orders</button>
                  </div>
                </aside>
              </div>
            </div>
          )}

          {tab === 'address' && (
            <div className={styles.panelCard}>
              <div className={styles.panelHeader}><h2 className={styles.panelTitle}>Addresses</h2></div>
              <div className={styles.panelGrid}>
                <div>
                  <p className={styles.mutedText}>Manage your shipping addresses.</p>
                  <div className={styles.centerPadded}>
                    <div className={styles.orderCard}>
                      <div className={styles.orderMeta}>Home</div>
                      <div className={styles.orderMetaSmall}>No addresses yet.</div>
                      <div className={styles.orderActions}><button className={`${styles.btn} ${styles.btnPrimary}`}>Add address</button></div>
                    </div>
                  </div>
                </div>

                <aside className={styles.summaryCard}>
                  <div className={styles.summaryName}>Address tips</div>
                  <div className={styles.smallMuted}>Set a default address to speed up checkout</div>
                  <div className={styles.quickLinks}><button className={styles.quickLink}>Add new address</button></div>
                </aside>
              </div>
            </div>
          )}

          {tab === 'payment' && (
            <div className={styles.panelCard}>
              <div className={styles.panelHeader}><h2 className={styles.panelTitle}>Payment methods</h2></div>
              <div className={styles.panelGrid}>
                <div>
                  <p className={styles.mutedText}>Add or remove payment methods.</p>
                  <div className={styles.centerPadded}>
                    <div className={styles.orderCard}>
                      <div className={styles.orderMeta}>No saved cards</div>
                      <div className={styles.orderActions}><button className={`${styles.btn} ${styles.btnPrimary}`}>Add payment method</button></div>
                    </div>
                  </div>
                </div>

                <aside className={styles.summaryCard}>
                  <div className={styles.summaryName}>Secure payments</div>
                  <div className={styles.smallMuted}>We never store full card numbers</div>
                  <div className={styles.quickLinks}><button className={styles.quickLink}>Add card</button></div>
                </aside>
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className={styles.panelCard}>
              <div className={styles.panelHeader}><h2 className={styles.panelTitle}>Account settings</h2></div>
              <div className={styles.panelGrid}>
                <div>
                  <p className={styles.mutedText}>Security and preferences.</p>
                  <div className={styles.centerPadded}>
                    <label className={styles.checkboxRow}>
                      <input type="checkbox" /> Receive marketing emails
                    </label>
                    <label className={styles.checkboxRow}>
                      <input type="checkbox" /> Two-factor authentication
                    </label>
                  </div>
                </div>

                <aside className={styles.summaryCard}>
                  <div className={styles.summaryName}>Privacy</div>
                  <div className={styles.smallMuted}>Manage connected apps and sessions</div>
                  <div className={styles.quickLinks}><button className={styles.quickLink}>View sessions</button></div>
                </aside>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

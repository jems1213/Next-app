"use client";
import React, { useState } from 'react';
import { useAuth } from '../../context/auth';
import { useCart } from '../../context/cart';

export default function AccountClient() {
  const { user, update, signOut } = useAuth();
  const { savedItems } = useCart();
  const [tab, setTab] = useState<'profile'|'orders'|'wishlist'|'address'|'payment'|'settings'>('profile');
  const [firstName, setFirstName] = useState(user?.name?.split(' ')?.[0] || 'Javiya');
  const [lastName, setLastName] = useState(user?.name?.split(' ')?.[1] || 'Jems');
  const [email, setEmail] = useState(user?.email || 'javiyajems@gmail.com');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    update({ name: `${firstName} ${lastName}`.trim(), avatar });
    try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Profile updated', type: 'success' } })); } catch (e) {}
  }

  return (
    <div style={{ display: 'flex', gap: 24, width: '100%', maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
      <aside style={{ width: 260, borderRight: '1px solid rgba(255,255,255,0.03)', paddingRight: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: '#CFB464', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0b1020', fontWeight: 800 }}>{(user?.name || 'U').charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ fontWeight: 800 }}>{user?.name || 'Javiya Jems'}</div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>{user?.email || 'javiyajems@gmail.com'}</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => setTab('profile')} style={tab==='profile' ? activeBtnStyle : navBtnStyle}>Profile</button>
          <button onClick={() => setTab('orders')} style={tab==='orders' ? activeBtnStyle : navBtnStyle}>My Orders</button>
          <button onClick={() => setTab('wishlist')} style={tab==='wishlist' ? activeBtnStyle : navBtnStyle}>Wishlist {savedItems?.length ? `(${savedItems.length})` : ''}</button>
          <button onClick={() => setTab('address')} style={tab==='address' ? activeBtnStyle : navBtnStyle}>Address</button>
          <button onClick={() => setTab('payment')} style={tab==='payment' ? activeBtnStyle : navBtnStyle}>Payment Methods</button>
          <button onClick={() => setTab('settings')} style={tab==='settings' ? activeBtnStyle : navBtnStyle}>Account Settings</button>
          <button onClick={() => { signOut(); try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Signed out', type: 'info' } })); } catch(e){} }} style={navBtnStyle}>Sign Out</button>
        </nav>
      </aside>

      <section style={{ flex: 1 }}>
        {tab === 'profile' && (
          <div>
            <h2 style={{ marginTop: 0 }}>Profile Information</h2>
            <form onSubmit={saveProfile} style={{ display: 'grid', gap: 12, maxWidth: 660 }}>
              <label style={{ display: 'flex', flexDirection: 'column' }}>
                User Photo (URL)
                <input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." style={inputStyle} />
              </label>

              <div style={{ display: 'flex', gap: 12 }}>
                <label style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  First Name
                  <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} style={inputStyle} />
                </label>
                <label style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  Last Name
                  <input value={lastName} onChange={(e)=>setLastName(e.target.value)} style={inputStyle} />
                </label>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column' }}>
                Email
                <input value={email} onChange={(e)=>setEmail(e.target.value)} style={inputStyle} />
              </label>

              <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>Member Since: 7/1/2025</div>

              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button type="submit" className="btn btn-primary">Save profile</button>
                <button type="button" onClick={() => { setFirstName('Javiya'); setLastName('Jems'); setEmail('javiyajems@gmail.com'); setAvatar(''); }} className="btn">Reset</button>
              </div>
            </form>
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h2>My Orders</h2>
            <p style={{ color: 'var(--color-muted)' }}>View your past orders. (Demo: persisted locally)</p>
            <p style={{ marginTop: 8 }}>Go to <a href="/orders">Orders page</a> to see full order history.</p>
          </div>
        )}

        {tab === 'wishlist' && (
          <div>
            <h2>Wishlist</h2>
            <p style={{ color: 'var(--color-muted)' }}>Items you've saved for later.</p>
            <p style={{ marginTop: 8 }}>Go to <a href="/wishlist">Wishlist page</a> for full view.</p>
          </div>
        )}

        {tab === 'address' && (
          <div>
            <h2>Addresses</h2>
            <p style={{ color: 'var(--color-muted)' }}>Manage your shipping addresses.</p>
            <div style={{ marginTop: 12 }}>
              <div style={{ padding: 12, borderRadius: 8, background: 'linear-gradient(180deg, rgba(255,255,255,0.01), transparent)' }}>
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
            <p style={{ color: 'var(--color-muted)' }}>Add or remove payment methods.</p>
            <div style={{ marginTop: 12 }}>
              <div style={{ padding: 12, borderRadius: 8, background: 'linear-gradient(180deg, rgba(255,255,255,0.01), transparent)' }}>
                <div style={{ fontWeight: 700 }}>No saved cards</div>
                <div style={{ marginTop: 8 }}><button className="btn btn-primary">Add payment method</button></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div>
            <h2>Account settings</h2>
            <p style={{ color: 'var(--color-muted)' }}>Security and preferences.</p>
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" /> Receive marketing emails
              </label>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = { background: 'transparent', border: 'none', padding: '8px 10px', textAlign: 'left', cursor: 'pointer', borderRadius: 6, color: 'var(--foreground)' };
const activeBtnStyle: React.CSSProperties = { ...navBtnStyle, background: 'rgba(255,255,255,0.02)', fontWeight: 700 };
const inputStyle: React.CSSProperties = { padding: '10px 12px', borderRadius: 8, border: '1px solid var(--muted-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--foreground)' };

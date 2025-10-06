"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  avatar?: string;
};

type AuthContextValue = {
  user: User | null;
  signIn: (email: string, password?: string) => Promise<User>;
  signOut: () => Promise<void>;
  update: (u: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // on mount, fetch current user from server (cookie-based session)
  useEffect(() => {
    // remove any legacy local user storage to ensure server-side auth only
    try { localStorage.removeItem('user'); } catch {}
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) return;
        const json = await res.json();
        if (mounted && json && json.user) {
          const u: User = { name: json.user.name || (json.user.email.split('@')[0] || 'User'), email: json.user.email, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(json.user.name || (json.user.email.split('@')[0] || 'User'))}&background=111827&color=ffffff&size=64` };
          setUser(u);
        }
      } catch {}
    })();
    return () => { mounted = false; };
  }, []);

  const signIn = async (email: string, password?: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || 'Sign in failed');
    const u: User = { name: json.name || (email.split('@')[0] || 'User'), email, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(json.name || (email.split('@')[0] || 'User'))}&background=111827&color=ffffff&size=64` };
    setUser(u);
    try { window.dispatchEvent(new CustomEvent('user-changed', { detail: u })); } catch {}
    try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: `Signed in as ${u.name}`, type: 'success' } })); } catch {}
    return u;
  };

  const signOut = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    setUser(null);
    try { window.dispatchEvent(new CustomEvent('user-changed', { detail: null })); } catch {}
    try { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Signed out', type: 'info' } })); } catch {}
  };

  const update = (u: Partial<User>) => {
    setUser((prev) => {
      const next = prev ? { ...prev, ...u } : prev;
      try { window.dispatchEvent(new CustomEvent('user-changed', { detail: next })); } catch {}
      return next;
    });
  };

  return <AuthContext.Provider value={{ user, signIn, signOut, update }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx) return ctx;
  throw new Error('useAuth must be used within AuthProvider');
}

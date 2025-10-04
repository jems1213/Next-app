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
  signOut: () => void;
  update: (u: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readJsonStorage<User | null>("user", null));

  useEffect(() => {
    writeJsonStorage("user", user);
  }, [user]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "user") setUser(readJsonStorage("user", null));
    }
    function onUserChanged() {
      setUser(readJsonStorage("user", null));
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("user-changed", onUserChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("user-changed", onUserChanged);
    };
  }, []);

  const signIn = async (email: string) => {
    const name = email.split("@")[0] || "User";
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=111827&color=ffffff&size=64`;
    const u: User = { name, email, avatar };
    // simulate network delay
    await new Promise((r) => setTimeout(r, 300));
    setUser(u);
    try { localStorage.setItem('user', JSON.stringify(u)); } catch {}
    // notify other listeners
    try { window.dispatchEvent(new CustomEvent('user-changed', { detail: u })); } catch {}
    return u;
  };

  const signOut = () => {
    setUser(null);
    try { localStorage.removeItem('user'); } catch {}
    try { window.dispatchEvent(new CustomEvent('user-changed', { detail: null })); } catch {}
  };

  const update = (u: Partial<User>) => {
    setUser((prev) => {
      const next = prev ? { ...prev, ...u } : prev;
      try { localStorage.setItem('user', JSON.stringify(next)); } catch {}
      try { window.dispatchEvent(new CustomEvent('user-changed', { detail: next })); } catch {}
      return next;
    });
  };

  return <AuthContext.Provider value={{ user, signIn, signOut, update }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx) return ctx;
  // fallback implementation (in case hook is used outside provider during rendering)
  const fallback: AuthContextValue = {
    user: null,
    signIn: async (email: string) => {
      const name = email.split("@")[0] || "User";
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=111827&color=ffffff&size=64`;
      const u: User = { name, email, avatar };
      try { localStorage.setItem('user', JSON.stringify(u)); } catch {}
      try { window.dispatchEvent(new CustomEvent('user-changed', { detail: u })); } catch {}
      return u;
    },
    signOut: () => {
      try { localStorage.removeItem('user'); } catch {}
      try { window.dispatchEvent(new CustomEvent('user-changed', { detail: null })); } catch {}
    },
    update: (u: Partial<User>) => {
      try {
        const raw = localStorage.getItem('user');
        const cur = raw ? JSON.parse(raw) : null;
        const next = cur ? { ...cur, ...u } : null;
        if (next) localStorage.setItem('user', JSON.stringify(next));
        try { window.dispatchEvent(new CustomEvent('user-changed', { detail: next })); } catch {}
      } catch {}
    },
  };
  return fallback;
}

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
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signIn = async (email: string) => {
    // demo sign-in: create a simple user object
    const name = email.split("@")[0] || "User";
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=111827&color=ffffff&size=64`;
    const u: User = { name, email, avatar };
    // simulate network delay
    await new Promise((r) => setTimeout(r, 300));
    setUser(u);
    return u;
  };

  const signOut = () => {
    setUser(null);
  };

  const update = (u: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...u } : prev));
  };

  return <AuthContext.Provider value={{ user, signIn, signOut, update }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

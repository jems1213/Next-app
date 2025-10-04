"use client";
import dynamic from 'next/dynamic';
import React from 'react';

// Retry wrapper for dynamic imports to handle transient ChunkLoadError
async function importWithRetry(loader, retries = 3, delay = 300) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await loader();
    } catch (err) {
      lastErr = err;
      // If it's a ChunkLoadError, wait and retry
      const name = String(err && (err.name || err.constructor?.name || ''));
      const msg = String(err && (err.message || err));
      if (name === 'ChunkLoadError' || msg.includes('Loading chunk')) {
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

const Hero = dynamic(() => importWithRetry(() => import('./Hero')), { ssr: false, loading: () => null });

export default function HeroShell() {
  return <Hero />;
}

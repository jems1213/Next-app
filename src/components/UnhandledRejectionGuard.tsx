"use client";
import React from 'react';

export default function UnhandledRejectionGuard() {
  React.useEffect(() => {
    function onUnhandledRejection(e: PromiseRejectionEvent) {
      try {
        const msg = String(e.reason ?? '');
        if (msg.includes('Failed to fetch') && (msg.includes('fullstory') || msg.includes('fullstory.com') || msg.includes('edge.fullstory'))) {
          e.preventDefault();
        }
      } catch (err) {}
    }

    window.addEventListener('unhandledrejection', onUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', onUnhandledRejection);
  }, []);

  return null;
}

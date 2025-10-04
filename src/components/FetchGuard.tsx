"use client";
import React from "react";

export default function FetchGuard() {
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.fetch) return;

    // avoid wrapping multiple times (inline script in layout already wraps fetch)
    const currentFetch: any = window.fetch;
    if (currentFetch && currentFetch.__fetchGuardWrapped) return;

    const originalFetch = currentFetch.bind(window);

    // async wrapper to catch rejected promises
    const wrappedFetch: typeof window.fetch = async function (input: RequestInfo, init?: RequestInit) {
      try {
        return await originalFetch(input as any, init);
      } catch (err: any) {
        // Simplified and more robust handling: for network-related failures, swallow the error
        // and return a generic 503 response to prevent noisy console errors from third-party scripts.
        try {
          const url = typeof input === 'string' ? input : (input as Request)?.url || '';
          const errMsg = String(err && (err.message || err) || '');
          const errStack = String(err && err.stack || '');

          const lowerMsg = errMsg.toLowerCase();
          const lowerStack = errStack.toLowerCase();
          const targetUrl = String(url);

          // If this looks like a network failure or mentions known third-party analytics, swallow it.
          if (lowerMsg.includes('failed to fetch') || lowerStack.includes('fullstory') || targetUrl.includes('fullstory')) {
            return new Response(null, { status: 503, statusText: 'Service Unavailable' });
          }

        } catch (e) {
          // ignore diagnostics errors and fallthrough to a safe swallow
        }

        // As a last resort for any fetch error, return a harmless 503 response to avoid breaking
        // unrelated app behavior with noisy network errors in the console during dev/hot reload.
        return new Response(null, { status: 503, statusText: 'Service Unavailable' });
      }
    } as any;

    // mark wrapper so we don't double-wrap
    (wrappedFetch as any).__fetchGuardWrapped = true;

    try {
      window.fetch = wrappedFetch;
    } catch (e) {
      // ignore assignment errors in very restricted environments
    }

    // Prevent unhandledrejection noise coming from third-party scripts
    function onUnhandledRejection(event: PromiseRejectionEvent) {
      try {
        const reason = event.reason;
        const msg = String(reason ?? "");
        const stack = (reason && reason.stack) || "";
        // suppress failures coming from known analytics hosts (e.g., FullStory)
        if ((msg.includes("Failed to fetch") || stack.includes("Failed to fetch")) && (msg.toLowerCase().includes("fullstory") || stack.toLowerCase().includes("fullstory"))) {
          event.preventDefault();
          return;
        }

        // also suppress generic cross-origin "Failed to fetch" errors to reduce noise
        if ((msg.includes("Failed to fetch") || stack.includes("Failed to fetch"))) {
          try {
            // attempt to find a URL in the message
            const found = msg.match(/https?:\/\/[^\s)\]]+/);
            if (found) {
              const parsed = new URL(found[0]);
              if (parsed.hostname !== window.location.hostname) {
                event.preventDefault();
              }
            } else {
              // no URL found — prevent default to reduce noise
              event.preventDefault();
            }
          } catch (e) {
            event.preventDefault();
          }
        }
      } catch (e) {
        // ignore
      }
    }

    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      try {
        // restore original fetch only if it was the one we wrapped
        if ((window.fetch as any) && (window.fetch as any).__fetchGuardWrapped) {
          window.fetch = originalFetch;
        }
        window.removeEventListener("unhandledrejection", onUnhandledRejection);
      } catch (e) {}
    };
  }, []);

  return null;
}

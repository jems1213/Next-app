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
        try {
          const url = typeof input === "string" ? input : (input as Request)?.url || "";

          const errMsg = (err && (err.message || String(err))) || "";
          const errStack = (err && err.stack) || "";

          // If the request directly targets a known analytics/third-party host, swallow the error.
          if (typeof url === 'string' && (url.includes('fullstory') || url.includes('edge.fullstory') || url.includes('fullstory.com'))) {
            return new Response(null, { status: 503, statusText: 'Service Unavailable' });
          }

          // If the error message or stack mentions FullStory, swallow it
          if ((errMsg && errMsg.toLowerCase && errMsg.toLowerCase().includes('fullstory')) || (errStack && errStack.toLowerCase && errStack.toLowerCase().includes('fullstory'))) {
            return new Response(null, { status: 503, statusText: 'Service Unavailable' });
          }

          // For generic network failures, try to determine if the request was cross-origin or from a third-party
          if (errMsg && errMsg.toLowerCase && errMsg.toLowerCase().includes('failed to fetch')) {
            try {
              const parsed = new URL(String(url), window.location.href);
              const isCrossOrigin = parsed.hostname && parsed.hostname !== window.location.hostname;

              const inputMode = (init && (init as any).mode) || ((input as Request)?.mode) || '';

              // Swallow if cross-origin or explicitly no-cors/cors mode to avoid noisy third-party failures
              if (isCrossOrigin || inputMode === 'no-cors' || inputMode === 'cors') {
                return new Response(null, { status: 503, statusText: 'Service Unavailable' });
              }

              // If the request is same-origin, let the error propagate so app logic can handle it
            } catch (e) {
              // If URL parsing fails, conservatively swallow to avoid noisy third-party errors
              return new Response(null, { status: 503, statusText: 'Service Unavailable' });
            }
          }

          // Also swallow if the error stack originates from FullStory or its CDN
          if (errStack && errStack.toLowerCase && (errStack.toLowerCase().includes('edge.fullstory') || errStack.toLowerCase().includes('fullstory'))) {
            return new Response(null, { status: 503, statusText: 'Service Unavailable' });
          }
        } catch (e) {
          // ignore diagnostics errors
        }

        // rethrow for other fetch errors so app behavior remains unchanged
        throw err;
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

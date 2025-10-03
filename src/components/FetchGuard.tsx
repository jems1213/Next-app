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
          const url = typeof input === "string" ? input : (input as Request).url || "";

          // gather diagnostics from error object
          const errMsg = (err && (err.message || String(err))) || "";
          const errStack = (err && err.stack) || "";

          const isFullStoryUrl = typeof url === "string" && (url.includes("fullstory") || url.includes("edge.fullstory") || url.includes("fullstory.com"));
          const errMentionsFullstory = errMsg && errMsg.toLowerCase && errMsg.toLowerCase().includes("fullstory") || errStack && errStack.toLowerCase && errStack.toLowerCase().includes("fullstory");

          if (isFullStoryUrl || errMentionsFullstory) {
            // swallow the error for these external analytics calls so they don't pollute our console
            return new Response(null, { status: 503, statusText: "Service Unavailable" });
          }

          // If the fetch failed with a generic network error, and the request was cross-origin,
          // suppress it to avoid noisy errors coming from third-party scripts (e.g., analytics).
          if (errMsg && errMsg.toLowerCase && errMsg.toLowerCase().includes('failed to fetch')) {
            try {
              const parsed = new URL(String(url), window.location.href);
              if (parsed.hostname && parsed.hostname !== window.location.hostname) {
                return new Response(null, { status: 503, statusText: 'Service Unavailable' });
              }
            } catch (e) {
              // if URL parsing fails, conservatively swallow
              return new Response(null, { status: 503, statusText: 'Service Unavailable' });
            }
          }
        } catch (e) {
          // ignore
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

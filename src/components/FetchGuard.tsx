"use client";
"use client";
import React from "react";

export default function FetchGuard() {
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.fetch) return;

    const originalFetch = window.fetch.bind(window);

    // override fetch to catch network errors from known third-party domains (e.g., fullstory)
    function safeFetch(input: RequestInfo, init?: RequestInit) {
      try {
        return originalFetch(input as any, init);
      } catch (err) {
        // sync errors (rare) - rethrow
        throw err;
      }
    }

    // async wrapper to catch rejected promises
    window.fetch = async function (input: RequestInfo, init?: RequestInit) {
      try {
        return await originalFetch(input as any, init);
      } catch (err: any) {
        try {
          const url = typeof input === "string" ? input : (input as Request).url || "";
          if (typeof url === "string" && (url.includes("fullstory") || url.includes("edge.fullstory") || url.includes("fullstory.com"))) {
            // swallow the error for these external analytics calls so they don't pollute our console
            // return a generic Response to satisfy callers that expect a Response
            return new Response(null, { status: 503, statusText: "Service Unavailable" });
          }
        } catch (e) {
          // ignore
        }
        // rethrow for other fetch errors so app behavior remains unchanged
        throw err;
      }
    } as typeof window.fetch;

    // Prevent unhandledrejection noise coming from third-party scripts
    function onUnhandledRejection(event: PromiseRejectionEvent) {
      try {
        const reason = event.reason;
        const msg = String(reason ?? "");
        if (msg.includes("Failed to fetch") && msg.includes("fullstory")) {
          event.preventDefault();
        }
      } catch (e) {
        // ignore
      }
    }

    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      try {
        window.fetch = originalFetch;
        window.removeEventListener("unhandledrejection", onUnhandledRejection);
      } catch (e) {}
    };
  }, []);

  return null;
}

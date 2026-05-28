"use client";

import { useEffect } from "react";

/**
 * Silences dev-only hydration noise caused by browser extensions that
 * mutate the DOM after server render but before React hydrates — e.g.
 * Bitdefender (`bis_skin_checked`), Grammarly (`data-new-gr-c-s-check-loaded`,
 * `data-gr-ext-installed`), ColorZilla (`cz-shortcut-listen`).
 *
 * These warnings:
 *   - only appear in development (React strips them in production)
 *   - only fire on YOUR machine (your visitors don't have your extensions)
 *   - are harmless — the markup React rendered is fine
 *
 * Runs in `useEffect`, so the very first warning on initial page load may
 * still flash. Every subsequent re-render and route change is silent.
 */

const EXTENSION_NOISE = [
  "bis_skin_checked",
  "bis_register",
  "__processed_",
  "data-new-gr-c-s-check-loaded",
  "data-gr-ext-installed",
  "cz-shortcut-listen",
  "hydrated but some attributes",
  "A tree hydrated but",
];

export function HydrationGuard() {
  useEffect(() => {
    const orig = console.error;
    console.error = function (...args: unknown[]) {
      const first = args[0];
      const msg =
        typeof first === "string"
          ? first
          : first instanceof Error
            ? first.message
            : "";
      if (EXTENSION_NOISE.some((needle) => msg.includes(needle))) return;
      return orig.apply(console, args as Parameters<typeof console.error>);
    };
    return () => {
      console.error = orig;
    };
  }, []);

  return null;
}

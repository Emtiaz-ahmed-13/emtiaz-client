"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { ADMIN_EMAIL, login, pingApi, useAuth } from "@/lib/auth";

type ApiStatus = "checking" | "online" | "offline";

export default function AdminLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";

  const { isAuthenticated, ready } = useAuth();
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const checkingRef = useRef(false);

  useEffect(() => {
    if (ready && isAuthenticated) router.replace(next);
  }, [ready, isAuthenticated, router, next]);

  const checkApi = useCallback(async () => {
    if (checkingRef.current) return;
    checkingRef.current = true;
    setApiStatus((prev) => (prev === "online" ? prev : "checking"));
    try {
      const ok = await pingApi();
      setApiStatus(ok ? "online" : "offline");
    } finally {
      checkingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void checkApi();
  }, [checkApi]);

  useEffect(() => {
    if (apiStatus !== "offline") return;
    const id = window.setInterval(() => void checkApi(), 3000);
    return () => window.clearInterval(id);
  }, [apiStatus, checkApi]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") void checkApi();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [checkApi]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(ADMIN_EMAIL, password);
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-6 py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            color: "var(--color-muted)",
            maskImage:
              "radial-gradient(ellipse at 50% 30%, black 30%, transparent 70%)",
          }}
        />
        <div className="absolute left-1/2 top-1/4 -z-10 size-168 -translate-x-1/2 rounded-full bg-foreground/6 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="link-underline font-mono text-[10px] uppercase tracking-widest text-muted-strong hover:text-foreground"
          >
            ← Back to site
          </Link>
          <ApiBadge status={apiStatus} />
        </div>

        <div className="mt-10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Restricted area
          </p>
          <h1 className="mt-2 text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
            Admin sign in
          </h1>
          <p className="mt-3 text-sm text-muted-strong">
            Manage blog posts and portfolio projects.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-md"
        >
          <div>
            <label
              htmlFor="password"
              className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted"
            >
              Password
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="link-underline text-muted-strong hover:text-foreground"
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 focus-within:border-foreground">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0 text-muted"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                required
                minLength={6}
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || apiStatus === "offline"}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-medium text-background transition hover:gap-3 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Signing in…"
              : apiStatus === "offline"
                ? "Waiting for backend…"
                : apiStatus === "checking"
                  ? "Checking…"
                  : "Sign in"}
            {!submitting && apiStatus !== "offline" && (
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            )}
          </button>

          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-[12px] leading-relaxed text-red-300">
              <p className="font-mono text-[10px] uppercase tracking-widest text-red-400">
                Sign-in failed
              </p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {apiStatus === "offline" && (
            <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-center text-[12px] text-amber-200">
              Backend offline — start the server and retry.
              <button
                type="button"
                onClick={() => void checkApi()}
                className="ml-2 link-underline font-mono text-[10px] uppercase tracking-widest text-amber-300 hover:text-amber-200"
              >
                ↻ Retry
              </button>
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

function ApiBadge({ status }: { status: ApiStatus }) {
  const map = {
    checking: {
      dot: "bg-muted",
      label: "Checking…",
      cls: "border-border text-muted-strong",
    },
    online: {
      dot: "bg-emerald-400",
      label: "Online",
      cls: "border-emerald-500/40 text-emerald-300",
    },
    offline: {
      dot: "bg-red-400",
      label: "Offline",
      cls: "border-red-500/40 text-red-300",
    },
  } as const;
  const it = map[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur-sm ${it.cls}`}
    >
      <span className={`relative flex size-1.5`}>
        {status === "checking" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-muted opacity-60" />
        )}
        <span className={`relative inline-flex size-1.5 rounded-full ${it.dot}`} />
      </span>
      {it.label}
    </span>
  );
}

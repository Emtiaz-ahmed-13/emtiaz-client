"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { isAllowedAdmin, logout, useAuth } from "@/lib/auth";

const NAV: { href: string; label: string; exact?: boolean }[] = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/blog", label: "Blog posts" },
  { href: "/admin/projects", label: "Projects" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, ready, isAuthenticated } = useAuth();

  const isLoginRoute = pathname?.startsWith("/admin/login");

  const isPortalAdmin =
    isAuthenticated && user?.role === "ADMIN" && isAllowedAdmin(user?.email);

  useEffect(() => {
    if (!ready) return;
    if (isLoginRoute) return;
    if (!isAuthenticated) {
      const next = encodeURIComponent(pathname || "/admin");
      router.replace(`/admin/login?next=${next}`);
      return;
    }
    if (!isPortalAdmin) {
      // Stale session for a non-admin email — boot them out.
      logout();
      router.replace("/admin/login");
    }
  }, [
    ready,
    isAuthenticated,
    isPortalAdmin,
    isLoginRoute,
    pathname,
    router,
  ]);

  if (isLoginRoute) return <>{children}</>;

  if (!ready || !isAuthenticated || !isPortalAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Checking session…
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-border bg-card/40 px-6 py-6 backdrop-blur-sm lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <Link
          href="/"
          className="link-underline font-mono text-[10px] uppercase tracking-widest text-muted-strong hover:text-foreground"
        >
          ← Back to site
        </Link>

        <p className="mt-8 text-2xl font-semibold tracking-[-0.03em]">
          Admin
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Portfolio CMS
        </p>

        <nav className="mt-8 space-y-1">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-strong hover:bg-card hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => {
            logout();
            router.replace("/admin/login");
          }}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-strong transition hover:border-border-strong hover:text-foreground"
        >
          Sign out
        </button>
      </aside>

      <main className="px-6 py-10 sm:px-10 sm:py-12">{children}</main>
    </div>
  );
}

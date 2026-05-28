"use client";

import { useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "emtiaz_admin_token";
const USER_KEY = "emtiaz_admin_user";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

/**
 * Hard-coded admin identity. The only account allowed to sign in to
 * the admin portal — even if a different ADMIN-role user somehow
 * exists in the database, the frontend refuses them.
 */
export const ADMIN_EMAIL = "emtiaz2060@gmail.com";

export const isAllowedAdmin = (email?: string | null) =>
  !!email && email.trim().toLowerCase() === ADMIN_EMAIL;

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: AdminUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("auth-change"));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("auth-change"));
}

/**
 * Fetch wrapper that automatically attaches the admin Bearer token
 * and JSON content-type. Throws a friendly Error with the server's
 * `message` on non-2xx responses.
 */
export async function authedFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  const text = await res.text();
  const json = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const message =
      (json && typeof json === "object" && "message" in json
        ? String((json as Record<string, unknown>).message)
        : null) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return (json && typeof json === "object" && "data" in json
    ? ((json as Record<string, unknown>).data as T)
    : (json as T));
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Reactive auth state for client components. Listens for `auth-change`
 * events so login/logout in any component updates everywhere.
 */
export function useAuth() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);

  const sync = useCallback(() => {
    setUser(getUser());
    setReady(true);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  return { user, ready, isAuthenticated: !!user };
}

export async function login(email: string, password: string) {
    if (!isAllowedAdmin(email)) {
      throw new Error("Invalid admin credentials.");
    }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    // Network/CORS error — fetch only throws when the request couldn't be made.
    throw new Error(
      `Can't reach the API server at ${API_URL}. Is the backend running?`
    );
  }

  const text = await res.text();
  const json = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const serverMsg =
      json && typeof json === "object" && "message" in json
        ? String((json as Record<string, unknown>).message)
        : null;

    // Map common backend errors to clearer guidance.
    if (res.status === 404) {
      throw new Error(
        "Admin account not found. Run `npx prisma db seed` in the server folder."
      );
    }
    if (res.status === 401) {
      throw new Error("Invalid password.");
    }
    if (res.status === 403) {
      throw new Error(serverMsg || "This account is not the admin.");
    }
    throw new Error(serverMsg || `Login failed (status ${res.status})`);
  }

  const data =
    json && typeof json === "object" && "data" in json
      ? ((json as Record<string, unknown>).data as {
          accessToken: string;
          user: AdminUser;
        })
      : null;

  if (!data?.accessToken || !data?.user) {
    throw new Error("Server returned an unexpected response shape.");
  }

  // Defense in depth: server already enforces ADMIN role + this email is
  // the only seeded admin, but reject anyway if anything else slips through.
  if (data.user.role !== "ADMIN" || !isAllowedAdmin(data.user.email)) {
    throw new Error("Access denied. This account is not the portal admin.");
  }

  saveSession(data.accessToken, data.user);
  return data;
}

/**
 * Lightweight check that pings the backend root. Returns true if the
 * server responded (any status), false if it's unreachable.
 */
export async function pingApi(): Promise<boolean> {
  try {
    const root = API_URL.replace(/\/api\/v1\/?$/, "");
    const res = await fetch(root, { method: "GET", cache: "no-store" });
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

export function logout() {
  clearSession();
}

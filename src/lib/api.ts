import { ApiResponse, PortfolioData, Project } from "@/types/portfolio";
import fallbackData from "./fallback-portfolio.json";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

/**
 * Backend-first with graceful fallback to embedded snapshot.
 * - In dev / when backend is reachable → live data
 * - On Vercel build / backend offline → snapshot from /lib/fallback-portfolio.json
 */
const FALLBACK_PORTFOLIO = fallbackData as unknown as PortfolioData;

export async function getPortfolio(): Promise<PortfolioData> {
  try {
    const res = await fetch(`${API_URL}/portfolio`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error("Failed to load portfolio data");
    const json: ApiResponse<PortfolioData> = await res.json();
    return json.data;
  } catch (err) {
    console.warn("[api] Portfolio fetch failed, using fallback snapshot:", err);
    return FALLBACK_PORTFOLIO;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API_URL}/projects/slug/${slug}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load project");
    const json: ApiResponse<Project> = await res.json();
    return json.data;
  } catch (err) {
    console.warn("[api] Project fetch failed, using fallback:", err);
    return (
      FALLBACK_PORTFOLIO.projects.find((p) => p.slug === slug) ?? null
    );
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/projects?limit=100`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error("Failed to load projects");
    const json: ApiResponse<Project[]> = await res.json();
    return json.data;
  } catch (err) {
    console.warn("[api] Projects fetch failed, using fallback:", err);
    return FALLBACK_PORTFOLIO.projects;
  }
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to send message");
  }

  return json;
}

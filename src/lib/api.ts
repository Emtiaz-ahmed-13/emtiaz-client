import {
  ApiResponse,
  BlogPost,
  PortfolioData,
  Profile,
  Project,
} from "@/types/portfolio";
import fallbackData from "./fallback-portfolio.json";
import { resolveImageUrl } from "./image-url";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

/**
 * Backend-first with graceful fallback to embedded snapshot.
 * - In dev / when backend is reachable → live data
 * - On Vercel build / backend offline → snapshot from /lib/fallback-portfolio.json
 */
const FALLBACK_PORTFOLIO = fallbackData as unknown as PortfolioData;

// Profile fields the live backend doesn't always populate yet (e.g. before re-seed).
// Merged on top of whatever the API returns so the UI always has these.
const PROFILE_DEFAULTS: Partial<Profile> = {
  avatarUrl: "https://i.ibb.co/JW5D3rdH/p.jpg",
  websiteUrl: "https://emtiaz-client.vercel.app/",
};

function withProfileDefaults(data: PortfolioData): PortfolioData {
  return {
    ...data,
    profile: {
      ...data.profile,
      avatarUrl: data.profile.avatarUrl ?? PROFILE_DEFAULTS.avatarUrl ?? null,
      websiteUrl: data.profile.websiteUrl ?? PROFILE_DEFAULTS.websiteUrl ?? null,
    },
    posts: (data.posts ?? []).map((post) => ({
      ...post,
      coverUrl: resolveImageUrl(post.coverUrl),
    })),
  };
}

function withResolvedBlogPost(post: BlogPost): BlogPost {
  return {
    ...post,
    coverUrl: resolveImageUrl(post.coverUrl),
  };
}

export async function getPortfolio(): Promise<PortfolioData> {
  try {
    const res = await fetch(`${API_URL}/portfolio`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error("Failed to load portfolio data");
    const json: ApiResponse<PortfolioData> = await res.json();
    return withProfileDefaults(json.data);
  } catch (err) {
    console.warn("[api] Portfolio fetch failed, using fallback snapshot:", err);
    return withProfileDefaults(FALLBACK_PORTFOLIO);
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

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/blog?limit=20`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error("Failed to load blog posts");
    const json: ApiResponse<BlogPost[]> = await res.json();
    return json.data.map(withResolvedBlogPost);
  } catch (err) {
    console.warn("[api] Blog fetch failed, using fallback snapshot:", err);
    return FALLBACK_PORTFOLIO.posts ?? [];
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/blog/slug/${slug}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load blog post");
    const json: ApiResponse<BlogPost> = await res.json();
    return withResolvedBlogPost(json.data);
  } catch (err) {
    console.warn("[api] Blog post fetch failed, using fallback:", err);
    return (
      (FALLBACK_PORTFOLIO.posts ?? [])
        .map(withResolvedBlogPost)
        .find((p) => p.slug === slug) ?? null
    );
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

/**
 * Server-side fetchers for competitive programming profiles.
 * Supports both ISR-cached (default) and live (no-cache) modes.
 *  - SSR initial render: cached (revalidate: 3600s)
 *  - Client-side refresh button: fresh (cache: no-store) via /api/coding-stats
 */

const REVALIDATE = 3600;

type FetchOpts = { fresh?: boolean };
const cacheInit = (fresh?: boolean): RequestInit =>
  fresh ? { cache: "no-store" } : { next: { revalidate: REVALIDATE } } as RequestInit;

export const CODING_PROFILES = {
  leetcode: {
    username: "emtiaz",
    url: "https://leetcode.com/u/emtiaz/",
  },
  codeforces: {
    handle: "Prince_Emtiaz",
    url: "https://codeforces.com/profile/Prince_Emtiaz",
  },
  codechef: {
    username: "prince_emtiaz",
    url: "https://www.codechef.com/users/prince_emtiaz",
  },
} as const;

export type LeetCodeStats = {
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number;
};

export type CodeforcesStats = {
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
};

export type CodeChefStats = {
  rating: number;
  maxRating: number;
  stars: number;
  globalRank: number;
  countryRank: number;
  solved: number;
  contests: number;
};

export type CodingStats = {
  leetcode: LeetCodeStats | null;
  codeforces: CodeforcesStats | null;
  codechef: CodeChefStats | null;
};

async function fetchLeetCode(opts: FetchOpts = {}): Promise<LeetCodeStats | null> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: CODING_PROFILES.leetcode.url,
      },
      body: JSON.stringify({
        query: `query { matchedUser(username: "${CODING_PROFILES.leetcode.username}") { username profile { ranking } submitStatsGlobal { acSubmissionNum { difficulty count } } } }`,
      }),
      ...cacheInit(opts.fresh),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const user = json?.data?.matchedUser;
    if (!user) return null;

    const stats: { difficulty: string; count: number }[] =
      user.submitStatsGlobal?.acSubmissionNum ?? [];
    const find = (d: string) =>
      stats.find((s) => s.difficulty === d)?.count ?? 0;

    return {
      solved: find("All"),
      easy: find("Easy"),
      medium: find("Medium"),
      hard: find("Hard"),
      ranking: user.profile?.ranking ?? 0,
    };
  } catch {
    return null;
  }
}

async function fetchCodeforces(opts: FetchOpts = {}): Promise<CodeforcesStats | null> {
  try {
    const res = await fetch(
      `https://codeforces.com/api/user.info?handles=${CODING_PROFILES.codeforces.handle}`,
      cacheInit(opts.fresh)
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== "OK") return null;
    const u = json.result?.[0];
    if (!u) return null;
    return {
      rating: u.rating ?? 0,
      maxRating: u.maxRating ?? 0,
      rank: u.rank ?? "unrated",
      maxRank: u.maxRank ?? "unrated",
    };
  } catch {
    return null;
  }
}

async function fetchCodeChef(opts: FetchOpts = {}): Promise<CodeChefStats | null> {
  try {
    const res = await fetch(
      `https://www.codechef.com/users/${CODING_PROFILES.codechef.username}`,
      {
        headers: { "User-Agent": "Mozilla/5.0 (portfolio-stats)" },
        ...cacheInit(opts.fresh),
      }
    );
    if (!res.ok) return null;
    const html = await res.text();

    const block =
      html.match(/<div id="rating-block-all">[\s\S]*?<\/ul>\s*<\/div>/)?.[0] ??
      "";

    const ratingStr = block.match(/rating-number">\s*(\d+)/)?.[1];
    const maxRatingStr = block.match(/Highest Rating\s*(\d+)/)?.[1];
    const starsCount = (block.match(/&#9733;/g) ?? []).length;
    const globalRankStr = block.match(
      /ratings\/all"[^>]*>\s*<strong>\s*(\d+)/
    )?.[1];
    const countryRankStr = block.match(
      /Bangladesh[^>]*>\s*<strong>\s*(\d+)/
    )?.[1];

    const solvedStr = html.match(/Total Problems Solved:\s*(\d+)/)?.[1];
    const contestsStr = html.match(
      /No\. of Contests Participated:[\s\S]*?\*\*([0-9]+)\*\*|No\. of Contests Participated:[^0-9]*(\d+)/
    );
    const contests = contestsStr
      ? parseInt(contestsStr[1] || contestsStr[2] || "0")
      : 0;

    const rating = parseInt(ratingStr ?? "0");
    if (!rating && !solvedStr) return null;

    return {
      rating,
      maxRating: parseInt(maxRatingStr ?? "0"),
      stars: starsCount,
      globalRank: parseInt(globalRankStr ?? "0"),
      countryRank: parseInt(countryRankStr ?? "0"),
      solved: parseInt(solvedStr ?? "0"),
      contests,
    };
  } catch {
    return null;
  }
}

export async function getCodingStats(
  opts: FetchOpts = {}
): Promise<CodingStats> {
  const [leetcode, codeforces, codechef] = await Promise.all([
    fetchLeetCode(opts),
    fetchCodeforces(opts),
    fetchCodeChef(opts),
  ]);
  return { leetcode, codeforces, codechef };
}

export function codeforcesRankColor(rank: string): string {
  const r = rank.toLowerCase();
  if (r.includes("legendary")) return "text-red-400";
  if (r.includes("international grand")) return "text-red-400";
  if (r.includes("grandmaster")) return "text-red-400";
  if (r.includes("international master")) return "text-orange-400";
  if (r.includes("master")) return "text-orange-400";
  if (r.includes("candidate master")) return "text-violet-400";
  if (r.includes("expert")) return "text-blue-400";
  if (r.includes("specialist")) return "text-cyan-400";
  if (r.includes("pupil")) return "text-emerald-400";
  if (r.includes("newbie")) return "text-zinc-400";
  return "text-muted-strong";
}

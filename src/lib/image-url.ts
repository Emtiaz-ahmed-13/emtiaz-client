/** ImgBB page links → direct image URLs */
const IMGBB_DIRECT: Record<string, string> = {
  "https://ibb.co/27PHRhmM":
    "https://i.ibb.co/fYtLZFBN/Screenshot-2026-05-28-at-2-41-14-PM.png",
  "https://ibb.co/3yC3jyNP": "https://i.ibb.co/8D7CfD5Q/pro.jpg",
};

export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const trimmed = url.trim().replace(/\/$/, "");

  if (trimmed.includes("i.ibb.co")) return trimmed;

  if (IMGBB_DIRECT[trimmed]) return IMGBB_DIRECT[trimmed];

  return trimmed;
}

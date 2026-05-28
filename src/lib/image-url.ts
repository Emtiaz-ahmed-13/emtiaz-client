/** ImgBB viewer pages → direct CDN URLs (client-side fallback). */
const IMGBB_DIRECT: Record<string, string> = {
  "https://ibb.co/27PHRhmM":
    "https://i.ibb.co/fYtLZFBN/Screenshot-2026-05-28-at-2-41-14-PM.png",
  "https://ibb.co/3yC3jyNP": "https://i.ibb.co/8D7CfD5Q/pro.jpg",
  "https://ibb.co/j9ZXTtW3": "https://i.ibb.co/Q7jwf0CY/cleark.png",
};

export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const trimmed = url.trim().replace(/\/$/, "");
  if (!trimmed) return null;

  if (trimmed.includes("i.ibb.co")) return trimmed;

  if (IMGBB_DIRECT[trimmed]) return IMGBB_DIRECT[trimmed];

  return trimmed;
}

/** True when URL is an ImgBB share page (HTML), not a direct image asset. */
export function isImgBbShareUrl(url: string | null | undefined) {
  if (!url) return false;
  const trimmed = url.trim().replace(/\/$/, "");
  return /^https?:\/\/ibb\.co\/[\w-]+$/i.test(trimmed);
}

export function isDirectImageUrl(url: string) {
  return (
    /i\.ibb\.co/i.test(url) ||
    /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(url) ||
    /res\.cloudinary\.com/i.test(url) ||
    /imagedelivery\.net/i.test(url)
  );
}

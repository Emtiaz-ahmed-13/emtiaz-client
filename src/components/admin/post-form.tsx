"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authedFetch } from "@/lib/auth";
import { isImgBbShareUrl, resolveImageUrl } from "@/lib/image-url";
import { BlogPost, BlogPostStatus } from "@/types/portfolio";

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  tags: string;
  readMinutes: number;
  publishedAt: string;
  status: BlogPostStatus;
  featured: boolean;
};

function toFormState(post?: BlogPost | null): FormState {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    coverUrl: post?.coverUrl ?? "",
    tags: (post?.tags ?? []).join(", "),
    readMinutes: post?.readMinutes ?? 5,
    publishedAt: post?.publishedAt
      ? new Date(post.publishedAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    status: post?.status ?? "PUBLISHED",
    featured: post?.featured ?? false,
  };
}

export function PostForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: BlogPost | null;
}) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(toFormState(initial));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const body = {
      title: state.title.trim(),
      slug: state.slug.trim() || undefined,
      excerpt: state.excerpt.trim(),
      content: state.content.trim() || null,
      coverUrl: state.coverUrl.trim() || null,
      tags: state.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      readMinutes: Number(state.readMinutes) || 5,
      publishedAt: new Date(state.publishedAt).toISOString(),
      status: state.status,
      featured: state.featured,
    };

    try {
      if (mode === "create") {
        const post = await authedFetch<BlogPost>("/blog", {
          method: "POST",
          body: JSON.stringify(body),
        });
        router.replace(`/admin/blog/${post.id}/edit?created=1`);
      } else if (initial) {
        await authedFetch<BlogPost>(`/blog/${initial.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
        router.refresh();
        alert("Saved.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field label="Title" required>
        <input
          type="text"
          required
          minLength={2}
          value={state.title}
          onChange={(e) => update("title", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field
        label="Slug"
        hint="Optional. Auto-generated from title if left blank. Lowercase, hyphenated."
      >
        <input
          type="text"
          value={state.slug}
          onChange={(e) => update("slug", e.target.value)}
          placeholder="my-blog-post"
          className={inputClass}
        />
      </Field>

      <Field
        label="Excerpt"
        required
        hint="One- to two-sentence summary shown on the blog list."
      >
        <textarea
          required
          minLength={10}
          rows={3}
          value={state.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          className={`${inputClass} resize-y`}
        />
      </Field>

      <Field
        label="Content (Markdown)"
        hint="Supports ## headings, **bold**, and `inline code`. Empty paragraphs become spacers."
      >
        <textarea
          rows={14}
          value={state.content}
          onChange={(e) => update("content", e.target.value)}
          className={`${inputClass} font-mono text-[13px] resize-y`}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Cover image URL"
          hint="Direct image URL. ImgBB share links (ibb.co/<id>) auto-resolve to the CDN."
        >
          <input
            type="url"
            value={state.coverUrl}
            onChange={(e) => update("coverUrl", e.target.value)}
            placeholder="https://i.ibb.co/.../my-cover.jpg"
            className={inputClass}
          />
          <CoverPreview url={state.coverUrl} />
        </Field>

        <Field label="Tags" hint="Comma-separated.">
          <input
            type="text"
            value={state.tags}
            onChange={(e) => update("tags", e.target.value)}
            placeholder="TypeScript, Patterns, Prisma"
            className={inputClass}
          />
        </Field>

        <Field label="Read time (minutes)">
          <input
            type="number"
            min={1}
            max={120}
            value={state.readMinutes}
            onChange={(e) => update("readMinutes", Number(e.target.value))}
            className={inputClass}
          />
        </Field>

        <Field label="Published date">
          <input
            type="date"
            value={state.publishedAt}
            onChange={(e) => update("publishedAt", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 rounded-2xl border border-border bg-card/40 p-5 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Status
          </p>
          <div className="mt-3 inline-flex overflow-hidden rounded-full border border-border bg-background">
            {(["DRAFT", "PUBLISHED"] as BlogPostStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => update("status", s)}
                className={`px-4 py-2 text-xs font-medium transition ${
                  state.status === s
                    ? "bg-foreground text-background"
                    : "text-muted-strong hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={state.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="size-4 accent-foreground"
          />
          <span>
            <span className="block text-sm font-medium">Featured</span>
            <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">
              Pinned to the top of the blog list
            </span>
          </span>
        </label>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          ✗ {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:gap-3 disabled:opacity-60"
        >
          {submitting
            ? "Saving…"
            : mode === "create"
              ? "Create post"
              : "Save changes"}
          {!submitting && (
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-full border border-border bg-card px-5 py-2.5 text-sm text-muted-strong transition hover:border-border-strong hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-foreground";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-strong">
        {label}
        {required && <span className="ml-1 text-foreground">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function CoverPreview({ url }: { url: string }) {
  const trimmed = url.trim();
  const [status, setStatus] = useState<"idle" | "ok" | "fail">("idle");

  if (!trimmed) return null;

  const previewSrc = resolveImageUrl(trimmed) ?? trimmed;
  const isSharePage = isImgBbShareUrl(trimmed);

  return (
    <div className="mt-3 space-y-2">
      {isSharePage && (
        <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-amber-300">
          ImgBB share link · preview uses CDN URL on save
        </p>
      )}
      <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border bg-background">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewSrc}
          alt="Cover preview"
          onLoad={() => setStatus("ok")}
          onError={() => setStatus("fail")}
          className="h-full w-full object-cover"
        />
        {status === "fail" && (
          <div className="absolute inset-0 grid place-items-center bg-background/85 text-center text-[11px] text-red-300">
            Image failed to load. Use a direct CDN URL or an ImgBB share link.
          </div>
        )}
      </div>
    </div>
  );
}

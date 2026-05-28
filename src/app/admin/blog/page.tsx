"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  EmptyState,
  FeaturedPill,
  PageHeader,
  Stat,
  StatusPill,
} from "@/components/admin/admin-ui";
import { authedFetch } from "@/lib/auth";
import { BlogPost } from "@/types/portfolio";

export default function AdminBlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authedFetch<BlogPost[]>("/blog/admin/all?limit=100");
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  async function handleDelete(post: BlogPost) {
    if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    setDeleting(post.id);
    try {
      await authedFetch(`/blog/${post.id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(null);
    }
  }

  const published = posts.filter((p) => p.status === "PUBLISHED");
  const drafts = posts.filter((p) => p.status === "DRAFT");
  const featured = posts.filter((p) => p.featured);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        eyebrow="Blog"
        title="Posts"
        action={
          <Link
            href="/admin/blog/new"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition hover:gap-3"
          >
            + New post
            <span
              aria-hidden
              className="transition group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        }
      />

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total" value={posts.length} />
        <Stat label="Published" value={published.length} />
        <Stat label="Drafts" value={drafts.length} />
        <Stat label="Featured" value={featured.length} />
      </div>

      <div className="mt-10">
        {loading ? (
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Loading…
          </p>
        ) : error ? (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            ✗ {error}
          </p>
        ) : posts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            body="Drafts and published articles will show up here."
            cta={
              <Link
                href="/admin/blog/new"
                className="rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background"
              >
                Write your first post →
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/40">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex flex-col gap-3 px-5 py-4 transition hover:bg-card sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill status={post.status ?? "PUBLISHED"} />
                    {post.featured && <FeaturedPill />}
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="mt-1.5 truncate text-[15px] font-medium">
                    {post.title}
                  </p>
                  <p className="truncate font-mono text-[11px] text-muted">
                    /blog/{post.slug}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-strong transition hover:border-border-strong hover:text-foreground"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background transition hover:opacity-90"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    disabled={deleting === post.id}
                    onClick={() => handleDelete(post)}
                    className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {deleting === post.id ? "…" : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PostForm } from "@/components/admin/post-form";
import { authedFetch } from "@/lib/auth";
import { BlogPost } from "@/types/portfolio";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const justCreated = search.get("created") === "1";

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await authedFetch<BlogPost>(`/blog/${params.id}`);
        if (!cancelled) setPost(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params?.id]);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href="/admin"
        className="link-underline font-mono text-[10px] uppercase tracking-widest text-muted-strong hover:text-foreground"
      >
        ← Back to overview
      </Link>

      <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em]">
        Edit post.
      </h1>

      {justCreated && (
        <p className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          ✓ Post created. You can keep editing below.
        </p>
      )}

      <div className="mt-10">
        {loading ? (
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Loading…
          </p>
        ) : error ? (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            ✗ {error}
          </p>
        ) : (
          <PostForm mode="edit" initial={post} />
        )}
      </div>
    </div>
  );
}

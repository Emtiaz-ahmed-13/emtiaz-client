"use client";

import Link from "next/link";
import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href="/admin"
        className="link-underline font-mono text-[10px] uppercase tracking-widest text-muted-strong hover:text-foreground"
      >
        ← Back to overview
      </Link>

      <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em]">
        New post.
      </h1>
      <p className="mt-3 text-sm text-muted-strong">
        Drafts stay private until you switch the status to{" "}
        <span className="font-medium text-foreground">Published</span>.
      </p>

      <div className="mt-10">
        <PostForm mode="create" />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CoverImage } from "@/components/cover-image";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getBlogPosts, getPortfolio } from "@/lib/api";
import { BlogPost } from "@/types/portfolio";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Writing · Emtiaz Ahmed",
  description:
    "Short, opinionated notes on architecture, TypeScript patterns, and lessons from shipping production software.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogIndexPage() {
  const [posts, portfolio] = await Promise.all([
    getBlogPosts().catch(() => [] as BlogPost[]),
    getPortfolio().catch(() => null),
  ]);

  const sorted = [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const tags = Array.from(new Set(posts.flatMap((p) => p.tags))).slice(0, 12);

  return (
    <>
      <Navbar name="Emtiaz Ahmed" />

      <main className="pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          {/* Header */}
          <div className="flex flex-col gap-6 border-b border-border pb-12 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <div>
              <Link
                href="/"
                className="link-underline font-mono text-[10px] uppercase tracking-widest text-muted-strong hover:text-foreground"
              >
                ← Back to home
              </Link>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Writing.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-strong sm:text-lg">
                Short, opinionated notes on architecture, TypeScript patterns,
                and lessons from shipping. New posts land here every few weeks.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted">
              <span className="rounded-full border border-border bg-card px-3 py-1 text-muted-strong">
                {posts.length} {posts.length === 1 ? "Post" : "Posts"}
              </span>
              {tags.length > 0 && (
                <span className="rounded-full border border-border bg-card px-3 py-1 text-muted-strong">
                  {tags.length} {tags.length === 1 ? "Topic" : "Topics"}
                </span>
              )}
            </div>
          </div>

          {/* Tag chips */}
          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-card/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-strong"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* List */}
          <div className="mt-14">
            {sorted.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="divide-y divide-border">
                {sorted.map((post) => (
                  <li key={post.id}>
                    <PostRow post={post} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <Footer
        name="Emtiaz Ahmed"
        year={new Date().getFullYear()}
        profile={portfolio?.profile}
      />
    </>
  );
}

function PostRow({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-1 gap-6 py-10 transition sm:grid-cols-[1.4fr_1fr] sm:gap-10"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
          <span>{formatDate(post.publishedAt)}</span>
          <span className="size-1 rounded-full bg-muted" />
          <span>{post.readMinutes} min read</span>
          {post.featured && (
            <>
              <span className="size-1 rounded-full bg-muted" />
              <span className="text-foreground">Featured</span>
            </>
          )}
        </div>

        <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.02em] transition group-hover:text-muted-strong sm:text-3xl">
          {post.title}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-strong sm:text-[15px]">
          {post.excerpt}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-card/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-strong"
            >
              {tag}
            </span>
          ))}
          <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-strong transition group-hover:text-foreground">
            Read
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
        </div>
      </div>

      {post.coverUrl ? (
        <CoverImage
          src={post.coverUrl}
          alt={post.title}
          fill
          aspectClassName="relative aspect-video w-full overflow-hidden rounded-xl border border-border sm:max-w-xs sm:justify-self-end"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 320px"
        />
      ) : (
        <div className="relative hidden aspect-video items-center justify-center overflow-hidden rounded-xl border border-border bg-card/40 sm:flex sm:max-w-xs sm:justify-self-end">
          <span className="font-mono text-6xl font-semibold text-border-strong">
            {post.title.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 px-8 py-20 text-center">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
        No posts yet
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">
        The first post lands soon.
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-strong">
        Subscribe via the contact form and you&apos;ll be the first to know.
      </p>
      <Link
        href="/#contact"
        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background"
      >
        Get notified
        <span aria-hidden className="transition group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </div>
  );
}

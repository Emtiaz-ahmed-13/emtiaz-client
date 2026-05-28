import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverImage } from "@/components/cover-image";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { SectionLabel } from "@/components/ui/section-label";
import { getBlogPostBySlug, getBlogPosts, getPortfolio } from "@/lib/api";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);

  if (!post) return { title: "Post not found" };

  return {
    title: `${post.title} · Emtiaz Ahmed`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverUrl ? [post.coverUrl] : [],
      type: "article",
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
  };
}

// Tiny markdown renderer for `## heading`, `**bold**`, `` `code` ``, paragraphs.
// Enough for hand-written posts; swap in a real parser later if needed.
function renderInline(line: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) parts.push(line.slice(last, m.index));
    if (m[1]) {
      parts.push(
        <strong key={`b-${key++}`} className="font-semibold text-foreground">
          {m[1]}
        </strong>
      );
    } else if (m[2]) {
      parts.push(
        <code
          key={`c-${key++}`}
          className="rounded-md border border-border bg-card px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {m[2]}
        </code>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

function renderMarkdown(content: string) {
  const blocks = content.split(/\n\s*\n/);
  return blocks.map((raw, i) => {
    const trimmed = raw.trim();
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="mt-12 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl"
        >
          {renderInline(trimmed.slice(3))}
        </h2>
      );
    }
    if (trimmed.startsWith("# ")) {
      return (
        <h1
          key={i}
          className="mt-10 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl"
        >
          {renderInline(trimmed.slice(2))}
        </h1>
      );
    }
    return (
      <p
        key={i}
        className="mt-5 text-[15px] leading-relaxed text-muted-strong sm:text-base"
      >
        {renderInline(trimmed)}
      </p>
    );
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post, portfolio, allPosts] = await Promise.all([
    getBlogPostBySlug(slug).catch(() => null),
    getPortfolio().catch(() => null),
    getBlogPosts().catch(() => []),
  ]);

  if (!post) notFound();

  const ordered = [...allPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const idx = ordered.findIndex((p) => p.slug === slug);
  const prev =
    idx >= 0 && idx < ordered.length - 1
      ? { slug: ordered[idx + 1].slug, title: ordered[idx + 1].title }
      : null;
  const next =
    idx > 0
      ? { slug: ordered[idx - 1].slug, title: ordered[idx - 1].title }
      : null;

  return (
    <>
      <Navbar name="Emtiaz Ahmed" />

      <main className="relative px-6 pt-40 pb-24 sm:pt-44">
        <article className="mx-auto w-full max-w-3xl">
          <Link
            href="/#blog"
            className="link-underline inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-strong hover:text-foreground"
          >
            ← Back to writing
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <SectionLabel>{formatDate(post.publishedAt)}</SectionLabel>
            <span className="h-px w-6 bg-border-strong" aria-hidden />
            <SectionLabel>{post.readMinutes} min read</SectionLabel>
            {post.featured && (
              <>
                <span className="h-px w-6 bg-border-strong" aria-hidden />
                <SectionLabel>Featured</SectionLabel>
              </>
            )}
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-strong sm:text-xl">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
          </div>

          {post.coverUrl && (
            <CoverImage
              src={post.coverUrl}
              alt={post.title}
              fill
              priority
              aspectClassName="relative mt-12 aspect-video overflow-hidden rounded-2xl border border-border"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          )}

          <div className="mt-10 border-t border-border pt-6">
            {post.content ? (
              renderMarkdown(post.content)
            ) : (
              <p className="text-[15px] leading-relaxed text-muted-strong">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* prev / next */}
          {(prev || next) && (
            <nav className="mt-20 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="group rounded-2xl border border-border bg-card/60 p-5 transition hover:border-border-strong"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    ← Previous
                  </p>
                  <p className="mt-2 text-sm font-medium transition group-hover:text-muted-strong">
                    {prev.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group rounded-2xl border border-border bg-card/60 p-5 text-right transition hover:border-border-strong"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    Next →
                  </p>
                  <p className="mt-2 text-sm font-medium transition group-hover:text-muted-strong">
                    {next.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </article>
      </main>

      <Footer
        name="Emtiaz Ahmed"
        year={new Date().getFullYear()}
        profile={portfolio?.profile}
      />
    </>
  );
}

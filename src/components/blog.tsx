"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CoverImage } from "@/components/cover-image";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { BlogPost } from "@/types/portfolio";

const HOME_LIMIT = 3;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const href = `/blog/${post.slug}`;

  return (
    <Card
      as="a"
      href={href}
      tilt
      delay={index * 0.06}
      className="group flex h-full flex-col justify-between p-6!"
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
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

        {post.coverUrl && (
          <CoverImage
            src={post.coverUrl}
            alt={post.title}
            fill
            aspectClassName="relative mt-5 aspect-video overflow-hidden rounded-xl border border-border"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] transition-colors group-hover:text-muted-strong sm:text-[22px]">
          {post.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-muted-strong">
          {post.excerpt}
        </p>
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="muted" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-strong transition group-hover:text-foreground">
          Read
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 px-8 py-16 text-center backdrop-blur-sm">
      <SectionLabel>No posts yet</SectionLabel>
      <h3 className="mt-4 text-2xl font-semibold tracking-[-0.02em]">
        First post lands soon.
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-strong">
        Notes on architecture, TypeScript patterns, and lessons from shipping.
        Subscribe via the contact form to know when the first one ships.
      </p>
      <a
        href="#contact"
        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition hover:gap-3"
      >
        Get notified
        <span aria-hidden className="transition group-hover:translate-x-0.5">
          →
        </span>
      </a>
    </div>
  );
}

export function Blog({ posts }: { posts: BlogPost[] }) {
  const items = posts ?? [];
  const visible = items.slice(0, HOME_LIMIT);
  const hasMore = items.length > HOME_LIMIT;
  const topicCount = Array.from(new Set(items.flatMap((p) => p.tags))).length;

  return (
    <Section id="blog">
      <SectionHeading
        index="07 / Writing"
        title="Notes from the build."
        subtitle="Short, opinionated write-ups about the patterns, tools, and trade-offs I keep reaching for."
        action={
          hasMore ? (
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-[13px] font-medium text-foreground transition hover:border-border-strong hover:bg-background"
            >
              See all {items.length} posts
              <span
                aria-hidden
                className="transition group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          ) : null
        }
      />

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 flex flex-wrap items-center gap-3"
          >
            <Badge variant="outline" className="gap-1.5">
              {items.length} {items.length === 1 ? "Post" : "Posts"}
            </Badge>
            <Badge variant="muted">
              {topicCount} {topicCount === 1 ? "Topic" : "Topics"}
            </Badge>
            <Badge variant="muted">More on the way</Badge>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>

          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 px-6 py-5 backdrop-blur-sm"
            >
              <div>
                <SectionLabel>Archive</SectionLabel>
                <p className="mt-1.5 text-sm text-muted-strong">
                  {items.length - HOME_LIMIT} more{" "}
                  {items.length - HOME_LIMIT === 1 ? "post" : "posts"} in the
                  archive — every article I&apos;ve written, sorted by date.
                </p>
              </div>
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition hover:gap-3"
              >
                Browse the archive
                <span
                  aria-hidden
                  className="transition group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </motion.div>
          )}
        </>
      )}
    </Section>
  );
}

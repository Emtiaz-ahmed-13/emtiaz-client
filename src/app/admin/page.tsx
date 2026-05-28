"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader, Stat } from "@/components/admin/admin-ui";
import { authedFetch } from "@/lib/auth";
import { BlogPost, Project } from "@/types/portfolio";

type AdminMetrics = {
  posts: BlogPost[];
  projects: Project[];
};

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    posts: [],
    projects: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [posts, projects] = await Promise.all([
          authedFetch<BlogPost[]>("/blog/admin/all?limit=100"),
          authedFetch<Project[]>("/projects?limit=100&published=true").catch(
            () => [] as Project[]
          ),
        ]);
        if (!cancelled) setMetrics({ posts, projects });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const publishedPosts = metrics.posts.filter((p) => p.status === "PUBLISHED");
  const draftPosts = metrics.posts.filter((p) => p.status === "DRAFT");
  const featuredProjects = metrics.projects.filter((p) => p.featured);
  const recentPosts = [...metrics.posts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 4);
  const recentProjects = [...metrics.projects]
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-12">
      <PageHeader eyebrow="Admin" title="Overview" />

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          ✗ {error}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Posts"
          value={loading ? "…" : metrics.posts.length}
          hint={`${publishedPosts.length} live · ${draftPosts.length} draft`}
        />
        <Stat
          label="Projects"
          value={loading ? "…" : metrics.projects.length}
          hint={`${featuredProjects.length} featured`}
        />
        <Stat label="Topics" value={loading ? "…" : countTopics(metrics.posts)} />
        <Stat
          label="Tech"
          value={loading ? "…" : countTech(metrics.projects)}
        />
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Quick actions
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <QuickAction
            href="/admin/blog/new"
            label="New blog post"
            description="Write and publish a new article."
          />
          <QuickAction
            href="/admin/projects/new"
            label="New project"
            description="Add a project to the Work section."
          />
        </div>
      </section>

      {/* How to publish */}
      <section className="rounded-2xl border border-border bg-card/40 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Quick guide
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em]">
              Publish a blog post in 60 seconds
            </h2>
          </div>
          <Link
            href="/admin/blog/new"
            className="hidden shrink-0 rounded-full bg-foreground px-4 py-2 text-[12px] font-medium text-background transition hover:opacity-90 sm:inline-flex"
          >
            Open editor →
          </Link>
        </div>

        <ol className="mt-6 space-y-4">
          <Step
            n="1"
            title="Open the editor"
            body={
              <>
                Click{" "}
                <Link
                  href="/admin/blog/new"
                  className="link-underline text-foreground"
                >
                  New blog post
                </Link>{" "}
                above (or use the sidebar).
              </>
            }
          />
          <Step
            n="2"
            title="Fill the basics"
            body={
              <>
                Title, a 1–2 line excerpt, and the post body. Slug is
                auto-generated from the title — leave it blank.
              </>
            }
          />
          <Step
            n="3"
            title="Set status to Published"
            body={
              <>
                Toggle <span className="font-mono text-foreground">Published</span> to make it live, or keep{" "}
                <span className="font-mono text-foreground">Draft</span> and finish later.
                Flip <span className="font-mono text-foreground">Featured</span> to spotlight it on the homepage.
              </>
            }
          />
          <Step
            n="4"
            title="Hit Create"
            body={
              <>
                The post appears immediately at{" "}
                <span className="font-mono text-foreground">/blog/your-slug</span> and inside the homepage Writing section.
              </>
            }
          />
        </ol>

        <p className="mt-6 border-t border-border pt-5 font-mono text-[10px] uppercase tracking-widest text-muted">
          Projects work the same way at{" "}
          <Link
            href="/admin/projects/new"
            className="link-underline text-muted-strong hover:text-foreground"
          >
            /admin/projects/new
          </Link>
          .
        </p>
      </section>

      {/* Recent posts */}
      <Section
        title="Recent posts"
        viewAllHref="/admin/blog"
        items={recentPosts}
        loading={loading}
        emptyHint="No posts yet."
        renderItem={(p) => (
          <RecentRow
            key={p.id}
            title={p.title}
            sub={`/blog/${p.slug}`}
            href={`/admin/blog/${p.id}/edit`}
            meta={p.status === "DRAFT" ? "Draft" : "Published"}
          />
        )}
      />

      {/* Recent projects */}
      <Section
        title="Recent projects"
        viewAllHref="/admin/projects"
        items={recentProjects}
        loading={loading}
        emptyHint="No projects yet."
        renderItem={(p) => (
          <RecentRow
            key={p.id}
            title={p.title}
            sub={`/projects/${p.slug}`}
            href={`/admin/projects/${p.id}/edit`}
            meta={p.featured ? "Featured" : "Project"}
          />
        )}
      />
    </div>
  );
}

function countTopics(posts: BlogPost[]) {
  return new Set(posts.flatMap((p) => p.tags ?? [])).size;
}
function countTech(projects: Project[]) {
  return new Set(projects.flatMap((p) => p.techStack ?? [])).size;
}

function QuickAction({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 px-5 py-4 transition hover:border-border-strong"
    >
      <div>
        <p className="text-[15px] font-medium">{label}</p>
        <p className="mt-1 text-xs text-muted-strong">{description}</p>
      </div>
      <span
        aria-hidden
        className="text-muted transition group-hover:translate-x-0.5 group-hover:text-foreground"
      >
        →
      </span>
    </Link>
  );
}

function Section<T>({
  title,
  viewAllHref,
  items,
  loading,
  emptyHint,
  renderItem,
}: {
  title: string;
  viewAllHref: string;
  items: T[];
  loading: boolean;
  emptyHint: string;
  renderItem: (item: T) => React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-end justify-between">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="link-underline font-mono text-[10px] uppercase tracking-widest text-muted-strong hover:text-foreground"
        >
          View all →
        </Link>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card/40">
        {loading ? (
          <p className="px-5 py-4 font-mono text-[11px] uppercase tracking-widest text-muted">
            Loading…
          </p>
        ) : items.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-strong">{emptyHint}</p>
        ) : (
          <ul className="divide-y divide-border">{items.map(renderItem)}</ul>
        )}
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border bg-background font-mono text-[10px] text-muted-strong">
        {n}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-strong">
          {body}
        </p>
      </div>
    </li>
  );
}

function RecentRow({
  title,
  sub,
  href,
  meta,
}: {
  title: string;
  sub: string;
  href: string;
  meta: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-card"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{title}</p>
          <p className="truncate font-mono text-[11px] text-muted">{sub}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {meta}
          </span>
          <span
            aria-hidden
            className="text-muted transition group-hover:translate-x-0.5 group-hover:text-foreground"
          >
            →
          </span>
        </div>
      </Link>
    </li>
  );
}

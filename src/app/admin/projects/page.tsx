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
import { Project } from "@/types/portfolio";

export default function AdminProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // /projects?published=false fetches all (published + unpublished) for admins
      const data = await authedFetch<Project[]>("/projects?limit=100");
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  async function handleDelete(project: Project) {
    if (!confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    setDeleting(project.id);
    try {
      await authedFetch(`/projects/${project.id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(null);
    }
  }

  const published = projects.filter((p) => p.published);
  const featured = projects.filter((p) => p.featured);
  const techCount = new Set(projects.flatMap((p) => p.techStack ?? [])).size;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        eyebrow="Work"
        title="Projects"
        action={
          <Link
            href="/admin/projects/new"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition hover:gap-3"
          >
            + New project
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
        <Stat label="Total" value={projects.length} />
        <Stat label="Published" value={published.length} />
        <Stat label="Featured" value={featured.length} />
        <Stat label="Tech" value={techCount} />
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
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            body="Add your first project — it will appear in the Work section on the homepage."
            cta={
              <Link
                href="/admin/projects/new"
                className="rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background"
              >
                Add a project →
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/40">
            {projects
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((project) => (
                <li
                  key={project.id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-card sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill
                        status={project.published ? "PUBLISHED" : "UNPUBLISHED"}
                      />
                      {project.featured && <FeaturedPill />}
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                        #{project.order}
                      </span>
                    </div>

                    <p className="mt-1.5 truncate text-[15px] font-medium">
                      {project.title}
                    </p>
                    <p className="truncate font-mono text-[11px] text-muted">
                      /projects/{project.slug}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-strong transition hover:border-border-strong hover:text-foreground"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background transition hover:opacity-90"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={deleting === project.id}
                      onClick={() => handleDelete(project)}
                      className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {deleting === project.id ? "…" : "Delete"}
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

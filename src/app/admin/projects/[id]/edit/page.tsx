"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProjectForm } from "@/components/admin/project-form";
import { authedFetch } from "@/lib/auth";
import { Project } from "@/types/portfolio";

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const justCreated = search.get("created") === "1";

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await authedFetch<Project>(`/projects/${params.id}`);
        if (!cancelled) setProject(data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load project"
          );
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
        href="/admin/projects"
        className="link-underline font-mono text-[10px] uppercase tracking-widest text-muted-strong hover:text-foreground"
      >
        ← Back to projects
      </Link>

      <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em]">
        Edit project.
      </h1>

      {justCreated && (
        <p className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          ✓ Project created. Keep editing below to add the case-study details.
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
          <ProjectForm mode="edit" initial={project} />
        )}
      </div>
    </div>
  );
}

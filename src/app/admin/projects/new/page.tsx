"use client";

import Link from "next/link";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href="/admin/projects"
        className="link-underline font-mono text-[10px] uppercase tracking-widest text-muted-strong hover:text-foreground"
      >
        ← Back to projects
      </Link>

      <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em]">
        New project.
      </h1>
      <p className="mt-3 text-sm text-muted-strong">
        Fill in just the basics to start — case-study fields are all optional and
        can be filled in later.
      </p>

      <div className="mt-10">
        <ProjectForm mode="create" />
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useState } from "react";
import { authedFetch } from "@/lib/auth";
import { Project } from "@/types/portfolio";

type FormState = {
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  techStack: string;
  features: string;
  screenshots: string;
  problem: string;
  approach: string;
  outcome: string;
  challenges: string;
  role: string;
  duration: string;
  featured: boolean;
  published: boolean;
  order: number;
};

function toFormState(project?: Project | null): FormState {
  return {
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    shortDesc: project?.shortDesc ?? "",
    description: project?.description ?? "",
    imageUrl: project?.imageUrl ?? "",
    liveUrl: project?.liveUrl ?? "",
    githubUrl: project?.githubUrl ?? "",
    techStack: (project?.techStack ?? []).join(", "),
    features: (project?.features ?? []).join("\n"),
    screenshots: (project?.screenshots ?? []).join("\n"),
    problem: project?.problem ?? "",
    approach: project?.approach ?? "",
    outcome: project?.outcome ?? "",
    challenges: project?.challenges ?? "",
    role: project?.role ?? "",
    duration: project?.duration ?? "",
    featured: project?.featured ?? false,
    published: project?.published ?? true,
    order: project?.order ?? 0,
  };
}

const splitCsv = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

const splitLines = (s: string) =>
  s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

const orNull = (s: string) => (s.trim() ? s.trim() : null);

export function ProjectForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: Project | null;
}) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(toFormState(initial));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setOkMsg(null);

    const body = {
      title: state.title.trim(),
      slug: state.slug.trim() || undefined,
      description: state.description.trim(),
      shortDesc: orNull(state.shortDesc) ?? undefined,
      imageUrl: orNull(state.imageUrl),
      liveUrl: orNull(state.liveUrl),
      githubUrl: orNull(state.githubUrl),
      techStack: splitCsv(state.techStack),
      features: splitLines(state.features),
      screenshots: splitLines(state.screenshots),
      problem: orNull(state.problem) ?? undefined,
      approach: orNull(state.approach) ?? undefined,
      outcome: orNull(state.outcome) ?? undefined,
      challenges: orNull(state.challenges) ?? undefined,
      role: orNull(state.role) ?? undefined,
      duration: orNull(state.duration) ?? undefined,
      featured: state.featured,
      published: state.published,
      order: Number(state.order) || 0,
    };

    try {
      if (mode === "create") {
        const project = await authedFetch<Project>("/projects", {
          method: "POST",
          body: JSON.stringify(body),
        });
        router.replace(`/admin/projects/${project.id}/edit?created=1`);
      } else if (initial) {
        await authedFetch<Project>(`/projects/${initial.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
        setOkMsg("Saved.");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <FormSection title="Basics">
        <Field label="Title" required>
          <input
            type="text"
            required
            value={state.title}
            onChange={(e) => update("title", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Slug" hint="Auto-generated from title if blank.">
          <input
            type="text"
            value={state.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="my-project"
            className={inputClass}
          />
        </Field>

        <Field
          label="Short description"
          hint="One-line summary shown on the project card."
        >
          <input
            type="text"
            value={state.shortDesc}
            onChange={(e) => update("shortDesc", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Description" required hint="Long-form, shown in detail pages.">
          <textarea
            required
            minLength={10}
            rows={5}
            value={state.description}
            onChange={(e) => update("description", e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>
      </FormSection>

      <FormSection title="Links & media">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Cover image URL">
            <input
              type="url"
              value={state.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="https://i.ibb.co/..."
              className={inputClass}
            />
          </Field>
          <Field label="Live URL">
            <input
              type="url"
              value={state.liveUrl}
              onChange={(e) => update("liveUrl", e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </Field>
          <Field label="GitHub URL">
            <input
              type="url"
              value={state.githubUrl}
              onChange={(e) => update("githubUrl", e.target.value)}
              placeholder="https://github.com/..."
              className={inputClass}
            />
          </Field>
          <Field label="Tech stack" hint="Comma-separated.">
            <input
              type="text"
              value={state.techStack}
              onChange={(e) => update("techStack", e.target.value)}
              placeholder="Next.js, TypeScript, Prisma"
              className={inputClass}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Case study">
        <Field label="Role">
          <input
            type="text"
            value={state.role}
            onChange={(e) => update("role", e.target.value)}
            placeholder="Full Stack Engineer"
            className={inputClass}
          />
        </Field>
        <Field label="Duration">
          <input
            type="text"
            value={state.duration}
            onChange={(e) => update("duration", e.target.value)}
            placeholder="6 weeks"
            className={inputClass}
          />
        </Field>
        <Field label="Problem">
          <textarea
            rows={3}
            value={state.problem}
            onChange={(e) => update("problem", e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>
        <Field label="Approach">
          <textarea
            rows={3}
            value={state.approach}
            onChange={(e) => update("approach", e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>
        <Field label="Outcome">
          <textarea
            rows={3}
            value={state.outcome}
            onChange={(e) => update("outcome", e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>
        <Field label="Challenges">
          <textarea
            rows={3}
            value={state.challenges}
            onChange={(e) => update("challenges", e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>
        <Field
          label="Features"
          hint="One feature per line."
        >
          <textarea
            rows={4}
            value={state.features}
            onChange={(e) => update("features", e.target.value)}
            placeholder={"Multi-step adoption flow\nAdmin moderation panel\nEmail notifications"}
            className={`${inputClass} font-mono text-[13px] resize-y`}
          />
        </Field>
        <Field
          label="Screenshots"
          hint="One image URL per line."
        >
          <textarea
            rows={3}
            value={state.screenshots}
            onChange={(e) => update("screenshots", e.target.value)}
            placeholder={"https://i.ibb.co/.../shot1.png\nhttps://i.ibb.co/.../shot2.png"}
            className={`${inputClass} font-mono text-[13px] resize-y`}
          />
        </Field>
      </FormSection>

      <FormSection title="Visibility">
        <div className="grid gap-6 rounded-2xl border border-border bg-card/40 p-5 sm:grid-cols-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={state.published}
              onChange={(e) => update("published", e.target.checked)}
              className="size-4 accent-foreground"
            />
            <span>
              <span className="block text-sm font-medium">Published</span>
              <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">
                Visible on the site
              </span>
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={state.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="size-4 accent-foreground"
            />
            <span>
              <span className="block text-sm font-medium">Featured</span>
              <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">
                Spotlight slot
              </span>
            </span>
          </label>

          <Field label="Order" hint="Lower numbers appear first.">
            <input
              type="number"
              min={0}
              value={state.order}
              onChange={(e) => update("order", Number(e.target.value))}
              className={inputClass}
            />
          </Field>
        </div>
      </FormSection>

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          ✗ {error}
        </p>
      )}
      {okMsg && (
        <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          ✓ {okMsg}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:gap-3 disabled:opacity-60"
        >
          {submitting
            ? "Saving…"
            : mode === "create"
              ? "Create project"
              : "Save changes"}
          {!submitting && (
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="rounded-full border border-border bg-card px-5 py-2.5 text-sm text-muted-strong transition hover:border-border-strong hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-foreground";

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-6">
      <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-strong">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-strong">
        {label}
        {required && <span className="ml-1 text-foreground">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

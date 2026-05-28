import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getAllProjects, getPortfolio } from "@/lib/api";
import { Project } from "@/types/portfolio";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Work · Emtiaz Ahmed",
  description:
    "Selected production-grade projects — full-stack systems, APIs, and product interfaces built end-to-end.",
};

export default async function ProjectsIndexPage() {
  const [projects, portfolio] = await Promise.all([
    getAllProjects().catch(() => [] as Project[]),
    getPortfolio().catch(() => null),
  ]);

  const sorted = [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.order - b.order;
  });

  const techs = Array.from(new Set(projects.flatMap((p) => p.techStack))).slice(
    0,
    16
  );

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
                Work.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-strong sm:text-lg">
                Full-stack apps, backend APIs, and shipped products. Each card
                links to a case study with the problem, approach, and outcome.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted">
              <span className="rounded-full border border-border bg-card px-3 py-1 text-muted-strong">
                {projects.length}{" "}
                {projects.length === 1 ? "Project" : "Projects"}
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-muted-strong">
                {projects.filter((p) => p.featured).length} Featured
              </span>
            </div>
          </div>

          {/* Tech chips */}
          {techs.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {techs.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-card/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-strong"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* List */}
          <div className="mt-14">
            {sorted.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {sorted.map((project) => (
                  <ProjectTile key={project.id} project={project} />
                ))}
              </div>
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

function ProjectTile({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/40 transition hover:border-border-strong hover:bg-card/60"
    >
      {/* Cover */}
      <div className="relative aspect-video w-full overflow-hidden bg-background">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-mono text-7xl font-semibold text-border-strong">
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent"
        />
        {project.featured && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-muted-strong backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-amber-400" />
            Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
          <span>0{project.order || 1}</span>
          <span className="size-1 rounded-full bg-muted" />
          <span>{project.techStack[0] ?? "Full Stack"}</span>
        </div>

        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] transition group-hover:text-muted-strong">
          {project.title}
        </h3>

        {project.shortDesc && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-strong">
            {project.shortDesc}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 font-mono text-[10px] tracking-tight text-muted-strong"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="rounded-full px-2.5 py-0.5 font-mono text-[10px] tracking-tight text-muted">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Case study
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-strong transition group-hover:text-foreground">
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
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 px-8 py-20 text-center">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
        No projects yet
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">
        Case studies are coming.
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-strong">
        Reach out and I&apos;ll send links to my latest production builds
        directly.
      </p>
      <Link
        href="/#contact"
        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background"
      >
        Get in touch
        <span aria-hidden className="transition group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </div>
  );
}

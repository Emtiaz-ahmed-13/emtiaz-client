"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronRight,
  ExternalLink,
  Gauge,
  Layers,
  Lightbulb,
  Route,
  Target,
  Trophy,
  UserRound,
  Wrench,
} from "lucide-react";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveImageUrl } from "@/lib/image-url";
import { Project } from "@/types/portfolio";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-1.93c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.07 0 0 .97-.31 3.18 1.19a11.07 11.07 0 015.78 0c2.21-1.5 3.18-1.19 3.18-1.19.63 1.6.23 2.78.11 3.07.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.27 5.68.41.36.77 1.06.77 2.14v3.18c0 .31.21.66.79.55C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function getProjectProof(project: Project) {
  const title = project.title.toLowerCase();

  if (title.includes("purrfect")) {
    return [
      { label: "Timeline", value: "6 weeks" },
      { label: "Performance", value: "95+ Lighthouse" },
      { label: "Backend", value: "Prisma + PostgreSQL" },
      { label: "Outcome", value: "sub-200ms cached TTFB" },
    ];
  }

  if (title.includes("skillsync")) {
    return [
      { label: "Product", value: "Escrow + Kanban" },
      { label: "Realtime", value: "Socket.io workflow" },
      { label: "Auth", value: "Role-based access" },
      { label: "Scope", value: "End-to-end build" },
    ];
  }

  if (title.includes("tradenest")) {
    return [
      { label: "API", value: "Swagger documented" },
      { label: "Security", value: "Rate limited" },
      { label: "Reliability", value: "Redis-backed flows" },
      { label: "Deploy", value: "Docker-ready" },
    ];
  }

  return [
    project.duration && { label: "Timeline", value: project.duration },
    project.role && { label: "Role", value: project.role },
    { label: "Status", value: project.liveUrl ? "Live" : "Documented" },
    { label: "Stack", value: `${project.techStack.length} tools` },
  ].filter(Boolean) as { label: string; value: string }[];
}

const LIGHTHOUSE_PROOF_URL =
  "https://i.ibb.co/Qjc3Jp12/Screenshot-2026-05-29-at-3-11-17-PM.png";

function getCaseStudyVisuals(project: Project) {
  const title = project.title.toLowerCase();

  if (title.includes("purrfect")) {
    return {
      before:
        "Adoption discovery was scattered across Facebook posts, inbox messages, and manual spreadsheets.",
      after:
        "A structured marketplace with listings, applications, admin review, image upload, and documented state transitions.",
      architecture: [
        "Next.js App Router",
        "Express REST API",
        "JWT auth",
        "Prisma service layer",
        "PostgreSQL",
        "ImgBB + Vercel",
      ],
      api: [
        ["GET", "/api/v1/projects/slug/:slug", "Public case study data"],
        ["POST", "/api/v1/contact", "Validated contact workflow"],
        ["POST", "/api/v1/auth/login", "Admin authentication"],
        ["PATCH", "/api/v1/blog/:id", "Protected content update"],
      ],
      scores: [
        ["Performance", "95+"],
        ["Accessibility", "95+"],
        ["Best Practices", "95+"],
        ["SEO", "95+"],
      ],
    };
  }

  if (title.includes("tradenest")) {
    return {
      before:
        "A storefront needs many backend concerns before it can safely accept real orders.",
      after:
        "A documented NestJS API with auth, catalog, cart, orders, inventory, Swagger, Redis, and Docker-ready deployment.",
      architecture: [
        "NestJS modules",
        "Better Auth",
        "Prisma ORM",
        "PostgreSQL",
        "Redis",
        "Swagger + Docker",
      ],
      api: [
        ["POST", "/auth/login", "Issue session credentials"],
        ["GET", "/products", "Catalog read model"],
        ["POST", "/orders", "Transactional order flow"],
        ["GET", "/docs", "Swagger contract"],
      ],
      scores: [
        ["Security", "Rate limited"],
        ["Docs", "Swagger"],
        ["Deploy", "Docker"],
        ["Data", "Prisma"],
      ],
    };
  }

  return {
    before:
      "The product started as a broad workflow with multiple roles, permissions, and delivery risks.",
    after:
      "A scoped full-stack system with typed APIs, role-aware UI, deployment boundaries, and clear operational tradeoffs.",
    architecture: [
      project.techStack[0] || "Frontend",
      "Typed API",
      "Auth boundary",
      "Service layer",
      "Database",
      "Vercel deploy",
    ],
    api: [
      ["GET", "/api/v1/portfolio", "Public portfolio payload"],
      ["GET", "/api/v1/projects", "Project listing"],
      ["GET", "/api/v1/blog", "Writing archive"],
      ["POST", "/api/v1/contact", "Validated inbound lead"],
    ],
    scores: [
      ["Delivery", "Shipped"],
      ["Auth", "Protected"],
      ["API", "Typed"],
      ["Deploy", "Live"],
    ],
  };
}

type Props = {
  project: Project;
  prev?: { slug: string; title: string } | null;
  next?: { slug: string; title: string } | null;
};

export function ProjectCaseStudy({ project, prev, next }: Props) {
  const hero = resolveImageUrl(project.imageUrl);
  const proof = getProjectProof(project);
  const visuals = getCaseStudyVisuals(project);
  const screenshots = (project.screenshots ?? [])
    .map((s) => resolveImageUrl(s))
    .filter(Boolean) as string[];

  return (
    <main className="relative pt-32 pb-24 sm:pt-40">
      <div className="mx-auto w-full max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-strong transition hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to projects
          </Link>
        </motion.div>

        {/* Title + meta */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 border-b border-border pb-12"
        >
          <div className="flex items-center gap-2">
            <Badge variant="solid">
              {String(project.order).padStart(2, "0")}
            </Badge>
            {project.featured && <Badge variant="outline">Featured</Badge>}
            <Badge variant="muted">{project.techStack[0]}</Badge>
          </div>

          <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            {project.title}
          </h1>

          {project.shortDesc && (
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-strong sm:text-xl">
              {project.shortDesc}
            </p>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <Button asChild variant="default">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink />
                  Visit live site
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild variant="outline">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon />
                  View source
                </a>
              </Button>
            )}
          </div>
        </motion.header>

        {/* Hero image */}
        {hero && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mt-12 overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="relative aspect-video w-full bg-background">
              <Image
                src={hero}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 960px"
                className="object-cover object-top"
                unoptimized
                priority
              />
            </div>
          </motion.div>
        )}

        {/* Meta grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetaCard
            label="Role"
            value={project.role || "Full Stack"}
            icon={<UserRound className="h-4 w-4" />}
          />
          <MetaCard
            label="Timeline"
            value={project.duration || "—"}
            icon={<Calendar className="h-4 w-4" />}
          />
          <MetaCard
            label="Stack"
            value={`${project.techStack.length} technologies`}
            icon={<Layers className="h-4 w-4" />}
          />
          <MetaCard
            label="Status"
            value={project.liveUrl ? "Live · Shipped" : "Backend · Documented"}
            icon={<Trophy className="h-4 w-4" />}
          />
        </div>

        {proof.length > 0 && (
          <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {proof.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className="rounded-xl border border-border bg-card/70 p-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </section>
        )}

        <section className="mt-10 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background">
                <Route className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Before / After
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em]">
                  Product clarity
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <ProofPanel label="Before" value={visuals.before} />
              <ProofPanel label="After" value={visuals.after} tone="strong" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Architecture
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em]">
                  System flow
                </h2>
              </div>
              <Badge variant="outline">Production shape</Badge>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {visuals.architecture.map((node, index) => (
                <div
                  key={node}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground font-mono text-[10px] text-background">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium">{node}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              API contract
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              {visuals.api.map(([method, path, purpose]) => (
                <div
                  key={`${method}-${path}`}
                  className="grid gap-2 border-b border-border bg-background/50 p-3 last:border-b-0 sm:grid-cols-[72px_1fr_1fr]"
                >
                  <span className="font-mono text-[11px] font-semibold text-foreground">
                    {method}
                  </span>
                  <code className="text-xs text-muted-strong">{path}</code>
                  <span className="text-xs text-muted-strong">{purpose}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Performance proof
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em]">
                  Lighthouse scorecard
                </h2>
              </div>
              <Gauge className="h-5 w-5 text-muted-strong" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {visuals.scores.map(([label, score]) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-background/60 p-3"
                >
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted">
                    {label}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{score}</p>
                </div>
              ))}
            </div>

            {project.title.toLowerCase().includes("purrfect") && (
              <a
                href={LIGHTHOUSE_PROOF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex text-xs font-medium text-muted-strong transition hover:text-foreground"
              >
                View Lighthouse screenshot ↗
              </a>
            )}
          </div>
        </section>

        {/* Sections */}
        <div className="mt-20 space-y-20">
          {project.problem && (
            <CaseSection
              eyebrow="01 / Problem"
              title="The problem"
              icon={<Target className="h-5 w-5" />}
            >
              {project.problem}
            </CaseSection>
          )}

          {project.approach && (
            <CaseSection
              eyebrow="02 / Approach"
              title="How I built it"
              icon={<Lightbulb className="h-5 w-5" />}
            >
              {project.approach}
            </CaseSection>
          )}

          {/* Tech stack */}
          <section>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-foreground">
                <Wrench className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  03 / Stack
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                  Technology stack
                </h2>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge key={tech} className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </section>

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <section>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-foreground">
                  <Check className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    04 / Features
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                    What it does
                  </h2>
                </div>
              </div>

              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {project.features.map((f, i) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.03 }}
                    className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-border-strong"
                  >
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-strong transition group-hover:text-foreground" />
                    <span className="text-sm leading-relaxed text-muted-strong">
                      {f}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </section>
          )}

          {project.outcome && (
            <CaseSection
              eyebrow="05 / Outcome"
              title="The result"
              icon={<Trophy className="h-5 w-5" />}
            >
              {project.outcome}
            </CaseSection>
          )}

          {project.challenges && (
            <CaseSection
              eyebrow="06 / Reflection"
              title="Hardest part"
              icon={<Lightbulb className="h-5 w-5" />}
            >
              {project.challenges}
            </CaseSection>
          )}

          {/* Gallery */}
          {screenshots.length > 1 && (
            <section>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-foreground">
                  <Layers className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    07 / Gallery
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                    Screenshots
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {screenshots.map((src) => (
                  <div
                    key={src}
                    className="relative aspect-16/10 overflow-hidden rounded-xl border border-border bg-card"
                  >
                    <Image
                      src={src}
                      alt={`${project.title} screenshot`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-top"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="rounded-2xl border border-border bg-card p-8 sm:p-12">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Interested?
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              Got a similar project in mind?
            </h2>
            <p className="mt-3 max-w-xl text-muted-strong">
              I&apos;m available for freelance and full-time work. Let&apos;s
              talk about how I can help ship your next product.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="default">
                <Link href="/#contact">
                  Start a conversation
                  <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/#projects">More projects</Link>
              </Button>
            </div>
          </section>
        </div>

        {/* Prev / Next nav */}
        {(prev || next) && (
          <nav className="mt-20 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group rounded-xl border border-border bg-card p-5 transition hover:border-border-strong"
              >
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                  <ArrowLeft className="h-3 w-3" /> Previous
                </p>
                <p className="mt-2 text-lg font-semibold transition group-hover:translate-x-[-2px]">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group rounded-xl border border-border bg-card p-5 text-right transition hover:border-border-strong"
              >
                <p className="flex items-center justify-end gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                  Next <ChevronRight className="h-3 w-3" />
                </p>
                <p className="mt-2 text-lg font-semibold transition group-hover:translate-x-[2px]">
                  {next.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </main>
  );
}

function MetaCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted">{icon}</div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function ProofPanel({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: string;
  tone?: "muted" | "strong";
}) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </p>
      <p
        className={`mt-2 text-sm leading-relaxed ${
          tone === "strong" ? "text-foreground" : "text-muted-strong"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function CaseSection({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-foreground">
          {icon}
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            {title}
          </h2>
        </div>
      </div>

      <div className="mt-6 max-w-3xl whitespace-pre-line text-base leading-[1.75] text-muted-strong sm:text-[17px]">
        {children}
      </div>
    </motion.section>
  );
}

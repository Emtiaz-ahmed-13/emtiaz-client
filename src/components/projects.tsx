"use client";

import { motion } from "framer-motion";
import { Folder, Sparkles } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { Project } from "@/types/portfolio";

const HOME_LIMIT = 3;

const DELIVERY_SIGNALS = [
  "MVP shipped in 6 weeks",
  "30 commits across portfolio repos",
  "Lighthouse 89 / 96 / 100 / 100",
  "FCP 1.8s · LCP 3.1s",
  "7 API tests covering auth, validation, rate limits",
];

const PERFORMANCE_PROOF_URL =
  "https://i.ibb.co/Qjc3Jp12/Screenshot-2026-05-29-at-3-11-17-PM.png";

const BACKEND_PROOF = [
  "Typed REST APIs",
  "JWT auth + validation",
  "Prisma migrations",
  "Rate limiting + tests",
  "Docker/Vercel deploys",
];

export function Projects({ projects }: { projects: Project[] }) {
  const items = projects ?? [];
  const visible = items.slice(0, HOME_LIMIT);
  const hasMore = items.length > HOME_LIMIT;
  const featured = visible[0];
  const rest = visible.slice(1);

  return (
    <Section id="projects">
      <SectionHeading
        index="02 / Work"
        title="Selected projects."
        subtitle={`${items.length} shipped builds with real product flows, backend contracts, and deployment decisions.`}
        action={
          hasMore ? (
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-[13px] font-medium text-foreground transition hover:border-border-strong hover:bg-background"
            >
              See all {items.length} projects
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 flex flex-wrap items-center gap-3"
      >
        <Badge variant="outline" className="gap-1.5">
          <Folder className="h-3 w-3" />
          {items.length} Projects
        </Badge>
        <Badge variant="default" className="gap-1.5">
          <Sparkles className="h-3 w-3" />
          {items.filter((p) => p.featured).length} Featured
        </Badge>
        <Badge variant="muted">
          {Array.from(new Set(items.flatMap((p) => p.techStack))).length}{" "}
          Technologies
        </Badge>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="rounded-2xl border border-border bg-card/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionLabel>Delivery proof</SectionLabel>
            <a
              href={PERFORMANCE_PROOF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-strong transition hover:text-foreground"
            >
              Lighthouse proof ↗
            </a>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {DELIVERY_SIGNALS.map((signal) => (
              <Badge key={signal} variant="outline">
                {signal}
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-5">
          <SectionLabel>Backend quality</SectionLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {BACKEND_PROOF.map((proof) => (
              <Badge key={proof} variant="muted">
                {proof}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-2">
        {featured && (
          <ProjectCard project={featured} index={0} variant="spotlight" />
        )}
        {rest.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index + 1}
            variant="compact"
          />
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
            <SectionLabel>More work</SectionLabel>
            <p className="mt-1.5 text-sm text-muted-strong">
              {items.length - HOME_LIMIT} more{" "}
              {items.length - HOME_LIMIT === 1 ? "project" : "projects"} —
              backend APIs, full-stack apps, and open-source experiments.
            </p>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition hover:gap-3"
          >
            See everything
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </motion.div>
      )}
    </Section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Folder, Sparkles } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { Project } from "@/types/portfolio";

export function Projects({ projects }: { projects: Project[] }) {
  const featured = projects[0];
  const rest = projects.slice(1);

  return (
    <Section id="projects">
      <SectionHeading
        index="02 / Work"
        title="Selected projects."
        subtitle={`${projects.length} production-grade builds — full-stack systems, APIs, and product interfaces.`}
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
          {projects.length} Projects
        </Badge>
        <Badge variant="default" className="gap-1.5">
          <Sparkles className="h-3 w-3" />
          {projects.filter((p) => p.featured).length} Featured
        </Badge>
        <Badge variant="muted">
          {Array.from(new Set(projects.flatMap((p) => p.techStack))).length} Technologies
        </Badge>
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
    </Section>
  );
}

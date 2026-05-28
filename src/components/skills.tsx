"use client";

import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { Skill } from "@/types/portfolio";

const categoryLabels: Record<Skill["category"], string> = {
  LANGUAGE: "Languages",
  FRAMEWORK: "Frameworks",
  DATABASE: "Databases",
  TOOL: "Tools",
  OTHER: "Other",
};

export function Skills({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<Skill["category"], Skill[]>
  );

  const marqueeItems = [...skills, ...skills];

  return (
    <Section id="skills">
      <SectionHeading
        index="04 / Stack"
        title="Tools I build with."
        subtitle="A snapshot of the languages, frameworks, and infrastructure I work with daily."
      />

      <div className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-card py-6">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-card to-transparent" />
        <div className="marquee flex gap-6 whitespace-nowrap">
          {marqueeItems.map((skill, i) => (
            <span
              key={`${skill.id}-${i}`}
              className="font-mono text-2xl font-medium tracking-tight text-muted-strong sm:text-3xl"
            >
              {skill.name} <span className="text-muted">/</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(Object.keys(grouped) as Skill["category"][]).map((category, ci) => (
          <Card key={category} tilt delay={ci * 0.06}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold tracking-tight">
                {categoryLabels[category]}
              </h3>
              <SectionLabel>{grouped[category].length} items</SectionLabel>
            </div>
            <div className="flex flex-wrap gap-2">
              {grouped[category].map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-strong transition hover:border-border-strong hover:text-foreground"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

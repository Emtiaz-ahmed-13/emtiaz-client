"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import { ReactNode } from "react";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import type { Education, Experience } from "@/types/portfolio";

function formatRange(start: string, end: string | null, current: boolean) {
  const startDate = new Date(start);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const startStr = `${months[startDate.getMonth()]} ${startDate.getFullYear()}`;

  if (current || !end) return `${startStr} — Present`;

  const endDate = new Date(end);
  const endStr = `${months[endDate.getMonth()]} ${endDate.getFullYear()}`;
  return `${startStr} — ${endStr}`;
}

type TimelineItem = {
  id: string;
  title: string;
  subtitle: string;
  location?: string | null;
  description?: string | null;
  range: string;
  current: boolean;
};

function Timeline({
  label,
  icon,
  items,
}: {
  label: string;
  icon: ReactNode;
  items: TimelineItem[];
}) {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-foreground">
          {icon}
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {label}
          </p>
          <p className="mt-0.5 text-sm text-muted-strong">
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </p>
        </div>
      </div>

      <ol className="relative space-y-8 border-l border-border pl-7">
        {items.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.55,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
          >
            {/* dot */}
            <span
              aria-hidden
              className="absolute -left-[35px] top-1.5 grid h-5 w-5 place-items-center rounded-full border border-border bg-background"
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-foreground" />
            </span>

            <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border-strong">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {item.range}
                </span>
                {item.current && <Badge variant="solid">Current</Badge>}
              </div>

              <h3 className="mt-2 text-lg font-semibold tracking-[-0.01em]">
                {item.title}
              </h3>
              <p className="mt-0.5 text-sm text-muted-strong">
                {item.subtitle}
              </p>

              {item.location && (
                <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                  <MapPin className="h-3 w-3" />
                  {item.location}
                </p>
              )}

              {item.description && (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-strong">
                  {item.description}
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export function Journey({
  experiences,
  education,
}: {
  experiences: Experience[];
  education: Education[];
}) {
  const expItems: TimelineItem[] = experiences.map((e) => ({
    id: e.id,
    title: e.position,
    subtitle: e.company,
    location: e.location,
    description: e.description,
    range: formatRange(e.startDate, e.endDate, e.current),
    current: e.current,
  }));

  const eduItems: TimelineItem[] = education.map((e) => ({
    id: e.id,
    title: e.degree + (e.field ? ` · ${e.field}` : ""),
    subtitle: e.institution,
    description: e.description,
    range: formatRange(e.startDate, e.endDate, e.current),
    current: e.current,
  }));

  if (expItems.length === 0 && eduItems.length === 0) return null;

  return (
    <Section id="journey">
      <SectionHeading
        index="03 / Journey"
        title="Where I've been."
        subtitle="Education, work, and the bridge between them — built one project at a time."
      />

      <div className="grid gap-12 lg:grid-cols-2">
        {expItems.length > 0 && (
          <Timeline
            label="Experience"
            icon={<Briefcase className="h-5 w-5" />}
            items={expItems}
          />
        )}
        {eduItems.length > 0 && (
          <Timeline
            label="Education"
            icon={<GraduationCap className="h-5 w-5" />}
            items={eduItems}
          />
        )}
      </div>
    </Section>
  );
}

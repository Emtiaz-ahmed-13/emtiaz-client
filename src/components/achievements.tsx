"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  Code2,
  GraduationCap,
  ImageIcon,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Section } from "@/components/ui/section";
import { resolveImageUrl } from "@/lib/image-url";
import { cn } from "@/lib/utils";
import type { Achievement, AchievementCategory } from "@/types/portfolio";

const CATEGORY_META: Record<
  AchievementCategory,
  { label: string; icon: ReactNode; accent: string; ring: string }
> = {
  HACKATHON: {
    label: "Hackathon",
    icon: <Code2 className="h-4 w-4" />,
    accent: "text-amber-400",
    ring: "ring-amber-400/30",
  },
  CONTEST: {
    label: "Contest",
    icon: <Trophy className="h-4 w-4" />,
    accent: "text-sky-400",
    ring: "ring-sky-400/30",
  },
  CERTIFICATE: {
    label: "Certificate",
    icon: <Award className="h-4 w-4" />,
    accent: "text-emerald-400",
    ring: "ring-emerald-400/30",
  },
  COURSE: {
    label: "Course",
    icon: <GraduationCap className="h-4 w-4" />,
    accent: "text-violet-400",
    ring: "ring-violet-400/30",
  },
  AWARD: {
    label: "Award",
    icon: <Trophy className="h-4 w-4" />,
    accent: "text-rose-400",
    ring: "ring-rose-400/30",
  },
};

const ALL: AchievementCategory[] = [
  "HACKATHON",
  "CONTEST",
  "CERTIFICATE",
  "COURSE",
  "AWARD",
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function Achievements({ achievements }: { achievements: Achievement[] }) {
  const [filter, setFilter] = useState<AchievementCategory | "ALL">("ALL");

  if (achievements.length === 0) return null;

  const counts = ALL.reduce<Record<string, number>>(
    (acc, c) => {
      acc[c] = achievements.filter((a) => a.category === c).length;
      return acc;
    },
    { ALL: achievements.length }
  );

  const filtered =
    filter === "ALL"
      ? achievements
      : achievements.filter((a) => a.category === filter);

  return (
    <Section id="highlights">
      <SectionHeading
        index="06 / Highlights"
        title="Wins, papers, & proofs."
        subtitle="Hackathons, programming contests, certifications, and courses — the receipts behind the resume."
      />

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <FilterChip
          active={filter === "ALL"}
          onClick={() => setFilter("ALL")}
          label="All"
          count={counts.ALL}
        />
        {ALL.map((c) =>
          counts[c] > 0 ? (
            <FilterChip
              key={c}
              active={filter === c}
              onClick={() => setFilter(c)}
              label={CATEGORY_META[c].label}
              count={counts[c]}
              icon={CATEGORY_META[c].icon}
              accent={CATEGORY_META[c].accent}
            />
          ) : null
        )}
      </div>

      <motion.div
        layout
        className="grid gap-5 md:grid-cols-2"
      >
        {filtered.map((a, i) => (
          <AchievementCard key={a.id} achievement={a} index={i} />
        ))}
      </motion.div>
    </Section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  icon,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon?: ReactNode;
  accent?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-muted-strong hover:border-border-strong hover:text-foreground"
      )}
    >
      {icon && (
        <span className={cn(active ? "text-background" : accent)}>{icon}</span>
      )}
      {label}
      <span
        className={cn(
          "rounded px-1 text-[10px] font-mono",
          active ? "bg-background/20" : "bg-border text-muted"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function AchievementCard({
  achievement,
  index,
}: {
  achievement: Achievement;
  index: number;
}) {
  const meta = CATEGORY_META[achievement.category];
  const heroSrc = resolveImageUrl(achievement.imageUrl);
  const [failed, setFailed] = useState(false);
  const photoCount = achievement.images.length;

  return (
    <Dialog>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: 0.55,
          delay: index * 0.06,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <DialogTrigger asChild>
          <button
            type="button"
            className="group block w-full overflow-hidden rounded-2xl border border-border bg-card text-left transition hover:border-border-strong"
          >
            {heroSrc && !failed ? (
              <div className="relative aspect-[16/10] overflow-hidden bg-background">
                <Image
                  src={heroSrc}
                  alt={achievement.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={() => setFailed(true)}
                  unoptimized
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur",
                      meta.accent
                    )}
                  >
                    {meta.icon}
                    {meta.label}
                  </span>
                </div>

                {photoCount > 1 && (
                  <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-strong backdrop-blur">
                    <ImageIcon className="h-3 w-3" />
                    {photoCount}
                  </div>
                )}
              </div>
            ) : (
              <div
                className={cn(
                  "flex aspect-[16/10] items-center justify-center bg-card ring-1 ring-inset",
                  meta.ring
                )}
              >
                <div className={cn("text-7xl", meta.accent)}>{meta.icon}</div>
              </div>
            )}

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                <Calendar className="h-3 w-3" />
                {formatDate(achievement.date)}
                {achievement.location && (
                  <>
                    <span className="mx-1 h-1 w-1 rounded-full bg-border-strong" />
                    <MapPin className="h-3 w-3" />
                    {achievement.location}
                  </>
                )}
              </div>

              <h3 className="mt-3 text-xl font-semibold tracking-[-0.01em] transition group-hover:text-muted-strong">
                {achievement.title}
              </h3>
              <p className="mt-1 text-sm text-muted-strong">
                {achievement.organizer}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {achievement.rank && (
                  <Badge variant="outline" className="gap-1">
                    <Trophy className="h-3 w-3" />
                    {achievement.rank}
                  </Badge>
                )}
                {achievement.team && (
                  <Badge variant="muted" className="gap-1">
                    <Users className="h-3 w-3" />
                    Team
                  </Badge>
                )}
              </div>
            </div>
          </button>
        </DialogTrigger>
      </motion.div>

      <DialogContent>
        <AchievementDialog achievement={achievement} />
      </DialogContent>
    </Dialog>
  );
}

function AchievementDialog({ achievement }: { achievement: Achievement }) {
  const meta = CATEGORY_META[achievement.category];
  const images = achievement.images
    .map((url) => resolveImageUrl(url))
    .filter(Boolean) as string[];
  const [active, setActive] = useState(0);

  return (
    <div>
      {images.length > 0 && (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-background">
          <Image
            src={images[active]}
            alt={achievement.title}
            fill
            sizes="(max-width: 1024px) 95vw, 768px"
            className="object-contain"
            unoptimized
            priority
          />
        </div>
      )}

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-b border-border bg-background p-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-md border transition",
                i === active
                  ? "border-foreground ring-1 ring-foreground"
                  : "border-border hover:border-border-strong"
              )}
            >
              <Image
                src={src}
                alt={`${achievement.title} photo ${i + 1}`}
                fill
                sizes="96px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      <div className="space-y-5 p-6 sm:p-8">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest",
                meta.accent
              )}
            >
              {meta.icon}
              {meta.label}
            </span>
            <Badge variant="muted" className="font-mono">
              <Calendar className="mr-1 h-3 w-3" />
              {formatDate(achievement.date)}
            </Badge>
            {achievement.location && (
              <Badge variant="muted" className="font-mono">
                <MapPin className="mr-1 h-3 w-3" />
                {achievement.location}
              </Badge>
            )}
          </div>

          <DialogTitle>{achievement.title}</DialogTitle>
          <p className="text-sm text-muted-strong">{achievement.organizer}</p>
        </DialogHeader>

        {(achievement.rank || achievement.team) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {achievement.rank && (
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Rank / Result
                </p>
                <p className="mt-1 text-sm font-medium">{achievement.rank}</p>
              </div>
            )}
            {achievement.team && (
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Team
                </p>
                <p className="mt-1 text-sm font-medium">{achievement.team}</p>
              </div>
            )}
          </div>
        )}

        {achievement.description && (
          <DialogDescription className="whitespace-pre-line text-[15px] leading-[1.7]">
            {achievement.description}
          </DialogDescription>
        )}

        {achievement.link && (
          <div className="border-t border-border pt-5">
            <Button asChild variant="outline">
              <a
                href={achievement.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Verify / View
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Code2, RefreshCw, Trophy } from "lucide-react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import {
  CODING_PROFILES,
  type CodingStats,
  codeforcesRankColor,
} from "@/lib/coding-stats";
import { cn } from "@/lib/utils";

type Props = {
  initialStats: CodingStats;
  initialFetchedAt: string;
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function CodingProfiles({ initialStats, initialFetchedAt }: Props) {
  const [stats, setStats] = useState<CodingStats>(initialStats);
  const [fetchedAt, setFetchedAt] = useState(() => new Date(initialFetchedAt));
  const [refreshing, setRefreshing] = useState(false);
  const [, setTick] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Re-render every 5 seconds to keep "X ago" label fresh
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 5000);
    return () => clearInterval(t);
  }, []);

  const refresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const res = await fetch("/api/coding-stats", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setFetchedAt(new Date(data.fetchedAt));
      }
    } catch (err) {
      console.error("Failed to refresh coding stats:", err);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  // Auto-refresh when tab regains focus + every 2 minutes when visible
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") {
        const elapsed = Date.now() - fetchedAt.getTime();
        if (elapsed > 60_000) refresh();
      }
    }
    document.addEventListener("visibilitychange", onVisible);

    intervalRef.current = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, 120_000);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh, fetchedAt]);

  const hasAny = !!stats.leetcode || !!stats.codeforces || !!stats.codechef;
  if (!hasAny) return null;

  return (
    <Section id="practice">
      <SectionHeading
        index="05 / Practice"
        title="Sharpening the saw."
        subtitle="Live stats from where I solve problems and compete. Refreshes on tab focus + every 2 minutes."
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="gap-1.5">
          <span
            className={cn(
              "inline-flex h-1.5 w-1.5 rounded-full",
              refreshing ? "animate-pulse bg-amber-400" : "bg-emerald-400"
            )}
          />
          {refreshing ? "Refreshing…" : "Live"}
        </Badge>
        <Badge variant="muted" className="font-mono">
          Updated {timeAgo(fetchedAt)}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={refreshing}
          className="h-8 gap-1.5 px-3 text-xs"
        >
          <RefreshCw
            className={cn(
              "h-3 w-3 transition",
              refreshing && "animate-spin"
            )}
          />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.leetcode && <LeetCodeCard stats={stats.leetcode} index={0} />}
        {stats.codeforces && (
          <CodeforcesCard stats={stats.codeforces} index={1} />
        )}
        {stats.codechef && <CodeChefCard stats={stats.codechef} index={2} />}
      </div>
    </Section>
  );
}

function CardShell({
  href,
  brand,
  icon,
  accent,
  index,
  children,
}: {
  href: string;
  brand: string;
  icon: ReactNode;
  accent: string;
  index: number;
  children: ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:border-border-strong"
    >
      <div className="absolute right-6 top-6 text-muted transition group-hover:translate-x-0.5 group-hover:text-foreground">
        <ArrowUpRight className="h-4 w-4" />
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-lg border border-border bg-background",
            accent
          )}
        >
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold tracking-tight">{brand}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Live · auto-updated
          </p>
        </div>
      </div>

      {children}

      <div className="mt-auto pt-6">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-strong">
          View full profile
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </motion.a>
  );
}

function Metric({
  label,
  value,
  className = "",
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function LeetCodeCard({
  stats,
  index,
}: {
  stats: NonNullable<CodingStats["leetcode"]>;
  index: number;
}) {
  const total = 3000;
  const percent = Math.min((stats.solved / total) * 100, 100);

  return (
    <CardShell
      brand="LeetCode"
      href={CODING_PROFILES.leetcode.url}
      icon={<Code2 className="h-5 w-5 text-amber-400" />}
      accent="text-amber-400"
      index={index}
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Problems solved
        </p>
        <p className="mt-2 text-5xl font-semibold tracking-[-0.04em]">
          {stats.solved.toLocaleString()}
        </p>
      </div>

      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-amber-400/70 transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <Metric
          label="Easy"
          value={<span className="text-emerald-400">{stats.easy}</span>}
        />
        <Metric
          label="Medium"
          value={<span className="text-amber-400">{stats.medium}</span>}
        />
        <Metric
          label="Hard"
          value={<span className="text-rose-400">{stats.hard}</span>}
        />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Global rank
        </p>
        <p className="font-mono text-xs font-medium">
          #{stats.ranking.toLocaleString()}
        </p>
      </div>
    </CardShell>
  );
}

function CodeforcesCard({
  stats,
  index,
}: {
  stats: NonNullable<CodingStats["codeforces"]>;
  index: number;
}) {
  const rankClass = codeforcesRankColor(stats.rank);
  const maxRankClass = codeforcesRankColor(stats.maxRank);
  const ratingGain = stats.maxRating - stats.rating;

  return (
    <CardShell
      brand="Codeforces"
      href={CODING_PROFILES.codeforces.url}
      icon={<Trophy className="h-5 w-5 text-sky-400" />}
      accent="text-sky-400"
      index={index}
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Current rating
        </p>
        <p
          className={cn(
            "mt-2 text-5xl font-semibold tracking-[-0.04em]",
            rankClass
          )}
        >
          {stats.rating || "—"}
        </p>
        <p className={cn("mt-1 text-xs font-medium capitalize", rankClass)}>
          {stats.rank}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4">
        <Metric
          label="Peak rating"
          value={
            <span className={cn("font-semibold", maxRankClass)}>
              {stats.maxRating || "—"}
            </span>
          }
        />
        <Metric
          label="Peak rank"
          value={
            <span className={cn("capitalize", maxRankClass)}>
              {stats.maxRank}
            </span>
          }
        />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Headroom
        </p>
        <p className="font-mono text-xs font-medium text-muted-strong">
          {ratingGain > 0 ? `+${ratingGain}` : "—"} to peak
        </p>
      </div>
    </CardShell>
  );
}

function CodeChefCard({
  stats,
  index,
}: {
  stats: NonNullable<CodingStats["codechef"]>;
  index: number;
}) {
  return (
    <CardShell
      brand="CodeChef"
      href={CODING_PROFILES.codechef.url}
      icon={<Trophy className="h-5 w-5 text-orange-400" />}
      accent="text-orange-400"
      index={index}
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Current rating
        </p>
        <div className="mt-2 flex items-end gap-2">
          <p className="text-5xl font-semibold tracking-[-0.04em] text-orange-400">
            {stats.rating || "—"}
          </p>
          {stats.stars > 0 && (
            <span className="mb-1 font-mono text-sm text-orange-400">
              {"★".repeat(stats.stars)}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs font-medium text-muted-strong">
          Peak {stats.maxRating || "—"}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4">
        <Metric label="Solved" value={stats.solved.toLocaleString()} />
        <Metric label="Contests" value={stats.contests} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        <Badge variant="outline" className="text-[10px]">
          BD #{stats.countryRank || "—"}
        </Badge>
        <Badge variant="muted" className="text-[10px]">
          Global #{stats.globalRank.toLocaleString() || "—"}
        </Badge>
      </div>
    </CardShell>
  );
}

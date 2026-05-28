import { ReactNode } from "react";

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 px-4 py-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </p>
      <p className="mt-1 text-3xl font-semibold tracking-[-0.02em]">{value}</p>
      {hint && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export function StatusPill({
  status,
}: {
  status: "PUBLISHED" | "DRAFT" | "UNPUBLISHED";
}) {
  const cls =
    status === "PUBLISHED"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
      : status === "DRAFT"
        ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
        : "border-border bg-background text-muted-strong";
  return (
    <span
      className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${cls}`}
    >
      {status}
    </span>
  );
}

export function FeaturedPill() {
  return (
    <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-strong">
      Featured
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em]">
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  cta,
}: {
  title: string;
  body: ReactNode;
  cta?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-12 text-center">
      <h3 className="text-lg font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-strong">{body}</p>
      {cta && <div className="mt-5 inline-flex">{cta}</div>}
    </div>
  );
}

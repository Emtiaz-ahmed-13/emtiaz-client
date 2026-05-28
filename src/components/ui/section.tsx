import { ReactNode } from "react";

export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative px-6 py-32 sm:py-36 ${className}`}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionDivider() {
  return (
    <div className="mx-auto h-px w-full max-w-7xl bg-border" aria-hidden />
  );
}

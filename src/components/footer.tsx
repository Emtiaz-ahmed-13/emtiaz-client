export function Footer({ name, year }: { name: string; year: number }) {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-5xl font-semibold tracking-[-0.03em] sm:text-6xl">
              {name.split(" ")[0]}.
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">
              Full Stack Engineer · Bangladesh
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            <a
              href="#home"
              className="link-underline font-mono text-[10px] uppercase tracking-widest text-muted-strong hover:text-foreground"
            >
              ↑ Back to top
            </a>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              © {year} {name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

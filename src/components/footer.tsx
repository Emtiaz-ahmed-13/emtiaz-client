import Link from "next/link";
import type { ReactNode } from "react";
import { Profile } from "@/types/portfolio";

const QUICK_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Selected work" },
  { href: "/projects", label: "All projects" },
  { href: "/#blog", label: "Recent writing" },
  { href: "/blog", label: "All posts" },
  { href: "/#contact", label: "Contact" },
];

const RESOURCES = [
  { href: "/#skills", label: "Tech stack" },
  { href: "/#projects", label: "Engineering proof" },
  { href: "/projects", label: "Case studies" },
  { href: "/emtiaz.pdf", label: "Resume (PDF)", external: true },
];

const GITHUB_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.93 10.93 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.78 1.05.78 2.12v3.14c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

const LINKEDIN_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18.34V10.5H6V18.34h2.34Zm-1.17-8.93a1.36 1.36 0 1 0 0-2.72 1.36 1.36 0 0 0 0 2.72ZM18 18.34v-4.5c0-2.16-1.16-3.17-2.7-3.17-1.25 0-1.81.69-2.13 1.17v-1H10.83V18.34h2.34v-4.38c0-.23.02-.46.09-.62.18-.46.61-.94 1.32-.94.93 0 1.3.71 1.3 1.74v4.2H18Z" />
  </svg>
);

const MAIL_ICON = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 6h16v12H4z" />
    <path d="m4 6 8 7 8-7" />
  </svg>
);

const GLOBE_ICON = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 0 20a15.3 15.3 0 0 1 0-20z" />
  </svg>
);

export function Footer({
  name,
  year,
  profile,
}: {
  name: string;
  year: number;
  profile?: Profile;
}) {
  const email = profile?.email || "emtiaz2060@gmail.com";

  const socials: { label: string; href: string; icon: ReactNode }[] = [];
  if (profile?.githubUrl) {
    socials.push({ label: "GitHub", href: profile.githubUrl, icon: GITHUB_ICON });
  }
  if (profile?.linkedinUrl) {
    socials.push({
      label: "LinkedIn",
      href: profile.linkedinUrl,
      icon: LINKEDIN_ICON,
    });
  }
  socials.push({ label: "Email", href: `mailto:${email}`, icon: MAIL_ICON });
  if (profile?.websiteUrl) {
    socials.push({ label: "Web", href: profile.websiteUrl, icon: GLOBE_ICON });
  }

  return (
    <footer className="relative border-t border-border bg-background">
      {/* Soft glow accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-foreground/4 via-transparent to-transparent"
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* CTA Band */}
        <section className="border-b border-border pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                Open for work · 2026
              </p>
              <h2 className="mt-4 text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-none tracking-[-0.04em]">
                Let&apos;s build something
                <br />
                <span className="text-muted-strong">that actually ships.</span>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-strong">
                Full-stack engineering, system architecture, or a small focused
                build. If it&apos;s on the web and you want it done well, I&apos;d
                love to hear about it.
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <a
                href={`mailto:${email}`}
                className="group inline-flex w-fit items-center gap-3 rounded-full bg-foreground px-6 py-3.5 text-[14px] font-medium text-background transition hover:gap-4"
              >
                <span>{email}</span>
                <span
                  aria-hidden
                  className="transition group-hover:translate-x-0.5"
                >
                  →
                </span>
              </a>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="group grid size-10 place-items-center rounded-full border border-border bg-card text-muted-strong transition hover:border-border-strong hover:bg-background hover:text-foreground"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Link columns */}
        <section className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 group"
              aria-label="Home"
            >
              <div className="grid size-10 place-items-center rounded-xl border border-border bg-card font-mono text-sm font-medium tracking-tight transition group-hover:border-border-strong">
                EA
              </div>
              <div>
                <p className="text-base font-semibold tracking-tight">
                  {name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Full Stack Engineer
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-strong">
              Based in {profile?.location ?? "Bangladesh"}. Open to remote
              roles, freelance projects, and engineering collaborations.
            </p>

            {profile?.available && (
              <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-strong">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Available for work
              </span>
            )}
          </div>

          {/* Explore */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-muted-strong transition hover:text-foreground"
                  >
                    <span
                      aria-hidden
                      className="font-mono text-[10px] text-muted transition group-hover:text-muted-strong"
                    >
                      →
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Resources
            </p>
            <ul className="mt-5 space-y-3">
              {RESOURCES.map((link) =>
                link.external ? (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-sm text-muted-strong transition hover:text-foreground"
                    >
                      <span
                        aria-hidden
                        className="font-mono text-[10px] text-muted transition group-hover:text-muted-strong"
                      >
                        ↗
                      </span>
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-muted-strong transition hover:text-foreground"
                    >
                      <span
                        aria-hidden
                        className="font-mono text-[10px] text-muted transition group-hover:text-muted-strong"
                      >
                        →
                      </span>
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </section>

        {/* Bottom bar */}
        <section className="flex flex-col-reverse items-start justify-between gap-4 border-t border-border py-7 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            © {year} {name} · Built with care in Dhaka
          </p>

          <div className="flex items-center gap-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              <span className="text-muted-strong">Next.js</span> ·{" "}
              <span className="text-muted-strong">Tailwind</span> ·{" "}
              <span className="text-muted-strong">Prisma</span>
            </p>
            <a
              href="#home"
              className="link-underline font-mono text-[10px] uppercase tracking-widest text-muted-strong hover:text-foreground"
            >
              ↑ Top
            </a>
          </div>
        </section>
      </div>
    </footer>
  );
}

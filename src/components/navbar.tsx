"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Work" },
  { href: "#skills", label: "Stack" },
  { href: "#blog", label: "Writing" },
  { href: "#contact", label: "Contact" },
];

const RESUME_URL = "/emtiaz.pdf";

export function Navbar({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const bg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(0,0,0,0)", "rgba(0,0,0,0.78)"],
  );
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <motion.header
      style={{ backgroundColor: bg }}
      className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl"
    >
      <motion.div
        style={{ opacity: borderOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border"
      />

      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:h-24 sm:px-8">
        <a href="#home" className="group flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card font-mono text-sm font-medium tracking-tight transition group-hover:border-border-strong">
            EA
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-semibold tracking-tight">{name}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Full Stack Engineer
            </p>
          </div>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-2.5 py-2.5 text-[13px] font-medium text-muted-strong transition hover:bg-card hover:text-foreground lg:px-3.5 lg:text-[14px]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center overflow-hidden rounded-full border border-border bg-card">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-[13px] font-medium transition hover:bg-background"
              title="Open resume in new tab"
            >
              Resume
            </a>
            <span className="h-5 w-px bg-border" aria-hidden />
            <a
              href={RESUME_URL}
              download="Emtiaz-Ahmed-Resume.pdf"
              className="px-3 py-2 text-muted-strong transition hover:bg-background hover:text-foreground"
              title="Download resume"
              aria-label="Download resume"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          </div>

          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition hover:gap-3"
          >
            Let&apos;s talk
            <span
              aria-hidden
              className="transition group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>

        <button
          type="button"
          className="rounded-lg border border-border bg-card px-4 py-2.5 font-mono text-xs md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border bg-card/95 px-6 py-3 backdrop-blur-xl md:hidden"
        >
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg py-3 text-sm font-medium text-muted-strong transition hover:bg-background/60 hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border bg-background py-2.5 text-center text-sm"
            >
              View Resume
            </a>
            <a
              href={RESUME_URL}
              download="Emtiaz-Ahmed-Resume.pdf"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-foreground py-2.5 text-center text-sm font-medium text-background"
            >
              Download
            </a>
          </li>
        </motion.ul>
      )}
    </motion.header>
  );
}

"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { ReactNode, useEffect } from "react";
import { Profile } from "@/types/portfolio";

// Small, self-contained icons (no lucide dep, works on any version).
function Icon({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}
const ICONS = {
  pin: "M12 22s7-7.58 7-13a7 7 0 1 0-14 0c0 5.42 7 13 7 13Z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  mail: "M4 6h16v12H4z M4 6l8 7 8-7",
  github:
    "M9 19c-4 1.5-4-2-6-2 M15 21v-3.5a3 3 0 0 0-.9-2.3c3-.3 6-1.5 6-6.5a5 5 0 0 0-1.4-3.5 4.6 4.6 0 0 0-.1-3.4s-1.1-.3-3.6 1.3a12.4 12.4 0 0 0-6.5 0C5.9 1.6 4.8 1.9 4.8 1.9a4.6 4.6 0 0 0-.1 3.4A5 5 0 0 0 3.3 8.8c0 4.9 3 6.2 6 6.5a3 3 0 0 0-.9 2.2V21",
  linkedin:
    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z M6 9H2v12h4z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  globe:
    "M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z M2 12h20 M12 2a14 14 0 0 1 0 20 M12 2a14 14 0 0 0 0 20",
};

function FloatingCube({
  className,
  delay = 0,
  size = 120,
}: {
  className?: string;
  delay?: number;
  size?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute perspective-1200 ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <motion.div
        animate={{ rotateX: 360, rotateY: 360 }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
          delay,
        }}
        className="preserve-3d relative h-full w-full"
      >
        {[
          { t: "translateZ(60px)" },
          { t: "rotateY(180deg) translateZ(60px)" },
          { t: "rotateY(90deg) translateZ(60px)" },
          { t: "rotateY(-90deg) translateZ(60px)" },
          { t: "rotateX(90deg) translateZ(60px)" },
          { t: "rotateX(-90deg) translateZ(60px)" },
        ].map((face, i) => (
          <div
            key={i}
            className="absolute inset-0 border border-foreground/15 bg-foreground/2 backdrop-blur-sm"
            style={{ transform: face.t }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

type Chip = {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
};

function InfoChip({
  chip,
  delay,
}: {
  chip: Chip;
  delay: number;
}) {
  const motionProps = {
    initial: { opacity: 0, x: 12 },
    animate: { opacity: 1, x: 0 },
    transition: {
      duration: 0.55,
      delay: 0.7 + delay * 0.1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  };

  const inner = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-background/60 text-foreground transition group-hover:border-border-strong group-hover:bg-background">
        {chip.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[9px] uppercase tracking-widest text-muted">
          {chip.label}
        </p>
        <p className="truncate text-[13px] font-medium text-foreground">
          {chip.value}
        </p>
      </div>
      {chip.href && (
        <span
          aria-hidden
          className="text-muted transition group-hover:translate-x-0.5 group-hover:text-foreground"
        >
          ↗
        </span>
      )}
    </>
  );

  const baseClass =
    "group relative flex w-full items-center gap-3 rounded-2xl border border-border bg-card/70 px-3 py-2.5 backdrop-blur-md transition-colors hover:border-border-strong";

  if (chip.href) {
    return (
      <motion.a
        {...motionProps}
        href={chip.href}
        target={chip.href.startsWith("mailto") ? undefined : "_blank"}
        rel="noopener noreferrer"
        className={baseClass}
      >
        {inner}
      </motion.a>
    );
  }
  return (
    <motion.div {...motionProps} className={baseClass}>
      {inner}
    </motion.div>
  );
}

function AvatarOrbit({
  src,
  name,
  profile,
}: {
  src: string;
  name: string;
  profile: Profile;
}) {
  const chips: Chip[] = [
    profile.location && {
      icon: <Icon d={ICONS.pin} />,
      label: "Based in",
      value: profile.location,
    },
    profile.email && {
      icon: <Icon d={ICONS.mail} />,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    profile.githubUrl && {
      icon: <Icon d={ICONS.github} />,
      label: "GitHub",
      value: "@Emtiaz-ahmed-13",
      href: profile.githubUrl,
    },
    profile.linkedinUrl && {
      icon: <Icon d={ICONS.linkedin} />,
      label: "LinkedIn",
      value: "emtiaz-ahmed",
      href: profile.linkedinUrl,
    },
    profile.websiteUrl && {
      icon: <Icon d={ICONS.globe} />,
      label: "Web",
      value: profile.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      href: profile.websiteUrl,
    },
  ].filter(Boolean) as Chip[];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative mx-auto flex w-fit flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-7 lg:gap-6 xl:gap-8"
    >
      {/* Avatar with halo + ring */}
      <div className="relative shrink-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-linear-to-br from-foreground/12 via-foreground/4 to-transparent blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
            y: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            },
          }}
          className="relative size-40 sm:size-48 lg:size-44 xl:size-60"
        >
          <div
            aria-hidden
            className="absolute inset-0 rounded-full bg-linear-to-br from-foreground/30 via-border-strong to-foreground/10 p-[1.5px]"
          >
            <div className="h-full w-full rounded-full bg-background" />
          </div>

          <div className="absolute inset-[3px] overflow-hidden rounded-full bg-zinc-950">
            <Image
              src={src}
              alt={name}
              fill
              priority
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 256px"
              className="scale-[1.03] object-cover object-center saturate-[1.05]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_36%,rgba(0,0,0,0.5)_100%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/8 via-transparent to-black/20"
            />
          </div>

          {profile.available && (
            <span className="absolute right-3 top-3 flex size-3.5 sm:size-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex size-3.5 sm:size-4 rounded-full border-2 border-background bg-emerald-400" />
            </span>
          )}
        </motion.div>
      </div>

      {/* Sidebar info chips */}
      <div className="flex w-full max-w-[260px] flex-col gap-2 sm:w-[230px] lg:w-[210px] xl:w-[250px] lg:gap-2.5">
        {chips.map((chip, i) => (
          <InfoChip key={chip.label} chip={chip} delay={i} />
        ))}
      </div>
    </motion.div>
  );
}

export function Hero({ profile, name }: { profile: Profile; name: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [6, -6]), {
    stiffness: 80,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), {
    stiffness: 80,
    damping: 18,
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  const chars = name.split("");
  const avatar = profile.avatarUrl;

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-40 pb-20 sm:pt-44"
    >
      {/* 3D background */}
      <div className="pointer-events-none absolute inset-0">
        <FloatingCube className="left-[6%] top-[18%]" size={140} delay={0.2} />
        <FloatingCube className="right-[4%] top-[10%]" size={70} delay={0.6} />
        <FloatingCube
          className="left-[20%] bottom-[12%]"
          size={80}
          delay={1}
        />
      </div>

      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        className="relative mx-auto w-full max-w-7xl"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12 xl:gap-20">
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 flex flex-wrap items-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-strong">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground" />
                </span>
                {profile.available ? "Available for work" : "Currently engaged"}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                · {profile.location || "Remote"}
              </span>
            </motion.div>

            <h1 className="text-[12vw] font-semibold leading-none tracking-[-0.04em] sm:text-[8vw] lg:text-[4.5rem] xl:text-[6rem]">
              <span className="block overflow-hidden">
                {chars.map((c, i) => (
                  <span
                    key={i}
                    className="char"
                    style={{ animationDelay: `${i * 0.04 + 0.2}s` }}
                  >
                    {c === " " ? "\u00A0" : c}
                  </span>
                ))}
              </span>
              <span className="mt-3 block overflow-hidden">
                <motion.span
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="block text-muted"
                >
                  {profile.headline}
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="mt-10 max-w-xl text-base leading-relaxed text-muted-strong sm:text-lg"
            >
              {profile.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.05 }}
              className="mt-12 flex flex-wrap items-center gap-4"
            >
              <a
                href="#projects"
                className="group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:gap-4"
              >
                See selected work
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center rounded-full border border-border bg-card/80 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-border-strong hover:bg-background"
              >
                Get in touch
              </a>
            </motion.div>
          </div>

          {avatar && (
            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <AvatarOrbit src={avatar} name={name} profile={profile} />
            </div>
          )}
        </div>

        {/* Bottom marker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-16 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted lg:mt-12"
        >
          <span className="h-px w-10 bg-border-strong" />
          Scroll to explore
          <motion.span
            aria-hidden
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="text-muted-strong"
          >
            ↓
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}

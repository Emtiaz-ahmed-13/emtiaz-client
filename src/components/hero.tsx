"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Profile } from "@/types/portfolio";

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
            className="absolute inset-0 border border-foreground/15 bg-foreground/[0.02] backdrop-blur-sm"
            style={{ transform: face.t }}
          />
        ))}
      </motion.div>
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

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-40 pb-20 sm:pt-44"
    >
      {/* 3D background */}
      <div className="pointer-events-none absolute inset-0">
        <FloatingCube className="left-[8%] top-[18%]" size={140} delay={0.2} />
        <FloatingCube className="right-[10%] top-[22%]" size={90} delay={0.6} />
        <FloatingCube className="right-[20%] bottom-[15%]" size={70} delay={1} />
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

        <h1 className="text-[12vw] font-semibold leading-[1] tracking-[-0.04em] sm:text-[8vw] lg:text-[6.5rem]">
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
              transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
            className="link-underline text-sm text-muted-strong hover:text-foreground"
          >
            Get in touch
          </a>
        </motion.div>

        {/* Bottom marker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="absolute -bottom-8 left-0 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted"
        >
          <span className="h-px w-10 bg-border-strong" />
          Scroll to explore
        </motion.div>
      </motion.div>
    </section>
  );
}

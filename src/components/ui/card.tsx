"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { FormEvent, MouseEvent, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  tilt?: boolean;
  as?: "div" | "a" | "form" | "article";
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  delay?: number;
  inset?: boolean;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
};

export function Card({
  children,
  tilt = false,
  as = "div",
  href,
  className = "",
  delay = 0,
  inset = false,
  target,
  rel,
  onSubmit,
}: CardProps) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), {
    stiffness: 160,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), {
    stiffness: 160,
    damping: 20,
  });

  function handleMove(e: MouseEvent<HTMLElement>) {
    if (!tilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleLeave() {
    if (!tilt) return;
    mx.set(0);
    my.set(0);
  }

  const baseClass = `relative overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-border-strong ${
    inset ? "" : "p-6 sm:p-8"
  } ${className}`;

  const motionProps = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" } as const,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
    style: tilt
      ? {
          rotateX,
          rotateY,
          transformPerspective: 1100,
          transformStyle: "preserve-3d" as const,
        }
      : undefined,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    className: baseClass,
  };

  if (as === "a") {
    return (
      <motion.a href={href} target={target} rel={rel} {...motionProps}>
        <CornerMarkers />
        {children}
      </motion.a>
    );
  }

  if (as === "form") {
    const FormMotion = motion.form as unknown as React.ComponentType<
      Record<string, unknown>
    >;
    return (
      <FormMotion onSubmit={onSubmit} {...motionProps}>
        <CornerMarkers />
        {children}
      </FormMotion>
    );
  }

  if (as === "article") {
    return (
      <motion.article {...motionProps}>
        <CornerMarkers />
        {children}
      </motion.article>
    );
  }

  return (
    <motion.div {...motionProps}>
      <CornerMarkers />
      {children}
    </motion.div>
  );
}

function CornerMarkers() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute left-2 top-2 font-mono text-[10px] text-border-strong"
      >
        +
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-2 top-2 font-mono text-[10px] text-border-strong"
      >
        +
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 left-2 font-mono text-[10px] text-border-strong"
      >
        +
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 right-2 font-mono text-[10px] text-border-strong"
      >
        +
      </span>
    </>
  );
}

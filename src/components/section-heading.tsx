"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { SectionLabel } from "@/components/ui/section-label";

export function SectionHeading({
  index,
  title,
  subtitle,
  action,
}: {
  index: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mb-16"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <SectionLabel>{index}</SectionLabel>
            <span className="h-px w-12 bg-border-strong" />
          </div>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-strong sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0 self-start sm:self-end sm:pb-2">{action}</div>
        )}
      </div>
    </motion.div>
  );
}

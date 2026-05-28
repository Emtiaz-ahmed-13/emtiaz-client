"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, ExternalLink, FileText } from "lucide-react";
import { MouseEvent, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image-url";
import { Project } from "@/types/portfolio";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-1.93c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.07 0 0 .97-.31 3.18 1.19a11.07 11.07 0 015.78 0c2.21-1.5 3.18-1.19 3.18-1.19.63 1.6.23 2.78.11 3.07.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.27 5.68.41.36.77 1.06.77 2.14v3.18c0 .31.21.66.79.55C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

type Props = {
  project: Project;
  index: number;
  variant?: "spotlight" | "compact";
};

export function ProjectCard({ project, index, variant = "compact" }: Props) {
  const src = resolveImageUrl(project.imageUrl);
  const [failed, setFailed] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), {
    stiffness: 160,
    damping: 20,
  });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-3, 3]), {
    stiffness: 160,
    damping: 20,
  });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  const isSpotlight = variant === "spotlight";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "shimmer group relative overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-border-strong",
        isSpotlight && "lg:col-span-2"
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent transition group-hover:ring-foreground/10" />

      <div
        className={cn(
          "grid",
          isSpotlight ? "lg:grid-cols-[1.1fr_1fr]" : "grid-cols-1"
        )}
      >
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`Open ${project.title} case study`}
          className={cn(
            "relative block overflow-hidden bg-background",
            isSpotlight
              ? "aspect-[16/10] lg:aspect-auto lg:border-r lg:border-border"
              : "aspect-[16/10] border-b border-border"
          )}
        >
          {src && !failed ? (
            <Image
              src={src}
              alt={project.title}
              fill
              sizes={
                isSpotlight
                  ? "(max-width: 1024px) 100vw, 60vw"
                  : "(max-width: 1024px) 100vw, 50vw"
              }
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              onError={() => setFailed(true)}
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="font-mono text-7xl font-semibold text-border-strong">
                {project.title.charAt(0)}
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <Badge variant="solid">
              {String(project.order).padStart(2, "0")}
            </Badge>
            {project.featured && <Badge variant="outline">Featured</Badge>}
          </div>

          <div className="absolute right-4 top-4 flex items-center gap-1.5">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-strong">
              Live
            </span>
          </div>
        </Link>

        <div
          className={cn(
            "flex flex-col",
            isSpotlight ? "p-6 sm:p-10" : "p-6 sm:p-7"
          )}
        >
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
            <span className="h-px w-6 bg-border-strong" />
            <span>{project.techStack[0] || "Project"}</span>
          </div>

          <Link href={`/projects/${project.slug}`} className="block">
            <h3
              className={cn(
                "font-semibold tracking-[-0.02em] transition hover:text-muted-strong",
                isSpotlight ? "text-3xl sm:text-4xl" : "text-2xl"
              )}
            >
              {project.title}
            </h3>
          </Link>

          <p
            className={cn(
              "mt-3 leading-relaxed text-muted-strong",
              isSpotlight ? "text-base sm:text-[15px]" : "text-sm"
            )}
          >
            {project.shortDesc || project.description.split("\n")[0]}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, isSpotlight ? 8 : 5).map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
            {project.techStack.length > (isSpotlight ? 8 : 5) && (
              <Badge variant="muted">
                +{project.techStack.length - (isSpotlight ? 8 : 5)}
              </Badge>
            )}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-border pt-5">
            <Button asChild variant="default" size="sm">
              <Link href={`/projects/${project.slug}`}>
                <FileText />
                Case study
              </Link>
            </Button>

            {project.liveUrl && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink />
                  Live
                </a>
              </Button>
            )}

            {project.githubUrl && (
              <Button asChild variant="ghost" size="sm">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon />
                  Code
                </a>
              </Button>
            )}

            <Link
              href={`/projects/${project.slug}`}
              aria-label={`Open ${project.title} case study`}
              className="ml-auto hidden text-muted transition group-hover:translate-x-1 group-hover:text-foreground sm:inline-flex"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

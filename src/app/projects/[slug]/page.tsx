import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectCaseStudy } from "@/components/project-case-study";
import { getAllProjects, getPortfolio, getProjectBySlug } from "@/lib/api";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const projects = await getAllProjects();
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: `${project.title} — Case Study · Emtiaz Ahmed`,
    description:
      project.shortDesc ||
      project.description.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.shortDesc || project.description.slice(0, 160),
      images: project.imageUrl ? [project.imageUrl] : [],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [project, portfolio, allProjects] = await Promise.all([
    getProjectBySlug(slug).catch(() => null),
    getPortfolio().catch(() => null),
    getAllProjects().catch(() => [] as Awaited<ReturnType<typeof getAllProjects>>),
  ]);

  if (!project) {
    notFound();
  }

  const ordered = [...allProjects].sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((p) => p.slug === slug);
  const prev =
    idx > 0
      ? { slug: ordered[idx - 1].slug, title: ordered[idx - 1].title }
      : null;
  const next =
    idx >= 0 && idx < ordered.length - 1
      ? { slug: ordered[idx + 1].slug, title: ordered[idx + 1].title }
      : null;

  return (
    <>
      <Navbar name={portfolio?.profile.headline || "Emtiaz Ahmed"} />
      <ProjectCaseStudy project={project} prev={prev} next={next} />
      <Footer name="Emtiaz Ahmed" year={new Date().getFullYear()} />
    </>
  );
}

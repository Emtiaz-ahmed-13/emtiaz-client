import { About } from "@/components/about";
import { Achievements } from "@/components/achievements";
import { Blog } from "@/components/blog";
import { CodingProfiles } from "@/components/coding-profiles";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Journey } from "@/components/journey";
import { Navbar } from "@/components/navbar";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { SectionDivider } from "@/components/ui/section";
import { getPortfolio } from "@/lib/api";
import { getCodingStats } from "@/lib/coding-stats";

export default async function Home() {
  const [data, codingStats] = await Promise.all([
    getPortfolio(),
    getCodingStats(),
  ]);
  const name = "Emtiaz Ahmed";
  const year = 2026;
  const codingFetchedAt = new Date().toISOString();

  return (
    <>
      <Navbar name={name} />
      <main className="relative">
        <Hero profile={data.profile} name={name} />
        <SectionDivider />
        <About profile={data.profile} />
        <SectionDivider />
        <Projects projects={data.projects} />
        <SectionDivider />
        <Journey experiences={data.experiences} education={data.education} />
        <SectionDivider />
        <Skills skills={data.skills} />
        <SectionDivider />
        <CodingProfiles
          initialStats={codingStats}
          initialFetchedAt={codingFetchedAt}
        />
        <SectionDivider />
        <Achievements achievements={data.achievements ?? []} />
        <SectionDivider />
        <Blog posts={data.posts ?? []} />
        <SectionDivider />
        <Contact profile={data.profile} />
      </main>
      <Footer name={name} year={year} profile={data.profile} />
    </>
  );
}

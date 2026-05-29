import { About } from "@/components/about";
import { Blog } from "@/components/blog";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { SectionDivider } from "@/components/ui/section";
import { getPortfolio } from "@/lib/api";

export default async function Home() {
  const data = await getPortfolio();
  const name = "Emtiaz Ahmed";
  const year = 2026;

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
        <Skills skills={data.skills} />
        <SectionDivider />
        <Blog posts={data.posts ?? []} />
        <SectionDivider />
        <Contact profile={data.profile} />
      </main>
      <Footer name={name} year={year} profile={data.profile} />
    </>
  );
}

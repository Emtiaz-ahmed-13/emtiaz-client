"use client";

import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { Profile } from "@/types/portfolio";

const stats = [
  { label: "Years coding", value: "3+" },
  { label: "Projects shipped", value: "5+" },
  { label: "Tech stacks", value: "8+" },
  { label: "Coffee/tea per day", value: "∞" },
];

export function About({ profile }: { profile: Profile }) {
  const links = [
    { label: "Email", href: `mailto:${profile.email}`, value: profile.email },
    profile.githubUrl && {
      label: "GitHub",
      href: profile.githubUrl,
      value: "@Emtiaz-ahmed-13",
    },
    profile.linkedinUrl && {
      label: "LinkedIn",
      href: profile.linkedinUrl,
      value: "in/emtiaz-ahmed",
    },
    profile.websiteUrl && {
      label: "Web",
      href: profile.websiteUrl,
      value: profile.websiteUrl.replace(/^https?:\/\//, ""),
    },
  ].filter(Boolean) as { label: string; href: string; value: string }[];

  return (
    <Section id="about">
      <SectionHeading
        index="01 / About"
        title="A developer who cares about the craft."
        subtitle={profile.bio}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          {stats.map((stat, i) => (
            <Card key={stat.label} tilt delay={i * 0.06}>
              <SectionLabel>{stat.label}</SectionLabel>
              <div className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                {stat.value}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-4">
          {links.map((link, i) => (
            <Card
              key={link.label}
              as="a"
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              tilt
              delay={i * 0.06 + 0.2}
              className="group flex items-center justify-between !p-5"
            >
              <div>
                <SectionLabel>{link.label}</SectionLabel>
                <p className="mt-1.5 text-sm">{link.value}</p>
              </div>
              <span
                aria-hidden
                className="text-muted transition group-hover:translate-x-0.5 group-hover:text-foreground"
              >
                ↗
              </span>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

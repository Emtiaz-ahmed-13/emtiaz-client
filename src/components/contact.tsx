"use client";

import { FormEvent, useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { sendContactMessage } from "@/lib/api";
import { Profile } from "@/types/portfolio";

export function Contact({ profile }: { profile: Profile }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await sendContactMessage({
        name: String(data.get("name")),
        email: String(data.get("email")),
        subject: String(data.get("subject") || ""),
        message: String(data.get("message")),
      });
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <Section id="contact">
      <SectionHeading
        index="04 / Contact"
        title="Let's build something."
        subtitle="Got a project, role, or idea? Drop a message and I'll reply within 24 hours."
      />

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="grid gap-4">
          <Card
            as="a"
            href={`mailto:${profile.email}`}
            tilt
            delay={0}
            className="group"
          >
            <SectionLabel>Email</SectionLabel>
            <p className="mt-4 break-all text-xl font-semibold tracking-[-0.02em] transition group-hover:text-muted-strong sm:text-2xl">
              {profile.email}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted-strong">
              Open in mail client
              <span
                aria-hidden
                className="transition group-hover:translate-x-0.5"
              >
                →
              </span>
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {profile.githubUrl && (
              <Card
                as="a"
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                tilt
                delay={0.08}
                className="!p-5"
              >
                <SectionLabel>GitHub</SectionLabel>
                <p className="mt-2 text-sm">@Emtiaz-ahmed-13</p>
              </Card>
            )}
            {profile.linkedinUrl && (
              <Card
                as="a"
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                tilt
                delay={0.14}
                className="!p-5"
              >
                <SectionLabel>LinkedIn</SectionLabel>
                <p className="mt-2 text-sm">in/emtiazahmed</p>
              </Card>
            )}
          </div>
        </div>

        <Card as="form" onSubmit={handleSubmit} delay={0.1}>
          <div className="space-y-5">
            {[
              { id: "name", label: "Name", type: "text", required: true },
              { id: "email", label: "Email", type: "email", required: true },
              { id: "subject", label: "Subject", type: "text", required: false },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id}>
                  <SectionLabel>{field.label}</SectionLabel>
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  required={field.required}
                  className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm outline-none transition focus:border-foreground"
                />
              </div>
            ))}
            <div>
              <label htmlFor="message">
                <SectionLabel>Message</SectionLabel>
              </label>
              <textarea
                id="message"
                name="message"
                required
                minLength={10}
                rows={4}
                className="mt-2 w-full resize-none border-b border-border bg-transparent py-2.5 text-sm outline-none transition focus:border-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-foreground py-3 text-sm font-medium text-background transition hover:gap-4 disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send message"}
              {status !== "loading" && (
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              )}
            </button>

            {status === "success" && (
              <p className="text-center font-mono text-[11px] uppercase tracking-widest">
                ✓ Message delivered.
              </p>
            )}
            {status === "error" && (
              <p className="text-center font-mono text-[11px] text-red-400">
                ✗ {errorMsg}
              </p>
            )}
          </div>
        </Card>
      </div>
    </Section>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { HydrationGuard } from "@/components/hydration-guard";
import { ScrollProgress } from "@/components/scroll-progress";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emtiaz Ahmed | Full Stack Developer",
  description:
    "Portfolio of Emtiaz Ahmed, a full-stack developer from Bangladesh building modern web applications with TypeScript, React, Node.js, Express, Prisma, and PostgreSQL.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full overflow-x-hidden" suppressHydrationWarning>
        <HydrationGuard />
        <ScrollProgress />
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "Emtiaz Ahmed — Full Stack Engineer",
  description:
    "Independent full-stack engineer building APIs, products, and tools.",
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
      suppressHydrationWarning
    >
      <body className="min-h-full overflow-x-hidden" suppressHydrationWarning>
        <Script src="/bis-cleanup.js" strategy="beforeInteractive" />
        <ScrollProgress />
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}

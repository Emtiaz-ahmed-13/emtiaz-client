<div align="center">

# emtiaz-client

**Personal portfolio of Emtiaz Ahmed** — full-stack developer based in Dhaka, Bangladesh.

A Next.js 16 portfolio that pulls **live data** from a companion REST API, renders **case study pages** for every project, and surfaces **real-time competitive-programming stats** from LeetCode, Codeforces, and CodeChef.

[![Live](https://img.shields.io/badge/Live-emtiaz--client.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://emtiaz-client.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-emtiaz--server-1e293b?style=for-the-badge&logo=express&logoColor=white)](https://github.com/Emtiaz-ahmed-13/emtiaz-server)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](#license)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)
![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)
![Radix](https://img.shields.io/badge/Radix-UI-161618?logo=radixui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-0055ff?logo=framer&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Highlights](#highlights)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Related Repository](#related-repository)
- [License](#license)

---

## Overview

This isn't a static one-pager — it's a **fully data-driven portfolio** backed by a real Express API and PostgreSQL database. The home page, case studies, journey timeline, and achievement gallery all render from the same source of truth, so updating content means writing to the database, not editing JSX.

Built with the latest **Next.js 16 App Router** to showcase modern React patterns: **Server Components**, **Streaming SSR**, **ISR**, **`generateStaticParams`** for SSG case studies, and per-page **dynamic Open Graph metadata**.

When the API is unreachable (offline dev, cold build on Vercel, etc.) the site falls back to an embedded JSON snapshot, so it **never breaks** in production.

## Live Demo

- **Live site:** https://emtiaz-client.vercel.app
- **API:** https://emtiaz-server.vercel.app/api/v1/portfolio

> Add screenshots to `/public/screenshots/` and reference them here once captured.

## Highlights

| Feature | What it does |
|---|---|
| **Live coding profiles** | Pulls LeetCode (GraphQL), Codeforces (REST), and CodeChef (HTML scrape) stats server-side with ISR. Auto-refreshes on tab focus and every 2 min while visible. |
| **Case study pages** | `/projects/[slug]` — full problem → approach → outcome → challenges → tech stack → screenshots. SSG with `generateStaticParams`, dynamic OG tags per project. |
| **Journey timeline** | Vertical timeline mixing experience + education side-by-side, with "current" badges for active roles. |
| **Achievements gallery** | Hackathons, contests, and certifications with category filter chips, photo carousels in a Radix Dialog lightbox, and team / rank metadata. |
| **Contact form** | Type-safe Zod-validated form that POSTs to the backend, which persists the message and emails the admin via Nodemailer. |
| **3D tilt + spotlight cards** | Featured project card uses CSS `transform-style: preserve-3d` with mouse-tracked perspective and a shimmer overlay. |
| **Browser-extension hydration fix** | `public/bis-cleanup.js` loaded with `strategy="beforeInteractive"` strips Bitdefender / Grammarly attributes before React hydrates — no more "tree hydrated" warnings. |
| **Resume download** | `/emtiaz.pdf` opens in a new tab or downloads via attribute, with one-click access from the navbar. |
| **Graceful offline fallback** | `src/lib/fallback-portfolio.json` mirrors the latest API snapshot; `getPortfolio()` falls through to it on fetch failure, so SSR never throws. |

## Tech Stack

| Layer | Choices |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack, RSC, ISR, SSG) |
| **Language** | TypeScript 5 (strict) |
| **Styling** | Tailwind CSS 4 · CSS variables for theming · Framer Motion for animation |
| **UI primitives** | shadcn-style Button / Badge / Card · Radix UI Dialog · Lucide icons |
| **Data fetching** | Server Components → REST API with `next: { revalidate: 60 }` ISR; client refresh via internal `/api/coding-stats` route |
| **External integrations** | LeetCode GraphQL · Codeforces REST · CodeChef HTML scrape |
| **Tooling** | ESLint flat config · Prettier defaults · Turbopack |
| **Hosting** | Vercel (Edge network, automatic preview deploys on PR) |

## Architecture

```
┌─────────────────────────  Browser  ────────────────────────────┐
│                                                                │
│  Next.js 16 App Router (RSC + ISR)                             │
│    │                                                           │
│    ├─ Server Component (page.tsx)                              │
│    │     fetch ─→  emtiaz-server.vercel.app/api/v1/portfolio   │
│    │     ↓                                                     │
│    │   fallback-portfolio.json   (offline / build-time safety) │
│    │                                                           │
│    ├─ generateStaticParams ─→ SSG /projects/[slug] for all     │
│    │                                                           │
│    └─ Client refresh ─→ /api/coding-stats (LeetCode / CF / CC) │
│                                                                │
└────────────────────────────────────────────────────────────────┘
            │                                       │
            ▼                                       ▼
   Vercel Edge CDN                       Codeforces / LeetCode / CodeChef
   ISR-cached HTML
```

## Project Structure

```
emtiaz-client/
├── public/
│   ├── emtiaz.pdf              # Downloadable resume
│   └── bis-cleanup.js          # Strips extension attrs pre-hydration
├── src/
│   ├── app/
│   │   ├── api/coding-stats/   # Client-side refresh route
│   │   ├── projects/[slug]/    # SSG case-study pages
│   │   ├── layout.tsx          # Fonts, metadata, hydration guard
│   │   ├── page.tsx            # Home (orchestrates all sections)
│   │   └── globals.css         # Tailwind layer + custom animations
│   ├── components/
│   │   ├── ui/                 # shadcn-style primitives (Button, Badge, Dialog, Card)
│   │   ├── navbar.tsx          # Animated nav + resume button
│   │   ├── hero.tsx            # Hero with ambient gradient
│   │   ├── about.tsx           # Stats grid
│   │   ├── projects.tsx        # Spotlight + compact card grid
│   │   ├── project-card.tsx    # 3D tilt + shimmer
│   │   ├── journey.tsx         # Experience + education timeline
│   │   ├── skills.tsx          # Categorised skill bars
│   │   ├── coding-profiles.tsx # Live CP stats (client refresh)
│   │   ├── achievements.tsx    # Filterable highlight gallery
│   │   ├── contact.tsx         # Validated contact form
│   │   └── footer.tsx
│   ├── lib/
│   │   ├── api.ts              # Type-safe API client + fallback
│   │   ├── coding-stats.ts     # LeetCode / CF / CC fetchers
│   │   ├── fallback-portfolio.json
│   │   └── utils.ts            # cn() helper
│   └── types/
│       └── portfolio.ts        # Shared types with the API
├── next.config.ts              # Image remote patterns
├── tsconfig.json
└── package.json
```

## Getting Started

**Prerequisites:** Node 20+ · npm 10+

```bash
git clone git@github.com:Emtiaz-ahmed-13/emtiaz-client.git
cd emtiaz-client
npm install

cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL — point to local backend or the deployed one
# Local:      http://localhost:5001/api/v1
# Production: https://emtiaz-server.vercel.app/api/v1

npm run dev
```

Visit http://localhost:3000

> The backend repo ([emtiaz-server](https://github.com/Emtiaz-ahmed-13/emtiaz-server)) needs to be running locally for the API to respond. If it isn't, the site still renders from the bundled fallback snapshot.

## Environment Variables

| Key | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | yes | Backend base URL — `http://localhost:5001/api/v1` for dev, `https://emtiaz-server.vercel.app/api/v1` for prod |

Anything starting with `NEXT_PUBLIC_` is inlined at build time, so changing it requires a redeploy.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start local dev server with Turbopack on port 3000 |
| `npm run build` | Production build (typecheck + SSG for all `/projects/[slug]`) |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint flat config |

## Deployment

Hosted on **Vercel** — every push to `main` triggers an automatic production deploy. Preview deployments are created for every PR.

**Required Vercel project settings:**

| Setting | Value |
|---|---|
| Framework preset | Next.js (auto-detected) |
| Node version | 20.x |
| Env var `NEXT_PUBLIC_API_URL` | `https://emtiaz-server.vercel.app/api/v1` |
| Build command | `next build` (default) |
| Output dir | `.next` (default) |

The site is aliased at https://emtiaz-client.vercel.app.

## Related Repository

| Repo | What | Live |
|---|---|---|
| [Emtiaz-ahmed-13/emtiaz-server](https://github.com/Emtiaz-ahmed-13/emtiaz-server) | Express + Prisma 7 + PostgreSQL backend that powers this site | https://emtiaz-server.vercel.app |

## License

MIT © [Emtiaz Ahmed](https://github.com/Emtiaz-ahmed-13)

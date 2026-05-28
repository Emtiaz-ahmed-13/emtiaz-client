# emtiaz-client

Personal portfolio frontend built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, and **TypeScript** — fetches live data from the companion [emtiaz-server](https://github.com/Emtiaz-ahmed-13/emtiaz-server) API.

[Live →](https://emtiazahmed.vercel.app)

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, RSC, ISR) |
| UI | Tailwind CSS 4 · shadcn-style primitives · Radix UI · Framer Motion · Lucide |
| Data | Server Components fetch from REST API · fallback snapshot for offline / build-time |
| Live integrations | LeetCode GraphQL · Codeforces REST · CodeChef HTML scrape |

## Features

- **Live coding stats** from LeetCode, Codeforces, and CodeChef (server-side fetch with ISR + client-side refresh)
- **Case study pages** at `/projects/[slug]` (SSG with `generateStaticParams` + per-page OG metadata)
- **Journey timeline** — experience + education side-by-side
- **Achievements gallery** with photo lightbox + category filter
- **Contact form** wired to backend with SMTP delivery
- **3D tilt** cards, Framer Motion animations, monochrome B&W aesthetic
- **Browser extension hydration** mitigation (Bitdefender / Grammarly)

## Local Setup

```bash
git clone git@github.com:Emtiaz-ahmed-13/emtiaz-client.git
cd emtiaz-client
npm install
cp .env.example .env.local   # edit NEXT_PUBLIC_API_URL
npm run dev
```

Open http://localhost:3000

## Environment Variables

| Key | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (e.g. `http://localhost:5001/api/v1` for local, the deployed URL for prod) |

If the backend is unreachable, the app falls back to a snapshot at `src/lib/fallback-portfolio.json`.

## Scripts

```bash
npm run dev      # local dev server (Turbopack)
npm run build    # production build
npm run start    # production server
npm run lint     # eslint
```

## Deployment

Deployed on **Vercel** — connected to this repo, auto-deploys on push to `main`. Set `NEXT_PUBLIC_API_URL` in the Vercel project's environment variables.

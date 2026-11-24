# CraftyNest — DIY Crafts & Home Decor Ideas

Custom website for the CraftyNest Pinterest account
(**CraftyNest | DIY Crafts & Home Decor Ideas**, @ezraashere223).

- **Live site (once deployed):** https://diy.bilalmania.com
- **Niche:** DIY crafts & home decor ideas — numbered idea-list articles
  that feed Pinterest pins.
- **Stack:** Next.js (App Router, TypeScript) + Tailwind CSS, hosted on
  Vercel, code on GitHub at `ezraashere223-diy-design/craftynest-diy`.

There is **no admin dashboard, no database and no CMS** in this setup.
Articles are Markdown files in the repo (see below).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 with your browser.

## Build (what Vercel runs)

```bash
npm run build
npm start
```

## How to publish a new article

1. Write the article yourself as one Markdown file in
   `content/posts/<slug>.md` — see the file format below.
2. Add its images to `public/images/<slug>/` — portrait only, each
   under 100 KB, named by what they show (kebab-case), one image per
   design, in design order.
3. Commit and push to `main` — Vercel auto-deploys.
4. Open the live page yourself and verify: live count == title count ==
   design headings count, all images loading in the right order with the
   right alt texts, FAQ section present. Only then is the article
   "published complete". **No pins without a published article.**

### Article file format

```markdown
---
title: "30 Cozy Winter Bedroom Ideas for a Warm Retreat"
slug: "cozy-winter-bedroom-ideas"
description: "Discover 30 cozy winter bedroom ideas with layered bedding, warm lighting and soft textures for a calm, inviting retreat."
keyword: "cozy winter bedroom ideas"
category: "Bedroom Decor"
date: "2026-11-24"
images:
  - file: "cozy-winter-bedroom-fairy-lights.jpg"
    alt: "Cozy winter bedroom with layered blankets, warm fairy lights and a soft reading nook"
---

[Intro — 2–3 short paragraphs, main keyword in the first 100 words.]

## 1. Layered Blankets and Throws
[1–2 paragraphs describing this design.]
![alt text](/images/cozy-winter-bedroom-ideas/cozy-winter-bedroom-fairy-lights.jpg)

## 2. [Next design name]
...

## Takeaway
[Short closing.]

## Frequently Asked Questions

### How do I make my bedroom feel cozy in winter?
[Answer — 40–60 words.]
```

Rules (Pinterest Master Prompt, Section 5):

- **True count everywhere:** title count == design count == image count.
  The build excludes any article that fails this check (see `lib/posts.ts`).
- Design headings are H2 (`##`), numbered 1..N contiguously. FAQ
  questions are H3 (`###`). FAQs: 7–8, on-topic, 40–60 words each.
- Alt text: descriptive, 8–15 words, never repeated, never stuffed.
- Dates are never backdated. No invented statistics or fake claims.
- Pin images live in `public/images/pins/<slug>-pin{1,2,3}.png` and are
  served from the site itself.

A sample structure file lives at
`content/posts/cozy-winter-bedroom-ideas.md` — it is marked
`draft: true`, so it is never listed, built or put in the sitemap.
Replace it with a real article; do not publish it as-is.

## Deploy notes (Vercel + IONOS)

1. Import the repo into Vercel (Framework Preset: Next.js,
   Build Command: `npm run build`, Output Directory: `.next`).
2. Add the custom domain `diy.bilalmania.com` in Vercel → Domains.
   Vercel will show the exact DNS record to set.
3. In IONOS (bilalmania.com → Domains & SSL → DNS), add the record
   Vercel gives you for the `diy` subdomain (usually a CNAME).
   SSL is automatic via Vercel — verify the site loads on https.
4. After the domain works, claim it on Pinterest (Business hub →
   Claim your website) and submit the sitemap
   `https://diy.bilalmania.com/sitemap.xml` in Google Search Console.

## Project structure

```
app/              Pages and routes (home, /posts, /posts/<slug>)
components/       Reusable UI (header, footer, article card)
content/posts/    Article Markdown files (the "CMS")
lib/              Article parsing/validation, site constants, Markdown
public/images/    Article images (<slug>/) and pin images (pins/)
public/robots.txt Sitemap pointer (sitemap is generated at /sitemap.xml)
```

## Secrets

Never commit secrets, API keys or passwords. Environment variables go
in the Vercel dashboard only — never in code, never in chat.

# MONOLITH — NULLEXWEB Concept

A premium, interactive architecture portfolio built with React 19, TypeScript, Vite, GSAP + ScrollTrigger and Lucide. MONOLITH is fictional and is not a real client commission. Project photographs illustrate imagined studies; the site claims no architectural authorship.

## Run locally

Use Node.js 22.12+ (Node 24 LTS recommended) and npm.

```bash
git clone https://github.com/darmaskirov/monolith-architecture.git
cd monolith-architecture
npm ci
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173).

```bash
npm run typecheck
npm run build
npm run preview
```

Production output: `dist/`. There are no environment variables, API keys or backend services. The demo form validates locally and explicitly reports that no data is sent or stored.

## Browser verification

Start `npm run dev -- --port 5173` in another terminal, then:

```bash
npx playwright test
```

The checked-in configuration uses the installed `/usr/bin/google-chrome`. On another platform replace `launchOptions.executablePath` in `playwright.config.ts` with your Chrome path or remove `launchOptions` and run `npx playwright install chromium`. Tests cover 1440px desktop, 390px mobile, reduced motion, section navigation, project dialog/Escape, horizontal translation, form validation, image loading, console errors, page overflow and automated WCAG A/AA checks. Screenshots are saved in ignored `test-results/`.

## Deploy to Vercel

Import the repository, choose the `MONOLITH` directory as Root Directory if importing the parent workspace, select Vite, use `npm run build` and output directory `dist`. No SPA rewrite is needed: navigation uses same-page anchors. This project is prepared for deployment; it is not connected to a Vercel account or published automatically.

Before public release set `og:url`, an absolute `og:image` URL and a canonical URL in `index.html` to the actual deployment domain. These cannot be truthfully filled before a domain is selected. The social image is provided at `public/images/social.jpg`.

## Implementation

`src/App.tsx` contains semantic sections, project data, scoped animation setup, the native project dialog and demo validation. `src/styles.css` contains fluid layouts, interaction states and reduced-motion fallbacks. `gsap.context()` and `gsap.matchMedia()` revert animations and ScrollTriggers on unmount. Desktop gallery pinning is active from 1000px only. Native scroll and anchor navigation remain intact.

All imagery and the variable DM Sans font are locally hosted. Below-fold images use lazy loading and responsive 768px sources. There is no analytics, personal-data collection, testimonial content or fabricated commercial result.

See [case study](PORTFOLIO_CASE_STUDY.md) and [image/font sources](public/IMAGE_CREDITS.md). Automated tests complement manual review; they do not establish universal assistive-technology or cross-browser certification.

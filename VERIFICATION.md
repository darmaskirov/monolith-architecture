# Verification — 12 November 2026

Story: a visitor explores the architectural portfolio, scrolls through four project studies, opens and dismisses a project dialog, reads the studio approach and validates an explicitly labelled demonstration inquiry without sending data.

## Results

- `npm run build`: passed. Vite production output generated in `dist/`, approximately 2 MB including local images and fonts. Main JS: 358.81 kB / 121.16 kB gzip; CSS: 17.65 kB / 4.62 kB gzip.
- `npm run typecheck`: passed with strict TypeScript.
- `npx playwright test`: **4 passed (41.1s)** using installed Google Chrome.
- `npm audit --omit=dev`: **0 vulnerabilities** at verification time.

## Browser coverage

1. Desktop, 1440 × 1000: hero, project dialog, Escape dismissal, horizontal gallery translation, all principal sections, invalid and valid demo form states, loaded images, no page overflow, no browser console errors and no automated axe WCAG A/AA violations.
2. Mobile, 390 × 844: navigation menu, vertical gallery, dialog, all sections, form validation, images, overflow, console and axe checks.
3. Reduced motion, 1440 × 1000: non-pinned project grid and the same complete visitor journey, console and accessibility checks.
4. Additional widths 320, 768, 1024 and 1920px: document width stays within the viewport. Changing reduced motion at runtime removes the pin spacer, resets horizontal translation and restores exactly one spacer when motion is enabled again.

Desktop hero, mobile hero and desktop contact screenshots were visually inspected. Two supporting text colors were darkened after the first contrast audit; light button labels on light backgrounds were corrected after screenshot inspection. Final checks above were run after those fixes.

The form is entirely browser-local. It does not call an API, persist input or display a false delivery confirmation. Production assets are present in `dist/`; deployment itself was not performed. Set domain-dependent canonical and Open Graph URLs before publishing.

Limits: browser testing used Linux Chrome and emulated viewport sizes, not physical phones or Safari/Firefox. Automated accessibility checks do not replace assistive-technology testing. No claim is made about Lighthouse scores, actual client results or universal frame-rate performance. Tests ran against the Vite development server; the production build was independently compiled and type-checked.

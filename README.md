# Hardeep Kaur — Psychotherapist & Holistic Healer

Three-page site (Home · About · Contact) built with React 19 + Vite, GSAP (ScrollTrigger, SplitText), Lenis smooth scroll and a single persistent three.js scene.

```bash
npm install
npm run dev      # http://localhost:3780
npm run build    # type-check + production build into dist/
npm run verify   # 130 Node checks: particle forms, scroll choreography, numerology, service coverage
```

## The concept — "Night to Dawn"

- The page palette moves from midnight indigo → dusk plum → dawn ivory as you scroll (`useTones` in `src/lib/motion.ts`, driven by `data-tone` on each section).
- One WebGL "soul" (`src/scene/`) lives behind every page and never remounts. It morphs into a particle illustration for each service path: orb → ripples → interlinked rings → neural web → hypnotic spiral → chakra column → tarot card → circle of people → lotus, and at the end of each page it rises as a gold dawn sun.
- The scroll script is pure data (`src/scene/choreo.ts`) and is unit-tested in Node.

## Where to edit content

Everything is in **`src/lib/content.ts`**: services (8 paths, 59 services), the "What brings you here?" feelings, workshops, tarot cards, numerology meanings, testimonials, About story, FAQ and contact details.

### Placeholders to replace before launch

| What | Where | Status |
|---|---|---|
| Phone, WhatsApp number, email | `site` in `content.ts` | **DEMO** values |
| Studio city / address | `site.studio` | generic text |
| Testimonials | `testimonials` | **DEMO** — replace with real, consented quotes |
| About story | `story` | **DRAFT** — written without Hardeep's input |
| Portrait | `.arch` in `src/pages/About.tsx` | line-art placeholder; drop a photo into the arch |
| Credentials | `toolkit` | lists modalities only — add certifying bodies/years if wanted |

The enquiry form has **no backend yet**: it validates, keeps a local copy (`localStorage`), then hands off to WhatsApp or email with a pre-written summary. Wire `submit()` in `src/pages/Contact.tsx` to an email service / CRM when ready.

## Safety copy

The site lists suicidal thoughts, abuse and trauma among the things Hardeep works with, so it carries crisis signposting (Tele-MANAS 14416 / 1-800-891-4416, emergency 112) in the footer, the contact page and the "What brings you here?" result. It also says spiritual services complement, never replace, medical care. Keep these.

## Verification harness (dev only)

- `?still=1` renders every animation in its final state.
- `?still=1&solo=.paths&hide=.paths__head&shape=3&sx=-0.5&ss=0.58` shows one section alone with the soul pinned to a form — handy for screenshots.
- `?nogl=1` forces the CSS fallback orb (what visitors without WebGL see).
- In dev builds `window.__hk` exposes `ScrollTrigger` and the scene store.

## Deploy

Static build. SPA rewrites are included for Vercel (`vercel.json`) and Netlify (`public/_redirects`).

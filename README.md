<p align="center">
  <img src="public/logo.png" width="96" alt="Cresco Prime logo" />
</p>

<h1 align="center">Cresco Prime</h1>

<p align="center">
  Website for Cresco Prime LLC, an IT services and consulting firm in Frisco, Texas.<br />
  <a href="https://www.crescoprime.com">crescoprime.com</a>
</p>

---

## Overview

A fast, static marketing site built with Astro. It presents what Cresco Prime does, who runs it and how to get in
touch, with a motion layer that stays light: an entrance that opens through the logo's hexagon, a 3D logo drawn in
WebGL, and page transitions in which the C and the P of the logo lock together.

Every page's content reads without JavaScript, the motion respects reduced-motion settings, and the 3D library loads
only when it is needed.

## Features

- **Six pages:** Home, Services, About, Founder, Privacy policy and Terms of service, plus a custom 404 page.
- **Motion:** GSAP timelines and ScrollTrigger, Lenis smooth scrolling, a lazy-loaded Three.js logo that pauses off
  screen and falls back to a flat SVG on software renderers, data saver or reduced motion.
- **Navigation:** a floating glass bar and a full-screen menu; each menu link opens a page with only its own section.
- **Accessibility:** semantic landmarks and headings, a skip link, visible focus, keyboard-only menu control
  (Escape closes it), `inert` page content behind the open menu, and full `prefers-reduced-motion` support.
- **Search engines:** canonical URLs, Open Graph and Twitter cards with a share image, schema.org JSON-LD
  (ProfessionalService, WebSite, Service list, Person, breadcrumbs), `sitemap.xml` and `robots.txt`.
- **Privacy:** no cookies, analytics, trackers or forms.

## Tech stack

| Area | Tool |
| --- | --- |
| Framework | [Astro](https://astro.build) 7, static output |
| Motion | [GSAP](https://gsap.com) 3 with ScrollTrigger, [Lenis](https://lenis.darkroom.engineering) |
| 3D | [Three.js](https://threejs.org) |
| Type | Mona Sans and Geist Mono, self-hosted variable fonts via Fontsource |
| Hosting | Cloudflare Pages |

## Getting started

Requirements: **Node.js 22.12 or newer** (the repo pins 22.20.0 in `.node-version`) and npm.

```bash
npm install
npm run dev        # local development at http://localhost:4321
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Project structure

```
public/                 Static files served as-is: icons, share image, logo, sitemap, robots.txt, photos
src/
  components/           Page sections (Hero, Services, About, Founder, Principles), Nav, Footer, PageHead, Legal
  layouts/Base.astro    Shared page shell: head tags, structured data, fonts, nav, footer, transition panel
  lib/
    mark.js             The logo geometry, shared by the SVG, the 3D logo and the transition
    site.js             Company facts and the service list, shared by the pages and the structured data
  pages/                One file per route: index, services, about, founder, privacy, terms, 404
  scripts/              Entrance, page transitions, smooth scrolling and the 3D logo
  styles/global.css     Design tokens (colours, spacing, easing), buttons and links
DESIGN.md               Design record: concept, palette, type, motion and every section's decisions
```

## Editing content

| What | Where |
| --- | --- |
| Services and their descriptions | `src/lib/site.js` (`groups`) |
| Company details, phone, social profiles for search engines | `src/lib/site.js` (`org`, `person`) |
| Contact email, LinkedIn, Instagram, WhatsApp links | top of `src/components/Footer.astro` |
| Menu links and their side notes | top of `src/components/Nav.astro` |
| Page titles and descriptions | the `title` and `description` on each file in `src/pages/` |
| Privacy policy and terms | `src/pages/privacy.astro`, `src/pages/terms.astro` |
| Colours and spacing | `:root` in `src/styles/global.css` |

When you add or remove a page, update `public/sitemap.xml` as well.

## Deployment (Cloudflare Pages)

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | read from `.node-version` (22.20.0) |

Once the repository is connected, every push to `main` builds and publishes the site. Pages are generated as folders, so URLs end in a slash
(`/services/`), which is also the canonical form used in links and in the sitemap.

## Browser support

Current versions of Chrome, Edge, Safari and Firefox (Chrome and Edge 111+, Safari 16.2+, Firefox 121+). Tested at
fifteen screen sizes from 320 px phones to 2560 px displays, in Chromium, Edge and WebKit.

## Credits

Designed and crafted by [Kurapati Saiteja](https://portfolio-ks-beta.vercel.app/).

## License

© 2026 Cresco Prime LLC. All rights reserved. The Cresco Prime name, logo and content may not be reused without
permission.

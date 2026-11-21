<p align="center">
  <img src="public/logo.png" width="96" alt="Cresco Prime logo" />
</p>

<h1 align="center">Cresco Prime</h1>

<p align="center">
  Website for Cresco Prime LLC, an IT services and consulting firm in Frisco, Texas.<br />
  <a href="https://www.crescoprime.com">crescoprime.com</a>
</p>

<p align="center">
  <img alt="Astro 7" src="https://img.shields.io/badge/Astro-7.3-242424?logo=astro&logoColor=c6f432" />
  <img alt="GSAP 3" src="https://img.shields.io/badge/GSAP-3.15-242424?logo=greensock&logoColor=c6f432" />
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-0.187-242424?logo=threedotjs&logoColor=c6f432" />
  <img alt="Lenis" src="https://img.shields.io/badge/Lenis-1.3-242424" />
  <img alt="Cloudflare Pages" src="https://img.shields.io/badge/Cloudflare_Pages-hosting-242424?logo=cloudflarepages&logoColor=c6f432" />
</p>

---

## Overview

A fast, static marketing site built with Astro. It presents what Cresco Prime does, who runs it and how to get in
touch, with a motion layer that stays light: an entrance that opens through the logo's hexagon, a 3D logo drawn in
WebGL, and page transitions in which the C and the P of the logo lock together.

Every page's content reads without JavaScript, the motion respects reduced-motion settings, and the 3D library loads
only when it is needed.

## Tech stack

| Layer | Technology | Version | Used for |
| --- | --- | --- | --- |
| Framework | [Astro](https://astro.build) | 7.3.8 | Static site generation, components, scoped CSS, per-page `<head>` |
| Build tool | [Vite](https://vite.dev) (bundled with Astro) | 8 | Dev server, hot reload, production bundling |
| Language | HTML, CSS, JavaScript (ES modules), TypeScript in Astro frontmatter | | Markup, styles, scripts |
| Animation | [GSAP](https://gsap.com) with ScrollTrigger | 3.15.1 | Entrance, page transitions, menu, scroll reveals |
| Smooth scroll | [Lenis](https://lenis.darkroom.engineering) | 1.3.27 | Smooth scrolling on one clock with GSAP |
| 3D | [Three.js](https://threejs.org) | 0.187.0 | The extruded, lit 3D logo (lazy-loaded) |
| Typography | [Mona Sans](https://github.com/github/mona-sans) and [Geist Mono](https://vercel.com/font) via [Fontsource](https://fontsource.org) | 5.3.0 | Self-hosted variable fonts (width and weight axes) |
| SEO | schema.org JSON-LD, Open Graph, Twitter cards, sitemap | | Search results and link previews |
| Testing | [Playwright](https://playwright.dev) in Chromium, Edge and WebKit; axe accessibility checks | | Layout at 15 screen sizes, navigation, transitions |
| Runtime | [Node.js](https://nodejs.org) | 22.20.0 | Builds (`.node-version`) |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) | | Static hosting and global CDN |

No UI framework, CSS framework or tracking script is used: the site ships plain HTML, bundled CSS and small scripts
that load only where they are needed.

## Features

- **Pages:** Home, Services, About (with the founder), Careers with a page per open role, Privacy policy and Terms of
  service, plus a custom 404 page.
- **Motion:** GSAP timelines and ScrollTrigger, Lenis smooth scrolling, a lazy-loaded Three.js logo that pauses off
  screen and falls back to a flat SVG on software renderers, data saver or reduced motion.
- **Navigation:** a floating glass bar and a full-screen menu; each menu link opens a page with only its own section.
- **Accessibility:** semantic landmarks and headings, a skip link, visible focus, keyboard-only menu control
  (Escape closes it), `inert` page content behind the open menu, and full `prefers-reduced-motion` support.
- **Search engines:** canonical URLs, Open Graph and Twitter cards with a share image, schema.org JSON-LD
  (ProfessionalService, WebSite, Service list, Person, job postings, breadcrumbs), a generated `sitemap.xml` and
  `robots.txt`.
- **Privacy:** no cookies, analytics, trackers or forms.

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
public/                 Static files served as-is: icons, share image, logo, robots.txt, _redirects, photos
src/
  components/           Page sections (Hero, Services, About, Founder, Principles), Nav, Footer, PageHead, Legal
  layouts/Base.astro    Shared page shell: head tags, structured data, fonts, nav, footer, transition panel
  lib/
    mark.js             The logo geometry, shared by the SVG, the 3D logo and the transition
    site.js             Company facts and the service list, shared by the pages and the structured data
    jobs.js             The open roles: add one to open it, remove one to close it
  pages/                One file per route: index, services, about, careers (list and [slug] role pages), privacy,
                        terms, 404, and sitemap.xml.js
  scripts/              Entrance, page transitions, smooth scrolling and the 3D logo
  styles/global.css     Design tokens (colours, spacing, easing), buttons and links
DESIGN.md               Design record: concept, palette, type, motion and every section's decisions
```

## Editing content

| What | Where |
| --- | --- |
| Services and their descriptions | `src/lib/site.js` (`groups`) |
| Open roles (and their location and type for Google for Jobs) | `src/lib/jobs.js` |
| The founder's message | `src/components/Founder.astro` |
| Company details, phone, social profiles for search engines | `src/lib/site.js` (`org`, `person`) |
| Contact email, LinkedIn, Instagram, WhatsApp links | top of `src/components/Footer.astro` |
| Menu links and their side notes | top of `src/components/Nav.astro` |
| Page titles and descriptions | the `title` and `description` on each file in `src/pages/` |
| Privacy policy and terms | `src/pages/privacy.astro`, `src/pages/terms.astro` |
| Colours and spacing | `:root` in `src/styles/global.css` |

When you add or remove a fixed page, add it to the list in `src/pages/sitemap.xml.js`; roles are added automatically.

## Deployment (Cloudflare Pages)

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | read from `.node-version` (22.20.0) |

Once the repository is connected, every push to `main` builds and publishes the site. Pages are generated as folders, so URLs end in a slash
(`/services/`), which is also the canonical form used in links and in the sitemap.

## Job applications

Each role page has an application form. It posts to a Cloudflare Pages Function (`functions/api/apply.js`) that checks
the answers and the CV (PDF or Word, up to 3 MB), verifies [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/),
and sends two emails through [Resend](https://resend.com) from `apply@careers.crescoprime.com`: the application with
the CV attached to hr@crescoprime.com (reply goes to the applicant), and a confirmation to the applicant (reply goes
to hr@). Nothing is stored on the website. Until the settings below exist, the form tells applicants to email their
CV instead. Sending through Microsoft 365 is built in as an alternative (see the end of this section).

### 1. Cloudflare Turnstile

Cloudflare dashboard > Turnstile > widget "Cresco Prime careers" (Managed), hostnames `cresco-prime.pages.dev`,
`crescoprime.com` and `www.crescoprime.com`. Its site key and secret key go into the Pages settings below.

### 2. Resend

1. Create a Resend account.
2. Domains > **Add domain**: `careers.crescoprime.com`. A subdomain keeps form email apart from the company's own
   Microsoft 365 email reputation, as Resend recommends.
3. Add the DNS records Resend lists (a DKIM TXT record and the `send` and `rsend` CNAME records, all under
   `careers.crescoprime.com`) where crescoprime.com's DNS is managed. They do not touch the root domain's MX or SPF
   records, so Microsoft 365 email is unaffected. Then click **Verify** in Resend.
4. API Keys > **Create API key**: permission **Sending access**, domain `careers.crescoprime.com`. Copy it once into
   the Pages settings below as `RESEND_API_KEY`.

### 3. Cloudflare Pages settings

Workers & Pages > cresco-prime > Settings > Variables and secrets (Production), then redeploy:

| Name | Type | Value |
| --- | --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | Text | Turnstile site key (read at build time) |
| `TURNSTILE_SECRET_KEY` | Secret | Turnstile secret key |
| `HR_MAILBOX` | Text | `hr@crescoprime.com` |
| `RESEND_API_KEY` | Secret | Resend API key |
| `MAIL_FROM` | Text | Optional. Defaults to `Cresco Prime Careers <apply@careers.crescoprime.com>` |

`MAIL_DRY_RUN=1` is for local testing only: the function then returns the two emails instead of sending them.
Never set it in Cloudflare.

### Alternative: Microsoft 365

If `RESEND_API_KEY` is absent and the three `MS_` settings exist, the function sends through Microsoft Graph as
`HR_MAILBOX` instead. A Microsoft 365 admin sets it up with
[RBAC for Applications](https://learn.microsoft.com/exchange/permissions-exo/application-rbac), so the app can send as
hr@ and no other mailbox:

1. Microsoft Entra admin center > App registrations > **New registration** "Cresco Prime website", single tenant.
   Note the **Directory (tenant) ID** and **Application (client) ID**.
2. Certificates & secrets > **New client secret**; copy its **Value**. Do **not** add the Graph `Mail.Send`
   permission in Entra: that would allow sending as every mailbox.
3. Enterprise applications > "Cresco Prime website": note its **Application ID** and **Object ID**.
4. In Exchange Online PowerShell (`Connect-ExchangeOnline` as an Exchange administrator):

   ```powershell
   New-ServicePrincipal -AppId <Application ID> -ObjectId <Object ID> -DisplayName "Cresco Prime website"
   New-ManagementScope -Name "Cresco Prime website mailbox" -RecipientRestrictionFilter "PrimarySmtpAddress -eq 'hr@crescoprime.com'"
   New-ManagementRoleAssignment -App <Object ID> -Role "Application Mail.Send" -CustomResourceScope "Cresco Prime website mailbox"
   Test-ServicePrincipalAuthorization -Identity <Object ID> -Resource hr@crescoprime.com
   ```

5. Pages settings: `MS_TENANT_ID` and `MS_CLIENT_ID` (Text), `MS_CLIENT_SECRET` (Secret); remove `RESEND_API_KEY`.

## Browser support

Current versions of Chrome, Edge, Safari and Firefox (Chrome and Edge 111+, Safari 16.2+, Firefox 121+). Tested at
fifteen screen sizes from 320 px phones to 2560 px displays, in Chromium, Edge and WebKit.

## Credits

Designed and crafted by [Kurapati Saiteja](https://portfolio-ks-beta.vercel.app/).

## License

© 2026 Cresco Prime LLC. All rights reserved. The Cresco Prime name, logo and content may not be reused without
permission.

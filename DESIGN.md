# Cresco Prime: design record

Read this before building the next section so every section stays in one system.
The Stokt measurements in `references-from-other-website-inspirations/DESIGN.md` are reference only.

## Brief

- Client: Cresco Prime, IT services and consulting, Frisco, Texas. Founded 2026, no client work to show yet.
- Job of the site: make a new firm look credible and get a first conversation ("Start a project").
- This site replaces the trading-platform site currently at crescoprime.com.
- Built one section at a time: entrance and hero first, then each section, then footer, then nav.
- Never invent clients, numbers, awards or testimonials.

## Concept

```
Idea:        The mark is a solid block cut once, with the light on inside. Everything enters through that cut.
Anchor:      The logo itself: a hexagon split into C and P, and Cresco is Latin for "I grow".
Signature:   The entrance. A charcoal curtain, a window in the mark's hexagon shape rises and opens,
             and the flat logo inside it turns into a lit 3D block.
Emotion:     Calm, exact, engineered.
Motion verb: Open like a machined door: straight slides, weight, no bounce.
Screenshot:  The hero at rest: the four-line headline in two weights beside the dark block with lime light in the cut.
```

Reference roles: Stokt for the hero built around a 3D logo mark, ERA Residence for the entrance
mechanism (arch window, here the hexagon), Pasqua for page-to-page wipes (not built yet).

## Palette

Two colours from the logo, one accent. Tokens live in `src/styles/global.css`.

| Role | Value | Use |
|---|---|---|
| ink | `#242424` | logo charcoal: text, the curtain, primary buttons |
| ground | `#ecede8` | paper: section backgrounds |
| accent | `#c6f432` | signal lime. Only as light: the glow in the mark's cut, the hexagon chip of the primary action, hover fills, selection |
| muted | a mix of ink and ground | secondary text. Not a new hue |

Rule: the accent is light. At rest it appears only in the mark's cut and in the primary action's hexagon chip.
Never text on the light ground.

## Type

- Display and body: Mona Sans Variable (weight and width axes). Headlines: uppercase, width 78%, tracking -0.03em,
  leading 0.84, and two weights in one headline (300 and 680), echoing the wordmark's CRESCO / PRIME.
  The hero headline is four lines on desktop, sized `min(9.4vw, 12.6svh)` so it never pushes the actions off a
  short screen, and two lines on phones (9.7vw). Body 16 to 19px, leading 1.45.
- Labels: Geist Mono Variable, 12px, uppercase, tracking 0.04em. A label must carry a fact.
- Actions: Mona Sans 500 at 17px, sentence case.
- Both self-hosted through `@fontsource-variable`; only the Latin files load.

## Shape and layout

- Actions are round: the primary action is a pill. Everything else stays sharp, and the brand shape is the mark's hexagon.
- Primary action (`.cta`): a dark pill with the mark's hexagon as a lime chip holding the arrow. On hover, focus or
  tap the hexagon opens and floods the pill, the entrance's move in miniature, and the label changes colour exactly
  at the edge of the light. Press scales it to 0.97. Full width on phones.
- Secondary action (`.link`): a text link whose underline draws in. Arrows have a 30 degree head, the mark's angle.
- Page gutter `--pad`. Hero: type bottom-left, the mark owns the right half on desktop; on phones the mark
  sits above the type and everything fits one screen from 375x660 up.
- The mark's geometry has one source: `src/lib/mark.js` (clean redraw of the approved logo, proportions unchanged).

## Motion

- GSAP only, one clock (`gsap.ticker` also drives the 3D draw). Eases: `expo.out` to arrive, `expo.inOut` to travel.
- Entrance budget about 2.6s: counter (real wait for font and 3D, capped at 1.6s), window rises 0.75s,
  opens 0.85s, headline lines rise from masks, the rest fades up.
- The 3D mark idles with a small drift and follows the pointer by a few degrees.
- Pointer-triggered motion (`--ease-out`): 0.35s in, 0.22s out, 0.16s press. Hover only on fine pointers.
- Reduced motion or data saver: no entrance, no WebGL, the flat SVG mark and all text are simply there.
- Lenis and ScrollTrigger are not installed yet. Add them with the first section that scrolls.

## Placeholders and open points

- The headline is the client's LinkedIn tagline, in place until they pick a final line. "Built to grow." was rejected on 2026-11-15.
- Box-shaped buttons were rejected twice (cut-corner mono labels, then a split two-block button). The client chose the
  Hexagon light pill from five mocked options; do not bring boxes back.
- The hero has no buttons (client's call, 2026-11-17): headline, one paragraph and the 3D mark. "Start a project"
  lives in the footer; the menu holds the links.
- No social preview image yet.
- Astro is pinned to 7.3.8 because this machine runs Node 22.20.0. Astro 7.4.7 and later, which clear two
  moderate advisories (neither concerns a static site with no server), need Node 22.23.4 or newer.
- Frame rate has not been measured on a real phone, and the reduced-motion path has not been seen in a browser.

## Services section (built 2026-11-17)

- Charcoal background. A light-weight sentence heading, then four rows split by thin rules: ADVISE, BUILD,
  AUTOMATE, RUN in display type, each with one line and its services beside it (stacked on phones).
- Every service stays visible (no count in the copy: the client is still settling which services to offer). The group crossing the reading line (62% down the screen) is lit: its word turns
  from grey to paper and a lime hexagon appears beside it, the same light as the 3D mark and the button chip.
- Words rise through masks and the details fade up as each row enters. Under reduced motion: no reveals, no smooth
  scroll; the light still switches on, without growing.
- Small text on charcoal uses `--soft` (about 6:1). `--dim` (3.8:1) is for display words only.
- Smooth scroll (Lenis on GSAP's ticker) starts when the entrance ends (`intro:done` event). The 3D mark stops
  drawing while the hero is off screen.
- No cards, icon tiles, eyebrow labels or numbering: rules, type size and the light carry the structure.

## About section (built 2026-11-17)

- Paper background. Story: the logo's C (one band that curls inward) beside "Cresco means "I grow."", a short
  paragraph and two facts (based in Frisco, Texas; founded 2026). The C traces its outline as you scroll and then
  fills: the section's one scroll moment. Solid C under reduced motion or without the script.
- Founder: Kalyan Boddula, Founder, Director and CEO; bio from his LinkedIn; LinkedIn link with an up-and-out arrow
  (`.link--out`). Portrait `public/images/kalyan-boddula.webp`, 750x937 crop of the client's photo, sharp corners,
  no caption, no reveal effect. Portrait width `min(32vw, 30rem, 58svh)` so it and the bio share one screen.
- Copy is a draft for the client to approve.

## Build order (2026-11-17)

- Services, About, What we stand for, closing call to action, then the nav bar and footer from the client's plan
  (all built 2026-11-17).

## What we stand for (built 2026-11-17)

- Charcoal. A small soft heading in a left column ("Three things we check before we hand a system over."), three
  large statements on the right between thin rules, each led by its keyword in the display style: RELIABLE,
  SCALABLE, FUTURE-READY (the company's LinkedIn words). Stacked on phones.
- No scroll animation: the page's scroll moments stay the Services light and the About C.
- "We test every system before release and keep watching it after" is a process promise for the client to confirm.
- On the home page, after the About preview (charcoal after paper).

## Closing call to action (built 2026-11-17, moved into the footer the same day)

- Now the top block of the footer (`src/components/Footer.astro`, `#contact`); the separate section is gone.
  "Technology should / drive your business forward." (the
  company's LinkedIn line) in the two-weight display style, "Tell us what slows your team down.", the hexagon-light
  "Start a project" pill, and nothing else (client: one action here, not a button and an address).
- It opens an email. The address is hr@crescoprime.com, from Kalyan's LinkedIn post ("For Recruitment & Enquiries"),
  set once at the top of `src/components/Footer.astro`. Swap it when projects get their own inbox.
- "Schedule a consultation" is left out until a booking link exists.

## Page transitions (built 2026-11-17)

- After the Pasqua reference: a charcoal panel rises over the page (0.6s), the view changes underneath, then the
  panel lifts away (0.8s) while the new view slides up from 12vh. `src/scripts/transition.js`, panel markup in
  `src/layouts/Base.astro`, styles in `global.css` (`.wipe`).
- The Cresco Prime mark rides on the panel (client's request, replacing a small lime hexagon): paper colour, centred,
  `clamp(5rem, 15svh, 8.5rem)` tall. As the panel rises the C slides in from the left and the P from the right until
  they lock (0.6s, from 0.2s), then a thin lime line of light runs down the cut between them (0.35s). On the next
  page the light runs out at the bottom and the mark trails the lifting panel by 30% of the screen.
- In-page links (#services, #contact) jump behind the panel instead of smooth-scrolling, and move keyboard focus to
  the section. Links to other pages do a full page load: the next page starts with the panel closed (`html.wipe-in`,
  set before first paint from a sessionStorage flag) and lifts it; the home entrance is skipped when arriving this way.
- Left alone: new tabs, modified clicks, mailto/tel, other sites, the skip link, and everything under reduced motion.
- Every page uses `src/layouts/Base.astro` (head, fonts, panel). A designed 404 page exists (`src/pages/404.astro`).
- The nav and menu links use the same transition. A plain link to the current page (the logo on the home page)
  jumps to the top behind the panel instead of reloading and replaying the entrance.
- Jumps honour `scroll-margin-top`, so a group on the Services page or the founder lands clear of the nav bar.

## Pages (2026-11-17)

- Client's rule: each menu link opens a page with only that section, then the footer, and nothing else.
- Home `/`: entrance and hero (no buttons), the service groups (charcoal; each name links to its group on the
  Services page, lit on scroll or hover), a short About preview (paper: "Cresco means I grow", two sentences, "More
  about Cresco Prime"), What we stand for (charcoal), footer.
- `/services/`: page head "SERVICES" on charcoal with "Services, grouped by the job they do for your company.", then
  the four groups, each listing its services with a one-line description (draft copy for the client to approve).
  Groups carry ids (`#advise`, `#build`, `#automate`, `#run`).
- `/about/`: page head "ABOUT" on paper with "IT services and consulting from Frisco, Texas, since 2026.", then only
  the story with the C (traced once on a clock as it comes into view, then filled).
- `/founder/` (`src/components/Founder.astro`): page head "FOUNDER" with "The person who started Cresco Prime in
  2026.", then only Kalyan: name, role, bio, LinkedIn, portrait (loaded first: it is the page's main image).
- Page head (`src/components/PageHead.astro`): the page name in the condensed display cut at `min(17vw, 28svh)`,
  rising through a mask as the transition lifts, the line beside it on desktop and below it on phones.
- Menu: Services `/services/`, About `/about/`, Founder `/founder/`, Contact `#contact` (the footer of the page you
  are on). Links use the trailing slash, the canonical address, so Cloudflare Pages never has to redirect them.
- Tab titles: "IT Services | Cresco Prime", "About | Cresco Prime", "Kalyan Boddula, Founder | Cresco Prime"; the
  home keeps "Cresco Prime | IT Services and Consulting".

## Search engines (2026-11-17)

- Company facts live once in `src/lib/site.js` (also the service groups), and every page carries them as schema.org
  JSON-LD: ProfessionalService (Cresco Prime LLC, Frisco TX, founded 2026, email, phone +1 248 491 9357, LinkedIn,
  Instagram, the services it knows) and WebSite. Pages add their own: the Services page an ItemList of Service,
  About an AboutPage, Founder a Person and ProfilePage, and each inner page a Home > Page breadcrumb.
- Share card: `public/og.png` (1200x630: the mark with the lime cut, CRESCO PRIME, "IT services and consulting /
  Frisco, Texas"), set as og:image and a large Twitter card. `public/logo.png` (512, for the structured data),
  `apple-touch-icon.png` (180), `favicon-32.png` beside the SVG favicon. All rendered from the real mark and font.
- `public/sitemap.xml` lists all six pages with dates; `robots.txt` points to it.
- Off-site work that decides the ranking (the client's to do): a Google Business Profile for Frisco, Google Search
  Console with the sitemap, the same name, area and phone everywhere, reviews, and new pages over time.

## Nav bar and menu (built 2026-11-17)

- After tux.co, the client's pick. `src/components/Nav.astro`.
- Bar: a short floating charcoal glass pill, centred, `min(20rem, 100% - 2 x pad)` wide, 3.75rem tall, fixed at the
  top on every section. Fill 88% ink with a 16px backdrop blur; solid charcoal under reduced transparency or without
  backdrop-filter. Only the logo and name (left) and the menu button (right): the client dropped the Services, About,
  Contact links from the bar because the menu repeats them. Menu button: a paper circle with four dots that spread on hover, turn lime and rotate 45 degrees when open.
- The entrance brings the bar in with the hero copy.
- Menu: a full-screen lime panel (client's pick) with charcoal text that slides up (0.7s), the four links set huge
  in the condensed display style rising one after another. Hovering a link dims it and shows a note on each side
  (Services: "What we do" / "Advise, build, automate, run", and so on), decoded letter by letter. Corners: what and
  where (top left), the email as a big round mail icon, level with the bar (top right), the tagline (bottom left), Privacy and Terms (bottom centre), LinkedIn and
  Instagram (bottom right); top corners drop on phones (820px and below), as do the tagline and side notes on phones, where LinkedIn and
  Instagram take a row of their own above Privacy and Terms.
- The page behind is inert while the menu is open, scrolling stops, Escape closes it and returns focus to the button.
  A menu link closes the menu behind the page transition. Reduced motion: no slide, links jump natively.

## Footer (built 2026-11-17)

- After blackbird.vc, the client's pick. `src/components/Footer.astro`, `id="contact"`.
- Paper top block: the closing call to action on the left, three link columns on the right (Company, Contact,
  Legal). One column at 1100px and below. Contact: Email, LinkedIn, Instagram, WhatsApp.
- WhatsApp opens a chat with +1 248 491 9357 (`https://wa.me/12484919357`, set at the top of `Footer.astro`). The
  icon is drawn to match the outline icons beside it: the speech bubble with a handset inside.
- Charcoal base: the hero's CP mark in a paper circle centred on the seam between the two (the 3D mark turning
  slowly where WebGL runs, the flat mark otherwise), round social buttons (LinkedIn and Instagram at the left edge,
  WhatsApp and email together at the right, as the client asked; the middle belongs to the emblem), "CRESCO PRIME" set in the widest heaviest cut across the full
  content width (pure CSS: `12.25cqi` of the footer box, since the name is 8.14 times as wide as its size in this cut; the footer box clips sideways so a fallback font can never widen the page), then a bar with the copyright, Privacy and Terms, and Frisco, Texas.

## Legal pages (2026-11-17)

- `/privacy/` and `/terms/` (`src/components/Legal.astro`), written in plain language for Cresco Prime LLC, hosted
  on Cloudflare Pages, with visitors worldwide and mainly from the US (so the privacy policy covers GDPR/UK rights).
  They describe the site as it is: no forms, analytics or cookies of ours; Cloudflare's logs and possible security
  cookie; the sessionStorage transition note; email, WhatsApp, LinkedIn and Instagram messages.
- Confirmed by the client (2026-11-17): Texas law and Collin County courts; enquiries kept up to 2 years, client
  records up to 7 years; email on Microsoft 365. US$100 cap on liability for the website only (for the lawyer to check).
- The "Draft for review" banner was removed and both pages opened to search engines (in the sitemap, no noindex)
  at the client's request (2026-11-17).

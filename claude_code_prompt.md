# Build: maxwellklapow.com — personal site for Maxwell C. Klapow

## What we're building

A six-page personal site for an Oxford DPhil candidate who also runs an independent consulting practice in digital mental health interventions. The design register is "prestige-tech editorial" — reference sites are Harvard LIL, Fuschia Hoover, Polestar, Notion, Apple. It should read as editorial-first, considered, and confident — not as a standard academic profile or a personal homepage.

## Source of truth

The full design and copy brief is attached as `klapow_site_brief_v2.pdf`. **Read it in full before writing any code.** It contains every page's copy, the developer notes for each page, the design system (colour, typography, grid, motion), and the technical requirements. Treat the brief as authoritative.

Two populated data files are already in `/data/`:
- `publications.json` — 18 peer-reviewed and under-review entries, 5 highlighted for the selected-work section
- `projects.json` — 4 consulting engagement cards for the Consulting page 2×2 grid

## Decisions already locked (do not re-litigate)

**Typography:**
- Display: Instrument Serif (weight 400, Google Fonts source, self-host as WOFF2 in `/assets/fonts/`)
- Body: Inter (weights 400/500/600, self-host)
- Mono: JetBrains Mono (weight 400, self-host)

**Colour palette — exactly four colours, no exceptions:**
- Ink `#0A0A0A` — body text, headings, primary wordmark
- Paper `#F7F6F2` — background
- Cobalt `#1E3FB5` — links, hover, focus, consulting mark
- Hairline `#E4E2DA` — rules, borders
- Derived tones via opacity on ink only (55% for muted metadata, 35% for quiet text). No new hex values.
- No dark mode.

**Consulting mark:** Restrained treatment. The text wordmark "Maxwell C. Klapow" stays at the top of every page, including Consulting. The hand-drawn klapow AND CO. mark appears **only** as a small centred signature at the bottom of the Consulting page (and as the favicon). Ignore the brief's "full" treatment option — we chose restrained.

**Deployment:** Render Static Site, auto-deploying from GitHub `main`. `render.yaml` already exists at repo root — do not modify it without asking.

**URLs:** Files use `.html` extensions on disk (`about.html`, `research.html`). But all nav links and internal links use clean URLs (`/about`, `/research`). Server-level rewrites in `render.yaml` handle the translation. Do not put `.html` in any hrefs.

**Repo name:** `maxwellklapow`.

## Hard technical constraints

- Vanilla HTML, CSS, JavaScript. No framework, no build step, no bundler, no TypeScript.
- **No browser storage APIs** (localStorage, sessionStorage, IndexedDB). None, anywhere.
- Self-host all fonts in `/assets/fonts/` as WOFF2. Use `font-display: swap`. No runtime requests to Google Fonts CDN.
- Mobile-first CSS. Breakpoints: 640, 768, 1024, 1280.
- Inline critical CSS. Defer non-critical JS. Target Lighthouse ≥ 95 on all four categories.
- All motion respects `prefers-reduced-motion: reduce`.
- Accessibility: semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`), skip-to-content link on every page, 2px cobalt focus outline at 4px offset on every interactive element, contrast ≥ 4.5:1 on body and ≥ 3:1 on large headings, meaningful alt text on every image.

## Things the brief forbids (don't add them even if a section feels thin)

- Hero images, photography, logo walls, testimonial carousels
- Gradient backgrounds, drop shadows, parallax, animated statistics
- Emoji, icons beside text
- Rounded corners beyond 2px
- Dark mode toggle

If a section feels visually thin, that's the point — it's the register. Don't compensate.

## Expected file structure

```
/index.html
/about.html
/research.html
/publications.html
/consulting.html
/contact.html
/404.html
/render.yaml          (exists)
/README.md            (exists)
/.gitignore           (exists)
/assets/
  /css/
    tokens.css         (design system: colours, type scale, spacing)
    styles.css         (everything else)
  /js/
    main.js            (nav, shared behaviours)
    motion.js          (hero scroll response, link underlines, card hover)
    publications.js    (renders full list from JSON with filters)
  /fonts/              (self-hosted WOFF2)
/data/
  publications.json   (exists, populated)
  projects.json       (exists, populated)
/img/
  portrait.jpg        [PLACEHOLDER — leave as HTML comment]
  klapow-and-co.svg   [PLACEHOLDER — leave as HTML comment]
  favicon.svg         [PLACEHOLDER — leave as HTML comment]
```

## Build in phases. Pause between phases for review.

### Phase 1 — Scaffold

Create the full directory tree. Build all six HTML pages as stubs with only the shared nav, footer, and page headline — no body content yet. Build `tokens.css` with the full design system (colour tokens, typography scale, spacing rhythm, breakpoints). Set up font loading. Write the nav component with the active-page indicator.

At the end of Phase 1, show the directory tree, `tokens.css`, and one stub HTML page in a preview. Pause before Phase 2.

### Phase 2 — Home page

Build `index.html` in full. This page is the highest risk because the entire design register rides on the typographic hero and its scroll response. Get the hero typography (Instrument Serif at 120px on desktop, line-height 0.95) and the scroll-linked opacity/scale motion right before anything else. Pause before Phase 3.

### Phase 3 — Remaining pages, in this order

1. **About** — two-column layout with sticky meta-rail
2. **Research** — offset-label grid with section labels in the left margin
3. **Publications** — the most complex: numbered selected-work section at top (pulls the 5 `highlighted: true` entries from `publications.json`), filterable full list below (all entries, with year + type + text search filters)
4. **Consulting** — 2×2 project card grid driven by `projects.json`, consulting mark as footer signature only
5. **Contact** — single column, left-aligned, max 560px

### Phase 4 — Polish

Motion refinements, full accessibility audit, Lighthouse audit, `404.html`, meta tags for social sharing (Open Graph, Twitter Card), structured data (JSON-LD Person schema).

## Things to flag rather than guess

- **Placeholders from the brief:** portrait, consulting mark SVG, favicon, Google Scholar URL, ORCID URL, downloadable CV, DOIs on `publications.json` entries. Leave each as a visible HTML comment I can grep for: `<!-- [PLACEHOLDER: portrait — client to supply] -->`.
- **Copy that doesn't render well at the specified type scale.** Flag and propose an adjustment. Don't silently rewrite.
- **Accessibility gaps** you spot while building. Flag them as comments at the top of the file they're in.
- **Anywhere you're tempted to deviate from the brief.** Ask first.

## Start now

Read `klapow_site_brief_v2.pdf`. Then begin Phase 1. Show me the directory tree, `tokens.css`, and one HTML stub in a preview before moving to Phase 2.

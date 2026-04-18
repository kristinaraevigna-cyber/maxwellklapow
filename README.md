# maxwellklapow

Personal site for Maxwell C. Klapow — DPhil candidate in Experimental Psychology at the University of Oxford.

## Stack

Vanilla HTML, CSS, and JavaScript. No framework, no build step. Deployed as a Render Static Site from `main`.

## Local preview

From the repo root:

```
python3 -m http.server 8000
```

Open http://localhost:8000.

## Deployment

Auto-deploys on push to `main`. Infrastructure defined in `render.yaml` at the repo root — security headers, font caching, and the clean-URL rewrites that let `/about` resolve to `/about.html`.

## Structure

```
/              HTML pages
/assets/css    Stylesheets (tokens, styles)
/assets/js     Scripts (motion, publications, main)
/assets/fonts  Self-hosted WOFF2 (Instrument Serif, Inter, JetBrains Mono)
/data          JSON data (publications, projects)
/img           Portrait, consulting mark, favicon
```

---

© Maxwell C. Klapow. All rights reserved.

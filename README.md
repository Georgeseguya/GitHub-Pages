# Greylad

Greylad's public website for pharmaceutics, technology, health, research and writing. The official source is organised as a static website in `dist/`, ready for deployment on Vercel and similar hosting platforms.

## Website

The homepage opens with **“A curious mind. A world of possibilities.”** Disciplines appear in the order **Pharmaceutics, Technology, Health, Research, Writing**; the list is open-ended.

The site includes:

- Responsive navigation and an interactive discipline selector.
- Links and project details for VybaCash, health technology and pharmaceutical research.
- A searchable archive with working category filters and accessible detail dialogs.
- A writing section displaying the owner's supplied, original cover for the published book *Beyond the Goal*, linked to Amazon.
- A roster-based team section with an overview, technology, pharmaceutics and projects tabs.
- Direct email and telephone links, with a copy-email control.

Graphite Grey (`#34363B`), Pearl (`#F6F6F4`) and Silver (`#A8ADB4`) form the website's palette. The Greylad concentric-G is the shared logo.

## Structure

| File | Purpose |
|---|---|
| `dist/index.html` | Public website and page content |
| `dist/styles.css` | Responsive layout and design |
| `dist/app.js` | Interaction logic, archive and optional remote content |
| `dist/content.js` | Editorial archive entries |
| `dist/assets/beyond-the-goal-cover.webp` | Actual book cover provided by the author |
| `dist/spiral-g*.svg` and `dist/favicon.svg` | Branding |
| `dist/admin.html` and `dist/admin.js` | Optional private content editor |
| `dist/config.js` | Optional public backend settings (no credentials included) |
| `supabase/schema.sql` | Optional content-management schema |
| `tests/site-smoke.mjs` | Automated source and content checks |
| `tests/browser_smoke.py` | Headless Chromium UI interaction checks |
| `.github/workflows/site-checks.yml` | GitHub Actions verification |
| `CHECKS.md` | Test record and release verification |

## Run locally

Serve `dist/` with a static server, for example:

```bash
python -m http.server 8000 --directory dist
```

Open `http://localhost:8000/`.

## Test

```bash
node --check dist/app.js
node --check dist/content.js
node --check dist/admin.js
node --test tests/site-smoke.mjs
```

For browser interaction tests, install Python Playwright and use an available Chromium binary:

```bash
python tests/browser_smoke.py
```

The browser test inlines local assets into a temporary page and clicks the actual UI controls at 1440px, 390px and 320px. Results and the test method are documented in `CHECKS.md`.

## Deployment

Import the repository into Vercel, choose Other/static and use `dist` as the output directory. `vercel.json` already sets that path. Connect the company's domain when ready.

The owner content editor can be connected to a separate Supabase project later. Keep privileged keys on the server; do not add a database service-role key to browser files. The public site and book cover work independently of the content editor.

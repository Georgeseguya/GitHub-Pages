# Greylad — Studio website · October 2026

Greylad is a studio website **separate from the founder's personal website**. The homepage places **Pharmaceutics** first, followed by **Research, Writing and Technology**, and uses the shared Graphite Grey (`#34363B`), pearl and silver design system.

## What changed in this edition

- Brand-led homepage with the concentric-G identity, a subtle pointer-responsive emblem and a four-discipline interactive index.
- **Pharmaceutics comes first.** This term refers to formulation and dosage-form science, while the site also accommodates wider pharmaceutical research.
- Three clearly labelled work areas: oral dosage-form research (in progress), VybaCash (live), and health-data tools (concept).
- Searchable research desk with filters, accessible modal details and keyboard interaction.
- Writing shelf with **Beyond the Goal**, a published football book, linked to the Amazon short URL supplied by the owner: https://amzn.eu/d/06k6AIZ5. The site uses an original typographic **illustration**, not an unverified book-cover image. Amazon metadata was not accessible for independent verification from this environment; check the book title against the destination before publishing if the listing differs.
- An unfinished fantasy manuscript listed **without its old project title**.
- Removed the earlier plant-research item from the public editorial list; legacy starter records are filtered when reading optional cloud entries.
- **Meet our team** section includes one professional profile: George Seguya, Founder & Head of Development. It draws on the supplied professional CV: formulation development, technology transfer, GMP, validation, technical investigations, QbD, scientific writing and digital project work. No schools or CV contact references are displayed.
- Public contact: **georgeseguya@yahoo.com** and **+256 777 044 7726**. These are personal details intentionally supplied for the Greylad site, and will be visible and potentially indexed online. They can be replaced with `@greylad.me` addresses later.
- Reworked text to use **we/our** rather than a personal first-person voice. Personal identification is confined to the team section near the bottom.
- Keeps the existing, optional owner-only content editor and its SQL permissions framework; it is **not connected** unless a separate Supabase backend is configured.

## Interactions

1. Desktop and mobile navigation, including Escape-to-close for the mobile menu.
2. A four-tab editorial switchboard with keyboard Up/Down/Left/Right/Home/End controls and a bespoke changing technical illustration.
3. Small pointer-responsive movement on the concentric-G emblem; disabled for reduced-motion preferences.
4. Research archive filter, text search and safe plain-text detail dialogs.
5. Contextual book link, project modal, mail and telephone links, copy-email button and reading-progress indicator.

These are implemented with plain HTML, CSS and JavaScript, without a framework, tracking scripts or external JS dependencies.

## Files

| Path | Purpose |
|---|---|
| `dist/index.html` | Public website |
| `dist/styles.css` | Responsive presentation and interactive components |
| `dist/brand-tokens.css` | Shared Greylad monochrome brand tokens |
| `dist/app.js` | Interactions, research archive and optional public-content loading |
| `dist/content.js` | Curated working notes, published book link and manuscript placeholder |
| `dist/favicon.svg`, `dist/spiral-g-light.svg` | Brand assets |
| `dist/admin.html`, `dist/admin.js` | Owner content editor, gated until backend is configured |
| `dist/config.js` | Public Supabase URL/publishable key (blank by default) |
| `supabase/schema.sql` | Optional, separate owner-and-editor database schema |
| `vercel.json` | Vercel output directory (`dist`) and basic response headers |
| `CHECKS.md` | Validation record and release notes |

## Preview and deployment

- **Standalone review:** Open `dist/index.html` in a browser (or open the supplied standalone interactive preview).
- **Netlify/static upload:** Upload the **contents of `dist/`** as the public root, or drag the deployment ZIP onto a static host.
- **Vercel with Git:** Upload the complete source repository and use the provided `vercel.json` (`outputDirectory: dist`, framework: Other, no build command).
- **Previous hosted previews:** Updating this repository does not automatically overwrite copies hosted elsewhere. For the official website, import this repository into Vercel and deploy from `main`; manage other hosting platforms separately.

## Content management and security

Greylad's content editor is optional. `dist/config.js` ships with blank settings. Until configured, the editor deliberately remains disconnected and the public website displays bundled content. Use a **dedicated** Supabase project, separate from VybaCash, if a live content system is needed. Do not add service-role secrets or privileged database keys to frontend files. Use the included `supabase/schema.sql` and `tests/security-checklist.md` before public use, and verify owner-only access and draft privacy. Public file uploads are public immediately, even if associated with drafts.

Changing a published website does **not** automatically remove previously published copies or files elsewhere. The book link opens an external Amazon page in a new tab; no publication metadata is fetched on the user's device.

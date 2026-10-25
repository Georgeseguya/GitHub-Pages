# Greylad

Greylad presents work across pharmaceutics, health, research, writing and technology. This is the studio website, distinct from the founder's personal website.

## Site structure

The main page includes:

- An open-ended disciplines index, with Health as a separate discipline.
- Selected pharmaceutical research, digital projects and health information systems.
- A searchable research and publications archive.
- The published football book *Beyond the Goal*, linked to its provided Amazon listing, and a fantasy manuscript in development.
- A team roster with Profile, Experience and Projects tabs. The roster is designed to accommodate additional team members.
- Direct contact links and the graphite, pearl and silver identity.

Website content avoids temporary service announcements, numbering of disciplines, and personal descriptions outside the team section. The official company website and personal site are separate properties.

## Published book cover

The website requests the linked listing's Open Graph image through a metadata endpoint at runtime and displays it only when it passes basic portrait-cover checks. If the listing does not expose a suitable image, the website keeps a neutral text treatment rather than substituting a fabricated book cover. An original licensed cover file can be placed in `dist/book-cover.jpg` and referenced locally if available. The original Amazon cover has not yet been independently verified from the shortened URL.

The metadata endpoint is third-party and could change its availability, quotas or cross-origin policy. Visitors' browsers may contact that provider for the listing image. Review or replace this integration when a local cover asset is available.

## Files and development

- `dist/index.html` — website content and structure.
- `dist/styles.css`, `dist/brand-tokens.css` — styling and brand tokens.
- `dist/app.js` — site interactions (keyboard tabs, mobile navigation, filters, dialogs, book metadata).
- `dist/content.js` — bundled editorial entries.
- `dist/admin.html`, `dist/admin.js` — optional editor; accessible at `/admin.html` and gated by separate backend access.
- `dist/config.js` — optional public backend configuration, blank by default.
- `supabase/schema.sql` — optional studio-specific content database schema.
- `vercel.json` — deploy `dist` as the website root.
- `tests/site-smoke.mjs` — source-level checks run with Node.js.
- `.github/workflows/site-checks.yml` — automated checks on changes to the source.

### Test locally

```bash
node --check dist/app.js
node --check dist/admin.js
node --check dist/content.js
node --test tests/site-smoke.mjs
```

The source-level checks validate structure, content constraints, and code syntax. They do not replace browser-level, server-level, or database authorization testing. A browser integration test was attempted during this revision but the testing container blocked browser navigation. See `CHECKS.md` for the precise verification record.

## Deploy

Import the repository into Vercel as a static site. The output directory is `dist` and no build command is required. Connect a custom domain through Vercel's Domains settings after registering it. Domain mailbox settings belong to the chosen email service and can be configured independently of the website records.

The content editor is optional and needs a dedicated configuration separate from any other application. Do not commit privileged backend credentials.

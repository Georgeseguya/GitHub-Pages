# Greylad release checks

## Verification completed

- **JavaScript syntax**: `node --check` passed for `dist/app.js`, `dist/content.js` and `dist/admin.js`.
- **Automated source tests**: 8 / 8 checks passed via Node's built-in test runner. Tests cover the headline, discipline order, book-cover file, interactions, professional and technical profile, contacts, optional backend separation, and copy restrictions.
- **Browser UI tests**: 86 / 86 checks passed in headless Chromium at **1440 × 900**, **390 × 844**, and **320 × 740** using the included browser smoke test.
- **Functional controls**: Verified discipline tabs, keyboard discipline navigation, header and section links, project detail dialogs, Escape and close buttons, archive search and filters, team profile tabs and arrow-key selection, responsive mobile navigation, copy-email feedback, and actual book-cover load.
- **Visual and overflow checks**: Verified zero document horizontal overflow at all three viewport sizes. Page screenshots are saved in the locally generated preview package.
- **Book image**: The exact user-uploaded book cover was compressed from the supplied image into `dist/assets/beyond-the-goal-cover.webp` while retaining its original visual content and proportions. The image is part of the deployment, not remotely fetched at runtime.

## Integration scope

- The browser test inlines local CSS, JavaScript, and image assets into an isolated Chromium page for real click and keyboard tests. This verifies the page's interactions; it is not a test of production hosting or external infrastructure.
- The Amazon destination is the link supplied by the author. External listing content was not changed.
- The optional Supabase editor was not tested with a live database. Follow `tests/security-checklist.md` before activating it.
- The website is committed to GitHub; live production deployment is handled separately.

## Commands

```bash
node --check dist/app.js
node --check dist/content.js
node --check dist/admin.js
node --test tests/site-smoke.mjs
python tests/browser_smoke.py
```

GitHub Actions runs the syntax and Node tests on commits and pull requests targeting `main`.

# Checks — Greylad studio update

See `previews/test_results.json` in the source package for browser-test results.

- HTML loaded with all inline assets in desktop (1440px), mobile (390px) and narrow mobile (320px) headless Chromium tests.
- No JavaScript page errors in tested views.
- No horizontal overflow across the tested viewports.
- Discipline tabs switch content and visible technical illustration, with correct ARIA states.
- Writing filter and search return expected book and manuscript records.
- Detail dialog opens and preserves the supplied Amazon link.
- Mobile navigation opens and closes, updating aria-expanded.
- Exactly one founder name appears in the public page.
- Personal email and phone use the provided values.
- The retired plant manuscript and old fantasy-book title are not visible on the public page.
- No schools on the public page.
- Contact information is public by design; consider changing to domain-specific addresses after configuration.
- No live Supabase content editor, Amazon landing page or previously hosted preview deployment has been integration-tested or changed.

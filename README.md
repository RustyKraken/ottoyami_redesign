# OTTOYAMI

Premium German-language restaurant website, implemented in the existing Node project with pre-rendered HTML, CSS and native JavaScript. There are no production dependencies or client framework bundles.

## Run locally

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173. The dev command builds on startup; after editing templates or CSS, run `npm run build` and refresh. `npm run preview` serves the existing build. Deploy the contents of `dist/` to any static host.

## Project guide

- `src/config.mjs`: verified restaurant information, all prices, review excerpts, and the single `RESERVATION_URL` used by every booking link.
- `src/components.mjs`: reusable container, section, heading, button, text link, image, navigation, footer, menu, price, review and decorative components.
- `src/artwork.mjs`: original SVG artwork: Hokusai-inspired wave with Fuji, red-crowned cranes, painted cherry branch, blossom icon and generated seigaiha patterns (light and dark), and the OTTOYAMI logo in wide, tall and square formats.
- `scripts/build.mjs`: pre-rendered homepage, metadata, Restaurant JSON-LD, favicon, sitemap and robots file.
- `public/styles.css`: shared design tokens, typography, component styles, responsive layouts and motion preferences.
- `public/app.js`: mobile navigation, scroll reveals and accessible native-dialog gallery.
- `docs/`: content provenance, image source URLs and font licenses.

## Verification

`npm run build && npm test` validates the generated markup, assets, navigation targets, consistent booking links and restaurant schema. With the local server running, `npm run test:browser` runs `scripts/browser-check.mjs`. These browser checks cover responsive layout, image loading, menu interaction, gallery navigation, reduced motion and automated WCAG A/AA checks. Set `TEST_BROWSER=msedge` to use Edge or `TEST_URL` to override the local URL. Browser screenshots and reports are stored in ignored `test-results/`.

The production site uses local WebP images and local WOFF2 fonts. No analytics, embedded third-party maps or booking scripts load on the homepage. Reservations open the verified official page containing the Reservly form. Menu, legal and expanded-gallery links point to OTTOYAMI's existing official pages.

Canonical and social-preview URLs target `https://www.ottoyami.at/`; those local image URLs become public when the redesign is deployed on that domain. This task changes the local project and does not deploy over the live restaurant website.

# Validation — 7 October 2026

- Production static build completed successfully.
- HTML/asset checks passed: one H1, unique IDs, valid section anchors, available responsive image variants, shared booking URL and valid Restaurant JSON-LD.
- Headless Chromium (Chrome and Edge) checked widths 375, 390, 430, 768, 1024, 1280, 1440 and 1920 pixels. No horizontal page overflow, broken images or runtime/network errors were detected.
- Mobile menu: opening, Escape dismissal and anchor navigation passed.
- Gallery: opening, next-image keyboard control, Escape dismissal and focus restoration passed.
- Reduced motion: falling petals hidden and crane animation disabled.
- axe-core WCAG 2 A/AA and 2.1 AA audit: zero automated violations. Automated auditing does not replace manual assistive-technology testing.
- Full-page desktop (1440px) and mobile (390px) screenshots were visually inspected. The connected interactive browser was unavailable; headless Chromium supplied browser rendering and interaction validation.
- Review excerpts, official menu, address, hours, prices, booking destination, social accounts and photo provenance were verified against the documented sources.

No Lighthouse score is claimed. No external reservation was submitted. The final static output is in `dist/`; this task did not publish or replace the live official website.

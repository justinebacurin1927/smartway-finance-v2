# Smartway footer photo ribbon — 21 October 2026

## Primary reference and mapping

Jaycee supplied `reference.png`, showing large cream ONCHAIN lettering on a dark violet footer, woven through an arching ribbon of tilted square portraits. Requested: “lets make this on smartway's footnote.” This supplied screenshot is the primary reference; no gallery synthesis or unrelated copy.

- Final panel follows the footer's navigation, contact information and legal disclosures.
- Replace ONCHAIN with SMARTWAY; retain the large, tall, condensed sans composition and generous full-width stage.
- Use warm cream display type and inherit the footer background colour, matching the section above. Jaycee’s later screenshot correction removes the separate lighter navy background.
- Eleven rounded square photos form a raised central arc with cropped cards at the edges; front/back layers weave through the letters.
- Reuse existing Smartway portraits and lifestyle photographs, cropped in CSS. Images are decorative and do not add testimonial claims or named endorsements.
- Mobile retains the complete wordmark with seven cards and a taller proportion. Native scroll gives the ribbon subtle movement; reduced motion and no JavaScript show the static composition.

## Implementation

`dist/footer-showcase.css`, `dist/footer-showcase.js` and `scripts/refine-footer-showcase.cjs`. The helper appends the panel inside all 29 existing footers and adds shared assets without duplicating them. It runs after `scripts/complete-site.cjs` and from the homepage closing refiner. The SVG wordmark uses the existing local Manrope 800 font, with adjusted glyph width for a condensed display. The original logo remains in the footer above. All original footer destinations, copyright, licence, warning and contact information remain intact.

## Verification

Chromium: homepage at 1915×966, 1440×900, 1024×768, 768×1024, 390×844 and 320×667; desktop About and mobile Vehicle Loans. Confirmed visible card counts, colour image loading, complete wordmark fit, no overflow, scroll movement, reduced motion, no-JavaScript access and no browser exceptions. Existing closing verifier passed at 1440, 768, 390 and 320px, including FAQ keyboard/no-JavaScript behavior, article/contact links, original footer logo and disclosures. Its original-logo assertion now targets the information area separately from the decorative ribbon; Playwright can be supplied with `PLAYWRIGHT_MODULE`.

All 29 pages passed unique markup/assets, existing image file, preserved legal/link and idempotent-generation checks. Syntax and whitespace checks passed. Desktop/mobile screenshots visually reviewed against the supplied reference.

Preview: http://localhost:4173/#footer-showcase. Local v2 changes only; no commit, push or deployment.

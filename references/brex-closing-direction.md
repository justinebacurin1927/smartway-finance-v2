# Brex: approved reference implementation

**21 October 2026 contact divider:** Jaycee supplied a stepped checkerboard reference and requested it across the top of the final contact section. Added a full-width white (`#fff`, matching the FAQ background) and matching dark navy (`#06121d`) strip above both columns. Repeating CSS gradients preserve crisp edges without a raster asset or animation; the decoration is hidden from assistive technology. The strip is 72px tall on desktop and 56px on phones. The 54/46 content/photo split and original mobile stacking remain. Six-width checks (320–1915px), no-JavaScript display, original Apply/phone destinations and generator markup parity pass without overflow or browser errors. Captures: `previews/contact-checker-1440.png` and `previews/contact-checker-390.png`.

**21 October 2026 FAQ update:** Jaycee selected the existing RM Internet topic-card FAQ layout for Smartway. A selected mint topic card and compact unselected pills now sit beside a broad navy answer panel, with the original four Smartway questions and answers. This supersedes the FAQ accordion direction below. See `faq-topics/direction.md`; the contact and footer-information direction remains.

**21 October 2026 Finance Hub update:** Jaycee's supplied yellow/purple overlapping-card reference now controls the three homepage article previews. Use text and image sheets that exchange front/back positions on selection; Jaycee’s later palette correction specifies mint text sheets and navy photo frames, with the external control rows and View all articles link removed. This supersedes only the Journal layout below. See `journal-paired-cards/direction.md`; the Brex FAQ, contact and footer-information direction remains.

**21 October 2026 footer update:** Jaycee’s supplied ONCHAIN photo-ribbon reference now controls the final footer artwork, appended after the original information/disclosures on every page. The navigation/legal area retains this restrained styling. The newer oversized sans wordmark supersedes the earlier restriction on a display wordmark. See `footer-portrait-ribbon/direction.md`.

The user explicitly chose Brex with “run it” after a direct live screenshot review. This supersedes the rejected Editorial Layout #2 / Solvance closing direction.

Source: https://www.brex.com/ . Actual browser captures are retained in `live-brex/`. No source artwork ships in `dist`.

Composition lock:
- Final CTA: retain the reference's 54% dark copy / 46% full-height image split. Use compact bold sans, a short paragraph and one cyan application action with a secondary phone text link. Smartway's actual boat image replaces the unrelated Brex app photograph. Mobile stacks copy then the image.
- Journal: centered compact heading, three aligned 16:10 source images, same-baseline titles, complete descriptions and original dates/read times. Open columns without decorative card shells. Mobile uses one column with all copy visible.
- Footer: original Smartway logo at normal scale, grouped navigation, quiet utility links, and legal copy below a rule. Near-black surface. Remove the rejected giant serif wordmark.
- FAQ: extend the compact sans hierarchy to native disclosures on a quiet neutral surface. The Brex support page was not a homepage FAQ reference; no fake search is introduced.

Scope: only the homepage journal, FAQ, CTA and footer. No change to intro, finance, directors portrait, process or secondary pages. Original logo, images, article text, legal warning, member labels and destinations retained. No new runtime or package.

Generator: `scripts/refine-home-ending.cjs`, called by `scripts/enhance-site.cjs`. Shared CSS is now replaced, not layered over the rejected closing styles. Browser verification: `scripts/verify-home-ending.cjs`.

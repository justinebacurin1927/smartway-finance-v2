# About page — existing Smartway design, 22 October 2026

Jaycee supplied six screenshots of `/about` and requested the established site designs across the whole page. Work uses the existing V2 checkout and local preview. Keep the real team, copy, award attribution, membership/licence details, destinations, navigation and footer. No publishing is part of this change.

The homepage is the composition reference: inset navy navigation; Manrope headings with a green serif accent; the existing scattered-word heading assembly; navy/mint/blue geometric story cards with click expansion; aligned benefit cards with original mint/plum vector icons and soft shadows; and Cloud PG v2 sliding-arrow links. The existing local source/assets supply the content and photography, so new gallery research and generated images are unnecessary.

Flow: introduce Smartway and its real directors → explain the mission through three expandable cards → four equally weighted values → readable team overview and balanced individual portraits/bios → compact credentials → checked transition and clear application/contact/FAQ actions. All bios remain visible. The actual group portrait replaces the opening award sidebar; unrelated car/truck stock images are removed from this people/company page.

Behavioral rationale: consistent labeled actions and recognizable controls help users follow the same paths as on the homepage. Core values are grouped equally without numbered rankings. Profile photos preserve their native ratios; text remains selectable and links remain native. Card selection is explicit rather than automatic. Motion communicates entry/selection and never gates reading or navigation.

Evidence boundaries: [W3C WAI page structure](https://www.w3.org/WAI/tutorials/page-structure/) supports semantic headings/regions; [WCAG reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), reviewed during the preceding application work, supports narrow-screen reflow rather than fixed-height clipping. [WCAG animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) informs the reduced-motion path. These are standards/design guidance, not proof of improved conversion. UI-design-index supplies component consistency, native control and restrained CSS motion guidance. Visible progress is not relevant to this information page. A corrective constraint is that aesthetic consistency must not hide biographies or distort real people to fit a card.

Validation targets: all existing narrative paragraphs preserved, one h1, six sections, all photos loaded with correct ratios, four values and credentials, click/keyboard mission selection, shared arrow hover/focus, responsive/no horizontal overflow, reduced motion and no-JavaScript content, preserved Explore/mobile navigation/footer, zero browser exceptions, and idempotent refiner output. Shared heading/card changes also need a focused homepage regression check.

Implementation is complete in `scripts/refine-about-page.cjs`, `dist/about-page.css/js` and the extracted `dist/arrow-action.css`. The existing card controller has an opt-in `data-collapse-all` setting; its homepage behavior remains unchanged. The existing heading controller exposes its initializer for the page's five animated headings. Both site generators invoke the new About refiner after shared navigation and image handling. Every inserted photo includes dimensions, alt text and `draggable="false"`.

Verification passed on 320, 390, 640, 768, 1024, 1440 and 1915px: all original narrative paragraphs, native photo ratios, four values/credentials, card click and keyboard paths, mobile navigation, no overflow, normal/reduced motion, no-JavaScript content, homepage card/heading regression and refiner idempotence. Additional normal-motion checks assembled all five headings on 320, 390 and 1440px and exercised card selection without page errors. Focus rings stay inside the card boundary, so rounded-card clipping cannot hide them. Syntax and whitespace checks passed.

Run `PLAYWRIGHT_MODULE=/home/jaycee/.npm/_npx/e41f203b7505f1fb/node_modules/playwright node scripts/verify-about-page.cjs`. Results: `previews/about-page-verification.json` and `previews/about-page-motion-verification.json`. Desktop/phone captures: `previews/about-page-{hero,mission,values,team,credentials,invitation}-{1440,390}.png`.

Local preview: http://localhost:4173/about/. This work was not deployed.

## Breadcrumb and navbar correction

Jaycee requested removal of the breadcrumb and questioned why the navbar was already a pill at the very top. Removed the breadcrumb markup and styles. Replaced the permanent pill styling with the homepage's `is-scrolled` behavior: full-width navy at scroll position zero, an inset pill after 20px, and full-width again on return. Fixed positioning and a stable body offset prevent the navbar transition from changing the document layout. Mobile menus stay below the current navbar, and reduced motion disables size/position transitions. Updated stylesheet/script versions in the refiner so the correction loads on refresh.

The About verification now checks breadcrumb removal, full-width top state, floating scroll state, restoration at the top and stable document position at all seven widths, alongside the existing page checks.

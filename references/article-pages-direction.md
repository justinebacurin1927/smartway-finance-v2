# Article page renovation — 22 October 2026

Jaycee called this the final refinement and requested renovation of **all article pages**, supplying the Queensland car guide, new/used comparison and credit-score guide screenshots. The project contains five articles; the business/chattel and caravan guides receive the same template. This is a presentation change using captured content, not an update or independent verification of financial statements.

## Reading goal and evidence

Readers need to identify the topic/date, scan the structure, read comfortably, and choose a relevant next step. Flow: return to or enter from Finance Hub → identify the guide → optionally expand its contents and jump to a section → read the retained article → use a tool, contact the team or continue to a related guide. Native links and details must work without JavaScript. No loading or animation state hides the article.

| Evidence | Confidence and limits | Design implication | Check |
| --- | --- | --- | --- |
| [W3C WAI headings](https://www.w3.org/WAI/tutorials/page-structure/headings/) | Strong normative guidance for meaningful structure and in-page navigation; not evidence of conversion improvement. | Keep the original h2/h3 hierarchy, add meaningful native section anchors, and link them from a labelled expandable contents menu. | One h1, complete heading preservation, unique IDs, keyboard/touch jumps and heading clearance beneath the navbar. |
| [W3C WAI content structure](https://www.w3.org/WAI/tutorials/page-structure/content/) | Strong normative guidance for semantic paragraphs, lists, articles and figures. | Retain actual paragraphs/lists and original numbered steps. Do not turn the body into decorative cards or replace it with a summary. | Full source paragraphs, list items, callouts and author text remain in order. |
| [WCAG Technique C20](https://www.w3.org/WAI/WCAG22/Techniques/css/C20) | Advisory/sufficient technique related to text resizing and AAA visual presentation, not a mandatory universal line-length rule. | Corrective finding: the technique supports resizable relative columns; it does not demand exactly 80 characters in every default view. Use a fluid reading column capped in relative units, generous leading and left-aligned text. | Reflow, text enlargement, no horizontal scrolling, and body measure on wide/narrow screens. Usability claims would require reader testing. |

The behavioral principle is visible, recognizable structure rather than asking readers to recall their place. The evidence above constrains implementation; it is not a measured psychological effect in this site's audience. `ui-design-index` routes this surface to editorial/commerce patterns. The category skill is not installed, so the approved Smartway Finance Hub and refreshed Contact/testimonial pages provide the existing visual language: navy/teal type, mint/plum topic icons, rounded pastel panels, and shared arrow actions.

## Shared composition

- Compact split hero: topic, separated calendar/reading metadata and accented title beside the complete 4:3 source photograph. Preserve faces and framing; no enormous full-width crop. A Finance Hub return link remains useful without adding breadcrumbs.
- Expandable “In this guide” navigation before the body; original headings receive stable section anchors.
- Fluid reading column, 18px text with 1.85 leading, clearly differentiated h2/h3, spaced lists and mint source callouts. Original body, author, dates, read times, images/alt text and source disclaimers remain.
- A compact navy help panel and mint calculator/comparison links beside the body. It remains in flow on small/short screens so content is reachable.
- Original related destinations remain; fill short rows to three relevant guides, with consistent image, category, metadata and title cards. Native links, hover lift and reduced-motion support.
- Shared sliding-arrow application/contact actions. No new animation package, remote widget, font or custom JavaScript controller.

Validation covers all five routes and six widths, source-copy/hierarchy preservation, metadata spacing, image ratios/loading/drag prevention, contents expansion and section clearance, native destinations, keyboard/touch, reduced motion, no JavaScript, 200% equivalent reflow, text spacing, contrasts and refiner idempotence. Preserve unrelated in-progress project files and use the existing deployment authorization.

## Verification results

Thirty Chromium route/viewport combinations (five guides × 320, 390, 768, 1024, 1440 and 1915px) pass. Source paragraphs, h2/h3 headings, list items, metadata and original related destinations match. All images load at their native 4:3 ratio, remain non-draggable, and avoid the previous crop. Buttons and metadata fit; no horizontal overflow, page exception or failed local asset was observed.

All 28 contents anchors match their headings. Native keyboard section jumps were checked on every guide for correct focus and clearance beneath the navbar. Touch/keyboard disclosure, card hover, shared-arrow focus/reduced motion, no-JavaScript reading/navigation, short-screen layout, text-spacing/200% equivalent reflow and ten main local destinations pass. Checked text contrast is at least 5.31:1. Refiner idempotence and syntax/whitespace checks pass; the other 24 HTML pages remain unchanged when the article refiner runs. Evidence is under `previews/article-page-*` and `previews/article-pages-*`.

These are implementation/browser checks, not an independent financial fact-check, user study or complete accessibility audit.

Published to https://smartway-finance-version-2.vercel.app/ as deployment `dpl_9c1xsUq9wcoGwpZfhYmTFe4knWvZ`. All five live article HTML files and the new stylesheet match local output exactly. Ten live browser checks (five guides × desktop/mobile) pass image loading, layout, new stylesheet loading and native contents jumps/focus, with no page exceptions. No commit or push.

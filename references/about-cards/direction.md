# About cards and heading motion — 21 October 2026

Jaycee supplied the three-card reference in `primary-reference.png` and asked to apply it to the homepage About story/photo area. They also requested the Finance heading's scattered-word scroll animation for “Smarter finance. Tailored for you.” This supersedes the previous story/photo composition for this homepage block.

The primary reference controls the composition: one wide card at roughly twice the width of each supporting card, equal desktop heights, 24px gaps, modest rounded corners, geometric artwork above the copy, and links aligned near the bottom. Smartway uses navy, mint and blue, with its existing Manrope typography. All geometric patterns are decorative inline SVGs authored for this implementation. No reference company copy or branded artwork is shipped.

The wide card contains Smartway's original introductory paragraph and the About link. The two supporting cards divide the original second paragraph between the 40+ lender panel and personal guidance, linking to Compare and Contact. All original introductory text and the four benefit explanations remain. The supplied team image remains available in the assets; this homepage row now uses the requested card composition.

`scripts/refine-home-about.cjs` owns the markup and `dist/about.css` owns the scoped styles. The existing `dist/brand-story.js` controller initializes both Finance and About headings. Both use reversible scroll progress and horizontal-then-vertical gathering. About additionally eases toward that progress so quick jumps show the assembly. Only the five About heading words move. Copy, links and the small section label remain in place. Scattered words adapt their colour over the cards; final text returns to navy with the original serif accent on “you.”

At 1100px and below, the cards stack in reading order, with one card open at a time. In stacked layouts, words gather over the heading and first card's artwork, above the body text. Resize/font changes remeasure the path. Reduced motion and no JavaScript show the complete heading immediately. Links support native navigation, touch and visible keyboard focus.

Validation: Chromium at 1915, 1440, 1024, 768, 390 and 320px; scatter, intermediate and assembled states; all card content fits; no horizontal overflow or page exceptions. Source paragraphs and four benefits match the saved source content. Finance retains its seven-word animation and working product selection. Reduced motion, live preference changes, keyboard focus, no-JavaScript content, destinations, generator idempotence and syntax/whitespace checks pass. Static previews are in `previews/about-cards-desktop.png` and `previews/about-cards-mobile.png`.

Local preview: http://localhost:4173/#about. No deployment.


## Heading placement correction — 21 October 2026

Jaycee requested “Smarter finance. Tailored for you.” as one line, below the About Smartway Finance label. The header now stacks the label and full-width heading on the same left edge. Removed the forced line break in both homepage and generator markup; five motion anchors and the serif accent remain. Wide layouts use one line; smaller screens wrap naturally. Card content/layout and the existing scroll controller remain unchanged. Refreshed About stylesheet versions in both generators.

Chromium checks passed at nine widths from 320 to 1915px, including a single line above 800px, label/heading alignment, mobile wrapping and no overflow. Existing scatter/intermediate/formed/reversed states, all three cards, no-JavaScript content, exact generator markup, syntax and whitespace checks passed; no browser errors. Review captures/results: `previews/about-heading-*`. Local preview http://localhost:4173/#about.

## Visible heading assembly — 21 October 2026

Jaycee requested animation on the newly positioned one-line heading. About now eases toward its scroll progress with a 160ms response, making the gathering visible after quick scrolls and direct navigation. It waits for the logo intro, replays on an About hash change, and finishes with the section in the upper part of the viewport so native menu/hash entry reaches the complete sentence. The five scatter paths, reversible movement, label, desktop line and serif accent remain. Finance retains its original immediate scroll response. Updated the shared script's cache version in the homepage and all three relevant refiners.

Chromium passed scatter/intermediate/formed/reversed states, visible quick-jump assembly, responsive layout, no overflow and direct About entry at 1915, 1440, 1024, 390 and 320px. Menu navigation, expandable cards, Finance heading/product selection, live reduced-motion changes and no-JavaScript heading also passed, with no browser errors. Syntax and whitespace checks pass. Evidence: `previews/about-heading-motion-*.png` and `previews/about-heading-motion-verification.json`. Local preview only: http://localhost:4173/#about.

## Click-to-expand cards — 21 October 2026

Jaycee requested animated expansion when a card is clicked, with the first navy card expanded by default. On desktop, the selected card takes the wide 2.12fr column and the other two take 1fr each. Explicit matching grid tracks interpolate over 650ms with `cubic-bezier(.22,1,.36,1)`; row height stays stable. Active headings and copy use the wider card's type scale. Selecting another card reverses the prior selection; clicking the active card keeps it open. Native card links still navigate normally.

At 1100px and below, the cards form a vertical accordion. The selected card reveals its full copy and link while the others retain their headings. Semantic buttons expose pressed/expanded state and support Enter, Space, arrow keys, Home and End. Closed details are inert and excluded from the accessibility tree. Reduced motion switches instantly; without JavaScript all paragraphs and links remain visible and the inactive enhancement buttons stay hidden. Existing heading motion receives an `about:layout` event when selection changes.

Markup remains in `scripts/refine-home-about.cjs`; `dist/about-cards.js` owns selection, keyboard controls and responsive state, and `dist/about.css` owns transitions. Both the standalone About helper and homepage generator attach the controller exactly once.

Validated all three selections at 1915, 1440, 1101, 1100, 768, 390 and 320px, including both sides of the layout breakpoint: content fits with no overflow. Normal-motion checks confirm intermediate widths between the initial and final widths, stable row height, rapid selection changes, keyboard controls, native links and the first-card default after reload. Touch, mobile focus order, reduced motion, no-JavaScript content, unique markup, helper idempotence, script syntax and whitespace checks pass with no page exceptions. Review screenshots: `previews/about-cards-expand-1440-0.png`, `previews/about-cards-expand-1440-1.png` and matching 390px views.

## Smartway difference heading motion — 21 October 2026

Jaycee requested the same animation for “Less back and forth. More looking forward.” Added seven semantic word anchors and a third instance of the shared `brand-story.js` controller, scoped to `#benefits`. Its own viewport entry triggers the scatter-and-gather sequence with the About heading's response and finish timing. The existing wording, two-line desktop layout, mobile wrapping, four benefit explanations and Contact link remain. Moving words ignore pointer events and render below protected benefit text/icons. Reduced motion and no JavaScript show the complete static heading.

Checked scatter, intermediate, assembled and reversed states at 1915, 1440, 1024, 768, 390 and 320px: all seven words stay inside the block, finish at their original positions, reverse to their scattered positions, and cause no overflow or page errors. Exact heading text, live motion preference changes, readable benefits, keyboard link focus, existing card selection, no-JavaScript content, helper idempotence and syntax/whitespace checks pass. Captures: `previews/benefit-heading-desktop.png` and `previews/benefit-heading-mobile.png`. Local preview: http://localhost:4173/#benefits.

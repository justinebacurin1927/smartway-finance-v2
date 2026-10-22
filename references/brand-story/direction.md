# Words scattered throughout Finance — 21 October 2026

## Current scope

Jaycee clarified: “can you just scattered the whole words at the whole section not jsut above.” The seven headline words now use the entire Finance section, including the loan-selector/photo panel and lower details/guidance. This supersedes the heading-only scatter. They still assemble into “Finance Made Simple, No Matter Your Goals.” on one line on desktop, with responsive wrapping.

The Finance options eyebrow, introductory paragraph, decorative corner borders and faded SMARTWAY remain removed. The prior instruction to keep finance details visible still applies. The headline adds no separate scene or scroll height. The later, explicitly requested Yuenansichu photo orbit adds a sticky desktop stage and scroll distance of its own; see `../finance-orbit/direction.md`. Scatter coordinates use that visible stage, rather than the entire scroll runway, to preserve this animation.

## Implementation

The seven semantic heading spans animate with native scroll progress. Start anchors cover the full section width/height; measured placement seeks nearby open areas that avoid loan labels, descriptions, the product photo, guidance and other scattered words. Their start positions extend from the upper corners to the lower details. Product content remains above the animation, with matching paper text backgrounds preserving readability as words pass behind it. The headline ignores pointer events so controls remain clickable.

The words converge horizontally and vertically into the original heading; scrolling back restores their scattered positions. Resize/font readiness, section-size changes and loan-scene changes refresh the placement. Reduced motion and disabled JavaScript show the static complete heading and accessible finance content.

Files: `dist/brand-story.css`, `dist/brand-story.js`, `scripts/refine-brand-story.cjs` and the shared call/heading markup in `scripts/enhance-site.cjs`.

## Reference history

`reference-scattered.png` and `reference-formed.png` preserve the user's original motion reference. Earlier photography-strip, standalone-scene, wordmark-overlay and heading-only treatments are superseded. The reference supplies the spatial scatter/assembly idea; the current words and content are Smartway's.

## Verification

Chromium passed at 1915×966, 1440×900, 1024×768, 768×1024, 390×844 and 320×667. Start positions span roughly 90% of the entire section height and avoid product text; all words stay inside section bounds through intermediate/formed/reversed states. Exact final transforms, fully opaque details, no horizontal overflow and unchanged section height verified. All five loan selectors, reduced motion and no-JavaScript content passed; no browser exceptions. Generator idempotence, removed-element checks and syntax/whitespace checks passed. Desktop/mobile screenshots reviewed.

Local preview: http://localhost:4173/ — scroll into Finance from above. No commit, push or deployment.

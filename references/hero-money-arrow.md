# Hero money overlays and Cloud PG arrow — 21 October 2026

Jaycee marked headline crops for overlapping money icons and requested the arrow animation used on the Cloud PG version 2 website for “Find my finance.” Four small banknotes scale with the text: over the Finance letters, below “that,” below “you,” and beside the start of “forward.” The last note tilts diagonally to the right as requested.

The banknote symbol extends the existing mint-fill/plum-stroke SVG family at `dist/assets/icons/smartway-doodles.svg#money`. It is decorative (`aria-hidden`, unfocusable and pointer-transparent); the headline remains actual text. The cleaned photographic background is unchanged.

The requested animation was read from `/home/jaycee/Projects/cloud-pg-v2/src/refinements.css` (the `button--arrow-reveal` rules/keyframes), with markup from `src/templates.mjs`. It uses a circular horizontal arrow moving from the left edge to the right while the label reveals in the same direction over **700 ms**, using `cubic-bezier(.22, 1, .36, 1)`. Adapted the existing pattern to Smartway's white pill/navy circle. Native destination stays `/apply/`. Fine-pointer hover and keyboard focus replay it; reduced motion keeps the label/arrow static. Touch uses the native link without a hover dependency. The Cloud PG source project was read only.

Implementation: `dist/hero-concept.css` and `scripts/refine-hero-art.cjs`, which generates the heading anchors/icons and button markup idempotently. Icon classes are separate from the broad doodle-icon helper, so that helper does not remove them on rebuild. Mobile CTA padding leaves a clear gap between the full label and arrow.

Verified at 1915, 1440, 1024, 768, 390 and 320px: two visible overlays, no overflow, full label clear of the circle, correct 700 ms arrow/text animation, hover replay, keyboard focus and static reduced motion. Touch tap reaches `/apply/`; no-JavaScript icons/link remain available. No page exceptions. SVG validation, unique markup, generator idempotence and syntax/whitespace checks passed. Desktop/mobile screenshots reviewed.

Follow-up: added the two further marked overlays below “you” and at the upper-left of “forward,” with the latter rotated 25 degrees clockwise. A narrower-screen offset keeps that note inside the viewport. Checked all four overlays at 1915, 1440, 1024, 768, 390 and 320px, with no overflow or page exceptions. Heading text and the application link remain available; the hero generator remains idempotent.

Preview: http://localhost:4173/. Local changes only; no commit, push or deployment.

## Mint sweep and Apply online follow-up

Jaycee requested a color change while the arrow slides on the Credit Sense button, then the same sliding-arrow treatment on “Apply online” in the Finance help strip. The shared button now reveals a mint (`#75c8be`) background using the same 700 ms duration and easing as the existing arrow and label. The Apply online button uses the same circular-arrow markup with a navy starting background and white circle, then navy text/arrow on the mint fill. The hero refiner preserves this help-strip action and its `#finance-help` anchor, alongside the existing product-button refiner.

Fine-pointer hover and keyboard focus trigger all three synchronized animations. Reduced motion keeps the arrow/label static and applies the color immediately. Original application/product links remain native links; no JavaScript or dependency was added for the effect.

Verified the hero and help action in idle, mid-slide and completed states, and inspected Credit Sense after its panel entrance finishes. All three animations share 700 ms/easing. At 1915, 1440, 1024, 768, 390 and 320px, all five product labels fit clear of their arrows, the help button fits, and the page has no horizontal overflow. Keyboard focus, reduced motion, disabled-JavaScript link/label/arrow access, unique help anchor and combined refiner idempotence passed, with no page exceptions. Screenshots: `previews/arrow-fill-*`.

## Finance guidance button follow-up

Jaycee requested the sliding-arrow style for the “Compare loan types” / “Understand your credit” row. Both links now share the white pill, navy circle and mint sweep, preserving the original labels, destinations and scales/shield icons. The icons are decorative and sit inside the revealing label. The orbit refiner generates this markup idempotently; dedicated icon classes survive the broader doodle helper's cleanup. A compact 52px height preserves space for the desktop sticky stage. Small screens wrap the links without label/arrow collisions. Direct review: http://localhost:4173/#finance-guidance.

Verified both link destinations, icon/arrow uniqueness, label clearance and no page overflow at 1915, 1440, 1024, 768, 640, 390 and 320px. Hover/focus use the same three 700 ms animations; reduced motion and no-JavaScript/native navigation passed. The stage remains pinned and fully visible at 1915×966, 1440×900, 1366×768 and 1280×800 through scroll states 0/2/4. No page exceptions; combined hero/orbit refiners remain idempotent. Captures: `previews/guidance-buttons-*` and `previews/guidance-button-sliding.png`.

## Product/guidance alignment correction

Jaycee requested alignment between the Credit Sense Explore button and Understand your credit. Removed the product copy’s 3% right inset, used an auto left margin for product buttons in stacked copy, right-justified wrapping guidance links, and matched the single-column tablet footer to the scene’s 580px rail. Guidance arrows use the same horizontal inset as the product arrows (8px desktop / 6px mobile), preserving their compact vertical sizing.

Measured all five product options at 1915, 1440, 1100, 1024, 900, 800, 768, 640, 390 and 320px: right edges and arrow centers differ by less than 0.6px, labels clear the arrows, and no horizontal overflow occurs. Hover color fill, keyboard arrow motion, page-error checks and combined hero/orbit/favicon refiner idempotence passed. Desktop/tablet/mobile screenshots inspected at `previews/aligned-finance-buttons-*`.

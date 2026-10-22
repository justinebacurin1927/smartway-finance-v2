# Smartway difference composition — 21 October 2026

Jaycee supplied `benefit-layout-reference.png` and asked to apply its layout to the four existing Smartway benefits, explicitly excluding the paperclip, tape, notes and invoice artwork.

The current composition uses two broad panels angled slightly apart, with two compact panels overlapping their empty lower edges. Each compact panel aligns with the large panel above it in the same grid column; the pair shares a single row, following Jaycee's clarified alignment request. The lender panel and streamlined-approval panel form the background pair; the personal-goals and credit-profile panels sit in front. All four original headings, explanations and mint/plum SVG icons remain. Quiet paper, pale blue and pale mint surfaces use Smartway's navy typography. No source company names, invoice fields, stickers or handwritten props are shipped.

The layout is scoped to `#benefits` in `dist/about.css`. CSS Grid supplies the overlap and document order remains the original four benefits. At 760px and below, panels stack without rotation or overlap; 320px uses the icons above text for comfortable reading. Normal, reduced-motion and no-JavaScript content use the same readable layout. Card motion uses a small standalone controller, without dependencies.

The existing seven-word heading animation remains. The shared controller now treats the complete panels as protected regions when choosing scattered starting positions. Words gather into the real heading as before; panels and their text remain opaque. Cache versions in the homepage and refiners reference the new layout.

Checked eleven widths, 320–1915px, including both sides of the 760px breakpoint. All four original headings/paragraphs match saved source content; the foreground panels clear the text behind them, content fits within the section, and there is no horizontal overflow or page error. The icon mapping remains bank, clipboard, target and shield. Scatter, intermediate, assembled and reversed heading states, reduced motion, existing About card selection, no-JavaScript content, Contact link keyboard focus, standalone helper idempotence, script syntax and whitespace checks pass.

Review: `previews/benefit-layout-1440.png` and `previews/benefit-layout-390.png`. Local preview: http://localhost:4173/#benefits. No commit, push or deployment.

## Equal sizing and contact icon correction — sizing superseded

Jaycee found the two foreground panels too small and requested the same sizes as the upper two. All four panels now share width, height, text scale, padding and icon scale. Desktop height is 450px, tablet height is 475px; phones use equal-height natural grid rows. The lower panels keep a restrained overlap but sit as a pair rather than a central stack. This supersedes the initial smaller foreground treatment. Added the existing mint/plum chat symbol at 28px beside the heading's native “Let’s talk” contact link. The homepage About generator owns the icon, so the shared icon pass cannot remove or duplicate it.

Eleven-width checks from 320 to 1915px confirm equal widths/heights, equal type scales, unobstructed descriptions, section containment and no overflow/errors. Desktop/mobile heading scatter/formation/reversal, reduced motion, keyboard focus, contact navigation, no-JavaScript content and generator idempotence pass. Current captures: `previews/benefits-equal-1440.png` and `previews/benefits-equal-390.png`.

## Restored compact panels and card animation — current

Jaycee rejected the equal-size treatment and requested the old sizes, then explicitly requested animation on the cards. Restored the two smaller foreground panels and their smaller type/icons. The chat icon beside “Let’s talk” stays.

`dist/benefit-cards.js` observes each panel and plays its entrance once: a 34px upward arrival, subtle scale settling and an 850ms ease, with a 100ms stagger between neighboring panels. Separate translate/scale properties preserve the existing layout angles. Fine-pointer hover lifts a card 7px. Reduced motion skips or cancels the entrance and removes the hover movement; without JavaScript, all text remains visible. The heading controller remeasures protected card bounds after the entrance finishes. Homepage generators include the controller once.

Checked ten widths from 320 to 1915px, including both sides of the stacking breakpoint. Restored size hierarchy, readable content and no horizontal overflow pass. Desktop/mobile entrance, hover, live reduced-motion changes, no-JavaScript visibility, original source copy, unobstructed back-panel descriptions, section containment and heading assembly/reversal pass. Syntax and whitespace checks pass. Current captures: `previews/benefits-motion-1440.png` and `previews/benefits-motion-390.png`. Local preview: http://localhost:4173/#benefits. No commit, push or deployment.


## Foreground alignment correction — 21 October 2026 (centered-stack interpretation superseded)

Jaycee selected the two compact panels and requested alignment. Both now use the same centered grid columns, with their rotation removed, giving identical left/right edges and a 16px gap on desktop/tablet. The broad back panels keep their angles; smaller card dimensions, copy, icons, entrance and hover motion remain. Phone panels already share straight aligned edges. Nine widths from 320 to 1915px pass exact edge alignment, spacing, readability, back-copy clearance, containment and no overflow. Entrance, hover and reduced motion pass without page errors. Current captures: `previews/benefits-aligned-1440.png` and `previews/benefits-aligned-390.png`.


## Align compact panels with the large panels — current

Jaycee clarified “align it with the 2 large card.” The goal panel now sits under the lender panel and the credit-profile panel under the approvals panel, using the same grid columns and widths. Both compact panels share a row and top edge, keeping the restrained overlap at the back panels’ empty lower edges. Their compact type/icons and existing motion remain; phones keep the straight reading stack. This supersedes the centered-stack interpretation. Nine-width checks from 320 to 1915px passed paired column/width alignment, matching foreground top edges, readable back copy, containment and no overflow/page errors. Captures: `previews/benefits-columns-1440.png` and `previews/benefits-columns-390.png`.


## Foreground shadow highlight — 21 October 2026

At Jaycee’s request, strengthened the two compact cards’ soft navy shadows using a broad ambient layer and a tighter contact layer. Hover deepens the shadow alongside the existing lift. Back panels retain their lighter shadows. Desktop/mobile visual checks confirm the foreground emphasis and no horizontal overflow. Alignment, sizing and motion are unchanged. Current captures: `previews/benefits-shadow-1440.png` and `previews/benefits-shadow-390.png`.


## Larger contact CTA — 21 October 2026

Jaycee flagged the small Let’s talk link beside the heading. Replaced its 14px text-link treatment with a 60px pill button, 16px label and 32px mint/plum chat icon. It uses the existing navy circular-arrow/mint-sweep interaction and a subtle border/shadow on white. At 760px and below, the button sits beneath the heading to keep both readable. Native `/contact/` navigation remains. The About generator owns the complete button markup. Seven-width browser checks (320–1915px), hover/keyboard animation, native contact navigation, no-JavaScript visibility, generator idempotence and syntax/whitespace checks passed. Captures: `previews/benefit-contact-1440.png` and `previews/benefit-contact-390.png`.

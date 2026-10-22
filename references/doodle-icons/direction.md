# Smartway v2 icon direction — 21 October 2026

Jaycee supplied `reference.png` and asked to use this kind of icon for Smartway v2. The reference establishes a friendly finance illustration style: mint colour shapes, deep plum strokes, rounded ends, simple silhouettes and small offsets between fill and outline. The icons supply this accent palette within the existing Smartway design.

The shipped illustrations are original SVG drawings, rather than crops from the reference. Palette: mint `#75c8be`, plum `#39063e`. Large icons use a 96 × 96 coordinate system and roughly 5.5-unit strokes; phone/check have simpler 24 × 24 drawings for small controls. There are no image-generation, icon-package or runtime dependencies.

## Mapping

| Location | Illustration |
| --- | --- |
| Vehicle loans | Car |
| Leisure finance | Sailboat |
| Personal loans | Wallet |
| Business finance | Briefcase |
| Credit sense | Coin |
| Broad lender panel | Bank |
| Streamlined applications | Clipboard |
| Personal goals | Target |
| Credit profile | Shield/check |
| Compare guidance | Scales |
| Contact page | Conversation bubble |
| Phone and reassurance controls | Compact phone/check |

The five finance illustrations replace the small selector numbers and recur on the finance hub and their corresponding main product pages. Four illustrations replace the benefit numbers on the homepage. Guidance links and contact receive matching accents. A handshake drawing is available for future use.

## Implementation

- Shared sprite: `dist/assets/icons/smartway-doodles.svg`.
- Responsive sizing: `dist/doodle-icons.css`.
- Idempotent markup pass: `scripts/refine-doodle-icons.cjs`, called last by both content generators.
- Icons are decorative (`aria-hidden`, not focusable); the existing text supplies accessible names. Native SVG works without JavaScript. Existing navigation and media-control symbols retain their compact control forms.
- Preview: http://localhost:4173/#finance and the “Smartway difference” section below About.

The reference and palette choice are specific to Smartway v2. Original branding, content, product photography, finance interactions and section motion continue to supply the page structure.

Follow-up, 21 October 2026: Jaycee pointed at “Call us” and asked about the existing custom icons. That link already referenced the mint/plum phone symbol, but inherited a 16px utility size. Increased this help-strip handset to 28px with a 10px label gap so its fill/outline are clear, retaining the native telephone link and decorative SVG semantics. Other compact phone controls keep their existing sizes.

Checked at 1440, 768, 390 and 320px: 28px custom symbol, native telephone destination, keyboard focus, no overlap or horizontal overflow, and no page exceptions. Stylesheet cache versions are updated in the homepage and icon refiner.

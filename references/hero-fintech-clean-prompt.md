# Clean fintech hero image

Created with the built-in imagegen tool, using the previously enhanced card-handoff image as the edit target. The user specifically requested removal of the cloud and scribbles to retain the fintech-company presentation.

## Final edit prompt

Use case: precise-object-edit.
Asset type: Smartway Finance fintech website hero.
Input image is the EDIT TARGET. Make a targeted cleanup of this same image.
Remove ALL the 2D cartoon decoration: the large blue/purple cloud and scribble at lower left, all white scribbles at upper right, the thin yellow loop at the top, the yellow looping arrow beside the card, the red rays, and yellow sparkle doodles. Fill their former areas seamlessly with the existing photographic blue backdrop, matching the gentle light variation.
Keep the image professional, restrained and suitable for a finance/fintech company. The scene should consist ONLY of the clean blue photographic background and the original two realistic hands passing the blue payment card on the right. No replacement ornaments, icons, glows, coins, charts, circles, patterns, logos, headlines or website text.
Preserve the exact existing hand poses, card shape, colour, tilt, position, overall lighting and realistic skin texture. Preserve the contactless mark and chip on the card as physical card details. Do not change the card numbers. Avoid illustration, plastic skin or 3D cartoon rendering.
Keep left 45% open blue space for the website's separate headline. Preserve this wide 2:1 composition. Enhance photographic clarity gently, no sharpening halos. Requested final export size: 3840 x 1920 pixels. Opaque background.

## Export and integration

The tool returned a 1774 × 887 enhanced image. It was exported with proportional Lanczos resizing to an exact **3840 × 1920 PNG**; this export size is not a claim of native 4K captured detail. Optimized WebP derivatives at 3840 × 1920 and 1920 × 960 are used by the website's responsive image and matching preload.

- Enhanced source: `dist/assets/hero-fintech-clean-enhanced.png`
- Downloadable export: `dist/assets/hero-fintech-clean-3840.png`
- Website assets: `dist/assets/hero-fintech-clean-3840.webp`, `dist/assets/hero-fintech-clean-1920.webp`
- Original supplied JPEG is retained at `dist/assets/hero-card-handoff.jpg`.

Checked the cleaned artwork visually: the cloud, corner scribbles, looping arrows, red rays and yellow sparkle doodles are removed. Realistic hands, card, blue backdrop and space for the headline remain. Browser checks passed at 1915, 1440, 768, 390 and 320px: responsive source loaded, correct 2:1 aspect ratio, no overflow/page exceptions, intro completes and copy stays within the hero. Reduced motion/no JavaScript and generator idempotence also passed.

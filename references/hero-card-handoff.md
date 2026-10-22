# Card-handoff hero — 21 October 2026

**Current image update:** The user subsequently requested resizing/sharpening, then removal of the cloud and scribbles to keep the fintech-company presentation. The active hero uses the enhanced clean 2:1 artwork and responsive WebP exports. See `hero-fintech-clean-prompt.md` for the exact built-in imagegen prompt, native output/export sizes and current paths. The original-image treatment below is retained as history.

Jaycee requested `6253719893811336482.png` for the hero and then confirmed “continue.” Located the matching image as `/home/jaycee/Downloads/6253719893811336482.jpg`: a 1280×720 blue composition with open left space, hands passing a payment card at right, and coloured doodles. Copied the exact supplied JPEG without modifying its pixels to `dist/assets/hero-card-handoff.jpg`.

The composition determines the hero: left-aligned white Smartway headline and existing application action in the image’s open space, image filling the desktop stage with a light contrast overlay. Mobile and portrait tablets stack copy above the artwork so both hands/card remain visible. Smartway branding and the floating navbar remain. The existing logo intro now reveals the image instead of video. Removed the obsolete background playback control and app playback code; preload/fetch priority make the hero image available early.

Desktop framing correction: the image now has a 20% closer crop, anchored toward the card on the right. Tablet/mobile crops are 16%/14% closer. The intro uses the same resting scale so it settles into the close crop without snapping back to the wide composition. Source: Jaycee’s repeated feedback that the hero still felt zoomed out.

Files: `dist/index.html`, `dist/hero-concept.css`, `dist/loader.css`, `dist/app.js`, and `scripts/refine-hero-art.cjs` called at the end of `scripts/enhance-site.cjs`. The helper preserves the choice through later enhancement runs and is idempotent. Existing Finance motion and footer photo ribbon are retained.

Verification: Chromium at 1915×966, 1440×900, 1024×768, 768×1024, 844×390, 390×844 and 320×667. Confirmed correct local image load, no horizontal overflow, headline/CTA inside hero, intro completion and cleared inert state, sticky navbar, mobile menu/Escape, application destination and no page errors. Reduced motion and disabled JavaScript retain image/copy/CTA access. No request for the former corporate hero video. Exact supplied image bytes and generator idempotence checked; syntax/whitespace checks passed. Desktop/mobile/tablet screenshots visually reviewed.

Preview: http://localhost:4173/. Local v2 changes only; no commit, push or deployment. Older corporate-video verification scripts refer to the superseded hero treatment.

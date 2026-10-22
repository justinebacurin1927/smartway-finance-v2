# Supplied fingertip animation in the landing hero — 21 October 2026

Jaycee requested `/home/jaycee/Downloads/Animate_fingertips_with_minimal_…_20261021195533.mp4` for the landing page. The supplied clip shows the card handoff with small fingertip movements against the same open blue background. It replaces the active still-image hero treatment.

The web asset is `dist/assets/hero-fingertips-motion.mp4`: H.264, 1920×1080, 24fps, 7.958 seconds, 1,491,269 bytes. Removed its audio stream and moved MP4 metadata to the beginning for progressive playback. No video re-encoding, resizing or speed change was applied. Source and delivered video-packet hashes both equal `19ddb37f373219b8324e95251a64dc971fe39239c2494a5a165bd2e7d6e257d1` (SHA-256). The original download is untouched.

First-frame WebP posters are available at 1920×1080 and 960×540. Poster and video share the existing responsive hero frame, close crop, positioning, shading and mobile mask. The live headline, four money icons, application CTA, floating navigation and logo intro remain. The video fades in over its matching poster when playback starts.

`scripts/refine-hero-art.cjs` owns idempotent media/control markup and responsive poster preload. `dist/hero-concept.css` handles media layers and the small pause/play button. `dist/hero-video.js` starts muted inline playback, loops natively, pauses offscreen or in a hidden tab, preserves explicit user pause, and supports a native keyboard/touch pause control. Initial reduced motion avoids the MP4 request and shows the poster; live preference changes pause/resume appropriately. No JavaScript or a failed video request leaves the visible poster and native application link available.

Chromium checks at 1915, 1440, 768, 390 and 320px confirm actual advancing playback, inline muted looping, matching poster/video bounds, visible copy/actions and no horizontal overflow or page errors. Verified pause/resume, keyboard control, loop restart, offscreen suspension/resumption, persistent user pause, live and initial reduced motion, failed-source fallback, no-JavaScript content, helper idempotence and unique markup. Syntax/whitespace checks passed. Review captures: `previews/hero-fingertips-desktop.png` and `previews/hero-fingertips-mobile.png`.

Local preview: http://localhost:4173/. No deployment.

## Pause button removal — 22 October 2026

Jaycee requested removal of the visible pause button. This supersedes the earlier pause/play-control direction above. The generated hero no longer includes the button, and its unused styles and JavaScript control handling are removed. Muted looping playback, offscreen/hidden-tab suspension, and the reduced-motion poster remain. Browsers that block autoplay keep the still poster. CSS and controller cache keys were refreshed.

Desktop (1440px) and mobile (390px) Chromium checks passed button removal, advancing muted playback, offscreen pause/resume and no page exceptions. Initial reduced motion avoids the video request; blocked autoplay keeps the poster. Evidence: `previews/hero-no-pause-*`.

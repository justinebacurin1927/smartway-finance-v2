# Finance photo orbit — 21 October 2026

Jaycee requested Yuenansichu Restaurant's signature landing-page animation inside the existing Smartway Finance section, explicitly preserving its existing animation. The supplied placement screenshot is `smartway-placement.png`.

Primary reference: https://yuenansichu-restaurant.vercel.app/ — inspected live in Chromium, including its opening frame and a scrolled state. Local implementation inspected at `/home/jaycee/Projects/Yuenansichu Restaurant/`: `script.js` lines 7–81 and `hero-plates.css` orbit/hero rules. The source project was read without edits. `yuenansichu-start.png` and `yuenansichu-scrolled.png` are review references.

## Fidelity map

| Reference behavior | Smartway adaptation |
| --- | --- |
| Large central circular dish with smaller previous/next dishes at upper/lower right | Original loan photos in the same three-position composition |
| Small next image expands into the main image, current image moves upward/back | Persistent five-image gallery with 750ms position/size/rotation transitions |
| Reverse scrolling reverses the sequence | Five loan states follow native scroll progress in both directions |
| Sticky hero with five scroll chapters | Finance stage stays below the existing navbar on roomy desktop screens |
| Caption updates with the current dish | Existing selected loan, description, index and product destination update together |
| Click smaller dishes to choose | Native previous/next photo buttons synchronize with the existing accessible loan tabs |

Smartway keeps its paper/navy palette, mint/plum illustrations, typography, original loan content, circular brand lettering and other sections. Its main card-handoff hero and logo intro are separate from this request.

## Coordinating the existing headline

The seven-word scattered headline retains its original markup, typography, entry timing and reversible assembly. It forms before the photo scroll sequence starts. Scatter coordinates use the visible Finance stage, so the orbit's added scroll distance does not send words into empty space far below the content. Loan text/icons and the current photo remain protected. The headline's transform belongs exclusively to `brand-story.js`.

On roomy desktop screens, the stage contains the heading, selectors, photograph, description and guidance beneath the navbar. The orbit adds 1.65 viewport heights of native scroll distance. This is an explicitly requested addition to the previous ordinary-flow Finance layout. It replaces the earlier restriction on a pinned photo stage while preserving the headline animation itself.

On smaller/shorter screens the page keeps normal scrolling. The same orbit transitions respond to loan selections, keyboard controls and the smaller photos. Reduced motion removes the pinned scroll distance and transitions; controls remain functional. Without JavaScript, the original five static product scenes remain available. There is no timer or automatic cycling while the page is idle.

## Files and regeneration

- Foreground counters and CTAs (21 October 2026): Jaycee requested that the 01–05 numbers appear in front of the artwork and that Explore links look like the landing page's CTA. The counter sits above photo/ring layers in Smartway navy (`#0b2635`), superseding the initial mint colour and ignores pointer input. Each product destination shares the landing page's white pill, navy arrow and hover/focus reveal animation. Labels and destinations stay the same. Shared CTA styles are in `dist/hero-concept.css`, with markup added idempotently by the orbit helper. Request images: `foreground-number-request.png` and `explore-button-request.png`. Six-width matching-button/counter checks and the nine-view orbit/headline checks passed, including keyboard and reduced motion.
- `dist/assets/finance-orbit-backdrop.svg`: static mint contour field, dot texture and small plum/mint finance doodles, added at Jaycee's request on 21 October 2026. It is a CSS background of the photo gallery only, keeping the original orbit/heading motion and layout independent. Decorative CSS artwork adds no controls or accessibility announcements.
- `dist/finance-orbit.css/js`: photo positions, adaptive sticky stage and scroll coordination.
- `dist/enhance.js`: one shared selection controller handles tabs, thumbnails and scroll requests.
- `dist/brand-story.js`: scopes scatter measurements to the visible stage and refreshes when its layout changes.
- `scripts/refine-finance-orbit.cjs`: idempotent final pass, called by both site generators.
- `scripts/verify-finance-orbit.cjs`: behavior and preservation checks across desktop, tablet, mobile and landscape, plus static fallbacks.

Local preview: http://localhost:4173/#finance. Scroll down into Finance to see headline assembly followed by the orbit. No commit, push or deployment.

## Verification

Chromium passed at 1915×966, 1440×900, 1366×768, 1280×800, 1024×768, 768×1024, 390×844, 320×667 and 844×390. The four roomy desktop views exercise all five scroll states, reverse scrolling and full-stage visibility; real mouse-wheel input advances the selection. All nine views exercise manual loans, keyboard controls, thumbnail selection/focus return and the headline's start/intermediate/formed states. Live reduced-motion changes, no-JavaScript content and no horizontal overflow passed with no page exceptions.

Original hero, Finance heading markup, About/process/journal/FAQs/contact/footer were compared to a pre-change snapshot and remain unchanged. Combined headline/icon/orbit generator idempotence and script syntax/whitespace checks passed. Results and screenshots: `previews/finance-orbit-*`.

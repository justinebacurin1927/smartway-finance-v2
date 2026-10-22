# Smartway Finance redesign

Smartway Finance v2 is live at **https://smartway-finance-version-2.vercel.app/**. The source repository is https://github.com/justinebacurin1927/smartway-finance-v2. Latest verified production deployment, 22 October 2026: `dpl_9c1xsUq9wcoGwpZfhYmTFe4knWvZ`.

The complete 29-page site is checked in under `dist/`: plain HTML, CSS, JavaScript and local assets, with no application build step. Preview with `python3 -m http.server 4173 --directory dist`. `vercel.json` serves this directory with clean URLs. Reusable generation/verification scripts and design references accompany the output. Local preview artifacts, environment files and Vercel account metadata are excluded from Git.

The dated sections below record each refinement and its validation at that point. The current production deployment includes the completed homepage, finance, About, application, tools, FAQ, testimonial, Contact and article refinements. Detailed checks and form behavior are documented in their respective sections.

## Renovated finance and loan pages

All 13 finance routes now use the refreshed Smartway design: the Finance Options overview plus all 12 products, including new/used cars, motorbikes, boats, jet skis, caravans, commercial finance and Credit Sense. Product pages use serif-accent animated headings, balanced photo frames, native structured loan options, six visible benefit cards, expandable FAQs, geometric related-product cards and checked closing sections with shared sliding-arrow actions. The navbar starts full width and contracts to the floating pill after 20px. The overview links to every product.

All original product descriptions, benefits, structures, FAQs and rate disclosures remain. Interest/comparison rates share equal prominence in one primary panel; qualitative specialist labels are no longer captioned “Rate.” The captured rates have not been independently refreshed as part of this design change. All breadcrumbs are removed from all 29 local pages, with a final generator pass keeping them absent.

Implementation: `scripts/refine-loan-pages.cjs`, `scripts/refine-no-breadcrumbs.cjs`, `dist/loan-pages.css/js`, the existing heading engine and shared `dist/arrow-action.css`. Both generators invoke the refiners. Direction: `references/loan-pages-direction.md`. Checks: `scripts/verify-loan-pages.cjs` (set `PLAYWRIGHT_MODULE` to the installed Playwright path); reports/captures: `previews/loan*`. Local preview: http://localhost:4173/finance-options/. Published to https://smartway-finance-version-2.vercel.app/ on 22 October 2026 at Jaycee’s request. All 29 live pages and the four refreshed shared assets match local files exactly; 10 live desktop/mobile finance-page checks passed without browser errors. Reports: `previews/production-loans-http.json` and `previews/production-loans-browser.json`.

## Full About page

`/about/` now carries the established homepage design through all six sections: a full-width navy navbar that contracts into a floating pill on scroll, and a real director portrait, serif-accent headings with the shared scatter/gather motion, expandable geometric mission cards, four aligned icon/value cards, balanced Cara/Alice profile cards, a compact credentials grid and a checkered closing with the shared sliding-arrow actions. The original narrative, individual biographies, award attribution, ACL/ABN and memberships remain. Stock car/truck images were replaced by the existing actual team photography; all three photos keep their native ratios. The shared Explore menu and footer remain.

Implementation: `scripts/refine-about-page.cjs`, `dist/about-page.css/js`, and `dist/arrow-action.css` (the existing homepage button component extracted for reuse). Both generators run the refiner. The shared heading engine exposes a reusable initializer; mission cards opt into collapsing inactive details on all widths. Homepage card behavior remains the same. Reference/behavior mapping: `references/about-page-direction.md`.

Verification: `scripts/verify-about-page.cjs` checks seven widths (320–1915px), retained source copy, loaded photos and ratios, cards/keyboard, mobile navigation, normal/reduced motion, no-JavaScript content, homepage regression and refiner idempotence. Review captures/results: `previews/about-page-*`. Local preview: http://localhost:4173/about/. No deployment was performed for this change.

## V2 application page

The application page keeps Jaycee’s supplied block headline and inset navigation in Smartway navy, cyan, mint and cream. Its form is now native HTML: finance type → purpose → amount → contact details → personal/business details → editable review. Only one step is shown at a time. Once started, the large introduction moves out of the way. The page has no iframe, nested scroller or fixed-height clipping; smaller displays and larger text can scroll normally.

This is a **local design preview**, clearly labelled before any fields. Sending is disabled because the project has no Lend Broker API connection. The current real personal/business Lend applications remain available as explicit external links and as the no-JavaScript fallback. Preview answers are held only in page memory, never sent, saved to browser storage or transferred to the hosted form. API access and a verified server-side integration are needed before enabling submission; the public affiliate links are not API credentials.

Implementation: `dist/apply-page.css/js`, `scripts/application-form.cjs`, `scripts/refine-apply-page.cjs` and the existing generator hooks. Verification: `scripts/verify-apply-page.cjs` (set `PLAYWRIGHT_MODULE` to the installed Playwright module). It exercises both paths at seven widths, field errors, conditional personal-loan purposes, Back/edit retention, native keyboard selection, mobile navigation, no-JavaScript links, refiner idempotence and zero outgoing applications. Reference/evidence mapping: `references/application-page/direction.md`. Preview: http://localhost:4173/apply/.

## Image interactions

All 29 pages disable native image dragging with `draggable="false"`, shared CSS and an image-specific drag handler. The shared script also covers images added during page interactions and blocks image context menus. Image links/card clicks and normal text selection/context menus continue to work. This prevents casual grabbing; image URLs, screenshots and developer tools can still access publicly displayed images.

Implementation: `dist/image-guard.css/js` and `scripts/refine-image-guard.cjs`, run last by both site generators. Local browser checks passed on all 29 pages (500 rendered images), including linked images, dynamically inserted images, card swaps, FAQ selection, logo navigation and no-JavaScript drag prevention. Results: `previews/image-guard-verification.json`.

## Production deployment

Live: https://smartway-finance-version-2.vercel.app/ — latest deployment on 22 October 2026 at Jaycee’s explicit request, to the existing `smartway-finance-version-2` project under `justinebacurin1927s-projects`. Deployment: `dpl_FXwsq5btufmLwHWppJoUwuvYiqGE` (READY, production). This publishes the current `dist`, including the renovated 13 finance routes and breadcrumb removal across all 29 pages. No commit or push.

`vercel.json` serves the existing `dist` output with no build step. The production release contains the current local site, including uncommitted edits. All 29 live HTML pages match their local files byte for byte; 112 linked assets/destinations return HTTP 200. Desktop (1440px) and phone (390px) browser checks passed for article swapping, FAQ topics and matching closing-section backgrounds, with no JavaScript errors or failed local requests. Verification results are in `previews/production-http-verification.json` and `previews/production-browser-verification.json`.

## V2 RM Internet FAQ layout

The homepage FAQ follows the existing RM Internet project: a broad left-aligned navy heading and supporting text, a vertical topic list with an expanded selected card, and a large answer panel on the right. Smartway uses a plain white background, pale mint topic cards, the existing mint/plum icons and navy answers. A handshake icon accompanies the introduction; a chat icon sits beside “Prefer a conversation?”. The four original questions and complete answers remain under About Smartway, Your broker, Our lenders and Loan options. Let’s talk, the phone number and View all FAQs use the shared sliding-arrow pill buttons, retaining their Contact, telephone and FAQ destinations.

Select a topic by click/tap or use Up/Down, Home and End. The selected topic shows its icon and summary, with a short answer transition. Phone/tablet layouts stack topics above the answer. Reduced motion removes the transition; without JavaScript, the same content remains accessible through native dropdowns.

Implementation: `dist/faq-topics.css/js` and `scripts/refine-home-faq.cjs`, used by the closing refiner and both site generators. Reference/mapping: `references/faq-topics/direction.md`. Six-width Chromium checks (320–1915px), all four source answers, responsive geometry, icons, focus/keyboard/touch, motion preferences, Contact navigation and all native fallback dropdowns passed without page exceptions or horizontal overflow. The updated closing verifier passed four widths, and generator idempotence, six script syntax checks and whitespace checks pass. Other homepage sections are unchanged. Captures/results: `previews/faq-topics-final-*` and `previews/faq-topics-verification.json`. Preview: http://localhost:4173/#faqs.

## V2 switchable Finance Hub cards

The three homepage articles use Jaycee's overlapping-sheet reference with mint (`#75c8be`) text sheets and light mint (`#e3f1ed`) photo captions. The photo labels and dates are larger, the card numbers are removed, and only the photo captions use the shared sliding-arrow Read article button; the mint text-sheet buttons are removed. Click/tap a pair to swap front and back sheets. The numbered rows, separate Show photo buttons and View all articles link are removed. Each pair switches independently; full text, dates/read times and photos remain.

Wide desktop uses three pairs, tablet uses two plus a centered third, and phones stack them with gentler tilts. Cards 1 and 3 mirror card 2: their sheet angles, photo offsets and swap motion run in the opposite direction. The 700ms swap eases the sheets apart before exchanging layers. An invisible button covering each image provides keyboard swapping without adding visible controls. Focusing Read article brings the photo sheet forward; reduced motion switches immediately, and no JavaScript keeps the readable mint sheet in front with working links.

Implementation: `dist/journal-cards.css/js`, `scripts/refine-journal-cards.cjs`, the closing refiner and both generator hooks. Source reference and mapping: `references/journal-paired-cards/direction.md`. Preview: http://localhost:4173/#journal.

Seven-width Chromium checks (320–1738px) passed for all three pairs, both card states, complete copy fit, overlap and viewport bounds. Animated pointer swaps, Enter/Space, touch, rapid repeated switching, focus restoration, live reduced motion and no-JavaScript article navigation passed. The existing closing verifier passed at four widths. Source copy/images/metadata and all other homepage sections are preserved; generation is idempotent and script syntax/whitespace checks pass. Review captures/results: `previews/journal-pairs-final-*` and `previews/journal-pairs-verification.json`. The later mint/navy palette and control-removal correction passed four-width checks (320–1440px), all three pointer/keyboard swaps, touch, normal animation, no-JavaScript display and refiner idempotence; captures/results: `previews/journal-brand-palette-*`.

## V2 testimonial heading, colours and ratings

“Real Stories. Real Results.” now uses the shared reversible word-gathering animation, with a mint/plum review icon on the right. The fan keeps its existing arrangement and controls, while six distinct pastel backgrounds follow their client cards. Each card restores the five-star row already present alongside the matching quote in `references/source-site/content.json`; no aggregate rating or third-party review claim is added. Rating labels are accessible, and mobile cards allow room for the complete quotes.

`scripts/refine-home-reviews.cjs` matches ratings by source quote, preserves existing card content and runs at the end of both site generators. Styling is in `dist/reviews.css`, the new reusable icon extends the existing sprite, and the shared heading controller/cache versions include testimonials. Preview: http://localhost:4173/#testimonials.

Chromium passed five widths (320–1440px), all six cards and star rows, complete quote fit, reversible heading motion, icon placement, no horizontal overflow, arrow/dot/keyboard navigation, wraparound, direct entry, live reduced-motion changes and no-JavaScript display. Minimum contrast against all six backgrounds: quote text 9.36:1, small supporting text 4.61:1, stars 5.09:1. Generator idempotence, source-content preservation, SVG parsing and script syntax/whitespace checks pass. Captures/results: `previews/reviews-final-*` and `previews/reviews-verification.json`.

## V2 How it works heading and conversation button

“It starts with a conversation. We take it from there.” now uses the shared, reversible scattered-word gathering animation. It settles before the conversation demo, including quick scrolls and direct `#process` entry. The existing mint/plum conversation symbol appears above the supporting text on a pale mint badge. “Start your own conversation” uses the shared white pill, navy circular arrow and mint sweep on hover or keyboard focus, linking to `/contact/`.

The responsive layout keeps the icon and supporting copy together; reduced motion and disabled JavaScript show the complete heading. `scripts/refine-process-demo.cjs` preserves the markup and the existing demo artwork; shared heading controller cache versions stay synchronized in the other refiners. Preview: http://localhost:4173/#process.

Chromium checks passed at seven widths from 320 to 1915px: scattered words clear the copy/demo, the heading gathers and reverses, the icon sits above its text, the button fits and animates on hover/keyboard focus, and the page has no horizontal overflow. Reduced motion, live preference changes, direct section entry and native contact navigation with/without JavaScript passed with no page errors. Generation is idempotent; script syntax and whitespace checks pass. Captures/results: `previews/process-heading-*` and `previews/process-button-hover-*`.

## V2 Finance photo orbit

The Finance section now uses Yuenansichu Restaurant's signature hero motion: a large circular photo, with smaller previous/next photos at the upper and lower right. On roomy desktop screens, the existing headline assembles first, then the section stays below the navbar while scrolling cycles through all five loans. Loan selection, description, index and destination stay synchronized. Clicking a loan, using the keyboard or selecting a smaller photo also moves the orbit. Smaller screens retain normal page scrolling and the same selectable photo transitions.

The seven-word headline retains its original markup, typography and reversible entry animation. Its scatter field uses the visible stage, independently of the new scroll distance. Reduced motion removes pinning/transitions; no JavaScript shows all five original product scenes. The main card-handoff hero, intro and other sections remain unchanged.

Jaycee's later background request adds a soft mint contour field, fine dots and small finance doodles behind the photo orbit. The original SVG is `dist/assets/finance-orbit-backdrop.svg`, applied as a static gallery background. It adds no layout height or animation. Desktop/mobile review images: `previews/finance-orbit-background-*`.

The 01–05 counters now sit in front of the photos in Smartway navy (`#0b2635`), following Jaycee’s colour correction. All five Explore destinations use the landing page's shared white pill, navy circular arrow and hover/keyboard reveal animation. The shared CTA styles live in `dist/hero-concept.css`; the orbit helper preserves each original label and destination when adding the button markup. Reduced motion keeps the static button appearance. Six-width checks confirm the original landing button's size/style remain unchanged and all five loan buttons match; the nine-view orbit/headline checks also pass. Review artifacts: `previews/finance-foreground-button-*`.

Implementation: `dist/finance-orbit.css/js`, coordinated through `dist/enhance.js` and `dist/brand-story.js`. Both site generators invoke `scripts/refine-finance-orbit.cjs` last. Live reference, screenshots and mapping: `references/finance-orbit/direction.md`. Preview: http://localhost:4173/#finance.

`scripts/verify-finance-orbit.cjs` passed nine viewport sizes from 320 to 1915px, including desktop scroll/reverse/wheel behavior, all loan selections, thumbnail focus return, keyboard controls, the headline's scattered/intermediate/formed states and no overflow. Live motion-preference changes and no-JavaScript content passed with no page exceptions. Original hero/headline markup and other sections were compared with the pre-change snapshot; combined headline/icon/orbit generation is idempotent. Review artifacts: `previews/finance-orbit-*`.

## V2 mint and plum icons

Jaycee's supplied icon sheet sets the new illustration direction: rounded plum strokes, offset mint fills and simple hand-drawn shapes. Original SVG icons now appear in the five finance selectors, four Smartway benefits, finance guidance, finance hub, five main product pages and contact page. Phone/reassurance icons use compact versions. The existing product text supplies accessible names.

The reusable sprite is `dist/assets/icons/smartway-doodles.svg`, with responsive sizing in `dist/doodle-icons.css`. Run `node scripts/refine-doodle-icons.cjs` to reapply; both content generators call this idempotent pass last. Source reference and mapping: `references/doodle-icons/direction.md`. Preview: http://localhost:4173/#finance.

Chromium checks passed at eight widths from 320 to 1915px: all five loan selections and keyboard controls, visible text, responsive sizing and no horizontal overflow. All 29 routes pass shared icon/CSS and mobile checks. Normal motion, marquee controls and no-JavaScript content passed with no page exceptions or failed icon assets. SVG validation, generator idempotence and script syntax/whitespace checks passed. Screenshots and results: `previews/doodle-*`. Local preview only.

## V2 favicon

Browser tabs use a square Smartway symbol rather than the full horizontal wordmark. The SVG uses the original cyan/blue palette on a white rounded badge for light/dark tab visibility. A 32px PNG and multi-size 16/32/48px ICO provide fallbacks. Versioned root-relative links are applied to all 29 pages by `scripts/refine-favicon.cjs`; both page generators retain them.

Verified all 29 page declarations and helper idempotence, HTTP asset types/status, SVG/PNG decoding on the homepage and three nested routes, and ICO sizes. Visually checked 16/32/48/64px icons on light/dark backgrounds: `previews/favicon-sizes.png`.

## V2 navy stats and background-free lender logos

The metrics/award strip has its own full-width Smartway navy background with white statistics and pale-blue supporting copy. The lender band retains the blue gradient sampled from the hero. Original-color logos appear directly on that blue: the white plates are removed, and the entire moving strip uses multiply blending to hide white canvases baked into the artwork. Source logo files remain intact. Responsive gradients follow the desktop crop and brighter tablet/mobile artwork. The hero refiner preserves the separate stats wrapper and stylesheet cache version, including the shared-CTA suffix.

The three stats now occupy equal columns across the full content width, with larger numbers, more generous padding and mint bank/handshake/shield icons from the existing doodle sprite. On desktop the award sits centered underneath. Small screens stack each icon above its number and label; the original satisfaction qualifier stays available to assistive technology. The decorative cyan award line remains removed.

Stats layout checked at 1915, 1440, 1024, 768, 760, 640, 390 and 320px: equal columns fill the content width; all numbers, labels and icons fit; number sizes are 32–56px. No overflow/page exceptions, disabled-JavaScript content and combined refiner idempotence passed. Captures: `previews/roomy-stats-1915.png`, `previews/roomy-stats-390.png` and `previews/roomy-stats-320.png`. Direct preview: http://localhost:4173/#stats.

Checked at 1915, 1440, 768, 390 and 320px: all 26 lender images load, no horizontal page overflow, and the marquee retains pause/play, keyboard and reduced-motion behavior. No page exceptions; combined hero/orbit refiners are idempotent. Desktop/mobile captures: `previews/navy-stats-clear-logos-1915.png` and `previews/navy-stats-clear-logos-390.png`.

## V2 About cards and heading motion

The About heading is one line on desktop, directly below “About Smartway Finance” and aligned with its left edge. Its five words ease from their scattered positions into the heading as About enters view, including quick scrolls and menu jumps. The assembly waits for the logo intro and finishes above the cards. Phones wrap naturally; the serif “you.” remains.

The homepage About story uses Jaycee's three-card reference. The navy introduction is expanded by default; clicking another card smoothly gives it the wide position. At 1100px and below, the cards stack and the selected card opens vertically. Keyboard selection, reduced motion and native links are supported; all copy is available without JavaScript. The original introductory copy, four benefits and scattered-word heading motion remain. Reference, implementation and checks: `references/about-cards/direction.md`. Preview: http://localhost:4173/#about.

“Less back and forth. More looking forward.” also uses the same scroll animation, triggered independently as the Smartway difference block enters view. Its seven words scatter through that block and gather into the existing heading. Benefit details remain readable; reduced motion and no JavaScript show the complete heading. Preview: http://localhost:4173/#benefits.

The four benefits follow Jaycee's supplied overlapping layout: two broad angled back panels and two compact front panels, one beneath each large panel in the same two columns. Cards ease upward into view with a short stagger and lift gently on hover; phones use a straight reading stack. Reduced motion and no JavaScript keep the cards static. “Let’s talk” uses a full-size pill button with the custom mint/plum chat icon and shared arrow animation. Reference and validation: `references/about-cards/benefit-layout.md`.

## V2 hero money icons and CTA motion

Four mint-and-plum banknotes overlap the marked parts of the live headline, including below “you” and a right-tilted note beside “forward.” “Find my finance” uses Cloud PG v2’s 700 ms arrow-circle sweep and matching label reveal on hover/keyboard focus, with static reduced-motion behavior and a native application link. Mobile padding keeps the full label clear of the arrow. The photograph remains clean. Implementation and source mapping: `references/hero-money-arrow.md`.

The shared CTA now adds a mint color fill synchronized with the arrow/label sweep. This applies to the landing action and all five Explore buttons, including Credit Sense. The “Apply online” button immediately below Finance shares the same effect while retaining a navy starting color. Keyboard focus triggers the same treatment; reduced motion shows the completed color without a spatial animation. All labels and native destinations remain intact. Six-width checks (320–1915px), all five product-button layouts, normal/keyboard/reduced-motion states, disabled JavaScript and combined refiner idempotence passed. Captures: `previews/arrow-fill-*`. Direct review: http://localhost:4173/#finance-help.

“Compare loan types” and “Understand your credit” also use this white-pill, sliding-arrow/mint-fill treatment, with their existing scales/shield icons inside the label. Native destinations and the “Finance guidance” navigation label remain. Compact 52px buttons keep the desktop scroll stage within the viewport; they wrap into separate rows on small phones. Seven-width fit/overflow checks, hover/keyboard/reduced-motion/no-JavaScript behavior and combined refiner idempotence passed. Four desktop viewport checks retain pinning and visible guidance through scroll states 0/2/4. Captures: `previews/guidance-buttons-*`. Review: http://localhost:4173/#finance-guidance.

Product CTAs and the rightmost guidance button share a right edge and arrow-center line. Removed the product-copy right inset, right-aligned product CTAs in stacked layouts, and matched the tablet guidance row to the 580px scene rail. All five options align within 0.6px across ten widths from 320 to 1915px; no overflow, hover/focus behavior and combined refiner idempotence passed. Screenshots: `previews/aligned-finance-buttons-*`.

## V2 fingertip video hero

The landing hero now plays Jaycee's supplied fingertip/card animation as a silent loop. The 1920×1080, 24fps video is about eight seconds and 1.49 MB, with its original encoded video preserved. A matching first-frame poster loads immediately. Jaycee requested removal of the pause/play button on 22 October; playback continues automatically, pauses offscreen, and uses the still image for reduced motion or blocked autoplay. The headline, money icons, CTA and logo intro remain. Source, implementation and checks: `references/hero-fingertips-video.md`. Preview: http://localhost:4173/.

## V2 clean fintech hero (earlier still-image treatment)

The card-handoff hero now uses an enhanced, clean blue image with realistic hands and a payment card. Jaycee requested removal of the cloud, scribbles and playful decorations to retain the fintech-company presentation. The final image has no cartoon doodles; the original supplied JPEG is preserved separately. The enhanced artwork is exported at **3840×1920**, with optimized 3840/1920px WebP sources and a matching responsive preload. Original AI output was 1774×887; the 4K-sized export is proportionally resized, not native captured detail.

The desktop retains the closer 20% crop. Mobile/tablet framing is adapted to the new 2:1 aspect ratio while keeping the headline, card and application action visible. The floating navbar and logo intro continue working. Generation and integration use `scripts/refine-hero-art.cjs`, called at the end of the enhancement generator; rerunning it is idempotent. Edit method, exact prompt, asset paths and checks: `references/hero-fintech-clean-prompt.md`. Earlier original-image/video directions below are historical.

Browser checks passed at 1915×958, 1440×900, 768×1024, 390×844 and 320×667: responsive image loaded, correct aspect ratio, no horizontal overflow or page errors, intro completion, headline/CTA inside the hero, reduced-motion/no-JavaScript access and unique preload/markup. Local preview: http://localhost:4173/. Download: http://localhost:4173/assets/hero-fintech-clean-3840.png.

## V2 footer photo ribbon

The “Ready to Get Moving?” contact section also uses the footer background (`#06121d`) so the closing sections share one colour.

A full-width closing panel follows the footer links and disclosures on all 29 pages. Its background inherits the footer colour so both areas form one continuous surface. Oversized cream SMARTWAY lettering is woven through a curved ribbon of 11 tilted photo cards (seven on mobile), following Jaycee's supplied ONCHAIN reference. The cards use existing Smartway portraits and lifestyle imagery, with closer face crops. Native scroll adds subtle movement; reduced motion and disabled JavaScript retain the static composition. No animation library or additional font.

Implementation: `dist/footer-showcase.css`, `dist/footer-showcase.js` and the idempotent `scripts/refine-footer-showcase.cjs`, called by the page generator and homepage closing refiner. Original logo, navigation, contact details, disclosures and legal destinations remain above the artwork. Reference/mapping: `references/footer-portrait-ribbon/direction.md`. Preview: http://localhost:4173/#footer-showcase.

Verified homepage at 1915, 1440, 1024, 768, 390 and 320px, plus desktop About and mobile Vehicle Loans: wordmark fits, photos load in colour, no horizontal overflow or page exceptions, scroll/reduced-motion/no-JavaScript paths work. All 29 pages pass markup/assets/disclosure/link and generator-idempotence checks. Existing closing-page verification passed at four widths, including keyboard FAQs and original footer details.

## V2 Finance headline motion

The seven words of “Finance Made Simple, No Matter Your Goals.” start scattered throughout the **visible Finance stage**: upper corners, beside the loan selector and photo, and near the lower details/guidance. They assemble into the headline on scroll and disperse when scrolling back. Desktop ends on one line; mobile wraps. The headline itself adds no extra scene or layout height; the later photo orbit supplies its own desktop scroll distance. The removed label, paragraph, corner frames and faded SMARTWAY stay absent.

Implementation: `dist/brand-story.css`, `dist/brand-story.js` and `scripts/refine-brand-story.cjs`. The enhancement generator shares the semantic heading markup. Word start positions use the full section bounds and seek nearby open space around actual labels, descriptions, imagery and guidance. Finance controls and image remain above the moving words, with matching paper backgrounds behind text to preserve readability. The headline ignores pointer events. Resize/font readiness and loan-scene changes refresh placement. Reduced motion and disabled JavaScript show the complete static headline.

Chromium passed at 1915×966, 1440×900, 1024×768, 768×1024, 390×844 and 320×667: start positions span roughly 90% of section height, avoid finance text initially, stay within the section, form exactly and reverse, and add no horizontal overflow. Section height remains unchanged. All five selectors, fully opaque details, reduced motion and no-JavaScript access passed; no page exceptions. Generator idempotence and syntax/whitespace checks passed. Scope: `references/brand-story/direction.md`. Local preview: http://localhost:4173/ — scroll into Finance to view the sequence.

## Article pages — 22 October 2026

All five Finance Hub articles now share a Smartway reading layout: a compact navy/teal title beside the complete source photograph, topic icons, clearly separated reading-time/date metadata, native expandable contents, a fluid reading column and mint source-callout panels. A navy help panel, calculator/comparison links, shared sliding-arrow actions and three related-guide cards complete each page. Related cards lift on hover; reduced motion removes the movement. No breadcrumb, new font, remote embed or JavaScript controller is added.

Original titles, summaries, dates, reading times, paragraphs, lists, heading hierarchy, callout content, author text, images/alt text and original related destinations remain. Short related rows are filled to three guides. This is a presentation refresh of captured client content; financial statements were not independently updated.

Implementation: `scripts/refine-article-pages.cjs`, `dist/article-pages.css`, shared `dist/arrow-action.css` and both generator hooks. The stylesheet is scoped to the new main element to override the legacy article styles without affecting other pages. Design/evidence: `references/article-pages-direction.md`.

`node scripts/verify-article-pages.cjs` passes 30 route/viewport combinations (five articles × six widths, 320–1915px), exact source paragraphs/lists/headings/metadata, image loading/ratios/drag prevention, button and metadata fit, native section jumps with keyboard focus and navbar clearance, hover/focus/reduced motion, text-spacing/200% equivalent reflow, touch, short-screen and no-JavaScript behavior. All 28 contents destinations match their section headings, and ten main local destinations return HTTP 200. Checked text contrast is at least 5.31:1. Refiner idempotence, unchanged output for the other 24 pages, script syntax and whitespace checks pass. Evidence: `previews/article-page-*`, `previews/article-pages-*`.

## Contact page — 22 October 2026

The Contact page now has its own Smartway design: a compact navy/teal heading, overlapping mint speech bubbles, three pastel phone/email/location cards, a rounded enquiry panel, and a navy team card with the real Cara/Alice photograph. Source office hours, registrations and contact details remain, alongside FAQ and sliding-arrow application links. The breadcrumb and oversized editorial form layout are removed.

The enquiry keeps the original fields/options and known finance-query prefills. Nearby errors and keyboard focus guide correction; preparing a draft creates a mailto link for the user to review and send in their email app. It does not send a message from the site. Editing invalidates the prepared draft. The original online form and no-JavaScript contact alternatives remain. Nothing is persisted or sent to a new service.

Implementation: `scripts/refine-contact-page.cjs`, `dist/contact-page.css/js`, shared `dist/arrow-action.css` and extended mint/plum icon symbols. Both generators invoke the refiner; the legacy contact handler skips this new page. Rationale and source links: `references/contact-page-direction.md`.

`node scripts/verify-contact-page.cjs` passes six widths (320–1915px), source details/options, labels and 16px/52px controls, validation/focus, encoded drafts and edit/retry, recognized/unknown query strings, touch, keyboard, reduced motion, 200% equivalent reflow, landscape navigation and no-JavaScript access. Local links return 200; no page exceptions or failed local assets. Checked text contrast is at least 5.71:1, placeholders 4.97:1 and input borders 3.35:1. Small-phone button fit, refiner idempotence, syntax and whitespace checks pass. Review artifacts: `previews/contact-page-*`. Set `CONTACT_PREVIEW_URL` to check another deployment.

## Full testimonials page — 22 October 2026

The testimonial route now matches the refreshed inner pages: no breadcrumb, a navy heading with “Real Results.” in dark teal, and a mint review-icon/rating panel. Five original client reviews appear in soft mint, powder-blue, peach, lavender and cream cards, with complete quotes, names, dates, source-backed stars and attributed verification labels. Desktop uses three columns, tablets two and phones one. The closing navy panel includes a handshake icon and shared sliding-arrow Apply now/telephone actions.

Implementation: `scripts/refine-testimonials-page.cjs` and `dist/testimonials-page.css`, with the shared `dist/arrow-action.css`. Both generators apply the refiner. Each rating is checked against the captured source; the displayed 5.0 average comes from those five published reviews. No review submission or external review-platform integration is introduced.

Testimonial cards lift 8px with a soft navy shadow on mouse hover. Touch screens retain the static layout, and reduced-motion settings remove the lift and transition.

Six-width Chromium checks (320–1910px) passed complete source content, ratings, card/button fit and no horizontal overflow or page errors. Hover, keyboard focus, reduced motion, no-JavaScript access, application navigation and landscape menu checks pass. Refiner idempotence and syntax/whitespace checks pass. Review artifacts: `previews/testimonials-page-*`.

## Full FAQ page — 22 October 2026

The FAQ route now matches the refreshed inner pages: no breadcrumb, a left-aligned navy/teal heading, mint/plum chat and clipboard icons, and a readable introduction. Static category links and matching icons lead to five groups containing all 26 original source questions and complete answers. Native disclosures support keyboard and no-JavaScript use; enhancement keeps one answer open in each category. The closing contact area uses a navy card and shared sliding-arrow contact/telephone buttons with their existing destinations.

Implementation: `scripts/refine-faq-page.cjs`, `dist/faq-page.css/js` and the existing `dist/arrow-action.css`, applied by both generators. The old FAQ motion stylesheet/controller is detached from this route to remove competing hero layout rules. Six-width checks (320–1910px) passed source-copy preservation, all disclosures, category navigation, button fit and no page errors or overflow. Keyboard, reduced motion, native fallback and contact navigation are checked separately. Captures: `previews/faq-page-*`.

## Finance Hub article grid — 22 October 2026

The full Finance Hub now uses Jaycee’s ARKO projects layout reference: a category toolbar over three equal image-cover cards, with article numbers, category labels, titles, full summaries, and date/read-action footers. Five source articles form a three-plus-two grid; tablets use two columns and phones one. Smartway’s palette, typography, masthead copy and photographs remain. Mint/plum clipboard/chat icons accompany the heading and matching category icons appear in the filters and cards.

Implementation: `scripts/refine-blog-grid.cjs` and `dist/blog-grid.css`, called by both generators. Existing filters, count announcements and empty-category feedback remain; their native layout animation now handles horizontal as well as vertical movement. All five article destinations, alt text, metadata and summaries remain. Reference/mapping: `references/blog-card-grid/direction.md`. Seven-width layout/filter checks (320–1910px) pass without overflow or page errors. Captures: `previews/blog-grid-*`.

## Calculator refresh — 22 October 2026

The calculator now matches the comparison page: no breadcrumb, a navy heading with “With Ease” in dark teal, and matching calculator/money doodles in mint badges. Four clearly labelled sliders sit beside a navy estimate panel with readable pale text, a larger repayment, aligned breakdown rows and a sliding-arrow Get a free quote button leading to `/apply/`. Phone layouts stack the controls and estimate. Published rates, the full source disclaimer, the existing repayment formula and default inputs remain.

`scripts/refine-calculator-page.cjs` builds semantic initial markup with the existing default estimate. `dist/complete.js` enhances those controls, updates slider fills and the same repayment/breakdown, and announces only the repayment summary. Without JavaScript, controls stay disabled beside the default estimate and an explanatory note; the quote link works. `dist/calculator-page.css` owns the scoped layout, contrast and hover/focus/reduced-motion styles. Both generators apply the refiner.

Six-width Chromium checks (320–1910px) passed default repayment, all four input changes, term/rate/residual totals, layout fit and no page errors. The generation is idempotent. Review captures: `previews/calculator-heading-*` and `previews/calculator-workspace-*`.

## Comparison heading and closing actions — 22 October 2026

The comparison page breadcrumb is removed. Its existing heading and explanation remain, with “Side by Side.” in dark teal (`#167366`) and the existing scales/clipboard doodles in mint badges. The icons sit to the right on wide screens and above the heading on phones. The closing eligibility and telephone links now use white pill buttons with navy circular arrows and the homepage-style mint/arrow sweep on hover and keyboard focus. Their destinations remain `/contact/` and `tel:0755127080`; reduced motion keeps immediate feedback.

Implementation: `scripts/refine-compare-page.cjs` and `dist/compare-page.css`, scoped to Compare and run by both generators. All three original comparison sections remain in place, including the second section used by the comparison controller. Six-width Chromium checks (320–1910px) passed heading/icon/button fit, no overflow, repayment changes and both purpose selectors without page errors. Refiner idempotence and syntax/whitespace checks pass. Captures: `previews/compare-heading-*` and `previews/compare-actions-*`.

## V2 floating navigation

The primary menu is **Finance · About · Contact · Explore**, with **Apply now** as the main action. The first three links retain their homepage sections. Explore groups Compare Loans, Loan Calculator and Finance Hub under Tools & guides; About Us, FAQs and Testimonials appear under About Smartway. Mobile exposes the same destinations in labelled groups without another nested menu. The footer's nine destinations are grouped under Explore Smartway and Tools & resources, with brighter text, 44px minimum clickable rows, arrows and hover/focus feedback. The current page is marked with `aria-current`.

The homepage navbar stays fixed while scrolling. Following the local Yuenansichu Restaurant reference, it changes from expanded transparent navigation into a centered 920px navy pill after 20px of scroll, with a translucent background, rounded border and shadow. Scrolling to the top restores the expanded layout. Smartway's logo and phone link remain. On desktop, the links are centered in the available space between the logo and action controls using a three-column grid.

Shared navigation: `dist/navigation.css`, `dist/nav-explore.js` and `scripts/refine-navigation.cjs`, called by both generators. The desktop Explore disclosure works without JavaScript; its enhancement closes on Escape, outside clicks, focus leaving and mobile resize. Existing mobile handlers retain their close/Escape behaviour. Scroll effect: `dist/hero-concept.css` and `dist/app.js`. Rationale: `references/navigation-direction.md`.

The Explore update passed browser checks at 320, 390, 768, 1001, 1280 and 1440px: menu fit, nine mobile links, navigation to the working calculator, current-page markers, footer target sizes and no horizontal overflow or page exceptions. Static checks cover all 29 pages and all nine footer destinations. Local preview: http://localhost:4173/.

## Refresh intro

The current card-handoff image uses this same intro sequence; references to coastal footage below describe the superseded video treatment.

Every full load or refresh shows the actual Smartway logo centered for 650 ms. The same logo moves and scales into its measured header position over one second while the navy background fades into the coastal video and the existing hero copy settles into place. No session flag suppresses repeats. Skip intro or Escape dismisses it immediately. Reduced motion bypasses the intro; JavaScript disabled leaves content directly accessible. An independent four-second timeout restores access if the loader script fails. Background content stays inert until the overlay leaves. No extra dependencies or video-readiness wait.

The coastal footage sits behind a translucent navy vignette during the intro. A small zoom and blur resolve into the live hero during the logo handoff; the logo shadow settles away as it lands, followed by staggered hero text and controls. All layers finish within the same 1.7-second introduction.

Implementation: `dist/loader.css`, `dist/loader.js` and the intro markup/bootstrap in `dist/index.html`. The existing header logo supplies the final geometry and identity. `references/loader-sources.json` records the earlier gallery research and comparisons with local projects. Gallery artwork is not shipped.

Local preview: `python -m http.server 4173 --directory dist`, then http://localhost:4173/.

Buildless responsive HTML/CSS/JS. Retains the client's full-screen hero composition, navy/cyan branding, pill navigation, finance chips, CTAs and lower metrics. Current hero asset is `dist/assets/coastal-full-motion-loop.mp4`: actual moving footage, including the person, slowed slightly with a half-second dissolve across the loop transition. It is not a frozen cinemagraph. The original generated video has some source warping that this edit does not completely remove.

The section after the hero opens with a continuous full-width marquee with 26 client lender logos. Finance options use a static, image-free light section: a split heading and application link, then five linked cards in a three-over-two desktop layout, two columns on tablets and a single column on phones. Each card has a line icon, product number, description and direct product link. There is no pinned stage, scroll mapping, chapter progress or background image. The client help CTA follows. The marquee retains pause/play, hover/focus pause, and a reduced-motion default.

## Assets and references

- Hero source: `/home/nami/Videos/Man_leaning_against_parked_SUV_20261017222534.mp4`, unchanged. Reproduce the edit with `bash scripts/build-hero-loop.sh INPUT OUTPUT` (configured for this eight-second 1080p source).
- Client logo, lender logos, SVG icons and finance copy: https://swfin.com.au/ and the user's screenshots.
- 40+ lenders, 98% satisfaction, $0 hidden fees and Scott H. testimonial: client site, not independently substantiated.
- Manrope: Google Fonts, bundled locally.
- Primary composition remains the client website. Prior gallery research URLs are under `references/sources.json`; gallery images are not shipped.

## Verification

Chromium desktop/mobile checks cover video play/pause, actual person movement, finance dropdown and Escape, mobile navigation, FAQ disclosures, no horizontal overflow, all lender logos loading, marquee animation and pause/play, desktop three-over-two cards, reduced-motion behavior, and no page exceptions or failed asset requests. Screenshots are local review artifacts.

All 29 captured routes now have local pages. The application page retains the original Lend application embeds. Contact enquiries open an email draft with an explicit preview notice and a link to the original contact form. The latest work is local only; an earlier private Sites snapshot is outdated.

## DCSR feedback reference

The testimonial section follows the local DCSR reference at `/home/nami/Desktop/projects/Apps/dcsr-website/src/App.jsx` (Reviews) and `reference.css`: centered heading, five visible review cards in a tilted fan, elevated active card, circular previous/next controls, six position markers and a source link. Uses six actual Smartway quotes and roles copied from the client homepage. Implementation: `dist/reviews.css` and `dist/reviews.js`; DCSR source is unchanged.

Verified all six slides, next/previous wraparound, direct selection, keyboard arrows, one accessible active review, quote fit, mobile overflow and reduced-motion transitions. No browser page errors. Local review captures: `reviews-desktop.png` and `reviews-mobile.png`.


## Complete site — 18 October 2026

The original site was refreshed before implementation. `references/source-site/content.json` records 29 pages, 42 distinct image URLs, zero page failures and zero asset failures. Original HTML and PDFs are retained. `faqs-expanded.json` contains all 26 answers captured after opening the source disclosures; `compare-public-source.js` supplies the exact business comparison products and maximum terms.

`dist/complete.css` provides the shared responsive design. `scripts/complete-site.cjs` generates the 28 secondary pages from captured semantic content and completes the homepage with the original about copy, team image, three-step process, award, boat image, FAQ answers, full footer, social links, address, licence and disclosures. The approved logo intro, coastal hero and review fan remain. Product cards retain the source descriptions. Navigation and article/product destinations resolve locally.

`dist/complete.js` handles secondary-page navigation, accessible FAQ disclosures, blog categories, both application tabs, repayment estimates (including balloon), and personal/business comparisons. Finance Lease estimates respect its five-year maximum; other source products permit seven years. No enquiry submission or loan application was sent during verification.

To refresh content: `node scripts/capture-site.cjs` (network required), `node scripts/optimize-images.cjs`, then `node scripts/complete-site.cjs` and `node scripts/enhance-site.cjs`. The capture script obtains its own sitemap. Scripts use the existing local gstack parser/image packages; no new site dependency is shipped. Original images remain under `dist/assets/site`; optimized WebP copies serve the page.

The contact page has no local sending backend. Its form explicitly opens a mail draft and provides the live contact-form link. Third-party application availability depends on the original provider. Gallery and local browser captures are review artifacts, not shipped artwork.

Verification artifacts: `previews/verification.json`, `previews/complete-home-desktop.png`, `previews/complete-home-mobile.png`, `previews/complete-about-desktop.png`, and `previews/complete-calculator-desktop.png`.


## Reference refinement and finance feedback

`references/enhancement-sources.json` records nine live visual references. The direction and the user’s rejection of rectangular service cards and arrow links are recorded in `references/enhancement-direction.md`.

The finance section now uses unboxed, large type selectors, organic photographic masks, circular type and a large numerical index. Selection swaps the original image, description and direct product link. Keyboard arrows, Home/End and mobile orientation are supported. With JavaScript disabled, all five options and destinations remain visible. No automatic cycling.

`dist/enhance.css` and `dist/enhance.js` carry the refinement through the original sections and secondary pages; the new finance hub links to captured original articles. Reduced motion bypasses reveals. The existing approved intro remains. Build content first, then run the enhancement script. The enhancement stylesheet has an explicit preview version to avoid stale cached CSS.

Review: http://127.0.0.1:4173/#finance. Finance captures: `previews/finance-editorial-desktop.png`, `previews/finance-editorial-mobile.png`, and `previews/finance-editorial-leisure.png`.


## Process section refinement

The user rejected the generic equal-column process layout. `scripts/enhance-site.cjs` now preserves the three original headings and explanations in an ordered list, arranged on one continuous curved route against navy. The middle station drops below the outer stations; a small native SVG key drawing completes the journey. Mobile uses a connected vertical route. Motion draws the line once on entry, with reduced-motion and no-JavaScript access. Implementation remains scoped to the homepage process section.

Verified at 320, 390, 768, 1440 and 1920 pixels: three source steps present, no horizontal overflow, no page exceptions, reduced motion and no JavaScript supported. Review captures: `previews/process-journey-1440.png` and `previews/process-journey-390.png`.


## About portrait refinement

The homepage About section now follows the people-first sequence of the reviewed Sendlane About reference. Nine alternatives and the composition map are recorded in `references/about-sources.json` and `references/about-direction.md`.

The full, source-labelled Cara Rogers / Alice Blay co-directors portrait replaces the cropped three-person homepage composite. The image renders at its native aspect ratio, without masks, cropping, zoom, rounded clipping or overlays. Names sit below; the lender statistic sits outside. Original company paragraphs and all four benefit explanations remain.

Verified with `node scripts/verify-about.cjs`: 320, 390, 768, 1024, 1440 and 1920px; native image proportions, no text overlapping the photo, no horizontal overflow, all four source benefit explanations, no page exceptions and no-JavaScript visibility. Review at http://127.0.0.1:4173/#about. Captures: `previews/about-portrait-1440.png` and `previews/about-portrait-390.png`.


## Compare, Journal, Testimonials and Contact

The four secondary pages now use purpose-specific editorial layouts generated by `scripts/refine-inner-pages.cjs` (called at the end of the existing enhancement script) and styled in `dist/inner.css`. Nine reviewed references and the composition map are recorded in `references/inner-page-sources.json` and `references/inner-page-direction.md`.

Compare uses one semantic table with shared row labels and two product columns, including on mobile. The source products, rates, features and term limits remain; the estimate's midpoint method is explicit. Personal/business selection and the sliders update the ledger. Enquiry links prefill the original contact fields and message.

The Finance Hub uses a publication masthead and indexed original articles. Categories announce counts, including the empty category. Testimonials show the five exact source quotes as an open reading sequence, preserving dates and names; the rating and verification labels are attributed to the source website. Contact uses open underline fields, readable hours, full directors portrait and actual contact details. The email-draft limitation remains visible, and the action is labelled “Prepare email enquiry.” Without JavaScript, contact methods and a live-form link replace the local form.

Focused verification: `node scripts/verify-inner-pages.cjs`. Review artifacts: `previews/*-edition-1440.png`, `previews/*-edition-390.png`, `previews/inner-page-verification.json`. No live enquiry or application is sent by verification.

### Inner-page motion

Compare keeps the table and repayment elements mounted while inputs change. A native requestAnimationFrame tween counts monthly repayments and the amount output over 420ms, sharing one timestamp between both products. Rapid changes cancel the previous count and continue from its displayed value. Changed details reveal in place; purpose switches stagger the product headings and features. The slider track follows the actual input, and keyboard focus stays on the control. Accessible figure labels and comparison status reflect the target values immediately.

The four refined pages also use native Web Animations for heading/scroll reveals, journal category layout changes, and restrained hover/focus feedback. No animation dependency was added. Reduced motion disables transitions and counting, including when the preference changes during an animation. Content is never hidden while waiting for an entrance animation.

Run `node scripts/verify-inner-motion.cjs` for interruption, intermediate/final values, stable DOM/focus, keyboard, lease term cap, live reduced-motion switching, journal transitions and mobile overflow. The existing `verify-inner-pages.cjs` covers calculation/content/form regressions with reduced motion.


## Homepage closing sequence

The user rejected the remaining generic finance hub, FAQs, banner and footer. `scripts/refine-home-ending.cjs` runs after the existing generator for the FAQs, contact and footer; the Finance Hub layout is now owned by `scripts/enhance-site.cjs`. `dist/closing.css` supplies a staggered three-story publication spread, larger numbered native FAQ disclosures, an oversized contact composition with a separate original boat photograph, and a warm-paper footer with a large wordmark. Every original footer destination, credit/licence detail and warning remains. All three article descriptions remain visible on mobile.

Reviewed against the previously inspected Editorial Layout #2 reference recorded in `references/inner-page-direction.md`; no new gallery assets or dependencies shipped. Existing finance, directors portrait, process, intro and inner-page layouts remain as they were.

Verified at 1440, 768, 390 and 320px: no horizontal overflow or page exceptions; four FAQs open and close; three original article destinations, disclosures and contact links remain. Inspected desktop/mobile captures under `previews/closing-*.png`, corrected the oversized footer wordmark to fit. Focused browser check: `scripts/verify-home-ending.cjs`. Review: http://127.0.0.1:4173/?v=publication#journal.


### Finance Hub layout revision

The homepage journal now follows the reviewed Vero Insights reference: a generous masthead, one broad lead image beside the article copy, then two supporting image-led stories below. It preserves all three original titles, summaries, image alt text and destinations, and adds their existing dates/read times. Images render at their full native proportions. Summaries remain visible at every width. The coastal video file and hero HTML were checked unchanged.

References and decisions: `references/journal-layout-sources.json` and `references/journal-layout-direction.md`. The duplicate journal writer was removed from `scripts/refine-home-ending.cjs` so it cannot overwrite this composition during a rebuild. Verification: `node scripts/verify-journal.cjs` at 1720, 1440, 768, 390 and 320px, with original image ratios, readable summaries, article routes, no JavaScript and video source checks. Screenshots and report: `previews/journal-spread-*`.

## Brex closing reference — approved replacement

The user approved the direct live Brex screenshot reference with “run it.” The homepage journal, FAQ, CTA and footer now use that compact sans hierarchy, aligned original article images, a 54/46 dark copy/image CTA and a restrained dark footer with the original Smartway logo. This supersedes the previous oversized serif/staggered closing design. Full original descriptions, article metadata, disclosures and link destinations remain.

Evidence and mapping: `references/brex-closing-direction.md` and `references/live-brex/`. Only Smartway assets ship. Implementation: `scripts/refine-home-ending.cjs` and `dist/closing.css`. Verified at 1440, 768, 390 and 320px, including FAQ keyboard/no-JavaScript use, article/apply/phone links, original logo and legal warnings. Review captures: `previews/brex-*.png`.

The final contact section also has Jaycee’s supplied stepped checkerboard divider across its top, in white to match the FAQ background and matching dark navy. It spans the text/photo columns and scales down on phones. Six-width layout checks, no-JavaScript visibility and generator parity pass; captures: `previews/contact-checker-1440.png` and `previews/contact-checker-390.png`.

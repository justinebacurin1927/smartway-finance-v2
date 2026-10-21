# Smartway Finance redesign

## Refresh intro

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

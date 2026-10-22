# Finance Hub: switchable text and image sheets

Primary reference: Jaycee's supplied yellow/purple VOLK GLOBAL composition, retained as `reference.png` on 21 October 2026. It replaces the earlier Brex open-column article layout and older Vero editorial layout for these three homepage stories.

The reference controls the two overlapping rectangular sheets, sharp corners, opposing rotations and offset back sheet. The current palette uses Smartway mint (`#75c8be`) text sheets and light mint (`#e3f1ed`) photo captions, following Jaycee’s rejection of the navy caption background. Each story keeps its original category, title, description, date/read time, photograph and article destination. The caption panel is half the photograph’s height (one-third of the complete photo card). The image fills the photo card’s top and side edges. Only the photo caption uses the shared white pill Read article button with a navy circular arrow and mint sliding fill; Jaycee’s latest screenshot request removes that button from all mint text sheets. Card numbers are removed. The site header and section heading remain in the existing Smartway design. Reference branding and text do not ship in the page.

Three independent pairs sit across a wide desktop, two plus a centered third on tablets, and one column on phones. Cards 1 and 3 mirror card 2: their front sheets lean right and back sheets lean left/lower-left, while the middle front sheet leans left with its back sheet lower-right. Smaller screens use gentler angles so the sheets and full copy fit within the viewport. All pairs retain the same source article destinations, The separate View all articles link and numbered control rows were removed at Jaycee’s screenshot request.

Clicking or tapping a pair switches the sheets; Read article remains a navigation link. A transparent native button covers the image area to provide keyboard swapping and report the selected state, leaving the caption link directly clickable. There are no separate visible swap buttons. Sheets ease apart, exchange layers, and settle into the opposite positions over 700ms. Each pair changes independently. This is user-controlled switching, with no timer.

Focusing the remaining photo-caption reading link brings its sheet to the front. Without JavaScript, keyboard focus raises that photo sheet above the text. Reduced motion switches immediately and cancels an in-progress swap. Without JavaScript, mint copy stays in front, images remain behind, the photo button stays hidden and article links still work.

Implementation: `dist/journal-cards.css/js` and `scripts/refine-journal-cards.cjs`. The existing closing refiner uses its markup; both site generators invoke the idempotent final pass. Original source photography and complete article text are retained. No new package or generated image is needed.

Preview: http://localhost:4173/#journal.

## Light captions, larger text and article buttons — current

Jaycee requested a lighter replacement for the navy photo panel, larger text, no card numbers and sliding-arrow Read article buttons. Photo category labels are now 18px and dates/read times 14px; copy-sheet metadata also grows to 14px. The photo-caption article links use the existing shared arrow/label/mint-sweep animation in 52px buttons. The category and number row becomes a single category label. Cards allow enough height for the larger type and button while preserving the two-thirds image/one-third caption ratio.

Eight-width checks (320–1738px) passed caption/button fit, larger text, number removal, both links per story and no overflow. Hover animation, keyboard sheet selection, reduced motion, native article navigation, no-JavaScript reading and generator parity pass without page errors. Captures: `previews/journal-mint-actions-photo-1440.png` and `previews/journal-mint-actions-photo-390.png`.


## Alternating direction — 21 October 2026

Jaycee requested cards 1 and 3 face the opposite way to card 2. A per-deck CSS direction mirrors their sheet rotations, horizontal photo offset and padding. Wide-screen front angles are +9° / −9° / +9°, with opposite 12° back angles; phones use the existing gentler 6°/7° angles. Both text-front and photo-front states retain that alternating layout. The 700ms swap now mirrors its separation direction for the outer cards too. Text, photography, colours and article destinations remain.

Seven-width angle/bounds checks (320–1738px) passed; the latest photo-panel markup also passed at 320, 390, 768 and 1440px in both states. Normal animation direction, keyboard swapping, live reduced motion, no-JavaScript article access, generator idempotence and syntax/whitespace checks pass. Current captures: `previews/journal-alternating-1440.png` and `previews/journal-alternating-390.png`.

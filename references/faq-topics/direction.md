# Homepage FAQ: RM Internet topic cards

Primary reference: Jaycee’s supplied RM Internet FAQ screenshot, retained as `reference.png`. Original implementation inspected in `/home/jaycee/Projects/rm-internet-website/src/App.jsx` (`Questions`) and `src/index.css` (FAQ styles) on 21 October 2026. The RM Internet files were read only.

This replaces the earlier Brex homepage accordion layout. The source supplies the split introduction, faint square grid, narrow column of topic buttons, large selected topic card, compact unselected pills, wider rounded answer panel and a short answer-entry transition. The selected topic has an icon above its label and a one-line supporting summary. The answer retains its question as a heading, complete body and contact action.

Smartway adaptation:

- Use a plain white section background without the reference grid. The light squares in the checkerboard divider below also use white.

- Keep “Got Questions? We’ve Got Answers.” and the four existing source questions/answers from `references/source-site/faqs-expanded.json`.
- Use About Smartway, Your broker, Our lenders and Loan options for the selectors; their full question labels remain available to assistive technology.
- Use Smartway navy (`#0b2635`) for the heading and answer, pale mint for the selected topic and the existing mint/plum chat, handshake, bank and car symbols. The second heading line now uses navy following Jaycee’s colour correction.
- Use the shared white-pill, navy circular arrow and mint sweep for Let’s talk inside each answer, plus the telephone and View all FAQs actions below. Preserve `/contact/`, `tel:0755127080` and `/faqs/` destinations.
- Add a handshake symbol above the introductory supporting text and a chat symbol beside “Prefer a conversation?”, reusing the existing icon sprite.
- Stack the introduction and then topics/answer at 800px and below. Cards use natural height when content needs more room.

Behavior uses linked tabs and panels, a single selected topic and a single visible answer. Click/tap selects; Up/Down wrap through topics; Home/End select the first/last. Tab moves from the selected topic to its answer. Selection stays focused on the chosen topic. The 300ms answer animation is disabled by reduced motion. Original native `details`/`summary` markup remains the fallback when JavaScript is unavailable; hidden enhancement controls never replace the source content in that state.

Implementation: `dist/faq-topics.css/js`, `scripts/refine-home-faq.cjs`, closing refiner and both generator hooks. The helper is idempotent. Existing FAQ-route styling/controllers remain scoped to their separate full FAQ page.

Verification: all four answers match the source at 1915, 1440, 1024, 768, 390 and 320px, with no clipped content or horizontal overflow. Selected icon/summary, tab/panel associations, focus, keyboard wrapping, touch, normal/reduced motion, Contact navigation and all four no-JavaScript dropdowns pass. Existing closing checks pass at four widths. Other homepage sections are preserved exactly. Captures/results: `previews/faq-topics-final-*`, `previews/faq-topics-verification.json` and `previews/closing-verification.json`.

Local preview: http://localhost:4173/#faqs. No commit, push or deployment was performed for this change.

## Heading, action and supporting-icon corrections — 21 October 2026

Jaycee requested a new colour for “We’ve Got Answers.”, the shared sliding-arrow animation on Let’s talk, matching buttons for the telephone and View all FAQs links, and icons alongside both supporting text areas. Both heading lines now use Smartway navy. All four answer-panel contact actions and the two support actions reuse the existing 56px shared CTA, including its hover/focus animation and reduced-motion path. Added a 48px handshake inside a 64px pale mint badge above the introduction and a 42px chat inside a 56px badge beside the conversation prompt. These decorative symbols do not change the text or accessible link names.

Eight-width checks from 320 to 1915px passed heading colour, both icons, button fit, all four original questions/answers and no overflow. All three action types animate correctly; keyboard topic selection, focus-visible actions, Contact/FAQ navigation, telephone destination, reduced motion, four native no-JavaScript disclosures and refiner idempotence pass without page exceptions. Captures: `previews/faq-actions-icons-1440.png` and `previews/faq-actions-icons-390.png`.

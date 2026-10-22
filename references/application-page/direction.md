# Smartway application page — 22 October 2026

Jaycee supplied the OWO block headline/inset navbar references, then rejected the scrolling Lend iframe. The native flow replaces that iframe entirely. The supplied screenshots are retained beside this note. Scope: local `/apply/` only; no deployment or real application submission.

The primary reference still controls the introduction: three closely spaced rows of oversized rounded word tiles on a dark background, a square arrow tile and an inset compact navbar. Smartway uses cyan, mint, cream and pale mint with navy text. The shared Explore/mobile navigation, existing logo and normal footer remain. Once the applicant starts, the introduction and footer move out of the way to focus the workspace on the current question.

## Behavioral goal and flow

Show a small, understandable group of controls at each stage, with no embedded scrollbar or large blank provider panel. Flow: finance type → purpose → amount/timing → contact → personal/business details → review. Feedback appears beside invalid fields and in a summary. Back and review Edit retain entered values. All personal-loan purposes remain available in a conditional selector; choosing a vehicle removes that selector from validation. Business controls are disabled on the personal path and vice versa. No auto-advance, timeout, page reload or browser-storage persistence.

The visual route is `ui-design-index` → design-system/form primitives: native radio choices, labeled field groups, a step indicator and editable review. The category skill file referenced by the router is not installed; the available router's semantic-control, CSS-motion and reduced-motion guidance is applied directly. The existing supplied composition remains the design reference; no new gallery exploration was requested.

## Evidence ledger and concrete decisions

| Basis | Source and boundary | Decision | Validation |
|---|---|---|---|
| Logical grouping and external progress — strong standards guidance | [W3C WAI multi-page forms](https://www.w3.org/WAI/tutorials/forms/multi-page/). Accessibility guidance for long forms, not an experiment demonstrating conversion lift. | Six named steps, current-step semantics, page-title progress, no forced timeout, retained answers. | Exercise each stage and keyboard path; check focus and current-step indicator. |
| Error recovery — strong standards guidance | [W3C WAI user notifications](https://www.w3.org/WAI/tutorials/forms/notifications/). Concise field-level and overall feedback; product-specific wording still needs user testing. | Validate on Continue, focus the first invalid field, explain recovery, clear stale errors on edits. | Invalid purpose, amount, email, phone, postcode, ABN and future business date. |
| Correction: eliminating every scrollbar is not the goal — strong standards guidance | [WCAG reflow explanation](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). Vertical reflow at 320 CSS pixels is expected; fixed-height clipping would sacrifice access. | Remove iframe/nested scrolling; preserve ordinary document scrolling for phones, short windows and larger text. No fixed-height form or body scroll lock. | Seven widths, one visible stage, no horizontal overflow or nested scroller; larger-text check. |

These decisions are expected to reduce the observed scrolling friction. No usability study, completion-rate claim or full WCAG conformance claim is implied.

## Sending boundary

The existing form was a cross-origin Lend-hosted page, not a custom API integration. The project contains public affiliate links but no Lend Broker API credentials or application backend. Jaycee acknowledged the distinction after it was explained.

The new native form is explicitly a design preview from the first step. Its final action stays disabled. Answers remain in page memory; no POST, localStorage, analytics payload, fake success or implicit lender forwarding occurs. The review offers an explicit link to the matching existing hosted Lend form and says preview answers will not transfer. Without JavaScript, those two hosted choices remain usable. Direct URLs preserve the original affiliate/broker/type settings and supported colours, with the obsolete iframe flag removed.

[Official Lend Broker API documentation](https://broker-api-docs.lend.com.au/api/) identifies consumer/commercial lead endpoints and separate live/sandbox credentials. A future verified server-side integration must keep secrets out of browser assets, match the provider's actual authentication, map consumer purposes and commercial industry/purpose picklists, capture any additionally required commercial fields, handle validation/transport failures and duplicate attempts, and show success only after acceptance. The current preview is an initial finance-request design, not a complete credit assessment. API configuration and live submission testing remain outstanding.

## Implementation and verification

`scripts/application-form.cjs` owns the native markup. `scripts/refine-apply-page.cjs` retains the hero/header, provider fallback links and generator integration. `dist/apply-page.js` owns branch state, validation, focus and review; `dist/apply-page.css` owns responsive presentation and CTA/step motion. Two additional motorcycle/caravan symbols extend the existing Smartway mint/plum vector sprite. The legacy shared application controller continues to skip this marked flow.

Run `scripts/verify-apply-page.cjs` with `PLAYWRIGHT_MODULE` pointing to the installed module. It covers seven widths (320–1915px), all six stages on both finance paths, validation, conditional purposes, Back/review edits, disabled unconnected sending, zero provider loads/POSTs, native keyboard/mobile navigation, no-JavaScript links and refiner idempotence. Captures: `previews/apply-native-*`. Machine-readable results: `previews/apply-page-verification.json`.

Review locally: http://localhost:4173/apply/.

Final checks passed on all seven widths for both paths, with zero page errors, application POSTs or provider loads. Additional checks confirmed the sliding-arrow fill on pointer hover and keyboard focus, 220ms step transitions, static reduced-motion behavior, and enlarged question/option text at 320px without horizontal overflow. Motion results: `previews/apply-motion-verification.json`. These are focused browser checks, not a full accessibility audit.

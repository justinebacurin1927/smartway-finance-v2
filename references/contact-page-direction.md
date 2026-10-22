# Contact page refresh — 22 October 2026

Jaycee requested an original Smartway design for `/contact`, replacing the oversized editorial heading and underline-only form. Use the existing navy, mint, teal and plum, Manrope, rounded panels, mint/plum icons and shared sliding-arrow buttons. The approved inner pages and homepage supply the visual language; no external gallery composition is being copied. `ui-design-index` routes this to marketing/landing patterns. Its suggested category skill is not installed, so the established site components supply the concrete patterns: compact split heading, quick contact links, and a form beside a team/help panel.

## Behavior and flow

People arrive to ask a question, discuss a finance need, phone the team or find the office. Keep phone/email/location visible before the enquiry fields. Flow: choose a contact method → provide contact details → optionally describe finance needs → prepare a draft → open an email app to review/send. Empty or invalid required fields get nearby text errors and focus moves to the first error. Preparing a draft does not claim that a message was sent. Users retain their entries, can edit and prepare again, or follow the original live contact-form link if they have no email app. No data is persisted, logged or submitted to a new service.

## Evidence ledger

| Evidence | Population/task and confidence | Implication and limits | What to check |
| --- | --- | --- | --- |
| [W3C WAI: labeling controls](https://www.w3.org/WAI/tutorials/forms/labels/) | Accessibility guidance for web forms; strong normative support, not a measured conversion claim. | Persistent, explicitly associated labels support identifying and reviewing fields. Labels remain above the inputs. | Every input/select/textarea has a matching label and clear focus state. |
| [W3C WAI: instructions](https://www.w3.org/WAI/tutorials/forms/instructions/) | Web-form instruction and assistive-technology guidance; strong normative support. | Corrective finding: placeholders disappear and cannot replace labels; screen-reader forms mode can miss detached instructions. Mark optional fields in labels, explain the email handoff before the form and associate relevant instructions. | Review filled inputs, required/optional semantics and `aria-describedby`. Readability or review failure would contradict the design assumption. |
| [W3C WAI: notifications](https://www.w3.org/WAI/tutorials/forms/notifications/) | Guidance for error and result feedback; strong normative support, no product-user testing yet. | Keep feedback beside fields and provide a persistent draft-ready status. Say what actually happened; a prepared draft is not a sent message. | Invalid email/empty/unchecked consent paths, keyboard focus, status announcement, edit/retry and long content. |

This applies recognition and visible context to the task without claiming a universal field-count rule or conversion improvement. Actual completion rates need a user study; browser checks establish functionality and layout only.

## Composition and implementation

- White background and compact two-column hero; navy/teal heading and an overlapping speech-bubble illustration in the existing icon style. Remove the breadcrumb.
- Three pastel quick-contact links for phone, email and office directions. Full cards are links with readable text and visible keyboard focus.
- White rounded enquiry form on a pale background; descriptive headings, grouped personal/optional finance fields, 16px input text and 52px targets. No staged questionnaire or hidden required fields.
- Navy team panel with the existing real Cara/Alice photograph at its native aspect ratio, plus source business hours and registrations. A small FAQ link supplies a helpful secondary destination.
- Shared arrow actions, modest pointer hover, and reduced-motion behavior. Ordinary flow, no grid background, no new animation library or remote embed.
- Preserve the original contact details, hours, finance choices, amount ranges, call-time choices, privacy destination and finance-query prefill. Treat these as the captured client content, not independently verified current business claims.

Validate widths from 320px to wide desktop, 200% zoom/reflow, labels, errors, keyboard/touch, draft encoding, edit/retry, known/unknown finance query strings, no-JavaScript alternatives, native links, photo loading/drag prevention, motion preference and generator idempotence. No real enquiry or message is sent during checks.

## Verified implementation

Six Chromium widths (320, 390, 768, 1024, 1440, 1915px) pass layout/field fit, source options/details, labels, 16px input text and 52px control heights, loaded/non-draggable team photography and no horizontal overflow, browser exceptions or failed local assets. Validation focuses the first invalid field and shows nearby correction text. Draft encoding preserves punctuation/newlines; editing removes the stale draft. Known query mappings and unknown query rejection, keyboard/touch, shared-arrow focus, reduced motion, 200% equivalent reflow, landscape navigation and no-JavaScript alternatives pass.

Checked text contrast is at least 5.71:1, placeholder contrast 4.97:1 and input-border contrast 3.35:1. Both action labels fit beside their arrows at 320px. All main local destinations return HTTP 200. Refiner idempotence and script/whitespace checks pass. Reusable check: `scripts/verify-contact-page.cjs`; evidence: `previews/contact-page-*`. These are implementation checks, not a user study or a complete accessibility audit.

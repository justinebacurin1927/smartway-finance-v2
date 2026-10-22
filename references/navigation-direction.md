# Simplified navigation — 21 October 2026

Jaycee found the expanded menu and separate destinations excessive, then asked to see the proposed simplification applied. This is an implemented version for review, continuing the Yuenansichu navbar reference selected earlier.

## Behavior and flow

Visitor flow: choose Finance → inspect a loan category or optional guidance → open details when needed → apply. About and Contact are direct homepage section links. Reviews and FAQs remain available on the homepage; Blog is available through the journal and footer.

The primary menu contains Finance, About and Contact, plus the Apply now action. Desktop and mobile use identical destination labels. The homepage Finance dropdown is replaced by a section anchor. From detailed pages, all three menu links return to their corresponding homepage sections. Compare loan types and Understand your credit appear under “Before you apply” in the finance section.

## Evidence and limits

| Basis | Evidence and confidence | Decision and boundary |
| --- | --- | --- |
| Clear hierarchy and grouping | [W3C cognitive accessibility guidance](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o2p02-site-structure/) recommends important categories in primary navigation, logical grouping and understandable labels. Strong guidance; this is not a site-specific conversion experiment. | Present three primary destinations and keep supporting guidance near the finance decision. Success means visitors can identify a service and reach the application. Validate findability with visitors. |
| Corrective finding about option count | [Scheibehenne, Greifeneder and Todd, 2010](https://doi.org/10.1086/651235), a meta-analysis of choice-overload experiments, reports substantial variation rather than a universal harmful effect from additional choices. Promising contextual evidence, with limited direct transfer to broker navigation. | Simplify the hierarchy while retaining service information and destinations. Three menu links are a design choice for this content, not a psychological maximum. Reconsider if users cannot find a common task. |

## Visual mapping

The `ui-design-index` marketing/landing route informs three compatible patterns: Yuenansichu's expanded-to-floating-pill header, direct section navigation and contextual guidance links. The installed router has no separate `ui-landing-patterns` package, so the actual local Yuenansichu implementation supplies the visual reference.

Retain Smartway's white logo, navy/cyan palette and white Apply now button. Following Jaycee's alignment feedback, a three-column grid centers the primary links in the available space between the logo and the phone/Apply controls. The desktop floating pill narrows to 920px for the shorter menu; mobile retains the compact pill and three-link disclosure. Links have an underline on hover/focus, a visible keyboard focus indicator and reduced-motion handling. Guidance links use a 44px minimum height and wrap on smaller screens.

## Verification

Chromium checks passed at 320, 390, 768, 1001, 1024, 1280, 1440 and 1765px: all three section anchors, header persistence, anchor clearance, no horizontal overflow or navigation overlap, mobile close/Escape/outside click, Compare/Credit Sense destinations, return anchors from service pages, normal/reduced motion, intro/video and reload at a scrolled position. No browser page exceptions. Static inspection verified the same primary destinations and stylesheet across all 29 pages. JavaScript syntax and Git whitespace checks passed.

Open assumptions: task priorities have not been validated with client analytics or visitor testing. Changes are local and ready for Jaycee's visual review.

## Findability correction — 21 October 2026

Jaycee later highlighted the footer directory because some destinations were hard to find. Retain Finance, About and Contact, and add one Explore disclosure. Its white two-column panel groups Compare Loans, Loan Calculator and Finance Hub under Tools & guides; About Us, FAQs and Testimonials under About Smartway. The existing header stays compact. Mobile lists those same destinations in labelled groups inside the existing navigation, with vertical scrolling on short screens.

The footer retains all nine destinations and groups them into Explore Smartway and Tools & resources. Brighter text, 44px minimum link rows, decorative arrows and visible hover/focus feedback make each destination easier to identify and select. The current page is marked in both directories. Existing mobile footer stacking is preserved.

Implementation: `scripts/refine-navigation.cjs`, `dist/navigation.css` and `dist/nav-explore.js`. Both generators apply the shared refiner before the image guard. Explore uses native `details`/`summary`, with no menu roles or required dependency; JavaScript adds Escape with focus restoration, outside-click/focus-leave dismissal and closing on mobile resize. The native desktop disclosure and footer remain usable without JavaScript.

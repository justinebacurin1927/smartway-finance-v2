# Brex: approved reference implementation

The user explicitly chose Brex with “run it” after a direct live screenshot review. This supersedes the rejected Editorial Layout #2 / Solvance closing direction.

Source: https://www.brex.com/ . Actual browser captures are retained in `live-brex/`. No source artwork ships in `dist`.

Composition lock:
- Final CTA: retain the reference's 54% dark copy / 46% full-height image split. Use compact bold sans, a short paragraph and one cyan application action with a secondary phone text link. Smartway's actual boat image replaces the unrelated Brex app photograph. Mobile stacks copy then the image.
- Journal: centered compact heading, three aligned 16:10 source images, same-baseline titles, complete descriptions and original dates/read times. Open columns without decorative card shells. Mobile uses one column with all copy visible.
- Footer: original Smartway logo at normal scale, grouped navigation, quiet utility links, and legal copy below a rule. Near-black surface. Remove the rejected giant serif wordmark.
- FAQ: extend the compact sans hierarchy to native disclosures on a quiet neutral surface. The Brex support page was not a homepage FAQ reference; no fake search is introduced.

Scope: only the homepage journal, FAQ, CTA and footer. No change to intro, finance, directors portrait, process or secondary pages. Original logo, images, article text, legal warning, member labels and destinations retained. No new runtime or package.

Generator: `scripts/refine-home-ending.cjs`, called by `scripts/enhance-site.cjs`. Shared CSS is now replaced, not layered over the rejected closing styles. Browser verification: `scripts/verify-home-ending.cjs`.

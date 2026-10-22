# Finance Hub article grid — 22 October 2026

Jaycee supplied the ARKO projects screenshot (`layout-reference.png`) and explicitly requested its layout, retaining Smartway’s design and palette. A follow-up requested decorative icons.

The layout mapping is a left label/count with category buttons at the right, followed by three equal image-cover cards. Each card has a number, category, title, original summary, and a bottom row with date/read time and article action. Five articles form rows of three and two. Tablets use two columns and phones one. This replaces the full-width indexed article list; no featured card spans columns.

Smartway keeps its warm paper surface, navy/sage masthead, Manrope/serif type, mint/plum doodles, original photographs and all five source titles, summaries, dates, read times, alt text and routes. Clipboard/chat badges decorate the heading. Category icons use the existing car, briefcase, wallet, leisure and credit symbols. White card titles sit against a navy image gradient. No neon green, black theme, ARKO branding or source copy is imported.

Implementation: `scripts/refine-blog-grid.cjs`, `dist/blog-grid.css` and a two-axis update to the existing filter animation in `dist/complete.js`. Both generators apply the helper. Filters retain native buttons, pressed state, counts, empty-category feedback, focus and reduced-motion support; without JavaScript, all five cards and article links remain available. No image-generation tool, additional font or animation library is needed.

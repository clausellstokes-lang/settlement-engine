# LANDING-7 lane C — the metropolis PDF (2026-11-06)

Branch `lane/landing7-l7c-2026-11-06`, cut from `3d8a74e4b`. Six reds, one cause, one cure.

## The expression

`src/pdf/primitives/PageChrome.jsx :: PageChrome` — the fixed footer's two texts were styled
`{ ...type.caption, color: palette.faint }`, carrying `type.caption`'s UNITLESS `lineHeight: 1.35`
at `fontSize: 8`. `@react-pdf/layout` 4.6.1 re-resolves a page's already-resolved styles on every
relayout of a page split (`relayoutPage → resolvePageStyles → computeStyle(node.style)`), and a
resolved lineHeight is a bare number, so `@react-pdf/stylesheet :: transformLineHeight` multiplies
it by the fontSize again on every pass. A fixed node is carried to every page of a chapter, so its
leading compounds: 10.8 (page 1) → 353,894.4 (page 2) → ×64 a page → `1.35 × 8^24 = 6.375e21` on
page 11. The footer view (absolute, `bottom: 24`) grows to that height, its `top` becomes
`-6.375e21`, and `@react-pdf/render :: clipBorderTop` hands `moveTo(left + rtl, top)` to pdfkit,
which refuses it: `unsupported number: -6.375194864464012e+21`. Any single `PageChrome` chapter
of eleven pages or more could not print.

Not a record defect: no generated field is non-finite. The operands are the theme token (1.35,
8 pt) and the page count of one chapter.

## The operands at the fixture

Fixture metropolis (`mediterranean / coastal / port`, seed `pdf-render-metro-2026`): the failing
chapter is `src/pdf/sections/Institutions.jsx :: Institutions` (bisected chapter by chapter; every
other chapter rendered alone). No single card fails alone (98 cards rendered one at a time, all OK).

| stage | population | detailed institutions | Institutions pages | footer height on its last page |
|---|---|---|---|---|
| master `a07ee4e0a` | 26,585 | 86 | 10 | 1.35 × 8^22 ≈ 9.96e19 (under pdfkit's 1e21) |
| tip `3d8a74e4b` | 55,906 | 98 | 12 | 4.08e23 (page 11: 6.375e21 — refused) |

The window's metropolis scale (X-46) and the card's added lines (T1-15 services, X-40/X-45 backs)
pushed the chapter from ten pages to twelve; the defect was latent before (the master render sat
one page under the limit). The specific commit that crossed page 11 was not bisected.

## The class (canon_dossier layout, max |box number| over every node)

| case | pop | inst | pages | before: max box / footer leading | after: max box / footer leading |
|---|---|---|---|---|---|
| thorp `l7c-thorp` | 27 | 9 | 20 | 3.54e5 | 841.9 / none |
| hamlet `l7c-hamlet` | 83 | 14 | 21 | 3.54e5 | 841.9 / none |
| village `l7c-village` | 164 | 13 | 22 | 3.54e5 | 841.9 / none |
| town `l7c-town` | 722 | 31 | 29 | 9.28e10 | 841.9 / none |
| city `l7c-city` | 14,511 | 85 | 43 | 9.96e19 (one page from failing) | 841.9 / none |
| metropolis fixture | 55,906 | 98 | 47 | 4.08e23 — FAILS | 841.9 / none |
| metropolis `l7c-metro-1..10` | 26,178–107,923 | 88–102 | 45–50 | 9 of 10 ≥ 6.375e21 (FAIL); `-7` at 9.96e19 | 841.9 / none, all ten |

After the cure the largest number in any laid-out box, across all sixteen documents, is the A4
page height (841.89).

Left named, not cured (PLAUSIBLE latent, unpainted): body texts' resolved `style.lineHeight`
compounds the same way (up to 1.45e26 in the metropolis dossiers, before and after) because the
same upstream pass re-resolves them; their boxes and lines are computed before the compounding and
stay bounded (measured above), so nothing reaches the painter. The upstream defect is
`@react-pdf/layout` 4.6.1 :: `relayoutPage` re-resolving resolved styles; curing it there is a
dependency change, outside this lane.

## The cure

`PageChrome` :: `FOOTER_TEXT` — the footer texts take the caption's family and size and NO
lineHeight (a one-line footer takes the font's own leading; nothing to re-multiply). The header's
texts (`type.label`) already carried none. PDF-only: `PageChrome` has no screen twin.

## Red first

`tests/pdf/pageChromeFixedLeading.test.jsx` — a thirty-page `PageChrome` chapter:
- "a thirty-page PageChrome chapter lays out with every box number finite and bounded, and the
  fixed footer the same height on every page" — at the parent: `126 box numbers out of bounds
  (±8418.9)`; after: green.
- "the same thirty-page chapter renders to PDF bytes (the painter takes every number)" — at the
  parent: `Error: unsupported number: -6.375194864464012e+21`; after: green.

## The six, from their own runs (after the cure)

| file | run |
|---|---|
| `tests/pdf/fullPdf.render.test.jsx` | 26/26 passed (metropolis canon_dossier, draft_brief, variant gating among them) |
| `tests/pdf/renderedFontEmbedding.test.js` | 8/8 passed (both reds) |
| `tests/pdf/customContentGlyphReach.test.js` | 7/7 passed (AFTER THE FACT) |

| red | cause | door | before → after | grade |
|---|---|---|---|---|
| fullPdf.render :: metropolis canon_dossier | fixed footer leading compounding per relayout; the window grew Institutions 10 → 12 pages | PageChrome :: FOOTER_TEXT | unsupported number -6.375e21 → passes | CONFIRMED |
| fullPdf.render :: metropolis draft_brief | same | same | same → passes | CONFIRMED |
| fullPdf.render :: metropolis variant gating | consequence (no page counts recorded) | same | undefined → passes | CONFIRMED |
| renderedFontEmbedding :: NO text run … non-embedded | consequence (shared render failed) | same | toString of undefined → passes | CONFIRMED |
| renderedFontEmbedding :: renders a real multi-page dossier | same as canon_dossier | same | -6.375e21 → passes | CONFIRMED |
| customContentGlyphReach :: AFTER THE FACT | same | same | -6.375e21 → passes | CONFIRMED |

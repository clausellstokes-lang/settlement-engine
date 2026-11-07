# LANDING-7 LANE C — THE METROPOLIS PDF BUG (6 reds, 2026-11-06)

Read `/tmp/claude-0/-home-user-settlement-engine/91098d1e-536b-53ea-a385-88e9fe415a85/scratchpad/BRIEF-L7-COMMON-2026-11-06.md` first, whole. Worktree `/home/user/se-l7c`, branch `lane/landing7-l7c-2026-11-06`.

This is a REAL DEFECT, not a pin: the PDF of a metropolis no longer renders. Six tests fail with `Error: unsupported number: -6.375194864464012e+21` (pdfkit refuses a non-finite or absurd coordinate/size) or with its consequences (`TypeError: Cannot read properties of undefined (reading 'toString')`; `actual value must be number or bigint, received "undefined"`):

- `tests/pdf/fullPdf.render.test.jsx` :: metropolis `canon_dossier` renders to a valid PDF above its page floor; metropolis `draft_brief` …; metropolis variant gating (the fixture: `settType: 'metropolis', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port'`, seed `pdf-render-metro-2026`);
- `tests/pdf/renderedFontEmbedding.test.js` :: NO text run is drawn with a non-embedded font; renders a real multi-page dossier;
- `tests/pdf/customContentGlyphReach.test.js` :: AFTER THE FACT: the same pack, wall bypassed, prints with a NON-EMBEDDED font.

The window moved the metropolis scale (X-46: populations to 1,000,000; the house budget; the named roster following the population). Somewhere in `src/pdf/**` (or a display leaf it reads) a layout figure is computed from a quantity that is now huge, zero, negative or non-finite — a bar width, a scale, a column, a log of zero, a division by a count of zero — and reaches pdfkit as `-6.4e21`.

1. REPRODUCE with the stack: run the single metropolis `canon_dossier` test with the error's stack captured to a file (vitest prints it; if the stack is cut, wrap the render in a try/catch in a scratch script that imports the same entry the test uses and prints `err.stack`). Name the component and the expression. Read that file WHOLE.
2. Measure the input that goes bad: print the offending value and its operands for the fixture metropolis (population, the count, the ratio) — and check the same expression over the other five tiers and over ten metropolis seeds (the fixture's generator call with different seeds), so the cure covers the class, not the seed.
3. CURE red-first: a test in `tests/pdf/` that renders the fixture metropolis (or the smallest component that reproduces it) and asserts every number handed to the renderer is finite and bounded, red at the parent with the `-6.4e21` error, green after; the fix is in the expression (the formula made total: a guard for zero/undefined counts, a clamp to the page, a log of max(1, n)) — never a try/catch that swallows the page, never a changed record. If the same expression lives on the screen (a React component sharing the leaf) say whether the screen is affected and cure the shared leaf once.
4. Then the six tests green from their own runs (the font-embedding tests may need the metropolis fixture rendered end to end: ~7 s each).
5. If the bad number comes from the RECORD (a generated field that is itself non-finite — e.g. a density or a ratio in the economic state), that is a generator defect and a golden-moving cure: STOP after the measurement, name the field and the seeds, and hand it to the chair.

Record: `docs/LANDING7_PDF_2026-11-06.md` — the expression, the operands at the fixture, the class measurement across tiers and seeds, the red-first title, the six tests' own runs.

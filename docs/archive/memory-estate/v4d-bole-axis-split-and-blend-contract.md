---
name: v4d-bole-axis-split-and-blend-contract
description: "Lane V4D — the bole bed's vertical axis becomes the BAR's (mobile plaque cured, desktop preserved), the wrap's blend gets a rendered-element pin plus an @supports arm, and two theme.js docstrings stop over-claiming"
metadata: 
  node_type: memory
  created: 2026-08-04
  tags: 
    - ribbon
    - v4d
    - brand
    - gilded-wordmark
    - shaftwrap
    - theme
    - pins
    - hazard
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-06T10:26:59.221Z
---

# Lane V4D — three repairs, four commits @ a2dbdd36 · 358a8956 · 273ffbba · 98edbc9f

Branch `claude/composite-r4` in `.claude/worktrees/minifold`. All four commits are
pathspec commits over exactly eight files; WZ-5r's two commits (1b7c1eac, 39ba6590)
interleaved and were preserved untouched.

## ⚠️⚠️ R-1 — A GEOMETRY MEASURED ON ONE BREAKPOINT IS A CLAIM ABOUT ONE BREAKPOINT

R1's "the burn bleeds off the bar's long edges" was true on the 38px desktop bar and
FALSE on the 60px mobile one: probed at 390x844 dsf2, the burn's top edge sat dead
straight at CSS y=10 and its foot at y=57, with bare cedar above and below — the PLAQUE
the whole V4 correction retires, shipping on every phone with every pin green.

**The cause was a frame of reference, not a constant.** The bed's height came from the
TYPE (`ink ± BOLE_PAD`) while the edges it had to clear were the BAR's — and between
these breakpoints those move OPPOSITE ways: the mobile lockup is FS.lg on a bar sized by
a 44px TAP TARGET, so type 24→15px while bar 38→60px.

**The cure is an AXIS SPLIT, and it is the thing to remember:**
- horizontal reach stays the INK's (`± BOLE_PAD`, still a tightness bound — a burn
  around a WORD is as wide as the word);
- vertical reach becomes the BAR's (`boleField(bar) = bar/2 + BOLE_BLEED`, where
  `BOLE_BLEED = ink[1] + pad − bar` = 2.08px, DERIVED from how far the desktop ink band
  already overshot the desktop bar's foot — a burn across a PLANK is as deep as it).
- `Lockup` passes `bar={compact ? CHROME.headerMobile : CHROME.headerDesktop}`.
- The CSS is `top: calc(50% − half)` + `height`, no `bottom`: the 50% resolves against
  the WORDMARK's own height, so one px constant lands the field on the bar's edges at
  two breakpoints whose type differs, without the module knowing the font's metrics.
  ⚠️ It assumes the lockup is CENTRED in the bar. True today at both bars, and
  `viewport-fit=cover` is NOT set in index.html so `env(safe-area-inset-top)` is 0 —
  if that ever changes, the mobile header grows at the top only and the centring breaks.

**TWO THINGS HELD FIXED so it is a repair, not a redraw** — copy this pattern:
- `BOLE_UNIT` keeps V4C's px-per-unit (0.7396px of bar per bed unit). BURN_FREQ,
  GILD.edgeAmp and the singe blur all live in those units, so only the COUNT of units
  moves with the bar, never the size of one.
- The viewBox ORIGIN is negative and anchored so user y=0 stays on the ink band's top
  edge. feTurbulence samples noise at a point's own USER-SPACE coordinates, so an origin
  that moved with the field would hand the desktop bar a different ragged edge as a side
  effect of a phone fix.

**The desktop delta, attributed by execution:** inside the bar 26,861/218,880 device
pixels differ but max channel delta is 7/255 with only 63 pixels over 2 — a 1-LSB
dither. Below the bar 7,087/138,240 differ (max 16) along the burn's own ragged edge:
the filter region re-samples the same noise on a different sub-pixel grid because the
rect bboxes grew. **ATTRIBUTION TECHNIQUE WORTH REUSING:** re-probe with the subject
element alone hidden (`page.addStyleTag('[data-testid="bole-bed"]{display:none}')`) —
base and HEAD then rendered 0/357,120 and 0/131,040 differing pixels, proving every
delta belongs to that element's paint and nothing else moved.

**Proof of the cure:** a 165-column scan of the mobile bar, restricted to rows clear of
the wordmark's ink (CSS 0-21 and 46-60) so glyph baselines and the near-black keyline
cannot be mistaken for burn edges — BEFORE 165/165 columns share a boundary at CSS 10.0
and again at 56.5-59.5; AFTER **0/165 on every row**. ⚠️ Two earlier filter attempts
were WRONG and are worth knowing: a plain luminance threshold cannot separate BOLE
(L 0.0168) from SHAFT_RIM (L 0.0214), and a burn↔wood step filter misses the SINGE
halo entirely because it is blurred.

## ⚠️⚠️ R-2 — AN ANALYTIC PIN OVER TOKENS CANNOT SEE A MISSING DECLARATION

`backgroundBlendMode: 'multiply, normal'` was the ONE line making the two silk wraps
oxblood. Deleting it renders both as a flat #D7D7D7 LIGHT-GREY stripe (~9:1 on the
cedar, the loudest object on the bar) — and **401 of 402 assertions across tests/design
+ navFletching still passed**, because the R5 pin performs the multiply ARITHMETICALLY
from WRAP_BARREL and WRAP_GLOSS. Nothing in tests/ matched `backgroundBlendMode` at all.
**The class: a proof about the tokens can never say whether the component asks for the
composite. Pin the RENDERED ELEMENT.**

- `LAYERS` is now one table projecting both `background-image` and
  `background-blend-mode`, because the Nth mode belongs to the Nth layer and **CSS
  REPEATS a short blend list to fill a longer image list rather than complaining** — a
  third paint layer added alone would silently inherit `multiply` and go near-black.
  ⚠️ The table caught its own bug on the first run: `LAYERS.map(([mode]) => mode)`
  destructures index 0 (the IMAGE), so BLEND came out as the image list and jsdom
  rejected it as `''`. Only the new element-level pin saw it.
- `@supports not (background-blend-mode: multiply)` in src/index.css swaps in the
  PRE-V4C oxblood ramp, recovered verbatim from `git show dd86e5f9^` (it was named
  THREAD). Tones reach the sheet through a custom property the component sets, so
  theme.js stays the single source and the sheet holds only the conditional.
  JUDGMENT (vetoable): the pre-V4C TURN layer is deliberately NOT restored with it —
  that gradient is the barcode V4C measured and retired, and a fail-safe degrades to the
  last known-GOOD tone, not the last shipped composition including its fault.
- jsdom DOES support `style.backgroundBlendMode`, `getComputedStyle().backgroundBlendMode`,
  CSS custom properties and `calc()` in `style.top` — all four were probed before use.

## R-3 — TWO DOCSTRINGS CORRECTED IN PLACE

- theme.js's WRAPS note asserted the wound ladder is "2.12:1". That is the ratio of
  WRAP_GLOSS against WRAP_EDGE AS AUTHORED — arithmetic about two hexes that never met a
  screen. The sentence now states the measurement (1.81:1; crest #6A311E..#6B311F,
  valley #270D07). Re-measured this lane at 1.817:1 against V4C's 1.806:1 — one 8-bit
  level apart, which is rasteriser dither. **A correction living ten lines below a false
  sentence leaves the false sentence standing.**
- SHAFT_GRAIN_LAYERS said every layer darkens "at every alpha by construction". FALSE at
  the silhouette: the cylinder falls PAST SHAFT_EDGE in the bar's last 2%, so the GRAIN
  layer (tone = SHAFT_EDGE) lands on darker ground and LIGHTENS it — measured 478/500
  bare-cedar columns in the bottom device row, median +0.0010, max +0.0022. Harmless
  (lightest result L 0.0308 vs the L 0.1268 ceiling, 4.1x margin, in a row no ink
  reaches) but the LAW was one notch stronger than its proof. The enforced invariant is
  the CEILING, which compositedBarAA asserts per layer; its test NAME over-claimed the
  same way and is corrected too. ⚠️ SHAFT_RIM's recorded luminance 0.0223 is wrong; it
  is 0.0214 (#3F2013). Nothing asserted the old figure.

## ✅ CLOSED 2026-08-04 — navFletching's post-teardown unhandled errors (was PRE-EXISTING)

**CURED** by one leaf mock (`vi.mock('../../src/lib/creditLedger.js', …)`) at HEAD
`1453676b`; 10/10 combined-gate runs exit 0, 413 tests unchanged. ⚠️ TWO claims below
are REFUTED by measurement: "Running the file alone exits 0" is FALSE (solo was red 2
of 3), and the deferred remainder was NOT retargetable — 6 of the 27 sites genuinely
need the shell. Full mechanism: [[vitest-dynamic-import-escapes-module-mock]].
The original note is kept verbatim below for provenance.

## ⚠️ PRE-EXISTING, NOT V4D's — navFletching's post-teardown unhandled errors

`npx vitest run tests/design tests/components/navFletching.test.jsx tests/lint/sizeBaseline.test.js tests/lint/mutationCoverageManifest.test.js`
exits 1 with "27 errors" on roughly half of runs while every test passes. Cause: ~20
`<App />` renders whose lazy `src/lib/stripe.js` graph resolves after the jsdom
environment tears down. **ATTRIBUTED: the BASE version of the file
(`git show a2dbdd36:tests/components/navFletching.test.jsx`) exits 1 on 2 of 4 runs with
the identical 27-error count.** Running the file alone exits 0. V4D's own two pins were
retargeted from `<App />` to `<NavRibbon />` (29 → 27 errors) and the remainder is
deferred as its own task. **Before believing a red or a non-zero exit on this gate, run
it more than once and check whether it is the unhandled-error tail rather than a test.**

## Verdict (chair addendum, 2026-08-04)

**PASS** — independent verifier re-executed everything: mobile probe 0/165 reproduced,
a NEGATIVE-CONTROL mutant (field re-fixed to the desktop reference) proved the probe
discriminates (72/165) and the new pin reds MOBILE-ONLY (exactly the defect class);
blend pin red on the deleted line, and the LIST-PARITY arm proven to fire FIRST on a
third-layer injection; the @supports THREAD ramp verified BYTE-IDENTICAL to
`dd86e5f9^` (recovered, not invented); the 1.81:1 ladder re-measured independently
(1.812:1). All three vetoable judgments chair-AFFIRMED. Two follow-ups recorded:
(1) mobile burn now bleeds below the header LIKE DESKTOP ALWAYS HAS — one law, both
bars, an observation not a defect; (2) RESIDUAL over-claim one file over —
tests/design/contrast.test.js:829-831 still frames the authored-hex 2.12 as the
thread's rendered read (assertion true, framing the retired idea) — chip spawned.

## Gate receipts

28 files / 413 tests green (base 409). eslint 0 errors on all eight files.
`npm run build` + postbuild prerender (314 route documents) and `npm run smoke:boot`
(473/473 chunks, PASS) both exit 0 through `scripts/gate-tail.sh`. Two-load determinism:
the header's outerHTML sha256 and its PNG sha256 are identical across two independent
loads at both breakpoints. Size headroom against the 600-effective-line components
ceiling: GildedWordmark 154, ShaftWrap 97, theme.js 248, Lockup 38 — none baselined.

## V4 IS CLOSED — SUPERSEDED BY V5 (migrated from the memory index, 2026-08-06)

One fact the memory index carried about this lane and this file did not: **V4 is
CLOSED and V4D is SUPERSEDED by RIBBON V5** (owner direction, 2026-08-04 —
organic asymmetric vanes, cartographer cartouche with the seal in the O, the
half-arrow depth law, burned reference tabs; see [[ribbon-v5-direction]]).

What that does and does not retire:

- **The BLEND CONTRACT survives into V5** — the LAYERS table projecting both
  `background-image` and `background-blend-mode`, the list-parity arm, and the
  `@supports not` fallback are named in V5's "what survives" set alongside the
  breakpoint law, the texture budget, composited-AA and the focus law.
- **R-1's axis split is a repair of a retired composition** — the bole bed and
  the cartouche are different objects; V5 explicitly notes the tension that V4D
  made the bole BLEED OFF the bar while the cartouche re-introduces a CONTAINED
  badge. Read R-1 for its LAW (a geometry measured on one breakpoint is a claim
  about one breakpoint), not as live geometry.

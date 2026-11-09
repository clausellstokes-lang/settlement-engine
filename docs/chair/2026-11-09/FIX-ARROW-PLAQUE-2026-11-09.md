# FIX-ARROW-PLAQUE: the blank brass plate centred in its band (2026-11-09)

**Seat:** FIX-ARROW-PLAQUE, a child of the chair session `session_01FbPLbejcfwX5nii12VM673`.
**Base:** `d46ce9503` (`lane/integration-2026-11-07`).
**Branch:** `lane/fix-arrow-plaque-2026-11-09`.

**The owner's word (2026-11-09, verbatim):** "Yes to: Centring it horizontally means moving the plate in the strip image and re-measuring the plate, rivets and slip from the new painting. Your header law of September 19 forbids me re-cutting the painting on my own, so say the word and a seat does it."

**The chair's method ruling (2026-11-09, 03:0x UTC):** the painting stays byte-identical, and the plate moves by composition in `arrowGeometry.js`, the way the slots already move wood.

**STATUS:**
- The plate is centred on the page within 0.30 CSS px at every full width from 1024 to 3840.
- The painting, the brand marks and the PDF are untouched, and the generator deltas are 0.
- **The first-paint budgets are over** (§6). That is a STOP with the chair; nothing has moved.

## 1. What was measured first, and why the method changed

These measurements were taken on the parent's strip with the asset test's own detectors. They stand as the cause of the pivot.

| part | strip px | procedure | verdict |
|---|---|---|---|
| `BINDINGS[6]` | 1530–1566 | dark ≥ 4 run around the cord core 1533–1564 | CONFIRMED |
| the run before the plate | 1566–1628 | plain (≤ 1 dark pixel, no cord) and maximal | CONFIRMED |
| `PLATE` | 1623–1877 | x0: the left tip's one-pixel point (d = 1 at 1623–1627). x1: one past the right tip's outline (rows 31–32 dark at 1875–1876) | CONFIRMED |
| the shaded gap | 1877–1889 | 12–21 pixels per column under half the shaft's row median, no cord; the binding's shadow from 1885 | measured |
| `BINDINGS[7].x0` | 1889 | the dark count jumps 13 → 23 → 33 there; the ≥ 4 rule does not separate it from the gap | PLAUSIBLE; unmoved |

The plate's centre is 1750 and the span's is 1727.5, so the plate sat 22.5 columns toward the head.

**The first method, a re-cut of the strip, is set aside.** It was committed as `88f199b7e` and `2328cbbb3` and reverted forward in `b6f439f70`. Its measurements showed it cost more than it bought:
- Any re-encode reds `brandDerivatives` (STRIP_SHA256 and the mint's ARM B). The mint can only be re-cut on the darwin minting stack: on linux, 6 of the 10 derivatives differ in bytes even for identical inputs.
- A q90 re-encode flips the plain, letter and cord detectors on 27–54 columns, depending on the encoder setting.
- It moves the asset test's lighting window.
- It loosens the filler's alpha-edge bound from 20 to 23.

## 2. The composition (`src/components/nav/arrowGeometry.js`)

The plate's one cut, `{ x: 1596, fe: FE }`, became two joins. Both are open at every width, the uncut branch included:

- **`{ x: 1586, fe: FE, drop: PLATE_SHIFT }`, the drop.** It removes 22 columns of plain wood, so the next range starts at 1608.
  - The crossfade shows [1586, 1596) from the left and [1598, 1608) from the right. Both are in the run [1566, 1628), over the join's own filler, 15 columns clear of the plate's tip.
  - The chair's 1601 | 1623 would have faded the tip at 1623–1627. A drop with no filler under it would show two fading layers over nothing, the grey band the seam law forbids. So the drop rides the stretch cut.
- **`{ x: 1881, fe: PLATE_FILL_FE = 4, fixed: PLATE_SHIFT }`, the fixed fill.** It adds 22 columns of filler (times s) in `SHADED_GAP` [1877, 1885).
  - Its crossfade shows [1877, 1881) and [1881, 1885): between the plate's right outline and the binding's shadow. The wood there is plain by its own light (§4).
  - fe 10 does not fit in 12 columns.
- **Tones.**
  - `SLOT_TONE[1608]` = 0.802: the run's tone, which the old cut 1596 had.
  - `SLOT_TONE[1881]` = **0.802**, the tone of the run the plate sits in, by the look (§5). The gap's own shade measures 0.526, and it stays painted beside the binding.
- **Width.** Net width is 0: one drop and one fill of the same 22 columns. `STRIP_W`, `COMPACT_W`, `fullScale`, the phone floors, every detector table and the lighting window are unchanged.
- **Where the plate sits.** 35 columns from binding 7 and 34 from the arrowhead's binding, half a column off centre.
- **Above S_MAX, the split part.** The plate's one part of the extra width splits in halves, one at the drop and one at the fill. `PARTS` stays 7: no section's slot moves, and the six-sections pin holds unchanged. `SHARES` no longer exists, so the ruling's "two single shares" are two half parts.
- **The compact arrow is untouched.** Its tail crop starts at 1596 and has no band (binding 7 is not shown).
- **Rects.** `PLATE`, `SLIP`, the rivets, the plate's hit rect and its glow follow through `mapX`. No plate number changed.

## 3. Commits (one cause each)

| commit | cause |
|---|---|
| `b6f439f70` | revert of the re-cut and its record |
| `865fdcd26` | the composition: the drop and the fixed fill, the pin below S_MAX |
| `aa0c76581` | the plate's part split in halves; the pin to 3840 |
| `575e8b5e5` | the fixed fill's tone: 0.526 → 0.802, by the look |
| (this commit) | the record, the composite and `dated` 168 → 169 |

## 4. Pins (re-keyed by identity and cause; none loosened)

**`arrowGeometry.test.js` (b2), new.** The rendered plate centre equals the rendered band centre (binding 7's right edge to the arrowhead's binding's left edge) within 1 CSS px, at named widths and at every full width from 1024 to 3840.
- **Red at the base `d46ce9503`:** 1024 +10.8, 1279 +13.49, 1440 +24.94, 1920 +59.23, 2560 +104.94, 3840 +196.37.
- **Red at `865fdcd26`**, before the split: 1440 +11.74, 1920 +46.03, 2560 +91.74, 3840 +183.17.
- Its CONTROL convicts the painted 22.5.

**`arrowGeometry.test.js`, re-keyed:**
- The cut table names the two joins.
- `cutViolations` reads a drop's two shown spans and lets the fixed fill alone sit in `SHADED_GAP`.
- The tiling checker reads the joins a layout carries: all cuts once the slots open, the plate's two below.
- "The uncut arrow is one segment" became the painting around the plate's two joins: three segments, `mapX` exact outside [1586, 1608) and shifted 22 inside the band.
- (e) reads the slots a layout carries.
- (h): tones at both ends of a drop, and the fill's tone equals the run's.
- (c2)'s plate-slot arm is re-keyed to the two halves.

**`arrowPaint.test.jsx`:**
- The masks follow each join's fe: the plate's segment and the last differ from the uniform middle.
- The uncut paint is two fillers under three segments.
- The drop needs no second tone layer.

**`arrowHeaderAssets.test.js`:**
- The cut margin reads a drop's two shown spans.
- A new arm: the fixed fill joins `SHADED_GAP`, which is plain by its own light. That means no cord and at most one pixel per column under half the gap's own row median: measured 0–1 at 1877–1884. Its CONTROL shows the plate's outline (1872–1875) and the binding (1889, 1890) carrying 2 or more under the same rule.
- SLOT_TONE re-measures 1608 over the run, and 1881 over the run the drop sits in.

**Suites.** All 24 suites that touch the arrow, the plate or the slip pass, `dossierPhoneFloorAllViews` and `brandDerivatives` included: 463 passed, 2 skipped. eslint exits 0 on every touched file.

## 5. The look: screenshots and measured gaps

**Where they are.** The session scratchpad `shots/`: `before-<w>.png`, `after-<w>.png`, the `after-fe0-*` and `after-lit-*` variants, and `close.png` and `close2.png`. The **committed composite** is `docs/chair/2026-11-09/FIX-ARROW-PLAQUE-look-2026-11-09.webp`: 1600×2174 px, 289,346 B, before above after at 320, 375, 768, 1024, 1440 and 1920.

**How they were taken.** Chromium via Playwright, deviceScaleFactor 2, the app in local-data mode (`VITE_E2E_LOCAL_DATA=true npx vite`). The parent was served from a clean worktree at `d46ce9503`.

**The gaps,** CSS px from `layoutArrow`. The page's own plate rect matched it to 0.01 px.

| width | before L / R | after L / R | off-centre after |
|---|---|---|---|
| 1024 | 27.4 / 5.8 | 16.8 / 16.3 | 0.24 |
| 1279 | 34.2 / 7.2 | 21.0 / 20.4 | 0.30 |
| 1440 | 57.1 / 7.2 | 32.4 / 31.8 | 0.30 |
| 1920 | 125.7 / 7.2 | 66.7 / 66.1 | 0.30 |
| 2560 | 217.1 / 7.2 | 112.4 / 111.8 | 0.30 |
| 3840 | 399.9 / 7.2 | 203.9 / 203.3 | 0.30 |

The six sections are unchanged at every width (104.6 at 1440, 173.2 at 1920).

**What they show.**
- **1024 to 1920.** Before, the plate sits hard against the arrowhead's binding. After, it sits mid-band, with lit wood on both sides and the binding's shade painted beside the binding.
- **Compact (320, 375, 768).** Unchanged by design.
- **The tone, a look ruling made in a commit for the chair's veto.** At the gap's own tone (0.526) the fill read as a flat dark patch that grew with the page (about 59 px at 1920). At 0.802 it reads as continuous wood.
- **The crossfade.** At fe 0 (a hard cut) the fixed fill showed straight vertical steps at 1920; fe 4 is kept.

## 6. Deltas, walkers and budgets

**The generator deltas** were measured with `scripts/audit/landing-stage.sh measure` on clean worktrees, with the parent as the previous stage. Measured 0 on every surface:
- gm: 0/525;
- fence: 0/360;
- herald: 0/475;
- prose: 0/1,050;
- witness: 0/8;
- pdf: 0/18.

**The painting and its derivatives:** `arrow-strip.webp` is byte-identical (`427f9d98…`). `brandDerivatives`, the mint and `brandSeal.js` are untouched and green.

**The three record walkers** at the record's commit:
- `sourceCitationIntegrity.walker`: `dated` 168 → 169 (this record), the note `_rosterGrowth2026-11-09-fix-arrow-plaque` and the header line;
- `ledgerCitationIntegrity`: run after `git fetch origin review-fixes-2026-07-08` and a local branch ref the test reads;
- `recordRegisterTotality.walker`.

The inherited roster `tree` red the brief named did not show at this base.

**THE FIRST-PAINT BUDGETS: a STOP, with the chair.** These are `tests/build/vendorPdfLazy.test.js` with `VERIFY_DIST=1`, after a fresh build at `575e8b5e5`; the parent is green at the budgets.

| | budget (parent) | tip | Δ |
|---|---|---|---|
| raw | 1,075,589 | 1,075,758 | +169 |
| gzip | 342,846 | 342,975 | +129 |
| Brotli | 288,452 | 288,470 | +18 |

- **What the bytes are.** The only module that differs in the entry is `arrowGeometry.js`: the two join objects and the spread that builds CUTS, `PLATE_CUTS`, the share-0 branch that now composes the plate's joins, the half part plus the fixed fill in `fullSlots`, three SLOT_TONE keys and two constants. None of it is dead code.
- **No zero-behaviour buy-back of that size exists in the module.** Running the full composition at share 0 would put zero-width fillers under 13 crossfades and bleed the filler into the uncut painting by up to 25%, a visible change. Trims of `?? 0` are worth tens of bytes and fail the type floor.
- **The ruling is the chair's:** (a) re-record at the measured tip, attributed; (b) a named buy-back elsewhere in the entry; or (c) a lazy-load the chair chooses.

**CONFIRMED against PLAUSIBLE.**
- **CONFIRMED:** the centring, in the geometry (red-first, twice) and on the page; the sections unchanged; the painting byte-identical; deltas 0; the first-paint overrun, measured.
- **PLAUSIBLE:** that the owner reads the 0.802 fill and the 4-column crossfades as the painting's own wood; `BINDINGS[7].x0` = 1889.

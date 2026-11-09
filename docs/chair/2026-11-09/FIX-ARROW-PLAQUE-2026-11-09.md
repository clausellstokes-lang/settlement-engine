# FIX-ARROW-PLAQUE: the blank brass plate centred between its bindings (2026-11-09)

**Seat:** FIX-ARROW-PLAQUE, a child of the chair session `session_01FbPLbejcfwX5nii12VM673`.
**Base:** `d46ce9503` (`lane/integration-2026-11-07`).
**Branch:** `lane/fix-arrow-plaque-2026-11-09`.
**The re-cut's commit:** `88f199b7e`.

**The owner's word (2026-11-09, verbatim):** "Yes to: Centring it horizontally means moving the plate in the strip image and re-measuring the plate, rivets and slip from the new painting. Your header law of September 19 forbids me re-cutting the painting on my own, so say the word and a seat does it." This amends the header law for this one cut.

**STATUS:** the strip is re-cut, the geometry re-measured, the pins re-keyed, and the screenshots taken. Three rulings belong to the chair (§7).

## 1. Measured first (the parent's strip, the asset test's own detectors)

| part | strip px | procedure | verdict |
|---|---|---|---|
| `BINDINGS[6]` | 1530–1566 | dark ≥ 4 run around the cord core 1533–1564 | CONFIRMED |
| left wood run | 1566–1628 | plain (≤ 1 dark pixel, no cord) and maximal | CONFIRMED |
| `PLATE` | 1623–1877 | x0: the first column past the wood with a dark pixel (the left tip's point, d = 1 at 1623–1627). x1: one past the right tip's outline (rows 31–32 dark at 1875–1876; wood from 1877) | CONFIRMED |
| right gap | 1877–1889 | not plain: shaded wood, 12–21 dark pixels per column | measured |
| `BINDINGS[7].x0` | 1889 | dark ≥ 4 does not separate it from the shaded gap; 1889 is where the count jumps 13 → 23 → 33 | PLAUSIBLE; unmoved |

The plate's centre is 1750 and the span's is 1727.5, so the plate sat 22.5 columns toward the head. The chair's measure stands.

## 2. The re-cut (`public/brand/arrow/arrow-strip.webp`)

- **Shift.** d = 22 columns. Every column from 1591 to 1876 moved left by 22, over all 182 rows: the plate tip to tip, its shadow, the slip's field, and the wood above and below.
- **Left seam.** The 22 dropped columns are plain wood of the left run. They are joined by a 10-column linear crossfade centred on 1586, the column of least seam difference among 1572–1596.
- **Fill.** The 22 vacated columns, 1855–1876, are filled as follows:
  - each takes the left run's own wood, mirrored about the old left tip (`fill[1855 + j] = old[1622 − j]`), so the column against the right tip is the one that stood against the left tip;
  - each row is scaled per channel to the shaded gap's mean (`old[1877, 1885)`);
  - each row is then pinned by a linear correction to its two neighbours, which stood side by side in the painting (`old[1876]`, now at 1854, and `old[1877]`). The correction is smoothed over three rows. There is no flat fill;
  - the alpha comes from those two neighbours, so the shaft's lower edge runs level through the gap. (A first pass took the source's alpha, and the edge stepped where the left run's edge sits higher; that pass was discarded.)
- **Unchanged.** The bindings, the arrowhead, the feather and the painted words are the parent's decoded pixels until the encode.
- **Not involved.** The filler `arrow-filler.webp` does not carry the plate. It is untouched; its sha256 is unchanged.
- **Encode.** One q90 WebP encode, the first cut's quality per the register: effort 5, smart subsampling, lossless alpha as before. I searched 56 q90 settings, plus q86–q92 at 336. This is the q90 setting whose re-measured tables, and the brand test's wax-seal walk, match the unencoded re-cut. The one exception is binding 1's cord runs (§5). The kit file is 67,726 B; shipped with the credit it is **69,650 B** (the parent's was 70,230). The 70,500 ceiling is not moved.
- **Credit.** Re-injected by `scripts/inject-ai-provenance.mjs`'s `injectFile` from the register row. The row's `mapped_by` now says the strip was re-cut on 2026-11-09 and encoded a second time at q90; `restored` is 2026-11-09, and `require` changed with it.
- **Kept for the before views:** the old bytes, in the session scratchpad `before/`.

## 3. Every constant, old → new (`src/components/nav/arrowGeometry.js`)

| constant | old | new | how |
|---|---|---|---|
| `PLATE` | 1623–1877 | **1601–1855** (centre 1728, span 1727.5) | exact translation; the tip pattern is identical, column for column, 22 to the left |
| `PLATE_FIELD` | x 1672–1833 | 1650–1811 (rows 11–51) | −22 |
| `PLATE_RIVETS` | 1664–1679, 1829–1843 | 1642–1657, 1807–1821 | −22; the rivet dark boxes (luma < 51) measured 1658/1830 → 1636/1808 |
| `SLIP` | 1683–1825 | 1661–1803 (rows 13–49) | −22; the asset test's slip-clear and rivets-present arms are green |
| `WOOD_RUNS` last | 1566–1628 | 1566–1605 | the plain-and-maximal procedure; the re-encode gives the tip's fifth column a second dark pixel |
| `WOOD_RUNS` | 1503–1529 | 1502–1529 | see †, below the table |
| `NAV_WORD.about` | 1432–1502 | 1432–1500 | see †, below the table; About's glow ends 2 columns sooner |
| `CUTS` last (the plate's slot) | 1596 | **1586** | at 1596 its crossfade [1586, 1606) would fade the moved tip at 1601; 1586 is 10 clear of the tip and 20 of binding 7 |
| `COMPACT_JOIN.right` (the tail crop) | 1596 | 1586 | same reason; `COMPACT_W` goes 1095 → 1105 and the compact scale is cw / 1145 |
| `SLOT_TONE` | 1596: 0.802 | 1586: **0.810** | the asset test's formula over [1566, 1605) |
| `slipFont` comment table | cw / 1135 | cw / 1145 | 31.69 / 38.51 / 40.49 / 45.33 px at 320 / 375 / 391 / 430 |
| `BINDINGS`, `NAV_HIT`, `SECTION_W`, `LOGO_PLATE`, `HOME` | — | unchanged | |

† The asset test's lighting window (`ROW_MEDIAN`) was [520, 1620), three columns short of the old plate. It is now [520, `PLATE.x0` − 3), the same rule. Taking 22 wood columns out of that median flips two borderline columns. The pixels of both are unchanged, measured on the unencoded re-cut. Every window from 1530 to 1600 flips them the same way.

## 4. The six sections, the hit rectangles and the glow

- `SECTION_W` and the six-sections-equal pins of FIX-ARROW-SECTIONS (c2) are untouched and green.
- The hit rects (e) and padTarget (f) are green. So are the glow arms (j), with About's glow 2 columns shorter (§3).
- The slip's font is unchanged at every width: 10 px on phones, 11 and 12 px on the full arrow.

## 5. Pins (re-keyed by identity and cause)

- **The red-first pin, new:** `arrowGeometry.test.js`, "(b2) the blank plate is centred between binding 7 and the arrowhead's binding, within one column".
  - At the parent, the geometry file `git show`n back in place: RED, `plate centre 1750, span centre 1727.5: expected 22.5 to be less than or equal to 1`. Green at the tip.
  - It also holds the gaps equal within one column, and the slip, field and rivets at their painted offsets from the plate's left tip.
  - Its CONTROL convicts 1623–1877.
- **`arrowGeometry.test.js`, the plate's cut:** 1596 → 1586, plus `cut + FE ≤ PLATE.x0`.
- **`arrowGeometry.test.js`, COMPACT_W:** 558 + (2133 − 1586).
- **`arrowGeometry.test.js`, the 375 px band:** 22.47 → 22.27.
- **`arrowPaint.test.jsx`:** `SLOT_TONE[1596]` → `[1586]`.
- **`publicChromeFloor.census.test.js`:** the slip widths are now [31.69, 38.51, 40.49, 45.33]. The 12 px crossover is 629/630 (it was 624/625); it moved UP, and the exception covers no new phone.
- **`accountMenuRows.test.jsx` (h):**
  - At 390 px the plate's padded right edge is 295.31, under the 300 a right-aligned menu needs, so the menu now shifts 4.69 px. It joins the shifting widths.
  - 400 px holds the right-aligned side; the edge clears 300 from 397.
  - The title is re-keyed accordingly.
- **`arrowHeaderAssets.test.js`:**
  - the file pins (bytes, sha256, kitSha256, restored), with the ceiling unchanged;
  - the lighting window (§3);
  - `SLOT_TONE[1586]`;
  - (f2) binding 1's cord runs read [514, 545) as one, not [514, 536) + [537, 544). This is encode noise at columns 536 and 544; `BINDINGS[0]` is unchanged;
  - (g) INK clears 3:1 on row 26 too, and the NEGATIVE row list loses 26. The cause is the reference set, `WOOD_COLUMNS`, which lost 23 columns.
- **One bound MOVED BY MEASURE (§7):** (e) the filler's alpha edge against the wood runs' is now ≤ 23 (it was ≤ 20, "measured at most 17"). It measures 22.24 at row 67 (15.3 at the parent). The reference set lost 23 columns of the run whose edge sits highest (alpha 61 at row 67 against the tile's 110). The tile and every kept column are unchanged.
- **Suites.** All 24 suites that touch the arrow, the plate or the slip were run, `dossierPhoneFloorAllViews` included: 458 passed and 2 skipped. The only failures are the 4 declared below. eslint exits 0 on the touched files.

**Declared red, inherited by any re-cut:** `tests/build/brandDerivatives.test.js`, four arms:
- "arrow-strip.webp is byte-for-byte the strip the rects were read off" (STRIP_SHA256);
- ARM B, the mint's input digests: the strip and the register;
- its two plants, which assume a tree matching the mint.

The wax-seal, plaque and wordmark rect arms are GREEN on the new strip. The mint can only be re-cut where the fresh run is byte-identical to the shipped files. That is the darwin minting stack: here, at the base and on unchanged inputs, 6 of the 10 outputs differ in bytes from the shipped files. So `--record` refuses on linux by its own guard. The remedy is the owner's Mac: `node scripts/derive-brand-marks.mjs && node scripts/derive-brand-marks.mjs --record`.

## 6. The screenshots and the measured gaps

**Where they are.** The session scratchpad `shots/`: `before-<w>.png` and `after-<w>.png` for w = 320, 375, 768, 1024, 1440 and 1920, plus `compare.png`.

**How they were taken.**
- Chromium via Playwright, deviceScaleFactor 2.
- The app in local-data mode: `VITE_E2E_LOCAL_DATA=true npx vite`. The parent is served from a clean worktree at `d46ce9503`, the tip from this checkout.
- In both, the page's plate and slip rects equal `layoutArrow`'s to 0.01 px.

**The gaps.** In CSS px: the wood from the left binding's edge (on the full arrow, binding 7, its slot included; on the compact arrow, the tail crop's join) to the plate's left tip, and from the plate's right tip to the arrowhead's binding.

| width | before: left / right | after: left / right |
|---|---|---|
| 320 (compact) | 7.6 / 3.4 | 4.2 / 9.5 |
| 375 (compact) | 8.9 / 4.0 | 4.9 / 11.1 |
| 768 (compact) | 16.2 / 7.2 | 9.0 / 20.4 |
| 1024 (full) | 27.4 / 5.8 | **16.8 / 16.3** |
| 1279 (full) | 34.2 / 7.2 | **21.0 / 20.4** |
| 1440 (full) | 57.1 / 7.2 | 43.9 / 20.4 |
| 1920 (full) | 125.7 / 7.2 | 112.5 / 20.4 |

**What they show.**
- **1024 px.** Before, the plate sits hard against the arrowhead's binding with a long run of wood on its left. After, it reads centred in its section, with equal wood on both sides.
- **Compact widths (320 to 768).** The plate now has clear wood between its right tip and the arrowhead's binding. Its left side meets the tail crop's join and the filler wood, so the section reads as one length of wood with the plate in it.
- **1440 and 1920.** The plate is still visibly nearer the head (finding 3, §7).
- **Seams.** The fill beside the right tip reads as continuous grain at 1×. At 8× its lower edge is continuous and no column step shows.

## 7. For the chair's ruling

1. **The derivation and its mint (STOP 1).**
   - **My default, as built:** the derivation is untouched and brandDerivatives is red on its four mint arms.
   - **Option A:** re-mint on linux, which moves `mintedOn`.
   - **Option B:** preserve the old strip for the derivation. It still needs the Mac for the mint.
2. **The filler's edge bound, 20 → 23, moved by measure (§5).** The alternative is to keep 20 and declare it red.
3. **Finding 3: above 1279.8 px the plate's slot opens only before the plate.** At 1440 and 1920 the re-cut cannot centre it.
   - Splitting that part around the plate would take a second cut in the right gap, which is 34 columns now. That is a geometry change outside this brief, not built.
   - The fill there is the left run's texture lit to the gap's shade. By the detector it is NOT plain wood (the gap's shade counts as dark against the shaft's median), so such a cut would need its own margin ruling.

4. **The first-paint gzip budget is +1 B at the tip (§8).** The budget has zero slack and I did not move it. A buy-back by blind entropy trials (a build is about 4 minutes each) was not attempted without your word.

## 8. The generator deltas, the walkers and the budgets

**The generator deltas** were measured with `scripts/audit/landing-stage.sh measure`, run on clean worktrees at the parent `d46ce9503` and at the re-cut `88f199b7e`, the parent as the previous stage. Expected 0; measured 0 on every surface:
- gm: 0/525 moved (sha `5f77f02f…` at both);
- fence: 0/360 (corpus `5bc02d54…` at both);
- herald: 0/475;
- prose: 0/1,050;
- witness: 0/8;
- pdf: 0/18 snapshot rows.

**The three record walkers** at the tip:
- `sourceCitationIntegrity.walker`: green with `dated` 168 → 169 (this record), the note `_rosterGrowth2026-11-09-fix-arrow-plaque` and the header line;
- `ledgerCitationIntegrity`: green, 10/10, after `git fetch origin review-fixes-2026-07-08` and a local branch ref the test reads;
- `recordRegisterTotality.walker`: green.

The inherited roster `tree` red the brief named does not show at this base. The walker is 18/18, and `tree` was not touched.

**The first-paint budgets** (`tests/build/vendorPdfLazy.test.js`, `VERIFY_DIST=1`, a fresh `npm run build` at each tree; the parent green, the tip red on gzip by one byte):

| | parent `d46ce9503` | tip `88f199b7e` | budget |
|---|---|---|---|
| raw | 1,075,589 | 1,075,588 (−1) | 1,075,589 |
| gzip | 342,846 | **342,847 (+1)** | 342,846, zero slack |
| Brotli | 288,452 | 288,295 (−157) | 288,452 |

- **What is new in the entry chunk:** only `arrowGeometry.js`'s re-measured digits — the plate's cut and the compact join 1596 → 1586, SLOT_TONE 0.802 → 0.81, NAV_WORD.about 1502 → 1500, and the PLATE and SLIP numbers.
- **What is not:** the WebP is not in the closure, and its bytes fell 580.
- **The budget is not moved.** A rise is the owner's. The STOP and my default are in the hand-back message: the chair rules between a buy-back probe in the entry and a re-record at the measured figure.

CONFIRMED against PLAUSIBLE:
- **CONFIRMED:** the centring, in the geometry (red-first) and in the built page; every constant's re-measure; the screenshots.
- **PLAUSIBLE:** that the owner's eye reads the fill as the painting's own wood; `BINDINGS[7].x0` = 1889 (§1).

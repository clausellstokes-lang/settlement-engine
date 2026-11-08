# FIX-ARROW-SECTIONS — the painted arrow header's six sections equal between their red bindings (2026-11-08)

**Seat:** FIX-ARROW-SECTIONS. **Brief:** `docs/chair/2026-11-08/BRIEF-FIX-ARROW-SECTIONS-2026-11-08.md`. **Base:** `82cc9b88`. **The owner's word (verbatim):** "You know the arrow at the top of the webpage. The spacing between the sections ( represented by the banded thread red) are not equally spaced and scales as such can you do that for me?"

**STATUS: STOPPED ON A CEILING.** Nothing committed. The build crosses the zero-slack first-paint closure in `tests/build/vendorPdfLazy.test.js` (§5). The chair rules.

## 1. Measured first (`layoutArrow`, the code at the parent)

The chair's §1 is CONFIRMED. In strip px the sections are 121 / 134 / 124 / 160 / 145 / 133. Compendium had no cut, so it stayed at 96.0 CSS px at every slotted width while the other five grew by 2/12 of every extra pixel.

## 2. Before → after (CSS px; the same in the page, from the six nav controls' `getBoundingClientRect`, and from `layoutArrow`)

| width | before: Create · Library · Realm · Compendium · Gallery · About | after |
|---|---|---|
| 1024 | 58.1 · 64.3 · 59.5 · 76.8 · 69.6 · 63.8 | unchanged (uncut painting) |
| 1280 | 72.6 · 80.4 · 74.4 · 96.0 · 87.0 · 79.8 | unchanged (uncut painting) |
| 1440 | 99.3 · 107.1 · 101.1 · 96.0 · 113.7 · 106.5 | 104.6 × 6 |
| 1920 | 179.3 · 187.1 · 181.1 · 96.0 · 193.7 · 186.5 | 173.2 × 6 |
| 2560 | 286.0 · 293.8 · 287.8 · 96.0 · 300.4 · 293.2 | 264.6 × 6 |
| 3840 | 499.3 · 507.1 · 501.1 · 96.0 · 513.7 · 506.5 | 447.4 × 6 |

From 1380 to 3840 the largest spread is 1.1e-12 px. The plate's slot is one seventh of the extra width: at 1920 the span from binding 7 to binding 8 is 285.3 px, against 300.5 before.

## 3. What changed (`src/components/nav/arrowGeometry.js`)

- **Per-cut crossfade.** Each cut now has its own `fe`. Compendium gets two cuts, at 1032 and 1181, with `COMPENDIUM_FE = 5`. Its plain-wood gaps are [1027, 1037) and [1176, 1187). Its tones were measured with the asset test's own formula: 1032 → 1.050, 1181 → 0.975. Segment fades and filler spans use the cut's `fe`, and a filler is pushed for every join, so a hard cut with `fe` 0 works too. `ArrowPaint.jsx` is unchanged: it reads `fe` only through the layout, and its own FE is used only by the compact join.
- **Equal allocation.** `fullScale` works in seven parts. Six go to the sections and one to the plate. Each section's width is T = mean painted width × s + one part, and its two slots split T − painted × s equally (`fullSlots`). `SHARES` and `MIN_SHARE_PX` are retired; `SECTION_W`, `SECTION_W_MAX`, `SECTION_W_MEAN`, `PARTS` and `EQUAL_EXTRA` take their place.
  - The painting stays uncut below (2133 + 166.83) × 0.6 = **1379.9 px**.
  - s holds at S_MAX up to **4340.9 px**, where Create's slots each reach one filler tile. Above that, s grows.
- **The hover glow** (a NOTE). Compendium's glow box (its lettering ± 10 columns) would now straddle its own cuts, so the glow would stretch across both slots and grow with the page. `glowSpan` clips a word's glow pad at a cut, so Compendium's pad becomes 5 columns and its glow is exactly its middle segment. Every other word keeps ± 10. Clipping keeps the glow's shape fixed; the other choice is to let it stretch. The chair may veto.

## 4. NOTE — the scale jump at the threshold

In the uncut zone s = cw / 2133 climbs to 0.647. When the slots open at 1380 it drops back to 0.600, so the arrow shrinks about 7% across one pixel (today the drop is 0.611 → 0.600, about 2%). This follows from the brief's rule that the painting stays uncut until all six can be equal. A continuous alternative exists: water-fill the narrow sections first from 1280, which keeps s at 0.6, then equal from 1380. That would be a design change, so it is the chair's or the owner's call.

## 5. STOP — the first-paint ceiling (`tests/build/vendorPdfLazy.test.js`)

The parent sits exactly on the budget (zero slack). After slimming my addition:

| measure | after | budget | over by |
|---|---|---|---|
| raw | 1,073,029 | 1,072,488 | 541 |
| gzip | 341,947 | 341,647 | 300 |
| Brotli | 287,704 | 287,527 | 177 |

The bytes are all in the entry chunk's `arrowGeometry` (the first build was +726 raw). Nothing in my manifest buys back 300 B gzip. The budget was not raised. `npm run build` exits 0. `verify:dist` exits 1 on these three rows. Its other row, `engineAbsentWhenRemote`, is SKIPPED, not failed.

## 6. Pins

- **`tests/components/arrowGeometry.test.js`**, re-keyed by cause:
  - "none on Compendium, two shares at the plate" → "two on Compendium at fe 5, the plate's cut last".
  - The Compendium-gaps pin now pins one cut each at fe 5.
  - Zones: 1379/1380, 4340.9 and 4400.
  - Hit widths read the region's own slots.
  - Tile cap: no word slot over one tile, and the plate's slot no more than two.
  - Glow: clipped pad, Compendium's glow equals its middle segment.
  - New controls: FE at 1032 is convicted; a Compendium filler laid at FE is convicted; the equality check convicts the uncut painting at 1379.
  - New **(c2)**: equal within 1 px at every width from 1380 to 3840, never shrinking as the page widens, ending exactly at the page width, with 2461 widths counted (anti-vacuity).
  - **Red-first:** run on the parent, (c2) reds at "1380: sections 89.3 97.1 91.1 96.0 103.7 96.5".
  - **Note:** the first version of the pin passed vacuously on the parent. Its start width came from a new export, which is undefined there, so the loop ran over NaN. The threshold is now a literal, held to the derivation in (d).
- **`tests/build/arrowHeaderAssets.test.js`:** the cut-margin pin reads each cut's own `fe`. A new CONTROL shows FE at Compendium's cuts finds ink on both sides. `SLOT_TONE` re-measures the two new tones.
- **`tests/components/arrowPaint.test.jsx`** is outside the manifest and was put to the chair. Its "segments fade at their inner ends only" pin assumes a uniform FE mask. The re-key is held, unapplied, at `/tmp/claude-0/-home-user-settlement-engine/2491b798-ce69-5722-9eb5-2e9553cd8c1a/scratchpad/arrowPaint-rekey.patch`: each mask follows its cut's `fe`, and segments 0, 6, 7, 8 and 13 differ from the middle. With it applied the file passes 16/16.

## 7. Gates (at the uncommitted tree)

- **Arrow suites:** 17 files, 361 passed and 1 failed. The failure is the arrowPaint mask pin above; with the held patch, 0 fail. `arrowGeometry` 39/39.
- **eslint** on the touched files: exit 0.
- **Type configs:** `tsconfig.json` 167 and `tsconfig.full.json` 172 errors, the same as the parent, none on the touched paths. `tsconfig.ui-boundaries.json` exits 0.
- **Build:** `npm run build` exits 0. `verify:dist` exits 1 (§5).

## 8. Screenshots

All under `/tmp/claude-0/-home-user-settlement-engine/2491b798-ce69-5722-9eb5-2e9553cd8c1a/scratchpad/shots/`, at deviceScaleFactor 2, from the built app served by `vite preview`:

- the header, `{before,after-fe5,after-fe0}-{1024,1280,1440,1920,2560,3840}.png`;
- Compendium close-ups, `…-compendium.png`;
- seams zoomed 4×, `seam-{after-fe5,after-fe0}-{1440,1920,2560,3840}-{left,right}.png`.

**The Compendium seams, plainly:**

- **fe 5:** the inserted wood reads as one continuous length of shaft. No edge can be seen at either end of the slot, even at 4×.
- **fe 0 (hard cut):** each slot shows a straight vertical edge at both ends, a step in brightness and in grain. It is visible in the 4× crops at every width and plain at 1920 and wider.

The owner chooses between them. My measurement favours fe 5 (PLAUSIBLE: judged from crops, not by the owner's eye).

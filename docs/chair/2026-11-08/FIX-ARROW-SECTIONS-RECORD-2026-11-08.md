# FIX-ARROW-SECTIONS — the painted arrow header's six sections equal between their red bindings (2026-11-08)

**Seat:** FIX-ARROW-SECTIONS. **Brief:** `docs/chair/2026-11-08/BRIEF-FIX-ARROW-SECTIONS-2026-11-08.md`, as amended by the chair's rulings of 2026-11-08: water-fill, arrowPaint joining the manifest, fe 5 chosen, the ceiling order. **Base:** `82cc9b88`. **The owner's word (verbatim):** "You know the arrow at the top of the webpage. The spacing between the sections ( represented by the banded thread red) are not equally spaced and scales as such can you do that for me?"

**STATUS:** the geometry, the pins and the screenshots are done. The first-paint ceiling is still over (§5) and waits on the chair's step (c) ruling.

## 1. Measured first (`layoutArrow` at the parent)

The brief's §1 is CONFIRMED. The painted sections are 121 / 134 / 124 / 160 / 145 / 133 strip px. Compendium had no cut, so it stayed at 96.0 CSS px at every slotted width while the other five grew by 2/12 of every added pixel. The sections diverged as the page widened, up to a 417.7 px spread at 3840.

## 2. Before → after (CSS px)

Measured in the built page from the six nav controls' `getBoundingClientRect`. `layoutArrow` gives the same figures.

| width | before: Create · Library · Realm · Compendium · Gallery · About | after |
|---|---|---|
| 1024 | 58.1 · 64.3 · 59.5 · 76.8 · 69.6 · 63.8 | unchanged (the painting, uncut) |
| 1280 | 72.6 · 80.4 · 74.4 · 96.0 · 87.0 · 79.8 | 72.8 · 80.4 · 74.4 · 96.0 · 87.0 · 79.8 (water-fill begins: Create +0.2) |
| 1440 | 99.3 · 107.1 · 101.1 · 96.0 · 113.7 · 106.5 | 104.6 × 6 |
| 1920 | 179.3 · 187.1 · 181.1 · 96.0 · 193.7 · 186.5 | 173.2 × 6 |
| 2560 | 286.0 · 293.8 · 287.8 · 96.0 · 300.4 · 293.2 | 264.6 × 6 |
| 3840 | 499.3 · 507.1 · 501.1 · 96.0 · 513.7 · 506.5 | 447.4 × 6 |

**Catch-up width (all six level): 1379.9 CSS px.** From there to 3840 the largest spread is about 1e-12 px. Water-fill along the way: at 1300 Create, Library, Realm and About sit level at 81.1 while Gallery is still 87.0 and Compendium 96.0; at 1340 every section but Compendium is level at 89.2.

## 3. What changed (`src/components/nav/arrowGeometry.js`)

- **Per-cut crossfade.** Each cut carries its own `fe`. Compendium takes two cuts, at 1032 and 1181, with `COMPENDIUM_FE = 5`; its gaps are 10 and 11 columns of plain wood. The chair chose fe 5 over the hard cut from the seam screenshots; the owner may veto. The new slot tones were measured with the asset test's formula: 1032 → 1.050, 1181 → 0.975. Each join carries its crossfade width, and a filler is pushed at every join.
- **Scale.** s = min(S_MAX, W / 2133) at every width, the chair's ruling.
  - The painting is shown uncut, and shrinks with the page, below 1279.8 px.
  - From 1279.8 the scale holds at S_MAX. s never passes S_MAX and never jumps.
  - This also cures a pre-existing flaw: the parent's double-share threshold dropped s from 0.611 to 0.600 at 1303.8 px (Create 73.9 → 76.6 across one pixel).
  - The tile zone above 3958 px (4340.9 in my first cut), where s grew so a slot never repeated the tile, is gone along with its pins. A slot wider than one tile repeats the tile, which the filler's repeat-x always allowed.
- **Water-fill** (`waterLevel`, `fullSlots`).
  - The sections take six parts of the extra width and the plate's slot takes one part in seven throughout.
  - The sections' wood goes to the narrowest one(s) until they draw level with the next; from the catch-up on, all six grow together.
  - A section's two slots split its wood equally and stay at zero width until it needs wood. A zero-width slot reproduces the uncut painting exactly.
  - `SHARES` and `MIN_SHARE_PX` are retired.
- **Hover glow (NOTE).** `glowSpan` clips a word's glow pad at a cut. Only Compendium's pad changes, from 10 to 5 columns; its glow is now exactly its middle segment, so it never stretches across a slot.
- **Bytes (step (b), same behaviour).**
  - Every `Object.freeze` is annotated `@__PURE__`; Rollup was already dropping the dead tables, so this gained nothing in the real bundle.
  - `SECTION_W_MAX` and `SECTION_W_MEAN` are literals, pinned to their derivation by the tests.
  - CUTS is generated from a list of columns.
  - The crossfade width rides on each join instead of a parallel array.

## 4. Pins (all re-keyed by cause, none loosened)

- **`tests/components/arrowGeometry.test.js`**
  - The cut table now reads "two on Compendium at fe 5" and keeps a CONTROL that convicts a full-FE cut there.
  - (c) checks tiling with per-cut fe and s ≤ S_MAX.
  - New **(c2)** arms:
    - equal within 1 px from 1380 to 3840, counting all 2461 widths so it can't pass on an empty range;
    - the water-fill invariant at every half pixel below the catch-up: no section below its painting or shrinking, each either level or still its painting;
    - named water-fill widths;
    - **continuity**: s and every section move by at most 1 px per page pixel through both old thresholds;
    - a CONTROL that the uncut painting is convicted.
  - (d) holds s = min(S_MAX, W/P) and the zone constants.
  - (e) hit widths are read from the region's own slots.
  - (j) the glow is clipped.
  - **Red-first.** On the parent, the equal-sections arm fails ("1380: sections 89.3 97.1 91.1 96.0 103.7 96.5") and continuity fails ("1303: section 0 73.92 → 76.63"). On my threshold cut `acd19b4b`, continuity fails ("1379: section 0 78.23 → 96.01") and the water-fill arms fail too.
  - **Deviation from the chair's spec.** The chair asked for |Δ| ≤ 1 px between W−1 and W+1. While one section alone is the narrowest it takes the sections' whole share, 6/7 px per page pixel, so two pixels move it 1.71 px. The pin measures W to W+1 instead, keeping the 1 px bound; the jumps it exists to catch were 2.77 px and 17.8 px.
- **`tests/build/arrowHeaderAssets.test.js`:** the cut margin reads each cut's own `fe`. A CONTROL shows that FE at Compendium's cuts finds ink on both sides. `SLOT_TONE` re-measures the two new tones.
- **`tests/components/arrowPaint.test.jsx`** (joined the manifest by the chair's ruling)
  - Each middle mask follows its cut's fe. Masks 0, 6, 7, 8 and 13 differ from the uniform middle.
  - Its uncut example moved from 1280 to 1279, because the slots now open at 1279.8. This second arm is the direct consequence of the ruled cause; I told the chair and it can be dropped.

## 5. The first-paint ceiling (`tests/build/vendorPdfLazy.test.js`; zero slack at the parent)

| | first cut (threshold) | after water-fill, before (b) | after (a)+(b) | budget |
|---|---|---|---|---|
| raw | 1,073,029 | 1,073,193 | 1,072,722 (+234) | 1,072,488 |
| gzip | 341,947 | 342,013 | 341,881 (+234) | 341,647 |
| Brotli | 287,704 | 287,695 | 287,676 (+149) | 287,527 |

**The chair's second ceiling ruling (lazy-load refused; steps 1–3), each step measured against the parent's real bundle** (sourcemap attribution of the entry chunk, `src/components/nav/arrowGeometry.js` the only module that differs):

| step | raw | gzip | Brotli | verdict |
|---|---|---|---|---|
| start (water-fill, `0a6d0fc2`) | +234 | +234 | +149 | — |
| (1) the glow clip alone, measured by removing it | −169 | −49 | −113 | does not close the gap alone, so it STAYS, by the ruling |
| (2) literal sections, sorted widths and PARTS; `waterLevel` as the least running mean; `fullSlots` reads NAV_HIT directly | → +116 | → +194 | → +107 | still over |
| (2) further trims tried by probe: CUTS as 13 literals (+12 gzip, rejected); `stripPx` dropped (−12, test-read, not taken) | | | | each about ±10 gzip |
| (3) zero-behaviour buy-back: every top-level binding in the entry chunk parsed (acorn) for references and export-list membership | | | | **none found**: 0 unreferenced, unexported bindings; Rollup keeps nothing dead at binding level |

After (1)–(3) the entry is still over by **+116 raw, +194 gzip and +107 Brotli**, and none of the chair's three doors closes it. The ceiling was not raised and nothing was lazy-loaded at this stage.

**The chair's third ruling (the ceiling law, corrected): RE-RECORDED at the measured tip, every byte attributed.** The glow clip is kept. Each part was measured as the tip minus an `npm run build` without that part, read by this file's own arms:

| | raw | gzip | Brotli |
|---|---|---|---|
| parent `82cc9b88` (old budget) | 1,072,488 | 341,647 | 287,527 |
| + Compendium's glow clip (tip − build without it: 1,072,435 / 341,751 / 287,551) | +169 | +90 | +83 |
| + Compendium's two fe-5 cuts, their tones and the per-cut fe (tip − build without them: 1,072,547 / 341,803 / 287,527) | +57 | +38 | +107 |
| + the water-fill allocation, the remainder (replaces shares, threshold and tile zone) | −110 | +66 | −83 |
| **= the lane tip, re-recorded in `tests/build/vendorPdfLazy.test.js`** | **1,072,604** | **341,841** | **287,634** |

Compressed parts don't add exactly; each is measured, and the remainder is named. The pin's comment carries the same attribution. Under the chair's ruling this lane is MERGE-WAVE's eleventh lane, merged last, and its figure is re-measured at the wave's final tip.

**Superseded**, the first step-(c) candidate (refused by the chair): lazy-load `src/domain/aiOverlayVerifier.js`, which is 4,943 B raw and 1,680 B gzip in the entry chunk. Its sole importer is `store/aiOverlayLifecycle.js :: runOverlayVerifier`; one of its three callers, `setAiSettlement`, is synchronous. I examined and set aside `staleDeploy.js` and `customContentAdmission.js` (eager by design) and the event pipeline (a structural change).

## 6. Gates

- **Geometry, asset and paint suites:** 88/88. All 17 arrow suites pass.
- **eslint** on the touched files: exit 0.
- **Type configs:** no errors on the touched paths. Repo-wide, `tsconfig.json` 167 and `tsconfig.full.json` 172, the same as the parent; `tsconfig.ui-boundaries.json` exits 0.
- **Build:** `npm run build` exits 0. One run hit Node's heap limit; it passed with `NODE_OPTIONS=--max-old-space-size=8192` set in the environment only.
- **`verify:dist`:** red on the ceiling (§5).

## 7. Screenshots

All under `/tmp/claude-0/-home-user-settlement-engine/2491b798-ce69-5722-9eb5-2e9553cd8c1a/scratchpad/shots/`, at deviceScaleFactor 2, from the built app served by `vite preview`:

- the header: `before-*`, `after-wf-*` (water-fill, fe 5, the build in this commit), and the earlier threshold builds `after-fe5-*` and `after-fe0-*`, at widths 1024, 1280, 1440, 1920, 2560 and 3840;
- Compendium close-ups: `*-compendium.png`;
- seams zoomed 4×: `seam-{after-fe5,after-fe0}-{1440,1920,2560,3840}-{left,right}.png`.

**The Compendium seams:**

- **fe 5:** the inserted wood reads as one continuous length of shaft, with no visible edge at either end of a slot.
- **fe 0 (hard cut):** each slot shows a straight vertical step in brightness and grain at both ends, plain from 1920 px up.

CONFIRMED: the sections are equal, measured both in the geometry and in the built page. PLAUSIBLE: the owner's eye will see no seam at fe 5.

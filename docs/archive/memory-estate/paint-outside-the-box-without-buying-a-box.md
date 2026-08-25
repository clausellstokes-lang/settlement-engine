---
name: paint-outside-the-box-without-buying-a-box
description: "The ribbon's overhang/lap technique — an inline SVG at `inset:0` with `overflow:visible` paints past its border box for FREE, where a taller height / calc(100% + Npx) / negative offset would all price the sticky header and move ANCHOR_OFFSET; plus the two silhouette cuts that passed every pin and still looked wrong"
metadata:
  node_type: memory
  type: project
  modified: 2026-08-03T23:17:47.991Z
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

**THE PROBLEM.** `theme.js` derives `ANCHOR_OFFSET` from `CHROME.headerDesktop`, and every
About / guide / Compendium / dossier in-page anchor in the estate lands on that number. So
the sticky header must not grow by one pixel — but the V3 directive wants the fletch vanes
to peek ~6px BELOW the ribbon and to lap sideways over each other.

**THE TECHNIQUE** (`src/components/nav/GooseFletch.jsx`, shipped @ `ea0be549`):
```
position: absolute; top/right/bottom/left: 0;   // the box is EXACTLY the cell
width: 100%; height: 100%;
overflow: visible;                               // lifts the UA's default svg overflow:hidden
viewBox="0 0 120 48"  preserveAspectRatio="none" // 48 == CHROME.headerDesktop → 1 unit = 1px
```
…then simply DRAW at `y > 48` and at `x < 0` / `x > 120`. Painting outside your own box
costs no box. `overflow` is not a layout property.

**WHAT NOT TO DO — every one of these prices the bar:** a taller `height`,
`height: calc(100% + 6px)`, a negative `bottom`/`marginBottom`, a padded wrapper. The
navFletching overhang census walks every node under `header nav` and fails any
`height/minHeight/maxHeight/margin*/padding*/top/bottom/transform` containing the overhang
value, plus any NEGATIVE vertical offset. ⚠️ Negative HORIZONTAL offsets are deliberately
exempt and `ShaftWrap` uses `right: 100%` — the bar's hazard is vertical only.

**MEASURED RECEIPT** (Chromium, 1440×900, after the V3 rebuild): header **48**, nav **48**,
main-top **48**, each fletch SVG box **48** — byte-identical to V2's numbers. `1 unit = 1px`
is what makes the authored `B = D + FLETCH.overhang` a real measurement rather than a
coordinate that looks like one; keep the viewBox height equal to `CHROME.headerDesktop`.

**⚠️⚠️ TWO SILHOUETTE CUTS PASSED EVERY PIN AND STILL LOOKED WRONG.** Worth remembering
because it is the general shape of "tests green, design bad":
1. A **symmetric shield-cut** vane that stopped inside its own cell → rendered as three
   heraldic escutcheons on a plank, bare wood at every seam. Cure: `LAP`, each vane
   reaching back over the one behind it (later DOM paints on top).
2. Squaring the leading end off **at the quill line** → two hard 90° corners per vane →
   three dark TABS. Cure: `TIP_IN`, a pointed entry a few units below the quill, the way a
   real primary meets its binding.

Both were caught only by SCREENSHOTTING AND LOOKING. The cure was then pinned as geometry:
`navFletching` §2 parses the path's ON-CURVE vertices (discarding Bézier control points,
which pull the curve without lying on it) and asserts the lap, the pointed tip, the rake
toward Realm, and that the vane still covers the label. Regexing literals out of the `d`
string was tried first and was brittle — parse the path instead.

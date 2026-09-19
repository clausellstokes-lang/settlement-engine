---
name: ribbon-ground-move-foreground-break-class
description: "⚠️⚠️ THE HEADER'S GROUND HAS MOVED THREE TIMES (ink bar → cream plank → honey-tan shaft) and EACH move silently broke foregrounds that were correct the day before; nothing but tests/design/contrast.test.js ever notices, because the cells still render, still navigate and still carry aria-current"
metadata:
  node_type: memory
  type: project
  modified: 2026-08-03T23:17:22.326Z
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

**THE CLASS.** The desktop/mobile header repaints have now happened three times, and every
single one broke text tones that were measured-correct against the PREVIOUS ground:

| version | ground | what broke |
|---|---|---|
| V1 | dark ink bar | — (baseline) |
| V2 | cream plank `#F1E5C8` (L 0.789) | `PARCH_100` labels → 1.7–1.9:1; `GOLD` wordmark → 1.85:1; `GREEN` chip → 3.91:1 |
| V3 | honey-tan shaft (L 0.42–0.55) | `GOLD_TXT` 5.75 → **3.38**; `GREEN_DEEP` 5.00 → **2.93**; `SLATE_DEEP` 4.28 → **3.53** |

**WHY IT IS INVISIBLE.** Nothing structural fails. The header renders, every nav cell
navigates, `aria-current` is correct, every layout/derivation pin stays green, and a
screenshot taken against the *old* background looks fine. Only a recomputed contrast ledger
catches it. Both V2 and V3 shipped their repaint and their foreground migration in the SAME
commit only because someone recomputed by hand first.

**HOW TO APPLY — before ANY header ground change, enumerate the riders.** They are not all
in the nav files. The census that mattered in V3:
- wordmark (desktop `src/App.jsx` ~:587, **and the mobile one ~:543** — two spellings)
- reference-tab labels + their active underline (`src/components/nav/NavRibbon.jsx`)
- ghost buttons (`SECOND`) in the header cluster
- ⚠️ **`src/components/AccountMenu.jsx` — `chipBg = 'transparent'`**, so its label AND its
  rule are read against the header paint. This one is OUTSIDE the nav lane and is the one
  that gets missed. It has needed a tone move on both repaints.

**THE V3 RESOLUTION** (@ `ea0be549`): wordmark + active tab → `INK_DEEP` (7.06:1), resting
tab → `BODY` (4.89:1), chip → new `SHAFT_GREEN` `#2A4420` / `SHAFT_SLATE` `#303E4A`
(4.87 / 4.96). The chip's brighter-rule / deeper-label TWO-STEP **collapsed to one tone**,
because on honey wood neither `GREEN` (2.18) nor `GREEN_DEEP` (2.93) clears 1.4.11's 3:1 —
there was no honest two-step left to keep.

**THE GUARD THAT NOW EXISTS.** `tests/design/contrast.test.js` pins all three V2 tones as
NEGATIVE CONTROLS (`expect(ratio(GOLD_TXT, GROUND)).toBeLessThan(AA_TEXT)` etc.), so "just
put the old colour back" reds with the reason attached. Extend that list on the next move
rather than replacing it — the history IS the guard.

**⚠️ THE REFERENCE GROUND IS A GEOMETRIC CLAIM, NOT A TONE.** V3's bar is a *cylinder*, so
it has no single background colour. Measuring against the darkest tone anywhere
(`SHAFT_RIM`) is over-strict by a margin no glyph touches and would force every label to
near-black; measuring against `SHAFT` is a lie. The honest reference is `SHAFT_BODY` — the
darkest tone *inside the label band* — and what makes that true is `SHAFT_STOPS.body`,
which confines the dark falloff below the label box. `tests/components/navFletching.test.jsx`
pins `SHAFT_STOPS.body > (1 + LABEL_BOX/height)/2` on **both** header heights (48 desktop,
59 mobile), so the reference cannot rot when someone retunes the gradient. Without that pin
the whole ledger would be resting on an assumption.

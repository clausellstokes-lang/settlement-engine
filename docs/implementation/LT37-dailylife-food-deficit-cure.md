# REFUSED: the DailyLife food-deficit cure (LT37 car 5)

- **Status:** MEASURED, PATCH WRITTEN, **REFUSED AND NOT APPLIED**. It was carried up as an
  output-moving question under §764.3 and the chair ruled it OUT on this measurement
  (2026-09-15): the band word is identical in 360 of 360 settlements, so the change buys no
  reader-visible correctness and spends a same-seed output risk. **This file is the record of a
  refused cure, not a pending one.** The second read in `dailyLifeLogic.js` is TOLERATED
  DELIBERATELY. Do not re-open it without a new measurement that shows the band moving.
- **Measured at:** `f73bdbf16` (`claude/composite-r4`, the build slot), 2026-09-15, lane LT37.
- **Instrument:** the characterizing block `the third food-deficit surface — DailyLife bands
  the engine reading (LT37 car 5)` in `tests/pdf/screenParitySource.test.js`.

## The finding, and it is not the one the brief expected

Three surfaces render "the food deficit" and two of them were converged by pdf.3 onto
`deriveFoodBalance(s).deficitPct`:

| surface | file | reads |
|---|---|---|
| Economics tab | `src/components/new/tabs/EconomicsTab.jsx:284,310` | `deriveFoodBalance(s).deficitPct` |
| DM summary | `src/components/new/SummaryTab.jsx` | `deriveFoodBalance(s).deficitPct` |
| **Daily Life tab** | `src/components/new/dailyLifeLogic.js:54` | **`fb.deficitPercent` (the engine struct)** |

The recon expected that to be a live divergence: "the same settlement can read Deficit 12% in
Economics and band Severe in Daily Life". **It is not, at this tree.** Measured over 360
generated settlements across six configs (348 of them carrying a food deficit):

| spread between the two readings | settlements |
|---|---|
| 0 points (exact agreement) | 337 |
| 1 point | 21 |
| 2 points | 2 |
| **more than 2 points** | **0** |

and:

- **DailyLife band words identical: 360 of 360.** Zero band flips.
- **Readings straddling a band cut (10 / 20 / 35): 0.**

## Why they agree, read out of the producer

`src/generators/economy/foodBalance.js` carries a CANONICAL RECONCILE
(generators-domain-4, `:281-294`) that makes both readings descend from one model. In the
canonical branch it writes `dailyNeed = Math.round(dailyNeedFinal)` and then RECONSTRUCTS the
lbs figure from the percentage and that same denominator:

```js
const cDeficitPct = Number.isFinite(foodSecurity.deficitPct) ? foodSecurity.deficitPct : 0;
deficit = Math.max(0, Math.min(rawDeficitFinal, Math.round((cDeficitPct / 100) * dailyNeedFinal)));
deficitPercent = cDeficitPct;
```

So `deriveFoodBalance`'s `Math.round(deficit / dailyNeed * 100)` recovers `deficitPercent` up to
DOUBLE ROUNDING (round the lbs, then round the ratio back). The 1-2 point residual is that, and
the clamp into `rawDeficitFinal`, and nothing else. In the non-canonical fallback branch the
denominator is `adjustedNeed` on both sides, which is the same identity.

**The roadmap's pdf.2 / pdf.3 wording describes a tree that no longer exists.** Its claim that
the engine ratio is "pre-import" and therefore disagrees "on every import-dependent settlement"
was true before the canonical reconcile landed. `EconomicsTab.jsx:280-283` still carries that
claim as a comment.

## The patch, unapplied

One line plus one import in `src/components/new/dailyLifeLogic.js`:

```diff
--- a/src/components/new/dailyLifeLogic.js
+++ b/src/components/new/dailyLifeLogic.js
@@ -1,6 +1,7 @@
 // dailyLifeLogic.js — Pure settlement-context extraction for DailyLifeTab.
 import { TIER_LABELS } from './design';
 import { computeEffectiveMagicPresence } from '../../generators/priorityHelpers.js';
+import { deriveFoodBalance } from '../../domain/display/dossierViewModel.js';
 import {
   CULTURE_PROFILES,
   resolveCultureProfileKey,
@@ -51,7 +52,10 @@ export function extractSettlementContext(s) {
 
   // Food
   const fb = via.metrics?.foodBalance;
-  const foodDeficit = fb?.deficit ? fb.deficitPercent || 0 : 0;
+  // A+ pdf.3 — one fact, one source. The deficit percentage comes from the
+  // canonical display model (residual ÷ daily need), the same value the PDF and
+  // the Economics/Summary tabs print, never the engine struct's own rounding.
+  const foodDeficit = fb?.deficit ? (deriveFoodBalance(s).deficitPct ?? 0) : 0;
 
   // fb.surplus is an ABSOLUTE lb/day quantity (economicGenerator), not a
```

## The rows it moves, named

Everything keyed on `ctx.foodDeficit`, all of it in `src/components/new/tabs/DailyLifeTab.jsx`,
reached through the single consumer `extractSettlementContext` (`DailyLifeTab.jsx:7,69`):

1. **`:129-133` the food pressure BAND WORD** — `Severe` / `Serious` / `Strained` /
   `Tightening` / `Surplus` / `Adequate`.
2. **`:135-138` the band COLOUR** — `#5a0a0a` / `#8b1a1a` / `#8a4010` / `#a0762a` / `#1a5a28`.
3. **`:331-336` one sentence of the local Daily Life narrative** — the `>20` arm
   ("bread is dear and the poorest households plan every meal carefully"), the `>0` arm
   ("food is adequate for most families, though prices are watched closely") and the two
   surplus arms.

No other consumer exists: `grep -rn foodDeficit src/` shows the only other `ctx.foodDeficit`
readers are those DailyLifeTab lines, and the identically-named locals in
`EconomicsTab.jsx:308`, `generationCoherence.js:446`, `foodBalance.js:550` and the worldPulse
demographics family are different variables on different objects.

## The case both ways, as it was put, and why the answer was no

- **FOR:** one fact, one source. Three surfaces naming "the food deficit" should not read two
  fields, and the Daily Life tab is the one that got missed when pdf.3 swept only two files.
  The `deficitPercent` read is the exact footgun pdf.2 named.
- **AGAINST, AND THIS IS THE RULING:** it is OUTPUT-MOVING IN PRINCIPLE. The measured
  blast radius is zero band words over 360 settlements, but a 1-2 point spread sitting exactly
  on a cut (10 / 20 / 35) CAN move one, and the third row above is reader-facing PROSE. A
  settlement at a measured 21 / 20 would flip `Serious` to `Strained` and swap one sentence.
- **ALSO AGAINST, and worth the owner's eye:** the 1-2 point spread is DOUBLE ROUNDING, so the
  cure does not make the number more correct, only more consistent. The genuinely correct fix
  for the spread itself is upstream in `foodBalance.js` (stop reconstructing lbs from a rounded
  percentage), which is an engine change with a far larger blast radius and is NOT proposed here.

## Also found, NOT carred (reported, not fixed)

`src/components/new/tabHelpers.js:60-70` exports `foodNarrative()`, which renders
"a X% food deficit" from the same engine `deficitPercent`. It has NO importer:
`ServicesTab.jsx:8`, the only consumer of `tabHelpers`, takes `computeChainSets` and
`computeChainDepthMap` only. It is dead, it carries the same read, and
`tests/lint/economyReadModelCoverage.walker.test.js:182` addresses `tabHelpers.js` by filename,
so deleting an export from it can red a walker. Left alone deliberately.

## The ruling

**REFUSED, 2026-09-15, on the measurement above.** A cure that moves zero band words across 360
settlements is not buying correctness; it is buying tidiness at the price of a same-seed output
risk on a reader-facing sentence. The architectural argument (one fact, one source) is real and
is recorded here so it is not rediscovered as a finding: if the spread ever widens, the
characterizing pin in `tests/pdf/screenParitySource.test.js` reds and names the seed, and THAT
is the event that re-opens this, not a fresh reading of the same code.

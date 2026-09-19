---
name: ""
metadata: 
  node_type: memory
  type: project
  date: 2026-07-22
  tags: 
    - cycle-3
    - prose-seams
    - chokepoint
    - H2
    - structural-prevention
    - closure
    - mutation-coverage
  branch: claude/cycle3-w3-prose-seams
  base: claude/composite-r4 @ 42559cce
  commits: 
    - 16ffd78d
    - f2ecca5e
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T10:38:34.469Z
---

# Cycle-3 Wave 3 — composed-prose seams (reversible display half) SHIPPED

## Why
Cold-review CYCLE3_AUDIT finding **H2**: EconomicsTab rendered economic plot hooks
RAW, leaking the authored `' PLOT HOOK: '` marker (foodBalance.js bakes it in) onto
the DM's dossier. The generator-side seam retire (H5/H6/H7/M1/M3/M4) is owner-gated
T4 (ONE REGEN); THIS wave is the reversible display half only — never edits
generator emission.

## What shipped (branch claude/cycle3-w3-prose-seams off composite-r4 42559cce)
- **Commit 16ffd78d** — CHOKEPOINT `src/lib/proseSeams.js` (new): `normalizePlotHook`
  (strips the `PLOT HOOK:` prefix, byte-identical to the strippers it replaced) +
  `collapseDoubledArticles` (folds `the the`/`the The` seam joins, mirrors the
  generator regex pair). Consolidated the two DISPLAY-side strippers to import it:
  `ViabilityTab._cleanHook` (extraction stays local, strip routes through) and
  `domain/dossier/plotHooks.cleanHook` (deleted, now `normalizePlotHook`). **H2 fix**:
  EconomicsTab.jsx:485 routes hook text through `normalizePlotHook`. Pins:
  `tests/lib/proseSeams.test.js` (11 unit tests, byte-identity oracle) +
  `tests/components/economicsPlotHookSeam.test.jsx` (render pin, reproduce-then-clear
  proven: fails without the strip).
- **Commit f2ecca5e** — GUARD `tests/copy/composedProseSeams.test.js`: regenerates a
  deterministic generator corpus and banks RAW seam-defect counts as a **shrink-only
  baseline** in `tests/copy/.composed-prose-seams-baseline.json`:
  `{plotHookPrefix:336, doubledArticle:51, braceToken:12, theThePrefix:0}`. Closes
  proseLeak's generator-output blind spot (proseLeak only scanned composer output +
  JSX, never `generateSettlementPipeline` output). E-A: registered in the mutation
  manifest + plant #33 in mutation-sweep.sh.

## How to apply / hazards (durable)
- ⚠️ **NAME COLLISION**: `src/generators/aiLayer.js` ALSO exports `normalizePlotHook`
  (generator-side, feeds the AI prompt; pinned by tests/generators/aiLayer.test.js).
  It is DELIBERATELY NOT consolidated — touching it would edit generator emission.
  Two same-named functions in different modules, by design.
- ⚠️ **The guard corpus is reconstructed INLINE**, not imported from the parked
  `tests/property/generatorGoldenMaster.test.js` — importing a `.test.js` re-runs its
  parked/red golden assertions in the importing file. Same generator + seed
  ('golden-master-v3'), equivalent config sweep (tiers×cultures×terrains + threat).
- ⭐ **T4 ONE-REGEN re-bank**: when the owner's ONE REGEN retires the generator-side
  markers (H5/H6/H7/M3), the four baseline counts SHRINK. Re-bank in the SAME commit:
  `UPDATE_PROSE_SEAMS_BASELINE=1 npx vitest run tests/copy/composedProseSeams.test.js`.
  The exact-equality ratchet fails until re-banked (the shrink IS the proof).
- **JUDGMENT (vetoable)**: `normalizePlotHook` strips the `PLOT HOOK:` prefix ONLY —
  NOT camelCase de-leakage. Rationale: the existing display strippers only strip the
  prefix, so routing them through a camelCase transform would risk a display
  golden-shift (GOLDEN-NEUTRAL LAW), and camelKey leakage's only real consumer is
  M1/ChroniclersLetterPanel (owner-gated Wave 9, "NEVER edit"). camelKey stays owned
  by proseLeak's `flagKey` detector (not double-counted here).
- **E-A manifest rule**: `tests/copy/` is an ENFORCER_DIR → any new `.test.js` there
  needs a mutation-coverage-manifest entry (kind mutation/rationale; NOT uncovered —
  that would break the 199 shrink-only baseline). `tests/lib/` and `tests/components/`
  are NOT enumerated (dir + NAME_PATTERN both miss), so the unit test and render pin
  needed no entry. Plant #33 renames a banked class key; proven red→green.
- **Closure**: all 3 consumers (ViabilityTab, EconomicsTab, plotHooks.js) are LAZY.
  proseSeams rides lazy chunks; eager first-paint closure MEASURED unchanged at
  **1,039,961 B** (budget 1,040,000, margin 39 B, Δ=0). Keep proseSeams's importer set
  to exactly those 3 — any eager importer blows the razor-thin budget.

## Verification receipts (CONFIRMED)
- Unit 11/11, H2 render pin 1/1 (+ negctrl proven), guard 7/7, plotHooks/aiLayer/
  component pins 44/44. Full copy+lint families 296/296. eslint 0, domain-strict 0,
  tsc 0, NUL 0. Build OK, VERIFY_DIST 227/227, eager closure 1,039,961.
- ⚠️ **Pre-existing reds at composite-r4 42559cce** (proven red at the base tip via a
  detached base-check worktree — NOT caused by this wave): `aiGroundingBundle.freshness`
  (stale edge bundle) + 4 goldens: `beliefMapGolden`, `pdf/goldenViewModel`,
  `generatorGoldenMaster`, `worldpulseDeityGolden`. (advancePauseResume did NOT flake
  this run.)

## Runner note
Worktree `node_modules` holds only vite caches; deps walk up to the MAIN tree. Run
tests as `/Users/cstokes/Desktop/settlement-engine/node_modules/.bin/vitest run <files>`
with the worktree as cwd.

---
name: lazy-chunk-import-reparents-eager-closure
description: "⚠️ A LAZY chunk's static import of a shared domain module can inflate the EAGER first-paint closure by ~30KB — the bundler re-parents modules imported from both sides; cure = import a leaf, not the heavy public module"
metadata: 
  node_type: memory
  type: project
  date: 2026-07-26
  tags: 
    - hazard
    - bundle
    - first-paint
    - closure-budget
    - layering
  originSessionId: 6d49850a-ab42-4cf7-ba2d-1b3e1bafe5c6
  modified: 2026-07-26T09:21:56.978Z
---

Discovered 2026-07-26 wiring the NPC reroll preservation tail (see [[regen-edit-loss-hazard]]).

## The hazard
"It's in the lazy engine chunk, so it costs zero first-paint bytes" is **not** reliable when the module you import is ALSO reachable from an eager surface. Rollup's chunking moves a module imported from both an eager chunk and a lazy chunk **up into the shared/eager parent**. The lazy importer pays nothing; the first-paint closure pays everything.

Measured: `src/generators/generateSettlementPipeline.js` (lazy, behind `loadEngine()`) added ONE static import of a new pure domain module, which imported `domain/regenerationMode.js` for a frozen rules table. regenerationMode pulls `explanation.js` + `factionProfile.js` + `activeConditions.js` behind it. Result:

- first-paint static closure **1,039,975 → 1,069,691** (+29,716 B) against a 1,040,000 budget with ~25 B of margin. `index-*.js` absorbed it.
- the lazy engine chunk BARELY MOVED (693,203 → 693,171 — it got 32 B *smaller*). So the growth is invisible if you only watch the chunk you think you touched.

## Cure
**Import a LEAF that carries the data you need, not the heavy public module that happens to re-export it.** Split the constant/predicate into its own importless (or near-importless) module; let the heavy plan-builder/composer import the leaf too, and re-export from the old public module so consumers and tests are unaffected.

Here: `domain/regenerationPolicy.js` (rules table + `preservesEntity`, imports only `canonStatus.js`) — closure returned under budget with the same behavior and public API.

## How to apply
- Before adding ANY static import to a generator/engine module, ask whether the target is reachable from an eager surface. If yes, import the narrowest leaf.
- **Measure, never reason**: `npm run build` then `VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js`. Plain `npm run test` SKIPS these (`it.skipIf(!VERIFY_DIST)`) — a green suite proves nothing about bytes.
- The counterfactual build is the only honest attribution: neuter your import, rebuild, diff the printed per-file byte table. The test prints every chunk's bytes on failure.
- Budget constant: `CLOSURE_BUDGET_BYTES` in `tests/build/vendorPdfLazy.test.js`. Raises are OWNER-SIGNED; treat eager Δ as HARD-ZERO until promotion.
- ⚠️ Pre-existing in minifold as of 2026-07-26: the engine-chunk ceiling test (`expected 693171 to be less than 660000`) fails with OR without a given change — confirm by counterfactual before owning it.

---
name: barrel-hop-drags-the-whole-family
description: "A leaf importing a symbol through a BARREL instead of its real definition home drags the barrel's whole closure — this alone closed a 39-module src/domain cycle AND put the 53 kB distanceRead geography on first paint; find the load-bearing edge by cut-one-edge SCC simulation, never by reading imports"
metadata:
  node_type: memory
  type: project
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-07T14:22:50.746Z
---

Repaired 2026-08-07 on branch `claude/composite-r4` (worktree
`.claude/worktrees/minifold`), parent HEAD `c658fb44`. Three walkers were red —
`tests/architecture/layerBoundaries` (a NEW 39-module cycle: `domain/roads/state.js`
+ 38 worldPulse modules), `tests/build/domainGeneratorsBoundary` (3 new
domain→generators edges), `tests/build/userRouteIdentityLeaf` (distanceRead.js back
on the first-paint graph). **All three were the same defect class in different
clothes: a small module reaching for one symbol through a heavy module.**

The four load-bearing edges, each a 1-line import:

- `peaceTermsPrimitives.js` (108 lines) took the 2-LINE string helper `reasonPairKey`
  from `warReasons.js` (1,100 lines, ~25 imports). Cure: moved the function DOWN into
  the zero-import `warReasonTaxonomy.js` leaf; warReasons re-exports it verbatim.
- `negotiationPictures.js` took 7 symbols from the `peaceTerms.js` BARREL. **Not one
  of the 7 is defined there** — they live in peaceTermsAppraisal/CarriedSheet/Drafting.
- `worldState.js` (on the store's critical path) took ONE save-normalizer from the
  691-line `envoyErrand.js` BARREL; its real home is `envoyErrandRecords.js`.
- `warCoalitionLedger.js` took `getSpatialLedger` from the 1,080-line
  `distanceRead.js`. Cure: extracted the 4 namespace accessors into the new
  zero-import leaf `src/domain/spatial/spatialLedgerAccess.js`.

**Why:** ES module import is all-or-nothing per module — importing one symbol pulls
the whole module's transitive closure. A barrel re-export therefore converts a
1-symbol dependency into a whole-subsystem dependency, invisibly. Both defects follow:
the cycle (a leaf reaching up through a barrel that reaches back down) and the
first-paint regression (`main.jsx → store/index.js → store/campaignSlice.js →
worldState.js → …`, so ANYTHING worldState imports rides the browser's critical path).

**⚠ A WALKER NAMES ONLY THE FIRST CHAIN ITS BFS FINDS.** Fixing warCoalitionLedger
exposed a second, longer chain that existed all along. Never conclude one cut is
enough — re-run and re-measure.

**⚠ THE FIRST-PAINT SPLIT INVERTS THE HOUSE RE-EXPORT PATTERN.** deityConstants /
stablePart / userRouteIdentity all re-export from the head so no consumer moves. When
splitting to remove a first-paint edge, the head must **NOT** re-export the heavy half
— that reinstates the exact edge being cut. `negotiationEvaluation.js` is therefore
NOT re-exported from `negotiationPictures.js`, and its 4 consumers moved their import
sites deliberately.

**How to apply:** Do NOT hunt the edge by reading imports — a 39-module cycle has ~80
inner edges and the culprit is 1-2 of them. Build the walker's own graph, then for each
inner edge remove it and recompute the SCCs; the edge whose removal collapses the
component is the back-edge. Scripts kept at
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/0be2ac61-89a4-425a-9361-67c3f5ab1681/scratchpad/`
(`layering-cut-sim.mjs`, `firstpaint-frontier.mjs` — the latter replicates
userRouteIdentityLeaf's `firstPaintSourceGraph` and supports simulated `+add`/`-cut`
edges, so a cure is PROVEN before a line is edited). Before moving a function out of a
file, grep for source-address pins: `couplingRegistryWar.js` stores
`'<path>#<symbol>'` STRINGS that `tests/domain/couplingRegistry.test.js` asserts — the
registry row and its assertion must move in the same commit. Also check
filename-anchored walker exemptions (`ACCESSOR_DEF` in
`tests/lib/spatialLedgerCoverage.walker.test.js` named distanceRead.js by path).
Measured result: first-paint static graph 283 → 246 modules; cyclic SCCs back to the
single allowed baseline.

Related: [[lazy-chunk-import-reparents-eager-closure]],
[[filename-anchored-source-pin-vacuity]], [[first-match-document-pin-class]],
[[hot-files-at-max-lines-ceiling]].

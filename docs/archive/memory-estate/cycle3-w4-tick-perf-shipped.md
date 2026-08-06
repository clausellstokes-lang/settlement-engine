---
name: ""
metadata:
  node_type: memory
  type: project
  date: 2026-07-22
  tags:
    - cycle-3
    - perf-quadratic-tick
    - tickIndices
    - chokepoint
    - byte-identity
    - structural-prevention
    - H17
    - H18
    - M17
    - M18
    - M19
    - M20
    - closure
    - mutation-coverage
    - domain-any
  branch: claude/cycle3-w4-tick-perf
  base: claude/composite-r4 @ 128af63c
  commits:
    - 0d1a906d
    - 7bf8b32c
    - 94431ebd
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  title: "CYCLE-3 Wave 4 (perf-quadratic-tick) SHIPPED — tickIndices chokepoint, byte-identical"
  modified: 2026-07-22T13:38:36.798Z
---

# CYCLE-3 Wave 4 — perf-quadratic-tick SHIPPED (byte-identical)

Three coherent commits on `claude/cycle3-w4-tick-perf` off composite-r4 @ **128af63c**:
`0d1a906d` identity (M19+M20) · `7bf8b32c` chokepoint `src/domain/worldPulse/tickIndices.js` +
conversions · `94431ebd` guard `tests/perf/tickScanBudget.test.js`. NOT folded yet — dispatch-ready
for the manager.

## Why (the fix)
The cold audit's Wave-4 findings were per-advance O(S^2) rescans that emit no output change:
H17 npcAgency (`settlementForState` linear `.find` + `dominantRelationshipContext` whole-graph edge
scan per NPC state), H18 roadsKernel PASS-5 (`warTargets` per-pair `atWarWith` scanning all
edges+channels; `dominionTargets` all-settlement scan), M17 roadsKernel (`tradeNeighbours` recomputed
per NPC + per BFS node; diplomacy `relationshipTypeBetween`), M18 stressorDynamics
(`edgesTouching`/`incomingChannels` full-array filters per source per affected settlement). Cure =
`tickIndices.js`: WeakMap-cached (keyed on the graph / settlements array) per-advance indices, each
built by ONE pass reproducing the exact scan (same elements, order, first-wins, short-circuit).
Ratchet measured **1.84x** for S 4->8 (quadratic ~4x), fallbacks===0.

## How to apply / hazards (durable)
- ⚠️⚠️ **BYTE-IDENTITY HARNESS MUST FREEZE THE CLOCK.** A full-result serialization of
  `simulateCampaignWorldPulse` is NON-deterministic run-to-run because of timestamp metadata
  (`nowIso()`/`Date.now()` on updatedAt), even though the SIM LOGIC is seed-deterministic. Freezing
  `globalThis.Date` (constructor + `.now`) makes it deterministic. I lost a long detour "proving"
  M19/M20 diverged — it was pure clock noise; frozen, both are byte-identical. Any future same-seed
  full-output diff harness on this engine: freeze Date first, or every diff is a false positive.
- **M20 IS byte-neutral** (swap `ensureRegionalGraph` -> branded `ensureRegionalGraphOnce` in
  buildWorldSnapshot). Earlier "divergence" was the clock. The only real difference is the
  `regionalGraph.updatedAt` metadata (reused vs re-minted), non-semantic.
- **M19** memoizes the OFF-STAGE participation view on the SOURCE settlement identity
  (`participationViewCache`) so `derivationCache` finally hits for off-stage settlements. Shipped
  INLINE in buildWorldSnapshot (not a helper) to keep worldSnapshot.js **any-free** — a
  `@param {any}/@returns {any}` helper tripped the domain-any ratchet (+2 over baseline 12).
- **tickIndices assumes NORMALIZED edges (from/to present).** The snapshot's regionalGraph is always
  `ensureRegionalGraph`d, so the `edge.source`/`edge.target` fallback inside
  `dominantRelationshipContext` is dead — I dropped its now-redundant `from !== sid && to !== sid`
  touch-guard (net-zero offset for the +1 import: **npcAgency.js effective lines must stay EXACTLY
  833**, the frozen sizeBaseline). If edges ever ship without from/to, the edge/war/trade indices
  (keyed on `edge.from`/`edge.to`) would diverge — they never do post-ensure.
- **domain-any + domain-strict together** are the trap for a NEW src/domain file: it must be BOTH
  any-free AND strict-clean, yet its `any`-typed consumers (npcAgency etc.) must gain no strict
  error. Cure used: `@template T` generics on the element-returning indices so the caller's element
  type flows through (any in -> any out, zero consumer casts); `Record<string, unknown>` +
  `asObject`/`String` coercion for the war/rel functions. Removing `any` casts from consumers
  (settlementForState, edgesTouching) ratcheted npcAgency 88->87 and stressorDynamics 60->59 in
  `tests/lint/.domain-any-baseline.json` (via `count-domain-any.mjs --update`, scoped-safe here
  because only my files differed).
- **tickIndices stays OUT of the first-paint closure** (deep-engine consumers only, verified: no
  closure chunk carries `__tickIndexStats`). Closure = **1,039,868** vs base 1,039,961 = **-93 B** — a
  benign, DETERMINISTIC Rollup ENTRY-CHUNK (`index.js`) minify/rebalance, entirely favorable, well
  under the 1,040,000 budget. A shrink from deep-engine edits is the shared-chunk-rebalance class
  (cf. the +42-49B WAVE-B lesson).
- **Guard = tickScanBudget** (E-F sibling in tests/perf/): ratio<=2.6x + fallbacks===0 + engagement +
  determinism + a SELF-PROVING pre-index raw-scan proxy (asserts the ceiling discriminates) + a
  zero-runtime **source-scan HABITAT guard** (the ratchet counts cost THROUGH the indices, so a
  revert-to-raw slips past both it AND the byte-identity goldens — the source scan pins each flagged
  site to its index call). Both teeth **plant-proven red->green** (super-linear build -> ratchet 6.09x;
  warTargets revert -> habitat red). Registered `kind:rationale` in the E-A mutation-coverage manifest
  (a new invariant test file with a `readFileSync` source-scan is enumerated and MUST be manifested,
  unlike plain tickOpBudget).
- **RUMOR_TRADE_CHANNEL_TYPES = `['export_market','trade_dependency','trade_route']`** — IMPORT it
  (and `compareCodepoint`) from rumorNetwork/deterministicSort; my first inline guess was wrong
  (missing export_market). tradeNeighbourIndex reproduces rumorNetwork.tradeNeighbours byte-for-byte.

## Receipts (CONFIRMED)
Frozen-clock same-seed full pulse, 3 seeds x S=4(30 advances)/S=8(20 advances) = 150 advances,
byte-EQUAL base-vs-branch on all 6 keys. Focused: worldSnapshotCache.byteIdentity + roads/seaRoads
dormancy goldens + roadsParticipation 44/44; roadsKernel/embassy/missions/stressorCounterforces/
npcAgency/worldPulse/occupation 94/94; guard 4/4. Gate: domain-strict 0, tsc 0, eslint 0,
domain-any (tickIndices 0), NUL 0, transcendental pass, sizeBaseline pass, controlBytes pass;
verify:dist 227/227; aiGrounding freshness 20/20; lint+docs 329/329.

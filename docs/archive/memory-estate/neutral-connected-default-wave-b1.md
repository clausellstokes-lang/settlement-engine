---
name: neutral-connected-default-wave-b1
description: "WAVE B1 neutral-connected default (realm directive 2 / J-D2) BUILT DARK 2026-07-31 UNCOMMITTED; ⚠️ lighting it realm-wide is QUADRATIC and reds tests/perf/tickScanBudget.test.js — the blocker is asymptotic, not golden churn"
metadata: 
  node_type: memory
  type: project
  modified: 2026-07-31T16:13:32.042Z
  originSessionId: c69772bd-e324-4e1d-b1ee-b7482c7741fc
---

WAVE B1 — THE NEUTRAL-CONNECTED DEFAULT (docs/DESIGN_REALM_DIRECTIVES.md directive 2, judgment J-D2). **BUILT DARK, UNCOMMITTED** in the minifold worktree (claude/composite-r4), 2026-07-31.

## What shipped (5 files, no git mutations)
- NEW `src/domain/region/neutralNeighbourEdges.js` — the single minter. `neutralNeighboursActive(worldState)` reads the VIRTUAL `neutralNeighborsEnabled === true` (memoryWeaveActive idiom, ABSENT from DEFAULT_SIMULATION_RULES). `withNeutralNeighbourEdges(graph, memberIds)` appends a `neutral`, **channel-less** edge to every un-connected member pair; STRICT NO-OP returns the input graph **by reference**.
- `src/domain/worldPulse/worldSnapshot.js` — the ONE seam. `buildWorldSnapshot` is the campaign-connect chokepoint (`relationships: graph.edges` feeds ~28 kernel edge-readers). Dark ⇒ the snapshot's graph is the *same object* → dormancy by identity.
- `src/domain/worldPulse/simulationRules.js` — doc block only; flag lit in NO preset.
- Pins: `tests/domain/neutralNeighbourEdges.test.js` (15), `tests/property/neutralConnectedDefault.test.js` (8).

## ⚠️⚠️ THE SHARP EDGE — lighting it realm-wide is QUADRATIC
MEASURED: adding `neutralNeighborsEnabled: true` to the ONE_REGEN spread (so dramatic_campaign / living_realm / full_simulation carry it) REDS **`tests/perf/tickScanBudget.test.js`**: `scanOps grew 3.320x (1007 -> 3343) when S doubled (> 2.6)`. Confirmed causal — the same test is green with the flag unlit.
Reason is structural, not tuning: the default connects EVERY pair, so the regional graph becomes **COMPLETE**, edge count `C(S,2)`. A 12-settlement realm goes ~11 → 66 edges. The Cycle-3 Wave-4 tick indices are near-linear in EDGES (they stay honest), but a quadratic edge population still blows the asymptotic ceiling.
`tests/property/moverCompositionSmoke.test.js` stayed GREEN when lit — so the composition smoke does NOT discriminate this; **tickScanBudget is the gate that does**.
Shapes to price before lighting (owner-gated performance architecture): bounded k-nearest neighbourhood by travel cost instead of the full clique; or a lighter edge class the hot indices skip.

## Mechanism facts worth keeping
- ⚠️ `normalizeEdge` in `src/domain/region/graph.js` is a **WHITELIST** — it rebuilds an edge from a fixed key set and silently DROPS any bespoke marker property. A provenance mark on a regional edge must live in `evidence[].source` (the only preserved field). Precedent: `hasWarLayerEvidence`. This module uses `source: 'neutral_default'`.
- The pulse's graph IS persisted: `pulseKernel` returns `applied.regionalGraph` → `advanceInterval.js:487` → `campaign.regionalGraph`. So minted default edges MATERIALIZE into the campaign on first advance (deliberate — evidence provenance keeps them auditable; re-mint is idempotent because connected pairs are skipped).
- SIBLING, NOT FORK: `src/domain/relationships/effectiveNeighbours.js` already implements the same owner default (2026-07-22 order) for `neighbourNetwork` LINKS read-time-only, feeding `lib/relationshipGraph` — and is explicitly scoped OUT of the regional causal graph. Its single-writer lint (`tests/lint/implicitNeutralSingleSource.test.js`) scans for `[IMPLICIT_NEUTRAL_FLAG]:` and `implicit_neutral__`; the edge minter uses neither, so the guard is untouched.
- Density mechanism CONFIRMED: `evaluateRelationshipRules` flatMaps over `snapshot.regionalGraph.edges` with `RULE_EVALUATORS.neutral` as the fallback evaluator. Measured on a 4-settlement / 60-month fixture: DARK cand=3 out=6 pairs=1 → LIT cand=226 out=84 pairs=6.
- `tests/property/` is held at **EXACT ZERO** un-anchored negatives by `negativeAssertionAnchor.walker.test.js` — new property tests must avoid bare `not.toContain` / `not.toMatch` / `not.toHaveProperty` entirely (other negative matchers are out of scope).

## Receipts
15/15 + 8/8 own pins; 29 dormancy goldens 158/158 UNTOUCHED; 53 lint walkers 375/377 (the only red is the CONCURRENT session's `src/domain/worldPulse/autoAdjudication.js` missing its `domainAnyCastBaseline` entry — **not this lane**); tickScanBudget/tickOpBudget green; 5 executed negative controls (seam disabled / explicit-wins guard removed / flag ignored / provenance changed / channels added), each reverted and re-greened.

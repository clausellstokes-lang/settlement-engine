---
name: provenance-ledger-shipped
description: "THE PROVENANCE LEDGER (engine finale #1) SHIPPED 2026-07-17: durable per-campaign receipt→parent cause-edge ledger at worldState.spatialLedgers.provenance, flag-gated (virtual provenanceLedgerEnabled), dormant byte-identical; chronicle cones/chains/standings now read RECORDED edges where present, inferred + labelled elsewhere. Branch claude/provenance-ledger off ad9f3067."
metadata:
  node_type: memory
  type: project
  originSessionId: 7115c211-9732-4751-8d73-170ba6bbcf31
---

Closes the [[provenance-dag-gap-and-substrate-map]] gap: a durable receipt→child-receipt
DAG now exists (recorded, not reconstructed). Built on branch `claude/provenance-ledger`
off `ad9f3067` (NOT pushed/merged — manager reviews + merges). Commits: writer 878be7f5,
chronicle-upgrade 93c7f38a, pins fa47f391, +2 gate fixes (strict/any) 3914e75e, 97e64db8.

## Architecture (as built)
- **ONE WRITER**: new lazy leaf `src/domain/worldPulse/provenanceKernel.js`. Records, at the
  SOLE durable-write chokepoint `appendPulseHistory`, the parent cause-edge ids each receipt
  carries — `causedBy` (explicit forward SEAM, scalar/array) + `sourceEventId` (existing one-hop
  edge) — for exactly the receipts landing in the durable pulseRecord (selectedOutcomes ≤24 +
  impactDigest ≤18 = the chronicle's node ids). Entry `{ [receiptId]: { parents[], type, tick } }`.
  NO prose, NO PII. Measured: ~184 B/edge, ~18 edges/advance, ~1440 edges/~250 KB at 80 monthly
  advances (ALL current real edges are one-hop news→outcome; `causedBy` is unthreaded by kernels
  yet — the forward seam).
- **STORAGE** = in-blob `worldState.spatialLedgers.provenance` (Phase-5.5 conditional family; zero
  first-paint bytes — `spatialLedgers` already in CONDITIONAL_LEDGER_KEYS; self-drops empty).
  Owner signed the in-blob home over a server-side table (table was FENCED + breaks determinism).
- **SIZE GOVERNOR** = MAX_PROVENANCE_EDGES=4096, lowest-tick evicted first (covers ≤42×80 durable
  window; owner-vetoable down to ~2048).
- **CHRONICLE UPGRADE** (display, ZERO engine import — the zero-engine-contact law): reader
  `buildRecordedEdges`/`recordedDescendants`/`hasRecordedEdge` in chronicleGraph.js.
  `connectedComponents` unions recorded pairs; `buildDecree` cone = EXACT recorded transitive
  descendants when linked (coneInferred/standingInferred → false), entity-key inference otherwise;
  crossLinks `inferred:!recorded`. AdvanceReport surfaces "recorded" vs "inferred" labels.

## Hazards / gotchas hit (load-bearing)
- **CEILING WIRING**: pulseKernel is at its FROZEN size-baseline (1410, scripts/.size-baseline.json,
  EXACT-match — even +1 effective line reds). appendPulseHistory was used ONLY at pulseKernel:2444.
  Net-zero wiring = pulseKernel's single worldState import line SWAPS to import from provenanceKernel,
  which RE-EXPORTS the sibling commit helpers (ensureWorldState/advanceWorldCalendar/pulseIdFor/
  seasonForTick). The wrapper CANNOT live in worldState.js — worldState.js is EAGER (imported by
  many store modules), so importing provenanceKernel there would add eager bytes. Leaf imported
  only by pulseKernel ⇒ eager delta 0 (grep-confirmed 0 in entry index chunks).
- **LEDGER-KEY WALKER** (tests/lib/spatialLedgerCoverage.walker.test.js): scans for STRING-LITERAL
  `setSpatialLedger(..., 'key'` writes. Use the literal `'provenance'` at the accessor call, NOT a
  const, or the walker won't see the write. Registered in EXEMPT_LEDGER_KEYS (spatialUsage.js) —
  it's a non-mover annotation ledger (reframes/warReasons precedent).
- **DOMAIN RATCHETS bite new files**: (1) tsconfig.domain-strict.json ceiling 0 — Map.get() returns
  Set|undefined, hold it in a local before .add/.has. (2) domain any-cast baseline (scripts/
  count-domain-any.mjs): new domain files get 0 any-holes — every `@type/@param {any}` counts; use
  concrete typedefs + `Record<string,unknown>` for dynamic worldState, cast-to-concrete (not any)
  for broadly-typed kernel call args. BOTH surface AFTER lint/test in `npm run check` (typecheck:
  domain:strict is 6th; a fail there stops the && chain before build/verify:dist).
- **KNOWN ALLOWED RED**: operationRegistry.walker EXEMPT_CEILING 69>66 is pre-existing/owner-gated
  (unrelated to this wave) — it fails `npm run check` at the test step, so run build + verify:dist
  SEPARATELY to verify them (this wave: build exit 0, verify:dist 143 pass, eager delta 0).

## Seams (recorded, not dropped)
- `causedBy` kernel threading: **REFUTED 2026-07-17 (THE THREADING REFUTATION — executed
  probes, ledger row)**, do NOT re-attempt as a kernel lift: the engine's causality is
  CROSS-ADVANCE + ENTITY-KEYED (stressor.id/deployment keys, never receipt ids) and the
  chronicle reader scopes recorded cones to SAME-ADVANCE node pairs — threaded edges
  would store and never surface; true edges need world-state shape changes (SHAPE LAW
  violation). The REAL unlock = a CROSS-ADVANCE recorded-cone chronicle READER (display
  lift; the ledger already stores cross-advance edges) — owner-queued post-launch.
  ⚠️ Hazards: worldState.proposals clones outcomes (applyWorldPulse:1000) — transient
  causedBy context would leak there (scrub + residue pin required) · approved proposals
  apply WITHOUT provenance recording (applyWorldPulseProposal path) — genuine gap,
  ROUND 3 fix stock.
- Cross-thread recorded links stay inferred (recorded edges merge causally-linked nodes into ONE
  thread, so a cross-thread recorded link needs cross-entity causedBy).
- Deputy's-diary reversibility stays a structural inference (not an edge property).
- The flag `provenanceLedgerEnabled` joins the lighting queue for the ONE regen batch (dark now).

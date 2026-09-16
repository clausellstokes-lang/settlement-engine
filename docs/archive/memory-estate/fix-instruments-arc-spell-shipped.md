---
name: ""
metadata: 
  node_type: memory
  title: "FIX-INSTRUMENTS lane complete (arc-soak + spell-break census, bars 4/18/20)"
  date: 2026-07-20
  branch: claude/fix-instruments
  tip: 0a49deb2
  base: 8dfd2aed
  status: "shipped, NOT folded, NOT pushed; tests-only (zero src, zero goldens, zero closure)"
  tags: 
    - fix-waves
    - instruments
    - arc-soak
    - spell-break-census
    - provenance
    - ratchet
    - bar-4
    - bar-18
    - bar-20
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T01:00:17.385Z
---

# FIX-INSTRUMENTS lane: the two standing quality instruments (idx29 + idx10)

**Tip `0a49deb2` on `claude/fix-instruments` (base `8dfd2aed`, vision-j worktree), ONE commit, tests only.** Gate at commit: domain-strict bare 0 · full tsc 0 · eslint 0 on both files · both instruments green (arc soak 7/7 + census 4/4, combined 11/11 exit 0) · `git diff --name-only` = tests/ only · python NUL scan 0. Full suite deliberately NOT run (per brief); closure/goldens unaffected by construction.

## What shipped

1. **`tests/simulation/emergentArcSoak.test.js`** — the "checkpoint soak" moverCompositionSmoke deferred to. 15y × 8 settlements × literal `full_simulation.rules` + test-local `provenanceLedgerEnabled`; mines `spatialLedgers.provenance` via `buildRecordedEdges`. Measured @ seed `arc-soak-seed`: 3144 edges · 118 cross-system · 64 cross-tick · 44 wave (≥2-hop) · 93 multi-system cones (4 triple) · 8 families; floors pinned ~1/3 of measured. Two-drive determinism hash.
2. **`tests/copy/spellBreakCensus.test.js`** — standing whole-loop spell-break gate, SHRINK-ONLY ratchet at the measured baseline. Surfaces (DOM-free): letter, chronicle scrollback, decree tracker, dossier VM (driven saves + one real `gen()` pipeline settlement), road-scene DM+player briefs, cause-walk. Detectors: rawId/tickSpeak/camelKey/jsonFragment/softwareVoice. Baseline debt frozen: letter tickSpeak×1 + camelKey×37 (R-16 prints raw flag keys — cell tracks the preset flag count BY DESIGN, a new full_sim flag reds it +1 as a real new leak), chronicle rawId×32 + camelKey×3 (`resentment/tradeBalance` reason line), decrees rawId×3.

## ⚠ THE STRUCTURAL FINDING (report upward; do not re-discover)

**Recorded link-depth ≥ 2 is ZERO in the engine today.** The ONLY `causedBy` outcome→outcome minter is roads V-24d (release→capture, unit-pinned by `roadsProvenanceThread.test.js`); roads is a virtual flag OUTSIDE `full_simulation`, and even force-lit for 15y the roads mover dispatched (cadence ledger written) but its notable-tier beats never survived the ≤18-slot durable impactDigest, so no organic deep edge was ever recorded. Every other recorded edge names its ULTIMATE root: multi-hop propagation exists (`queued.regional_wave` receipts mark hop generation in the id) but is flattened onto the root. Bar 4's depth story therefore rests on one-hop attribution cones + wave markers; if the owner wants true recorded chains, kernels must adopt the `causedBy` seam (the soak's `deepChains` metric is wired and will light up when they do).

## Hazards for whoever folds/extends

- The soak's drives run at MODULE level — wall time lands in vitest's "import" phase, not "tests"; whole file ~30s idle, minutes under CPU contention (timeouts set 240s).
- Vitest in this repo swallows `console.log` from tests under the default reporter — diagnose via file-dump when measuring, keep console diagnostics for the cacophony idiom only.
- The census walker EXCLUDES structural keys (`threadId`, `keys`, `cone`, enums…) and the `receipt`/`raw`/`receipts` subtrees by documented contract — the chronicle thread model carries raw receipts under `receipts`, which would otherwise flood the census with ~1700 false id hits.
- Census cells are `<=` only (shrink-only), so wave-3 E1 composer fixes can only green it; when a cell falls, LOWER it in the same pass to lock the win.
- `roadsEnabled` was tried and REVERTED in the soak (no recorded receipts, purity of the full_simulation claim wins) — don't re-add it expecting deep chains; digest survival, not dispatch, is the bottleneck.

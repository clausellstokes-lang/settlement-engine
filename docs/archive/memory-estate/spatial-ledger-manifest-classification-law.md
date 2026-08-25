---
name: spatial-ledger-manifest-classification-law
description: "How to classify a new spatialLedgers key in spatialUsage.js — the TRACKED half FAILS OPEN, and \"the writer has no mount\" is NOT an exemption ground (routeNetwork disproves it)."
metadata: 
  node_type: memory
  type: project
  originSessionId: 277043d2-c3a1-4eed-9d0d-ce6820500278
  modified: 2026-08-07T20:15:22.538Z
---

Settling `tests/lib/spatialLedgerCoverage.walker.test.js` (RED whenever a wave mints a
`setSpatialLedger` key it never classified). Established 2026-08-07 at `1e4c493b`, minifold
worktree, while classifying `commercialReasons` (→ EXEMPT) and `pactProposals` (→ TRACKED).

**⚠⚠ THE TRACKED HALF FAILS OPEN — this is the trap.** The walker asserts only that the
written-key set equals `TRACKED_LEDGER_KEYS ∪ Object.keys(EXEMPT_LEDGER_KEYS)`, plus
disjointness. But `counts` and `MOVER_PRESENCE` inside `extractSpatialUsage` are
**function-local and unexported**, so *nothing* can reach them. Adding a key to
`TRACKED_LEDGER_KEYS` alone turns the gate GREEN while emitting zero telemetry — the
recorded [[credit-side-enumeration-fails-open]] class. An EXEMPT row is self-proving (its
reason string IS the artifact); a TRACKED row is a promise until a test drives the
extractor. **Always ship a behavioral pin with a TRACKED classification**, and run it as
two mutants (drop the `counts` entry; drop the `MOVER_PRESENCE` row) — both must red.

**⚠⚠ "THE WRITER HAS NO CALLER" IS NOT AN EXEMPTION GROUND.** The obvious reasoning —
unreachable container, so a tracked zero would lie — is *wrong here*, and the manifest
already decided it the other way. MEASURED: `routeNetwork` is TRACKED and its ledger is
equally unwritable — `writeRouteNetwork` is reached only from `accrueRouteFlows` and
`ensureGenesisRouteNetwork`, and **neither has any caller in src/**. Its own row states the
ruling: *a reading of zero while the layer is dark is the truth, not a blind spot*. So mount
status decides nothing; a classification must survive the wiring wave.

**THE AXIS THAT ACTUALLY DECIDES IT: deposit vs re-derivation.**
- **EXEMPT** when the ledger is *recomputed each pulse from existing state* and banks
  nothing — a count then reports what the world already contains, not what the layer did.
  This is the reason-annotation family (`warReasons`, `peaceReasons`, `reframes`) and the
  stock family (`merchantAppetite` and its idiom siblings). Second clause of the header must
  also hold: the *owning layer's* adoption is already visible through a tracked mover or a
  tracked flag.
- **TRACKED** when the row is a DEPOSIT that persists across ticks — `routeNetwork`,
  `demographicPlans`, `pactProposals` — *and* the lane is visible through neither a tracked
  mover nor a tracked flag (its gate is a virtual flag lit in no preset, hence absent from
  `TRACKED_FLAGS`).

**⚠ Two traps when writing the row.** (1) **Never import the ledger-key constant** into
`spatialUsage.js` — importing from `pactProposals.js`/`commercialReasons.js` drags
`distanceRead.js` (~53 kB of geography) onto first paint and breaks that module's stated
dependency-free law. Use the bare string literal, as all ~37 other entries do. (2) The
frozen roster in `tests/lint/negativeAssertionAnchor.walker.test.js` caps
`tests/lib/spatialUsage.test.js` at **5** un-anchored negatives (`count > ceiling` reds), so
any new negative assertion needs `expectAbsentWithAnchor` or an `// anchored:` line
immediately above — see [[epistemic-prevention-shipped]].

**⚠ J-TR-2 is binding on the prose**: `commercialReasons` may NOT be described as
"commerce's warReasons" — its own header forbids the conflation (no war table, no casus
belli, `warReasonTaxonomy.js` was the shape template only). Say *shared KIND*, not shared
layer.

Related: [[step12-test-ratchet-landed]] (a fixed baselined test does NOT red the gate — the
ratchet prints RATCHET DOWN and exits 0, so the win must be banked deliberately via
`npm run test:ratchet:update`), [[two-lane-commit-shared-index-race]].

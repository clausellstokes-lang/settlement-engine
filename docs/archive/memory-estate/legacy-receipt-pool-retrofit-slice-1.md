---
name: legacy-receipt-pool-retrofit-slice-1
description: "The RECEIPT_POOLS_LEGACY.md retrofit's first wiring slice (population desk) landed @ 1b9b2b10 — the canonical-is-prepended-not-copied architecture, the four vetoable rulings, and the walker constraint that forces it"
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-03T12:59:43.746Z
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

**WHAT LANDED (minifold @ 1b9b2b10, dark-tree, NOT pushed).** The first slice of
`docs/content/RECEIPT_POOLS_LEGACY.md` reaches live code: §3c's population/demographics
desk — `flow_migration`, `migration_flight`, `migration_pressure`, `population_emigration`,
eight variants each — wired into `whatPhrase`'s subject phrase with seeded per-telling
selection. 62 §3/§4 desks remain unwired; this is the template for all of them.

**THE ARCHITECTURE — COPY THIS FOR THE NEXT DESK:**
- **The canonical line is PREPENDED, never copied.** `src/domain/display/rumorPhrasePools.js`
  (`WHAT_PHRASE_POOLS`) holds ONLY doc variants 2..N; `whatPhrase` builds
  `[WHAT_PHRASES[kind], ...variants]`. Index 0 is the live row *by construction*, so the
  annex's byte-identity rule cannot be violated by a drifting copy.
- **⚠️ `WHAT_PHRASES` MUST KEEP ITS STRING SHAPE.** Six walkers across three lanes assert
  `WHAT_PHRASES[kind]` is truthy and `.not.toMatch(/_/)` (phrasedKindPools, envoyKindPools,
  warRulingKindPools, warCoalitionKindPools, warCostKindPools, lineageKindPools, plus
  heraldRouting routing every key). Widening its values to arrays breaks all of them —
  the sibling-map design is not a preference, it is forced.
- **The corpus lives in its own pure data leaf** (R-BLD-4; the `warReceiptPools.js` /
  `eventProse.js` precedent). §3 alone is 63 kinds × 8 variants.
- **Seedless = the dark path**, pinned byte-identical over the WHOLE `WHAT_PHRASES` map.
  Only `renderFiction` passes a seed (`record.eventRef`, the same stable ref the headline
  frame rides).

**GOLDEN PLAN, MEASURED:** ZERO goldens capture rumor prose — the ledger goldens hash the
STRUCTURED records and settlementRumors renders fresh into lazy dossier/PDF/brief chunks.
Verified by running rumorLedgerGolden, migrationRumorsDormancyGolden,
demographicsLifecycleGolden, generatorGoldenMaster, chroniclersLetterGolden and the rumor
cohort against the wired tree: all green, nothing re-recorded. Expect the same for the
next desk, but re-run rather than assume.

**THE PIN SET TO CLONE** (`tests/domain/rumorPhrasePools.test.js`, 31 pins): corpus join
(the doc is PARSED at test time and compared member-for-member in order — the doc is the
source of truth), R1 register law, strict no-op, repetition envelope, anti-aliasing (see
[[fnv1a-low-bit-parity-pool-aliasing]]), THE PROMISE, and the live path driven through
`settlementRumors` over a settled ledger. Two executed controls: unplug the seed at the
call site → the live-path pin reds; an unwired kind (`conquest`) is pinned to one fixed
phrase → the blast radius is provably four kinds.

**Rulings J-LEG-WIRE-1..4 + FINDING LEG-F1 are recorded vetoably** in minifold
`docs/FABLE_VALIDATION_QUEUE.md`.

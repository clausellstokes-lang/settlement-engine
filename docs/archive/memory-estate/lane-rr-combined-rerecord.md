---
name: lane-rr-combined-rerecord
description: "⭐⭐ Lane RR @ 21bf1041 + c4de968a + eaecafdc — the origin rung widened to 45 draw-free bodies and the resourceIcon camelCase class closed, on ONE 525-key re-record; census decomposed to EXACTLY two path-templates; ⚠️ the two inferSupplyChains icon slots are PERSISTENCE-REQUIRED, not dead"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-04T00:43:49.584Z
---

**WHAT LANDED (2026-08-03, `claude/composite-r4`, worktree minifold, NOTHING
PUSHED).** Two owed golden-shifting changes rode one disclosed window under the
chair's lane-RR ruling so the estate paid ONE re-record instead of two.

- `21bf1041` — source. `c4de968a` — the re-record, its own commit.
  `eaecafdc` — the queue rows J-RR-0..J-RR-6.
- Full record: `docs/GOLDEN_SHIFT_LEDGER.md` §"LANE RR — THE COMBINED
  RE-RECORD", which **discharges the PT2-5 section's NOT-BUILT status**.

**(A) THE ORIGIN RUNG.** `generateSettlementReason` held one sentence per arm
(PT2-5: 9 bodies over the whole config space; the DEFAULT `road` arm, a third of
generations, had exactly one). Now **8 arms × 5 authored variants = 45 bodies**
in the new leaf `src/generators/narrative/settlementOriginProse.js`. The ARM
logic is the pre-RR branch structure unchanged; only the body is selected, and it
is selected **DRAW-FREE** via `kernel/proseHash.pickVariant` from a key folding
route + resolved terrain + food-deficit flag + special resources + the pipeline
seed. Measured: DEFAULT config over 60 seeds **1 → 5 bodies**; tier×route×
terrain×magic over 250 generations **9 → 41**.

Three laws, all pinned in `tests/generators/settlementOriginProse.test.js` (19):
**canonical-at-zero** (index 0 of every pool is the exact pre-RR sentence, falsy
seed selects it, so every seedless caller is byte-identical — the two existing
unit test files were not touched); **draw-free** (counting-rng pin: 0 rolls);
**no power-of-two pool** (FNV bit 0 is XOR-parity; five everywhere, every variant
pinned reachable over a 400-seed family with a degenerate-family negative
control). `effectiveConfig` carries no `_seed`, so `generateNarratives` stamps
`ctx._seed` on exactly as it already did for `generateHistory`.

**(B) THE resourceIcon CLOSURE.** 56 dead `resourceIcon: ''` removed from
`src/data/supplyChainData.js`; `copyCorruption` SIG 1 widened from the
case-sensitive `\bicon` to `[A-Za-z]*[Ii]con`. Machine-checked on pre-RR bytes:
old regex **0** hits in that file, new regex **56**.

**⚠️⚠️ THE CORRECTION EVERY PRIOR RECORD GOT WRONG: the two slots in
`src/domain/inferSupplyChains.js` are NOT dead.** `resourceIcon` and `needIcon`
are REQUIRED KEYS of the reviewed supply-chain persistence shape — proved by
probe, `admitReviewedSupplyChain` returns *"unsupported shape. Missing:
resourceIcon."* — and `SupplyChainsManager → confirmCustomSupplyChainReview`
spreads a discovered chain through UNCHANGED, so deleting them breaks
custom-content review at the confirm step. Kept, reasoned at the line, held by a
narrow file+field allowlist in `copyCorruption.test.js` with three tests: it is
EXACT, every entry must match a real line, and **the persistence boundary must
still require both keys** — so the exemption reds rather than outliving its
reason.

**THE CENSUS (committed bytes both sides: `32e25808` → `21bf1041`).**
```
removed  4462 / 477 rows   $.economicState.activeChains[*].resourceIcon
changed   412 / 412 rows   $.settlementReason[*]      (index 0 only)
added 0 · array-length 0 · key-order 0 · templates 2
```
TOTALITY: the parent side reproduced the OLD manifest on all 525 rows, 0
mismatches. Cross-check vs an independent manifest: 0 mismatches. Key set
unchanged.

**DEFERRED, DOCUMENTED (queue J-RR-4/J-RR-5):** the two producer pass-throughs in
`computeActiveChains.js` can now only ever be `undefined` (998/998 chains still
carry the KEYS in memory; nothing ships because `JSON.stringify` drops them) — a
later lane may delete both lines with **no re-record**; and the golden corpus has
no port × riverside row, which is an owner-signed ADDITION.

**PROVEN NOT TO MOVE:** the 60-settlement hook corpus is byte-stable across the
shift (855 hooks / 79 distinct / 776 exact duplicates, identical both sides) —
because the selection is draw-free. The three save-archive fixtures carrying
`settlementReason` are historical records, not live comparisons, and were
correctly left alone.

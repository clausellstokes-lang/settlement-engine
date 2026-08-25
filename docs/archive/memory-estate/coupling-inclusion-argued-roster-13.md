---
name: coupling-inclusion-argued-roster-13
description: "⭐⭐ OWNER RULING 2026-08-10: the IA-1/6e7acc4d classification miss discharged by DOOR 1 — ARGUED_ROSTER_CEILING 10→13, three substrate entries (ledgerOwnershipManifest, pulseStageResult, worldStateHydration). MEASURED: the raise subtracts ZERO coverage (all three were already unlayered, LIVE_PAIRS 176 both sides, outbound 0/0/1) and ENUMERATES one previously-dark GRAMMAR edge. ⚠⚠ the brief's door-4 blocker was WRONG — implementation-packets.mjs exempts CREATE rows from the existence check, so relocation would not have redded the packet gate at all."
metadata: 
  node_type: memory
  type: project
  date: 2026-08-10
  originSessionId: 98a1aee5-7467-48f4-997f-590f5ad3db26
  modified: 2026-08-10T18:49:01.535Z
---

Unstaged at HEAD `9df7e428`, branch `claude/composite-r4`, worktree minifold. One
file: `tests/lint/couplingInclusion.walker.test.js`, +97/−7.

## What was wrong

`d7ec3885` (packet IA-1) minted `ledgerOwnershipManifest.js` and
`pulseStageResult.js`; `6e7acc4d` minted `worldStateHydration.js`. All three landed
inside `CENSUS_SCOPE_RE` without discharging CR-FP-11's same-commit classification
obligation, so the unlayered census read `LIVE_UNLAYERED` 182 against a 179 baseline
and two arms redded. **A cross-lane obligation miss, not lane drift** — and the
census caught all three, which is arm B doing exactly its job.

## The ruling, and the measurement that made it easy

DOOR 1. Three `ARGUED_UNLAYERED` entries, `kind:'substrate'` each, no files moved.
`ledgerOwnershipManifest.js` and `pulseStageResult.js` declare `reads: []`;
`worldStateHydration.js` declares its one GRAMMAR read of `envoyErrandRecords.js`
with a 377-char `readsReason`.

**The ceiling raise costs nothing measurable, and that is the whole argument.** All
three modules were ALREADY unlayered, so `scanCrossLayerPairs` already skipped them
on both sides: `LIVE_PAIRS` is 176 before and after. Outbound reach is 0 / 0 / 1
against 43 and 26 for the two big hosts and 3 for `errandMint`. The single edge was
UNDECLARED before and is declared now, so the estate's declared cross-layer reach
went UP by one edge. Nothing was erased.

⭐ **The program had already pre-ruled this.** `DESIGN_FP_ARCHITECTURE.md`: "A NEW
`.js` file under `src/domain/worldPulse/` or `src/domain/spatial/` … takes a NEW
`ARGUED_UNLAYERED` entry with a written reason in the same commit, never a baseline
row." HB-2 in the same doc plans further admissions on the same argument, so 10 was
never a budget the program intended to hold.

## ⚠⚠ TWO CORRECTIONS TO THE CHAIR BRIEF, both load-bearing

1. **DOOR 4 WAS NEVER A COMPLETE DOOR.** Relocating the two zero-consumer artifacts
   to `src/domain/certification/` leaves `worldStateHydration.js` in scope, still
   owing an entry and still forcing a raise to 11. The real choice was +3 vs +1.
2. **DOOR 4'S PACKET BLOCKER DOES NOT EXIST.** `scripts/implementation-packets.mjs`
   guards `if (row.action !== 'CREATE' && !fileExists(...))` — CREATE rows skip the
   existence check entirely. IA-1 is `LANDED`, so it reserves no change paths, and
   neither module appears in `requiredSymbols`. Relocation would not have redded the
   packet gate. Its real costs were hand-keyed path pins in three test files,
   `ARCHITECTURE.md`'s prose, and filing a runtime envelope into a metadata estate
   with one runtime consumer repo-wide.

## The verification (all executed in ONE gate acquisition, 4 runs)

- GREEN post-edit: 16/16, EXIT=0.
- MUTANT (`pulseStageResult.js` gains `import … from './warCosts.js'`): exactly 1 of
  16 red, naming `pulseStageResult.js (argued SUBSTRATE) now reads
  src/domain/worldPulse/warCosts.js [WAR]`. **This is the proof the admission is a
  COUNTED exemption rather than an erasure.**
- UN-EDIT control (pre-edit walker restored): exactly 2 red — `a NEW unlayered module
  REDS` and `the frozen unlayered set … never grew` — naming all three modules.
- RESTORED: 16/16, both files `cmp`-exact.

⚠ **The `reads` arm is OUTBOUND-ONLY** (`layeredImportsOf` vs declared). It cannot see
ports reaching INTO an argued module. For `pulseStageResult.js` that is the residue
that grows, and it is named in the entry: the adoption being waited on is
`pulseKernel.js` calling `normalizePulseStageResult`, and `pulseKernel.js` is itself
an argued HOST — so that first edge is invisible under EVERY door, including a
`LAYER_PATTERNS` home. No classification would have caught it.

## The second pass — both growth rules made machinery (owner: "do the remaining")

Offered as a deferral, then authorized and landed in the same unstaged change:
`UNLAYERED_BASELINE_CEILING = 179` asserted EXACTLY, and the roster arm moved from
`toBeLessThanOrEqual` to `.toBe`. Full account and the matched-pair receipt in
[[unlayered-census-growth-rules-are-prose-only]]. Final diff: ONE file,
`tests/lint/couplingInclusion.walker.test.js`, +167/−13, unstaged.

Seven runs, one gate acquisition: tightened GREEN 16/16 · roster mutant 1 red named ·
gap-control on the PRE-tightening walker **16/16 GREEN with the growth planted** (the
proof the hole was real) · same plant on the tightened walker 1 red, `expected 180 to
be 179` · restored 16/16 · `pulseStageContracts.test.js` 7/7 · 
`sovereigntyLightingContract.walker.test.js` 33/33.

Those last two settle the audit's two open questions: `pulseStageContracts.test.js`
PASSES, so it owes no `.test-ratchet-baseline.json` row (that ledger binds only
FAILING files), and the lighting census's `parked`/`credited`/`titles`/`suiteTitles`
arms — which cannot be hand-computed because their readers are unexported — are all
green at `files: 2382`.

Related: [[full-delegation-grant-2026-08-10]] · [[concurrency-law-ruled]] ·
[[implementation-packet-dispatch-system]] · [[piped-gate-exit-masking]] (bit again
this session) · [[sp-d-errand-spine-landed]] (the `errandMint` precedent this reasons
from).

---
name: hk3-theme-aware-draws-landed
description: "HK-3 theme-aware loyalty draws LANDED @ minifold 46255ad5 — the hook non-redundancy spine is complete (HK-1/2/3); carries a RULED 525-key golden re-record; HK-2 still dark pending the owner's K table"
metadata: 
  node_type: memory
  type: progress
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T15:39:47.167Z
---

2026-08-03. **HK-3 landed @ minifold `46255ad5`** (branch `claude/composite-r4`,
7 files, one pathspec commit). `docs/DESIGN_HOOK_NONREDUNDANCY.md` is now fully
built: HK-1 (vocabulary) @ `074e919f`, HK-2 (retention layer, DARK) @ `16b4a416`,
HK-3 (theme-aware draws, LIVE) @ `46255ad5`.

**What HK-3 is:** `drawUnique` (src/generators/hookVariety.js) takes an optional
second settlement-scoped registry of themes already spoken. Candidate preference,
stopping at the first non-empty tier: (1) unused family AND unused theme, (2)
unused family, (3) the whole pool. Wired at the three `NPC_FACTION_LOYALTY` draw
sites in `generateCharacterTitle`, threaded as ONE `{ titles, themes }` object
created per `generateNPCs` call.

**Measured, 60 settlements (5 tiers × 12 seeds), against a detached base worktree
at the pre-HK-3 commit `1a820e8c`:** persisted NPC hook arrays — total hooks
855 → 855 and exact duplicates 28 → 28 (both UNCHANGED: HK-3 drops nothing), while
above-K beat repeats fell **187 → 85 (−54.5%)**. At the display aggregator's wider
view the same corpus moves 848 → 771 (−9.08%) over 2535 unchanged collected hooks
— diluted because relationship tensions and five other sources are not pool draws.

**⚠️ THE GOLDEN SHIFT IS RULED AND DONE.** `tests/fixtures/generator-golden-master.json`
re-recorded: **525 of 525 keys changed value, key SET unchanged (525 → 525), all
hashes unique.** The authority is §3 HK-3's SAME-SEED DISCLOSURE, not a fresh
decision — do NOT re-litigate it, and do NOT re-record it again. The manifest was
proven green at base first, so 100% of the drift is HK-3's. Full record with the
field-level diff is in `docs/GOLDEN_SHIFT_LEDGER.md` under the 2026-08-03 heading.
The entire diff is two ALIASED paths — `npcs[].plotHooks[]` and
`factions[].members[].plotHooks[]` (the same objects) — no length, key, or type
motion anywhere.

**⚠️ npcGenerator.js is a TOLERANCE-ZERO size-baseline file frozen at 1350
effective lines.** HK-3 landed NET-ZERO (1350 before and after) by collapsing one
three-line if-block while adding one import and one helper;
`scripts/.size-baseline.json` was not touched. Any future edit there must do the
same arithmetic or the ratchet reds in both directions.

**Still open / not this wave's:**
- HK-2 remains DARK. Lighting it is an owner-signed K table away, not a rewrite;
  at the §5 defaults it drops 15–40% of a settlement's hooks, which the owner has
  not signed.
- **REPORTED, NOT FIXED:** 50 of 611 generated NPCs (8.2%) carry NO `plotHooks`
  field at all — measured IDENTICALLY at base, so pre-existing.
  `generateSingleNPC` always builds one, so something downstream of `generateNPCs`
  re-shapes those records. The number is frozen in
  `tests/generators/hookThemeDraws.test.js` so the day it moves a lane sees it.
- One HK-2 pin was repaired (not weakened) because HK-3 made its single seed
  vacuous: "deriveAllStructuredHooks — same helper, same dark default" now runs a
  six-city family and asserts retention never ADDS a hook and still drops
  somewhere (4 of 6 drop).

Related: [[hook-nonredundancy-architected]], [[concurrent-lane-silent-edit-revert]],
[[sizebaseline-exact-ceiling-hazard]], [[the-promise-ratified]].

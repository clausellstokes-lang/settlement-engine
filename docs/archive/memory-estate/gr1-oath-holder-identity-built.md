---
name: gr1-oath-holder-identity-built
description: "2026-08-04 — FP wave #9 GR-1 built green and UNCOMMITTED in minifold; oathHolder.js, three mint doors stamped, oathHolderEnabled manifested"
metadata: 
  node_type: memory
  type: project
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-05T02:27:12.143Z
---

# ⭐ GR-1 THE OATH-HOLDER IDENTITY — BUILT, GREEN, UNCOMMITTED

Built 2026-08-04 in `.claude/worktrees/minifold` on `claude/composite-r4`, start
HEAD `e30770bd`. **Not committed** — blocked by
[[cq5-flag-law-collides-with-parallel-lanes]], not by any defect.

## What exists in the tree
- `src/domain/worldPulse/oathHolder.js` (70 eff): `oathHolderActive` (strict by-name
  gate), `oathHolderOf`, `stampSworn` (the ONE writer of `treaty.sworn`),
  `swornPartiesOf` (total reader).
- Stamps at ALL THREE mint doors: the war mint + carried-sheet mint via ONE call at
  `advanceTreaties`' PASS 1 mint LOOP in `peaceTerms.js` (the `executeTreatyConveyances`
  precedent — that closure is defined twice, once per road, so an arm inside it would be
  two spellings of one law), and inside `mintSovereigntySaleTreaties` in `peaceTermsSale.js`.
- `oathHolderEnabled` manifested + certification row + first gate read (CQ5).
- Pins: `tests/domain/oathHolderGr1.test.js` (18), `tests/lint/oathStampTotality.walker.test.js`
  (8), `tests/property/oathHolderDormancyFence.test.js` (8). 132/132 green across the
  reachable surface.

## ⚠ THE TWO SUBSTRATE FACTS THAT SHAPED IT
1. **`durableIdForRoster` returns NULL for almost everyone.** It answers from the npc
   LEDGER, populated only by H1 graduation, itself behind another dark flag. Reading the
   volume's "→ H1 durable id" as a GATE would have made the stamp STRUCTURALLY
   UNREACHABLE — shipped green, never fires. It is a PREFERENCE: durable id when
   graduated (`wnpc_` prefix, self-describing), roster `npc.id` otherwise.
2. **Reachability was PROBED, not assumed.** Five really-generated settlements each
   resolved a governing faction with 1–2 seated npcs through `npcInFaction`. Do this
   before building any composed read. (The probe also re-tripped the recorded config-slot
   trap: `generateSettlementPipeline({}, null, { seed })` — `seed` in the config bag THROWS.)

## JUDGMENT calls (vetoable, recorded in the module header)
- The pick is **codepoint-lowest roster id** among the governing faction's members, NOT
  `eligibleMembersOf`'s importance/rank order — the charter names exactly four steps, the
  required mutant is "reverse the codepoint tie-break", and rank order would move a
  signature line whenever an unrelated ladder retune changed an importance weight.
- `oathHolderOf(worldState, settlementId, settlement)` takes the settlement as a THIRD
  arg (the volume wrote a 2-arg signature). Forced by substrate: `governingFactionOf`
  needs the record and there is no worldState→settlement map.
- `swornPartiesOf` reads the PARCHMENT and never re-resolves against the living roster —
  history, not a live lookup. Live-person resolution deferred to GR-4.
- Deferred + documented: the pick does not exclude `status: 'dead'` (a fifth step the
  charter does not carry; GR-4 owns the succession question).

## Superseded doc row
`DESIGN_FP_ARCH_GR.md` §3 item 1 says each GR flag takes a dated `false` declaration on
the `full_simulation` ceiling. That is PRE-CR-WR10-C. The live
`engineGatedRuleKeys.walker` asserts a manifest member must NOT be declared in any preset,
and the compiled architecture §3 + §2a CLASS 4 supersede the GR file. Manifest only.

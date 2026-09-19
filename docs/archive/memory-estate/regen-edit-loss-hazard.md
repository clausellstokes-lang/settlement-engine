---
name: regen-edit-loss-hazard
description: "regenSection('npcs') edit-loss is FIXED (preservation tail, 2026-07-26); regenSection('history') still destroys authored + campaignEra state; state.locks remains an unimplemented feature"
metadata: 
  node_type: memory
  type: project
  originSessionId: b393f918-f75e-470b-8e34-78c7bbed8bb8
  modified: 2026-07-26T18:28:06.444Z
---

Found 2026-07-26 (Opus code-read), FIXED the same day in minifold (claude/composite-r4). The write-survives-one-path-ghosts-another class on the settlement editor surface.

## R1 — NPC reroll edit-loss: **FIXED**
`regenSection('npcs')` replaced the whole roster and then persisted, so a hand-written NPC died durably. Cure landed as a **preservation tail inside `regenNPCsPipeline`**, not in the store:
- `src/domain/regenerationPreservation.js` (new, pure) — `mergePreservedNpcs(previous, fresh, {mode})`.
- `src/domain/regenerationMode.js` — new export `preservesEntity(mode, type, entity)`: the ENFORCEMENT half of `buildRegenerationPlan`, sharing its one PRESERVATION_RULES table (the plan is a report keyed by derived catalog ids; a merge holding the object would have to reverse-derive them).
- `src/generators/generateSettlementPipeline.js` — merge runs AFTER `enrichNpcCoherence`, before `relinkFactionMembers`.
- Tests: `tests/domain/regenerationPreservation.test.js`, `tests/generators/regenPreservesUserCanon.test.js`, `tests/store/regenPreservation.test.js`.

**Why in the generator, not the store:** `settlementSlice.js` is size-baselined at EXACTLY 1265 effective lines (tolerance-0) and the eager closure had 25 B of margin under a standing HARD-ZERO order — so the fix had to cost zero store lines. It also makes preservation a property of the operation, so the next caller of `regenNPCsPipeline` cannot reintroduce the bug.

### ⚠️ What a 5-lens adversarial refutation caught AFTER the fix looked green (all fixed)
33 findings raised, 15 survived independent verification, collapsing to 6 defects — 3 of them REGRESSIONS the fix itself introduced. The first green gate did not catch any of them:
1. **A NAME is not only in the fields that carry it structurally.** Repairing a relationship's `npc1Name/npc1Role/npc2Name/npc2Role` left `description`/`tension` — archetype prose with both names interpolated — naming the displaced character. 297/1073 edges vs 0/125 on the control. **Worse: `generationReceiptJudgments.finalGraphFindings` checks EXACTLY those four fields, so the half-repair turned the certifier GREEN over visibly wrong prose.** A partial projection repair is worse than none. Cure: re-derive from `STRESS_ECONOMIC_EFFECTS[rel.archetypeKey].desc/tension(first, second)` — `pairProse` is an FNV hash of the directed pair, NOT an RNG draw, so it is free to re-run.
2. Same class on NPCs: `generateCrimeLevel` bakes a roster member's name into `secret.what`/`secret.stakes` (the only other NPC fields carrying an interpolated name).
3. **Roster ORDER is the relevance ranking** (`enrichNPCsWithStructure` sorts descending, +25 for mayor/governor/elder), so a front-to-back slot scan aimed every weak match at the settlement's LEADER — editing a Street Preacher erased the Mayor (leader role lost 26/69 trials). Only the exact-namesake test may scan forward; weak matches take the LEAST relevant slot.
4. Roster size is a seeded draw and can come back SMALLER than the pinned cast; surplus keepers were appended with zero relationships and zero factions. Cure: floor the roll via `config._minNpcCount` (draw happens first, so dormancy holds) computed with the merge's own predicate.
5. `createdByEventId` — what ADD_NPC/ADD_INSTITUTION/ADD_FACTION actually stamp — was invisible to `canonStatus.inferSource`, so an NPC the DM INVENTED tagged 'generated' and was rerolled away. One line. ⚠️ Widening blast radius: also promotes ADD_INSTITUTION/ADD_FACTION products to source 'event'/locked everywhere `tagEntityCanon` is read (canonBreakdown, AI overlay forbiddenChanges).
6. **Test vacuity**: every fixture edited `npcs[0]`, so a mutant keeping `previous.slice(0,N)` instead of consulting the predicate passed ALL 27 tests. Put the qualifier MID-ROSTER or the selection rule is untested.

### ⚠️ Mechanism facts that made the naive splice wrong (verify before touching)
- **NPC ids are POSITIONAL**: `npcGenerator.js` stamps `npc_${idx+1}` over the finished roster, re-minted every roll. A preserved NPC carrying its old id COLLIDES with a different fresh NPC. Cure: a keeper **takes over a fresh slot and inherits that slot's id** — never insert alongside.
- **`enrichNpcCoherence` is not idempotent**, draws RNG, re-sorts the roster by relevance, and **overwrites `goal.short` — itself an EDITABLE field**. Merge AFTER enrichment or you re-clobber the edit you are saving.
- **`relinkFactionMembers` repairs faction→member by id but NEVER prunes** a member whose id left the roster.
- Relationships carry denormalized `npc1Name/npc1Role` snapshots that nothing re-derives; `generationReceiptJudgments.finalGraphFindings` DETECTS the whole invariant set (dup ids, unresolvable endpoints, name drift, faction members, conflict parties) and is a ready-made post-splice assertion list.
- Preservation is an overlay on finished output, so same-seed byte identity holds: zero authored/locked NPCs ⇒ `mergePreservedNpcs` returns the fresh array BY REFERENCE.

## R2 — false claims: **CORRECTED** (9 sites)
SettlementDetailActions, NextActionRail, SettlementDetail's Edited badge, EditableText's EditedBadge, NPCsTab's PINNED chip, npcComponents' pin toggle, copy/en.js `state.tooltips.locked`, plus JSDoc in userEdits.js / canonStatus.js / settlement.schema.js. All rescoped to "an edited NPC survives an NPC reroll"; pin copy rescoped to AI rewrites (pins are `aiData.pinnedNpcs`, an AI-only channel). Replacements were kept SHORTER than the originals to protect the eager byte budget.

## R3 — `state.locks`: **STILL INERT — OWNER DECISION OPEN**
`setLock`/`clearLocks` write it; the store persists/rehydrates it; **no reader anywhere**. `src/domain/types.js` Locks typedef now says NOT IMPLEMENTED. **Left unchanged on purpose:** `operationRegistry.js:128` still ships "Locks a section... so it is preserved when other sections regenerate" to the Compendium — every honest rewording is worse product copy than the status quo, so implement-vs-retire is the owner's call. Entity-level `locked`/`pinned` (a different mechanism) IS now honored on the NPC path.

## R4 — regenSection('history'): **STILL BROKEN, deliberately deferred**
Documented in a comment at the branch itself (`settlementSlice.js`). The NPC fix does not transfer, and it loses more than edits:
- History entries carry **no id and no provenance marker** — nothing to preserve them BY. `regenerationMode`'s `history_beat` rule covers the seven DERIVED summaries in `explanation.js`, not `historicalEvents`/`currentTensions`, and `lookupTagForEntity` has no branch for them (tags everything generated/draft, so both canon-aware modes preserve nothing).
- `regenHistoryPipeline` never mints `siegeNarrative` or `legacyAnnotations` (assembly-path only) and **downgrades `historicalCharacter`** from `buildStressProfile` to a cruder in-generator heuristic — a silent degrade, not an absence.
- ⚠️ It **discards the `campaignEra` entries worldPulse appends** (settlementLifecycleFirstClass, stressorAftermath, factionCapture) under an explicit "generation history is never pruned" rule. These DO carry stable `campaignEventId`s — **the cheapest real win and the highest-value piece**.

## Still open elsewhere
- **R5** worldPulse never reads `_userEdits`/`_authored`; prose survives advance by omission, not contract. Sibling rebuild sites unproven. `assignNpcToRole` (`domain/entities/npcs.js`) is the working precedent — it overlays structural fields onto the ORIGINAL npc.
- **R6** pendingEdits queue is session-only by design; refresh drops staged work.
- **R7** `userEdits.js` stamps wall-clock `editedAt` into persisted state — a golden snapshotting an edited settlement will flap. Pass an explicit `editedAt` in tests.
- Adjacent, marker-blind: `calamityKernel` can raze a DM-authored institution; `settlementLifecycleFirstClass` terminal death hard-clears `activeConditions`.
- `buildProtectedContext` (`domain/intent/opVocabulary.js`) still has zero call sites.

**How to apply:** any wave expanding dossier editing must check whether the surface it opens rides a regenerate path. NPCs are safe now; history, institutions, and factions are not. See [[owner-fix-philosophy]], [[dossier-editor-capability-atlas-verdict]], [[hot-files-at-max-lines-ceiling]].

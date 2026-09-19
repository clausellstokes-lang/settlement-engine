---
name: tcd1-faction-address-two-id-spaces
description: "TCD-1 landed @ 9ecec2a2 — the faction-key defect class's .id arm, and the law that an ADDRESS id and a SIGNATURE id are two different id spaces that must never converge."
metadata: 
  node_type: memory
  type: project
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-07T09:02:36.338Z
---

# TCD-1: the governing seat's news address (landed `9ecec2a2`, branch claude/composite-r4)

**THE SIXTH INSTANCE of [[faction-key-defect-class]] — the `.id` arm.** Nine `.id` reads over
`powerStructure.factions` rows. RE-MEASURED at the parent: **2,175 faction rows over 360
settlements, all six tiers, ZERO carry `id`** (keys are `faction, power, desc, category, rawPower,
powerLabel` + situational `modifier, isGoverning, legitimacyCrisis, crisisNote, modifiers`).

## ⭐⭐ THE LAW THIS ESTABLISHED: an ADDRESS id and a SIGNATURE id are DIFFERENT SPACES

A sweep of dead `.id` reads naturally wants to replace every one with a name-derived key. **That is
correct at exactly half the sites and catastrophic at the other half.**

- **ADDRESS sites** (the news chain, the link web) — a name-derived slug is RIGHT. An address is
  resolved at render time; a renamed faction simply addresses under its new name.
- **SIGNATURE sites** (`warSeatBooks.authoritySignatureFor`, `rulingPower.authorityTransferEpochFor`)
  — a name-derived slug is FORBIDDEN, and both files' own doc comments say so. These strings are
  SUCCESSION DISCRIMINATORS: a name-derived component makes every faction RENAME read as a
  legitimate authority transfer. **Dead-on-generated-data is CORRECT there**, and both sites now
  carry a ⛔ DO-NOT-FIX-THIS block naming the trap.

## ⭐⭐ THE ADDRESS ID SPACE IS `realmFactionPulseId`, AND IT REQUIRES A COLON

`src/domain/dossier/realmEntityWeb.js` — `realmFactionPulseId(saveId, faction, index)` =
`` `${saveId}:${stablePart(faction?.id || faction?.faction || faction?.name || faction?.label)}` ``.
Its consumer `resolveFaction({pulseFactionId})` does `if (id.indexOf(':') < 0) return null` — **a
colonless faction id is a DEAD address rung, silently.** `factionIdFromName` (`faction.<snake>`,
`src/lib/entities.js:144`, duplicated verbatim in `factionRelationshipUpdate.js:781` and
`npcProfile.js:311`) is the DOSSIER link id and does NOT resolve here. Do not mix them.

`warSeatBooks` cannot import `realmEntityWeb` (dossier-layer module → would re-parent the lazy
worldPulse closure), so the single-source guarantee is a PIN asserting byte-equality, not a shared
import. That pattern is the right answer whenever a closure boundary forbids the shared import.

## What was actually broken (all silent, all defensively guarded)

1. `readWarSeatBooks` emitted no `factionId` → `warTermination` spread none → `warRulingsNews`
   omitted `factionIds` from EVERY WR-5 entry. **A NEWS ADDRESS LAW breach** ([[news-address-law]]).
2. `warRulingsNews.factionName`'s third arm (`${settlementId}:${stablePart(name)}`) was a
   **READER WITH NO WRITER** — built, never fed.
3. `eventProse` `war_continued_for_the_seat` template 3 (the `{faction}` variant) was
   **STRUCTURALLY UNREACHABLE**: `warRulingReceipt` gates variants on `requiredSlots`, so an
   unfillable slot silently shrinks the pool. Measured 20,000 seeds — reachable indices without a
   faction `[0,1,2,4]`, with one `[0,1,2,3,4]`. Another member of
   [[unreachable-arm-and-self-supplied-anchor]].
4. `applyWorldPulse.js:961` fell back to `installerFactionId`, recording the faction that INSTALLED
   the seat under the field naming the faction that HOLDS it — and **disagreeing with
   `npcLadderKernel.js:763`, the other composer of the SAME persisted `seatTransitions` row**.
   Cured with one exported helper `seatTransitionGoverningFactionId` that BOTH composers now call.

## ⚠ DECLARED ONE-TIME GOLDEN SHIFT (cause stated, do not re-record silently)

`war_continued_for_the_seat` eligible pool 4 → 5 once the `{faction}` slot fills, so selection moves
`% 4` → `% 5`: **80.03% of receipts choose a different variant, 20.31% land on the newly-reachable
one**; `familyId` moves with it. Confined to that ONE kind — the other four faction-slotted kinds
(`ruler_books_compromised`, both overturn kinds, `succession_demand_inherited`) are fed by
`patronId`/`installerFactionId` and are unchanged. **Generator goldens do NOT move**
(`tests/generation.test.js` 21/21 green; nothing in the generator was touched).

## Receipts + residue

- tsc **188 → 179** across integrity-counted archives (base 6171==6171, after 6172==6172).
  SET DIFF, not a net: **9 removed, 0 introduced.** ⚠ A raw text diff shows 12 spurious
  "introduced" rows — they are the SAME `warTermination`/`warPeaceDecision` errors reprinted
  because the inferred `factionId` sharpened from `any` to `string`. Normalize the printed type
  blob before diffing tsc output, or you will report a fake regression.
- Pin `tests/domain/warSeatBooksFactionAddress.test.js`, 7 assertions, over REAL
  `generateSettlementPipeline` worlds (never a `.id`-shaped fixture — those hid instances 1-4).
  REDS under two planted mutants: `.id`-only address → 3 of 7 red; helper reverted → 1 of 7 red.
- `RulingFaction` gained `@property {string} [id]`. This is NOT the `.archetype` case that
  religionLegitimacy deliberately keeps OFF the typedef: `id` is the estate's rename-decoupled seam
  for authored records, honoured first-class-when-present by `ladderFactionKey`, `npcInFaction` and
  `entityLinks`' aliasIds. No new writer, no new persisted key, no schema shape change.
- **⏳ DEFERRED, documented in source, not a bug to re-find:** an AUTHORED `governing.id` still
  passes through unscoped (preserving `tests/domain/warSeatBooks.test.js:99`'s asserted contract),
  so it will not resolve in `resolveFaction` unless it carries a colon. Unreachable on generated
  data.
- **Sibling left alone with a note:** `warPeaceDecision.js:117-122`'s id arm is dead on generated
  data but is paired with a live name arm that carries the check.

**Sweep denominator: 9 sites found, 5 changed, 4 exempt-with-reason** (the two signature sites,
each read twice).

## How to apply

Before "fixing" any dead `.id` read on a faction record, first ask which id space the value feeds.
If it feeds a news/link address → use the settlement-scoped `realmFactionPulseId` shape and pin the
equality. If it feeds a signature/epoch/continuity key → **leave it dead** and add a DO-NOT-FIX
note. If it feeds a persisted row with more than one composer, route every composer through one
exported helper before changing the value.

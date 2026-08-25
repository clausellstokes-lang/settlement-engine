---
name: epq-encounter-carrier-conditional-landed
description: "⭐⭐ EP-q closed ⛔ STOP-ES2-1: normalizeEnvoyEncounter's armyId is now CARRIER-CONDITIONAL (army requires it, court refuses it, envoy still refused) and `host_settlement` joined the venue vocabulary. ⚠⚠ THAT VOCABULARY HAS FIVE HOMES, NOT TWO, AND HAD NO PARITY CHECK AT ALL; ⚠⚠ holdVenueFromEncounter FAILS CLOSED IN SILENCE so a kind the DTO accepts and that arm omits persists and never resolves. The brief's 'CR-ES-2 both-homes shape' attribution is WRONG — CR-ES-2 is the anonymity header."
metadata: 
  node_type: memory
  type: project
  created: 2026-08-10
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-10T13:29:30.848Z
---

# EP-q — the carrier-conditional armyId, and the vocabulary with five homes

Owner-signed 2026-08-10, Option A NARROW. Edits only; the manager commits.

## What landed (CONFIRMED)

`normalizeEnvoyEncounter` (`src/domain/worldPulse/envoyErrandRecords.js`) no longer welds
custody to an army. `armyId` is read with the **sibling optional idiom** already used by
`routeId` / `privateGoal` / `termSheetId` — `row.x == null ? null : strictText(row.x)`,
with a `(row.x != null && !x)` refusal — and a new module-private
`lawfulEncounterCarrier(picture, armyId, interceptorId)` holds the law as a **TOTAL
POSITIVE PREDICATE**:

- `army` → `!!armyId && carrier.id === armyId` (the old law, unmoved)
- `court` → `armyId === null && carrier.id === interceptorId`
- anything else, **including the real vocabulary member `envoy`** → `false`

`host_settlement` joined `ENVOY_ENCOUNTER_VENUE_KINDS`. The word was chosen over
`allied_hall` (which fits the SHAPE — its first arm is `node === actor` — but states a
falsehood: the gauntlet's host is the realm that dislikes the traveller) and over
`foreign_settlement` (already a member of `FOREIGN_LEASH_KINDS` in `corruptionLeash.js`;
one spelling in two closed vocabularies is the two-id-spaces trap). It is the counterpart
noun to `foreignGuestHold`.

## ⚠⚠ THE VOCABULARY HAS FIVE HOMES, AND HAD ZERO PARITY CHECKS

Not two, as every brief and queue row says:

1. `src/domain/worldPulse/envoyErrandVocabulary.js` (exported; the line is **~378**, the
   queue's `:359` is stale)
2. `src/domain/worldPulse/envoyEncounter.js:26` (exported, the pure census leaf)
3. `src/domain/worldPulse/armyTransitKernel.js:79` — a **private, deliberately NARROWER**
   `new Set([...])`. Left at three on purpose: the army projection has no meaning for a
   settlement whose own watch made the arrest. **It FAILS OPEN** (drops `venueRef` rather
   than erroring).
4. + 5. `supabase/functions/_shared/aiCharterBundle.js` and `aiOutputSchemaBundle.js` —
   BUILT edge artifacts. Already stale-and-baselined as `debt`; cure is one rebuild of all
   five bundles from a clean committed tree, not a per-lane rebuild.

**Before EP-q no test imported `ENVOY_ENCOUNTER_VENUE_KINDS`, `ENCOUNTER_VENUE_KIND_SET`,
or `ENCOUNTER_KEYS` anywhere, and no test called `normalizeEnvoyEncounter` directly.**
Adding a kind to one home and forgetting the others was GREEN. EP-q added the parity block
to `tests/domain/envoyEncounter.test.js`.

**⛔ DO NOT DEDUPLICATE BY IMPORTING.** `tests/domain/envoyK3BeliefSeam.test.js` pins
`envoyEncounter.js`'s import list to exactly `['./warCoalitionLedger.js']` and
`envoyErrandVocabulary.js` to the EMPTY list ("the family floor: zero imports"), enforced
by `toEqual` at ~:672. The duplication is load-bearing; a **parity pin** is the cure, the
shape CR-ES-3 used in `tests/lint/seatVocabularyUnification.walker.test.js`.

## ⚠⚠ holdVenueFromEncounter FAILS CLOSED IN SILENCE

`src/domain/worldPulse/envoyInterceptionStage.js` maps encounter venue kind → custody
venue. An unlisted kind returns `null` and the caller's `if (!holdVenue) continue;` drops
the encounter with **no throw and no red**. A venue kind the DTO accepts and that arm
omits is a row that persists and then never resolves. EP-q added `host_settlement` there
and guarded it by DERIVING the expectation from the vocabulary (every kind that is not
`field_node` must appear in the arm).

## The wrong attributions in the brief, corrected

- **"the CR-ES-2 both-homes shape" is WRONG.** CR-ES-2 is the ANONYMITY-header amendment
  (`informationStatecraft.js` ↔ `docs/DESIGN_FP_INFORMATION.md` §1b). The queue borrowed
  the phrase as a *naming convention for the required edit discipline*, not as a pointer to
  an existing walker. There was no walker.
- **The row's "47 `.armyId` sites across 11 src files and 26 test files" is a HYBRID
  measurement**, not drift. Measured at ES-2's own commit `987928a3` AND at head:
  `.armyId` = 49 matching lines / 11 src / **2** test files; bare `armyId` = 228→230 /
  20 src / **26** test files. The "11 src" came from the dotted spelling and the "26 test"
  from the bare one. The analysis's PREMISE (bounded blast radius, most sites army-transit
  rather than encounter readers) survives; its figures never held.

## What EP-q deliberately did NOT do

- **`legalEncounterVenue`'s producer arm** (the `return null` for an ordinary foreign
  settlement) is untouched. Adding an arm there CHANGES ARMY-ROAD BEHAVIOUR — an army at an
  ordinary foreign settlement would newly get a legal venue. That is ES-2b's.
- **`openEnvoyInterception`** (`envoyErrandEncounterWriter.js`, the ONLY genesis of an
  encounter in the tree) still demands an army carrier at its own gate. So after EP-q the
  SHAPE exists and **nothing can mint it** — which is exactly why no save migration arises.
- `src/domain/certification/subsystemRowsVirtual.js`'s "no army-carried ENCOUNTER" sentence
  is now stale in its qualifier only (custody is still unwritable). Deferred to ES-2b's
  landing, documented, not a bug to re-find.

## ⚠ A PRE-EXISTING, UNBASELINED RED that will meet the next lane

`tests/lint/sovereigntyLightingContract.walker.test.js` — "the estate's file count moved:
expected 2381 to be 2352". `TEST_FILES` is a pure disk walk of `tests/**/*.test.js`; git's
tracked set and the disk set are BOTH 2381, so the frozen `files: 2352` (line ~3215) was
stale by **29 files** before this lane opened. Not in `scripts/.test-ratchet-baseline.json`.
Attribute it by construction — a diff that adds no test FILE cannot have caused it.

## ⚠⚠ CORRECTION 2026-08-11 — "FIVE homes" MEASURES AS THREE, and it is a DIFFERENT subject

An ES-7 compile re-derived this and the recorded figure is wrong twice over: the venue
vocabulary has **THREE `src/` homes**, not five (`envoyEncounter.test.js:380-394`), **and
it is an ENVOY-ENCOUNTER fact with nothing to do with Herald kinds** — it had been carried
into an espionage brief as if it governed news vocabulary. The ⛔ never-dedupe-by-import
law still stands for the three real homes; the COUNT and the SCOPE do not.
⭐ Lesson: a figure quoted into a brief for a different subsystem is a figure nobody
re-derives — **carry the file:line, not the number.**

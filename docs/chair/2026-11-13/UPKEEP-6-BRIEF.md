# COHERENCE-UPKEEP-6: the ready brief for the follow-on seat (written by UPKEEP-5, 2026-11-13)

**The lane:** `lane/coherence-upkeep-2026-11-12`. Build on its tip. The fifth seat's record is the top part of `docs/chair/2026-11-12/UPKEEP-HANDBACK.md`. The measure that every item below stands on is `docs/chair/2026-11-13/UPKEEP-DEFENCE-PARTS.md`, with its two addenda. The probe is `docs/chair/2026-11-13/probes/UPKEEP-5/` (`parts.mjs`, `births.mjs`, README):
- it births the 3,036 measuring births;
- variant `V4` is V3 as built;
- variant `V4C` adds R12's conditions as proposed.

**Why a sixth seat:** the fifth seat built V3 and stage two's F2, F3 and F5 inside its context guard. It said early that these items would not fit (its messages to the chair of 07:5x and 08:1x). Nothing here was started in `src/`.

**The laws are the fifth seat's** (its brief, unchanged):
- red first, one cause per commit;
- at every `src/` commit: the domain-strict check, the type ratchet and eslint;
- every claim made on births you did not tune on;
- a count that falls is not a cure;
- never read a gate through a pipe;
- registers only through their doors; no baseline banked upward; never `--tighten`.

## The technical state (the chair briefs the design: R12 with record 324, R16, R17)

**The homes this lane made:**
- **`economicState.prosperityStanding`** (prosperity's writer, `economy/economicState.js`): the label with no crisis in force, its Subsistence draw replayed. It is read through `domain/facts/keep.js :: keepOfRecord(economicState)`, falling back to the shown label on old saves. Defence's pay and the stores read it; services and magic still read the shown label (call 3 of the hand-back).
- **`src/data/defenceWeights.js :: DEFENCE_TUNING`**: every defence number, each with its reason. It is registered in the tuning inventory. `WATCH_IN_STEAD` holds R2's counterfactual flags.
- **`domain/institutions/defenseInstitutionBuckets.js`**: the roster's defence home. It holds the traditions, the small place's tests and the wall's KIND (R17: stone, palisade, earthwork; nothing reads it yet).
- **`defenseProfile.parts`**: in the record only. The sum is exact; groups BUILT, STANDS, SUSTAINS, GROUND, AGAINST, LIMIT.

**The guards:** `tests/lint/defenceDerived.walker.test.js` (five arms) and `tests/generators/defenceParts.test.js` (exact sum, proof of derived).

**The probes:** `docs/chair/2026-11-13/probes/UPKEEP-5/` (README):
- `births.mjs` births the 3,036. Variant `V4` is V3 as built; variant `V4C` is R12 as first proposed, not the record-324 amendment. On a tree without `prosperityStanding`, apply `measure-lines.patch`.
- `rederive.mjs` is the proof of derived.
- `an3.py` / `an5.py` are the tables.
- `census/` holds the base census counts. The census tool is `lane/second-wave-census-2026-11-12:docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS/census.sh`.

**Unfinished:** see the hand-back's "NOT DONE" list (`docs/chair/2026-11-12/UPKEEP-HANDBACK.md`, top part).

# DS-DEF-11 · pool `UNWALLED-SMALL` — REFUTATION of the refined rows (Fable refuter, 2026-09-09)

Seat: Fable 5.1 (the verifier), for the Fable chair. Read whole before ruling: REGISTER-CARD.md (with S2, S3);
RULES-V2-PART-B.md §1 (R-DA-00 to R-DA-24), §16/16.1, §18, §20, §21 to §21.4, §22, §23, §24;
MOVE-GRAMMAR.md §1 to §3, §1.4.1, §4.4.1 to §4.4.3; CLERK-LAWS.md §2.4.1, §2.6.1;
ARCH-COMPOSED-PROSE-v2.md §2.5, §8.3. The licence card printed this session from the dock
(`node scripts/prose-licence-card.mjs DS-DEF-11 'UNWALLED-SMALL'`). The old shipped rows read at
`0cc78d315~3:docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`. The kept rows read from `kept.md` and confirmed
byte-identical to the dock's annex and its leaf (`defense.generated.js:5343`). The brief's
`draft-round-2.md` does not exist in this packet; the lawful draft is `draft-round-1.md`, confirmed
byte-identical to the pool's rows at both draft commits (a9d2ffe5b, e09b3e8b9).

## The licence, as read

Two measured reads and no predicate branch. The key function (`defenseStateProse.js:950`) returns
`UNWALLED-SMALL` when `SMALL_TIERS.includes(tier)`, and `SMALL_TIERS = ['thorp','hamlet','village']`
(`src/data/constants.js:5`). So the licensed tier claim is the BAND "village and below" (the STATE-KEY's
own words), never the value "village": on two of the three tiers the key fires on, the field does not
hold "village". C1 = no wall stands (a LACK on `forces.walls.present`). C2 = the tier is village or below.
May NOT: a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the
class wall. Bag filled here: `{settlement}` only. Source: muster, licensed only under §24's ceiling and
one of S3's three reasons, none of which holds; no face cites, correctly.

## The old rows' claims (for the kept/dropped arm)

Old 1 `[street]`: small (KEPT as C2); no wall (KEPT as C1); "too small to wall" (a cause: DROPPED, the
card); "knows it" (a standpoint and a totality over persons: DROPPED); neighbours, distance, unimportance,
safety (second facts and a forecast in a noun: DROPPED). Old 2 `[visitor]`: no wall (KEPT); "at this size"
(KEPT as C2); "where it ends" (an extent, a second fact: DROPPED); size explaining the absence (a cause:
DROPPED); "the country and the town agree" (inanimate intent, a totality: DROPPED). Every licensed claim
the old rows carried is present in every kept face; no dropped claim's absence is a finding.

## Verdicts, per face

### Variant 1 `[street]`

- Face 0 — `{settlement} is no larger than a village. No wall closes the place.` — **PASS.** C2 as the
  band; C1 flat, second, the LACK never opening (wall 3); the thread carried by "the place" (§1.4.1);
  the one settlement-token opener the pool is allowed (wall 10), on the numbered row where T-F8 does not
  reach. Nothing beyond C1 and C2.
- Face 1 — `Village size is where {settlement} stops. The place goes unwalled.` — **PASS.** The band
  as a stopping point (a measurement in words, R-DA-11); "goes unwalled" a standing condition, no aspect
  or forecast; the thread carried by "the place"; opens on no proper slot.
- Face 2 — `A village is the whole of {settlement}. No wall rings it.` — **FAIL.** The card: the tier
  read licenses the band `['thorp','hamlet','village']`, and "a village is the whole of {settlement}"
  states the value "village" as the whole of the place. On a thorp or a hamlet the field does not hold
  it, and the dossier's own head record names the tier, so the page contradicts itself (CLERK-LAWS C2,
  the claim the fields do not hold; the same-entry walker). A6 is breached with it: faces 0, 1 and 3 of
  this variant state a ceiling and this face states an identity, so the four are not claim-equal. It is
  also a regression against the draft on a named target: the draft's own N4 rule was that no wording
  writes "is a village" flat for exactly this reason, and the draft face it replaced ("A village is the
  size {settlement} keeps") held the band. The second sentence, "No wall rings it", is lawful on its own.
- Face 3 — `The size of {settlement} reaches no further than a village. It is not a walled place.` —
  **PASS.** The band; "It" referential, not the expletive R-DA-07 strikes; the LACK as a predicate
  nominal, second; the thread carried by the pronoun. Read-aloud only: "It" sits after two nouns
  ("the size", "a village") and the ear repairs to the settlement; no law is broken.

### Variant 2 `[visitor]`

- Face 0 — `The most that stands at {settlement} is an unwalled village.` — **PASS.** One clause,
  both reads inside one noun phrase; "the most that stands" is a ceiling, so it holds on all three
  tiers; no joint, so no cause; "that", never "which". The compound key in a single predicate, S2 not
  engaged.
- Face 1 — `A village at the largest, {settlement} is a place without a wall.` — **FAIL.** The card,
  `may NOT: a cause`, on the ambiguity ground: a fronted nominal absolute before the subject is the
  English shape of "being X, Y", and here the fronted term is the tier and the predicate is the
  absence, which is precisely the join the old row made ("too small to wall") and the rewrite exists to
  drop. The draft's N6 flagged this shape and asked the refuters to read it against the cause clause;
  the refiner's note concedes it "can be heard as causal" and kept one. No connective is written, so
  the cause is an implicature, not an assertion; under the brief's rule (default to FAIL when
  uncertain; the ambiguity that opens a claim is a listed ground) the face fails. The draft face it
  replaced carried the same fronting, so a revert does not cure; a re-cut without the fronting does.
- Face 2 — `What {settlement} amounts to is a village with no wall to it.` — **FAIL.** The same law
  as variant 1 face 2, in its mildest form: "amounts to a village" states the sum of the place as a
  village, a value the field holds on one of the key's three tiers; on a thorp the head record and this
  line disagree (CLERK-LAWS C2; A6 against faces 0 and 1, which state a ceiling). "Amounts to" carries
  a diminishing sense in the idiom, which is why this is the weakest of the three tier findings and the
  chair may distinguish it; it is ruled FAIL under the default. The prepositional "with no wall to it"
  rides on the civic noun and is not a tail (R-DA-03 satisfied); "What" is a lawful opener.
- Face 3 — `The village {settlement} runs to is unwalled.` — **FAIL.** Two grounds. First, the
  ambiguity that opens an unlicensed claim: "runs to" with a place as object is first read spatially
  (a road runs to a village), so "the village {settlement} runs to" is heard as a neighbouring village
  the settlement leads to, and the sentence then asserts the wall state of a second civic object, a
  second fact and another object of the wall class, both refused by the card. Second, on the size
  reading "runs to" names the size reached, not the ceiling, so the tier is stated as "village" as in
  faces 2 of both variants (CLERK-LAWS C2; A6 against faces 0 and 1). A zero relativiser, seven words,
  and a bare predicative close are all lawful in themselves; the ambiguity is the breach.

## Walls checked on every face

No em dash, no exclamation, no digit or percent, no `which`, no question, no "I"/"you", no expletive
opener, no future or perfect on a standing fact, no citation, no `{defwork}` (the bag's unfilled slot),
no `[plain]` on a spine row, one bracketed tag per numbered row, the same vids in the same order, two
variants in and two out, three `[face]` sub-rows each. Slot set `{settlement}` on every face. No face
opens on the proper slot (T-F8). Sibling paraphrase past a synonym swap: none found; the eight wordings
differ in grammar and vocabulary, and the failing faces fail on claims, not on paraphrase.

## Read-aloud notes (information only)

- Variant 1: the numbered row and faces 1 and 3 land in one breath each; "No wall closes the place" is
  the sharpest LACK in the pool. Face 3's "It" makes the ear pause once before it settles on the town.
- Variant 2: the numbered row is the pool's best line read aloud, the ceiling and the absence in one
  noun phrase. Face 3 is the pool's shortest wording and reads cleanly as sound; the trouble is what a
  listener takes "runs to" to mean, not how it lands.

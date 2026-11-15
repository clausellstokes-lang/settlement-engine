# TAIL-TIES · hand-back (people's ties, goals and the plot hooks)

Seat: TAIL-TIES, a builder seat; branch `lane/tail-ties-2026-11-14`, cut from the joined line `lane/join-2026-11-14` at
**f663a2699**. Worklist: `docs/chair/2026-11-14/read-all/WORKLIST-TIES.md` (96 rows, read at e5b421802). Kept current
after every batch.

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)

- **(T1)** A LINE ABOUT A VOTE, A COUNCIL SESSION OR A BODY THAT MUST AGREE NEEDS A BODY OF MORE THAN ONE: the beats
  that say "a vote", "the next council session", "the council has asked" take that condition in the form the file uses;
  under a lone headman the slot draws a sibling. NO DRAW IS MOVED outside the row's own pool: show it by the field diff.
- **(T2)** TWO BEATS OF ONE PAIR MUST NOT CONTRADICT (who taught whom; a debt "repaid in small amounts ever since"
  beside "has started repaying the debt in coin"): the pair's direction and state have ONE HOME: measure how many pairs
  print both lines, then cure where the second beat is drawn (a sibling consistent with the first), not by rewording both.
- **(T3)** A plot hook whose traveller arrives, passes through or leaves needs open roads (not under a siege or a
  quarantine); "the guard is investigating" needs a force; "their street", "paying for drinks", "their best customer"
  need the street, the tavern or the market the town has: declarations in the form src/domain/hookThemes.js already uses.
- **(T4)** src/data/faceHonorifics.js IS THE POWERS SEAT'S (ruled 23:13 UTC: the title word on a person is its design):
  a row of yours written there is NAMED for it.
- **(T5)** (23:25 UTC) THE WORD IS GRANTED: ONE ATOM, `ruling body` (the town is ruled by a body of more than one:
  hookTruth.js's own `ruledByCouncil` rule), through the vocabulary's own door: its registration in
  factVocabulary.js, its reader in a new home file under src/domain/facts/, the rule MOVED there and re-exported from
  hookTruth.js by one edit (that file is the CRISIS seat's: it is told), the vocabulary's tests green. The lines that name
  THE council take `needs: ['ruling body']`. THE BARE "a vote" LINES: left under lords; under a lone headman they take a
  condition the vocabulary already holds, or are PARKED with the count: no second word.

## Batch 1 · e0d38e6c4 · the tie pools (npcData.js :: STRESS_ECONOMIC_EFFECTS), rulings (T1) (T2) (T5)

Measured by census 3 on the 720 at f663a2699 (before) and at the batch (after), read through the inventory diff.

| row | sentence | towns before → after | measure (false by record) | what |
|---|---|---|---|---|
| 00828 | "… has started repaying the debt in coin." | 340 → 0 | 340 (desc[4] beside it in every print) | CURED (T2): the second beat a sibling |
| 00438 | "… will both present proposals at the next council session." | 233 → 221 | 12 (one ruler) | CURED (T1/T5) |
| 20322 | "The council has asked … to audit each other's accounts." | 190 → 185 | 5 (one ruler) | CURED (T1/T5) |
| 00669 | "… asked … for a vote against … own interests." | 331 → 331 | 7 (a Headman's Authority) | PARKED (T5: no second word) |
| 01204 | "… lost the last contract … by a single vote …" | 312 → 312 | 6 (a Headman's Authority) | PARKED |
| 22432 | "The vote … needs … comes up next week …" | 301 → 301 | 7 (a Headman's Authority) | PARKED |
| 01167 | "… learned the work at …'s side for seven years." | 304 → 304 | 4 (a reversed mentor twin of the pair) | NAMED: relationshipArchetypes.js |
| 00699 | "… has begun teaching …'s methods as …'s own." | 312 → 312 | 9 (a reversed mentor twin of the pair) | NAMED: relationshipArchetypes.js |

Also declared (no worklist row; each its lone-ruler count): the bloc line 149 → 145, "told the council" 187 → 178,
the committee 93 → 92, and ten council lines of the military, economy and government pools (0 lone-ruler prints on the 720).
Other lines in fewer towns: the refused index's other beat (the one-index draw moves the pair together): peer_rivalry
desc[6] 233 → 221, genuine_respect tension[5] 187 → 178 and desc[6] 190 → 185, wary_alliance tension[3] 148 → 144,
bitter_history desc[5] 93 → 92 (true lines). "Patron deity" 718 → 716: the census's first-render warm-up
(r2r-thorp-0, r2r-thorp-3, each worker's first seed), not this change. Inheritors: the pools' colour lines, 2 to 4
towns each. NO TIE RE-DRAWN (20,846 ties). DECLARED MOVE (tie prose only): relationships[].tension 358 towns;
.description / .proseVariant 23; prominentRelationship.phrasing / .tension 13 (.full 1); pressureSentence 5.

## The veto list (every new or changed line, with the towns it was read in)

- old_debt.tension[4]: "{A} has offered to clear what is left of the debt in one payment. {B} would rather be repaid in
  favours." (was "{A} has started repaying the debt in coin. {B} wants it repaid in favours.") — read in r2r-thorp-16
  (10 people, wartime), r2r-metropolis-8 (344,689, succession void), r2r-thorp-1 (occupied).

## Rows named for other files

- 01167, 00699 (T2, who taught whom): the contradiction is a SECOND tie of the same pair, of the same archetype, in the
  reverse direction (21 such mentor pairs on the 720; old_debt has 28: who owes whom). The second beat is drawn in
  src/generators/power/relationshipArchetypes.js :: createTieProseDraw (or the tie draw people/ties.js), in no group:
  the cure is there (orient the reverse tie's prose by the first tie's direction, the pair's ONE home).
- hookTruth.js (the CRISIS seat's) carries the one re-export edit of (T5).

## Parked (T5: no second word)

- the bare vote lines under a lone headman: 00669 (7 towns), 01204 (6), 22432 (7); also mutual_leverage desc[4] / desc[7],
  wary_alliance desc[5] / tension[5], old_debt desc[5] (5 to 11 headman towns each). The vocabulary holds no atom for
  "some body that votes" (a guild, a chapter, a council) that would not silence the line where the council votes.

## Registers named stale

- tests/property/espionageDormancyFence.test.js's driven golden: red at the base (50011ad3…), moved by batch 1
  (→ bab4e09c…).

## How the instruments are re-made

The census's one command (lane/census-3-2026-11-14 `docs/chair/2026-11-14/probes/CENSUS-3/census3.sh <tree> <out> 4`)
and the chair's lane `docs/chair/2026-11-14/probes/READ-ALL/inventory.py` / `inventory_diff.py`, git-archived to a
scratch directory outside every tree; the verification is by script over `corpus.ndjson.gz` through the tree's own
`factsOf` and `rulingBodyOf`.

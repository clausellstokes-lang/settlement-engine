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

## Batch 2 · the loyalty hooks (npcData.js :: NPC_FACTION_LOYALTY, mirrored by hookThemes.js), ruling (T3)

Measured by census 3 after batch 1 (before) and after this batch; false = by record through the tree's own `factsOf`.

| row | sentence | towns before → after | false before → after | what |
|---|---|---|---|---|
| 03130 | the traveller who "passed through … gone by morning" | 236 → 219 | 21 → 3 | CURED; 3 NAMED (representatives.js) |
| 02506 | "A cousin has arrived to stay without warning …" | 219 → 206 | 17 → 3 | CURED; 3 NAMED (representatives.js) |
| 22583 | "… paying for drinks with new silver …" | 203 → 191 | 10 → 0 | CURED (`institution: tavern`) |
| 22560 | "Their best customer … avoiding their street." | 189 → 192 | 2 → 0 | CURED (`tier: ≥ village`) |
| 02892 | "A petition … half their street …" | 112 → 103 | 8 → 0 | CURED (`tier: ≥ village`) |
| 20646 · B00314 · B17377 | "One of their most reliable suppliers has gone dark …" | 160 → 146 | 13 → 0 | CURED (no siege; not isolated) |
| B03014 | "A supplier is providing goods of uncertain provenance." | 139 → 127 | 12 → 0 | CURED |
| 03018 | "A shipment they weren't expecting arrived …" | 137 → 126 | 12 → 0 | CURED |
| B17460 | "… rob one of their fronts …" | 90 → 0 | 21 | REWORDED ("… rob them, …") |
| 20685 · 22757 | "The guard captain has a file …" | 81 → 80 | 1 → 0 | CURED (`watch`) |
| 00183 | "Three guards … the same district …" | 80 → 79 | 2 → 1 | CURED 1; r2s-occupied-town-2 NAMED (population unsettled at the draw) |
| 28599 | "Weapons from the armoury …" | 46 → 40 | 6 → 0 | CURED (`garrison`) |
| 03139 | "A valuable cargo was reported lost at sea." | 44 → 20 | 24 → 0 | CURED (its twin reads `coast`) |
| 21278 | "The person who settled every quarrel here has died …" | 15 → 3 | 14 → 0 | CURED (`crisis: succession`) |
| 21114 | the theatre's "house is full every night" | 20 → 0 | 2 (occupation curfew) | REWORDED |
| 22767 | "… a crime the guard is currently investigating." | 147 → 147 | 0 by (T3) | STRUCK: every printing town holds a force (3 hold a militia alone: r2r-hamlet-34, r2r-village-56, r2s-insurgency-village-1; for the veto) |

Other lines in fewer towns: the pools' own draws moving within the pool after a refusal (1 to 6 towns each), and the
route exclusion read unanswered on representative cards (fail-closed). Inheritors: the new fronts line (91), "lost on
the road" (26), the new theatre line (21), then the pools' own lines (8 towns at most). DECLARED MOVE (hook text only):
npcs[].plotHooks[] in 194 towns, nothing else. Re-keyed by identity: npcLoyaltyGuardRows' declared map; the
spareHookLine work bound 8 → 12 (measured 4 → 8.5: two distinct roster facts more, still one reading per fact; told to
the chair); the presumed-things widened register shrunk through its door (three rows cured).

## The veto list (every new or changed line, with the towns it was read in)

- old_debt.tension[4]: "{A} has offered to clear what is left of the debt in one payment. {B} would rather be repaid in
  favours." (was "{A} has started repaying the debt in coin. {B} wants it repaid in favours.") — read in r2r-thorp-16
  (10 people, wartime), r2r-metropolis-8 (344,689, succession void), r2r-thorp-1 (occupied).
- criminal#7: "Someone tried to rob them, and did it like a professional: no noise, the lock picked, nothing touched but
  the strongbox." (was "… rob one of their fronts, …") — read in r2r-town-8 (1,177, mass migration), r2r-metropolis-13
  (328,486), r2s-occupied-town-3 (occupied).
- the theatre manager: "The new play mocks someone powerful by another name, and every performance sells out." (was
  "… and the house is full every night.") — read in r2r-metropolis-29 (23,730, infiltrated), r2s-succession_void-
  metropolis-3 (295,750), r2s-occupied-metropolis-0 (occupied, a curfew).
- (no new line) the cargo twin "A valuable cargo was reported lost on the road. …" now prints in river towns too: read in
  r2r-village-30 (175), r2s-mass_migration-metropolis-3 (248,369), r2s-famine-village-3 (famine).

## Rows named for other files

- 03130, 02506 (3 + 3 towns): the representative cards' hook walk (src/generators/people/representatives.js, line 395:
  `factsOf({ institutions, tier })`) hands no crisis, so a siege or plague reads calm there. The cure: hand the place's
  stress to that facts call. Outside my group.
- 00183 (1 town): the population is not settled at the loyalty draw (`birthFactsOf` carries no population; the band
  reads the tier), so a "town" of 310 reads middling there. The cure belongs to the draw's facts (npcGenerator.js).
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

## Rulings that arrived after the work stopped (read at hand-back, not acted on: the budget)

- **(T6)** (the chair, 00:07 UTC): `src/generators/power/relationshipArchetypes.js` IS THIS GROUP'S WHOLE: 01167 / 00699
  (the reversed mentor twin as a second tie, 4 and 9 towns) are cured there, NO TIE RE-DRAWN (the slot keeps its draw;
  the false form takes a twin or a condition). THE VOTE ROWS 00669 / 01204 / 22432 (and the other bare vote lines,
  "Parked" below) take `needs: ['ruling body']`, with a twin true under one ruler where the slot would fall mute.
  Both are OPEN for the next seat: the measures are above; the batch-1 guard (tests/generators/tailTiesBatch1.test.js)
  is the form.
- **X9** (the chair, 00:00 UTC): the exports' own rows of these files, docs/chair/2026-11-14/read-all-3/WORKLIST3-TIES.md
  / .json on the chair's lane (29 rows, 1 HIGH: a hook's dragon demanding tribute where no dragon is on the roster):
  NOT READ; measure with `SURFACES=PDF,Journal python3 inventory.py <out-dir> x.json`. `ruling body` sits apart from the
  end of the vocabulary list (before `priest`), clear of TAIL-CRISIS's `rival power`.

## What is left of the worklist (not reached: the budget)

- npcData.js tie rows by role (mil_crim_corruption 7, mil_crim_suppression 4, econ_mil_contract 7, econ_crim_blur 4,
  rel_crim_fraud 2, bitter_history B00665, peer_rivalry B00706 / B00404, mentor_legacy B01171 / B01192, wary_alliance
  B00422 / B21732): each line gives a card an office the PEOPLE line does not (an arrest record to a blade captain, an
  altar to a hospital's master); the archetype's choice of pair is the writer (relationshipArchetypes.js, no group), the
  lines need a per-card word (the chair's PARKED "commands the patrols" family).
- npcData.js NPC_CRIMINAL_SECRETS_BY_HOLDER (17103, B16645); npcStructure.js reg (8 rows); powerSiblings.js (7 rows:
  20473 HIGH "no lord stands over them" under an occupation, 28616, 23160, 03038, 02676, 22409, B19180);
  goalFamilies.js (12 rows); plotHooks.js TENSION_LABELS (2) and ECHO_PREFIXES (7: the hook text is the history
  generator's, the prefix list only matches it: NAMED for the HISTORY group).

## Guards owed

- the representative walk's crisis (above), with its own NOT pairs (r2s-under_siege-metropolis-2,
  r2s-plague_onset-metropolis-3).

## How the instruments are re-made

The census's one command (lane/census-3-2026-11-14 `docs/chair/2026-11-14/probes/CENSUS-3/census3.sh <tree> <out> 4`)
and the chair's lane `docs/chair/2026-11-14/probes/READ-ALL/inventory.py` / `inventory_diff.py`, git-archived to a
scratch directory outside every tree; the verification is by script over `corpus.ndjson.gz` through the tree's own
`factsOf` and `rulingBodyOf`.

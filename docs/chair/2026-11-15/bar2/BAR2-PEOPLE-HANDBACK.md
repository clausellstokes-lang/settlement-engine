# BAR2-PEOPLE · hand-back (groups POWERS and TIES; REVIEW-BAR-2)

Seat: BAR2-PEOPLE, a builder seat. Base: the joined line `lane/join-2026-11-14` at **f8042b61a** (the tip read from origin
at the start). Branch: `lane/bar2-people-2026-11-15`. All work in a scratch worktree. The joined line's test bookkeeping
was being closed on other branches when I started, so THE BOOKS (F2) wait for the chair's "MERGE THE LINE AT <tip>"
(see the last section).

## The rulings I worked to (the chair's, 2026-11-15; each vetoable by the owner)

(PP1) the free rung's label claims only the rung; measure, do not cure, the seats that share a criminal house.
(PP2) ONE HOME FOR WHO DECIDES: under an occupation the occupier; elsewhere the note and the governing line read one
fact; where they cannot differ the note is silent.
(PP3) a tie claiming a shared trade only where both cards share one; no tie re-drawn.
(PP4) two lines of one pair contradict: measure; the second admitted by what the first states.
(PP5) a hook that does not fit its holder: first, whose hook is it on the record.
(PP6) the well-funded watch: admitted by the record's funding and order facts, or claims neither.
(PP7) the faith at peace with the seat; "with nothing threatening"; the salt works "while it runs well"; the council
committee: each admitted by the fact it presumes, in the file's form.
(PP8) the memory-altering secret where the magic is none.
(PP9) the mine captain's "sells ore by the cart": the tail round's title-line rule.
(PP10) under a crisis: the carters under a siege (a twin); the noble family where no noble stands; the occupier's
standing line (its own line).

Each was measured first on the census's 720 (and on the bar's 30 towns, born at the base the census's way).

## Batch A · the powers (PP1, PP2, PP9, PP10)

Measured by the record before it was built (python over the base census's `corpus.ndjson.gz`; the bar's towns born at the
base); the census at the base (`before`) and at a snapshot of the batch (`afterA`), read through the inventory diff.

| row | sentence | before → after (of the 720) | the cure |
|---|---|---|---|
| C1095, C34673, C8985 (PP1) | "Free of the criminals." | 589 → 0 | `dmPowerLines.js :: CAPTURE_RUNG_LABELS.none` reworded: "The seat is not in criminal hands" (589 → 589, the same towns) |
| C28248, C30297 (PP2) | "Holds the title; the decisions that matter are made by Merchant Guilds." under an occupation | bar towns: gone (the 720's 8 are not occupied: unchanged, true) | `powerStrata.js :: crisisNoteFor` reads `deciderOf` (the occupier under an occupation, else the outranking rival) and is silent where a relation line already names that decider |
| (PP2's class) | "...made by Occupation Authority." / "...by The Guard." / "...by Military Party." | 7 → 0 · 17 → 2 · 3 → 1 | silent: the relation line beside it says the same ("<hall> carries out what Occupation Authority decides"; "<hall> keeps the title; The Guard makes the decisions that matter"): one home |
| C11586 (PP9) | "Sells ore by the cart; hires workers by the week." | 49 → 0 | hedged as the tail round's title lines: "…, from what the workings still give; …" (26 of the 50 mine captains printing it hold no ore); its sibling secret (25 → 0) said in the past ("Has sent miners into a gallery they knew was unsafe, because the ore there was the richest") |
| C3525 (PP10) | "Carters are waiting at the post…" under a siege | the 720 hold none under a siege (8, calm, unchanged: true); the bar town: gone | `conflictIssues.js`: the line and its sibling wagon line `excludes` the siege, each with a twin (`twinOf`, `crisis: under_siege`) reached by resolution only (no draw moves); the quay's boat line likewise; `conflicts.js` hands the birth's crisis to the hook's facts (the stress shape, as `birthFactsOf` does) |
| C28193 (PP10) | the occupier's "Behind … by too much…, petitions and procedure" | 17 occupier standing lines (in the shadow 6, the gap is narrow 8, worth buying 2, petitions 1) → its own line | `factionStanding.js`: below the first, the occupation's appointed power (stressPowerFaces.js) takes "It does not bargain for its way: <hall> carries out what it decides, whatever its numbers." (the relation line's fact; the verb agrees with the hall) |

EVERY OTHER LINE THE DIFF MOVED, EXPLAINED: the ladder lines in fewer towns ("A single shift in patronage…" 113 → 105,
"The gap … is narrow" 46 → 42, "in the shadow of" 55 → 53, "worth buying" 10 → 9 and 3 → 2) are the occupier's own,
replaced as ruled; "Patron deity" and its two upsell lines (717 → 716) left r2r-thorp-2, the first dossier of a render
worker (the lazy panel is not loaded on a worker's first page: the instrument's, not a line my cure writes; the base
misses it on its own first pages too). Nothing prints in more towns. THE INHERITORS: the new label (589), the hedges (49,
25) and the occupier's line in its 17 towns, each read where it prints.

Guard: `tests/generators/power/bar2PeoplePowers.test.js`: 8 pairs red at the base (f8042b61a), 3 KEEP green before and
after (the note where no relation names the decider; the carters in a calm town; the Guard's petitions line); green at
the tip. Gates: eslint on the touched files, the strict-domain gate, the type ratchet: green; the presumed-things walker:
fresh 0 at the base and the tip (a first wording of the quay's twin named "siege" and was reworded); the twelve-birth
grid: 0 falls at the base and the tip.

## Batch B · the ties and the seats (PP7)

The census at a snapshot of the batch (`afterB`, read against `afterA`). PP3 was in that snapshot and was TAKEN BACK OUT
before the commit (below); the rows here are independent of it (their lines are not tie lines of the rivalry pool).

| row | sentence | before → after (of the 720) | the cure |
|---|---|---|---|
| C6878, C9046 (PP6; rulings PP6 and PT3) | "Well-funded city watch; it keeps order reliably and is growing more sure of its own authority." | 101 → 0 | reworded to claim neither funding nor order (false in 57 of 101: a coordinated crime wave or irregular pay beside it; the power step cannot read the safety profile): "City watch; it answers for keeping order and is growing more sure of its own authority." (0 → 101, the same towns), its `needs: watch` kept, at its three homes (rulingStructure.js, claimStanding.js, powerSiblings.js); the two tests that pin the text re-keyed by identity beside a dated note |
| C23104 (PP7) | "<A> and <B> have been placed on the same council committee." | 92 → 0 | "…have been handed the same dispute to settle together." (70 of 95 ties name a card outside the ruling body), text only, its declarations unchanged |
| C20059 (PP7) | "Leads the faith in quiet times, at peace with the seat beside it." | 75 → 0 | "…, whatever it thinks of the seat beside it." (20 of 75 beside a competitive or tense faith-seat relation) |
| C25301 (PP7) | "Constraint: With nothing threatening, it is hard to win the coin…" | 74 → 0 | "It is hard to win the coin and the say that would be needed if worse trouble came." (15 of 74 beside a plagued monster threat) |
| C13193 (PP4) | "They cooperate efficiently and neither trusts the other at all." beside "disagree often and trust completely" | the 720: 0 pairs print both (unchanged); the reader's town (Weihu: Tian Ma and Xiao Gao): gone | ONE HOME FOR A PAIR'S TRUST (relationshipArchetypes.js :: createTieProseDraw): the rows declare `trust: 'none'` / `'full'`; a pair's later tie is admitted only where its line agrees with the pair's first trust line; the refused index resolves like a held one, draw-free |

The declaration ledgers (`docs/census/declarations/npcStructure.T.json`, `npcData.STRESS_ECONOMIC_EFFECTS.json`) re-address
the three reworded rows by their text. Nothing else moved in the diff but the four reworded lines (gone and new in the
same towns) and PP3's (taken out). Guard: `tests/generators/bar2PeopleTies.test.js` (5 pairs red at the base, 3 KEEP
green; green at the tip). Gates: eslint, the strict-domain gate and the type ratchet green (the ratchet's three errors
on the pool's new field typed); the walker: exactly the watch line's hit (fresh 3, stale 3: one line in three files),
NAMED below under PT3; the grid not re-run for this batch (the hand-back's budget).

**PP3 (C18001, C15449) TAKEN BACK OUT, TOLD TO THE CHAIR.** Built in the tie draw's form (rows `trade: true`, held for a
pair that shares no house family and no category other than the catch-all `other`; the gloss by the same rule), it
silenced far more than the measure: "Every client…" 224 → 57 towns, "trained together…" 297 → 71, "bid for the same
contracts…" 291 → 70, and with each refused index THE TENSION LINE OF THE SAME INDEX ("A post opens at midsummer…",
"…hired away <B>'s best assistant", "…will both present proposals at the next council session") went too: one index in
this pool is a description and a tension together. Two questions for the chair before it is pushed: (a) does `other`
count as a shared category (the chair's word says "the same category"; the 134 of 291 measure counts it); (b) may the
paired tension line go with its description, or does the pool need description-only twins? Its form, to rebuild
on the answer: `pairSharesTrade(a, b)` in relationshipArchetypes.js (the same house family, or the same category), the
three rows' `trade: true` read into the pool beside PP4's `trust`, held in `createTieProseDraw` with PP4's contrary set,
and the gloss's twin "are rivals, and neither gives the other ground" in settlementNarrative.js by the same rule.

## Rows struck (true by the record, with one line why)

- **C10144, C26509** "A lender has bought the note on their shop..." (140 towns): in both readers' towns the hook is the
  outfitter's and the warehouse factor's on the record (`npcs[].plotHooks`), not the garrison commander's or the company
  captain's: the Plot Hooks section's order artifact. True of its holder.
- **C26505** "a directive from the hierarchy that contradicts their own theology" (85): its holder is the dean (the
  reader's town) and a religious card in all 85 of the 720.
- **C10139, C25638** "still lead the prayers every week" (61): the dean and the hospitaller in the readers' towns; a
  religious card in all 61 of the 720.
- **C28736** "The guard captain has a file." (79): its holder in the reader's town is the pit boss, not the watch captain;
  no watch captain holds it in the 720.
- **C7331** "Has been using magic to alter memories..." (58): THE RULING'S PREMISE IS WRONG ON THE RECORD: the reader's
  town's magic is low and works (`magicExists` true, `magicLevel` low); only its arcane support is none. A secret
  practitioner is what such a town allows; every one of the 311 magic secrets on the 720 stands in a town whose magic
  works (the draw already deletes the magical type where it does not, factionLeaderSecret.js).
- **C2705** "...the decisions that matter are made by Religious Authorities." (40, siege and famine): the note names the
  power that outranks the hall, and the page's line beside it ("<hall> could lose the hall, and Religious Authorities
  has not yet moved to take it") reads the same fact: the hall keeps the title, the stronger power has not taken it.

## Rows measured and NAMED or PARKED (not cured here)

- **PP1, the record's seat** (named, as ruled): of the 589 free-rung towns, **170** seat a holder who sits in a power
  that also holds a criminal house's face (162 through the governing power itself, 8 through another power it shares:
  the reader's village, "the head of the Elder Council holds a half share" in the Grain Holders, whose third is the
  smuggler). The rung is written at `domain/people/hallCapture.js :: writeHallCapture` (the one writer).
- **C32434** "A noble family is contesting a merchant's right..." (14; with its sibling "The merchant class is
  outbuying noble landholdings", 31 towns): FALSE in **20 of 31**: the noble power stands at the power step
  (governanceNarrative.js reads it) and the density law's trim removes it after (`generators/density/applyDensityLaw.js ::
  pruneToRoster`, which already drops a relation that names a removed seat). NAMED for the seat that holds the density
  law: the leaf it needs is that trim: a baseline conflict line that names a noble party does not outlive the trim of the
  last noble power (the line falls to the next branch of `deriveBaselineConflict`, or the conflict reads the trimmed
  roster).
- **PP5's class** (the shop hook on a holder who keeps none): 4 of 140 holders on the 720 (two watch captains, a castellan,
  a thieves' guildmaster), drawn through the crisis bias into the economy pool. Its declaration needs a holder's-trade
  word the vocabulary lacks (the pool's atoms are the town's): PARKED with its measure, told to the chair.
- **C18001, C15449 (PP3)** the shared-trade tie lines: **134 of 291** "Every client X wins..." ties pair two cards of no
  shared category or house family. The chair granted the word (VW1); the vocabulary's law (every homed word names a
  `factsOf` getter; `factsOf.js` is outside the grant) sent it into the tie draw's own form; built, measured, and TAKEN
  BACK OUT for its silence (batch B, above).
- **C13193 (PP4)**: 0 pairs of the 720 print both lines, 1 of the bar's 30 (the reader's town): CURED in batch B.
- **C6878, C9046 (PP6)**: false in 57 of 101: CURED in batch B under the chair's PT3 (its walker hit named in the books).
- **C25259 (PP7)** the salt works "while it runs well" (4 towns): the goal family `expansion` is chosen for a house whose
  chain the record calls running while its input is short: the record's seat (the chain's state), not the line.

## EVERY NEW OR CHANGED LINE (the owner's veto list)

| line (new or changed) | file | read in (smallest · largest · a crisis) |
|---|---|---|
| "The seat is not in criminal hands" (the free rung's label) | dmPowerLines.js | r2r-thorp-0 · r2r-metropolis-* (589 towns) · bar0-city-under_siege+famine-rand-3 |
| "How they deal Sells ore by the cart, from what the workings still give; hires workers by the week." | titleSecretsPresentations.js | r2r-hamlet-3 · r2r-city-30 · (49 towns) |
| "Has sent miners into a gallery they knew was unsafe, because the ore there was the richest" | titleSecretsPresentations.js | r2r-hamlet-8 · r2r-city-21 · (25 towns) |
| "The toll post has stood idle since the road closed, and two sets of men each claim the right to collect when it opens." (siege twin) | conflictIssues.js | bar0-city-under_siege+famine-rand-5 (the 720 print it nowhere: their siege towns draw another issue) |
| "A wagon was waved through without paying in the last days before the road closed, and each side says the other let it go." (siege twin) | conflictIssues.js | (reached under a siege only; printed in none of the 750 read) |
| "A boat has lain at the quay since the water closed, and two collectors both demand the duty on its cargo." (siege twin) | conflictIssues.js | (reached under a siege only; printed in none of the 750 read) |
| "It does not bargain for its way: <hall> carries out what it decides, whatever its numbers." (the occupier's standing) | factionStanding.js | r2r-thorp-27 · r2s-occupied-metropolis-0 · bar0-town-occupied-rand-3 (17 towns, all occupied) |

| "City watch; it answers for keeping order and is growing more sure of its own authority." | rulingStructure.js, claimStanding.js, powerSiblings.js | r2r-city-0 · (the metropolis cities, 101 towns, all holding a watch by its declared `needs: watch`) · r2s-under_siege-city-* |
| "<A> and <B> have been handed the same dispute to settle together. The first meeting is next week." | npcData.js | r2r-hamlet-48 · r2r-city-0 · (92 towns) |
| "Leads the faith in quiet times, whatever it thinks of the seat beside it." | npcStructure.js | r2r-village-13 · r2r-city-11 · (75 towns, calm only) |
| "It is hard to win the coin and the say that would be needed if worse trouble came." | npcStructure.js | r2r-village-46 · r2r-city-0 · (74 towns, calm only) |

## Rows named for other seats

- the density law's seat: `applyDensityLaw.js :: pruneToRoster` (C32434, above).
- the record's seat: `hallCapture.js :: writeHallCapture` (PP1's 170); the salt works' chain state (C25259).

## THE BOOKS MY CURES MOVE (F2)

THE BOOKS ARE NOT YET RUN: the joined line's test bookkeeping was being closed on other branches, and the chair's prompt
holds F2 until "MERGE THE LINE AT <tip>". MY COUNT PASSED 250,000 BEFORE THAT WORD CAME: this hand-back is made now, and
F2 is owed by whoever takes the seat. What is already known of the books:

| test / register | arm | old → new | door |
|---|---|---|---|
| `tests/lint/presumedThings.widened.register.json` (the walker) | arm 1, `watch`, implied | the row "Well-funded city watch; …" (hash ee08d7b2a92c842c) in rulingStructure.js, claimStanding.js, powerSiblings.js → the fresh hit "City watch; it answers for keeping order and is growing more sure of its own authority." (6c12f9d5be13b96e) in the same three | the close's presumed pass (ruling PT3): true where it prints (the line keeps `needs: watch`; it claims neither funding nor order); NOT re-taken here |
| `tests/generators/census5dGarrisonReword.test.js`, `tests/generators/power/claimRungsCommanding.test.js` | `WELL_FUNDED` | re-keyed by identity beside a dated note (the same line reworded) | the test files' own form |
| `docs/census/declarations/*.json` (the ledgers) | three rows | re-addressed by their text | the ledgers' own form |
| the golden surfaces (`tests/property/generatorGoldenMaster.test.js` and after) | the 525 | NOT YET COUNTED (owed): the families my cures move are `powerStructure.factions[].desc` (the occupier's standing; the watch line), `conflicts[]` hooks (siege twins), `npcs[]` presentation, secret, structuralPosition, activeConstraint text, and `relationships[]` description/tension (the committee line; PP4's held index in a pair with two trust lines) | the close's doors |

Owed by F2: (a) every test file that names a touched file (122 at batch A's list: `grep -rl` over the touched basenames);
(b) the brief's law suites; the 525 count by hashing each reference record at f8042b61a and at the tip.

## Guards owed

- `tests/generators/power/bar2PeoplePowers.test.js` (batch A: 8 pairs red at the base, 3 KEEP).
- `tests/generators/bar2PeopleTies.test.js` (batch B: 5 pairs red at the base, 3 KEEP).
- PP3's guard is owed with its cure; PP5's class (4 holders) waits for a holder's-trade word.

## What is left of my worklists

PP3 (built, taken out: the chair's two questions above); PP5's class (4 holders, a word); C32434 (the density law's
seat); C25259 (the record's seat); F2, the books, whole. Hand-back made at the budget (my count read 425,932 at 14:48 UTC,
past 250,000: the reading came only when a turn ended).

## How the instruments are re-made

The census: `git archive origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3` and
`git archive origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL` to a directory outside every tree;
`census3.sh <tree> <out> 4 --count-only` (before at the base, after at a snapshot tree of each batch, so the tree is not
edited while it renders); `inventory.py <out> <json>`; `inventory_diff.py before.json after.json <rows.json>`. The bar's
30 towns: `births.mjs` with `SEEDS=READ-ALL/packets7/seeds.bar2.txt`. The record measures are short python scripts over
`corpus.ndjson.gz` (each quoted above by its count).

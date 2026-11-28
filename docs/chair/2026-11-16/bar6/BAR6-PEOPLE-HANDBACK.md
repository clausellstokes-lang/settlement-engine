# BAR6-PEOPLE · HAND-BACK · a person's lines read the house and the roster

Seat BAR6-PEOPLE of BRIEF-BAR6 (LAW 8: 8b.person; LAW 10: 10a, 10c, 10d-seat, 10d-purse, 10e-temper, 10e-house). Base: the
joined line `lane/join-2026-11-14` at **afa46d644**. Branch `lane/bar6-people-2026-11-16`, fast-forward from it. Merged nothing.
Detectors: the auditors' own runners, unchanged (`runF.mjs`, `runD.mjs`); no detector was tightened or widened.
Renders: PAGE-COPY (`census3.sh --count-only`) at the base and at the tip, the 150 (`bar0-<shape>-rand-27..41`), the census's
720 and the fresh 300, all born and rendered without error. Sovereign by XA1 from a804fa1b5.

## THE RULES

Towns / instances (printed; record-only 0 everywhere). Base = afa46d644; tip = this branch's last commit.

| rule | the two readings, and where | the one fact made (or read) | 150 base → tip | 720 base → tip | fresh 300 base → tip | one change cured · line by line |
|---|---|---|---|---|---|---|
| 8b.person | the card's "How they deal" (`presentation.behaviour`, drawn by trade, `npcComponents.jsx`) printed bare; the house's mark (`crisisStoppedRow.js :: rowMarkText`) on the Institutions and Services tabs | READ, not made: the card takes its house's `rowMarkText` before a line that offers the trade (`npcComponents.jsx :: dealingShown`, at print) | 23/27 → 4/4 | 97/102 → 3/3 | 45/52 → 4/4 | one reading: every house the leaf marks. LEFT: houses the page calls starved that the leaf does not mark: in the 150 the war's iron (smelter ×2), a siege's timber, the spent open-cast mine (C93688); in the fresh 300 the war's iron (smelter ×3) and a brewery under a siege's iron; in the 720 two apothecaries whose herbs are "Needed, and not brought in" and one mill ("No grain reaches the mill": the audit's precision draw judged a toll mill's line WEAK). BAR6-MARKS's facts (a), (b), (e): they clear through `rowMarkText` when its leaf lands; no line of mine to change |
| 10a | `allegiance.js :: dealAllegiances` (A2) deals before `castPowers.js :: rankPowers` (A3) seats the head | NO NEW FACT: the ranks, read after they land: an allegiance still to be handled whose power the card heads (rank 1) is withdrawn (`assignHandlers`) | 1/3 → 0 | 0 → 0 | 1/3 → 0 | one change |
| 10c | `faceHonorifics.js` pools (the inland harbour master's "Wharfinger"); the roster's titles | the pool's forms that name ANOTHER registry office are refused at the pick (`ownOfficeForms`, read by `honorificOfTitle`); a looser name of the own office stands | 7/14 → 0 | 36/72 → 0 | 11/22 → 0 (the render read 1/2: "Postmaster" for the post's master beside the postmaster, bar0-town-calm-rand-123; cured by refusing the possessive fold, that town re-rendered: 0) | one change (refused forms: the inland harbour master's Wharfinger, the tanner's Master Tanner, the post's master's Postmaster, the guild's master's Guildmaster: each keeps its own office's words) |
| 10d-seat | the tie line "<s> has asked for a seat on the council" (`npcData.js :: gov_econ_dependence.tension#3`); the pair's memberships | NEW ATOM `seat held` (pair; `src/domain/facts/seatHeld.js :: pairSeatHeld`), declared `excludes` on the line | 2/2 → 0 | 6/6 → 0 | 2/2 → 0 | one declaration |
| 10d-purse | "has borrowed every year since" (`gov_econ_dependence.desc#3`); the economy desk's yearly surplus (DS-ECO-8) | none: `drawTies` is not handed the economy (its caller is `narrativeGenerator.js`, not mine): the line is REWORDED to claim no yearly borrowing ("has never cleared the debt") | 1/1 → 0 | 2/2 → 0 | 0 → 0 | line by line (one line) |
| 10e-temper (with -honest) | the temperament (`npcGenerator.js`, drawn first); the secret (three pools, drawn after) | `npcData.js :: SECRETS_DENIED_BY_TEMPERAMENT` beside `FLAWS_DENIED_BY_TEMPERAMENT`; THE TEMPERAMENT YIELDS to its secret, as it yields to the flaw (ruling P7a's form), once over the whole cast at `rankPowers`' head (`temperamentYieldsToSecret`) | 4/4 + 4/4 → 0 | 15/15 + 11/11 → 0 | 12/13 + 8/8 → 0 | one change |
| 10e-house | the watch sergeant's "draws pay for names that never walk it" (`titleSecretsPresentations.js`); the village watch card's "Nobody is paid" | NEW ATOM `paid watch` (`guardPay.js :: paidWatchOf`, over `watchIsUnpaidRota`), declared `needs` on the secret (`TITLE_LINE_DECLARATIONS.secret`) | 2/2 → 0 | 0 → 0 | 0 → 0 | one declaration |

NAMED EXCLUSIONS: none (no detector excludes anything for me). Every STANDS control of my rules in the wide read's 221 is GONE
or CHANGED in its own town (B3, below); no EXPLAINED control is touched.

THE GUARD: `tests/domain/bar6PeopleLaw10.test.js`: the six rules over the census's 720 (the auditors' own `law10a`, `law10d`,
`law10e` read record-only; three readings of its own for what the record cannot show alone: the printed honorific against the
other cards' titles, the village's rota by its catalogue name, the card's trade line against its house's mark): 0. POSITIVE
CONTROLS from the read's rows: C179090 (10a), C196525 (10c), C66115 (10d-seat), C31450 (10e-temper), C200774 (10e-house),
C88140's form (8b.person: the first born town of the 720 holding a marked house whose face sells). 9 tests, green at the tip.

LAW 5 WIDENED (B4), my files' stock (`law5w-inventory-g.mjs`, classes undeclared): **111 at the base → 108 at the tip** (three
tie lines now declare `court`); **every one of the 108 carries a reviewed reason** in my own table
`docs/chair/2026-11-16/bar6/AUDIT/tables/G.exclusions.BAR6-PEOPLE.json` (secrets and stakes, rule 2: 44; bound to its own house:
13; ties of the pair's own: 12; faction leaders' own: 9; DECLARED in the title table's channel, which the inventory does not
read: 7 presentations under a siege + 2 of their behaviour lines + 3 of the reeve's lord's-land lines (sovereign); goals declared
`sovereign` in place, which the inventory's class table does not answer: 3; the person's own things: 5; honorifics of the
office's own house: 5; other goals: 3; the lexicon's misreading of "a quarter of the worth" and "half paid": 2). Undeclared and
unreviewed after: 0.

## B3 · THE CONTROLS, BASE → TIP (REGRESS over the 150, `--verdict STANDS --list`)

```
GONE C179090 bar0-town-occupied-rand-27 | Head · Sabir al-Ghazali, the council's fixer · answers to Corrupt Council through Rania al-Basri
GONE C179117 bar0-town-occupied-rand-27 | The head of Corrupt Council answers to Corrupt Council.
GONE C196525 bar0-town-occupied-rand-40 | Connection: Wharfinger Madhuri Rao
GONE C200774 bar0-village-calm-rand-28 | Secret: Keeps the night roster short and draws pay for names that never walk it
GONE C31450 bar0-city-under_siege+famine-rand-38 | Temperament: incorruptible
GONE C66113 bar0-city-wartime-rand-36 | Clíodhna O'Dwyer's treasury borrowed from Tlachtga O'Meara to cover a bad harvest and has borrowed every year since.
GONE C66115 bar0-city-wartime-rand-36 | Tlachtga O'Meara has asked for a seat on the council as a condition of the next loan.
GONE C88140 bar0-hamlet-calm-rand-39 | How they deal Sells milk, butter and cheese at the posted price, when the cows are giving.
```
Two rows carry no `sev` and regress does not list them; read by hand: **C179288** (Sabir's own card: "Hidden allegiance answers
to Corrupt Council, through Rania al-Basri"): CHANGED: Sabir's card prints no allegiance now; the one such line left prints on
another member's card, the form the second check ruled true. **C93688** (the spent open-cast mine's "Sells ore by the cart"):
SAME, BAR6-MARKS's fact (b): its leaf does not mark that mine; my card will read the mark when it does.

## THE VETO LIST (every new or changed line, with three towns it is read in)

1. THE CARD'S TRADE LINE TAKES ITS HOUSE'S MARK (`npcComponents.jsx`): "How they deal Short of livestock. Sells milk, butter and
   cheese …": bar0-hamlet-calm-rand-39 (smallest), bar0-metropolis-calm-rand-27 (largest), bar0-city-under_siege+famine-rand-28
   (siege and famine).
2. THE TIE LINE REWORDED (`npcData.js`, gov_econ_dependence.desc#3): "<r>'s treasury borrowed from <s> to cover a bad harvest and
   has never cleared the debt. The interest is paid before the wages.": bar0-town-calm-rand-29, bar0-metropolis-calm-rand-37, and
   r2s-wartime-metropolis-0 (wartime; the census's 720).
3. THE INLAND HARBOUR MASTER IS A DOCKMASTER ONLY; THE TANNER A TANNER; THE POST'S MASTER "MASTER OF THE POST"; THE GUILD'S MASTER "MASTER OF THE GUILD" (`faceHonorifics.js :: ownOfficeForms`; bar0-town-calm-rand-123 for the post): bar0-town-calm-rand-27,
   bar0-metropolis-calm-rand-27, bar0-town-occupied-rand-40 (occupied; C196525's town).
4. THE TEMPERAMENT YIELDS TO ITS SECRET (`npcData.js :: SECRETS_DENIED_BY_TEMPERAMENT`): incorruptible → warm-hearted in
   bar0-city-under_siege+famine-rand-38 (C31450); honest → brave in bar0-village-calm-rand-28; plain-dealing → hospitable in
   bar0-metropolis-calm-rand-31.
5. NEW VOCABULARY `seat held` (pair; `seatHeld.js`), beside `lone tie`; declared on gov_econ_dependence.tension#3: refused in
   bar0-city-wartime-rand-36 (C66115).
6. NEW VOCABULARY `paid watch` (`guardPay.js :: paidWatchOf`), beside `watch`; declared on the watch sergeant's drawn-pay secret:
   refused (the sergeant takes "Takes a coin to look the other way …") in bar0-village-calm-rand-28 and bar0-village-calm-rand-34.
7. DECLARATIONS ONLY (no new words): `court` on three tie lines (the magistrate's letter, the witness before a magistrate, the
   judged case: printed where a court sits, e.g. bar0-city-wartime-rand-36, bar0-metropolis-calm-rand-28,
   bar0-city-under_siege+famine-rand-28); `crisis: under_siege` excluded on seven title presentations that meet travellers or
   caravans at the door; `sovereign` (SV1) on the reeve's two lord's-land secrets and three goals (the Mayor's regional lord, the
   Governor's crown, the Abbot's local lord).
8. 10a: no line changes; Sabir al-Ghazali (bar0-town-occupied-rand-27) holds no allegiance now.

## THE BOOKS MY CURES MOVE (red at my tip; each also red at afa46d644, so the close's)

THE NET (each run to a file through `scripts/gate-tail.sh`): BRIEF-BAR2's seventeen law suites, BRIEF-BAR3's three, BRIEF-BAR4's
amendment-2 list, BRIEF-BAR5's four, the three walkers of the corpus (negative anchors, seed loops, drawn anchors), the
mutation manifest, the BAR5 guards (`tests/domain/bar5*`, `tests/generators/bar5*`), `tests/architecture` (the chair's EG1:
21 files, 347 tests, green), the test files that pin a symbol I changed, and my guard: 86 files, 1,520 tests at the tip.
AT afa46d644 THE SAME LIST (my guard aside) READS 47 RED TESTS IN 15 FILES; AT THE TIP THE SAME 47, BY IDENTITY, AND NO OTHER
(a 48th, `faceHonorifics.test.js`'s inland anchor, was mine: re-anchored on the form the pick keeps, with a dated note, green).
Every red at the tip is red at the base: stored figures, the close's, not chased:

| file (red at base and at tip) | tests |
|---|---|
| `tests/data/tailHouses1Gaps.test.js` | 1 |
| `tests/generators/generationForkCensus.test.js` | 3 |
| `tests/generators/pipelinePinnedMode.test.js` | 3 |
| `tests/generators/tieProseDeclared.test.js` | 2 |
| `tests/lint/factLayers.walker.test.js` | 2 |
| `tests/lint/mutationCoverageManifest.test.js` | 1 |
| `tests/lint/observedShapeReaders.walker.test.js` | 4 |
| `tests/lint/presumedThings.walker.test.js` | 2 |
| `tests/lint/proseComposed.walker.test.js` | 2 |
| `tests/lint/proseCorpusBytes.test.js` | 2 |
| `tests/lint/proseEntryContradiction.walker.test.js` | 4 |
| `tests/lint/proseTasteCorruption.walker.test.js` | 1 |
| `tests/lint/proseWiringCensus.walker.test.js` | 13 |
| `tests/lint/tuningRegister.walker.test.js` | 1 |
| `tests/lint/writerReach.walker.test.js` | 6 |

Of these, my cures also MOVE (named, not re-taken): `tieProseDeclared` (my five rows spelled in its ledger; its count 44 is the
close's, the ledger already seven rows stale at the base); `factLayers.walker` (the register: `paidWatch`, `seatHeld`, and
sovereign's by XA1); `generationForkCensus` and `pipelinePinnedMode` (golden-derived). `typecheck:domain:strict` (1113, ceiling
1113), `typecheck:ratchet` (167, ceiling 167) and `eslint` on my 14 changed files: green.

THE 525 REFERENCE CONFIGURATIONS: **7 of 525 move against afa46d644**: `relationships` (6), `prominentRelationship` (5),
`npcs[].personality` (1) (hashed by field family at base and at tip, `generateSettlementPipeline` as the golden master births
them). The display cures (8b.person, 10c) move none.

DECLARED MOVES (B5): `npcs[].allegiance` (10a: withdrawn from a card heading its power), `npcs[].personality.dominant` (10e-temper),
`npcs[].secret` (the watch sergeant under an unpaid rota), `relationships[].description/.tension` (10d, the `court` lines),
`npcs[].presentation` (the seven siege presentations), `npcs[].goal` (the three sovereign goals). No new field on the saved record;
nothing in `assembleSettlement.js`.

## REGISTRATIONS OWED

- `tests/lint/factLayers.walker.test.js`'s register: two new leaves `paidWatch` (layer 1, institutions) and `seatHeld` (layer 4,
  npcs + powerStructure), and sovereign's (XA1): the register is red at the base already; the close re-banks it.
- `docs/census/declarations/npcData.STRESS_ECONOMIC_EFFECTS.json`: my five rows spelled (the three `court` lines, the seat line,
  the reworded line); `tieProseDeclared`'s count (44) is the close's: the ledger was already seven rows stale at the base.
- `docs/census/declarations/npcData.NPC_FACTION_GOALS.json`: the three goals' `sovereign` is not spelled there (no test reads it).
- No new test under `tests/generators` (mutation manifest: none owed). No new goods-module import.

## WHAT IS LEFT, IN ORDER

1. 8b.person's remainder: houses BAR6-MARKS's leaf does not mark yet (war's iron for the smelter, a siege's timber, the spent
   open-cast mine): cured through `rowMarkText` when BAR6-MARKS joins. Re-run `runD.mjs` at the joined tree.
2. "the circle's first" keeps "Lord" (its only form; `ownOfficeForms` keeps a pool whole rather than empty it): false only where
   a lord stands beside a druid circle's first: no such town in the 150, the 720 or the 300.
3. The tie ledger's seven stale rows and `tieProseDeclared`'s count; the fact layers' register: the close's doors.

## FOR THE OWNER, IN PLAIN WORDS

People's cards now agree with their houses and with each other. A vintner whose house is short of grapes says so before offering
wine. A harbour master is no longer styled with the title of the wharfinger who works the docks beside her. The head of a
criminal council no longer "answers to" his own council. A lender who already sits on the council no longer asks for a seat on
it. Nobody is called incorruptible while hiding a bribe: the temperament gives way to the secret. A watch sergeant no longer
skims pay from a rota nobody is paid for. Seven of the 525 reference towns change, all in their people's ties or one person's
temperament.

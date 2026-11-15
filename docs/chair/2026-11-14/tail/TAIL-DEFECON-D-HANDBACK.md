# TAIL-DEFECON-D · hand-back (kept current after every batch)

Seat: TAIL-DEFECON-D (builder), the third seat of the DEFECON group after the chair's split by file (D9). Branch
`lane/tail-defecon-d-2026-11-14`, cut from `lane/tail-defecon-2026-11-14` at **345f13157** (read back from origin,
2026-11-15 00:15 UTC; the first seat's hand-back tip). It merges nothing. Worklists (the chair's lane):
`docs/chair/2026-11-14/read-all/WORKLIST-DEFECON.{md,json}` (the rows of my files), the three Outlook rows of
`read-all/WORKLIST-DISPLAY-ECON.json` (D11) and the rows of my files in `read-all-3/WORKLIST3-DEFECON.{md,json}` (X9).

MY FILES (D9): `src/domain/display/defenseDisplay.js`, `src/domain/display/dossierViewModel.js`,
`src/generators/safetyProfile.js`, `src/generators/safetyLineTruth.js`, and tests. Not mine: the economy generators
(TAIL-DEFECON-2, `lane/tail-defecon-2026-11-14`), `computeActiveChains.js` (TAIL-DEFECON-C).

## The rulings worked to (the chair's; each vetoable by the owner)

- (D1) AN INCOME ROW IS BORNE OUT BY THE PAGE: "Agricultural Rents … from tenant farmers" in a place of subsistence
  holdings; "Armed escort & mercenary hire" where no company stands.
- (D2) ONE HOME FOR ONE FACT: "Highly diversified" beside "two or three trades"; "buying in what its own land does not
  provide" where nothing is imported; the food-endurance line against the stores line.
- (D3) Under a siege "everyone comes and goes by the gates", "exports semi-finished goods" and "stalls that pay their
  fees" take a twin true under the siege, or the condition they need.
- (D4) THE DEFENCE RATING'S REBUILD IS NOT TOUCHED (bandLadders.js, its registers, its goldens): a row that needs a band
  changed is a STOP.
- (D5) The defence lane's last seat's measured rows: a matching row reads ONLY that row of "WHAT IS LEFT" in
  `docs/chair/2026-11-12/UPKEEP-HANDBACK.md` (no row of this batch matched one).
- (D6, D7, D8) the first seat's (C1-A, C2-A in `computeActiveChains.js`; the smith's iron; PEACE_IRON_HOOKS): not this
  seat's files.
- (D9, 2026-11-15 00:15 UTC) THE GROUP SPLIT BY FILE, three batches at once: this seat holds the four files above.
- (D11) THREE MORE ROWS ARE MINE: 14073, 14072 and 14075 of WORKLIST-DISPLAY-ECON (the Outlook rows, written by
  `dossierViewModel.js`).
- (D12) NO BAND OF THE DEFENCE RATING IS CHANGED BY A TAIL SEAT: a defence word the record's own lines do not bear
  ("Lightly Defended" with every line empty: 24 towns) is measured by another seat as a cure of the record; such a row
  of mine is struck "the record's: RECORD-MEASURE-2, class f" (none of mine was).
- (X9) THE EXPORTS' READ: the rows of my files that only the PDF and the journal print, taken with a batch of the same
  writer, measured with `SURFACES=PDF,Journal python3 inventory.py`. The EXPORTS seats hold `src/pdf/` and
  `src/foundry/` and call the tabs' leaves: NO LEAF SIGNATURE in `defenseDisplay.js` changed in this batch
  (`criminalOpNote(name)`, `deriveCriminalStructure`, `deriveSupportingCapabilities`, `foodEnduranceLine` keep theirs).
  (The chair's note named the read's one HIGH as watch towers and muster drills; in `WORKLIST3-DEFECON.json` the one
  HIGH is #15738, the mill toll line of `computeActiveChains.js`: TAIL-DEFECON-C's file, not mine.)
- And BRIEF-TAIL's laws (silence is true; a mute state takes a twin; no draw moved; siege/famine; agreement; one home;
  no new vocabulary word; no `src/pdf/` or `src/foundry/`; every new line listed for the veto).
- (D13, 00:18) the walls' repairs line "Fresh repairs show on <town>'s town walls …": its writer is
  `src/data/dossierStateProse/defense.generated.js` (the Defense state-prose pool), not one of my files: named to the chair.
- (D16, 00:41) B11922 of WORKLIST-DISPLAY-CIVIC ("Legal Infrastructure · Court only" where no court is on the roster), my
  file: taken with batch 1 (struck, below, with its note's twin B05733).
- (D20, 00:45) D12 CHANGED: class f is MEASURED, GRANTED AND MINE: an empty roster reads at most Vulnerable
  (`src/data/bandLadders.js :: readinessBandOf`, lent for it; RECORD-MEASURE-2's f.patch). Its own commit, a declared move.

## Batch 1 · the Defense tab's notes and the Outlook (`defenseDisplay.js`, `dossierViewModel.js`)

Base 345f13157 (census at the base: before.json; every row's fold prints at the base in exactly its worklist count, in
the town it was read in, but X9's #03597, GONE AT THE BASE: the first seat's tower cure). Verified by script over the
base census's records (`corpus.ndjson.gz`) and the Outlook writer run on every record. Measure = towns where the record
makes the sentence false, of the towns that print it.

| row | sentence (short) | prints | false | cure |
|---|---|---|---|---|
| B13779 | Medical Readiness "No healer is kept here; the sick are tended by their own families." | 240 | 7 (a person whose role is "Tends the sick": every one a plague's cast, thorps and hamlets) | twin where one of the roster's people tends the sick (`sickTendedByOne`): "No healer's house stands here; the sick are tended by one of the place's own." |
| B02441 | "A criminal operation with a hold on part of the place or its trade." | 132 | 132 (every one the safety profile's "Red Light District", whose house is the town's Entertainment quarter) | `criminalOpNote` names the house: "A quarter given over to pleasure: a trade that runs at the edge of the law." (signature unchanged) |
| B00162, B11531, 18046 (and the ring's v3) | the organised ring's note: "One criminal ring decides …" / "Shopkeepers here pay one ring …" / "Ask who runs crime here …" | 25 / 25 / 36 / 32 | 6 / 6 / 12 / 6 (no criminal seat on the roster and no thieves' guild house: "Front businesses" or "Underground city" alone made the key ORGANIZED) | the note says what those houses show (`ringWithoutSeat`; the key, label, colours and every reader of `key` unmoved; no roll): "Crime here is run as a business: its money passes through shops that look honest, and whoever runs it keeps out of sight." / "Crime here runs through a second economy underground, and whoever runs it keeps out of sight." |
| B11428 | v1 "It keeps the streets quiet because trouble brings the law …" | 48 | 11 (the safety label is Dangerous, Desperate, Unsafe, Critical or Volatile) | the vantage is refused there and the table's own note prints (true: a ring stands) |
| 09264, 09257 | Food endurance "… household stores would carry the thorp for about two months …" | 68 / 2 | 59 / 1 (the span said otherwise than the Economy tab's stores row: 1.5 months "about two months" beside "about a month and a half") | (D2) ONE WRITER for the span: the line reads `tonightSheet.js :: storesSpanWords` (the stores row's) below a year, its own year words from a year up (where that writer prints a figure); `monthsInWords` deleted |
| 00585 | Outlook "<N> gets through the year, buying in what its own land and trades do not provide." | 161 | 14 (no food bought and nothing arrives: Economics prints "No recorded imports." and "Needed, and not brought in") | (D2) twin where nothing is bought in (`buysIn`: food bought, or an import the tab prints as arriving): "<N> gets through the year on its own land and trades, and goes without what they do not provide." |
| 00628 | "<N> grows less than it eats, and the difference arrives by road." | 26 (43 by every route) | 26 (a residual deficit stands after imports in every one: the branch is `deficit > 0`) | reworded: "… and part of the difference arrives <route>." |
| 14073, 14072, 14075 (D11) | "Much of what <N> eats is brought in <route>; its own land does not produce enough." | 38 / 9 / 3 (50 by every route) | 30 / 6 / 3 under a quarter of the need imported (from 1%) | reworded, claims no more than every printing town bears: "Some of what <N> eats …" |
| 01134 | "<N> keeps order and pays its way, but it has to buy food …" | 4 (20 by every route) | 2 (a slave revolt in force; 3 by every route) | `keepsOrder` is false under a slave revolt or an insurgency (`OPEN_REVOLT`); the pool's next true line prints ("Some of what <N> eats …") |

STRUCK (true by the record, or another writer's): **B05733** "Courts without detention." (124) and **B11922** (D16)
"Legal Infrastructure · Court only" (124, the same towns): 77 stand a courthouse or court buildings; the other 47 a Town
hall or Town council that drew a court service ("Dispute arbitration … before a magistrate", "Dispute adjudication"):
the chair's own ruling on #575 (W2-C-LEAVES-SIDE, `courtOnRoster`) holds that such a house holds the court. **08232** (X9)
"Hears civil pleas in the town court": the same ruling; and the text is `src/data/institutionServices.js`'s, not mine.
**09274, 09269, 09273** "the granary would carry … for more than a year" (111, 5, 4): the granary holds 12.7–15.5 months
in every printing town; the line beside it, "little is being put by against the town being cut off", is the Defense
state-prose pool's (`defense.generated.js`, named). **09275, 09256** (25, 4): the stores the record holds under a famine;
the figure is the stores row's own. **B00521** "cannot feed itself: part of its food comes in" (28): true in every one (a
residual deficit stands even after the imports). **15119** (3): nothing arrives (the tab's trade lists), the deficit
stands, and the record holds the magic share. **15062** (2): nothing arrives and nothing is needed by the tab's lists.
**28960** (X9, 1) "Thieves' Guild (Powerful): Controls the criminal hierarchy.": a guild house stands; "Suppressed" is a
power's strength, not its absence (the first seat's ruling on 20990); the "(Powerful)" is the catalogue name the PDF
prints raw: NAMED for the EXPORTS seats (the leaf to call: `institutionDisplayName`). **03597** (X9): GONE AT THE BASE.
NAMED: **11705, 14131** "… leads the defence: the defence of the place, with no one named to lead it." is
`src/domain/crisis/crisisCast.js` (`defenderInstitutionPlace`) and `crisisHooks.js`: the crisis group's files.

Guard: `tests/domain/tailDefeconDisplayLines.test.js` (11 GONE pairs red at 345f13157, 8 KEEP pairs green before and
after; a plant (00628's old words restored) reds its pair; not committed). The pin the D2 cure moves:
`tests/domain/foodEnduranceSaysTheStores.test.js` "three days of stores" RE-KEYED BY IDENTITY ("a few days" -> the stores
row's "about three days").

AFTER RUN (census at the batch's tree; `inventory_diff.py before.json after1.json <the 28 rows>`; tabs 29,887 -> 29,900;
gone 18, new 31, fewer 16, more 0): every cured row GONE or FEWER by exactly its measure: B13779 240->233, 00585 161->147,
B02441 132->0, 09264 68->9, 09257 2->0, B11428 48->30 (its 11, and 7 no-seat towns that take the twin), 18046 36->24,
00628 26->0, 14073 38->0, 14072 9->0, 14075 3->0, 01134 4->2. B00162/B11531 25->26: 6 to the twin, and 7 towns where B11428's
vantage was refused print the table's note (a ring stands in each). The struck rows unchanged (09256 4->3: one town's
half-ration span reworded by the D2 cure). EVERY OTHER LINE THAT LOST TOWNS is a cured line in another fold: the food
endurance line's other spans (village 107->52, hamlet 59->5, "a few days" 12/10/6 -> 0: the stores row's words now),
the other routes of 00628 and 14073, and the ring's vantages' second sentences. THE INHERITORS (34, each a twin or
reword of this batch) read where they print: r2r-city-10 (the pleasure quarter, beside its Red light district house),
r2r-thorp-10 and r2r-hamlet-1 (food endurance beside "No granary; about a month and a half in household stores."),
r2r-city-0 (the business twin; no criminal seat, Front businesses on the roster), r2r-thorp-1 (the goes-without twin
beside "Needed, and not brought in: stone"), r2s-plague_onset-hamlet-0 (the one who tends the sick on the People tab),
r2r-town-37 (the table's note, a Thieves' Guild seat): each true there. The exports' inventory (SURFACES=PDF,Journal)
moves the same lines in the same towns (the PDF and the journal call the same leaves).

The two notes' last wording ("A quarter given over to pleasure …", "… a second economy underground …") was set after
the census (the presumed-things walker read "Brothels" as a house and "below the streets" as a size word in the census's
wording); the same slot, the same towns (132, 3).

NO DECLARED MOVE: display code only; the record is unchanged (the census corpus at the batch's tree is the base's).

GATES: strict-domain 0 (1113 = ceiling); type ratchet 0 (167 = ceiling); eslint on the touched files 0; presumed-things
walker 147 fresh at the base, 147 with the batch; the grid 0 rises (the 2 falls the first seat named: r2r-city-0 P7a,
r2s-insurgency-metropolis-0 P7a); the 69 test files naming the two files: the same 8 tests in 6 files red at the base
and with the batch (CARRIED: crimeLineDisqualifiers 3, defenseWordsFindings, famineStoresOneRounding,
threatRowsTrueUnderBand, pdf/goldenViewModel, ui/defenseTabFlow); `copy/voiceMechanics` (an em dash typed in a string
literal) cured before the commit.

## D20 · class f: an empty roster reads at most Vulnerable (`src/data/bandLadders.js`, lent) · its own commit

RECORD-MEASURE-2's `f.patch` (`readinessBandOf`: with `held` false the ladder starts at Vulnerable) applied as lent REDS
SIX TESTS the base does not (bandLadders A2, A5; defensePostureReadsBadge 2; defenseStateProseDesk DS-DEF-1 2): its
`held = false` is the DEFAULT, and one caller omits it (`defenseStateProse.js :: posturePoolKey` bands the bare score),
so every town's posture pool would have read at most Vulnerable. CURED IN THE LENT FILE ALONE: `held` is three-state:
`true` (a held roster: the floor above Undefended, as UPKEEP-12 ruled), `false` (the producer read an EMPTY roster: at
most Vulnerable, the ruling), omitted (the ladder alone, as before; the posture pool is one for Lightly Defended and
Vulnerable, so it agrees with the badge in the 24). The two producers (`defenseGenerator.js`, `recordInvariants.js`)
pass `defenceHeldOf(...)`, a boolean: unchanged.

THE DECLARED MOVE (births only, `corpus.ndjson.gz` at 345f13157 against the base with the cure; field diff by family on
the 720), exactly the chair's measure: `defenseProfile.readiness` label, color, background, border 24 towns (23 "Lightly
Defended" and 1 "Defensible" -> "Vulnerable"; thorps 17, hamlets 4, villages 3; every roster empty);
`powerStructure.publicLegitimacy.score` and `.breakdown` (the defense term) 7; `simulationTrace[].causes[].reason` 7;
`powerStructure.stability` 1 (r2r-village-49: "Ordered (strong military presence)" -> "Stable", the empty roster no longer
read as a strong presence). Nothing else moves. "Lightly Defended" with every line empty: 24 -> 0.

Guard: `tests/data/tailDefeconDEmptyRosterBand.test.js` (3 births red at 345f13157 and the leaf's three states; 2 KEEP
births whose roster holds a force keep "Lightly Defended"). GATES: eslint 0; strict-domain 0; type ratchet 0; walker 147
(the base's); the grid 0 rises; the 22 test files naming the ladder: the same 5 tests red at the base and with the cure
(CARRIED: defensePostureReadsBadge "under a siege the strong posture says nothing", editCorpusRatchet A3 A4 A7 A8). The
generator golden master (525 configurations) moves with the label: NAMED, not re-taken. No line is new or reworded
(the ladder's own word): nothing for the veto list.

## The veto list (every new or changed line, with towns it was read in)

Batch 1 (the after census: the smallest and largest it reaches, a crisis among them):

- (132) "A quarter given over to pleasure: a trade that runs at the edge of the law." — r2r-city-46 (city 2578); r2r-metropolis-8 (metropolis 344689, succession_void); r2s-under_siege-city-1 (city 2679, under_siege)
- (32) "Crime here is run as a business: its money passes through shops that look honest, and whoever runs it keeps out of sight." — r2s-indebted-town-2 (town 590, indebted); r2s-mass_migration-metropolis-3 (metropolis 248369, mass_migration)
- (3) "Crime here runs through a second economy underground, and whoever runs it keeps out of sight." — r2r-metropolis-50 (metropolis 19080, politically_fractured); r2r-metropolis-43 (metropolis 84197)
- (43) "<N> grows less than it eats, and part of the difference arrives <route>." — r2s-plague_onset-thorp-0 (thorp 14, plague_onset); r2s-occupied-metropolis-3 (metropolis 262531, occupied)
- (53) "Some of what <N> eats is brought in <route>; its own land does not produce enough." — r2r-thorp-32 (thorp 8, wartime); r2r-metropolis-10 (metropolis 159896); r2s-slave_revolt-thorp-1 (thorp 15, slave_revolt)
- (14) "<N> gets through the year on its own land and trades, and goes without what they do not provide." — r2r-thorp-36 (thorp 5); r2s-infiltrated-hamlet-3 (hamlet 72, infiltrated); r2s-monster_pressure-thorp-3 (thorp 10, monster_pressure)
- (7) "No healer's house stands here; the sick are tended by one of the place's own." — r2s-plague_onset-thorp-2 (thorp 9, plague_onset); r2s-plague_onset-hamlet-1 (hamlet 35, plague_onset)
- (282) Food endurance, the span in the stores row's words ("about a month and a half", "about three days", "about two and a half months"; the year words kept) — r2r-thorp-36 (thorp 5); r2s-recently_betrayed-village-2 (village 394, recently_betrayed); r2s-under_siege-thorp-2 (thorp 6, under_siege)

## Rows named for other groups · registers named stale · guards owed

- `src/data/dossierStateProse/defense.generated.js` (state prose): "little is being put by against the town being cut
  off" beside a granary of more than a year (09274's reader); "Fresh repairs show on <town>'s town walls" (D13).
- `src/domain/crisis/crisisCast.js` / `crisisHooks.js` (crisis): 11705, 14131.
- `src/data/institutionServices.js`: 08232 (struck by #575; named if the chair rules the service text otherwise).
- EXPORTS (`src/pdf/`): the catalogue bracket "(Powerful)" printed raw beside a Suppressed seat (28960).
- Stale registers: the grid's two falls (above); `tests/pdf/goldenViewModel` (red at the base) moves with the Outlook
  and food endurance words: named, not re-taken.

## What is left

- Every row of my four files on the three worklists (21 of WORKLIST-DEFECON after the first seat's batch, D11's 3, X9's
  4, D16's 1) is cured, struck or named above. `safetyProfile.js` and `safetyLineTruth.js` hold no row the first seat
  left (X9's one, #03597, was gone at the base).
- Nothing. The seat hands back after D20 (below).

## How the instruments are re-made

`git archive origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL` and
`git archive origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3` into a directory outside every tree;
`census3.sh <tree> <out> 4` (the render is the long stage, about 35 minutes here; the counting stage after it is not
needed for the inventory); `inventory.py <out> before.json` (and `SURFACES=PDF,Journal` for the exports);
`inventory_diff.py before.json after.json <rows.json>`. The Outlook was measured by running `deriveViability` and the
trade lists (`tradeListsAsPrinted`) over every record of the corpus (an ad hoc node script); the rest by ad hoc python over
`corpus.ndjson.gz` and the dumps; none committed. A births-only corpus (`births.mjs` alone, TREE/OUT/SEEDS) serves a
field diff.

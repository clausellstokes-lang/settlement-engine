# LEFT-LINES · hand-back (the sixth chair's round of what earlier seats left, 2026-11-17)

Seat LEFT-LINES of `docs/chair/2026-11-17/sixth/briefs/BRIEF-LEFT.md` (the chair's lane). BASE
`lane/point33-candidate-2026-11-17` at e0242a12a (tree 4a9735d2f9). BRANCH `lane/left-lines-2026-11-17`: 62b6c50d6,
094a6b8f6, and this hand-back. Nothing merged. No pull request.

## 1 · The items, in order

| row | state at the base (measured) | what I did | 30 · 150 · 720 before → after |
|---|---|---|---|
| L31 "a rival lord", "the reformers" | **CURED AT THE BASE** by BAR7-LINES (0458d954a: the Iron Dispute's rows say "a rival claimant"; its hand-back item 6/7 the reformers) | dropped | "between the settlement and a rival lord" 0·0·0 → 0·0·0; "the reformers" 0·0·0 → 0·0·0 |
| L4 the forge lines | **CURED AT THE BASE** (the two towns no longer carry a short smith: r2s-wartime-village-0 and r2s-mass_migration-metropolis-1 read `trade at work: ironwork` true; no forge line stands beside a short smith in any town) | dropped: my first commit 62b6c50d6 declared it; 094a6b8f6 restores both files to the base | runH `8k.trade` (counted) 0 at the base over the 720 (only the apart `8k.trade.mild`, 6 towns, unchanged) |
| L33, one line: the brewer's taverns | 4 brewers of the 720 stand with no tavern-kind house; 3 print "hears everything the taverns say", r2s-insurgency-village-0 "Sells by the barrel to taverns" | CURED: the brewer's welcoming and transactional presentations take `needs: ['institution: tavern']` (the EXISTING atom: tavern, inn or ale house, `institutions.js`) in `TITLE_LINE_DECLARATIONS.presentation`; a brewer with none takes the title's next admitted line, the cautious one | tavern lines with no tavern-kind house 0·0·4 → 0·0·0 |
| L32 DS-GEN-17 ADMINISTERED v4 (the gaol) | a FRESH row of the presumed-things door (`prison`) | CURED: v4 declares `prison`; v5 its twin `no court sits · no prison` | the door's fresh rows 39 → 38 (this row gone); v4 prints in 0·1·8 → 0·1·8 towns, each with its gaol |
| L32 DS-GEN-13 ENTREPOT v2 ("the town") | no size band | CURED: v2 declares `tier: ≥ town`; v6 its small-place twin | v2 prints in 0·0·0 (a rare state) |
| L8 the soft food lines | static: DS-GEN-3 Moderate v3, Import-Dependent v4 admit a low food band; DS-DEF-2 granary-and-parish v1, DS-ECO-2 well stocked v5 admit stores under three months | CURED: v3, v4 declare `food: ≥ secure`; v1, v5 declare `stores: ≥ 3`; each a twin (`food: ≤ pressured`, `stores: < 3`) | runI `9g.food-soft` 1·0·3 → 1·0·3 (apart): every one is the arrival line "… and nobody looks hungry." (r2r-city-54, r2r-city-58, r2r-metropolis-19; bar0-town-calm-rand-42), not a desk line: NOT MINE, named. staticI `9g.food` admitting 2 → 0, `9g.stores` 2 → 0 |
| L9 four static desk lines under a collapsed law | staticI `9a.order` admitting 4 | TWO CURED: DS-DEF-2 neither walls nor force v7 and DS-DEF-3 Moderate v7 declare `law: > collapsed`, each a twin `law: = collapsed`. TWO LEFT BY NAME (section 5) | staticI `9a.order` admitting 4 → 2; printed 0·0·0 → 0·0·0 (the base's own count) |

THE RUNNERS over the three populations, base against tip: runC, runI and runH (720) print BYTE-IDENTICAL tables at both
(`diff -q`); no counted row moves (my lines print in states the populations rarely hold; L33's four are a people card the
runners do not count).

## 2 · The guard

`tests/domain/leftLines.test.js` (new). Four tests: (1) each cured desk line refused where its premise is false and its twin
admitted there, and the reverse where it holds, over a CONSTRUCTED record (the facts of one born town on no road,
`left-lines-anchor-town`, with one premise atom set each way): 8 rows; (2) the shared page (N4): the record, `toPublicSafe`
and the share veil (`projectShareVeil`) admit each line and twin alike; (3) the four brewer towns print no tavern line and
print the cautious one; (4) three brewer towns beside a tavern keep the welcoming line. AT THE BASE: 3 failed, 1 passed
(8 of 8, 8 of 8, 4 of 4 cases; the positive brewer arm passes, as a positive anchor must). AT THE TIP: 4 passed.

## 3 · The new and the changed lines (for the owner's veto list)

Every line below is VETOABLE wording. The twins print in NONE of the three populations (their states are rare: a
low food band beside the Moderate line, stores under three months with no granary, the law collapsed beside a watch, an
entrepot village, an ADMINISTERED key with neither court nor gaol on the live roster); each is held by the guard on the
constructed record, where it prints. Where a line prints in no town I say so rather than name three.

| line | where it prints (30 · 150 · 720 at the tip) |
|---|---|
| DS-GEN-17 ADMINISTERED v5 "{settlement} has no court sitting and no gaol in use." | none (the constructed record) |
| DS-GEN-13 ENTREPOT v6 "Half the goods traded in {settlement} are only passing through, and its people live off their passing." | none |
| DS-GEN-3 Moderate v4 "{settlement} does not eat as well as it would like, and it talks about it." | none |
| DS-GEN-3 Import-Dependent v6 "{settlement} eats on food grown elsewhere; if the carts stop, so do the meals." | none |
| DS-DEF-2 granary-and-parish v4 "There is a little food put by at {settlement} and someone to nurse the sick: less than a season against hunger, and against disease something better than nothing and well short of a hospital." | none |
| DS-ECO-2 well stocked v6 "The stores go into {season} as full as they will hold, and that is less than a season's food." | none |
| DS-DEF-2 neither walls nor force v10 "{settlement} has no wall and no soldiers; its watch does not keep the peace in its own streets, and would be no answer to an army." | none |
| DS-DEF-3 Moderate v8 "{settlement} has people meant to keep order, but order holds only where they are standing." | none |
| the brewer's cautious line (existing, now reached): "Watchful around the vats and the store. … / Pleasant at the front; does not show anyone the back." | r2r-village-16, r2s-monster_pressure-village-1, r2s-wartime-village-1 (and r2s-insurgency-village-0) |

NEW VOCABULARY: none. Every atom is the vocabulary's own (`institution: tavern`, `prison`, `no prison`, `tier`, `food`,
`stores`, `law`).

THE POOLS (R7). Each desk twin is admitted exactly where its original is refused, so each pool keeps, in every state, the
count it held at the base (the hash draw `drawVariant` moves only a town where the twin wins, and the twin is admitted
only where its original is not). Two pools were under three at the base and stay so: ADMINISTERED (one line in each of
its court/gaol states) and GRANARY well stocked with no granary (one line). THE BREWER'S PRESENTATIONS have no twin slot
(`poolMap.js :: settleTitleLines` takes the title's next admitted row; a fourth row would move every brewer's draw), so a
brewer with no tavern-kind house holds ONE admitted presentation, the cautious one: named, as the coaching inn's under a
siege was.

## 4 · Declared moves, the books, the doors

- DECLARED MOVE (L33): `npcs[].presentation`, 24 of the 525 reference configurations (`tests/helpers/goldenMasterCorpus.js`,
  born at the base and at the tip; every one a road village on hills or mountain; nothing else of the record moves: the
  whole-record hash differs in exactly those 24). The desk lines are read at print: no stored field moves.
- THE TWO DOORS (R9): presumption classes `hits 1787 · banked 1938 · fresh 0 · stale 151 · ceiling 1938` at the base and at
  the tip; presumed things `fresh 39 · stale 72 · first-register stale 7 · banked 4688 …` at the base, `fresh 38 · …` at the
  tip (DS-GEN-17 v4's fresh row gone; no fresh line of mine: a first draft added three, the twins' copied words, reworded or
  declared before commit). No `--shrink`, no `--bank`.
- BOOKS FOR THE CLOSE (R10, AX1): the wiring census (`docs/content/wiring-census.json`) was re-taken in scratch to let the
  generator run and is NOT committed; the run also moved `src/data/proseNorms.generated.js` (one comment line: "270 of 861
  pools"), NOT committed. The pins the ten added variants move, each RED AT THE BASE ALREADY (its figure the close's): the
  variant count 3025 → 3033 (`dossierStateProseProjection.contract`, `proseComposed`, `proseWiringCensus`), the annex rows
  2788 → 2796 and homes 3493 → 3503 (`proseEntryContradiction` loaders), the QUALIFY arm's trailing coordinates 375 → 377, the
  wave gate's units 655 → 659, the byte ratchet (three desk files grew), `wiringCensusDeclared` 84 → 90 rows,
  `census2dTables`/`census2eTables` and `factLayers.walker` print the base's own messages at the tip (run alone at both; L4's edit and the two L9 pools are gone).
- RE-KEYED TESTS (R8, each a dated note beside it): `tests/lint/proseEntryContradiction.walker.test.js` two annex line
  anchors re-addressed by their text (2427 → 2428, 6177 → 6181); `tests/domain/generalStateProseDesk.test.js` the market
  partition's constructed records carry a tier (`'town'`), as every born record does, so ENTREPOT's sentence is still drawn;
  `tests/generators/people/titleLineDisqualifiers.test.js` reads an atom that is no water's by the vocabulary's own rule
  (`institution: tavern` was read as a water atom, which made rw3-metropolis-calm-1's brewer with a tavern a false red).

## 5 · Left by name

1. **L9, two of its four lines: DS-DEF-6 Legal Infrastructure: None v1 and DS-POW-5 FLAG: merchantArmy v1.** Declared with
   `law: > collapsed` and twins, they turned `tests/lint/factLayers.walker.test.js` (POOLS) further red: `law` is a layer-4
   fact and the pool table places these pools at 3 (`map:inferred`) and 4 (`map:measured`) in
   `tests/lint/factLayers.poolTable.json` (a shrink-only register, not on my list). The cure wants a seat that holds the pool
   table to place both at 5, as BAR6-DEFDESK placed DS-DEF-3 Moderate; then the declaration and the twin I wrote and
   reverted ("… so no complaint is ever written down, and order holds nowhere for long." with `no prison`; "… a private army
   that guards the houses' business and little else. Where the houses' men and the {seat} disagree, the houses' men usually
   win."). Both print beside a collapsed law in 0 towns of the 720. Note also DS-POW-5 v2 ("Order at {settlement} is kept by a
   private army …") and DS-DEF-6 v3 say the same thing; the static audit's pattern does not read them.
2. **9g.food-soft's remaining instances** (1·0·3) are the arrival line "… nobody looks hungry." (`narrativeData.js`'s
   CULTURE/arrival pool, not a desk line): not in my items.
3. **The brewer's secret "Thins the ale … charges the taverns"** and its stakes name taverns too; not in the row's one line.
4. **DS-DEF-2 granary-and-parish v2 and v3** ("The town can eat through a bad year", "a full grain store") presume the
   stores as v1 did; the audit's pattern reads v1 only. Not declared: they keep the pool at three where stores are short.

## 6 · The net (R11, N2), each gate alone through `sh scripts/gate-tail.sh`

| gate | base | tip |
|---|---|---|
| `npm run typecheck:domain:strict` | 0 | 0 |
| `npm run typecheck:ratchet` | 0 | 0 |
| `npx eslint` on my changed sources | 0 | 0 |
| `npx vitest run tests/architecture` | 0 | 0 |
| the guard | 3 of 4 red | 4 passed |
| the rounds before (`bar5*`, `bar6*` in tests/domain and tests/generators) | 1 red: `bar6MarksLaw8` (a) THE ZERO over the 720 | the same 1 red (171 tests; named, not chased) |
| `tests/lint` by name (`failnames.mjs`, compared with `comm`) | 72 red | the same 72 by name (`comm`: none new; `ledgerCitationIntegrity` differs only by the worktree path in its message, a shallow clone's missing ledger branch) |

N3: I touched nothing under `src/generators/` (L4's edit is restored; `src/data/` only). No file under `src/domain/facts/`:
no build gate. N5: `git merge --no-commit` of the line's tip `lane/join-2026-11-14` ed1d43529 into my tip says "Already up to
date" (ed1d43529 is my base's first parent): CLEAN. N6: `lane/checks-2026-11-17` was not published when I looked.

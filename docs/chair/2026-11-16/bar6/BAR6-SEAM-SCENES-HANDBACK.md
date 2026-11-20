# BAR6-SEAM-SCENES · HAND-BACK · the scene laws hold their new lines

The seat SEAM-SCENES of `docs/chair/2026-11-14/briefs/BRIEF-BAR6-SEAM.md` (the chair's lane), 2026-11-17. Base: the joined
line `lane/join-2026-11-14` at **cfc2b680a** (the tip the prompt named; no later tip). Branch
`lane/bar6-seam-scenes-2026-11-17`: code at **e650ea0ab**; this hand-back is the commit after it. Nothing merged. All work
in scratch worktrees outside the repository.

HOW IT IS MEASURED. The 150 wide-read towns (`bar0-<shape>-rand-27..41`) and the census's 720 (PAGE-COPY `seeds.txt`) were
each born and rendered whole at the base (cfc2b680a) and at the code tip (e650ea0ab) by PAGE-COPY's `census3.sh
--count-only`, with the output in scratch. runC (`docs/chair/2026-11-16/bar6/AUDIT/runC.mjs`) was run over each. The scene
guard and my own guards were run at the tip. B7's depth was read by a scratch reading of every reachable arrival sense pool
(an original admitted, or its twin where the original is refused), at afa46d644, at the base and at the tip. The 525
reference configurations were born at base and tip and compared field by field.

## THE COUNT (runC; the scene guard)

| rule / reading | 150 base → tip | 720 base → tip |
|---|---|---|
| runC 6b-denied | **5 → 4** | **19 → 13** |
| of which: a false line of mine (forges, bolts drying, tanning pits, the war desk's forges) | 4 → **0** | 14 → **0** |
| of which: a true twin the runner convicts by its words (LEFT, below) | 1 → 4 (the brought-in twin) | 5 → 13 (the brought-in twin 4 → 12; the anvil twin 1 → 1) |
| of which: another seat's | 0 | 0 |
| runC 7c / 7d (mine) | 0 → 0 | 0 → 0 (7c-plenty 1 / 3: SEAM-CULTURE's market line) |
| scene guard, census arm (`bar4ScenePresumption.test.js`) | n/a | **2 → 0** (r2r-town-34, r2r-city-17) |

## THE ITEMS

| # | item | before (base) | after (tip) | guard |
|---|---|---|---|---|
| 1 | **THE NARROWED ARM (MUST).** The scene guard's REACHABLE (MU1) arm loses its `TRADE_HOUSES` filter. A twin's trade is the good its original declares; `refusing` and `atWork` read that good's houses from `tradeAtWork.js :: GOOD_TRADES`. Where the gaps alone leave the good at work, a good a list names is struck from the imports, then from the Exports | 17 goods twins outside the proof | **all 23 goods twins proved** (the 17, and the seam's 6), each in a composed scene on sixty streams; the arm asserts ≥ 17; **none convicted** | REACHABLE (MU1), green |
| 2 | THE TANNERS. `trade at work: leather` covers the tanners' and leatherworkers' houses (`tanner`, `tannery`, `tanners`, `leatherwork`), read through `housesShortOf`; where no such house stands, leather on the Exports counts. The reek and the drying frames declare it, each with a twin | census arm: r2r-town-34 | gone (r2r-town-34 prints "Few hides reach Rundholz these days, and little leather is being worked.") | the census arm; `bar6ScenesGoods` SEAM case |
| 3 | THE SMITHS' FOUR DOMINANT LINES declare the ironwork, each with a twin (the smith and the tier kept). AND, AT THE SAME FACT: a smelter MAKES the iron and works none, so it leaves `GOOD_TRADES.ironwork` (the smith's own atom never counted it). Without that, three forge lines stood in the 720 beside Blacksmiths and Metalworkers "Short of iron." with only the Smelter not short | 150: bar0-town-occupied-rand-27; 720: 4 forge lines | **0 / 0** (r2r-city-17, r2r-metropolis-20, r2s-famine-city-3, r2s-insurgency-city-1 each print the line's own twin) | the census arm (0 of 720); the SEAM case pins the smelter |
| 3b | (found by runC, in my file `narrativeText.js`) the war desk's "Being on the right side of it keeps the forges of … running day and night on the army's contracts …" declared only `institution: smith`; it now declares the ironwork too, and its existing twin keeps the slot | 720: r2s-wartime-village-0 (one Blacksmith "Short of iron.") | gone ("… lives on the army's contracts …") | runC |
| 4 | `bar6ScenesGoods` "each good reads the page's own lists …": the constructed weaver lacked wool (MARKS's wider "short") | red | green: the record imports its wool and the claim is kept; a case beside it holds the woolless weaver short | the arm itself |
| 5 | the anvil twin takes `institution: smith` | (the twin could print with no smith) | declared. Its one print in the 720, r2s-occupied-village-1, is TRUE ("… quiet more days than it rings, for want of iron.", one Blacksmith "Short of iron."); runC convicts it by its words: LEFT, below | `bar6ScenesGoods` "every new twin …" |
| 6 | B7 HELD BY A TEST. Over sixty of the 720 (five of each size, two of each crisis), every reachable pool admits ≥ 3 lines, or no fewer than its afa46d644 figure (43 pins, measured over the same seeds born at afa46d644). A second case covers the Smelter-only town | bar0-town-occupied-rand-31: the smiths' `lines` pool admits 1 of 4 (4 at afa46d644; item 5 alone would make it 0) | **3**: three smiths twins reworded to name no forge, no smith and no house | two `bar6ScenesGoods` B7 cases (the Smelter case reads 1 at base, so it fires) |
| 7 | `textOf` count | 227 against a pin of 224 | **233** (CULTURE's 3 and the seam's 6 twins), with a dated note naming both seats | `textOf.test.js` |
| 8 | `tradeAtWork.js`'s `crisisOf` import (`crisisKind.js`, pinned lazy) | build tests green at the join | `npm run build`, `vendorPdfLazy` and `bootSmoke` green at the tip: **the import is left** | the build tests |
| 9 | CLOTH MADE AND CLOTH DYED. `cloth` is now the makers' (weaver, textile, fuller); `dyed cloth` is the dyer's (`CLOTH_KINDS`, each a part of the cloth sense's house words, pinned). The dyeing lines go on the dyer's kind; the bolts drying, the loom and the fulling stocks go on the makers'. The dyed-strips twin is reworded so that it never says the cloth is brought in where the weavers work | 150: 3 + 1; 720: 8 + 4 | the 3 (150) and the 8 (720) "Bolts of cloth hang drying …" are gone: **0 false**. The twin that keeps their slot is the brought-in twin (LEFT, below) | `bar6ScenesGoods` SEAM case |

**ITEM 9's FIGURE, SAID PLAINLY.** The brief expected 6b-denied to read 1 over the 150 afterwards. It reads **4**, and every
one of the four is the round's own twin "Bolts of cloth brought in from elsewhere are stacked in the shops, waiting to be
cut.", which the brief leaves by name. One is bar0-city-wartime-rand-36 (as before). The other three are the dyer towns
(bar0-city-wartime-rand-33, bar0-city-under_siege+famine-rand-35, bar0-metropolis-calm-rand-35). In those three the false
line is refused and the slot keeps its twin, which is TRUE there: the makers are short, and the cloth in the shops comes from
elsewhere. runC reads "bolts of cloth" beside makers marked short; it does not read "brought in" as a negation. Over the 720
the same twin reads **4 → 12**. **LEFT, BY NAME**, as the brief leaves rand-36. If the chair wants the runner's figure down,
one reword of that twin in the page's voice would carry it (e.g. "Little cloth is made here now; the bolts in the shops are
brought in from elsewhere.", which is true in every such town). I did not make it, because the brief says the line is the
cure.

## THE NET (each alone, to a file through `scripts/gate-tail.sh`, at e650ea0ab)

- `npm run typecheck:domain:strict`: 0 (1113, ceiling 1113). `npm run typecheck:ratchet`: 0 (167, ceiling 167).
- `npx eslint` on the seven changed files: 0. `npx vitest run tests/architecture`: 0 (21 files, 347 passed).
- ONE `npm run build`: 0; then `npx vitest run tests/build/vendorPdfLazy.test.js tests/build/bootSmoke.test.js`: 0 (49 passed, 17 skipped).
- My guards: `bar4ScenePresumption.test.js` + `textOf.test.js`: 10 passed; `bar6ScenesGoods.test.js`: in the rounds' run.
- The two rounds' guards (`tests/{domain,generators}/bar{5,6}*.test.js`): 19 files, 131 passed.
- `node scripts/presumption-classes-door.mjs --check`: base and tip both `hits 1805 · banked 1938 · fresh 4 · stale 137 ·
  ceiling 1938`; no fresh line of my files at either.
- `node scripts/presumed-things-door.mjs --check`: base and tip both `fresh 39 · stale 72 · first-register stale 6 · banked
  4688 · strips fresh 0 stale 0 banked 107`; no fresh line of my files. (My first rewording of a smiths twin, "A
  metalworker sits idle …", met the door as `house: metalworker`. I reworded it to "Someone sits idle …" and the door read 39
  again.) Both doors exit 1 at base and at tip with the same counts: the close's stale rows and other seats' fresh lines. I
  ran no `--shrink` and no `--bank`.

## THE NEW OR CHANGED LINES A READER CAN SEE (every wording VETOABLE)

`src/data/arrivalProse.js` (towns of the tip renders; "none" means reached only where its original is refused, and proved by
the REACHABLE arm in a composed scene):

| line | kind | prints in |
|---|---|---|
| "The forges of {n} are quiet more often than not, for want of iron." | new twin (smiths, dominant) | r2r-city-17, r2r-metropolis-20, r2s-insurgency-city-1 |
| "Only a little forge smoke rises here, and the anvils ring now and then, when there is iron to work." | new twin | bar0-town-occupied-rand-27, r2s-famine-city-3 |
| "The racks outside the workshops stand mostly empty: the smiths are short of iron." | new twin | none |
| "The smithies of {n} are quieter than they ought to be, for want of iron." | new twin | none |
| "No hammer sounds over the roofs today: there is no iron to work." | reworded twin (was "The forge is banked low …") | none |
| "Only a thin thread of smoke rises over the roofs, and no hammer keeps time under it." | reworded twin ("from the forge" → "over the roofs") | none |
| "Someone sits idle in a workshop doorway, with no iron to work." | reworded twin (was "A smith sits in the forge doorway …") | r2s-insurgency-village-0 |
| "The anvil at {n} is quiet more days than it rings, for want of iron." | now needs a smith | r2s-occupied-village-1 |
| "Few hides reach {n} these days, and little leather is being worked." | new twin (tanners) | r2r-town-34 |
| "No carts of hides go out on the road these days." | reworded twin (was "Bales of hides … stacked high in the tanning yard.") | none |
| "Hardly a hide hangs drying anywhere, and the lanes smell of nothing worse than the town." | new twin | none |
| "A length of plain cloth hangs in a shop doorway, waiting to be cut and sewn." | reworded twin (was "… brought in from elsewhere to be cut and sewn.") | none |
| the four smiths' dominant lines, now on `trade at work: ironwork` | declared | e.g. "The hammering of the forges …": bar0-city-under_siege+famine-rand-27, r2r-town-7, r2r-town-13 |
| the reek and the drying frames, now on `trade at work: leather` | declared | r2r-town-41, r2r-city-0 (reek); bar0-village-famine-rand-39, r2r-city-7, r2r-city-11 (frames) |
| the dyed strips and the dyer, now on `trade at work: dyed cloth` | declared | none in either population |
| "The clatter of looms follows you through {n} …" (unchanged words; `cloth` no longer answered by a dyer) | its twin now prints where a dyer alone works | r2r-town-46, r2r-city-2, bar0-city-wartime-rand-38 |

`src/generators/narrativeText.js`: the war desk's forge line declares the ironwork. Its twin, "Being on the right side of
it, {n} lives on the army's contracts …" (unchanged words), now prints in r2s-wartime-village-0.

## NEW VOCABULARY (the owner's veto list)

Two keys of the existing atom `trade at work`, the two S4 allows; no new atom: **`leather`** (item 2) and **`dyed cloth`**
(item 9), added to the keys list in `factVocabulary.js` (that one line). Two existing readings narrow. A dyer no longer
answers `cloth` (the brief's rule: a dyer answers only a line that shows dyeing). A smelter no longer answers `ironwork`.

## THE DECLARED MOVE (B5) AND THE BOOKS MY CURES MOVE

- The record. Only the arrival scene (`arrivalScene`, drawn at birth on its own substream) and, in one town, the pressure
  sentence (`pressureSentence`) move, and only where a line I declared or reworded is drawn.
  **The 525 reference configurations: 0 move** (every field identical, base against tip; base against base 0).
  The census's 720: 23 records move (arrivalScene 22, pressureSentence 1). The 150: 5 records move (arrivalScene).
  Births born outside the arrival substream are byte-identical.
- Books for the close: none re-taken by me. The golden masters do not move. The scene guard's REACHABLE arm and my B7 pins
  are the only figures I wrote (my own guard's).

## WHAT IS LEFT, BY NAME

1. **The brought-in twin** ("Bolts of cloth brought in from elsewhere …"): 4 of the 150, 12 of the 720. True; runC
   convicts it by its words (above). The brief leaves it.
2. **The anvil twin in r2s-occupied-village-1**: true ("for want of iron", the one Blacksmith "Short of iron."); runC
   convicts it by its words. The same class as 1.
3. **The tanners' hides twin is REWORDED, not declared.** A twin is resolved once and takes no twin of its own
   (`drawDeclared.js`). Declaring the leather on "Bales of hides … stacked high in the tanning yard" would leave the pool
   two lines deep where the tanners are short and no hides go out (B7). "No carts of hides go out on the road these days."
   is true wherever the carts line is refused.
4. **The tanners' `lines` pool** (four bare lines, among them "Downwind of the tanning pits …" and "Hides hang drying on
   frames …") was not on my list (the brief named the dominant three). It still shows the pits at work where every tanner
   is short; runC found none in either population.
5. **The smiths' `lines` originals** ("hammer on anvil", "A smith quenches a blade …") still print where the only live iron
   house is a foundry or a metalworker that is not short. The sense opens by the house words (`chooseSense`); this is not
   my rule's case.
6. **The arms twin** "… and the army takes all of it." (SEAM-LIST SCENES) is no `trade at work` twin, and neither arm
   proves it. It was not on my list.
7. **B7's sample guard** compares with figures measured at afa46d644. Three pools of the 720 that the tip newly reaches
   under three lie outside the sample, and none is my lines' doing: the arms' dominant pool in r2r-village-18 and
   r2s-insurgency-village-2, and the kilns' dominant pool in r2s-religious_conversion-metropolis-0 (BAR5-THINGS's
   unanswered kinds).
8. **For the close: the cloth carts (6b-w, apart; 4 of the 720)**, as BAR6-SCENES left them (`exported: cloth` admits a
   wool export).

# BRIEF-LEFT · the round of what earlier seats left by name, cut by file into four seats (and a fifth for the anchors)

The sixth chair, 2026-11-17. Six reads of fresh town pages have been run against the program's bar (thirty fresh towns
with no HIGH and no MED false sentence); the sixth found no HIGH and 29 MED. The round BAR7 cured its families by rule,
the owner's supply rule was rebuilt (BIRTH-1 to BIRTH-3) and the owner's very rare secrets were added. Every seat of
those rounds LEFT THINGS BY NAME. They are gathered in ONE WORKLIST, `docs/chair/2026-11-17/sixth/LEFTOVERS-WORKLIST.md`
on the chair's lane (rows L1 to L37; read THE CHAIR'S NOTES at its head). This round cures them, each at its one fact.

## What you read first, and no more (your context is your budget)

1. THIS FILE: "The rules" and YOUR ONE SECTION.
2. RULES R1 TO R12 at the top of `docs/chair/2026-11-14/briefs/BRIEF-BAR7.md` on the chair's lane
   (`git fetch origin lane/chair-2026-11-08`; print lines 22 to 67 with `sed -n`). THEY BIND YOU, with the changes below.
3. THE WORKLIST'S ROWS YOUR SECTION NAMES (print each with `grep -n "^| L<n> "`; not the whole file), and for each row
   ONLY the part of the hand-back the row names (the hand-backs are at your checkout).
4. `docs/chair/2026-11-17/bar7/RULINGS.md` on the chair's lane: only the rulings your section names.
5. `docs/chair/2026-11-16/probes/PAGE-COPY/README.md` on the chair's lane (the page as printed: one command renders any
   list of seeds at a tree).

## The rules (R1 to R12 of BRIEF-BAR7.md, with these changes)

- **YOUR BASE (R1)** is `lane/point33-candidate-2026-11-17` at e0242a12a82285a736f9997360ec1e8a5fbd3568: the working
  line's ed1d43529 with the supply rule (BIRTH-3, 8b0506eae) merged; `git rev-parse HEAD^{tree}` reads
  4a9735d2f9ed4ef8e21aa19ec145de2e719e11f0. It becomes the line's tip when the chair's checks clear. You cut your ONE
  branch from it (`lane/left-<your seat, lower case>-2026-11-17`) and merge nothing, ever.
- **MEASURE FIRST AND LAST (R4)**: the populations are the sixth read's thirty (`bar0-<shape>-rand-42..44`), the 150
  (`docs/chair/2026-11-17/birth/birth3/seeds.w150.txt` at your checkout) and the census's 720 (PAGE-COPY's `seeds.txt`).
  The runners: `docs/chair/2026-11-16/bar5/AUDIT/run-a.mjs`, `runB.mjs`; `docs/chair/2026-11-16/bar6/AUDIT/runC.mjs` to
  `runF.mjs`; `docs/chair/2026-11-17/bar7/AUDIT/runH.mjs`, `runI.mjs` (each: `node <runner> <render-dir> <out.json>`
  from the tree's root). Start the 720's render in the background at once (about an hour at four workers).
- **THE HAND-BACK (R12)** is `docs/chair/2026-11-17/left/LEFT-<SEAT>-HANDBACK.md` on your branch. THE CHAIR is
  session_01FbPLbcLDSJzZFzb5B7EjxR (send_message). Budget: hand back at 450,000 of your count.
- **N1 · HOOKS.** A fresh worktree has NO git hooks until you run `npx husky` in it once (after `npm ci`, or after a
  `cp -al` of `node_modules`): `ls .husky/_` must list `pre-push`. Without it your pushes run no gate.
- **N2 · THE WALKERS ARE IN YOUR NET (R11 grows).** ALL of `tests/lint`, at your base and at your tip, compared BY NAME:
  `npx vitest run tests/lint --reporter=json --outputFile=<file>` and
  `node <chair's lane>/docs/chair/2026-11-17/tools/failnames.mjs <file>` print the failing tests by name; `comm` the
  two lists. A test red at your tip and not at your base is yours. A file you create has a baseline of no `any`.
- **N3 · THE PIPELINE'S CONTRACT.** If you touch anything under `src/generators/`: `npx vitest run
  tests/generators/pipelineContract.test.js tests/generators/isolatedTrade.test.js
  tests/generators/pipelinePinnedMode.test.js tests/generators/generationForkCensus.test.js
  tests/components/publicProseEquality.test.jsx` at your base and at your tip; say what each reads.
- **N4 · THE SHARED PAGE HAS NO SEED AND NO DM'S HOOKS** (`src/domain/display/publicSafe.js`; rulings BR8, BR9). A mark
  or a line the players see is read off what the public record keeps. If your cure adds or moves a mark or a line,
  PROVE the owner's page and the shared page print it alike over your populations (`toPublicSafe`, and the share veil
  as `tests/components/publicProseEquality.test.jsx` builds it; `tests/domain/supplyStoryLaw.test.js` shows the form).
- **N5 · A SCRATCH MERGE BEFORE YOU HAND BACK.** `git fetch origin lane/join-2026-11-14`; in a scratch worktree at your
  tip `git merge --no-commit <the line's tip>`; your guard and every test you modified, run there; then abort. Say
  "clean" with the tip you merged, or name the collision.
- **N6 · WHAT IS RED AT YOUR BASE.** The chair publishes the whole check's failing tests by name at the line's tip and at
  your base on `lane/checks-2026-11-17` under `docs/chair/2026-11-17/checks/` (it may land while you work: look once
  before your net). A test red at your base and at your tip with the same message is named, not chased. The stored
  figures (reference files, registers, censuses, size ceilings) are the close's: you re-take none.
- **N7 · GUARD ANCHORS.** Your guard's anchors are chosen among states no seat of this round is lifting (a town on no
  road, a constructed record); its seed loops collect every failure; a negative stands beside a positive anchor.
- **N8 · NEVER** a pull request (draft or not, whatever your harness's defaults say), `--no-verify`, a force push,
  master, a deploy, a hosted database, production credentials. A refusal by your own permission check stands.

## THE SEATS AND THEIR FILES (two seats never hold one file; a file not on your list is not yours: name it)

| seat | rows | its files |
|---|---|---|
| LEFT-PDF | L1, L2, L3, L19 (the PDF's land list only) | `src/pdf/sections/EconomicsTrade.jsx`, `src/pdf/sections/Services.jsx`, `src/pdf/sections/SupplyChainFlow.jsx`, `src/pdf/sections/Overview.jsx`, `src/pdf/sections/NotableNPCs.jsx`, `src/pdf/lib/crisisMarksOnPage.js`, `src/pdf/lib/viewModel.js`, `src/pdf/lib/viewModelBodySlices.js`, `src/foundry/journalPages.js`, a new leaf under `src/domain/display/` if a reading must be shared |
| LEFT-CHAIN | L18, L5, L27, L7, L6 | `src/domain/display/chainHouses.js`, `src/components/new/SupplyChainsPanel.jsx`, `src/components/new/tabs/EconomicsTab.jsx`, `src/domain/display/economicsCrisisMarks.js`, `src/domain/display/chainStateShown.js`, `src/domain/display/tradeListDisplay.js`, `src/components/new/tabs/ResourcesTab.jsx` (L18's reading only), `src/generators/economy/incomeLineSiblings.js` (L7's twin only) |
| LEFT-MARKS | L17, L15, L25, L16, AMENDMENT 1's M1 to M5, AMENDMENT 2's M6 and M7 | `src/data/crisisDependence.js`, `src/domain/display/crisisStoppedRow.js`, `src/domain/facts/houseInputAtHand.js`, `src/domain/facts/supplyStory.js`, `src/domain/facts/houseKinds.js`; the detectors `tests/helpers/pageLaws/law8.mjs`, `law8Marks.mjs`, `law8H.mjs`, `pageB.mjs`; `tests/domain/bar6MarksLaw8.test.js`, `tests/domain/bar6PeopleLaw10.test.js`, `tests/domain/supplyStoryLaw.test.js`, `tests/domain/birthKindsLaw.test.js`; one hunk each of `src/components/new/tabs/InstitutionsTab.jsx` and `ServicesTab.jsx` only if M3 needs it |
| LEFT-LINES | L31, L4, L33 (the brewers' line), L32, L8, L9 | `src/data/historyData.js`, `src/generators/historyGenerator.js`, `src/data/narrativeData.js`, `src/data/people/titleSecretsPresentations.js`, `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` and the generated desk files `src/data/dossierStateProse/general.generated.js`, `defense.generated.js`, `economy.generated.js`, `power.generated.js` (ruling AX1) |
| LEFT-KEYS (seated after the chair's whole check) | L11, L12, L13, L14 and the anchors the whole check names | tests only: its section is written when it is seated |

A ROW ALREADY CURED AT YOUR BASE (the worklist was compiled from hand-backs, and a later seat may have done what an
earlier one left: L29 was) is said so in one line, with the commit that cured it, and dropped: MEASURE EACH ROW BEFORE
YOU CURE IT.

NOT IN THIS ROUND, BY THE CHAIR'S CHOICE: L10 and L34's precedent row (each needs a new DRAWN line: the pools' work,
after the fixes); L20 (a house short in a town on no road, its material never there: true as printed; on the owner's
veto list); L21, L23, L26, L28, L35 (measured small or a tidy-up; named again after the seventh read if it flags them);
L30 (a new PDF section: the owner's); L36, L37 (the close's).

---

## LEFT-PDF · the printed export and the Foundry journal read what the tabs read

THE ONE FACT: every mark and list the tabs print is read through ONE leaf; the PDF and the journal call the same leaf.
A reader who prints a town must meet no row the tab marks printed bare, and no list the tab withholds.

1. **L1 · the income share's mark.** The tab marks a share by the crisis AND by its houses short
   (`src/domain/display/economicsCrisisMarks.js :: incomeMarkShown`); the PDF's Economics page
   (`EconomicsTrade.jsx` through `crisisMarksOnPage.js :: markedOnPage`) and the journal's economics page
   (`journalPages.js`, its `rowStoppedBy(…, 'income', …)`) print the crisis half alone. Both read `incomeMarkShown`
   (you import it; `economicsCrisisMarks.js` is LEFT-CHAIN's file: you do not edit it).
2. **L2 · the chain card's outputs.** The PDF's chain cards (`Services.jsx`, `SupplyChainFlow.jsx`) list outputs by
   `chainOutputsShown`; the tab's card reads `economicsCrisisMarks.js :: chainOutputsOnCard`. The PDF reads the tab's.
3. **L3 · the house's mark on the journal's person page.** Ruling CM1: the mark is one line of its own under the card's
   house line; the tab and the PDF print it (`viewModel.js`'s row field `houseMark`; `NotableNPCs.jsx`); the journal's
   person page (`journalPages.js :: notableNpcPage`) does not. One line there, reading the same row.
4. **L19 · the PDF's land list.** The Resources tab reads the proven and the depleted grounds off the stored record
   (`houseInputAtHand.js :: impliedGroundsOnPage`: you import it); the PDF's land list prints only the stored lists
   (172 towns of the 720 and 31 of the 150 hold a proven ground). The PDF reads what the tab reads. The other readers
   the row names are NOT yours: say for each, by one grep, whether it prints a line.

YOUR GUARD (a new file, `tests/pdf/leftPdfReadsTheTabs.test.jsx`): over fixed seeds of the 720 and the 150, for every
town: the set of income shares the tab marks equals the set the PDF and the journal mark, mark for mark; no output on a
PDF chain card that the tab's card withholds; every person card's house mark on the tab is on the journal's page; the
land list's grounds equal; AND THE OUTLOOK'S LIST OF IMPAIRED HOUSES EQUAL ON THE TAB AND IN THE PDF (L29 was cured by
BAR7-CARDS, `src/domain/display/impairedListShown.js`: your arm HOLDS it; it passes at your base: say so). It FAILS at your base on each arm (say the count) and passes at
your tip. YOUR CONTROLS: three towns an arm, named in your hand-back, each printed before and after.
MEASURE (R4): the runners over the thirty and the 150 at your base and tip (the PDF and the journal are in the dumps:
`== PDF/<section> ==` and the journal): no rule's count rises; say what falls. THE PDF's reference files
(`tests/pdf/goldenViewModel.test.js` and its fixtures) are STORED FIGURES: say how many rows your cure moves; re-take
nothing. N4 applies to every mark you add.

---

## LEFT-CHAIN · the chain card says who works the chain now (ruling BR10 (3)), and its lists follow the marks

1. **L18 · BR10 (3), FIRST.** In 17 towns of the 720 (the worklist's head names them) a mine stands on SPENT iron and
   works a LIVE seam of its own kind; the supply rule reads it at work (`src/domain/facts/supplyStory.js ::
   sourceStoryOf`, story `local`: you import it, you do not edit it). The Economics tab's card of the spent chain
   still lists the mine under "Via" (`src/domain/display/chainHouses.js :: chainHousesOf`, through
   `SupplyChainsPanel.jsx :: chainFlowFacts`), beside "From … (depleted)". RULED: A CHAIN CARD DOES NOT LIST, AS WORKING
   A SPENT GROUND, A SOURCE HOUSE THAT THE SUPPLY RULE READS AT WORK ON ANOTHER GROUND. Cure it AT PRINT, in the one
   shared leaf, so that the tab, the PDF's two chain sections and the Resources tab follow with no edit of the PDF
   (the PDF's files are LEFT-PDF's). The stored `processingInstitutions` do not move. Where a card would then list NO
   house, say what the card prints and how many towns (do not invent a line: name it for the chair). COUNT over the
   720, the 150 and the thirty: cards changed, towns; and every OTHER kind of source house the reading drops (a quarry,
   a landing), named.
2. **L5.** `tradeListDisplay.js :: chainOutputsShown` reads the fact's wider short set (193 houses of the 720 that the
   page prints bare are in it): it reads `everyMakerShortHere`, as the file's two other readers do.
3. **L27.** The Exports and "Produced locally" pills that name a good whose every maker is marked short: 93 pills in 58
   towns at the seam's tip, partly cured since. RE-COUNT at your base; cure the residue by the same reading; say the
   count before and after.
4. **L7 · the iron share beside an idle forge.** In five hamlets of the 720 and one of the 150 (the row names them) an
   open-cast mine works and the only smith is "Short of iron."; the income share prints bare: "Iron & Metalwork · Metal
   is smelted or worked here." RULED: THAT LINE SPEAKS OF SMELTING AND WORKING: where no smelting or working house of
   the trade is at work and a mine is, the share takes a TWIN in the page's plain voice that says what is true there
   (the ore is dug; the forge stands idle), declared by the atom it needs, read at print where the share's line is read
   (`economicsCrisisMarks.js :: incomeDescShown`; the twin's home is `incomeLineSiblings.js`); no mark is invented and
   the mine is not marked; the dependence table (`src/data/crisisDependence.js`, LEFT-MARKS's file) is not edited:
   tell a mine from a working house by the houses' kinds (`src/domain/facts/houseKinds.js`, read only). The twin's
   words are yours to propose (R7; on the owner's veto list, with three towns it prints in).
5. **L6, LAST, AND ONLY IF A READING AT PRINT CURES IT.** Four towns of the 720 (the row names them) print a plain
   metal-share line beside an iron chain card stored Impaired. THE HOUSES ARE THE TRUTH (a twin that answers a chain's
   stored status and not its houses is false where the houses are fed). Measure the four pages; if one reading in your
   files makes card and share agree, build it; else leave it by name with the pages.

YOUR GUARD (a new file, `tests/components/leftChainCards.test.jsx`): (a) over the 720: no chain card whose From is a
spent ground lists a source house whose story is `local`; FAILS at your base with the 17; a positive anchor (a mine on
its only, spent ground IS listed and marked: name the town); (b) L5 and L27: no output and no pill names a good whose
every maker is marked short, over the 720 and the 150; (c) L7: in the six towns the share prints its twin, and in a town whose smith works it prints the line as before;
(d) the owner's page and the shared page print each card alike (N4). MEASURE (R4): runH and runD above all (`8b.extract`, `8f.*`, `8k.*`): before and after, rule by rule.
NOTE: LEFT-MARKS re-keys LAW 8's `8b.extract` to the same reading in the detectors (its files); your guard is your own.

---

## LEFT-MARKS · the mark's one leaf and the detectors that read it

RULINGS TO READ: BR10 (the sixth handoff `docs/chair/2026-11-17/sixth/CHAIR-HANDOFF-SIXTH.md`, section 6), CM1, BR4.

1. **L17 · BR10 (2), FIRST.** LAW 8's `8b.extract` takes the supply rule's reading, in BOTH its forms: the born-record
   guard (`tests/helpers/pageLaws/law8Marks.mjs`) and the page form (`tests/helpers/pageLaws/law8.mjs`): a mine or a
   quarry is an instance where EVERY GROUND OF ITS OWN KIND THE RECORD HOLDS IS SPENT and it prints bare. Write the
   guard's reading from the tables (`houseKinds.js :: SOURCE_GROUNDS`, the record's land lists and its proven grounds),
   NOT by calling the leaf under test. `tests/domain/bar6MarksLaw8.test.js` (a) then reads zero for the 17 mines; its
   positive control for `8b.extract` (r2r-city-18) still fires blind; a NEW negative: a mine on its only ground, spent,
   printed bare by a planted record, IS an instance. THIS IS A RULING'S RE-KEY OF A LAW, NOT A NARROWING: say in the
   file's header what changed, the date and "ruling BR10".
2. **L15 · the old detector's `8b.person` learns the card's mark line (ruling CM1).** `law8.mjs`'s `8b.person` flags a
   keeper whose card now carries the house's mark as a line of its own. A card that prints the house's mark covers its
   person lines. Teach the rule (and `law8H.mjs :: readPersons`' `title` field); say the 720's count before and after
   (the fifth chair read 15 rows of the 150, all held by the card's mark line: after your teaching, 0).
3. **L25 · SEAM-ECON's houses.** `houseInputAtHand.js :: importsBring` does not read "Herbs and forage" as herbs, nor
   game meat as the butchers' stock: the two mends, then the rows struck from `LEFT` in `bar6MarksLaw8.test.js` (its
   own ratchet tells you which), measured to mark those houses and no other over the 720.
4. **L16 · the house that works only a surplus.** The maltster ("Requires grain surplus.") prints at work where the
   page's food line is short (rule `8i.surplus`: 1 town of the thirty, 1 of the 150, 4 of the 720). THE AUDITOR'S CURE:
   a house that works only a SURPLUS is short where the page's food line is short ("Short of grain."), in a crisis or
   not. Build it in the mark's leaf through the supply rule's own gate (`crisisStoppedRow.js :: rowShortOf`), reading
   public fields only (N4).
5. **WHAT THE SECOND READER FOUND IN BIRTH-3's AMENDMENTS**: AMENDMENT 1 at the foot of this section (M1 to M5).

YOUR GUARD (a new file, `tests/domain/leftMarks.test.js`) holds items 3 and 4 over fixed seeds (each FAILS at your
base); items 1 and 2 are held by the two existing guards as re-keyed. MEASURE (R4): runD, runH, runI: before and
after, rule by rule; `8b.extract`, `8b.person`, `8a.input`, `8i.surplus` above all. If you touch
`src/generators/`: N3. N4 for every mark.

### LEFT-MARKS · AMENDMENT 1 (written 16:22 UTC on 2026-11-17, BEFORE the seat was seated: it is part of your section)

THE SECOND READER ON BIRTH-3's LAST TEN COMMITS (882cae319..8b0506eae; session_01FbPLbfk2W1eNFUKH8Wg5g3; every row RUN by
it at the merged tree): HIGH 0 · MED 1 · LOW 4; every amendment built as asked; no test narrowed; the hook's predicate
equals the stored hook in every town (102 and 29 hooks); `rowShortOf`'s new path costs under two milliseconds a
metropolis. ITS FIVE ROWS ARE YOURS, AFTER YOUR ITEM 1, AS ONE COMMIT EACH. The supply rule's guard
`tests/domain/supplyStoryLaw.test.js` and `tests/domain/birthKindsLaw.test.js` are yours for them.

- **M1 (MED) · RULING A HAS NO GUARD.** `supplyStory.js :: sourceStoryOf`'s `|| own.some((g) => live.has(g))` reverted:
  the 17 mines read "Short of iron ore." again and NO test goes red (the supply guard 9 of 9). Add an arm to the supply
  rule's guard: over the census's 720, a source house whose only chain works a spent ground of its kind, beside a LIVE
  ground of its own kind on the record, reads `local` and prints no mark (anchored: more than ten such houses; the 17
  mines by name in a note); and its negative: a mine whose every own ground is spent reads worked out and is marked.
  PROVE IT BY THE MUTATION (the hunk reverted in scratch: your arm red; restored: green).
- **M2 (LOW) · `resourceGenerator.js :: importsBroughtAtBirth`'s `bring`** (a word is brought only if it adds a
  canonical good, `subsumeTradeGoods`): its removal turns nothing red (the reader's own table answers the corpus). A
  CONSTRUCTED record in the guard: "Livestock" on the imports, a tanner whose story is bought in: the birth brings NO
  hides word; proven by the mutation. (`src/generators/resourceGenerator.js` is yours for NO edit: the test only.)
- **M3 (LOW) · THE HEAD LINE OVER A VENTURE.** "A row marked short is what its house makes when supplied." prints where
  the only mark on the tab is a failed venture's, so no row is marked short (10 towns of the 720, 3 of the 150:
  r2r-hamlet-48, r2r-town-13 rendered). Cure it IN THE LEAF if the leaf decides it (`crisisStoppedRow.js ::
  ordinaryTimesLine`: a venture's mark is not a short mark for that line); if the count is taken at the call sites,
  `src/components/new/tabs/InstitutionsTab.jsx` and `src/components/new/tabs/ServicesTab.jsx` are yours FOR THAT ONE
  HUNK EACH; the PDF's site (`src/pdf/lib/crisisMarksOnPage.js :: ordinaryTimesOnPage`) is LEFT-PDF's file: name it
  to the chair in one line if it needs the same hunk. Your guard: the line absent in the ten, present in a town with a
  short mark.
- **M4 (LOW) · `houseInputAtHand.js :: warIronHookOutsideWar`'s copy of the war's state** does not read the world
  pulse's words: `occupation` and `siege` read as peace there and as "at war" and "front" in
  `facts/warState.js :: warStateOf` (0 towns at a birth; a town moved on by the pulse would differ). Map the two
  words, and ADD THE TEST THE COMMENT PROMISES (the copy equals `warStateOf` over the 720, the 150 and constructed
  records carrying each pulse word). Ruling EG1 stands: the eager fact imports nothing pinned lazy.
- **M5 (LOW) · THE COMMENT SAYS RULING A BACKWARDS** (`supplyStory.js`, above `sourceStoryOf`'s chains: "a spent coal
  seam, beside a live iron ground"): it is a spent IRON chain beside a live seam of the mine's own kind (coal,
  gemstones, precious metals). Reword it to what the 720 show.

### LEFT-MARKS · AMENDMENT 2 (written 16:41 UTC on 2026-11-17, AFTER the seat was seated; sent to it by message: two more items, after M5)

FROM THE MEASURE OF THE EIGHT DETECTORS AT THE LINE AND AT YOUR BASE (MEASURE-1, `lane/measure-2026-11-17`,
`docs/chair/2026-11-17/measure/TABLE.md`: the 30 and the 150). One rule rose that is not by design: `runD`'s `8a.input`,
0 at the line, 1 town of the thirty and 4 of the 150 at your base. The chair read each town at the base:

- **M6 · THE OLD DETECTOR DOES NOT KNOW THE FAILED VENTURE'S MARK.** Three of the five houses are the town's failed
  venture and print as designed (the dairy farmer of bar0-village-calm-rand-43 "Failing: a failed venture."; the potter
  of bar0-town-calm-rand-32 and the sawmill of bar0-village-calm-rand-40 "Abandoned: a failed venture.", each with its
  gap line and its venture line): `tests/helpers/pageLaws/law8.mjs` reads the venture's mark as no mark. Teach it (and
  `law8Marks.mjs` where it shares the reading): a venture's mark is a mark. After it those three are gone from `8a.input`.
- **M7 · RULING BR11: A HOUSE ON A GROUND ITS TOWN WORKS ITSELF READS UNDER A SIEGE AS THE TOWN'S OWN LAND READS.** In
  bar0-city-under_siege+famine-rand-28 and -35 (2 besieged cities of the 150) the Services tab's dependency card prints
  "Building construction Impaired / Carpenters / Needs Timber. Supply route severed. Operating at minimal capacity or
  shut down." while the Carpenters, the Cooper and the Sawmill print with NO mark: the sawmill PROVES a managed
  woodland (`houseInputAtHand.js :: impliedGroundsOnPage(s).there`), the supply rule reads its timber as the town's
  own, and nothing then marks the houses under the siege. At the line (before the supply rule) those houses were marked
  short, which agreed with the card. The stored economy was born before the proven ground is read and still holds the
  timber as an import the siege has cut. RULED: under a siege, a house whose material the supply rule reads as the
  town's own BY A PROVEN GROUND carries the siege's partial mark, "Curtailed by the siege.", exactly as a house on a
  LISTED ground of the town does (SV8 in `crisisStoppedRow.js`'s header: the land the town still works is curtailed,
  not stopped), and so do the houses that work that material from it (the carpenters, the cooper). No stored row
  moves; the dependency card is not edited (it then agrees: both say the siege limits the trade). MEASURE FIRST over
  the 720, the 150 and the thirty: towns under a siege where a dependency card of severity critical names a good and a
  house that uses that good prints bare; say the count before and after, and every OTHER crisis in which a proven
  ground leaves a house bare beside a card that says its supply is cut (name them; cure only the siege unless the same
  reading cures them). Your guard: over the besieged towns of the 720 and the 150, no house of a material prints bare
  beside a critical dependency card of that material; a positive anchor (the two cities); N4 (the shared page alike).

---

## LEFT-LINES · single lines that say what the town is not (declarations and twins; R6, R7)

IN THIS ORDER; hand back what is done and name the rest.

1. **L31 · "a rival lord" where none stands, and "the reformers".** `src/data/historyData.js :: HISTORY_DESC_SIBLINGS`
   (the Iron Dispute's rows 137 and 138: "between the settlement and a rival lord") and
   `src/generators/historyGenerator.js :: generateRelationshipEvent`; "the reformers" under the party-name rule (7 towns
   of the 720, 2 of the 150, 1 of the thirty). The cure the seam's culture seat proposed: a `sovereign` declaration on
   both lines and twins that name none ("a rival claimant"); the reformers by the same rule BAR7-ORDER used for the
   families' lines. A DECLARED MOVE of `history.historicalEvents[].description`: say how many of the 525 reference
   configurations move. `tests/generators/w2FixDataHistoryItems.test.js` is re-keyed by identity if your cure turns it.
2. **L4 · two forge lines beside a smith short of iron.** `src/data/narrativeData.js` (the row names the lines and the
   two towns): each takes `needs: ['trade at work: ironwork']` and a twin (R7).
3. **L33, ONE LINE OF IT · the brewers' secret.** Four brewer villages of the 720 print "hears everything the taverns
   say" with no tavern (`src/data/people/titleSecretsPresentations.js`). Declare it by a `house: tavern` reading of the
   EXISTING vocabulary if one answers it; if it needs a NEW atom, do not mint it: name it for the chair with its count.
   THE REST OF L33 (moving the secret's declaration to `force: paid`, deleting `paid watch`, the safety word's atom) IS
   NOT THIS ROUND'S.
4. **L32 · two desk lines.** DS-GEN-17 ADMINISTERED v4 ("keeps a gaol of its own, though no court sits here": a fresh
   row of the presumed-things door) and DS-GEN-13 ENTREPOT v2 ("the town" under no size band). The annex
   `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` is the source; the generated files follow by the generator (ruling AX1
   in `docs/chair/2026-11-16/bar6/RULINGS-AFTER-SEATING.md`: the wiring census is re-taken in scratch only; you commit
   the annex and the generated desk files).
5. **L8 · the general desk's soft food lines** (DS-GEN-3 v3 and v4; DS-DEF-2 "granary AND parish" v1; DS-ECO-2 GRANARY
   well stocked v5): each declared by the food atom it presumes, or given a twin where it then leaves a pool under
   three lines (R7). MEASURE `9g.food-soft` with runI before and after.
6. **L9 · four static desk lines that admit a collapsed law** (the worklist names them; counted 0 in the 720 today):
   each takes the law band's declaration, as BAR7-ORDER did for the siege's clause.

YOUR GUARD (a new file, `tests/domain/leftLines.test.js`): each cured line, over fixed seeds, absent where its premise
is false and its twin printed there (each arm FAILS at your base). THE TWO DOORS (R9): no fresh row; if item 4 removes
a fresh row, say the door's last line before and after. MEASURE (R4): runC and runI over the thirty and the 150 (and
the 720 for items 1 to 3). N3 for item 1 (a generator's file). Every new or reworded line is listed in your hand-back
with three towns it prints in, for the owner's veto list.

## LEFT-KEYS · the tests the supply rule left on stale anchors, and two detectors that read the old record (written 2026-11-17, 17:57 UTC; SEATED WHEN THE FOUR BUILDERS HAVE LANDED: its base is the working line's tip then, named in its prompt, not the candidate)

YOU TOUCH NO FILE UNDER `src/`. Your files are tests and the chair's detectors (docs tools) only:
`tests/generators/tailDefeconBatch3Lines.test.js`, `tests/generators/foundryExportsFishTrade.test.js`,
`tests/domain/bar3Defecon2Lines.test.js`, `tests/data/w2FixData5Rows.test.js`, `tests/data/tailHouses1Gaps.test.js`,
`tests/components/displayEconCrisisMarks.test.jsx`, `tests/components/displayEconRelianceFoodWords.test.jsx`,
`tests/domain/display/needMetUnderAnotherName.test.js`, THE TESTS YOUR PROMPT NAMES (the whole check's comparison:
anchors the supply rule fed), `docs/chair/2026-11-16/bar5/AUDIT/run-a.mjs`, `docs/chair/2026-11-16/bar6/AUDIT/runC.mjs`.
A test whose red needs a change in `src/` is NOT yours: name it, with the file and the line, and leave it red.

WHY THE ORDER: the four builders move marks (the siege, the failed venture, the mines); an anchor keyed before they
land can go stale again. You key every anchor ONCE, at the tree that holds them all.

THE RULE FOR EVERY ITEM (R8, and N7): a test the supply rule made untrue is RE-KEYED BY IDENTITY: THE SAME CLAIM, ANOTHER
ANCHOR, A DATED NOTE that names the old anchor and why it left. Search for the anchor in this order: the census's 720
(PAGE-COPY's `seeds.txt`), the 150, then a CONSTRUCTED record only where no born town bears the claim (and say so). A
re-keyed assertion must be able to FAIL: show it red once in scratch (revert the src hunk it guards, or point it at the
old anchor), then restore. A NOT claim keeps a positive beside it. YOU RE-TAKE NO STORED FIGURE (reference files,
registers, censuses, counts, size ceilings: the close's, with the owner's yes): a red whose cure is a stored figure is
named and left.

1. **K1 = L11 · four anchors whose NOT claim needed a good missing that the birth now buys in.**
   `tailDefeconBatch3Lines` (2: the iron hooks; r2r-hamlet-30 and r2r-city-36 import "Iron ore"),
   `foundryExportsFishTrade` (soak1k-1652 imports "Salted fish"), `bar3Defecon2Lines` (the timber twin; r2r-town-34,
   r2r-metropolis-2, r2s-insurgency-city-3 import Timber), `w2FixData5Rows` (the cold forge; rww-city-famine-1 imports
   "Iron ore"). Each re-keys to A TOWN THAT CANNOT BUY IN (the supply rule's fourth story, "used up and not bought in",
   or a town on no road): `src/domain/facts/supplyStory.js` tells the story of a house and a material; read it, do not
   re-derive it.
2. **K2 = L12 · `tests/data/tailHouses1Gaps.test.js`**: the RED list (line 42 at the candidate) names houses that
   lacked their input; some towns have it now. Re-key each such pair by identity to a town where the house still lacks
   it; a pair no town bears (720, 150) is said so and retired with the note, the count kept honest in the file's head.
3. **K3 = L14 UNDER RULING BR12** (section 6 of the chair's handoff: it REPLACES the chair's earlier word on L14). The
   KEEP row of `displayEconCrisisMarks.test.jsx` at r2s-under_siege-city-0 ("Iron & Metalwork Metal is smelted or
   worked here." bare: "the siege stops no forge") and the row of `displayEconRelianceFoodWords.test.jsx` at
   r2s-under_siege-metropolis-3 ("Contributes to Iron & Metalwork - 2% of income") claim what NO besieged town can bear
   under BR11 (the town's own ground is curtailed too, and so are the houses that work its material). EACH IS RETIRED
   WITH A DATED NOTE NAMING BR11 AND BR12, AND IN THE SAME COMMIT THE TRUE CLAIM IS PINNED IN ITS PLACE: on the same
   anchor the row prints its mark (a NOT or TWIN row, if the table holds none for a besieged iron trade), and the KEEP
   table keeps at least one row of the same line in a state that cuts no supply and stops no forge, so that it still
   proves the true sibling prints. Count, over the 96 besieged towns of the census, how many print the row marked and
   how many bare; A BARE ONE IS A FAULT TO NAME (with the houses' marks beside it), not an anchor.
4. **K4 · `tests/domain/display/needMetUnderAnotherName.test.js`**: r2r-town-17's timber need is met at the candidate
   (green at ed1d43529, red at the candidate). Re-key by identity to a town whose need is still met under another name.
5. **K5 · the anchors your prompt names** (new reds of the whole check at the candidate that the chair read as stale
   anchors, not faults): each by the rule above.
6. **K6 · two detectors read the old record.** (a) `run-a.mjs`: its "register's reader" says a town lacks a ground the
   supply rule PROVED at the birth (the Resources tab prints proven grounds, and the "worked out" lines name them): the
   720's rise of `4r-thing:resource:*` rows (managed_forest 54/170 -> 128/256 and ten more; MEASURE-1's TABLE.md, last
   section, `lane/measure-2026-11-17`) is this. The reader takes the stored record's grounds (listed AND proven, the
   depleted told as depleted). (b) `runC.mjs` `6b-denied`: it denies a forge scene ("The hammering of the forges
   echoes through all of ...") on the MINE's gap line; in r2r-metropolis-45, -53, -59, -6 the Blacksmiths and the
   Smelter are at work on bought-in iron (the chair probed all four). A scene of forges is denied only where EVERY
   forge house on the page carries a mark. For each: the rule's count over the 720 before and after, five instances
   that left read by you on the page (each must be TRUE as printed), and every instance that stays.

NOT YOURS, NAMED FOR THE NEXT ROUND: L13 (`tests/joins/labelJoins.test.js`: one label join more than frozen, in
`src/generators/resourceGenerator.js`; the cure is in src).

YOUR NET: every file you changed, each alone, at your base and at your tip; ALL of `tests/lint` by name (N2); both
type gates; `npx eslint` on your changed files. THE HAND-BACK: `docs/chair/2026-11-17/left/LEFT-KEYS-HANDBACK.md`: one
row an assertion (the claim, the old anchor, the new anchor, the scratch proof that it can fail), the retired rows with
their rulings, the faults you named and left.

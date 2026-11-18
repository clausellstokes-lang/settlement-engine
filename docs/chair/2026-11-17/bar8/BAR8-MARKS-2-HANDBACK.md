# BAR8 · MARKS-2 · hand-back

Base `lane/join-2026-11-14` at dfe557dc9. Branch `lane/bar8-marks-2-2026-11-17`, tip at the commit that adds this file,
its last code commit 9978ee392. Nothing merged, no pull request, no force. Items 1 to 6 and the comment at
`crisisStoppedRow.js :: housesShortOfInput` (item 7 dropped, item 8 empty, per the chair's prompt). One commit per item,
pushed as they went; later commits fix three of them (listed under each item).

Measured with each tree's own runners (runJ, runK, runD, runH) over full PAGE-COPY renders of the thirty
(`seeds.bar7.txt`), the 150 (`seeds.w150.txt`) and the 720 at the base and at 6b4c31fcc. The one later code commit,
9978ee392, changes no mark over the 720: the same mark table, measured with `rowMarkText` over every house, row, chain,
share and the Magic supply.

## 1 · The rules, before and after (towns / instances; the thirty · the 150 · the 720)

| rule | 30 | 150 | 720 | what stands after |
|---|---|---|---|---|
| 11e.siegeBought (J) | 3/4 → 2/2 | 7/14 → 7/7 | 8/18 → 7/7 | only the tailors' "Livery and uniforms" (WEAK by the brief: not marked). The ones that stood: **2 → 0 · 7 → 0 · 10 → 0** |
| 12a.house (K) | 1/1 → 0 | 4/4 → 0 | 3/3 → 0 | 0 |
| 11a.atWork (J) | 1/1 → 1/1 | 0 → 0 | 10/12 → 9/11 | the ones that stood at the base: 30: 1 (C34109's butchers), 720: 2 (r2r-city-43's butchers, r2s-religious_conversion-town-2's alchemist shop; r2r-metropolis-19's butchers stay bare by the brief). After: 30: 1, 720: 1 (the two butchers: left, section 6). The 9 timber lines (PLAUSIBLE or WEAK) are not built |
| 11d.warIron (J) | 1/7 → 1/1 | 3/21 → 3/3 | 2/19 → 2/2 | the hook only, "War has taken the iron …" (Summary/Plot Hooks), one in each occupied town: its writer is not my file (section 6). Counted BY TEXT, because runJ reads the 11d predicate from the tree it runs in (`warIronHookOutsideWar`), so at the tip it reads 0 everywhere and cannot see the hook. Each occupied town of the three populations: every "Short of iron." line (page, PDF, journal: 43 in the 720's two towns, 13 in the 30's) → 0 and the forges' scene → 0; the hook stays 3 times a town (tab, PDF, journal) |
| roots gapImportedNoImport (J) | 1 → 1 | 5 → 5 | 8 → 5 | the 3 fish rows are cured; the livestock 3 (720) and hides 2 (720) stay, and so do the 150's 5 and the 30's 1 (livestock and hides): one canonical good under either word (section 6) |
| roots warIronOutsideWar (J) | 1 → 0 | 9 → 6 | 5 → 3 | the sieges' own reading (the brief: left as they are) |
| 12f.magic (K) | 1/1 → 0 | 2/2 → 0 | 3/3 → 0 | 0 |
| every other rule of runJ, runK, runH | | | | the same or lower, rule by rule. Lower in the 720: 11a.imported 5 → 4, 11e.offer 22 → 20, 11e.wantBuy 6 → 5 (the fishmongers' fish now named on their imports) |
| runD 8a.input / 8a.mild / 8b.person | 0 → 1/4 · 1/2 → 1/2 | 0 → 1/2 · 0 → 1/4 · 0 → 1/1 | 0 → 1/8 · 1/3 → 2/6 | **A RISE, and the same cause in every case:** the iron houses of the occupied towns are bare now, and the hook "the smiths have nothing to mend tools with" still prints (section 6). With that hook's one-line hunk in a scratch tree: 0 in all six occupied towns |

YOUR GUARD `tests/domain/bar8Marks2.test.js`: 6 tests: (1, 2) the houses and their rows, (4) the predicate and the
occupied towns, (5) the fishmongers and the tannery, (6) the Magic supply. All six pass at the tip; five fail at the base,
and the one that passes there is (5)'s negative-only tannery arm. Every seed loop collects its failures
(`collectSeedFailures`). The negatives sit beside the positives: a besieged dyer with no wool import, the tailors, a calm
town's furrier, a supplier still at work. Each mark is read alike on the owner's record, the public projection and the
share veil (N4).

## 2 · The controls

- runJ over the thirty: "controls off: 3". The run exits 3, which is by design: C38200 (11d, the smiths' "Short of iron.") is
  clear, its card now bare. C38039 (11d, the forges' scene) is clear: the town's stored scene now reads the twin, a declared
  move (section 4). C2853 (11e, the mint) is clear: its card and its "Coin production" now print "Curtailed by the siege.".
  Every other STANDS control is FOUND, among them C34109 (11a.atWork, left by name in section 6). Every EXPLAINED control is
  clear, as at the base.
- runK over the thirty: C0476 (12a, the shipyard) is clear: its card and its rows now print "Curtailed by the siege.".
  C19407 (12f) is clear: the reliance prints with no supplier named. The run exits 3 by design. The other 28 STANDS
  controls are FOUND, as at the base.

## 3 · The lines a reader can see change (the page's existing mark words; no new prose)

- "Curtailed by the siege." on the dyer, the furrier's district, the river boatyard and the mint, and on each of their rows,
  in r2s-under_siege-city-2, r2s-under_siege-metropolis-1 and r2s-under_siege-town-0 (also r2s-under_siege-city-0, -city-1,
  -metropolis-0, -2, -3 and r2r-metropolis-14). The furrier of r2r-metropolis-14 has no hides on its imports. It is marked
  because it is the one house of its furs chain, and that chain is the trade, "Stopped by the siege.". The shipyard of
  bar0-city-under_siege+famine-rand-45 (C0476) and -44 (C7539) is marked too. THE PDF AND THE JOURNAL print the same marks:
  "Coin production: Curtailed by the siege. …" in r2s-under_siege-city-2's PDF Institutions; "Furrier's district: Curtailed
  by the siege. …" in r2s-under_siege-metropolis-1's journal; the boatyard card in r2s-under_siege-town-0's PDF and journal.
- "Short of medicinal herbs." on the alchemist's shop of r2s-religious_conversion-town-2 (the tab, the Services row and the PDF).
- Gone: every "Short of iron." of the occupied towns r2s-occupied-city-1, r2s-occupied-town-3, bar0-town-occupied-rand-27,
  -31, -35 and -46 (the cards, the rows, the income share's mark, the person cards, the PDF and the journal), and the forges'
  scene of -46 and -27.
- The Magic tab's "· supplied by Access to a house of worship" is gone in r2s-under_siege-thorp-1, -thorp-2, -hamlet-2 and
  bar0-hamlet-under_siege-rand-47. The reliance line still prints.
- New on the imports: "Salted fish" (the word the birth already uses for fish) in the three fishmongers' towns.

## 4 · Declared moves (R5)

- `economicState.primaryImports`: 3 of the 720 (r2r-village-36, r2s-indebted-village-2,
  r2s-religious_conversion-village-0: "Salted fish"); 0 of the 150; 0 of the 30.
- `arrivalScene`, which follows the mark through the birth's `trade at work`: 1 of the 720 (r2s-religious_conversion-town-2:
  "Little spellwork is done … for want of the stuff it takes", the existing twin, beside the alchemist's new mark); 1 of the
  150 (bar0-town-occupied-rand-27) and 1 of the 30 (bar0-town-occupied-rand-46): the forges' quiet scene gives way to the
  pool's other line (BR16).
- THE 525 REFERENCE CONFIGURATIONS: 0 of 525 move (every top-level field hashed at the base and at 6b4c31fcc).
- No new field on the saved record; nothing in `assembleSettlement.js`, `vite.config.js` or `package.json`.
- Item 5's wider move, J's 11c.noImport (56 inland fish markets in the 720): the same hunk writes NO fish for them (they
  have no `imported` gap row). 56 → 56.

## 5 · The net (each gate alone, through `gate-tail.sh` or to a JSON report; base dfe557dc9, tip 6b4c31fcc / 9978ee392)

| gate | base | tip |
|---|---|---|
| typecheck:domain:strict | 0 | 0 (1113, ceiling 1113) |
| typecheck:ratchet | 0 | 0 (167, ceiling 167) |
| eslint, the changed sources and the guard | — | 0 (warnings only) |
| npm run build | 0 | 0 |
| tests/joins, tests/architecture, tests/components/bar7*, vendorPdfLazy (WEAVE ST-2 included) + bootSmoke, the bar5*/bar6* guards, N3's five | 6 red: generationForkCensus A1, A4, A6; pipelinePinnedMode A1, A2, A5 | the same 6 with the same messages, AND `bar6MarksLaw8 (a)`: "an instance not left by name": r2s-occupied-town-3's blacksmiths, r2s-occupied-city-1's specialized metalworkers and blacksmiths (the hook, section 6; green with its hunk in a scratch tree) |
| N2 tests/lint (all, by name and message) | 69 names | the same 69 names. Two messages differ: `ledgerCitationIntegrity` by the worktree's path only, and `sovereigntyLightingContract.walker` "the estate's file count moved" 3678 at the base → 3679 at the tip (the one file more is my guard; the stored figure is the close's). `observedShapeReaders` A1/A7 reads as at the base (9978ee392 removes the one read my furrier reading had added) |
| R9 doors | A: "hits 1787 · banked 1938 · fresh 0 · stale 151 · ceiling 1938"; B: "fresh 38 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 stale 0 banked 107" | the same two lines: no fresh line added |

N3 (I touched `resourceGenerator.js`): pipelineContract, isolatedTrade and publicProseEquality are green at both trees.
generationForkCensus and pipelinePinnedMode are red at both trees, with the same six tests and the same messages.
N5: a scratch worktree at my tip, `git merge --no-commit` with the line's tip 99ca9ad51 (points 43 and 44): no conflict. My
guard, bar7EconTab, leftMarks, birthKindsLaw and supplyStoryLaw are 41/41 green there. Merge aborted. CLEAN.

## 6 · Left by name

- **THE HOOK'S WRITER DOES NOT FOLLOW (item 4): `src/generators/economy/foodBalance.js:826`, not my file.** It asks
  `warIronState(facts.warState)`. The war's state alone reads "at war" for both an occupation and a war, so the war's hook
  still prints in an occupied town with no war. The mark and the scene do fall. THE ONE-LINE HUNK, MEASURED IN A SCRATCH TREE
  AT MY TIP: hand the town's crisis kinds,
  `hook: ((f) => warIronState(f?.warState, f?.crisis?.kinds))(typeof facts === 'function' ? facts() : facts)`. With it the
  six occupied towns of the three populations print no war hook (the pool's other iron hook prints instead), no "Short of
  iron." and no forges' scene. runD reads 0 there, and `bar6MarksLaw8`, my guard and `supplyStoryLaw` are 22/22 green. It
  moves the stored `economicViability.plotHooks` of those towns (a declared move, not measured over the 525). Item 4 is its
  own commit (2bc516ffe), so the chair can land it with the hunk, or hold both.
- **The butchers of r2r-city-43 (the 720) and bar0-town-calm-rand-46 (the thirty's C34109), 11a.atWork.** The one reader
  reads their beasts as brought in by "Raw hides and animal products": one canonical good (BIRTH-3, AMENDMENT 1 (2),
  `ONE_GOOD_BOUGHT`). The need list says "livestock for meat and draft" is not brought in. I built a reading at print (a
  butcher is fed by no hides word) and withdrew it in 6b4c31fcc. Both towns are calm towns on a road, where BIRTH-1's law
  (`birthKindsLaw` arm 1) holds every buyer unmarked, and the birth may not write a second word of one good. The chair's to
  rule: the law, the one-good rule, or the need list (`tradeListDisplay.js`, J-INCOME's).
- **The roots' livestock 3 and hides 2 (the 720; the 150's 5, the 30's 1).** A tannery "runs on imported livestock" beside
  "Raw hides and animal products", or "runs on imported animal hides" beside "Livestock and dairy". By the trade catalogue
  (`subsumeTradeGoods`) that is one good under either word: the imports name it, and the birth writes no second word. The
  detector's word list is narrower than the catalogue.
- **The timber 9 of 11a.atWork** (PLAUSIBLE or WEAK by the auditor: the need is a grade, "mountain timber"): not built.
- **The tailors' livery** (11e.siegeBought, 7 in the 720 and in the 150, 2 in the 30): not marked (the brief).
- **A KEEP OVERTURNED, for the veto list: `tests/components/bar7EconTab.test.jsx`'s C7539 (BAR7-ECON item 4, ruling CY1).** It
  held the shipyard's "Ship construction" row unmarked under a siege ("the shipyard builds from its own timber"). Item 2 (K's
  12a, C0476) curtails the yard, so the stopped harbour chain's "Normally yields" names the row again. I re-wrote the test to
  that claim, with a dated note. Three other anchors of that file were made untrue by BR16 (the occupied towns' smiths) and
  are re-keyed by identity, each with a dated note: item 1 → bar0-metropolis-occupied-isolated-8; item 5 →
  bar0-city-occupied-isolated-18; point (1)'s marked metal side → a constructed record, as the cloth side already was.
- The comment above `housesShortOfInput` is re-worded so that it is true before J-ROWS's story line lands and after.
- NEW TABLES AND READINGS, each vetoable (no new vocabulary atom, no new twin):
  - new rows in `INPUT_IMPORTED_AS` (the dyer, the furrier's district, the river boatyard, the mint and the official mint;
    a value of several words now matches any one of them);
  - `HOUSE_NEED_INPUT`'s alchemist's shop;
  - the shipyard's `FIELD_WORK` in `HOUSE_DEPENDENCE`;
  - `crisisStoppedRow.js :: boughtByNameOnly`, `ownTradeChainOf`;
  - `warIronHook.js :: ironWarState`, `OCCUPATION_TYPES`;
  - `resourceGenerator.js :: importWordsOfImportedGaps`.

## 9 · RULING BR31 and the chair's three questions (after the first hand-back; base dfe557dc9; line's tip 70e557d5b)

1. **The hook's writer follows BR16 (3ade10eb8).** `src/generators/economy/foodBalance.js:826` now hands `warIronState` the
   town's crisis kinds; no other line of that file changed.
   - THE SIX OCCUPIED TOWNS (r2s-occupied-city-1, r2s-occupied-town-3; bar0-town-occupied-rand-27, -31, -35;
     bar0-town-occupied-rand-46): no war hook, no "Short of iron." and no forges' scene, on every surface (tab, PDF,
     journal).
   - None of the pool's three peace lines prints in their place. Their own declaration
     (`outlookHookSiblings.js :: PEACE_IRON_HOOKS`, excludes `war: at war`) refuses a town whose war state reads "at war", so
     the slot drops (`dropRefused`): the town prints one plot hook fewer.
   - runD over the thirty, the 150 and the 720: every rule at the base's figure. That is 8a.input 0 · 0 · 0, 8a.mild
     1/2 · 0 · 1/3, 8b.person 0 · 0 · 0; the 720's 8a.mild 1/3 is r2r-metropolis-19's butchers, as at the base.
   - 11d by text: 7 · 21 · 19 → 0 · 0 · 0. `bar6MarksLaw8` is green.
   - Measured over composite renders: the tip's renders with the six moved towns re-rendered at 3ade10eb8. No other record
     moves (every stored field compared over the three populations).
   - DECLARED MOVE (R5): `economicViability.plotHooks` (the war hook gone, none in its place) moves in 1 town of the 30
     (bar0-town-occupied-rand-46), 3 of the 150 (-27, -31, -35) and 2 of the 720 (r2s-occupied-city-1, r2s-occupied-town-3).
     `economicViability.summary` moves with it in the same six towns, by its count only: "3 plot hooks available" → "2".
     THE 525: 0 move.
   - N3's five: pipelineContract, isolatedTrade and publicProseEquality are green. generationForkCensus (A1, A4, A6) and
     pipelinePinnedMode (A1, A2, A5) are red at the line's tip and at the merge, with the same messages.
2. **The net at a scratch merge of 3ade10eb8 with the line's tip 70e557d5b** (a clean merge, aborted after the run). Each
   list was run at the line's tip alone and at the merge, as one JSON report per tree, and every red was compared by name and
   by message. Vitest isolates each file in its own worker, but this is one batch per tree, not the one-file-at-a-time loop
   you asked for.
   - (a) ALL of `tests/lint`;
   - (b) the net: `tests/joins`, `tests/architecture`, `tests/components/bar7*`, `vendorPdfLazy` and `bootSmoke` after one
     build, N3's five, the bar5*/bar6* guards, my guard;
   - (c) THE OLDER TESTS: the 373 test files outside `tests/lint` and `tests/helpers` that name any of the chair's terms or
     my functions and tables ("Curtailed by", "Stopped by", "Short of", "supplied by", "War has taken the iron",
     `INPUT_IMPORTED_AS`, `HOUSE_NEED_INPUT`, `HOUSE_DEPENDENCE`, `HOUSE_TRADE_INPUT`, `houseDependenceIn`,
     `housesOnImportedInput`, `serviceRowDependence`, `rowMarkText`, `deriveMagicSupplyView`, `warHoldsIron`,
     `warIronState`, `ironWarState`, `warIronHookOutsideWar`, `housesWantingTradeInput`, `generateResourceAnalysis`,
     `importsBroughtAtBirth`, `housesShortOfInput`, `primaryImports`).
   - RESULT: 654 files and 8878 tests at the line's tip; 655 files and 8885 tests at the merge (the 7 more are my guard's 6
     and bar7EconTab's constructed metal record). THE SAME 84 FAILING NAMES at both. Two messages differ: by the worktree's
     path (`ledgerCitationIntegrity`), and the stored figure `sovereigntyLightingContract.walker` "the estate's file count
     moved" 3682 → 3683 (my guard file: the close's figure).
   - No older test red at the merge and green at the line's tip, so nothing more to re-key. The re-keys made before
     (bar7EconTab, section 6) are green at the merge.
   - Both doors give the same last line at the line's tip and at the merge: "hits 1786 · banked 1938 · fresh 0 · stale 152 ·
     ceiling 1938" and "fresh 38 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 stale 0 banked 107".
     typecheck strict (1113, ceiling 1113) and ratchet (167, ceiling 167) are green at both.
3. **`boughtByNameOnly` reaches NO older row.** The three older rows of `INPUT_IMPORTED_AS` (apothecary, apothecary_district,
   apothecary_established) all hold INPUT in `HOUSE_DEPENDENCE`, so the reading is false for them. Over the 720, the mark
   table base → tip prints a new "Curtailed by the siege." only on the dyer, the furrier's district, the river boatyard and
   the mint, and on their rows; no older house gains one.

## 10 · The second reader's MED 2: the alchemist's row of `HOUSE_NEED_INPUT` guarded (tests only)

`tests/domain/bar8Marks2.test.js` gains arm (3). At r2s-religious_conversion-town-2 the alchemist's shop and its row
("Potion brewing") carry "Short of medicinal herbs.", read alike on the owner's record, `toPublicSafe` and the share veil.
THE NEGATIVE beside it: bar0-town-calm-rand-46's alchemist's shop prints bare (the town makes medicinal herbs, and its
imports bring "Medicinal herbs"). The seed loop collects every failure.

PROOF, in a scratch tree at 1a2c7f2b4 with this file:
- with `alchemist_shop: 'herbs'` reverted from `HOUSE_NEED_INPUT`, the arm is red by its own claim (1 of 2 cases:
  r2s-religious_conversion-town-2, "expected null to be 'Short of medicinal herbs.'");
- restored, 7 of 7 green.

Nothing under `src/` changes.

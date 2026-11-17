# LEFT-MARKS · HAND-BACK (the sixth chair's BRIEF-LEFT, section LEFT-MARKS with AMENDMENT 1; 2026-11-17)

Base `lane/point33-candidate-2026-11-17` at e0242a12a (tree 4a9735d2f9). Branch `lane/left-marks-2026-11-17`, tip
bdeefcd14 (this file on top). Eleven commits, one an item, pushed after each. Nothing merged, no pull request, no force.

## 1 · The rules, before and after (towns / instances; the thirty · the 150 · the 720)

Measured with each tree's own runners over a full PAGE-COPY render of the 900 towns at each tree (base e0242a12a,
tip a380a4d6c; the last commit, bdeefcd14, changes one town of the 150 the runners do not read: section 6).

| rule | runner | 30 | 150 | 720 | guard |
|---|---|---|---|---|---|
| 8b.extract (page form) | runD | 0 → 0 | 0 → 0 | 3/6 → 0 | `bar6MarksLaw8` (a), (c) |
| 8b.extract (born form, `law8Marks.mjs`) | `bar6MarksLaw8` (a) | — | — | 17 → 0 (red at base by those 17) | the same |
| 8b.person | runD | 2/2 → 0 | 6/6 → 2/2 | 14/14 → 0 | `bar6PeopleLaw10` (page-form pair) |
| 8a.input | runD | 1/3 → 1/3 | 4/12 → 4/12 | 7/23 → 5/17 | `leftMarks` (L25), `bar6MarksLaw8` LEFT 3 → 1 |
| 8i.surplus | runH | 1/1 → 0 | 1/1 → 0 | 4/4 → 0 | `leftMarks` (L16) |
| every other rule of runD, runH, runI | | unchanged, rule by rule | | | |

- **Item 1 · L17 (ruling BR10 (2)).** `8b.extract` in both forms reads a source house worked out where EVERY GROUND OF
  ITS OWN KIND THE RECORD HOLDS IS SPENT (`law8.mjs :: ownGroundsOnRecord`: `houseKinds.js :: SOURCE_GROUNDS`, the land
  lists with the depleted ones, the proven grounds; never `sourceStoryOf`); a house outside the table keeps the chains'
  reading. The 17 mines read zero; blind, the rule finds 95 houses of the 720 where it found 85 (the 17 out, 27 in: houses
  on no chain whose every own ground is spent, each marked); r2r-city-18 fires blind; the planted pair (c): a mine on its
  only spent ground is an instance (red at base), beside a live coal seam it is none. Header of `bar6MarksLaw8.test.js`
  says it is the ruling's re-key, dated. The three page-form towns at base (r2r-metropolis-57, r2s-infiltrated-
  metropolis-1, r2s-insurgency-metropolis-3) are among the 17.
- **Item 2 · L15 (CM1).** `law8.mjs :: readPeople` reads the card's mark line (a row's mark or the venture's) and
  `8b.person` counts it as covering the person lines; `law8H.mjs :: readPersons`' title skips the mark line. The 720:
  14 → 0. The fifth chair's "15 rows of the 150" is 6 at this base; 2 stand: bar0-city-under_siege+famine-rand-28 and -35,
  the sawmill's keeper ("Cuts to measure and sells by the length") of a house left bare by the page form's own 8a.input
  ("Needs Timber" under the siege): that row is 8a.input's (page form only; the born form reads it zero), not the card's.
- **Item 3 · L25.** `crisisDependence.js :: HOUSE_NEED_INPUT` (butchers_3_8: livestock; apothecary_established: herbs), read
  by `houseInputAtHand.js :: housesWantingTradeInput` only where the record's own need list names the good and the one
  reader finds it nowhere; the butchers' dependence holds INPUT beside LIVESTOCK (the mark's gate). The two mends: "herbs",
  whole, brings the medicinal herbs ("Herbs and forage", "Ritual wood and herbs"); game is the stock of a house whose own
  trade takes livestock (the butchers only). MEASURED BEFORE TAKEN: the worklist's "two ids in HOUSE_TRADE_INPUT" brought
  "Livestock" in at the birth in 15 towns of the 720 and marked 13 houses beyond the two; the need-list table marks those
  two and no other over the 720 (guarded). LEFT struck by its own ratchet: r2r-town-54's butchers, r2s-religious_
  conversion-town-2's apothecary.
- **Item 4 · L16.** `crisisDependence.js :: SURPLUS_HOUSES` (maltster: grain), read in `crisisStoppedRow.js ::
  housesShortOfInput` through `rowShortOf`'s gate where the page's food line is short (`foodRowShown` with the tab's
  carriers), in a crisis or not, except in a calm town on a connected road (section 6). Every maltster of the 900 prints
  one mark on the record, `toPublicSafe` and the share veil (N4).
- **M1.** `supplyStoryLaw`: over the 720, 18 houses beside a live ground of their kind (the 17 mines, a charcoal burner of
  r2r-metropolis-43) read `local`, unmarked; every taker whose own grounds are all spent reads idle, marked (over ten
  mines). THE MUTATION (ruling A's `|| own.some((g) => live.has(g))` reverted): 18 rows red, "reads idle, marked \"Short of
  iron ore.\""; restored: green.
- **M2.** `birthKindsLaw`: a constructed record (r2r-town-0 stored, land emptied, a tanner alone). Beside "Livestock" the
  READER answers (nothing is brought whatever `bring` does), so the arm also holds "Dairy products" and "Meat" (words of the
  catalogue's livestock good the hides reader does not read): there `bring` alone keeps the hides word out. THE MUTATION
  (`bring`'s `subsumeTradeGoods` clause removed): red ("Dairy products": ["Raw hides and animal products"]); restored: green.
  `resourceGenerator.js` untouched.
- **M3.** `ordinaryTimesLine` decides it (handed the rows' short readings, a venture's mark is no short mark); the two tabs
  hand the readings (one hunk each). Nine of the ten towns print the line on neither tab; r2r-hamlet-27 carries the
  maltster's short mark now and prints it; r2r-city-20 prints it. Rendered tabs in `leftMarks` (M3).
- **M4.** `houseInputAtHand.js :: warStateOnRecord` (exported, read by `warIronHookOutsideWar`) maps `siege` and
  `occupation`; `supplyStoryLaw` (M4) holds it equal to `warStateOf` over the 720, the 150 and records of every word of
  `GEN_TO_PULSE_TYPE`, alone and beside a famine. No import added (EG1). 0 births move.
- **M5.** The comment above `sourceStoryOf`'s chains now says it as the 720 show it (spent iron beside a live seam).

YOUR GUARD `tests/domain/leftMarks.test.js`: 4 tests, all four red at the base, green at the tip.

## 2 · The controls (runH with `review-bar-6/SECOND-CHECK.final51.json`)

C20104 (8i STANDS, bar0-hamlet-under_siege-rand-43, the maltster): FOUND at the base, GONE at the tip, CHANGED by the mark:
"Maltster · Crafts / Short of grain. Converts barley into malt …". Every other control row reads as at the base (runH's
"controls off" 15 → 16 is this row: a STANDS row cured reads "off"; exit 3 at both trees). No EXPLAINED row is found.

## 3 · The lines a reader can see change (all in the page's existing mark words; no new prose)

- "Short of grain." on the maltster: bar0-hamlet-under_siege-rand-43, r2r-hamlet-27, r2s-wartime-village-3 (and
  bar0-village-calm-rand-38, r2s-under_siege-hamlet-1, -3; bar0-village-famine-rand-37 beside its famine mark).
- "Short of livestock." on the butchers: r2r-town-54 only. "Short of medicinal herbs." on the established apothecary:
  r2s-religious_conversion-town-2 only (each the one town of the 720 the table reads).
- Gone: the head line "A row marked short is what its house makes when supplied." on the Institutions and Services tabs of
  r2r-hamlet-26, r2r-hamlet-48, r2r-town-13 (nine of the 720, three of the 150); r2r-village-13's apothecary's "Short of
  its materials." (its "Herbs and forage" feeds it); "Medicinal herbs" from bar0-town-occupied-rand-43's imports.

## 4 · Declared moves (R5): the stored record, base against tip, every top-level field

- `resourceAnalysis.gaps`: r2r-village-13 (1 of the 720): the apothecary's two "missing" rows become one "imported" row.
- `economicState.primaryImports`: bar0-town-occupied-rand-43 (1 of the 30): the birth no longer brings "Medicinal herbs"
  beside "Ritual wood and herbs".
- The 150: 0. THE 525 REFERENCE CONFIGURATIONS: 0 of 525 move (every top-level field hashed at both trees).
- No new field on the saved record; nothing in `assembleSettlement.js`, `vite.config.js`, `package.json`.

## 5 · The net (each gate alone through `gate-tail.sh`; base e0242a12a, tip a380a4d6c, the gates the last commit touches again at bdeefcd14)

| gate | base | tip |
|---|---|---|
| typecheck:domain:strict | 0 | 0 |
| typecheck:ratchet | 0 | 0 |
| eslint, the changed sources | 0 (warnings only) | 0 |
| tests/architecture | 21/21 | 21/21 |
| npm run build | 0 | 0 |
| vendorPdfLazy + bootSmoke | RED: "goods consumers absent from the roster in src/domain/goods.schema.js … src/domain/display/crisisStoppedRow.js" | the same red, same message (named, not chased) |
| bar5*/bar6* guards | RED: bar6MarksLaw8 (a), the 17 mines | GREEN |
| my files' guards (supplyStoryLaw, birthKindsLaw, leftMarks) | leftMarks red (4 of 4) | GREEN at bdeefcd14 (birthKindsLaw arm 1 was red at a380a4d6c: section 6) |
| N3 | 7 red: generationForkCensus A1, A3e, A4, A6; pipelinePinnedMode A1, A2, A5 | the same 7, the same messages; publicProseEquality, isolatedTrade, pipelineContract green both |
| N2 tests/lint | 71 names red | the same 71 names, the same messages (ledgerCitationIntegrity differs only by the worktree's path: no local ledger ref in either) |
| R9 doors | A: "hits 1787 · banked 1938 · fresh 0 · stale 151 · ceiling 1938"; B: "fresh 39 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 stale 0 banked 107" | the same two lines: no fresh line added |

N5: the line's tip (`lane/join-2026-11-14` at ed1d43529) is the base's own first parent: `git merge --no-commit` at my tip
reads "Already up to date". Clean.

## 6 · Left by name

- **bar0-hamlet-calm-rand-40 (the 150): the maltster on a short food line in a calm town on a connected road prints bare.**
  BIRTH-1's law (`birthKindsLaw` arm 1) holds every buyer of such a town unmarked and the page's short set equal to the
  fact's; the maltster is a buyer (`BUYS_AND_WORKS`). L16's "in a crisis or not" and that law disagree in this one town of
  the 900 (runH's words do not read its card, "It needs grain to spare before it can work at all"). I kept the law and
  scoped the reading out of a calm town on a road (bdeefcd14). The chair's to rule: the law re-keyed to a surplus house,
  or the reading as built.
- **r2r-metropolis-19's butchers** stay on `bar6MarksLaw8` LEFT: "Game and hides" is on its imports, the butchers' stock by
  the brief's own mend, so they are at work; the rule reads "Livestock for meat and draft" alone.
- **The PDF's head line (LEFT-PDF's file): `src/pdf/lib/crisisMarksOnPage.js :: ordinaryTimesOnPage` hands a boolean, so
  the PDF still prints the line twice (Services, Institutions) in the nine towns: it needs the same hunk (hand
  `ordinaryTimesLine` the rows' short readings).**
- The two sawmills of 8b.person (section 1) belong to the page form's 8a.input under a siege, outside my rows.
- `law8Marks.mjs`'s 8b.extract now reads the proven grounds through `supplyStory.js :: impliedGroundsOf` (the land's
  reading, not the story leaf): named in case the chair reads "not by calling the leaf under test" more widely.
- No new vocabulary atom. New tables, each vetoable: `HOUSE_NEED_INPUT`, `SURPLUS_HOUSES` (crisisDependence.js);
  `KEY_IMPORT_WORDS`, `TRADE_STOCK_WORDS` (houseInputAtHand.js).

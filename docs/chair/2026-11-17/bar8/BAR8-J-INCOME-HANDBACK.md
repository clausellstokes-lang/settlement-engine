# BAR8 · J-INCOME-2 hand-back (seat J-INCOME, second seat; branch lane/bar8-j-income-2-2026-11-17)

Base 99ca9ad51 (the working line `lane/join-2026-11-14`; its tip is still 99ca9ad51 at hand-back). Commits, in order:
`0d3363177` (this file opened) · `9d344fc9c` ITEM 1, THE LEAF, ALONE (its hash sent to the chair at once) · `30b9fb7d5` item 2 ·
`771a1a945` items 3 to 5 and the guard · `e8eee1e68` the guard's anchors and BAR6-MARKS's struck house · this file.
Measured with `runJ.mjs` (11a, 11b, 11e) and `runK.mjs` (15c) over PAGE-COPY renders of the base and of `771a1a945` (the
thirty: the seventh read's `seeds.bar7.txt`; the 150: `birth3/seeds.w150.txt`; the 720: PAGE-COPY's `seeds.txt`).

## 1. The rules (the thirty · the 150 · the 720)

| rule | before | after | the cure |
|---|---|---|---|
| ITEM 1 · the leaf | the ordinary lines under `src/generators/` | `src/domain/display/incomeOrdinaryLines.js` | `ordinaryIncomeLineOf`, the three short twins, the cloth, metal and timber ordinary lines, L7's forge-idle twin and the five lines of `METAL_WORK_LINES`, moved unchanged; `incomeLineSiblings.js` imports and re-exports each by its name. PROOF: the stored records byte-equal at `9d344fc9c` over the thirty, the 150 and the 720; all 54 exports of `incomeLineSiblings.js` equal base's (values by JSON, functions by source text); the 12 leaf exports are the same objects through the re-export, so the Economics tab's income rows (`incomeDescShown(s, src, ordinaryIncomeLineOf)`) are those of base; `INCOME_STATE_SIBLINGS` byte-equal, and `tests/lint/census5dTablePools.test.js`, `incomeLinesSayTheRecord`, `bar7EconTab`, `leftChainCards`, `timberManagedFelling`, `coherenceAgreeCures` green as at base. The rendered tabs over the 720 at the tip differ from base only in the rows of items 2 to 5 (section 3) |
| 11b · the rites income line | 3 · 0 · 21 | **0 · 0 · 0** | `trueIncomeDesc` (case `FISH_EXPORT_LINE`): where every fishery is fished out, the fish story first: the salted fish on the imports gives `FISH_BOUGHT_LINE`; nothing bought, no sentence. The rites arm (BAR4-CORPUS-ECO FS1) is retired: under the supply rule a chain kept by magic feeds no house (`supplyStory.js :: sourceStoryOf`, read) and the Magic tab prints no fishing, so the rites line is true of neither story (4 of the 21 were idle: the line said a catch was landed where nothing comes) |
| 11a.imported | 2 · 5 · 5 | **0 · 0 · 0** | `importsAsPrinted().needed` drops a need a gap row of kind `imported` answers: the rows `crisisStoppedRow.js :: housesOnImportedInput` reads (read, unchanged), matched by the list's own `needMetBy`; no second matcher |
| 11e.offer · the need list's half (livestock) | 1 · 2 · 6 | **0 · 0 · 1** | the need list drops a good a live house's printed service row deals in (`NEED_DEALT_ROWS`: "Livestock auction(s)", "Livestock management"), save the failed venture's own material. The one left is r2r-hamlet-27, kept by the brief's exception (section 4) |
| 15c (K) | 1 · 0 · 2 | **0 · 0 · 0** | the maker row of "monster hunting services" and "dungeon clearance" (`MADE_GOOD_ROWS`) no longer names the veteran's lodge, whose catalogue card offers armed escort (and a village's watch hire) only: 7 cards of the 720 through a lodge alone print "Armed escort" alone |

The wider families, for the record (not mine to zero): 11e.offer whole 2 · 5 · 22 → 1 · 2 · 15 (left: J-ROWS's cards: the fair's
luxuries 5 and the quarter's spice 8; the smelter's charcoal 1, WEAK; the fish market's salt fish 1. On the 150 the assay
office's WEAK "Metal purity testing" beside "metals" also clears: the gap row says the iron ore is bought in). 11b.fish 13 · 3 · 69
→ 10 · 3 · 48 (the 21 rites lines). OTHER SEATS' RULES MOVE ONLY DOWN: 11a.atWork (MARKS-2's) 1 · 0 · 12 → 0 · 0 · 10 (a need
the fair now answers no longer stands beside the butchers); 11e.wantBuy (K-PEOPLE's) 2 · 0 · 6 → 1 · 0 · 5. Every other rule of
`runJ` and `runK` is equal, base to tip, on the three populations.

THE GUARD, `tests/generators/bar8Income.test.js` (new): 8 tests, on constructed records (each negative beside its positive, by
`expectAbsentWithAnchor`) and on eleven fixed towns of the three populations (seed loops that collect every failure). At the
base's behaviour (the leaf added, the tree `9d344fc9c`) 7 of 8 red (the eighth is item 1's identity); at base itself the file
cannot load (no leaf); at the tip 8 of 8 green.

## 2. The controls (the thirty, `runJ --controls`, `runK`; both exit 3 by design)

- C0893 (11a.imported, bar0-city-under_siege+famine-rand-45): CLEAR. The need list prints "copper ore, gold and silver ore";
  the Smelter's gap row brings the iron ore.
- C42813 (11a.imported, bar0-village-calm-rand-47): CLEAR. "Needed, and not brought in: salt." (the Tannery runs on imported livestock).
- C20963 (11b, bar0-metropolis-calm-rand-45): CLEAR. "Fish & Preserved Produce The fishery here is fished out; the fish sold now is salted and bought in."
- C42801 (11b, bar0-village-calm-rand-47): CLEAR. The share prints its label and share alone (the village's salted fish is
  written by the birth after the income line: section 4).
- C36003 (K's 15c, bar0-town-calm-rand-47): CLEAR. "Adventuring & Escort · Via Veteran's lodge · Outputs Armed escort".
- C34109 (MARKS-2's 11a.atWork, bar0-town-calm-rand-46): CLEAR AS A SIDE EFFECT, named: "livestock for meat and draft" leaves
  the need list there (the town's Annual fair prints "Livestock auction"), so the butchers stand beside no unmet need. Not my
  rule; no line of mine prints there.
- C32296 (11e.offer, "Luxury goods available.", bar0-town-calm-rand-45): still FOUND: the fair's card is J-ROWS's.
- Every EXPLAINED control of J is clear as at base; every other STANDS control is FOUND as at base.

## 3. Lines a reader can see (no new text: every line printed is a line that exists)

- `FISH_BOUGHT_LINE` "The fishery here is fished out; the fish sold now is salted and bought in." now prints IN PLACE OF the
  rites line on 13 shares of the 720 and 2 of the thirty: bar0-metropolis-calm-rand-45, bar0-city-wartime-rand-47, r2r-city-35
  (also r2r-metropolis-21, r2s-wartime-city-1). The PDF's Economics section prints it too (it reads the stored line).
- The rites line no longer prints anywhere (21 of the 720, 3 of the thirty). Where the share takes a mark it prints the mark
  alone ("Fish & Maritime Produce Short of fish.": r2r-metropolis-45, r2r-village-45, r2s-indebted-village-1, and two more);
  where it is bought and the import is not yet on the list at the draw, its label and share alone (section 4).
- The need line loses a good the page's own rows bring in or deal in: "Needed, and not brought in: copper ore." (r2r-metropolis-12;
  was "livestock for meat and draft, copper ore."), r2s-under_siege-city-2 (loses "iron ore"), r2r-village-47 (loses
  "livestock"); 10 need lines of the 720, and 10 of the 150 and the thirty together; the PDF's two need lists follow.
- The escort chain card through a veteran's lodge: "Outputs Armed escort" (r2r-town-45, r2r-town-50, bar0-town-calm-rand-47); the
  PDF's Services row "Veteran's lodge » Armed escort" with it.
- THE SHARED PAGE (N4): `importsAsPrinted().needed`, every `chainOutputsShown` and every income line, read on the owner's record
  and on `projectShareVeil(toPublicSafe(record))`, are equal in all 900 towns at the tip (0 differences; 0 at base).

## 4. Declared moves, the books my cures move, and what is left by name

- DECLARED MOVE (R5), item 2 alone: `economicState.incomeSources[].desc`, in 3 of the thirty, 0 of the 150, 21 of the 720, and
  36 of the 525 reference configurations (the golden's procedure, its four seeds: every one a coastal city or larger whose
  rites line takes the bought line; nothing else of any record moves). Items 1, 3, 4 and 5 move no stored field.
- THE TWO DOORS (R9). `presumption-classes-door --check`: base "hits 1787 · banked 1938 · fresh 0 · stale 151"; tip "fresh 3 ·
  stale 154". `presumed-things-door --check`: base "fresh 38 · stale 72"; tip "fresh 40 · stale 74". EVERY FRESH ROW OF MINE IS
  ITEM 1's RELOCATION, NOT A NEW LINE: the same class, status and hash, keyed under the leaf's path where they were banked under
  `incomeLineSiblings.js` (presumption: "Little cloth is made here …", "Cloth is woven or finished here.", "Local forest provides
  timber revenue, and the timber is sawn here."; presumed things: the two `smith` rows "Local coal fires the forges …", "Local ore
  feeds the smithy directly …"). The door's `--bank` refuses them (the leaf did not stand at the register's base) and the
  registers are the close's (R10): LEFT BY NAME for the close to re-key, five rows, file key only. Items 2 to 5 add no fresh row.
  Until then `tests/lint/presumptionClasses.walker.test.js` "no NEW undeclared line" is red at the tip (green at base) by these 3.
- `tests/lint/ruinFilterRoster.walker.test.js` "every `.institutions` reader is COMPLIANT or EXEMPT": red at the tip by the leaf.
  `ordinaryIncomeLineOf` reads the raw roster, as it did unscanned under `src/generators/` (outside the walker's root). Measured:
  no town of the 900 holds a non-live house, so routing the read through `isLiveInstitution` would move nothing on the
  populations. But it costs the leaf its import-free form (the brief's item 1), and PDF-2 holds a copy of the leaf. THE CHAIR'S:
  an import of `institutionRoster.js` (itself import-free) in the leaf and in PDF-2's copy, or an exempt row in the walker.
  Not changed; the walker's file is not mine.
- `tests/domain/bar4CorpusEcoKinds.test.js` FS1 (a) "where the rites hold the chain up, the rites line prints in place of
  'bought in'": RED AT THE TIP BY THE BRIEF'S OWN CURE, NOT LOOSENED. Its four towns (r2r-town-6, r2r-city-35, r2r-metropolis-11,
  r2s-wartime-city-1) now print the bought line, the story bought. No town of the three populations prints the rites line now,
  so no re-key by identity exists. FS1 (b), the KEEP, stays green. The chair rules whether the earlier ruling FS1 yields to the
  supply rule here.
- `tests/domain/bar6MarksLaw8.test.js` (a): its LEFT house 'r2r-metropolis-19 · 8a.input · Butchers (3-8)' is cured by item 4
  (the need line that marked it leaves where the fair prints "Livestock auctions"). It is STRUCK by the test's own rule, with a
  dated note; the list only shrinks. Green at the tip.
- THE BOUGHT STORY PRINTED SILENT (3 shares of the 720): r2r-village-11 (below a town the birth writes the salted fish later,
  `resourceGenerator.js :: importsBroughtAtBirth`, MARKS-2's file, after the income line is drawn), r2r-metropolis-49 and
  r2r-metropolis-58 (the salted fish is the import list's eleventh item, past `trueIncomeDesc`'s first-ten reading). Each prints
  its label and share alone: true, but silent where the bought line would be truer. A reading at print would need
  `economicsCrisisMarks.js` (not mine) or the leaf (PDF-2's copy). Named, not chased.
- r2r-hamlet-27 (the brief's exception), WHAT I FIND: the failed venture "The dairy farmer is failing: no livestock lies near
  and none is brought in." stands beside a Shepherd (its row "Livestock management": "Tend, protect, and move flocks between
  pastures"), "Common grazing land" and a Stable yard on the roster, and no grazing ground on `config.nearbyResources`
  (fishing grounds, shipbuilding timber, a magical node). So the venture's pick (`supplyStory.js :: ventureAtBirth`, rule (i):
  "the only live house using a material", `usersOf`) did not count the shepherd's flock or the common grazing as livestock: a
  whole trade was abandoned beside its own herders (BR6). The need "livestock" STAYS on its need list (not hidden). The fault
  is the birth's, in `supplyStory.js` and `resourceGenerator.js`, neither mine.
- Render noise, named: r2r-thorp-2's Power tab lost its "Patron deity … Upgrade to premium" panel in the tip's render. Its
  record is byte-equal to base, and none of my cures reads that tab.

## 5. The net (R11, N2, N3, N5, N6), each alone through `sh scripts/gate-tail.sh`, at base 99ca9ad51 and at the tip 771a1a945 (e8eee1e68 for the tests it touched)

| gate | base | tip |
|---|---|---|
| `npm run typecheck:domain:strict` | 0 | 0 |
| `npm run typecheck:ratchet` | 0 | 0 |
| `npx eslint` on my changed sources and the guard | 2 (the leaf and the guard are absent at base) | 0 |
| `npx vitest run tests/architecture` | green | green |
| N3: pipelineContract, isolatedTrade, pipelinePinnedMode, generationForkCensus, publicProseEquality | 6 red | the SAME 6, by name (pipelinePinnedMode A1, A2, A5; generationForkCensus A1, A4, A6) |
| the guards of the rounds before (`tests/domain/bar5*`, `tests/generators/bar5*`, `bar6*`) | green | green at e8eee1e68 (bar6MarksLaw8's struck house, above) |
| `tests/joins` · `tests/build/vendorPdfLazy.test.js -t "WEAVE ST-2"` | green · green | green · green (no label join, no unrostered goods consumer added) |
| my guard | cannot load (7 of 8 red at the base's behaviour) | 8 of 8 |
| N2: all of `tests/lint`, by name (`failnames.mjs`) | 69 names | 72 names. NEW: presumptionClasses "no NEW undeclared line" and ruinFilterRoster (both item 1's relocation, above); ledgerCitationIntegrity's [FILE] row is the same failure under another worktree path (it needs the docs ledger branch, absent from a scratch worktree); the negative-anchor walker's "quarantine is EXACT" was mine and is green at e8eee1e68 |
| the two doors | above | above |

No file under `src/domain/facts/` was added or changed and no import in one, so no build was run (R11). N5: the line's tip is
the base itself (99ca9ad51), so the scratch merge is "Already up to date": CLEAN. N6: `lane/checks-2026-11-17` holds no list at
this base, so the base's reds above are my own run's.

FILES TOUCHED: `src/generators/economy/incomeLineSiblings.js`, `src/domain/display/tradeListDisplay.js`, the new
`src/domain/display/incomeOrdinaryLines.js`, the new `tests/generators/bar8Income.test.js`, `tests/domain/bar6MarksLaw8.test.js`
(one struck house, by its own rule), this file. Nothing under `src/pdf`, no register, no reference file, no stored figure.

## 6. AFTER THE CHAIR'S RULINGS (the chair's messages of 01:25 and 02:25 UTC, 2026-11-18)

**RULING BR26, BY THE OWNER'S WORD ("Move the entries"): commit `cc7ebb708`, alone.** The five rows moved BY HAND from the key
`src/generators/economy/incomeLineSiblings.js` to the key `src/domain/display/incomeOrdinaryLines.js`, each row unchanged; no
`--shrink`, no `--bank`; the ceilings equal (presumption 1938); parsed, each file equals its parent with the rows moved back
(nothing else changed). The five rows, word for word, the same before (under the old key) and after (under the new):

`tests/lint/presumptionClasses.register.json` (`[class, status, text, hash]`):
1. `["goods","other","Little cloth is made here while the cloth trade is short of what it needs.","68f7f8907313f33a"]`
2. `["goods","other","Cloth is woven or finished here.","a051929a6344f5f0"]`
3. `["resource","other","Local forest provides timber revenue, and the timber is sawn here.","0855cc21d84e57a4"]`

`tests/lint/presumedThings.widened.register.json` (`arm1`, `[thing, reason, text, hash]`):
4. `["smith","family","Local coal fires the forges, but the iron is bought in; this income stream leans on the trade route.","782b0b74db43359b"]`
5. `["smith","after-base: close-true","Local ore feeds the smithy directly. Metalwork income is not trade-route dependent.","ab7a101ef0ffa943"]`

PROOF. The key is the file's path plus the row's own class and hash (`presumptionClasses.shared.mjs :: rowKey`), and the hash is
the literal's, not the path's: the same row is kept. `node scripts/presumption-classes-door.mjs --check` now prints at the tip
what it prints at base: "hits 1787 · banked 1938 · fresh 0 · stale 151 · ceiling 1938". `node scripts/presumed-things-door.mjs
--check` prints the same whole output as at base, line for line ("fresh 38 · stale 72 · first-register stale 7 · banked 4688 ·
strips fresh 0 stale 0 banked 107"). Both walkers' tests read by message as at base: presumptionClasses' "no NEW undeclared
line" is green again (its "no stale row" red as at base, the same 151); presumedThings' two arms red with base's messages.

**THE RUIN-FILTER ROSTER (the chair's (1)): commit `df4e0e85a`. The roster's row follows the moved reader.** Measured: no
record of the 900 holds a non-live house, so the live roster (`isLiveInstitution`) would give the same line on every income
share. But the leaf stays import-free (the brief) and PDF-2 holds its byte-for-byte copy, so I chose THE ROW, not the import:
`RUIN_AGNOSTIC_EXEMPT` gains `src/domain/display/incomeOrdinaryLines.js` (name-lookup/display, with that measure as its
reason). The old file was never on the roster: `src/generators/` is outside the walker's `src/domain` root. THE WALKER'S
MESSAGES: at base, one red, "the scan reads CODE …": "expected 115 to be 113". At the tip before the row, two reds: "every
`.institutions` reader is COMPLIANT or EXEMPT" naming `src/domain/display/incomeOrdinaryLines.js`, and "expected 116 to be 113".
At the tip now, one red, "expected 116 to be 113": the stored count is the close's, and it is one more than at base by the leaf.

**ALL OF `tests/lint`, EVERY RED BY MESSAGE (the chair's (2)).** First at base 99ca9ad51 and at the tip `df4e0e85a`. Then at a
SCRATCH MERGE of the tip with the line's tip `70e557d5b` (`lane/join-2026-11-14`, which had moved: a clean automatic merge,
then aborted), against that line tip alone. Each pair holds 69 reds, the same tests by name. Folding the worktree paths, the
messages differ in three COUNTS only, the same three in both pairs, each one more by a file of mine (stored figures, the close's,
NAMED):
- `ruinFilterRoster.walker.test.js` "the scan reads CODE …": 115 → 116 (against the stored 113): the leaf, a new
  `src/domain` reader (its row above).
- `sovereigntyLightingContract.walker.test.js` "the estate's file count moved": 3680 → 3681 at base and tip; the line's own
  count → one more at the merge: the leaf, one new source file.
- `mutationCoverageManifest.test.js` TOTALITY: its list of invariant files with no entry gains `tests/generators/bar8Income.test.js`
  (it already holds bar7Lines, bar7Scenes and bar8Rows, the guards of other seats). `scripts/mutation-coverage-manifest.json`
  is not my file: NAMED for the close (a rationale entry, or a planted regression in `scripts/mutation-sweep.sh`).
No message names `src/domain/display/incomeOrdinaryLines.js` any more. The doors at the merge print what they print at the
line's tip: presumption "hits 1786 · banked 1938 · fresh 0 · stale 152"; presumed things the same whole output, line for line.
AT THE MERGE my guard, the tests I touched or my cures reach (`bar6MarksLaw8`, `bar4CorpusEcoKinds`, `incomeLinesSayTheRecord`,
`bar7EconTab`, `leftChainCards`), `tests/architecture` and `tests/joins`: 825 of 826 green. The one red is FS1 (a) of
`bar4CorpusEcoKinds`, made untrue by the cure itself (section 4).

## 7. AFTER THE CHAIR'S MESSAGES OF 02:56, 03:02 AND 03:11 UTC (commit `660f488d6`; one push, the push discipline)

1. **THE FIVE ROWS (BR26)** are in `cc7ebb708` (section 6: the five rows word for word, both doors at base's figures, the
   presumption walker's "no NEW undeclared line" green).
2. **THE ROSTER (the chair's ruling): THE LEAF READS THE LIVE ROSTER THROUGH THE ONE FILTER.** `incomeOrdinaryLines.js` imports
   `institutions/institutionRoster.js` (import-free itself, eager: EG1 holds), and `ordinaryIncomeLineOf` reads
   `liveInstitutions(town)`. The exempt row of `df4e0e85a` is removed. PROOF: `tests/architecture` green (the layer law lets
   `src/pdf` reach the leaf as before); the stored records of the thirty, the 150 and the 720 are BYTE-EQUAL to the tip's before
   the change (fresh births at `660f488d6` against the render corpora of `771a1a945`); `ruinFilterRoster` is back to its figure
   at 99ca9ad51 ("expected 115 to be 113", that one red; the leaf names `.institutions` nowhere in code, so it is no reader);
   the guard's new constructed arm: a town whose only weavers' house is ruined prints no "Cloth is woven or finished here."
   (red before the import), and a ruined sawmill gives the plain timber line. THE SMELTER'S ARM THE CHAIR NAMED CANNOT BE RED:
   the metal case reads no roster at all (`METAL_SHORT_LINE` gives `METAL_WORKED_LINE` without asking, the short twin being
   drawn only beside a forge house), so the arm is the weavers' and the sawmill's, the two cases that read it. PDF-2b's copy
   of the leaf is the one at `9d344fc9c`: the chair takes mine at the merge.
3. **FS1 (a) (BR33)** is re-written in `tests/domain/bar4CorpusEcoKinds.test.js` to the claim that now holds: its four towns
   (r2r-town-6, r2r-city-35, r2r-metropolis-11, r2s-wartime-city-1) print the bought line and not the rites line
   (`expectAbsentWithAnchor`), with a dated note naming FS1 (a) retired by BR33. Green. CAN THE RITES LINE STILL PRINT? NO, BY
   CONSTRUCTION: no writer returns `FISH_RITES_LINE` (the one arm that did is retired; `trueIncomeDesc`'s fished-out branch
   returns the bought line or ''). Its text stays declared in `INCOME_STATE_SIBLINGS` (the fish family keeps four live lines).
   A DEAD LINE, NAMED FOR THE CLOSE'S LIST, NOT DELETED.

**THE BUTCHERS' CASE (BR31): LEFT BY NAME.** My count is at the chair's 380,000 line, so I did not start it. It is r2r-city-43
of the 720 and bar0-town-calm-rand-46 of the thirty (C34109): the butchers bare beside "livestock for meat and draft" needed,
while the imports hold "Raw hides and animal products". MY ITEM 4 ALREADY CLEARS C34109 and r2r-city-43's need for another
reason: both towns' fairs print a livestock auction (section 1; C34109 clear at the tip). So the one-good rule's own measure
(every need it would drop, the STOP test for a hide-only import, the roots' `gapImportedNoImport` for livestock and hides) is
untaken and goes to the next seat with `tradeListDisplay.js`.

**THE NET FOR THESE COMMITS, AT A SCRATCH MERGE WITH THE FROZEN LINE TIP 70e557d5b** (clean automatic merge, then aborted):
the older tests that name `ordinaryIncomeLineOf`, `incomeOrdinaryLines`, `liveInstitutions` or FS1 (16 files, with my guard,
`bar6MarksLaw8`, `bar4MarkPromise` and `tests/architecture`): 587 of 587 green. All of `tests/lint`, BY MESSAGE, against the
line tip alone: the same 69 reds. Two messages differ, each by one: the estate's file count (the leaf) and the mutation
manifest's list (my guard, beside the other seats' guards it already lists), both the close's, named. `ruinFilterRoster` now
reads exactly the line tip's message. The doors at the merge read the line tip's figures: presumption "fresh 0 · stale 152";
presumed things "fresh 38 · stale 72".

## 8. AFTER THE SECOND READER (READ-INCOME-PDF; the chair's message of 06:49 UTC): three commits, one push

1. **THE HIGH (`9b723bfdc`).** `src/domain/facts/factLayers.js`, the one row `importsAsPrinted`: `reads` gains
   `availableServices` (stratum 1; the leaf stays at layer 4, no pool placement asked). At a scratch merge of my tip with
   `origin/lane/landing-close-2026-11-18` (0af60594a), `tests/lint/factLayers.walker.test.js` is 15 of 15 green, as on the
   close's branch alone (15 of 15); merge aborted. THE MERGE IS NOT CLEAN: the close's branch rewrote the same row (it added
   `economicViability`), so the row conflicts. THE RESOLUTION IS THE UNION, one row:
   `reads: ['activeConditions', 'availableServices', 'config', 'economicState', 'economicViability', 'institutions',
   'resourceAnalysis', 'stress', 'stressors', 'tier']` with the close's comment. That is the tree the walker was run on.
2. **THE MED 2 (`88e8958fd`), BR33 (2).** `ordinaryIncomeLineOf`'s metal arm asks the live roster for a house that smelts or
   works metal (`FORGE_HOUSE_WORDS`, moved unchanged into the leaf and re-exported by `incomeLineSiblings.js` under its name;
   `economicState.js` and `trueIncomeDesc` read the same object), else no sentence. The guard's new arm (Blacksmiths ruined:
   no line; the same house standing: "Metal is smelted or worked here.") is red at 262ba9ec6 (the old leaf prints the line for
   the ruined smiths) and green now. The stored records of the thirty, the 150 and the 720 are byte-equal. The ordinary line of
   every income share, with and without the forge-idle reading, is equal before and after (404 · 1,914 · 9,328 reads, 0 differ):
   no town holds a non-live house.
3. **THE LOW 2 (`81ac4096d`).** FS1 (a)'s dated note quotes the retired claim in its own words.

NET at `81ac4096d`: `typecheck:domain:strict` 0; `typecheck:ratchet` 0; eslint on the five changed files 0; `tests/architecture`,
the guard, `bar4CorpusEcoKinds`, `bar7EconTab` and all of `tests/pdf`: 1,008 of 1,008 green. NOT TOUCHED (the chair's word):
`tradeListDisplay.js` (the reader's MED 1, `dealtInHere` dropping "livestock" beside a house marked short of it, is the seat
FAULTS-NEED's); the stored figures the reader named.

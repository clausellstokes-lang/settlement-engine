# BAR8-J-ROWS · HAND-BACK · the fish rows, the fair's offer, and the general gap line

Seat J-ROWS of the round BAR8 (BRIEF-BAR8; the seat's section as the chair's prompt gave it, 2026-11-17). Branch
`lane/bar8-j-rows-2026-11-17`. Auditor: seat J (`AUDIT/BAR8-AUDIT-J-HANDBACK.md`, runner `AUDIT/runJ.mjs`).

**THE BASE.** The checkout's source revision was **0cdedd206**, not 8bc3daee4: it is ONE commit past it, auditor J's own
"11g (the chair's note): the general gap line beside the story's own line, counted" (docs and `tests/helpers/pageLaws/law11Supply.mjs`
only; nothing under `src/`; `git diff 8bc3daee4 0cdedd206 -- src` is empty). I kept it: it holds the detector of my item 3.
Every "base" figure below is measured at 0cdedd206 (the same `src/` as 8bc3daee4). My base renders of the 150 and the 720
reproduce the auditor's published `RUN-J.150.txt` and `RUN-J.720.txt` line for line.

**WHAT I CURED: item 3 (G1), a reading at print. ITEM 1 WAS BUILT (section 7) AND THEN RETURNED TO THE BASE (section 9,
AFTER THE SECOND READER: the bought-only swap of ruling BR24 cannot be read at the services roll; the hunk it needs is named
there). The card and item 2 are LEFT, by the chair's word (section 7 (2)). SECTION 9 SUPERSEDES SECTION 7 (1).**

## 1. The rules, before and after

| rule | thirty (seventh read) | the 150 | the 720 | guard |
|---|---|---|---|---|
| **G1 / 11g.gapLine** · the general "No X reaches the <house>." beside the house's own story line | 8 in 7 towns → **0** | 17 in 17 → **0** | 129 in 118 (the detector) → **0**; by my reading 130 in 119 → 0 | `tests/generators/bar8Rows.test.js` |
| 11b.fish (services "Fish sold daily from the morning catch.") | 13 → 13 (services 4) | 3 → 3 | 69 → 69 (services 29) | — LEFT (item 1) |
| 11b.fishTitle (title and chip) | 7 → 7 | 3 → 3 | 51 → 51 | — LEFT (item 1) |
| 11e.offer (the fair's cards; the quarter's) | 2 → 2 | 5 → 5 | 23 → 23 (fair 5, quarter 7) | — LEFT (item 2) |
| LAW 11, all | 54 → 46 | 88 → 71 | 416 → 287 | |

NO OTHER RULE MOVES: base and tip runs differ by the 11g rows alone in all three populations (the extra rows in a diff of
the "DISTINCT LINES (top 25)" list are other rules moving up a rank, not new instances). The tip renders are the base
renders with the towns whose gap lines change rendered again at the tip (7, 17, 119 towns): the records are byte-identical
at the tip (143 of 143 re-born records equal the base's), and the re-rendered dumps differ from the base's ONLY by the
removed general lines (on the Resources tab and in the PDF). Runs, instances and tables: scratch, not committed (R10).

### G1, COUNTED FIRST (by house kind, source houses apart; my reading at the base, the same as the detector's plus one)

- **The 720: 130 lines in 119 towns.** Source houses 124: stone quarry 58, mine 32 (iron ore 29, coal 3), fisher's landing
  12, dairy farmer 7 (5 worked out, 2 the failed venture), peat cutter 4 (3 worked out, 1 venture), charcoal burner 3,
  shepherd 3, hunter's lodge 2, salt works 1, wildfowler 1, fishing community 1. Buyers 6, each the failed venture
  (doubled only): carpenter, cobbler's guild, fuller, potter, tanner, and **the tanners of r2r-town-13** ("The tanners
  are failing: …": the detector reads "is failing" only, so it counts 129; the cure takes it with the rest).
- **The 150: 17 lines in 17 towns.** Source 15: stone quarry 7, mine 6 (iron ore 5, coal 1), dairy farmer 1, hunter's
  lodge 1. Buyers 2 (venture): potter, sawmill.
- **The thirty: 8 lines in 7 towns.** By material stone 4, iron ore 2, clay 1, fish 1; by story worked out 6, the failed
  venture 2.

### G1, THE CURE (`src/domain/display/validationOnPage.js :: resourceGapLines`)

Where the house's own story line is printed (worked out on its own spent ground; the failed venture's line), the general
line does not name the material that line tells; a material no story line tells keeps the general line, and a gap row with
no story line keeps it whole. A worked-out source house's every own ground is spent, so it tells each ground's good (its
yield, `supplyStory.js :: GROUND_YIELD`, and the row's own name of it, `rowGoodOf`: a peat cutter's peat); the venture
tells its family's noun (`FAMILY_NOUN`, the row's good). Order and severity unchanged. No new words.

**THE MARK'S OWN READING IS UNTOUCHED (the chair's constraint of 18:30 UTC, which reached me after my
first hand-back at c25fa870d; met at the tip after it).** `crisisStoppedRow.js :: housesShortOfInput` calls `resourceGapLines` once a house with that house's rows and
the key `[STORY_OF_RECORD]`, and reads "Short of <noun>." off "No <noun> reaches …". `resourceGapLines` names that call
(`markReadsAlone`: the record carries `STORY_OF_RECORD` as its own key; the mark's call is the only one in `src/` that sets
it) and gives it the general line exactly as before: the told goods are struck only for the plain call (the Resources tab,
`ResourcesTab.jsx:155`, and the PDF, `viewModelBodySlices.js:395`, which pass the record itself). WHY THIS FORM: the two
print sites and the mark's file are other seats' (none touched), so the two readings can only be told apart inside this
function, and the key is already the mark's own declaration that it reads one house alone (BIRTH-3, BR8); the switch is
named at its one line with the caller it answers. MEASURED: the mark's per-house call returns byte-identical lines at base
and tip for **1,732 of 1,732 houses** (the 720, the 150, the thirty); `housesShortOfInput` and `rowShortOf` (every house,
every service row): 0 differences over the 720 and the 150. My first form (no switch) had left the three worked-out peat
cutters doubled to keep their mark "Short of peat."; this form cures them too.

- **No town loses its only gap line** (0 of 720, 0 of 150, 0 of 30): the story line stands where the general line went.
- **The tab and the PDF print alike** (one function, the same plain call), in the dumps: r2r-hamlet-49 "No one here works the
  gold/silver ore near Vishnugram." / "The peat cutter is worked out: …"; r2r-metropolis-45 "The mine is worked out: …";
  r2r-town-13 "No one here works the stone near Vatankher." / "The tanners are failing: …": tab = PDF in each.
- **N4:** the owner's record, `toPublicSafe` and the share veil (`projectShareVeil`) print the same gap lines in 150 of 150
  towns at the tip (and at the base); the guard holds it on its seven towns.
- **Multi-material lines:** none of the 130 names two goods; the code drops only the told goods if one ever does.

## 2. The controls

The thirty's STANDS controls of my rules: **C20700** and **C36970** (11b.fish, "Fish sold daily from the morning catch.")
and **C32296** (11e.offer, "Luxury goods available."): **FOUND at the base and still FOUND at the tip** (items 1 and 2 are
left; the reason below). The runner therefore exits 0 at the tip, not 3. Every EXPLAINED control of the seat is clear at
both (the CONTROLS block is byte-identical base and tip). G1 has no read controls (no reader marked it); its eight lines of
the thirty are gone (bar0-hamlet-under_siege-rand-45, bar0-village/town/metropolis-calm-rand-46, -47).

## 3. The lines a reader can see

NONE NEW. Lines REMOVED only (the general gap line where the story line stands), e.g. "No iron ore reaches the mine."
in bar0-metropolis-calm-rand-32, "No game reaches the hunter's lodge." in bar0-hamlet-under_siege-rand-37, "No clay
reaches the potter." in bar0-town-calm-rand-32. **The twin of BR17 is NOT written** (item 2: it would never print).

## 4. Declared moves, books

NO DECLARED MOVE: no file under `src/generators/` is changed, no stored record moves (the 525 reference configurations do
not move: nothing the birth reads changed). No stored figure, register, census or baseline is re-taken. N3 not engaged.

**R8 RE-KEYS (each dated in place; the claim kept, the form kept):**
- `tests/generators/bar4RecordHouseInput.test.js` (KEEP) and `tests/domain/bar4MarkPromise.test.js` (d): "the gap line the
  record asks for prints" on r2s-religious_conversion-hamlet-2's idle charcoal burner now expects the line the page prints
  for that house, "The charcoal burner is worked out: its own ground is depleted (Managed woodland)." NO town of the 720 or
  the 150 prints the burner's general line alone at the tip (every short burner is worked out), so the town could not move.
  The marks' assertions are unchanged and pass.
- `tests/helpers/houseInputSplit.js` (the split detector of `bar4RecordHouseInput.test.js`): the page says no input reaches a
  house by the general line, OR by the house's own story line ("The X is/are worked out:", "is/are failing:", "stands
  abandoned"). Its two positive controls (a planted caravanserai gap, a short sawmill selling lumber) still fire.

## 5. LEFT BY NAME

**(1) Item 1, 11b.fish and 11b.fishTitle (services 29, titles and chips 51) and the fish market's card: THE FACT CANNOT
REACH `institutionServices.js`.** `getServicesForInstitution(institution, tier, overrides)` sees the house and `overrides`
only, and `overrides` is built in `src/generators/services/serviceRollMaterialization.js :: materializeInstitutionServiceRolls`
(`mergedOpts`: the user's toggles, `_tradeRoute`, `_waterAccess`). No record fact (the land list, the imports) is in it,
and the house object carries none. That file is not mine (R3). MEASURED IN SCRATCH, NOT COMMITTED: the whole cure is
three lines, one there (`_fishUsedUp: usedGroundOf({ config }, 'fish') !== ''`, `usedGroundOf` imported from
`domain/facts/supplyStory.js`) and one condition here (`(overrides._waterAccess === 'none' || overrides._fishUsedUp === true)`
at the inland swap). It clears **29 of 29** service descriptions of the 720, and with them the fish market's 47 titles and
chips. ITS DECLARED MOVE (R5): field family `availableServices` only; **35 of the 720 towns** (the 29, plus 5 whose row
already carried its "Short of fish." mark, plus r2s-plague_onset-thorp-2's fishing community) and **48 of the 525**
(town 12, city 12, metropolis 24); in every one of them no field but `availableServices` moves (no draw moves: the same roll,
the same p). The fishmonger's "Fresh fish" row swaps to its own "Salted fish" under the same condition. NOT IN THAT HUNK:
the fisher's landing's "Fresh fish" / "Catch of the day." (4 titles, 2 descriptions of the 720, story bought-never): its
pool has no alternative (the catalogue, `src/data/institutionServices.js`, is not mine). THE CARD ("Where the day's catch is
sold", `institutionDescVariants.js` about line 271): the draw (`assembleInstitutions` via `institutionDescDraw.js`) and the
late re-read (`DESC_LATE_SIBLINGS`, resolved in `assembleSettlement.js`) choose a variant only by an atom of the vocabulary,
and no atom says the fish ground is used up (`source spent` is the food record's leading source; `trade at work: fish` is
held by the market itself). It needs a NEW ATOM (e.g. on `supplyStory.js :: usedGroundOf(record, 'fish')`), which R6
forbids me unnamed. One atom would serve the card and, through `SERVICE_DESC_SIBLINGS`, the service row too.

**(2) Item 2, 11e.offer: the fair's "Luxury goods available." / "luxuries to be had" (5 that stand) and the quarter's
"The trade in silk, spice, and precious things." (7, PLAUSIBLE).** The fact is the need list
(`tradeListDisplay.js :: importsAsPrinted().needed`, a reading at print, LEFT-CHAIN's file). No atom answers it: all six fair
towns are on roads, none under a siege (the existing twin's crisis), at prosperity from poor to wealthy, so no route,
crisis or band separates them. A declaration needs a NEW ATOM ("the need list names <good> not brought in"); the late
re-read in my file (`DESC_LATE_SIBLINGS`) could carry the fair's and the quarter's declarations once one exists. **BR17's
twin is not written:** without a declaration it never prints. The quarter is left by name with the fair (one atom would
serve both). The livestock chips (6) are another seat's, as the section says.

**(3) G1: nothing left.** (My first form left the three worked-out peat cutters; the chair's constraint gave the form that cures them.)

## 6. The guard and the net

`tests/generators/bar8Rows.test.js` (6 tests; seven towns: six of the 150 and r2r-hamlet-49): the detector on literals
(positive and negative); no general line beside the same house's story line, the story line printed, every town keeping a
gap line; a row with no story keeps its general line (bar0-town-calm-rand-29, bar0-metropolis-calm-rand-29); the mark's own
reading of the peat cutter keeps "No peat reaches the peat cutter." while the print strikes it, and the mark reads "peat";
the marks still read every house; N4 (owner, public, veil). **FAILS at the base (3 of 6), passes at the tip (6 of 6).**

THE NET (R11, N2), each alone through `scripts/gate-tail.sh`. The base is a shared clone at 0cdedd206 (a `git archive` copy
of the base without `.git` failed git-reading tests spuriously and is not used for the names); the tip is d99333f54, every gate run again at 4bb175521 (the constraint's form) with the same results.

| gate | base | tip |
|---|---|---|
| `npm run typecheck:domain:strict` | 0 | 0 |
| `npm run typecheck:ratchet` | 0 (a first run was killed for memory, re-run alone) | 0 |
| `npx eslint` (the five changed files) | 0 | 0 |
| `npx vitest run tests/architecture` | 0 | 0 |
| the rounds' guards (bar5*, bar6*, bar7*) + mine | red: bar6MarksLaw8 "(a) THE ZERO over the census's 720" (17 instances, "r2r-town-45 · 8b.extract · Mine" first), and my guard's 2 by design | red: bar6MarksLaw8 (a), the same message; my guard 5 of 5 |
| `tests/lint`, by name | 73 failing | 73 failing, the same names; `ledgerCitationIntegrity.test.js` differs only by the checkout's path in its message (both lack a local `review-fixes-2026-07-08` branch) |
| the 18 tests that read `resourceGapLines` / `housesShortOfInput` / the mark helpers | 138 of 138 | 138 of 138 (3 of them re-keyed, section 4; red at the tip before the re-key); with my guard 144 of 144 |
| presumption-classes door `--check` | hits 1787 · banked 1938 · fresh 0 · stale 151 · ceiling 1938 | the same |
| presumed-things door `--check` | fresh 39 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 stale 0 banked 107 | the same: no fresh line of mine |

No file under `src/domain/facts/` and no import of one changed: no build was run.

N5: `lane/join-2026-11-14` is at ed1d43529, already in my base: the scratch merge at my tip reads "Already up to date": clean.
N6: `lane/checks-2026-11-17` publishes `line-ed1d43529` only; my base-vs-tip comparisons are my own, by name.

## 7. AFTER THE CHAIR'S DECISIONS (the chair's message of 20:12 UTC)

**(1) ITEM 1 BUILT: 11b.fish's services and 11b.fishTitle.** The grant: `src/generators/services/serviceRollMaterialization.js`
for the one-line pass-through and nothing else (`_fishUsedUp: usedGroundOf({ config }, 'fish') !== ''` in `mergedOpts`, its
import from `domain/facts/supplyStory.js`); in `institutionServices.js` the inland swap's condition reads
`(overrides._waterAccess === 'none' || overrides._fishUsedUp === true)`. Where the town's fish grounds are used up (the fish
bought in, or the house idle), the catch row is its pool's own "Preserved fish" with its own description ("Smoked, dried, and
salt-preserved fish for storage and inland trade."), under the same toggle and the same roll. No row renamed in the catalogue;
no new words. The code is the scratch trial's, line for line, and so are its births (525 of 525, 720 of 720 equal).

| rule | thirty (`--controls`) | the 150 | the 720 |
|---|---|---|---|
| 11b.fish | 13 → 9 (the services 4 → 0) | 3 → 1 | 69 → 40 (the services 29 → 0) |
| 11b.fishTitle | 7 → **0** | 3 → **0** | 51 → 4 |
| LAW 11, all (with G1) | 54 → 35 | 88 → 66 | 416 → 211 |

- **CONTROLS: C20700 and C36970 turn clear** (the runner exits 3 BY DESIGN, for those two). C32296 (11e.offer) stays FOUND
  (item 2, left). Every other control as it was; no EXPLAINED control is found.
- **What is left of 11b.fish is not this hunk's:** the rites income line (21), the scenes (6), the fishmonger (6), the
  fisher's landing's rows, and the card (below). **11b.fishTitle's 4 in the 720** are the fisher's landing's own "Fresh fish"
  (title and chip; r2r-village-36, r2s-religious_conversion-village-0; story bought-never): its pool has no alternative row
  (the catalogue, `src/data/institutionServices.js`, is not mine).
- **NO OTHER RULE RISES.** Auditor J's runner: only 11b and 11g move. The earlier rounds' runners over the 720, base vs tip:
  runC 6b-denied 5 → 1, runD 8a.input 23 → 17, runE, runF, runH (LAW 8 widened), runI identical. The mark-promise detector
  (`tests/helpers/markPromise.js`) in the 35 towns: 30 → 0.
- **A NOTE FOR THE READER (not a fault I found, the owner's table):** in four towns of the 720 (r2r-village-45,
  r2r-metropolis-45, r2s-politically_fractured-metropolis-3, r2s-recently_betrayed-metropolis-0: the idle story, the fishery
  spent and no fish import) the old row read "Short of fish. Fish sold daily from the morning catch."; the new row "Preserved
  fish" prints bare beside the card's "Short of fish.". The dependence table declares the market's "Preserved fish" an
  `INPUT` row ("the market's stores and its buyers are fed by what is brought in; its morning catch is not", SV6,
  `crisisDependence.js`), so the one reader marks it only where its input is missing. No detector of any seat counts it; I
  name it for the second check. (A swap on the bought story only is not open at the roll: the birth's pick of "bought" is
  made later, in `generateNarratives`.)

**THE DECLARED MOVE (R5), as measured at the tip:** field family **`availableServices` only**; **35 of the 720 towns**
(village 2, town 7, city 9, metropolis 16, thorp 1: the 29 counted, 5 whose row already carried "Short of fish.", and
r2s-plague_onset-thorp-2's fishing community) and **48 of the 525 reference configurations** (town 12, city 12, metropolis
24); in every one of the 83 records nothing but `availableServices` differs (each record re-born at base and tip, the services
swapped back: byte-identical). The thirty: 4 towns; the 150: 2 towns; the same field only. No draw moves. I re-take no
stored figure. **THE REFERENCE TESTS:** `tests/property/generatorGoldenMaster.test.js` "every config produces byte-identical
output to the golden master" is red at the base already (485 rows drift against the stored manifest) and red at the tip
(485: my 48 are among them); `tests/generators/pipelinePinnedMode.test.js` A1, A1 null change, A2, A3e, A4, A5, A6 are red at
base and tip by the same names (they re-execute against the same stored golden). Nothing red at the tip that is green at the
base.

**N3 (the pipeline's contract), at base and tip:** `pipelineContract.test.js`, `isolatedTrade.test.js`,
`generationForkCensus.test.js`, `publicProseEquality.test.jsx` green at both; `pipelinePinnedMode.test.js` (the 7 named above)
and the golden master red at both, the same names.

**THE GUARD GAINS THE ARM** (`tests/generators/bar8Rows.test.js`, 7 tests): bar0-town-calm-rand-28 (its sea fishery spent)
sells "Preserved fish" with its own description, and no "Fresh fish retail" and no morning catch; the negatives
bar0-village-calm-rand-32 (a live sea fishery: its fishers land their own catch), bar0-city-under_siege+famine-rand-27 (a live
river fishery) and bar0-metropolis-calm-rand-27 (no fishery on the land list) keep "Fresh fish retail". **Base 4 of 7 red
(the fish arm and G1's three), tip 7 of 7.**

**R8 RE-KEY:** `tests/domain/bar4MarkPromise.test.js` (c), C22221's row on r2s-plague_onset-thorp-2: "Fresh fish retail" →
"Preserved fish", the mark "Short of fish." kept (dated note). No town of the 720, the 150 or the thirty keeps "Fresh fish
retail" on a spent fishery at the tip (0), so the claim stays on its town by the row's new name.

**THE NET AGAIN, for the touched files, at the tip:** typecheck:domain:strict 0; typecheck:ratchet 0; eslint on the five
changed files 0; tests/architecture 0; the rounds' guards red only on bar6MarksLaw8 (a), the same message as at the base;
the 15 tests that read the fish rows or the services roll plus the 18 of section 6, with my guard: 314 of 314; `tests/lint`
by name: the same 73 as at the base (the ledger test's message differs only by the checkout's path); the two doors' last lines
unchanged (section 6).

**(2) LEFT, BY THE CHAIR'S WORD: each line and the declaration it would take** (no atom and no twin written by me):
- The fish market's card, `institutionDescVariants.js` lines 270 and 271 ("An open stall or small roofed market for selling
  the day's catch. …", "Where the day's catch is sold, from an open stall or a small covered market. …"; today
  `DESC_VARIANT_DECLARATIONS` gives each `needs: ['navigable']`, about line 2170): each takes `needs: ['navigable', 'trade at
  work: taken here']` (seat SCENES' key of the fish story); its `twinOf` where it is refused is a line that names no catch
  (a later seat's choice: the existing bought-fish twins, about lines 2037 and 2041, are of the town's tier); and the same for the town's "Covered stalls … selling the morning's catch or the week's salted barrels …" (about line 2040, today
  `needs: ['navigable', 'market']`) only if the reading wants the hedged line refused too (it is hedged, "whenever fish can be
  had": the auditor did not count it).
- The fair's three, `DESC_VARIANT_SIBLINGS` about lines 2088 to 2098 ("Regional merchants. Luxury goods available.", "Merchants
  from across the region, and luxuries to be had.", "A yearly draw for regional traders, with fine goods on offer."): each
  keeps `excludes: ['crisis: under_siege']` and takes `needs: ['brought in: luxury']` (seat DESKS-ECO's per-good value), with
  BR17's twin for the refusal. The fair's description is drawn in `assembleInstitutions` BEFORE the economy writes its
  imports, so the declaration must be read by the late re-read (`DESC_LATE_SIBLINGS`, resolved in
  `assembleSettlement.js :: readHouseDescsLate`) or by a draw after the economy, not by the draw's own `birthFactsOf`.
- The quarter's "The trade in silk, spice, and precious things." (about line 996; `city|Crafts|Luxury goods quarter` and its
  metropolis key, `PAIRS[240]`): `needs: ['brought in: spice']` (the need list names "spices" in all 7), in the late re-read
  too; its twin is a later seat's.

**(3) THE PEAT CUTTERS AND THE DETECTOR.**
- The three worked-out peat cutters (r2r-hamlet-49, r2r-hamlet-52, r2r-village-14) were CURED at 4bb175521 by the chair's own
  constraint of 18:30 (section 1: the mark's per-house call keeps the general line it reads "peat" off; the print strikes it).
  **No hunk is needed in `crisisStoppedRow.js`.** Were the mark's reader ever to stop reading its noun off the line, the hunk
  is at `housesShortOfInput` (about line 620): take the noun from the house's own stored gap row (`rowNoun(chain)`, the good
  the row names) before the `SHORT_LINE` match, so the `markReadsAlone` arm of `resourceGapLines` could go.
- **The detector:** `tests/helpers/pageLaws/law11Supply.mjs` line 342, the 11g arm, finds the story line by
  `l.startsWith(\`${cap} is failing:\`)`, which misses a plural house ("The tanners are failing: no hides lie near and none is
  brought in."): r2r-town-13 (the 720). It needs `(?:is|are) failing:` (and the same for "worked out"). The detectors' upkeep
  is another seat's: not touched.


## 8. THE GUARD'S SEED LOOPS COLLECT (the chair's message of 22:20 UTC; rule N7)

The whole check found `tests/lint/seedLoopTotality.walker.test.js` red for my guard in both its arms ("no NEW bare seed loop
anywhere in the test corpus", "the generation-facing quarantine is EXACT": five bare loops at lines 89, 105, 125, 134, 147).
My by-name comparison missed it: the first arm was already red at the base by name for another file
(`tests/pdf/seamPdfReadsTheTabs.test.jsx`). The five loops now take the repository's collecting form
(`collectSeedFailures` / `expectNoSeedFailures`). Every claim and every anchor is as it was; the G1 arm's doubled lines are
asserted town by town in place of one gathered list (the same claim). AT THE BASE 0cdedd206 (scratch clone): the guard fails
4 of 7, arm by arm, with true counts ("no general line beside the story line of the same house: 6 of 7 case(s) failed", "the
fish market's catch row reads its fishery: 1 of 4"). AT THE TIP: 7 of 7. THE WALKER AT THE TIP: the quarantine arm green; the
first arm red only for `tests/pdf/seamPdfReadsTheTabs.test.jsx: 2 bare seed loop(s) at line(s) 93, 120`, its message at the
base word for word (not mine; left).

## 9. AFTER THE SECOND READER (the chair's message of 22:44 UTC; ruling BR24)

**THE REGRESSION, CONFIRMED.** In the four idle towns (r2r-village-45, r2r-metropolis-45, r2s-politically_fractured-metropolis-3,
r2s-recently_betrayed-metropolis-0) the swap of section 7 put an unmarked "Preserved fish" row under a card that says "Short
of fish.", where the base printed the marked "Short of fish. Fish sold daily from the morning catch.". The page then offered
preserved fish in a town that has none. I had named it as a note when it was a false line my cure added.

**BR24 (the swap for the BOUGHT story only) CANNOT BE DONE CLEANLY IN MY FILES. ITEM 1 IS RETURNED TO THE BASE.** The story
"bought" is decided at the birth (`resourceGenerator.js :: importsBroughtAtBirth`, in `generateNarratives`), after the
services are rolled (`economyReconcilePass`). It reads the economy's imports, the house's own chains on the spent ground, the
catalogue's subsumption and the seed's pick. The roll sees the config and the seed only (`upkeep.seed`). I wrote the closest
reading the roll can make (`boughtAtBirth` over the config, the spent ground's shortage word and the seed) and measured it
against the stored story of every record (the auditor's `materialStory`): **14 of the 45 fish towns of the 720 disagree.** 8
are idle by the record but bought by the roll, among them r2s-recently_betrayed-metropolis-0, one of the four; 6 are bought by
the record (the economy's own import at town size) but not by the roll. A swap on it would put the unmarked row back in eight
idle towns and leave six bought towns uncured. So `institutionServices.js` and `serviceRollMaterialization.js` are back to the
base, byte for byte (`git diff 0cdedd206 -- src/generators` is empty): **NO DECLARED MOVE REMAINS** (0 of the 720, 0 of the
150, 0 of the 525). The bar4MarkPromise (c) re-key is undone: r2s-plague_onset-thorp-2 holds the IDLE story (the fishery spent,
no fish brought in), so by BR24 its row stays "Fresh fish retail" with "Short of fish.", as at the base. 11b.fish and
11b.fishTitle are at their base counts: thirty 13 / 7, the 150 3 / 3, the 720 69 / 51. **C20700 and C36970 are FOUND again**
(they were clear at 316cdb66c). The four idle towns' dumps are byte-equal to the base, apart from their G1 lines.

**THE HUNK THAT WOULD DO IT, where the story is known (not my files: named, not touched).** In `src/generators/steps/generateNarratives.js`,
right after `generateResourceAnalysis(…)` has written the birth's imports (or at the end of `resourceGenerator.js ::
importsBroughtAtBirth`'s caller): where `supplyStory.js :: usedGroundOf(record, 'fish')` names a spent fishery AND the stored
imports hold its shortage word (`importsHold(record, resourceShortageImport(ground))`: the bought story, as the page reads
it), replace in `ctx.availableServices` the Fish market's "Fresh fish retail" row with its pool's "Preserved fish" (and the
Fishmonger's "Fresh fish" with its "Salted fish"), keeping the row's place, its toggle and its roll (no draw). Declared move:
`availableServices` only; the towns would be about the 25 + 6 "bought-used" fish towns of the 720 (to be measured). The
`inlandAlternative` field of `src/data/institutionServices.js` already names each pair.

**THE READER'S SMALL POINTS.** The stale comment of `validationOnPage.js` (about line 581: "the worked-out ground is the line
after it") now says the general line keeps its form for the mark's own reading, and that the printed page has the worked-out
line in its place. The stale comment of `crisisStoppedRow.js:604` ("a house is short exactly where the Resources tab says
'No … reaches the …' of it": the tab no longer says so for a worked-out or failed house; the mark's own reading still does)
is not mine: named. The duplicate `if (id === 'peat_cutter') nouns.add('peat')` is gone: `rowGoodOf(venture.id || id, …)`
returns "peat" for a peat cutter. Proved: the print strikes the same 130 lines in the same 119 towns of the 720 (all four peat
cutters among them), and the printed gap lines are byte-equal to 316cdb66c's in all 720 and all 150. The mark's per-house call
is byte-equal to the base for 1,732 of 1,732 houses; the marks show 0 differences.

**THE COUNTS NOW (tip renders: the base's dumps, with the G1 towns rendered again at the tip).**

| rule | thirty (`--controls`) | the 150 | the 720 |
|---|---|---|---|
| G1 / 11g.gapLine | 8 → 0 | 17 → 0 | 129 → 0 |
| 11b.fish / 11b.fishTitle | 13 / 7, as at base | 3 / 3, as at base | 69 / 51, as at base |
| LAW 11, all | 54 → 46 | 88 → 71 | 416 → 287 |

No other rule moves; the thirty's CONTROLS block is byte-equal to the base's (the runner exits 0).

**THE GUARD.** The item 1 arm is removed with the cure it held. The five seed loops of section 8 still collect (four now: the
fish arm's loop went with it). **At the base 0cdedd206: 3 of 6 fail, arm by arm (G1's three); at the tip 6 of 6.**

**THE NET at this tip** (`src/` differs from the base in `validationOnPage.js` only): typecheck:domain:strict 0; typecheck:ratchet
0; eslint on the changed files 0; tests/architecture 0; the rounds' guards red only on bar6MarksLaw8 (a), as at the base; the 33
tests that read the gap lines, the marks, the fish rows or the services roll, with my guard: 313 of 313. `tests/lint` BY NAME:
72 failing at the base and at the tip, the same names (the ledger test's message differs only by the checkout's path). BY
MESSAGE for `seedLoopTotality.walker.test.js`: one arm red at both, "no NEW bare seed loop anywhere in the test corpus", with
the same message, base and tip, paths aside (only `tests/pdf/seamPdfReadsTheTabs.test.jsx`: 2 bare loops, lines 93 and 120,
not mine); "the generation-facing quarantine is EXACT" green at both. The two doors' last lines unchanged. N3: no file under
`src/generators/` differs from the base.


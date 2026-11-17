# BAR8-J-ROWS · HAND-BACK · the fish rows, the fair's offer, and the general gap line

Seat J-ROWS of the round BAR8 (BRIEF-BAR8; the seat's section as the chair's prompt gave it, 2026-11-17). Branch
`lane/bar8-j-rows-2026-11-17`. Auditor: seat J (`AUDIT/BAR8-AUDIT-J-HANDBACK.md`, runner `AUDIT/runJ.mjs`).

**THE BASE.** The checkout's source revision was **0cdedd206**, not 8bc3daee4: it is ONE commit past it, auditor J's own
"11g (the chair's note): the general gap line beside the story's own line, counted" (docs and `tests/helpers/pageLaws/law11Supply.mjs`
only; nothing under `src/`; `git diff 8bc3daee4 0cdedd206 -- src` is empty). I kept it: it holds the detector of my item 3.
Every "base" figure below is measured at 0cdedd206 (the same `src/` as 8bc3daee4). My base renders of the 150 and the 720
reproduce the auditor's published `RUN-J.150.txt` and `RUN-J.720.txt` line for line.

**WHAT I CURED: item 3 (G1) only, a reading at print. Items 1 and 2 are LEFT BY NAME (below): their one fact cannot reach
my files without a file or an atom the section does not give me.**

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

# D4C-1 — DAILY-C units (1) and (3): NO CONDITION STATED TWICE; NO "'s" ON A POWER'S NAME (the chair's E133)

Seat DAILY-4. Branch `lane/daily-4-2026-11-22-c1-wip` from the seat's tip (DAILY-B 4e7fa5667 + docs). Two commits (one
a unit), red first each, explicit pathspecs, never `--no-verify`, no push. Build laws: `B-BUILD-COMMON.md` beside this
file. THE MEASURE you stand on: `measures/D4C/` (branch `lane/daily-4-2026-11-22-c-measure-wip` at 78377130e:
`measure.d4c.mjs` reads every printed part back to its pool row; reuse its instrument for your arm and your report).

## (1) A REPEAT IS TWO PARTS THAT EACH STATE THE SAME CONDITION (E133 (1))
- A part that states a CONSEQUENCE (a child's warning, dawn in company, a grievance) or only NAMES a house or a power is
  NOT a repeat. Cured pairs (pages of 900): outsider_impressions / recent_changes on a threat (163, e.g. hxd-city-0's
  beasts), outsider_impressions / food_culture on food want (95).
- WHO YIELDS: THE OUTSIDER LINE (a visitor's digest of parts). A home slot keeps its subject (food culture its band;
  recent changes a threat's arrival). `outsider_impressions` drops the PART whose condition another PRINTED slot
  STATES, and takes its next part by its own existing ranking; NO SLOT IS EMPTIED by this rule (if the outsider line
  would have no part left, it keeps its first part: say on how many pages that happens).
- DECLARATION: each pool row (or each branch, where every row of the branch does the same: your choice, the smaller,
  say which) DECLARES what it does: `states: '<condition key>'` / consequence / names. The composer and the arm read
  the declaration, never the sentence's words. Condition keys as the measure's table 1 names them (`threat:<kind>`,
  `food:want`, `defence:want`, …).
- THE PUBLIC EIGHT ARE COMPOSED FIRST, among themselves; the owner-only `commoner_resentments_dm` then avoids what they
  stated and NEVER changes what they print (a reader's page and the owner's page print the same public eight).
- Where it lives: `src/domain/dailyLife.js` (the one derivation) — ONE pass after the slots are derived, or inside the
  outsider deriver given what the others state; no new draw, no draw count changed (COMMON-RULES 1: a keyed pick stays
  keyed). The tab and the PDF read the same derivation: nothing else changes.
- THE ARM (a new test, a name outside the mutation manifest's pattern: census|scan|baseline|ratchet|walker|killlist|
  parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin; 30 births, five a size,
  in the test; the 900 in your report from the measure's script): no page prints two parts that state one condition;
  the outsider line is never emptied; the public eight are equal on the owner's and the reader's derivation.

## (3) NO "'s" ON A POWER'S OR THE GOVERNMENT'S NAME (E133 (3))
- `outsiderImpressions.js` P0 becomes exactly: "Outsiders notice the mark of {power} on every door that matters."
- `{power's}` (and any filler that appends "'s" to a power's or the government's name) leaves every Daily Life pool.
- A WALKER under `tests/lint/` (this one IS a walker: its name may carry "walker"; if the mutation manifest then asks for
  a row, add it by its own door and name it) reads every Daily Life pool file under `src/data/dailyLife/` and fails on
  any template that puts "'s" after a power/government placeholder; red first on the base.

## Proof
- RED FIRST each unit (src unchanged + the new test): titles and counts. Then green.
- `tests/lint` WHOLE after the last change (COMMON-EIGHTH 11), through the mutex, to a log, never a pipe; failing
  titles by name (known: proseComposed A0b, proseCorpusBytes RAW, GZIP; the lighting census file count WILL move with
  your new test files: DO NOT re-take it — the seat does at the merge; name it).
- Every `tests/domain/dailyLife*.test.js`, `tests/components/dailyLife*`, `tests/pdf/dailyLifeChapterLines.test.jsx`,
  and every test naming `outsiderImpressions` or `deriveDailyLife`: one run, counts.
- Re-run the measure's script (or your copy) for table 1 and table 3 at your tip: the two pairs at 0; P0's doubles 0.
- eslint on touched files; `typecheck:ratchet`, `typecheck:domain:strict` ceilings unmoved. NO build.

## Report (at most 300 words)
Shas; red titles; each run's counts and failing titles; the declaration's shape (row or branch); pages where the
outsider line fell back to its first part; table 1's two pairs and table 3 before/after; any register moved and its door.

# DAILY-3 · B3 E2 DISPATCH — the public `commoner_resentments` and `food_culture`

YOUR BRIEF is `briefs/B3-THE-OTHER-FIVE-AND-DM.md`, unit **E2 ONLY**, read with this file's substitutions (DAILY-3's
word, 2026-11-22; this file governs where it differs). Paths are under `docs/chair/2026-11-20/content/daily/` unless rooted.

## Where you work
- Worktree `/home/user/wt-daily3-e2`, branch `lane/daily-3-2026-11-22-e2-wip`, cut from the lane `lane/daily-3-2026-11-22`
  after E1's merge (4c1a72892 or later: it carries E1, the owner-only slot, its gate and its test).
- Wherever a brief says DAILY-1 or DAILY-2, read DAILY-3. Trailer (B-BUILD-COMMON item 9):
  `Claude-Session: https://claude.ai/code/session_01ACmDYYZpEdm9Ag2ikDGTf9`. You commit; you do NOT push or merge.
- B3's read 3: B2's report is the commit message of 888227143; E1's is the commit message of 739adf5a3 and its
  dispatch `briefs/B3-E1-DAILY-3-DISPATCH.md` (the shape and route already built: copy it exactly).
- B-BUILD-COMMON item 2 does not bind (ruling 11: no needs module; the route is `filterDeclared` → the house lookup →
  `pickVariantMixed`, as `deriveChildWarnings` and `deriveCommonerResentmentsDm` do).

## E2's scope, exactly
1. `commoner_resentments` (PUBLIC) from its own pool `src/data/dailyLife/commonerResentments.js`, LINES-2 as ruled
   (ruling 14's changes of 18:47 — "legitimacy 4 needs critical/collapsed" among them; LINES-2b governs where it
   changes LINES-2; ruling 16's split need names). It is chosen by NO crime fact (E1's arm (b) must stay green) and
   names no veiled power. THE CALM RULE (ruling 8): a grievance only where the record holds one; a place whose record
   holds none takes the slot's calm pool if LINES-2 has one, else EMPTY, never invented.
2. `food_culture` from its own pool `src/data/dailyLife/foodCulture.js`, LINES-2 as ruled (ruling 14: surplus 8,
   adequate 11, critical 0 reworded). A line that names a food the record must hold (grain, meat, fish, game...) needs
   that food source; "the wealthier streets" needs a place larger than a hamlet; "markets close their stalls" needs a
   market (M1 table 2 and its HYPOTHETICAL food-words row).
3. Each pick `pickVariantMixed` keyed `<record.name>::dailyLife.<slot>::<branch>`; a house through
   `institutionSentenceNoun` with "the"; a slot with no true line is EMPTY. A wording whose need has NO atom (ruling 10's
   NOT GRANTED list: millSource, grainHeld, legitimacyGrave, the ruler-label tests, smuggling, tradeQuarter...) is NOT
   BUILT and is named in your report (as W12 and E0 were); never a need module of your own, never a new atom.
4. RED FIRST (a new test file per slot or one for both; basename outside the mutation-manifest pattern list): M1's false
   lines on M1's 900 births — "of any town" at a thorp; "the council's indifference" / "the council's favorite" with no
   ruling body; "market day" / "merchants who claim" with no market; "the gate fee" with no gate; "favorite tavern" with
   no tavern; "the wealthier streets" at a thorp or hamlet; "markets close their stalls" with no market. KEEP THE TEST
   FILE FAST: births of 5 a size (or a cached fixture already in `tests/`) in `tests/domain`; the 900 live in the measure.
5. THE SAMENESS DOOR: each new pool table on `tests/lint/samenessHideable.handPools.json` (E1's row form);
   `HAND_CEILING` rises by EXACTLY the rows you add, its comment extended; `samenessHideable.houseReadings.json`
   re-taken by the walker's own reading (as E1 did), the counts by table and by house in the commit message. These two
   json files and the ceiling line are on your file list.
6. Registers by their own doors; `tests/domain/dailyLife*.test.js` pins re-read, never loosened (a pin that guarded a
   meaning keeps that meaning; say each one in the commit message).
7. GREEN at your commit (B-BUILD-COMMON item 8), every heavy run through `sh scripts/gate-mutex.sh --run -- <cmd>`, to a
   file: your test file(s); `tests/domain/dailyLife*.test.js` (with E1's `dailyLifeOwnerSlot.test.js`); every test file
   under `tests/` that names `dailyLife` (grep); the sameness walker; `tests/lint/domainAnyCastBaseline*`; the
   presumption walkers; eslint on touched files; both typechecks. Not `tests/lint` whole (DAILY-3 runs it at the merge).
8. MEASURE after the commit (into `measures/B3/E2/`, E1's `measure.e1.mjs` shape over the BUILT code, the re-run line at
   the top of the out file): on the 900, for both slots: top sentence share by size against the bar (about 15%, to 20%
   as sampling), EMPTY by size, each branch's reach and its thinnest eligible count, false lines 0 by M1's tests and
   the declared needs, no hideable house, no "town" for a smaller place. A slot that cannot meet the bar without a new
   wording: STOP and report the figures (it goes to the chair, not shipped).

## Files you may touch (stop on anything else and say so)
`src/domain/dailyLife.js`; NEW `src/data/dailyLife/commonerResentments.js`, `src/data/dailyLife/foodCulture.js`; your NEW
test file(s); `tests/domain/dailyLife*.test.js`; `tests/lint/samenessHideable.handPools.json`,
`tests/lint/samenessHideable.houseReadings.json`, `tests/lint/samenessHideable.walker.test.js` (`HAND_CEILING` and its
comment only); the presumption registers by their doors; `measures/B3/E2/`. Nothing under `src/components/`, `src/pdf/`,
`supabase/`, `tests/security/`, `src/generators/`; no vocabulary or class-table row (a need with no atom: the line is
not built and is reported, one line).

Final message: B-BUILD-COMMON item 11, plus the houses each slot's wordings need (named vs needed-not-named, for the
security reader) and the lines not built with their reason.

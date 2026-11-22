# FORTUNE U7 LASTING: the second merit, a place that has lasted (built under the one law version, dark-safe)

Written 2026-11-22 by FORTUNE-6 on the chair's ruling of 04:51 UTC (verbatim in substance below), for FORTUNE-7 to
staff. Base: the lane tip FORTUNE-7 is seated on, after "FORTUNE <commit>". Read FIRST: `briefs/COMMON.md` (its laws
bind). Then `COMMON-RULES.txt` on `origin/lane/chair-2026-11-08` under `docs/chair/2026-11-20/seventh/prompts/` (rules
1 to 11 and 14(c) and (e) bind). Then `measures/bands/BANDS.md` (FORTUNE-4: state D, the plant this unit builds, and
its `plant.diff` description), and `src/domain/fortune/fortuneMerits.js` and `fortuneLaw.js` whole.

## THE OWNER AND THE RULING

THE OWNER, 2026-11-22, asked "Fortune's second merit: build it, or leave it for after the deploy", answered:
"I leave all decisions to you'd but got number 4 build it". The second merit is BUILT BEFORE THE DEPLOY.

THE CHAIR, 04:51 UTC:
- ACCEPTED AS MEASURED (BANDS.md, state D).
- THE MERIT: `history.age` at or above the p90 of the place's own size, through the same `meritsOf` gates and points.
  Two merits count as two reasons at the Endorsed guard, as D measured.
- ONE LAW VERSION holds both merits. No default flips (`NEW_SETTLEMENT_FORTUNE_LAW_VERSION` is the chair's unit at
  the close).
- ONE DRAFT TABLE for the owner's signing: the six ages.
- THE VEIL: `history.age` on every shared projection and under the widest veil is the unit's red-first, EXECUTED,
  before anything else is built.

## THE ORDER OF WORK (red first at each step)

1. THE VEIL PROOF, before any merit code. Write a test that births places at every size under law 2 and proves that
   `history.age` and `history.founding.age` are served unchanged on:
   - `toPublicSafe(record)` (`src/domain/display/publicSafe.js`), in its default and full forms;
   - the gallery projection under the WIDEST veil (`src/domain/display/galleryVeil.js`): every hideable grouping
     closed and every veiled card set.
   BANDS.md executed only the default share on one record; the widest veil is PLAUSIBLE until this test exists.
   - If any projection withholds or alters `history.age`: STOP and report the row and the projection. The merit is
     then not "served on every shared read" (the seventh chair's ruling of 19:33/19:38 UTC 2026-11-20) and is not
     built.
2. THE MERIT. Add `'lasting'` to `fortuneMerits.js :: MERIT_NAMES`. `meritsOf` counts it where
   `history.age >= FORTUNE_LAW_TUNING.standing.lastingAgeBySize[size]`:
   - read the size as the record carries it, the same reading BANDS.md's plant used (`settlement.tier ??
     config.settType`): state it, never restate a ladder;
   - keep the same gates (base score at Tolerated or better, read from `LEGITIMACY_CUTS.tolerated`; no ruler-trouble
     tension);
   - use the same points (`meritPoints`), and the same `meritedLegitimacy` (two merits are two reasons at the
     Endorsed guard, as built).
   - NO NEW DRAW and no draw count changed: the merit is computed, never rolled.
3. THE TABLE. `FORTUNE_LAW_TUNING.standing.lastingAgeBySize`, a frozen map of the six sizes. It is a DRAFT row, to be
   registered in `tests/lint/.tuning-register.json` as DRAFT (status draft, signedAt null) by the register's door, and
   LISTED under "FOR THE OWNER'S SIGNING":
   - the values are the p90s BANDS.md measured (nearest rank, `ceil(0.9·150) − 1`, state B's own 150 births a size):
     thorp 269, hamlet 108, village 225, town 276, city 441, metropolis 731;
   - beside them, IN PLAIN WORDS (the chair's order): "A hamlet's lasting age (108) is below a thorp's (269) because
     the age table draws a hamlet's age from 30 to 120 years and a thorp's from 15 to 300
     (`src/data/historyData.js :: AGE_BY_TIER`). That is a property of the age's own generator, told to the chair, not
     cured in this unit."
4. THE DARK CONTROL (COMMON-RULES 14(c)). A differential in one tree, through `tests/helpers/fortuneLegacyConfig.js ::
   legacyConfig` for the absent arm:
   - law 1 (and a legacy config) births are byte-identical with and without the unit;
   - law 2 places with no lasting merit are byte-identical to the base tree's.
   - Run the two-tree confinement (`trees.mjs`, as U5b ran it) and report its counts. The dark world must be identical,
     and it moves only where law 2 is forced.
5. THE CAPTURE-RUNG EQUALITY (the seventh chair's 19:33 ruling, (5)): a born place with a capture rung and one
   without, equal in every served band and in `history.age`, carry the same merits and the same score.
6. THE MEASURE (no new instrument): re-run `measures/bands/lit-run.mjs` and `lit-report.mjs` on the unit's tip, three
   states: A dark; C as built before this unit; D as built. Expect D to equal BANDS.md's state D tables byte for byte,
   since the plant is what is built. Say every row that differs, with its cause.

## REGISTERS AND DOORS

These will red and are re-taken by their own doors, each named, each its own commit:
- the observed-shape register, IF `history.age` or `lasting` is a new read. Check `merits on breakdown`'s explained
  writer row: it may already cover it. If a NEW schema rung is needed, STOP: rung 46 is this lane's, and a rung 47
  needs the chair;
- writer-reach, IF reach moves. Under rule 9 a moved identity comes to the chair;
- the tuning inventory and the tuning register (the DRAFT row);
- the lighting census;
- the wiring census.

FIRST PAINT: `fortuneMerits.js` sits in the lazy `fortune-merits` chunk (U5c). Build at base and tip, with the four
figures. ANY rise: STOP.

## FILES

`src/domain/fortune/fortuneMerits.js`, `src/domain/fortune/fortuneLaw.js` (the one table row), the NEW veil test, NEW or
extended `tests/generators/fortuneLawMerits.test.js` arms, and registers by their doors. NEVER `publicSafe.js`,
`galleryVeil.js`, `tests/security/`, `package.json`, the vocabulary or the class tables (COMMON-RULES 6: a row needed
is asked of the chair).

## GIT AND REPORT

Branch `lane/fortune-7-<date>-u7`. One commit for the veil proof, one for the merit and its tests, one per register.
Each message ends with COMMON.md's co-author line. Do not push. Every run goes through
`sh scripts/gate-mutex.sh --run -- …` to a log.

GREEN at your tip:
- your tests;
- every test file under `tests/` that names a changed module;
- `tests/lint` whole;
- typecheck:ratchet, typecheck:domain:strict, lint.

REPORT in at most 300 words: the commits; the veil proof's result; the red and green counts; the D table against
BANDS.md; the confinement; the four build figures; the registers re-taken; the DRAFT row; EXECUTED vs PLAUSIBLE.

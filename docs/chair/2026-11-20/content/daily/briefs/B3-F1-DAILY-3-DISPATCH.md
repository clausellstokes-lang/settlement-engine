# DAILY-3 · B3 F1 DISPATCH — the chair's rulings on E1 and E2, built (pool lines and E1's test)

A small unit of POOL LINES and ONE test cut, ruled by the chair (06:17 UTC and E56 at 08:20 UTC, 2026-11-22; recorded in
`DAILY-3-HANDBACK.md` § 2 items 4 and 5). Paths are under `docs/chair/2026-11-20/content/daily/` unless rooted. Read whole,
once: this file; `briefs/B-BUILD-COMMON.md` (items 6 to 11 bind; item 2 does not); the commit messages of 739adf5a3 (E1) and
7f4fbd51f (E2); the three pool files and the two test files you change. Nothing wider.

## Where you work
- Worktree `/home/user/wt-daily3-f1`, branch `lane/daily-3-2026-11-22-f1-wip`, cut from the lane (E1 and E2 merged).
- Trailer: `Claude-Session: https://claude.ai/code/session_01ACmDYYZpEdm9Ag2ikDGTf9`. You commit; you do NOT push or merge.
- Another builder (E3) works beside you on `src/domain/dailyLife.js` and new data files: you touch NEITHER.

## The lines, VERBATIM (the chair's words; ids as LINES-2 numbers them)
1. `src/data/dailyLife/commonerResentmentsDm.js` crime70, id `K70_4`: "Ordinary folk resent that the law here bends for
   anyone who can pay." needs `[]` (the chair's rewording of LINES-2 § 2b #4; remove the file header's NOT BUILT note for it).
2. `src/data/dailyLife/foodCulture.js` adequate, id `A4`: "Food is steady here, if not generous, and every household has
   enough with little left over." needs `[]`.
3. `foodCulture.js` adequate, id `A12`: "The grain is bought in, not grown here, so bread is never wasted." needs
   `['grain imported']`.
4. `foodCulture.js` strained, id `T9`: "Bread is eaten carefully, and not even the heel of the loaf is wasted." needs `['grain']`.
5. `foodCulture.js` critical, id `C5`: "The stew is thin and the bread is thinner." needs `['grain']`.
6. `src/data/dailyLife/commonerResentments.js` food, id `F0`: "Commoners resent rising bread prices and merchants who
   claim they cannot help it." needs `['grain', 'market']` (M1's false line: "merchants who claim" with no market).
Take the texts of 4, 5, 6 from the files' own NOT BUILT notes (they are the ruled LINES-2 texts) and check them against
the above; remove those notes for every line you build. A walker that strikes one of these lines (a class reading, the
style law): STOP and report it, one line; never an exemption, never a reworded text.

## E1's test, cut (the chair's ruling 3 of 06:17)
`tests/domain/dailyLifeOwnerSlot.test.js`: births 5 a size (30, seeds `hxd-<size>-0..4`, every size kept); every arm
kept; the header says the gate was proved on the 900 by the measure (`measures/B3/E1/measure.e1.mjs`) with its result
"900 of 900", and you RE-RUN that measure once on the built code to confirm it, its out file re-written.

## Red, green, measure
- RED FIRST: a test (in `tests/domain/dailyLifeFoodResentments.test.js`, or `dailyLifeOwnerSlot.test.js` for #1) that
  fails before the lines exist: each id present in its pool with its needs; at criminal opportunity 100 the owner's
  crime70 pick can be K70_4 (a seed that takes it), and a place without grain never prints T9, C5 or F0.
- GREEN: the two test files; `tests/domain/dailyLife*.test.js`; every test under `tests/` naming `dailyLife` (grep);
  `tests/lint` WHOLE (the chair's rule after any test-file change); eslint; both typechecks; through
  `sh scripts/gate-mutex.sh --run -- <cmd>` to files. Known reds not yours: `proseComposed` A0b, `proseCorpusBytes` RAW
  and GZIP, `aiGroundingBundle.freshness` x2, `editWorldFactResources` A2/A6, `worldFactRederive` A7. Registers and the
  sameness house readings by their own doors (E2's way); the hand list gains no row (no new table).
- MEASURE once, into `measures/B3/F1/` (E2's `measure.e2.mjs` shape over the built code; re-run line at the top): on the
  900, for `food_culture`, `commoner_resentments` and the owner's `commoner_resentments_dm`: top sentence % by size, EMPTY
  by size, false lines 0, and FOR EACH OF T9, C5, F0, A12: the share of places of each size printing it and the count of
  those whose record holds no grain (must be 0; for F0 also no market: 0; for A12 no grain import: 0).

## Files you may touch
`src/data/dailyLife/commonerResentmentsDm.js`, `foodCulture.js`, `commonerResentments.js`;
`tests/domain/dailyLifeOwnerSlot.test.js`, `tests/domain/dailyLifeFoodResentments.test.js`; the presumption registers
and `tests/lint/samenessHideable.houseReadings.json` by their doors; `measures/B3/F1/`, `measures/B3/E1/e1.out.txt`.

Final message: at most 200 words plus one table: commit shas; red and green counts with `tests/lint` whole's failing
titles by name; the table of T9, C5, F0, A12 (share by size, false count); the three slots' top sentence % by size.

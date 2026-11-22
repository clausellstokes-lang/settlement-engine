# The join of the round BAR5: three files the chair resolved beforehand

The chair rehearsed the join of the round's NINE branches on a scratch tree at the joined line's 600b7683a (2026-11-16,
in the order marks, safety, band, powers, food, chains, world, magic, things) and met exactly FIVE collisions, in three
files. Each resolution is given here AS A WHOLE FILE; the merge seat takes it whole at the conflict and checks its blob
hash (`git hash-object`). Every one is a UNION: both sides stand.

1. `law5-inventory.united.mjs` (blob fbd07f7150ca4354cfd47da847fa686038b87682) is the resolved
   `docs/chair/2026-11-16/bar5/AUDIT/law5-inventory.mjs` (the audit's static inventory of crisis-sensitive lines). Three
   seats each added a way for a line to leave the list by a reviewed reason, at one place and in three forms: BAR5-MARKS
   (the row words of each crisis and `EXCLUDED_LINES`), BAR5-SAFETY (`REVIEWED`), BAR5-WORLD (a table a seat under
   `tables/B.law5.exclusions.<SEAT>.json`). ALL THREE STAND, one after another: MARKS's version whole, then SAFETY's
   block, then WORLD's block, after the one line all three anchor on. It collides at SAFETY's landing (after MARKS) and
   again at WORLD's: the same file both times. A NEW reviewed exclusion is written in the last form only (ruling EX1).
2. `src/domain/facts/factVocabulary.js` collides twice:
   - at BAR5-MAGIC's landing: it inserts its `'magic reliance'` entry directly above the `food:` entry that BAR5-FOOD
     rewrote under the chair's ruling FD1: MAGIC's comment and entry, then FOOD's comment and FOOD's `food:` line:
     `factVocabulary.after-magic.js` (blob 1c5e4709ec815f2b9679a55792918e3940a246de);
   - at BAR5-THINGS's landing: three seats each added a property to the same three lines of one type note (POWERS's
     `seatOutranked`, MAGIC's `magicRelianceShown`, THINGS's `legalHouse` and `appointedPost`): all four stand:
     `factVocabulary.after-things.js` (blob 0274cedfe796aa859c4430b5e745860a94e53ba9).
3. `tests/helpers/calmFactsDouble.js` at BAR5-THINGS's landing: BAR5-SAFETY's `lawBand: 'adequate'` and BAR5-THINGS's
   `legalHouse` and `appointedPost` were added at one place: both blocks stand, SAFETY's first:
   `calmFactsDouble.after-things.js` (blob 297d2be5d0f17c1927f2c412c1a1cc4d4387bfb0).

EACH IS THE WHOLE FILE AS IT STOOD IN THE REHEARSAL AFTER THAT LANDING: take it only at that landing, in the order above.

AT THE REHEARSAL TREE OF NINE: `git rev-parse HEAD:src` read 554717e1989c3cc9c4a5876528097b3a9faed9ba and
`git rev-parse HEAD:tests` read b3e1bfb851c26ae912b532b5eb9187d5983ed453; `typecheck:ratchet` and
`typecheck:domain:strict` green; eslint on the changed sources 0 errors; the round's guards and the tests its seats
re-keyed: 15 files, 89 tests green (`tests/domain/bar5*.test.js`, `tests/generators/bar5*.test.js`,
`tests/domain/facts/seatOutranked.test.js`, `tests/data/w2FixDataArrival.test.js`,
`tests/domain/facts/census2fColour.test.js`, `tests/domain/facts/textOf.test.js`,
`tests/generators/bar4ScenePresumption.test.js`, `tests/generators/stressSecretDeclared.test.js`); the united inventory
tool: 255 crisis-sensitive literals, 23 not declared for a crisis (the audit read 158 of 244), no stale exclusion.

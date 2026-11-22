# DAILY-2 · B2c — THE LINT CURE (three `tests/lint` walkers red on this lane's own files; found by rule 8's touched-directories run)

Worktree `/home/user/wt-daily2-b2c`, branch `lane/daily-2-2026-11-20-b2c`, cut from the lane's tip (the line 062504aa8
merged in). Read `briefs/B-BUILD-COMMON.md` items 7 to 11 (trailer: `Claude-Session:
https://claude.ai/code/session_019yED1NEpr7XE73nDAxNLv2`). No wording, pool, need or slot behaviour changes: tests and
the deriver's READS only.

THE REDS (the run at 79b8e01af; each walker's own message names the cure it accepts — read the walker file whole first):
1. `tests/lint/negativeAssertionAnchor.walker.test.js` "no NEW un-anchored negative assertion": 14 bare
   `not.toContain` / `not.toMatch` in `tests/domain/dailyLifeChild.test.js` (63, 72, 80, 97), `dailyLifeDawn.test.js`
   (59, 60, 65, 83), `dailyLifeGathering.test.js` (49, 50, 55, 56, 77, 95). Anchor each as the walker asks (a positive
   assertion on the same collection beside it), keeping what it guards.
2. `tests/lint/seedLoopTotality.walker.test.js` "no NEW bare seed loop": `dailyLifeChild.test.js` (78, 101),
   `dailyLifeDawn.test.js` (71, 87, 93), `dailyLifeGathering.test.js` (53, 65). Collect failures over every seed and
   assert once, as the walker asks.
3. `tests/lint/observedShapeReaders.walker.test.js` (violations 1; reads 2214 → 2216, identities 1552 → 1554): two
   new raw shape reads, almost surely `src/domain/dailyLife.js :: deriveChildWarnings` / `tensionTypes` reading
   `s.conflicts` and `history.currentTensions` directly. Cure by reading them through their existing fact homes
   (`src/domain/facts/`: find the getter `facts/uprising.js` and its siblings use) so the inventory returns to its
   frozen figures; NEVER `--write` to bank a growth. If no home answers one, STOP and say so.
GREEN at your commit: the three walkers; `tests/domain/dailyLife*.test.js`; `tests/lint/domainAnyCastBaseline*`;
`presumedThings` and `presumptionClasses` walkers; eslint on touched files; both typechecks. One commit per walker
(three), each red-first by the walker's own failing title. You do NOT push or merge. Final message: item 11.

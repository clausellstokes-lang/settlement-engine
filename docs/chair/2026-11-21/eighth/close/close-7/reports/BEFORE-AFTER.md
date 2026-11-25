# BEFORE-AFTER (CLOSE-7): the one before-and-after on C and V. A measure; no cure.

Brief: `close-7/briefs/BEFORE-AFTER.md`. Status: **IN PROGRESS** (partial results are written after every run).

Trees (detached worktrees, node_modules linked from the main checkout):
- LINE `/home/user/wt/ba-line` at ddca5c7894b8d8011a1426387a4ce03737dd79fa (point 116, before any cure);
- CURES `/home/user/wt/ba-cures` at 0ec96f13d8f9eb3cb229aea37e43d947049fae8f (A1, A2, the mirror, point 116, GUARD);
- BATCH `/home/user/wt/ba-batch` at 206e6c3ae2ab8158f4cdd7fa25e6f71d824e9543 (plus B1(i), B1(ii), C1, P3source).

Plans: `before-after/plans/plan-C.json` (`read24/make-plan.mjs`), `before-after/plans/plan-V.json`
(`read24/make-visitor-plan.mjs` over `origin/lane/chair-2026-11-08:docs/chair/2026-11-24/tenth/read/plan-lit.json`,
copied to `before-after/plans/plan-lit.json`). 900 births each. Each battery run was split by size (thorp-village,
town-metropolis) to stay under 20 minutes; logs with `exit=` in `before-after/logs/`.

Labels: CONFIRMED = counted by a run in this unit; PLAUSIBLE = read from a report, not re-run.

## The d447ee31e figures re-stated (PLAUSIBLE, read from the units' reports)

- A1 (`reports/A1.md`): NOHEAL C 13 / V 26.
- A2 (`reports/A2.md`): FOODSEC C 197 / V 168; empty resentment slots C 438 / V 322; the table (printed band x
  production band; secure|critical C 38 / V 32, secure|strained C 159 / V 136, secure|surplus C 212 / V 169,
  secure|adequate C 429 / V 320, and the rest); the Daily Life slot's top share (`DailyLifeTab.0.0.3.*`) at d447ee31e:
  C .133/.140/.147/.153/.133/.127, V .120/.147/.113/.100/.100/.100 (thorp..metropolis).
- MIRROR (`reports/MIRROR.md`): FEDFARE C 4 / V 3; K1 prints on C dp-hamlet-117 and V dp-hamlet-139; K2 prints nowhere.

## Runs

(filled as runs complete)
- LINE, C, town-metropolis (450 births): exit=0, 710 s. CONFIRMED (23 rows on LINE; no NOHEAL, FOODSEC, FEDFARE, B1land,
  B1furrow rows there): P5b 1, P16three 315, P17 450, P18 419, every other row 0. Renders in the scratchpad, `runs/line-C-large`.

## Status at the stop (the allowance)

STOPPED by a hand-back order before the measure finished. A detached queue (`scratchpad/queue.sh`) was still running at
the stop: record hashes (GUARD) and food-of on all three trees, then the eleven remaining battery halves, each through the
gate mutex to `before-after/logs/` with `exit=`. Nothing below this line is measured yet. The three `ba-*` worktrees are
still in place (the queue uses them); remove them when it ends.

Method checked on 12 births (CONFIRMED): `--from=<LINE render> --tree=<CURES>` applies the later tree's rows (26) to the
LINE pages without rewriting them, so NOHEAL, FOODSEC and FEDFARE can be counted on LINE; on those 12, LINE and CURES born
records differ in `generatorVersion` only ("0.9.0" -> "0.10.0"), 12 of 12. C1 has no battery row; its carriers are to be
counted as V births whose record moves CURES -> BATCH.

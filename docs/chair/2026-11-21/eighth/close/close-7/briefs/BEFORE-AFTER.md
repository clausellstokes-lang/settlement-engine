# BEFORE-AFTER (CLOSE-7): THE ONE BEFORE-AND-AFTER ON C AND V (the chair's efficiency order (4); LINE-116 (1)). A MEASURE; NO CURE.

READ ONLY these, and no wider:
- `close-7/read25/page-battery.mjs` lines 1-30 (its usage: `--plan`, `--out`, `--tree`, `--workers`, `--diff`).
- `close-7/read24/make-plan.mjs` (C) and `close-7/read24/make-visitor-plan.mjs` (V): run each once to make the two plans.
- `close-7/a2/table.mjs`, `close-7/a2/slotshare.mjs`, `close-7/a2/resent.mjs` (A2's table, the grievance slot share, empty
  resentment slots) and `close-7/mirror/food-of.mjs` (the mirror's cell): each one's header only, to learn how to run it.
- The figures to re-state, as their units reported them at d447ee31e:
  - `close-7/reports/A1.md`: NOHEAL C 13 / V 26.
  - `close-7/reports/A2.md`: FOODSEC C 197 / V 168; the table; empty slots C 438 / V 322.
  - `close-7/reports/MIRROR.md`: FEDFARE C 4 / V 3.
  Grep those reports for the figure; do not read them whole.

THE TEN LINES THAT BIND YOU:
- No file under src/, tests/ or scripts/ changes in any tree; no commit anywhere. Your output files go under
  `close-7/before-after/` and `close-7/reports/BEFORE-AFTER.md` in the main checkout; CLOSE-7 commits and pushes them.
- Heavy runs go through the gate mutex (`GATE_MUTEX_MAX_POLLS=2000 sh scripts/gate-mutex.sh --run -- <cmd>`), to a log with
  `exit=` appended. No single run over 20 minutes: split by size if needed.
- Never read a gate through a pipe.
- Label every number CONFIRMED (run) or PLAUSIBLE (read).
- Write partial results to the report after every run.
- If your permission check refuses an action, stop and say the command and the reason.
- A stop may come without notice (the allowance).

THREE TREES. Make each as a detached worktree with node_modules linked from /home/user/settlement-engine; remove them at the end.
- `/home/user/wt/ba-line` at ddca5c7894b8d8011a1426387a4ce03737dd79fa: the line, point 116, before any cure.
- `/home/user/wt/ba-cures` at 0ec96f13d: A1, A2, the mirror, point 116 and GUARD.
- `/home/user/wt/ba-batch` at the batch tip CLOSE-7 names in its message: plus B1(i), B1(ii), C1 and P3source.

ON EACH TREE, for C and V: run the page battery with `--views`, and record the hashes.

REPORT, by corpus:
- A1, A2 and the mirror, LINE -> CURES, each beside its d447ee31e figure, marked SAME or MOVED with its cause:
  - NOHEAL;
  - FOODSEC;
  - A2's table (cell, before -> after);
  - empty resentment slots;
  - the grievance slot's top share by size;
  - FEDFARE, and where K1 and K2 print.
- GUARD, LINE -> CURES: born records differ only in `generatorVersion` (count the records that differ in anything else; expected 0).
- The batch, CURES -> BATCH:
  - born records moved, by corpus;
  - pages moved;
  - B1land, the P3source row and each batch item's own row at 0;
  - V's C1 carriers (expected 39) and C (expected 0).
- EVERY OTHER battery row: its count on LINE, CURES and BATCH. Any row that moves, with its cause read from `--diff`.

FINAL: `close-7/reports/BEFORE-AFTER.md`, plus a message of AT MOST 200 WORDS: the re-stated figures, one line per unit; the rows
that moved; the born-record counts.

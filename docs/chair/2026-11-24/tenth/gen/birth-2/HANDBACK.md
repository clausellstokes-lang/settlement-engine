# BIRTH-2 — HAND-BACK (the tenth chair's seat; kept current at every push)

## 0. WHERE THE SEAT STANDS (written 09:06 UTC 2026-11-25)
- Prompt: `docs/chair/2026-11-24/tenth/prompts/START-BIRTH-2.txt` + `START-GEN-COMMON.txt` on `lane/chair-2026-11-08`.
- Base: `origin/lane/close-7-2026-11-24-cures` at 0ec96f13d8 (point 116, troubles lit, guard merged; engine 0.10.0).
- Branch: `lane/birth-2-2026-11-25` (this file, probes). Units go up as `lane/birth-2-2026-11-25-<unit>-wip`, cut at the base.
- First message to the chair sent ~09:00 UTC.
- RULINGS (chair branch `docs/chair/2026-11-24/tenth/gen/RULING-G.md`): G1 (09:10) A5 "BESIDE" on seven terms; G2 (09:20)
  D4: the chip "holds power" from derivePowerStrata (same audience), and the two birth-time readers cured (expect C 0, V 2).
- SURPRISE SENT (09:2x): SummaryTab.jsx is mounted nowhere (no src importer; tests only). Asked: skip the chip? keep the sort?
  AWAITING the chair. Chip NOT built.
- UNIT A5 as of 09:31 UTC: BUILT on `lane/birth-2-2026-11-25-a5-wip` (worktree /home/user/wt/a5) at 9cbf5cf16. Field `dmStanding`.
  Writers set it: annotateFactionStanding, rivalDescOf (''), settleStandingToRoster, settleStandingToLegitimacy,
  settleSeatHolderToRecord (2 writes); rename via rewriteProse + a path row. Red 10/15 at base, green 15/15.
  NAMED, NOT BUILT: `rulingPower.js` transfer (play) replaces a whole desc with no tail; the copied field goes stale, so the
  veil fails closed there. Proof census `probes/a5proof.census.jsx` (12 V births: all clean).
- UNIT D4 as of 09:31 UTC: `-d4-wip` at 1c1ec43f4 + UNCOMMITTED G2 edit (narrativeGenerator.js: two topFaction reads through the
  leaf; imports moved to file ends in SummaryTab, aiLayer, narrativeGenerator so no cited line moves). Re-birth of C and V on
  d4 running (expect records moved C 0, V 2).
- QUEUE (scratchpad queue.sh, progress in queue.progress): d4 summary C/V; a5 proof base/a5 C/V; page battery base/d4/a5 C/V
  (CLOSE-7's page-battery.mjs copied to /home/user/c7tools/read25). THEN OWED for each unit: tests/lint whole, tests/copy
  whole, named tests, a build; push each -wip; hand in to CLOSE-7 and the chair.
- Corpora: C = `close-7/read24/make-plan.mjs`, V = `make-visitor-plan.mjs` over the chair's `read/plan-lit.json`.
- Probes run as: vitest config rooted at the checkout, include the probe file (see the probe headers).

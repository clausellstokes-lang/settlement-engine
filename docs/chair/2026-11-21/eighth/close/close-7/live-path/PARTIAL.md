# LIVE-PATH: PARTIAL (written as the work goes; the builder may stop without notice)

- 2026-11-25: trees made, DETACHED: `/home/user/wt/master` at db832c892 (origin/master names db832c892); `/home/user/wt/line` at
  the line's CURRENT tip 0559a8405800c05929de584216708b58de2c3ae9 (point 115; CLOSE-7's change to the brief: NOT f9531eb3a).
  node_modules and .husky/_ linked; lockfiles equal to the main checkout's.
- READ: CURES-COMMON, LIVE-PATH, R24h, LINE-115, MASTER-REDERIVE brief and report, its harness and summarize.mjs.
- READ (line tip): `src/store/editSlice.js` :: applyRosterDecreesAtTick, storedConfigFor, carryForward, memberRecordOf,
  appliedNewcomerIdOf, mintedRowsOf, stageAddDecreeIntent, mintNewcomerId; `settlementRederiveAction.js` :: regenerateWithLayer,
  loadEngine; `domain/edit/dmLayer.js` :: applyEdit, mintRow, pinsFrom, rederive.
- editSlice.js is BYTE-EQUAL on master and the line (diff empty, CONFIRMED). settlementRederiveAction.js differs only by the
  engine seam (localPipeline door; remote flag, closed here). dmLayer.js equal.
- No run yet.
- RUN 1 (02:39, exit=0, CONFIRMED): line tip 0559a8405, 180 saves, harness `live-path/live-path.census.jsx` → `live-path/line-rows.jsonl`.
- RUN 2 (control, master db832c892, same 180 saves and decree) → `live-path/control-rows.jsonl` (exit in the log).
- Smoke (4 places each tree) showed: the line keeps every saved person by name (npcs pinned by the newcomer's closure) but re-deals
  houses/powers/history around them; master's control gains the newcomer, and on dp-thorp-0 also a power (Creditor's Representative).
- RUNS 3-4 (02:4x, exit=0 both, CONFIRMED): line and control re-run after the orphan fix (secondaryAffiliation is a category, not a
  faction; baseline now the LOADED record). Tables: `live-path/line-table.md`, `live-path/control-table.md`.
- RUNS 5-6 (final, exit=0 both, CONFIRMED): the orphan key now reads the line's v2 card (memberships[].power, institution {kind,key},
  allegiance) as well as master's v1. Line: 132 people orphaned in 41 places; control 0. REPORT written: `reports/LIVE-PATH.md`.
- PHASE 1 DONE. Trees KEPT (CLOSE-7's word): /home/user/wt/master (db832c892), /home/user/wt/line (0559a8405), both clean.

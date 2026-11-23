# R4I-SQL-2 — hand-back (VEIL-42, chain B; brief `briefs/R4I-SQL-2-BRIEF.md` at aba6be799; the measure `C-GAP.md` at c08f514d1)

Worktree `/home/user/wt/sql`, local branch `lane/veil-42-2026-11-23-sql2-wip`, cut at 392aff978. Never pushed (the seat pushes).
Every database local (`PGHOST=/var/tmp/rv7`). Logs: `out/v42/sql2/logs/`. The measure's instrument (`meas.probe.jsx`,
`meas-an.mjs`, `meas.sh`) COPIED VERBATIM from c08f514d1 into `out/v42/sql2/` (same depth, so its relative paths resolve
to this tree); its databases are named by `meas.sh` itself (`meas_<outdir>_<shard>`, outdirs `sql2*`), not re-written.

## STATE: item 1 (red first) RUNNING, waiting on the gate mutex (held by R4I-TONIGHT-2's holdD from before 12:12 UTC)

| item | state |
|---|---|
| 1 (a) handreach tooth (ii) red at 392aff978 | queued 12:12 UTC: `logs/1a-handreach-red.log` |
| 1 (b) the measure's C on the control towns, red | queued 12:14 UTC: `logs/1b-ctrl-red.log` (template `sql2_redtpl` = v27x211 + 212 at 392aff978, `logs/1b-template-red.txt`) |
| 2 the cure | drafted outside the tree (not applied until both reds have read the tree) |
| 3..6 | not started |

## THE CURE AS DRAFTED (one function of 212: `_gallery_veil_rekey`'s body; no signature moves, so the rollback does not move)
- 212 :: `_gallery_veil_rekey`: one path list `card` (`id`, `goal.intent.short.target.id`, `goal.intent.long.target.id`,
  `allegiance.handler`) used by the npcs[] pass and by the roster-copy pass (both lists). Header: (36b) and one line beside R4-IDS's.
- twin `galleryVeilPeople.js :: rekeyPeople`: `CARD_PATHS`, the same list, both passes.
- registry `people.rekey`: path widened by `(powerStructure\.)?factions\[\]\.members\[\]\.(goal\.intent\.(short|long)\.target\.id|allegiance\.handler)`; scope names R4I-SQL-2.
- test helper `tests/security/personIdBijection.shared.mjs :: sites` (by cause, (G)): a member's three references are re-keyed sites.

## RESUME (exact commands)
    sh docs/chair/2026-11-20/veil/out/v42/sql2/run-1a.sh   # 1 (a), from /home/user/wt/sql
    sh docs/chair/2026-11-20/veil/out/v42/sql2/run-1b.sh   # 1 (b)

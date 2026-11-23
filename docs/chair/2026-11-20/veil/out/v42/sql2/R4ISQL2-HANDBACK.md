# R4I-SQL-2 — hand-back (VEIL-42, chain B; brief `briefs/R4I-SQL-2-BRIEF.md` at aba6be799; the measure `C-GAP.md` at c08f514d1)

Worktree `/home/user/wt/sql`, local branch `lane/veil-42-2026-11-23-sql2-wip`, cut at 392aff978. Never pushed (the seat pushes).
Every database local (`PGHOST=/var/tmp/rv7`). Logs: `out/v42/sql2/logs/`. The measure's instrument (`meas.probe.jsx`,
`meas-an.mjs`, `meas.sh`) COPIED VERBATIM from c08f514d1 into `out/v42/sql2/` (cmp: identical; same depth, so its relative
paths resolve to the tree it is run from); its databases are named by `meas.sh` itself (`meas_<outdir>_<shard>`, outdirs
`sql2*`), not re-written. Templates: `sql2_redtpl` = v27x211 + 212 at 392aff978 (red); `v42sql2` = v27x211 + this tree's 212.

## RED FIRST, AND HOW IT IS KEPT HONEST WHILE THE MUTEX IS HELD
The gate mutex was held (R4I-TONIGHT-2's holdD, a pool run) from before 12:12 UTC. So that the worktree could be edited while
the reds wait, BOTH RED RUNS READ A READ-ONLY SNAPSHOT of the red commit, never the worktree: `/var/tmp/sql2red` =
`git archive b5b6a5474` (b5b6a5474 = 392aff978 + this folder's docs only; 212 there cmp-identical to 392aff978's, sha 7a85dec3…),
node_modules linked to /home/user/wip's (`run-1a.sh`, `run-1b.sh`, chained by `run-1ab.sh`). Each log's first line names the source.

## STATE
| item | state |
|---|---|
| 1 (a) handreach tooth (ii), red | QUEUED on the mutex (from 12:18 UTC), `logs/1a-handreach-red.log` |
| 1 (b) the measure's C on the control towns, red | QUEUED after (a), `logs/1b-ctrl-red.log` |
| 2 the cure | APPLIED in the tree (this WIP commit); `--check` 0; the walker 11/11; eslint 0 on the touched files |
| 3 green | light units green (criminalSwitchSalt and the four non-security readers of the bijection module, 98/98, `logs/3-light-units.txt`); the heavy arms not run |
| 4 rollback, catalogue, salt, smoke | RUN on the cured 212 (`run-4.sh`, `logs/4-proofs.txt`): all green (below) |
| 5 E116's steps | header (36b) written; shas below; no test file added (manifest unchanged) |
| 6 tests/security, tests/lint, tests/copy, typecheck | not run |

## THE CURE (one function of 212: `_gallery_veil_rekey`'s body; no signature moves, so the rollback does not move)
- 212 :: `_gallery_veil_rekey`: one path list `card` (`id`, `goal.intent.short.target.id`, `goal.intent.long.target.id`,
  `allegiance.handler`) used by the npcs[] pass and by the roster-copy pass (both lists: `factions[]`, `powerStructure.factions[]`).
  No new helper. Header: (36b) and one line beside R4-IDS's. NO OTHER FUNCTION OF 212 IS TOUCHED (the diff's code lines: the
  `card` declaration and the two calls that take it).
- twin `galleryVeilPeople.js :: rekeyPeople`: `CARD_PATHS`, the same list, both passes.
- registry `people.rekey` (no other row moves): path widened by `(powerStructure\.)?factions\[\]\.members\[\]\.(goal\.intent\.
  (short|long)\.target\.id|allegiance\.handler)`; scope names R4I-SQL-2, the GAP, 40.8 (1), 44.7 (1). `registry.json` by its door
  (one row's path); `--check` 1 before, 0 after (`logs/2-registry-*.txt`).
- test helper `tests/security/personIdBijection.shared.mjs :: sites`, BY CAUSE, (G): a member's three references are re-keyed
  sites (phase 'ref', after npcs[]'s three); every tooth stands.
- the rollback `supabase/rollback/212_share_veil_later_cures.down.sql`: UNCHANGED (it drops `_gallery_veil_rekey(jsonb, text)` by
  signature, line 443; the signature does not move).

## ITEM 4 (`logs/4-proofs.txt`, on the cured 212, sha 70ce3b51…)
001..211 + 212 + down = 001..211: 480 = 480 functions, 25,988 lines each, diff EMPTY. THE CATALOGUE: one drawer among
`_gallery_veil%` (`_gallery_veil`, v); the closure's members not VOLATILE: 0; the four reads v. THE SALT: six functions take one
(`_gallery_veil_rekey_id, _ref, _at, _each, _rekey, _served`), each ACL `{postgres, service_role}` only; anon/authenticated may
execute 0. The smoke (R4I-SQL's `d-smoke.mjs`): 8 reads GREEN.

## SHAS
212 before 7a85dec31320dc6891be976458b285b0f49e463bf0a250e03dbc8636b010b5f3; after 70ce3b51a0099a65a2a06acbb4756d3d9e159246c2d71e4ad3f13edd060c5d6f
(re-read at the last commit). Rollback b13c5be88c6f91cb4f1300ca4837524c1f41cfaf5124077695a32c867a80f141, unchanged. 211 not touched.

## RESUME (exact commands, from /home/user/wt/sql)
    sh docs/chair/2026-11-20/veil/out/v42/sql2/run-1ab.sh   # the two reds, from the snapshot (re-make it: rm -rf /var/tmp/sql2red; mkdir it;
                                                            #   git archive b5b6a5474 | tar -x -C it; ln -s /home/user/wip/node_modules it/node_modules)
    sh docs/chair/2026-11-20/veil/out/v42/sql2/run-4.sh     # item 4 (light)

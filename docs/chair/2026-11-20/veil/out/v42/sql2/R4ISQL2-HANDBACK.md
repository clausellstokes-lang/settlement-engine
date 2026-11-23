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
| 1 (a) handreach, red | DONE (13:10-13:12 UTC, `logs/1a-handreach-red.txt`): **5 of 14 red**, the five master-shape towns (village-3, town-1, city-0, metropolis-1 and the hamlet), each "a stored person id is served": `factions[].members[].goal.intent.short/long.target.id` (e.g. `npc_peat_cutter`, `npc_veiled_5064ee784f11c849`) |
| 1 (b) the measure's C on the control towns, red | DONE (13:12-13:17, `logs/1b-ctrl-red-table.txt`): `...goal.intent.short.target.id` 456 hits / 60 reads, `...long.target.id` 443 / 60, `...allegiance.handler` 35 / 10, each on gallery server, gallery twin, import server and the gallery page; 0 on link (both) and map member: C-GAP.md's table exactly |
| 2 the cure | DONE (d344b6100); `--check` 1 before, 0 after; the walker 11/11; eslint 0; server = twin byte for byte under one salt on a hand doc (`logs/2-engines-same-salt.txt`) |
| 3 green | DONE: handreach **14 of 14** (`logs/3a-handreach-green.txt`); the measure's C, **0 hits on every path, every door (gallery, link, import, map member, the page), off and DM, both engines**, publicProse 0, fresh-shaped 0 (`logs/3b-ctrl-green-table.txt`); criminalSwitchSalt and the four non-security readers of the bijection 98/98 (`logs/3-light-units.txt`). L1/L2: the COMPARISONS section of the green table is BYTE-IDENTICAL to the red's (L1 gallery 33 of 288 differ, all at `factions[]#keys` / `factions[].power`, the server's re-derived top-level share the twin does not write: there before the cure, not this unit's, NAMED not chased; L1 link 0; L2 57 as before). So the cure adds no server/twin difference; "L1 0 differ" is NOT met, by that pre-existing path. The master-born set (m140) is the seat's (the addendum): not run here |
| 4 rollback, catalogue, salt, smoke | DONE (`logs/4-proofs.txt`): below |
| 5 E116's steps | DONE: header (36b) and the R4-IDS line; shas below (no lane file records 212's sha outside out/v35's own proofs, so they are recorded here); no test file added (the mutation manifest does not move) |
| 6 tests/security, tests/lint, tests/copy, typecheck | 6a DONE: **10 of 10 files, 196 of 196 tests** (criminalSwitchSalt, factionMemberPublicParity, gallerySanitizer, galleryVeilCures, galleryVeilIds, and the readers of the bijection: galleryRosterChoices, gallerySecondHomes, galleryServerVeil, galleryVeilHandRows, galleryWithholdAlways; `logs/6a-security.txt`; handreach in 3a). 6b, 6c QUEUED (detached, `run-green.sh 6b 6c`), behind the seat's m140 on the mutex from 14:09 UTC |

Note on the stored-side census line of the green table: it still lists the three member paths, because the instrument's census
marks "a re-key site" by its OWN copied list (not re-written, 44.7 (3)); what is SERVED there is 0 (HITS: none).

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

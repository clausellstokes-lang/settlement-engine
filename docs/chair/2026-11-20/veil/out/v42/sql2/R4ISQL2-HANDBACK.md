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
| 6 tests/security, tests/lint, tests/copy, typecheck | 6a DONE: **10 of 10 files, 196 of 196 tests** (criminalSwitchSalt, factionMemberPublicParity, gallerySanitizer, galleryVeilCures, galleryVeilIds, and the readers of the bijection: galleryRosterChoices, gallerySecondHomes, galleryServerVeil, galleryVeilHandRows, galleryWithholdAlways; `logs/6a-security.txt`; handreach in 3a). 6b DONE (the ledger ref fetched, 235efce1a): `tests/lint` + `tests/copy` WHOLE, 54 failed of 3,476: **lint 52 red** (the -wip's own count: rosterChoiceComposedHosts 26 (E78 (2), R5's worklist, red by design), writerReach 4 (the chair's), domainAnyCastBaseline 4, proseWiringCensus 2, observedShapeReaders 2, noLegacyFactionReaders 2, styleLaw, sovereigntyLightingContract, slugifyIdiomBaseline, seedLoopTotality, proseDrawnAnchors, presumptionClasses, presumedThings, netCurrentExtractorAnchor, negativeAssertionAnchor, moduleScopeCwdRatchet, factLayers, chainPrintSites, 1 each; every name in `logs/6b-reds-by-name.txt`), **copy 2 red** (voiceMechanics E2, the chair's N54). The ONE red that names a file of this diff: noLegacyFactionReaders lists `galleryVeilPeople.js:163 factions` twice, the roster-copy pass's pre-existing `s.factions` read, moved from line 154 by the comment lines (red before, the same read; its FPZ register is not this unit's). No red names 212, the registry's people.rekey row or the bijection. CONFIRMED: the count; PLAUSIBLE: that the 52 are the base's same 52 by name (no base list by name was at hand; the snapshot has no .git for a like-for-like run). 6c DONE: the typecheck ratchet **167, ceiling 167**, OK (`logs/6c-typecheck.txt`) |

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

## THE SEAT'S WORD (received ~14:35 UTC)
m140 ended (R4I-MEASURE d71a3ee44): the master-born set's GAP list is EMPTY (0 hits, every door; nothing in publicProse). NO NEW
PATH: the sites stay the control's three, both roster lists, as cured. `_gallery_veil_roster_choices`'s top-level
`factions[].power` share (the 33 L1 reads named above) is NOT this unit's and is with the chair: that function is NOT touched
(this diff's code lines are inside `_gallery_veil_rekey` only).

## THE SECOND CURE (ADDENDUM 2, the chair's N106, by grant): two guard lines of `_gallery_veil_roster_choices`
- THE DIFF: 212 lines 2329 (master's top-level `factions[]`) and 2360 (`powerStructure.factions[]`): `jsonb_typeof(e -> 'power') <> 'number'`
  -> `is distinct from 'number'`. NO OTHER BYTE of the function; no twin edit; no signature (the rollback does not move). Header (36c)
  and one line beside R4-IDS's (comments, outside the function).
- RED (before the two lines; the snapshot `/var/tmp/sql2c1` = `git archive 84f2e2bba`, template `sql2_c1tpl`):
  (a) control: `logs/3b-ctrl-green-table.txt` (the GAP's green, = this cure's red): L1 gallery 33 of 288 at `factions[].power`;
      master-born set, the gallery door, Reveal DM, the 11 marked settings: **L1 gallery 352 of 3,360 differ**, all at
      `factions[]#keys` / `factions[].power`, 32 places (`logs/n106-red-m-table.txt`): the measure's figure exactly;
  (b) the plant `b-plant.mjs` (`logs/n106-red-b.txt`): RED, the server ADDS `power` [50,50] on BOTH lists where the twin adds none;
      its control (every power a number) green, [80,20] both engines;
  (d) the pin `tests/lint/veilTypeofGuard.walker.test.js` against the old 212: RED naming both lines (`logs/n106-red-d.txt`).
- GREEN so far: (b) GREEN both lists, no `power` added, server = twin; control [80,20] (`logs/n106-grn-b.txt`); (d) 3 of 3
  (`logs/n106-grn-d.txt`), its inventory ONE line (212 :2397, `jsonb_typeof(r0 -> 'pair') <> 'array'`, unreachable NULL: `r0 @> e`
  with `e -> 'pair'` a non-empty array); the mutation manifest 10/10 (a rationale entry, `logs/n106-manifest.txt`); eslint 0;
  item 4 re-run on this 212 (sha fad4b9b9…): 480 = 480, diff empty, one drawer, closure all v, salt 0, smoke green; `--check` 0.
  (d) cost under thirty minutes.
- GREEN (a): the master-born set, gallery door: **L1 352 -> 0 of 3,360**, L2 0 (`logs/n106-grn-m-table.txt`); the control
  (handreach, every door, MEAS_C=1): **L1 gallery 33 -> 0 of 288**, L1 link 0, C hits none on every door and both engines, publicProse
  none (`logs/n106-grn-c-table.txt`). So the GAP's item 3 "L1 0 differ" now holds on the control and the master-born set. L2 gallery
  24 of 288 remain (v102-hamlet-6 at Reveal off, the page's prominentRelationship and #keys: in the red's 57 before either cure; the
  page's, not a power share).
- GREEN (c): NO TODAY-BORN READ MOVES: the gate's 140 (stored-today), Reveal off and DM, the 12 setting families, the gallery read and the
  link: **6,720 reads, 6,720 the same hash modulo the bijection, 0 differ**, before (sql2_c1tpl) against after (v42sql2b); the control,
  the raw documents, differ on all 6,720 (each read its own salt) (`logs/n106-c.txt`, `logs/n106-c-today-*.json`).
- RUNNING/QUEUED: tests/security (roster-choice readers + handreach), tests/lint + copy whole, typecheck.

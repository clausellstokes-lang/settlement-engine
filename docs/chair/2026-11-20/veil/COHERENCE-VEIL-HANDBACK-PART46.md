# COHERENCE-VEIL — hand-back, PART 46: the forty-fourth seat (VEIL-44), CHAIN B's SECOND SEAT, seated one unit early for "IMPORT-DOOR". PART 44 is VEIL-42's, 45 VEIL-43's. Start message: `docs/chair/2026-11-23/ninth/prompts/START-VEIL-44.txt` on `lane/chair-2026-11-08` (d9c5093df, 13,086 bytes).

Seat: VEIL-44, a seat of the NINTH chair (session_01FbPLbdpQrxXktCeSf32d4j; send_message, Claude Code Remote MCP). No pull request, ever. Pushes only to names beginning `lane/veil-44-2026-11-23`. Until the chair's "R4-IDS MERGED": PREPARE AND MEASURE; no line of 212, its rollback, the twin or the registry.

## 1. WHERE THIS SEAT STANDS (THE SEAT'S MEMORY: kept current at every push; for a reader who has never seen this session)
Written 10:49 UTC 2026-11-23.
### (1) BRANCHES, WORKTREES, MACHINE
- `lane/veil-44-2026-11-23` (this file, briefs, measures): on 8d4a81fef (VEIL-42's PART 44 commit). Checkout `/home/user/settlement-engine`
  (`node_modules`, `.husky/_` linked to `/home/user/wip`'s; both in `.git/info/exclude`).
- `lane/veil-44-2026-11-23-door-wip` (the unit's code): cut at 23bb8b8ae; THE LANE'S TIP b58abc48b (`lane/veil-41-2026-11-23-tip`, PIN-3,
  test-only; named by the chair 11:36) MERGED by fast-forward 11:38; PUSHED 11:40 at b58abc48b. Worktree `/home/user/wip` (npm ci done; hooks in).
- `lane/veil-44-2026-11-23-mapcovert-wip` (MAPCOVERT-RED's), cut at 23bb8b8ae, worktree `/home/user/wt/mapcovert`: its builder pushes it.
- Scratch: `/home/user/wt/doors3` (detached at 3e1115c81, (c2)).
- THE MACHINE: `out/v44/chain0.sh` (this branch), started 10:43 through `scripts/gate-mutex.sh --run`: npm ci, ledger ref, make-instruments,
  pool `/var/tmp/v18/t2/pool-v44`, verify, gates (TELL_DB=v44m). Log `/var/tmp/v18/out/v44/chain0.log` (outer exit in `chain0.outer`). PG16
  `/var/tmp/v18pg`, socket `/var/tmp/rv7` (after a reboot: `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v18pg -l /var/tmp/v18log/pg.log -w start"`).
  Template `v28tpl` = `v27x211` + the door -wip's 212.
- Chain B's instruments read from origin, no checkout: `lane/veil-42-2026-11-23-meas-wip` at eb0c60920 (U-UNMARKED; `out/v42/meas/meas.sh`, the lane's ONE
  whole-document instrument: extend it, never a second); `lane/veil-doors-3-2026-11-20` at 3e1115c81.
### (2) DONE
- MAPCOVERT-RED RETURNED (tip 6edc79094; report `out/v44/mapcovert/MAPCOVERT-RED-HANDBACK.md` there): `tests/security/galleryMapCovert.pglite.test.js`
  RED 3 of 8 (map member, map import, both on chain B's two places), controls green; arm `UM_ASSERT=map` on stored-today exit 1 (7 of 7 per
  cell), stored-master exit 0; tests/lint 48 = base. RE-RUN BY THE SEAT 12:49 (3 failed | 5 passed, the same titles; `out/v44/mapcovert-rerun.sh`).
  MERGED into the door -wip at 6c7bf0b97 (12:50); tests/lint whole on it 48 failing titles of 3,304, IDENTICAL to the base's 48 (13:05, `out/v44/lint-whole.sh`); pushed 6c7bf0b97. Its STOP: one push started the whole
  check, killed (exit 143); 15 (d) checked clean.
- TRAD4-RECUT DISPATCHED 12:49 (branch `lane/veil-44-2026-11-23-trad4-wip` at b58abc48b, worktree `/home/user/wt/trad4`).
- THE MACHINE RE-MADE (chain0 END 11:31): instruments rc 0 (--check 0, walker 0, accept 40, gate HIGHER 0 / EQUAL 79 / LOWER 13 both engines and Reveals); pool `pool-v44` 4 shards rc 0 (11:24); verify 45, 0 differ; gates rc 1 by design: GATE-1 4 at every gated setting (off and DM), LOWER BY RULE 7; GATE-2 20 Fisher cells (off 10, dm 10). EQUAL TO PART 44's standing figures.
- Read-in as the start message orders; first line to the chair 10:47.
- (c1) WRITTEN: `briefs/IMPORT-DOOR-BRIEF.md` ADDENDUM 2 (the eleven-item list; the owner's paragraph on N75 (4)).
### (3) IN FLIGHT
- TRAD4-RECUT builder (dispatched 12:49).
- (c2): `out/v44/c2/doors-arms.sh /home/user/wt/doors3` through the mutex (re-queued 11:25 with GATE_MUTEX_MAX_POLLS=100000; the first try gave up, exit 3); log `/var/tmp/v18/out/v44/c2-doors3.log`.
### (4) NEXT, IN ORDER (written 12:12 UTC; THE CHAIR'S MARK 338,524 at 12:09: from here every measure goes to a builder and returns as counts)
1. MAPCOVERT-RED returns: read its report (at most 60 lines) and its diff ONCE; re-run its red (the test file at the door -wip tip:
   `sh scripts/gate-tail.sh npx vitest run <its file>` through the mutex) and its arm's exit (its `um.sh` line on `stored-today`); merge its
   branch into the door -wip in `/home/user/wip` (a plain `git merge`); push the door -wip GUARDED (push only when HEAD differs from
   `git ls-remote origin <branch> | cut -f1`); "MAP-COVERT RED <commit>" to the chair with the counts.
2. Dispatch TRAD4-RECUT (`briefs/TRAD4-RECUT-BRIEF.md`): branch `lane/veil-44-2026-11-23-trad4-wip` cut at the door -wip, worktree
   `/home/user/wt/trad4`, node_modules and .husky/_ linked to /home/user/wip's; background Agent, no model override; the same read-back.
3. Brief and dispatch, one at a time: SNAP-MEASURE (N84 (3): both map reads' world snapshots on both stored sets and the fixtures: a
   settlement copy, a person, a `publicProse` block, a name-search hit, by path and count); FROZEN-LISTS's red (N85: the curated and
   featured lists print a frozen share's copy's name and tier: a plant); the chronicle's arm "a shown person stays shown" waits for the
   R4-IDS merge (N84 (4)).
4. On "R4-IDS MERGED <commit> on <branch>": merge that tip into the door -wip; the census re-run (`out/v44/census/census.mjs <tree>`);
   then the build by the brief's two-builder split (start message unit (2)).
### (5) WHAT THIS SEAT HAS READ WHOLE (N36)
212 at 23bb8b8ae: `_gallery_veil` (:2697-:2750), `_gallery_apply_member_overrides` with header (:2817-:2941), `get_gallery_dossier`,
`get_unlisted_dossier`, `import_gallery_dossier` (:2942-:3194). 211 :: `get_gallery_map` (:1391-:1492). doors-3's 212 section as one diff
(04704a660^..8af1cb703, 730 lines). 212 and the registry are NOT read whole by this seat.

## 2. RULINGS (numbered 46.n; the ninth chair's; each vetoable by the owner)
46.1 N84 (the chair, 10:54 UTC): the map member is the LINK's read of the same town (always public; unmarked takes the default veil); the
     door-equality arm holds it to the LINK's document; no new twin; the world snapshots measured before their red (inside unit (1));
     R4-IDS x the doors' chronicle measured at the merge, arm "a shown person stays shown"; the paid gate is the chair's. (Brief addendum 3.)
46.2 N85 (the chair, 11:01 UTC): the curated and featured lists fold into the frozen rule, red first by a plant, after MAP-COVERT and (c2);
     the other 33 enrolled with "no veil needed" rows. By reading: both lists read only is_public rows (no STOP).

## 3. Log (every hour read from `date -u`)
- 10:41 seated; 10:43 chain0 started; 10:47 first line; 10:49 (c1) written.
- 10:55 (c1) and MAP-PIPELINE sent; MAPCOVERT-RED briefed (briefs/MAPCOVERT-RED-BRIEF.md), its branch lane/veil-44-2026-11-23-mapcovert-wip at 23bb8b8ae, worktree /home/user/wt/mapcovert.
- 11:00 (f) census sent (4c602ddc7); (c2) doors-arms.sh queued behind the pool; TRAD4-RECUT brief written (dispatch after MAPCOVERT-RED returns).
- 11:31 the machine's figures equal PART 44's (chain0 END 11:31).
- 12:12 the chair's mark 338,524 (12:09); section 1 (4) re-written for a successor.
- 13:06 tests/lint whole at 6c7bf0b97: 48, the base's titles; the SQL builder waits for TRAD4 (the chair, 12:55).

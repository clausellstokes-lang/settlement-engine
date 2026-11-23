# COHERENCE-VEIL — hand-back, PART 44: the forty-second seat (VEIL-42), CHAIN B of the share veil, successor of VEIL-38 (PART 40). PART 39 is VEIL-37's, 40 VEIL-38's, 41 VEIL-39's, 42 VEIL-40's, 43 VEIL-41's. Read with PART 40 (sections 1 and 2: rulings 40.1 to 40.10) and the start message `docs/chair/2026-11-23/ninth/prompts/START-VEIL-42.txt` on `lane/chair-2026-11-08`.

Seat: VEIL-42, a seat of the NINTH chair (session_01FbPLbdpQrxXktCeSf32d4j; send_message, Claude Code Remote MCP). No pull request, ever. Pushes only to names beginning `lane/veil-42-2026-11-23`.

## 1. WHERE THIS SEAT STANDS (THE SEAT'S MEMORY: kept current at every push; written for a reader who has never seen this session)
THE UNIT: R4-IDS. NOTHING OF IT IS MERGED INTO THE LANE'S TIP. THE LANE'S TIP: 23bb8b8ae on `lane/veil-39-2026-11-23-tip` (PIN-2), until the chair names another.

### (1) BRANCHES, WORKTREES, MACHINE
- `lane/veil-42-2026-11-23` (this file, briefs, measures): seated on e7687383228aaa8d961d9509aacdbfe04c5ed3bb (VEIL-38's final). Checkout `/home/user/settlement-engine` (its `node_modules` and `.husky/_` are links to `/home/user/wip`'s; both excluded in `.git/info/exclude`).
- `lane/veil-42-2026-11-23-r4ids-wip` (the unit's code): created at f7f1cfe8c (`origin/lane/veil-38-2026-11-23-r4ids-wip`); THE TIP 23bb8b8ae MERGED at 9f9b819f7 (no conflict: `tests/lib/gallery.test.js`, `galleryVeilSignalCopies.pglite.test.js`; test-only, so E116's steps reduce as in 40.4). Worktree `/home/user/wip` (npm ci done, hooks in).
- `lane/veil-42-2026-11-23-meas-wip` (LOCAL, never pushed): R4I-MEASURE's, cut at 9f9b819f7, worktree `/home/user/wt/meas`.
- `lane/veil-42-2026-11-23-tonight-wip` (LOCAL, never pushed): R4I-TONIGHT-2's, cut at 9f9b819f7, worktree `/home/user/wt/tonight`; hand-back `out/v42/tonight/R4IT2-HANDBACK.md` there.
- THE MACHINE (this container): PG16 at `/var/tmp/v18pg`, socket `/var/tmp/rv7` (after a reboot: `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v18pg -l /var/tmp/v18log/pg.log -w start"`); out `/var/tmp/v18/out/v42`; pool `/var/tmp/v18/t2/pool-v42`; template `v28tpl` (= `v27x211` + the -wip's 212). The chain: `/var/tmp/v18/out/v42/chain0.sh` (copied to `out/v42/chain0.sh` here), run through `scripts/gate-mutex.sh --run` at 06:16 UTC: ledger ref, `make-instruments.sh`, `pool.sh`, `verify.sh`, `tell2.sh` (the gates).
- VEIL-38's machine scripts (`/var/tmp/v18/out/v38/{mrun,sqlproofs,poolprobes,tipbuild}.sh`, `cost/cost.sh`) were container-only and are LOST: each is rebuilt from the committed probes when its unit comes.

### (2) DONE
- Read-in as the start message orders (said to the chair 06:17).
- R4I-MEASURE's brief committed (`briefs/R4I-MEASURE-BRIEF.md`, caba51270); the builder DISPATCHED 06:2x UTC (background Agent; its hand-back `out/v42/meas/MEASURE-HANDBACK.md` on its local branch).
- Instruments re-made on the -wip at 06:23: --check 0, walker 0, acceptance 40 PASS, `v28tpl` 0, R3 gate 0 (HIGHER 0, EQUAL 79, LOWER 13, both engines and reads); harnesses 1 as expected (the gap; the Tonight sheet).
- UNIT (0) DONE, sent 06:57: pool `pool-v42` (8 shards rc=0, 06:48; verify 45, 0 differ); GATE-1 4 of 92 at every gated setting, off and DM, twin 4 / server 4 (raw 11 / 11), controls 0 of 48, LOWER BY RULE 7; GATE-2 20 Fisher cells (off 10, dm 10): EQUAL to the standing figures.
- R4I-TONIGHT-2's brief committed (559d7b343, addendum N59 015b3c020); the builder DISPATCHED 06:3x UTC beside R4I-MEASURE (44.1).

### (3) IN FLIGHT
- R4I-MEASURE: A ("77"), C ("GAP"), B ("WHOLE-DOC"): each result sent to the chair as soon as its file exists.
- R4I-TONIGHT-2 (unit 3, started early by 44.1): ITS TURN ENDED 06:58 at ~279,000 tokens, before any heavy run got the mutex. Local tip 93f7ae168 (550e2e427 the arm probe and out/v38/r4it; 47980d744 N: netCurrentExtractorAnchor red 1/7 then green 7/7, criminalSwitchSalt 6/6). C APPLIED IN ITS WORKTREE, NOT COMMITTED (tonightSheet.js, crisisFactFindings.js with `castWantKeyOf(name)` and no id; shareRenderTwice; tonightSheetOnce re-pinned by cause); light runs green, PLAUSIBLE. ITS QUEUE `/var/tmp/r4it2/queue1.sh` (nohup, through the mutex, behind R4I-MEASURE): holdA (shareRenderTwice red on a 9f9b819f7 snapshot, the arm red/green on the 140, shareRenderTwice green, the 30 d-files) then holdB (the arm red on the pool); logs `/var/tmp/r4it2/logs/`. NEXT: when the queue ends, RESUME THE BUILDER BY MESSAGE (its context holds the read-in) for the pool green, OWNER-MOVES, C's commit, lint/copy whole, typecheck; its hand-back `out/v42/tonight/R4IT2-HANDBACK.md` names the commands. IF A's cause lies in what it edits: tell it to STOP and tell the chair (44.1 (1)).

### (4) NEXT, IN ORDER (the start message's units)
1. Send A, C, B as they land. If A's cause is NOT the gap: to the chair before any cure of it is briefed.
2. R4I-SQL-2's brief from C's path list (and A's cause if it is the gap); dispatch; read its diff whole once (and every touched function of 212 beside `_gallery_veil_rekey`, with callers).
3. R4I-TONIGHT-2's return: its diff read whole once; its red and green re-run.
4. The quiet-box queue: order count; the tip build beside the -wip's (four VERIFY_DIST reds by name); the cost law.
5. WRITER-REACH: three identities from the walker's own report, one line to the chair.
6. The unit's proofs on ONE NEW POOL; then "TIP? R4-IDS <commit>".

### (5) WHAT THIS SEAT HAS READ WHOLE (N36: a summarized seat re-reads before it judges)
`src/domain/display/galleryVeilPeople.js`; 212 :: `_gallery_veil_rekey`; `src/domain/veil/rosterChoiceRegistry.js`. 212 is NOT read whole by this seat (the start message's item (4)).

## 2. RULINGS SINCE PART 40 (numbered 44.n; the ninth chair's; each vetoable by the owner)
44.1 THE CHAIR, N59, 06:29 UTC: the first message, the instruments and the measure's dispatch TAKEN; the rebuilt machine scripts are committed. R4I-TONIGHT-2 STARTS NOW beside R4I-MEASURE (40.5's form; every heavy run one at a time through the mutex). Conditions: (1) if "77"'s cause is in what R4I-TONIGHT-2 edits, it stops and the chair is told; (2) before its commit a grep of `tests/` for every sentence or key it moves (N57), `tests/copy` whole in its proofs (N54); a moved golden or snapshot named for the owner, signed by nobody. R4I-SQL-2 is briefed from the measure's lists, as ordered.

## 3. Log (every hour read from `date -u`)
- 06:13 seated (first clock read). 06:16 the tip merged into the -wip (9f9b819f7); chain0 launched under the mutex. 06:17 first line to the chair. 06:19 R4I-MEASURE's worktree cut; the builder dispatched. 06:28 instruments line and the question to the chair. 06:33 N59 read (44.1); R4I-TONIGHT-2 dispatched. 06:56 chain0 ended (gates read); 06:57 the gates line to the chair.

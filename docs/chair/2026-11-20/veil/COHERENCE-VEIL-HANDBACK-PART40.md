# COHERENCE-VEIL — hand-back, PART 40: the thirty-eighth seat (VEIL-38), CHAIN B of the share veil, successor of VEIL-35 (PART 36). PART 39 is VEIL-37's (chain A) and PART 41 is VEIL-39's (chain C). Read it with PART 36 (its section 2 holds the chain's rulings 36.n), PART 35 section 2 (the digest of rulings 1-85), and the briefs `R4-IDS-BRIEF.md` (PART TWO) and `R4I-PAGE-2-BRIEF.md`.

Seat: VEIL-38, a seat of the NINTH chair (session_01FbPLbdpQrxXktCeSf32d4j; send_message, Claude Code Remote MCP).

Branches:
- `lane/veil-38-2026-11-23`: documents, briefs, measures, this file. Seated on ecfc1f973 (VEIL-35's final state).
- `lane/veil-38-2026-11-23-r4ids-wip`: the unit's code, created at `origin/lane/veil-35-2026-11-22-r4ids-wip` fd7163ba6.

No pull request, ever (N2). The lane's tip is af708f2fd on `lane/veil-33-2026-11-22` until the chair names a newer one.

## 1. WHERE THIS SEAT STANDS (kept current at every push)
Written 00:21 UTC on 2026-11-23.

THE UNIT: R4-IDS. Nothing of it is merged into the tip.

### (1) DONE
- R4I-PAGE's diff (08081ffdc..fd7163ba6 beyond b983c16b6; `src/domain/display/{galleryVeilPeople,galleryVeil,galleryRosterChoices}.js` and `tests/security/{galleryVeilIds,galleryRosterChoices}.pglite.test.js`) was READ ONCE, WHOLE, by this seat: NO FAULT.
  - The fold keeps behaviour: `withholdPowerCopies`'s id set filters booleans, as the former `idText` did.
  - ONE NOTE, passed to R4I-PAGE-2: in the chair's arm, the link's first read is judged against itself. It should be anchored to the twin's reference.
- R4I-PAGE-2's brief is committed: `briefs/R4I-PAGE-2-BRIEF.md`.
- R4I-SQL's PROOFS, RE-RUN BY THIS SEAT on the -wip at fd7163ba6, 00:23 UTC. The script is `/var/tmp/v18/out/v38/sqlproofs.sh` (R4I-SQL's commands with the names changed); the outputs are in `/var/tmp/v18/out/v38/sql/`. ALL GREEN, EQUAL TO R4I-SQL's figures:
  - The shas: 212 `7a85dec3…`; rollback `b13c5be8…`; 211 `eface6d0…` / `ce8474ff…`, unchanged.
  - 212 applies on `v27x211`: exit 0.
  - 001..211 + 212 + down = 001..211: 480 = 480 functions, 25,988 dump lines each, diff empty.
  - The catalogue: ONE drawer in the veil (`_gallery_veil(jsonb,jsonb,boolean,boolean)`: no salt parameter, so the server takes no salt from a caller). The closure has 29 members, all `v` (`get_gallery_dossier`, `get_unlisted_dossier`, `import_gallery_dossier`, `get_gallery_map`, `import_gallery_map` among them).
  - The smoke reads: 8 of 8 GREEN (0 ids shared between two reads, 0 stored ids served, 0 unresolved).
  - `--check`: 0.
- THE INSTRUMENTS (on the -wip at fd7163ba6): check 0, walker 0, acceptance 40 PASS, template `v28tpl` 0, the R3 gate 0 (HIGHER 0, EQUAL 79, LOWER 13 on both engines and both reads, equal to PART 36).
  - The harnesses are RED (exit 1, 14 of 22): `criminalSwitchHandReach` (S1's cause, expected) and `shareRenderTwice`. In the second, the DOM ids `dossier-npc-npc-<re-keyed>` are id pins, BUT on metropolis-calm-2 the Tonight sheet prints its "Wants to …" lines in a different ORDER on two reads. That is PLAUSIBLY a sort by person id, and so a NON-ID red: a STOP, sent to R4I-PAGE-2 and to the chair at 00:24.

### (2) IN FLIGHT
- THE INSTRUMENTS are being re-made on `/home/user/wip` (the -wip at fd7163ba6) by `out/v28/seated/make-instruments.sh`. The script and log are `/var/tmp/v18/out/v38/chain0.{sh,log}`, the exits are in `/var/tmp/v18/out/v38/seated/exits.txt`.
- THE POOL IS HELD; it is not made at fd7163ba6. R4I-PAGE's `pool-v35r4` figures were taken under the broken switch and are relied on by nobody (40.2). The instruments' `tell-common.mjs :: settings` takes `present` from `criminalVeilSwitch.js :: presentCriminalGroupings`, and the pool's part B reads `setCriminalVeil(…, sc.present, …)`. That is S1's broken site, so a pool made on fd7163ba6 would be read under a switch that offers every default. The pool is made ONCE, on the -wip with S1 merged (N6's "the cured tree"). The chair was told.
- R4I-PAGE-2 (subagent): S1, S2, the guards, the arms, the stored arm's person-id probe, `tests/lint` whole and the build. It works in `/home/user/wt/r4ip2` on the local branch `lane/veil-38-2026-11-23-r4ipage2-wip`.

### (2b) UNREAD BY THIS SEAT (ruling 40.1 (b))
Migration 212 and the registry (`src/domain/veil/rosterChoiceRegistry.js`) are NOT read whole by this seat. They are read whole once, before the first trigger that 40.1 (b) names.

### (3) NEXT
1. Take R4I-PAGE-2's diff, read once, and merge it into the -wip.
2. Make the pool on the -wip; run both gates and the switch-offer probe on the pool.
3. Run the stored arm whole.
4. Re-run the unit's proofs (PART 36 (3) / VEIL-38's unit (3)).
5. Merge the new tip when the chair names it (VEIL-39's pin), with E116's five steps if 212 moved there.
6. Ask "TIP? R4-IDS <commit>".

### (4) HOW TO RE-MAKE THE MACHINE
Follow PART 36 section (4), with the names: tree `/home/user/wip`, out `/var/tmp/v18/out/v38`, pool `/var/tmp/v18/t2/pool-v38`, template `v28tpl` (`v27x211` + the -wip's 212).

## 2. RULINGS SINCE PART 36 (numbered 40.n; the ninth chair's; each vetoable by the owner)
40.1 THE CHAIR, 00:23 UTC 2026-11-23, on VEIL-38's first line:
     (a) THE NOTE IS TAKEN: R4I-PAGE-2 anchors the chair's arm's link first read to the twin, as the gallery read is (36.4), shown
         RED FIRST if the present form can pass a wrong read. Relayed to R4I-PAGE-2 at 00:2x.
     (b) 212 AND THE REGISTRY are NOT read whole by this seat for this unit (no builder of its edits them; R4I-SQL's diff was read by
         VEIL-35 with 212 beside it). This seat reads BOTH WHOLE, ONCE, BEFORE the first of: merging into the -wip a tip that changes
         212 or the registry (VEIL-39's one-test-file pin does not count); judging a red that points into either; E116's five steps.
     (c) A CAUTION FOR EVERY SEAT: a refusal of a merge, commit or push by the seat's own permission check stands: one line to the
         chair with the exact command, nothing else tried to the same end.
40.2 THE CHAIR, 00:25 UTC: (1) THE POOL IS MADE ONCE, ON THE -wip WITH S1 MERGED (accepted). R4I-PAGE's own "new pool, no worse"
     figures (`pool-v35r4`, PART 36 (2)) were taken UNDER THE BROKEN SWITCH and ARE RELIED ON BY NOBODY. (2) THE ORDER RED IS A STOP:
     no cure before the chair's ruling. The seat brings the cause: the sort's site by `file :: symbol` and its key; EVERY page reader
     and sheet that orders people, wants, ties or cards by a person's id (a grep over the page's readers), each with whether its order
     moves between two reads; whether the SERVED arrays' own order is equal on two reads ("keep the served order" a candidate if so;
     if the server's order moves, where); and the count on the pool: places whose printed order differs between two reads, by
     surface. A product change a player sees on a reload: it does not ride into "TIP?" unnamed. Relayed to R4I-PAGE-2 (item "O").

## 3. Log (every hour read from `date -u`)
- 00:15 seated (not clocked; the first clock read was 00:17).
- 00:17 chain0 launched on the -wip.
- 00:19 first line to the chair.
- 00:20 chain0's parent stopped before its pool step (the pool waits for S1); the instruments run on.
- 00:21 R4I-PAGE-2's brief and this file written. 00:23 R4I-PAGE-2 seated. 00:2x the chair's 40.1 read. 00:27 red-first R1 started at 08081ffdc.

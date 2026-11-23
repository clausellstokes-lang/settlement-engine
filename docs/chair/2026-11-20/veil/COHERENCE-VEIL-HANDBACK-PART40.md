# COHERENCE-VEIL — hand-back, PART 40: the thirty-eighth seat (VEIL-38), CHAIN B of the share veil, successor of VEIL-35 (PART 36). PART 39 is VEIL-37's (chain A) and PART 41 is VEIL-39's (chain C). Read it with PART 36 (its section 2 holds the chain's rulings 36.n), PART 35 section 2 (the digest of rulings 1-85), and the briefs `R4-IDS-BRIEF.md` (PART TWO) and `R4I-PAGE-2-BRIEF.md`.

Seat: VEIL-38, a seat of the NINTH chair (session_01FbPLbdpQrxXktCeSf32d4j; send_message, Claude Code Remote MCP).

Branches:
- `lane/veil-38-2026-11-23`: documents, briefs, measures, this file. Seated on ecfc1f973 (VEIL-35's final state).
- `lane/veil-38-2026-11-23-r4ids-wip`: the unit's code, created at `origin/lane/veil-35-2026-11-22-r4ids-wip` fd7163ba6.

No pull request, ever (N2). THE LANE'S TIP is 2d7ed483f on `lane/veil-39-2026-11-23-tip` (40.4), merged into the -wip at ec082df83.

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

- R4I-PAGE-2 RETURNED (stopped at its budget; local branch `lane/veil-38-2026-11-23-r4ipage2-wip` at b088fcfc5; its hand-back `out/v38/r4ip2/R4IP2-HANDBACK.md`). The -wip was FAST-FORWARDED to b088fcfc5 at 00:58 UTC.
  - S1 (05ec8213b), its diff READ ONCE by this seat: NO FAULT. `applyVeil(pub, veil, { salt })`; `presentCriminalGroupings` draws ONE salt for its calls; the walker shows no other caller (with a plant). JUDGMENT (vetoable, told to the chair): 212's six internal salt carriers take `salt`, so the server test asserts that the entry and the three reads take none, that `_gallery_veil` draws it, and that every taker is revoked. Its arm (reference: `rekeyPeople` as the identity) went from RED FIRST, 4 of 24 reads differ, to GREEN 6/6; the 140 towns: 280 reads, 0 differ. CONFIRMED by its logs; not re-run by the seat.
  - O (THE CHAIR'S STOP, 40.2), MEASURED, NOT CURED (`ORDER-STOP.md`). It is NOT A SORT: `summary/tonightSheet.js :: castWantOf` picks a cast person's want line by `castHash(served person id, crisis, role)`. The served arrays are equal in order on two reads (twin 140/140, server 140/140). Of the whole page's views only the Tonight sheet moves (twin 39/140, server 44/140). Sent to the chair 00:59.
  - S2: red at af708f2fd too, the same assertion (`gallery.test.js` :620): NOT R4-IDS's; named to the chair.
  - A NEW STOP: `pgliteHookTimeoutRatchet` is red by R4I-PAGE's regex `\(` at `galleryVeilIds.pglite.test.js` :205 (green at af708f2fd). A test-only cure (`\x28`) was proposed to the chair.
  - G PARTIAL: the 34 non-security files have 14 red after S1 (13 id pins confirmed by their failing lines, plus S2). `tests/security` whole was still running at the hand-back.

- THE POOL, made ONCE on the -wip at b088fcfc5 (S1 merged; 40.2), 00:58-01:54 UTC: `/var/tmp/v18/t2/pool-v38`, both parts, every shard rc=0; verify 45 re-read, 0 differ.
  - BOTH GATES (`/var/tmp/v18/out/v38/gates/tell2-table.txt`): GATE-1 4 of 92 at EVERY gated setting (own, g:000..g:110, allOpen, off), Reveal off and DM, twin = server (4 / 4; raw 11 / 11); controls 0 of 48; LOWER BY RULE 7; GATE-2 20 Fisher cells below 0.05 (non-members off 10, dm 10); non-governing criminal rows against the rule 0; part A's server sample 112 births, 0 differ from the twin.
  - EQUAL TO THE LANE'S STANDING FIGURES (N6): NO WORSE. The tip move 40.4 is test-only, so these stand for ec082df83.

### (2) IN FLIGHT
- On the pool, at the -wip (`/var/tmp/v18/out/v38/poolprobes.sh`): the switch-offer probe (S1's pool arm), then the order probe (40.2's count of places whose printed order moves, twin only), started 01:55 UTC. R4I-PAGE's `pool-v35r4` figures were taken under the broken switch and are relied on by nobody (40.2).
- R4I-TONIGHT (subagent; brief `briefs/R4I-TONIGHT-BRIEF.md`), in `/home/user/wt/r4it` on the local `lane/veil-38-2026-11-23-r4tonight-wip` at b088fcfc5: 40.3 (2), measure first.
- R4I-PAGE-3 (subagent; brief `briefs/R4I-PAGE-3-BRIEF.md`), in `/home/user/wt/r4ip3` on the local `lane/veil-38-2026-11-23-r4ipage3-wip` at b088fcfc5: G1, G2, A, the arms, ST, L, B.

### (2b) UNREAD BY THIS SEAT (ruling 40.1 (b))
Migration 212 and the registry (`src/domain/veil/rosterChoiceRegistry.js`) are NOT read whole by this seat (40.4's tip move changed neither). They are read whole once, before the first trigger that 40.1 (b) names.

### (3) NEXT
1. Read R4I-PAGE-3's diff once and merge it into the -wip.
2. Run both gates, the switch-offer probe (`out/v38/r4ip2/switch-offer.sh`) and the order probe (`order.sh`) on the pool.
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

40.3 THE CHAIR, 01:01 UTC: (1) S1 TAKEN, and the judgment on 212's six internal salt carriers ACCEPTED: "the server never takes a
     salt from a caller" = no function a client can call takes one; `_gallery_veil` and the three reads take none, `_gallery_veil`
     draws it, and every function with a salt parameter is revoked from public, anon, authenticated (asserted by signature, so a new
     carrier without its revoke reds). (2) THE ORDER STOP RULED: `castWantOf`'s pick is KEYED ON THE PERSON'S NAME AS THE CARD
     PRINTS IT, with the crisis and the role, on the owner's page and every shared read alike (one code path); both callers (the
     sheet; the judge `coherence/crisisFactFindings.js`). `castWantOf` is not on master: no user's page moves. MEASURE FIRST on the
     pool, STOP if either is not 0: (i) cast persons of one place sharing (name, crisis, role); (ii) cast persons whose served name
     differs from the stored name on any read. Then red first on `shareRenderTwice`'s non-id rows; an arm (the sheet equal on two
     reads, and equal to the owner's on nothing-hidden places); the owner-page moves counted ONCE and NAMED; every pin of a "Wants
     to" line re-pinned by cause; the sameness door and registers by their doors; a moved PDF snapshot or golden NAMED for the
     owner, signed by nobody. `tonightSheet.js` and `crisisFactFindings.js` join the manifest, LISTED for the join. It rides in
     R4-IDS. (3) S2 is NOT this unit's: classed "red at af708f2fd, the chair's"; the chair gives its cause to VEIL-39. (4)
     `pgliteHookTimeoutRatchet`: test-only inside R4-IDS: `\x28` at that regex, one comment above saying why, no ratchet figure
     moves, `tests/lint` whole after; the matcher's limit is on the chair's list for after the first deploy.
     DONE BY THIS SEAT: (4) and (3) to R4I-PAGE-3 (its brief's ADDENDUM); (2) to a SECOND builder, R4I-TONIGHT
     (`briefs/R4I-TONIGHT-BRIEF.md`; disjoint manifest: the sheet, the judge, `shareRenderTwice` and the want pins; COMMON-EIGHTH
     12 (a): two builders of one deliverable next to its landing line).

40.4 THE CHAIR, 01:03 UTC: "TIP 2d7ed483f96160c5eb0e9cc06745137b857b295f on `lane/veil-39-2026-11-23-tip`" (VEIL-39's unit (P): one parent
     af708f2fd; ONE test file, `galleryVeilHandRows.pglite.test.js` +6 -3, V7-2's "STAYS" row re-stated to E97 (1)). Merged into the -wip
     at once, before R4I-PAGE-3 edits that file: ec082df83 (no conflict). For this move E116's five steps reduce to that merge, that
     file's run on the merged tree and `tests/lint` whole at the next whole run; the pool started at 00:58 on b088fcfc5 STANDS (nothing
     under src/ or supabase/ moves). R4I-PAGE-3 told to merge the -wip into its branch before editing the file.
40.5 THE CHAIR, 01:04 UTC: TWO BUILDERS AT ONCE ACCEPTED (R4I-TONIGHT beside R4I-PAGE-3; manifests disjoint; heavy runs one at a time
     through the mutex). A builder's WINDOW is its context in tokens, said in figures in the brief's first line (1,000,000; its budget),
     beside what it reads whole; wall time is a separate line. Both briefs' first lines corrected.

## 3. Log (every hour read from `date -u`)
- 00:15 seated (not clocked; the first clock read was 00:17).
- 00:17 chain0 launched on the -wip.
- 00:19 first line to the chair.
- 00:20 chain0's parent stopped before its pool step (the pool waits for S1); the instruments run on.
- 00:21 R4I-PAGE-2's brief and this file written. 00:23 R4I-PAGE-2 seated. 00:2x the chair's 40.1 read. 00:27 red-first R1 started at 08081ffdc.

# COHERENCE-VEIL — hand-back, PART 40: the thirty-eighth seat (VEIL-38), CHAIN B of the share veil, successor of VEIL-35 (PART 36). PART 39 is VEIL-37's (chain A) and PART 41 is VEIL-39's (chain C). Read it with PART 36 (its section 2 holds the chain's rulings 36.n), PART 35 section 2 (the digest of rulings 1-85), and the briefs `R4-IDS-BRIEF.md` (PART TWO) and `R4I-PAGE-2-BRIEF.md`.

Seat: VEIL-38, a seat of the NINTH chair (session_01FbPLbdpQrxXktCeSf32d4j; send_message, Claude Code Remote MCP).

Branches:
- `lane/veil-38-2026-11-23`: documents, briefs, measures, this file. Seated on ecfc1f973 (VEIL-35's final state).
- `lane/veil-38-2026-11-23-r4ids-wip`: the unit's code, created at `origin/lane/veil-35-2026-11-22-r4ids-wip` fd7163ba6.

No pull request, ever (N2). THE LANE'S TIP is 2d7ed483f on `lane/veil-39-2026-11-23-tip` (40.4), merged into the -wip at ec082df83.

## 1. WHERE THIS SEAT STANDS — FINAL AT THE HAND-OVER (40.7; written from 04:02 UTC on 2026-11-23; M's line is added when M ends)
THE UNIT: R4-IDS. NOTHING OF IT IS MERGED INTO THE TIP. The lane's tip is 2d7ed483f on `lane/veil-39-2026-11-23-tip`, merged into the -wip at ec082df83.
THE TWO COMMITS A SUCCESSOR IS SEATED ON: this branch `lane/veil-38-2026-11-23` (the commit carrying this section) and `lane/veil-38-2026-11-23-r4ids-wip` at f7f1cfe8c (the unit's code; pushed).

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

- R4I-PAGE-3 RETURNED (stopped at its budget; local `lane/veil-38-2026-11-23-r4ipage3-wip` at 0755698e6; hand-back `out/v38/r4ip3/R4IP3-HANDBACK.md`). Its diff (tests and one helper; NO src change) was READ ONCE by this seat: NO FAULT. The -wip was FAST-FORWARDED to 0755698e6 at 02:2x. CONFIRMED by its logs:
  - G1: the 13 non-security id pins re-stated modulo the bijection, five teeth each.
  - The ratchet's `\x28` (40.3 (4)): red at b088fcfc5, then 18/18 green.
  - galleryVeilHandRows 26/26 (the V7-2 row green after the tip); galleryWithholdAlways 9/9; galleryVeilIds 12/12; criminalSwitchSalt 6/6; rosterChoiceInversion 4/4; walkers 34/34; `--check` 0; typecheck 167.
  - THE STORED ARM (E134; `out/v38/r4ip3/st/`). ITS "zero stored ids served" WAS READ WITH THE OLD MASK: IT IS NO PROOF ANY MORE (40.8 (2)); it is re-run with the corrected mask inside the unit's proofs. As read then: 140 today-born and 140 master-born documents, 3,360 reads each. 0 spelling hits; 0 stored person ids served (0 in stored-only fields: `publicProse`); 0 ids shared by two reads; 0 new unresolved references. The planted controls were caught 700/700 (bad references) and 140/140 (a stored id served).
  - INSTRUMENT CHANGE (E), vetoable: `personIdBijection :: storedIdsServed` masks the re-key's fresh tokens before its substring search (short stored ids gave false reds about one read in eight).
  - SENT TO THE CHAIR 02:27 FOR RULING:
    - (a) THE SIZE RISE (VERIFY_DIST 4 red: first paint +60 B raw / +14 B gzip, engine chunk +327 B, worker +43 B; the twin's `galleryVeilPeople.js` + `sha256Hex` and S1's import): the owner's.
    - (b) galleryServerVeil's RULING 4 file list: a 12th twin file.
    - (c) the link anchor needs a LINK twin (the anchored form reds 24/36 clean link reads); it is not committed.
    - (d) VS1's crime-types tooth is red at af708f2fd too (the tip's); galleryVeilSignalCopies' 2 reds are PLAUSIBLY S2's.
- ON THE POOL (`/var/tmp/v18/out/v38/poolprobes.sh`, at ec082df83): THE SWITCH OFFERS EXACTLY WHAT IT OFFERED BEFORE THE RE-KEY on 3,616 of 3,616 reads (10,848 groupings present). S1's arm, as ruled.

- R4I-TONIGHT RETURNED AT ITEM M, a STOP (local `lane/veil-38-2026-11-23-r4tonight-wip` at 46f8de49c, docs only; `out/v38/r4it/R4IT-HANDBACK.md`). Its measure is built and its teeth proven, but it was NOT RUN: the gate mutex never cleared. The cure is prepared as a patch (`C-prepared-cure.patch`: `castWantKeyOf(name, id)` in both callers; `C-prepared-shareRenderTwice.patch`), NOT applied. FINDING sent to the chair 03:02: "equal to the owner's own sheet on nothing-hidden places" is 0 of 4 (the served read withholds each person's goal and secret); the builder proposes comparing role lines only.
- A FAULT OF THIS SEAT, SAID TO THE CHAIR 03:02: its pool probes ran OUTSIDE the gate mutex beside two builders. Memory pressure killed three order shards (order rc=2, 02:55), the tip build (rc=137) and the builder's turn at the gate. FROM 03:02: ONE HEAVY RUN AT A TIME ON THIS BOX, the seat's included.

- R4I-PAGE-4 RETURNED (stopped at its budget; local `lane/veil-38-2026-11-23-r4ipage4-wip` at f7f1cfe8c; hand-back `out/v38/r4ip4/R4IP4-HANDBACK.md`). Its diff was READ ONCE by this seat: the shared helpers (`tests/security/linkTwin.shared.mjs`; `personIdBijection.shared.mjs` (F)) and `criminalSwitchHandReach` whole; the five other files by their removed lines, each replaced by its re-stated form. NO FAULT. The -wip was FAST-FORWARDED to f7f1cfe8c at 04:00 (no src or supabase change). CONFIRMED by its runs:
  - G3: 22 of 27 id pins re-stated, teeth on each.
  - 40.6 (b): RULING 4's register gains `galleryVeilPeople.js` (a comment and a reader); galleryServerVeil 18/18.
  - 40.6 (e): the mask takes whole tokens only and counts fresh-shaped stored ids (0 today-born, 0 master-born); the old mask missed 3 plants.
  - 40.6 (c): THE LINK TWIN, its law cited (212 :: `get_unlisted_dossier` :3307, :3328-3334, :3338-3339; 211 :: `_gallery_veil_resolve` :701, :739-742); a member's `revealDm: true` reveals nothing on the link. Plants 36/36 red, clean link reads 36/36 green.
  - The 34 files: 2 red of 867 (S2 and VS1's tooth: the tip's). Tell3 3/3, Tell4 1/1, Tell5 2/2, Tell8 3/3, ServerVeil 18/18, RosterChoices 39/39. SignalCopies: 2 red at af708f2fd and at the tree, the same assertion: the tip's.
  - A STOP, A GAP OF THE CURE (sent to the chair 04:00): on master's stored shape the SERVER serves the roster copies' goal targets UN-RE-KEYED (`factions[].members[].goal.intent.{short,long}.target.id`, e.g. `npc_peat_cutter`). Tooth (ii) catches it: criminalSwitchHandReach 5 red. PLAUSIBLY the twin too (`rekeyPeople` re-keys only `members[].id`). The cure needs 212, the registry's path and the twin: R4I-SQL-2.
  - `tests/lint` WHOLE at c7e60ef59: 52 of 3,304 against the tip's 48. Four new: `netCurrentExtractorAnchor` 1 (`tests/security/criminalSwitchSalt.test.js` :114, an anchor, the unit's own) and `writerReach` 3 (src identities: PLAUSIBLY the twin's new writers; re-taken by its door, the chair's).
  - `tests/security` WHOLE at f7f1cfe8c: running at 04:00 in `/home/user/wt/r4ip4` (`out/v38/r4ip4/logs/r4-security-whole.txt`, uncommitted there); to be classed into `g-security-final.txt`.
- M (40.7) queued at 04:00 behind that run: `/var/tmp/v18/out/v38/mrun.sh` (the 140, then the pool, ONE mutex hold), outputs `/var/tmp/v18/out/v38/m/`.

### (2) WHAT IS KNOWN OF THE GAP (40.8 (1)): every path where a stored person id stands after the re-key
- FOUND (R4I-PAGE-4, CONFIRMED by tooth (ii), server side, master's stored shape): `factions[].members[].goal.intent.{short,long}.target.id` (e.g. `npc_peat_cutter`); the top-level `factions[]` copy is master's shape, and `powerStructure.factions[].members[]` is PLAUSIBLY the same.
- WHAT THE TWIN RE-KEYS (`src/domain/display/galleryVeilPeople.js :: rekeyPeople`, read whole by this seat): `npcs[].id`; `npcs[].goal.intent.{short,long}.target.id`; `npcs[].allegiance.handler`; STOP 1's `npcs[].relationships[].{from,to,npc1Id,npc2Id,targetId,npcId}` and each tie's `.id`; `relationships[].{from,to,npc1Id,npc2Id}` and `.id`; `{stress,stressors}.cast.roles[].id` and `.cast.levers[].holderId`; `simulationTrace[].targetId` and `.downstreamEffects[].target`; `factions[].members[].id` and `powerStructure.factions[].members[].id`.
- WHAT IT DOES NOT: anything else on a roster copy (`members[].goal…`, `members[].allegiance…`, `members[].relationships…`) and any person reference outside the fixed paths above. 212's `_gallery_veil_rekey` is the same rule for rule (R4I-SQL's brief item 3), so PLAUSIBLY the same gap on both engines: THE MEASURE decides, not this list.

### (3) THE SUCCESSOR'S FIRST ACTS, IN ORDER (40.8 (4))
1. THE MACHINE AND THE POOL: PART 36 section (4) with the names of (5) below (about 33 minutes wall; the pool ONCE, on the -wip; ONE heavy run at a time through the gate mutex, the seat's own probes included: 40.7 (1)).
2. M's RESULT (40.7 (3)). ON THE 140, RUN BY THIS SEAT at the -wip f7f1cfe8c, ended 04:44 UTC (`/var/tmp/v18/out/v38/m/m140/names-table.txt`): 6,160 reads; 356 cast persons on the owner pages, 15,664 cast person-reads served. (i) 0, (ii) 0, (iii) nameless 0, unmapped served cast ids 0: NO STOP. A SURPRISE FROM THE SAME PROBE, sent to the chair 04:45: the server's canonical document differs from the twin's, modulo the bijection, on 77 reads. All are Reveal OFF, at every setting, on 7 today-born places (r3m-town-wartime-0-29, r3m-metropolis-none-1-137, r3m-city-infiltrated-0-42, r3m-metropolis-infiltrated-0-62, r3m-city-infiltrated-1-102, r3m-city-under_siege-1-118, r3m-city-none-1-107). The gates compare signatures and cannot see it. PLAUSIBLY the gap in another dress; its cause is NOT read: THE GAP MEASURE (act 3) TAKES IT AS ITS FIRST LEAD, the diff by path on those 7 places. ON THE POOL: see this item's last line.
   The three counts are: three counts on the 140 and the pool: (i) cast persons sharing (name, crisis, role); (ii) served name differs from the stored name; (iii) nameless cast persons. ANY NOT 0 IS A STOP TO THE CHAIR. If M did not end in this seat, re-run it: `sh /var/tmp/v18/out/v38/mrun.sh`, or the probe `out/v38/r4it/tonight-names.sh <tree> <out> v28tpl [pooldir]` on R4I-TONIGHT's branch, through the mutex.
3. THE MEASURE OF THE GAP (40.8 (1)): with the corrected `storedIdsServed` (`tests/security/personIdBijection.shared.mjs`, (E) + (F)), on both stored sets (today-born, master-born: `out/v38/r4ip3/st/stored-ids.sh`, `dump.sh`) and the pool, both engines, every door and setting: EVERY path where a stored person id of that document still stands after the re-key, by path and count.
4. R4I-SQL-2: a builder that reads 212 and the registry WHOLE as its first act; it cures every path the measure lists, in 212, the rollback, the registry's `people.rekey` path (by its door) and the twin `rekeyPeople`; red first on tooth (ii)'s five and on the stored arm; 001..211 + 212 + down = 001..211; the catalogue; `--check`. THE SUCCESSOR READS 212 AND THE REGISTRY WHOLE before it reads that diff (40.1 (b)).
5. R4I-TONIGHT-2: apply `out/v38/r4it/C-prepared-cure.patch` (`castWantKeyOf`: THE ID FALLBACK GOES, a nameless person takes '': 40.7 (3)) and `C-prepared-shareRenderTwice.patch`, red first; THE ARM IN THREE HALVES (40.7 (2)); OWNER-MOVES counted and named (the "before" is `out/v38/r4it/owner-before-140/`); every "Wants to" pin re-pinned by cause; a moved golden or snapshot NAMED for the owner. `tonightSheet.js` and `crisisFactFindings.js` LISTED for the join. The same builder (or the next) cures `netCurrentExtractorAnchor` at `tests/security/criminalSwitchSalt.test.js` :114, test-only (40.8 (3)).
6. THE QUEUE FOR A QUIET BOX, one at a time:
   - the order count on the pool, twin only (`out/v38/r4ip2/order.sh <tree> <out> '' /var/tmp/v18/t2/pool-v38`; killed here at 02:55 by memory);
   - the build at the tip (`/var/tmp/v18/out/v38/tipbuild.sh`; killed here, rc=137) beside the -wip's (`out/v38/r4ip3/logs/b-*.txt`): the four VERIFY_DIST reds BY NAME, each with its module and the Brotli figure (the -wip's first-paint Brotli is 313,911 B over 8 chunks), for the owner's size signing (40.6 (a));
   - THE COST LAW (VR36): `/var/tmp/v18/out/v38/cost/cost.sh` (prepared, not run: the largest born town, 211 against the -wip's 212, 9 rounds) beside its ceiling; chain A reads 465.0 against 523.2 ms.
7. THE UNIT'S PROOFS, re-run by the seat:
   - the plants red first (R1 at 08081ffdc: 3 of 9 red, `/var/tmp/v18/out/v38/red/`) and green after;
   - STOP 1 and the catalogue (this seat's `sqlproofs.sh`: green at fd7163ba6; re-run on R4I-SQL-2's 212);
   - 001..211 + 212 + down = 001..211;
   - server = twin on every page of a pool; both gates no worse (GATE-1 4 of 92, 7 LOWER, GATE-2 20; this seat's pool read them so at b088fcfc5); row 17's count 0;
   - THE STORED ARM RE-RUN WITH THE CORRECTED MASK;
   - the arms and the walkers; `tests/security` whole classed. R4I-PAGE-4's last run, at its tree c7e60ef59 (= the -wip's tests), ENDED at 04:3x UTC: 9 failed | 2,103 passed | 1 skipped of 2,113 (170 files: 3 failed). Its log is a 120-line tail, so 7 of the 9 are named: `criminalSwitchHandReach` 3 (master's stored shape: the GAP, R4I-SQL-2's), `galleryVeilSignalCopies` 2 (the tip's: PIN-2), `shareRenderTwice` 2 (the Tonight sheet: R4I-TONIGHT-2's). THE OTHER 2 ARE UNNAMED: PLAUSIBLY two more of `criminalSwitchHandReach`'s (R4I-PAGE-4 counted 5 reds there). Re-run and class it whole after R4I-SQL-2 and R4I-TONIGHT-2;
   - `tests/lint` whole by name (52 of 3,304 at c7e60ef59 against the tip's 48: `netCurrentExtractorAnchor` 1, the unit's; `writerReach` 3, RE-TAKEN BY NOBODY YET (40.8 (3)): ONE new identity read off its log, "salt on reasons" (the LIT grammar round-trip names it; the two mutants count 1424 against 1423 and 1425 against 1424 because of it), PLAUSIBLY S1's `{ salt }` argument (`criminalVeilSwitch.js :: presentCriminalGroupings` / `galleryVeil.js :: applyVeil`'s `opts`): the file, symbol and field to be confirmed by the walker's own report before the chair rules);
   - typecheck and eslint.
8. The 34 files: their two reds (S2; VS1's crime-types tooth) are the tip's and leave with VEIL-39's "PIN-2" (40.6 (d)).
9. "TIP? R4-IDS <commit>", with the four VERIFY_DIST reds named as the owner's size signings and the cost law's figure; E116's five steps first if the tip moved.

### (4) THE SMALLEST LIST OF FILES TO GO ON
- This file's section 1 and section 2 (40.1 to 40.8); PART 36 sections 1 and 2; PART 35 section 2.
- `briefs/R4-IDS-BRIEF.md` PART TWO (the cure's design); `briefs/R4I-PAGE-2-BRIEF.md` (WHERE YOU RUN and LAWS, which every later brief cites); `briefs/R4I-TONIGHT-BRIEF.md` (as 40.7 amends it).
- The builders' hand-backs: `out/v38/r4ip4/R4IP4-HANDBACK.md` (the newest), `out/v38/r4ip3/R4IP3-HANDBACK.md`, `out/v38/r4it/R4IT-HANDBACK.md` (R4I-TONIGHT's whole `out/v38/r4it/` is COPIED onto THIS branch: it is not on the -wip), `out/v38/r4ip2/ORDER-STOP.md`.
- Code a builder reads whole: `src/domain/display/galleryVeilPeople.js`; for R4I-SQL-2, 212 and the registry; for R4I-TONIGHT-2, `src/domain/summary/tonightSheet.js` and `src/domain/coherence/crisisFactFindings.js`.

### (5) BRANCHES, WORKTREES, MACHINE (every tip; nothing pushed but the two lane names)
- `lane/veil-38-2026-11-23` (this file, the briefs); `lane/veil-38-2026-11-23-r4ids-wip` at f7f1cfe8c (pushed): fd7163ba6 + S1 + the tip's merge (ec082df83) + R4I-PAGE-3 + R4I-PAGE-4 by fast-forward.
- LOCAL ONLY (this container; their work is IN the -wip but for R4I-TONIGHT's): `lane/veil-38-2026-11-23-r4ipage{2,3,4}-wip`; `lane/veil-38-2026-11-23-r4tonight-wip` at 46f8de49c (docs and the prepared patches, NOT merged: a successor fetches nothing of it from origin, so its whole `out/v38/r4it/` (the patches, the probes, the owner's "before") IS COPIED onto this branch, `docs/chair/2026-11-20/veil/out/v38/r4it/`).
- This machine: the tree `/home/user/wip`; out `/var/tmp/v18/out/v38`; pool `/var/tmp/v18/t2/pool-v38`; template `v28tpl` (`v27x211` + the -wip's 212, unchanged since fd7163ba6: 212 `7a85dec3…`, rollback `b13c5be8…`).
- UNREAD BY THIS SEAT (40.1 (b)): migration 212 and the registry, whole. Read them whole once before the first of: merging a tip that changes either; judging a red that points into either; E116's five steps; R4I-SQL-2's diff.

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

40.6 THE CHAIR, 02:38 UTC, on the seat's 02:27 line: R4I-PAGE-3's results TAKEN.
     (a) THE SIZE RISE IS NAMED FOR THE OWNER, NOT BOUGHT BACK: a ruled first-paint exception, +60 B raw / +14 B gzip (with the
         Brotli figure), "the criminal switch's one-salt import (R4-IDS, S1)"; the engine chunk +327 B and the worker +43 B named beside
         it. The seat re-takes no size baseline and signs nothing. THE FOUR VERIFY_DIST REDS GO BY NAME into this file and the "TIP?" as
         the owner's size signings, each with the module that carries it by the build's own report (measured by a build at af708f2fd
         beside the -wip's).
     (b) `src/domain/display/galleryVeilPeople.js` JOINS galleryServerVeil's RULING 4 register, test-only, with its TRUE ROLE. The seat
         read it: it names `gallery_member_overrides` only in a JSDoc comment (`rekeyServed`'s @param) and writes no row. If it writes
         the column anywhere: STOP. To R4I-PAGE-4.
     (c) THE LINK TWIN, TEST-SIDE, in the proof's shared helper, CITING ITS LAW. The seat found it written in 212 ::
         `get_unlisted_dossier`: `'gallery_share_dm', false`; `_gallery_apply_member_overrides(…, false (settlement_share_dm), …)`;
         `_gallery_veil(…, true (link))` "an unmarked share takes the default veil (the link's readers are players)". The arm: 36/36
         plants red AND 36/36 clean link reads green, on both pools; a clean read still differing is a STOP with its path. The anchor
         is not dropped. To R4I-PAGE-4.
     (d) THE TIP'S OWN REDS outside tests/security (VS1's crime-types tooth; galleryVeilSignalCopies' two city-2 rows) go into
         VEIL-39's "PIN-2"; until then they are classed "the tip's, named" (three lines sent 02:4x).
     (e) `storedIdsServed`'s mask ACCEPTED ON TWO CONDITIONS: (i) it counts, on every document, the STORED ids that have the fresh
         shape (`npc_`/`tie_` + 16 hex), compares such an id as a whole token (never masked) and reds by name if one exists: the count
         said on both stored sets (master-born above all), expected 0; (ii) the mask takes whole tokens only, and two plants stay
         caught (a short stored id served bare; one inside a longer string that is not a fresh token). To R4I-PAGE-4.
     FOR "TIP?": the cost law's figure beside its ceiling (chain A reads 465.0 against 523.2 ms: thin; this unit adds to the same
     read); the 34 files run whole on the merged tree, every red named. THE SEAT'S RECORD: 384,201 by the chair's read at 02:22 UTC.

40.7 THE CHAIR, 03:06 UTC. THE SEAT'S RECORD 452,578 by the chair's read at 03:01. THIS SEAT CARRIES R4I-PAGE-4's return (its diff
     read) and M, then says "VEIL-38 HANDS OVER <branch commit> / <-wip commit>" at its first natural stop after M, or at once at a
     figure over 580,000. Section 1 FINAL. R4I-TONIGHT-2, the order count, the tip build, the cost law and "TIP?" are then the
     successor's, unless the chair says the figure allows R4I-TONIGHT-2 (asked when M is done).
     (1) THE FAULT TAKEN AS SAID; the rule (COMMON-RULES 11): one heavy run at a time through the mutex, the seat's probes included.
     (2) THE TONIGHT ARM, RULED IN THREE HALVES (40.3 (2)'s "equal to the owner's sheet" stood on a wrong premise, the chair's: a
         player's read withholds each person's own goal and secret BY RULE):
         (a) TWO READS OF ONE PLACE print the same sheet, line for line: red first at the tip (39/140 twin, 44/140 server), green
             after; the 140 and the pool; gallery and link; Reveal off and DM.
         (b) THE SERVED SHEET EQUALS THE TWIN'S (the sheet from the served read = the sheet from the twin's projection of the stored
             document, modulo the bijection, every cast person, the same doors and settings); an arm that already holds it for the
             page is named, not built twice.
         (c) ON THE OWNER'S PAGE, nothing-hidden places: every cast person whose line is a ROLE line on both pages carries the SAME
             line on the owner's sheet and the shared one; beside it, COUNTED AND NAMED, NOT RED, those whose line differs because the
             read withholds their goal.
     (3) THE KEY NEVER READS THE ID. The prepared `castWantKeyOf(name, id)` returns `clean(name) || clean(id)`: THE FALLBACK GOES; a
         nameless cast person takes ''. M counts nameless cast persons as a THIRD count beside (i) and (ii); any of the three not 0 is
         a STOP. (The probe already counts "with a card and NO NAME", owner and served.)
     (4) THE ORDER STANDS: R4I-PAGE-4; then M, run by the seat, one run at a time.

40.8 THE CHAIR, 04:01 UTC: R4I-PAGE-4's results TAKEN (the link twin on 212's and 211's own lines; the mask's two conditions).
     (1) THE GAP IS THE UNIT'S OWN, CURED INSIDE R4-IDS BEFORE "TIP?" ("every reference following"): "R4I-SQL-2", a builder that reads
         212 and the registry WHOLE; THE SUCCESSOR dispatches it. MEASURE FIRST, so the cure is whole: with the corrected
         `storedIdsServed`, on both stored sets and both engines, every door and setting, EVERY path where a stored person id still
         stands after the re-key, by path and count. R4I-SQL-2 cures every path listed, red first on tooth (ii)'s five and the stored
         arm. Section 1 (2) writes what is known.
     (2) THE STORED ARM'S "zero stored ids served" OF 02:27 WAS READ WITH THE OLD MASK. IT IS NO PROOF ANY MORE. It is re-run with the
         corrected mask inside the unit's proofs.
     (3) `netCurrentExtractorAnchor`: the unit's own test file, cured test-only by the successor's next builder. `writerReach`'s three:
         RE-TAKEN BY NOBODY YET; this file names the identity (section 1 (3) 7); the chair rules when it has read it.
     (4) THE HAND-OVER AFTER M STANDS; section 1 gives the successor's first acts IN ORDER and the smallest list of files.

## 3. Log (every hour read from `date -u`)
- 00:15 seated (not clocked; the first clock read was 00:17).
- 00:17 chain0 launched on the -wip.
- 00:19 first line to the chair.
- 00:20 chain0's parent stopped before its pool step (the pool waits for S1); the instruments run on.
- 00:21 R4I-PAGE-2's brief and this file written. 00:23 R4I-PAGE-2 seated. 00:2x the chair's 40.1 read. 00:27 red-first R1 started at 08081ffdc.

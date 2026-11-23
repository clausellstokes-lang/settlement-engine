# COHERENCE-VEIL — hand-back, part 8: the seventh seat (211 frozen; its later cures re-homed into 212)

Seat: VEIL-7, lane `lane/coherence-veil-2026-11-11`, from **28f52b1e4** (read back from origin before any work:
equal). Migrations 211 and 212 are FILES, applied nowhere: every database here was an in-process pglite or a scratch
native PostgreSQL 16.15 cluster on this machine (`/var/tmp/cv7`, UTF8, trust auth, unix socket only, no TCP). No
hosted database, no production credential, no `supabase db push`, no `migration repair`, no deploy, no golden's door,
no force push, no commit at or below 28f52b1e4 rewritten.

**TIP:** the commit carrying the latest copy of this file, read back from origin.

**THE NEXT STEP, IF THIS SEAT IS CUT OFF:** nothing of the brief is left. The chair has verified and taken the split. The
security reader's TWELFTH home (hidden houses' names lower-cased in `economicState.compound.inst.names[]` and
`economicState.safetyProfile.compound.inst.names[]`, and on Reveal-DM reads in the trace's `targetId` and causes; the
same at 333b33973) is ruled into 212 by a new seat, VEIL-8; this seat did not start it. §8's stop waits for the join.

## 0. Status

| Step | State | Commit |
|---|---|---|
| 1. FREEZE: 211 and its down file back to 333b33973's bytes | DONE, both checksums proved | 4bed5d71a |
| 2. RE-HOME: everything added to 211 since, in a new 212 with its own down file | DONE | 54dfe6a5a |
| 3. PROVE EQUAL on local chains | DONE: 0 lines, every comparison (§3) | 0ceece414 |
| 4. THE REVIEW'S PLANTED RUN, frozen 211 alone and 211 with 212 | DONE (§4) | 2c5e9356e |
| 5. PINS, TESTS AND RECORDS re-pointed by identity; the ledger's own entries | DONE (§5) | a340c9438 |
| 6. THE OWNER'S STEP FOR 212, as files | DONE, rehearsed (§6) | 45317ee3f |
| 7. THE WHOLE SUITE ONCE at the final tip; this part | DONE (§7): the line's carried set, two environment loads, and two reds of the sixth seat's carried into 212 (named for VEIL-8) | this file's commit |

## 1. The freeze (step 1)

`git checkout 333b33973 -- supabase/migrations/211_server_side_share_veil.sql supabase/rollback/211_server_side_share_veil.down.sql`,
by a new commit; nothing rewritten. Read back from origin's blobs at the tip:

| File | sha256 |
|---|---|
| 211 | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` (the review's §7, the APPLY-211 pack) |
| 211 down | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` |
| the lane's 211 at 28f52b1e4, now gone | `abaad61405bc495e648cac52e4458aa1e646c64b6ec53518eed43ec772e7d458` (down `39258ae3…494c`) |

Between 4bed5d71a and 54dfe6a5a the lane's pins of the sixth seat's server cures were red by construction (named in
4bed5d71a's message); green from 54dfe6a5a with 212 on disk, the pins re-pointed in a340c9438.

## 2. The re-homing (step 2)

**Measured first** (`veil-probe-7/tools/fdiff.py`, `rest.py`; `out/fdiff-*.txt`, `out/rest-*.txt`): against the frozen
211, the lane's 211 adds ten function statements and changes five; every other line that is not a comment is
identical (each grant, each revoke, section 7's loop). So 212 is mechanical, not written by hand
(`veil-probe-7/tools/gen212.py`): each of the fifteen statements copied VERBATIM from the lane's 211 (lead comments
with it, that file's order), the two restated reads' revoke and grant after them as 211 states them, then 211's
section 7 again. By text: 15 of 15 statements equal the lane's 211 byte for byte; the down file's 5 equal the frozen
211's (`out/verbatim-212.txt`).

| | Functions |
|---|---|
| NEW (10) | `_gallery_veil_pieces`, `_embeds`, `_names`, `_hidden_name`, `_sources`, `_tie_pieces`, `_second_homes` (V5-1); `_member_revealed`, `_roster_members`, `_roster_splice` (V5-4) |
| RESTATED (5) | `_gallery_veil_card` (the impression arm), `_gallery_veil_apply` (the sources, then the second homes), `_gallery_apply_member_overrides` (the roster splice), `get_gallery_dossier` and `import_gallery_dossier` (V5-3: the custom-content library leaves the Reveal-DM projection) |

`supabase/migrations/212_share_veil_later_cures.sql` (sha256 `057e215cd86bfaf8c5302e321dd91ce2eb17d1b7975d8cd1e7d96a4231a0489f`):
every statement `create or replace`; no signature of 211 changes; nothing outside 001..211 and itself is referenced
(the helpers it calls from before 211 are 020..128's `_gallery_npc_key`, `_gallery_sanitize_public_json`,
`_gallery_dm_full_json`); no table, column, constraint, policy or row. Its header says what it needs first and why it
exists. `supabase/rollback/212_share_veil_later_cures.down.sql` (sha256
`e1061909a1f0523dcb20a777d5834e12bcd890078214868afc2f7d7b303ab50c`): the five at the frozen 211's statements, verbatim,
then the ten dropped by signature; run before 211's own.

No statement of the new 211 failed to follow the frozen one: no stop.

## 3. Proved equal (step 3)

**The catalogue** (`veil-probe-7/native/rehearse7.sh`: the lane's rehearsal comparison, `veil-probe-6/native/rehearse.sh`,
with the review's `chain.sh` and `catalog.sql`: every function's signature, body, volatility, definer flag, settings
(search_path), grants, owner, return type and full definition; every relation, policy, default ACL, trigger and
constraint; plus every comment, `native/comments.sql`) (`out/rehearse7.txt`):

| | lines that differ |
|---|---|
| (1) 001..210 + frozen 211 + 212, against 001..210 + the lane's 211 (28f52b1e4) | **0** (control, the frozen 211 alone: 20) |
| (2) 203 + frozen 211 + 212, against 203 + the lane's 211 | **0** (control: 20) |
| (3) 001..212, then 212's down file, against 001..211 (frozen) | **0**; the down file twice: 0; 212 again: 0 against 001..212 |
| (4) 203 + 211 + 212, then 212's down file, against 203 + frozen 211 (the owner's pack) | **0** |
| (5) 001..212, then 212's and 211's down files, against 001..210 | **0** |
| (6) 203 + 211 + 212, then both down files and the review's §7.6 tail, against 203 | **0** |
| (7) 212 over itself, on 001..212 and on 203 + 211 + 212 | **0**, **0** |
| (8) the release after an early 211 and 212 (203 + 211 + 212 + 204..212), against 001..212 | **0**; after an early 211 alone: **0** |
| (9) `_gallery_veil*` helpers / callable by anon or authenticated | frozen 211: **40 / 0**; with 212: **50 / 0**; the lane's 211: 50 / 0 |

**The responses, in both stored shapes** (`native/respcmp.sh`, `native/reads.sql`; `out/respcmp.txt`): the stored
rows of the planted run (§4: 96 shares and their maps a shape, every eye shut, DM off and on, live and frozen) loaded
into a chain with the lane's 211 and into one with frozen 211 + 212, every response of the four reads hashed whole:

| Stored rows (planted shard) | Chains compared | responses | lines that differ |
|---|---|---|---|
| master's shape, shard 0 | 203 + the lane's 211 against 203 + 211 + 212 | 192 | **0** |
| master's shape, shard 0 | 001..210 + the lane's 211 against 001..212 | 192 | **0** |
| the new shape, shard 0 | 001..210 + the lane's 211 against 001..212 | 192 | **0** |
| master's shape, shard 1 | 203 + the lane's 211 against 203 + 211 + 212 | 192 | **0** |
| master's shape, shard 1 | 001..210 + the lane's 211 against 001..212 | 192 | **0** |
| the new shape, shard 1 | 001..210 + the lane's 211 against 001..212 | 192 | **0** |
| control: master's shape, shard 0 | 203 + the lane's 211 against 203 + the frozen 211 ALONE | 192 | 312 |
| control: the new shape, shard 0 | 001..210 + the lane's 211 against 001..211 frozen ALONE | 192 | 288 |

(One artefact found and named on the way: two chains built separately draw their two profiles' display names at
random, and the reads print the author's name, so the first release-chain pair differed on every response by
`author_name` alone. The script now names the two profiles alike in both clones before reading.)

## 4. The review's planted-marker run (step 4)

The review's probe (`review-veil-5-probes/planted.probe.jsx`, `planted-summary.mjs`, unchanged, from
`lane/review-veil-3-2026-11-12` at 4700d33eb): two seeds × six sizes × calm and infiltrated, every eye shut by hand,
the DM reveal off and on, live and frozen, the whole payload of each of the four reads searched as text
(`veil-probe-7/native/planted-run.sh`; `out/planted/`):

| Run | Chains | Result |
|---|---|---|
| A. master's shape (db832c892), THE FROZEN 211 ALONE | 203 + 211, 001..211 | **byte-identical** to the review's `out/planted-master.txt`: 24 towns, 4,447 markers, 96 shares, 768 reads, 0 raised, its seventeen rows a chain |
| B. the new shape (333b33973's code), THE FROZEN 211 ALONE | 001..211 | identical to the review's `out/planted-tip.txt` but the chain's label (`qfull` for `qtip`): 7,537 markers, 384 reads, 0 raised |
| C. master's shape, 211 WITH 212 | 203 + 211 + 212, 001..212 | **0 markers, 0 names of houses hidden whole**; 768 reads, 0 raised |
| D. the new shape (this tip's code), 211 WITH 212 | 001..212 | **0, 0**; 384 reads, 0 raised; identical to the sixth seat's `planted-tip-final.txt` but the label |

So the owner's pack (211 alone) is still the state the review cleared, and 211 with 212 is the state the sixth seat's
acceptance read zero on. **A claim of zero, and its instrument:** the review's planted run, whole payloads as text, and
the catalogue and response comparisons of §3 (equal functions, equal responses). The sentence search (secondhome2) and
the attack were not re-run: §3 shows the functions and every response unchanged from the file they read.

## 5. Pins, tests and records re-pointed (step 5, a340c9438)

Each by identity, with the cause (the cures moved from 211 to 212); none loosened; never a baseline row banked.

| Where | Before | After |
|---|---|---|
| `galleryVeilCures.pglite` V5-3 | red control at 210 | red control at 210 AND at 001..211 (frozen: sends both records); LIVE (001..212) sends neither, as before |
| `galleryVeilCures.pglite` V5-4 | red control at 210 | also at 001..211: the unmarked share sends Ada's roster copy, the marked one does not (the review's hand/roster.sql table, now executed in the pin) |
| `galleryVeilCures.pglite` the rollback | 001..211 + 211's down = 210 | 001..212 + 212's down = 001..211 (catalogue, and the five restated functions as text), then 211's down = 210 (as before) |
| `galleryVeilCures.pglite` V5-7 | 211's down drops every helper | 212's then 211's down files drop every helper; the frozen 211 drops none of its forty |
| `gallerySecondHomes.pglite`, `gallerySecondHomes.js`, `publicSafe.js` | "migration 211" for the SQL twin of V5-1 / V5-3 | "migration 212" (one word each, same line: no line-keyed register moves) |
| `scripts/ops/migrationRehearsalCore.mjs` (the wave ledger, the lane's own door: it wrote 210's and 211's) | head 211 | `MIGRATION_TRAIN_REPO_HEAD` 212; wave `share-veil-later-cures` 212..212, forward-only, its down file named; 211's wave unchanged |
| `tests/ops/migrationRehearsal.test.js` | head 211, 90 pending | 212, 91 pending, [212, 212], the boundary list, the wave id |
| `docs/DEPLOY.md`, `docs/CURRENT_STATE.md`, `ARCHITECTURE.md` (the head figure; freshness-pinned) | 211 | 212, and DEPLOY's paragraph for 212 |

Executed at a340c9438: the lane's pins, **13 files, 241 of 241** (galleryVeilCures, galleryServerVeil,
gallerySecondHomes, publicPayloadVeilTotality, allegianceVeil, playerRecordVeiledFace, livingContentRosterPublicDrop,
lib/gallery, importScrub, partyLinkClient, display/publicSafe, display/publicSafeVeil, publicProseVeilInvariance;
`out/pins-after-step5.txt`); the ledger's tests (tests/ops, tests/docs, the migration lints, testRatchet,
implementationPackets), **25 files, 293 of 293**. Gates through `scripts/gate-tail.sh`: strict 0 (1,113, ceiling
1,113), ratchet 0 (167, ceiling 167), eslint 0 on the touched files.

**Doors that are not mine, named and left:**
- `supabase/applied-head.json` (203): the owner's, bumped in the same act as a push. Untouched; the owner's SQL-editor
  steps for 211 and 212 leave it at 203, so the release pushes 204..212.
- The chair's APPLY-211 pack (`lane/chair-2026-11-08 :: docs/chair/2026-11-13/APPLY-211/README.md`, "Afterwards"):
  it says the release applies "204 to 211"; it is now 204 to 212. The pack's files and checksums are unchanged and
  still exact (211 is frozen).
- The review's §7.4 check expects `40 | 0` after 211 alone: still right. PART 7 §7's "`50 | 0` for this file" now
  belongs to 211 + 212.
- The integration line's records (`docs/INTEGRATION_STYLE_2_2026-11-09.md`, the merge book) name "migration 211 as a
  FILE": the merge seat's, at the join.

## 6. The owner's step for 212, as files (step 6, `docs/chair/2026-11-13/veil-212/`)

NOT TO BE RUN BY ANYONE BUT THE OWNER, and only after a security reader clears it. **THIS PACK IS FOR 212'S BYTES AT
45317ee3f (sha256 `057e215c…0489f`) AND WILL BE REBUILT BY THE EIGHTH SEAT** (the chair's ruling of 21:11 UTC, §10):
212 was never in the owner's hands, so the twelfth home's cure goes into it, and every checksum and fingerprint below
moves with it. In the form of the review's §7 and the APPLY-211 pack:

| File | sha256 |
| `1-read-first.sql` | `1dfbfa2fd8f51e07a46984902939edf000ef4b45dd2f51181d335a43e6facc16` |
| `2-apply-212.sql` | `ccccb0251dbbf31d36de55cccca2a91a3a9f461698f0a29c6e94d5bec427f09e` |
| `3-check-after.sql` | `2c80395b33d54b337ab4b516c4a3adcf99d2617e186009fb91272fa4dea09b4b` |
| `4-rollback-ONLY-IF-NEEDED.sql` | `e465abd827a5e7ad1135d7052d30897a5bbf9152459e57d51263f3d0cad67580` |

`1-read-first.sql` (read-only, ends in rollback): (1) the roles' statement limits (211's queries), with the timing
below; (2) **211 in place as frozen**: each of its 45 functions (the forty helpers, the four reads, the member splice)
against its fingerprint (body, volatility, definer flag, settings) built at 203 + 211 and equal at 001..211; STOP if
any differs or is missing; it also says how to recognise 212 already applied; (3) `40 | 0`; (4) d1..d4, what 212
closes, counted (the review's block two, (D)). `3-check-after.sql`: `50 | 0`; the 55 functions against their
fingerprints at 211 + 212 (equal at 001..212 and to the lane's 211 at 28f52b1e4); the search_path pins. The README says
in plain words what 212 changes for a user and that it needs 211 first, and that a release pushed after an early 212
must carry 212 (211 re-run alone puts the second copies back until 212 follows).

**Rehearsed** on clones of 203 + 211 and of 001..211 (`veil-probe-7/native/pack-rehearse.sh`, psql's own exit status;
`out/pack-rehearsal.txt`): read-first `45 | 45` and `40 | 0`; apply exit 0; check-after `50 | 0` and `55 | 55`;
the rollback returns each clone to 211 (0 catalogue lines); read-first again `45 | 45`. On a bare 203 the read-first
block reads `45 | 0` (its STOP); a write planted inside it is refused (read-only transaction). On 203 + 211 with the
96 stored shares of the planted run: d1..d4 = 0, 0, 40, 44. (I first read the apply's status through a `grep` pipe
and it printed `exit 1`, grep's; the script was cured before the recorded run.)

**Timing** (`native/timing.sql`, `out/timing.txt`), the slowest of each read over the same 96 stored shares at 203 +
211 and 203 + 211 + 212, under load on this machine (not the server's figure): gallery 310 → 342 ms, import
176 → 193, link 147 → 161, map 1,618 → 1,639 (that map read is as slow at 211 alone). 212 adds about a tenth.

## 7. The whole suite once, at the final tip (step 7)

`npx vitest run --maxWorkers=2` at **45317ee3f** (the last commit that is not this file; this file's commit is docs
only, and the chair's ruling of 21:11 UTC confines this seat to docs from then on), the ledger branch fetched as a
remote-tracking ref only, no `dist/` present, 20:25 to 21:41 UTC (75 min), to a JSON file
(`veil-probe-7/out/suite-fails.txt` lists every red). **3,229 files (10 failed, 8 skipped); 39,008 tests: 38,836
passed, 10 failed, 162 skipped.** Refs and local config byte-identical before and after the suite (only this seat's
branch and fetched remote-tracking refs moved since the start).

| Red at 45317ee3f | At 28f52b1e4 (the lane before this seat) | At 333b33973 (the reviewed base) | Class |
|---|---|---|---|
| landingFixtureFreshness ×2; foundingWorldBones (19 of 20 forks); proseFamilyContract A1, A2, A3, A5; dossierProseManifest ×3 (the DRIFT tally, the DRIFT arm, the audience arm); newsHeadlineContract and newsVoiceContract at load | — | — | **the line's carried set**, exactly PART 6 §7's 10 tests and 2 loads (red at the line e969a75b7, brought in by the merge) |
| ledgerCitationIntegrity, provenanceMap: fail at load, `git ... refs/heads/review-fixes-2026-07-08`: not a valid object name | the same (PART 7 §6 names ledgerCitationIntegrity) | — | **the environment**: both read a LOCAL branch of that name; this seat fetched the ledger as a remote-tracking ref and created no branch |
| **galleryMapMemberCount.pglite**, **gallerySanitizer.pglite**: fail in `beforeAll`, `function public._gallery_npc_key(jsonb) does not exist` and `function public._gallery_veil_roster_splice(jsonb, jsonb, boolean, boolean, boolean) does not exist` | **RED, the same two errors** (executed: both files at a worktree of 28f52b1e4, 2 failed) | **green** (both files, 47 of 47) | **THE SIXTH SEAT'S, NOT CURED, carried into 212 unchanged by the re-homing.** Each test loads single "net-current" function bodies (latest-wins across the migrations), not a chain; since V5-4 the latest `_gallery_apply_member_overrides` (now 212's, before that the lane's 211's) calls `_gallery_veil_roster_splice`, and `_gallery_veil_member_revealed` calls `_gallery_npc_key`, which those tests do not load; an SQL-language body is checked at creation, so the load raises. Not a fault of what any read sends (every chain-built pin is green, §5). Left for VEIL-8, whose 212 it touches: the cure is in the two tests' loaders (they load the helpers the net-current body calls), not in the migration; I did not make it (the chair's ruling: docs only). The commit that first made them red is plausibly 3c826f2a8 (V5-4: both missing names are its helpers); not bisected. |

No red is the veil's behaviour; one pair of reds is the lane's own (the sixth seat's), named above. The byte ceilings
are not in this run (no `dist/`).

## 8. Carried as it stands, not mine: the sixth seat's stop on the ratings' machinery

PART 7 §7, unchanged: every player export and public-safe object carries `powerStructure.publicLegitimacy.breakdown`,
`.govMultiplier` and `.crimMultiplier`; readers on a non-owner path exist (the Power tab draws `breakdown`'s parts as
chips on every page that draws it, the shared page included, `src/components/new/tabs/PowerTab.jsx`;
`src/domain/display/governanceAccount.js` composes the standing sentence's causes from `breakdown`; the power state
prose reads it; `rulingPowerCoup.js` reads `govMultiplier` and `EngineSections.jsx` prints a hold word from it). The
stop waits for the lanes to be joined. Nothing changed.

## 9. Leaving

Refs and local config snapshotted before the work, before the suite and after (§7: equal); a scratch worktree at 28f52b1e4 for §7's classing; scratch worktrees under the
session's scratch directory (the lane, `master` at db832c892, `333b33973`); `core.hooksPath=.husky/_` written by
`npm ci`'s husky install, as PARTS 6 and 7 found. The ledger branch fetched as a remote-tracking ref only. Databases:
the local cluster at `/var/tmp/cv7` only.

## 10. This brief's rulings, copied in (the chair, session_01FE9mEws7PXYRYdjQPbSX15, 2026-11-13)

> Your job is ONE EXACT THING: MIGRATION 211'S FILE GOES BACK TO THE BYTES THE SECURITY REVIEW CLEARED, and everything
> the lane has added to it since moves into a NEW migration 212, proved to leave the database in exactly the state the
> lane's present 211 does.

> WHY. At 17:17 UTC today the owner decided to apply migration 211 ALONE, early, by the owner's own hand, from an apply
> pack the chair built from the lane's tip 333b33973, the version the security review cleared for that. The sixth seat,
> on the chair's earlier instruction, then wrote its new cures INTO 211's file (259 lines added, 7 changed). The lane's
> 211 is no longer the pack's 211. A MIGRATION THAT MAY ALREADY BE APPLIED NEVER CHANGES: if the two differ under one
> number, production keeps the old body and never receives the new one. The fault is the chair's (it did not freeze the
> file when the owner decided), and the cure is yours.

> THE FIXED POINTS: supabase/migrations/211_server_side_share_veil.sql at 333b33973: sha256
> eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01. supabase/rollback/211_server_side_share_veil.down.sql
> at 333b33973: sha256 ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f. No lane holds a migration
> numbered above 210 but this one: 212 is free.

> THE WORK, in this order, each its own commit, pushed as made:
> 1. FREEZE. Both files return to their bytes at 333b33973 (`git checkout 333b33973 -- <the two paths>`), by a new
> commit; nothing is rewritten. Prove the two checksums above.
> 2. RE-HOME. A new supabase/migrations/212_<a plain name>.sql holds EVERYTHING the lane added to or changed in 211 since
> 333b33973, written so that it runs after the frozen 211 (create or replace; each grant, revoke, comment and
> search_path it needs said again; idempotent), with its own rollback beside the others that returns the database to
> the frozen 211's state. No statement of 212 depends on anything outside 001 to 211 and itself.
> 3. PROVE EQUAL, on the lane's own local chains, in both stored shapes: a database built 001 to 210, the frozen 211
> and 212 against a database built with the lane's 211 as it stood at 28f52b1e4: every function's body, arguments,
> volatility and search_path, every grant and comment, compared by the lane's own rehearsal comparison: 0 lines. And
> 212's rollback after 212 against the frozen 211 alone: 0 lines.
> 4. PROVE THE TWO STATES BY THE REVIEW'S OWN RUN. On the frozen 211 ALONE, the review's planted-marker run finds what
> the review found at 333b33973 (so the owner's pack is still the reviewed state). On 211 with 212, it reads ZERO, as
> the sixth seat's did, in both shapes, DM off and on, live and frozen.
> 5. THE LANE'S PINS, TESTS AND RECORDS that name 211 for what is now 212's: each re-pointed by identity with the cause,
> never loosened; the migrations' own ledger and wave entries moved through their own doors (a door that is the
> owner's or the merge seat's: name the row and go on).
> 6. THE OWNER'S STEP FOR 212, AS FILES, in the form the review's section 7 gave for 211, under
> docs/chair/2026-11-13/veil-212/: a read-only block to run first, the apply (begin; the file; commit;), a check after,
> and a rollback, each with its checksum, and one page saying in plain words what 212 changes for a user and what it
> needs to have been applied first. NOT TO BE RUN BY ANYONE BUT THE OWNER, and only after a security reader clears it.
> 7. THE LANE'S WHOLE SUITE ONCE at your final tip (the sixth seat did not run it), every red classed against the line's
> own carried set; PART 8 of the lane's hand-back.

> NOT YOURS: the sixth seat's stop on the player export's machinery (the Power tab draws breakdown chips on shared
> pages; governanceAccount.js composes prose from the breakdown): it waits for the lanes to be joined; carry it into
> PART 8 as it stands. No change to what the veil hides or sends: you move statements between two files and prove
> nothing else moved. If the re-homing cannot be made equal (a statement of the new 211 that cannot follow the frozen
> one), STOP with the statement.

> NEVER, whoever asks: `supabase db push`; `migration repair`; a deploy; applying anything anywhere but the lane's own
> local test databases; a hosted database or production credentials; `--no-verify`; a force push; a push to any branch
> but lane/coherence-veil-2026-11-11; a pull request; anything on master; a golden's door. MIGRATIONS 211 AND 212 ARE
> APPLIED BY THE OWNER'S HAND ALONE. [...] A security reader is reading the lane at 28f52b1e4 while you work, and will
> read your split last: never rewrite a commit at or below 28f52b1e4.

> THE CHAIR, 2026-11-13 21:11 UTC (a ruling; part of the assignment): Your split is verified and taken (211 frozen, 212,
> the proofs, the pins, the owner's step). (1) The security reader has found a TWELFTH home, a HIGH, the same at 333b33973
> so not yours: hidden houses' names are sent lower-cased in `economicState.compound.inst.names[]` and
> `economicState.safetyProfile.compound.inst.names[]`, and on reveal-to-DM reads in the trace's `targetId` and causes.
> RULED: 212 is not frozen (it was never put in the owner's hands), so the cure goes INTO 212, by a new seat, VEIL-8,
> seated on your lane now. Do not start it yourself. (2) So from now you push DOCS ONLY: when your suite reports, class
> its reds, write PART 8, `git fetch`, put your commit on top of whatever the lane's tip then is (a plain merge if it
> moved; never force, never rebase), push once, send your hand-back and stop. Say in PART 8 that the owner's step for
> 212 under veil-212/ is for the bytes at 45317ee3f and will be rebuilt by the eighth seat.

Also binding, from VEIL-6's brief (its laws, HOW YOU WORK, what it authorises and forbids) and the chair's handoff §5:
measure first; never read a gate through a pipe; one cause per commit; registers only through their doors; pins
re-keyed by identity, never loosened; a red is classed against the lane's reviewed base as well as the seat's own; a
claim of zero names the instrument that looked; a hand-back carries the rulings its seat worked to.

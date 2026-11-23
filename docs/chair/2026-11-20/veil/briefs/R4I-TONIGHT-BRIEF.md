# R4I-TONIGHT — brief (R4-IDS's Tonight sheet cure; VEIL-38, chain B; the chair's ruling 40.3 (2)). WINDOW: a context of 1,000,000 tokens; ITS BUDGET about 250,000 (stop there). WALL TIME: about 2 hours. READ WHOLE: this brief; `src/domain/summary/tonightSheet.js`; `src/domain/coherence/crisisFactFindings.js`; `out/v38/r4ip2/ORDER-STOP.md`; `tests/security/shareRenderTwice.pglite.test.jsx`. Every other file is read by grep, or as one test's body when you re-pin it. NEVER 212, its rollback, the registry or `registry.json`; NOT `src/domain/display/galleryVeil*.js` or `criminalVeilSwitch.js`.

Written by VEIL-38 on 2026-11-23. The owner may veto it. It rides inside R4-IDS: the re-key causes the fault, so the same "TIP?" carries its cure.

## THE FAULT (CONFIRMED by R4I-PAGE-2's measure)
`summary/tonightSheet.js :: castWantOf` picks a cast person's "Wants to" line by `castHash(personId, crisis, role)` over the SERVED person id. The re-key spells that id anew on every read, so a shared page's Tonight sheet gives a cast person another want line on each reload (twin 39 of 140 towns, server 44 of 140). It is not a sort: the served arrays keep their order.

## THE RULING (the chair, 01:01 UTC, 40.3 (2))
THE PICK IS KEYED ON THE PERSON'S NAME AS THE CARD PRINTS IT, with the crisis and the role as now.
- It applies ON THE OWNER'S PAGE AND ON EVERY SHARED READ ALIKE: one code path, so the owner sees what a player sees.
- BOTH CALLERS pass the name: the sheet (`tonightSheet.js`, its `peopleOf` call) and the judge (`coherence/crisisFactFindings.js`, its `castWantOf` call).
- Why: the name is the one identity of a person that every read serves unchanged; a position shifts when a hidden person leaves the array; a served line would put the composer in 212 or a new stored field.
- The chair checked that `castWantOf` is NOT on master, so the live site has never printed these lines.

## WHERE YOU RUN
- Worktree `/home/user/wt/r4it` on the LOCAL branch `lane/veil-38-2026-11-23-r4tonight-wip`, cut at b088fcfc5. The seat makes it; `node_modules` is a link to `/home/user/wip/node_modules`. Commit there by explicit paths; NEVER push, never `--no-verify`, never a pull request.
- Do not touch `/home/user/wip` (the seat's pool reads it), `/home/user/wt/r4ip2` or `/home/user/wt/r4ip3`. A second builder, R4I-PAGE-3, works beside you there.
- YOUR FILES ARE YOURS ALONE: `tonightSheet.js`, `crisisFactFindings.js`, `shareRenderTwice.pglite.test.jsx` and every test that pins a "Wants to" line. R4I-PAGE-3 does not touch them.
- Rules as `briefs/R4I-PAGE-2-BRIEF.md` "WHERE YOU RUN" says:
  - every test run under the `env -u GIT_DIR ...` prefix, to a log, through `sh scripts/gate-tail.sh`, never through a pipe;
  - pglite runs with `--maxWorkers=1`;
  - heavy runs through `sh scripts/gate-mutex.sh --run -- …`;
  - every database local (`PGHOST=/var/tmp/rv7`, template `v28tpl`);
  - the ledger ref fetched before `tests/lint`.
- The box is busy until about 01:35 UTC (the seat's pool).

## ITEMS, IN ORDER (each its own commit; `out/v38/r4it/R4IT-HANDBACK.md` current at every commit)

### M — MEASURE FIRST; STOP if either count is not 0
Write `out/v38/r4it/tonight-names.probe.jsx` plus a one-command `.sh`. Use the shape of R4I-PAGE-2's `order.sh` / `order.probe.jsx` in `out/v38/r4ip2/` (a pool directory's part-A and part-B seeds, reborn, read by the twin and, where a template is given, the server). It counts, per place and read:
- (i) CAST PERSONS OF ONE PLACE WHO SHARE (name, crisis, role). If any do, the tiebreak is their order among the same-named in the served array: name the places.
- (ii) CAST PERSONS WHOSE SERVED NAME DIFFERS FROM THE STORED NAME on any read (Reveal off and on, every gated setting the tell probe reads, server and twin).

Run it on the 140 towns at once. Then run it on the seat's pool `/var/tmp/v18/t2/pool-v38`, once its `doneA.txt` and `doneB.txt` each hold four `rc=0` lines. Report both counts. If either is not 0 on either set: STOP to the seat with the places and change nothing.

### C — THE CURE (only after M reads 0 and 0)
- `castWantOf` keyed on the name as the card prints it (with the crisis and the role).
- Both callers pass it; one code path for owner and shared reads. A person with no name keeps today's fallback, said and counted.
- First, RED FIRST: `shareRenderTwice`'s non-id rows (the Tonight sheet's want line) red at b088fcfc5 (they are; quote the count), then green after the cure.
- AN ARM (in `shareRenderTwice` or a new test; check the mutation-manifest name pattern for the basename): the Tonight sheet is EQUAL on two reads of one place (twin and server), AND EQUAL to the owner's own sheet on nothing-hidden places.
- THE COUNT, ONCE, ON THE OWNER'S PAGE: the cast persons whose want line moves between b088fcfc5's owner page and the cured owner page, on the 140 and on the pool, NAMED (place, person, role, the line before and after) in `out/v38/r4it/OWNER-MOVES.md`.
- EVERY TEST THAT PINS A "Wants to" LINE RE-PINNED BY CAUSE (the grep list includes `tests/domain/tonightWantRegister.test.js`, `crisisFactFindings.wants.test.js`, `tonightOwnGoal.test.js`, `tonightConcreteFirst.test.js`, `crisisBlindWidened.test.js`, `crisisStandInWords.test.js`, `coherence/readerBattery.test.js`, `tests/components/tonightSeatSecret.test.jsx`, `tonightSheetOnce.test.jsx`). Each is re-pinned with a one-line cause, keeping every other byte it held.
- THE SAMENESS DOOR and any register (`tests/lint/.tuning-register.json` and the like) are re-taken BY THEIR OWN DOORS only, each with its proof.
- If the PDF's reference snapshot or any golden moves: NAME it for the owner (file, what moved, why) and sign or re-record nothing. That is a STOP for that file: leave it red and say so.
- `shareRenderTwice`'s DOM-id rows (`dossier-npc-npc-<re-keyed>`) are class (i): re-state them modulo the bijection (`personIdBijection.shared.mjs`) in the same file. This file is yours, not R4I-PAGE-3's.

### L — `tests/lint` WHOLE at your last commit, by name
Count against af708f2fd's 48 of 3,304. The list is `out/v36/seated/lint-whole-fails-af708f2fd.txt` on `origin/lane/veil-36-2026-11-22`; read it with `git show`. Every new red is yours to cure, except `pgliteHookTimeoutRatchet`, which is R4I-PAGE-3's.

### D — TYPECHECK and eslint on every file you touched; the tests directories of what you touched
`tests/domain` files naming `tonightSheet` or `crisisFactFindings` (grep), `tests/components` files naming them, `tests/pdf` files naming them. The counts go in the hand-back.

### FOR THE JOIN
LIST in the hand-back that `tonightSheet.js` and `crisisFactFindings.js` join R4-IDS's manifest (parked lanes hold changes to the sheet), with the lines you changed by symbol.

## LAWS
- 211 is byte-frozen.
- Make no edit to 212, the registry or `registry.json`.
- Red first, and SAID.
- Run `tests/lint` whole after any test change.
- A STOP rather than invention.
- Goldens, reference signings and tuning signatures are the owner's: name them, sign nothing.

YOUR LAST MESSAGE: at most 250 words. Give your last commit; M's two counts on the 140 and on the pool; the red-first count and the green; the arm's figures; OWNER-MOVES' count; the tests re-pinned; any golden or register named; `tests/lint` whole's count; CONFIRMED vs PLAUSIBLE.

# R4I-TONIGHT-2 — brief (R4-IDS's Tonight sheet cure, built; VEIL-42, chain B; the chair's rulings 40.3 (2), 40.7 (2), (3)). WINDOW: a context of 1,000,000 tokens; ITS BUDGET about 350,000 (stop there, with what is left written down). WALL TIME: about 3 hours. READ WHOLE: this brief; `docs/chair/2026-11-20/veil/briefs/R4I-TONIGHT-BRIEF.md` (the first brief: its ITEMS C, L, D and FOR THE JOIN bind you as amended below); `out/v38/r4it/R4IT-HANDBACK.md`; `src/domain/summary/tonightSheet.js`; `src/domain/coherence/crisisFactFindings.js`; `tests/security/shareRenderTwice.pglite.test.jsx`; the two prepared patches `out/v38/r4it/C-prepared-cure.patch` and `C-prepared-shareRenderTwice.patch`. Every other file by grep, or as one test's body when you re-pin it. NEVER 212, its rollback, `src/domain/veil/rosterChoiceRegistry.js` or `registry.json`; NOT `src/domain/display/galleryVeil*.js` or `criminalVeilSwitch.js`.

Written by VEIL-42 on 2026-11-23 (`lane/veil-42-2026-11-23`). The owner may veto it. It rides inside R4-IDS: the re-key causes the fault, so R4-IDS's "TIP?" carries its cure. M IS DONE (PART 40 section 1 (3) 2): on the 140 and the pool (1,808 places, 79,552 reads) (i) 0, (ii) 0, (iii) nameless 0, unmapped 0. You do not re-run M.

## THE FAULT AND THE RULING (unchanged from the first brief)
`tonightSheet.js :: castWantOf` picks a cast person's "Wants to" line by `castHash(served person id, crisis, role)`; the re-key spells the id anew on every read, so a shared page's sheet gives a cast person another line on each reload (twin 39 of 140 towns, server 44 of 140). RULED: the pick is keyed on THE PERSON'S NAME AS THE CARD PRINTS IT, with the crisis and the role; one code path for the owner's page and every shared read; both callers (the sheet's `peopleOf`, the judge `crisisFactFindings.js :: crisisCastSenseFindings`).

## WHERE YOU RUN
- Worktree `/home/user/wt/tonight` on the LOCAL branch `lane/veil-42-2026-11-23-tonight-wip`, cut at 9f9b819f7 (the -wip with the tip merged; the seat makes it; `node_modules` and `.husky/_` are links to `/home/user/wip`'s). `out/v38/r4it/` is on the seat's branch, not the -wip: `git -C /home/user/wt/tonight checkout lane/veil-42-2026-11-23 -- docs/chair/2026-11-20/veil/out/v38/r4it` brings it in (commit it with your first commit, said). Commit by explicit paths, one commit per item; NEVER push, never `--no-verify`, never a pull request.
- Do not touch `/home/user/wip`, `/home/user/settlement-engine` or `/home/user/wt/meas` (R4I-MEASURE, a measure builder, works there beside you; your files and its are disjoint: it edits nothing under `src/` or `tests/`).
- Rules as `briefs/R4I-PAGE-2-BRIEF.md` "WHERE YOU RUN" says (the `env -u GIT_DIR ...` prefix; a log, read from its exit line, never a pipe; pglite with `--maxWorkers=1`; every database local, `PGHOST=/var/tmp/rv7`, template `v28tpl`; the ledger ref fetched before `tests/lint`), and: EVERY RUN OVER A MINUTE through `GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- <cmd>` (ONE heavy run at a time on this box: runs died of memory here when two ran at once; the mutex is shared with R4I-MEASURE and the seat).
- THE POOL is `/var/tmp/v18/t2/pool-v42` (the seat's, made at 9f9b819f7).

## ITEMS, IN ORDER (each its own commit; `out/v42/tonight/R4IT2-HANDBACK.md` current at every commit)

### C — THE CURE, red first
1. RED FIRST at 9f9b819f7: `shareRenderTwice`'s non-id rows (the Tonight sheet's want line): quote the red count.
2. Apply `C-prepared-cure.patch` (say if it does not apply cleanly, and how it was re-applied by hand, line for line), WITH THE CHANGE 40.7 (3) RULES: THE KEY NEVER READS THE ID. `castWantKeyOf` takes the name only (`clean(name)`); a nameless cast person takes '' (M counted 0 such persons on both sets). Its JSDoc says so; the `id` parameter goes from it and from both callers.
3. Apply `C-prepared-shareRenderTwice.patch` (the DOM-id rows re-stated modulo the bijection, `personIdBijection.shared.mjs`), then green.
4. THE ARM IN THREE HALVES (40.7 (2)), on the 140 towns and on the pool, gallery and link, Reveal off and DM, twin and server:
   (a) TWO READS OF ONE PLACE PRINT THE SAME SHEET, line for line: red first at 9f9b819f7 (expected near 39/140 twin, 44/140 server), green after.
   (b) THE SERVED SHEET EQUALS THE TWIN'S (the sheet from the served read = the sheet from the twin's projection of the stored document, modulo the bijection, every cast person, the same doors and settings). If an arm already holds this for the page, NAME it and do not build it twice.
   (c) ON THE OWNER'S PAGE, nothing-hidden places: every cast person whose line is a ROLE line on both the owner's sheet and the shared one carries THE SAME line on both; beside it, COUNTED AND NAMED, NOT RED, those whose line differs because the read withholds their goal.
   The prepared probes `out/v38/r4it/tonight-arm.*` are your start; their trial is `logs/arm-trial-uncured-6.txt`.
5. OWNER-MOVES, COUNTED ONCE AND NAMED: every cast person whose want line moves between the owner's page before the cure and after, on the 140 (the "before" is `out/v38/r4it/owner-before-140/`, taken at b088fcfc5; say whether `tonightSheet.js` and its imports are byte-identical between b088fcfc5 and 9f9b819f7, else re-take the before at 9f9b819f7) and on the pool (its before taken by you at 9f9b819f7, before the cure): `out/v42/tonight/OWNER-MOVES.md` (place, person, role, the line before and after). This is a product change the owner reads: it is NAMED, not judged.
6. EVERY TEST THAT PINS A "Wants to" LINE RE-PINNED BY ITS CAUSE (the first brief's grep list, and `out/v38/r4it/d-files.txt`'s 30 files: run them all), each with a one-line cause, every other byte it held kept.
7. THE SAMENESS DOOR and any register re-taken BY ITS OWN DOOR only, each with its proof. A MOVED GOLDEN OR SNAPSHOT (the PDF's reference snapshot, a golden) IS NAMED FOR THE OWNER (file, what moved, why) AND SIGNED BY NOBODY: leave it red and say so.

### N — `netCurrentExtractorAnchor` (test-only; 40.8 (3))
`tests/lint/netCurrentExtractorAnchor` reds on `tests/security/criminalSwitchSalt.test.js`'s unanchored create-or-replace-function regex (R4I-PAGE-2's S1 walker; R4I-PAGE-4's hand-back: anchor it with `^` and the `m` flag, as the walker says). Red first (the lint test), cure, green; `criminalSwitchSalt.test.js` itself still 6/6.

### L — `tests/lint` WHOLE and `tests/copy` WHOLE at your last commit, by name
`tests/lint` against the tip's 48 of 3,304 (`git show origin/lane/veil-36-2026-11-22:docs/chair/2026-11-20/veil/out/v36/seated/lint-whole-fails-af708f2fd.txt`) and the -wip's 52 (`out/v38/r4ip4` on the -wip names the four new): after N the -wip's own new reds are the three `writerReach` (NOT yours: the chair rules that register; leave it) and nothing else. `tests/copy` WHOLE (N54: its ratchet counts every `!` and every em dash inside a string literal of src/data and src/domain): 0 new.

### D — typecheck (ceiling 167) and eslint on every file you touched; the tests directories of what you touched (the first brief's item D), counts in the hand-back.

### FOR THE JOIN
LIST in the hand-back that `tonightSheet.js` and `crisisFactFindings.js` join R4-IDS's manifest, with the lines you changed by symbol.

## LAWS
- 211 and 212 byte-frozen for you; no edit to the registry or `registry.json`.
- Red first, and SAID. `tests/lint` whole after any test change.
- A STOP rather than invention. Goldens, reference signings and tuning signatures are the owner's: name them, sign nothing.
- STOP EARLY at about 350,000 tokens with what is left in the hand-back (exact commands).

YOUR LAST MESSAGE: at most 300 words. Give your last commit; the red-first count and the green; the arm's three halves' figures (red and green, both sets); OWNER-MOVES' count; the tests re-pinned; N's red and green; any golden, snapshot or register named; `tests/lint` and `tests/copy` whole's counts by name; CONFIRMED vs PLAUSIBLE.

## ADDENDUM — THE CHAIR'S N59 (06:29 UTC 2026-11-23): YOU START NOW, BESIDE R4I-MEASURE, ON TWO CONDITIONS
1. IF R4I-MEASURE's "77" FINDS ITS CAUSE IN WHAT YOU EDIT (the sheet, the judge, or anything the client's page does with a person id), THE SEAT TELLS YOU AND YOU STOP: commit what is done, write the hand-back, end.
2. YOUR PINS: BEFORE EACH COMMIT that moves a printed sentence or a key, a grep of `tests/` for every sentence or key it moves (N57), the hits listed in the hand-back with what each does; `tests/copy` WHOLE in your proofs (N54). A MOVED GOLDEN OR SNAPSHOT IS NAMED FOR THE OWNER, SIGNED BY NOBODY.

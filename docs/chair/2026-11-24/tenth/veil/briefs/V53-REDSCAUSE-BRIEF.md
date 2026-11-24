# V53-REDSCAUSE: WHY each of the trial join's six red files is red (VEIL-53 unit (1); START-VEIL-53 item (1); RULING V1)

The successor of `docs/chair/2026-11-20/veil/briefs/V43-REDSCAUSE-BRIEF.md` (at b126c9813: `git show b126c9813:<that path>`),
which binds where this file is silent, with these changes: THE TREE, A SIXTH RED, THE 80-WORD VERDICTS, NO CLUSTER.

BY READING AND EXECUTION. NO CURE IS BUILT: the chair rules every cure (its lean for the governing paragraph: FAIL CLOSED on a
veiled read). You change NO file of the tree.

## THE TREE AND YOUR FILES
- The trial join: `/home/user/join53` at ba7460c33 (the old join 9e6547f0f + the working line f9531eb3a (point 114: BOTH
  GENERATION LAWS ON, who-rules and fortune) + the veil lane's tip b58abc48b). READ AND RUN ONLY; never edit, commit, stash,
  checkout or reset there.
- Your files: `/home/user/settlement-engine/docs/chair/2026-11-24/tenth/veil/out/v53/redscause/` (probes, one-off scripts,
  `REDSCAUSE.md`). A probe that must run under vitest is placed in a SCRATCH directory under `/var/tmp/v53/probes/` with a
  vitest config pointing at the join's tree, or written as a `*.probe.test.js` there; never inside `/home/user/join53/tests`.
- Large outputs to `/var/tmp/v53/redscause/`, never into your context: grep the count lines, read by range.
- EVERY test or probe run: `cd /home/user/join53 && sh scripts/gate-mutex.sh --run -- <command>`; read the gate's exit from
  `sh scripts/gate-tail.sh <command>` (NEVER through a pipe). Unset git's repository variables for any test run
  (`env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE`).
- NO POSTGRES CLUSTER on this machine. Where the old brief says "the server on the local cluster", use PGlite as the
  repository's own `tests/security/*.pglite.test.js` do (read how `tests/security/rosterChoiceInversion.pglite.test.js` builds
  its database and calls `get_gallery_dossier`); no hosted database, never the `supabase` command, no network.
- No git push, no pull request, no commit: VEIL-53 commits your files after reading them.

## THE SIX (confirmed red at ba7460c33 by VEIL-53, 9 tests: `/var/tmp/v53/six/six.json`, `six.txt`)
1. `tests/generators/fortuneLawMerits.test.js` "U5a (S) ... recomputes the owner's merits" (19/19; first case hxd-hamlet-39:
   expected `{ food: +0, merits: 10 }` to deeply equal `{ prosperity: 15, safety: +0, ...}`).
2. `tests/domain/fortuneLastingSentence.test.js` "U7b (d) ... each wording is one string on ... the widest veil" (2/6; first
   visitor-thorp-52 widest).
3. `tests/domain/display/tensionCause.test.js` "(CAUSES-PARITY-2 F) hxd-city-138" (expected 'Crime is on the rise here.', got null).
4. `tests/security/traditionDescriptionSharedPage.test.js` "TRAD-2 UNIT 2, PROVEN BORN" x3 (NOT VACUOUS; CONTROL; THE CHAIR'S
   QUESTIONS (a) and (b)). Its block "TRAD-4 UNIT 8" is another seat's: read TRAD-2 only.
5. `tests/lint/recentConflictReaders.walker.test.js` (unregistered: `src/domain/seat/holderOfSeat.js :: transferTakerOf`?
   confirm the actual unregistered/stale lists).
6. NEW: `tests/security/rosterChoiceInversion.pglite.test.js` "VR26 ... FIDELITY" (re-derivation != stored on
   `legitimacy.colours` and two more) and "MAIN" (its shrink-only list of rows a visitor re-derives otherwise). The lead
   (VEIL-50's plan (c), reader row 15, PLAUSIBLE): the harness's re-deriver computes the DARK legitimacy while the town is born
   LIT (the fortune law moves the score). Confirm or refute: which re-deriver (`file :: symbol`), which law key it ignores, the
   values on one failing case stored vs re-derived, whether the MAIN list's difference is the same cause, and whether this red
   exists at the line f9531eb3a alone (does the line carry this test? `git -C /home/user/join53 log --oneline -1 f9531eb3a -- <file>`)
   or is the join's.

## FOR EACH (the old brief's (a) (b) (c), and its per-red questions for 1 to 5)
(a) the input path(s) the failing assertion reads, on one failing case, owner against served; (b) which rule withholds or
changes each (the twin's `file :: symbol`, the registry row by grep, 212's function by grep) and since which lane commit
(`git -C /home/user/join53 log --format='%h %s' 8f3b8bf4b..b58abc48b -- <file>`), OR which commit of the LINE moved it (the
lit laws: `git -C /home/user/join53 log --format='%h %s' 9b0ffaa97..f9531eb3a -- <file>`); (c) whether the server (PGlite,
212 as on the tree) serves what the twin serves there, on one case.
For (1)-(2): the (S)/(R)/fail-closed table with costs (files, lines) and LOSSES (from PAGES' (F) governance-paragraph counts:
`git show b126c9813:docs/chair/2026-11-20/veil/out/v43/pages/PAGES.md`; read, do not re-run).
FOR EVERY RED SAY ALSO: is the red THE JOIN'S (it needs both the line's lit laws and the lane), THE LANE'S (red at b58abc48b
alone) or THE LINE'S. One run of the failing file at the lane tip is allowed for this (a scratch worktree:
`git -C /home/user/settlement-engine worktree add /var/tmp/v53/lanetip b58abc48b` with `node_modules` symlinked from
`/home/user/join53/node_modules`; remove the worktree with `git worktree remove` when done).

## REPORT
`out/v53/redscause/REDSCAUSE.md`, at most 100 lines: per red a VERDICT OF AT MOST 80 WORDS with its evidence (a quoted probe
output line, a `file :: symbol`), then (a) (b) (c) briefly; the (S)/(R)/lean table for (1)-(2); CONFIRMED (executed) vs
PLAUSIBLE (read). Your final message: at most 200 words: one line per red ("(n) <cause>; <join|lane|line>; CONFIRMED|PLAUSIBLE")
and the list of files you wrote.

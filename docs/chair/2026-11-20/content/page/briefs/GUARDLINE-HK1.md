# GUARDLINE-HK1: the guard line's pay-cut twin pinned as a differential, and HK1's stale comment. PAGE-12's brief, written 2026-11-22 (the hour is in the commit that adds it)

THE CHAIR'S RULINGS (07:55 UTC 2026-11-22; PAGE-12-HANDBACK ruling 22). Read first: `CLAUDE.md`, `briefs/BUILDER-RULES.md` (every
rule binds), WHOLE: `src/domain/display/guardLineUnderTheLaw.js`, `src/domain/facts/orderForce.js`, `src/domain/facts/lawBand.js`;
and the tests that already cover the guard line (find them: `grep -rln "guardLineUnderTheLaw\|PAY_CUT_TWINS\|payCut" tests`). Read no
wider. This unit touches NO FILE UNDER `src/` BUT ONE COMMENT in `lawBand.js`.

(1) THE GUARD LINE'S PAY-CUT TWIN, KEPT (the chair: option (a)). `guardLineUnderTheLaw.js` reads `orderForceOf(record).payCut` to swap
a "well paid" phrase for its pay-cut twin (`PAY_CUT_TWINS`). `payCut` reads `npcs[].settlementCondition`, which no shared read serves,
so on a shared read the line is the one a place with no cut prints: NOT a leak (not inferable), an OWNER-ONLY TWIN. PIN IT AS A
DIFFERENTIAL, IF NO TEST DOES TODAY: FIRST say whether an existing test already pins all three of the following (name file and
title); if none does, ONE NEW TEST (under `tests/domain/display/`; its basename NOT carrying `walker`), RED FIRST (show the red: e.g.
by a plant that serves the cut on the shared read, or by the swap applied unconditionally, in a scratch copy, never committed):
  (a) on a SHARED READ (`toPublicSafe`, and the gallery's default veil over it), a place WITH the cut prints the same guard line as
      that same place with the cut REMOVED (its twin: the record with the soldier's `settlementCondition` cleared), at EVERY SIZE that
      prints the line (born places, the size list of `tests/components/pageCensusWalk.shared.mjs :: SIZES`, and a planted record if a
      size's births hold no cut: say which sizes are born and which planted);
  (b) the OWNER'S read of the place with the cut prints the TWIN (a `PAY_CUT_TWINS` replacement), and of the place without it the
      plain line;
  (c) the test DISCRIMINATES: at least one case where (b)'s two owner lines differ (else (a) passes vacuously).
  Use `tests/helpers/seedFailures.js :: collectSeedFailures` / `expectNoSeedFailures` for any loop over born places (the seed-loop
  walker reds a bare loop).
(2) HK1's COMMENT in `src/domain/facts/lawBand.js` (LEAVE GIVEN, FOR THE COMMENT ONLY, NOT ONE TOKEN OF CODE): the JSDoc above
`COORDINATED_WAVE_HOOK` / `crimeWaveCoordinated` says every `crime_wave` row draws the coordinated hook first (`historyData.js`, the
row's first hook). Since the trouble pools (HOOKS-BUILD, cure C) the current crime_wave tension draws its hooks from
`src/data/troubleHooks.js` by the mixed key, and the coordinated line (the template's line 0) is one line among the pool: drawn on
some places, not on every one. Reword the comment to say that, truthfully and briefly, keeping HK1's law (where the hook stands, no
line may say nobody runs the crime: the diffuse lines speak of appearances). Show the diff of `lawBand.js` is comment-only (e.g. the
file with comments stripped is byte-identical before and after).

GREEN: the new test green; the guard line's existing tests green; `tests/lint` WHOLE once at your final commit (COMMON-EIGHTH 11),
its failing rows by name (the line's own: `proseCorpusBytes` RAW and GZIP, `proseComposed` A0b; the lighting census is PAGE-12's to
refreeze: report it, do not refreeze). Run every test as `/home/user/page12-bin/nogit.sh sh scripts/gate-mutex.sh --run -- <command>`,
to a log, read by its count lines, never through a pipe (another builder of PAGE-12's shares the mutex: wait, never bypass); set the
ledger ref first (`git branch -f review-fixes-2026-07-08 origin/review-fixes-2026-07-08`). TWO commits by explicit paths ((1), then
(2)), receipts in each; never push, merge or open a pull request; no other file. If your own permission check refuses any action, the
refusal stands: report it and try nothing in its place. Reply at most 200 words: the commits; whether a pin existed (file and title)
or you added it; (a)-(c)'s results and the sizes born or planted; the red; the comment's new words; `tests/lint`'s counts and reds by
name; every judgment this brief did not settle.

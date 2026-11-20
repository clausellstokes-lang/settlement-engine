# S6 FINISH: run the gates of the built T1 cure and close it (brief written 2026-11-20 14:22 UTC by PAGE-5; read BUILDER-RULES.md and T1.md first)

**WHAT EXISTS.** PAGE-2's builder BUILT S6 (`briefs/T1.md`: an anchored tension whose description is its template's
canonical `description` rotates among `[canonical, ...HISTORY_DESC_VARIANTS[type]]` by
`pickVariant(forms, \`${config._seed}::tension::${type}\`)`, zero draws) on origin `lane/page-2-2026-11-20-t1`: 12dc0f96c
(the cure + `tests/data/tensionSpareWordings.test.js`) and 532a74fa2 (re-anchor of `tests/generators/bar4HistoryOneTelling.test.js`
arm (b); a `scripts/mutation-coverage-manifest.json` row for the new test). PAGE-2 read it once. ITS GATES NEVER RAN (no count
lines). RULED: the dead 'overwhelms' branch in `buildHistoricalEvent` (the small-place crime-wave `.replace`) is NOT mended.

**YOUR WORK, IN ORDER.**
1. Worktree `/home/user/wt-p5-s6` on a new branch `page5/s6` cut from `origin/lane/page-2-2026-11-20-t1` (532a74fa2); then
   `git merge --no-edit origin/lane/page-5-2026-11-20` (PAGE-5's lane: the S6 files are untouched there; the manifest json may
   need both rows kept: keep both, never drop one). `ln -s /home/user/settlement-engine/node_modules node_modules`.
2. RED, kept: the new test file and the bar4 re-anchor against the UNCURED code (`git show 17eda8dec:<path>` for
   `src/data/historyData.js` and `src/generators/historyGenerator.js` into the tree, run, restore). Quote the count line and the
   failing titles. GREEN on the cured code.
3. GATES (BUILDER-RULES 5), each to a file, by `sh scripts/gate-tail.sh`: the two test files; EVERY test file naming
   `historyData` or `historyGenerator` (`grep -rlE 'historyData|historyGenerator' tests`, about 56 files: run them in
   batches; a batch's count line each); `npx vitest run tests/lint` WHOLE (the lighting census WILL red for the new test file's
   titles: report its figures, do NOT refreeze: PAGE-5 takes the census); `npm run typecheck:ratchet`;
   `npm run typecheck:domain:strict`; `npm run lint`.
4. A RED THAT IS S6's OWN (a test that quotes a canonical tension sentence the cure now rotates, a golden fingerprint): a pin
   that quotes the text is re-keyed to COMPUTE it (`tests/helpers/drawnProse.js` or the module's export), its title kept, in
   your commit; a stored golden fingerprint is NOT re-recorded: name it with before and after. A red that is not S6's: name it,
   do not repair it.
5. CONFINEMENT (T1 acceptance 4): 60 towns (10 a size, seeds `hxd-<size>-<i>`) born on the base (17eda8dec's two files) and on
   the cure: whole documents equal with `history.currentTensions[*].description` masked; report the share of tensions whose
   text moved, by kind. And the measure after, by size: `node docs/chair/2026-11-20/content/page/measures/page-2/measure.mjs $PWD 50`
   (its first T lines: three forges sharing a tension text) on base and cure, both outputs to files.
6. COMMIT by explicit paths on `page5/s6` (the merge commit of step 1 is its own commit; your fixes one commit), the receipts in
   the message. NEVER push.

**FILES YOU OWN.** The five files of 12dc0f96c/532a74fa2; any test file whose pin S6 moves (step 4), each named in your hand-back.
Nothing else. No new draw. No other stored field may move (step 5 proves it).

**HAND BACK** (at most 400 words): branch and commit(s); red and green count lines; each gate's count line; confinement result
(equal or not, the moved share by kind); the measure before/after by size; every pin re-keyed; every red not yours.

# L2-FINISH: finish the arrival paragraph's deepened pools (PAGE-6's brief, written 2026-11-20 14:14 UTC by `date -u`)

Read `briefs/BUILDER-RULES.md` first (its rules bind you; "PAGE-2" there means PAGE-6), then `briefs/L2.md` (the unit),
then the WIP commit 609c52c5d's message (origin `lane/page-2-2026-11-20-l2-wip`). The 76 lines are WRITTEN and the chair has
read them (`lines/L2-LINES-TO-CHAIR.md`); you do not author lines. If PAGE-6's dispatch message carries rewrites from the
chair, apply exactly those, by index, and nothing else.

**YOUR TREE.** A worktree on a new branch `page6/l2` cut from THE LANE COMMIT named in your dispatch message. Then
`git cherry-pick -x 609c52c5d` (its two data files are byte-identical at the lane commit to its own base; stop on any conflict).

**WHAT IS LEFT, IN ORDER.**
1. RED AND GREEN AGAIN: run `tests/data/arrivalPoolsDeepened.test.js` with the two data files restored to the lane commit's
   (red: quote the count line), then restored (green). Keep both outputs.
2. THE MUTATION MANIFEST: the new test file sits in an enforcer directory and wants its row in
   `scripts/mutation-coverage-manifest.json` (read `tests/lint/mutationCoverageManifest*` for the row's shape; copy a sibling
   row's form). This file is yours for that ONE row.
3. THE GATES (BUILDER-RULES 5): your test; every test file importing `arrivalProse`, `narrativeData` or `arrivalScene`;
   `npx vitest run tests/lint` WHOLE; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`.
   EXPECTED REDS YOU DO NOT CURE (they are PAGE-6's doors): `poolDominance.walker` (ceilings of the deepened pools loose),
   `sovereigntyLightingContract.walker` (the test-file count +1), `proseWiringCensus.walker` (`docs/content/wiring-census.json`
   stale). Name each red with its failing title; any OTHER red is a finding: report it, do not repair it.
4. COMMIT by explicit paths, one commit (\"L2 finished: …\"), receipts in the message. Never push.

**FILES YOU OWN:** `src/data/arrivalProse.js` and `src/data/narrativeData.js` (only as the cherry-pick and any chair rewrite
leave them), `tests/data/arrivalPoolsDeepened.test.js`, `docs/chair/2026-11-20/content/page/L2-LINES.md`, the one manifest row.
Never a census, never a register other than that row, never `--tighten`.

**HAND BACK** (at most 300 words): branch and commit; the red and green count lines; each gate's count line; the reds by title.

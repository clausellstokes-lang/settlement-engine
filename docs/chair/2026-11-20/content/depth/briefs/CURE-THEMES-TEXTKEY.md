# Brief: CURE-THEMES-TEXTKEY (DEPTH-4's builder; the chair's ruling of 21:12 UTC on generationForkCensus A6; written 2026-11-20T21:14Z by `date -u`)

THE STATE. The themes unit (`briefs/BUILD-THEMES.md`, its foot governs) is built on `lane/depth-3-2026-11-20-themes-wip`: 5bce72593 (base
fixture and corpus scan, taken at 2582075ed before any edit) and a097ee662 (the change). Green except ONE test:
`tests/generators/generationForkCensus.test.js` A6 counts 1,065 calls of `fnv1a32` from outside `src/kernel/proseHash.js`, not 55: +1,010 are
`src/domain/hookThemes.js :: themeOfText` hashing a text to look it up in the digest.

THE CHAIR'S RULING (21:12 UTC; neither of the two offered). The stored figure `generationForkRegistry.js :: fnv1a32External` is NOT raised (it counts
keyed CHOICES; a lookup is not a choice), and `hookThemes.js` gets NO private copy of the hash (one home for the arithmetic). INSTEAD:
1. `src/kernel/proseHash.js` gains ONE export, `textKey(str)`, returning the module's own `fnv1a32(str)` by an INTRA-MODULE call. Its doc
   comment says: a content address, the key of a table by a line's text; NEVER a choice; a keyed pick goes through `fnv1a32`, `pickVariant` or
   `pickVariantMixed`, which the fork census counts. No other change to proseHash.js.
2. `src/domain/hookThemes.js :: themeOfText` and the door `scripts/hook-theme-digest.mjs` both use `textKey` (the digest's values cannot change:
   `node scripts/hook-theme-digest.mjs --check` exits 0 with the committed digest untouched).
3. THE GUARD, in `tests/generators/generationForkCensus.test.js` (no new file): ONE assertion that the importers of `textKey` under `src/` are a
   CLOSED LIST, today exactly `['src/domain/hookThemes.js']` (computed by scanning `src/` for an import of `textKey`, never quoted from a grep
   you ran); a new importer reds until it is attributed in that list.
FIRST, BY EXECUTION: read that test file's lines about A6 and its wrapper (about lines 30 to 95) and CONFIRM that an intra-module call is not
counted (a probe, scratch, not committed): say how the wrapper counts. If an intra-module call IS counted, STOP and report (do not invent a shape).

A6 AFTER: the figure must equal the stored 55 with no stored figure moved. The chair asks what the readings are, CALLER BY CALLER: give the
external callers of `fnv1a32` during A6's births and their counts (the line reads 54; this lane reads 55: name the caller that makes the one
more, by file and symbol, e.g. the conflict unit's `src/generators/power/quarrelPick.js`), from a probe whose output you save under
`docs/chair/2026-11-20/content/depth/themes/a6-callers.out.txt` (committed; no sentence quoted).

RED FIRST (record titles and counts): A6 red at a097ee662 (1,065 vs 55), green after; the closed-list assertion: plant a second importer
(scratch, restored) -> red; the totality walker, hookTextOneHome and the answers fixture stay green throughout.

FILES YOU OWN: `src/kernel/proseHash.js` (the one export only), `src/domain/hookThemes.js`, `scripts/hook-theme-digest.mjs`,
`tests/generators/generationForkCensus.test.js` (the one assertion; no figure or constant changed), the probe's output file. Nothing else.
BRANCH: `lane/depth-4-2026-11-20-themes`, cut from a097ee662, in your own worktree under the scratchpad (`git worktree add`; symlink
node_modules from /home/user/settlement-engine). Commit by explicit paths with receipts in the message; never push, never `--no-verify`, never
`git stash`, no census, never the whole suite, never `npm run build` or `tests/build`, no GIT_* variable (GIT_DIR, GIT_WORK_TREE,
GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY, GIT_PREFIX) in a test run's environment, every run to a file read by its count lines via
`sh scripts/gate-tail.sh <command...>`, one test process at a time (`scripts/gate-mutex.sh`). Before any `tests/lint` run:
`git fetch --no-tags --depth=1 origin +refs/heads/review-fixes-2026-07-08:refs/heads/review-fixes-2026-07-08`.
GREEN AT YOUR TIP: `tests/generators/generationForkCensus.test.js` (A1 and A3e are the line's own reds: report their values, identical to
a097ee662's); every test file under tests/ naming `proseHash`, `hookThemes`, `themeOfText` or `hook-theme-digest`;
`tests/lint/hookTextOneHome.walker.test.js`, `tests/lint/hookThemeTotality.walker.test.js`, `tests/lint/poolDominance.walker.test.js`, the
presumption walkers that read `presumptionClasses.register.json` and `presumedThings.widened.register.json` (no row grows); `npx eslint` on
touched files; `npm run typecheck:ratchet` and `npm run typecheck:domain:strict` (to files).
ANSWER (at most 200 words): shas; how the wrapper counts (by execution); red-first receipts; every count line; A6 caller by caller.

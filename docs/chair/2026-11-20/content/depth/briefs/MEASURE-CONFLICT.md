# Brief: MEASURE-CONFLICT (DEPTH-2's measuring helper; written 2026-11-20T15:31Z by `date -u`; the chair's ask of 15:30 UTC)

MEASURE AND PROPOSE ONLY. No file under src/ or tests/ is committed on any lane branch. A PROBE is allowed: a local patch in your
own scratch worktree, committed there DETACHED (never on a branch, never pushed), saved as a .patch file under your output dir.

THE SENTENCE. `powerStructure.recentConflict`, made in `src/generators/power/governanceNarrative.js` (read the file WHOLE):
`deriveBaselineConflict` is a precedence ladder; the stored line is the baseline, resolved through
`resolveSibling(..., BASELINE_CONFLICT_SIBLINGS)` (`src/data/powerSiblings.js`) unless a primary stress narrative overrides it, then
`rewriteFactionPhrasing`. The chair measured (50 a size, seeds hxd-<size>-0..49, line 43ab0f5eb): the grazing line ("A dispute over
grazing rights and water access…") in 27/50 thorps, 24 hamlets, 24 villages; the levies line ("The council has been debating market
levies…") in 31 towns, 27 cities, 30 metropolises. The chair's own script lands on origin/lane/chair-2026-11-08 under
`docs/chair/2026-11-20/seventh/measures/recent-conflict/` (fetch it; if absent, birth the same way as
`docs/chair/2026-11-20/content/depth/measure/born.mjs`, masker included).

THE DIRECTION (the chair's; the owner's rules: say what is already there; never a new trouble; a calm place stays calm; culture never
decides): the default branches choose, BY KEYED HASH WITH NO NEW DRAW (no rng call added or moved; the house's idiom: read
`src/domain/facts/drawDeclared.js` and `src/domain/facts/factVocabulary.js` for how a declared line names its `needs` and how a
keyed pick is made), among several small everyday quarrels, each NEEDING a house or fact the record holds (a mill where one stands;
walls where it has walls; a granary/stores; a market levy only where a live market and a council stand). Same weight as today's
lines: a quarrel, never a crisis, nobody named who is not in the record, no court/temple/guild/market presumed.

ANSWER WITH ONE FILE, `<out>/CONFLICT-MEASURE.md` (out = /tmp/claude-0/-home-user-settlement-engine/05270764-0413-5029-9d3e-568faa330047/scratchpad/conflict/), scripts beside it:
1. By size (thorp..metropolis, 100 places a size: seeds hxd-<size>-0..99), which rung of the ladder each place's STORED sentence
   came from (the function's own conditions; overridden-by-stress counted apart), each rung's share, and the top share of any one
   masked sentence. Cite rungs by their condition text, not by line number.
2. A census of EVERY reader of `recentConflict` (by `path :: symbol`): who prints it (Summary tab, governance paragraph, PDF, the
   calm place's session sheet, anything else), and who MATCHES ITS WORDS (e.g. `simulationSpine.js`, `powerSiblings.js`,
   `boycottReadsRelation`, any lens key, lint corpora, tests that quote it): for each, what it reads and what a new sentence would
   break or need. Format like a SIDE-READERS table.
3. For the GRAZING branch (and the village field-rotation rung beside it) and the LEVIES branch: the facts the record holds that a
   quarrel could stand on, BY SIZE (share of the 100 places where each atom holds: mill, walls, granary/stores, well/water, bridge/ford,
   commons/pasture, ferry, smithy, …, whatever `factVocabulary.js` exposes). Then, for EACH branch, 8 CANDIDATE quarrels written by
   you as DRAFTS (one sentence or two, the same weight and length as today's line), each with its `needs` (vocabulary atoms), the
   share of that branch's places where it holds, and the PROJECTED top share of any one sentence by size under a keyed hash among
   the eligible lines (today's line kept as one candidate). Target: no sentence in more than about 15% of a size's places.
4. WHAT MOVES: a probe (the 16 drafts wired by keyed hash, detached commit) run through the two-tree tool
   (origin/lane/names-3-2026-11-20 `docs/chair/2026-11-20/content/tools/confinement/trees.mjs <before> <after> <workdir> --words=none`)
   and `docs/chair/2026-11-20/content/depth/measure/nonstring.mjs` on golden 525 + census 720: list every path that moved; the
   target is ONLY `recentConflict` and strings composed from it, 0 non-string differences. Anything else: name the path and why.

RULES: work in your own worktree (`git worktree add --detach <scratch>/wt-conflict 105ceb55f`, symlink node_modules from
/home/user/settlement-engine); never touch the main checkout's files; never push; no GIT_* variable in any test's environment; every
run to a file, read by its count lines; one heavy job at a time (another builder runs tests beside you: run births sequentially).
ANSWER (at most 250 words): the file's path; per size the top-share before and projected after; the census count and any reader that
would break; the two-tree result; anything that contradicts this brief.

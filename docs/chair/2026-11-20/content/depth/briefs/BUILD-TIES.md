# Brief: BUILD-TIES (DEPTH-3's builder, tie tranches 1 and 2: 157 pairs; written 2026-11-20T18:53Z by `date -u`; the chair's rulings of 18:46 and 18:52 UTC)

ONE UNIT, built red first. Branch `lane/depth-3-2026-11-20-ties`, cut from the base DEPTH-3 names at dispatch (the lane with hooks tranche 3
merged AND the working line 8196e5712 merged: the goals lane's GR3), in your own worktree under the scratchpad (`git worktree add`; symlink
node_modules from /home/user/settlement-engine). Commit by explicit paths with the receipts in each message; never push, never
`--no-verify`, never `git stash`, no census, never the whole suite, no GIT_* variable (GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE,
GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY, GIT_PREFIX) in a test run's environment, every run to a file read by its count line through
`sh scripts/gate-tail.sh <command...>`, one test process at a time. Read `CLAUDE.md` first. Read WHOLE: `src/generators/power/
relationshipArchetypes.js` (its `createTieProseDraw`, `headOf`, `tieHeadPool`, `bothNamedTensions`, the GR3 branch), `src/data/npcData.js ::
pairProse` and the six archetypes below, `docs/chair/2026-11-20/content/GOALS-3-HANDBACK.md` §0-§2 (on the working line), and
`docs/chair/2026-11-20/content/depth/PROPOSAL.md` (a tie line is a PAIR: description and tension at ONE stored index,
`relationships[].proseVariant`; old_debt: the debtor first).

THE LINES (157 pairs, byte-exact): `lines/TIES-1.md` and `TIES-2.md` (80; DEPTH-1's integrator's edits applied in the NEW lines; the three
`[trust: full]` marks of genuine_respect 2, 7, 12) and `lines/TIES-3.md` (77; DEPTH-2's integrator's edits and the chair's three rewordings
APPLIED IN PLACE: old_debt 2 tension, old_debt 14, mentor_legacy 8 tension; `[trust: full]` on genuine_respect 5). R -> `${r.name}`,
S -> `${s.name}`; each pair `{ line: (r, s) => \`…\`, colour: true }` (with `trust: 'full'` where marked) in `desc` and the SAME index of
`tension`. Per archetype, tranche 1 then tranche 2, in file order: wary_alliance 14+14, peer_rivalry 14+16, old_debt 14+15,
mutual_leverage 14+17, mentor_legacy 12+10, genuine_respect 12+5. Copy every NEW line as written; change no word.

THE LAYOUT (the chair's ruling (A), 18:52 UTC). WHY: a tie is stored by its index, so an index, once it has printed, never changes its text,
for every town already saved and for every later tranche. Each archetype is today [head | the goals reserve] (`pairProse`'s `reserve`:
peer_rivalry, mentor_legacy, mutual_leverage, wary_alliance hold one; old_debt and genuine_respect none). The 157 pairs are APPENDED AFTER
the goals reserve (a new `pairProse` argument after `reserve`, e.g. `drawn`), and THE DRAWN SET becomes ONE explicit index list,
`drawnIndices` (head indices then your tail's), carried on the closure beside `size`/`head`, defined in ONE place and read by the cycle in
`createTieProseDraw` (its modulus and its `(base + used) % …` become a position in `drawnIndices`), by `bothNamedTensions` and by the pool the
first resolution reads (`tieHeadPool`'s successor: the rows at `drawnIndices`). The goals reserve stays reserve: reached ONLY by GR3's repeat
branch, past the drawn set. Every stored index keeps its text and its declared trust. Where an archetype has no tail, behaviour is byte
for byte today's.

TESTS (one new file, `tests/generators/depthTiesAppended.test.js`, that COMPUTES and never quotes a tie sentence: `tests/helpers/drawnProse.js`):
(a) EVERY STORED INDEX KEEPS ITS TEXT: a fixture written AT YOUR BASE (before any edit; `tests/fixtures/`, a hash per archetype per index of
desc and tension rendered with two stand-in names, for EVERY head AND reserve index of all archetypes) equals the same hashes after, byte for
byte; and on the goals lane's own measure towns (`hxd-<size>-0..49`, the six sizes), every stored tie re-rendered from its `archetypeKey` and
`proseVariant` at the base equals its stored description and tension after (record the base side in the fixture too). (b) THE WALKER: for
every archetype, `drawnIndices` names no index twice, no reserve index, every head index, and exactly the tail; its length is head + the
tranche counts above. (c) THE DRAW TAKES THEM: city births `hxd-city-0..4` print at least one tail index of each of the six archetypes taken
together (computed from the pools). (d) TRUST: every index's declared trust equals the fixture's. RED FIRST, each recorded with title and
count: (b) and (c) red at the base; (a) green at the base and green after (it is the guard); plant one appended pair at the END of a head (a
scratch edit, restored) and show (a) red.
THE GOALS MEASURE STAYS: `node docs/chair/2026-11-20/content/goals/measures/goals-final.mjs <tree> 50 <out>` at the base and at your tip:
identical wording 0 at every size, refusal 0 (the tie index repeats and template counts may move: report both columns).

MOVED PINS (each its own commit; seeds out and in named; nothing weakened or skipped; the same number of cases or more; a computed
expectation stays computed; STOP if one cannot be kept at full strength): `poolDominance.walker` (ONLY the six tie-pool rows by its door
`--tighten`; every other row byte-identical; no ceiling rises); `generationForkCensus` A6 if a site number moves (A1 is the line's own red:
report its value); every seed-pinned tie test that reds (`tailTies*`, the goals lane's GR3 tests, `relationshipArchetypes` tests).
GREEN AT YOUR TIP: your test; every test file under tests/ naming `createTieProseDraw`, `relationshipArchetypes`, `STRESS_ECONOMIC_EFFECTS`,
`pairProse`, `proseVariant` or `headOf`; `tests/generators/people` whole; `tests/data/goalFamilies.test.js`; `npx eslint` on the touched files.
A golden that moves (`tests/property/generatorGoldenMaster.test.js` and its manifest readers) is NAMED with before and after, never
re-recorded. ANSWER (at most 250 words): shas; base lengths per archetype (head, reserve) read; red-first receipts; every count line; the
goals measure before and after; every moved pin with seeds out/in.

AMENDED (DEPTH-3, 20:14 UTC by `date -u`; the chair's rule of 20:14 UTC; governs where it differs above): THE TIES ARE BUILT ON THE CURED LAW: the
goals lane cures three reds on the working line first and the chair names that cure's commit; your base contains it. NO STATEMENTS PACKED ONTO A
SHARED LINE in `src/generators/power/` (`tests/generators/powerStructure.test.js` F31 counts them against a shrink-only ceiling). Two GS-1 tests
are in your governing files and must be green at your tip at full strength: `tests/generators/narrativeQualityCorpus.test.js` "relationship
archetype pools hold eight variants each (GS-1)" and "relationship tie prose is drawn without replacement per settlement (GS-1)" (read the
goals cure's form of them first; extend, never weaken), with F31 itself.

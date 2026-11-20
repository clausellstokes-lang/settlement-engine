# CAUSES-DATA: the causes' data file, its predicates and the one sentence function. PAGE-7's brief, 15:13 UTC 2026-11-20

Read first, whole: `briefs/BUILDER-RULES.md`; `CONTRIBUTING.md`; `docs/DESIGN_POOL_CENSUS.md` §1 (the facts
directory's rule: ONE FACT, ONE HOME); `PAGE-5-HANDBACK.md` §4-5 (origin/lane/page-5-2026-11-20: the ruled tables,
verbatim from `measures/page-5/sim.mjs`). The lines, as the chair ruled them, are the ONLY source of every wording:
`lines/CAUSES-LINES-A.md` and `lines/CAUSES-LINES-B.md` (this branch, f8ee0ed50) and crime_wave + guild_conflict's
file as the chair rules it (PAGE-7 gives you its commit; until then build the six kinds and leave those two for last).

## THE CHAIR'S SHAPE (15:10 UTC, ruled; quoted in substance)
1. `src/data/tensionCauses.js`: DATA ONLY, no function, no regex. `TENSION_CAUSES[kind] = { causes: [{ id, rank: 1|2,
   holds: '<predicate key>', hideable: bool, wordings: string[] }], plain: string[] }`, eight kinds, the causes in the
   ruled order. Its header states the hideable rule: a cause holds only where the document in hand shows it; one rule
   for every audience; `hideable` is a LIST for the security reader, not a branch.
2. THE PREDICATES: one module, `src/domain/display/tensionCauseHolds.js`, one pure function per key over
   `(record, facts)` with `facts = factsOf(record)`. A fact with a home in `src/domain/facts/` is read from its home;
   a house test (sim.mjs's `inst` regexes) or a power test with no home gets one THERE by §1's rule, registered as that
   directory requires, never a second reader beside an existing home and never a pattern in the data file.
3. `src/domain/display/tensionCause.js :: tensionCauseSentenceOf(record, tension)`: returns the sentence, or null where
   the kind has no table. The WHOLE pick as measured: the rank-1 causes that hold, picked by keyed hash
   (`src/kernel/proseHash.js :: pickVariant`); only if none, the same among rank 2; else plain; then the wording by
   keyed hash. The display seat (PAGE-4) only calls it.
4. THE KEY (a security rule): the measure keyed on `seed`. Find whether EVERY shared/served document carries the
   town's seed (`src/data/faceHonorifics.js`'s helper met the same question: read how it keyed). If not, or not
   provably, key on the town's NAME and the trouble's KIND (e.g. `<name>::cause::<kind>` and `<name>::held::<kind>`).
   RED FIRST: the same document with `seed` deleted prints the same sentences.
5. `hideable: true` on every cause whose predicate reads a criminal or covert house, a criminal power, the roster of
   powers at all (so rival_power, guilds_rule, merchants_rule, outranked too), the law band or the order force; in doubt,
   true.
6. `{power}`: filled INSIDE tensionCauseSentenceOf by the SIDES TABLE'S OWN FILL (unit 1, c5da1cfb3: find the one
   function that fills `{power}` from the roster by kind, and its reader's test, exactly one power of that kind in the
   document in hand); never a second fill. A cause whose wordings hold `{power}` does not hold where that test fails.
7. ARMS (tests, red first, `tests/helpers/drawnProse.js`'s way: compute, never quote a pool's sentence):
   - totality: eight kinds; every cause's `holds` key exists in the predicates module and every predicate key is used;
     wordings 3 for the ruled WORDS causes, 2 otherwise; plain 3 (great_flood 4); no function or RegExp in the data file;
     every wording pinned (count + a content digest per kind, so a changed wording reds);
   - no wording holds "the place" twice; `{power}` appears only on causes ruled to carry it;
   - the key: seed deleted, same sentences; null for a kind with no table; {power} cause dropped where the test fails.
8. MEASURES (scripts under `docs/chair/2026-11-20/content/page/measures/page-7/`, each run to a file, read by count
   lines): (a) PARITY: on sim.mjs's 900 towns (`hxd-<size>-0..149`) the built predicates hold exactly where sim.mjs's
   do: 0 disagreements, or each disagreement named and reported (a home that differs from sim's regex is the finding,
   not to be bent); then re-point sim.mjs's table at the built module (one source). (b) PROJECTION THROUGH THE BUILT
   FUNCTION with the built key: mixed sizes under 10%, three cities in a row under 25%; (c) THE CAP: no wording above
   about 15% of its kind's towns. Commit each output file.

## FILES (the manifest; stop on any other)
NEW `src/data/tensionCauses.js`, `src/domain/display/tensionCauseHolds.js`, `src/domain/display/tensionCause.js`,
their tests under `tests/` (a basename that avoids the mutation manifest's name pattern); any new home in
`src/domain/facts/` with its registration as §1 requires (name it in your reply); the measures dir; a manifest row if the
repo's implementation manifest demands one for a new src file (say so). Nothing in `historyGenerator.js`,
`historyData.js`, `src/components/`, `src/domain/tension/`, the sides table's file.

## GREEN AT YOUR LAST COMMIT (run each to a file, `sh scripts/gate-tail.sh <cmd>`, never through a pipe)
Your tests red first; every test file of a module you changed; `tests/lint` whole; `npm run typecheck:ratchet`,
`npm run typecheck:domain:strict`, `npm run lint`. Never the whole suite; no census (PAGE-7's). No GIT_* variable in
any test run's environment.

## HOW YOU WORK
Your own worktree and branch `lane/page-7-2026-11-20-causes`, cut from PAGE-7's commit given at dispatch. Commit by
explicit paths with the receipts (red titles, green counts) in the message; author Claude <noreply@anthropic.com>. Never
push, never merge. Reply at most 250 words: commits, red and green count lines, the measures' count lines, the key
chosen and why, new fact homes, every disagreement.

# FORTUNE-1 builders: the common rules (every unit's brief points here)

You are a builder seated by FORTUNE-2 (the integrator since 2026-11-20 12:00 UTC, on lane `lane/fortune-2-2026-11-20`; FORTUNE-1 seated U1) on the settlement-engine program. You build ONE unit, in ONE
commit, red first, on your own branch cut from the integrator's lane tip that your brief names. The integrator reads
your diff line by line and re-runs your red and your green; write for that reader.

READ FIRST: `CLAUDE.md`, then `docs/chair/2026-11-20/content/fortune/FORTUNE-1-PROPOSAL.md` sections 3, 9, 14 and 15
(the rule, the law, the registers, the tuning table's shape), then your unit's brief. The rulings in force (the
seventh chair, 2026-11-20 10:33 UTC; each vetoable by the owner; every figure DRAFT): build the proposal's items 1
to 8 of section 3 exactly; the legitimacy cuts never move; the law lands DARK; no new negative fact enters the sum.

THE LAW (FS5): a world born before the light NEVER changes; while the dial is dark, zero bytes of any born town move.
Every behaviour of the rule branches on the ONE reader of the leaf `src/domain/fortune/fortuneLaw.js`
(`resolveFortuneLawVersion`), read from the config the function already receives or is handed. A behaviour is proven
on a FIXTURE ARM that sets `_fortuneLawVersion: 2` explicitly AFTER `birthConfig` (`birthConfig` clamps an incoming
marker away by design): `generateSettlementPipeline({ ...birthConfig(cfg), _fortuneLawVersion: 2 }, null, { seed, customContent: {} })`
after `await loadGenerationLawPayloads()`.

FILES: only your brief's manifest. NEVER: `supabase/`, `src/domain/veil/`, `tests/security/`,
`src/domain/display/gallery*.js`, `publicSafe.js`, `src/domain/seat/`, `src/domain/rulingPower*.js`,
`src/domain/worldPulse/factionCompetition.js`, `src/domain/summary/`, `src/domain/crisis/`, `src/domain/tension/`,
`src/domain/traditions/`, `src/generators/people/`, the names leaves, `src/data/cultureOfficeTitles.js`, `package.json`,
`package-lock.json`. In `src/generators/factionDynamics.js` (granted to this lane by the chair): ONLY
`computePublicLegitimacy`, its contribution tables and its helpers; never a relation line. A mismatch with the brief:
STOP and report it; do not invent behaviour, chase an adjacent edge case or repair an unrelated red.

TESTS: a new test COMPUTES a pool's sentence or a figure from the source table, never quotes it. Red first: write the
test, run it, see it fail for the reason it names, then build, then see it pass. Every run to a file and read by its
count lines, never through a pipe: `sh scripts/gate-tail.sh npx vitest run <files>`; one gated run at a time:
`sh scripts/gate-mutex.sh --run -- npx vitest run <files>` when another builder may be running. Never the whole suite.
No test run with any of GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX
set. Green at your commit: your new tests; every test file that names a module you changed (`grep -rl <basename> tests`);
`tests/lint` WHOLE; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`;
`npm run validate:tuning-bands`. If a register keyed on a file you changed reds (section 14 of the proposal), re-take it
by its own door (the failing test names it) and say so in your report. A TUNING VALUE IS THE OWNER'S: a new table lands
DRAFT, signed by none.

GIT: commit on your branch only; never `--no-verify`, never a force push, never `master`, never a pull request; do
not push unless your brief says so (the integrator merges your branch). End the commit message with:
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

REPORT (your final message, at most 300 words): the commit; the files; the red you saw (its failing titles) and the
green (the count lines); any register re-taken; anything you stopped on. EXECUTED vs PLAUSIBLE, one sentence.

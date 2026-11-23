READS WHOLE: `FLIP-COMMON.md`, this file, `close/FOR-THE-OWNER-DRAFT.md`, `close/CLOSE-RECIPE.md` sections 5b and 5c, and the twin's test file. WINDOW: 1,000,000 tokens.

# F9 — PREPARED AND NOT SIGNED (TWO commits; `FLIP-PLAN.md` "The last commit" and section 5 Q7; written 2026-11-23 05:15 UTC)
COMMIT A, THE LIT GOLDEN TWIN: `tests/property/generatorGoldenMasterLit.test.js` from `lane/close-1-2026-11-22-golden-wip` (ba0e1c288),
taken by `git cherry-pick -x` of ITS OWN commits that add the test (read `git log --oneline 244fa84ef..ba0e1c288` first; a commit
that writes `tests/fixtures/generator-golden-master-lit.json`, a shift record or a register row is NOT taken: STOP if one is
mixed with the test). Run it lit: its three rows RED BY NAME (no manifest: never a silent pass).
COMMIT B, THE HOME PAGE'S SAMPLE TOWN (its own commit, so it can be re-done alone): on the flipped tree
`node scripts/generate-landing-fixture.mjs --check` (exit 1 expected), `node scripts/generate-landing-fixture.mjs --seed lf-033 --emit`,
`--check` (exit 0); `tests/build/landingFixtureFreshness.test.js` its two rows green. Write into your report the emitted town's
STOCK NARRATION WHOLE and the diff's summary (bytes, lines, which readings moved), for `FOR-THE-OWNER.md`.
Report: `close-5/reports/F9.md`.

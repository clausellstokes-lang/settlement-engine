# NAMES-4 brief 1: a test that reds on any swapped agreeing pair

Written by NAMES-4 (a seat of the seventh chair) for its builder. You build in this checkout, on branch `lane/names-4-2026-11-20`.
You commit; you do NOT push. NAMES-4 reads your diff line by line and re-runs your red and green.

## The finding you cure

NAMES-3 (commit `9ddfcaa5a`) made every verb whose subject is a power, and every "it"/"its" said of one, take that power's own
number. The template hands both forms and the one reader chooses (`src/data/people/powerSentenceName.js :: powerVerb`,
`fillAgreement`). There are about 100 such two-form sites in five files: `src/generators/narrativeText.js` (`agree(name, one, many)`),
`src/data/people/dmPowerLines.js` (`agree`, `crimAgree`, `powerVerb`), `src/data/people/goalFamilies.js` (`{power|one|many}`),
`src/data/stressInstitutionEffects.js` (`{faction|one|many}`) and `src/generators/npcGenerator.js` (the `{has}` slot).

The forms can be written the wrong way round (`agree(x, "are", "is")`) and today many such swaps pass every test. A mutation
pass proved it. `docs/chair/2026-11-20/content/tools/mutation/mutate.mjs <tree> list` lists the sites; `apply <id>` swaps one.
`mutloop.sh` runs a test set against each swap in a scratch tree. Against the existing suites, a swap of the second or third verb
of a run ("still meets, still **signs**, still **presides**") and of most pronoun sites ("its rivals") survives.

## What to build

One test, BY CAUSE, never a list of sentences: for each of the four composers, render every line with a plural-named power and
again with the same power named in the singular. Then show that every word that differs between the two renders is the same word
in its other number, and that it points the right way: the singular render holds the singular form, the plural render the plural.
A swapped site anywhere then reds. The test must also prove that it saw differences at all, so it is not vacuous.

- Put it in `tests/data/powerNumberAgreement.test.js` (extend the file; do not add a new file).
- Cover `PRESSURE_SENTENCES` (narrativeText; see how the file's existing `rows()` calls it), every `PATRONAGE_LINES` and
  `CAPTURE_LINES` line (the file's existing `dmLines()`; also a ruler and an underworld of each number, and the criminals'
  number through `crimAgree`: one guild, two guilds, none), the goal lines filled as `goals.js :: cellCandidates` fills them
  (the file's `goalTexts()`), and the crisis secrets and stakes as `npcGenerator.js` fills them (the file's `fills()`).
- Leave the named survivors out, as the file already does: the two banked narrativeText rows (`controls one district`,
  `still meets, but nothing it decides`) and `CAPTURE_LINES.equilibrium[2]`.
- **Computed, never quoted.** No literal in the test may reproduce a pool's sentence (`tests/helpers/drawnProse.js`). A hand-made
  input must not have a drawn sentence's shape. `tests/lint/proseDrawnAnchors.walker.test.js` reds on both: run it.
- Do not change any file under `src/`. If a correct test reds on the current source, that is a real fault: stop and report it
  with the site and the two renders. Do not fix it.

## Red first, then green, both by execution

1. **Green on the source as it stands**, your test file alone, read through `sh scripts/gate-tail.sh npx vitest run <file>`.
2. **Red on the swaps.** Make a scratch tree:
   `git archive HEAD | tar -x -C <scratch>/mutb && ln -s $PWD/node_modules <scratch>/mutb/node_modules`, copy your test file into
   it, and run `sh docs/chair/2026-11-20/content/tools/mutation/mutloop.sh <scratch>/mutb <scratch>/mutb.txt tests/data/powerNumberAgreement.test.js`.
   Every mutant must be killed except the two doc-comment sites in `goalFamilies.js` (the header's `{power|one|many}` and
   `{power|it|them}`), which no test can see. Report the `DONE` line and every survivor by site. A survivor that is real code
   means your test is too weak there: strengthen it.
   Use the scratch directory (`<scratch>`, NOT `<scratch>/mut`, which NAMES-4 is using) `/tmp/claude-0/-home-user-settlement-engine/f69b8702-78d8-5e5e-b762-f14c179a73a0/scratchpad/`.
   Never run the mutation tool on this checkout.
3. Also green: `tests/lint/proseDrawnAnchors.walker.test.js`, `tests/data/goalFamilies.test.js`, `tests/data/dmPowerLines.test.js`.

## Rules

- Your only file: `tests/data/powerNumberAgreement.test.js`. Never stage anything else. This tree is shared, so stage by path.
- One commit, message `test(NAMES-4): a swapped agreeing pair reds at any site (the mutation pass's survivors)`, ending with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never `--no-verify`. No push.
- No env var GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in any test run.
- Never read a gate through a pipe: use `sh scripts/gate-tail.sh <command>`.
- Report back: the commit sha, the green counts, the mutation `DONE` line and the survivors, and anything that surprised you.

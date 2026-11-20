# NAMES-4 brief 2: three lint reds that NAMES-3's item 3 left

Written by NAMES-4 (a seat of the seventh chair) for its builder. You build in this checkout, on branch `lane/names-4-2026-11-20`.
You commit; you do NOT push. NAMES-4 reads your diff line by line and re-runs your red and green.

## What is red

`npx vitest run tests/lint` at `92d9bdb31` reads 3 failed of 3,271. All three were born at `9ddfcaa5a` (NAMES-3, item 3):

1. **`tests/lint/styleLaw.walker.test.js`**, "no file's count of any struck phrase RISES". The retired word `faction` rose from 0 to 4
   in `src/data/stressInstitutionEffects.js`. The cause is the four `stakes` lines written in the agreement form,
   `{faction|is|are}`, `{faction|suspects|suspect}` (twice `is|are`) and `{faction|believes|believe}`, at about lines 103, 224,
   349 and 437. The walker exempts a plain brace placeholder `{faction}`, but not this form.
2. **`tests/lint/mutationCoverageManifest.test.js`**, TOTALITY: `tests/data/powerNumberAgreement.test.js` has no entry in
   `scripts/mutation-coverage-manifest.json`.
3. **`tests/lint/negativeAssertionAnchor.walker.test.js`**: `tests/data/powerNumberAgreement.test.js` holds one un-anchored
   negative assertion, `expect(out).not.toContain(...)` in the qualified-possessive test.

## The rulings that bind the cure (the seventh chair's; each vetoable by the owner)

- **CV3: a walker is NEVER widened.** Do not touch the style walker, its baseline or its exemptions, the negative-assertion
  walker or its ceiling. Cure the source and the test.
- **CV1: one reader answers a power's number:** `src/data/people/powerSentenceName.js :: powerVerb` (and `pluralPowerName`).
  No template carries a number of its own.
- **CV4: the born towns must not move.** The four stakes must print byte for byte what they print now, for every power of
  either number.

## What to build

1. **The stakes, without the struck word.** Write each agreeing verb of a `stakes` line in a form that does not spell the retired
   word. A precedent already sits in the same file: the migration `secret`'s `{has}` is a word slot named by its singular form,
   filled in `src/generators/npcGenerator.js :: generateCrimeLevel` by `powerVerb(topFaction, 'has', 'have')`. The stakes are
   filled with `govFaction` (see the `stakes:` line there, which today calls `fillAgreement(effect.stakes, { faction: govFaction })`).
   Before you choose, grep every reader of `STRESS_INSTITUTION_EFFECTS` and of a card's `secret.stakes`
   (`src/generators/people/rareSecrets.js`, `src/domain/coherence/crisisFactFindings.js`, `src/domain/summary/tonightSheet.js`,
   `src/domain/crisis/crisisCast.js`, `scripts/`). State in your report whether any of them reads `stakes` as a pattern or
   lists its slots. Do NOT edit `tonightSheet.js` or anything under `src/domain/tension/`.
   Update the file's header note (the NAMES-3 paragraph near the top) to say what the stakes now use. Keep it short.
2. **The manifest entry** for `tests/data/powerNumberAgreement.test.js`. Read the manifest's contract in
   `tests/lint/mutationCoverageManifest.test.js` and `scripts/mutation-coverage-manifest.json`. Prefer a planted regression in
   `scripts/mutation-sweep.sh` that proves the file reds, if that script's pattern fits. Otherwise write a rationale entry whose
   reason is true. That is already proved: `docs/chair/2026-11-20/content/tools/mutation/` killed 98 of 101 swap mutants with
   this file alone, and the 3 survivors are doc comments.
3. **The anchor.** Anchor the negative assertion the way that walker asks (read its header). Do not weaken what it proves.
   The test proves that no `)'s` is left after the bracket opens.

## Red first, then green, by execution, each read through `sh scripts/gate-tail.sh <command>`

- **Red first:** the three walker files red at `HEAD` before your change (one failing test each). Record the counts.
- **Green after:** the three walker files; `tests/data/powerNumberAgreement.test.js`; `tests/lint/proseDrawnAnchors.walker.test.js`;
  every test file whose name or contents name `stressInstitutionEffects` or `generateCrimeLevel`
  (`grep -rl "stressInstitutionEffects\|generateCrimeLevel" tests`); and the presumption doors,
  `node scripts/presumed-things-door.mjs --check` (0 fresh / 0 stale).
- **Not moved:** the stakes must print what they printed. Show it by a test, computed and never quoted: each of the four stakes
  filled the old way (through `fillAgreement` on the old form) equals the new fill, for a singular and a plural power. Or report
  the before and after renders for both numbers. NAMES-4 will run the two-tree confinement tool as well.

## Rules

- Your files: `src/data/stressInstitutionEffects.js`, `src/generators/npcGenerator.js` (the `stakes:` fill only),
  `tests/data/powerNumberAgreement.test.js`, `scripts/mutation-coverage-manifest.json`, and `scripts/mutation-sweep.sh` if you
  plant there. Nothing else. `npcGenerator.js` and `stressInstitutionEffects.js` are line-cited elsewhere, so add no line to
  them: change lines in place, as NAMES-3 did. If you must add one, say so in your report.
- Do not touch `src/generators/people/goals.js` or `src/generators/people/ties.js`: another seat works there.
- This tree is shared, so stage by path. Make one commit, message
  `fix(NAMES-4): item 3's three lint reds (the stakes' struck word, the manifest entry, the anchor)`, ending with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never `--no-verify`. No push.
- No env var GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in any test run.
- Report back, in under 300 words: the commit sha; the red and green counts; how each stake now reads its number; the readers
  you checked and what they do with `stakes`; anything that surprised you.

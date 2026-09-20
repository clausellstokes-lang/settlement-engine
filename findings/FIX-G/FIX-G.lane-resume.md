# FIX-G — LANE RESUME NOTE (paused at the gate, 2026-09-19)

**Lane:** FIX-G (Opus). **Worktree:** `$SP/lane-fix-g`. **Branch:** `fix-food-card-2026-09-19`, base `ad7ddf2c9`.
**Nothing gated has run.** All edits are complete and STAGED. Nothing is committed yet.
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`

## Files staged, per fix

**FIX-G2 (display only; zero goldens, zero `src/domain`, zero `src/generators`):**
- `src/components/new/tabs/OverviewTab.jsx` — the caption re-worded; the bar given a rung-2 name through `tokenCase` and a gloss
- `src/pdf/sections/Overview.jsx` — the caption's byte-for-byte twin, re-worded identically
- `tests/components/g5FirstSurveyCopy.test.js` — the caption pin moved (declared reword) + the new name/gloss pin; one negative, anchored
- `tests/components/g5FirstSurveyPdfTwins.test.js` — `SYSTEMS_HEALTH_CAPTION` updated (declared reword)
- `tests/components/statBandsOverDigits.test.jsx` — the DOM proof: the row names both facts; the old caption is gone (anchored)

**FIX-G1 (the one-site cure, built TO THE GOLDEN):**
- `src/generators/economy/viability.js` — `buildViabilitySummary` takes the PUBLISHED `dependencies` list; one `dependencies` array read by the publication, the sentence and the metric
- `tests/generators/foodModelSingleWriter.test.js` — the convicted row (with its habitat as the liveness anchor) + the whole-corpus sweep

## THE GATED BATCH — run in this order, ONE TEST DIRECTORY PER INVOCATION

Every vitest line goes through the mutex, shared tier, worker-capped. ⛔ A line with no printed
test count DID NOT RUN. `UPDATE_GOLDEN` / `GOLDEN_SHIFT_SIGNED` / `UPDATE_VOICE_BASELINE` /
`UPDATE_EPISTEMIC_ALLOWLIST` are FORBIDDEN to this lane.

```sh
cd "$SP/lane-fix-g"
G='GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2'
```

1. **FIX-G1's arms** — expect GREEN (2 new tests).
   `… -- npx vitest run --pool=threads --maxWorkers=2 tests/generators/foodModelSingleWriter.test.js`

2. **FIX-G2's arms + the label-case neighbours** — expect GREEN.
   `… tests/components/g5FirstSurveyCopy.test.js tests/components/g5FirstSurveyPdfTwins.test.js tests/components/statBandsOverDigits.test.jsx tests/components/dossierLabelCase.test.jsx tests/components/dossierRawKeys.census.test.jsx`

3. **The Systems Health DOM pin** (no `<p>` under the bars; BAR_LABELS) — expect GREEN.
   `… tests/ui/generalDeskTabFlow.test.js`

4. **The ladder's screen/print parity** — expect GREEN. `'FOOD SECURITY'` is deliberately NOT
   added to the vocabulary (see the evidence file §6b), so this must not move.
   `… tests/pdf/labelLadderParity.test.jsx`

5. **The prose manifest** — expect GREEN, ZERO rows move (measured: the dependency count keys no cell).
   `… tests/property/dossierProseManifest.test.js`

6. **⛔ THE GOLDEN MASTER — EXPECTED RED ON EXACTLY ONE ROW, ON ITS OWN INVOCATION.**
   `… tests/property/generatorGoldenMaster.test.js`
   The ONLY admissible red is the hash of
   `town|germanic|mountain|mountain_pass|civilized|golden-master-v3`, caused by that record's
   `economicViability.summary` reading "has 5 operational dependencies" where the fixture
   recorded "has 6". **ANY second row, ANY other key, or ANY prose-manifest row moving is a STOP** —
   do not re-record, do not set `UPDATE_GOLDEN`. The re-record rides EM-P1's signed golden door
   at train EM-T4 and is the chair's act under the owner's signature.

7. **The lint instruments my edits touch** — expect GREEN.
   `… tests/lint/negativeAssertionAnchor.walker.test.js tests/lint/mutationCoverageManifest.test.js tests/lint/proseNumerics.test.js tests/lint/chartProportionCensus.walker.test.js tests/lint/styleShorthandLonghand.walker.test.js tests/lint/copyCorruption.test.js tests/lint/dossierMountRegistry.walker.test.js tests/lint/economyReadModelCoverage.walker.test.js`

8. **The voice mechanics walker** — expect GREEN (no em dash, no exclamation point added on
   either surface; the JSX baseline is `{}` and must stay empty).
   `… tests/copy/voiceMechanics.test.js`

9. **The lighting contract, ONCE, ON ITS OWN** — EXPECTED RED: this lane adds **4 test titles**
   (2 in `tests/generators/foodModelSingleWriter.test.js`, 2 in `tests/components/`) and 0 test
   files. Record the measured tuple and the delta. ⛔ **NEVER REFREEZE IT** — the refreeze is the
   train's terminal act and the chair's.
   `… tests/lint/sovereigntyLightingContract.walker.test.js`

10. **eslint on every touched file** — expect clean.
    `npx eslint src/components/new/tabs/OverviewTab.jsx src/pdf/sections/Overview.jsx src/generators/economy/viability.js tests/components/g5FirstSurveyCopy.test.js tests/components/g5FirstSurveyPdfTwins.test.js tests/components/statBandsOverDigits.test.jsx tests/generators/foodModelSingleWriter.test.js`

11. **The goldens are byte-untouched** (ungated, run last as the receipt):
    `shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json`
    Must still read
    `7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e` and
    `921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41`.

## What remains after the batch

- **Two commits on `fix-food-card-2026-09-19`, by explicit pathspec, FIX-G2 first**, each after
  reading `git diff --cached` whole; the golden's named red goes in FIX-G1's body, with the
  lighting tuple and this lane's delta, and the measured byte delta.
- `git show --stat HEAD` must name exactly the fix's paths; `git status --short` empty after both.
- Write `$SP/lane-fix-g-scratch/FIX-G.receipt.md` and report.

## Already measured, so the batch does not need to re-establish it

- **FIX-G1's byte delta (the zero-slack worker, ceiling 1,401,208 EXACT, monotone-down):**
  `viability.js` minified **13,574 → 13,527 B, delta −47 B**. **NEGATIVE — the bundle shrinks and
  no re-mint is owed.** (Raw grew +1,557 B, all of it comment, which does not survive minification.)
- **The cure, executed over all 525 golden configurations in the golden's own call shape:**
  before, 370 rows state a count and **1** disagreed (Schwarzwalde, sentence 6 vs list 5); after,
  370 state a count and **0** disagree. The habitat is untouched — "Severe Food Import Dependency"
  is still filed under `issues`.
- **FIX-G2's premise, reproduced independently at this base** on a 168-row grid: 12 of 30 bar
  values carry more than one band word, 106 rows print an alarming word beside a bar at or past
  half, 0 print the reverse. Full evidence: `$SP/lane-fix-g-scratch/FIX-G.evidence.md`.
- **No byte ceiling is in play for FIX-G2**: `OverviewTab.jsx` is behind `lazy(() => import(…))`
  with no `manualChunks` rule and no `tests/build` ceiling; `max-lines` headroom is 488 effective
  against 600.

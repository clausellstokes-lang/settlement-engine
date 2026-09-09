# LANE STRICT-CLEAN — receipt (COMPLETE)

Status: **COMPLETE — landed as `c26c85fc7`, dock porcelain 0, 16 cars over product `90702c3e9`**
Dock: `$SC/laneINTEG-tree`, detached. Started at `f560b0586` (15 cars, porcelain 0).
`node_modules` left symlinked throughout; no `npm install` run.

## THE JOB, AND WHAT IT ACTUALLY WAS
`npm run typecheck:domain:strict` exited 1 on two new-file overruns:
`defenseStateProse.js` +1 (baseline 0), `generalStateProse.js` +14 (baseline 0). Ceiling 1121.

**Eleven of the fourteen were ONE problem in three faces: the general desk's JSDoc described a
smaller desk than the desk.**
- `@param readings` named 13 fields; the body has always reached for FIVE MORE — `conflicts`,
  `govFaction`, `structuralViolations`, `structuralSuggestions`, `coherenceNotes`. That is 6×
  TS2339 directly, plus 2× TS7006 because the two `.map` callbacks over the two undeclared
  ARRAYS had nothing to be typed from. Declaring the five cured all eight. Each row names only
  what the desk reads off it (`intensity` for the pool cut; `parties`/`issue`/`stakes` for slots).
- **`GENERAL_STATE_PROSE_SILENT` carries eight positions and its `@type` named four.** The desk
  declares `@returns {typeof GENERAL_STATE_PROSE_SILENT}`, so that annotation IS the return
  contract — the desk's own return was unassignable to its own declared type (TS2322), and
  `conflicts`/`situation`/`origin`/`warnings` were positions the one caller could not read off
  the type at all. Completed to all eight against the existing `LegibilityRung` typedef.

The other four were ordinary:
- `CRIMINAL_STRUCTURE_POOL` (defense) and `TIER_OVERLAY_OF` (general) gain
  `@type {Readonly<Record<string, string>>}` — the annotation the other ~20 pool constants in
  this directory already carry. These two were the only pool constants indexed by a PRODUCER
  value, which is why only these two reddened. 2× TS7053.
- `num`, `originLine`, `warningLine` gain JSDoc params. 3× TS7006 (one is `num`, in the defense
  count's sibling position).
- `phraseFill` `@param` widened `string` -> `unknown`. A CORRECTION, not an escape: the body's
  first act is `text(value)`, whose own signature is already `{unknown}`; both call sites read a
  conflict row off the caller's record.

⛔ NOT DONE: no baseline widened, no ceiling raised, no `@ts-ignore`/`@ts-expect-error`, no
declared-overrun row, no register act, no rebase, no push, no ref write. **ZERO runtime change
in either file** — every edit is inside a comment or a JSDoc annotation.

## PROOF LOG — every exit captured in-shell
1. **Strict census BEFORE first edit** (`npx tsc --noEmit -p tsconfig.domain-strict.json`, raw):
   `TOTAL_DOMAIN_ERRORS=1136  FILES=77`. general 14, defense 1. 15 over the 1121 ceiling.
2. **Strict census AFTER**: `TOTAL_DOMAIN_ERRORS=1121  FILES=75`.
3. ⭐ **THE BACKFIRE CHECK** (a lane measured that typing holes as `unknown` can ADD errors).
   Full per-file census diff, before vs after, is EXACTLY two deletions and nothing else:
   ```
   5,6d4
   <    1 src/domain/display/stateProse/defenseStateProse.js
   <   14 src/domain/display/stateProse/generalStateProse.js
   ```
   No file gained an error. No error moved. `grep stateProse strict-after.txt` -> (none).
   Artifacts: `strict-before.txt` `strict-after.txt` `census-before.txt` `census-after.txt`.
4. ⚠ **THE PROOF IS THE COMMAND, NOT THE TEST NAMED AFTER IT.** `tests/lint/domainStrictBaseline`
   passes 12/12 while the ratchet it is named for exits 1 — `DOMAIN_STRICT_TSC_CMD` and
   `DOMAIN_STRICT_BASELINE` are injected seams, so it never runs tsc against the live tree.
   ```
   $ npm run typecheck:domain:strict ; E=$?
   [domain-strict] ✓ no strict-type regressions (1121 errors, ceiling 1121).
   DOMAIN_STRICT_EXIT=0
   ```
   **Re-run AFTER the commit** (pre-commit `eslint --fix` can re-stage and blind `git diff HEAD`):
   `POST_COMMIT_DOMAIN_STRICT_EXIT=0`, same line. Porcelain 0 after commit; hook changed nothing.
5. **THE SECOND TYPECHECKER** (the two-typechecker receipt law — they disagree):
   `npm run typecheck:ratchet` -> "OK — no type regressions (173 error(s), ceiling 173)" exit 0.
6. **The three desk suites**, individually, exits captured:
   `generalStateProseDesk 31/31 exit 0` · `defenseStateProseDesk 65/65 exit 0` ·
   `economyStateProseDesk 40/40 exit 0`. Together **136 passed (136), exit 0**.
   ⚠ BRIEF CORRECTION: the brief said "135 together, and the defense one is now 31". Measured:
   136 together, and it is the GENERAL desk that is 31 — defense is 65.
7. `npx vitest run tests/domain/` -> **974 files, 16271 tests, 0 failed, exit 0**.
8. `npx vitest run tests/lint/` -> exit 1, **13 failed / 2118 passed**, and the 13 are EXACTLY
   the banked register arms the brief predicted, by name: clampPrimitiveBaseline ×1,
   observedShapeReaders ×2, proseNumerics ×2, sovereigntyLightingContract ×1, tuningRegister ×3,
   writerReach ×4. **No fourteenth.**
9. `npx eslint` on both files -> exit 0. One pre-existing warning (below).

## ⚠ ONE BANKED RED NAMES MY FILE AND IS NOT MINE — proved, not assumed
`tuningRegister` P3 reports `src/domain/display/stateProse/generalStateProse.js: 0 -> 1`.
That is the `0.05` five-percent food threshold at **line 516, present in the committed HEAD
before this lane touched anything**. Decimal count is byte-identical: `HEAD=2, WORKTREE=2`.
Every line this commit adds that contains a digit at all is one of two prose comment lines
carrying DS-GEN block ids. Pre-existing new-file register debt for the chair's act — not
absorbed, not re-baselined. (Its P2 sibling names `economyStateProse.js: 2 -> 4`, a file this
lane never opened.)

## FOR THE CHAIR — one pre-existing item found in passing, NOT fixed
`defenseStateProse.js:80` imports `MONSTER_THREAT_TIERS` and never uses it (eslint
`no-unused-vars`, warning only, exit still 0). Confirmed present at `HEAD~1`, i.e. it arrived
with a sibling lane's landing, not this one. Left alone: out of remit and a dead-read cure can
ACTIVATE a producer behind it.

## DELIBERATELY DEFERRED — documented, not a bug to re-find
`systemsHealth`, `origin` and `warnings` are declared `ReadonlyArray<LegibilityRung|null>`
although their `.filter((line) => line && line.sentence)` leaves no nulls at runtime. Declaring
them non-nullable requires turning those three filter callbacks into JSDoc type predicates — a
RUNTIME edit for a type-only gain, on a dock holding three lanes' only assembled work, and this
lane's remit was the types. The declared type is SOUND (a supertype of the truth), never false.
`conflicts` stays nullable on purpose: that null is contract, kept IN PLACE so a caller's index
pairing cannot slip.

## RETROVALIDATION ROW
| # | Claim | Grade | The receipt |
|---|---|---|---|
| 1 | Both files are strict-clean | **CONFIRMED** | census-after: 0 `stateProse` rows; `grep` -> (none) |
| 2 | The ratchet passes | **CONFIRMED** | `npm run typecheck:domain:strict` exit 0, twice (pre- and post-commit), 1121/1121 |
| 3 | The cure traded nothing elsewhere | **CONFIRMED** | per-file census diff = 2 deletions, 0 insertions; 1136→1121 = exactly the 15 in scope |
| 4 | The second typechecker did not red | **CONFIRMED** | `typecheck:ratchet` exit 0, 173/173 |
| 5 | The three desk suites stayed green | **CONFIRMED** | 136/136 exit 0; per-file 31/65/40 all exit 0 |
| 6 | tests/domain/ is fully green | **CONFIRMED** | 974 files / 16271 tests / 0 failed / exit 0 |
| 7 | No fourteenth lint red | **CONFIRMED** | 13 failed, arm names match the predicted six files exactly |
| 8 | The tuningRegister row naming my file predates me | **CONFIRMED** | `0.05` at line 516 of `git show HEAD:…`; decimal count HEAD=2 = worktree=2; no added line carries a decimal |
| 9 | The pre-commit hook did not edit my files | **CONFIRMED** | porcelain 0 and empty `git diff HEAD` after commit; strict re-run exit 0 |
| 10 | The eslint warning is a sibling's, not mine | **CONFIRMED** | present at `HEAD~1` line 80; my only hunk in that file is `@@ -579 +579,10 @@` |
| 11 | No register act, no push, no ref write | **CONFIRMED** | diffstat is 2 source files, 55+/6-; `git log` shows one new car; no `refs/` command issued |
| 12 | Runtime behaviour is unchanged | **CONFIRMED** | every hunk is inside a comment or JSDoc; 16271 domain tests unchanged and green |

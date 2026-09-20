# LANE-T2-TERMINAL-CURE — the lane's receipt to the chair

**Lane:** Opus cure lane, session 7d3418f8. **Worktree:** `$SP/lane-em-b3b` on `fixes-2026-09-18-consist`.
**Started** 2026-09-19 14:14:22 EDT (read `date` in the same call as the stamp). **Base:** `fefb2bb29`, clean.
**Commit:** `023eda2ec` — one commit, on the branch, by explicit pathspec. **Never pushed.**

## Outcome

All four of check 2 run 15's terminal reds are cured, and both cures were proven by executed runs
rather than argued. The cure is exactly the chair's ruling; nothing was improvised and no STOP
condition fired.

## Verb 1 — the slot (CONFIRMED)

`git status --short` empty, `git log --oneline -1` = `fefb2bb29`, branch = `fixes-2026-09-18-consist`.

## Verb 2 — the negative control, BEFORE the cure (CONFIRMED, both reds reproduced)

```
tests/copy/voiceMechanics.test.js                     Tests  2 failed | 28 passed (30)
  src/generators/pipeline.js: baseline em:2 bang:0 → current em:3 bang:0
  expected 29 to be less than or equal to 28
tests/lint/negativeAssertionAnchor.walker.test.js     Tests  2 failed | 7 passed (9)
  "tests/generators/pipelinePinnedMode.test.js: 2 un-anchored negative assertion(s)
   at line(s) 249, 250 (frozen ceiling 0)"
  quarantine EXACT arm: received {"tests/generators/pipelinePinnedMode.test.js": 2, …3 rows}
```

Both match the brief's predicted counts exactly. The walker named lines **249, 250** — the two
bare negatives the ruling targets, and no others.

## Verb 3 — the cure (two files, four hunks, nothing else)

**Cure A** — `src/generators/pipeline.js`, the partial-pin refusal inside `runPipeline`:

```
-          + `only [${supplied.join(', ')}] — pin every chooser of a step or none of them.`,
+          + `only [${supplied.join(', ')}]. Pin every chooser of a step or none of them.`,
```

Grounded in `docs/VOICE_AND_TONE.md` §6, whose first table row is "Break between two complete
ideas → **Period. New sentence.**" — so the capitalised `Pin` is the documented form, not a choice.
The file's two baselined em dashes (the two `Pipeline strict:` messages, lines 218 and 240) are
untouched. `EM_BUDGET_GENERATORS` was **not** raised, the voice baseline was **not** edited, and
the character was **not** encoded to dodge the walker.

**Cure B** — `tests/generators/pipelinePinnedMode.test.js`: the A4 `toThrow` substring updated
identically; A5's two bare negatives replaced with `expectAbsentWithAnchor(order, '<name>',
POPULATION_STEP, 'A5: no split registration')`; the import added beside the other helper import.
No `// anchored:` marker, no quarantine row, no walker edit, **no test title changed and no test
added or removed**.

`git status --short` after the edits was exactly ` M src/generators/pipeline.js` and
` M tests/generators/pipelinePinnedMode.test.js`.

## Verb 4 — the receipts (CONFIRMED; every run through `gate-mutex.sh`, SHARED tier, `--pool=threads --maxWorkers=2`, one test directory per run; every line below is quoted from real output and every run printed a test count)

| # | Target | Count line |
|---|---|---|
| 4a | `tests/copy/voiceMechanics.test.js` | `Tests  30 passed (30)` |
| 4b | `tests/lint/negativeAssertionAnchor.walker` + `sovereigntyLightingContract.walker` + `mutationCoverageManifest` | `Tests  53 passed (53)` |
| 4c | `tests/generators/pipelinePinnedMode` + `pipelineStrictMode` | `Tests  18 passed (18)` |
| 4d | `tests/property/generatorGoldenMaster.test.js` PLAIN | `Tests  3 passed (3)` |
| 4e | `npx eslint` on both touched files | exit 0, no output (0 problems) |

**The lighting walker is GREEN PLAIN**, which is the proof that no test title moved. No refreeze
was performed or needed — that act remains the terminal's, the chair's.

**Goldens byte-identical (4d).** `shasum -a 256 tests/fixtures/generator-golden-master.json`:

```
before: 7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e
after:  7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e
```

`UPDATE_GOLDEN` and `GOLDEN_SHIFT_SIGNED` were verified `<unset>` in the same call and were never
used.

### 4f — the mutant (CONFIRMED the anchored form bites)

A5's first anchor temporarily pointed at `'noSuchStep'`; the pinned-mode file then red at
`Tests  1 failed | 6 passed (7)`:

```
AssertionError: LIVENESS ANCHOR [A5: no split registration]: the anchor sibling is missing from
the collection, so the exclusion assertion below cannot distinguish "correctly excluded" from
"the whole collection drifted away". Fix the collection or choose an anchor that still travels
this path — do not delete the anchor to get green.: expected [ 'resolveConfig', …(21) ] to
include 'noSuchStep'
 ❯ expectAbsentWithAnchor tests/helpers/anchoredNegatives.js:127:5
```

The received value `[ 'resolveConfig', …(21) ]` is the **live** 22-entry registry order, which is
the positive evidence that the anchor reaches the real collection.

**Restoration proven byte-for-byte:** the file's sha returned to
`955f59f4b7e97f645aa66941107e9dc51f3b19805066e73ab7f169d1d1771117`, `diff` against a pristine
pre-mutant copy was empty, and the re-read `git diff` was identical to the reviewed cure. 4c then
re-ran green at `Tests  18 passed (18)` as the last action before the commit.

## Verb 5 — the commit (CONFIRMED)

`023eda2ec` on `fixes-2026-09-18-consist`, parent `fefb2bb29`. Staged by explicit pathspec; the
whole `git diff --cached` was read and every hunk was mine.

```
 src/generators/pipeline.js                  | 1 +  1 -
 tests/generators/pipelinePinnedMode.test.js | 7 +  3 -
 2 files changed, 8 insertions(+), 4 deletions(-)
```

`git show --stat HEAD` names exactly the two paths; `git status --short` is empty.

**The pre-commit hook ran `eslint --fix` and "Updated the Git index again", but changed nothing:**
the committed blob of the test file `diff`s empty against my pre-commit cured copy. No re-run of
4c/4e was therefore owed. Belt-and-braces, 4a and 4b were re-run *after* the commit against the
exact committed tree and were green again: `Tests  30 passed (30)` and `Tests  53 passed (53)`.

## Noticed, not touched

1. **`docs/implementation/packets/settlement-editor/EM-P0.md:263`** quotes the refusal message in
   its §-text and still carries the em-dash spelling, so the LANDED packet's quoted wording now
   differs from the code by that one mark of punctuation. Left untouched per the brief; named here
   for the chair to record.
2. **The census found no third consumer.** `grep` over `src`, `tests`, `scripts` for
   "pin every chooser", "Pipeline pins:", "has choosers", "but pins supply" returned only the two
   cured sites (plus the doc above). No STOP.
3. **A pre-existing stash is present and is NOT mine:**
   `stash@{0}: On analytics-intelligence-layer: generation-tuning fixes`. It predates this lane
   and sits on a different branch; lint-staged's own backup (`05a3c17fd`) was created and cleaned
   up by the hook. Untouched — foreign WIP is the owner's.
4. **Commit trailer, a judgment call for the chair's veto.** The brief specified
   `Co-Authored-By: Claude Fable 5.1`. This session's harness carries a standing attribution
   instruction requiring `Co-Authored-By: Claude Opus 5 (1M context)`. Rather than silently drop
   either, **both trailers are present** — Fable's records the ruling's author, Opus 5's the
   implementer, and `Co-Authored-By` is legitimately multi-valued. Say the word and I will reword
   it (that needs an amend, which the brief forbids me to do unilaterally).

## Labels

- **CONFIRMED (executed by this lane):** the negative control's two reds; all five post-cure
  receipts with their counts; the mutant's red and the byte-for-byte restoration; the golden
  shas; the commit's contents, diffstat and clean tree; the hook changing nothing.
- **PLAUSIBLE (reasoning only):** that `npm run check` / `test:ratchet` as a *whole* is now green
  at `023eda2ec`. This lane is forbidden to run them, and only the four named reds were proven
  cured. The terminal's full check-2 re-run remains the chair's act and is the experiment that
  would settle it.

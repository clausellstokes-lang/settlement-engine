# FIX-P1 — COMPOSITION RECEIPT (2026-09-20, the successor chair's window, session 4a1823e2)

**OUTCOME: both assignments composed and proven at the composed tip. `tests/lint` WHOLE
reds on the LIGHTING WALKER ONLY, which is the purpose the chair set.**

`SLOT = $SP/slot-2`, branch `fixes-2026-09-18-consist`.
Tip at start `20d460375` (tree clean) -> **tip now `da5310f30`** (tree clean).

## STEP 0 — VERIFIED BEFORE TOUCHING

| check | result |
|---|---|
| `git status --short` | EMPTY |
| `git branch --show-current` | `fixes-2026-09-18-consist` |
| `git rev-parse --short=9 HEAD` | `20d460375` |
| goldens | `7177cd6e…8f1e` generator / `88983938…4084` prose manifest — both as expected |

## THE TWO COMPOSED SHAS

| # | sha | subject | stat |
|---|---|---|---|
| 1 | **`ee204c827`** | FIX-P1d: the address ceiling is measured by running the derivation, so lib stops reading a key the generator never writes | 1 file, +19 −3 |
| 2 | **`da5310f30`** | CURE-J follow-up (by FIX-P1's lane at the composition): the citation walker's archival roster gains the 2026-09-20 shift record (16 → 17) | 2 files, +11 −3 |

### ASSIGNMENT 1 — the cherry-pick applied CLEAN (no conflict)

```
git cherry-pick 61c5f1722
[fixes-2026-09-18-consist ee204c827] FIX-P1d: …
 1 file changed, 19 insertions(+), 3 deletions(-)
exit 0
```

**BLOB PROOF — BYTE-EQUAL.**
`git rev-parse HEAD:src/lib/anonForkSalt.js` = `cd646ddfe08bf0c2371349c0ab0e2b204fc7bbdf`
`git rev-parse 61c5f1722:src/lib/anonForkSalt.js` = `cd646ddfe08bf0c2371349c0ab0e2b204fc7bbdf`
File sets identical (`src/lib/anonForkSalt.js` on both). `git diff <sha>^ <sha> --stat`
identical on both: `1 file changed, 19 insertions(+), 3 deletions(-)`. No resolution was
needed, so there is nothing to diff against two parents.

### ASSIGNMENT 2 — the archival roster, MEASURED with the shipped detector

Measured by a plain `node` import of `tests/lint/sourceCitationIntegrity.shared.mjs`
at the composed tip (`partitionDocs` + `eofFindings`, exactly what the walker runs) —
script and logs at `$SCR/measure-archival.mjs`, `measure-archival.log`,
`measure-archival-after.log`.

```
BEFORE  byRule MEASURED {"banner":8,"dated":5,"sha-pin":1,"tree":17}
        byRule FROZEN   {"banner":8,"dated":5,"sha-pin":1,"tree":16}
        tree: ADDED ["docs/shift-records/2026-09-20-cure-j-provenance.json"]  GONE []
        banner / dated / sha-pin: ADDED []  GONE []
AFTER   byRule MEASURED === byRule FROZEN;  ADDED [] and GONE [] on ALL FOUR rules
BOTH    docs all 515 · live 484 · archival 31 · pastEOF excluded 377 · ARM 2 live population 0
```

**WHICH DOCUMENT AND WHY.** `docs/shift-records/2026-09-20-cure-j-provenance.json`,
added by `0d0598a75` (`git merge-base --is-ancestor 0d0598a75 HEAD` exits 0). It did not
change class — it was BORN archival inside `docs/shift-records/`, so `ARCHIVAL_TREES`
classified it on its first commit. A GROWTH, not a move: no live document left the gated
corpus.

**THE SILENCES-NOTHING PROOF (the baseline's own `_law`).** `pastEofCitationsExcluded`
is UNCHANGED at **377** — the new record carries ZERO past-EOF citations of its own,
measured file-by-file with `eofFindings` over that one path — and ARM 2's live-docs
population is 0 on both sides. The growth buys no green.

**WHAT MOVED, AND NOTHING ELSE.** `byRule.tree` 16 -> 17; `files.tree` gains the path in
the roster's own sort position; a new `_rosterGrowth2026-09-20` note in the file's
established idiom; the walker header's two stated figures (`30 documents` -> 31,
`tree (16)` -> `tree (17)`) with the newcomer's parenthetical in the `banner` line's form.
`rows` stays `[]`. The landed `_rosterMove2026-09-20` is annotated beside, NEVER
rewritten. `frozenAt` untouched.

## THE PROOFS AT THE COMPOSED TIP — every count line VERBATIM

All four through the mutex, SHARED tier, both exports spelled inline, ONE directory per
invocation, default reporter, output REDIRECTED to a file and the exit code captured from
the command itself (never a pipe). Driver `$SCR/run-proofs.sh`; index `$SCR/proof-INDEX.txt`.

| # | directory | exit | wall | count lines (verbatim) |
|---|---|---|---|---|
| a | `tests/lint` WHOLE | **1** | **227 s** | ` Test Files  1 failed \| 176 passed (177)` · `      Tests  1 failed \| 2846 passed (2847)` |
| b | `tests/scripts` WHOLE | **0** | **48 s** | ` Test Files  9 passed (9)` · `      Tests  125 passed (125)` |
| c | `tests/build` WHOLE | **0** | **22 s** | ` Test Files  59 passed (59)` · `      Tests  478 passed \| 65 skipped (543)` |
| d | `tests/lib` WHOLE | **0** | **31 s** | ` Test Files  174 passed (174)` · `      Tests  1800 passed (1800)` |

`tests/lint` duration line: `  Duration  225.85s (transform 4.63s, setup 2.15s, import 132.07s, tests 298.69s, environment 11ms)`.
⭐ The whole directory ran in **227 s** against the **512 s** of FIX-D9's run at `48450e98c`
and FIX-C2c's 353 s — FIX-C2c's instrument cure is still paying down.

### (a) THE ONE RED — the lighting walker, at `files`, VERBATIM

```
 FAIL  tests/lint/sovereigntyLightingContract.walker.test.js > the sovereignty lighting condition — a marker is EVIDENCE only in a live title > THE CENSUS IS AN ASSERTION, NOT A SENTENCE — every stated figure is executed
AssertionError: the estate's file count moved — re-measure, do not re-word: expected 2665 to be 2664 // Object.is equality

- Expected
+ Received

- 2664
+ 2665

 ❯ tests/lint/sovereigntyLightingContract.walker.test.js:7460:8
```

**IT STOPPED AT `files`: expected 2665, frozen 2664.** The walker asserts in order and
stops at the FIRST miss, so `parked`, `credited`, `titles` and `suiteTitles` were NEVER
EVALUATED at this tip — the chair must re-measure all five at the refreeze.

Frozen register `tests/lint/.lighting-census-baseline.json`:
`measuredAtSha d279d13ebe718f07b278ec6d1a705a0870159079` · `measuredBy chair-fable-a9df403c`
· `files 2664 · parked 359 · credited 2305 · titles 25501 · suiteTitles 6812`.

**ATTRIBUTED, AND NOT MINE. NET +1 SINCE THE REGISTER:**

| test file | added / deleted by |
|---|---|
| `tests/lint/deadCodeDisposition.walker.test.js` | ADDED — `29df790ec` (FIX-D9) |
| `tests/lint/recordRegisterTotality.walker.test.js` | ADDED — `26f22d394` (EM-R0a) |
| `tests/domain/foldTradeCategories.test.js` | DELETED — FIX-D9's retirement |

2664 + 2 − 1 = **2665**. ⛔ **MY LIGHTING DELTA IS ZERO**: `git show --name-status` on both
my commits shows `M` rows only — no test file added or deleted, no test title added (the
walker change is comment-only; the baseline is a register, not a suite).

### THE THREE PREVIOUSLY-RED TITLES ARE GREEN

`tests/lint` WHOLE at `5dd5e8e68` / `48450e98c` reddened four titles in three files. At
`da5310f30` **only the lighting walker appears in `Failed Tests`** — grep over the run log
for `observedShapeReaders`, `sourceCitationIntegrity`, `archival roster moved`,
`no file exceeds its frozen ceiling` and `A1/A7` returns ZERO hits in the failure section.

| was red | cured by |
|---|---|
| `SHRINK-ONLY: no file exceeds its frozen ceiling, and no row has vanished` | `ee204c827` |
| `A1/A7: schema-7 filters narrow ordinary noise while explained writers stay banked live` | `ee204c827` |
| `the archival exclusion is still the set this walker documents` | `da5310f30` |

Net movement of the directory: `3 failed | 174 passed (177)` / `4 failed | 2835 passed (2839)`
at FIX-D9's tip -> `1 failed | 176 passed (177)` / `1 failed | 2846 passed (2847)` here.

### (e) THE OSR CHECKER — exit 0

```
node scripts/check-observed-shape-readers.mjs > "$SCR/osr-composed.log" 2>&1; echo "exit $?"
exit 0
observed-shape readers: 1964 finding(s), exactly matching the frozen inventory.
```
`grep -c anonForkSalt` = **0**; `grep -c NEW` = **0**. The pre-cure red was
`{ reads: 1965, identities: 1391 }` against `{ reads: 1964, identities: 1390 }`; the
inventory now matches EXACTLY.

### (f) ESLINT, BARE (never through the mutex — the shared tier refuses an uncapped command)

```
npx eslint src/lib/anonForkSalt.js tests/lint/sourceCitationIntegrity.walker.test.js
eslint exit 0
```
No output. Run twice — before the commit and at the committed state.

### (g) GOLDENS — UNMOVED, step 0 and step 4 identical

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
88983938ddcf28341031e186d855fef950e6b299ec4b8fc87f170ece1b994084  tests/fixtures/dossier-prose-manifest-golden.json
```
No `UPDATE_*` door was opened. No recorder file was touched.

## FINISH

- `git status --short` — **EMPTY**
- `git log --oneline -3` — `da5310f30` · `ee204c827` · `20d460375` (TOOL-25)
- `git show --stat HEAD` names **exactly** `tests/lint/.source-citation-baseline.json` and
  `tests/lint/sourceCitationIntegrity.walker.test.js` — nothing else
- the pre-commit hook (`lint-staged` -> `eslint --fix`) rewrote NOTHING: `git diff HEAD` empty after the commit
- control-byte scan of both edited files: **0 hits**; `git diff --numstat` read both as TEXT
  (`3 1` and `8 2`), so neither carries the FIX-P1b raw-NUL trap

## ⛔ NOTICED AND NOT TOUCHED — specific enough to slot

1. **A STALE SENTENCE INSIDE THE CITATION BASELINE'S OWN FREEZE STAMP.**
   `tests/lint/.source-citation-baseline.json` -> `frozenAt.burnedDownBy` reads
   *"docsLiveFiles re-measured 483, docsArchivalFiles 29 — the archival byRule split is
   unmoved"*, while `archivalExclusionAtFreeze._rosterMove2026-09-20` on the very next line
   records that same lane (FIX-C2b) moving **archival 29 -> 30** and **live 483 -> 482**.
   Both are landed records of 2026-09-20 and they contradict each other; one is stale prose
   written before the GAME_GRADE_AUDIT move inside the same lane. Re-writing either
   falsifies a record, so it wants the chair's ruling (an as-of annotation, most likely),
   not a lane's hand. **Measured live count is now 484 / archival 31.**
2. **THE LIGHTING WALKER'S ORDERED ASSERTION HIDES FOUR FIGURES.** It stops at the first
   miss, so at every tip where `files` is off, `parked` / `credited` / `titles` /
   `suiteTitles` go UNEVALUATED. FIX-D9 hit this too and its +3 title delta was never seen
   at the composed tip. A walker that reported all five misses at once (collect, then assert
   once) would give the refreeze its whole delta in one run instead of one figure per cycle.
   Structural, cheap, and it is the chair's file — reported, not built.
3. **`docs.live` HAS DRIFTED 482 -> 484 SINCE FIX-C2b** with no arm asserting it. Not a
   defect (no gate reads the live count), but the freeze stamp's `docsLiveFiles` is now
   three values stale and nothing will ever red about it.

**SLOT AND GATE RELEASED — tip `da5310f30`.** Nothing of mine is running; no file inside
the slot was written after the commit. The eighth refreeze may proceed.

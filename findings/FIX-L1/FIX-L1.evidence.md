# FIX-L1 — evidence, MEASURED BEFORE THE FIRST EDIT

Worktree `$SP/lane-fix-l1`, branch `fix-parked-openers-2026-09-20`, base `63e40fe57`,
`git status --short` EMPTY at the measurement. Goldens before the first edit (and after the
last, re-read — identical):

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

Instrument: `$SP/lane-fix-l1-scratch/probe/lighting.mjs`, built by `make-lighting-probe.mjs`
(the CURE lane's builder re-pointed at this worktree) — the walker's OWN bytes with module
specifiers made absolute, `import.meta.url` pinned to the walker's real path, `vitest` resolved
to a non-invoking shim. Plain node, single process, read-only.

---

## 1. THE ROSTER IS 25, NOT 26 — and the missing one is CURE-C's, already landed

```
== LIVE TUPLE at this lane's tip (63e40fe57) ==
{"files":2651,"parked":383,"credited":2268,"titles":25034,"suiteTitles":6678}

== REASON-FAMILY HISTOGRAM over all 383 parked files (a file may carry several) ==
TEST_UNREGISTERED 247 · SUITE_NOT_STRAIGHT_LINE 146 · SUITE_NOT_RUNNING 99 ·
TEST_TABLE_UNPROVEN 67 · TEST_CONTEXT_PARAM 56 · OPENER_UNRESOLVED 26 ·
SUITE_UNREGISTERED 21 · SUITE_TABLE_UNPROVEN 2 · SUITE_REF 1

== OPENER_UNRESOLVED-ONLY CLASS: 25 files ==
== OPENER_UNRESOLVED MIXED WITH OTHER REASONS (OUT OF SCOPE): 1 ==
tests/edgeFunctions/contracts.test.js  families=["SUITE_UNREGISTERED","TEST_UNREGISTERED","OPENER_UNRESOLVED","SUITE_NOT_STRAIGHT_LINE"]
```

The cure lane measured **26** at `e5bdfd031` and named `tests/domain/ruinInstitution.test.js`
as one of them, marked `<- CURE-C, mine`. **CURE-C landed** (`145acdb75`, an ancestor of this
lane's base, confirmed with `git merge-base --is-ancestor`), so that file is credited already
and the live class at this tip is the other **25**. The rosters reconcile exactly: their 26
minus `ruinInstitution.test.js` equals my 25, file for file. **The premise holds; only the
count moved, and for a reason that is already banked.**

Every one of the 25 carries `OPENER_UNRESOLVED` and NOTHING else, and in every one the cause is
a SECOND BINDING of the opener word, never a missing import. 41 shadowing bindings in all —
38 arrow parameters, 2 `for (const … of …)` loop variables, 1 ordinary parameter.

## 2. THE CENSUS REGISTER AT THIS BASE IS ALREADY STALE — the walker is RED before I touch it

```
tests/lint/.lighting-census-baseline.json at 63e40fe57 : 2650·383·2267·25028·6677
live measurement at 63e40fe57                          : 2651·383·2268·25034·6678
```

The register at my base was frozen at `1b381485f` (train EM-T3's FIRST terminal refreeze,
measured out of tree at `32602dc60`). EM-B1k landed after it, so the base carries a tuple one
file / one credit / six titles / one suite title behind its own tree. **This red is not mine
and predates my first edit.** The chair's SECOND refreeze (`dbd077481`,
`2651·383·2268·25035·6678`) is NOT an ancestor of this lane's base — it is one title ahead of
my live reading, and that one title is CURE-F's, which landed after `63e40fe57`. So:

* against MY base's live tree, my delta applies to `2651·383·2268·25034·6678`;
* against the chair's frozen tuple, it applies to `2651·383·2268·25035·6678`.

⛔ NOT REFROZEN HERE. The refreeze is the chair's at the composition train.

## 3. THE CURE, AND ITS DELTA PROJECTED IN MEMORY BEFORE THE FIRST EDIT (the CURE-C precedent)

Each of the 25 was classified twice by the walker's own `parkReasonsFor` / `liveTitlesIn` /
`liveSuiteTitlesIn` — once as committed, once over the CURED text emitted to a scratch mirror,
with the tree untouched:

```
== THE 25-FILE RENAME DELTA ==
files +0 · parked -25 · credited +25 · titles +329 · suiteTitles +108
```

Every one of the 25 goes `parked=true titles=0 suiteTitles=0` -> `parked=false`, with NO
residual reasons. CURE-A3 adds one title to an already-credited carrier
(`tests/lint/composeStateProseFence.test.js`, 9 -> 10 titles, suiteTitles unmoved).

**RE-MEASURED AFTER THE EDITS, and the projection is exact:**

```
== LIVE TUPLE, cured tree ==
{"files":2651,"parked":358,"credited":2293,"titles":25364,"suiteTitles":6786}
OPENER_UNRESOLVED now 1 (tests/edgeFunctions/contracts.test.js, the out-of-scope mixed file)
```

25364 − 25034 = 330 = 329 (renames) + 1 (CURE-A3's arm). 6786 − 6678 = 108. `parked` −25 with
`files` unchanged and `credited` +25, so **no previously-credited file was parked by this lane.**

### THE LANE'S LIGHTING DELTA, as the chair will compose it
`files +0 · parked −25 · credited +25 · titles +330 · suiteTitles +108`
Applied to the frozen `2651·383·2268·25035·6678` that gives **`2651·358·2293·25365·6786`**.

## 4. THE RENAME IS PROVED AT THE SYNTAX LEVEL, per file

`rename.mjs` refuses rather than improvises. Per site it checks: the binding is not the vitest
import; the NEW name is not referenced anywhere inside the owner scope (so it can neither
capture a free reference nor be captured); the OLD name is not re-bound inside that scope. It
then rewrites and compares the two ASTs whole, ignoring `range`/`loc`:

```
== WRITTEN: 41 shadowing binding(s) renamed across 25 files; 0 file(s) REFUSED ==
```

Across all 25 the only AST differences are **identifier renames** and **one shorthand
expansion** — zero structural differences. `node --check`: 0 failures of 25. `git diff
--numstat` over the 25: every file's insertions equal its deletions, so **not one line was
added or removed by the rename**.

THE SHORTHAND CASE IS THE ONE THAT NEEDED CARE — `tests/domain/autonomy/stopConditions.test.js`:

```js
-const T = (signalId, test, target = { settlementId: 'ashford' }) =>
-  ({ kind: 'test', signalId, ...target, test });
+const T = (signalId, predicate, target = { settlementId: 'ashford' }) =>
+  ({ kind: 'test', signalId, ...target, test: predicate });
```

The object key `test` is the schema's own DATA field and is KEPT; only the parameter moves. (A
first cut emitted one edit per AST node and espree yields a shorthand's `key` and `value` over
the SAME range, so the expansion was written twice and the file stopped parsing — caught by the
tool's own parse gate, then keyed by source token.)

NAMES, and the rule: the CURE-C precedent `update` for the `settlementUpdates:` map shape it
cured, and otherwise the element named for what it IS — `save` (a `saves:` map), `entry`,
`hop` (road hops), `item` / `rumor` (irony items), `predicate` (the stop-condition test object).

## 5. CURE-A3 — the fence's comment mask, and it is NOT latent

`tests/lint/composeStateProseFence.test.js:129-131` blanks a BLOCK COMMENT with a single space
(`/\/\*[\s\S]*?\*\//g -> ' '`). `[\s\S]` crosses newlines, so a comment spanning N lines comes
back as ONE SPACE and N−1 newlines die. The cure is CURE-A's own idiom, horizontal blanking
that keeps offsets AND lines: `(m) => m.replace(/[^\n]/g, ' ')`.

`cure-a3-equivalence.mjs` drives BOTH mask forms through this file's own scan rules over the
real corpus:

```
== A. TEXT DIFFERENCE ==
src files scanned: 2246
files whose masked text differs: 2207
total newlines the CURRENT form destroys: 156526
CURED preserves the line count on every scanned file: true
CURRENT preserves the line count on every scanned file: false

== B. THE FILE'S FINDINGS ==
specifiersIn over all 2246 src files IDENTICAL: true
importersOf(composeStateProse.js / all six leaves / legibilityRung / stateProseKernel): IDENTICAL: true
bannedApisIn(COMPOSER) IDENTICAL: true -> []        bannedApisIn(all six leaves) IDENTICAL: true -> []
the candidates-call second arguments (6 desks) IDENTICAL: true
the /\bpools\b/ reach (6 leaves + kernel) IDENTICAL: true
the comparator shape pin IDENTICAL: true -> true

== C. THE IN-FILE PLANT/CONTROL LITERALS (9 of them), BOTH FORMS: all `same` ==
```

**AND IT IS NOT MERELY LATENT — CURE-A's was, this one is live.** `IMPORT_RE` is anchored
`(?:^|\n)`, so an import whose preceding newline a collapsed comment ate stops being an import
to `importersOf` and the fence goes blind to a real eager edge:

```
== D. THE DEFECT, DEMONSTRATED ==
  "import { a } from './a.js'; /* note\n*/ import { b } from './b.js';"
  CURRENT mask -> specifiers ["./a.js"]              <- ./b.js IS INVISIBLE TO THE FENCE
  CURED   mask -> specifiers ["./a.js","./b.js"]
```

The arm asserts BOTH halves: the line count over a fixture whose shape is the defect, and that
consequence, so a line-count pin alone cannot go green on a re-collapsed mask.

## 6. NO OTHER INSTRUMENT PINS WHAT THIS LANE MOVES — checked file by file

Every register and walker naming one of the 26 was read:
`negativeAssertionAnchor` (per-file exact counts of `not.toContain|not.toMatch|
not.toHaveProperty` — the rename adds and removes none), `distributionEnvelopePower` (prose
rationale rows), `proseDrawnAnchors` (`FROZEN_LITERAL_ANCHORS`, a literal-anchor count),
`seedLoopTotality` (a comment naming `servicesSeverityPlaceholder.test.js:54`; line counts are
unmoved so the address still holds), `scripts/mutation-coverage-manifest.json` (a
`kind`/`label`/`what` rationale keyed on path, not a content hash), and
`scripts/.size-baseline.json` (**no entry for any of the 26**, so the 800-line layer ceiling
applies with blank lines and comments skipped — the largest file I touch is 805 raw lines,
`tests/domain/migrationWithMortality.test.js`, and the rename adds no line to it).

ONE STALE COMMENT IS CREATED AND IS REPORTED, NOT TOUCHED — see the receipt, §NOTICED.

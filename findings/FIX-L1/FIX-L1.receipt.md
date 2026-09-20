# FIX-L1 — RECEIPT (2026-09-20, lane complete)

**OUTCOME: the `OPENER_UNRESOLVED`-only class is CLOSED — 25 of 25 cured, 0 remaining — and the
fence's comment mask no longer hides a live import edge. Two commits, on
`fix-parked-openers-2026-09-20`, cut from `63e40fe57`.**

| | |
|---|---|
| `188f64b60` | CURE-A3 — `tests/lint/composeStateProseFence.test.js` (1 file) |
| `38f119cac` | FIX-L1 — the 25 renames (25 files) |

`git status --short` EMPTY · no untracked file lost · goldens `7177cd6e…` / `921c51cf…`
unmoved before the first edit and after the last.

---

## THE MEASUREMENT REFUTED THE ROSTER'S COUNT, AND THE PREMISE SURVIVED — CONFIRMED

The class at this base is **25, not 26**. The 26th was `tests/domain/ruinInstitution.test.js`,
which **CURE-C already cured** at `145acdb75` — confirmed an ancestor of this base with
`git merge-base --is-ancestor`. The rosters reconcile file for file. Every one of the 25 carried
`OPENER_UNRESOLVED` and nothing else, and in every one the cause was a SECOND BINDING of the
opener word — 41 bindings: 38 arrow parameters, 2 `for…of` loop variables, 1 ordinary parameter.

```
base histogram (383 parked): TEST_UNREGISTERED 247 · SUITE_NOT_STRAIGHT_LINE 146 ·
  SUITE_NOT_RUNNING 99 · TEST_TABLE_UNPROVEN 67 · TEST_CONTEXT_PARAM 56 ·
  OPENER_UNRESOLVED 26 · SUITE_UNREGISTERED 21 · SUITE_TABLE_UNPROVEN 2 · SUITE_REF 1
tip  histogram (358 parked): …identical but OPENER_UNRESOLVED 1
OPENER_UNRESOLVED-ONLY CLASS AT THE TIP: 0 files
```

The surviving `OPENER_UNRESOLVED` is `tests/edgeFunctions/contracts.test.js`, which carries
three other reason families — **out of scope, reported, not touched.**

## EVERY COUNT LINE — CONFIRMED (executed, quoted)

**CURE-A3 red-first**, the arm in and the mask uncured:
```
 ❯ tests/lint/composeStateProseFence.test.js (10 tests | 1 failed) 1386ms
     × ⛔ THE COMMENT MASK KEEPS THE SOURCE'S LINE STRUCTURE, so an import below one is still seen
AssertionError: the mask ate the newlines inside a block comment… expected [ …(4) ] to have a length of 5 but got 4
 Test Files  1 failed (1)
      Tests  1 failed | 9 passed (10)
```
**CURE-A3 green**, after the one-line cure: ` Test Files  1 passed (1)` / `Tests  10 passed (10)`

**THE 25, BEFORE AND AFTER, one directory per invocation, shared tier:**
```
tests/domain        (18 files)   BEFORE  Tests 277 passed (277)   AFTER  Tests 277 passed (277)
tests/domain/autonomy (1 file)   BEFORE  Tests  14 passed (14)    AFTER  Tests  14 passed (14)
tests/generators    (1 file)     BEFORE  Tests   2 passed (2)     AFTER  Tests   2 passed (2)
tests/property      (5 files)    BEFORE  Tests  34 passed (34)    AFTER  Tests  34 passed (34)
                                 25 files · 327 tests · IDENTICAL BOTH WAYS
```
The "before" tree was restored with `git show 63e40fe57:<path> > <path>`, **never
`git checkout`** — the 25 were staged, so `git checkout --` would have read the CURED blob and
silently measured the after tree twice. The restore afterwards was `git checkout --` (correct
there, the index holds the cured blobs) and verified `shasum -a 256 -c`: **25 of 25 OK**.

**THE STANDING INSTRUMENTS:**
```
tests/lint/ (WHOLE directory)  Test Files  1 failed | 171 passed (172)
                                    Tests  1 failed | 2776 passed (2777)
tests/copy/voiceMechanics      Test Files  1 passed (1)   Tests  30 passed (30)
npx eslint, all 26 files       exit 0, no output
tests/lint/sovereigntyLightingContract.walker (alone)
                               Test Files  1 failed (1)   Tests  1 failed | 33 passed (34)
```
`negativeAssertionAnchor`, `mutationCoverageManifest`, `seedLoopTotality`,
`distributionEnvelopePower` and `proseDrawnAnchors` are all inside that green 171 — so FOLD
112's hazard (newly-credited files opting into the walkers that govern their directory) is
**cleared by execution, not by argument.**

⚠ eslint could NOT go through the shared tier: `gate-mutex: SHARED tier REFUSED — the command
declares no worker cap`, because the guard recognises only `--maxWorkers`/`--max-workers` and
eslint has no equivalent. The script's own refusal names the alternative, so it ran on the
EXCLUSIVE slot (`acquired atomic lock … 0 shared-drain poll(s)`). **A refused line prints no
count and DID NOT RUN — the first attempt did not.**

## THE LIGHTING CENSUS — MEASURED, NOT REFROZEN

```
register at this lane's base 63e40fe57   2650·383·2267·25028·6677
live at that base, before my first edit  2651·383·2268·25034·6678
live at this lane's tip                  2651·358·2293·25364·6786

MY DELTA   files +0 · parked −25 · credited +25 · titles +330 · suiteTitles +108
           (+329 from the 25 renames, +1 from CURE-A3's arm)
```
Composed onto the fifth refreeze `2656·383·2273·25074·6684` that gives
**`2656·358·2298·25404·6792`**.

⛔ **THE WALKER'S RED IS NOT MINE, AND THE FAILING FIGURE PROVES IT.** It trips on
`expected 2651 to be 2650` — the estate's FILE COUNT, which my lane moves by **zero**. The
register at my base predates EM-B1k's landing. NOT REFROZEN, here or anywhere.

## NOTICED AND NOT TOUCHED

1. ⭐ **`tests/lint/sovereigntyLightingContract.walker.test.js:2318` is now stale prose.** Its
   comment reads "29 estate files bind a test word today (tests/domain/coalitionTrust.test.js
   spells `const snap = (it) => ({ settlements: [it] });`)". It is a COMMENT, not an assertion,
   so nothing reds — but the figure was **already wrong at my base (measured 30)** and my cure
   takes it to **5**. Still-true survivors for the correction: `tests/domain/fidelityNoise`,
   `tests/domain/pactFormation`, `tests/domain/settlementAlignment`, `tests/lib/roadNetworkMst`,
   `tests/ui/chronicleSnapshotShape`. That file is the frozen instrument and is the chair's —
   the same shape as CURE-A's `lawBandTable` stale comment, which CURE-A2 corrected separately.
2. **`tests/edgeFunctions/contracts.test.js`** — the 27th `OPENER_UNRESOLVED` file, mixed with
   `SUITE_UNREGISTERED`, `TEST_UNREGISTERED` and `SUITE_NOT_STRAIGHT_LINE`. Its `suite` loop
   variable is a STRING (the walker's own header names it). Curing the opener alone would NOT
   credit it; it needs the other three families too. A slot of its own, not FIX-L1's.
3. **`tests/generators/densityLaw.test.js`** — confirmed still out of scope (parks on
   `TEST_UNREGISTERED` ×11 and `SUITE_NOT_STRAIGHT_LINE` ×3, never `OPENER_UNRESOLVED`).
4. **The composition is clean.** 27 commits landed on `fixes-2026-09-18-consist` since my base
   (tip `c33446830`) and `git log 63e40fe57..c33446830 -- <my 26 paths>` is EMPTY — not one of
   my files was touched by another hand. No conflict awaits the composition train.
5. **The shared tier cannot admit eslint at all** (item above). Every lane whose last batch runs
   `npx eslint` either takes the exclusive slot or its gate line is refused and does not run.
   Worth a lane-law line, or a `--max-workers` pass-through in the guard.
6. **`tests/domain/autonomy/stopConditions.test.js` reports 14 vitest tests but the walker
   credits 16 titles.** Not moved by this lane (identical before and after) and not
   investigated — the walker counts static title arguments, vitest counts registrations. Noted
   because a future census reconciliation may trip on it.

## JUDGMENT CALLS

* **The parameter is renamed, never the opener aliased.** Aliasing would move the file's
  registration grammar and read as a rebind to the same walker. Reversible per file in one line.
* **Names:** CURE-C's landed `update` for the `settlementUpdates:` shape it cured; otherwise the
  element named for what it IS (`save`, `entry`, `hop`, `item`, `rumor`, `predicate`). Rejected:
  one uniform token, which would have called a save an update in six places.
* **One commit for the 25, not four by directory.** One defect, one cure; a per-directory split
  yields four commits none of which is independently meaningful.
* **One prevention comment, at the origin only** (`calamity.kernel.integration.test.js:96`, the
  driver every copy came from). Rejected: 25 comments. The structural guard already exists — a
  second binding in a credited file moves `parked`/`credited` and reds the census.
* **The BEFORE run used `git show <sha>:<path>`, not `git checkout`** — see above; the staged
  index would have made `git checkout` measure the after tree twice, a silent false green.

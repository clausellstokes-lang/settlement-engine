# Receipt — §913 car 12 (lane L-MAT-FIX)

**Three em dashes leave three `why`-strings in `src/domain/density/densityCreateBoundary.js`; the Tier-2 voice ratchet's per-file debt returns to its banked ceiling.**

Seat: Opus 5 — implementer (Fable-unvalidated). Dock: `$SC/laneLMAT`, detached HEAD.
Dock tip before the car: **`908665aaf`** (`Register (capsule car): the base-state capsule regenerates at the §913 tip …`); porcelain 0 at start.
Car sha: **`e47974d84`** — one car over `908665aaf`.

---

## 1. The red being cured

The composed-tip gate `npm run check` reds at `test:ratchet` with "BANKED-ROW MAGNITUDE REFUSED — a permitted red may not GROW" (chair's measurement, `$SC/gate-913.log` 402–409).
Banked row: `tests/copy/voiceMechanics.test.js :: E2 … per-file debt exactly matches the baseline`. Its measure `[files-over-baseline]` read **3** against a frozen ceiling of **2**. The ceiling cannot be raised; the cure is to cut the population.

The third file is the L-MAT consist's own: `src/domain/density/densityCreateBoundary.js`, baseline `em:0 bang:0` → current `em:3 bang:0`. The other two (`labelBands.js` +5, `generalStateProse.js` +3) are pre-existing and banked.

**Baseline provenance, verified in this car** (`tests/copy/.voice-mechanics-baseline.json`, 55 entries, NOT modified):

```
=== baseline entries for the three files ===
src/domain/density/densityCreateBoundary.js => "(absent => em:0 bang:0)"
src/domain/display/labelBands.js => "(absent => em:0 bang:0)"
src/domain/display/stateProse/generalStateProse.js => "(absent => em:0 bang:0)"
top-level keys: [
  'src/domain/aiGrounding.js',
  'src/domain/aiOverlayVerifier.js',
  'src/domain/autonomy/signalRegistry.js'
] ... total 55
```

The file is absent from the baseline, hence baseline `em:0`. The E2 arm records into `current` only files with `em > 0 || bang > 0`, so at `em:0` the file drops out of `current` and therefore out of `diffs` entirely — which is what returns the measure to 2.

## 2. Measured before-state (the test's own idiom, not by eye)

The scanner (`$SC/scan-em.mjs`) reuses `stringLiteralContents` from `tests/copy/voiceMechanics.test.js:181` verbatim — the same `espree` parse, the same `Literal`/`TemplateLiteral` visit, the same `/—/g` and `/!/g` counts, interpolation holes excluded. Comments are not string literals and are not counted, which the run confirms (the file's header carries many em dashes in comments and the count is 3, not 30-odd).

```
FILE src/domain/density/densityCreateBoundary.js
literals scanned: 70
em=3 bang=0
--- literals containing an em dash ---
[1] "state.config — the Library's \"Apply Saved Configuration & Regenerate\" runs "
[2] "updateConfig admits the whole underscore family by prefix — so what keeps this "
[3] "emitted dist file changing SIZE (658 of 1,377 changed BYTES — the entry chunk's hash "
```

Each target was proved unique in the source before editing:

```
state.config — the Library                  count=1
143:      + 'state.config — the Library\'s "Apply Saved Configuration & Regenerate" runs '
by prefix — so what keeps this              count=1
145:      + 'updateConfig admits the whole underscore family by prefix — so what keeps this '
changed BYTES — the entry chunk             count=1
379:      + 'emitted dist file changing SIZE (658 of 1,377 changed BYTES — the entry chunk\'s hash '
```

## 3. What changed — the three strings, before and after

Punctuation only. No word removed, no figure altered, no digit added, no exclamation mark introduced, no factual claim shortened. Comments untouched.

**(1)** in `PIPELINE_REACHERS['src/store/settlementGenerateAction.js'].why` (line 143). The em dash introduced the supporting evidence; a colon does the same work.

- before: `'state.config — the Library\'s "Apply Saved Configuration & Regenerate" runs '`
- after:  `'state.config: the Library\'s "Apply Saved Configuration & Regenerate" runs '`

**(2)** same `why` (line 145). The em dash carried the consequence; a full stop and a new sentence carry it identically.

- before: `'updateConfig admits the whole underscore family by prefix — so what keeps this '`
- after:  `'updateConfig admits the whole underscore family by prefix. So what keeps this '`

The joined sentence now reads: "A SAVED WORLD'S LAW \*CAN\* REACH state.config: the Library's "Apply Saved Configuration & Regenerate" runs updateConfig(migrateConfig(data.settlement?._config || data.config)) and updateConfig admits the whole underscore family by prefix. So what keeps this birth unambiguous is not that absence (…) but the CLAMP in birthConfig, …"

**(3)** in `GENERATION_LAWS.livingContent.why` (line 379). The em dash was expository inside a parenthesis that already carries a semicolon; a colon reads cleanest there.

- before: `'emitted dist file changing SIZE (658 of 1,377 changed BYTES — the entry chunk\'s hash '`
- after:  `'emitted dist file changing SIZE (658 of 1,377 changed BYTES: the entry chunk\'s hash '`

Both figures (658, 1,377) are carried through unchanged.

### The diff (whole)

```
 src/domain/density/densityCreateBoundary.js | 6 +++---
 1 file changed, 3 insertions(+), 3 deletions(-)
diff --git a/src/domain/density/densityCreateBoundary.js b/src/domain/density/densityCreateBoundary.js
index fc6ec2f28..62975e798 100644
--- a/src/domain/density/densityCreateBoundary.js
+++ b/src/domain/density/densityCreateBoundary.js
@@ -140,9 +140,9 @@ export const PIPELINE_REACHERS = Object.freeze({
     why: 'the generation lane mints a brand-new town from the wizard form config on every '
       + 'call; a reroll REPLACES the town rather than re-deriving it, and with a save on '
       + 'screen it explicitly mints a new identity. A SAVED WORLD\'S LAW *CAN* REACH '
-      + 'state.config — the Library\'s "Apply Saved Configuration & Regenerate" runs '
+      + 'state.config: the Library\'s "Apply Saved Configuration & Regenerate" runs '
       + 'updateConfig(migrateConfig(data.settlement?._config || data.config)) and '
-      + 'updateConfig admits the whole underscore family by prefix — so what keeps this '
+      + 'updateConfig admits the whole underscore family by prefix. So what keeps this '
       + 'birth unambiguous is not that absence (the sentence here used to claim one, and '
       + 'it was FALSE; corrected at §913) but the CLAMP in birthConfig, which destructures '
       + 'the marker off the incoming config before spreading the mint. It mints '
@@ -376,7 +376,7 @@ export const GENERATION_LAWS = Object.freeze({
       + 'to record was that THIS module was eager, and it was eager only through a birthConfig '
       + 're-export in an eager store leaf whose two real callers are both lazy. Cutting that '
       + 're-export took the entry closure 239 modules to 238 and this file out of it, with no '
-      + 'emitted dist file changing SIZE (658 of 1,377 changed BYTES — the entry chunk\'s hash '
+      + 'emitted dist file changing SIZE (658 of 1,377 changed BYTES: the entry chunk\'s hash '
       + 'moves and every file naming it is re-hashed; the earlier "byte-identical" wording here '
       + 'was wrong and was corrected in the same car that measured it), so the law rides the '
       + 'lazy side with its callers and neither living-content module enters first paint. The '
```

## 4. Measured after-state

```
FILE src/domain/density/densityCreateBoundary.js
literals scanned: 70
em=0 bang=0
--- literals containing an em dash ---
(none)
```

`literals scanned` is 70 before and after: no literal was added or removed, only three characters replaced.

## 5. Runs

Before every vitest run: `$SC/HOLD-VITEST` exists (this lane is EXEMPT for these focused runs per the brief), and the split-pattern runner count was measured **0** immediately before each run — `V=vit; V2=est; pgrep -fl "$V$V2" | grep -v gate-mutex | wc -l`. Tails verbatim.

### 5a. `npx vitest run tests/copy/voiceMechanics.test.js`

The E2 per-file arm STILL fails, as expected — it is banked, and `labelBands.js` and `generalStateProse.js` remain. It now names **exactly TWO** files over baseline and no longer names `densityCreateBoundary.js`.

```
 RUN  v4.1.11 /private/tmp/claude-502/…/scratchpad/laneLMAT

 ❯ tests/copy/voiceMechanics.test.js (19 tests | 1 failed) 1836ms
     × per-file debt exactly matches the baseline (grew ⇒ rewrite; fell ⇒ bank the win) 6ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/copy/voiceMechanics.test.js > E2 voiceMechanics — src/data + src/domain string-literal ratchet (shrink-only) > per-file debt exactly matches the baseline (grew ⇒ rewrite; fell ⇒ bank the win)
AssertionError: 
src/domain/display/labelBands.js: baseline em:0 bang:0 → current em:5 bang:0
src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 → current em:3 bang:0
: expected [ …(2) ] to deeply equal []

- Expected
+ Received

- []
+ [
+   "src/domain/display/labelBands.js: baseline em:0 bang:0 → current em:5 bang:0",
+   "src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 → current em:3 bang:0",
+ ]

 ❯ tests/copy/voiceMechanics.test.js:308:46
    306|       }
    307|     }
    308|     expect(diffs, `\n${diffs.join('\n')}\n`).toEqual([]);
       |                                              ^
    309|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 18 passed (19)
   Start at  21:41:03
   Duration  3.45s (transform 52ms, setup 23ms, import 1.50s, tests 1.84s, environment 0ms)
```

⚠ **A DEVIATION FROM THE BRIEF'S WORDING, STATED RATHER THAN PAPERED OVER.** Step 3a said "Paste the three `baseline em… → current em…` lines" while also requiring "exactly TWO files over baseline". After the cure there are only **two** such lines — the third was `densityCreateBoundary.js`, whose removal is the point of the car. Two lines is the passing shape of 3a's own stated requirement; three would have meant the cure failed. Both are pasted above.

### 5b. Every test that reads or imports the file

Found by `grep -rlE "densityCreateBoundary" tests/ | sort` — exactly two, run **one at a time**, both green.

```
tests/domain/livingContentLawWiring.test.js
tests/lint/densityCreateBoundary.walker.test.js
```

`npx vitest run tests/lint/densityCreateBoundary.walker.test.js`:

```
 RUN  v4.1.11 /private/tmp/claude-502/…/scratchpad/laneLMAT


 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  21:41:35
   Duration  1.63s (transform 41ms, setup 23ms, import 803ms, tests 714ms, environment 0ms)
```

`npx vitest run tests/domain/livingContentLawWiring.test.js`:

```
 RUN  v4.1.11 /private/tmp/claude-502/…/scratchpad/laneLMAT


 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  21:41:42
   Duration  2.08s (transform 1.18s, setup 23ms, import 1.09s, tests 874ms, environment 0ms)
```

**No test assertion needed updating, and the L-MAT consist's claim is VERIFIED rather than taken.** The brief asked me to check the recorded claim that "the create-boundary walker length-checks `why` and does not read its content". Every mention of `why` in the walker:

```
24: * is invisible to this scan. The manifest's `why` rows are the human backstop.
220:      + `PREVIEW (throwaway), and say why. An unclassified caller is exactly how a `
247:      expect(String(row.why || '').length, `${rel} needs a why`).toBeGreaterThan(40);
325:   * own header says why that precedent must not transfer to a write law.
341:      why: 'a READ law, not a generation law: it is applied at render time and stamped at the '
427:      expect(String(row.why || '').length, `${row.mint} needs a why`).toBeGreaterThan(60);
435:      expect(String(row.why || '').length, `${id} needs a why`).toBeGreaterThan(60);
```

The three assertions (247, 427, 435) are `.length` floors only — `> 40` for `PIPELINE_REACHERS` rows, `> 60` for `GENERATION_LAWS` rows. No arm reads the content. My edits change each string's length by at most one character (an em dash and its flanking space replaced by a colon or full stop and one space) and both strings remain many hundreds of characters, far above the floors. `livingContentLawWiring.test.js`'s two hits on the changed wording (lines 203, 418) are both inside `//` comments, not assertions. CONFIRMED by the two green runs.

### 5c. NOT run

`node scripts/check-test-ratchet.mjs` is not this lane's to run (it holds the gate mutex); the chair re-runs the ratchet and the gate. The whole suite was not run.

## 6. Fences honoured

- Exactly ONE file changed: `src/domain/density/densityCreateBoundary.js`. No test file needed changing (3b's condition did not trigger).
- No comment edited, no register, no baseline, no `--update`, no `--write`, no `--fix`.
- Never touched `/Users/cstokes/Desktop/settlement-engine`; never entered another dock. (The dock's `node_modules` is a symlink into the main tree — dependency resolution only, which is how vitest already runs here. No repo file of the main tree was read or written.)
- Explicit staging only: `git add src/domain/density/densityCreateBoundary.js`. No `git add -A/-u/.`, no push, stash, rebase or amend.
- The helper scripts (`scan-em.mjs`, `apply-car12.mjs`) live in `$SC`, OUTSIDE the dock, so they cannot enter the tree.

## 7. The car

Committed as **`e47974d84`**, one car over `908665aaf`. Executed output:

```
=== porcelain (empty = clean) ===
=== untracked (empty = none) ===
=== git log -2 ===
e47974d84 §913 car 12: three em dashes leave three why-strings in densityCreateBoundary.js — the Tier-2 voice ratchet's per-file debt returns to its banked ceiling
908665aaf Register (capsule car): the base-state capsule regenerates at the §913 tip (rung 18 still; no OSR movement at this landing)
=== files in the car ===
 src/domain/density/densityCreateBoundary.js | 6 +++---
 1 file changed, 3 insertions(+), 3 deletions(-)
=== trailers ===
Seat: Opus 5 — Fable-unvalidated
Lane: L-MAT-FIX
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

Porcelain 0 and zero untracked after the commit; the pre-commit hook re-staged
nothing (the car is still 3 insertions / 3 deletions in one file). Staging was
explicit (`git add src/domain/density/densityCreateBoundary.js`) and every staged
hunk was read back before committing and was one of my three.

**The committed blob re-measured**, not just the worktree:

```
FILE …/committed-blob.js   (git show HEAD:src/domain/density/densityCreateBoundary.js)
literals scanned: 70
em=0 bang=0
--- literals containing an em dash ---
(none)
```

and `diff -q` reports the worktree file IDENTICAL to the committed blob.

## 8. What the chair still owes this cure

The car returns `[files-over-baseline]` to **2**, the banked ceiling — it does not go below it, and it must not: the two remaining files are pre-existing banked debt, not this consist's. The chair re-runs `node scripts/check-test-ratchet.mjs` and the composed-tip `npm run check` to confirm `test:ratchet` goes green. I measured the population (em 3 → 0) and the arm's own output (three lines → two); I did not measure the ratchet script itself, and I do not claim it passes.

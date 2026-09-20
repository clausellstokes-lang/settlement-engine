# FIX-P4 — RECEIPT (REVIEW-P F5, F6, F15 — all three cured, landed, gated)

Lane: Opus FIX-P4. Chair: Fable 5.1, session a9df403c. Date **2026-09-20** (`date` read in the
same call as the state check: `Sun Sep 20 08:10:54 EDT 2026`).
Worktree `$SP/lane-fix-p4`, branch **`fix-forge-coach-2026-09-20`**, cut at **63e40fe57**.
`$SP/lane-fix-p4-scratch/FIX-P4.lane-resume.md` is DISCHARGED — every batch it listed was run.

## THE TWO COMMITS

| sha | finding | paths |
|---|---|---|
| **3b7eb66ee** | F5 + F6 | `src/components/PostGenCoach.jsx` · `src/components/FeedbackWidget.jsx` · `tests/components/postGenCoach.test.jsx` · `tests/lint/bottomAnchoredChrome.walker.test.js` · `tests/lint/uiA11yContract.walker.test.js` |
| **268d0846c** | F15 | `public/map/main.js` · `docs/fmg-fork.md` · `tests/lint/embeddedMapConsoleGate.walker.test.js` · `scripts/mutation-coverage-manifest.json` |

`git show --stat HEAD` on each names ONLY those paths. `git status --short` is **empty**
(`STATUS_EMPTY=yes`); no untracked file was disturbed; the pre-commit hook rewrote nothing
(no ` M` reappeared on any committed path).

## GOLDENS — hashed before the first edit and after the last, IDENTICAL. **CONFIRMED.**

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

---

## PHASE 1 — RED FIRST (executed; the working tree was reverted with `git show 63e40fe57:… > …`, which writes the working tree ONLY and never touches the index, so the staged cure was safe throughout; cured copies also held in `$SCR/cured/`)

**R1 — the coach pins against the PRE-CURE component**
```
 Test Files  1 failed (1)
      Tests  7 failed | 15 passed (22)
```
and the seven failures are exactly the new pins:
```
 FAIL … the coach waits for the forge (REVIEW-P F5) > ABSENT while the reveal is still playing, even though the settlement is in the store
 FAIL … the coach waits for the forge (REVIEW-P F5) > PRESENT once the reveal clears, and it is the reveal that decides
 FAIL … the coach waits for the forge (REVIEW-P F5) > the gate is the reveal FIELD, not a settlement-shaped proxy
 FAIL … the dock is clear of the reading column (F5/F6) > the card takes NO viewport layer: not fixed, no z-index, no bottom anchor
 FAIL … the dock is clear of the reading column (F5/F6) > it shares the dossier column's own frame (PAGE_MAX, auto margins)
      AssertionError: expected 'calc(100vw - 48px)' to be '1200px'
 FAIL … the dock is clear of the reading column (F5/F6) > NO OVERLAP at 1440 and at 1024, where the old fixed box overlapped by 244 and 340
      AssertionError: the card re-entered the viewport layer at 1440: expected false to be true
 FAIL … the dock is clear of the reading column (F5/F6) > it is a labelled REGION, not a dialog (REVIEW-P F6)
      AssertionError: expected 'dialog' to be 'region'
```

**R2 — the F15 walker against the PRE-CURE flag block**
```
 Test Files  1 failed (1)
      Tests  3 failed | 13 passed (16)
 FAIL … > INFO is muted on a deployed host
      AssertionError: INFO prints on a deployed host: this is REVIEW-P F15 returning: expected true to be false
 FAIL … > TIME is muted on a deployed host   (same shape)
 FAIL … > WARN is muted on a deployed host   (same shape)
```
⭐ The walker's own CONTROL arm stayed **GREEN** inside that red run — the detector separates the
two shapes rather than failing wholesale, which is what makes the muting arms non-vacuous.

Working tree restored from `$SCR/cured/` and verified: `git status --short` showed no ` M`
second column, i.e. tree and index agreed again before any green run.

## PHASE 2 — GREEN (every line through `gate-mutex.sh --run`, SHARED tier, both exports inline, `--pool=threads --maxWorkers=2`, one directory per invocation; every line printed a count)

| batch | scope | count line |
|---|---|---|
| G1 | `tests/components/{postGenCoach,wizardNextSteps,appShellResilience}` | `Test Files  3 passed (3)` · `Tests  35 passed (35)` |
| **G2** | **the WHOLE `tests/lint` directory (173 files)** | `Test Files  1 failed \| 172 passed (173)` · `Tests  1 failed \| 2791 passed (2792)` · `Duration 295.62s` |
| G2b | `tests/lint/embeddedMapConsoleGate.walker.test.js` (re-run after the eslint-directive edit) | `Test Files  1 passed (1)` · `Tests  16 passed (16)` |
| G3 | `tests/domain/{guidanceRegistry.walker,guidanceNotes}` | `Test Files  2 passed (2)` · `Tests  47 passed (47)` |
| G4 | `tests/store/guidancePageOrigin` | `Test Files  1 passed (1)` · `Tests  6 passed (6)` |
| G5 | `tests/security/{mapForkXssChain,cspForkIsolation}` | `Test Files  2 passed (2)` · `Tests  77 passed (77)` |
| G6 | `tests/map/{sfBridge.harness,sfOrigin.harness}` | `Test Files  2 passed (2)` · `Tests  34 passed (34)` |
| G7 | `tests/build/{vendorPdfLazy,thirdPartyNoticesPage,vendorManifestExactSet,vendorManifestNonEmpty}` | `Test Files  4 passed (4)` · `Tests  60 passed \| 27 skipped (87)` |
| G8 | `tests/copy/voiceMechanics` | `Test Files  1 passed (1)` · `Tests  30 passed (30)` |
| G9 | `tests/lib/sfBridgeOrigin` | `Test Files  1 passed (1)` · `Tests  3 passed (3)` |
| G10 | `npx eslint` on all six touched linted files | **EXIT=0**, no output (after the fix below) |

**G2's ONE failure is the frozen lighting census and nothing else.** The standing instruments all
ran inside it and PASSED: `negativeAssertionAnchor.walker`, `mutationCoverageManifest`,
`uiA11yContract.walker`, `bottomAnchoredChrome.walker`, the new `embeddedMapConsoleGate.walker`,
and — settling the risk this lane flagged before the gate — **`observedShapeReaders.walker` and
`writerReach.walker` both passed**, so the new `s.pipelineRevealActive` store read minted no
identity row and the migration-bundle door was not needed.

**eslint caught one thing and it was fixed, not shipped:** the first G10 run exited 0 but warned
`Unused eslint-disable directive (no problems were reported from 'no-new-func')` at
`embeddedMapConsoleGate.walker.test.js:81`. `no-new-func` is not configured in this estate, so the
directive was stale rot; it was removed, eslint re-run clean, and the walker re-run green (G2b).

## LIGHTING CENSUS — MEASURED, **NOT REFROZEN**

Measured inside G2 (one run, as instructed):
```
 FAIL  tests/lint/sovereigntyLightingContract.walker.test.js > … > THE CENSUS IS AN ASSERTION, NOT A SENTENCE — every stated figure is executed
 AssertionError: the estate's file count moved — re-measure, do not re-word: expected 2652 to be 2650
```

**THIS LANE'S DELTA IS EXACTLY +1 FILE**, measured in BOTH directions rather than assumed:
```
WORKTREE (on disk)   *.test.js|jsx under tests/: 2652
BASE 63e40fe57 (git) *.test.js|jsx under tests/: 2651
diff → the single line:  > tests/lint/embeddedMapConsoleGate.walker.test.js
git status --untracked-files=all → no other untracked file anywhere in the worktree
```
⛔ **The register was ALREADY STALE BY +1 AT THIS LANE'S BASE**: the walker's `CENSUS.files` reads
**2650** while the base tree 63e40fe57 really holds **2651**. That +1 is another hand's, not this
lane's. (Consistent with the chair's own note that the tip measures 2656 against a register of
2653.) The enumeration rule is `walk(ROOT/tests).filter(/\.test\.(js|jsx)$/)` — file count only.

**The other four figures did not execute.** The census is ONE test and it aborts at its first
`expect` (`sovereigntyLightingContract.walker.test.js:7460`), so `parked`, `credited`, `titles` and
`suiteTitles` were never reached. They come out of the refreeze run, which is the train's terminal
act and the chair's. ⛔ `LIGHTING_CENSUS_REFREEZE` was **never set**.

For the chair's refreeze, the new file's title shape: **4 suite titles, 16 tests**, of which 9 come
from three `test.each(MUTED_CHANNELS)('%s …')` over three channels. `each` is in this walker's
CREDITED running grammar (`RUNNING_TEST_MODIFIERS`, `CREDITED_TABLE_MODIFIERS`, and the executed
`it.each([])('MARKER — %s', …)` arms at its lines 1042-1043), so the file is **not** a parking
hazard — and no park/parse arm in the lighting file fired on it.

---

## WHAT CHANGED, IN ONE PARAGRAPH EACH

**F5, the timing.** The coach's only gate was "is a settlement on screen". The settlement lands at
`storeMs 785`; the forge's rail still has ~7 s of deliberate pacing (`readableMs` 7,700 desktop /
8,990 phone). It now also reads `pipelineRevealActive`, traced single-writer first: armed at
`settlementGenerateAction.js:584`, cleared at `settlementSlice.js:222` and
`settlementLifecycleHelpers.js:302`, with exactly ONE `<PipelineReveal>` mount
(`GenerateWizard.jsx:522`, `onComplete={dismissPipelineReveal}`) that fires even on empty history.
No timer. The coach now appears on precisely the field the dossier appears on.

**F5, the occlusion.** Computed from the constants both boxes use (`layout.page = 1200`,
`SP.xxl = 24`): column `[120,1320]` vs card `[1076,1416]` at 1440 → **244 px**; column `[24,1000]`
vs card `[660,1000]` at 1024 → **340 px**, the card's whole width, 34.8% of the column. A
viewport-anchored card clears a centred column only if the column is under 712 px at 1440 and
616 px at 1024 (it is 1200 and 976), so there was no placement to move it to; insetting the column
costs 20% then 35% of reading width. The card docks in the page's own flow at every width, capped
to `PAGE_MAX` and centred on the dossier body's own frame. The phone box is unchanged (the cap is
inert there).

**F6, the role.** `role="dialog"` → `role="region"` with a stable label, matching
`dossier/FirstDossierCallouts.jsx:94-95`, the in-flow guidance idiom and the coach's own
higher-priority sibling. A bottom sheet was rejected: it contradicts the standing §934.31 ruling
quoted in this file's header (non-modal, untrapped, on purpose).

**F15, the console.** All three lines are `WARN &&`-guarded FMG emitters (`main.js:359`,
`main.js:784`, and one in the minified vendor bundle, untouched). `PRODUCTION` — FMG's own dev
switch at `main.js:6` — was declared at the original vendoring (`f386f48d96`) and **read nowhere**
in `public/map/**`; `INFO`/`TIME`/`WARN` were flat-`true`. They now read it; `ERROR` stays
unconditional; the `debug` localStorage key re-opens any channel. Measured before muting `TIME`:
all 64 `console.time` calls are paired with 64 `console.timeEnd` and both are `TIME`-guarded across
all 181 `.js` under `public/map` (zero unguarded), so muting cannot orphan a timer into a NEW
warning. The patch lives where `docs/fmg-fork.md` §2 says SettlementForge inline patches live,
tagged `SettlementForge fork patch`, with a new runbook row.

## REGISTERS THIS MOVES WHEN COMPOSED (deltas)

1. `tests/lint/bottomAnchoredChrome.walker.test.js` — LIFTED row `'src/components/PostGenCoach.jsx': 1`
   **struck**, reason written in place. Exact in both directions, so re-adding a fixed
   bottom-anchored site in that file now reds.
2. `tests/lint/uiA11yContract.walker.test.js` — M10 **restated, not deleted**. Its `zOf` did
   `code.match(/zIndex:\s*(\d+)/)[1]`, which would have **thrown** (not failed) once the literal
   went. New subject: the bottom-right corner has exactly ONE layered owner. Its negative is
   anchored by a positive control on the same probe against `FeedbackWidget`.
3. `scripts/.ui-a11y-contract.json` — **untouched**; `zLayers.coach: 900` stays as a named-band
   reservation (the walker asserts distinctness + "every zIndex literal resolves", not usage).
4. `scripts/mutation-coverage-manifest.json` — **+1 `rationale` row** for the new walker
   (self-proving, with its reason written out).
5. `docs/fmg-fork.md` — **+1 §2 runbook row** (`~8–30`), so an FMG re-vendor reconciles it.
6. `scripts/.test-ratchet-baseline.json` — untouched; `test:ratchet` is forbidden to a lane and
   the +1 file / +24 tests land at the train.

## ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot

1. **Two shipped comments describe a flag that no longer exists.** `PipelineReveal.jsx:35` says
   *"Flag: `pipelineReveal` (default on in prod)"* and `settlementGenerateAction.js:581-583` says
   *"Gated by the flag at the consumer site (GenerateWizard) so a flag-flip kills the behavior
   without touching the slice."* MEASURED: there is no `pipelineReveal` entry in `src/lib/flags.js`
   and **no `flag(` call at all** in `GenerateWizard.jsx`. The reveal is unconditional. This is
   load-bearing for F5's cure (it is WHY the field is a safe completion signal), so it is stated
   rather than relied on silently. **Slot:** decide whether the reveal should be flag-gated again
   or the two comments corrected; one-line either way.
2. **49 unguarded `console.*` calls remain in `public/map/**`** — 22 inside vendored third-party
   libs (tinymce 15, polylabel 3, jquery 1, plus plugin files), and on our side `sf-bridge.js` 9,
   `main.js` 6, `modules/io/cloud.js` 2, `modules/io/load.js` 1. None fired on the realm load
   REVIEW-P measured (they are error and conditional paths), so they are NOT F15 and were
   deliberately not frozen — the walker's header says so outright. **Slot:** a second pass that
   either routes our four files' calls through a channel or freezes them with a reason per site.
3. **The lighting register is stale by +1 independently of this lane** (register 2650 vs base tree
   2651 at 63e40fe57). **Slot:** the chair's refreeze should attribute that +1 as well as this
   lane's, so the tuple's provenance stays honest.
4. **`zLayers.coach: 900` is now an unused named band.** Left deliberately (a reservation, not a
   usage record). **Slot:** a decision at the next contract pass — keep as reservation or retire.
5. **`main.js` `addLakesInDeepDepressions` typed-array bug** is documented in `docs/fmg-fork.md` §2
   as owner-gated (fixing it shifts same-seed output). Untouched, correctly. Restated here only so
   the next reader of that file does not re-find it as new.
6. **The coach called `useIsMobile()` twice for the same value** (`mobile` at :78 and `isMobile` at
   :112). Removed as part of the cure, not left as a leftover — noted so the diff's extra deletion
   is accounted for.

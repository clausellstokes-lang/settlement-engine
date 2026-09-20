# CURE-E / CURE-F / CURE-G — LANDED. Three pathspec commits, every gate green.

**Lane:** Opus CURE-E (extended to F and G). **Stamped** Sun Sep 20 03:33:59 EDT 2026 (clock read in the same call as the stamp).
**Branch:** `fixes-2026-09-18-consist`. **Base on entry:** `63e40fe57`, tree clean.
**Rulings:** ODQ §934.47 addendum 41 (CURE-E), the CURE-F ruling, addendum 43 (CURE-G). Both
divergences were put to the chair with proof BEFORE the gate and were ACCEPTED, vetoably.

| commit | subject | paths |
|---|---|---|
| `9f3455b84` | CURE-E | `tests/domain/humanizeEngineTokens.test.js`, `tests/components/faithPanelModel.test.js` |
| `96036427f` | CURE-F | `src/domain/worldPulse/pulseKernel.js`, `tests/store/participationWriteBase.test.js` |
| `c71782e7f` | CURE-G | the rename (**R**, 100%), `scripts/mutation-coverage-manifest.json`, `tests/scripts/baseStateCapsule.test.js`, `docs/implementation/PACKET_MANIFEST.json` |

`git status --short --untracked-files=all` → **0 lines**. Nothing outside those paths moved;
no `git add -A`, no stash, reset, clean, rebase, amend, `--no-verify` or push was used.

---

## EVERY COUNT LINE

All vitest through `gate-mutex.sh --run`, `GATE_MUTEX_TIER=shared`, `--maxWorkers=2`, one test
directory per invocation. A line with no printed count did not run; every line below printed one.

### BATCH 1 — CURE-E
```
tests/domain/humanizeEngineTokens.test.js    Test Files 1 passed (1) / Tests 22 passed (22)
tests/components/faithPanelModel.test.js     Test Files 1 passed (1) / Tests 11 passed (11)
npx eslint (both paths)                      exit 0, no diagnostics
```

### BATCH 2 — CURE-F
```
RED-FIRST (throwaway copy, landed comparand restored, never on the tree):
   Test Files 1 failed (1) / Tests 1 failed | 4 passed (5)
   "THE CLOCK STAGE'S ROSTER WRITE WAS DROPPED ON A TICK WITH NOBODY OFF-STAGE …
    expected [ …(7) ] to deeply equal [ …(8) ]"  — diff missing "npc.wystan_the_clerk_2l4kw1"
   ⭐ A1, A2, A4 and A8 ALL PASSED on the landed comparand: only the new arm discriminates.

tests/store/participationWriteBase.test.js   Test Files 1 passed (1) / Tests 5 passed (5)
tests/domain/roadsParticipation.test.js      Test Files 1 passed (1) / Tests 8 passed (8)
tests/lint/sizeBaseline.test.js              Test Files 1 passed (1) / Tests 3 passed (3)
npm run typecheck:ratchet                    OK — no type regressions (167 errors, ceiling 167)
npx eslint (both paths)                      exit 0, no diagnostics
```
**Effective lines 1581 → 1581**, eslint's own Linter, `max-lines {skipBlankLines, skipComments}`,
measured before the edit and after it. Banked permanently at 1581 by R-BLD-10, so it reds in both
directions — an equality, not a budget.
**Goldens unmoved** (identical to the hashes EM-P3's receipt quoted):
```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  dossier-prose-manifest-golden.json
```

### BATCH 3 — CURE-G
```
CONVICTION (throwaway copy, seed reverted to the pre-EM-B1k `vaulted.settlement`, never on the tree):
   Test Files 1 failed (1) / Tests 4 failed | 1 passed (5)
   A1: "THE STORE SAVE LOST SOMEBODY THE TICK DID NOT REMOVE (store 6 of 7 / DB 6 of 7;
        un-shelve afterwards -> {"ok":false,"status":"failed","reason":"npc_target_missing"})"
   A2 (hostage erased), A4 (off-stage dropped while the tick's writes survived) and CURE-F's arm
   convict on the same mutant. A8 correctly stays GREEN — it pins the by-reference premise and
   never reads the seed, so the conviction is four roster-reading arms, not the file going dark.

tests/store/participationWriteBase.contract.test.js  Test Files 1 passed (1) / Tests 5 passed (5)
tests/lint/mutationCoverageManifest.test.js          Test Files 1 passed (1) / Tests 10 passed (10)
tests/scripts/baseStateCapsule.test.js               Test Files 1 passed (1) / Tests 9 passed (9)
npx eslint (both touched test paths)                 exit 0, no diagnostics
npm run validate:packets                             valid: 191 packets (1 READY), exit 0
```
Enumeration: manifest rows **707**, live enumeration **707**, **set-equal**, zero enumerated
without a row, zero stale. Floor **440 → 707** (live 706 before this commit's own rename, +1 from
it), spelled `toBeGreaterThanOrEqual` so it sits AT the measurement.

---

## THE LIGHTING TUPLE AT THE FINAL TIP — measured, never refrozen by me

Measured in a throwaway copy by letting the walker adjudicate a predicted tuple; it went fully
green (**34 passed (34)**) on:

```
files 2651 · parked 383 · credited 2268 · titles 25035 · suiteTitles 6678
```

against the frozen `2650·383·2267·25028·6677`. **+1 file and +6 titles and +1 suite are INHERITED
from EM-B1k's own landing** (its suite postdates the baseline's measured tree at `32602dc60`);
**CURE-F contributes exactly +1 title**, and CURE-E and CURE-G contribute none — the rename is
census-neutral because the walker classifies by `parkReasonsFor(src)`, not by filename.

⭐ The chair refroze at **`21b991118`** while this lane was finishing, to **exactly that tuple**,
attributing it identically. The two measurements were independent and agree.

---

## THE TWO DIVERGENCES, AS EXECUTED

**1. CURE-G's row ships `kind:'rationale'`, not the ruled `kind:'mutation'`.** A mutation row is a
two-file contract: LABEL JOIN needs the label in `scripts/mutation-sweep.sh` or it reds as phantom
coverage, and DIRTY-GUARD TOTALITY needs the file in `MUTATED_FILES` — and the sweep carries
neither for `pulseKernel.js`. Its revert is the `git checkout --` family forbidden to build lanes,
against the pulse mouth in a shared tree. The row names the convicting mutant exactly, carries the
executed conviction, and has a written promotion path (TOOL-6b's dock).

**2. `PACKET_MANIFEST.json` gained ONE `retiredBy` annotation.** Proved necessary by execution: with
the rename in place and the annotation removed, the validator errors
`EM-B1k.changeManifest[1].path does not exist for LANDED CREATE`; with it, `valid: 191 packets`.
§731.3 discharges only the existence assertion — the historical claim is unrewritten, and EM-B1k's
prose and its two `checks` arrays were not touched.

---

## NOTICED AND NOT TOUCHED — the roster

1. **`scripts/mutation-sweep.sh` has no plant and no `MUTATED_FILES` row for `pulseKernel.js`.**
   Promoting CURE-G's row to `kind:'mutation'` needs both, plus a single-owner checkout or CI.
   **Slot: TOOL-6b's dock.**
2. **EM-B1k's two `checks` arrays still name the old path.** Harmless — `checks` are validated as
   argv-shaped string arrays, never for path existence (verified) — but `npm run check:packet --
   EM-B1k` would now fail on them. A landed packet is not normally re-checked. **Slot: note only.**
3. **`GENERATED_ROUTE_VALUES` (`src/domain/tradeRouteSemantics.js:175`) is an unpinned third copy**
   of the route vocabulary, coupled to `TERRAIN_ROUTE_POOLS` by doc comment only. No test ties it
   to the pools. **Slot: EM-P3b.**
4. **The marker-slice silent-failure class wants a lint.** `String.slice` is silent in two
   directions — inverted markers give `''`, a missing END marker over-captures to EOF (measured at
   199,521 characters on the faithPanel instance). Both instances are now cured by hand; a walker
   refusing a marker-slice without found-and-ordered assertions would close the habitat.
   **Slot: TOOL-7.**
5. **`objectLiteralKeys`/`fnBody` are exported from a `*.test.js`** that no other test can safely
   import (importing registers its suites). CURE-E mirrored the idiom locally. A
   `tests/helpers/sourceScan.js` home would let the next scan reuse rather than re-mint.
   **Slot: TOOL-7.**
6. **A naive brace-matcher mis-reads a body holding `'{'` as data** — my first arm-extractor hit
   exactly this and its self-check caught it. TOOL-7's lint needs the string/comment-skipping
   form, not the naive one. **Slot: TOOL-7.**
7. **`src/components/home/landingFixture.js:47` holds `"tradeRouteAccess": "random_trade"`** — the
   roll SENTINEL, not a route, on a settled settlement's config, where `displayLabel` renders it
   "Random trade" to a reader. **Slot: EM-P3b, after a reader check.**
8. **`src/data/sampleDossier.json:15` holds `"tradeRouteAccess": "salt road"`** — in no vocabulary;
   `tradeRouteTier` scores it the fail-closed `'unknown'`. Probably deliberate flavour.
   **Slot: EM-P3b, confirm intent.**
9. **`tests/domain/humanizeEngineTokens.test.js` reads its producer by a CWD-relative path** while
   four sibling suites ROOT-anchor via `import.meta.url`. Loud (ENOENT) rather than silent, so it
   is not in the class CURE-E closed and was deliberately left. **Slot: a tidy-up with TOOL-7's helper.**
10. **`tests/helpers/goldenMasterCorpus.js:107`** cites `TERRAIN_ROUTE_POOLS` in a comment; a
    stale-citation candidate of the kind CURE-D swept. **Slot: note only.**

---

**THREE CURES LANDED. THE GATE IS RELEASED.**

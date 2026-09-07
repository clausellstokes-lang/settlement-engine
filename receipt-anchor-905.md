# RECEIPT — ANCHOR-905 — **COMPLETE**

Lane: ANCHOR-905 · Seat: Opus 5 — Fable-unvalidated · Chair: Fable 5.1
Dock: `$SC/laneANCHOR905` detached @ `6582958ce7bdc10bcbb8c69d9789b4d957fc5890`
Arrival porcelain: **0 lines**. node_modules: **453 symlinked packages** (never materialised).
VITEST HOLD present at start (`$SC/HOLD-VITEST`) — all reading/measuring/editing done under the hold; no vitest, no build.

Status: **COMPLETE** — see the DOCK TIP and RETROVALIDATION ROW at the end.

---

## Premises re-derived (P1–P5) — measured at `6582958ce`, all reads, no instruments

### P1 — the precedent. **CONFIRMED exactly.**
`tests/lib/flags.test.js:97-100`, inside `describe('FLAGS registry')`:
`it('does not expose the retired journey media-set comparison toggle', () => { expect(FLAGS).not.toHaveProperty('loadingJourneySetBg'); })`.
Imports (line 14): `flag, setFlagOverride, getAllFlags, FLAGS` from `../../src/lib/flags.js`.
File is 111 lines, three describes (`flag() resolution`, `getAllFlags()`, `FLAGS registry`).

### P2 — what the walker counts. **CONFIRMED, and R4's mechanism is REFUTED.**
`tests/lint/negativeAssertionAnchor.walker.test.js`:
- `scanUnanchoredNegatives` (lines 115-138) counts a `not.(toContain|toMatch|toHaveProperty)(` site ONLY when the line fails all three exemptions: `HELPER_RE` on the line (`:129`), `ANNOTATION_RE` on the line (`:130`), `ANNOTATION_RE` on the ONE line above (`:131`). `found[rel]` is recorded only `if (hits.length)` (`:135`) — **a file at zero is ABSENT from the scan, not present with 0**.
- `ceilingFor` (`:815`) = `FROZEN_UNANCHORED_NEGATIVES[file] ?? READMITTED_GENERATION_FACING[file] ?? 0`.
- Arm `no NEW un-anchored…` (`:840`) reds only when `count > ceiling`.
- Arm `inventory honesty…` (`:865`) reds when `actual < ceiling`, message: *"LOWER the row to ${actual} (delete it at 0) to bank the win"*.
- `:620` reads `  'tests/lib/flags.test.js': 1,` — **CONFIRMED verbatim**.
- flags.test.js has **exactly ONE** walker-countable site today: line 99. Matches the frozen 1.

⇒ **R4's claim that "the anchor moves the baseline 1 → 2" is FALSE for the car as briefed.** It holds only for an UN-anchored new site. An ANCHORED new negative is never counted, so the row does not rise. The chair's 21:28 re-read is the true one.

**A row at zero must be DELETED, not set to 0** — three independent citations, all in the walker:
1. `:193-194` — *"then LOWER this file's number — delete the row at 0."*
2. the `inventory honesty` arm's own failure text (`:874`) — *"(delete it at 0)"*.
3. `:200` — the recorded precedent: `tests/ui/homeLanding.test.jsx  1 → 0`, row **deleted**.
Plus a fourth, structural: `renderLiteral` (`:140-146`) emits a row only for files in `found`, and a zero-count file is never in `found` — so a `UPDATE_EPISTEMIC_ALLOWLIST` regeneration could never produce a `: 0` row. Keeping one would put the hand-written literal permanently out of step with its own regenerator.

### P3 — the footprint. **CONFIRMED exactly: FIVE hits, no more, no less.**
`docs/UIUX_AUDIT_AND_PLAN.md:1960` · `docs/critique-implementation-status.md:71` · `src/lib/flagRegistry.js:78` (RETIRED note) · `:95` (lit-note) · `:166` (env example comment `VITE_FLAG_MOBILE_SINGLE_CHROME`). **Zero hits under `scripts/` or `tests/`** — no test names the flag today.

### P4 — the helper. **IT FITS, via the keys array — the helper is CHOSEN over a comment marker.**
`tests/helpers/anchoredNegatives.js:111` `expectAbsentWithAnchor(collection, member, anchor, context)` asserts the anchor IS present and the member is NOT.
⚠ `assertContainable` (`:50-60`) accepts only `string | Array | Set | Map`. **`FLAGS` itself is a plain object and would be REFUSED**, so the subject must be `Object.keys(FLAGS)`.
That is not a workaround, it is the exact surface: `src/lib/flags.js:95-101` builds `FLAGS = Object.freeze(Object.fromEntries(Object.keys(FLAG_DEFAULTS).map(...)))`, and both `getAllFlags` and the dev panel read the key set. "Exposed by the registry" *is* "present in `Object.keys(FLAGS)`".
The idiom is already estate-established, including in this very directory: `tests/lib/accountImport.test.js:281` `expectAbsentWithAnchor(keys, owned, 'campaignState', …)`; four `tests/lib/` files already import the helper.

**Anchors chosen (nearest surviving relative, so the same drift that removed the family reds on the anchor):**
- `loadingJourneySetBg` → **`loadingJourneyFilm`** (`flagRegistry.js:126`, description at `flags.js:86`) — the surviving journey-film flag; the retired key was its media-set comparison companion.
- `mobileSingleChrome` → **`workshopNav`** (`flagRegistry.js:47`, description at `flags.js:62`) — the surviving top-level nav flag.
Both verified present in `FLAG_DEFAULTS`; `loadingJourneySetBg` verified absent from all of `src/`.

### P5 — REGISTER PREDICTIONS, WRITTEN BEFORE ANY INSTRUMENT RAN

| Register | Frozen now (measured by read) | Predicted after this car | Door |
|---|---|---|---|
| Negative-assertion roster | `'tests/lib/flags.test.js': 1` at `:620`; 502 rows / 1526 sites general + 5 quarantine = **1531** frozen | **row DELETED**; 501 rows / 1525 sites + 5 = **1530**. Live `found` for the file: absent (0 sites) | banked **by hand in this car** (shrink-only burn-down; the walker's own banking act) |
| Lighting census (`tests/lint/.lighting-census-baseline.json`) | files 2543 / parked 373 / credited 2170 / titles 23653 / suiteTitles 6333 | files, parked, credited, suiteTitles **UNCHANGED**; **titles 23653 → 23654** (one new `it(`, no new `describe(`, no new file) | ⚠ **CHAIR'S** — I do not touch it and I do not run the refreeze |
| Test ratchet (`scripts/.test-ratchet-baseline.json`) | totalTests 31970, totalFiles 2489, entries 3 | live rows 31970 → **31971**; totalFiles 2489, entries 3 unchanged | **NO DOOR OWED — see the refinement below** |
| OSR (`scripts/.observed-shape-readers-baseline.json`) | `total` = **1972** | **1972 exact, no drift** (zero `src/` bytes) | none |
| Writer-reach, prose-numerics | — | unchanged (zero `src/` bytes) | none |

**⚠ PREDICTED RED, ATTRIBUTABLE TO THIS CAR, WHOSE DOOR IS THE CHAIR'S.**
`tests/lint/sovereigntyLightingContract.walker.test.js:7454` asserts `expect(titles, …).toBe(CENSUS.titles)` — **exact equality against the WORKING TREE**, and the census is *sequenced* (it stops at its first red figure; order files → parked → credited → titles → suiteTitles). `files`/`parked`/`credited` do not move, so the run reaches `titles` and reds there. Expected message, ACTUAL first: **`expected 23654 to be 23653`**.
I may not cure it: the baseline file's own `_doc` says *"⛔ NEVER HAND-EDIT THE FIVE FIGURES"*, and the only legal cure is `LIGHTING_CENSUS_REFREEZE=… npx vitest run …` — a register door, forbidden to this lane by the preamble and the brief. **Recorded, not banked, not cured.**

**⚠ REFINEMENT OF THE CHAIR'S P5 — the test ratchet owes NO door.**
The brief lists `totalTests 31970 → 31971` among the registers. The arithmetic is right but the consequence is not: `scripts/check-test-ratchet.mjs:1330-1331` and `:1350-1351` compare against `Math.floor(baseline.totalX * SCOPE_FLOOR_RATIO)` with `SCOPE_FLOOR_RATIO = 0.9` (`:124`) — these are **collapse floors, not exact pins**. 31971 sits far above `floor(31970 × 0.9) = 28773`. And `tests/lint/testRatchet.test.js` is a **static shape pin over the baseline JSON** (key identity, attribution, magnitude well-formedness, `npm run check` wiring) that reads no live count at all. ⇒ the test ratchet **stays green and needs no register act**; the frozen figure is merely one stale-low inside a 10% band, refreshed on the next regeneration.

**Golden-freeze register, checked rather than assumed.** `tests/fixtures/.golden-freeze-register.json` does name `negativeAssertionAnchor.walker.test.js`, but only inside `excludedEnvSpellings` — `UPDATE_EPISTEMIC_ALLOWLIST` is *excluded* from the roster as "an allowlist of epistemically-weak assertion shapes, shrink-only by its own walker. Not a world fingerprint." I add and remove no env spelling, so that entry is untouched and no golden-freeze pin covers my edit.

---

## The car as written (test files only; ZERO `src/` bytes)

**`tests/lib/flags.test.js`** — one import added, the legacy case re-anchored, one new case:
- `import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';`
- `loadingJourneySetBg` case: bare `expect(FLAGS).not.toHaveProperty(…)` → `expectAbsentWithAnchor(Object.keys(FLAGS), 'loadingJourneySetBg', 'loadingJourneyFilm', …)`
- NEW: `it('does not expose the retired single-chrome mobile nav toggle', …)` → `expectAbsentWithAnchor(Object.keys(FLAGS), 'mobileSingleChrome', 'workshopNav', …)`, with one comment line naming `89ff7b03b` and `8bf493d05`.
- Measured after the edit: **0** walker-countable `not.(toContain|toMatch|toHaveProperty)(` sites remain (was 1); `it(` 10 → **11**; `describe(` **3, unchanged**.

**`tests/lint/negativeAssertionAnchor.walker.test.js`** — the row `'tests/lib/flags.test.js': 1,` at `:620` is **DELETED** (per P2's three citations + `renderLiteral`), banking the burn-down win in the same commit.

No new test file. No `src/` change. Nothing else.

### Ordering choice (the brief's P2 note asked me to declare it)
I made the edit, then **parked it in scratch and restored the dock to pristine** (`cp` from a pre-edit backup, verified byte-for-byte with `cmp`; porcelain back to 0 — never `git checkout --`, never `git show HEAD:… >`). This buys the honest **three-state** proof the brief's negative control only asked two states of:
1. **PRE-EDIT baseline** — pristine tree, row at 1 → walker must be **GREEN**, proving the row is a true reading and not already stale.
2. **NEGATIVE CONTROL** — anchored tree, row still at 1 → walker must be **RED** on `inventory honesty` (`actual 0 < ceiling 1`), proving the anchor is actually recognised by the scanner rather than merely believed to be.
3. **FINAL** — anchored tree, row deleted → walker must be **GREEN**.
State 2 needs no deliberate un-anchoring: it *is* the intermediate state, so the control is the real thing rather than a mock-up of it.

Backups (for `cmp` verification of every restore): `$SC/anchor905-scratch/flags.test.js.PRISTINE` sha256 `ff7908ae…`, `$SC/anchor905-scratch/flags.test.js.ANCHORED` sha256 `51cfff08…`, `$SC/anchor905-scratch/walker.test.js.PRISTINE` sha256 `5817164b…`.

**No `src/` bytes moved ⇒ NO typecheck run is owed** (`npm run typecheck:domain:strict` and the full typecheck are untouched by a test-only car).

### Status at the hold
Reading, measuring, predictions and the edit are all complete. Dock porcelain **0**, edit parked in scratch. Now polling `$SC/HOLD-VITEST` on a 60 s `sleep` loop; no vitest and no build has run.

---

## PROOFS (hold lifted after ~4 min of 60 s polling; every exit captured in-shell as `CMD; E=$?`)

### 1. Negative control — the three-state sequence. **The anchor is PROVEN recognised, not assumed.**

**STATE 1 — PRE-EDIT baseline** (pristine tree, row at 1) · `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js`
```
STATE1 EXIT=0
 Test Files  1 passed (1)
      Tests  9 passed (9)
```
⇒ the frozen `1` was a LIVE, true reading on arrival — not an already-stale row. Porcelain was 0 at the moment of this run.

**STATE 2 — NEGATIVE CONTROL** (anchored tree, row still at `1`) — RED, **two arms**, exit 1:
```
STATE2 (NEGATIVE CONTROL) EXIT=1
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected [ Array(1) ] to deeply equal []
+   "tests/lib/flags.test.js: 0 un-anchored site(s) found, ceiling 1 — a site was anchored; LOWER the row to 0 (delete it at 0) to bank the win",
AssertionError: the scan found fewer un-anchored negatives than the frozen inventory — either sites were anchored (lower their rows) or the scanner broke: expected 1530 to be greater than or equal to 1531
 Test Files  1 failed (1)
      Tests  2 failed | 7 passed (9)
```
Two things this control establishes that a green alone could not:
- **The scanner genuinely stopped counting the site** — it reports `0 un-anchored site(s) found` where it counted 1 before. The helper form is recognised by `HELPER_RE`, measured rather than believed.
- **The walker's own arithmetic confirms my written prediction.** vitest prints ACTUAL first: `1530` is the live `totalFound`, `1531` the `totalFrozen` I had computed by hand from the literal *before any instrument ran* (502 rows / 1526 sites general + 5 quarantine). The instrument and the prediction agree on both numbers.
- It also names the disposition in the walker's own words — **"delete it at 0"** — independently corroborating P2's ruling.

**STATE 3 — FINAL** (anchored tree, row DELETED) — GREEN:
```
STATE3 (FINAL) EXIT=0
 Test Files  1 passed (1)
      Tests  9 passed (9)
```
General roster after the bank: **502 → 501 rows, 1526 → 1525 sites** — exactly the predicted shrink.

### 2. `tests/lib/flags.test.js` — GREEN, +1 test
```
FLAGS EXIT=0
 Test Files  1 passed (1)
      Tests  11 passed (11)
```
10 → **11 passed**, the predicted +1. Both retirement cases pass through `expectAbsentWithAnchor`, so each now asserts its anchor sibling IS present before asserting the retired key is not.

### 3. OSR plain read — **1972 exact, no drift**
`node scripts/check-observed-shape-readers.mjs; E=$?`
```
OSR EXIT=0
observed-shape readers: 1972 finding(s), exactly matching the frozen inventory.
```
Predicted 1972 exact; measured 1972. A READ only — no register door touched. (Zero `src/` bytes moved, so no drift was possible.)

### 4. THE OWED `tests/lint/` DIRECTORY RUN — exit 1, ONE failing arm, and it is the predicted one
`GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/ --maxWorkers=2`
```
LINT DIR EXIT=1
 Test Files  1 failed | 139 passed (140)
      Tests  1 failed | 2193 passed (2194)
   Duration  169.66s
 FAIL  tests/lint/sovereigntyLightingContract.walker.test.js > the sovereignty lighting condition — a marker is EVIDENCE only in a live title > THE CENSUS IS AN ASSERTION, NOT A SENTENCE — every stated figure is executed
AssertionError: the live TEST-title count moved from SP-C's measured 18,471 …: expected 23654 to be 23653 // Object.is equality
```
**Failing arm list: exactly one** — the lighting census `titles` figure. vitest prints ACTUAL first, so the live tree measures **23654** against the frozen **23653**: precisely the movement predicted in writing above, caused by this car's one new `it(` title.

Two things the run proves beyond the headline:
- **`files`, `parked` and `credited` did NOT move.** The census is *sequenced* — it stops at its first red figure — and its order is files → parked → credited → titles. Reaching `titles` at all is executed proof that 2543 / 373 / 2170 each passed. `suiteTitles` was never evaluated, but the measured `describe(` count held at 3, so it stays 6333.
- **The whole scanner family is green.** 139 of 140 files passed, so the src-/test-adding blindness the preamble warns a single-file green about did not materialise anywhere else.

**NOT CURED, NOT BANKED — the door is the chair's.** `tests/lint/.lighting-census-baseline.json`'s own `_doc` reads *"⛔ NEVER HAND-EDIT THE FIVE FIGURES"*, and the only legal cure is `LIGHTING_CENSUS_REFREEZE=… npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js` — a register door, forbidden to this lane. It also refuses on a dirty tree, so the chair should take it against a clean checkout of this car.

**No `src/` bytes moved ⇒ NO typecheck run is owed**, and none was run.

---

## COMMIT
`0eb02811156fd5f181ca9e0f27443b6b4e1c1639` — 2 files changed, 13 insertions(+), 2 deletions(-).
Staged **explicitly by path** (never `-A`/`-u`/`.`); staged set verified to be exactly the two intended files before committing; no baseline or `.json` touched; porcelain 0 after, with no untracked file lost (none existed).

---

## RETROVALIDATION ROW

**What I judged (all within brief scope, none owner-gated):**
1. **R4's mechanism is refuted, and the car was written to the measured reading.** The anchor does NOT raise the row 1 → 2; anchoring both sites LOWERS it 1 → 0. The chair's 21:28 re-read was correct and R4 was not. Evidence: the negative control's own message.
2. **Zero is spelled as DELETION, not `: 0`.** Four independent citations (walker `:193-194`, the arm's failure text, the `homeLanding` precedent at `:200`, and `renderLiteral` at `:140-146` which can never emit a zero row). Note that a `: 0` row would *not* have red — it would have passed silently while diverging permanently from the regenerator. This is a correctness call, not a cosmetic one.
3. **The helper over the comment marker, with `Object.keys(FLAGS)` as the subject.** `assertContainable` refuses a plain object, so the naive `expectAbsentWithAnchor(FLAGS, …)` would have failed; the keys array is both the working form and the semantically exact one. This does replace `not.toHaveProperty` with key-array containment — own-enumerable rather than own+inherited — which I judged equivalent-and-more-precise here because `FLAGS` is a frozen `Object.fromEntries` literal and the key set *is* the exposure surface. **Re-derive this if you disagree.**
4. **Anchor siblings chosen for family adjacency** (`loadingJourneyFilm`, `workshopNav`) over the most-exercised key (`discordOauth`), so that a drift removing a whole flag family reds on the anchor rather than passing.
5. **Three-state negative control instead of two**, at the cost of one extra walker run, to establish that the frozen `1` was live on arrival rather than already stale.
6. **The test ratchet owes no door** — the brief's P5 listed it among the registers; measurement shows it is a 0.9 collapse floor, not a pin.

**What the Fable chair must re-derive (priority order):**
- **P1 — HIGH: take the lighting-census door.** `titles` 23653 → **23654**, all other four figures unmoved and three of them proven so by the sequenced arm. This is the only red this lane leaves, it is attributable to this car alone, and `tests/lint/` cannot go green again until the chair refreezes. The refreeze refuses on a dirty tree.
- **P2 — MEDIUM: ratify the assertion-shape change in `flags.test.js`.** The legacy `loadingJourneySetBg` case no longer uses `not.toHaveProperty`; it uses `expectAbsentWithAnchor` over `Object.keys(FLAGS)` (judgment 3). This is a strengthening in every respect I can measure, but it is a rewrite of a pre-existing assertion rather than a pure addition, so it is the chair's to bless.
- **P3 — MEDIUM: note that the negative-assertion burn-down is one file shorter.** 502 → 501 rows, 1526 → 1525 sites, `tests/lib/flags.test.js` retired from the worklist at zero. Two sites anchored, one of them legacy debt.
- **P4 — LOW: `scripts/.test-ratchet-baseline.json` `totalTests` is now one stale-low** (31970 vs a live 31971). Harmless inside the 0.9 floor; it refreshes on the next regeneration. No action needed, recorded so nobody re-finds it as a defect.
- **P5 — LOW: the §904 ODQ row is discharged.** The retirement is now structurally permanent: a `mobileSingleChrome` key re-entering `FLAG_DEFAULTS` reds `tests/lib/flags.test.js`.

**Receipts by path:**
- this receipt — `$SC/receipt-anchor-905.md`
- state 1 (pre-edit green) — `$SC/anchor905-scratch/state1-preedit.txt`
- state 2 (negative control red) — `$SC/anchor905-scratch/state2-negctl.txt`
- state 3 (final green) — `$SC/anchor905-scratch/state3-final.txt`
- flags.test.js run — `$SC/anchor905-scratch/flags-run.txt`
- OSR dry read — `$SC/anchor905-scratch/osr-dry.txt`
- `tests/lint/` directory run — `$SC/anchor905-scratch/lint-dir.txt`
- commit message — `$SC/anchor905-scratch/commit-msg.txt`
- pre-edit backups — `$SC/anchor905-scratch/flags.test.js.PRISTINE`, `walker.test.js.PRISTINE`, and the parked edit `flags.test.js.ANCHORED`

**Laws observed:** no register doors, no `npm run check`, no `npm run build`, no push, no rebase, no stash, no `git checkout --`, no `git show HEAD:<path> > <path>`, no `--amend`, no subagents, no `node_modules` materialisation (453 symlinks intact), `package.json` untouched, the §898 golden-master red never run. Every exit captured in-shell. The vitest hold was respected in full: all reading, measuring, predicting and editing happened under it, and the first vitest process started only after a 60 s-interval poll saw the file gone (~4 minutes).

---

## DOCK TIP
`0eb02811156fd5f181ca9e0f27443b6b4e1c1639` · **1 car** over `6582958ce` · porcelain **0** · trailers present (`Seat: Opus 5 — Fable-unvalidated`, `Lane: ANCHOR-905`, the last two lines of the message, nothing after them).

**Status: COMPLETE** (was PARTIAL).

# RECEIPT — ANCHOR-905 — **PARTIAL** (in flight)

Lane: ANCHOR-905 · Seat: Opus 5 — Fable-unvalidated · Chair: Fable 5.1
Dock: `$SC/laneANCHOR905` detached @ `6582958ce7bdc10bcbb8c69d9789b4d957fc5890`
Arrival porcelain: **0 lines**. node_modules: **453 symlinked packages** (never materialised).
VITEST HOLD present at start (`$SC/HOLD-VITEST`) — all reading/measuring/editing done under the hold; no vitest, no build.

Status: PARTIAL. Sections below are appended as each proof lands.

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

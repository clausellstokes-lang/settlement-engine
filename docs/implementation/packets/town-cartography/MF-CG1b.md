# Town cartography / MF-CG1b — the derived caps: three magic numbers become one measurement and one declared headroom, and 287 of 504 settlements draw a map

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `7009f115bc8fda7a19bd3408893ca08351294a18`
  ⚠ Read with `git rev-parse` at this lane's opening, never extended from a quoted prefix
  (§381's fabricated-SHA law) and never taken from the dispatch text. The lane's FIRST act was to
  compare it against the slot the chair's SLOT-FACTS card was measured at; it matched, so the
  card's shared facts are cited below rather than re-derived (ODQ §512).
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
  ⛔ RE-STAMPED BY THE TE-STACK-2 LANDING (2026-08-24). The two sentences above describe the
  BUILD lane, and they were true then: the member built on `5055990a` and the SLOT-FACTS card
  matched. They no longer describe the base recorded on the line above. The slot moved TWICE
  under the landing act — to `7009f115` (the MF-CH2A + MF-UC5 stacked landing) — so this member
  was rebased onto car 1 of a two-car stack and its `verifiedBase` re-stamped in BOTH places.
  The card's shared facts cited below were RE-READ at `7009f115`, not carried; two of them had
  moved (the census tuple, and `generator-golden-master.json`, which MF-CH2A re-recorded).
- **Depends on:** `MF-CG1` (LANDED) — this member consumes the calibration corpus that member
  built, and could not exist without it.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — recomputed from the file at
  THIS base by this lane, identical to the value MF-CG1 carries, so no re-stamp occurred.
- **Charter:** ODQ **§509.4** (the re-charter — "CG-1b builds the MACHINERY, not the values"),
  **§515** (BAND 21 SIGNED, which is what lets this member ship a value as well), **§503.2 /
  §517.5** (every control must be able to fail), **§520** (the vitest runner correction obeyed
  throughout).
- **Collision group:** none. `PACKET_MANIFEST.json` at this base holds **170 packets: 169 LANDED
  and 1 SUPERSEDED — ZERO non-terminal** (measured by execution against the manifest, not
  remembered), so no packet reserves any path this member names. This member makes 171.
- **Commit authority:** this lane commits on its own detached worktree ref. **No ref is moved.**
- **⚠ THIS MEMBER MOVES `src/**` AND DECLARES A SAME-SEED SHIFT.** §5 prices it row by row.

---

## §1 · WHAT THIS MEMBER IS

MF-CG1 measured the cartography stage against 504 real settlements and found that **287 of them
could not draw a map at all** — town 84 of 84, village 83 of 84, hamlet 71 of 84 — and that the
ratified cure could not reach the defect at any value, because two independent premises fire and
the second one is a byte band the first cannot touch. It stopped there and shipped the ground.

This member is the cure, and it is a cure of the KIND §509.4 ordered rather than of the kind the
symptom invited. **The three coupled caps stop being literals.** They are derived — together, from
the corpus MF-CG1 committed, behind ONE declared headroom parameter — and the invariant that every
hand-authored candidate violated is now true by arithmetic instead of by an assertion.

| | before | after |
|---|---|---|
| `MAXIMUM_INSTITUTION_BINDINGS` | `{8, 12, 20, 32, 64, 96}` authored | `{18, 39, 66, 100, 88, 101}` derived |
| `MAXIMUM_CARTOGRAPHY_BUILDINGS` | `{12, 24, 48, 96, 176, 240}` authored | `{26, 55, 98, 164, 208, 261}` derived |
| `TC4_ROW_BYTES_BAND` | `400` authored | `709` derived |
| lit throw rate over the 504-row corpus | **287 of 504** | **0 of 504** |

**It is NOT a tuning pass.** No taste knob moves, no geometry rule changes, and the headroom is the
one number a human chose — which is why it went to the owner as BAND 21 and came back signed
(§515: *"Map headroom sufficient that towns and hamlets draw at all, with margin"*).

---

## §2 · WHY THE CAPS COULD NOT STAY LITERALS

Three facts, all of them measured by MF-CG1 and all of them re-proved by this lane at this base:

1. **A cap raise alone is unreachable.** With `MAXIMUM_INSTITUTION_BINDINGS` at `100000` — the cap
   unreachable by construction — 61 of 504 rows still threw, every one on
   `the TC-4 layer measures N bytes against the <tier> band`, which is
   `MAXIMUM_CARTOGRAPHY_BUILDINGS × TC4_ROW_BYTES_BAND`.
2. **The byte band was the same defect wearing a second face.** Its own comment admitted it was set
   "against a measured worst case of 374 B/row at THORP" — the smallest tier of the same synthetic
   fixture that made the count caps look green. The real corpus's worst row is **443 B**.
3. **A sampled maximum is not a ceiling.** Two independent samples of the same quantity disagreed
   in BOTH directions. Re-authoring three numbers to fit today's corpus would inherit exactly the
   luck that produced the originals.

And one fact this lane established by reading the compiler, which decides the shape of the cure:

> **`MAXIMUM_CARTOGRAPHY_BUILDINGS` TRUNCATES; it does not throw.** It gates instance emission
> (`else if (rows.length < totalCap)`) and dwelling fill (`rows.length >= totalCap`) in
> `cartographyBuildings.js`. **Flagships are EXEMPT** — a canonical institution always appears, or
> the map forks from the dossier. So a binding cap above the building cap promises more flagships
> than the layer may emit and blows the derived byte budget *by construction*. That is why
> `bindings <= buildings` is load-bearing and why it must hold structurally.

---

## §3 · THE DERIVATION

`src/domain/townCartography/cartographyTuning.js` gains three exports and one private table:

```
CARTOGRAPHY_HEADROOM_PERMILLE = 1600            // the ONE declared parameter (BAND 21)

CARTOGRAPHY_CALIBRATION = {                     // the MEASURED worst cases, and nothing else
  MAX_INSTITUTIONS:       { thorp: 11, hamlet: 24, village: 41, town: 62, city: 55, metropolis: 63 },
  MAX_BUILDING_ROW_BYTES: 443,
  CORPUS_ROWS:            504,
}

deriveCartographyCaps(calibration, headroomPermille):
  withHeadroom(m) = ceil(m * headroomPermille / 1000)
  bindings[t]     = withHeadroom(calibration.MAX_INSTITUTIONS[t])
  buildings[t]    = bindings[t] + DWELLING_TARGET[t]
  rowBytes        = withHeadroom(calibration.MAX_BUILDING_ROW_BYTES)
```

Three properties are deliberate and each answers a specific failure of the alternatives:

- **`bindings <= buildings` BY CONSTRUCTION.** `buildings[t]` is `bindings[t]` plus a strictly
  positive term, so no calibration and no headroom can violate it. W6 proves this over hostile
  inputs — headrooms from 0 to 100 000 permille, rosters from all-zero to all-999, and an INVERTED
  ladder where the smallest tier carries the largest roster — rather than over the one table in
  force. The amendment's `{18,30,59,92,77,96}` and MF-CG1's own rule-derived `{17,36,62,93,83,96}`
  both violated it; this cannot.
- **HEADROOM APPLIES TO MEASURED WORST CASES ONLY.** `DWELLING_TARGET` is authored INTENT — how
  many dwellings a tier's map wants — and multiplying an intent by a safety factor is a category
  error. The building cap ADMITS it; it does not headroom it.
- **THE BYTE BAND IS DERIVED END TO END.** `CR-TC4-BAND-1` already made the budget
  `buildingCap × rowBytesBand` so band-versus-cap consistency was definitional. The remaining
  authored number — the per-row ceiling — is now derived too, so there is no second calibration
  hiding inside the derivation.

### 3a · Where the headroom's value comes from, and why it is not a taste pick

**THE CRITERION:** *the headroom is at least the largest factor by which a demonstrably SMALLER
version of this same corpus under-measures its own maximum.* That is the one honest statement the
corpus can make about how far short of a true ceiling it might fall.

Each of the twelve seed slices is a corpus of the same shape and one twelfth the size. Measured:

| tier | slice minimum | corpus maximum | ratio |
|---|---:|---:|---:|
| thorp | 8 | 11 | 1.3750 |
| **hamlet** | **15** | **24** | **1.6000** |
| village | 29 | 41 | 1.4138 |
| town | 50 | 62 | 1.2400 |
| city | 47 | 55 | 1.1702 |
| metropolis | 54 | 63 | 1.1667 |

Worst = **1.6000**, so **1600 permille**. W6 re-derives that table from the manifest on every run
and reds if the declared headroom ever falls under it.

### 3b · ⚠ THE CORPUS IS NOT CONVERGED, and the probe that says so COULD have said otherwise

§517.5 is a case where a proposed proof was structurally incapable of failing and nearly certified
a runaway as converged. The convergence probe here can fail in both directions, and it did NOT
return "converged":

- The twelve-seed growth curve was **still rising at the eleventh seed** — `metropolis` 59 → 63 at
  k=11, `village` 39 → 41 at k=9, `town` 58 → 62 at k=7.
- **Jackknife:** deleting any single seed costs up to **8.33%** of a tier's maximum
  (`hamlet` 24 → 22); `metropolis` 6.35%, `city` 1.82%.
- **Three tiers reach their maximum on exactly one seed** (hamlet, city, metropolis).

So the corpus maximum is a reading, not a ceiling — which is precisely why the caps are derived
behind a headroom instead of set to the reading.

---

## §4 · THE MEASUREMENT (all figures executed at this base, in this lane's worktree)

Four full 504-row passes through the COMMITTED instrument (`measureCalibrationRow`), `node` exit 0:

| pass | inputs | outcome census | global worst B/row |
|---|---|---|---:|
| **BASE** | the base tuning literals, restored byte-exact afterwards | `217 ok / 266 binding-cap / 21 tc4-bytes` | 443 |
| **A** | headroom 1500, provisional byte input | **`504 ok`** | 443 |
| **B** | headroom 1600, provisional byte input | **`504 ok`** | 443 |
| **C** | headroom 1600, byte input `443` — **the shipped values** | **`504 ok`** | 443 |

- **PASS BASE IS AN INDEPENDENT RE-CONFIRMATION OF MF-CG1's RECORD.** It reproduces that member's
  frozen manifest exactly — 217/266/21, per-tier throws `28/71/83/84/21/0`, per-tier institution
  maxima `11/24/41/62/55/63` — at a different tree, through a modified instrument. The tuning file
  was reverted to the committed blob for the pass and restored, `sha256`
  `9123d6ae1ab230a7ebe2df94f058b1600058fb2cfb16d07ca01e8de375cd05b2` identical before and after,
  `cmp` exit 0.
- **PASS C IS A FIXED POINT.** Every per-tier figure is identical to pass B — the byte input `443`
  reproduces itself, so the derivation does not chase its own tail. Dark compile 504/504 clean in
  every pass.
- The **bootstrap is declared rather than hidden**: `MAX_BUILDING_ROW_BYTES` could not be read at
  the base, because 287 of 504 rows threw before the figure existed. Passes A and B exist to obtain
  it with a deliberately generous provisional band; pass C freezes the reading and re-proves.

---

## §5 · ⚠⚠ THE DECLARED SAME-SEED SHIFT, PRICED ROW BY ROW

Raising a TRUNCATION cap changes drawn output. This is not let to ride silently. Measured by
diffing pass BASE against pass C over all 504 rows:

| | rows |
|---|---:|
| **NEWLY DRAW** — no map before, a map now | **287** |
| drew before, block count **UNCHANGED** | 101 |
| drew before, block count **CHANGED** | 116 |
| **LOST a map** | **0** |

| tier | newly draw | drew before | unchanged | changed | mean Δ rows | worst Δ |
|---|---:|---:|---:|---:|---:|---:|
| thorp | 28 | 56 | **56** | 0 | — | 0 |
| hamlet | 71 | 13 | **13** | 0 | — | 0 |
| village | 83 | 1 | **1** | 0 | — | 0 |
| town | 84 | 0 | 0 | 0 | — | 0 |
| city | 21 | 63 | 13 | 50 | +25.1 | +32 |
| metropolis | 0 | 84 | 18 | 66 | +17.1 | +21 |

⭐ **THE DENSITY CHANGE IS CONFINED TO `city` AND `metropolis`.** Every small- and middle-tier row
that already drew is byte-for-byte unchanged, because those blocks sat below the old cap and a
truncation cap that never bit cannot change what it never truncated. At thorp, hamlet, village and
town **the entire shift is "no map → a map"**.

**A hamlet, concretely:** drew 13 of 84 before, mean 14.6 building rows. Draws **84 of 84** now,
mean **23.0** rows. That is the product change BAND 21 was asked about.

### 5a · What moved in the tree, and what did not

- **NO GOLDEN MOVED.** `tests/fixtures/generator-golden-master.json` is blob `cd8d125ef8`,
  `sha256 29c6cc8f…` — the SLOT-FACTS figure, unmoved; `tests/fixtures/town-cartography-dormancy-
  golden.json` is blob `ec65a2350332f6a01496eeddaead567b67d6bffa`, unmoved. Neither appears in
  `git status --porcelain`. The dormancy golden is a DARK-path projection by construction
  (`dormantHashFor = projectionHash(compileRow(row, null))`), so the caps cannot reach it.
- **NO GEOMETRY PIN MOVED.** `tests/domain/townCartographyBuildings.test.js` — including its C8
  derived-byte-budget arm and the `bindings <= buildings` invariant arm the amendment's numbers
  would have redded — is GREEN **unedited** at the derived caps. `V2_GOLDEN_CONFIGS`'s authored
  institution counts sit far below every cap at both ends, which is exactly why that corpus could
  never see this defect and exactly why it is undisturbed by the cure.
- **ONE RE-RECORD, DELIBERATE:** `tests/fixtures/cartography-calibration-corpus.json`, through the
  committed `UPDATE_CARTOGRAPHY_CALIBRATION=1` path, with a SHIFT RECORD row added to the suite
  header before commit as that file's own rule requires.

---

## §6 · EXACT CHANGE MANIFEST

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/townCartography/cartographyTuning.js` | `CARTOGRAPHY_HEADROOM_PERMILLE`, `CARTOGRAPHY_CALIBRATION`, `deriveCartographyCaps`, `DWELLING_TARGET`, and the three cap fields | 165 eff (from 143; layer ceiling 800) | the caps become the derivation's output; no other tuning number moves |
| `MODIFY` | `tests/fixtures/cartographyCalibrationCorpus.js` | `measureCalibrationRow` | 140 eff (from 120) | records `cartoBuildings`, `cartoRowBytes`, `cartoInstitutionRefs` off the DRAWN block |
| `MODIFY` | `tests/fixtures/cartography-calibration-corpus.json` | 504-row frozen measurement | n/a | re-recorded ONLY by the committed regeneration path |
| `MODIFY` | `tests/domain/townCartographyCalibration.test.js` | `FROZEN`, `SUPERSEDED`, W3, W4, W5, and the new W6/W7 | 441 eff (from 287) | the ratchet goes to zero; the derivation and the outgrow alarm are added |
| `DOC` | `docs/implementation/packets/town-cartography/MF-CG1b.md` | this packet | n/a | — |
| `DOC` | `docs/implementation/INDEX.md` | one row | n/a | — |
| `MODIFY` | `docs/implementation/PACKET_MANIFEST.json` | one packet record | n/a | — |

Generated artifact: `tests/fixtures/cartography-calibration-corpus.json`, by
`UPDATE_CARTOGRAPHY_CALIBRATION=1 npx vitest run --pool=threads --maxWorkers=2 tests/domain/townCartographyCalibration.test.js`.

**No migration is minted and the migration head is not pinned anywhere in this packet. No
`package.json` byte moves. No edge bundle names any file this member touches, so no
`build:edge-shared` is owed** (measured: zero `supabase/functions/_shared/*.meta.json` inputs
rosters mention `cartographyTuning`).

---

## §7 · CENSUS

> **`censusAuthorization`:** this member moves the test census by
> **`+0 files / +0 parked / +0 credited / +9 titles / +2 suiteTitles`** — no new test FILE; the
> existing calibration suite gains W6 and W7 (two `describe`s) and nine `it` titles
> (19 → 28, measured by execution: `Tests 28 passed (28)`).
> **Slot tuple, CITED from the chair's card at this slot: `2517 / 366 / 2151 / 20882 / 5814`.**
> **Tip tuple, WALKED: `2517 / 366 / 2151 / 20891 / 5816`.**
> ⭐ **ALL FIVE FIGURES READ IN ONE RUN, NONE PATCHED.** The census is SEQUENCED and stops at its
> first red figure, so a patched `titles` would leave `suiteTitles` stale behind it. A
> `console.log` probe placed inside the census test before its first assertion printed all five
> from the walker's own `TEST_FILES` scan and classifier — `{"files":2517,"parked":366,
> "credited":2151,"titles":20891,"suiteTitles":5816}` — it minted no title, and it is gone.
> ⭐ **THE DELTA IS FULLY ATTRIBUTED, WHICH IS THE CONTROL THAT MATTERS.** `+9 titles / +2 suite`
> equals this suite's OWN growth exactly (19 → 28 `it`, 6 → 8 `describe`), and
> `366 + 2151 = 2517` closes the file arithmetic. Had any other file drifted a pin in this window
> the aggregate would exceed this file's own growth and the closure would fail.
> ⭐ **THE FILE STAYS CREDITED.** `parked` is UNMOVED at 366 and `credited` UNMOVED at 2151 —
> which is the §509.5(1) hazard checked rather than assumed: a suite that parked itself would
> have moved both and swallowed all nine titles while the arithmetic still closed.
> Its authorizing decision is **ODQ §509.4 / §515**.

> ⚠ **THE SECOND CENSUS IS UNMOVED.** `scripts/.test-ratchet-baseline.json` caps `skippedCeiling`
> (this member adds no skip), lists FAILING tests (this member's arms all pass), and reads
> `totalTests` / `totalFiles` only as a scope FLOOR that growth cannot breach.

⛔ **THE SHARED CENSUS ROW IS DEFERRED TO THE CHAIR'S LANDING ACT (§417).** This lane walks both
censuses at its tip, records the delta, and REVERTS each edit digest-exact.

---

## §8 · ACCEPTANCE CASES

**THE ACCEPTANCE IS A THROW RATE, not a set of numbers.** Over MF-CG1's committed 504-row corpus:
**before = 287 of 504 throwing; after = 0 of 504.** Anything other than 0 is a STOP.

1. **A1 · the throw rate is 0 of 504** — outcome census `{ ok: 504 }`, dark failures 0, at the
   shipped values, through the committed instrument.
2. **A2 · W6 · the three tables in force ARE `deriveCartographyCaps(...)`**, key-for-key and
   integer-for-integer, and the derivation is total over the tier ladder so no tier can fall out
   of it and read `undefined` into a comparison that would silently pass.
3. **A3 · W6 · SOURCE SCAN: the three cap fields are ASSIGNED from `DERIVED_CAPS`** in the tuning
   module's own source, with an anti-vacuity anchor on a field this member did not touch. A value
   comparison cannot tell a derivation from a literal that agrees today.
4. **A4 · W6 · `bindings <= buildings` holds for ARBITRARY calibrations and headrooms** — seven
   headrooms × five roster shapes including an inverted ladder, with an anti-vacuity arm proving
   the sweep really produced seven different cap sets.
5. **A5 · W6 · the declared headroom clears the criterion that set it**, re-derived live from the
   manifest, with a non-vacuity arm that every seed actually appears in each tier's slice map.
6. **A6 · W7 · the derivation's inputs are EXACTLY what this corpus reads** — institution maxima
   per tier and the global worst bytes-per-row, exact in both directions — **and every recorded
   row fits under the caps derived from them**, count and bytes, against the same product the
   stage computes. **This is the arm that reds if a future corpus outgrows the derived caps.**
7. **A7 · W7 · THE FALSIFIER: this same corpus does NOT fit the SUPERSEDED literals** — the old
   binding caps refuse `{thorp 28, hamlet 71, village 83, town 84}` = **266** of the recorded
   rosters, re-deriving MF-CG1's own binding-cap census from roster counts alone, and the old
   per-row band 400 is below the corpus's real worst row of 443.
8. **A8 · W3 · the identity control survives the cure and is stronger for it** — the DRAWN block's
   distinct `institutionRef` set equals the settlement's roster on all 504 rows, replacing a
   control that could only read rows which FAILED and would have gone vacuous the moment they
   stopped failing — **and W4's inventory ratchet is a zero at every tier** with its honesty
   companion and a drawn-block bound, **while the blast radius is green UNEDITED** across 19 files
   of cartography consumers with both goldens included.

### 8a · Every control can fail — the probe for each

| claim | the probe that reds when it is false |
|---|---|
| the throw rate is 0 | pass BASE, same instrument, same tree: **287** |
| the caps are the derivation | mutate one derived value in the tuning table → W6 arm 1 reds |
| `bindings <= buildings` is structural | the W6 sweep includes an INVERTED ladder that breaks every per-tier hand-authored table |
| the headroom is sufficient | W6's criterion arm reds at headroom 1500, the value this lane first tried |
| the corpus fits the caps | W7's falsifier shows 266 of these rows did NOT fit the superseded literals |
| the corpus is converged | the growth curve and jackknife say it is **not**, and are reported as such |
| the byte measurement is live | the corpus's worst row is 443 B against the superseded band of 400 |
| the OSR cmp is live | appending ONE byte to the captured output makes the same check exit non-zero |

---

## §9 · CHECKS

```sh
npx vitest run --pool=threads --maxWorkers=2 tests/domain/townCartographyCalibration.test.js
npx vitest run --pool=threads --maxWorkers=2 <the 19-file cartography consumer surface>
node scripts/check-full-typecheck.mjs
node scripts/check-domain-strict.mjs
npx eslint src/domain/townCartography/cartographyTuning.js tests/domain/townCartographyCalibration.test.js tests/fixtures/cartographyCalibrationCorpus.js
node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate
```

⚠ **`--poolOptions.threads.*` DOES NOT EXIST in vitest 4.1.8** (ODQ §520). It raises `CACError` and
exits 1 with ZERO tests collected — a failure shaped exactly like "the stage still throws", which
is this member's entire acceptance. **The working cap is `--pool=threads --maxWorkers=2`, and an
exit code with no collected-test count is not a verdict.** Every run below quotes its file AND test
counts for that reason.

---

## §10 · EXECUTED RECEIPTS AT THIS MEMBER'S TIP

⚠ **EVERY ROW QUOTES ITS FILE AND TEST COUNTS**, because §520's failure mode is an exit code with
nothing collected behind it.

| Gate | Result |
|---|---|
| the calibration suite, re-record run | `Test Files 1 passed (1)` · `Tests 27 passed (27)`, 48.91 s (before the source-scan arm was added) |
| the calibration suite, final | `Test Files 1 passed (1)` · **`Tests 28 passed (28)`**, exit 0 — the mutant sweep's two clean controls |
| the cartography consumer surface, **19 files** | `Test Files 19 passed (19)` · `Tests 315 passed \| 13 skipped (328)`, TRUE_EXIT=0, 35.78 s |
| `node scripts/check-full-typecheck.mjs` | `OK — no type regressions (173 error(s), ceiling 173)`, exit 0 |
| `node scripts/check-domain-strict.mjs` | `✓ no strict-type regressions (1134 errors, ceiling 1134)`, exit 0 |
| `npx eslint` over the three authored files | exit 0, zero problems |
| `node scripts/implementation-packets.mjs validate` | `valid: 171 packets (1 READY)`, exit 0 |
| S0 part 1 · `check-observed-shape-readers.mjs` | exit 1, **159 B**, sha256 `c5b67844abe51226f4c6862ae485dc5d9fa1e51148c70b4bd021e661f1ae0854` — identical to the slot card's figure; **liveness probe**: appending ONE byte makes the same check exit non-zero. Pre-existing, not this member's |
| S0 · OSR inventory blob | `8d91fdfa141e408142e41b856dd9c4ef2a07cd02` — unmoved |
| S0 · size baseline | `cartographyTuning.js` 143 → **165** effective lines against a layer ceiling of **800**; absent from `scripts/.size-baseline.json` and staying absent |
| S0 · edge bundles | zero `supabase/functions/_shared/*.meta.json` input rosters name any file this member touches |
| S0 · change-path reservation | 170 packets at the slot, **zero non-terminal** — nothing reserves a path this member names |
| goldens | `generator-golden-master.json` blob `cd8d125ef8` / sha256 `29c6cc8f…` and `town-cartography-dormancy-golden.json` blob `ec65a235…`, both **unmoved** and both absent from `git status --porcelain` |

### 10.1 · The mutant sweep — each mutant drives THE ARM IT SHOULD CONVICT

| # | mutant | arm driven | result |
|---|---|---|---|
| **C0** | none — the clean file, whole | — | `28 passed (28)`, exit 0 |
| M1 | the caps re-authored as a literal that AGREES | `SOURCE SCAN` | `1 failed \| 27 skipped` |
| M2 | headroom `1600 → 1500` | `clears the CRITERION` | `1 failed \| 27 skipped` |
| M3 | byte input `443 → 442` | `byte input is exactly` | `1 failed \| 27 skipped` |
| M4 | institution input hamlet `24 → 25` | `institution input is exactly` | `1 failed \| 27 skipped` |
| M5 | `buildings = bindings − 1` | `ARBITRARY calibrations` | `1 failed \| 27 skipped` |
| M6 | a manifest row's refs drift from its roster | `distinct institution refs` | `1 failed \| 27 skipped` |
| M7 | a manifest row records no drawn block | `a real drawn measurement` | `1 failed \| 27 skipped` |
| M8 | the SUPERSEDED hamlet cap loosened | `FALSIFIER` | `1 failed \| 27 skipped` |
| M9 | a frozen throw row goes stale `0 → 1` | `no frozen row is stale` | `1 failed \| 27 skipped` |
| M10 | a frozen drawn block goes stale `31 → 32` | `density cannot creep` | `1 failed \| 27 skipped` |
| **C1** | none — the clean file again | — | `28 passed (28)`, exit 0 |

Every restore `cmp` 0. Final shas `44c75f904915b540` (tuning) · `0569b433858ef343` (suite) ·
`9c9668cddbba4d5a` (manifest). **The two clean controls are what make the sweep non-vacuous** — an
all-red sweep with no green control is a broken runner, not a proof (TE-T2B).

⭐ **ONE CONTROL HAD TO BE ADDED BECAUSE THE FIRST VERSION COULD NOT FAIL.**
`expect(table).toEqual(derived)` cannot distinguish a derivation from a literal that agrees today —
which is the *only* regression this member exists to prevent, so the arm was structurally incapable
of catching its own subject (§503.2 / §517.5). W6 gained the SOURCE SCAN, and **M1 is the mutant
that proves the scan works.**

### 10.2 · The census, WALKED and reverted

All five figures read in ONE run from a `console.log` probe placed before the sequenced
assertions: `{"files":2517,"parked":366,"credited":2151,"titles":20891,"suiteTitles":5816}`.

| step | result |
|---|---|
| the walked tuple planted | `Test Files 1 passed (1)` · `Tests 1 passed \| 32 skipped (33)`, exit 0 |
| NEGATIVE CONTROL A — `suiteTitles` alone at the slot's 5,814 | red: *"expected 5816 to be 5814"* |
| NEGATIVE CONTROL B — `titles` alone at the slot's 20,882 | red: *"expected 20891 to be 20882"* |
| revert | `cmp` 0, walker sha256 `5b46ea62bf04eae0dd8f441e…`, `tests/lint/` porcelain empty |

### 10.3 · The sweep — ALL 2,517 test files, and a finding the chair needs

The chunking was forced by a ten-minute harness ceiling, and the accounting closes exactly against
the census `files` figure, so no file is missed and none is double-counted:

| chunk | scope | files | tests | failures |
|---|---|---:|---:|---:|
| A | `tests/domain` | `1 failed \| 942 passed (943)` | `1 failed \| 14376 passed (14377)` | 1 |
| B | components · ui · lib · store · lint · security | `4 failed \| 1008 passed \| 1 skipped (1013)` | `6 failed \| 8972 passed \| 1 skipped (8979)` | 6 |
| C | the remaining 30 trees + `tests/generation.test.js` | `2 failed \| 552 passed \| 7 skipped (561)` | `5 failed \| 5896 passed \| 114 skipped (6015)` | 5 |
| | **943 + 1013 + 561 = 2,517** | | **29,371 tests** | **12** |

**Twelve failing titles, every one accounted:**

- **7 · THE BANKED SEVEN**, re-observed verbatim: `metronomeCooldownLint` (A);
  `clampPrimitiveBaseline`, `warCostKindPools` ×3, `warRulingKindPools` (B);
  `enforcement-claims` (C).
- **1 · THIS MEMBER'S DECLARED §417 INTERIOR RED**, the census arm (B).
- **4 · A NEW PRE-EXISTING SET NOBODY HAD SWEPT** — `tests/copy/voiceMechanics.test.js`.

⭐ **THE FOUR ARE A FINDING, NOT A STRAY, AND THEY ARE ATTRIBUTED BY EXECUTION.** `tests/copy` is
not among the fifteen trees MF-CG1's grep arm reached; that sweep ran 1,883 of the estate's 2,517
test files, so ~630 files — this chunk C — had never been swept at this slot at all. **A tree
nobody sweeps can hold reds nobody has classified.** The proof they are not this member's:

| arm | `src/**` state | result |
|---|---|---|
| 1 | this member's tip | `Test Files 1 failed (1)` · `Tests 4 failed \| 12 passed (16)` |
| 2 | the slot's own blob restored (`git diff --quiet 5055990a -- src` **true**) | `Test Files 1 failed (1)` · `Tests 4 failed \| 12 passed (16)` |

The two failing-title sets were compared **mechanically** — `diff` of the two sorted `×` lists
returns empty — not read side by side. The tuning file was restored, sha256
`44c75f904915b540…` and `cmp` 0. Two of the four are the **JSX** tier, and this member touches
**zero** `.jsx` files; the other two are the tier-2 string-literal scan, and the test's own
tokenizer run over this member's only `src/` file returns `em=0 bang=0` at **both** ends.

**Recommendation to the chair: the banked set at this slot is not seven, it is ELEVEN** — or the
four are a debt for a `tests/copy` lane to burn down. Either way they should stop surprising the
next lane that sweeps wide.

⚠ **INTERIOR RED, NAMED IN ADVANCE.** Until the chair re-records the tuple at the landing act,
`tests/lint/sovereigntyLightingContract.walker.test.js` reds at this member's tip on the census arm
— *"expected 20891 to be 20882"*. The row's exact text for `PACKET_MANIFEST.json`:

```json
        {
          "action": "TEST",
          "path": "tests/lint/sovereigntyLightingContract.walker.test.js"
        }
```

---

## §11 · DELIBERATE DEFERRALS — documented, not bugs to re-find

1. **The corpus is not converged, and this member does not converge it.** Widening the seed pool
   beyond twelve would raise the measured maxima and therefore the derived caps. Deferred: the
   headroom exists to absorb exactly this, and re-rolling the pool is a re-record with a shift
   record, not a repair. The convergence figures are recorded in §3b so the next lane starts from
   the measurement rather than re-taking it.
2. **`TC4_ROW_BYTES_BAND` stays a SCALAR** although the per-tier readings spread eleven percent
   (443 / 436 / 430 / 402 / 399 / 388, worst at thorp). A per-tier table would be a second
   calibration standing beside the first — the exact shape `CR-TC4-BAND-1` exists to forbid.
3. **The building cap's dwelling term is `DWELLING_TARGET` unheadroomed.** A future lane that wants
   denser large-tier maps should move `DWELLING_TARGET`, which is the authored intent, rather than
   the headroom, which is a sampling-error allowance.
4. **`city` and `metropolis` are still cap-bound** — their drawn blocks sit exactly at 208 and 261,
   so those two tiers are still truncating. That is a density choice, not a premise failure, and it
   belongs to the tuning pass.
5. **S0 part 1 is a cmp against the CARD's figure, not a live re-run at the baseproof.**
   `chair-baseproof-b10ed1a1` no longer exists as a ref or a worktree at this slot. The figure is
   the one the card instructs lanes to cite, the tip reproduces it byte for byte, and the
   comparison is proved live by a one-byte probe.

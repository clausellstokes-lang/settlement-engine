# RECEIPT — lane CLAMP-REPAIR (Opus 5) — **PARTIAL**

**PARTIAL: both assigned REPAIRS are complete, negative-controlled and committed. The
optional clamp swap was NOT taken, and one of the two files is now PROVEN not to
qualify for it (a third non-finite site, measured below). The clamp ratchet's equality
arm is STILL RED and that is expected — re-arming is the terminal act of the program,
not this lane's. Nothing was banked, no ceiling raised, no baseline refreshed or
trimmed.**

Dock: `$SC/laneREPAIR-tree`, detached, base `90702c3e9`. Three cars, tip **`25e6a6228`**.
Symlinks never materialised (435 throughout); no `npm install`; no rebase, no push,
**no ref writes**, no `git checkout --`, no stash. Every exit captured in-shell.

| car | sha | what |
|---|---|---|
| 1 | `d8aaa85d6` | cartographyBuildings — the two non-finite guards + 2 pins |
| 2 | `fc8ecd2fe` | dispositionLedger — seven falsy screens + 3 pins |
| 3 | `25e6a6228` | the lighting census register refreeze (owed by the 5 pins) |

---

## 1. THE BRIEF'S OWN FIGURES, RE-DERIVED (I inherited nothing)

| quantity | brief said | **I measured** | verdict |
|---|---|---|---|
| the cartography guards' lines | 190 and 192 | **337 and 339** | ⚠ brief wrong (shape exact) |
| the dwelling `target` line | ~353 | **515** | ⚠ brief wrong |
| the emit guard line | ~360 | **522** | ⚠ brief wrong |
| NaN pop vs healthy 34, thorp | 8 vs 3 | **8 vs 3** | ✓ reproduced exactly |
| +Infinity pop, thorp | 4 | **4** | ✓ reproduced exactly |
| `{wins:3,losses:1}` healthy read | 0.583333… | **0.583333333333** | ✓ (roundStock, 1e-12) |
| `{wins:Inf,losses:0}` | stock01 1, "dominant" | **1, dominant** | ✓ |
| `{wins:Inf,losses:Inf}` | NaN absorbed to 0.5 | **0.5** | ✓ |
| non-finite fabric ⇒ age 1000 | "moves to the band floor" | **+Inf ⇒ 1000; NaN ⇒ THREW** | ⚠ brief incomplete |
| `.domain-strict-baseline.json` total | 1121 | **1121** | ✓ |
| …its arm | per-file shrink-only | **per-file, `base[file] ?? 0`, shrink-only** | ✓ |
| expected reds in `tests/lint/` | "thirteen register arms + clamp" | **ONE arm: clamp only** | ⚠ brief wrong |

⚠ **The brief's "thirteen register arms are expected red" is not true of this dock.**
`tests/lint/` at the tip has exactly **one** failure, the clamp equality arm.

## 2. DEFECT 1 — `cartographyBuildings.js`: a cap that STOPPED BEING A CAP

`typeof NaN === 'number'` is TRUE, so the bare typeof guards at :337/:339 admitted NaN
and ±Infinity. A NaN population ⇒ `popWithin01` NaN ⇒ dwelling `target` NaN ⇒
`emitted >= target` FALSE for **every** value of `emitted`.

**Executed, both directions.** Real corpus row (`leafInputFor(SUBJECT)`, walled city)
and a synthetic thorp (span 8..60, tone 500, 9 parcels):

| input | BEFORE | AFTER | note |
|---|---|---|---|
| population 34 / 8 / 60 (thorp) | 3 / 2 / 4 dwellings | **3 / 2 / 4** | **UNCHANGED — every finite value** |
| population NaN (thorp) | **8** | 2 | cap was open |
| population +Infinity (thorp) | 4 | 2 | read the band ceiling |
| population −Infinity (thorp) | 2 | 2 | already clamped to the floor the guard now uses |
| **population NaN (real city)** | **193 dwellings** | **118** | the floor emits 118 |
| fabric01 null / 0.4 | 500,450 / 400,350 | identical | **UNCHANGED** |
| fabric01 +Infinity | age **1000**, condition 'worn' | 500,450, 'sound' | invented an ancient town |
| fabric01 −Infinity | age 0 | 500,450 | |
| fabric01 NaN | **THREW** `stableSceneStringify: non-finite number at $.buildings[0].agePermille` | 500,450 | **a hard crash of the whole compile** |

⭐ **The NaN-fabric case is sharper than the brief described**: it is not a mis-grade,
it is a thrown TypeError out of the byte measure that takes the entire cartography
compile down. Found by executing, not by reading.

**Reachability, traced not assumed.** `fabricAccumulation01` provably CANNOT be
non-finite in production: `fabricRead.js` `num01` coerces non-finite to 0 and
`fabricStocksFor`'s `if (v > 0)` then drops it, so `fabricAccumulation` cannot return
NaN. That guard is pure hardening at the leaf boundary. The population guard is the one
with a live blast radius; the estate already refuses a non-finite population at the
corpus door (`refuseNonFiniteWorld`, `scripts/review/readerCorpus.mjs`).

## 3. DEFECT 2 — `dispositionLedger.js`: `|| 0` screens NaN and MISSES Infinity

`Number(x) || 0` is a FALSY screen. NaN is falsy so it is caught; ±Infinity is truthy so
it rode through. **Seven sites**, four of them writers. The file's own intent is stated
one line above the worst site — `entryScore` already screens the score branch with
`Number.isFinite` — and line 194 simply never agreed with it. All seven now use the
file's existing `finite()` helper; `Number()`'s string coercion is preserved.

| entry | stock01 B→A | band B→A | thresholdFactorOf B→A |
|---|---|---|---|
| `{wins:3, losses:1}` | 0.583333333333 → same | settled | 0.966667 'lower' → same |
| `{wins:0, losses:0}` | 0.5 → same | settled | 1 'neutral' → same |
| `{wins:12, losses:0}` | 1 → same | dominant | 0.8 'lower' → same |
| `{wins:0, losses:5}` | 0.291666666667 → same | measured | 1.083333 'raise' → same |
| `{wins:'3', losses:'1'}` | 0.583333333333 → same | settled | 0.966667 → same |
| `{wins:Inf, losses:0}` | **1 → 0.5** | **dominant → settled** | **0.8 → 1 'neutral'** |
| `{wins:0, losses:Inf}` | **0 → 0.5** | **restrained → settled** | **1.2 → 1** |
| `{wins:−Inf, losses:0}` | **0 → 0.5** | **restrained → settled** | **1.2 → 1** |
| `{wins:Inf, losses:Inf}` | 0.5 → 0.5 | settled | 1 → 1 |

**⛔ THE WRITER SIDE WAS WORSE THAN THE READ SIDE.** `migrateDispositionStats` wrote
`score: Infinity` / `wins: Infinity` into the PERSISTED ledger, and `JSON.stringify`
writes a non-finite as **`null`** — so a save/load round-trip silently mutated a
campaign's ledger with no event to explain it. `ratchetDisposition` made it PERMANENT
(`Infinity + 1` is Infinity; no number of later outcomes could correct it).

| entry | persisted score/wins B→A | JSON round-trip of score B→A | after one win B→A |
|---|---|---|---|
| `{wins:3, losses:1}` | 2/3 → same | 2 → 2 | score 3, wins 4 → same |
| `{wins:Inf, losses:0}` | **Inf/Inf → 0/0** | **null → 0** | **score 12 wins Inf → score 1 wins 1** |
| `{wins:Inf, losses:Inf}` | **NaN/Inf → 0/0** | **null → 0** | **score NaN → score 1** |

**ATTRIBUTION, stated as the brief required.** `dispositionProfile.js` was migrated to
the kernel primitive in wave 1 on a MECHANICAL rating that was **borrowed, not owned** —
safe only because this ledger's gates absorb upstream. **Car 2 changes what that file
emits. That is attributable to car 2, not to wave 1.** The moved value is the coalition
join threshold, and 0.8 is its floor: the lowest possible bar on joining, handed out on
a corrupt field rather than a won contest.

## 4. THE PINS ARE NEGATIVE-CONTROLLED — the arm that makes them evidence

Five pins added to **two existing test files** (no new test FILE, so no new-file census
is owed). Run against the UN-REPAIRED source by inverse edit:

| | result |
|---|---|
| 5 new arms vs un-repaired source | **ALL FIVE FAIL**, exit 1 (`NaN: expected 193 to be 118`; `expected 1 to be 0.5`; `expected Infinity to be 1`) |
| 35 pre-existing tests in those files | **all still pass** — the pins are the only thing reacting |
| 5 new arms vs repaired source | **all pass**, exit 0 |

Each arm carries an **anti-vacuity** partner, because "the poison reads neutral" would
pass just as happily on a leaf that had stopped reading its inputs at all. `Object.is`
throughout — never `!==`, which reports a false mismatch on NaN.

## 5. RECEIPTS — every exit captured in-shell, never from a notification

| command | exit | result |
|---|---|---|
| 13 cartography suites incl. `townMapGolden`, `townMapV2Golden`, `townCartographyDormancyGolden` | **0** | 192 tests |
| 21 disposition suites (4 batches) | **0,0,0,0** | 115+229+23+3 = **370 tests** |
| `generatorGoldenMaster` (alone) | **0** | 3 tests — the master same-seed golden |
| the 5 new pins, repaired | **0** | 40 tests in 2 files |
| the 5 new pins, **un-repaired (negative control)** | **1** | 5 failed / 35 passed |
| `node scripts/check-domain-strict.mjs` (**the real script**) | **0** | 1121 errors, ceiling 1121 — unchanged |
| `npx eslint` on all 4 touched files | **0** | clean |
| `npx tsc --noEmit` at the tip | 2 | **167 errors — PRE-EXISTING** |
| `npx tsc --noEmit` at **base**, clean porcelain | 2 | **167 errors**; log diff vs tip = **one line NUMBER moved (751→773), error text byte-identical** |
| `npx vitest run tests/lint/` (final) | **1** | **2130 passed / 1 failed of 2131** |
| the one failure | — | `clampPrimitiveBaseline > baseline exactly matches…` — **EXPECTED** |
| `sovereigntyLightingContract` walker, plain re-run post-refreeze | **0** | 34 tests |

**⚠ I did NOT trust `tests/lint/`'s green as a ratchet green** — the brief is right that
`domainStrictBaseline.test.js` passes on an injected command. I ran
`node scripts/check-domain-strict.mjs` directly, at base and at the tip: **exit 0 both
times, 1121/1121.** My change is strict-neutral.

**⚠ THE CLAMP RATCHET IS STILL RED AND WILL STAY RED.** `expected [ …(62) ] to deeply
equal [ …(78) ]` — identical before and after. This dock is at base `90702c3e9`, which
is **pre-wave-1**, so it carries **78** local copies, not the 72 of the wave-1 dock. I
migrated nothing and added/removed no local clamp definition, so the census is
untouched in both number and membership.

**⚠ ONE RED WAS MINE AND I DID NOT ASSUME OTHERWISE.** The `sovereigntyLightingContract`
census arm reddened (+5 titles). Its `measuredAtSha` is an ancestor of base with ten
commits since, so "already stale" was live. **Measured:** reverting only the two test
files to base, src repairs left in place, the walker runs **green 34/34 exit 0** — so
the whole +5 is mine. Refrozen by the register's own documented command (never hand-
edited), on a clean tree, and the plain re-run afterwards is green:
`files 2521→2521, parked 371→371, credited 2150→2150, titles 23178→23183,
suiteTitles 6213→6214`.

## 6. ⭐ THE OPTIONAL CLAMP SWAP — NOT TAKEN, and one file is PROVEN not to qualify

**JUDGMENT — say "veto" to flip it.** The brief made the swap secondary and optional. I
declined it, on two grounds:

1. **Measured disqualification, not preference.** `cartographyBuildings.js:511` computes
   `1000 * (coefficient(heightCm) / (coefficient(planUnitCm) || 1))`. That `|| 1` is a
   FALSY floor, not a numeric one: it catches 0 and non-finite, and **misses a tiny
   positive**. Driven through the real leaf:

   | planUnitCm | pre-clamp quotient | heightPermille |
   |---|---|---|
   | 50 (fixture) | 250 | 250 |
   | 1 (contract floor) | 12500 | 1000 |
   | **5e-324 (denormal)** | **+Infinity** | 1000 |
   | **1e-320** | **+Infinity** | 1000 |
   | −1 | −12500 | 0 |

   Wave-0 **fence 2** is explicit: an argument tracing to a division that cannot be
   followed to a bound DISQUALIFIES the file. This site takes +Infinity, so
   `cartographyBuildings.js` does **not** qualify while it stands — my repair did not
   change that, and it would have been wrong to migrate over it.

2. **One lane, one disclosed behaviour-shift class.** These commits already carry a
   disclosed same-seed shift. Stacking clamp semantics on top would make the disclosure
   harder to audit and harder to revert. Each car is independently revertable as it is.

⭐ **A gift to the final wave, measured:** after car 1, the OTHER four clamp sites in
`cartographyBuildings` (`:351 popWithin01`, `:435 start`, `:445 agePermille`,
`:547 dwelling height`) take provably finite arguments — the two guards I repaired were
what fed the divergent classes into `:351` and `:445`. **The file is one floor away from
qualifying**, and that floor is `:511`.

## 7. DEFERRED — documented, not bugs to re-find

1. ⛔ **`cartographyBuildings.js:511`'s falsy floor (see §6).** The sibling that owns the
   same quantity already spells it correctly: `sceneBuildingFabric.js:280` uses
   `/ Math.max(1, planUnitCm)`. **Two spellings of one intent, and only one actually
   floors.** Production is very likely safe — `manifestContract.js:216` validates
   `space.planUnitCm` as a positive integer — but that bound lives in a module this leaf
   never calls, and `compileTownBuildingLayers` takes `buildings` as `unknown`. Not
   fixed here because it is a THIRD behaviour-shift class and outside the assigned two.
   **Spawned as a follow-up task.**
2. **The brief's line numbers (§1) are stale by a whole revision.** Anyone else working
   from that brief should re-derive rather than navigate by them.
3. **`typecheck:domain` (`tsc --noEmit`) is red at base with 167 errors**, one of them in
   `dispositionLedger.js`. Pre-existing and proven so; the estate gates on
   `typecheck:ratchet` and `typecheck:domain:strict` instead. Untouched.
4. **The clamp census in this dock is 78, not 72.** This dock is pre-wave-1. Composing
   this lane with `refs/preserve/train-clamp-w1-2026-09-05` (`250029189`) is the chair's
   arithmetic; the two do not overlap in files, so no conflict is expected — but I did
   not execute the merge and do not claim it is clean.

## 8. A HAZARD THIS LANE CREATED FOR ITSELF, WORTH RECORDING

To earn the "pre-existing" claim on `tsc`, I wrote base versions over my working files
with `git show HEAD:<path> > <path>`. That is `git checkout --` by another spelling and
**it destroyed the two uncommitted test files** (the src pair survived only because I
had copied them first). Recovered by re-applying the edits, and verified byte-exact by
sha. **The rule generalises: back up EVERY dirty file before any base-state comparison,
not just the ones you expect the comparison to touch.**

---

## RETROVALIDATION ROW

| field | value |
|---|---|
| **Lane** | CLAMP-REPAIR |
| **Seat** | **Opus 5 — Fable-unvalidated** |
| **Status** | **PARTIAL** — both repairs complete + negative-controlled; optional clamp swap declined with a MEASURED disqualification |
| **Base → tip** | `90702c3e9` → **`25e6a6228`** (3 cars) |
| **Census** | clamp copies **78 → 78** (untouched, membership identical); baseline **62 untouched**, ceiling **62 untouched**, **0** rows removed/refreshed; strict **1121/1121** unchanged |
| **Registers moved** | ONE — `.lighting-census-baseline.json`, titles +5 / suiteTitles +1, **regenerated by its own command**, attribution proved green-at-base first |
| **Expected red** | `clampPrimitiveBaseline` equality arm — pre-existing, measured at base, unchanged in kind AND in number |
| **Behaviour shift** | **YES, DISCLOSED, and confined to non-finite inputs.** Map geometry moves on the same seed only for NaN/±Infinity population (real city: 193→118 dwellings) and non-finite fabric. Disposition reads and PERSISTED state move only for ±Infinity counts, incl. `thresholdFactorOf` 0.8→1. **Every finite/healthy input is byte-identical**, and all goldens (`townMapGolden`, `townMapV2Golden`, `townCartographyDormancyGolden`, `generatorGoldenMaster`, `dispositionChannelsDormancyGolden`, `strategicPostureDormancyFence`) re-ran green — so no PRODUCTION same-seed output moved |
| **⟦OWED⟧** | Fable retrovalidation of: §6's declination of the optional swap (an Opus reading of wave-0 fence 2 against a measured +Infinity); and the judgment that a repair of this class earns regression pins the brief did not request |
| **Veto handles** | want the swap anyway → the `:511` floor must land first (task spawned), then `cartographyBuildings` qualifies · want no pins → revert the test-file hunks of `d8aaa85d6`/`fc8ecd2fe` **and then `25e6a6228` in full**, since the register exists only to serve them · the two repairs themselves are independently revertable, one car each |

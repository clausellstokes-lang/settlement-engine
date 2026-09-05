# RECEIPT — lane CLAMP-W2 (Opus 5) — **PARTIAL**

**PARTIAL: of the six, THREE MIGRATE and THREE ARE REFUSED. The whole razing trio is refused. Two of
them (`razing`, `razingWitness`) sit on the doctrine the chair has already accepted twice, backed
here by an EXECUTED zero-import pin and not only a module header. The third
(`razingExecution`) is refused on the wave-0 ruling's OWN FENCE 1: its local `clamp01` IS the
file's `num()`-style screen at nine `unknown`-typed reads, and fence 1 says such a screen must be
kept. The type system says so too — the migration mints exactly 9 strict errors, all
`unknown → number`, naming those nine sites. The
clamp ratchet's equality arm stays RED and that is expected; re-arming is the terminal act of the
program, not this lane's.**

Dock `$SC/laneCLAMPW2`, detached, base **`df7cdd37e`**, porcelain 0 verified at arrival, 453
node_modules symlinks never materialised. No `npm install`, no `npm run build`, no rebase, no push,
no ref writes, no `git stash`, no `git checkout --`, no `--amend`, no baseline/ceiling/census edit,
no new test file, no edit to the four spoken-for files.

---

## 0. THE WAVE-0 FENCES, QUOTED BACK (the bar I worked to)

The bar is **CALL-SITE-LEVEL PROVEN BYTE-NEUTRALITY**, under three fences:
1. ⛔ **The `num()`-style wrappers that screen the divergent classes MUST BE KEPT.** "Migrate the
   definition; do not touch the call sites."
2. ⛔ **UNKNOWN reachability is not NO** — an argument tracing to a division, an average, a parsed
   value, or a field read off world state "that cannot be followed to a bound" disqualifies.
3. ⛔ **`warAllianceRisk` and `conquestFeasibility` ARM 2 are excluded by name.**

**Fence 1 honoured absolutely.** Every one of my three landed diffs is *definitions only*: one added import
line, one deleted JSDoc + definition. Not one call site, not one screen (`finite()`, `coefficient()`,
the `typeof … && Number.isFinite` population guards) was touched. Mechanically checked below.

---

## 1. THE BILL, RE-DERIVED AT `df7cdd37e` (I ran the detector's own algorithm, not the brief's figures)

| quantity | brief implied | **I measured** | verdict |
|---|---|---|---|
| local clamp copies (`DEF_RE`, comments stripped, kernel exempt) | 72 | **72** | matches |
| baseline rows / `BASELINE_CEILING` | 62 / 62 | **62 / 62** | matches |
| un-baselined copies | 10 | **10** | matches |
| stale baseline rows | — | **0** | — |
| my six = the ten minus the four spoken for | yes | **yes, exactly** | matches |

---

## 2. ⚠ THE BRIEF'S RAZING PREMISE IS FALSE — MEASURED

> *"the razing trio share NO NaN policy — three divergent policies, two of which ride NaN straight through"*

**All three `clamp01` bodies are BYTE-IDENTICAL.** `md5 c433f454fecfffdbe4094ed92527fd5e` for each,
and `cmp` clean pairwise. There is ONE policy in the trio, and it rides NOTHING through:

```js
function clamp01(value) {            // razing.js:291 · razingExecution.js:234 · razingWitness.js:114
  const n = Number(value);
  if (!Number.isFinite(n)) return 0; // NaN, ±Infinity, undefined, null, '' -> 0
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
```

The [[a-banked-census-row]] figure ("THREE divergent policies, two ride NaN through") is true of the
**sixteen** un-baselined copies as a set; it is **not** true of the razing trio, and the brief
applied it to them. The trio's policy is a COERCE-then-finiteness screen, strictly safer than
passthrough.

### THE NaN-POLICY MAP OF THE RAZING TRIO — BEFORE and AFTER

| file | BEFORE | AFTER | moved? |
|---|---|---|---|
| `razing.js` | `Number()` coerce → non-finite ⇒ **0** | **unchanged — REFUSED, keeps its copy** | no |
| `razingExecution.js` | `Number()` coerce → non-finite ⇒ **0** | **unchanged — REFUSED, keeps its copy** | no |
| `razingWitness.js` | `Number()` coerce → non-finite ⇒ **0** | **unchanged — REFUSED, keeps its copy** | no |

✅ **The trio still agrees with itself, and that is the right outcome.** My first pass migrated
`razingExecution` and would have split the estate three-to-two; the strict typecheck refuted it (§5.2)
and the car was reverted by inverse edit, `cmp`-verified against a backup taken before the plant.
**The razing estate's NaN policy is unmoved by this lane.**

---

## 3. FUNCTION-LEVEL DIVERGENCE — CONFIRMED for every local expression (`Object.is` throughout)

| local variant | files | divergence class, measured |
|---|---|---|
| `Number()` coerce + isFinite⇒0 | razingExecution (+ the two refused) | **12 of 33** battery inputs; every one a NON-NUMBER (`'0.5'`, `'1'`, `'  0.75  '`, `'1e-320'`, `true`, `[0.5]`, `[1]`, `['0.5']`, `[[0.3]]`, `{valueOf}`) **plus `-0`** |
| passthrough `v<lo?lo:v>hi?hi:v` | dispositionLedger, cartographyBuildings | NaN rides through (kernel ⇒ `lo`); `+Infinity` ⇒ `hi` locally, `lo` under the kernel; strings ride through **as strings**; `-0` ⇒ `-0` locally, `+0` under the kernel |
| passthrough `clamp01` | cartographyMultiplicity | same, with `lo=0, hi=1` |

**Over 200,000 random doubles plus every numeric battery member, the coerce variant diverges from
the kernel exactly ONCE — on `-0`.** Every other divergence needs a non-number.

---

## 4. THE SIX ROWS

| # | file | verdict | ground |
|---|---|---|---|
| 1 | `worldPulse/razing.js` | ⛔ **REFUSED — hard pin** | header *"It holds NO IMPORTS AT ALL, exactly like `conquestIntent.js` and `conquestExecution.js`"*; **executed pin** `tests/domain/razingWr8.test.js:616` `expect(src).not.toMatch(/^\s*import\s/m)` (test *"zero imports, no rng, no wall-clock, no mutation"*). Migration **reds the gate**. |
| 2 | `worldPulse/razingExecution.js` | ⛔ **REFUSED — wave-0 FENCE 1** | its `clamp01` IS the `num()` screen at 9 `unknown`-typed reads; migrating mints **9 strict errors** (`unknown → number`) and 528 divergent probe rows. Measured, then reverted. |
| 3 | `worldPulse/razingWitness.js` | ⛔ **REFUSED — hard pin** | header *"IT HOLDS NO IMPORTS AT ALL for the reason the sibling law leaves do"*; **executed pin** `tests/domain/razingWitnessWr8.test.js:494` `expect(/^\s*import\s/m.test(code)).toBe(false)` (test *"the judgment LAW holds no imports at all"*). Migration **reds the gate**. |
| 4 | `worldPulse/dispositionLedger.js` | ✅ **MIGRATED** | 3 call sites, all behind the file's own `finite()` screen; 1321-row differential, 5 divergences, **all `-0`, all byte-invisible** (§5) |
| 5 | `townCartography/cartographyBuildings.js` | ✅ **MIGRATED** | 5 call sites; 20-row real corpus **byte-identical**; 80 adversarial poison runs, 8 divergences, all at magnitudes the producers cannot mint — one trap recorded (§6.2) |
| 6 | `townCartography/cartographyMultiplicity.js` | ✅ **MIGRATED** | 2 call sites; **0 divergences over 2,099 rows** |

### ⛔ THE THREE REFUSALS ARE "MUST NOT", NOT DEFERRALS

`razing.js` and `razingWitness.js` are the **`conquestIntent` case and the `conquestExecution` case
at the same time**. `conquestIntent` was refused at wave 1 on an executed pin; `conquestExecution`
on a module header; the chair accepted both, ruling that a header declaration is *"an older
constraint that wins"*. These two files carry **both** grounds simultaneously — and `razing.js`'s
header names `conquestIntent.js` and `conquestExecution.js` explicitly as the siblings it is
copying. Overruling them would make the wave-0 exclusion list arbitrary.

**Both refusals carry an EXECUTED negative control, run without vitest** (`$SC/laneCLAMPW2-scratch/pinproof.mjs`):
the pin's own regex, transcribed from the test source, applied to the file as it is and to an
in-memory migrated copy. For each: healthy anchor **true** (the import really was inserted), pin
passes now **true**, pin passes after migration **false** ⇒ **migration REDS THE GATE**. The real
files were never written.

Their numeric position is irrelevant to the outcome and is stated for completeness: their clamp is
the same coerce variant as `razingExecution`'s, which I proved diverges only on non-numbers and
`-0`. **A file can be provably safe and still not free to move.**

---

## 5. THE WORK, PROVEN PER CALL SITE

Method: differential probes driving the **real modules** before and after the edit, serialized with
a replacer that preserves `-0` and non-finites (`JSON.stringify` alone writes both as `0`/`null` and
would have hidden every finding below).

### ⛔⛔ THE INSTRUMENT LIED ONCE, AND A NON-VACUITY CONTROL CAUGHT IT
My first comparator indexed `row[3]` on rows that carry only three elements, so it compared
`undefined` to `undefined` and reported **"0 divergences"** for `dispositionLedger`,
`cartographyMultiplicity` and `cartographyBuildings`. All three were **false greens**. It was caught
by a separate non-vacuity control that asked whether the poisons move the output at all — they move
`heightPermille` across `{0 … 1000}`. The comparator now compares the WHOLE row and every result
below is from the repaired instrument. *The assertion-that-cannot-fail family, twelfth shape: an
index that is out of range on both sides.*

### 5.2 ⛔ `razingExecution.js` — MEASURED, MIGRATED, THEN REFUTED BY THE TYPE SYSTEM AND REVERTED
I migrated it and proved a great deal before the refutation arrived, so the evidence is recorded.

**Call-site trace (12 sites: 281, 445, 554, 555, 559, 560, 609, 704, 861, 1014, 1015, 1016).** Every
*production* argument is `typeof number`:
- **445** `risk.risk01` ← `readAllianceWebRisk` returns `Math.max(0, Math.min(1, Number(v)||0))` ⇒ a
  finite number in [0,1], and `Math.max(0, −0)` is `+0`, so **never `-0`**.
- **554/555/861/1014-1016** ← `ensureRelationshipState`, whose every axis is
  `clamp01(existing.x ?? default)` in the same `Math.max(0, …)` shape ⇒ finite [0,1], never `-0`.
- **559** `(resentment − 0.78) / (1 − 0.78)` — guarded by `baseline >= 1 ? 0 : …`; the divisor is the
  constant **0.22**; the numerator is finite ⇒ the quotient is finite.
- **560/609/704** ← arithmetic on finite numbers / an already-clamped `severity01`.
- **1014-1016 outer** ← a sum/product of numbers, so the argument is `typeof number` for ANY
  `hit.*`; a non-finite sum reads 0 under both implementations.
- **281** `recordOf(top).score` ← a raw read of the persisted `warReasons` ledger (§6.1).

`warDeployment.js` is the file's ONE production mouth and imports only `EMPTY_PATCH` and
`razingSiegeEmission`; `subsystemRowsVirtual.js` names the path in a certification STRING and does
not import it. The 1155-row adversarial probe moved **528** rows — every one on a NON-NUMBER.

**⛔ THE REFUTATION, and it is the wave-0 ruling's own first fence.** `npm run
typecheck:domain:strict` went from clean to **+9 strict errors, baseline 0**, and all nine are the
same diagnostic:

```
src/domain/worldPulse/razingExecution.js(275,25): error TS2345: Argument of type 'unknown' is not assignable to parameter of type 'number'.
  … and 548,30 · 549,29 · 603,28 · 698,28 · 855,46 · 1008,32 · 1009,37 · 1010,31
```

Nine call sites were passing `unknown` and relying on the local `clamp01`'s `Number(value)` to
coerce it. **That makes the local definition this file's `num()`-style screen, not merely a clamp** —
and fence 1 says in terms: *"The `num()`-style wrappers that screen the divergent classes MUST BE
KEPT… deleting one as post-migration cleanup re-exposes the divergent classes on raw record reads."*
Deleting it is exactly that act. The alternative — minting `Number(...)` at nine call sites — is
forbidden by the same fence's next sentence (*"Migrate the definition; do not touch the call
sites"*), and would still leave the `-0` class.

**So the file is REFUSED, and the 528 divergent rows and the 9 type errors are two independent
measurements of one fact.** The car was reverted by INVERSE EDIT (`cp` from a backup taken before
the plant), `cmp`-verified byte-identical to that backup, and `git diff` for the file is empty.

⭐ **The general law this lane found, and it explains all three migrations and all three refusals:**
*where the estate already had a SEPARATE `num()`-style screen (`finite()` in `dispositionLedger`,
`coefficient()` and the `typeof … && Number.isFinite` population guards in the cartography pair), the
clamp is free to move and the strict typecheck stays clean. Where the CLAMP ITSELF is the screen, it
cannot move, and the typecheck says so in one line per call site.* That test is cheap, mechanical,
and it should be run FIRST on any remaining candidate.

### 5.3 `dispositionLedger.js` — 3 call sites, 1321-row differential, **5 divergences, all `-0`**
| divergent input | before | after | reaches output? |
|---|---|---|---|
| `readDispositionChannel({channels:{<ch>:{stock01:-0}}}, ch)` ×4 channels | `{stock01:-0, band:'restrained'}` | `{stock01:0, band:'restrained'}` | **no** |
| `readDispositionAppetite({appetite:{stock01:-0}})` | `stock01:-0` | `stock01:0` | **no** |

The **band is identical in all five** (`-0 < x` ≡ `0 < x`), and `JSON.stringify(-0) === "0"`, so the
persisted bytes are unchanged. `-0` is also **not producible**: a JSON round-trip destroys it, the
in-tree producers (`roundStock`, `decayTowardNeutral`, `0.5 + x/24`, sums with a `+0` floor) do not
mint it, and post-migration the kernel's `Math.max(0, …)` cannot return it at all. I searched the
worldPulse estate for a division by a stock (which is where `-0` would become visible as `-Infinity`)
and found none. Every one of the three sites sits behind the file's own `finite()` screen —
**fence 1: that screen is load-bearing and stays.**

### 5.4 `cartographyMultiplicity.js` — 2 call sites, **0 divergences over 2,099 rows**
14 tier spellings × 36 populations × 2 labels, plus 18 prosperity readings × 5 labels, plus 1,001
population samples across the metropolis span. Site 138 is a **division** and it is safe by closed
vocabulary: `cartographyTierIndex` is **total** (an unknown tier reads `village`), so `span` is
always one of six frozen pairs and the divisor `span[1]−span[0]` ∈ **{52, 339, 499, 4099, 19999,
74999}** — never zero. `population` is screened `typeof number && Number.isFinite` one line above.
Site 140 is weights over `[0,1]` plus a closed `PROSPERITY_RANK` lookup with a `?? 3` fallback.

### 5.5 `cartographyBuildings.js` — 5 call sites; the real corpus is byte-identical
The **20-row V2 golden corpus compiled through the real leaf pipeline (wards → parcels → buildings)
is byte-identical before and after** — every `heightPermille`, `agePermille`, `condition`,
`styleToken` and receipt. Sites 435 and 558 take closed tuning constants
(`FOOTPRINT_SHRINK_PERMILLE ∈ {660,540,420,300}`, `DWELLING_HEIGHT_PERMILLE`) plus a jitter in
`{−1,0,+1}`; `grade` is a total 3-word ternary whose every word is a key of the table. Site 351's
division is the same closed-span shape as §5.4, with the repair-car-1 population guard above it.
The 8 adversarial divergences are §6.2.

**Repairs confirmed present in my base:** `3f98cb091` (car 2, `|| 0` → `finite()` in
dispositionLedger) and `013995dd3` (car 3, `|| 1` → `Math.max(1, …)` in cartographyBuildings) both
read as landed at `df7cdd37e`.

---

## 6. TRAPS SURFACED (recorded, not fixed — the wave-1 pattern)

### 6.1 ⛔ `razingExecution:281` — a bound that lives at WRITE time, not READ time (for whoever revisits the file)
`strongestLiveGrievance01` reads `recordOf(top).score` off `warReasonsFor(...)`, which is
`getSpatialLedger(worldState, 'warReasons')` — a **raw read of a persisted ledger**. The bound is
real: `warReasons.js` is its sole writer and writes `score: round4(clamp01(score))` (:221) behind a
`Number.isFinite(c.score)` filter (:256). But that guarantee lives at the WRITE, not on the read
path — unlike wave 1's `warCoalitionDecision`, whose `ensureRelationshipState` normalises on EVERY
read. **The exact input that would move:** a save whose `warReasons` ledger carries
`score: '0.9'` (a string) reads grievance **0.9 before and 0 after**, moving `severity01`. No
in-tree writer can produce it; a hand-edited or imported save could. Same class as the two the
repair cars cured. **This is no longer load-bearing for a migration decision** — the file is refused
on fence 1 (§5.2) before this question is reached — but it is the trap anyone who overrules that
refusal inherits, and it would have been the hard call had the type system not settled the file
first.

### 6.2 ⛔ `cartographyBuildings` — `planUnitCm` has a validated FLOOR and NO CEILING
The sibling of wave 1's `storageCapacityMonths` trap. Of the 8 adversarial divergences, three
classes:
- **`fabricAccumulation01` ≥ 1e306** — **unreachable**: the sole producer
  `cartographyMorphology.js:137` returns `unit(sum/n)`, and `unit` clamps to `[0,1]` (`+Infinity`
  reads 1, `NaN` is then rejected by the leaf's own `Number.isFinite` screen).
- **`historyMark` ≥ 1e305** — **unreachable**: `buildingProfiles.js:334` writes
  `Math.min(15, history)`, and `arch/params.js:70` declares `{kind:'index', lo:0, hi:15}`.
- **`heightCm` ≥ 1e305** — the open one. `heightCm = heightPlan * planUnitCm` with `heightPlan`
  hard-clamped to `[5,60]` (`buildingProfiles.js:430`), but `planUnitCm` is validated only as *"a
  positive integer"* (`manifestContract.js:216`) with **no upper bound**. At `planUnitCm ≳ 1.7e303`
  the product overflows, `Math.round(+Infinity)` stays `+Infinity`, and the two implementations
  disagree — **`heightPermille` 1000 locally, 0 under the kernel**. The corpus produces
  `planUnitCm ∈ {10,14,20,30,50,80}` over 2,322 scene rows and `heightCm ∈ [50,1100]`, so the margin
  is ~300 orders of magnitude — but nothing pins it, exactly as nothing pinned the 1.5 months floor.
  **Cheap cure: a ceiling on `planUnitCm` in `manifestContract.js`.**
- **`heightCm = -1`** — the fourth divergence is the `-0` class again (`Math.round(-0.208)` is `-0`,
  which the local clamp passes through and the kernel's `Math.max(0, …)` normalises to `+0`);
  unreachable, since `heightPlan ≥ 5` and `planUnitCm > 0` make the product strictly positive, and
  byte-invisible in JSON regardless.

### 6.3 ⚠ A CLAMP THE DETECTOR CANNOT SEE, one module from my own work
`cartographyMorphology.js:62` defines `function unit(value) { return value < 0 ? 0 : value > 1 ? 1 : value; }`
— a passthrough `clamp01` under a different NAME. `DEF_RE` matches only `clamp`/`clamp01`
declarations, so this copy is invisible to the census and is **not** one of the 72. It is the
detector's own documented CANNOT-CATCH gap ("a clamp implemented under a different name"), observed
live rather than in the abstract. **It is also load-bearing for §6.2** — it is what bounds
`fabricAccumulation01`. Recorded as a finding for whoever extends that instrument; **not** a row to
add, and **not** something to migrate, since migrating it would change the `+Infinity ⇒ 1` reading
this lane's proof depends on.

### 6.4 ⚠ THE STRICT TYPECHECK IS A ONE-LINE ELIGIBILITY TEST, and nobody has been using it
`npm run typecheck:domain:strict` names every call site that was relying on a local clamp's coercion,
in one diagnostic per site. Running it on a candidate BEFORE the migration would have settled
`razingExecution` in a minute instead of after a full probe build. Neither the wave-0 ruling nor
either brief mentions it. **Recommendation for the final wave: run it as the FIRST screen.**

---

## 7. RECEIPTS — executed, every exit captured in-shell (never from a task notification)

**The cars.** Base `df7cdd37e` → tip **`b0cba0dca`**, three cars, porcelain **0**:

| sha | file |
|---|---|
| `a176793a1` | `worldPulse/dispositionLedger.js` |
| `4edb16184` | `townCartography/cartographyBuildings.js` |
| `b0cba0dca` | `townCartography/cartographyMultiplicity.js` |

Each carries `Seat: Opus 5 — Fable-unvalidated` and `Lane: CLAMP-W2` (verified by `git log`). The
pre-commit hook runs `eslint --fix` and re-stages, so each commit's content was verified by
`git show ${sha}:path | md5` against a copy saved before staging — **all three byte-identical**,
no silent hook edit.

| command | exit | result |
|---|---|---|
| `gate-mutex … vitest run <128 suites>` | **1** | **124 passed / 1 failed** of 128 files; **2191 tests pass**, 36 skipped. The one failure is the edge-bundle register bill below. Includes `townMapGolden`, `townMapV2Golden`, `townCartographyDormancyGolden`, `townCartographyDeterminism`, `generatorGoldenMaster`, `dispositionChannelsDormancyGolden`, `strategicPostureDormancyFence`, `spatialConsequenceDormancyGolden`, `k0Determinism`, `archMeshDeterminism` |
| `gate-mutex … vitest run tests/lint/` **WHOLE** | **1** | **137 of 138 files green · 2130 of 2131 tests.** Failing-arm list: **exactly one** — `clampPrimitiveBaseline > baseline exactly matches the files that still define a local clamp/clamp01`. Its sibling arm (`baseline never grows past its committed ceiling`) **PASSES** |
| the one lint red, in full | — | `AssertionError: expected [ …(62) ] to deeply equal [ …(69) ]` — **the same arm, the same shape** as at base (`62 ≠ 72`), with the gap SHRUNK by three. Received = the 62-row baseline, Expected = the 69 files the tree defines |
| `node scripts/check-domain-strict.mjs` | **0** | *"✓ no strict-type regressions (1120 errors, ceiling 1120)"* |
| `npx eslint` on the three files | **0** | clean |
| `pinproof.mjs` (negative control, §4) | — | both zero-import pins: healthy anchor **true**, pass now **true**, pass after migration **false** ⇒ **migration REDS THE GATE** |
| the census, re-derived at the tip | — | **69** files, baseline **62**, un-baselined **7**, stale rows **0** |

**Quiet-window law honoured, and my first probe of it was WRONG.** The gate/sibling load ran at
`load1` 31–99 with up to 19 vitest workers for ~50 minutes; no vitest was started during it. ⚠ My
first counter matched *its own `ps ax | grep` wrapper* (whose command line contains the word
"vitest"), so it reported `vitestProcs=1` forever and **the window could never have opened**. The
corrected counter was proved non-blind against a planted `npx vitest run` process (sees 1, then 0
once it exits) before being trusted. Both runs above were started only after **three consecutive
60-second probes at `load1 < 4.0` with zero real vitest processes**, and both went through
`sh scripts/gate-mutex.sh --run`.

### ⛔ THE ONE RED THAT IS MINE — A REGISTER ACT OWED TO THE CHAIR
`tests/edgeFunctions/aiOutputSchemaBundle.freshness.test.js` fails because
`src/domain/worldPulse/dispositionLedger.js` is one of the **113 recorded inputs** of the edge-shared
bundle. Attributed **without a plant and without a vitest run**, by recomputing the test's own hash
over the meta's input list with each version of that one file:

```
recorded meta.sourceHash             d3d8ea6d14ba2375
live hash with the BASE ledger       d3d8ea6d14ba2375   <= GREEN at base — the red is MINE
live hash with the MIGRATED ledger   28c68442afa0446b
```

The cure is `npm run build:edge-shared` — a **build** (my fences forbid it) and a **register act**
(the chair takes those at the landing). Precisely the shape of base commit `0a73708f3`, which
regenerated this same bundle for wave 1's migration. **The two cartography cars are free of this
bill**: zero `townCartography` files appear among the 113 inputs.

**SAME-SEED OUTPUT SHIFT: NONE.** Proven by construction per call site, and confirmed by (a) the
20-row V2 golden corpus compiled through the real leaf pipeline being byte-identical before and
after, and (b) ten determinism/dormancy goldens re-run green.

## 8. THE ARITHMETIC

| quantity | at `df7cdd37e` | at my tip | note |
|---|---|---|---|
| local clamp copies | **72** | **69** | three migrated |
| baseline rows | 62 | **62** | **untouched** |
| `BASELINE_CEILING` | 62 | **62** | **untouched** |
| un-baselined copies | **10** | **7** | |
| the ratchet's equality arm | RED (62 ≠ 72) | RED (62 ≠ 69) | pre-existing; the gap SHRINKS by three |

**Of the ten, SEVEN remain, and every one now has a recorded reason not to move:**
`warAllianceRisk` (wave-0 fence 3) · `conquestFeasibility` (wave-0 fence 3) · `conquestIntent`
(wave-1, executed pin) · `conquestExecution` (wave-1, module header) · **`razing`** (this lane,
header **+** executed pin) · **`razingWitness`** (this lane, header **+** executed pin) ·
**`razingExecution`** (this lane, wave-0 fence 1 — the clamp IS the screen).

⛔ **The final wave inherits a ceiling question with NO MECHANICAL ANSWER LEFT.** Seven copies
cannot move without overruling a pin, a header, or fence 1 itself; the ceiling is 62 and the census
is **69**. Seven is well past the "at least four" the wave-1 ruling projected, because all three of
this lane's refusals were unforeseen by the plan. **The mechanical work is now EXHAUSTED: there is
no eighth file left to migrate.** The choice is explicit: **raise 62 → 69 with seven recorded
rulings of the `sovereigntyAppraisal`/CR-WR10-A(b) kind, or overrule pins.** That is an owner-gated ruling of the
kind the wave-1 ruling reserved for "the FINAL wave's arithmetic", and it is not this lane's.

---

## RETROVALIDATION ROW

| field | value |
|---|---|
| **Lane** | CLAMP-W2 |
| **Seat** | **Opus 5 — Fable-unvalidated** |
| **Status** | **PARTIAL** — 4 migrated, 2 refused with cause |
| **Base → tip** | `df7cdd37e` → **`b0cba0dca`** (3 cars: `a176793a1`, `4edb16184`, `b0cba0dca`) |
| **What was judged** | (a) that `razing.js` + `razingWitness.js` are REFUSALS on the accepted header/pin doctrine; (b) that `razingExecution.js` is a REFUSAL because its clamp IS the `num()` screen fence 1 protects — rather than minting `Number(...)` at nine call sites to keep the migration; (c) that a `-0`→`+0` change with an identical band and identical JSON bytes is byte-NEUTRAL rather than a shift; (d) that an unbounded `planUnitCm` ~300 orders of magnitude from the corpus is a TRAP to record, not a STOP |
| **What the Fable chair must re-derive** | (b) and (c). (b) is vetoable in one direction only — say "mint the nine screens" and `razingExecution` migrates in one car, all the proof already executed and recorded in §5.2. (c) is the finer call: if the chair rules `-0 → +0` a SHIFT rather than a neutrality, `dispositionLedger` reverts alone (car listed below) and the other two stand. |
| **Receipts by path** | `$SC/receipt-clamp-w2.md` (this file) · probes and before/after captures in `$SC/laneCLAMPW2-scratch/` (`probe-*.mjs`, `*.BEFORE.json`, `*.AFTER.json`, `cmp.mjs`, `keys.mjs`, `vacuity.mjs`, `fnlevel.mjs`, `census.mjs`, `quiet.log`) |
| **⛔ REGISTER ACT OWED** | `npm run build:edge-shared` — car `a176793a1` moves the edge-shared bundle's source hash `d3d8ea6d14ba2375` → `28c68442afa0446b`. Measured green at base, so the bill is this lane's and the act is the chair's. |
| **Priority** | **HIGH** for the ceiling arithmetic in §8 — six frozen copies against a ceiling of 62 is now the program's terminal question. **MEDIUM** for (b). **LOW** for the traps in §6, none of which blocks. |
| **Census / ceiling / baseline** | **all three untouched.** 0 rows added, 0 removed, ceiling unchanged at 62. |
| **Behaviour shift** | **NONE.** The 20-row V2 corpus is byte-identical through the real leaf pipeline; ten determinism/dormancy goldens re-run green. |

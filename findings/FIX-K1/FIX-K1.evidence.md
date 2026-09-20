# FIX-K1 — the measurement at MY base, before the gate

Lane: Opus PARALLEL BUILD. Chair: Fable 5.1, session a9df403c.
Worktree `$SP/lane-fix-k1`, branch `fix-hasown-2026-09-20`, base `5a3380e8da48644bd35245f5cf51000225674a71`.
Stamped 2026-09-20 04:34 EDT (`date` read in the same call as the golden hashes).

## 0. The base is NOT TOOL-7's tip — the delta is applied

TOOL-7 measured at `63e40fe57`, one commit behind CURE-E/F/G. **My base carries all three:**

```
$ for c in 9f3455b842 96036427f1 c71782e7f4; do git merge-base --is-ancestor $c HEAD && echo "$c IS an ancestor"; done
9f3455b842 IS an ancestor      # CURE-E
96036427f1 IS an ancestor      # CURE-F
c71782e7f4 IS an ancestor      # CURE-G
```

TOOL-7 §0's declared delta touches **arm B only** (test-side marker slices). Arm A — this
lane's class — is unmoved, and the re-measurement below confirms it site for site.

## 1. GOLDENS, before the first edit

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

Identical to the two hashes the brief names (`7177cd6e…8f1e`, `921c51cf…db41`).

## 2. THE POPULATION AT MY BASE — `scanA2.mjs` re-run (CONFIRMED)

TOOL-7's instrument, copied to `$SP/lane-fix-k1-scratch/scanA2.mjs`, `ROOT` re-pointed at my
worktree. Full output: `A2.mybase.raw.txt`.

```
FILES: 5142
`in` tokens after comment+string+REGEX strip: 842
for-in: 7 | non-operand LHS (regex/keyword noise): 452 | rhs-not-identifier: 42
MEMBERSHIP-TEST OPERATORS: 341
Object.hasOwn( occurrences: 178 | hasOwnProperty occurrences: 352
```

Every headline figure equals TOOL-7's §2.1 funnel exactly. **`src/` convictable: 19 rows.**

| | count |
|---|---:|
| **FOUND** — convictable `src/` rows at my base | **19** |
| **CHANGED** — the 16 sites the brief names | **16** |
| **EXEMPT** — TOOL-7 false-positive class 8 (LHS bounded by an internal frozen constant) | **3** |

The three exempt, untouched, with the reason:

| site | why exempt |
|---|---|
| `src/domain/worldPulse/beliefMap.js:1127` | LHS is `GOVERNING_SEAT_KEY`, an internal constant |
| `src/domain/worldPulse/disinformationPlant.js:162` | same constant, same shape |
| `src/domain/worldPulse/espionage/espionageProducts.js:311` | `mapping.slot` comes from the frozen internal `LEG_SLOTS` |

⚠ **One correction to TOOL-7's own arithmetic.** Its §2.2 closes "src verdict: 9 convictions
across 15 sites, 2 sites excluded". The machine count is **16 convictable sites + 3 excluded
= 19 rows**: `beliefMap.js:1127` and `disinformationPlant.js:162` share one table row in the
report but are two sites. Nothing material moves — every site the brief names is present at
exactly the line it names.

## 3. THE LEAKS, EXECUTED PRE-CURE (plain node v24.12.0, no gate)

`leakProbe.mjs` → `leakProbe.out.txt`. Verbatim, and sharper than TOOL-7 predicted in three places:

```
=== 1. TIER BAND ===
  traditionCountCap(tier='town')        => 3  (typeof number)
  traditionCountCap(tier='constructor') => undefined  (typeof undefined)
  traditionCountCap(tier='toString')    => undefined  (typeof undefined)
  deriveFoundingTraditions(tier='town')        => 3 records
  deriveFoundingTraditions(tier='constructor') => 0 records   <-- ZERO founding traditions
=== 2. commercialReasonMirrorOf ===
  commercialReasonMirrorOf('constructor')    => typeof function :: function Object() { [native code] }
  commercialReasonMirrorOf('toString')       => typeof function :: function toString() { [native code] }
  commercialReasonMirrorOf('valueOf')        => typeof function :: function valueOf() { [native code] }
  commercialReasonMirrorOf('hasOwnProperty') => typeof function :: function hasOwnProperty() { [native code] }
=== 3. pulseFingerprint.extractPulseSummary ===
  effect_family_counts keys minted by prototype tokens: ["toString","constructor"]
  effect_family_counts['toString'] => "function toString() { [native code] }1"
  npc_corruption_by_kind => {"valueOf":"function valueOf() { [native code] }1"}
  payload contains "native code"? true
=== 4. flagRegistry.flag ===
  flag('constructor') => typeof function :: function Object() { [native code] } (truthy: true)
=== 5. espionageDoctrine ===
  readEspionageDoctrine(natureWord='constructor') => THREW: targeting.replace is not a function
=== 6. commodityFlow setStock ===
  after setStock(stocks, "constructor", "grain", 5):
    Object.grain => 5   <-- the GLOBAL Object function
```

**Three findings TOOL-7 under-read:**

1. **The tier band is worse than a `NaN`.** `deriveFoundingTraditions` returns **zero
   records** for a prototype-named tier: `COUNT_BAND['constructor']` is the Object
   constructor (truthy, so the `|| COUNT_BAND.village` fallback never fires), `band[0]` is
   `undefined`, and the mint loop never runs. A saved settlement with that tier loses every
   founding tradition — silently, on every re-derivation.
2. **espionageDoctrine does not leak, it THROWS.** `targeting.replace is not a function`.
   TOOL-7 graded it "CONVICT (medium), unreachable today"; the symptom is a crash, not a
   quiet wrong answer.
3. **`commodityFlow.setStock` writes onto the global `Object`.** `Object.grain = 5`. Not an
   `in` operator, so arm A never saw it — it is the truthiness sibling one line away from
   two sites the brief does name. It is the highest-severity instance in the sweep.

## 4. THE CYCLE PROBE — politics → genesis is ACYCLIC (CONFIRMED)

`cycleProbe.mjs` (static-import closure, both directions):

```
=== closure(genesis.js) — STATIC ONLY: 27 modules ===
politics.js reachable from genesis.js?  NO
closure(politics.js) — STATIC ONLY: 34 modules
```

The "YES" under the dynamic-import pass is a **false positive of my own probe**: the only
`import(` in politics.js is `/** @typedef {import('./genesis.js').TraditionRec} */` at
line 44, a JSDoc type-only import in a comment, not a runtime edge. Verified:

```
$ grep -n "import(" src/domain/traditions/politics.js
44:/** @typedef {import('./genesis.js').TraditionRec} TraditionRec */
```

**So the brief's acyclic arm applies: ONE resolver, politics calls it.**

Bundle safety, measured: `traditions/politics.js` has exactly **one** importer in `src/`
(`worldPulse/traditionsKernel.js:72`) and that importer **already** imports
`traditions/genesis.js` (`:59`). The new edge therefore adds zero modules to any chunk that
contains politics.js.

## 5. NOT A CONCERN — the OSR does not gate a plain `src/` content edit

`scripts/.observed-shape-readers-baseline.json` carries content-addressed `sha256` rows for
every `src/` file, including all twelve I touch. Measured against the last 25 commits:

```
96036427f  src_files=1  osr_baseline_touched=0   CURE-F
19c4cb853  src_files=1  osr_baseline_touched=0   EM-B1k
32602dc60  src_files=1  osr_baseline_touched=0   CURE-D
95e494bdb  src_files=5  osr_baseline_touched=0   EM-B1d
```

Four landed commits edited `src/` without re-minting. The reader census rows for my two
traditions files are `identity / primaryDeity / primaryDeitySnapshot / previousGovernments`
— `tier` and `population` are schema fields, not observed shapes — and my edits add no
observed-shape read. `tests/lint` WHOLE is in the gated batch and will say so either way.

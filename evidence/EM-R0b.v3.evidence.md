# EM-R0b VERSION 3 — EVIDENCE (Opus COMPILE lane, session a9df403c, 2026-09-20 ~02:3x–03:1x EDT)

**Tree read and imported:** `$SP/read-tip-32602dc60`, detached at the build branch's tip. Confirmed
at the start and the end of the lane:

```
$ git -C $SP/read-tip-32602dc60 rev-parse HEAD
32602dc607b7423838249cf57d73baf08feb047d
$ git -C $SP/read-tip-32602dc60 status --short
(empty)
$ date
Sun Sep 20 02:30:12 EDT 2026
```

Nothing edited, staged or committed anywhere; every script and output lives under
`$SP/lane-em-compile-EM-R0b-scratch/`. No vitest, no eslint CLI, no tsc, no build, no npm script;
one `node` process at a time. `eslint`'s `Linter` is used IN PROCESS for `max-lines` only.

⚠ **THE HARNESS WAS RE-POINTED.** Version 2's `tools/instrument.mjs`, `tools/r0b-placement.mjs` and
`tools/r0b-manifest-equality.mjs` all named `read-tip-e5bdfd031` — version 2's tip, not this one — so
**no version-2 figure is carried; every one below was re-executed at 32602dc60**, which is exactly
what the chair's instruction (d) asks. New scripts: `r0b-checkmeta.mjs` (the table), `r0b-v3probe.mjs`,
`r0b-v3.mjs`, `r0b-v3split.mjs`, `r0b-v3keys.mjs`. Version 2's deliverables are kept beside these as
`EM-R0b.v2.*`.

`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`

---

## V3-1 · (d) THE CONTROL, re-run at THIS tip over the FULL 525-row corpus

```
$ node --import ./hook3.mjs r0b-v3.mjs
=== R0b-v3 at 32602dc60 — corpus rows: 525; the stride: 63 ===
  generated 525 rows in 8 s

=== A. THE CONTROL — every EXACT check clean on plain records, at THIS tip ===
  rows=525  violating rows=1
    [in the 63-stride] town|germanic|mountain|mountain_pass|civilized|golden-master-v3
       V-SUMMARY-DEPS: summary says 6 operational dependencies but dependencies.length=5
  ⇒ the KNOWN pin is the ONLY violation
```

**CONFIRMED, unchanged from version 2 and now at this tip:** 1 violating row of 525, and it is the
dated KNOWN pin (FIX-G1's subject). The pin is IN the 63-row stride, so the module's own test
controls on 63 without losing it.

---

## V3-2 · ⭐ (a) `CHECK_META` — TOTALITY, AND EVERY KEY IN EM-R0a v2's REGISTER

```
=== C. CHECK_META — totality over the checks, and every key in EM-R0a v2's register ===
  declared checks=33  CHECK_META rows=33
  ⛔ checks with NO row (the totality red): none
  ⛔ rows naming no declared check       : none
  distinct top-level keys named: 14 (activeConditions conflicts defenseProfile economicState
     economicViability generationCoherenceReceipt history institutions isolationSupport npcs
     powerStructure relationships stress stressors)
  ⛔ keys absent from EM-R0a v2's register, or a path whose head its keys[] omits: none
  ⭐ CROSS-KEY checks (keys.length > 1): 8 — V-FLAGVEC V-EVIDENCE-ROSTER V-EVIDENCE-EVENTS
     V-EVIDENCE-TENSION V-EVIDENCE-STRESS V-EVIDENCE-CONFLICT V-DEFENSE-INST V-STRESS-IDENTITY
  the classes those keys carry: {"READING":9,"HELD":5}
  checks whose keys are ALL present on at least one corpus row: 33/33
```

The register is checked against `RECORD_CLASSES` transcribed verbatim from EM-R0a v2 (the same
transcription EM-R0c's compile used). **Three arms, all clean:**

1. **TOTALITY both ways** — every declared check id has a row and every row names a declared check.
   A check added without a row is the red the chair asked for.
2. **KEY MEMBERSHIP** — all 14 top-level keys `CHECK_META` names are keys EM-R0a v2 classes, and no
   `paths` entry heads at a key its own `keys[]` omits (the second arm is what stops a row drifting
   from its paths).
3. **REACHABILITY** — for all 33, every named key is present together on at least one corpus row, so
   no row names a key combination the corpus never carries.

### ⭐ V3-2b · THE CROSS-KEY COUNT IS 7, NOT 8, AND THE DIFFERENCE IS A CONTRACT

```
$ node --import ./hook3.mjs r0b-v3keys.mjs
  ⭐ CROSS_KEY_CHECKS (no arms, >1 key): 7 — V-EVIDENCE-ROSTER V-EVIDENCE-EVENTS V-EVIDENCE-TENSION
     V-EVIDENCE-STRESS V-EVIDENCE-CONFLICT V-DEFENSE-INST V-STRESS-IDENTITY
     V-FLAGVEC declares arms, so it is NOT cross-key:
     [{"id":"foodSecurity","keys":["economicState"]},{"id":"publicLegitimacy","keys":["powerStructure"]}]
```

⛔ A naive `keys.length > 1` reads **8** cross-key checks; version 2's §5.4 says **seven**, and
version 2 is right. `V-FLAGVEC` names two top-level keys and relates **neither to the other** — it is
two independent arms sharing one id. Escalating such a violation at BOTH keys would take
`powerStructure` from `R1` because the FOOD card disagreed, which is the opposite of the minimal
move design §22.2 item 3 requires.

**Hence v3's contract:** a row may carry `arms`, each naming the keys IT relates; **a violation
carries the keys of the arm that FIRED, never the union**; and `CROSS_KEY_CHECKS` is derived as
"no `arms` and more than one key". That derivation reproduces version 2's seven exactly — which is
the arm that keeps the two documents honest with each other.

### V3-2c · THE VIOLATION CARRIES ITS KEYS

```
=== (i) THE VIOLATION CARRIES ITS KEYS ===
  real violations over the 63-row stride: 1
    V-SUMMARY-DEPS  kind=prose-count  keys=["economicViability"]  [town|germanic|mountain|mountain_pass|…]
  ⛔ violations whose id has NO CHECK_META row: none
  the prototype instrument ships 24 EXACT ids; ids with no CHECK_META row: none
  (the remaining 9 of v3's 33 are the four BAND checks, V-FLAGVEC, V-STRESS-IDENTITY and v3's three
   duplication checks, which the prototype evaluates outside EXACT)
```

The corpus's ONE real violation emerges carrying `kind` and `keys`, and the escalation's step 1 for
it is `economicViability` — a single key, and the group `G3 viability-counts` closes it, exactly as
version 2's §5.4 says.

---

## V3-3 · ⭐ (b) THE TWO NEW MIXED OBJECTS — MEASURED, AND BOTH ANSWER **NO**

EM-R0c's 504-trial corpus found four MIXED objects outside a declared group. The chair closed two as
measured non-groups and sent these two here.

### V3-3a · the shapes, first, before any relation is proposed

```
$ node --import ./hook3.mjs r0b-v3probe.mjs
=== defenseProfile.scores — the shape, over the 63-row stride ===
  ×63 {"military":"number","monster":"number","internal":"number","economic":"number",
       "magical":"number","magicDependency":"boolean","traditions":"object","disaster":"number"}
  siblings of scores inside defenseProfile: ["scores","readiness","institutions","magicDependency",
       "traditions","chainModifiers","economicGates"]

=== history.founding — the shape ===
  ×54 {"age":"number","reason":"string","foundedBy":"string","initialChallenge":"string",
       "overcoming":"string","stressNote":"string"}
  ×9  … "stressNote":"object"
  siblings of founding inside history: ["age","founding","historicalEvents","currentTensions",
       "historicalCharacter","eventsTimeline","legacyAnnotations","siegeNarrative"]
```

### V3-3b · `defenseProfile.scores` — NO invariant ties its own leaves

```
=== B1. defenseProfile.scores — is any invariant tying its leaves? ===
  rows carrying defenseProfile.scores: 525/525
  readiness.score a FUNCTION of the six scores? distinct tuples=86, tuples with >1 readiness score=0
      ⇒ not refuted by the corpus
  disaster a FUNCTION of the other five? distinct tuples=82, ambiguous=4 ⇒ NO
  identity "disaster = military + economic": holds 0/525
  identity "disaster = military + monster + internal + economic + magical": holds 0/525
  identity "readiness.score = military + monster + internal + economic + magical": holds 0/525
  identity "readiness.score = sum of all six": holds 0/525
```

**MEASURED NO.** `disaster` is REFUTED as a function of the other five (4 ambiguous tuples: the same
five scores yield different disaster values), and every candidate arithmetic identity holds on **0 of
525** rows. `readiness.score` being functional in the six is *not refuted*, but on only 86 distinct
tuples that is weak evidence and **no exact relation was found**, so nothing may convict.
⇒ **EM-R0c's MIXED reading of `defenseProfile.scores` — `.military` and `.magical` taken from `R1`
beside a settled `.disaster` — is LAWFUL. No group is owed.**

### V3-3c · `history.founding` — NO invariant ties its own leaves

```
=== B2. history.founding — is any invariant tying its leaves? ===
  rows carrying history.founding: 525/525
  overcoming a FUNCTION of initialChallenge? distinct challenges=9, ambiguous=4 ⇒ NO
  overcoming a FUNCTION of reason?           distinct reasons=17, ambiguous=9 ⇒ NO
  stressNote a FUNCTION of stress.label?     distinct labels=2, ambiguous=0 ⇒ not refuted
  distinct values: reason=17 overcoming=5 initialChallenge=9
```

**MEASURED NO.** `overcoming` is REFUTED as a function of `initialChallenge` (4 of 9 ambiguous) and
of `reason` (9 of 17 ambiguous): 17 reasons and 5 overcomings are drawn independently.
⇒ **EM-R0c's MIXED reading of `history.founding` — `.reason` taken beside a settled `.overcoming` —
is LAWFUL. No group is owed.**

### V3-3d · ⭐⭐ BUT THE MEASUREMENT FOUND A THIRD SHAPE: ONE FACT AT TWO PATHS

```
  ⭐ scores.magicDependency === defenseProfile.magicDependency : same=525 diff=0 absent=0
  ⭐ scores.traditions      ≡ defenseProfile.traditions        : same=525 diff=0 absent=0
  ⭐ founding.age           === history.age                    : same=525 diff=0 absent=0
```

Three leaves hold ONE fact at TWO record paths, on **525 of 525** rows. Neither copy of any pair
sits inside the MIXED object EM-R0c measured, so no check and no group reaches them today.

**The decisive question is whether the merge can put the two copies out of step.** It can:

```
$ node --import ./hook3.mjs r0b-v3split.mjs
defenseProfile.scores.magicDependency ≡ defenseProfile.magicDependency
  rows=63  merged record AGREES=0  ⛔ SPLIT=63
     scores.magicDependency=true vs magicDependency=false  [thorp|germanic|plains|road|…]
defenseProfile.scores.traditions ≡ defenseProfile.traditions
  rows=63  merged record AGREES=0  ⛔ SPLIT=63
     scores.traditions={"hasArcane":true,…} vs traditions={"hasArcane":false,…}
history.founding.age ≡ history.age
  rows=63  merged record AGREES=0  ⛔ SPLIT=63
     founding.age=182 vs history.age=157

=== the control — with R0 ≡ R1 (no edit) the merge splits nothing ===
  rows=63  splits under the identity merge=0
```

The construction is the merge's own seam: one path DIFFERS between `R0` and `R1` (so it takes `R1`'s)
while the other is IDENTICAL in both (so it keeps the record's). **63/63 split, with a control that
splits nothing.**

⛔ **THE FIRST DRAFT OF THIS ARM WAS VACUOUS AND IS RECORDED AS SUCH.** It mutated `R0` at BOTH
paths, so the moving path took `R1`'s value — which was the record's own — and the kept path kept the
record's: both landed on the record, the arm printed `SPLIT=0`, and it proved nothing. The falsifier
must MOVE one path and KEEP the other. The corrected construction is quoted above and the packet's
§9 names it, so the vacuity cannot be rebuilt.

### V3-3e · the three checks, each with its control and its isolating mutant

```
=== (ii) AN ISOLATING MUTANT FOR EACH PROPOSED DUPLICATION CHECK ===
  V-DEFENSE-MAGICDEP
     control (clean on plain records): 63/63
     the mutant CONVICTS             : 63/63
     the mutant trips any OTHER check: 0/63 (isolating)
     its CHECK_META row would be: {"kind":"referential","paths":["defenseProfile.scores.magicDependency",
       "defenseProfile.magicDependency"],"keys":["defenseProfile"]}  ⇒ single-key
  V-DEFENSE-TRADITIONS   control 63/63 · convicts 63/63 · isolating 0/63 · keys ["defenseProfile"]
  V-HISTORY-AGE          control 63/63 · convicts 63/63 · isolating 0/63 · keys ["history"]
```

All three meet the packet's own law (§11 STOP-6: no check ships without a planted mutant that
isolates it), and all three are **SINGLE-KEY** — both copies live under one top-level key.

### V3-3f · ⛔ WHY A GROUP CANNOT CLOSE TWO OF THE THREE

EM-R0a v2's group walker asserts *"no root nested inside another's"* (its arm A6, GROUP LIVENESS AND
NON-NESTING), and EM-R0a v2 already declares `G7 defense-readiness` rooted at
`defenseProfile.readiness`.

- A group rooted at **`defenseProfile`** — the smallest root containing both defence copies — would
  **NEST `defense-readiness` inside it** and red EM-R0a's own walker. **No legal group exists.**
- A group rooted at **`history`** with members `['founding.age', 'age']` would be legal: EM-R0a v2
  declares no group under `history`.

⇒ The uniform instrument available for all three is a CHECK in this module plus the runtime guard's
escalation, which is exactly the division of labour §22.2 item 3 draws. The `history` group is
nonetheless a real option and is the packet's question 1 for the chair.

---

## V3-4 · (d) EVERY OTHER VERSION-2 HEADLINE FIGURE, RE-VERIFIED AT 32602dc60

Each printed by the same command that measured it (`r0b-v3.mjs`, section D), beside version 2's claim:

```
  D1 stress ≡ stressors                        : 525/525   (v2 claimed 525/525)   ✓
  D2 readiness.label === readinessBandOf(score): 525/525   (v2 claimed 525/525)   ✓
  D3 lines naming "readiness" in rulingStructure.js: 0      (v2 claimed ZERO)      ✓
  D4 published deficitPct in (15,20]: 36 rows — isPressured=12 isDeficit=24 neither=0
                                                (v2 claimed 36 / 12 / 24)          ✓
  D5 the label -> flags-EVER-true table, taught on all 525 rows:
       Secure                       isSecure(117)
       Import-Dependent             isDeficit(196) + isPressured(12)
       Deficit — Active Famine      isDeficit(36)
       Pressured                    isPressured(151)
       Deficit                      isDeficit(13)
  D6 food labels at 525: 5 — Secure · Import-Dependent · Deficit — Active Famine · Pressured · Deficit
     food labels in the 63-stride: 5; labels the stride LOSES: none   (v2 claimed none)  ✓
  D7 judgments[].evidence[path=simulationTrace]: 525 entries, 525 with evidence === undefined
                                                (v2 claimed 525/525 undefined)     ✓
```

**Every version-2 figure holds at this tip, to the row.** D5 reproduces version 2's table exactly,
including the `Import-Dependent → isDeficit(196) + isPressured(12)` second vector that is the whole
reason the flag table is DECLARED rather than derived — and D4 is its cause, unchanged: the label
ladder cuts at 15 and the flag ladder at 20, so 36 rows sit in the window and 12 of them publish
`isPressured` beside `Import-Dependent`.

⇒ **(c) IS DISCHARGED BY MEASUREMENT, NOT BY ASSERTION:** the food-security band check's rounding
tolerance and the declared flag table stay EXACTLY as version 2 ruled them, because the facts that
forced those rulings are unchanged at this tip.

---

## V3-5 · THE BUDGET

```
=== (iii) THE BUDGET of the CHECK_META leaf ===
  the drafted CHECK_META leaf: 64 effective lines (eslint max-lines {skipBlankLines, skipComments});
  raw 94; 7552 B
  parse: clean
  it declares 33 rows, imports NOTHING, and takes no branch outside one arrow helper.
```

| leaf | v2 | v3 | cap |
|---|---:|---:|---:|
| `src/domain/edit/recordInvariants.js` | `≤ 215` | `≤ 230` (+3 checks, ~12 effective) | 250 |
| `src/domain/edit/recordInvariantFlags.js` | `≤ 40` | `≤ 40` (unchanged) | 250 |
| `src/domain/edit/recordInvariantMeta.js` ⭐ NEW | — | `≤ 70` (measured 64) | 250 |
| **total effective production lines** | `≤ 300` | **`≤ 340`** | 400 |
| new logic-bearing leaves | 1 | **1** — both data leaves are frozen tables that take no branch | 2 |
| handwritten files | 3 | **4** | 12 |
| acceptance cases | 8 | **8** | 8 |

`CHECK_META` is DATA and goes in its own frozen leaf; `recordInvariants.js` re-exports it
(`export { CHECK_META } from './recordInvariantMeta.js';`) so **EM-R0c's compiled import
— `import { recordInvariants, CHECK_META } from './recordInvariants.js'` — is satisfied verbatim**
and EM-R0c needs no re-cut.

---

## V3-6 · WHAT DID NOT MOVE, AND WHY

- **Placement and bytes.** v3 adds one frozen data leaf beside two that are already outside both
  budgeted graphs, and nothing in `src/` imports `src/domain/edit/**` until EM-B2a. EM-R0c's compile
  measured the same tip: `EAGER_FIRST_PAINT_MODULES` 268 modules and the generation worker's closure
  220 modules, **0 `src/domain/edit/**` files in either**, and 0 importers. Worker delta `0 B`,
  first-paint delta `0`.
- **The domain→generators ratchet.** Unchanged at 4 files / 5 edges, live set 4 (EM-R0c's E-7,
  measured at this tip). The three new leaves import nothing from `src/generators/**`.
- **Mutation-coverage.** `tests/domain/` is not an `ENFORCER_DIR` and `recordInvariants.test.js`
  matches no `NAME_PATTERN` token — unchanged, no row.
- **Line-addressed and stamped registers.** v3 MODIFIES no `src/` file, so prose-numerics,
  `wiring-census.json` `stamp.files` and `path:line` citations are all vacuously nil — the same
  structural reason version 2 recorded.
- **The lighting census delta is unchanged at `files +1 · credited +1 · suiteTitles +1 · titles +8`**:
  v3 adds no test FILE and keeps 8 acceptance arms (A2 is re-cut, not added — see the packet's §9).

---

## V3-7 · REQUIRED SYMBOLS, each re-proved at 32602dc60

```
$ cd $SP/read-tip-32602dc60 && for each pair: grep -cF "<symbol>" "<path>"
src/domain/activeConditions.js                export function severityBand                -> 2  ⚠
tests/helpers/goldenMasterCorpus.js           export function goldenCorpus                -> 1
tests/helpers/goldenMasterCorpus.js           export const keyOf                          -> 1
src/generators/generateSettlementPipeline.js  export function generateSettlementPipeline  -> 1
tests/build/domainGeneratorsBoundary.test.js  const BASELINE_EDGES                        -> 1
src/data/bandLadders.js                       export function legitimacyBandOf            -> (file absent)  [EM-R0d]
src/domain/edit/recordRegister.js             export const RECORD_CLASSES                 -> (file absent)  [EM-R0a]
```

⚠ **THE `severityBand` COUNT OF 2 IS A SUBSTRING ARTEFACT, AND IT IS WORTH NAMING.**

```
$ grep -nF "export function severityBand" src/domain/activeConditions.js
541:export function severityBand(severity) {
1009:export function severityBands() {
```

There is ONE `severityBand`, at `:541`, and a **separate plural sibling `severityBands()` at
`:1009`** that `grep -cF` matches as a prefix. The row is satisfied (the sealed dispatch asserts
presence, and the text is present), but a reviewer reading "2" would reasonably conclude the symbol
is declared twice. The count is recorded here with its cause. ⛔ The plural export is a second,
unnamed member of the severity vocabulary — §12's noticed row 7.

**POST-EDIT SIMULATION (pre-proof step 10).** Version 3's edits are three CREATEs under
`src/domain/edit/` and one CREATE under `tests/domain/`. It touches **no file any `requiredSymbols`
row names**, so every row's text is present verbatim after its own edits, `retiredSymbols` is `[]`,
and no other LANDED packet's row for any (path, symbol) pair is disturbed.

**SET-EQUALITY of §7 and the JSON `changeManifest`:**

```
§7 table rows : CREATE src/domain/edit/recordInvariantFlags.js
                CREATE src/domain/edit/recordInvariantMeta.js
                CREATE src/domain/edit/recordInvariants.js
                TEST   tests/domain/recordInvariants.test.js
JSON rows     : (identical)
SET-EQUAL     : True
actions all in PACKET_ACTIONS: True
acceptanceCases: 8 objects, keys = ['case', 'id']
checks arrays  : 5 | generator among them: False
retiredSymbols : []
```

---

## V3-8 · FINAL TREE CHECK

```
$ git -C $SP/read-tip-32602dc60 rev-parse HEAD
32602dc607b7423838249cf57d73baf08feb047d
$ git -C $SP/read-tip-32602dc60 status --short
(empty)
```

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

---
---

# ⭐ PRE-PROOF EVIDENCE — Opus PRE-PROOF lane, session a9df403c, 2026-09-20 07:0x EDT, at `141a1d775`

⛔ **NOTHING ABOVE THIS LINE WAS REWRITTEN.** Sections V3-1…V3-8 are the version-3 COMPILE lane's,
measured at `32602dc60`, and stand as written. Everything below is a NEW numbered section measuring
the SAME facts at the pre-proof's tip, per the pre-proof brief's step 1.

**Tree read:** `$SP/read-tip-141a1d775`, detached, shared read-only with two sibling pre-proof lanes
and never written by any of them.

```
$ date
Sun Sep 20 07:01:41 EDT 2026
$ git -C $SP/read-tip-141a1d775 rev-parse HEAD
141a1d7752e8d9199c0bf347ea99808121733b0b
$ git -C $SP/read-tip-141a1d775 status --short
(empty)
```

Nothing edited, staged or committed anywhere. Every script and output lives under
`$SP/lane-preproof-EM-R0b-scratch/`. No vitest, no eslint CLI, no tsc, no build, no npm script —
plain `node` probes only. ⛔ The lane's own harness takes `TREE` from an explicit environment
variable **with no default** (`throw new Error('TREE is required and has no default')`), which is the
kit's own cure for the dead-tree hazard version 2's harness hit.

---

## P-1 · ⭐ THE J-T1 WINDOW — `32602dc60` → `141a1d775`, over every declared path

```
$ git -C $T diff --stat 32602dc60 141a1d775 -- \
    src/domain/edit/recordInvariants.js src/domain/edit/recordInvariantMeta.js \
    src/domain/edit/recordInvariantFlags.js tests/domain/recordInvariants.test.js \
    src/domain/activeConditions.js tests/helpers/goldenMasterCorpus.js \
    src/generators/generateSettlementPipeline.js tests/build/domainGeneratorsBoundary.test.js \
    src/data/bandLadders.js src/domain/edit/recordRegister.js
(exit 0 — NO OUTPUT)

$ git -C $T rev-list --count 32602dc60..141a1d775
24
```

⭐ **THE WINDOW IS EMPTY OVER EVERY PATH THIS PACKET NAMES** — all four change-manifest rows, all
five live `requiredSymbols` paths, and both `_pending` paths. Twenty-four commits moved 31 files and
not one of them is this packet's.

What DID move in `src/` (the whole window, for the record):

```
src/domain/worldPulse/factionDensityKernel.js          | 22 +-
src/domain/worldPulse/pulseKernel.js                   |  4 +-
src/domain/worldPulse/roadsKernel.js                   |  9 +
src/domain/worldPulse/settlementLifecycleFirstClass.js | 16 +
src/domain/worldPulse/successorNpc.js                  | 19 +
```

Five files, all `src/domain/worldPulse/**` — the simulation tick. P-3 proves none is an input to the
generated corpus.

---

## P-2 · REQUIRED SYMBOLS, each re-found BY SYMBOL at `141a1d775`

```
$ cd $T && grep -cF "<symbol>" "<path>"
src/domain/activeConditions.js                 export function severityBand                 -> 2  ⚠
tests/helpers/goldenMasterCorpus.js            export function goldenCorpus                 -> 1
tests/helpers/goldenMasterCorpus.js            export const keyOf                           -> 1
src/generators/generateSettlementPipeline.js   export function generateSettlementPipeline   -> 1
tests/build/domainGeneratorsBoundary.test.js   const BASELINE_EDGES                         -> 1
src/data/bandLadders.js                        export function legitimacyBandOf             -> FILE ABSENT
src/data/bandLadders.js                        export function readinessBandOf              -> FILE ABSENT
src/data/bandLadders.js                        export function foodSecurityBandOf           -> FILE ABSENT
src/data/bandLadders.js                        export const FOOD_SECURITY_CUTS              -> FILE ABSENT
src/domain/edit/recordRegister.js              export const RECORD_CLASSES                  -> FILE ABSENT
```

All five LIVE rows resolve. The five `_pending` rows are still absent — **CONDITIONAL**, exactly as
the family's order (`R0a · R0d · R0b`) requires; they are not `requiredSymbols` rows yet.

⚠ **The `severityBand` count of 2 is a SUBSTRING ARTEFACT, re-confirmed at this tip:**

```
$ grep -nF "export function severityBand" src/domain/activeConditions.js
541:export function severityBand(severity) {
1009:export function severityBands() {
```

ONE `severityBand` at `:541`; the plural sibling `severityBands()` at `:1009` is a different export
the `-F` prefix match catches. Unchanged from V3-7.

**CREATE targets — all four ABSENT and Git-clean:**

```
absent  ✓ src/domain/edit/recordInvariants.js
absent  ✓ src/domain/edit/recordInvariantMeta.js
absent  ✓ src/domain/edit/recordInvariantFlags.js
absent  ✓ tests/domain/recordInvariants.test.js
$ ls -la src/domain/edit/
ls: src/domain/edit/: No such file or directory
```

The directory itself does not exist. ⇒ EM-R0a, EM-R0b, EM-R0c and EM-A2a all still have every
CREATE target free, and the per-FILE collision reading in §5.4 holds.

---

## P-3 · ⭐ WHY EVERY 525-ROW FIGURE CARRIES — the generator's closure, walked

The five files that moved are all `worldPulse`. The decisive question is whether any of them is an
input to a generated record. Walked with the lane's own resolver (relative specifiers only, all five
import/export/require forms, `.js`/`.jsx`/`.mjs`/`index` resolution):

```
$ PROBES="worldPulse,activeConditions,computeActiveChains,factionDensityKernel,pulseKernel,\
roadsKernel,settlementLifecycleFirstClass,successorNpc" node closure.mjs \
    src/generators/generateSettlementPipeline.js

entries: src/generators/generateSettlementPipeline.js
closure size: 224
unresolved relative specifiers: 4     (all four are doc-comment text, none worldPulse)
PROBE "worldPulse":                    0 []
PROBE "activeConditions":              1 ["src/domain/activeConditions.js"]        <- CONTROL, present
PROBE "computeActiveChains":           1 ["src/generators/computeActiveChains.js"] <- CONTROL, present
PROBE "factionDensityKernel":          0 []
PROBE "pulseKernel":                   0 []
PROBE "roadsKernel":                   0 []
PROBE "settlementLifecycleFirstClass": 0 []
PROBE "successorNpc":                  0 []

$ node closure.mjs tests/helpers/goldenMasterCorpus.js
closure size: 3
PROBE "worldPulse": 0 []
```

⭐ **ZERO of the five moved files is reachable from the generator**, and the corpus helper's own
closure is three modules with no overlap. The two controls prove the walker actually resolves (it
finds both a `src/domain` and a `src/generators` member). ⇒ Every corpus figure measured at
`32602dc60` carries to `141a1d775` **by construction**. P-4 re-executes them anyway.

---

## P-4 · ⭐⭐ EVERY VERSION-3 HEADLINE FIGURE, RE-EXECUTED AT `141a1d775`

```
$ TREE=$T TREE_SHA=141a1d775 node r0b-preproof.mjs

=== EM-R0b PRE-PROOF at 141a1d775 — corpus rows: 525 ===
  generated 525 rows in 11 s

=== V3-3d · ONE FACT AT TWO PATHS (the three NEW checks) ===
  V-DEFENSE-MAGICDEP     defenseProfile.scores.magicDependency ≡ defenseProfile.magicDependency
      same=525 diff=0 absent=0
  V-DEFENSE-TRADITIONS   defenseProfile.scores.traditions ≡ defenseProfile.traditions
      same=525 diff=0 absent=0
  V-HISTORY-AGE          history.founding.age ≡ history.age
      same=525 diff=0 absent=0

=== V3-4 D1 · stress ≡ stressors : same=525 diff=0 absent=0 ===

=== V3-4 D3 · lines naming "readiness" in rulingStructure.js: 0 ===

=== V3-4 D4 · published deficitPct in (15,20]: 36 rows — isPressured=12 isDeficit=24 neither=0 ===

=== V3-4 D5 · label → flags EVER true (525 rows) ===
  Secure                     isSecure(117)
  Import-Dependent           isDeficit(196) + isPressured(12)
  Deficit — Active Famine    isDeficit(36)
  Pressured                  isPressured(151)
  Deficit                    isDeficit(13)
  distinct food labels at 525: 5

=== V3-4 D7 · evidence[path=simulationTrace]: 525 entries, 525 with evidence === undefined ===

=== THE CONTROL · V-SUMMARY-DEPS ===
  rows=525  violating rows=1
    town|germanic|mountain|mountain_pass|civilized|golden-master-v3  (summary says 6, dependencies.length=5)
```

| figure | v3 at `32602dc60` | pre-proof at `141a1d775` | verdict |
|---|---|---|---|
| THE CONTROL | 1 violating row of 525, and it is the pin | 1 of 525, and it is the pin | ✓ **CONFIRMED** |
| V3-3d `magicDependency` | 525/525 | same=525 diff=0 | ✓ **CONFIRMED** |
| V3-3d `traditions` | 525/525 | same=525 diff=0 | ✓ **CONFIRMED** |
| V3-3d `founding.age` | 525/525 | same=525 diff=0 | ✓ **CONFIRMED** |
| D1 `stress ≡ stressors` | 525/525 | same=525 diff=0 | ✓ **CONFIRMED** |
| D3 `readiness` in `rulingStructure.js` | 0 | 0 | ✓ **CONFIRMED** |
| D4 the `(15,20]` window | 36 / 12 / 24 | 36 / 12 / 24, neither=0 | ✓ **CONFIRMED** |
| D5 the label→flags table | 5 labels, `Import-Dependent → isDeficit(196)+isPressured(12)` | reproduced to the row | ✓ **CONFIRMED** |
| D6 labels at 525 | 5 | 5 | ✓ **CONFIRMED** |
| D7 `simulationTrace` | 525 entries, 525 undefined | 525 / 525 | ✓ **CONFIRMED** |

⇒ **NO PREMISE IS REFUTED AND NO FIGURE MOVED.** §6's rounding tolerance and the DECLARED flag table
stand for the same reason version 3 gave: the facts that forced them re-measure identically.

### P-4b · `V-BAND-READINESS` — the label envelope, and what its green does NOT prove

```
=== V3-4 D2 · defenseProfile.readiness — the observed label→score envelope ===
  Fortress                 [76..81]  n=93
  Well-Defended            [55..75]  n=127
  Defensible               [45..54]  n=53
  Lightly Defended         [24..33]  n=36
  Vulnerable               [12..20]  n=204
  Undefended               [11..11]  n=12
  ⇒ overlapping label ranges (an EXACT ladder needs 0): 0
```

The six ranges are disjoint and monotone — consistent with §5.1's declared cuts 76/55/38/24/12,
CLOSED below. But:

```
$ TREE=$T node gap.mjs
distinct readiness scores at 525: 41
range: 11 .. 81
  cut 76 : scores within +-3 = [73,74,75,76,77,78]  |  a row AT the cut or one below it? true
  cut 55 : scores within +-3 = [52,53,54,55,56]     |  a row AT the cut or one below it? true
  cut 38 : scores within +-3 = []                   |  a row AT the cut or one below it? false   ⛔
  cut 24 : scores within +-3 = [24]                 |  a row AT the cut or one below it? true    ⚠
  cut 12 : scores within +-3 = [11,12,13,14]        |  a row AT the cut or one below it? true
unwitnessed score gaps: 15..15 , 21..23 , 25..27 , 29..32 , 34..44 , 48..48 , 57..58 ,
                        60..61 , 68..69 , 79..79
```

⛔ **THE `38` CUT IS SWALLOWED BY AN ELEVEN-WIDE HOLE AT 34..44.** No corpus row exercises it, so
A1's green cannot distinguish a cut at 38 from any cut in `(33, 45]`. The `24` cut is witnessed only
from ABOVE — one score at 24, nothing at 21–23 beneath it. The check still holds 525/525 and is still
EXACT; this bounds what its green PROVES, not whether it passes. → §9 CANNOT-CATCH 7, §12 noticed 7,
and **EM-R0d's pre-proof**, which owns the ladders.

---

## P-5 · THE BUDGETS AND THE REGISTERS, re-measured at the tip

### The first-paint closure — measured BY IMPORTING THE SET (amended §P2 row 11 demands exactly this)

```
$ node --input-type=module -e 'const m = await import("./vite.config.js"); ...'
vite.config.js exports: EAGER_FIRST_PAINT_MODULES, ENGINE_SHARED_DOMAIN_EXCISIONS, default
EAGER_FIRST_PAINT_MODULES typeof: [object Set]
size: 268
members matching src/domain/edit:        0 []
members matching src/data/bandLadders:   0
CONTROL members matching factionLifecycle: 1 ["…/src/domain/density/factionLifecycle.js"]
```

⭐ 268 modules, **0 `src/domain/edit/**`**. The CONTROL is the amendment's own named member and it is
present, so the set really was imported and walked rather than read off a list. **First-paint delta 0.**

### Nothing in `src/` imports the directory at all

```
$ git grep -n "domain/edit" -- src tests scripts vite.config.js
tests/lib/editTravel.test.js:15:              * `src/domain/edit/**`. THE VEIL PRECEDES THE WRITER: …
tests/store/decreeRegistryPersistence.test.js:17:  * `src/domain/edit/**` (which does not exist at this commit — …
```

TWO hits, both PROSE inside a header comment, **zero imports**. ⇒ the three leaves are in no bundle's
closure by construction, and **worker delta `0 B`** needs no dist read. (Those two prose lines become
false when the first EM packet CREATEs there — §12 noticed 8.)

### The layering ratchet

```
$ grep -n "BASELINE_EDGES" -A 6 tests/build/domainGeneratorsBoundary.test.js
60:const BASELINE_EDGES = Object.freeze({
61:  'src/domain/coherence/checkDraftEdit.js':          ['../../generators/structuralValidator.js'],
62:  'src/domain/relationships/neighbourBackLink.js':   ['../../generators/crossSettlementConflicts.js'],
63:  'src/domain/worldPulse/institutionLifecycle.js':   ['../../generators/computeActiveChains.js'],
64:  'src/domain/worldPulse/resourceDynamicsKernel.js': ['../../generators/computeActiveChains.js',
65:                                                      '../../generators/terrainHelpers.js'],
66: });
```

FOUR importing files / FIVE edges, unchanged. The three leaves import no `src/generators` module.

### Mutation-coverage — the enumeration rule EXECUTED, with controls

```
$ node --input-type=module -e 'import { ENFORCER_DIRS, NAME_PATTERN } from "./tests/lint/mutationCoverage.shared.mjs" …'
ENFORCER_DIRS = ["tests/lint","tests/design","tests/docs","tests/data","tests/copy",
                 "tests/security","tests/edgeFunctions","tests/generators"]
NAME_PATTERN  = /(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|
                  freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i
  tests/domain/recordInvariants.test.js      enforcer-dir=false  name-token=none  => enumerated=false
  src/domain/edit/recordInvariants.js        enforcer-dir=false  name-token=none  => enumerated=false
  src/domain/edit/recordInvariantMeta.js     enforcer-dir=false  name-token=none  => enumerated=false
  src/domain/edit/recordInvariantFlags.js    enforcer-dir=false  name-token=none  => enumerated=false
  CONTROL tests/store/participationWriteBase.contract.test.js -> token="contract"
  CONTROL tests/domain/institutionClassify.parity.test.js     -> token="parity"
```

**NO ROW OWED**, both halves measured, and two controls prove the predicate bites. ⚠ `scripts/mutation-coverage-manifest.json`
MOVED in the J-T1 window (+15 lines: EM-B1k2's and EM-B3c's rows) — **this packet does not name it**,
so the brief's "held by whichever non-terminal packet names it" warning does not reach here.

### Line-addressed and stamped registers — nil, and measured rather than asserted

```
$ node -e 'const c=require("./docs/content/wiring-census.json"); …'
stamp.files count: 7
matches for domain/edit or recordInvariant: []

$ git grep -nE "src/domain/edit/[A-Za-z]+\.js:[0-9]+" -- src docs/content tests
(no output)
```

`prose-numerics` (line-addressed), `wiring-census` `stamp.files` (byte-stamped) and `path:line`
citations are all **vacuously nil for the same structural reason**: this packet MODIFIES no `src/`
file. Re-verified, not carried.

### The literal sweep over `tests/` AND `src/`

```
$ git grep -n "recordInvariant|CHECK_META|CHECK_IDS|CROSS_KEY_CHECKS|FLAGS_EVER_TRUE|FLAG_FIELDS|
              KNOWN_VIOLATIONS|FLAG_CORPUS|recordRegister|RECORD_CLASSES" -- src tests scripts
(no output)

$ git grep -n "V-SUMMARY-DEPS|V-FLAGVEC|V-STRESS-IDENTITY|V-DEFENSE-MAGICDEP|V-HISTORY-AGE|
              V-BAND-FOODSEC" -- src tests scripts docs/content
(no output)
```

⭐ **The estate spells NONE of this packet's names today** — no exact pin to widen, no fixture to
re-spell, no named set gaining a member. The packet RETIRES nothing, so `retiredSymbols` `[]` is
correct and no other LANDED packet's `(path, symbol)` row is disturbed (post-edit simulation, brief
step 10).

⚠ ONE literal is NOT free: **`bandLadders`** hits 13 files, all for the pre-existing
`src/domain/compendium/bandLadders.js` (`buildBandLadders`), including three rows in
`scripts/.observed-shape-readers-baseline.json`. Different path, so no import is ambiguous — but
EM-R0d's `src/data/bandLadders.js` gives the estate two files of that basename. → §12 noticed 9.

---

## P-6 · ⭐⭐ THE LIGHTING DELTA IS `titles +7`, NOT `+8`

The census's own counting rule, read from the walker:

```
$ grep -n "measureCensus" -A 8 tests/lint/sovereigntyLightingContract.walker.test.js
601:function measureCensus() {
602:  const parked   = TEST_FILES.filter(({ src }) => parkReasonsFor(src).length > 0);
603:  const credited = TEST_FILES.filter(({ src }) => parkReasonsFor(src).length === 0);
604:  const titles      = credited.reduce((sum, { src }) => sum + liveTitlesIn(src).length, 0);
605:  const suiteTitles = credited.reduce((sum, { src }) => sum + liveSuiteTitlesIn(src).length, 0);

$ grep -n "liveTitlesIn\|liveSuiteTitlesIn\|parkReasonsFor" …walker.test.js
1664:const liveTitlesIn      = (src) => classify(src).titles;
1667:const liveSuiteTitlesIn = (src) => classify(src).suiteTitles;
1670:const parkReasonsFor    = (src) => classify(src).reasons;
```

`titles` sums `liveTitlesIn` over **CREDITED FILES ONLY**. A file that is not edited is not in the
delta at all.

**The packet's §9 homes eight acceptance cases, but only SEVEN in the new file:**

| case | test home | contributes a title? |
|---|---|---|
| A1 … A7 | `tests/domain/recordInvariants.test.js` (the CREATE) | ✓ ×7 |
| **A8** | `tests/build/domainGeneratorsBoundary.test.js` — **"run, not edited"** | ⛔ **0** |

⇒ **`files +1 · credited +1 · parked +0 · titles +7 · suiteTitles +1`.**

Version 3 priced `+8` by counting ACCEPTANCE CASES rather than `it` titles, and version 2 made the
same count before it — an inherited error, not a regression. This is precisely the class the brief's
step 14(b) names: *a title is worth something only where its file is CREDITED*, and A8's file is not
even edited.

⛔ **NO ABSOLUTE IS RESTATED.** The live tuple is frozen at `2653 · 383 · 2270 · 25052 · 6680`
(`tests/lint/.lighting-census-baseline.json`, `measuredAtSha 7c233db55`, the fourth refreeze) and is
**the chair's to stamp at promotion** from the live baseline, never this packet's to quote.

⚠ `credited +1` remains CONDITIONAL on §5.2's registration pin — straight-line literal `it`s under
ONE literal `describe`, and never binding `it`, `test` or `describe` as a variable or parameter. The
packet already carries that pin as a forbidden-alternative row.

---

## P-7 · ⛔⛔ "THE 63-ROW STRIDE" IS DEFINED NOWHERE

A1, A3, A6 and A7 all name it, and A1's "62 rows clean" IS its cardinality. It has no definition.

```
$ git grep -n "stride\|STRIDE" -- tests/helpers tests/property tests/domain
(only tests/domain/autoplacement.test.js, magicBufferModel, townCartography* — all about
 ANTI-stride sampling in cartography, none about the golden corpus)

$ ls tests/helpers/          → goldenMasterCorpus.js exports goldenCorpus and keyOf. Nothing else.
```

And it is not derivable arithmetically:

```
$ TREE=$T node stride.mjs
corpus rows: 525
PIN index: 510 | PIN present: true
rows per tier: thorp 84 · hamlet 84 · village 84 · town 105 · city 84 · metropolis 84
rows per seed: golden-master-v3 516 · gm-seed-a 3 · gm-seed-b 3 · gm-seed-c 3

=== candidate stride rules: which give exactly 63? ===
  (every k from 2..12, every offset 0..2 — NONE yields 63)
  every 8th from 0: 66 rows | carries PIN: false
  every 8th from 1: 66 rows | carries PIN: false
  every 8th from 2: 66 rows | carries PIN: false
```

⛔ **NO arithmetic stride over 525 yields 63**, and the obvious rule `i % 8 === 0` **MISSES the pin at
index 510** — which would leave A1 asserting a violation that never fires. The estate has a walker
for exactly that class (`tests/lint/contractTestAntiVacuity.walker.test.js`).

The `63` is EM-R0c's kit-prototype sample (its `504 = 8 edits × 63`) carried into a SHIPPING test's
contract without ever being defined in the tree.

**The measured menu — every rule that carries index 510 by construction:**

```
$ TREE=$T node stride2.mjs
  i % 2  === 0  -> 263 rows        i % 7  === 6  ->  75 rows
  i % 3  === 0  -> 175 rows        i % 8  === 6  ->  65 rows   <== nearest to 63
  i % 4  === 2  -> 131 rows        i % 9  === 6  ->  58 rows
  i % 5  === 0  -> 105 rows        i % 10 === 0  ->  53 rows
  i % 6  === 0  ->  88 rows        i % 11 === 4  ->  48 rows
                                   i % 12 === 6  ->  44 rows

=== EXECUTED control over "i % 8 === 6" (65 rows) ===
  clean=64  violating=1
    town|germanic|mountain|mountain_pass|civilized|golden-master-v3
```

⭐ **RECOMMENDED: `rows.filter((_, i) => i % 8 === 6)`** — 65 rows, carries the pin by construction,
EXECUTED to 64 clean + the pin. One line of source, reproducible from the tree alone. The only
alternative this lane would defend is the FULL 525 (executed, 11 s, 1 of 525) if the chair prefers no
sampling. → §12 question 1. Until ruled, A1's cardinality is a MARKED PLACEHOLDER; its SHAPE is
executed and holds both ways.

---

## P-8 · THE PREAMBLE, RE-STAMPED, AND §P2 ROW 11's SECOND AMENDMENT PRICED

```
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
16dfb96fa79320abc7dcfbdd8f5152b6aa66998c269287a951079df6c8223195  docs/implementation/preambles/EM-PREAMBLE.md
```

⭐ Matches the launch override exactly. The version-3 compile's
`b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1` is **SUPERSEDED** — the preamble
moved in the J-T1 window (1 line changed, §P2 row 11).

**What row 11 gained, and what it costs this packet:**

1. *"A `skipIf(!requireDistRead)` byte arm that SKIPPED is not a pass … a `check:packet` exit 0 does
   not promote it (ODQ §934.47 addendum 39)."* — This packet declares NO budget test among its
   `checks` (the worker and lazy-engine tests are §5.2 READ-ONLY rows), so no arm of that shape runs
   in its chain. But its §12 receipt promised "bundle/first-paint result (predicted: worker +0, eager
   +0)" without saying how. **The receipt row is re-cut** to state that `+0` is established
   STRUCTURALLY — the leaves are in neither closure (P-5) and nothing in `src/` imports them — and to
   forbid quoting a skipped arm as a pass. For the record, the worker's own arm is
   `REQUIRE_DIST = process.env.VERIFY_DIST === '1'` at `tests/build/generationWorkerLazy.test.js:115`,
   with `WORKER_BUNDLE_CEILING_BYTES = 1401208` at `:159`.
2. *"a pre-proof re-measures membership by importing the set, never by reading a list."* — Done, P-5:
   `EAGER_FIRST_PAINT_MODULES` imported, 268 members, 0 `src/domain/edit/**`, with the amendment's own
   named member as the live control.

⚠ `docs/implementation/PACKET_STANDARD.md` also moved in the window (+9/−1: the hot-file list gained
`institutionLifecycle.js`, `App.jsx` and `SettlementsPanel.jsx`, and `convergence.js` was re-measured
764). **None is a file this packet touches** — §3's "Delta in a shared/hot file: `n/a`" still holds.

---

## P-9 · THE STALE INTERNAL CITATIONS, AND THE RULING THAT CLOSED THEM

The packet cited **"§12 question 1"** three times (§1's third resolved contradiction, §2's non-goals,
§5.4's `V-HISTORY-AGE` row) plus CANNOT-CATCH 4 — but §12 was the *Completion receipt* and carried no
numbered questions at all. Worse, the question was already answered:

> **ODQ §934.47 addendum 38, ruling (1)** *(2026-09-20 02:47 EDT)* — *"BOTH — the `V-HISTORY-AGE`
> check DETECTS in this packet, and a `history` consistency GROUP PREVENTS the split: one row added
> at EM-R0a's pre-proof with this measurement cited … the two defence pairs have no group option
> because a root at `defenseProfile` would nest `G7 defense-readiness`, which EM-R0a's own walker
> forbids — detection only."*

All four sites are re-cut to the ruling, and §12 now carries a real, numbered question section — the
stride (P-7) — which §5.2 and §9 cite by number.

The other two rulings in the same grep both hold as written:

- **addendum 35 ruling (2)** — *"EM-R0b VERSION 3 … an exported `CHECK_META`"* — shipped.
- **addendum 38 rulings (2) and (3)** — *"30 → 33 STANDS"* and *"the exhaustive duplicated-leaf sweep
  is EM-R7's"* — both already reflected in §5.4 and §12 noticed 5.

⚠ One reconciliation, NOT a contradiction: design **§22.3 item 5** says *"**Six** of the module's
checks relate two top-level keys"*, and §5.4 says **seven**. The design sentence continues *"`stress`
and `stressors` … that identity joins the module as a check"* — i.e. six, **plus** `V-STRESS-IDENTITY`,
which is seven. The two documents agree; the design simply counts before the join. Recorded so no
successor reads it as drift.

---

## P-10 · THE SEALED DISPATCH, READ DRY — check by check

From `scripts/implementation-session.mjs` at this tip:

| check | source | verdict at `141a1d775` |
|---|---|---|
| branch exists | `symbolic-ref --quiet --short HEAD`; throws *"Git worktree has no branch or HEAD"* | ⚠ **the worktree must be ON the verified branch, not detached** — the build lane holds it; this read tip is detached and would refuse, correctly |
| branch matches | `snapshot.branch !== capsule.verifiedBranch` → *"dispatch branch mismatch"* | PASSES once the lane holds the integration branch |
| base is an ancestor | `git merge-base --is-ancestor <base> <head>` | PASSES for any base on the branch |
| **substrate unchanged** | see below | ⛔ **CONSTRAINS THE BASE STAMP** |
| CREATE targets absent + Git-clean | `pathExists ‖ status ‖ ls-files` → *"CREATE target must be absent and Git-clean"* | PASSES — all four absent, `src/domain/edit/` does not exist (P-2) |
| manifest validates | 4 change rows, actions in `PACKET_ACTIONS`, 8 `{id, case}` cases, no duplicate path | PASSES — re-parsed after this lane's edits |

```js
// scripts/implementation-session.mjs:185-196
const substrate = [...new Set([
  ...packet.changeManifest.filter((row) => row.action !== 'CREATE').map((row) => row.path),
  ...packet.requiredSymbols.map((row) => row.path),          // <-- EVERY requiredSymbols PATH
  ...(packet.retiredSymbols ?? []).map((row) => row.path),
])].sort();
if (!substrate.length) return;
const changed = gitBuffer(rootDir, [
  '--literal-pathspecs', 'diff', '--name-only', '-z', `${packet.verifiedBase}..${head}`, '--', ...substrate,
]) …
if (changed.length) {
  throw new Error(`verified-base descendant changed declared substrate: ${changed.join(', ')}`);
}
```

⭐⭐ **THE CONSEQUENCE, SPELLED OUT.** The substrate is the non-CREATE change rows **UNION every
`requiredSymbols` path**. This packet has ZERO non-CREATE change rows, so today its substrate is just
the five live symbol paths — all unmoved (P-1), so it would pass. **But at promotion the chair moves
the five `_pending` rows into `requiredSymbols`**, which adds `src/data/bandLadders.js` and
`src/domain/edit/recordRegister.js`. Those files are CREATED by EM-R0d and EM-R0a, which land BETWEEN
any earlier base and the dispatch. A base stamped before either landing makes
`git diff base..HEAD -- src/data/bandLadders.js` non-empty and **the dispatch throws**.

⇒ **The base must be stamped AT OR AFTER both EM-R0a's and EM-R0d's landings.** Note also
`if (head === packet.verifiedBase) return;` at `:184` — a base equal to the dispatch HEAD skips the
substrate diff entirely, which is the cleanest promotion. The manifest's `_verifiedBaseNote` already
said "at or AFTER"; this is its mechanical proof.

---

## P-11 · FINAL TREE CHECK

```
$ date
Sun Sep 20 07:1x EDT 2026
$ git -C $SP/read-tip-141a1d775 rev-parse HEAD
141a1d7752e8d9199c0bf347ea99808121733b0b
$ git -C $SP/read-tip-141a1d775 status --short
(empty)
```

Clean at both ends. Nothing was edited, staged or committed in any worktree, the kit or the ledger.

---

## P-12 · ⭐ THE PACKET NEVER RAN THE WALKERS THAT WILL READ ITS NEW TEST FILE

The chair's addendum of 2026-09-20 (after runs 17, 18 and 19 — *"ONE family: a lane's new or renamed
test file was read by a walker the lane never ran"*) requires a CREATE under `tests/<dir>` to run
that directory whole, and `tests/lint` whole always. Measured against what the packet actually runs:

```
$ node -e 'const p=require("./package.json"); …'
check:tail              = sh scripts/gate-tail.sh npm run check
check                   = … && npm run typecheck:ratchet && npm run typecheck:domain:strict
                          && npm run lint && npm run test:ratchet && npm run build && npm run verify:dist
test:ratchet            = sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs
lint                    = eslint src/ tests/ scripts/
test                    = sh scripts/gate-mutex.sh --run -- npx vitest run
```

⛔ **`npm run check` NEVER RUNS THE `tests/lint` VITEST SUITE.** It runs `test:ratchet` — a counting
script — and `lint`, which is eslint. The only script that runs vitest broadly is `test`, and neither
`check` nor `check:tail` calls it. The packet's §10 otherwise runs four focused vitest files, none in
`tests/lint`.

⇒ **§10 gains `tests/lint` whole**, as a VERIFICATION command and deliberately **not** a sealed
`checks` row: the lighting census arm is expected to red on its interior (the packet adds a credited
file; §7 already says "interior red; re-derived at the terminal by the chair"), and a guaranteed-red
suite inside the sealed chain would fail the packet's own gate. The lane quotes the census red with
its printed tuple and confirms every OTHER `tests/lint` arm green — which is the arm that proves no
other walker was surprised.

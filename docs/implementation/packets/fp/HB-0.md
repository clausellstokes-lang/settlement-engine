# HB / HB-0 — THE PURE SUBSTRATE (train `hb-1`, member M1)

**Preamble:** `docs/implementation/preambles/HB-PREAMBLE.md` at SHA-256
`2cf2407d93cef46ce647a88e235e2a9a84f68c310f9f4ccd7b01d14c9f9eb215`.

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `6784bf62de455ca13b701c09b6b241476cf9d555`
- **Landed:** `e188760b8fec296812b39b8c521781e43d266296`, exposed as the **PREFIX** of the
  `hb-1` train. Chain: promotion `436f138e` → this implementation commit → the terminal.
  ⚠ **THE TRAIN'S SECOND MEMBER IS NOT IN THIS LANDING.** HB-1 STOPPED at the terminal on a
  refuted premise and returns to compile; `OWNER_DECISION_QUEUE.md` §38 ratifies that stop
  and rules this prefix landable on its own proof. §14 carries the executed evidence and
  §15 the orphan window.
- **Ruled:** `OWNER_DECISION_QUEUE.md` §36 — CR-HB-Q2 (ACCEPT NARROWED: the twelve
  classes, `unpressed` as total fallback, the declared precedence; the occupancy-mix
  measurement re-aims to HB-2) and CR-HB-Q3 (ADOPT the rounding fence now; integer-domain
  decay recorded as a future widening) are both SIGNED. CR-HB-PRE signs the preamble.
- **Code of record:** `/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold`.
  `git status --porcelain` returned **0 lines** at the read. Every figure below was
  executed at this sha. ⛔ **No figure is inherited from the HB volume**, whose last full
  re-measurement was at `d48224e3`; **six of its premises did not survive** (R19–R24,
  preamble §P1) and a seventh is recorded here (R25, §3).
- **Capsule:** `docs/implementation/BASE_STATE.json`, `stampedAt` `152d3f19`. The
  docs-only-descendant clause is satisfied and EXECUTED: `git diff --name-status
  152d3f19 HEAD` returns **one commit, five paths, all under `docs/implementation/`**.
  This packet cites exactly two capsule rows — `lightingCensus`
  `2418/366/2052/20024/5643` and `flagManifestRows` 18 — and re-executes every row its own
  manifest touches.
- **Train:** `hb-1` member **M1 of 2**, and the train's **truncation boundary**.
- **Collision group:** shares `tests/lint/couplingInclusion.walker.test.js` with M2.
  Lawful under train sequencing; **M2 must re-read that file at I2**.
- **Flag:** **NONE.** Dark by construction (the WR-10 dark-instrument precedent).
- **Persisted shape:** **NONE.** ⛔ HB Q1's two owner-gated fields bind HB-3 onward
  (OQ §34, OQ-TC5-2) and are untouched here.
- **Commit authority:** the `hb-1` train's private ref only.

---

## 1. Scope and boundary

**This wave mints two pure leaves and lands three test files. It changes no behaviour,
because nothing calls it.**

> **Boundary sentence.** HB-0 mints the habit family's frozen vocabulary and its frozen
> curve as zero-caller pure functions, and lands the Bands/§8.2 reconciliation walker.
> **It does NOT** mint a flag, read `worldState`, touch a store, take a PRNG, write a
> ledger, classify a circumstance, join any chooser, author a soak band, mint a coupling
> row, or move a persisted shape.

**In scope:** `habitVocabulary.js`, `habitCurve.js`, their two batteries, the HB Bands
walker, and the two `ARGUED_UNLAYERED` registration rows the two new leaves owe.

**Out of scope and named so nobody re-finds it:** `circumstanceClassOf` — the classifier
the volume's §1.2(a) names — has **no chartered home in any HB wave** (§3, R25/O-1). It is
not built here and its absence is recorded, not silent.

## 2. The behaviour/identity contract

**IDENTITY: this wave is byte-identical to base for every generated world.** Two new
modules with **zero importers** cannot change an output.

⭐ **THE DORMANCY EVIDENCE IS STEP 1, NOT A NINTH ACCEPTANCE CASE.** `PACKET_STANDARD.md`
caps the acceptance matrix at eight and separately orders, at implementation step 1, that
the wave capture *"the named pre-wiring golden, dormancy, or baseline evidence"*. The
identity claim is exactly that evidence and is therefore recorded here rather than in §5:
**a source scan asserting the two new leaves have ZERO importers anywhere in `src/`**,
landed as a registered case inside `tests/domain/habitCurve.test.js` and re-run with the
focused battery. It is proved structurally, not asserted.

**THE ONE BEHAVIOUR CONTRACT THAT MATTERS, and it is a law rather than a value —
TILT-NEVER-LOCK, RESPELLED ON PAIRWISE ODDS RATIOS (J-HB-18):**

> For any two candidates `i`, `j` at any joined site,
> `(p'_i / p'_j) / (p_i / p_j) ∈ [ (1 − s) / (1 + s), (1 + s) / (1 − s) ]` where
> `s = HABIT_SPAN`, **and no option's probability may be driven to 0 or to 1.**

TRUE BY CONSTRUCTION because under `p'_i = p_i·f_i / Z` the common divisor `Z` cancels out
of a ratio of ratios, leaving exactly `f_i / f_j`.

⛔ **THE DELETED PIN IS A BUILD STOP.** *"`p'_i / p_i` strictly inside `(1 − s, 1 + s)`"*
is **FALSE**: the quantity is `f_i / mean_f`, whose true range is
`[(1−s)/(1+s), (1+s)/(1−s)] = [0.4815, 2.0769]` at `s = 0.35`. **An executor who finds that
spelling in any brief STOPS.** The volume's own hand-walk at the real `STRATEGY_K = 3.5`
reaches `1.5457`, `2.0061` and `1.6933` — three reachable states past the deleted pin's
`1.35` cap. **The FACTOR pin survives** as a plain unit test on `habitFactor`
(`f ∈ (1−s, 1+s)`) — case **A3**.

## 3. Wave-specific hazards and refutations

**R25 (NEW, Lane TC6) — "HB-0 records the class-occupancy mix and measures all five hold
rungs and all four severity rungs REACHABLE on real generated corpora." STRUCTURALLY
UNDISCHARGEABLE AT THIS WAVE.** HB-0's own charter says **PURE: no world, no store, no
PRNG**. A class-occupancy mix requires a **classifier** reading `worldState`; a hold-rung
mix requires a **stock**, which nothing writes until HB-2's `writeHabits`; a severity-rung
mix requires a **graded close**, which nothing produces until HB-3. **None of the three
instruments exists at HB-0, and no honest corpus measurement can be taken here.**

**THE DISPOSITION (CR-HB-Q2, signed), and it keeps both halves of the obligation alive:**

1. **What HB-0 CAN and DOES discharge — analytic reachability over the curve's own
   domain.** Case **A2**'s reachability half asserts the observed pairwise odds-ratio range
   **FILLS** the analytic interval over a ≥1000-case sweep. *A bound nothing ever
   approaches is a bound nobody has tested*, and that is exactly the assertion the volume
   asks for — over the domain HB-0 actually owns.
2. **What re-aims, with its new address written down.** The **corpus** measurements
   (class-occupancy mix, hold-rung mix, severity-rung mix) re-aim to **the first wave that
   owns both a classifier and a writer — HB-2 at the earliest, HB-3 for the severity mix**,
   and each is recorded in the receiving wave's module header as HB-0's inherited debt.
   ⚠ **This is a deferral, deliberately recorded, not a bug to re-find.** Q2's `~70%`
   `unpressed` reopen-trigger travels with it, verbatim. **The trigger survives; only its
   address moves.**

**H-A — THE SEVERITY-RUNG SPELLING TRAP, and it is this wave's sharpest live hazard.**
`tests/lint/spBandFamilies.walker.test.js` asserts
`expect(filesSpelling(SEVERITY_LADDER)).toEqual(['src/domain/worldPulse/bandFamilies.js'])`,
where `filesSpelling` is a **raw-source** regex `['"\`]<rung>['"\`]` over a full walk of
`src/**/*.{js,jsx}`. ⛔ **A quoted severity rung anywhere in `habitCurve.js` — INCLUDING IN
A COMMENT OR JSDoc — REDS THAT WALKER.**

**THE BINDING SHAPE.** `SEVERITY_W` is a positional array indexed through the imported
ladder, never a rung-keyed object:

```js
import { SEVERITY_LADDER, severityRankOf } from '../bandFamilies.js';
// Weights are POSITIONAL against SEVERITY_LADDER's own order. No rung is spelled here —
// spBandFamilies.walker asserts bandFamilies.js is the only module that speaks one.
const SEVERITY_W = Object.freeze([0.35, 1.0, 1.4, 0.8]);
export const severityWeightOf = (rung) => SEVERITY_W[severityRankOf(rung)];
```

⚠ **THE VOLUME'S §3b RUNG-KEYED `SEVERITY_W` OBJECT IS A READING AID, NOT AN AUTHORING
INSTRUCTION.** Unquoted object keys evade the regex but restate a vocabulary the ladder
already answers, which **J-HB-25 forbids independently**. ⛔
**`SEVERITY_W.length === SEVERITY_LADDER.length` is asserted (case A6)**, so a rung added
upstream reds here instead of silently mapping to `undefined`.

**H-B — decay singularity.** `habitCurve.js` contains **no** `Math.pow(0.5, …)`; it calls
`decayTowardNeutral`. MEASURED context: 18 `Math.pow(0.5` sites exist in `src/` today.
HB adds none.

**H-C — weeks, never ticks.** `decayTowardNeutral(value, neutral, ageWeeks, band)` —
MEASURED signature. HB-0's curve takes `ageWeeks` as a **parameter** and reads no clock;
the clock-resolution law binds HB-2's writer, not this leaf.

**H-D — the `CHANNEL_BANDS` borrow is ONE-DIRECTIONAL (R9).** MEASURED,
`dispositionLedger.js`: `CHANNEL_BANDS` is **`const`, not `export const`** — there is no
both-sides import to make. Its only outward path is `BANDS: CHANNEL_BANDS` inside the
exported `DISPOSITION_CHANNEL_TUNING`. **HB imports `DISPOSITION_CHANNEL_TUNING` and
DERIVES its rungs by projection**; one walker case asserts the projection is
threshold-ascending. ⛔ There is **no second array** to keep equal to a first, and the
volume's *"both-directions equality pin"* phrasing in §4 is superseded by R9's own
respelling in §3d. **The index IS the rank** — the rungs are not codepoint-sorted, which is
the exact inverse of the compile's warning.

**H-E — C3, the law-band modulation table.** WC §4.1.2 rules ONE frozen law-band table
with four consumer families, each supplying its own CURVE ROW, the table's SHAPE landing at
WC-0. **MEASURED: `src/domain/worldPulse/lawBandModulation.js` is ABSENT and WC-0 has not
landed.** HB-0 therefore authors `LEARN_RATE` / `HALF_LIFE` keyed on `LAW_WORDS` **inside
`HABIT_TUNING`**, which is C3's "own curve row" in its only currently-available home.
⛔ **HB-0 does NOT pre-build WC-0's table.** The future re-point is recorded here as a
named obligation. ⚠ The table may key on **only** `LAW_WORDS`' three words; a fourth word
ever is a STOP (the lawWord law).

**H-F — the Bands walker cannot be a copy of its sibling.**
`tests/lint/spBandFamilies.walker.test.js`'s `waveBlocks()` parser matches
`^### ((?:SP|WR|GR|TR|WF|POP|IN|INT|CW)-[A-Z0-9]+)\b` — **`HB` is not in that alternation,
and the HB volume's waves are BOLD PARAGRAPHS under `## §4`, not `###` headings.** The
sibling does not generalize and the volume says so. The HB walker parses `**HB-<n> — …**`
paragraph blocks and reconciles **against §8.2 THE TUNING SEAM — never §7, which is chair
questions (P8 / J-HB-21).** Subject set: the **TWO** tuning-bearing waves (HB-0 in full,
HB-6); the other **EIGHT** carry `**Bands:** NONE BY DESIGN`. ⭐ Both sides are DERIVED
from the volume — the walker carries no hand-written wave list, count or label (H-F of the
preamble, J-HB-25).

## 4. The exact manifest, with budgets

| # | Action | Path | Budget (effective lines, ENFORCER) |
|---|---|---|---|
| 1 | CREATE | `src/domain/worldPulse/habit/habitVocabulary.js` | **≤ 250** (domain ceiling 800) |
| 2 | CREATE | `src/domain/worldPulse/habit/habitCurve.js` | **≤ 250** (domain ceiling 800) |
| 3 | TEST | `tests/domain/habitVocabulary.test.js` | 8 literal `test` + 1 `describe` |
| 4 | TEST | `tests/domain/habitCurve.test.js` | 8 literal `test` + 1 `describe` |
| 5 | TEST | `tests/lint/habitBandsReconciliation.walker.test.js` | 6 literal `test` + 1 `describe` |
| 6 | REGISTER | `tests/lint/couplingInclusion.walker.test.js` | +2 rows, ceiling **13 → 15**, ≤ 20 lines |
| 7 | REGISTER | `scripts/mutation-coverage-manifest.json` | +1 entry for the new enforcer file, **appended by hand** |

⛔ **NO OTHER PATH.** In particular: **no** `scripts/.size-baseline.json` (nothing this wave
touches is baselined), **no** `src/domain/worldPulse/simulationRules.js` (no flag), **no**
`src/lib/spatialUsage.js` (no ledger key — that is HB-2's), **no**
`proposedSoakBands.js` (§8.2: nothing enters it until the owner signs at the soak redo;
`check-tuning-bands` stays at **9 ratified bands**), **no** coupling-registry file,
**no** `scripts/mutation-sweep.sh` (a planted sweep mutation is a two-file edit this wave
has not declared — preamble §P6), and **no** `pulseKernel.js` / `applyWorldPulse.js` (L1,
banked at zero headroom).

### 4.1 THE REGISTRATION TEMPLATE AT FULL STRENGTH (OQ §35.3 — instance five)

Row 6 is a registration act. The four parts, named explicitly:

| Part | Address |
|---|---|
| **THE ROWS** | `ARGUED_UNLAYERED['src/domain/worldPulse/habit/habitVocabulary.js']` and `ARGUED_UNLAYERED['src/domain/worldPulse/habit/habitCurve.js']`, each `{ kind: 'substrate', reason: <over 20 chars>, reads: … }`, in `tests/lint/couplingInclusion.walker.test.js` |
| **THE HEAD RE-EXPORT** | **NONE, and the absence is the argument.** A substrate leaf re-exported through a layered head would acquire that head's port and red `expect(LAYER_OF.has(module)).toBe(false)`. Recorded as a decision. |
| **THE EXACT-LIST PIN** | `ARGUED_ROSTER_CEILING`, **13 → 15**, in the SAME commit — `toBe()`, exact in both directions |
| **THE REGISTRY TEST PATH** | `tests/lint/couplingInclusion.walker.test.js` |

**WHY A ROW AND NOT A BASELINE LINE — MEASURED, NOT ASSUMED.** The walker's census scope is
`CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse|spatial)\//` and its `walk()` **recurses
into subdirectories**, so `habit/` is in scope. **No HB filename matches any of the seven
`LAYER_PATTERNS` families** (checked against all seven). `UNLAYERED_BASELINE_CEILING` is
**179**, asserted with `toBe()`, and the walker's own message forbids the door outright.
**The baseline stays at 179.**

**⚠⚠ THE TWO ROWS DO NOT CARRY THE SAME `reads`, AND THE DIFFERENCE IS MEASURED.** The
`reads` field is **OUTBOUND-ONLY** and names a module's exact set of **LAYERED** imports;
the walker recomputes it from `layeredImportsOf` and reds in **both** directions on drift.

| Leaf | Imports | `reads` |
|---|---|---|
| `habitCurve.js` | `bandedStock.js`, `bandFamilies.js`, `lawWord.js` — **all three are themselves `ARGUED_UNLAYERED`**, so none is in `LAYER_OF` | **`Object.freeze([])`** |
| `habitVocabulary.js` | `dispositionLedger.js` (the R9 one-directional borrow) | **`Object.freeze(['src/domain/worldPulse/dispositionLedger.js'])` + a `readsReason`** |

**EXECUTED, so this is not a guess:** `dispositionLedger.js` matches the INTERIOR family
pattern → **`LAYER_OF` = INTERIOR**, and it is correspondingly **absent** from the unlayered
baseline. `DISPOSITION_CHANNEL_TUNING` is exported at `dispositionLedger.js:774` carrying
`BANDS: CHANNEL_BANDS`.

⛔ **A `reads: []` ROW ON `habitVocabulary.js` REDS THE WALKER BY NAME**
(*"…now reads `<dep>` [INTERIOR] and does not declare it"*), and a non-empty `reads` with no
`readsReason` reds a second arm. **The reach is DECLARED AND COUNTED, never erased** —
which is exactly what the walker's `errandMint` precedent does with its three edges.

⭐ **A CHEAPER SHAPE EXISTS AND IS NAMED SO THE CHOICE IS DELIBERATE:**
`dispositionLedger.js:118` already exports
`APPETITE_BAND_LADDER = Object.freeze(CHANNEL_BANDS.map((band) => band.name))` — the
ascending rung NAMES, pre-derived. Importing that instead of projecting
`DISPOSITION_CHANNEL_TUNING.BANDS` by hand is a smaller read of the same module and keeps
R9's one-directional borrow intact. **It does not remove the reach** (same module, same
layer), so the row and its `readsReason` are owed either way; it only makes the projection
shorter. **The executor picks one, and records which.**

## 5. Acceptance cases (denominator 8)

| # | Case |
|---|---|
| **A1** | **NEUTRAL IDENTITY.** An absent stock ⇒ `habitFactor` returns **exactly the number 1** (`Object.is(f, 1)`), the same door a dark flag goes through. |
| **A2** | ⭐⭐ **THE ODDS-RATIO LAW, ≥ 1000 cases.** For every pair, `(p'_i/p'_j)/(p_i/p_j) ∈ [(1−s)/(1+s), (1+s)/(1−s)]`; **plus** the never-0/never-1 half; **plus** the REACHABILITY assertion that the observed range FILLS the analytic `[0.481481, 2.076923]`. |
| **A3** | **THE FACTOR PIN.** `habitFactor` ∈ `(1−s, 1+s)` as a plain unit test. ⛔ NOT the deleted per-probability pin. |
| **A4** | **THE SYMMETRY FENCE.** `NEUTRAL_I − FLOOR_I === CAP_I − NEUTRAL_I`, with the reason in the failure message: moving one without the other makes reinforcement and decay different-sized instruments — a behaviour change disguised as a dial. |
| **A5** | **THE VOCABULARY.** `CIRCUMSTANCE_CLASSES` (codepoint-sorted) and `CIRCUMSTANCE_PRECEDENCE` (semantic) are **permutations** of each other; `length === 12` **AND** `length <= HABIT_CLASS_CEILING` with `HABIT_CLASS_CEILING = 12` named OWNER-SIGNED in the message. **Two assertions, not one:** the count catches drift, the ceiling refuses it. |
| **A6** | **THE CURVE.** Monotone in severity within a direction; the anti-ratchet property inherited from `bandedStock` re-asserted at HB's own call shape; `SEVERITY_W.length === SEVERITY_LADDER.length`; the codepoint-tiebreak determinism pin; and `roundToUnits` as THE ONE ROUNDING DOOR (CR-HB-Q3), pinned single-spelling across the family. |
| **A7** | **THE ONE-DIRECTIONAL BORROW.** `HABIT_HOLD_BANDS` is DERIVED by projection from the imported `DISPOSITION_CHANNEL_TUNING.BANDS`; the projection is threshold-ascending; `HOLD_RANK` is the index. |
| **A8** | **THE BANDS WALKER + ITS GUARD-THE-GUARD.** The `**Bands:**` lines of the TWO tuning-bearing waves reconcile BOTH DIRECTIONS against §8.2; the parser is proven live on a non-empty subject; and a `**Bands:**` line **planted** on a NONE-BY-DESIGN wave **REDS**. |

## 6. Wave-specific mutants

| # | Mutant | Must RED |
|---|---|---|
| M-1 | **Flatten `severityWeightOf`** (all four weights → 1.0) | A6 — the severity monotonicity arm |
| M-2 | **Collapse `learnRateFor`'s law bands** (one rate for all three words) | the lawless/lawful divergence case |
| M-3 | **Plant a quoted severity rung in `habitCurve.js`** | `spBandFamilies.walker.test.js` — proves H-A's cure is load-bearing rather than incidental |
| M-4 | **Permute `CIRCUMSTANCE_PRECEDENCE` to equal `CIRCUMSTANCE_CLASSES`** | A5's permutation-vs-order assertion — the `MISSION_GRADES` / `MISSION_GRADE_ORDER` trap (H-10) |
| M-5 | **Move `FLOOR_I` without `CAP_I`** | A4 |
| M-6 | **Plant a `**Bands:**` line on a NONE-BY-DESIGN wave** | A8's guard-the-guard |

⚠ **M-1 and M-2 mutate the DERIVATION, never a recorded number** — a count mutant on a
literal goes vacuous. Every mutant restores **digest-exact** (`cmp`-proved).

## 7. The checks (bare, in-shell, unpiped, each `; echo TRUE_EXIT=$?`)

```
npx vitest run tests/domain/habitVocabulary.test.js tests/domain/habitCurve.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/habitBandsReconciliation.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/spBandFamilies.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/couplingInclusion.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/mutationCoverageManifest.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/sizeBaseline.test.js ; echo TRUE_EXIT=$?
node scripts/check-observed-shape-readers.mjs ; echo TRUE_EXIT=$?
npm run typecheck:ratchet ; echo TRUE_EXIT=$?
npm run typecheck:domain:strict ; echo TRUE_EXIT=$?
```

⛔ **NEVER wrap any of these in `gate-mutex.sh --run`** — `test:ratchet` re-acquires and
self-deadlocks, and **exit 3 is the mutex giving up, not a red.** The bare full gate and
`smoke:boot` belong to the train terminal **T**, not to this member.

**§31 ANCHOR PREFLIGHT — MANDATORY, BEFORE THIS MEMBER DECLARES GREEN.** All three new test
files are NEW, so `ceilingFor(file)` returns **0** in `tests/domain/` and `tests/lint/`
alike. Every `not.toContain` / `not.toMatch` / `not.toHaveProperty` carries
`// anchored: <why this cannot go vacuous>` on its own line or the line immediately above,
or routes through `expectPresentThenAbsent` / `expectAbsentWithAnchor` **called by name on
the same line**. ⚠ For a multi-line anchor comment only the LAST line counts.

## 8. Declared census movement (J-TE3-1 — BY FIGURE)

`2418/366/2052/20024/5643` → **`2421/366/2055/20046/5646`** at I1
(**+3 files / +0 parked / +3 credited / +22 titles / +3 suite titles**).
⚠ **THE LIGHTING WALKER IS RED AT I1 BY EXACTLY THIS FIGURE AND IS CURED AT I2**, where the
train re-derives the tuple WHOLE. Interior only; never exposed. `runtimeTests` +22.
**Parked stays at 366 by design:** every title is a literal in a straight-line
registration — ⛔ **no `test.each()`, no `describe.runIf()`.**

## 9. Open items this packet does NOT decide

- **O-1: `circumstanceClassOf` has no chartered home in any HB wave.** §1.2(a) names it as
  the totality guarantee; §4's charters assign it to nobody. Reported, not taken — it is
  first *needed* at HB-2's writer and HB-4's load points. **Docketed for the HB-2 compile.**
- **R25's re-aimed corpus measurements** — recorded above with their new addresses.
- **The C3 re-point** to WC-0's `lawBandModulation.js` once that wave lands.
- **O-2 — Q4's cost is already paid (R22).** `HB` is chartered. Q4's *substance* still
  needs a ruling at HB-2, but its stated blocking cost is stale.


## 14. Executed landing evidence (member proof at `e188760b`)

Every command bare, in-shell, unpiped, exit captured. No `gate-mutex.sh` wrapping. Re-run in
full against the COMMITTED tree, so nothing below is inherited from a pre-commit working
state.

| Check | Exit | Result |
|---|---|---|
| `habitVocabulary` + `habitCurve` batteries | 0 | 27 tests passed |
| `habitBandsReconciliation` + `couplingInclusion` | 0 | 16 tests passed |
| `spBandFamilies` + `mutationCoverageManifest` + `sizeBaseline` | 0 | 22 tests passed |
| §31 anchor preflight (`negativeAssertionAnchor.walker`) | 0 | 9 tests passed |
| `check-observed-shape-readers.mjs` | 0 | 1998 findings, exactly matching the frozen inventory |
| `typecheck:ratchet` (`tsconfig.full.json`) | 0 | 173 errors, ceiling 173 |
| `typecheck:domain:strict` (`tsconfig.domain-strict.json`) | 0 | 1134 errors, ceiling 1134 |
| scoped `eslint` over all six touched files | 0 | clean |

**Effective lines, ENFORCER (`Linter`, `max-lines`, skipBlankLines + skipComments):**
`habitVocabulary.js` **50** and `habitCurve.js` **82**, both against a ≤ 250 budget.

**Six mutants convicted, each restored digest-exact (`cmp` exit 0):** flattened outcome
weights; collapsed law-band learn rates; a rung literal planted in a COMMENT, which reds the
band-family walker and so proves that scan really does read raw source; a precedence order
permuted to equal the sorted set; a floor moved without its cap; and a `**Bands:**` line
planted on a wave that declares none.

⚠ **ONE PIN WAS FOUND SELF-REFERENTIAL BY WRITING ITS MUTANT FIRST.** The step-law assertion
reads its own expected step out of `learnRateFor`, so a collapsed rate table moves both sides
together and passes. The law-band divergence is therefore asserted DIRECTLY — three distinct
rates, strictly descending with volatility — and that is the arm the mutant reds.

**THE CENSUS.** This member's own commit carried the movement as a NAMED interior red
(`2418/366/2052/20024/5643` recorded against a live `2421/366/2055/20046/5646`, all five
figures proved by an isolated probe restored digest-exact). Because the landing is a PREFIX,
the cure has nowhere to sit but the terminal, which therefore re-derives the tuple WHOLE and
is not docs-only. The base-state capsule stamps at the terminal accordingly.

## 15. ⚠ THE ORPHAN WINDOW, NAMED WITH ITS DISCHARGE CONDITION

**This landing exposes two `src` leaves that NOTHING IMPORTS.** That is the wave's whole
identity argument — two modules with zero importers cannot change a generated world, which
is why the dormancy evidence is a source scan rather than a claim — but it is also an orphan
window, and it is recorded here rather than left for a later census to re-find.

**IT IS A KNOWN, PRECEDENTED SHAPE, NOT A NEW ONE.** The estate has landed dark instruments
ahead of their consumers before, and `bandFamilies.js` — which this family imports — was
itself landed *"consumed by nothing at land time — dark by construction"*. The window is the
recorded IN-1a precedent.

**WHY IT IS WIDER HERE THAN THE TRAIN PLANNED, STATED PLAINLY.** The consumer these leaves
were built for was the SAME TRAIN's second member, whose fork registry imports the
vocabulary. That member stopped on a refuted premise, so the window that would have closed
inside one exposure now stays open across a re-charter.

> **DISCHARGE CONDITION.** The window closes at the **HB-1 re-charter's first consumer** —
> the wave that imports `habitVocabulary.js` (the fork registry is the designed first
> reader). Until then these two leaves are orphaned by design and by record.

⛔ **ONE CONSEQUENCE THE RE-CHARTER MUST CARRY, because it is a measured fact rather than a
caution.** `tests/domain/habitCurve.test.js`'s dormancy case asserts *"neither new leaf has
an importer anywhere in `src`"* — a WHOLE-TREE ABSOLUTE. It is true at this prefix and it
was measured FALSE the moment the fork registry existed, because that registry legitimately
imports the vocabulary. **The first consumer must re-aim that case in its own commit**, from
a whole-tree absolute to the claim the wave actually needs: that HB-0 wired nothing, and that
the family's own consumers are themselves dark. A wave that adds the import without re-aiming
the case reds a test that has been green since this landing.

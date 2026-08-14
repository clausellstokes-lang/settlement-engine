# HB / HB-0B — THE THREE STRUCTURAL BOUNDS, MINTED IN THEIR ONE LAWFUL HOME

- **Status:** READY
- **Train:** `hb-2b`, member **M1 of two**. Private ref `refs/trains/hb-2b`.
- **Authority:** **OQ §42.2**, which rules this micro-act into existence:
  *"a two-member train `hb-2b` = M1 'HB-0b' (the three bounds minted in `HABIT_TUNING` — the one
  lawful home per habitCurve's landed header — with their tests)"*, and rules that
  **the bound values are chair-signed at promotion under the rationale-or-STOP tripwire.**
- **Volume:** `docs/DESIGN_FP_ARCH_HB.md` §1.4 (the row cap and its bound) and §3a (the pledge
  laws), **as SUBSTRATE, not as charter** — this wave has no §4 wave block and authors none.
- **Family preamble:** `docs/implementation/preambles/HB-PREAMBLE.md`, cited **BY SHA-256**:
  `84fc1a6b8177aaaa26983f8ccb86003adb56f70dc6789213030ede947ddeb388`
  ⚠ **RE-COMPUTED AT P1 by the executor** — a blank or stale sha is a promotion STOP. The git
  **blob** id is `28db0b4ed6ea3740a0d94da744b7deb963873574`, a different digest, and is not what
  the citation law demands.
- **Verified base:** `claude/composite-r4` at `e5ecc83dd443d13bdbc495d8cf701f93504fccdd`
  Executed at compile: HEAD exact, `git status --porcelain` **0 lines**, at open and at close.
- **Capsule:** `BASE_STATE.json` stamped `5bcca49a`; HEAD is its **docs-only child**, so the
  `consumptionLaw` clause is satisfied and its figures are citable as executed. ⛔ Every row this
  manifest touches is RE-EXECUTED.
- **Bands:** ⛔ **THREE RAW-AUTHORED PROPOSALS — NONE RATIFIED, NONE ENTERING THE SOAK BAND
  MANIFEST.** This is not an absence declaration and it is not a band list; it is an extension of
  the standing declaration `habitCurve.js`'s own header already makes over the ten constants in
  the bag: *"ALL CONSTANTS BELOW ARE RAW-AUTHORED PROPOSALS. None is ratified, none enters the
  soak band manifest, and none may be authored anywhere but `HABIT_TUNING`."* **MEASURED: the soak
  manifest is unmoved at NINE ratified bands and `SOAK_COUPLINGS` names no habit family, so a
  habit band could not be added without first minting a seventh coupling** (§3 below). The three
  **VALUES** are chair-signed at promotion under §42.2's tripwire; each carries an executed
  derivation at §4. **Marked UNSOAKED, riding the tuning signature like every `HABIT_TUNING` value.**
- **Req 13:** declared-empty. **Req 14:** engine-only — three frozen numeric members, no DM verb,
  no user-facing surface, no prose token.

---

## 1. Scope and boundary

**THIS WAVE FIXES `R31`.** The HB-2 charter asserts that the row cap and the pledge max age are
*"STRUCTURAL bounds declared in `HABIT_TUNING` at HB-0"*. **They are not there and they are
nowhere** — executed at the base: `HABIT_TUNING` holds ten keys (`NEUTRAL_I`, `FLOOR_I`, `CAP_I`,
`HABIT_SPAN`, `ANTICIPATION_SPAN`, `DEVIATE_W`, `SEAT_SHOCK_KEEP`, `LEARN_RATE`, `HALF_LIFE`,
`SEVERITY_W`), and the three symbols return **zero hits across `src/ tests/ scripts/`**. This wave
mints them, so that HB-2's own charter sentence becomes **TRUE at the commit that precedes it**
rather than inherited from a false premise.

**IT DOES NOT TOUCH:** any world, any store, any flag, any registration, any leaf but the frozen
curve, any `tests/` file but that curve's own battery, or **any `src/` file that would join the
habit family's file census** (`R32`).

### 1.1 · The boundary sentence

> This wave adds three frozen numeric members to an existing frozen object and pins their
> derivations; it mints no leaf, wires no caller, reads no world, moves no registration, and
> authors no band.

⛔ **IT IS DARK BY THE STRONGEST AVAILABLE ARGUMENT: NOTHING READS THE THREE MEMBERS.** They are
spent by `habitLedger.js`, which **M2 has not yet created**. Zero consumers exist in `src/` at the
end of this commit, and that is asserted rather than assumed (§6, A4).

---

## 2. ⛔⛔ THE BEHAVIOUR/IDENTITY CONTRACT

**The claim: this wave is byte-identical for every generated world, on every seed, at every tick,
on every one of the FIFTEEN lifecycle paths — and the argument is stronger than HB-2's, because it
does not rest on a flag.**

`HABIT_TUNING` is read only by `learnRateFor`, `halfLifeBandFor`, `roundToUnits`, `seatAdjusted`,
`applyCredit` and `habitFactor` (executed: every `HABIT_TUNING` reference in `src/` lives in
`habitCurve.js`). **None of those six functions reads a member this wave adds**, and none of them
has a caller in the engine — `habitCurve.js` sits inside `HABIT_DARK_CLOSURE`, whose closedness arm
asserts that no module outside the family imports a member. ⇒ **The three new members are
unreachable from every generated world by two independent arguments: no reader inside the module,
and no engine reader of the module.**

**NO STRING.** No receipt, news beat, dossier row or prose token is composed on any path this wave
adds, so no golden moves. **NO DRAW.** Zero PRNG consumption. **NO CLOCK.** No wall-clock read;
`PLEDGE_MAX_AGE_WEEKS` is a campaign-clock **quantity**, derived at module load from a frozen
ladder, never a reading of time.

---

## 3. ⭐⭐ THE BAND QUESTION, ANSWERED BEFORE IT IS ASKED

Because this wave authors tuning, the first question any reviewer must ask is whether it owes an
**owner band signature**. It does not, and both instruments were executed rather than reasoned
about.

| Instrument | Read set | Result at the base | Moves? |
|---|---|---|---|
| `scripts/check-tuning-bands.mjs` | **one module**, `src/domain/tuning/proposedSoakBands.js` (its own header: *"no pg driver, no fs"*; verified at `:27-32`) | `manifest v2 OK: 9 ratified soak bands, all valid`, **TRUE_EXIT=0** | ⛔ **NO** |
| `tests/lint/habitBandsReconciliation.walker.test.js` | **one file**, `docs/DESIGN_FP_ARCH_HB.md` (`readFileSync` at `:41`, and there is no second read) | **6 passed, TRUE_EXIT=0** | ⛔ **NO** |

**NEITHER INSTRUMENT OPENS `habitCurve.js`.** Corroborated by three executed measurements:
`RATIFIED_SOAK_BANDS.namesHabit = false`; its seven `constantModule` values are npcLadder×3,
traditionsKernel, generosityReactions, populationDynamics and coup — **no habit module**; and
`SOAK_COUPLINGS` is the closed six `contest · bond · festival · gratitude · occupation_flight ·
coup_econ`, which `assertValidSoakBands` requires every band to name. **The manifest is closed to
HB by its own vocabulary, and the closure is deliberate** — `habitCurve.js`'s header says so in
writing.

⚠⚠ **THE CONVERSE IS ALSO TRUE AND IS WHY THIS WAVE EDITS NO VOLUME.** The reconciliation walker's
second case asserts the waves that carry bands are **exactly** the waves §8.2 names, and its third
asserts the absent-count equals §8.2's spelled number word. **A `**Bands:**` line authored into §4
for this micro-act would red both arms** until §8.2 was rewritten in the same commit. This wave
authors no volume edit, so the walker is inert **by construction** — and the executor is forbidden
from "helpfully" annotating the volume.

⛔ **AND A GUARD HOLE IS RECORDED RATHER THAN EXPLOITED (`CR-HB0B-BANDGAP`).** `waveBlocks()`
splits on `/^\*\*(HB-\d+) — /`; a block headed `**HB-0b — …` would **not match** and would be
silently invisible to the reconciliation. This wave does not add such a block. **The hole is
docketed for its own micro-act, not closed here**, because widening the regex is a walker change
with its own census cost.

---

## 4. ⭐⭐ THE THREE VALUES AND THEIR EXECUTED DERIVATIONS

§42.2: *"A value without an executed derivation is a promotion STOP."* Full arithmetic, candidate
tables and sensitivity live in `laneTC10-TRAIN-PLAN.md` §4. This section carries what the chair
signs.

### 4.0 · The measured unit costs (executed at `e5ecc83d` from live modules)

```
CIRCUMSTANCE_CLASSES.length = 12       STRATEGY_MOVES.length = 11      ⇒ structural max 132 rows/actor
bytes/row    = 25       "<action>":[s,w],           (action tokens: mean 8, max 13)
bytes/class  = 18.42    "<class>":{},               (class tokens: mean 13.42, max 17)
bytes/pledge = 104.8    ~4.2x a row — the pledgeId restates class+actor, the value restates all three
HABIT_TUNING.HALF_LIFE  = { lawless: a_year, balanced: a_few_years, lawful: a_decade }
HALF_LIFE_WEEKS         = { 13, 52, 156, 520, 1040 }
tilt = CAP_I - NEUTRAL_I = 3500        largest credit step = 0.22 x 1.4 x 3500 = 1078 units
```

> ⛔ **`R33` — THE VOLUME'S PER-ROW COST IS REFUTED.** §1.4 reads *"48 rows × ~14 bytes ≈ 670 bytes
> per actor … ≈ 120KB."* **MEASURED 25 bytes/row — a factor of 1.79.** The volume's arithmetic is
> internally consistent; **the error is the unit**, and it propagates into every derived figure.
> At the measured cost the volume's own configuration costs **266.6 KB** at its own stated scale.
> ⭐ Same shape as R26 and R30: **the LAW survives** (cost is a real design input; the cap exists
> for the JSONB sync path at §8.5 row 6) — **only the figure dies.**

> ⚠ **`R34` — THE 180-SETTLEMENT DENOMINATOR EXCEEDS EVERY CERTIFIED SCALE.** MEASURED:
> `whole-world-soak.mjs:106` clamps settlements to **30**; `realm-scale-certification.mjs`'s
> profiles top out at 30. The volume's 180 is **6×** the largest scale the estate proves. It
> changes which constraint binds — at 30 actors the persist cost cannot bind the cap at all — so
> every value below is derived to be sound at **both** scales.

### 4.1 · `HABIT_ROWS_PER_ACTOR_CAP` = **24**

| step | the measurement | what it fixes |
|---|---|---|
| 1 | structural max = `12 × 11` = **132** | a cap ≥ 132 makes nearest-neutral eviction a **dead arm**. 24 is 18.2% of it ⇒ eviction is live |
| 2 | `24 = 2 × 12`, a whole multiple of the class vocabulary | every class gets the same allowance; a non-multiple biases the ledger toward whichever class filled first — an ordering dependency in the very mechanism whose determinism exists *because* insertion order would break replay |
| 3 | two per class is the **smallest** allowance expressing a preference | at one row per class the factor is unopposed and the class carries no contrast — the ledger's whole purpose |
| 4 | measured cost **881 B/actor** ⇒ **26.4 KB @30 actors**, 158.6 KB @180 | 4.5× inside the volume's own ~120 KB at the certified scale. **The volume's 48 lands at 266.6 KB — 2.2× its own budget** |

⚠ **VETOABLE ALTERNATIVES, PRICED:** **16** makes the volume's *derived* 670 B/actor exactly true
(681 B, 1.02×) but is circular — 670 is an output of the refuted arithmetic — and is not a multiple
of 12. **48** is the volume's proposal at 2.2× its own stated budget. Both are in the plan's table.

### 4.2 · `PLEDGE_MAX_AGE_WEEKS` = **156**, INDEXED, NEVER SPELLED

**THE CROSSOVER** — the age at which the forgetting accrued while an episode ran first exceeds the
largest credit that grading it could apply. Solve `3500 × (1 − 0.5^(t/H)) = 1078`:

```
lawless   H= 52w   crossover =  27.6w
balanced  H=156w   crossover =  82.9w
lawful    H=520w   crossover = 276.2w
at 156w (median court): decay loses 1750 units = 1.62x the largest credit
at 208w (the volume's): decay loses 2111 units = 1.96x the largest credit
```

Past its crossover a pledge **cannot pay back the decay accrued while its episode ran** — the
lesson arrives after the student has forgotten more than the lesson teaches. That is the volume's
own *"it teaches nothing"*, made arithmetic. The median court's crossover is 82.9 w; the first
member of the estate's one time ladder at or above it, and simultaneously **the median court's own
forgetting band**, is **156**.

⛔ **WHY 156 AND NOT THE VOLUME'S 208: 208 IS NOT A RUNG.** `HALF_LIFE_WEEKS` is
`{13, 52, 156, 520, 1040}` (executed) and 208 is a member of none of it. The habit family's landed
discipline is to ride shared ladders rather than author numbers — *"It authors NO band vocabulary.
The half-life bands are indexed out of the imported ladder"* — and a hand-keyed 208 is exactly what
that discipline exists to prevent.

⛔⛔ **THE SHAPE IS AS LOAD-BEARING AS THE NUMBER.** The value is **INDEXED POSITIONALLY**:

```js
/** The median court's own forgetting band — positional against LAW_WORD_VOLATILITY, never spelled. */
const MEDIAN_VOLATILITY_INDEX = 1;
…
PLEDGE_MAX_AGE_WEEKS: halfLifeWeeksOf(
  HALF_LIFE_BANDS[HALF_LIFE_BAND_OFFSET + MEDIAN_VOLATILITY_INDEX],
),
```

⚠⚠ **AND THE REASON IS NOT THE ONE A READER WILL GUESS — MEASURED, WITH THE OBVIOUS ANSWER
REFUTED.** Spelling `a_few_years` **does NOT red the band-family walker**: `spBandFamilies`'s
`FAMILY_HOME` is `bandFamilies.js` and its single-speller scan governs `SEVERITY_LADDER` and
`SIGNIFICANCE_CLASSES` **only**. Live counter-example, executed:
`dispositionLedger.js:125` reads `export const APPETITE_HALF_LIFE_BAND = 'a_few_years';` **and is
green.** ⇒ **The half-life ladder has NO single-speller machinery anywhere.**

⛔ **The binding constraint is `habitCurve.js`'s OWN LANDED HEADER**, which commits in writing:
*"no rung word is spelled anywhere in this file — including in this comment."* Spelling the rung
would falsify a landed header sentence **while every walker stayed green**. **Recorded as a hazard
in its own right: here the discipline is header PROSE, not machinery, and prose does not red.**
Case A2 below converts it into machinery for this file.

### 4.3 · `PLEDGE_BOOK_CAP` = **256** — no value existed anywhere in the estate

| step | the measurement | what it fixes |
|---|---|---|
| 1 | **the book is TRANSIENT, the ledger is PERSISTENT** — a pledge is consumed by its grade or dropped by the sweep | a backstop that costs more than the state it feeds is not a bound, it is a second ledger. **256 × 104.8 B = 26.8 KB**, at parity with the recommended row ledger's 26.4 KB @30 actors |
| 2 | structural ceiling = `actors × 12` ⇒ **360** @30, **2160** @180 | at 2160 the oldest-first eviction can never fire at any certified scale — a **dead arm**. 256 fires only under genuine pathological simultaneity |
| 3 | 256 is **71%** of the certified-scale ceiling | eviction is the book's one **silent** loss (a lapse leaves a receipt; an eviction does not), so it must not be a normal-play mechanism either |

⚠⚠ **THE HONEST RESIDUAL, AND §42.3 ALREADY RULED ITS TWIN.** A cap ideally rests on a **measured
occupancy**, and occupancy is **structurally unmeasurable at this train**: HB-2 wires no caller, so
`writeHabits` never runs on any corpus and no pledge is ever opened. This is the identical
undischargeability that re-aims the median/p95 header pin to HB-3. ⇒ **derived structurally,
marked UNSOAKED, and re-visited at HB-3 with a measured occupancy.**

---

## 5. The exact manifest, with budgets

**TWO handwritten non-docs paths.** Every budget is EFFECTIVE lines under eslint `max-lines`
`{ skipBlankLines: true, skipComments: true }`, measured at the publishing commit with the
enforcer, **never `wc -l`**.

| # | Action | Path | Budget | Purpose |
|---|---|---|---|---|
| 1 | **MODIFY** | `src/domain/worldPulse/habit/habitCurve.js` | **≤ 12 effective** | three members in `HABIT_TUNING`, one positional index constant, one added named import (`halfLifeWeeksOf`) |
| 2 | **TEST** | `tests/domain/habitCurve.test.js` | — | four literal `test` titles inside the existing `describe` |

**BUDGET COMPLIANCE against `PACKET_STANDARD.md` "Default hard scope budget":**

| Limit | Cap | This packet |
|---|---:|---|
| new logic-bearing production leaves | 2 | **0** ✓ |
| existing logic-bearing production files modified | 3 | **1** ✓ |
| additional registration-only production files touched | 3 | **0** ✓ |
| feature flags | 1 | **0** ✓ |
| new persisted record families | 1 | **0** ✓ |
| named writer per ONE state that changes | 1 | **0** ✓ — no state changes |
| user-facing surfaces | 1 | **0** ✓ |
| direct production consumers | 2 | **0** ✓ — nothing reads the three members |
| handwritten files total | 12 | **2** ✓ |
| new/changed effective production lines | 400 | **≤ 12** ✓ |
| each new production leaf | 250 | n/a — no new leaf |
| named acceptance cases | 8 | **4** ✓ |

⛔ **NO HOT FILE IS TOUCHED.** `habitCurve.js` measures **82/800** effective — 718 lines of
headroom — and is **absent from `scripts/.size-baseline.json`** (15 keys, no HB file baselined).

### 5.1 · ⛔ WHAT THE MANIFEST DELIBERATELY OMITS, EACH REMOVED BY AN EXECUTED MEASUREMENT

- ⛔ **`tests/lint/sovereigntyLightingContract.walker.test.js` — NOT ON THIS MANIFEST.** The TE7
  law puts the census re-derivation at the train's **last** `tests/`-moving member, which is M2.
  This member's four titles ride as a **declared interior red** (§9, R3) and are cured whole at I2.
  ⛔ A patched figure would measure nothing below the patch point — the census is SEQUENCED.
- ⛔ **`scripts/mutation-coverage-manifest.json` — NOT ON THIS MANIFEST, and that is MEASURED.**
  The manifest is keyed by invariant test FILE, and `enumerateInvariants` picks a file only under
  `ENFORCER_DIRS = [tests/lint, tests/design, tests/docs, tests/data, tests/copy, tests/security,
  tests/edgeFunctions]` **or** on a basename matching
  `/(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i`.
  Executed: **`tests/domain/habitCurve.test.js` is NOT enumerated**, and it correspondingly has no
  entry today while the TOTALITY case is green. ⇒ **no row is owed, and adding one would red the
  no-stale-entries case.**
- ⛔ **`tests/lint/couplingInclusion.walker.test.js` — NOT ON THIS MANIFEST.** No leaf is minted,
  so no `ARGUED_UNLAYERED` row and no ceiling move. ⭐ **AND THE EXISTING ROW CANNOT MOVE EITHER:**
  `habitCurve.js`'s row is `reads: Object.freeze([])` (`:463`) and `layeredImportsOf` computes over
  **modules**; the one added import (`halfLifeWeeksOf`) comes from `bandedStock.js`, **a module
  `habitCurve.js` already imports**, so the import SET is unchanged and `reads` cannot drift in
  either direction. Proven by construction.

### 5.2 · ⛔ THE FOUR CONSTRAINTS ON THE EDIT ITSELF — every one reds a GREEN landed test

1. ⛔ **NO NEW ROUNDING EXPRESSION.** `habitCurve.test.js:229-232` asserts `roundings` equals
   `[CURVE_HOME]` — an array of **exactly one** match of
   `/\b(?:Math\.round|Math\.trunc|Math\.floor|Math\.ceil|toFixed)\s*\(/` across the whole family.
   A second spelling anywhere in this file reds it. **The three bounds need none.**
2. ⛔ **NO HABIT-DIRECTORY FILE.** `habitCurve.test.js:228` pins `family.length` to **2** (`R32`).
   This member adds no file to `src/domain/worldPulse/habit/` and the figure stays 2 at I1.
3. ⛔ **NO CIRCUMSTANCE-CLASS TOKEN AS A QUOTED LITERAL, JSDoc INCLUDED.**
   `habitVocabulary.test.js:113` asserts over **RAW source** across all of `src/` that
   `habitVocabulary.js` is the ONLY file spelling one. The three symbol names contain none, and
   the authored JSDoc says *"the twelve-class vocabulary"* rather than naming a class.
   ⚠ **§41 item 5 makes this a standing HB law that every future compile preflights.**
4. ⛔ **NO HALF-LIFE RUNG WORD, per the file's own landed header** (§4.2). ⚠ **No walker enforces
   this one** — case A2 is what converts it into machinery for this file.

---

## 6. Acceptance cases — FOUR

Each becomes one literal `test` title appended inside the existing
`describe('HB-0 — the frozen curve, its fences, and the wave dormancy evidence', …)`.
⛔ **No `test.each()`, no `describe.runIf()`, no loop registration** — a parked file closes the
census arithmetic while measuring nothing.

| # | Case | Convicts |
|---|---|---|
| **A1** | **THE THREE BOUNDS EXIST, ARE FINITE POSITIVE INTEGERS, AND ARE FROZEN MEMBERS OF THE ONE BAG.** Assert each is `Number.isInteger` and `> 0`, and that a write to `HABIT_TUNING` throws or is a no-op under the freeze. | a bound authored outside the bag · a float creeping into an integer-domain quantity |
| **A2** | ⛔ **THE ROW CAP IS STRICTLY BELOW THE STRUCTURAL PRODUCT, SO EVICTION IS REACHABLE**, and the product is **DERIVED** — `CIRCUMSTANCE_CLASSES.length * STRATEGY_MOVES.length`, both imported, never transcribed. ⭐ **AND THE HALF-LIFE RUNG WORD APPEARS ZERO TIMES IN `habitCurve.js`'s RAW SOURCE**, asserted with a positive control that finds the rung in `bandedStock.js` first, so an emptied scan cannot pass as an absence. | a cap at or above 132 making eviction a **dead arm** · a transcribed denominator that cannot drift-detect · **the header-prose discipline of §4.2, converted into machinery** |
| **A3** | **THE PLEDGE AGE IS A MEMBER OF THE SHARED LADDER, AND IT IS THE MEDIAN COURT'S OWN BAND.** Assert `Object.values(HALF_LIFE_WEEKS)` **contains** `PLEDGE_MAX_AGE_WEEKS`, and that it equals `halfLifeWeeksOf(HABIT_TUNING.HALF_LIFE[LAW_WORD_VOLATILITY[1]])` — the relationship, not the number. ⚠ **A pin on the literal 156 would pass a hand-keyed re-spelling**; a pin on the relationship reds it. | a hand-keyed age that belongs to no ladder · a ladder reorder upstream silently re-pointing the age |
| **A4** | **THE THREE MEMBERS HAVE ZERO CONSUMERS IN `src/`**, scanned over raw source, with the guard-the-guard finding `NEUTRAL_I`'s real consumers first so the absence is proven live. ⚠ **This case is re-aimed by M2's successor wave, HB-3**, which is the first that spends them — recorded here as the re-aim's own condition, the way HB-0 §15 wrote it. | the dormancy claim going vacuous · a consumer arriving without declaring itself |

⚠ **A1–A4 USE `toEqual([])` WITH A POSITIVE CONTROL RATHER THAN `not.toContain`, DELIBERATELY.**
The §31 scanner's matchers are `not.toContain | not.toMatch | not.toHaveProperty`, and
`tests/domain/habitCurve.test.js` sits at **ceiling ZERO** (absent from both
`FROZEN_UNANCHORED_NEGATIVES` and `READMITTED_GENERATION_FACING` — executed). Choosing a
non-scanned matcher form means **no new anchor is owed**, and that is a design choice recorded
rather than an accident. Any `not.*` an implementer adds instead **must** carry
`// anchored: <why this cannot go vacuous>` on the assertion line or the line immediately above it
(⚠ for a multi-line comment only the LAST line counts) — the idiom this file already demonstrates
at `:188-191`.

---

## 7. Wave-specific mutants — each convicting, each restored digest-exact

⚠ ⛔ **NO `scripts/mutation-coverage-manifest.json` ROW IS OWED OR PERMITTED** (§5.1) — the target
test file is not enumerated, so a row would red the no-stale-entries case. The mutants below are
**executed plants proving the four cases convict**, recorded in the execution receipt.

| # | Mutant | Must RED |
|---|---|---|
| **M-1** | Raise `HABIT_ROWS_PER_ACTOR_CAP` to 132 (the structural product) | **A2** — eviction becomes unreachable |
| **M-2** | Re-spell `PLEDGE_MAX_AGE_WEEKS` as the literal `208` | **A3** — 208 is a member of no ladder ⭐ **and this is the mutant that proves A3 pins the RELATIONSHIP; a literal pin on 156 would pass it** |
| **M-3** | Replace the positional index with the spelled rung word `'a_few_years'` | **A2's second arm** — the value is unchanged, so only the raw-source scan can see it |
| **M-4** | Make `PLEDGE_BOOK_CAP` a float (e.g. `256.5`) | **A1** — an integer-domain quantity silently fractional |
| **M-5** | Transcribe A2's denominator as the literal `132` instead of deriving it | **A2's guard-the-guard** — a transcribed denominator cannot detect a vocabulary that grew |
| **M-6** | Delete the positive control from A2's rung scan | **A2** — proves the scan is live rather than an emptied absence |
| **M-7** | Add a second `Math.round(` to `habitCurve.js` | the landed rounding-door pin (`:232`) — proves §5.2 constraint 1 is machinery, not advice |

**Restore discipline:** sha256 the target → save a pristine copy → apply an EXACT substitution →
assert the bytes CHANGED → run the convicting file bare → restore → `cmp` **and** sha256 again.
⚠ **Afterwards `git status --porcelain` must return 0 lines and no pristine sidecar may survive.**
⭐ **A COUNT MUTANT ON A LITERAL GOES VACUOUS — mutate the DERIVATION, never the recorded number**
(which is exactly what M-5 exists to prove).

---

## 8. The checks — bare, in-shell, unpiped, each `; echo TRUE_EXIT=$?`

```
# §31 ANCHOR PREFLIGHT — MANDATORY, BEFORE ANY GREEN IS DECLARED (ceiling ZERO on the target file)
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?

# b1 — the curve battery, this member's own target (base: 8 passed → 12 passed)
npx vitest run tests/domain/habitCurve.test.js ; echo TRUE_EXIT=$?
# b2 — the sibling battery and the two band walkers, all EXPECTED UNMOVED
npx vitest run tests/domain/habitVocabulary.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/habitBandsReconciliation.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/spBandFamilies.walker.test.js ; echo TRUE_EXIT=$?
# b3 — the registration walker: the existing habitCurve row must NOT drift
npx vitest run tests/lint/couplingInclusion.walker.test.js ; echo TRUE_EXIT=$?
# b4 — the mutation-manifest totality (proving NO row is owed)
npx vitest run tests/lint/mutationCoverageManifest.test.js ; echo TRUE_EXIT=$?

# THE STOP INSTRUMENTS (§P7) — each a STOP on movement, not a re-freeze
node scripts/check-tuning-bands.mjs            ; echo TRUE_EXIT=$?   # MUST stay 9 ratified bands
node scripts/check-observed-shape-readers.mjs  ; echo TRUE_EXIT=$?   # MUST stay 1998
node scripts/implementation-packets.mjs validate ; echo TRUE_EXIT=$?

# THE TWO TYPECHECKERS, EACH NAMED WITH ITS CONFIG AND ITS WINDOW (per-file tsc is a vacuum)
npm run typecheck:ratchet       ; echo TRUE_EXIT=$?   # 173/173,   tsconfig.full.json
npm run typecheck:domain:strict ; echo TRUE_EXIT=$?   # 1134/1134, tsconfig.domain-strict.json

# ⚠ THE CENSUS IS EXPECTED **RED** AT THIS COMMIT — see §9 R3. Do not cure it here.
```

⛔ **Never read a gate through a pipe.** `npm run check | tail` reports the PIPE's status and has
greenwashed red gates twice. ⛔ **Never wrap `npm run check*` in `gate-mutex.sh --run`** —
`test:ratchet` re-acquires and self-deadlocks; **exit 3 is the mutex giving up, NOT a red.**

---

## 9. Declared census movement (J-TE3-1 — BY FIGURE)

### 9.0 · ⛔⛔ THE VALIDATOR SEQUENCE, RESTAMPED UNDER `CR-HB2B-SPLITP` (OQ §44)

**`R35`, measured by Lane TE10 and ratified at OQ §44:** `implementation-packets.mjs:498` sets
`reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(status)`, and only `LANDED` and
`SUPERSEDED` are terminal — so **two non-terminal packets may never name one change path.**
⚠ **`DRAFT` reserves exactly as `READY` does**, so demoting a member is not an escape. Both
members lawfully name `tests/domain/habitCurve.test.js`, so the train promotes in **TWO** steps.
⭐ This is not a new law: `INDEX.md`'s CENSUS-HOLDER RULE already states it in writing
(*"The validator forbids two non-terminal packets naming one change path"*); the prior compile
contradicted a landed rule, which is why §44 ratified the STOP rather than the compile.

| Commit | Manifest | This member | M2 |
|---|---|---|---|
| base | `42 / 0 READY` | absent | absent |
| **P1a** | **`43 / 1 READY`** | **READY** | absent (its file is on disk at `DRAFT`, in neither index nor manifest, so the validator does not see it) |
| **I1** | `43 / 1 READY` | READY | absent |
| **P1b** | **`44 / 1 READY`** | **LANDED** | READY |
| **I2** | `44 / 1 READY` | LANDED | READY |
| **T** | **`44 / 0 READY`** | LANDED | LANDED |

⛔ **THE FLIP TO `LANDED` AT P1b IS SAFE FOR THIS MEMBER SPECIFICALLY, AND THE REASON IS
MEASURED:** `CREATE` existence is asserted **only** at `LANDED` (`:534`), and this member has
**ZERO `CREATE` rows** — its manifest is one `MODIFY` and one `TEST`, both of files that already
exist. The flip therefore asserts nothing that is not already true at I1.

⚠ **THE VALIDATOR IS RED AT P1a AND AT P1b, AND THAT IS `R1`, NOT `R35`.** `requiredSymbols` is
checked at **every** status (`:574-581`), so a promotion always reds on the symbols its own
implementation commit is about to write. ⛔ **`R1`'s rows come from `requiredSymbols`, NEVER from
the `CREATE` manifest** — a `CREATE` row is explicitly *"a promise"* before it lands. Each
promotion's rows are discharged by the implementation commit that follows it.

### 9.1 · The figures

| Figure | Base (executed at `e5ecc83d`) | At I1 (this member) |
|---|---|---|
| `lightingCensus` `titles` | **20081** | ⛔ **RED — live 20085.** Cured WHOLE at I2, never patched |
| `lightingCensus` `files` / `parked` / `credited` | `2425` / `366` / `2059` | **all unmoved** — no test FILE is created |
| `lightingCensus` `suiteTitles` | 5650 | ⚠ **NEVER EXECUTES at I1** — the census is SEQUENCED and stops at `titles`; a green here would be a green that never ran |
| `runtimeTests` | 28104 | 28108 (a FLOOR, transcribed at T, never predicted) |
| soak bands | **9 ratified** | ⭐ **9 — the band census does NOT move** |
| `osrFindings` | 1998 | **1998** — this member reads no world |
| `HABIT_DARK_CLOSURE` | 3 | **3** — no `src/` file is created |
| habit-family file count (`R32`) | **2** | **2** |
| `ARGUED_ROSTER_CEILING` / `UNLAYERED_BASELINE_CEILING` | 17 / 179 | **unmoved** — no leaf minted |
| `flagManifestRows` | 18 | **18** — no flag |
| both typecheck ratchets · `frozenKnownFailures` · `titleCensus` · `killList` · `hotFiles` · `.size-baseline.json` | — | **all unmoved** |

⛔ **`parked` STAYS AT 366 BY DESIGN:** all four new titles are string LITERALS in a straight-line
registration inside an already-credited file, so door 3 keeps crediting it statically.

---

## 10. Risks and open items

| # | Risk | Disposition |
|---|---|---|
| **1** | **The three values are not the chair's** | ⛔ **BY DESIGN.** §42.2 makes them chair-signed at promotion. §4 supplies the executed derivation each signature rests on; a veto to any alternative in the plan's tables is one line |
| **2** | **The typecheckers move off `173/173` / `1134/1134`** | `HABIT_TUNING` is *"deliberately UNANNOTATED: the frozen literal's own inferred shape is the contract"*, so three new number members widen the inferred type rather than violating an annotation. ⚠ **PLAUSIBLE, NOT CONFIRMED — the compile could not execute it without editing a tracked file.** Both commands are in §8 as executor obligations; **movement is a STOP** |
| **3** | An implementer spells the half-life rung word | §4.2 / §5.2 constraint 4 — ⛔ **no walker would catch it**; A2's second arm is the machinery this wave adds |
| **4** | An implementer adds a second rounding expression | §5.2 constraint 1 — reds the landed `:232` pin. M-7 proves it |
| **5** | **Writing `docs/**.md` mints a per-claim naked-claim key** | This member authors a packet, a `PACKET_MANIFEST.json` entry and an `INDEX.md` row. Run the exact `CLAIM_RE` from `tests/docs/enforcement-claims.test.js` over every authored document **before staging**. ⚠ *"reds the gate"* is safe; the `CLAIM_RE` alternative pairing the failure verb with *"the gate"* is NOT, and neither is the zero-count absence phrase. ⛔ **THIS ROW SPELLS NEITHER, DELIBERATELY** — the scanner matches the vocabulary itself wherever it appears, so a packet warning about the phrase in the phrase's own words mints the very key it warns about. ⚠ That absence phrase additionally substring-matches its non-zero neighbours, so run the anchored expression rather than a bare search |
| **6** | The census red at I1 is mistaken for a defect | §9 — declared BY FIGURE in advance, cured whole at I2 |

**OPEN CHAIR ITEMS — three:**

1. ⛔ **`CR-HB0B-VALUES`** — sign `HABIT_ROWS_PER_ACTOR_CAP = 24`, `PLEDGE_MAX_AGE_WEEKS = 156`,
   `PLEDGE_BOOK_CAP = 256`, each derived at §4, each marked UNSOAKED. **Promotion precondition
   (§42.2's tripwire).** Alternatives priced in `laneTC10-TRAIN-PLAN.md` §4.
2. **`CR-HB0B-R33/R34`** — two volume corrections with their executed reads: the ~14 B/row unit
   error, and the 180-settlement denominator against a measured certified ceiling of 30. They join
   §42.4's queued `CR-HB1′-VOL` micro-act. *Promotion precondition (record, not decide).*
3. **`CR-HB0B-BANDGAP`** — the bands-reconciliation walker's `waveBlocks()` regex cannot see a
   letter-suffixed wave block, so such a block's bands would never reach the owner's signature.
   **Docketed for its own micro-act; not a promotion precondition for this wave**, which authors
   no volume block.

---

## 11. Mandatory implementation order

1. **P1** — promote READY alongside M2's packet; `PACKET_MANIFEST.json` entry hand-written in the
   file's own compact style (⚠ a `JSON.stringify` round-trip is not byte-identical at any indent);
   `INDEX.md` dispatch row with the declared movement BY FIGURE. **Docs-only.**
2. **I1**, in this order inside the one commit: the added import → the positional index constant →
   the three `HABIT_TUNING` members with their authored JSDoc → the four test titles.
   ⛔ **The census is NOT touched.**
3. **The §31 anchor preflight runs BEFORE green is declared**, not after.
4. **The seven mutants**, each restored digest-exact and `cmp`-verified, porcelain re-checked.
5. **The stop instruments and both typecheckers**, bare, each with its own captured exit.
6. ⛔ **NO TERMINAL GATE AT THIS MEMBER** — the train's one `check:tail` is held at M2, after I2,
   inside the executing lane's own turn.

⚠ **`git diff --name-status` at I1 must return EXACTLY the two manifest rows, and
`--diff-filter=A` exactly ZERO paths — this member creates no file.** No third path. This
reconciliation runs **before** the flip, because `validate:packets` existence-checks
`requiredSymbols` for every packet regardless of status, and a draft path spelling the landing
changed reds the validator at T.

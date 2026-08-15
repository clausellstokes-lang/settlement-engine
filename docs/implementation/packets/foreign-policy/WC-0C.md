# War Circulation / WC-0C — the law-band table's shape and its cured C3 fence

- **Status:** READY
- **Train:** `refs/trains/wc-0`, **member 3 of 4**. Plan: `laneTC14-TRAIN-PLAN.md`.
- **Chair authority:** `OWNER_DECISION_QUEUE.md` **§52 ruling 1** (the disjoint GUARD/CONTROL pools
  SIGNED as architected-and-held, after candidate 1 was refuted by its own re-sweep) and
  **§52 ruling 2** (the two measured C3 breaches at HEAD land as **FROZEN LEGACY ROWS, shrink-only,
  enumerated by exact identity — the M4 pattern; the class is closed at two, never grandfathered
  silently**). Rulings consumed: **CR-WC-8(i)** (read the estate default law word; WC signs no
  program pair) and **CR-WC-8(iii)** (*a narrowing made by SILENCE is what the estate refuses; a
  narrowing RECORDED is fine*) — the discipline chair question Q3 rests on.
- **Volume:** WC — the war-circulation owner-amendment program.
- **Family preamble, cited BY SHA-256:** `docs/implementation/preambles/WC-PREAMBLE.md`
  sha256 `5241a798e3033007721c1090c69a8fd1608475aef32aae7b7663670867f05b1f` — the bytes LANDED at `D0` (`a393b109`); unmoved since.
- **Branch:** `claude/composite-r4`
- **Verified base:** `claude/composite-r4` at `98c7872ebf3bb5a43091a5ff7d1b7918881593f0`
- **Base-state capsule:** `6b822540`; HEAD is its docs-only child, executed as exactly one
  path — **J-T1**.
- **Chain position:** member 3 of 4, on `WC-0B` landed at `4c87bae4`. ⛔ **THIS MEMBER IS
  THIRD FOR A MEASURED REASON, NOT A PREFERENCE** — see §4.3.

---

## 1. Reconciled authority

| Source | What it binds |
|---|---|
| `docs/implementation/preambles/WC-PREAMBLE.md` @ the sha above | §P0–§P11, and **§P2.4/§P2.5** in particular — the live C3 breaches and the two provably-wrong detector shapes |
| `laneWCC-cures.md` cure 3 | the cured arm, its refuted first candidate, and the six re-swept arms |
| `docs/DESIGN_FP_ARCH_WC.md` @ `c5305a82` | §3 WC-0 (the LAW-BAND TABLE FENCE signature) · §4.1.2 collision C3 · §2.2 the leaf budget · **§8.1 row 2** (the contract) |
| `laneWV-WC-SUBSTRATE.md` **R08** | the authored non-vacuity arm is unsatisfiable by construction |

---

## 2. Outcome and boundary

### 2.1 What lands

**ONE frozen table SHAPE with no values in it, and the fence that keeps it singular.**

`lawBandModulation.js` is the closed key set (`cohesion` / `relay` / `drift` / `learning`), the
three-word `lawWord` axis, throw-on-unknown, the totality export, and **`registerLawBandCurve` —
the registration entry point through which each consuming wave supplies its own curve row.**

⛔⛔ **IT CARRIES NO CURVE VALUES, AND THAT IS THE WHOLE REASON THE SHAPE LANDS SEPARATELY FROM ITS
CONTENT.** The volume corrected itself here in writing: *"an earlier drafting landed four curves in
the wave whose closing line reads 'TUNING: none', which is exactly the unsigned-constant drift THE
PROMISE's versioned-tuning carve-out exists to stop — curves are constants and constants are
owner-signature surface."* Each curve lands with its **MOVER** and enters §7.B under **that** wave:
WC-3's relay row, WC-8's cohesion row, WC-9's drift row, HABIT's learning row.

⭐ **AND THE TOTALITY PIN IS STATED IN THE DIRECTION THAT SURVIVES A PARTLY-FILLED TABLE**
(§8.1 row 2): **every REGISTERED key has a curve and every curve names a registered key — never
that the table is full at this landing.**

`tests/lint/lawBandTable.walker.test.js` is the cured C3 fence: a **GUARD** pool and a **CONTROL**
pool disjoint by construction, with the exclusion re-expressed as a **disjointness assertion**
rather than a subtraction, plus the two frozen legacy rows §52.2 ruled.

### 2.2 What it deliberately does NOT build — the non-goals, named

⛔ No curve value, no tuning key, no band, no threshold, **no number that is not a member count** ·
no consumer: nothing under `src/` calls `registerLawBandCurve` at this member · no move-vocabulary
fence (**HB-1 already shipped it** — §2.3) · no repair of the two legacy breaches (they are
**frozen and recorded**, not fixed — WC does not rewrite another volume's landed module) · no flag ·
no persisted byte · no news kind, no UI byte.

⭐ **WC-0C IS DARK-COMPLETE BY ABSENCE OF REGISTRANTS.** The table is empty, and the fence asserts
an emptiness that is legal today and tightens to exactly-one the day the WC mint has a registrant.

### 2.3 ⛔ THE PLURAL IN WC-0's LANDS BLOCK IS STRUCK

WC-0 declares **"THE TWO SINGLE-EXPORTER FENCES … These land HERE, in the registration wave."**
The move half **already landed with HB-1** as `tests/lint/strategyMoveVocabulary.walker.test.js`,
whose own manifest row 8 says it ships *"WC-0's at-most-one-exporter scan itself"*. **WC-0 lands
ONE fence.** ⛔ A WC packet carrying a `CREATE` row on that path would promote cleanly through
DRAFT and READY and **die at the flip**, because `validate:packets` existence-checks `CREATE` rows
only at `LANDED` — the most expensive place to find it. *(WV R07 / WCC cure 4, signed at §52.1.)*

**AND NO `MODIFY` ROW EITHER.** The fence is green at HEAD as landed, and the re-key WCC cure 1
architected belongs to **WC-4**, the wave that widens the union. Re-keying it here would be a change
with no motivating edit in the same commit. **A discharge record goes in this member's RECEIPT, not
its manifest**, citing HB-1 manifest row 8 and the landed walker's own header.

---

## 3. THE REFUTED PREMISES THIS MEMBER IS BUILT ON — re-executed at `fc8451c4`

### R-WC0C-1 (STOP-CLASS) — THE AUTHORED FENCE HAS **TWO** INDEPENDENT VACUITIES, NOT ONE

The volume authors (§3 WC-0, restated identically at §8.1 row 2):

```
MATCHES     /LAW_BAND[A-Z0-9_]*|[A-Z0-9_]*MODULATION_TABLE$/, plus any module
            exporting registerLawBandCurve
EXCLUDES    LAW_WORDS and LAW_WORD_EDGES (lawWord.js)
ASSERTS     at most one exporting module
NON-VACUITY the scan must FIND lawWord.js's excluded pair
```

Executed verbatim over every `export const` in `src/`:

```
AUTHORED pattern candidates: []          ← the candidate pool is EMPTY, not just the arm
AUTHORED.test('LAW_WORDS')      = false
AUTHORED.test('LAW_WORD_EDGES') = false  ← the exclusions can NEVER be found
exported registerLawBandCurve   = 0
```

**The non-vacuity arm can never pass** (the pattern cannot match its own exclusion list) **and the
EXCLUDES clause subtracts from an empty set.** The confusion is structural: the volume asked one
device — *find the exclusions* — to prove two different things, that the extractor can see
`export const` at all, and that the exclusion list is live. **Those are separable and this member
separates them.**

### R-WC0C-2 (STOP-CLASS) — THE C3 CONTRACT IS ALREADY BREACHED AT HEAD, TWICE, AND THE NAME-KEYED FENCE IS BLIND

§8.1 row 2 rules: *"ONE frozen zero-import leaf … Each consumer may carry its own CURVE ROW in the
one table; **none may carry a private table.**"* Executed:

```
src modules importing lawWord.js: 3
    src/domain/worldPulse/espionage/espionageDoctrine.js
    src/domain/worldPulse/habit/habitCurve.js
    src/domain/worldPulse/warSeatBooks.js
```

- **`habitCurve.js`** — the **first named consumer family** — carries law-word-keyed curves inside
  `HABIT_TUNING` (`LEARN_RATE`, `HALF_LIFE`, both `Object.fromEntries` over `LAW_WORD_VOLATILITY`),
  in a module with three imports. **HABIT carries a private table.**
- **`espionageDoctrine.js`** — `ORDER_EDGES {lawful, lawless}` and
  `FREQ_BY_ORDER {lawful, balanced, lawless}`, and it re-exports `LAW_WORDS` and `lawWordFor`.
  **A second private table.**

Both predate WC. **The authored fence goes GREEN over both, because it guards a NAME.**

⭐ **THE PARALLEL WITH C1 IS EXACT AND THE OUTCOME IS OPPOSITE:** for C1, HABIT built first and
minted the **shared** leaf (contract discharged); for C3, HABIT built first and minted a **private**
table (contract breached, silently).

### R-WC0C-3 — BOTH ALTERNATIVE DETECTOR SHAPES ARE PROVABLY WRONG, MEASURED

- A **key-shape** detector (an object literally keyed by ≥ 2 law words) finds **2** modules —
  `espionageDoctrine.js` and `lawWord.js` — and **`habitCurve.js` is NOT among them**, because it
  builds its map by `fromEntries` over a derived order. ⇒ **provably blind to the very breach that
  motivates it.**
- A **literal-spelling** detector finds **29** `src/` modules spelling at least one law word — the
  same foreign-vocabulary collision class HB-1 measured for moves. ⇒ **over-matches hopelessly.**

⇒ **only the import-keyed register (3 modules) is both non-blind and tractable**, which is why
§52.2's frozen-legacy-row shape is keyed on **exact module identity**.

### ⭐ AND THE FIRST CURE CANDIDATE WAS REFUTED BY ITS OWN RE-SWEEP — recorded, not hidden

Lane WCC first drew the guard pool as
`/^(?:LAW_(?:BAND|WORD)[A-Z0-9_]*|[A-Z0-9_]*MODULATION_TABLE)$/` — one pattern for both jobs, with
the exclusions subtracted. Executed, it admitted `habitCurve.js:84 LAW_WORD_VOLATILITY`: **`1 ≤ 1`
today, and `2` — reddening on the WRONG MODULE — the day the WC table lands.** Discarded after one
re-sweep. **§48.3's loop working exactly as chartered: one failure, one redesign, not blind
iteration.**

---

## 4. Verified tree contract and executed preflight receipts

### 4.1 Absence and control, executed

```
ABSENT  ✓  src/domain/worldPulse/lawBandModulation.js
ABSENT  ✓  tests/lint/lawBandTable.walker.test.js
ABSENT  ✓  tests/domain/lawBandModulationShape.test.js
PRESENT ✓  src/domain/worldPulse/lawWord.js        (LAW_WORDS :50, LAW_WORD_EDGES :56)
registerLawBandCurve exporters in src/: 0
```

### 4.2 The two pools, executed at `fc8451c4`

```
GUARD   /^(?:LAW_BAND[A-Z0-9_]*|[A-Z0-9_]*MODULATION_TABLE)$/   -> 0  []
CONTROL /^LAW_(?:WORD|BAND)[A-Z0-9_]*$/                          -> 3
    src/domain/worldPulse/habit/habitCurve.js:84  LAW_WORD_VOLATILITY
    src/domain/worldPulse/lawWord.js:50           LAW_WORDS
    src/domain/worldPulse/lawWord.js:56           LAW_WORD_EDGES
disjointness: control identifiers admitted by GUARD -> 0
```

### 4.3 The coupling preflight — **THIS MEMBER PAYS THE ARGUED-ROSTER COST**

```
HOMELESS ⛔ src/domain/worldPulse/lawBandModulation.js   (matches none of the 21 LAYER_PATTERNS)
ARGUED_UNLAYERED entries: 19    ARGUED_ROSTER_CEILING = 19       (exact .toBe, asserted :849)
UNLAYERED_BASELINE entries: 179 UNLAYERED_BASELINE_CEILING = 179 (exact .toBe, asserted :1120)
```

⚠ **THE PATTERN COUNT MOVED TWICE AND NEITHER MOVE TOUCHES THIS MEMBER'S CURE.** TC14 measured
19; `INT-3B` added an exact-path INTERIOR row (20); this train's own `WC-0A` added an exact-path
WAR row for `peopleLedger.js` (21). `lawBandModulation.js` matches none of the 21, the family
count is still 7, and both ceilings are still exact — so the argued-roster cure is unchanged.

**THE CURE, IN THIS MEMBER'S OWN COMMIT:** an `ARGUED_UNLAYERED` entry of kind `'substrate'` with a
written reason, and `ARGUED_ROSTER_CEILING` **19 → 20** in the same diff — which is precisely what
the arm demands: *"If it GREW: every admission deletes that module's edges from the pair scan, so
raise the ceiling deliberately, in this diff, with a written argument."*

⛔ **THE ARGUED ENTRY AND ITS LEAF MUST LAND IN THE SAME COMMIT.** The roster arm asserts
`expect(DOMAIN_MODULES, '<module> vanished — re-aim the exclusion').toContain(module)`, so an
argued entry for an absent module reds. **This is why `WC-0C` is member 3 and not member 1**
(train plan §4).

The argument, drafted:

> `'src/domain/worldPulse/lawBandModulation.js': { kind: 'substrate', reason: 'The law-band
> modulation table is shared VOCABULARY, not a layer\'s state: four consumer families across two
> volumes read it — HABIT\'s learning rate-decay, and WC\'s relay efficiency, block cohesion and
> drift expression — and it owns none of their subjects. It is the bandFamilies / bandedStock /
> lawWord case exactly: a module every port spells against, carrying a SHAPE and no values. Giving
> it a layer home would make every port\'s own reading of a shared table read as a cross-layer
> coupling into whichever family won the name.' }`

### 4.4 Required live symbols (existence-checked at EVERY status)

| Path | Symbol |
|---|---|
| `tests/lint/couplingInclusion.walker.test.js` | `const ARGUED_ROSTER_CEILING` |
| `src/domain/worldPulse/lawWord.js` | `export const LAW_WORDS` |

⛔ **`registerLawBandCurve` and every `LAW_BAND*` symbol are NOT cited** — this packet creates them,
and `requiredSymbols` are existence-checked at DRAFT and READY. *(TE10's banked rule, applied.)*

### 4.5 Hot files and censuses

No hot file named. Lighting census `files` **2434 → 2436 at `I3`, a NAMED interior red**, greening
at `I4` (base tuple `2431 / 364 / 2067 / 20149 / 5660` from the LIVE literal at `:4339`; `WC-0A`
carried it to 2433 and `WC-0B` to 2434; this member adds TWO files). Flag manifest rows
**20 → 20**. `UNLAYERED_BASELINE_CEILING` **179 → 179**. `ARGUED_ROSTER_CEILING` **19 → 20**.

⛔ **THE ANCHOR CEILING BINDS BOTH NEW TEST FILES (ODQ §99.2), AND THIS MEMBER IS THE ONE THE
CONSTRAINT WAS FOUND FOR.** `negativeAssertionAnchor.walker` gives every new
`tests/domain/**` or `tests/lint/**` file a ceiling of ZERO against a frozen roster of 515 files /
1557 negatives, and neither of this member's two is in it. **`WC-0C`'s source-scan fence is
precisely the shape that reaches for a bare negated-membership assertion** — which is why lane
TC17 named this member when it found the gap. Write `toEqual([])` instead; it is free. ⚠ And word
any notice about the constraint rather than quoting the scanned forms: this train's `WC-0A` was
convicted for a comment that spelled them while saying the file avoided them.

---

## 5. Exact contracts

### 5.1 The table shape

| Export | Contract |
|---|---|
| the closed key set | `cohesion`, `relay`, `drift`, `learning` — frozen, totality-exported, throw-on-unknown |
| the axis | the three `lawWord` words, and **no fourth word ever** (§8.1 row 2: *"`lawWordFor`'s three words are the only vocabulary it may key on"*) |
| `registerLawBandCurve` | the entry point; each consuming wave supplies its own curve row |
| the totality pin | **every REGISTERED key has a curve and every curve names a registered key** — never that the table is full |

**Budget ≤ 60 eff** (§2.2; cap 250).

### 5.2 The cured fence — five arms, each doing exactly one job

```js
/** THE GUARD POOL — the curve table this fence exists to keep singular. */
const GUARD = /^(?:LAW_BAND[A-Z0-9_]*|[A-Z0-9_]*MODULATION_TABLE)$/;
/** THE CONTROL POOL — the same DECLARATION SHAPE in the same neighbourhood, chosen because it is
 *  provably non-empty. It proves the EXTRACTOR is alive; it is not a filter and nothing is
 *  subtracted from it. */
const CONTROL = /^LAW_(?:WORD|BAND)[A-Z0-9_]*$/;

// ARM 1 — the guard pool, asserted against a NAMED empty list (the volume's own law: "with
//         toEqual against a named list, never a bare `<= 1`", so a signature gone blind reads
//         as an empty list rather than a pass)
expect(exportingModules(GUARD)).toEqual([]);
// ARM 2 — EXTRACTOR LIVENESS: same extractor, same shape, a pool that is not empty
expect(exportingModules(CONTROL)).toContain('src/domain/worldPulse/lawWord.js');
expect(identifiers(CONTROL).length).toBeGreaterThanOrEqual(2);
// ARM 3 — DISJOINTNESS: this is what "EXCLUDES LAW_WORDS / LAW_WORD_EDGES" actually meant
for (const id of identifiers(CONTROL)) expect(GUARD.test(id)).toBe(false);
// ARM 4 — a planted SECOND exporter reds
// ARM 5 — ONE planted exporter (the WC mint) is still green under at-most-one
```

⭐ **COUNTING IS BY MODULE, NOT IDENTIFIER** — the volume's own word at §8.1 row 2, and the unit the
move half of the twin fence got wrong. It matters concretely: **WC-8's `LAW_BAND_COHESION_CURVE`
and WC-9's `LAW_BAND_DRIFT_CURVE` are two identifiers in ONE module**, and a match-counting fence
would red on them.

⚠ **THE CONTROL POOL IS ASSERTED WITH `toContain`, NOT `toEqual`** — deliberately, and the
measurement is the argument: `LAW_WORD_VOLATILITY` is a third neighbourhood member no WC author
knew about, and HB-2B moved its address under the substrate sweep. **An exact control pin would
have red on an unrelated family's landing.** *(Vetoable — inherited J-WCC-2.)*

### 5.3 The two frozen legacy rows (§52 ruling 2)

```js
/** THE C3 LEGACY SET — CLOSED AT TWO, SHRINK-ONLY, BY EXACT MODULE IDENTITY.
 *  §8.1 row 2's contract ("none may carry a private table") was breached before WC existed, by
 *  two modules a NAME-keyed fence cannot see. They are recorded rather than repaired: WC does not
 *  rewrite another volume's landed module, and a breach that is enumerated is not a breach that is
 *  hidden. ⛔ NOTHING JOINS THIS LIST. A third private table is a STOP and a chair question, never
 *  a third row. */
const C3_LEGACY = Object.freeze([
  'src/domain/worldPulse/habit/habitCurve.js',             // HABIT_TUNING.LEARN_RATE / .HALF_LIFE
  'src/domain/worldPulse/espionage/espionageDoctrine.js',  // ORDER_EDGES / FREQ_BY_ORDER
]);
const C3_LEGACY_CEILING = 2;   // EXACT, both directions — see the chair question
```

**AND THE CEILING IS EXACT IN BOTH DIRECTIONS**, on the estate's own twice-learned reason: *"a bound
that only forbids growth lets a shrink go unbanked and leaves free slots behind it."* If a legacy
table is later dissolved, the win is **banked in the diff** rather than becoming invisible headroom.
*(Chair question Q4 in the train plan.)*

---

## 6. Exact FOUR-path manifest — four handwritten, zero generated

| # | Action | Path | Budget |
|---:|---|---|---|
| 1 | `CREATE` | `src/domain/worldPulse/lawBandModulation.js` | ≤ **60 eff** (§2.2; cap 250). **ZERO curve values** |
| 2 | `CREATE` | `tests/lint/lawBandTable.walker.test.js` | 1 `describe` + **5** `it` — the lane's proposed spelling *(vetoable — inherited J-WCC-5; the volume names no path)* |
| 3 | `CREATE` | `tests/domain/lawBandModulationShape.test.js` | 1 `describe` + **3** `it` |
| 4 | `TEST` | `tests/lint/couplingInclusion.walker.test.js` | the `ARGUED_UNLAYERED` entry **and** `ARGUED_ROSTER_CEILING` 19 → 20. **ZERO new titles** |

**Handwritten 4 of 12. New production leaves 1 of 2. Feature flags 0 of 1. Acceptance cases 8 of 8
— AT CAP.**

⛔ **NOT IN THIS MANIFEST:** `tests/lint/strategyMoveVocabulary.walker.test.js` (**HB-1's** — §2.3)
· `src/domain/worldPulse/habit/habitCurve.js` and `espionage/espionageDoctrine.js` (**frozen and
recorded, not repaired**) · `simulationRules.js` (no flag) ·
`.coupling-unlayered-baseline.json` (**forbidden**).

---

## 7. Ordered coding sequence

1. `lawBandModulation.js` — key set, axis, throw-on-unknown, totality export,
   `registerLawBandCurve`. **⚠ Its ONLY import is `LAW_WORDS` from `lawWord.js`** (chair Q3): the
   alternative re-spells the three words and mints a second law-word list. Record the narrowing of
   §8.1 row 2's "zero-import" clause in the file's own header — **a narrowing by silence is what
   the estate refuses; a narrowing recorded is fine** (CR-WC-8(iii)).
2. `tests/domain/lawBandModulationShape.test.js`.
3. `tests/lint/lawBandTable.walker.test.js` — the five arms and the frozen legacy set.
4. The `couplingInclusion` argued entry **and** the ceiling bump, **in the same hunk**.
5. The §P3 anchor preflight.

---

## 8. Acceptance matrix — exactly eight titles, two files, one `describe` each

| # | File | Case |
|---|---|---|
| C1 | `lawBandTable.walker` | **ARM 1** — the GUARD pool is asserted `toEqual` against a NAMED empty list; zero exporting modules is the legal state today, and a bare `<= 1` is refused because a signature gone blind must read as an empty list rather than a pass |
| C2 | `lawBandTable.walker` | **ARM 2, EXTRACTOR LIVENESS** — the same extractor over the CONTROL pool finds `lawWord.js` and at least two identifiers, so the scan is proved able to see `export const` at all *(the job the authored non-vacuity arm could never do)* |
| C3 | `lawBandTable.walker` | **ARM 3, DISJOINTNESS** — no CONTROL identifier is admitted by GUARD; this is what "EXCLUDES `LAW_WORDS` / `LAW_WORD_EDGES`" actually meant, expressed as an assertion instead of a subtraction from an empty set |
| C4 | `lawBandTable.walker` | **ARMS 4 + 5** — a planted SECOND exporting module reds, and ONE planted exporter (the WC mint) is still green under at-most-one; counting is **by MODULE**, so two `LAW_BAND_*` identifiers in one module stay green |
| C5 | `lawBandTable.walker` | **THE FROZEN LEGACY SET** — exactly the two named modules, matched by exact identity, at `C3_LEGACY_CEILING`; a third module importing `lawWord.js` and declaring a law-word-keyed table reds by name rather than being absorbed |
| C6 | `lawBandModulationShape` | the key set is frozen, totality-exported and throws on an unknown key; the axis is the three law words and a fourth word throws |
| C7 | `lawBandModulationShape` | ⭐ **THE TABLE IS EMPTY AND THAT IS ASSERTED, NOT ASSUMED** — zero curve values are declared anywhere in the module, so "TUNING: none" is a measurement rather than a claim |
| C8 | `lawBandModulationShape` | the totality pin in its survivable direction: **every registered key has a curve and every curve names a registered key**; registering an unregistered key throws, and the pin does not require the table to be full |

⛔ ONE literal `describe` per file, straight-line `it` calls, string-literal titles. **No `.each`,
no `describe.runIf`, no nesting.**

⚠ **C1, C3 and C7 ARE NEGATIVES AND EACH OWES AN ANCHOR** (§P3). ⚠⚠ **C1 IS THE FAMILY'S SHARPEST
VACUITY RISK**: an emptiness pinned against a pool that is empty *for the wrong reason* is exactly
R-WC0C-1's defect wearing a cure's clothes. **C2 is C1's control and they must red independently** —
if breaking the extractor greens C1, the arm is measuring nothing.

---

## 9. Mutation proof — five disposable mutants

| # | Plant | Must convict |
|---|---|---|
| M1 | a second module exporting `LAW_BAND_RELAY_TABLE` | C4 |
| M2 | break the extractor (make `exportingModules` return `[]` unconditionally) | **C2 — and C1 must NOT green through it**; this is the arm that proves the cure is not the defect |
| M3 | add `LAW_BAND_*` to the CONTROL regex so the pools overlap | C3 |
| M4 | a third module importing `lawWord.js` with a law-word-keyed literal table | C5 |
| M5 | land one curve value in `lawBandModulation.js` | C7 — ⭐ the mutant that keeps "TUNING: none" honest and enforces THE PROMISE's carve-out mechanically |

Each planted, convicted, restored **digest-exact**.

---

## 10. Focused verification — exact argv

```
npx vitest run tests/lint/lawBandTable.walker.test.js tests/domain/lawBandModulationShape.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/couplingInclusion.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?
npx eslint src/domain/worldPulse/lawBandModulation.js tests/lint/lawBandTable.walker.test.js tests/domain/lawBandModulationShape.test.js ; echo TRUE_EXIT=$?
```

⛔ Bare, fresh shell, never wrapped in `gate-mutex.sh --run`, outlasted in your own turn.

**EXPECTED AT `I3`:** both new files GREEN · `couplingInclusion.walker` **GREEN** (the argued entry
and its leaf land together — train plan §4) · `negativeAssertionAnchor.walker` **GREEN** ·
`sovereigntyLightingContract.walker` **RED on `files` (2436 vs 2431) — NAMED**, greening at `I4`.

⛔⛔ **A RED BATTERY TRUNCATES THIS TRAIN; BANKING HAS NO DOOR** (§97.2 / §99.2).

---

## 11. Wave-specific hazards, coupling and OSR

- **COUPLING BILL: ONE ARGUED ROW, ZERO PAIRS.** `lawBandModulation.js`'s only import is
  `lawWord.js`, itself an `ARGUED_UNLAYERED` substrate module whose edges are deleted from the pair
  scan ⇒ **zero cross-layer pairs, zero registry rows.** `ARGUED_ROSTER_CEILING` 19 → 20;
  `UNLAYERED_BASELINE_CEILING` untouched. ⛔ **VERIFY-AT-BUILD: run the walker; any pair is a
  source-repair STOP, never a registry edit.**
- **OSR: verify-at-build at 1998.** A new finding is a STOP, never a `--write`.
- ⚠ **THE `codeOnly()` ADDRESS-LOSS DEFECT IS INHERITED, NOT INTRODUCED.** The landed HB-1 walker's
  `codeOnly()` writes `^\s*` before the import blanker and `\s` matches newlines, so the mask eats
  blank lines (measured: `convergence.js` 1414 → 1341) and the blob stops being line-addressable.
  ⛔ **This fence reports `file:line`, so it MUST use a line-preserving mask and MUST assert that
  the line count survives it.** Docketed for infra as HB-1's own one-character fix; **not proposed
  as a WC edit** (inherited J-WCC-8).
- ⚠ **`registerLawBandCurve` HAS NO CALLER AT THIS MEMBER, AND ARM 5 IS THE PROOF THE FENCE STILL
  WORKS WHEN IT DOES.** A fence whose only observed state is "zero" has never been shown to
  distinguish one from two; C4 plants both.

---

## 12. Completion receipt and STOP conditions

The receipt records: the two executed pool measurements, the refuted first candidate and why it was
discarded, `lawBandModulation.js`'s measured effective lines against its 60-eff budget, the
zero-curve-values assertion, the eight titles, the five mutants with convictions and digest-exact
restores, the coupling walker's green with `ARGUED_ROSTER_CEILING` at 20, the **named** census red,
and the **discharge record** for the move-vocabulary half citing HB-1 manifest row 8.

**STOP on:** any curve value entering `lawBandModulation.js` · the leaf needing a second import ·
a third C3 legacy module · the argued roster refusing the admission · a new OSR finding · a
`couplingInclusion` pair · the fence's arms proving unable to red independently (a cure that cannot
be reddened is the defect it replaced).

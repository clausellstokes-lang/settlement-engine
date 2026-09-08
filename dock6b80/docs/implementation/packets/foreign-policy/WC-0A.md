# War Circulation / WC-0A — the closed vocabularies (`peopleLedger.js` + `warStance.js`)

- **Status:** LANDED
- **Train:** `refs/trains/wc-0`, **member 1 of 4**. Plan: `laneTC14-TRAIN-PLAN.md`.
- **Chair authority:** `OWNER_DECISION_QUEUE.md` **§52** (the four WC cures signed; WC-0
  compile-ready) and **§48** (the cure-architecture doctrine), plus this train plan's §1
  refusal-in-part, which the chair signs at the `wc-0` sitting as **Q1**.
  Rulings consumed, not re-argued: **CR-WC-2** (the people ledger is COUNTS, not names) and
  **CR-WC-20** (a cohort is a TAG on census, never a disjoint pool).
- **Volume:** WC — the war-circulation owner-amendment program.
- **Family preamble, cited BY SHA-256** (the §P-header citation law):
  `docs/implementation/preambles/WC-PREAMBLE.md` sha256 `5241a798e3033007721c1090c69a8fd1608475aef32aae7b7663670867f05b1f`
  ⚠ The git blob id is a different digest and is **not** what the citation law demands. This digest
  is computed over the bytes LANDED at `D0` (`a393b109`), not over the scratchpad draft.
- **Branch:** `claude/composite-r4`
- **Verified base:** `claude/composite-r4` at `98c7872ebf3bb5a43091a5ff7d1b7918881593f0`
  (TC14 compiled at `fc8451c4`; lane TC17 re-based to `4f2d37d1`; `eff-1b` then carried the base
  here docs-only. **Six figures moved across that window and are re-derived in §4; the contract in
  §5 and the manifest in §6 are unchanged.**)
- **Base-state capsule:** `6b822540`; HEAD is its **docs-only child** — executed at this lane:
  `git diff --name-only 6b822540 98c7872e` returns **exactly one path**,
  `docs/implementation/BASE_STATE.json` itself — so the capsule is citable as executed under its
  `consumptionLaw` / chair judgment **J-T1**, more tightly than at either earlier base. Every row
  this manifest touches is re-executed in §4 regardless.

---

## 1. Reconciled authority

| Source | What it binds |
|---|---|
| `docs/implementation/preambles/WC-PREAMBLE.md` @ the sha above | §P0–§P11 in full: the volume's staleness warning, the four WC-era refutations, the twelve hazard dispositions, the anchor preflight, the registration template, the gate and census law, mutant hygiene, the twelve STOP conditions |
| `docs/implementation/PACKET_STANDARD.md` | statuses, dispatch lifecycle, **the default hard scope budget**, hot-file law, STOP conditions, completion receipt, train landings |
| `docs/DESIGN_FP_ARCH_WC.md` @ `c5305a82` | §0.2 the conservation constitution · §1.2 the stance ladder · §2.2 the leaf budgets · §3 WC-0 · §7.A.1 `WAR_STANCE_LADDER` · §7.A.4 the people ledger · §7.E the walker inventory |
| `laneWV-WC-SUBSTRATE.md` | **the 36 refutations BIND**; §0.2's internal vocabulary arities are among the annex's MEASURED-TRUE rows |
| `WC_CHAIR_RULINGS.md` (ledger branch, `4aae432f`) | CR-WC-2, CR-WC-20 |

⛔ **Where this packet and the volume disagree, the EXECUTED measurement in §3/§4 wins and the
volume is docketed.**

---

## 2. Outcome and boundary

### 2.1 What lands

**The two closed vocabularies every later WC wave reads, and nothing else.**

`peopleLedger.js` is the conservation constitution made executable: the frozen pools, the residency
tags, the fifteen counting events, the four tag events, the declared sinks and the one declared
source, the three tag selections, and the `EVENT_SIGNATURES` object **the walker and the movers
BOTH read** — never a fixture mirror. WC-6's conservation walker derives its checks from this same
frozen object, which is why a mover that diverges from the law reds instead of drifting.

`warStance.js` is the five-rung ladder with its explicit **rank map** (the `TAP_DEPTH` lesson:
semantic order is carried by a rank map wherever order matters, never by array position), plus
`warStanceOf` and `stanceScalars`.

⭐ **AND THE DERIVED BLOCK-TOUCHING SET IS DERIVED, NOT LISTED.** §7.A.4 is explicit: the share,
blend, comradeship and drift integrals update on every `COUNT_EVENT` whose signature names the
`block` pool on either side, **computed at module load off `EVENT_SIGNATURES`.** A hand-kept second
list beside the object is the two-arity failure §7.A.8's own sibling correction closes.

### 2.2 What it deliberately does NOT build — the non-goals, named

⛔ No writer of any kind · no ledger, no `setSpatialLedger` call, no persisted byte · **no feature
flag** and **no certification row** (§P1 R-WC0-1) · no `spatialUsage` row (§P1 R-WC0-2) · no
consumer: nothing under `src/` imports either leaf at this member · no conservation walker (WC-6) ·
no arrival ledger (WC-1) · no stance derivation over live deployments (WC-2) · no curve, no band,
no threshold, **no number that is not an enumerated member of a vocabulary this packet lands** · no
migration, no golden re-record, no soak, no news kind, no Herald desk, no UI byte.

⭐ **WC-0A IS DARK-COMPLETE BY ABSENCE OF CALLERS.** Two modules land; nothing in `src/` calls
either. A call-path spy pins that rather than asserting it (the HB-2 `writeHabits` precedent).

### 2.3 What it inherits from the train plan's refusal

WC-0 as chartered also landed `lawBandModulation.js`, `contributionLedger.js`, the column-class
union, the catalog rows, two flags and three `spatialUsage` rows in one wave. Four executed
refutations split it (train plan §3). **This member is the vocabulary slice alone, and its landing
releases none of the others.**

---

## 3. THE REFUTED PREMISES THIS MEMBER IS BUILT ON

### R-WC0A-1 (STOP-CLASS) — `peopleLedger.js` MATCHES NO LAYER FAMILY, AND BOTH DOORS ARE AT EXACT CEILINGS

Re-executed at `98c7872e` by this lane (TC14 measured 19 regexes at `fc8451c4`; `INT-3B` added a
twentieth): `peopleLedger.js` matches **none** of the **20** `LAYER_PATTERNS` regexes across the
unchanged **7** families; `.coupling-unlayered-baseline.json` holds exactly **179** entries against
`UNLAYERED_BASELINE_CEILING = 179` (`.toBe`, asserted `:1120`); `ARGUED_UNLAYERED` holds exactly
**19** against `ARGUED_ROSTER_CEILING = 19` (`.toBe`, asserted `:849`). A baseline row is forbidden
outright.

⭐ **AND THE MOVED FIGURE IS AN ARGUMENT FOR THIS MEMBER'S CURE, NOT A PROBLEM FOR IT.** The
twentieth regex is `INT-3B`'s exact-path `/^src\/domain\/worldPulse\/emigreErrand\.js$/` in
INTERIOR, landed one wave after TC14 compiled — an exact-path family home taken for a
subject-owning leaf, with the argued roster explicitly refused for it. **The shape this member is
about to take is now landed precedent rather than argument.**

**THE CURE, IN THIS MEMBER'S OWN COMMIT:** `LAYER_PATTERNS.WAR` gains the exact-path regex

```js
    // WC-0A: the people ledger. Where the people a war moves actually ARE — the pools, the
    // events and the conservation identity WC-6's walker derives its checks from — is WAR's own
    // subject, so the leaf takes WAR whatever noun it is named after, on exactly the reading that
    // gave secondOrderBelief.js INFO and strategicPosture.js INTERIOR: the distinction is
    // SUBJECT, not program. It is NOT an ARGUED_UNLAYERED case — the roster is for modules that
    // own no subject and are spoken by every port, and this one owns people-conservation
    // outright. A family home is what will force WC-13's absorption market and WC-15's cohorts to
    // register their couplings instead of reading across a port in silence.
    // ⛔ AN EXACT-PATH REGEX, NOT A `people[A-Z]` PREFIX: a prefix would claim files nobody has
    // designed and silently widen a frozen family (the IN-1 precedent, verbatim).
    /^src\/domain\/worldPulse\/peopleLedger\.js$/,
```

`warStance.js` needs nothing: `/^src\/domain\/worldPulse\/war[A-Z]/` claims it the day it lands
(re-measured at this base). ⇒ **`UNLAYERED_BASELINE_CEILING` 179 → 179 and `ARGUED_ROSTER_CEILING`
19 → 19 for this member.**

⚠ **THE PATTERN EDIT IS SAFE AT `I1` WHILE ITS TARGET IS BEING CREATED IN THE SAME COMMIT, AND
WOULD BE SAFE EVEN IF IT WERE NOT** — checked, not assumed: no arm requires a pattern to match
anything (`Object.keys(LAYER_PATTERNS)).toHaveLength(7)` counts FAMILIES, not regexes;
`LAYER_FLOORS` are lower bounds, re-read at this base as
`WAR 52 · TRADE 30 · FAITH 8 · POP 19 · INFO 13 · GRAMMAR 42 · INTERIOR 34`; `DOUBLE_CLAIMED`
cannot be violated by an empty regex). **The regex joins an EXISTING family's array, so the
family-count arm cannot move.**

### R-WC0A-4 ⛔ EVERY NEW `tests/domain/**` FILE STARTS AT ANCHOR CEILING ZERO — the gap TC14's plan named nowhere

`tests/lint/negativeAssertionAnchor.walker.test.js` scans `not.toContain(` / `not.toMatch(` /
`not.toHaveProperty(` across `tests/**`, exempting only `tests/generators|joins|simulation|property`,
against a `FROZEN_UNANCHORED_NEGATIVES` roster re-measured at this base as **515 file rows / 1557
negatives**. ⛔ **Neither of this member's two new files is in that roster, so each starts at
ceiling ZERO.** The walker is invisible to a focused run of the acceptance files, which is exactly
how a lane that would not have looked discovers it at the terminal gate instead.

**THE CURE IS A CONSTRAINT AND IT IS FREE:** each new file either writes **none** of the three
scanned forms — `toBe(0)`, `toEqual([])`, `toHaveLength(0)`, `not.toBe`, `not.toEqual` are **all
free** — or carries `// anchored:` as the **LAST line of the comment block immediately above** the
assertion, never inline. **The walker joins this member's focused battery** (§10). Lane TC17's
finding, adopted as a packet constraint on all four members at ODQ §99.2.

### R-WC0A-2 — THE VOLUME'S §7.A.4 IS A DESIGN, AND ONE OF ITS ARITIES IS A LAW ABOUT THE OTHERS

`CENSUS_DEBITING` (`['dispatch','enlist','mortality','muster']`) is not a fifth vocabulary; it is
the **subset of `COUNT_EVENTS` carrying a TAG ARM in `EVENT_SIGNATURES`**, and §7.A.4 makes the
membership a **module-load** obligation: *"Each arm's selection is a REQUIRED `TAG_SELECTIONS`
member and an absent or unknown one fails at MODULE LOAD."* ⇒ the throw is at load, not at first
muster, and the packet's planted-fourth-selection negative must therefore be a **module-load**
negative, not a call-site one.

### R-WC0A-3 — TWO SIGNATURES ARE INTRA-POOL AND A POOL-LEVEL LAW CANNOT SEE THEM

§7.A.4 names it and this member freezes it: `defect` is `block → block'` and `merge` is
`free_unit → free_unit'`, so the pool sums do not move and **a pool-level-only walker would pass
over a merge that silently dropped a block.** `EVENT_SIGNATURES` carries the KEY-level arm for both,
so WC-6 derives the right check rather than inventing it.

---

## 4. Verified tree contract and executed preflight receipts

### 4.1 Base state

`git status --porcelain` empty at dispatch; `HEAD = 98c7872e`; volume blob `c5305a82` — re-read at
this base and **byte-identical** to the blob lane WV swept, lane WCC cured, lane WCF stamped and
lane TC14 compiled against, so every WV/WCC/WCF/TC14 line reference into the volume carries.
`scripts/implementation-packets.mjs` is likewise unmoved at `4109c9e3`.

### 4.2 Absence, executed at `98c7872e`

```
ABSENT ✓  src/domain/worldPulse/peopleLedger.js
ABSENT ✓  src/domain/worldPulse/warStance.js
ABSENT ✓  tests/domain/peopleLedgerVocabulary.test.js
ABSENT ✓  tests/domain/warStanceLadder.test.js
```

### 4.3 Hot files — measured with eslint's own `Linter`, `max-lines { skipBlankLines, skipComments }`

| File | Capsule | Re-read at `98c7872e` | In this manifest? |
|---|---:|---:|---|
| `convergence.js` | 798/800 | **798** | ❌ NO |
| `peaceTerms.js` | 797/800 | **797** | ❌ NO |
| `informationStatecraft.js` | 780/800 | **780** | ❌ NO |
| `OutputContainer.jsx` | 599/600 | — | ❌ NO |

**This member names no hot file and no file with a `scripts/.size-baseline.json` row.**

### 4.4 Required live symbols (navigate by symbol, never by line)

`requiredSymbols` are existence-checked at **EVERY** status, so this packet cites only symbols that
exist at base — never the ones it is about to create:

| Path | Symbol |
|---|---|
| `tests/lint/couplingInclusion.walker.test.js` | `const LAYER_PATTERNS` |
| `tests/lint/couplingInclusion.walker.test.js` | `const UNLAYERED_BASELINE_CEILING` |

### 4.5 Censuses this member moves

| Figure | At base (`98c7872e`) | After `I1` (a NAMED interior red) | At `T` |
|---|---|---|---|
| lighting census `files` | **2431** | **2433 — RED, named** (the tuple is re-derived WHOLE at `I4`) | **2437** |
| `ARGUED_ROSTER_CEILING` | 19 | 19 | 20 (`WC-0C`'s, not this member's) |
| `UNLAYERED_BASELINE_CEILING` | 179 | **179** | 179 |
| flag manifest rows | 20 | **20** | 20 |
| typecheck ratchets | 173/173 · 1134/1134 | **unchanged** — two new domain files at zero error allowance | unchanged |
| `negativeAssertionAnchor` roster | 515 files / 1557 negatives | **unchanged** — neither new file writes a scanned form | unchanged |

⚠ **THE BASE TUPLE IS `2431 / 364 / 2067 / 20149 / 5660`, READ FROM THE LIVE LITERAL AT
`sovereigntyLightingContract.walker.test.js:4339`.** ⛔ The walker carries a long stack of
ancestry-pin COMMENTS holding superseded tuples; a first-match parse of `files:\s*\d{4}` returns
`2412/365/2047/19984/5638` from the GR-4d comment at `:4038` and is WRONG. **Re-derive by running
the walker, never by grepping the file** — and any figure quoted from a grep names its line number
so a reader can see whether it sits in a comment.

---

## 5. Exact contracts

### 5.1 The vocabularies, frozen, totality-exported, throw-on-unknown

Every arity below is the volume's own enumerated member list, transcribed — **this member authors
no number.**

| Export | Members | Note |
|---|---|---|
| `POOLS` | `block`, `census`, `column`, `free_unit` | codepoint-sorted; order-free |
| `RESIDENCY_TAGS` | `cohort`, `free_lance` | **labels on census members, NOT pools** (CR-WC-20). A person carries at most one `cohort` and optionally the `free_lance` overlay |
| `COUNT_EVENTS` | `arrival`, `arrive_home`, `defect`, `depart`, `dispatch`, `dm_removed`, `enlist`, `fell`, `fission`, `merge`, `mortality`, `muster`, `orphan`, `rejoin`, `shed` | codepoint-sorted; `return` was SPLIT into `depart` + `arrive_home` because *"a two-hop row in a one-debit-one-credit table is a law that exempts itself"* |
| `CENSUS_DEBITING` | `dispatch`, `enlist`, `mortality`, `muster` | the subset carrying a TAG ARM |
| `TAG_EVENTS` | `brigand`, `demobilize`, `reclass`, `untag` | move no counts; **named anyway, because an unnamed branch is how a defect hides** |
| `SINKS` | `fell`, `mortality`, `dm_removed` | the identity subtracts exactly these |
| `SOURCES` | `birth` | exported **BESIDE `SINKS` in the SAME frozen object**; `birth`'s signature is SOURCE → census and it carries **NO TAG ARM** |
| `TAG_SELECTIONS` | `pro_rata`, `untag_only`, `veterans_first` | fixed mapping: `mortality`→`pro_rata`, `muster`/`dispatch`→`veterans_first`, `enlist`→`untag_only` |
| `WAR_STANCE_LADDER` | `neutral`, `materiel`, `auxiliary`, `belligerent`, `principal` | **semantic order via an explicit rank map**, never array position. **NO DECLARER DISJUNCT EXISTS** — a declared label here would make priced shielding purchasable at declaration time, which directive (f) forbids in terms |

### 5.2 `EVENT_SIGNATURES` — the one object the law and the movers share

Every `COUNT_EVENTS` signature is **exactly one debit and one credit**. **THE TAG ARM IS PART OF
THE SIGNATURE**, not a convention beside it: a mover that debits census without running its arm
diverges from the frozen object and reds. `untag`'s kind set is asserted **EQUAL** to
`RESIDENCY_TAGS`, so a new tag cannot be minted without a retirement.

`defect` and `merge` carry **KEY-level** conservation arms (§3, R-WC0A-3).

### 5.3 The derived block-touching set

Computed at module load off `EVENT_SIGNATURES` — every `COUNT_EVENT` naming the `block` pool on
either side. Exported, and pinned **`toEqual` against the hand-named list** so the derivation is
proven to see what it claims (§1.2.2). WC-7 later pins it equal to the movers' actual call set.

### 5.4 Lifecycle paths (written before any writer exists)

**Create** — module load, frozen. **Read** — nothing, at this member. **Persist** — ⛔ nothing:
neither leaf touches `worldState`, `spatialLedgers`, or any save. **Regenerate / undo / migrate** —
not reachable: a frozen vocabulary has no instance state. ⇒ **the estate's most-bitten class is
structurally absent from this member**, and the packet says so rather than leaving it unsaid.

---

## 6. Exact FIVE-path manifest — five handwritten, zero generated

| # | Action | Path | Budget |
|---:|---|---|---|
| 1 | `CREATE` | `src/domain/worldPulse/peopleLedger.js` | ≤ **230 eff** (§2.2; cap 250) |
| 2 | `CREATE` | `src/domain/worldPulse/warStance.js` | ≤ **120 eff** (§2.2; cap 250) |
| 3 | `CREATE` | `tests/domain/peopleLedgerVocabulary.test.js` | 1 `describe` + **5** `it` |
| 4 | `CREATE` | `tests/domain/warStanceLadder.test.js` | 1 `describe` + **3** `it` |
| 5 | `TEST` | `tests/lint/couplingInclusion.walker.test.js` | **one regex** into `LAYER_PATTERNS.WAR`, with its written reason. **ZERO new titles** |

**Handwritten 5 of 12. New logic-bearing production leaves 2 of 2 — AT CAP. New/changed effective
production lines ≤ 350 of 400. Feature flags 0 of 1. Existing logic-bearing production files
modified 0 of 3. Acceptance cases 8 of 8 — AT CAP.**

⛔ **NOT IN THIS MANIFEST, AND EACH ABSENCE IS A DECISION**: `simulationRules.js` (no flag ⇒ §50.1's
seven edge-shared bundles cannot fire) · `subsystemRowsVirtual.js` and its test (no flag ⇒ §49's
ordered-equality pin is not disturbed) · `spatialUsage.js` (no writer, §P1 R-WC0-2) ·
`sovereigntyLightingContract.walker.test.js` (the census is `WC-0D`'s row, re-derived WHOLE at
`I4`) · `scripts/.size-baseline.json` (nothing near a ceiling) ·
`.coupling-unlayered-baseline.json` (**forbidden**).

---

## 7. Ordered coding sequence

1. `warStance.js` — the ladder, the rank map, `warStanceOf`, `stanceScalars`. **Zero imports.**
2. `peopleLedger.js` — the eight vocabularies, then `EVENT_SIGNATURES`, then the derived
   block-touching set computed off it. **Zero imports.**
3. `tests/domain/warStanceLadder.test.js`, then `tests/domain/peopleLedgerVocabulary.test.js`.
4. The `LAYER_PATTERNS` regex **last**, so the coupling walker's green is measured against the
   files as they finally stand.
5. Run the §P3 anchor preflight **before** declaring the member proof green.

⛔ **NEITHER LEAF TAKES AN IMPORT.** Both are vocabulary; an import would mint a cross-layer pair
and a registry row this member has not priced. If one proves necessary, that is a **STOP**, not a
registry edit.

---

## 8. Acceptance matrix — exactly eight titles, two files, one `describe` each

| # | File | Case |
|---|---|---|
| A1 | `peopleLedgerVocabulary` | every vocabulary is frozen, codepoint-sorted where order-free, and totality-exported; each rank/label lookup throws on an unknown member |
| A2 | `peopleLedgerVocabulary` | `EVENT_SIGNATURES` gives every `COUNT_EVENTS` member exactly one debit and one credit, and `SOURCES` is exported beside `SINKS` in the same frozen object with `birth` carrying **no** tag arm |
| A3 | `peopleLedgerVocabulary` | every `CENSUS_DEBITING` signature names a **required** `TAG_SELECTIONS` member, and a planted fourth selection fails at **MODULE LOAD** — not at first muster |
| A4 | `peopleLedgerVocabulary` | `untag`'s kind set equals `RESIDENCY_TAGS` exactly, so a new tag cannot be minted without a retirement; and `defect` / `merge` each carry a **KEY-level** conservation arm because their pool sums do not move |
| A5 | `peopleLedgerVocabulary` | the derived block-touching set is computed off `EVENT_SIGNATURES` at module load and equals the hand-named list `toEqual`; deleting one signature's `block` arm moves the derived set |
| A6 | `warStanceLadder` | `WAR_STANCE_LADDER` is the five rungs with an explicit **rank map**, and rank order survives a shuffled array — the ladder's meaning is not array position |
| A7 | `warStanceLadder` | `warStanceOf` throws on an unknown rung and `stanceScalars` is total over the ladder — every rung has an exhaustion, casus and terms multiplier |
| A8 | `warStanceLadder` | **no declarer disjunct exists**: no export, member or branch names a declared label, so priced shielding is not purchasable at declaration time (directive (f)) |

⛔ **ONE literal `describe` per file, straight-line `it` calls, string-literal titles. No `.each`,
no `describe.runIf`, no nested `describe`** — any of the three parks the file WHOLE and the census
arithmetic still closes while `credited` silently does not move (§P5).

---

## 9. Mutation proof — five disposable mutants, isolated immutable candidate

| # | Plant | Must convict |
|---|---|---|
| M1 | delete the module-load throw for an unknown `TAG_SELECTIONS` member | A3 |
| M2 | add a fourth `RESIDENCY_TAGS` member without a matching `untag` kind | A4 |
| M3 | replace the derived block-touching set with a hand-written literal identical to today's | A5 — ⚠ **the fixture-mirrors-deriver arm**: the mutant must be caught by the *derivation* test, not by an equality both sides move together |
| M4 | re-key `warStanceOf` on array index instead of the rank map, then shuffle the array | A6 |
| M5 | give one `COUNT_EVENTS` signature two credits | A2 |

Each planted, convicted, and **restored digest-exact**. ⚠ M3 is the member's sharpest mutant and
the reason A5 asserts the derivation rather than the value: a fixture built by the deriver can
never see a dead arm (§P2.10).

---

## 10. Focused verification — exact argv

```
npx vitest run tests/domain/peopleLedgerVocabulary.test.js tests/domain/warStanceLadder.test.js tests/lint/couplingInclusion.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?
npx eslint src/domain/worldPulse/peopleLedger.js src/domain/worldPulse/warStance.js tests/domain/peopleLedgerVocabulary.test.js tests/domain/warStanceLadder.test.js ; echo TRUE_EXIT=$?
```

⛔ **Run bare, from a fresh shell, never wrapped in `gate-mutex.sh --run`**, and **outlast each in
your own turn**. An exit not read from the command's own tail is no receipt.

**EXPECTED AT `I1`:** the two acceptance files GREEN · `couplingInclusion.walker` **GREEN** ·
`negativeAssertionAnchor.walker` **GREEN** (R-WC0A-4) · `sovereigntyLightingContract.walker`
**RED on `files` (2433 vs 2431) — NAMED IN THE TRAIN PLAN BEFORE IT EXISTS**, greening at `I4`.

⛔⛔ **AND IF A BATTERY REDS, THIS TRAIN TRUNCATES — BANKING HAS NO DOOR.** `est-1c` landed
`CR-EST-CONTROLZERO`: `ORDINARY_TEST_CONTROL` is frozen EMPTY and the sampling test is now the
victory assertion, so the ordinary-debt population must be exactly zero. Adding a row to make a
member pass would certify an enforcement walker as ordinary — the precise 2026-08-07 error the
block exists to prevent. A red member battery truncates the train at the last green member
boundary; the prefix landing is a complete, lawful train (ODQ §97.2, restated for the executor at
§99.2). ⚠ The interior census red named above is a **walker-census red by construction**, not a
banked failure, and is unaffected.

---

## 11. Wave-specific hazards, coupling and OSR

- **COUPLING BILL: ZERO ROWS, and that is a measurement.** Both leaves take **no import**, so
  neither mints a cross-layer pair. `peopleLedger.js` takes a WAR home; `warStance.js` is claimed
  by the existing `war[A-Z]` prefix. `ARGUED_ROSTER_CEILING` and `UNLAYERED_BASELINE_CEILING` both
  untouched. ⛔ **VERIFY-AT-BUILD: run the walker; any pair is a source-repair STOP, never a
  registry edit.**
- **OSR: verify-at-build at 1998.** A new finding is a **STOP**, never a `--write`; this member
  mints no detector and therefore no schema.
- ⚠ **THE LAZY-CHUNK LAW (§2.2 preamble, task #47).** All WC leaves are lazy leaves reached through
  the pulse chunk; **no new module may join the first paint.** With zero importers this member
  cannot violate it, and the constraint is recorded here so WC-1's first import is taken knowingly.
- ⚠ **`birth` HAS NO PRODUCER YET, AND THAT IS THE POINT.** Before round 3 `births` was a bare term
  in the walker law with no signature, no wave and no coverage, *"so an invented birth was
  invisible by construction."* This member gives it a signature; WC-6 gives it the
  birth-inflation mutant. **A walker that can see a stolen death and not an invented birth is a
  guard with one eye.**

---

## 12. Completion receipt and STOP conditions

The receipt records: the executed absence check, the two files' measured effective lines against
their §2.2 budgets, the eight titles with their file split, the five mutants with their convictions
and digest-exact restores, the coupling walker's green, the **named** census red with its predicted
figure, and both typecheck ratchets at their exact floors.

**STOP — this member halts and reports rather than repairing — on:** either leaf needing an import
· either leaf exceeding its §2.2 budget · a new OSR finding · a coupling pair or registry row ·
`Object.keys(LAYER_PATTERNS)` moving off 7 · any `.coupling-unlayered-baseline.json` edit · a
census figure moving other than `files` at `I1` · a further overstatement in the volume beyond the
annex's 36 and this plan's 4.

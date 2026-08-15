# War Circulation / WC-0E — the two flags, the contribution ledger's shape, and the `blocks[]` arm

- **Status:** LANDED
- **Train:** `refs/trains/wc-0e`, **the sole member.** A flag wave is a train boundary (§59.1), so
  it rides alone.
- **Chair authority:** `OWNER_DECISION_QUEUE.md` **§59.2** (WC-0E named as the flag-wave
  successor), **§73.3** (F-1 — the charter CORRECTION), **§49/§50** (the flag-mint three
  obligations, here INCURRED rather than priced), **§92.2** (the certification-pattern standing
  cure), **§85.4** (the registry-mint two-obligation law), and **§102** (this dispatch).
- **Volume:** WC — the war-circulation owner-amendment program.
- **Family preamble, cited BY SHA-256:** `docs/implementation/preambles/WC-PREAMBLE.md`
  sha256 `288c0d5b5c9b0ae9be632d975b28406755a287b01a25c817e1bde1acb0ea6563` — the bytes landed at
  this train's `D0` (`00ceda98`), which added §P3b. ⚠ Citing the pre-`D0` digest would have been
  stale before this member dispatched; that is the re-stamp mechanism working, not a defect.
- **Branch:** `claude/composite-r4`
- **Verified base:** `claude/composite-r4` at `00298c5f82ad10e80d5584bf30d7c642e27fc382`
  (the `wc-0` terminal, exposed by the chair at §102.)
- **Base-state capsule:** `35112d5e`; HEAD is its docs-only descendant — **J-T1**.

---

## 1. Reconciled authority

| Source | What it binds |
|---|---|
| `WC-PREAMBLE.md` @ the sha above | §P0–§P11, and **§P3 + §P3b in particular** — the two registration obligations a new test file incurs |
| `PACKET_STANDARD.md` | statuses, the scope budget, hot-file law, STOP conditions, train landings |
| `docs/DESIGN_FP_ARCH_WC.md` @ `c5305a82` | §0.2 · §1.4.1 the `blocks[]` arm · §2.2 the leaf budget · §3 WC-0's LANDS block · §7.A.2 `CONTRIBUTION_KINDS` |
| ODQ **§73.3** | **F-1 CORRECTS the §59.2 charter sentence** — TRACKED rows and flags land only WITH their live writers / by-name gate reads, in the SAME commit |
| ODQ **§92.2** | the in-file certification pattern; **every family volume's certification/flag sections are SUPERSEDED**, this one included |

⛔ **Where this packet and the volume disagree, the EXECUTED measurement in §3/§4 wins and the
volume is docketed.** Three volume sentences are struck below, each on a measurement.

---

## 2. Outcome and boundary

### 2.1 What lands

**The two engine-gated flags, WITH the by-name reads that make them honest, the contribution
ledger's record shapes and fail-closed normalizer, and the `blocks[]` persistence arm.**

`contributionLedger.js` is `CONTRIBUTION_KINDS` (`troops_lent`, `supplies_delivered`), the record
shapes, the fail-closed normalizer, and **the lane's gate** — the module that reads both flags by
name. It writes **nothing**: no `setSpatialLedger` call, no persisted byte.

### 2.2 What it deliberately does NOT build — the non-goals, named

⛔ **No `spatialUsage` TRACKED row** (§3, R-WC0E-2 — the measurement, not an omission) · no
`setSpatialLedger` call of any kind · no credit, no shortfall booking, no arrival fold, no close
fold — **the writer is WC-1's** · no `CONTRIBUTION_CLOSE_GRADES` (WC-9's, three of its four members
have no inputs here) · no `CALL_IN_*` vocabulary (WC-5's) · no news kind, no Herald desk, no UI
byte · no curve, band or threshold · **no preset lights either flag** — both stay virtual and dark.

⭐ **WC-0E IS DARK-COMPLETE BY TWO DARK FLAGS.** The lane's gate is a conjunction of two keys that
are absent from `DEFAULT_SIMULATION_RULES` and from every preset override, so no seeded world can
reach the ledger at all. The corpus is byte-identical **because the flags are dark**, and the pin
asserts that structural absence rather than asserting that nothing moved.

---

## 3. THE REFUTED PREMISES THIS MEMBER IS BUILT ON — measured at `00298c5f`

### R-WC0E-1 (STOP-CLASS) — ⛔⛔ THE `blocks[]` ARM CANNOT CARRY A FLAG'S GATE READ

The §59.2 charter names both *"the `blocks[]` fail-closed arm"* and *"each flag's by-name
gate-read module in the same commit."* **Measured, those cannot be the same site.**

```
normalizeDeployments  →  src/domain/worldPulse/worldState.js:115
signature             →  function normalizeDeployments(value)     ← NO rules parameter
rules in its scope    →  NONE
```

A gate read requires the receiver token `rules` or `simulationRules`
(`engineGatedRuleKeys.walker.test.js:296` / `:307`). `normalizeDeployments` is a **persistence
normalizer that runs on load** and has no rules in scope.

⭐ **AND IT MUST NOT ACQUIRE ONE, WHICH IS THE STRONGER HALF.** Persistence hygiene runs on EVERY
load regardless of whether a feature is lit — exactly like the `casusReasons` and `joinLedger`
fail-closed arms already beside it in that same function. A `blocks[]` arm that only cleaned
malformed saves while the flag was ON would leave a dark world's saves un-normalized: the
fail-OPEN direction, on a persistence surface.

**THE CURE, IN THIS MEMBER'S OWN COMMIT:** the arm lands **UNGATED** in `normalizeDeployments`,
and **`contributionLedger.js` carries BOTH by-name reads** as a two-flag conjunction — the estate's
own live idiom, not one invented here:

```
src/domain/worldPulse/settlementStrategy.js:1105-1106     ← the shape, verbatim
    && rules.warLayerEnabled === true
    && rules.warTerminationEnabled === true
```

⇒ `contributionLedgerActive(rules)` reads
`rules.warCirculationEnabled === true && rules.contributionLedgerEnabled === true`: the war layer
gates the lane, the feature flag gates the ledger. **Both flags get their first by-name `=== true`
read in the commit that mints them, which is what keeps `engineGatedRuleKeys` direction 1 green at
this member's own commit.**

### R-WC0E-2 (STOP-CLASS) — NO `spatialUsage` TRACKED ROW MAY LAND HERE, AND THE VOLUME CONTRADICTS ITSELF ON IT

`tests/lib/spatialLedgerCoverage.walker.test.js:116` asserts `expect(classified).toEqual(written)`
— **exact-set, both directions** — and `written` is derived by a LIVE SOURCE SCAN of
`setSpatialLedger` calls (47 keys at this base). A TRACKED row whose key nothing writes makes
`classified ⊋ written` and **REDS**.

⛔⛔ **THE VOLUME CHARTERS THE ROWS AND DENIES THEIR WRITERS IN THE SAME SENTENCE.** WC-0's LANDS
block reads *"contributionLedger.js record shapes + normalizer **(no writer calls yet)**"* and, a
few words later, *"spatialUsage TRACKED rows for warContributions/freeUnits/residentCohorts"*.
Both cannot hold. **§73.3's F-1 is the correction of this precise sentence**, and WC-1's own LANDS
block confirms the disposition: *"the contributionLedger.js writer live."*

⇒ **ZERO TRACKED ROWS AT THIS MEMBER.** The three land each with its ledger's FIRST writer —
`warContributions` at **WC-1**, `freeUnits` at **WC-11**, `residentCohorts` at **WC-13**. The
packet states it affirmatively rather than by silence, and **E8 asserts it**.

### R-WC0E-3 — TWO MORE VOLUME SENTENCES ARE SUPERSEDED

- ⛔ *"certification **pending** rows"* — **STRUCK.** §92.2 and `engineGatedRuleKeys` direction 3
  require a manifested key to carry an **authored row** in `VIRTUAL_SUBSYSTEM_ROWS` **and** to
  stand in no lane's pending list. Full rows land, in the in-file pattern.
- ⛔ *"THE TWO SINGLE-EXPORTER FENCES … These land HERE"* — **both already shipped**: the move half
  with HB-1, the law-band half at this train's predecessor `WC-0C`. Nothing to land.

---

## 4. Verified tree contract and executed preflight receipts

### 4.1 The triple bijection — ⭐ IT IS A TRIPLE, NOT A PAIR

| Surface | At base | At `T` |
|---|---:|---:|
| `ENGINE_GATED_VIRTUAL_RULE_KEYS` (`simulationRules.js:185`) | **20** | **22** |
| `VIRTUAL_RULES` (`subsystemRowsVirtual.test.js`) | **20** | **22** |
| `VIRTUAL_SUBSYSTEM_ROWS` (`subsystemRowsVirtual.js:54`) | **20** | **22** |

§92.2's ordered-equality pin at `:407` couples the first two; direction 3 couples the first to the
third. **A flag mint moves all three together or reds two walkers.**

### 4.2 The absence, executed

```
ABSENT ✓  src/domain/worldPulse/contributionLedger.js
ABSENT ✓  tests/domain/contributionLedgerShape.test.js
PRESENT ✓ src/domain/worldPulse/worldState.js       (normalizeDeployments :115)
warCirculationEnabled / contributionLedgerEnabled in the manifest: NEITHER
```

### 4.3 Required live symbols (existence-checked at EVERY status)

| Path | Symbol |
|---|---|
| `src/domain/worldPulse/simulationRules.js` | `export const ENGINE_GATED_VIRTUAL_RULE_KEYS` |
| `src/domain/certification/subsystemRowsVirtual.js` | `export const VIRTUAL_SUBSYSTEM_ROWS` |
| `src/domain/worldPulse/worldState.js` | `function normalizeDeployments` |

⛔ **Neither flag name and no `contributionLedger` symbol is cited** — this packet creates them,
and `requiredSymbols` are existence-checked at DRAFT and READY. ⚠ And **no numeric literal is
pinned** in any `requiredSymbol`: the §102.3 rot class, avoided by construction.

### 4.4 Censuses and hot files

No hot file named. Lighting census `files` **2437 → 2438 at `I1`** — ONE new acceptance file —
**re-derived WHOLE at `I1`**, which is this member's only `tests/`-moving commit, so `T` stays
docs-only. Flag manifest rows **20 → 22**. `ARGUED_ROSTER_CEILING` / `UNLAYERED_BASELINE_CEILING`
**untouched**.

⛔⛔ **THE VERIFY-AT-BUILD FIRED AT COMPILE, AND THE MANIFEST GREW BY ONE.** Executed at
`00298c5f`: `LAYER_PATTERNS` holds **21** regexes (19 at TC14's base; `INT-3B` added the twentieth
and this train's own `WC-0A` the twenty-first), and **`contributionLedger.js` matches NONE of
them** — HOMELESS, exactly as `peopleLedger.js` was. ⇒ `tests/lint/couplingInclusion.walker.test.js`
JOINS THE MANIFEST as row 8, carrying one exact-path WAR regex with its written reason, **in this
member's own commit** because the walker scans the live tree. `ARGUED_ROSTER_CEILING` stays 20 and
`UNLAYERED_BASELINE_CEILING` stays 179: this is a FAMILY HOME, not an argued admission, on the same
reading that gave `peopleLedger.js` WAR — the module owns war-contribution outright rather than
owning no subject.

### 4.5 §85.4 — THE REGISTRY-MINT TWO-OBLIGATION LAW

`contributionLedger.js` mints **no seeded chooser and no pool**: `CONTRIBUTION_KINDS` is a closed
two-member vocabulary, the record shapes are declarative, and the normalizer is a total function
of its input. ⇒ **ZERO decision-fork rows, ZERO mechanism-coverage rows — stated affirmatively.**
⚠ The `mechanism-lit-coverage-baseline.json` **`flags`** row is a different obligation and IS
incurred: see §5.3.

### 4.6 §P3b — THE MUTATION-COVERAGE ROW

This member mints **no `tests/lint/**` file**, so §P3b's row is **NOT INCURRED**. ⚠ Stated
affirmatively because the law is one landing old and its first instance was found at a terminal
gate.

---

## 5. Exact contracts

### 5.1 The two flags, and the three obligations INCURRED

| Obligation (§49/§50) | How this member discharges it |
|---|---|
| **(a)** the `subsystemRowsVirtual` ordered-equality pin | `tests/domain/subsystemRowsVirtual.test.js` joins the manifest: **three module-scope literal edits per flag** — the `const` alias, the `VIRTUAL_RULES` member, the `LANE_LEAVES` entry. **ZERO new titles.** |
| **(b)** the seven edge-shared bundles | `simulationRules.js` moves ⇒ `npm run build:edge-shared`, **seven MODIFY rows, zero handwritten**. |
| **(c)** the LITERAL flag drive | the acceptance file drives each flag with a literal `<flag>: true`; `mechanismLitCoverage` grants credit only on a literal, and a computed member attributes to no key. |

### 5.2 The gate, and it is the whole point of the member

```js
export function contributionLedgerActive(rules) {
  return !!(rules && typeof rules === 'object'
    && rules.warCirculationEnabled === true
    && rules.contributionLedgerEnabled === true);
}
```

⛔ **BOTH READS ARE BY NAME AND BOTH ARE `=== true`.** A truthiness read, a destructured alias or
a computed key is invisible to `GATE_RE` and reds direction 1.

### 5.3 The `blocks[]` fail-closed arm — UNGATED, on a persistence surface

In `normalizeDeployments`, beside `casusReasons` and `joinLedger` and shaped exactly like them: a
`blocks[]` that is not an array of well-shaped block records **disappears** rather than surviving
as a malformed artifact. **No rules read, deliberately** (R-WC0E-1).

### 5.4 Lifecycle paths (L4)

**Create** — frozen vocabulary + shapes at module load. **Read** — the gate, by two flags.
**Persist** — ⛔ **nothing**: no `setSpatialLedger`, no save. **Regenerate / undo / migrate** — the
`blocks[]` arm is the ONLY lifecycle surface this member touches, and it is fail-closed in the
direction that survives every save written before it.

---

## 6. Exact manifest — SEVEN handwritten, SEVEN generated

| # | Action | Path | Budget |
|---:|---|---|---|
| 1 | `CREATE` | `src/domain/worldPulse/contributionLedger.js` | ≤ **120 eff** (shapes + normalizer + gate; the ~300-eff volume budget is the WC-1 WRITER's) |
| 2 | `MODIFY` | `src/domain/worldPulse/worldState.js` | ≤ **15 eff** — the `blocks[]` arm |
| 3 | `MODIFY` | `src/domain/worldPulse/simulationRules.js` | **2 rows** |
| 4 | `MODIFY` | `src/domain/certification/subsystemRowsVirtual.js` | **2 certification rows**, in-file pattern |
| 5 | `TEST` | `tests/domain/subsystemRowsVirtual.test.js` | **6 module-scope literal edits.** ZERO new titles |
| 6 | `CREATE` | `tests/domain/contributionLedgerShape.test.js` | 1 `describe` + **8** `it` |
| 7 | `TEST` | `tests/lint/couplingInclusion.walker.test.js` | **one exact-path WAR regex** + its reason. ZERO new titles |
| 8 | `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the census, re-derived WHOLE. ZERO new titles |
| 9 | `MODIFY` | `supabase/functions/_shared/aiCharterBundle.js` | **generated** — real content |
| 10 | `MODIFY` | `supabase/functions/_shared/aiCharterBundle.meta.json` | **generated** |
| 11 | `MODIFY` | `supabase/functions/_shared/aiOutputSchemaBundle.js` | **generated** — real content |
| 12 | `MODIFY` | `supabase/functions/_shared/aiOutputSchemaBundle.meta.json` | **generated** |
| 13 | `MODIFY` | `supabase/functions/_shared/aiGroundingBundle.meta.json` | **generated** — timestamp churn only |
| 14 | `MODIFY` | `supabase/functions/_shared/analyticsEventsBundle.meta.json` | **generated** — timestamp churn only |
| 15 | `MODIFY` | `supabase/functions/_shared/intentAtlasBundle.meta.json` | **generated** — timestamp churn only |

⭐⭐ **THE "SEVEN" IS RE-DERIVED AT THIS BASE, AND ITS MECHANISM IS NOW NAMED RATHER THAN
INHERITED.** §50.1 measured seven artefacts at GR-5A's base; a bare seven is a base-bound absolute.
Executed here, the seven decompose **2 + 5**:

- **TWO carry real content.** Measured from the builders' own metafiles: exactly
  `aiCharterBundle` and `aiOutputSchemaBundle` reach `src/domain/worldPulse/simulationRules.js`
  transitively. `aiGrounding`, `analyticsEvents` and `intentAtlas` do not.
- **FIVE `.meta.json` files move on ANY invocation, including one with NO input change at all.**
  Executed at this base with the tree clean: `npm run build:edge-shared` dirtied all five metafiles
  and zero bundles. That is §50.5's docketed determinism wart — a wall-clock `generatedAt` — and it
  is why the count is seven rather than four.

⇒ **2 real + 5 churn = 7**, GR-5A's figure reproduced with its cause. ⛔ The three churn-only rows
are in the manifest because the flip existence-checks what the landing actually touches, not what
it meaningfully changed.

**Handwritten 8 of 12. New logic-bearing production leaves 1 of 2. Feature flags 2 of 1 — ⚠ OVER
THE DEFAULT CAP, AND DELIBERATELY: §59.1 signed WC-0E as the two-flag wave, and splitting them
would land each flag's gate read in a commit where the other's conjunction partner does not exist,
reddening direction 1 in both halves. Acceptance cases 8 of 8 — AT CAP.**

⛔ **NOT IN THIS MANIFEST, AND EACH ABSENCE IS A DECISION:** `src/lib/spatialUsage.js` (R-WC0E-2 —
no writer, so no row) · `tests/lib/spatialLedgerCoverage.walker.test.js` (unmoved; E8 asserts it
green) · `tests/lint/strategyMoveVocabulary.walker.test.js` and `tests/lint/lawBandTable.walker.test.js`
(both fences already shipped) · `scripts/mutation-coverage-manifest.json` (§P3b NOT incurred — no
new `tests/lint` file) · `.coupling-unlayered-baseline.json` (**forbidden**).

---

## 7. Ordered coding sequence

1. `contributionLedger.js` — vocabulary, shapes, normalizer, **then the gate LAST** so the gate is
   written against the shapes as they finally stand.
2. `simulationRules.js` — the two manifest rows.
3. `subsystemRowsVirtual.js` — the two certification rows, in-file pattern (§92.2).
4. `subsystemRowsVirtual.test.js` — the six module-scope literal edits.
5. `worldState.js` — the `blocks[]` arm, and the `LAYER_PATTERNS` exact-path regex **last**, so
   the coupling walker's green is measured against the leaves as they finally stand.
6. `tests/domain/contributionLedgerShape.test.js`, **with the literal flag drives**.
7. `npm run build:edge-shared` — the seven artefacts, regenerated, never hand-edited.
8. The §P3 anchor preflight, then the census re-derived WHOLE **LAST**.

---

## 8. Acceptance matrix — exactly eight titles, ONE file, ONE `describe`

| # | Case |
|---|---|
| E1 | both flags join `ENGINE_GATED_VIRTUAL_RULE_KEYS`, and the **triple bijection** holds at 22 ↔ 22 ↔ 22 with the ordered-equality pin green |
| E2 | ⭐⭐ **DIRECTION 1:** each flag has a by-name `=== true` read in `contributionLedger.js` **in this commit** — the conjunction, asserted over the live source, not over a fixture |
| E3 | **DIRECTION 3:** each flag carries an authored `VIRTUAL_SUBSYSTEM_ROWS` row and stands in **no** lane's pending list |
| E4 | `CONTRIBUTION_KINDS` and the record shapes are frozen, totality-exported and throw on an unknown kind |
| E5 | the normalizer is **fail-closed**: an unknown kind, a malformed record and a non-object all disappear rather than surviving |
| E6 | ⭐ the `blocks[]` arm normalizes on **EVERY** load — a malformed `blocks[]` disappears **with both flags dark**, which is what proves the arm is ungated |
| E7 | ⭐ **THE LITERAL FLAG DRIVE (§50 c):** the file drives each flag with a literal `<flag>: true`, and the gate is `false` when either flag alone is lit |
| E8 | ⭐⭐ **NO `spatialUsage` ROW IS ADDED, AND THE EXACT-SET WALKER IS GREEN**: `contributionLedger.js` calls `setSpatialLedger` **zero** times, so no key is owed and none is added |

⛔ ONE literal `describe`, straight-line `it` calls, string-literal titles. **No `.each`, no
`runIf`, no nesting.** ⚠ **E5, E6 and E8 are negatives and each owes an anchor** (§P3) — and the
notice about them is WORDED, never quoting the scanned forms (the `wc-0` lesson).

---

## 9. Mutation proof — five disposable mutants

| # | Plant | Must convict |
|---|---|---|
| M1 | delete one flag's `=== true` read from the gate | **E2, and `engineGatedRuleKeys` direction 1** — the STOP this member exists to avoid |
| M2 | delete one certification row | **E3 and the ordered-equality pin** — the triple broken |
| M3 | gate the `blocks[]` arm on `warCirculationEnabled` | **E6** — a dark world's save survives un-normalized, the fail-OPEN direction |
| M4 | add a `warContributions` TRACKED row with no writer | **E8 and the exact-set walker** — F-1, mechanically |
| M5 | replace the literal `<flag>: true` with a computed member | **E7** — lit-coverage credit attributes to no key |

Each planted, convicted, restored **digest-exact**. ⚠ **M1 and M2 must convict SEPARATELY**: if
deleting a row also reds E2, the gate pin is measuring the certification surface rather than the
read.

---

## 10. Focused verification — exact argv

```
npx vitest run tests/domain/contributionLedgerShape.test.js tests/domain/subsystemRowsVirtual.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/engineGatedRuleKeys.walker.test.js tests/lib/spatialLedgerCoverage.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js tests/lint/couplingInclusion.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/property/mechanismLitCoverage.test.js ; echo TRUE_EXIT=$?
npx eslint src/domain/worldPulse/contributionLedger.js src/domain/worldPulse/worldState.js src/domain/worldPulse/simulationRules.js src/domain/certification/subsystemRowsVirtual.js tests/domain/contributionLedgerShape.test.js ; echo TRUE_EXIT=$?
```

⛔ Bare, fresh shell, never wrapped in `gate-mutex.sh --run`, outlasted in your own turn.

**EXPECTED AT `I1`:** every named suite GREEN, **including the census, re-derived WHOLE at
`2438 / 364 / 2074 / 20183 / 5667`** — this member's only `tests/`-moving commit, so there is **no
named interior red anywhere in this train**.

⛔⛔ **A RED BATTERY TRUNCATES, AND A ONE-MEMBER TRAIN TRUNCATES TO NOTHING** (§97.2 / §99.2):
ordinary debt is zero and may not be spent, and this train has no green prefix to fall back to. A
red here is a full STOP and a return to compile.

---

## 11. Wave-specific hazards, coupling and OSR

- **COUPLING BILL: ONE EXACT-PATH FAMILY HOME, ZERO PAIRS, ZERO ARGUED ROWS — MEASURED AT
  COMPILE.** `contributionLedger.js` matches none of the 21 `LAYER_PATTERNS` regexes, so it takes
  an exact-path **WAR** regex in this member's own commit — the `peopleLedger.js` /
  `emigreErrand.js` shape, and NOT an argued-roster entry, because the leaf owns
  war-contribution outright rather than owning no subject. Both ceilings untouched. ⛔ Any
  cross-layer pair is a source-repair STOP, never a registry edit.
- **OSR: verify-at-build at 1998.** New frozen record shapes can mint an observed shape; a new
  finding is a **STOP**, never a `--write`.
- ⚠⚠ **THE SEVEN BUNDLES ARE GENERATED AND THREE OF THEM MOVE A WALL-CLOCK `generatedAt`**
  (§50.5, docketed infra). Regenerate with the script; **never hand-edit**; expect churn in three
  artefacts that carries no meaning.
- ⚠ **SAME-SEED BLAST RADIUS: the corpus cannot move, and the reason is the two dark flags.** If
  the committed settlement hash or the persisted `generationCoherenceReceipt` moves, that is a
  **STOP**, never a golden re-record.

---

## 12. Completion receipt and STOP conditions

The receipt records: the triple bijection at 22/22/22 with all three walkers green, both by-name
gate reads quoted from the landed source, the certification rows in the in-file pattern, the seven
regenerated bundles, the eight titles, the five mutants with convictions and digest-exact
restores, the affirmative zero-TRACKED-row statement with the exact-set walker green, the census
re-derived WHOLE, and OSR at its exact floor.

**STOP on:** `engineGatedRuleKeys` reddening in ANY direction · the exact-set spatial walker
reddening · the ordered-equality pin reddening · any need for a `setSpatialLedger` call · any need
to thread `rules` into `normalizeDeployments` · a coupling pair or registry row · a new OSR
finding · any movement in the committed settlement hash or the persisted coherence receipt.

# Foreign Policy / GR-4c — the oath that finally costs something

- **Status:** READY
- **Packet version:** `1`
- **Compiled by:** Lane AN (read-only compile lane) 2026-08-12; **promoted by Lane AP** 2026-08-12 with every §15 figure executed — see §15.
- **Verified base:** `claude/composite-r4` at `0b98626fae7cda5cce55659865d58250f976ce7b`
- **Base note:** EXECUTED at promotion — `git rev-parse HEAD` = `0b98626f…`; `git status --porcelain` **empty**; `git diff HEAD` **empty**. The stale-index residue `INDEX.md` recorded at `b17d32d2` has cleared; the header is restamped in this same change (CR-GR4C-6).
- **Depends on:** GR-4a at `a53ef7c6` (the succession answer, the shared shell, `SUCCESSION_REPUDIATION_TYPE`); GR-4b-α at `dd457b9a` (widened `answerSuccessionQuestions` return — read-only here); GR-2's landed `reserveFor` consumer.
- **Collision group:** `treaty-ledger-and-breach` — serialize against any lane touching `treatyBreach.js`.
- **Census-holder:** GR-4c holds `tests/lint/sovereigntyLightingContract.walker.test.js` as its `TEST` row. **EXECUTED FREE at promotion:** `PACKET_MANIFEST.json` carried 22 packets, exactly one non-terminal row (`IA-2`, `STALE`), its twelve reserved paths intersect GR-4c's manifest at **ZERO**, and the walker is named only by LANDED packets.
- **Commit authority:** the promotion is a docs-only plumbing commit by the chair's lane. The IMPLEMENTER receives edit authority for the manifest paths in §7 and no commit authority absent an explicit dispatch statement.

## -1. THE COMPILABILITY VERDICT — COMPILABLE, WITH ONE PREMISE REBUILT AND ONE ROW MINTED

GR-4c is the third of the four slices ratified at CR-GR4-1. Unlike GR-4b it is **not** refused in part: all of its authored behavior has an honest producer, because GR-4a already landed both roads into one shared shell and both stamp the record GR-4c reads.

What GR-4c must **not** resurrect: GR-4d's three open-question kinds and `reaffirmed` (no open-question state exists — GR-4a answers inside one expression), and the `routineMajorApproval` queue. **GR-4c mints no voice at all.** GR-4b-α's α-scoping at CR-GR4B-8 left `succession_question_opened`, `honored_by_silence`, the dossier line `succession_question_open` and `reaffirmed` behind GR-4d; **none of them is released by GR-4c and none is a consumer of it.**

**THE PREMISE THAT IS REBUILT, and it is the packet's centre.** The design routes the charge through the `fractureCredibilityDeltas` idiom. That idiom is a tick-windowed scan of the treaties ledger folded at the information-statecraft stage, and **the window is measurably dead** (§3.2). Copying it ships a charge that never fires. GR-4c keeps the delta **shape** and the **sole writer**, and moves the **call** to the breach.

**THE ROW THAT IS MINTED, and it corrects a draft premise.** The mount creates a **cross-layer** import, not the same-layer one the draft argued, and it takes a coupling-registry row in this same change (§3.9, CR-GR4C-7).

## 0. Why this packet exists

`spatialLedgers.credibility` is a landed, saturating, decaying per-settlement stock with a live reader chain: `credibilityScoreOf` → `reserveFor` (`pactFormation.js:364`) → `F.OATHBREAKER_PENALTY = 0.35` (`:121`, applied `:368`), and a rendered surface through `src/domain/display/credibilityRead.js` → `src/components/map/RealmIntrigue.jsx:17`. **The reader is already there and already wired.** `couplingRegistryGrammar.js:50` says so in as many words, pre-declared: *"the proposer's OATHBREAKER CREDIBILITY … read through the estate's one credibility reader so GR-4's charge bites here the day it lands."*

What is absent is the **producer**: no treaty breach has ever written a credibility delta. GR-4c is the one act that closes that seam, on both roads at once.

**Observable result:** with `oathHolderEnabled` and `infoStatecraftEnabled` both lit, a torn-up oath — the DM's open repudiation or an heir's disavowal — charges the breaching court's credibility stock, graded by GR-4a's own severity. Three open repudiations exhaust a counterparty's willingness to sign. Dark on either flag, nothing moves at all.

## 2. Outcome and non-goals

### 2.1 One behavior family
A broken oath charges the breaker's credibility stock, once, at the breach, banded by breach type.

### 2.2 Non-goals

| Excluded | Why | Where |
|---|---|---|
| Repairing `fractureCredibilityDeltas`' dead window | a second behavior family behind a **different** flag (`infoStatecraftEnabled` alone, no oath gate) | **`GR-4e`** — the named future micro-act (CR-GR4C-1) |
| A fifth `CredibilityDelta` kind | needs a new `CREDIBILITY_TUNING` key ⇒ a tuning act ⇒ owner-signed; and the kind is not persisted, so no output distinguishes it | never |
| Any Herald beat, chronicle line or receipt for the charge | GR-4b-α owns the succession voice and it is terminal; a charge beat is a second family | GR-4d / GR-7 |
| Any edit to `informationStatecraft.js` | **780 of 800 effective lines, 20 of headroom (EXECUTED)**; and the file's fold site is the dead-window home GR-4c is avoiding | never here |
| Any edit to `peaceTerms.js` | **797 of 800, 3 of headroom (EXECUTED)** — a HOT FILE per §3.11 | never here |
| Ungating the DM road from `oathHolderEnabled` | the semantic oddity is real and named; revisiting it is a later slice's act (CR-GR4C-3) | **GR-7** |
| The lit-mode queue, per-type terminal | second writer, second flag | GR-4d |
| Any change to `defaultSeverity01`, `SUCCESSION_TUNING`, `CREDIBILITY_TUNING`, `OATHBREAKER_PENALTY` | tuning is owner-signed | owner |
| A new persisted key or ledger | the credibility ledger exists and is drop-when-empty | never |

## 3. Verified tree contract

*Every line number is a hint; every symbol is the instruction.*

### 3.1 The record a breach leaves — and it is total

`defaultAllLiveTerms` (`treatyBreach.js:137-168`) writes, per treaty: `complianceState:'defaulted'`, **`defaultedBy`**, **`defaultSeverity01`**, **`breachType`**, `repudiatedTick`, `breachExpiresTick`. The verdict (`:206-208`):

```js
const verdict = succession
  ? { breachType: SUCCESSION_REPUDIATION_TYPE, severity01: Number(succession.severity01), defaultedBy: breaker, receipt: SUCCESSION_DISAVOWAL_RECEIPT }
  : { breachType: TREATY_REPUDIATION_TYPE,     severity01: 1,                             defaultedBy: breaker, receipt: OPEN_REPUDIATION_RECEIPT };
```

⭐ **The verdict object carries everything GR-4c needs, as primitives, before any ledger write.** GR-4c's leaf therefore reads **no treaty record at all** — which is what keeps it out of the observed-shape resolver's way (§3.6).

`severity01` is `1` on the DM road and GR-4a's grade on the succession road: `SUCCESSION_TUNING` (`treatySuccession.js:89`) = `DISAVOW_ABOVE 0.5`, `COUP_BORN_SEVERITY 0.35`, `LINEAL_SEVERITY 0.75`. **"Succession lighter" is already in the tree; GR-4c composes it and authors nothing per-kind.**

### 3.2 ⛔⛔ THE DEAD WINDOW — EXECUTED at this base, and it decides the mount

**CONFIRMED: the window is DEAD at `0b98626f`. `fractureCredibilityDeltas` returns `[]` on every production tick.** GR-4a §3.4 recorded this as PLAUSIBLE; it is now executed, and each leg is executed or grep-confirmed:

1. The predicate is strict equality — `if (Math.floor(finiteNumber(fracture.tick, -1)) !== now) continue;` at `informationStatecraft.js:409`. Non-empty **only** when `fracture.tick === now`.
2. `fractureCredibilityDeltas` has **exactly one** production call site: `informationStatecraft.js:1437`, inside `advanceInformationStatecraft`, whose own sole production call site is `pulseKernel.js:2073`.
3. The **only** two writers of `treaty.fracture` are `peaceTerms.js:970` and `:1123`, both inside mints reachable only from `advanceTreaties` (`peaceTerms.js:541`, `:550`), and both stamp the treaty stage's own `tick`.
4. Both stages sit inside the one function `simulateCampaignWorldPulse` (`pulseKernel.js:224`), reader at 2073 and writer at 2580.
5. `nextWorldStateForPulse` advances `const tick = current.tick + 1` per pulse (`pulseKernel.js:186`).

⇒ At the reader's position in tick *T*, no fracture can carry `fracture.tick === T` — the writer runs 507 lines later in the same call. At *T+1* the reader asks for *T+1* while the record holds *T*, and `advanceTreaties` carries `fracture` forward verbatim (`peaceTerms.js:339`), so it never becomes equal again. `informationStatecraft.js` and `pulseKernel.js` were untouched by both GR-4a (`a53ef7c6`) and GR-4b (`dd457b9a`).

The unit pin at `tests/domain/informationStatecraftPins.test.js:132-135` proves the **predicate**, not the reachability — it hands a fixture straight to the deriver. That is the "fixture mirrors the deriver" vacuity class.

⛔ **CR-GR4C-1 — GR-4c DOES NOT REPAIR THIS.** The repair is a **second behavior family behind a different flag**: the fracture charge is gated on `infoStatecraftEnabled` **alone**, with no oath gate, so repairing it would light a charge in worlds GR-4c otherwise never touches — including goldens that already light `infoStatecraftEnabled`. That breaks the one-family budget and the dark-path posture in one stroke. GR-4c's leaf carries an **anchored in-file note** naming the dead window and its executed evidence, so the next lane does not "restore consistency" by re-adding a tick predicate. **The repair is the named future micro-act `GR-4e`.**

**RULE FOR THE IMPLEMENTER: GR-4c's leaf takes no `worldState` and no `tick`-window predicate. If any part of the implementation ends up scanning the treaties ledger for a tick-stamped field, that is the dead idiom re-entering and it is a STOP.**

### 3.3 The write road — measured, and the precedent is established

`advanceCredibility` (`informationStatecraft.js:331`) is the **sole writer** of `spatialLedgers.credibility` — `setSpatialLedger(ws,'credibility',…)` / `dropSpatialLedger` at `:385-386` are the only two sites in `src/`. It self-gates at `:332` on `infoStatecraftActive`. It has **four** production callers today, **three of them outside the information-statecraft stage**: `realmVerbExecution.js:648`, `corruptionWeb.js:966`, `momentum.js:1271`. GR-4c is the fifth.

**Ledger-manifest cost: zero.** `ledgerOwnershipManifest.js` has exactly three rows — `envoy_errands`, `treaties`, `belief_maps` — pinned by `expect([...byId.keys()]).toEqual([...])` at `pulseStageContracts.test.js:338`, and `spatialLedgerWritersOf` is invoked only for those three (`:348-351`). **There is no `credibility` row**, so a new caller reds nothing there. ⛔ And GR-4c adds no new `setSpatialLedger(…, 'treaties',` site, so the `treaties` writer set is unchanged.

⭐ **The mount is `repudiateTreaty` itself, and `repudiateTreaty` already does exactly this shape.** `treatyBreach.js:230-247` already writes a **second** ledger (`dispositionStats`) behind a **second** flag, confined to one road, under a comment that refuses a second-state conjunction *inside GR-4a's own slice* because that is "the shape GR-4 was refused for carrying." **GR-4c is the later slice** — the one CR-GR4-1 chartered precisely to carry the second family. The packet answers that comment rather than routing around it.

### 3.4 The gate — no new flag, no new spelling

`oathHolderActive` (`oathHolder.js:117`) is **already imported into `treatyBreach.js` at line 17**. `advanceCredibility` self-gates on `infoStatecraftActive` (`beliefsActive` ∧ `infoStatecraftEnabled === true`). ⇒ the conjunction is expressed by calling two existing helpers. **Zero new `oathHolderEnabled` source sites, so FENCE 4's gate-polarity census is free.**

⚠ **CR-GR4C-3 — BOTH ROADS GATE ON `oathHolderActive`.** Gating the **DM road's** charge on `oathHolderEnabled` is semantically odd — an open repudiation is not an oath-holder fact. It is what `DESIGN_FP_GRAMMAR.md:1093-1095` instructs, and it is what keeps every dark world still and every landed `REPUDIATE_TREATY` assertion in `realmVerbExecution.test.js` unmoved. **The oddity is a NAMED DEFERRAL for GR-7**, recorded here rather than left for a later lane to rediscover as a defect.

### 3.5 The dark path — EXECUTED, and the fence fixture is measured

1. **No test in the estate lights both flags.** `oathHolderEnabled: true` appears in exactly four test files (`oathHolderDormancyFence`, `successionQuestion`, `treatySuccessionVoice`, `oathHolderGr1`; plus a certification row test). **None of them lights `infoStatecraftEnabled`.**
2. ⭐ **The one file where the DM repudiation road meets a lit information layer is `tests/domain/realmVerbExecution.test.js`** — and its `infoStatecraftEnabled: true` lives in `MOMENTUM_LIT` at `:342`, a different `describe` from the `REPUDIATE_TREATY` cases at `:87-252`. **This is the decisive argument for the conjunction gate:** gating on `infoStatecraftActive` alone would have moved those landed assertions.
3. `advanceCredibility` returns `{ worldState, changed: false }` — the same reference — when dark.

⛔⛔ **THE FENCE FIXTURE FINDING (EXECUTED at promotion; CR-GR4C-8).** `tests/property/oathHolderDormancyFence.test.js:107` defines its whole rule set as
`const WAR = Object.freeze({ warLayerEnabled: true, peaceEngineEnabled: true });`
and its lit run is `drive({ ...WAR, [FLAG]: true })` with `FLAG = 'oathHolderEnabled'` (`:105`, `:181`). **`infoStatecraftEnabled` appears NOWHERE in that file.**

**Consequence, stated exactly.** FENCE 1/2's lit projection **cannot** gain a credibility key, because `advanceCredibility` self-gates on `infoStatecraftActive` and that flag is dark in *both* of the fence's runs. So the existing fences are safe — **and FENCE 3's new counter would read `0` in both runs, which is the recorded redundant-guard-vacuity class: a counter that cannot count proves nothing.** ⇒ **C3's lit-mutant control is MANDATORY, not optional** (§9 C3): FENCE 3 must include a **both-lit** run in which the counter is proven able to increment before its zero readings are worth anything.

### 3.6 The observed-shape posture — PRECEDENT, and a mandatory preflight

`treatySuccession.js` (GR-4a's leaf) is **absent** from `scripts/.observed-shape-readers-baseline.json`; `treatyBreach.js`, `informationStatecraft.js` and `peaceTerms.js` are present. The baseline's own doc line reads *"Fixes may only lower or delete rows. Detector changes require a new governed instrument migration."* ⇒ a **new** row reds, and a mint is chair-gated.

⭐ **GR-4c's leaf is designed to be structurally uninteresting to the detector: it receives four primitives, never a record, and never calls `getSpatialLedger`.** That makes a new row unlikely — but **unlikely is not measured**. ⛔ **The OSR scan is a MANDATORY preflight with a STOP**, on GR-4a §6.7's exact terms. Do not mint; do not edit the baseline.

### 3.7 Ceilings and censuses — ALL EXECUTED at `0b98626f`

Measured with the enforcer's own engine — eslint `Linter` under `max-lines{max:1,skipBlankLines,skipComments}`, the method `tests/lint/sizeBaseline.test.js:48-61` uses. ⛔ Never `wc -l`.

| File | Effective | Ceiling | Headroom | Role in GR-4c |
|---|---:|---:|---:|---|
| `src/domain/worldPulse/treatyBreach.js` | **163** | 800 | **637** | the one modified logic file — roomy |
| `src/domain/worldPulse/informationStatecraft.js` | **780** | 800 | **20** | ⚠ **HOT FILE (CR-GR4C-5); read-only import target; NOT edited** |
| `src/domain/worldPulse/peaceTerms.js` | **797** | 800 | **3** | ⛔ HOT FILE — **not in the manifest** |
| `src/components/OutputContainer.jsx` | **599** | 600 | **1** | ⛔ HOT FILE — **not in the manifest** |
| `src/domain/worldPulse/treatySuccession.js` | 106 | 800 | 694 | read-only |
| `src/domain/worldPulse/pactFormation.js` | 411 | 800 | 389 | read-only (the consumer) |

⭐ **The HOT-FILE RULE is satisfied vacuously for the two files that carried it: GR-4c's manifest names neither `peaceTerms.js` nor `OutputContainer.jsx`.** That is a deliberate design constraint, not luck — it is why the charge is sited at `treatyBreach.js` rather than at the pulse fold.

### 3.11 ⚠ THE HOT-FILE LIST — now THREE files (CR-GR4C-5)

Any packet naming one of these opens with an executed headroom measurement and a net-zero or explicitly-budgeted edit shape:

| File | Effective / ceiling | Headroom | Added by |
|---|---:|---:|---|
| `src/components/OutputContainer.jsx` | 599 / 600 | **1 — budget ZERO** | IN-1b (CR-IN1B-7) |
| `src/domain/worldPulse/peaceTerms.js` | 797 / 800 | **3** | GR-4b |
| `src/domain/worldPulse/informationStatecraft.js` | 780 / 800 | **20** | **GR-4c (CR-GR4C-5)** — the estate's busiest domain file, first measured by this packet |

| Census / ratchet | Recorded | Executed at `0b98626f`? | GR-4c's exposure |
|---|---|---|---|
| Lighting census, `sovereigntyLightingContract.walker.test.js:3985` | `files 2408 / parked 365 / credited 2043 / titles 19945 / suiteTitles 5628` | **EXECUTED by read at promotion** | **moves** — one new test file; re-derive all five WHOLE |
| `title=` walker, `guidanceRegistry.walker.test.js:345` | `TITLE_BASELINE = 485` | **EXECUTED — 485** | ⭐ **ZERO headroom, and GR-4c is FREE**: it mounts no component and adds no `title=` prop anywhere. CR-IN1B-8 requires compilers to measure this walker; this packet does, and declares no raise is needed. |
| Test ratchet, `testRatchet.test.js:177` | `CEILING = 17` | **EXECUTED — 16 entries** | land with **no** new banked failure; never raise `CEILING` |
| Size baseline | 10 entries, none a GR-4c target | EXECUTED | untouched |
| Naked-claim freeze, `enforcement-claims.test.js` | per-claim, `frozen = 0` for a new key | EXECUTED — this packet's own prose scanned, **0 `CLAIM_RE` hits** | ⛔ §8 item 6 |

### 3.8 Import-cycle posture — EXECUTED

The new edge is `treatyBreach.js → informationStatecraft.js`. Executed reachability walk over relative specifiers:

```
modules reachable from informationStatecraft.js: 89
NO PATH from informationStatecraft.js back to treatyBreach.js or peaceTerms.js.
```

⇒ **cycle-free.** **Chunk-membership pins: EXECUTED and CLEAR** — `rg 'treatyBreach|informationStatecraft' tests/build/` returns **zero hits** across all 51 files in that directory, so no bundle pin names either module and the new edge cannot move one.

### 3.9 ⛔⛔ THE COUPLING ROW — OWED, MEASURED, AND MINTED (CR-GR4C-7)

**The draft argued this pair was same-layer and cost nothing. That is FALSE, and the correction is the packet's second real contribution.**

**Mechanism, not outcome.** `couplingInclusion.walker.test.js` resolves layers from a frozen table of **module SETS matched by regex against repo-relative paths** (`LAYER_PATTERNS`, `:115-203`, applied at `:520-526`) — **not from directories**. The committed baseline already proves it: `treatyBreach.js → dispositionLedger.js` is recorded `INTERIOR→GRAMMAR` and both files live in `src/domain/worldPulse/` (`.coupling-inclusion-baseline.json:543-547`).

Executed at `0b98626f`:

| Module | Matching pattern | Layer |
|---|---|---|
| `src/domain/worldPulse/treatyBreach.js` | `/^src\/domain\/worldPulse\/(?:treaty|…)/` | **GRAMMAR** |
| `src/domain/worldPulse/informationStatecraft.js` | `/^src\/domain\/worldPulse\/(?:…|information|…)/` | **INFO** |
| `src/domain/worldPulse/treatyBreachCredibility.js` (new leaf) | `/^src\/domain\/worldPulse\/(?:treaty|…)/` | **GRAMMAR** — so the leaf's own edges are same-layer and free |

`scanCrossLayerPairs` (`:580-590`) emits a pair for every static relative import whose dep carries a **different** layer, spelled `${depLayer}→${importerLayer}`.

⇒ the mount's edge is the pair **`treatyBreach.js → informationStatecraft.js`, direction `INFO→GRAMMAR`**, and it is **absent from the frozen baseline** (executed). The arm at `:819-829` keeps any such pair unless one of three doors opens, and **all three are chair-gated**: the baseline may never grow (header rule 3); `REACH_OWED_ROWS` is shrink-only and "never grows without a chair ruling" (`:656`); and `licensingRows` (`:680-683`) needs a registry row whose `direction` matches **and** whose `read` or `counterforce` **module** is the importer. Executed against the live 48-row registry: **0 licensing rows**, and **0 rows anywhere name `treatyBreach.js`**. The CPL-19 row the draft leaned on does not license it — its `read` and `counterforce` are both `pactFormation.js`.

⭐ **Method control:** the hand-copied layer table reproduces **all 152** committed baseline directions with **0 mismatches**, and the walker carries its own positive control at `:804-815`. This is not a detector artifact.

**⇒ CR-GR4C-7: THE ROW IS MINTED IN THIS PACKET'S OWN CHANGE**, on the same-commit obligation (`DESIGN_FP_COUPLINGS.md §0.3`). The coupling is real — a GRAMMAR-layer act now charges an INFO-layer stock — and declaring it is what the registry exists for.

**The exact row** (`src/domain/certification/couplingRegistryGrammar.js`; every field schema-verified by execution):

```js
export const GR4C_BREACH_CREDIBILITY_COUPLING = couplingRow({
  couplingId: 'CPL-19.INFO_TO_GRAMMAR.GR-4c.breach_credibility',
  pairId: 'CPL-19',
  direction: 'INFO→GRAMMAR',
  read: 'src/domain/worldPulse/treatyBreach.js#repudiateTreaty',
  receiptField: 'spatialLedgers.credibility[].{score,lastUpdateTick,holder}',
  counterforce: 'src/domain/worldPulse/pactFormation.js#reserveFor',
  flags: Object.freeze(['oathHolderEnabled', 'infoStatecraftEnabled']),
  owningVolume: 'GRAMMAR',
  owningWave: 'GR-4c',
  intendedDesk: 'diplomacy',
});
export const GR4_BREACH_CREDIBILITY_COUPLINGS = Object.freeze([GR4C_BREACH_CREDIBILITY_COUPLING]);
```

Executed conformance: `COUPLING_ID_SHAPE` matches; keys are **exactly** the required set with **no** optionals; `couplingId` is unique against the live registry; row and `flags` are frozen; `pairId` reuse is precedented (schema v2 permits several independently-owned reads on one directional pair). **`CHARTERED_VOLUME_PREFIXES` already contains `GR`, so no `owningVolume` widening is owed.**

**⚠⚠ THE TEMPLATE GAP — four packets have missed this identical pair; this one does not.** `COUPLING_REGISTRY` is an **explicit enumeration of named aggregates** (`couplingRegistry.js`), not a dynamic composition. A new row therefore reaches the registry only if `couplingRegistry.js` also (a) imports the new aggregate, (b) spreads it into `COUPLING_REGISTRY`, and (c) re-exports both constants by name — that file's own docstring calls the enumerated re-export list *"the registry's public surface"*, and its IN-leaf comment states that a leaf composed without re-exported constants *"would make this file the one place a row exists but cannot be named."* **`src/domain/certification/couplingRegistry.js` is in the manifest from the start.**

**One-row-moves-three-pins — ALL FOUR consumers enumerated, per file, EXECUTED:**

| Consumer | Moves? | Measured reason |
|---|---|---|
| `tests/domain/couplingRegistry.test.js` | ⚠ **MOVES — manifest TEST row** | `:122` is an exact-list pin `expect(COUPLING_REGISTRY).toEqual([…])` built from aggregate spreads; the new aggregate must be added there |
| `tests/lint/couplingInclusion.walker.test.js` | **needs no edit** | the licensing join covers the pair once the row exists — executed with the row present: **1 licensing row, the arm passes**. It is a manifest row only for the *census*, not for this |
| `tests/lint/couplingDesk.walker.test.js` | **DOES NOT MOVE** | all four arms iterate kinds. The row carries no `kinds` and no `deskAuthority`, and `scannedKindsOf` (`:95-99`) reads **only** `row.receiptField` for the `[kind=…]` token — this receiptField has none, so it scans `[]`. `DISPUTED` stays at 4; `AUTHORED_ROW_FLOOR` is a `>=` floor |
| `tests/domain/couplingReceiptSample.test.js` | **DOES NOT MOVE** | executed parse: `rootKind = 'spatialLedgers'` — a known `STATE_ROOTS` member, so no `unknown-root`; and not a `returned-read`, so the **frozen 4-entry `returnedOnly` list at `:210` is untouched**. The `addresses > COUPLING_REGISTRY.length` floor only strengthens |

## 4. Hard scope budget

| Limit | Budget | GR-4c | |
|---|---:|---|---|
| Behavior families | 1 | 1 | ✓ |
| New persisted record families | 1 | **0** — the credibility ledger exists | ✓ |
| Named writer per changed state | 1 | 1 — `advanceCredibility` stays the sole writer; GR-4c adds a **caller** | ✓ |
| Feature flags | 1 | **0 new** — both gates are landed helpers | ✓ |
| User-facing surfaces | 1 | **0 new** — `credibilityRead.js` → `RealmIntrigue.jsx` is INHERITED | ✓ |
| Direct production consumers | 2 | **1** — `treatyBreach.js` consumes the leaf | ✓ |
| New logic-bearing production leaves | 2 | **1** | ✓ |
| Existing logic-bearing production files modified | 3 | **1** — `treatyBreach.js` | ✓ |
| Registration-only production files | 3 | **2** — `couplingRegistryGrammar.js`, `couplingRegistry.js` (CR-GR4C-7) | ✓ |
| Handwritten files total | 12 | **8** | ✓ |
| New/changed effective production lines | 400 | **~86 projected** (leaf ≤60, `treatyBreach.js` ≤12, registry ≤14) | ✓ |
| Each new leaf | 250 | ~60 | ✓ |
| Shared/hot-file delta | 15 each | `treatyBreach.js` ≤12 against **637** of headroom; **no hot file is named** | ✓ |
| Acceptance cases | 8 | **7** (§9) | ✓ |

⭐ **No budget row is at cap and no row carries an override**, including after the coupling row's two registration files.

## 5. Preflight

```sh
git status --short --branch
git rev-parse HEAD
git diff HEAD --stat                                   # ⛔ the diagnostic; NEVER --porcelain alone
git merge-base --is-ancestor 0b98626f HEAD             # this packet's verified base
git merge-base --is-ancestor a53ef7c6 HEAD             # GR-4a
git merge-base --is-ancestor dd457b9a HEAD             # GR-4b-α

# Substrate untouched since the verified base.
git log --oneline 0b98626f..HEAD -- \
  src/domain/worldPulse/treatyBreach.js src/domain/worldPulse/informationStatecraft.js \
  src/domain/worldPulse/treatySuccession.js src/domain/worldPulse/pactFormation.js \
  src/domain/worldPulse/pulseKernel.js src/domain/worldPulse/peaceTerms.js \
  src/domain/certification/couplingRegistry.js \
  src/domain/certification/couplingRegistryGrammar.js       # expect EMPTY

# New files absent.
test ! -e src/domain/worldPulse/treatyBreachCredibility.js
test ! -e tests/domain/treatyBreachCredibility.test.js

# Targets clean (path-scoped; foreign dirt elsewhere is RESERVED, never touched).
git diff --quiet -- src/domain/worldPulse/treatyBreach.js
git diff --quiet -- tests/property/oathHolderDormancyFence.test.js
git diff --quiet -- tests/lint/sovereigntyLightingContract.walker.test.js
git diff --quiet -- src/domain/certification/couplingRegistry.js
git diff --quiet -- src/domain/certification/couplingRegistryGrammar.js
git diff --quiet -- tests/domain/couplingRegistry.test.js

# Live symbols — by symbol, never by line number.
rg -n 'export function advanceCredibility|export function infoStatecraftActive|export const CREDIBILITY_TUNING|export function credibilityScoreOf' \
   src/domain/worldPulse/informationStatecraft.js
rg -n 'export function repudiateTreaty|SUCCESSION_REPUDIATION_TYPE|TREATY_REPUDIATION_TYPE' \
   src/domain/worldPulse/treatyBreach.js
rg -n 'export function oathHolderActive' src/domain/worldPulse/oathHolder.js
rg -n 'OATHBREAKER_PENALTY|credibilityScoreOf' src/domain/worldPulse/pactFormation.js
rg -n 'export function isRepudiationBreach' src/domain/worldPulse/treatyBreachTypes.js
rg -n 'GR2_PACT_FORMATION_COUPLINGS|GR3_TERM_FAMILY_COUPLINGS' src/domain/certification/couplingRegistry.js
```

⛔ **AND FOUR MANDATORY PREFLIGHT MEASUREMENTS, each with its own STOP:**

- **B13-a — `treatyBreach.js` effective lines** under eslint's own `Linter` (expect **163** of 800). A figure materially above ~700 is a STOP.
- **B13-b — `informationStatecraft.js` effective lines** (expect **780** of 800). ⚠ Read-only here; measured so the implementer can prove it did not drift into it.
- **B15 — the OSR scan**, before the first edit and again after the leaf exists (§3.6). A mint implicated ⇒ STOP.
- **B16 — the `title=` walker** (`TITLE_BASELINE = 485`, observed 485, **zero headroom**). If the implementer's work moves it at all, that is a STOP and a chair act.

### 5b. Baselines — EVERY ROW EXECUTED AT PROMOTION

⭐ **The B13 law applies to this table: a delegated figure wrong by seventeen lines nearly landed a six-line edit into one line of room. Every row below was executed by Lane AP at `0b98626f`, with `TRUE_EXIT` captured in-shell.**

| # | Premise | Command | Status |
|---|---|---|---|
| B1 | Breach + succession suites green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/successionQuestion.test.js tests/domain/treatySuccessionVoice.test.js tests/domain/realmVerbExecution.test.js tests/domain/peaceTerms.test.js` | ✅ **EXECUTED — `TRUE_EXIT=0`** |
| B2 | Credibility + statecraft suites green at base | `… npx vitest run tests/domain/informationStatecraftPins.test.js tests/domain/intelSelfPolicing.test.js tests/domain/politicsCredibilityRead.test.js tests/domain/pactFormation.test.js` | ✅ **EXECUTED — `TRUE_EXIT=0`** |
| B3 | Dormancy fence + statecraft goldens green | `… npx vitest run tests/property/oathHolderDormancyFence.test.js tests/property/informationStatecraftDormancyGolden.test.js tests/property/npcCredibilityDormancyGolden.test.js tests/property/intelTradeDormancyGolden.test.js` | ✅ **EXECUTED — `TRUE_EXIT=0`** |
| B4 | Typecheck posture, both windows named | `npm run typecheck:ratchet` (`tsconfig.full.json`), then `npm run typecheck:domain:strict` (`tsconfig.domain-strict.json`) | ✅ **EXECUTED — `TRUE_EXIT=0` BOTH.** ⚠ an unbaselined new file's error allowance is **ZERO** |
| B5 | Lighting census row | read the file at preflight | ✅ **EXECUTED — `2408/365/2043/19945/5628` at `:3985`.** ⛔ re-derive from the FILE; never fold onto this row |
| B6 | Test-ratchet headroom | read `scripts/.test-ratchet-baseline.json` + `testRatchet.test.js:177` | ✅ **EXECUTED — 16 entries of `CEILING = 17`.** Land with no new banked failure |
| B7 | Pre-existing gate reds | committed-base run, capturing `$?` yourself | ⚠ **NOT RUN — the full gate is the implementer's wave-end act.** The only legitimate pre-existing red to attribute is the owner-approved `generatorGoldenMaster` golden |
| B8 | Coupling walkers at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/couplingInclusion.walker.test.js tests/domain/couplingRegistry.test.js` | ✅ **EXECUTED — `TRUE_EXIT=0` at base.** ⛔ The mount reds `couplingInclusion` until the CR-GR4C-7 row lands **in the same commit** |
| B9 | Negative-assertion allowance for a new file | read `negativeAssertionAnchor.walker.test.js` `ceilingFor` | ✅ **EXECUTED at THIS head — `FROZEN_UNANCHORED_NEGATIVES[file] ?? READMITTED_GENERATION_FACING[file] ?? 0`; a new file is in neither map ⇒ ZERO** |
| B10 | Chunk-membership pins | `rg 'treatyBreach|informationStatecraft' tests/build/` | ✅ **EXECUTED — ZERO hits across 51 files** |

## 6. Exact contracts

### 6.1 New leaf — the pure banded charge

**Home: `src/domain/worldPulse/treatyBreachCredibility.js`. PURE. It takes no `worldState`, no ledger and no tick.**

```js
export const BREACH_CREDIBILITY_TUNING = Object.freeze({ CHARGE_BASE: 0.05 });
export function breachCredibilityDeltas(verdict) -> ReadonlyArray<CredibilityDelta>
```

- Input is GR-4a's **verdict object** — `{ breachType, severity01, defaultedBy }` — read as primitives.
- **Total.** `null`, `undefined`, a non-object, a blank `defaultedBy`, a non-finite `severity01`, or a `breachType` outside `BREACH_TYPES` each answer **`[]`** without throwing. Membership is tested through `isRepudiationBreach` from `treatyBreachTypes.js` (the landed total predicate) so the vocabulary has exactly one home.
- Output, when it fires: `[{ id: String(defaultedBy), kind: 'fracture', magnitude01: round4(clamp01(CHARGE_BASE * severity01)) }]` — **exactly one delta**, never a list.
- ⛔ **CR-GR4C-2 — `kind: 'fracture'` is a SCALING CHOICE, not a semantic one, and the packet says so in the file.** The kind is not persisted (`informationStatecraft.js:372` stores only `{score,lastUpdateTick,holder}`); it selects which landed `CREDIBILITY_TUNING` constant `signedOf` applies (`FRACTURE_FALL_W = 8`). No output can distinguish it from a coalition fracture, and none needs to. **ZERO new tuning keys.**
- ⛔ **The file must not contain the string `setSpatialLedger(<anything>, 'treaties',` anywhere, including comments** — `oathStampTotality.walker.test.js:137` convicts comments (GR-4a §6.2).
- ⛔ **The file must not contain the dotted token `.npcs`,** including in comments.
- ⛔ **Zero `getSpatialLedger` calls, zero `worldState` parameters, zero tick parameters.** This is what keeps it out of the observed-shape resolver and out of the dead-window shape (§3.2, §3.6).
- ⭐ **CR-GR4C-1 — an ANCHORED in-file note records why the fracture idiom was not copied**, naming the dead window, its executed evidence, and `GR-4e` as the named repair, so the next lane does not "restore consistency" by re-adding a tick predicate.

### 6.2 The mount — inside `repudiateTreaty`, after the treaty write

Exactly one insertion in `src/domain/worldPulse/treatyBreach.js`, immediately after `let nextWorldState = setSpatialLedger(worldState, 'treaties', next);` and **before** the existing disposition block:

```js
// GR-4c — THE OATH FINALLY COSTS SOMETHING. Both roads end here, so both charge here:
// one delta, banded by the verdict GR-4a already graded. `advanceCredibility` is the
// estate's sole credibility writer and self-gates on infoStatecraftActive, so this is a
// conjunction of two landed gates and no new flag. Charged at the ACT, not at a later
// fold — the tick-windowed fold idiom cannot see a record written after it runs.
if (oathHolderActive(worldState)) {
  const charged = advanceCredibility({ worldState: nextWorldState, tick: nowTick, deltas: breachCredibilityDeltas(verdict) });
  if (charged.changed) nextWorldState = /** @type {Record<string, unknown>} */ (charged.worldState);
}
```

Two new imports; `oathHolderActive` is **already imported** at `:17`. **Effective delta ≤ 12.** ⚠ The `advanceCredibility` import is the edge that takes the CR-GR4C-7 coupling row (§3.9) — it lands in the same commit or `couplingInclusion.walker.test.js` reds.

- **Exactly-once is structural, not a predicate.** `repudiateTreaty` refuses an already-broken instrument through `isRepudiableTreaty` (`:82-83`) and `isSuccessionDisavowable` (`treatySuccession.js:162-163`, via `isRepudiationBreach`). No tick window, no consume-once marker, no persisted flag.
- **Both roads are charged** (CR-GR4C-3), which is what `DESIGN_FP_GRAMMAR.md:1080-1084` requires and what makes this one insertion sufficient.
- **Multiple disavowals in one tick** fold sequentially through `answerSuccessionQuestions`' loop (`treatyBreach.js:296-303`). Arithmetically safe: after the first fold every entry carries `lastUpdateTick: now`, so the second call decays at `age = 0` (factor 1). Pinned at C4, not assumed.

### 6.3 ⭐⭐ THE BAND — the packet's one authored number, DERIVED AND EXECUTED

The design's headline claim is that the door closes on the **third** disavowal. The named consumer is `clamp01(-credibilityScoreOf(...))` (`pactFormation.js:364`), which **saturates at score = −1**. So the claim is only true inside a narrow band, and outside it the feature is either invisible or slams shut on the first breach.

Executed against the real writer (`advanceCredibility`), the real constants, and the real consumer arithmetic, gate proved open (`changed = true`, ledger materialized):

| `CHARGE_BASE` | road | n=1 | n=2 | n=3 | n=4 |
|---|---|---|---|---|---|
| **0.05** | open repudiation (`severity01 = 1`) | res **+0.140** | +0.278 | **+0.350 SATURATED** | +0.350 |
| **0.05** | lineal succession (`0.75`) | +0.105 | +0.209 | +0.311 | **+0.350** |
| **0.05** | coup-born succession (`0.35`) | +0.049 | +0.097 | +0.145 | +0.192 |
| 0.08 | open repudiation | +0.224 | **+0.350** | +0.350 | +0.350 |
| 0.125 | open repudiation | **+0.350** | +0.350 | +0.350 | +0.350 |

**`CHARGE_BASE = 0.05` is the measured answer**, and it delivers the design verbatim:
- the open-repudiation door closes on the **third**;
- a **lineal** heir's disavowal is lighter — the fourth;
- a **coup-born** seat never closes it in four — *the world understands a revolution*;
- the belief economy barely notices: `credibilityWeight` stays **≥ 0.9038** through three open repudiations, so the charge bites GR-2's acceptance reserve and not the corroboration math.

⛔ **CR-GR4C-2 — `CHARGE_BASE` is module-local and frozen, on the CR-GR4-4 precedent.** ZERO new keys in `CREDIBILITY_TUNING`, `PEACE_TERMS_TUNING`, `SUCCESSION_TUNING` or `simulationRules`. It carries an in-file `⚠ UNSOAKED — rides the endgame tuning signature` comment. **The implementer may not tune it and may not add a second value.**

### 6.4 What is NOT owed — measured, so nobody "helpfully" edits it

`ledgerOwnershipManifest.js` (no `credibility` row; the `treaties` writer set is unchanged); `pulseStageManifest.js` (no new stage or substage); `scripts/.size-baseline.json` (nothing crosses a ceiling); `tests/lint/.coupling-inclusion-baseline.json` (⛔ **the baseline may never GROW — the new pair is licensed by the CR-GR4C-7 registry row, NEVER by a baseline entry**); `informationStatecraft.js` (import target only); `simulationRules.js` (no new key); `tests/lint/couplingDesk.walker.test.js` and `tests/domain/couplingReceiptSample.test.js` (both measured unmoved, §3.9).

## 7. Exact change manifest

| Action | File | Symbol / region | Max Δ | Instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/worldPulse/treatyBreachCredibility.js` | `BREACH_CREDIBILITY_TUNING`, `breachCredibilityDeltas` | `60` | §6.1 + §6.3. PURE; primitives in, one delta out. ⛔ No `worldState`, no tick, no `getSpatialLedger`. ⛔ Must not contain `setSpatialLedger(<x>, 'treaties',` or `.npcs` anywhere, including comments. |
| `MODIFY` | `src/domain/worldPulse/treatyBreach.js` | inside `repudiateTreaty`, after the treaties write | **`12`** | §6.2. Two imports + one gated block. ⛔ No new exported ledger-writing symbol. |
| `REGISTER` | `src/domain/certification/couplingRegistryGrammar.js` | `GR4C_BREACH_CREDIBILITY_COUPLING`, `GR4_BREACH_CREDIBILITY_COUPLINGS` | `14` | §3.9 verbatim. The row's fields are chair-declared; copy the neighbouring GR-2 row's shape. ⛔ No `kinds`, no `deskAuthority`. |
| `REGISTER` | `src/domain/certification/couplingRegistry.js` | import + `COUPLING_REGISTRY` spread + named re-export | `6` | ⚠⚠ **THE TEMPLATE GAP — four packets have missed this file.** All three edits or the row exists and cannot be named (§3.9). |
| `TEST` | `tests/domain/couplingRegistry.test.js` | the `expect(COUPLING_REGISTRY).toEqual([…])` list | `n/a` | Add the new aggregate spread in wave order, with a dated one-line comment like its GR-2/GR-3 neighbours. |
| `CREATE` | `tests/domain/treatyBreachCredibility.test.js` | C1–C7 | `n/a` | ⚠ **Name and site it exactly as given** — §8 item 2. Straight-line registration only — §8 item 1. |
| `TEST` | `tests/property/oathHolderDormancyFence.test.js` | FENCE 3 counter **+ the mandatory both-lit control** | `n/a` | ⭐ **EXTEND; do not author a new fence file** — §8 item 4. ⛔ **CR-GR4C-8: the counter is vacuous without the both-lit control** (§3.5). |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` row + a dated comment | `n/a` | Re-derive all five WHOLE in one run and re-record whole, cause stated — §8 item 3. ⛔ Subject to the foreign-title STOP and the census-holder rule. |

**Named do-not-touch:** `src/domain/worldPulse/peaceTerms.js`, `src/domain/worldPulse/informationStatecraft.js`, `src/domain/worldPulse/pulseKernel.js`, `src/domain/worldPulse/pulseStageManifest.js`, `src/domain/worldPulse/ledgerOwnershipManifest.js`, `src/domain/worldPulse/treatySuccession.js`, `src/domain/worldPulse/treatySuccessionVoice.js`, `src/domain/worldPulse/oathHolder.js`, `src/domain/worldPulse/pactFormation.js`, `src/components/OutputContainer.jsx`, `tests/domain/informationStatecraftPins.test.js`, `tests/lint/couplingDesk.walker.test.js`, `tests/domain/couplingReceiptSample.test.js`, every baseline (`.size-baseline.json`, `.test-ratchet-baseline.json`, `.observed-shape-readers-baseline.json`, `.coupling-inclusion-baseline.json`, `mutation-coverage-manifest.json`), `eslint.config.js`, `vite.config.js`, and every file outside this table. Generated artifacts: `NONE`.

**`requiredSymbols` (all SUCCESSOR symbols; GR-4c retires nothing — CR-IN1B-9's rule is satisfied trivially and the packet says so):**
`informationStatecraft.js#advanceCredibility`, `#infoStatecraftActive`, `#CREDIBILITY_TUNING`, `#credibilityScoreOf`; `treatyBreach.js#repudiateTreaty`, `#SUCCESSION_REPUDIATION_TYPE`, `#TREATY_REPUDIATION_TYPE`; `treatyBreachTypes.js#isRepudiationBreach`; `oathHolder.js#oathHolderActive`; `pactFormation.js#OATHBREAKER_PENALTY`. **All ten confirmed present by executed `rg` at `0b98626f`.**

### 7b. Reservations — EXECUTED
**22 packets; exactly one non-terminal row (`IA-2`, `STALE`) reserving twelve paths, intersecting GR-4c's eight at ZERO.** ⛔ GR-4c must not name `docs/implementation/INDEX.md` or `docs/implementation/PACKET_MANIFEST.json` — `IA-2` reserves both and the validator errors `duplicate change path across packets`. Those are coordinator acts, on the TC-5B/IN-1B precedent.

## 8. Landing discipline this manifest incurs — SIX obligations

1. ⚠⚠ **THE PARKED-SUITE TRAP TAKES THE WHOLE FILE.** A `test(`/`it(` registered inside a loop is `TEST_UNREGISTERED` and the **whole file parks**; `.each()` parks via `TEST_TABLE_UNPROVEN`. Register every case straight-line; loops go **inside** an `it`. **Verify `credited` moved, not just `files`.**
2. ⚠ **THE MUTATION-COVERAGE NAMING TRAP.** `mutationCoverage.shared.mjs:27-39` makes a file an invariant automatically by living in one of seven enforcer dirs **or** by a basename matching `census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin`. **`treatyBreachCredibility.test.js` in `tests/domain/` matches none — the dodge is load-bearing and is lost to a rename.**
3. ⭐ **THE LIGHTING CENSUS.** Re-derive **all five in ONE run and re-record WHOLE**; never patch `files` alone. ⚠ The sequence hazard is live: while any arm is red the census stops measuring. Probe with a temporary `console.log` **inside the existing census test, before its first assertion**, so it mints no title. ⛔ STOP on a foreign lane holding uncommitted test titles, on a census already red at pristine base, or on the chair not having confirmed GR-4c is the in-flight holder.
4. ⭐ **THE DORMANCY FENCE IS EXTENDED, NOT REPLACED.** FENCE 3 needs **one new counter** on the `treatyBreach.js → advanceCredibility` edge, proving a dark tick never calls it, **plus the CR-GR4C-8 both-lit control that proves the counter can count** (§3.5). FENCE 4 is free (no new `oathHolderEnabled` site). ⛔ A new fence **file** would move `files` and `credited` on top of `titles`/`suiteTitles`; extending moves only the latter two.
5. ⚠ **ANCHORED NEGATIVES, AND THE RATCHET HAS ONE SLOT.** `negativeAssertionAnchor.walker.test.js` gives a new file **ZERO** (executed at this head, §5b B9); the three counted matchers are `.not.toContain(`, `.not.toMatch(`, `.not.toHaveProperty(`, and the `// anchored:` escape is accepted on the assertion line or the **single** line immediately above (⚠ a multi-line note counts only if its LAST line carries the marker). Route negatives through `tests/helpers/anchoredNegatives.js`. The test ratchet is at 16 of `CEILING = 17`: land with no new banked failure and never raise it.
6. ⛔⛔ **THE DOC GATE — this packet's own prose is in-corpus.** `tests/docs/enforcement-claims.test.js` freezes naked claims **per claim**, keyed `${file} :: ${match}` with a frozen count of zero for a new key, so **one untagged occurrence in `GR-4C.md` reds a GREEN test the ratchet cannot absorb.** A claim counts as naked when it is untagged **or** carries no resolvable target, so a placeholder tag is no escape.
   ⛔ **DO NOT TRANSCRIBE THE FORBIDDEN VOCABULARY INTO THIS OR ANY DOC — transcribing it IS an occurrence, and that is exactly how a packet reds the gate it is warning about.** Read the `CLAIM_RE` literal at its one home, `tests/docs/enforcement-claims.test.js`, and check your prose against it with a throwaway script. In substance it forbids self-congratulatory enforcement assertions — claims that a rule was raised to an error level, that a count was driven to nothing, that something is enforced by machine, that the gate has newly acquired coverage, or that a condition breaks the gate or the build. Fenced code and quoted prose still count in `.md`. Either tag with `@enforced-by` naming a target that genuinely resolves within ±3 lines, or paraphrase — *"reds the gate"* is safe. **This packet was scanned against the live `CLAIM_RE` at promotion: 0 hits.**

## 9. Acceptance matrix — the closed denominator (7 of 8)

| ID | Case | Required observation |
|---|---|---|
| **C1** | **Main reachable behavior** | Both flags lit; a DM `REPUDIATE_TREATY` on a live NAP. `spatialLedgers.credibility[breaker].score` is **exactly `-0.4`** after the first breach (`CHARGE_BASE 0.05 × severity01 1 × FRACTURE_FALL_W 8`), `holder: 'people_held'`, `lastUpdateTick` = the breach tick. ⭐ **And the charge is present in the value `repudiateTreaty` RETURNS** — proving it is written at the act, not by a later fold. |
| **C2** | **Boundary — the grading is carried, not re-authored** | Succession road: a coup-born disavowal charges strictly less than a lineal one, and both strictly less than an open repudiation, on one fixture in one assertion chain. The three magnitudes are exactly `CHARGE_BASE × {0.35, 0.75, 1}`. |
| **C3** | **Absent / disabled — two axes, WITH THE MANDATORY LIT-MUTANT CONTROL** | (a) `oathHolderEnabled` absent, and separately explicit `false`: a breach on both roads leaves **no `credibility` key at all** and FENCE 3's new counter reads **0**. (b) `oathHolderEnabled` lit but `infoStatecraftEnabled` dark: same result, by `advanceCredibility`'s own gate. ⛔⛔ **CR-GR4C-8 — REQUIRED, not optional: a BOTH-LIT run in which the counter is proven to INCREMENT.** The fence's own fixture is `{warLayerEnabled, peaceEngineEnabled}` plus `oathHolderEnabled` only (`:107`, `:181`), so without this control the counter reads 0 in every existing run and measures nothing. |
| **C4** | **Duplicate / idempotent + order-independence** | Re-running the same breach is refused by the eligibility predicates and writes nothing further. Two disavowals on two instruments in one tick fold **both**, and the resulting ledger is identical under either application order. |
| **C5** | ⭐⭐ **Writer→reader integration — THE DESIGN'S HEADLINE CLAIM, AS ARITHMETIC** | Three successive open repudiations across ticks drive `clamp01(-credibilityScoreOf(...))` to **0.140 → 0.278 → 1.0 (saturated)**, so `reserveFor`'s oathbreaker term reaches the full `OATHBREAKER_PENALTY 0.35` **only at the third**, and a counterparty that would have signed at n=1 refuses at n=3. |
| **C6** | **Counterforce — the mark is not a ratchet** | After `HALF_LIFE_TICKS = 52` the charge halves; past `MAX_LOOKBACK_TICKS = 260` it reads zero and prunes below `PRUNE_EPSILON`. A reformed lineage is pactable again. ⭐ **And the belief economy is not distorted:** `credibilityWeight` after three open repudiations is **≥ 0.90**. |
| **C7** | **Lifecycle round trip** | A charged credibility entry survives a JSON round trip with its `score`/`lastUpdateTick`/`holder`, re-decays correctly against a later tick, and a world whose treaty shell was pruned at `breachExpiresTick` retains the charge — the stock outlives the instrument. |

**C8 (privacy boundary) is OMITTED, not replaced** — GR-4c mints no beat and no audience projection; the succession voice is GR-4b-α's and is terminal. ⛔ Do not add an eighth case.

### 9b. LIT-OUTPUT POSTURE — declared, not discovered

> **Dark, NOTHING MOVES, and that is an assertion, held by three independent mechanisms:** (1) `oathHolderActive`, the single existing strict `=== true` read, guards the block; (2) `advanceCredibility` self-gates on `infoStatecraftActive` and returns the same `worldState` reference; (3) **no test in the estate lights both flags** — the four `oathHolderEnabled: true` files light no information layer, and the one file where a lit information layer meets `REPUDIATE_TREATY` (`realmVerbExecution.test.js`) confines `infoStatecraftEnabled` to a different `describe` at `:342`.
>
> **Lit on both, YES — a new credibility write exists, by design.** That is a declared shift confined to the doubly-lit path. **No committed golden lights `oathHolderEnabled`**, so **no golden should move**; the implementer proves it by running the four dormancy goldens unchanged.
> ⚠ **Figures permitted to move, each re-recorded whole with the cause stated:** the five lighting-census numbers, and `.test-ratchet-baseline.json`'s scope figures via `--update`. ⛔ **Everything else moving is a STOP.**

## 10. Verification commands

```sh
# Baselines B1–B3 — the slot is acquired in the same chain, never observed and released.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/successionQuestion.test.js tests/domain/treatySuccessionVoice.test.js \
  tests/domain/realmVerbExecution.test.js tests/domain/peaceTerms.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/informationStatecraftPins.test.js tests/domain/intelSelfPolicing.test.js \
  tests/domain/politicsCredibilityRead.test.js tests/domain/pactFormation.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/property/oathHolderDormancyFence.test.js \
  tests/property/informationStatecraftDormancyGolden.test.js \
  tests/property/npcCredibilityDormancyGolden.test.js \
  tests/property/intelTradeDormancyGolden.test.js

# Focused behavior — C1..C7.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/treatyBreachCredibility.test.js tests/domain/successionQuestion.test.js \
  tests/property/oathHolderDormancyFence.test.js tests/domain/pactFormation.test.js

# The walkers this packet can move — all exact-equality pins. The coupling pair is FIRST:
# it is the arm the CR-GR4C-7 row exists to keep green.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/couplingInclusion.walker.test.js tests/domain/couplingRegistry.test.js \
  tests/lint/couplingDesk.walker.test.js tests/domain/couplingReceiptSample.test.js \
  tests/domain/pulseStageContracts.test.js tests/lint/oathStampTotality.walker.test.js \
  tests/lint/sizeBaseline.test.js tests/domain/guidanceRegistry.walker.test.js

npx eslint src/domain/worldPulse/treatyBreachCredibility.js src/domain/worldPulse/treatyBreach.js
npm run typecheck:ratchet          # tsconfig.full.json
npm run typecheck:domain:strict    # tsconfig.domain-strict.json

# Census re-derivation (§8 item 3), then the landing gate.
npm run check:tail
```

⚠ **Never read a gate through a pipe** — use `npm run check:tail` or `sh scripts/gate-tail.sh <command...>`; a piped read reports the PIPE's status. **`npm run check` is a 17-step `&&` chain**: a red step blacks out every later step, so the receipt must say **which steps actually ran**. **Trust no exit status you did not capture yourself.**
⛔ **Never wrap `npm run check*` in `gate-mutex.sh --run`** — `test:ratchet` re-acquires and self-deadlocks (exit 3 is the mutex giving up, not a red). Run `check:tail` bare from a fresh shell with `; echo TRUE_EXIT=$?`.
⚠ **Budget the wall clock:** `observedShapeReaders.walker`'s `beforeAll` is sized to 900 s because it measures ~264 s contended. A timeout there skips all 27 tests and then trips the ratchet's skip sentinel — a cascade that looks like a defect and is not.

## 11. Ordered coding sequence

0. Run §5 preflight and **all four mandatory measurements** (B13-a, B13-b, B15 OSR, B16 `title=`). Stop on any mismatch.
1. Capture B1–B3 and the four dormancy goldens **before the first edit**.
2. Add the smallest failing focused test — **C1**, the exact `-0.4` charge — before the leaf exists.
3. Implement `treatyBreachCredibility.js` (pure; primitives in, one delta out).
4. Mount the gated block in `repudiateTreaty` (§6.2). Make C1 green.
5. ⚠ **Land the CR-GR4C-7 coupling row in the SAME step as the mount** — all three registry edits (§3.9) plus the `couplingRegistry.test.js` list. Run `couplingInclusion.walker` immediately; it reds until the row is nameable.
6. Write C2–C7.
7. Extend FENCE 3 with the new counter **and its both-lit control**.
8. Run §10's focused checks and every named walker.
9. Re-derive and re-record the lighting census WHOLE, or STOP per its conditions.
10. Run the wave-end gate and produce the completion receipt: exact deltas, **both typecheck windows named with their configs**, which of the 17 steps ran, the census row before/after with this packet's delta attributed in isolation against a named committed sha, the dark-path golden evidence quoted, and `deviations: NONE` or a STOP.

⛔ **Do not start by changing a golden, baseline, budget, or persisted shape.**

## 13. Recorded deviations from design prose (each vetoable)

| # | Design says | Live code says | Resolution |
|---|---|---|---|
| **E1** | the charge rides the `fractureCredibilityDeltas` idiom | that idiom's window is dead (§3.2, EXECUTED) | **Code wins.** Same delta shape and sole writer; the call moves to the breach. |
| **E2** | "the door closes on the third disavowal" | `clamp01(-score)` saturates at −1; the naive magnitude closes it on the first | **Delivered, but only at `CHARGE_BASE = 0.05`** (§6.3, EXECUTED). |
| **E3** | `fractureCredibilityDeltas` at `:378`, consumed `:1364`; and `:363` | `:400` and `:1437` | Address rot. Navigate by symbol. |
| **E4** | GR-4a Q6 offers a fifth delta kind | a fifth kind needs a new `CREDIBILITY_TUNING` key ⇒ a tuning act ⇒ owner-signed; and the kind is not persisted | **Foreclosed by measurement**, not preference. |
| **E5** | GR-4a Q7 offers "a same-tick second fold **or** a `now − 1` lag" | both presuppose the fold site; three of four existing `advanceCredibility` callers already write at their own act | **Neither.** Q7 is dissolved. |
| **E6** | `DESIGN_FP_ARCH_GR.md` GR-4 §Collision: `worldState.proposals` payload shape VERIFY-AT-BUILD | that is the queue's shape | **Belongs to GR-4d**, not GR-4c. |
| **E7** | *(the compile draft's own §6.4)* "both files are inside `src/domain/worldPulse`; a same-layer import is not a cross-layer pair", so no coupling row is owed | the walker's layers are frozen module SETS matched by regex, not directories: `treatyBreach.js` is GRAMMAR and `informationStatecraft.js` is INFO, and the committed baseline already records same-directory pairs as cross-layer | ⛔ **DRAFT PREMISE REFUTED at promotion. The row is OWED and is MINTED (CR-GR4C-7, §3.9).** |
| **E8** | `couplingInclusion.walker.test.js:649-650`: a GRAMMAR row "needs a registry LEAF that does not exist yet plus a widening of the `owningVolume` set pin" | `couplingRegistryGrammar.js` **exists** with six rows in two aggregates, and `CHARTERED_VOLUME_PREFIXES` **already contains `GR`** | ⚠ **The walker's comment is STALE on both clauses.** ⛔ **NOT this packet's to fix** — recorded here for the chair's prose batch. The implementer does not touch that file. |

## 14. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` §"Mandatory STOP conditions", stop — without expanding or repairing — when:

- ⛔ **The dead-window verdict does not reproduce at dispatch HEAD.** If `fractureCredibilityDeltas` has acquired a second caller, or the pulse order has moved, the packet's premise has changed. Report; do not adapt.
- ⛔ **Any implementation reaches for a tick-window predicate** or a `worldState`/ledger read inside the leaf. That is the dead idiom re-entering.
- ⛔ **The OSR scan implicates a schema mint.** Report; do not mint; do not edit the baseline.
- ⛔ **Any dark-path motion is measured at all** on either flag axis. That is a premise refutation, not a golden to re-record.
- ⛔ **`treatyBreach.js` would exceed its budget of 12 effective lines**, or any edit would reach `peaceTerms.js`, `informationStatecraft.js` or `OutputContainer.jsx`.
- ⛔ **The `title=` walker moves at all** (485 of 485, zero headroom) — a raise is a chair act.
- ⛔ **`pulseStageContracts.test.js` reds** on the `treaties` writer set, or `oathStampTotality.walker.test.js` reds (the leaf named the ledger, even in a comment).
- ⛔ **`couplingInclusion.walker.test.js` still reds after the CR-GR4C-7 row lands**, or the row would need a `kinds`/`deskAuthority` field, or `couplingDesk.walker.test.js` / `couplingReceiptSample.test.js` move at all — all three were measured unmoved and any motion refutes §3.9.
- ⛔ **The `.coupling-inclusion-baseline.json` would need a new entry.** The baseline only shrinks; the row is the license.
- ⛔ **`tests/domain/treatyBreachCredibility.test.js` parks** — `credited` did not move with `files`.
- ⛔ **FENCE 3's counter cannot be shown to increment** in the both-lit control — a counter that cannot count is the vacuity CR-GR4C-8 exists to forbid.
- ⛔ **A foreign lane holds uncommitted test titles at census re-record time**, or the chair has not confirmed GR-4c is the in-flight census holder.
- ⛔ **Any `CREDIBILITY_TUNING`, `SUCCESSION_TUNING`, `PEACE_TERMS_TUNING`, `OATHBREAKER_PENALTY` or `simulationRules` key would need to change** — that is tuning, and tuning is owner-signed.
- ⛔ **Any solution needs a second `BREACH_CREDIBILITY_TUNING` value**, a new persisted key, a new flag, a new stage, a fifth delta kind, a PRNG draw, a clock read, or a Herald kind.
- ⛔ **A ratchet, baseline, budget, timeout or ceiling would need raising.**
- **Any packet premise here is refuted by live code. The code wins; the packet stops.**

## 15. Figures ledger — EXECUTED AT PROMOTION

⭐ **Lane AP executed every figure the compile draft left UNMEASURED, at `0b98626f`, before this packet was marked READY. The B13 law is discharged: no load-bearing figure in this packet is delegated.**

**EXECUTED BY LANE AP (promotion), each `TRUE_EXIT` captured in-shell:**
- **B1, B2, B3** — the three focused baseline suites through `gate-mutex.sh --run`: `TRUE_EXIT=0` each.
- **B4** — `typecheck:ratchet` (`tsconfig.full.json`) `TRUE_EXIT=0`; `typecheck:domain:strict` (`tsconfig.domain-strict.json`) `TRUE_EXIT=0`.
- **B8** — `couplingInclusion.walker` + `couplingRegistry` at base: `TRUE_EXIT=0`.
- **D-4, the one open structural question** — layer resolution, pair derivation, baseline membership, and the licensing predicate, run against the live 48-row registry; plus a **negative control** reproducing all 152 committed baseline directions with 0 mismatches; plus the with-the-row probe proving the licensing door opens (1 row). ⇒ §3.9 and CR-GR4C-7.
- **The four coupling consumers**, per file, with the mechanism for each (§3.9 table).
- **Chunk-membership pins** — zero hits in `tests/build/`.
- **`negativeAssertionAnchor` new-file allowance** — re-read at THIS head: ZERO.
- **The FENCE 1/2 fixture flag set** — `{warLayerEnabled, peaceEngineEnabled}` + `oathHolderEnabled`; `infoStatecraftEnabled` absent ⇒ §3.5 and CR-GR4C-8.
- **The lighting census five-tuple, `TITLE_BASELINE`, the test ratchet, the ten `requiredSymbols`, both `CREATE` paths absent, and the `PACKET_MANIFEST` reservation census** — all re-measured at this HEAD.
- **The `CLAIM_RE` scan** over this packet's own authored prose: **0 hits**.

**EXECUTED BY LANE AN (compile), re-runnable:** the dead-window re-derivation in all four legs; every effective-line figure in §3.7 through the enforcer's own `Linter`; the import-cycle reachability walk; the §6.3 band table through the real `advanceCredibility`; the flag census.

**NOT RUN, and deliberately the implementer's:** **B7** — the full 17-step gate. It is the wave-end act, not a promotion act.

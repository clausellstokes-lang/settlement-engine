# E0 — THE NARRATIVE TEMPO GOVERNOR — implementation plan (frozen)

> Architect: Fable 5 (surveyor/manager). Implementers/verifiers: Opus (model split, owner directive).
> Design authority: `docs/DESIGN_PACING_GOVERNOR.md` (frozen). This doc is the BUILD plan — it does
> not re-architect the design; it maps it onto the code and records the judgment calls the design
> deferred. Base lineage: review-fixes-2026-07-08 @ 5a78af5a. Branch: `claude/zealous-driscoll-f74588`.

## 0. THE ONE ABSOLUTE CONSTRAINT — DORMANCY (constitutional §0.2 law 1)

E0 ships **fully dormant**. With the governor absent/off, **every golden fixture, generator manifest
hash, and worldPulse projection is BYTE-IDENTICAL**. If any same-seed output shifts with the feature
off, STOP and report — do not adapt the golden. Baseline confirmed green before any change:
`religionDormancy.byteIdentity` + `beliefMapKernel.byteIdentity` + `worldTickCostEnvelope` = 13/13 pass.

The governor's activation gate is the presence of an explicit `narrativeTempo` axis on the rules —
mirroring the `disastersEnabled` opt-in-key pattern and the `spatialCanonVersion` presence-gate.
**No preset lights it this wave; no dial UI ships this wave** (lighting is a later owner-signed event).
Tests activate the governor by setting `narrativeTempo` explicitly on their fixtures.

## 1. THE GOVERNOR LAW (design §1) — how it maps onto the code

**Throttle spontaneity, never causality.** The code already encodes the exact distinction:

- **Causality (never throttled):** the deterministic majors — `coupOutcomes`, `warOutcomes`,
  `structuralCandidates` (population/exodus) — **bypass `rollCandidates` entirely**
  ([pulseKernel.js:1158](src/domain/worldPulse/pulseKernel.js)). Inside `rollCandidates`, `guaranteed`
  (`probability >= 1`) residual aftermaths "neither consume nor respect the auto budget"
  ([candidateEvents.js:396-397](src/domain/worldPulse/candidateEvents.js)).
- **Spontaneity (governor-eligible):** the stochastic (`probability < 1`) pressure-born stressor births
  + strategy/faction candidates flowing through `rollCandidates`.

### 1.1 Chain-immunity is scoped to RECEIPTED chains (JUDGMENT CALL — vetoable)

The design's flagship example "a war-born famine fires while the famine class is over budget" is **not
representable with existing fields**: the pressure model launders upstream arc identity — a war-born
famine and a bad-harvest famine are the *identical* candidate (`stressor_birth_famine`, generic
provenance `causes:[{source:'world_pulse'}]`). But design §1's *operative* clause is "the governor must
be **provably unable to break a receipted chain**." So:

- **The immunity guarantee is scoped to RECEIPTED consequences.** `isChainedConsequence(c)` returns true —
  and the governor NEVER throttles — when any of:
  - `/^stressor_(residual|spread|escalate)(_|$)/.test(c.candidateType)` — the receipted chain paths.
    (Build correction: the candidateTypes END in the stressor TYPE (`stressor_spread_famine`), so a
    prefix match on `candidateType` is used, NOT the plan's original `$`-anchored `ruleId` regex which
    would have missed them.)
  - `c.ruleFamily === 'mobilization_reaction'`, OR
  - ANY `condition.causes[].source` is an upstream stressor id (starts `world_stressor.`).
  - **NOT keyed on probability.** (Build correction, verifier-surfaced.) `probability >= 1` is NOT a
    reliable "chained" proxy: `strategy_deploy` (prob 1) is a SPONTANEOUS opportunistic-war birth the
    design §1 names as governor-eligible — exempting all prob-1 candidates let it escape the governor.
    The prob-1 CONSEQUENCES are still exempt: residuals carry the `stressor_residual` marker; the off-seam
    prob-1 consequences (`coup_succeeded`/`population_emigration`) bypass `rollCandidates` AND have a null
    drama-class (the fold's `dramaClassOf===null` guard drops them). The maxAuto `guaranteed` exemption in
    `rollCandidates` is a separate, unchanged gate.
- **Pressure-born births (incl. war-influenced famines) ARE governed** as spontaneous class draws under
  **deferral-not-denial** (design §1: "pressure persists and fires when a slot opens"). Pacing the *birth
  density* of a class is the governor's purpose; the causal pressure is untouched, only timing is paced.
- The §5 immunity pin is realized via the **receipted spread path**: a famine at A spreads to B — the
  `stressor_spread_famine` candidate (carrying source=A's id) fires even while the famine class is over
  budget. This is provable with existing fields, needs no pressure-model surgery.
- **DEFERRED (future owner-signed enhancement):** stamping causal provenance (`causedByArc`) at the birth
  sites so even a pressure-born war-famine's *birth* is immune (design's "option A"). Not this wave —
  it adds a persisted candidate field + changes what counts as chained (owner-gated).

## 2. SCOPE — one seam wired + registration mechanism (JUDGMENT CALL — vetoable)

The design says "one seam = rollCandidates" (§2) AND "every subsequent engine registers its
spontaneous-birth class at birth" (§6). The code has **five** birth pathways; only `rollCandidates` is
the seam. Reconciliation for E0:

- **WIRE the one seam** (`rollCandidates`): governs the pressure-born stressor births + strategy candidates
  (the bulk: war/plague/coup/economic/schism/famine via stressors). This is design §2.
- **BUILD the registration mechanism** (design §6): the `DRAMA_CLASS_REGISTRY` + a **walker/contract test**
  that fails if any spontaneous-birth candidateType lacks a manifest entry (class + `birthKind` + `wired`).
- **REGISTER-BUT-DEFER-WIRING** the bypass producers, each with a documented disposition in the manifest:
  - calamity annual strike (`calamityKernel.advanceCalamity`) — `class: calamity, wired: false`
  - religious contest flip (`religiousContest`/`deityStanceLane`) — `class: schism_contest, wired: false`
  - war siege-open / mobilization (`warDeployment`/`mobilization`) — `class: war, wired: false`
  - coup verdict, conquest, pestilence-travel — `birthKind: consequence` (exempt by law)
  Their governor WIRING is a follow-up registration (each has a distinct persistence/determinism nuance —
  annual idempotent draw; siege-hysteresis accumulator; out-of-band deployment seed — better handled in
  its own focused change). They are opt-in/dormant today, so deferral costs nothing while dormant.
  **This is "documented deferral, not a dropped thread"** — the walker enforces the manifest entry exists.

Rationale: faithful to §2 (one seam) + §6 (registration); dormancy absolute; bounded + reviewable;
avoids re-architecting three post-apply movers in one wave.

## 3. THE ACTIVATION AXIS (dormancy-safe, zero eager)

`narrativeTempo` is a **string-enum opt-in key**, ABSENT from `DEFAULT_SIMULATION_RULES`
([simulationRules.js:36-155](src/domain/worldPulse/simulationRules.js)) — exactly like `disastersEnabled`.
It rides the `...input` spread in `normalizeSimulationRules` untouched; it is NOT in `BOOLEAN_KEYS`
(derived from defaults, :316-320) nor `RULE_COMPARISON_KEYS` (:322-327), so `presetIdForRules`/
`rulesMatchPreset` never see it → **preset inference unaffected, goldens byte-identical**. It is NOT a
`PROFILE_KEY`, so the profile-strip loop (:502-511) neither strips nor materializes it.

- **DO NOT** add it to `DEFAULT_SIMULATION_RULES`, `PROFILE_DEFAULTS`, `RULE_COMPARISON_KEYS`, or light it
  on any preset this wave. (Lighting = owner-signed later event.)
- **Accessor `narrativeTempoOf(rules)`** lives in the **LAZY** governor module (NOT eager `simulationRules.js`
  — nothing eager consumes it, so it costs ZERO first-paint bytes; mirror `calamityEnabled` placement in
  lazy `spatial/calamity.js`). Body mirrors the fail-closed string-enum `infoModeOf`
  ([simulationRules.js:392-397](src/domain/worldPulse/simulationRules.js)):
  ```js
  const TEMPO_TIERS = Object.freeze(['quiet_local','realistic_regional','dramatic_campaign','full_simulation']);
  export function narrativeTempoOf(rules) {
    const v = rules && typeof rules === 'object' ? rules.narrativeTempo : null;
    return TEMPO_TIERS.includes(/** @type {string} */(v)) ? /** @type {string} */(v) : null; // null = DORMANT ⇒ budget ∞
  }
  ```
  `null` (absent/garbage) ⇒ dormant ⇒ every budget ∞ ⇒ `rollCandidates` output byte-identical.

## 4. THE LEDGER (conditionally-materialized worldState key)

New top-level conditional key `worldState.narrativeTempo` — NOT under `spatialLedgers` (that namespace is
spatial-marker-gated; the tempo governor is realm-level/aspatial-capable).

- **Register** by appending `'narrativeTempo'` to `CONDITIONAL_LEDGER_KEYS`
  ([worldState.js:345-349](src/domain/worldPulse/worldState.js)) — **APPEND ONLY at the END** (the array
  order IS serialized key order, pinned by the dormancy/golden oracle). Do NOT add to
  `FROZEN_CONDITIONAL_LEDGER_KEYS` (:165) — it mutates each tick, so it must take the mutable
  `deepCloneConditionalLedger` branch (:390-392). `ensureWorldState`'s loop (:385-394) then handles
  strip-from-shallow-spread + conditional re-materialize automatically — no other `ensureWorldState` edit.
- **Shape** (interval-invariant week-stamps, self-pruning, "absence = zero"):
  ```
  narrativeTempo: {
    realm:      { <class>: [w1, w2, ...] },        // birth week-stamps by drama class, in-window only
    settlement: { <id>:   { lastMajorWeek: w } },  // per-settlement post-major grace clock
    deferred:   { <class>: [{ week, settlementId }] } // held storms (the "deferral queue") for the DM receipt
  }
  ```
- **Window basis = `worldState.calendar.elapsedWeeks`** (interval-invariant), NOT `tick` (`tick` is a
  per-call counter that desyncs under coarse intervals + the M10b catch-up collapse). `TEMPO_WINDOW = 52`
  (`WEEKS_PER_YEAR`). A stamp expires when `elapsedWeeks - w >= 52`.
- **Self-prune to dormant:** each write drops expired stamps, drops a class when its list empties, drops
  `realm`/`settlement`/`deferred` when empty, drops the whole `narrativeTempo` key when all empty — so a
  flag-off (or drained) campaign is byte-identical-dormant. Materialize ONLY when `narrativeTempoOf(rules)`
  is non-null AND ≥1 in-window birth exists.

## 5. THE DRAMA-CLASS REGISTRY + WALKER (design §6)

Home: a new frozen `DRAMA_CLASS_REGISTRY` in `src/domain/worldPulse/decisionTier.js` (LAZY, the structural-
classification sibling that already holds `CAMPAIGN_ALTERING_CANDIDATE_TYPES`). Mirror the contract-tested
`CHANGE_AUTHORITY_POLICY` shape (per-entry `{class, birthKind, wired, module, rationale}`).

### 5.1 Class mapping (JUDGMENT CALLS — vetoable). 7 classes per design §2.

| candidateType (seam unless noted) | class | birthKind | wired |
|---|---|---|---|
| `stressor_birth_siege`, `_wartime`, `_occupation`, `_war_pressure` | war | spontaneous | true |
| `stressor_birth_disease_outbreak` | plague | spontaneous | true |
| `stressor_birth_magic_deadzone`, `_magical_instability`, `_monster_raider_pressure` | calamity | spontaneous | true |
| `stressor_birth_coup_detat`, `_succession_void` | succession_coup | spontaneous | true |
| `stressor_birth_religious_conversion_fracture`, `_religious_pact_betrayal`, `_insurgency`, `_rebellion` | schism_contest | spontaneous | true |
| `stressor_birth_market_shock`, `_indebtedness`, **`_famine`** | economic_shock | spontaneous | true |
| `strategy_deploy` (ruleFamily `strategy`) | war | spontaneous | true |
| `faction_government_challenge` | succession_coup | spontaneous | true |
| — calamity annual strike (calamityKernel, bypass) | calamity | spontaneous | **false** (deferred) |
| — religious conversion/betrayal (bypass, prob 1) | schism_contest | spontaneous | **false** (deferred) |
| — war_mobilization / siege-open (warDeployment, bypass) | war | spontaneous | **false** (deferred) |
| `coup_succeeded`, `coup_suppressed`, `conquest`, `stressor_residual`, `stressor_spread_*`, `stressor_escalate_*`, `mobilization_reaction_*` | (n/a) | **consequence** | exempt |
| boom_flourishing | boom_flourishing | — | **no producer** (declared, future rung) |

Notable rulings, all vetoable:
- **FAMINE → economic_shock.** The most common arc has no home among the design's 7 classes; a food-scarcity
  crisis is fundamentally economic. (Owner may prefer an 8th "subsistence" class — flagged.)
- **magical/monster stressors → calamity**, giving the calamity class a *seam* producer (the calamityKernel
  strike is the bypass producer, deferred).
- **mass_migration, infiltration/criminal_corridor, betrayal → EXEMPT** (unregistered ⇒ fail-open ⇒ never
  governed): consequence-adjacent or genuinely ambiguous; safer un-governed than mis-governed.
- **political_fracture → succession_coup; slave_revolt → schism_contest** (addendum ruling 2026-07-14 —
  two real `STRESSOR_CATALOG` keys the original §5.1 table omitted). Grounded in the existing game arc-labels
  (`REALM_LABELS`): `political_fracture`≡`succession_void`="The Succession Crisis"; `slave_revolt`≡`insurgency`
  ="The Uprising". Governed (not exempt) — leaving the two most political crisis types un-paced would be a gap.

### 5.2 The walker/contract test
A test (mirror `changeAuthorityPolicy` contract test) that: (a) every registry entry has a valid class +
birthKind + wired + rationale; (b) `DRAMA_CLASS_PRIORITY` covers all 7 classes exactly once; (c) a
grep-style guard that any NEW `stressor_birth_*` candidateType (scan the `STRESSOR_CATALOG` keys in
`stressorsCore.js`) either appears in the registry or is on an explicit `EXEMPT_STRESSOR_TYPES` allow-list
with a reason — so a future engine that adds a stressor type is forced to register its class or document
exemption (the §6 requirement made structural).

### 5.3 Priority order (simultaneity deferral — defer the LARGEST index)
```
DRAMA_CLASS_PRIORITY = Object.freeze([
  'war', 'succession_coup', 'plague', 'calamity', 'schism_contest', 'economic_shock', 'boom_flourishing',
]);
```
Ties broken by `compareStableKeys` ([candidateEvents.js:116](src/domain/worldPulse/candidateEvents.js)) —
the same codepoint comparator `resolveCandidateConflicts` uses. Zero rng.

## 6. THE GOVERNOR MODULE — `src/domain/worldPulse/narrativeTempo.js` (NEW, LAZY, any-cast=0)

Pure, deterministic, zero-rng, real JSDoc types (no `@type {any}`/`@ts-ignore` — enters the any-cast
baseline at 0 automatically). Imported ONLY by `candidateEvents.js`/`pulseKernel.js` (lazy chunk) — never
by an eager module. Exports:

- `narrativeTempoOf(rules)` → tier string | null (§3).
- `TEMPO_BUDGETS` — frozen per-tier `{ classMax, arcMax, graceWeeks }`. **Starting values (owner-retunable,
  named/frozen — design §4):**
  ```
  quiet_local:        { classMax: 1, arcMax: 2,  graceWeeks: 26 }
  realistic_regional: { classMax: 2, arcMax: 4,  graceWeeks: 13 }
  dramatic_campaign:  { classMax: 3, arcMax: 7,  graceWeeks: 8  }
  full_simulation:    { classMax: 4, arcMax: 10, graceWeeks: 4  }
  ```
  Guarantees monotonicity (classMax non-decreasing across tiers) so the dial-monotonicity pin holds by
  construction. `TEMPO_WINDOW_WEEKS = 52`.
- `dramaClassOf(candidate)` → class | null (registry lookup by candidateType, with the strategy/war
  disambiguation by ruleFamily).
- `isChainedConsequence(candidate)` → bool (§1.1 predicate).
- `countLiveMajorArcs(worldState)` → number: `worldState.stressors` filtered by
  `ACTIVE_STAGES = {active,emerging,peaking,easing}` ([chronicle.js:18](src/domain/worldPulse/chronicle.js))
  whose type maps to a governed class. One stressor record = one arc (spread extends footprint, not count).
- `readTempoLedger(worldState, elapsedWeeks)` → pruned snapshot `{ classCounts, graceOf(id), liveArcs }`
  (pure; prunes expired stamps at read).
- `governBirth({ candidate, snapshot, config })` → `{ defer: bool, reason: 'class_budget'|'grace'|'simultaneity'|null }`.
  Pure function of the ledger + codepoint priority. Order of checks: skip if `!config.active` (dormant) or
  `isChainedConsequence` or `dramaClassOf===null` → `{defer:false}`. Else: grace (settlement in
  `graceWeeks`) → class budget (in-window class count ≥ classMax) → simultaneity (liveArcs ≥ arcMax AND
  this class is the lowest-priority among the tick's pending spontaneous majors).
- `recordBirths(ledger, births, elapsedWeeks)` → next ledger (add week-stamps per class + per-settlement
  `lastMajorWeek`, prune, self-drop-to-undefined when empty). `births` = the major spontaneous outcomes that
  landed (from `selectedForApply`, filtered `dramaClassOf!==null && !isChainedConsequence`).
- `recordDeferrals(ledger, deferrals, elapsedWeeks)` → next ledger (the `deferred` "queue" for the DM receipt);
  cleared when the class's next birth lands or entries expire.

**Deferral model (JUDGMENT CALL — vetoable):** Model A (emergent re-fire) + a recorded `deferred` ledger.
Deferral = the candidate is skipped at the seam (a pure `continue` BEFORE `candidateRoll`, consuming no
rng and no auto budget) + a `deferred` record is written (for the DM receipt + test observability). Re-fire
is **emergent** (design §1 "for free"): the pressure persists (it is a pure re-derivation of persistent
causal scores — [pressureModel.js:133](src/domain/worldPulse/pressureModel.js)), so once an in-window birth
ages out (slot opens) the class is under budget and the re-generated candidate passes. If the
quiet-before-storm test proves seed-fragile, escalate to force-fire (Model B: release un-throttles the
matching candidate on first open slot). Start with Model A.

## 7. WIRING — exact hooks

### 7.1 `candidateEvents.js` `rollCandidates` (the seam) — [candidateEvents.js:380-430](src/domain/worldPulse/candidateEvents.js)
- Read `const tempo = options.tempo` (the injected snapshot; absent ⇒ dormant ⇒ skip all governor logic).
- Inside the per-candidate loop, alongside the existing `guaranteed`/maxAuto gate (:396-397), BEFORE
  `candidateRoll` (:399): if `tempo?.active` and `governBirth(...)` says defer → push a deferral record to a
  local `deferred` array and `continue` (no rng, no budget consumed). **Do NOT add a rollExplanation row on
  the dormant path** (rollExplanations length is an anti-vacuity assertion target — a deferral row must be
  emitted ONLY when the governor is active).
- Return `{ selected, rollExplanations, deferred }` (deferred defaults `[]` — byte-neutral when dormant).
- **any-cast:** candidateEvents.js is already at `{any:24}` in the baseline — add NO new `@type {any}`.
  Keep governor logic minimal here; delegate to `narrativeTempo.js` for all decisions.

### 7.2 `pulseKernel.js`
- **READ hook** ([pulseKernel.js:1138](src/domain/worldPulse/pulseKernel.js)): extend the `rollCandidates`
  options literal with a `tempo` sub-object built from the **pre-tick** `worldState` (in scope; not yet
  `memoryState`):
  ```js
  tempo: buildTempoContext(worldState, simulationRules), // null-active when narrativeTempoOf(rules)===null
  ```
  `buildTempoContext` (in narrativeTempo.js) returns `{ active, budgets, ledger, elapsedWeeks, liveArcs }`
  or `{ active:false }` when dormant.
- **WRITE hook** ([pulseKernel.js:1196](src/domain/worldPulse/pulseKernel.js), right after
  `let memoryState = applied.worldState;`): a new conditional fold modeled byte-for-byte on the
  dispositionStats fold (:1203-1208). Read `selectedForApply` (:1158) for the major spontaneous births that
  landed; `recordBirths` + `recordDeferrals(...deferred from the roll...)`; conditionally materialize/drop:
  ```js
  const nextTempo = foldNarrativeTempo(memoryState.narrativeTempo, selectedForApply, deferred, worldState.calendar.elapsedWeeks, simulationRules);
  if (nextTempo) memoryState = { ...memoryState, narrativeTempo: nextTempo };
  else if (memoryState.narrativeTempo !== undefined) { const { narrativeTempo: _drop, ...rest } = memoryState; memoryState = rest; }
  ```
  Write on `memoryState` (only it reaches `finalWorldState` at :1895).
- **DM receipt** (design §2 "pressure builds in the west", DM-visibility only): when `deferred.length`,
  append a wizardNews entry via `appendWizardNewsEntries` (the existing sink; it no-ops on empty entries →
  byte-identical when dormant). Gate strictly behind `tempo.active`. Entry `kind: 'tempo_pressure'`,
  `significance: 'notable'`, aggregate/regional (no player-facing surface). Zero deferrals ⇒ zero entries ⇒
  `wizardNews` byte-identical (it IS a golden surface — this is load-bearing).

### 7.3 `narrativeTempoOf` for the (deferred) dial
The dial (`SimulationRulesAxes.jsx`) is NOT touched this wave. When lit later, its `axisValue` will import
`narrativeTempoOf` from the lazy governor module (both lazy — free). Fiction voice "How loudly does history
speak?" and the 4 rungs are recorded here for that future event; not built now.

## 8. TEST PLAN (battery)

Harnesses (reuse, do not reimplement): `normalizeForDormancy`/`collectKeys` (exported from
`religionDormancy.byteIdentity.test.js`), `driveTicks` (beliefMapKernel form), `projectionFor` (spatial
golden candidate-histogram form), `soak(weeks)`+`atWeekOfYear` (seasonsMiniSoak form). Harness:
`previewCampaignWorldPulse`. Determinism knobs: fixed `rngSeed`, pinned `now` constant.

**(A) `tests/domain/tempoGovernorDormancy.byteIdentity.test.js`** — clone the religionDormancy structure:
- HOT multi-settlement fixture (grain-network + famine, per the spatial golden) driven BOTH governor-absent
  and with an empty-materialized `narrativeTempo` ledger; `normalizeForDormancy(a).toEqual(...(b))`.
- Anti-vacuity: `selected.length>0`, `rollExplanations.length>3`.
- Forbidden-key scan: `['narrativeTempo','deferred','tempo_pressure']` absent anywhere on the dormant run.
- Two-run `JSON.stringify(normalizeForDormancy(one))===...(two)` over a multi-tick drive.
- wizardNews-receipt-absent assertion on the dormant run.
- **The critical proof:** governor-ABSENT output === the pre-E0 golden bytes (same-seed).

**(B) `tests/domain/tempoGovernor.property.test.js`** — the ON pins (activate via `narrativeTempo` on rules;
seed-sweep idiom `for (const seed of [...])`):
- *class budget:* drive the economic_shock (famine) class over `classMax`; assert an over-budget spontaneous
  famine birth is absent from `selected` AND appears once in the `deferred`/receipt.
- *chain immunity:* seed a receipted `stressor_spread_famine` (source=upstream id) while the famine class is
  over budget; assert it STILL appears in `selected` (mirror the `guaranteed` bypass; assert
  `isChainedConsequence` true for it). Also assert a `probability>=1` residual still fires.
- *grace exemption:* a settlement inside `graceWeeks` emits no NEW independent major but still receives a
  chained/receipted consequence.
- *simultaneity:* drive live major arcs ≥ `arcMax`; assert the LOWEST-priority class's spontaneous birth is
  deferred while a higher-priority class's is not (codepoint-deterministic, no rng).
- *deferral determinism:* two identical drives ⇒ identical deferral set (byte-hash).
- *dial monotonicity:* same seed at `quiet_local` vs `dramatic_campaign` ⇒ arc-birth count (projectionFor
  histogram) monotonic non-decreasing.
- *quiet-before-storm:* drive a class over budget → births deferred → advance until an in-window birth ages
  out (slot opens) → assert a birth of that class fires within N ticks AND the `deferred` record clears.
- *no-crowd-out:* governor active yet OTHER families still produce candidates (settlementStrategy "no
  budget-starve" template).

**(C) `tests/simulation/cacophonySoak.test.js`** — 30y density soak (`soak(30*52)` at a governor-lit
config that heavily exercises the SEAM classes). **Measure first** (ratchet-floor philosophy), then assert:
- majors/settlement-year within a MEASURED band (printed on failure);
- simultaneous realm majors ≤ `arcMax`;
- no decade both-silent AND no decade saturated;
- quiet-before-storm (deferred pressure fires within N ticks of a slot opening);
- two-run determinism hash.
- **Document** that calamity/contest pacing is registered-not-wired (soak asserts on the governed seam
  classes); over-claiming would be dishonest.

**(D) `tests/domain/dramaClassRegistry.contract.test.js`** — the §6 walker (§5.2).

## 9. THE GATE (battery — full, once, at the end)
Focused suites during dev. Then ONE full gate:
`npx vitest run` (full) + property goldens byte-identical + `tsc` (full/strict) + `eslint` + `npm run build`
+ `VERIFY_DIST=1 npx vitest run tests/build/` — **quote the closure number** (budget 1,216,350; last
measured 1,216,273; margin ~77 B — the governor adds ZERO eager, so closure must be unchanged). Re-run any
>40s-timeout failure SOLO before believing it. Multiple sessions share this machine.

## 10. HAZARD CHECKLIST (verifier targets)
- **Dormancy:** absent axis ⇒ no ledger key, no rng, no rollExplanation row, no wizardNews entry, no
  candidate field. `CONDITIONAL_LEDGER_KEYS` append at END only. Empty ledger self-drops to undefined.
- **Determinism:** deferral is pure ledger + codepoint priority, ZERO rng. Deferral `continue`s BEFORE
  `candidateRoll`. Dropping a deferred candidate does not reshuffle other rolls (they fork on identity) —
  the only non-neutrality is the freed auto slot, which is the intended ON effect and MUST NOT run dormant.
- **Window basis:** `calendar.elapsedWeeks`, never `tick` (M10b catch-up + coarse intervals).
- **Byte surfaces:** goldens (worldpulseSpatial/Seasons/Deity) run governor-OFF — confirm `narrativeTempo`
  absent from their rules; NO golden re-capture. If a same-seed byte shifts with the governor off → STOP.
- **Budget:** new code lazy-only; `narrativeTempoOf` in the lazy module (zero eager). New files any-cast=0.
- **Read pre-tick `worldState`, write `memoryState`** (a write to `worldState` ghosts on reload).
- **Name collision:** `GRACE_TICKS` exists in factionCompetition/npcAgency — namespace as
  `TEMPO_GRACE_WEEKS`/`graceWeeks`.

## 11. JUDGMENT-CALL LEDGER (all vetoable; owner may reverse any)
1. Chain-immunity scoped to RECEIPTED chains; pressure-born births governed under deferral-not-denial (§1.1).
2. Scope = one seam wired + registration mechanism; bypass producers registered but wiring deferred (§2).
3. Deferral = Model A (emergent re-fire) + recorded `deferred` ledger for the DM receipt (§6).
4. Activation = opt-in `narrativeTempo` axis, absent-by-default, NO preset lighting, NO dial UI this wave (§3).
5. Ledger = new top-level conditional key, week-stamp shape, self-pruning (§4).
6. Taxonomy: famine→economic_shock; magical/monster→calamity; mass_migration/crime→exempt; boom declared-no-producer (§5.1).
7. Starting budget constants (retunable) + soak envelope measured, not asserted a-priori (§6, §8C).

## 11b. BUILD CORRECTIONS (applied during implementation + adversarial verification — deltas from the frozen plan)
1. **`isChainedConsequence` regex** — the plan's `$`-anchored `/_(residual|spread|escalate)$/.test(ruleId)`
   would MISS real candidateTypes (`stressor_spread_famine` ends in the type). Fixed to a prefix match
   `/^stressor_(residual|spread|escalate)(_|$)/` on `candidateType`. (Implementer-caught.)
2. **`isChainedConsequence` no longer keys on `probability >= 1`** — that exempted `strategy_deploy` (a
   prob-1 SPONTANEOUS opportunistic-war birth, design §1 governor-eligible). Removed; receipts are by marker
   only. Verified safe (residuals keep their marker; off-seam prob-1 consequences have null drama-class).
   The causes check now scans ALL causes, not just `[0]`. (Verifier-surfaced; §1.1 updated.)
3. **Taxonomy addendum** — `political_fracture` → `succession_coup`, `slave_revolt` → `schism_contest`
   (governed, not exempt; grounded in `REALM_LABELS`). (§5.1.)
4. **Eager cost is ~17 B, not literally zero** — the `CONDITIONAL_LEDGER_KEYS` registration lands in the
   eager `worldState.js`. Necessary for the dormancy strip; closure 1,216,290 ≤ 1,216,350 (60 B margin).
   The heavy governor (module + registry + wiring) IS lazy (zero eager), confirmed absent from the closure.
5. **`governBirth` return type** is a discriminated union (`defer:true` ⇒ non-null class+reason) so the
   seam pushes a `TempoDeferral` strict-clean (domain strict ceiling is 0).

## 12. WORK BREAKDOWN (Opus implementers; sequential in this worktree)
- **W1 (foundation):** `narrativeTempo.js` (module) + `decisionTier.js` (registry+priority) + `worldState.js`
  (CONDITIONAL_LEDGER_KEYS append) + `dramaClassRegistry.contract.test.js` (walker). Self-testable.
- **W2 (wiring):** `candidateEvents.js` (seam hook, return `deferred`) + `pulseKernel.js` (read/write hooks +
  DM receipt).
- **W3 (tests):** dormancy byte-identity + property + cacophony soak.
- **Verify:** parallel Opus adversarial verifiers (dormancy / determinism-no-rng / chain-immunity /
  budget-laziness) + the full gate (architect runs).

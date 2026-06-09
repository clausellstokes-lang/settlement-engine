# Simulation → 10/10 — execution plan

**Goal.** Take the SettlementForge simulation to a genuine 10/10 *on the right yardstick*:
the **DM / worldbuilder cohesion engine** — internal consistency, honest "receipts" for
why things are, gameable consequences, deterministic-yet-varied output, and durability to
custom content. (NOT a hard quantitative economy sim — that bar is wrong for the audience
and would hurt the product.)

**The thesis.** Today's lowest-scoring subsystems all share one root cause: **multiple
parallel models of the same truth that drift apart**. The store re-derives instead of
trusting the pipeline; `capacityModel` and `foodGenerator` are two food models; the causal
substrate has a condition vocabulary nobody promotes into; generation/events/world-pulse
each speak a slightly different dialect. The cure is **one canonical substrate, derived
once, that every stage reads from and writes to** — and a test layer that *enforces* it.

**How we ship.** Each item is an independent, gated (`npm run check` green), adversarially
verified, deployed increment on `code-hardening → master`. Risk-tolerant per owner, but
every causal-substrate change is guarded by the corruption soak test + world-pulse balance
test (the runaway guards) and new invariant tests.

---

## Status legend
`[ ]` not started · `[~]` in progress · `[x]` shipped + deployed

---

## P0 — Stop throwing away truth (correctness)

- [x] **P0.1 — Store stops discarding authored event deltas.** _(shipped; layerAuthoredDeltas re-layer; pinned by eventPipeline.test.js)_
  `settlementSlice.applyEvent` re-derives `deriveSystemState(nextSettlement)` after the
  domain pipeline and overwrites the canonical `afterState` (which had authored deltas
  layered on). Fix: re-derive from the *reconciled* settlement **and re-layer the event's
  authored deltas** (export `layerAuthoredDeltas` from `eventPipeline.js`).
  *Invariant:* store-persisted `afterState` === domain pipeline `afterState` === preview
  `afterState` for the same event.

- [x] **P0.2 — Event annotations become causally live.** _(shipped; CUT_TRADE_ROUTE/PLAGUE/REFUGEE_WAVE promote to conditions; causal substrate reacts)_
  `mutate.js` writes `config._cutRoutes` / `_plagues` / `_refugeeWaves` as write-only
  annotations. Promote them into `activeConditions` (`trade_route_cut`, `plague`,
  `migration_pressure`/`housing_pressure`, `food_anchor_lost`) and make
  `deriveSystemState` + `deriveCausalState` read those conditions. Effects then survive
  re-derivation, reruns, and reach the 14-var substrate.
  *Invariant:* `CUT_TRADE_ROUTE` lowers causal `trade_connectivity` and survives a second
  `deriveSystemState(nextSettlement)`.

- [x] **P0.3 — Generation-time stressors promote to activeConditions.** _(shipped; conditionPromotion.js, one-per-archetype/max-severity; soak/balance intact)_
  A freshly generated plague/siege/famine settlement currently has `activeConditions: []`.
  Add one `stressorsToConditions` promotion pass in the pipeline (stressor type → condition
  archetype + severity + lifecycle). Unifies the stress substrate with the condition
  substrate the derivers already understand.
  *Invariant:* a generated severe-stressor settlement has a matching `activeCondition` and a
  non-trivial causal reaction.

## P1 — One vocabulary (consolidation)

- [x] **P1.1 — `tradeRouteSemantics.js`:** _(shipped)_ one canonical tier map for
  road/river/crossroads/port/coastal/isolated + legacy major/minor/standard/none, feeding
  causalState connectivity + capacityModel transport/food/raw-materials. river/crossroads/port
  no longer score neutral. Pinned by tradeRouteSemantics.test + capacityModel.test.
- [x] **P1.2 — `capacityModel` field reads:** _(shipped)_ reads canonical `primaryExports`
  (was a dead `economicState.exports` read → zeroed demand); legacy alias still honored.
- [x] **P1.3 — Canonical boundary:** _(shipped)_ `domain/canonicalAccessors.js`
  (`canonStressors` / `canonExports` / `canonImports`) is the single resolution point for the
  stressor + economy-trade-good aliases. Migrated the substrate readers (deriveSystemState,
  causalState, capacityModel, conditionPromotion) off their duplicated fallbacks — which also
  caught two more dead reads (deriveSystemState's `econ.exports`/`econ.imports`). Schema notes
  that nested economy aliases resolve here (FIELD_ALIASES is top-level only).
- [x] **P1.4 — Reactive partial-rerun: RETIRED.** _(shipped)_ `getAffectedSteps`/`rerunAffected`
  were dead, untested, and buggy (keyed on step-names while callers think in data keys; merge
  order clobbered overrides) — and the wrong abstraction (derived state already recomputes on
  demand; edits do a full same-seed regen). Deleted both + the unused `only`/`ctx` options on
  `runPipeline` + the dead store-facade wiring; corrected the stale comments. `RERUN_KEYS_FOR_EVENT`
  kept (batch-preview metadata, independent of the engine).

## P2 — Elegance, maintainability, RNG, comments, security

- [ ] **P2.1 — Tag migration:** stable `id`/`tags`/`provides`/`requires` on
  institutions/factions/chains; names become display-only; `name.includes(...)` becomes a
  fallback. *Invariant:* renaming an institution does not change subsumption/cascade/isolation.
- [ ] **P2.2 — Unify faction archetypes:** one `FACTION_ARCHETYPES` enum + one `matchArchetype`
  consumed by all four layers that currently disagree; stable governing-faction id.
- [x] **P2.3 — `new Date()` ban: core complete.** _(assessed/shipped)_ The simulation-replay
  path is already deterministic: event `appliedAt` + `mutate`/`applyEvent` thread `now`, and
  `propagation.js` overwrites every impact `createdAt` with the threaded `now` (line ~429).
  Task #28 did the bulk. The residual `nowIso()` calls in `region/graph.js` / `wizardNews.js` /
  `discoverDependencyCandidates.js` are real-time BOOKKEEPING stamps on graph/news/candidate
  *metadata* (mostly `existing || nowIso()` preserve-if-present), not simulation state — they
  don't change the deterministic settlement outcome. Documented as an intentional boundary
  rather than swept (a full thread-through would be large and low-value).
- [ ] **P2.4 — Seed deliberate variability** into deterministic-only subsystems
  (`foodGenerator` storage/crop variance; gate magic-substitution recovery through
  `rng.chance`). *Invariant:* same config + different seed yields varied food resilience.
- [ ] **P2.5 — Document load-bearing constants:** corruption saturation curve, pressure-model
  weights, capacity thresholds, cascade 0.45 cap; JSDoc the high-complexity NPC generators.
- [x] **P2.6 — Harden `admin-actions` edge function.** _(shipped, non-breaking)_ `OWNER_EMAIL`
  and the CORS allowlist are now env-configurable (`OWNER_EMAIL`, `ALLOWED_ORIGINS`) with
  fallbacks that preserve current behavior until the operator sets them; CORS is per-request
  reflected-Origin when an allowlist is set. Endpoint stays protected by JWT + role gating +
  botGuard. _(Deferred: splitting the 2,323-line `generate-narrative` — pure maintainability,
  no correctness value; lower priority than the simulation work.)_

## P3 — North star

- [ ] **P3.1 — One canonical conserved substrate.** `activeConditions` is the single runtime
  representation of pressure; generation/events/world-pulse/regional all promote into it, and
  every deriver/lens/trace/AI-overlay consumes it. A conserved food/economy ledger computed
  once and threaded (retire the two-food-model split). Tags as primary dispatch. The fixed
  rerun layer powers every edit. Consistency becomes architecturally enforced, not maintained.

---

## Per-subsystem "what a 10 looks like"

| Subsystem | Now | A 10 is… | Gating invariant |
|---|---|---|---|
| Event store integration | 5 | store afterState === domain === preview; effects survive re-derive | P0.1, P0.2 invariants |
| Active conditions / causal | 6 | conditions are THE substrate; stressors+events promote in | P0.2, P0.3 |
| Food / capacity | 6 | one conserved food ledger; lenses can't disagree | P1.1, P1.2 + ledger |
| Power / factions | 6 | one archetype enum; legitimacy off ids not substrings | P2.2 |
| Resources | 6 | narrative reads selected resources, not terrain pool; dual fields documented | (P1.3) |
| Institutions | 7 | tag/id dispatch primary; rename-safe | P2.1 |
| Economy / chains | 7 | single status vocabulary; tag dispatch | P1.3, P2.1 |
| Population / NPCs | 7 | zero-faction edge handled; complex gens documented | P2.5 |
| World-pulse / regional | 7 | no `new Date`; candidate schema normalized; channel propagation complete | P2.3 |
| Schema / canonical | 7 | one boundary resolver; full alias set; enums | P1.3 |
| Generation pipeline | 7 | rerun layer fixed/retired; dep validation | P1.4 |
| Corruption | 8 | unify 3 criminal-inst detectors; document tuning | P2.5 |

---

## Reconciliation with the external (ChatGPT) review
Confirmed: store overwrite, `_cutRoutes` write-only, trade-vocab fracture, no
stressor→condition promotion, capacityModel dead reads, fuzzy matching pervasive,
getAffectedSteps keys-vs-stepnames, applyChange = full regen (latent), admin CORS/email,
narrative monolith. **Refuted/stale:** "The The…[object Object]" bug (already cleaned),
"stressors object not array" (it's the same array reference), "display contradicts state"
(guarded by `contradictions.js`). Partial: resource depletion dual-field (intentional),
HomeHero await (benign, Zustand-driven).

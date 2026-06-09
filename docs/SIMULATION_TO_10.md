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

- [~] **P2.1 — Tag migration.** _Foundation shipped._ `lib/entities.institutionTags` /
  `institutionHasTag` reliably resolve an institution's canonical tags from declared `tags`
  ∪ a name-keyword backfill — so tag dispatch works for generated, legacy, AND custom
  institutions (the prerequisite that lets the scattered `name.includes(...)` sites migrate
  without silently breaking). Centralizes the name-matching into one canonical map. Pinned by
  institutionTags.test (incl. the custom-weird-name case). _Next: migrate consumers
  (subsumption/cascade/isolation, foodGenerator, faction roles, causal healing) site-by-site,
  each soak-gated; richer declared catalog tags retire the keyword fallback over time._
  *Invariant target:* renaming an institution does not change subsumption/cascade/isolation.
  _Finding (after investigating the sites): the audit's "46 duplicated name-match sites" is
  overstated — security detection is already centralized into `inst.has*` flags, subsumption is
  id-based (not tag-suitable), the healing/food checks are bespoke localized lists (migration
  relocates without consolidating), and the one genuinely-duplicated institution category
  (criminal) is migrated. The real duplicated vocabulary turned out to be the FACTION archetype
  matchers → that's P2.2. So P2.1's high-value consolidation is captured; the resolver remains
  the primitive for future custom-content recognition._
- [x] **P2.2 — Unify faction archetypes. COMPLETE.** `domain/factionArchetypes.js`
  is the one canonical detector — `FACTION_ARCHETYPES` enum + `factionArchetype(faction)`
  (category-authoritative, name/description fallback, ordering that resolves the overlaps that
  tripped the legacy matchers). It's the UNION of the four divergent matchers
  (factionCompetition / factionRoles / factionProfile / factionResponses), each of which maps to
  its own output vocabulary (NPC-role keys / responder keys / profile archetypes / competition
  archetypes). Pinned by factionArchetypes.test. _Consumer 1 wired:
  `factionProfile.deriveFactionArchetype` now delegates to the canonical detector (mapping
  canonical → its local vocab); the convergence surfaced + fixed a missing 'religious' term, and
  the full faction/magic/district/relationship suites validate equivalence. Consumer 2 wired:
  `factionResponses.matchArchetype` now maps the canonical archetype to its 4 responder keys
  (event suites pass). Consumers 3+4 wired: `factionCompetition` (world-pulse — soak/balance
  held) and `factionRoles` (generation structural NPCs — distribution/NPC suites held). All
  four matchers now share the one detector; the legacy regex blocks are gone._
- [x] **P2.3 — `new Date()` ban: core complete.** _(assessed/shipped)_ The simulation-replay
  path is already deterministic: event `appliedAt` + `mutate`/`applyEvent` thread `now`, and
  `propagation.js` overwrites every impact `createdAt` with the threaded `now` (line ~429).
  Task #28 did the bulk. The residual `nowIso()` calls in `region/graph.js` / `wizardNews.js` /
  `discoverDependencyCandidates.js` are real-time BOOKKEEPING stamps on graph/news/candidate
  *metadata* (mostly `existing || nowIso()` preserve-if-present), not simulation state — they
  don't change the deterministic settlement outcome. Documented as an intentional boundary
  rather than swept (a full thread-through would be large and low-value).
- [x] **P2.4 — Seed crop-fortune variance into `foodGenerator`.** _(shipped)_ A ±8% seeded
  harvest multiplier (forked into an isolated sub-stream so it never perturbs other economy
  consumers' RNG) makes the SAME config yield varied food resilience per seed — good years vs
  lean — while staying deterministic per seed. Pinned by foodVariance.test (varies across
  seeds with identical config; reproduces per seed; bounded; no-RNG fallback is flat).
  _(Deferred — owner's call: making magic-substitution recovery probabilistic via `rng.chance`
  is a balance/design change, not a clear improvement; left as-is pending direction.)_
- [ ] **P2.5 — Document load-bearing constants:** corruption saturation curve, pressure-model
  weights, capacity thresholds, cascade 0.45 cap; JSDoc the high-complexity NPC generators.
- [x] **P2.6 — Harden `admin-actions` edge function.** _(shipped, non-breaking)_ `OWNER_EMAIL`
  and the CORS allowlist are now env-configurable (`OWNER_EMAIL`, `ALLOWED_ORIGINS`) with
  fallbacks that preserve current behavior until the operator sets them; CORS is per-request
  reflected-Origin when an allowlist is set. Endpoint stays protected by JWT + role gating +
  botGuard. _(Deferred: splitting the 2,323-line `generate-narrative` — pure maintainability,
  no correctness value; lower priority than the simulation work.)_

## P3 — North star (the conserved ledger) — see docs/P3_CONSERVED_LEDGER.md

- [~] **P3.0 — Conserved food ledger accessor.** _(shipped)_ `domain/foodLedger.js` is the one
  read-point for the conserved food quantities foodGenerator already produces (dailyNeed/
  dailyProduction/foodRatio/deficitPct/surplusPct/storageMonths/importDependency/…). Additive;
  neutral defaults; pinned by foodLedger.test. Surfaced the confirmed dead-read: causalState +
  deriveSystemState read `deficitMonths`/`surplusMonths`, which foodGenerator never produces, so
  the food-deficit contribution is silently neutral.
- [x] **P3.1 — Fix the dead food reads.** _(shipped)_ deriveResilience + deriveFoodSecurity now
  read the conserved ledger's real fields (deficitPct/surplusPct), banded to the foodSecurity
  label thresholds — so a famine town's food crisis actually lowers resilience + causal
  food_security (it never did before). Two existing tests that encoded the phantom field were
  reconciled to the real one. Pinned by foodLedger.test (deficit < surplus on both substrates);
  soak/balance held.
- [x] **P3.2 — Converge `capacityModel`'s food lens onto the ledger.** _(shipped)_
  `deriveFoodProduction` now takes a supply contributor from the conserved ledger
  (deficitPct strains supply, surplusPct eases it, banded to the foodSecurity thresholds), so
  the capacity lens agrees in DIRECTION with foodGenerator's caloric self-sufficiency — the
  "two food models can disagree" gap is retired. Pinned by band-boundary tests; legacy/
  un-generated saves untouched (present:false gate). Adversarially verified (3 reviewers):
  the overlap with the existing food-chain contributors is directionally-correct + bounded
  (clamp floor, no cross-tick feedback → cannot run away).
- [x] **P3.3a — Soak the P3.2 branch.** _(shipped)_ The baseline soak settlements carry no
  `economicState.foodSecurity`, so `foodLedger(s).present` was false and the P3.2 capacity-ledger
  branch never ran under the long loop. Added a second soak case (`worldPulseSoak.test.js`) where two
  towns carry a deep conserved deficit (deficitPct 50): asserts the precondition holds at t0, the
  famine stays inside the same bounds as the baseline (maxConditions <=30, maxStressors <=40 over 40
  ticks -> the branch has no runaway cross-tick coupling), and that the conserved deficit survives the
  whole loop (probative: a vacuous pass would lose foodSecurity and stop firing the branch).
- **P3.3b — Extend the conserved-ledger pattern beyond food.** A 10-agent mapping workflow
  diagnosed all 8 remaining capacities + the food-chain overlap, and produced the ranked staged
  plan below. Key correction it surfaced: the food-chain "double-count" is mostly ORTHOGONAL, not
  redundant — the chain-status contributors read live post-generation disruption that the
  generation-frozen `deficitPct` cannot see, so they must stay; only the static trade-route import
  add was a genuine duplicate of deficitPct's import coverage.
  - [x] **Stage 0 — Complete the food story (de-dup + capacity-test harness).** _(shipped)_
    Guarded the trade-route import contributor (`capacityModel.deriveFoodProduction`) with
    `if (!led.present)` so the import benefit is counted once — by `deficitPct` for generated saves,
    by `tradeRouteSemantics` only as a fallback for un-generated/legacy ones. Marked the food-chain
    block intentionally-orthogonal with a comment. Added 4 cases to `tests/domain/capacityModel.test.js`
    (trade contributor absent when ledger present / present as legacy fallback; generated food supply
    invariant to route tier; a `blocked` chain still strains supply alongside a surplus ledger). The
    last residual food double-count is closed, so the template is clean before replication.
  - [x] **Stage 1a — Kill the two defense dead reads.** _(shipped)_ `defenseGenerator` now
    persists the numeric `readiness.score` it previously computed and discarded (additive — all
    consumers use `.label`/`.color`). `causalState.deriveDefenseReadiness` reads `def.readiness?.score`
    (was a dead read of the non-existent `def.readinessScore`, with NO fallback — measured readiness
    never reached the substrate). `deriveInfrastructureCondition` now anchors to the persisted
    `defenseProfile.scores` (military = walls/fortification-chain health, economic = siege logistics;
    their mean is a real built-robustness signal) instead of the dead `def.infrastructureScore`,
    keeping institution-count inference as the legacy fallback. 4 causalState cases pin both
    directions + that the measured contributors fire + the legacy fallback.
  - [x] **Stage 1b — Defense ledger accessor + deriveDefense de-dup.** _(shipped)_ Created
    `src/domain/defenseLedger.js` (the reusable template the later stages mirror) over
    `defenseProfile.scores.{military,monster,internal,economic,magical}` + `readiness.score` +
    `magicDependency`, NEUTRAL defaults `present:false`. `capacityModel.deriveDefense` now reads the
    military dimension through it and applies the separate fortification-institution add (+14/+7)
    ONLY as a fallback when no profile is present — the measured military score already folds in
    walls/garrison/militia/watch (defenseGenerator.computeDefenseScores), so for generated saves the
    old add double-counted those institutions (same shape as the Stage 0 food de-dup). 4 capacity
    cases. **Rejected the plan's `deriveExternalThreat ← led.monster` step as semantically wrong:**
    external threat is the danger LEVEL (`config.monsterThreat`, the canonical source — not a dead
    read), whereas `scores.monster` is monster-DEFENSE (opposite polarity); swapping would invert it.
  - [x] **Stage 2a — Revive the dead legitimacy branch in `deriveVolatility`.** _(shipped)_
    It read `publicLegitimacy` as a bare number, but the generator emits `{score,label,breakdown}`,
    so the branch (low legitimacy → volatility +12 + risk; high → −8 + driver) NEVER fired.
    Normalized to read `.score` (object), a legacy bare number, or absent — mirroring the 3 consumers
    that already read `.score` correctly. Adversarial verify established the numeric `system.volatility`
    is a display/diff dimension that does NOT feed event/pressure/corruption loops (those use the
    `worldState.volatility` string dial + `causal.scores`), so this is a dossier-accuracy fix with no
    balance-loop risk. 2 systemState cases (object direction + risk; legacy bare-number compat).
  - [x] **Stage 2b — Governance ledger.** _(shipped)_ Created `src/domain/governanceLedger.js`
    (single read-point over `powerStructure.publicLegitimacy`: `legitimacyScore`, `legitimacyLabel`,
    `present`; handles the `{score}` object AND a legacy bare number uniformly). Routed all four
    legitimacy consumers through it — `derivePublicLegitimacy` (verbatim), `deriveRulingAuthority`
    (×0.5), `capacityModel.deriveAdministrative` (×0.3), `deriveVolatility` (thresholds, replacing the
    Stage 2a inline normalization). Corrected the plan's "unify the transfer functions": the differing
    weights are intentionally lens-specific (each lens means something different by legitimacy, exactly
    as food lenses band `deficitPct` differently) — only the READ + null/legacy handling is unified, so
    a legacy bare-number legitimacy now moves every lens. Governing-faction power deliberately left out
    (two distinct notions, not a shared quantity). governanceLedger unit tests + a cross-lens cohesion
    test. (Housing deferred — no producer exists.) Follow-up (non-blocking, surfaced by verify):
    `factionProfile.legitimacyFor` (factionProfile.js:185) reads `publicLegitimacy?.score` directly and
    should also route through `governanceLedger` for full single-source cohesion.
  - [x] **Stage 3 — Magic ledger + fix the magicLevel vocabulary mismatch.** _(shipped)_ The real
    bug was sharper than "band-blindness": `getMagicLevel` emits `none/low/medium/high`, but the lenses
    string-matched a STALE vocabulary (`moderate/common/pervasive/rare`) the generator never emits — so
    a generated `medium`-magic town (priority 26-65, the widest band) matched nothing in
    `capacityModel.deriveMagical` and contributed **0** supply instead of its intended +10. Created
    `src/domain/magicLedger.js` (conserved `priorityMagic` dial + a band canonicalized from the dial /
    legacy vocab + `magicExists` + `present`) and the single canonical `ARCANE_INSTITUTION_PATTERN`.
    Routed `deriveMagical` (fixes the medium→0 bug) and `deriveMagicalStability` (behaviour-preserving
    via `band = present ? magicLevel : 'low'`) through it; `magicProfile` now imports the shared arcane
    pattern. Balance-safe: `magical_stability` is NOT read by `pressureModel` (verified) — magic is
    display/AI-only. magicLedger units + monotonic deriveMagical coverage. Follow-up **Stage 3b**:
    `magicProfile`'s own `MAGIC_LEVEL_VALUES` lacks `medium`/`none` keys (same vocab bug for its display
    labels) — route its 5 band-reads through the ledger too, and `resourceTaxonomy.magicLevelScore`
    (reads `config.magicLevel` directly; flagged by verify).
  - [x] **Stage 4a — Healing classifier dedup.** _(shipped)_ The `HEALING_PATTERN` regex was
    copy-pasted byte-identical in three lenses (capacityModel.deriveHealing, causalState.deriveHealingCapacity,
    magicProfile). Created `src/domain/healingLedger.js` as the single home for the canonical
    `HEALING_INSTITUTION_PATTERN` + a `healerCount` (it also surfaces `availableServices.healing` for 4b).
    Routed all three sites through it. Fully behaviour-preserving: identical regex, identical `.name`
    match, identical counts/banding — so `healing_capacity` (which DOES feed `pressureModel` disease
    pressure) is unchanged and the soak is unmoved.
  - [ ] **Stage 4b — Anchor healing to `availableServices.healing` (BALANCE-SENSITIVE).** That emitted
    list is healing SERVICE names (catalog-classified) — a different quantity than the institution-name
    regex count, so switching the signal basis shifts `healing_capacity` and disease pressure. Needs a
    calibration + soak pass.
  - [ ] **Stage 5 — Craft ledger** (persist the discarded `computeFinishedGoodsDemand` physics first).
  - [ ] **Stage 6 — Welfare ledger** (convert the dead `welfareCapacity` write into a real producer).
  - [ ] **Stage 7 — Transport ledger** (emit a `throughputRating`; low priority, no current disagreement).
  - [ ] **Stage 8 — Labor ledger** (heaviest: surface the latent `AGRICULTURAL_WORKFORCE` split the
    food math already commits; retire the `deriveLabor` vs `deriveLaborCapacity` two-model divergence).
- [ ] **North star:** every pressure flows through the one condition substrate + conserved
  ledger; every deriver/lens/trace/AI-overlay consumes them. Consistency architecturally enforced.

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

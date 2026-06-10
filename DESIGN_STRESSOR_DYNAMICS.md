# Design: Counterforces, Compound Stressors, and Recent Memory

Status: **IMPLEMENTED** (all phases + bug fixes). Grounded in a six-subsystem
code audit (stressor lifecycle, corruption/security, capacities/ledgers,
regional relations, narrative surface, multi-stressor stacking).

## Implementation map

| Concept | Code | Tests |
|---|---|---|
| Counterforces (A) | `src/domain/worldPulse/stressorDynamics.js` (catalog + assessment), wired in `stressors.js` resolutionChance/ageRoamingStressors | `tests/domain/stressorCounterforces.test.js` |
| Corruption duality (B) | `src/domain/corruption.js` (patronageSecurityDrag, compromisedSecurityInstitutions), `npcAgency.js` (onset dragged / exposure raw / proximity), `corruptionImpair.js` ('corruption' impairment on oust), `advanceCampaignWorld.js` (corruption_exposed condition) | `tests/domain/corruptionDuality.test.js` |
| Synergies (C1) | `stressorDynamics.js` STRESSOR_SYNERGIES, wired in aging (blocksResolution, decay/resolution drag, echo weight) | `tests/domain/stressorSynergies.test.js` |
| Compound signatures (C2) | `realmEvents.js` synthesizeCompoundSignatures (longest-match consumes member types; Shadow Court capture-gated) | `tests/domain/stressorSynergies.test.js` |
| Spawn variants (C3) | `stressorDynamics.js` interpretStressorOrigin; birth stamping + re-ignition in `stressors.js`; traitor seeding in `applyWorldPulse.js` (seedBetrayalTraitor) | `tests/domain/stressorOrigins.test.js` |
| Echoes / recent memory (D1) | `stressors.js` (echoOf, half-life aging, graduation, existingStressorKeys excludes echoes, setStressorAttacker) | `tests/domain/stressorOrigins.test.js` |
| War/relationship coupling (D2) | `stressorDynamics.js` windDownSponsoredStressors + recordWarResolutionIncidents, wired in `applyWorldPulse.js` / `advanceCampaignWorld.js` | `tests/domain/stressorOrigins.test.js` |
| History graduation (D3) | `src/domain/worldPulse/stressorAftermath.js` (chronicle entries + campaign-era history events, capped 20) | `tests/domain/stressorAftermath.test.js` |
| Bug fixes (B1-B5) | soak fixture (already fixed via chip session), volatility-exempt probability-1 outcomes (`candidateEvents.js`), affectedSystems aliases (`stressors.js`), promotion gaps + regex fixes (`conditionPromotion.js`) | counterforces/conditionPromotion test files |

Post-implementation adversarial review (4 lenses × skeptic verification, 22
agents) confirmed 15 findings — all fixed: campaign-era `lastingEffects` is an
ARRAY (string crashed HistoryTab + PDF export), `yearsAgo: 0` falsy-coercion in
historyBeats, wind-down now lands below the structural gate (≤0.2), counterforce
weakness decay floor raised to 0.7 (resolution penalty carries the wallow),
blocked stressors hold a severity floor instead of zombie-decaying, live synergy
companions weight by severity, exposure runs without criminal infrastructure
(onset stays gated — betrayal traitors are discoverable everywhere), echoes
coalesce on canonical ids, lifecycleStage recomputes each aging tick,
state-deciding sorts use codepoint order, probability-1 aftermaths bypass the
volatility multiplier AND the auto budget, realm/compound arcs throttle
re-emission (6-tick cooldown), `resolutionReason` survives normalization, and
the underworld soak fixture now exercises the duality loop. Known deliberate
leftovers: old-seed replays diverge by design (new mechanics consume the same
per-tick forks).

Continuation pass (closes the remaining threads):
- **Organic reform** (`corruptionImpair.js` advanceInstitutionReform): a
  corruption-impaired institution whose corrupt insiders are gone rolls a
  security/prosperity-scaled per-tick reform chance; on success the
  'corruption' impairments clear (legitimacy scars stay), lifting the
  patronage drag and proximity penalty. Surfaces as
  `institution_reformed` in pulseRecord.corruptionEvents.
- **`name_attacker` party action** (`partyImpact.js`): the DM names the force
  behind a war stressor — a settlement id or a free-text label (goblin
  warband). Chronicle-visible; wired to `setStressorAttacker`.
- **World-pulse UI** (`WorldPulsePanel.jsx` "Active Stressors & Echoes"):
  live stressors show severity, lifecycle stage, counterforce resilience
  ("31% — wallowing (a pillar is missing)"), synergy entanglement, origin
  variant, and the attacker/sponsor (or "unnamed" until the DM names it);
  echoes render as "— in living memory" with fading strength.

Second continuation pass:
- **Dynamic food stockpile** (`worldPulse/foodStockpile.js`): storageMonths is
  now a conserved, tick-advanced stock. Surplus fills (60%/month, capped by the
  generator's granary tier table); MILD deficit (<25%) with stores under 1
  month keeps a reserve tithe flowing in (+3 visible deficit); real deficits
  draw down rationed (targets the Pressured band, ≤ half the stores per tick);
  active sieges/occupations cut the import share of need so blockades eat the
  granary — and weaken the siege counterforce as they do. Structural
  deficit/surplus stashed as `foodSecurity.stockpile.base*` so relief never
  compounds.
- **Famine↔granary coupling** (gap closure, user-caught): a campaign-emergent
  famine STRESSOR cuts production into the effective deficit
  (severity × 45% of need — the dynamic analog of generation's ×0.35), so the
  granary drains during famine exactly as it does under blockade; siege+famine
  (Starving City) drains fastest. Stressor-based on purpose: generated famines
  are already baked into the ledger (condition-based detection would
  double-count). The famine counterforce now reads LIVE `food:storage`
  (weight 0.3) so a full granary shortens the famine and weakens as it drains.
- **Live resilienceScore**: foodStockpile re-grades the STORAGE slice of the
  generation resilience composite from the current granary every tick
  (non-storage remainder stashed once as `stockpile.resilienceRest`; score =
  rest + months/12×35, clamped). A siege-drained town stops being "resilient";
  fat harvests buy real resilience back. Famine counterforce rebalanced to
  avoid double-counting the same grain (resilience 0.45, direct storage 0.15).
- **Variant hooks** (`VARIANT_HOOKS` in stressorDynamics.js) on
  `originContext.hooks`, shown on stressor cards and in chronicle grounding.
- **Inline name-attacker control** on war-shaped stressor cards
  (WorldPulsePanel → `recordPartyImpact({kind:'name_attacker'})`).
- **Defense score fixes** (defenseGenerator.js): multiplicative
  econHealthMult = min(1, 0.45 + econOutput/50·0.55) gates the economic
  dimension (identity at econOutput ≥ 50; a destitute famine port drops
  ~70 → ~29); famine now also hits MONSTER defense (−8, druid-reduced);
  the previously dead magInfluence param now gates magical defense (crime/
  economy-degraded practitioners).
- **Random config re-roll** (three root causes fixed): settlements now carry
  the RAW sentinel config as `settlement._config` (assembleSettlement);
  applyChange and save-load prefer `_config` over the resolved config; the
  'Random' slider mode — previously a documented NO-OP — now threads
  `_randomizePriorities` into resolveConfig which rolls each priority 5–95
  per seed (never written back into the stored config).

Implementation decisions of note:
- **Attacker identity is nullable by design** (DM request): `originContext.attackerSettlementId` auto-stamps only for a live hostile settlement edge; `attackerLabel` is free text for non-settlement forces (goblin warband) set via `setStressorAttacker`.
- **Aftermath is recorded twice**: resolution + graduation emit Wizard-News chronicle entries; graduation also appends a campaign-era `historicalEvents` entry (`campaignEra: true`) so historyBeats can surface campaign crises. No separate notes tab needed.
- Counterforce scores are **centered at 0.5** (neutral settlements unchanged) and floors cap at neutral rather than punishing partial strength.

Original proposal follows.

---

## 0. Ground truth the design builds on

Facts that shape everything below:

1. **There are three stressor layers that don't share vocabulary.**
   Generation-time stress (`src/data/stressTypes.js`, static narrative, never
   decays), world-pulse roaming stressors (`src/domain/worldPulse/stressors.js`,
   19 catalog types with lifecycle), and activeConditions
   (`src/domain/activeConditions.js`) — and **only conditions actually subtract
   from causal scores** (causalState.js derivers, −round(sev×12..20)). An
   *active* roaming stressor exerts zero direct mechanical pressure; its bite
   arrives only at resolution, via a `stressor_residual` condition.

2. **Exactly one counterforce exists today** — disease_outbreak resolves
   +0.12 more likely when affected settlements average `healing_capacity ≥ 65`
   and −0.08 when < 35 (stressors.js:293-301). This is the user's plague
   example, already half-built. It is the template to generalize.

3. **A dormant host field already exists.** `normalizeStressor` preserves
   `stressor.resolutionRules` (stressors.js:272) but no catalog entry defines
   it and nothing reads it. Likewise the `dormant_residual` policy row and the
   `residual`/`dormant` lifecycle stages (stressors.js:31, 34-42) are dead
   code — nothing transitions into them. Both are ready-made plumbing for
   counterforces and echoes respectively.

4. **No pairwise stressor interaction exists anywhere.** Stacking is purely
   additive with a 0..100 clamp. The UI *promises* compound conditions
   (HowToUse.jsx:167,240-244: "Famine + Political Fracture means food
   distribution is contested…") — no code implements it. The numeric coupling
   substrate exists (pressureModel regex bumps, e.g. famine condition adds
   +0.12 crime pressure), but nothing is keyed on type *pairs*.

5. **relationshipMemory.js already implements recent memory** (half-life 4
   ticks, 24-tick lookback, memoryScore/posture/dailyLifeWeight) but it is
   consumed by almost nothing mechanical — only the `escalating_rivalry`
   posture branch reads memoryScore. It's fuel for Daily Life/LLM context.

6. **Structural stressors are near-immortal by design accident.** A siege
   (decay 0.02/tick, base resolution 0.02, categorically un-resolvable while
   severity ≥ 0.25 — stressors.js:363) takes ~33 ticks to even become
   resolvable from severity 0.9. Any counterforce that only boosts
   `resolutionChance` does nothing for sieges; it must also accelerate decay.

7. **Relationship labels and war stressors are uncoupled.** A hostile→cold_war
   truce does not resolve an active siege/wartime stressor, and sieges have no
   attacker identity (no originSettlementId). Wars don't formally end.

8. **Security is generation-frozen.** "Internal security" =
   clamp01(safetyRatio/2.5) read from `economicState.safetyProfile`, baked at
   generation. The only dynamic modifier is the thieves-guild drag
   (×(1−strength·0.5)). Institutions cannot *be* corrupted as a state —
   corruption is an NPC boolean + a faction capture ladder; institution
   impairments exist but feed nothing numeric.

---

## Concept A — Counterforces (strength shortens crises)

**Principle:** for every stressor type, named settlement strengths (causal
variables, ledgers, institution classes, faction archetypes, relationship
context) shift the *hazard* of organic resolution — both directions, RNG
preserved. Strong settlements shake things off faster; weak ones wallow.

### Mechanics

Add a `counterforces` block per STRESSOR_CATALOG entry (or populate the
dormant `resolutionRules`). Shape:

```js
counterforces: {
  sources: [
    { kind: 'causal',  key: 'defense_readiness', weight: 0.4, floor: 35 },
    { kind: 'ledger',  key: 'food.storageMonths', weight: 0.3, floor: 2, scale: 6 },
    { kind: 'ledger',  key: 'governance.legitimacy', weight: 0.3, floor: 45 }, // 'Tolerated'+
  ],
  requireAllFloors: true,      // siege-style conjunctive gate (see below)
  maxResolutionBonus: 0.15,    // added to resolutionChance at score 1.0
  weaknessPenalty: -0.08,      // applied when score < 0.3 (mirrors disease)
  decayBoost: 1.0,             // decayRate ×(1 + score·decayBoost) — REQUIRED for structural types
}
```

Per tick, in `resolutionChance()` / `ageRoamingStressors()`:

- `counterforceScore` = weighted sum of normalized sources averaged across
  affected settlements (exactly how the disease check averages
  `healing_capacity` today).
- `resolutionChance += score ≥ 0.3 ? score·maxResolutionBonus : weaknessPenalty`
- `effectiveDecay = decayRate × (1 + score·decayBoost)` — this is what lets a
  well-provisioned city actually break a structural siege, since structural
  resolution is blocked above severity 0.25.
- **Conjunctive gates** (`requireAllFloors`): when any source sits below its
  floor, cap the bonus at ~1/3. This encodes "high defense AND stored food AND
  at least Tolerated legitimacy — missing any of those and the siege grinds."
  Partial strength still helps a little; full strength helps a lot.

RNG stays central: counterforces shift the per-tick hazard, never guarantee.
Keep the resolution roll volatility-blind as it is today (volatility scales
event *births*, not recoveries — that asymmetry is good: turbulent worlds
generate more trouble but strength still digs you out at the same rate).

### Diversity, not just abundance

"Strong, diverse, or abundant healing" — today supply is one summed scalar and
the only diversity metric in the codebase (`foodSecurity.resilienceScore`,
diversityScore = min(1, chains/3)) is read by nothing. Two cheap moves:

- Healing: `healingLedger.healerCount` already exists — let the counterforce
  read count (≥3 distinct healer institutions = redundancy bonus) on top of
  the causal score.
- Food: finally consume `resilienceScore` (storage 35pts + chain diversity
  30pts + import independence + deficit) as famine's primary counterforce —
  it was built for exactly this and is currently decorative.

A future `diversity` field on CapacityProfile (count of distinct
supplyContributors) generalizes this, but isn't needed for v1.

### The full 19-type counterforce map

Accelerants shorten; the *absence* of listed strengths (score < 0.3) lengthens.
Antagonists are handled by Concept C's synergy table, noted here for context.

| Stressor | Counterforces (accelerate resolution) | Notes / antagonists |
|---|---|---|
| disease_outbreak | healing_capacity (exists); healerCount ≥3 redundancy; religious_welfare capacity; magical_stability minor | famine co-active slows it (malnutrition); mass_migration slows it (crowding) |
| famine | foodLedger.resilienceScore (storage, chain diversity, import independence); trade_connectivity; granary/mill institutions; druid/divine magic supplement flags | siege co-active *blocks* resolution (blockade); market_shock slows |
| siege | **conjunctive**: defense_readiness + storageMonths/low deficitPct + legitimacy ≥ Tolerated; walls (defenseLedger); allied neighbor w/ military_protection channel = relief-force bonus | the user's example; decayBoost essential (structural). Famine inside slows it |
| occupation | public_legitimacy of the displaced order; social_trust (resistance cohesion); allied military_protection edges | "resolution" = occupiers leave; insurgency co-active *accelerates* (one of the rare positive synergies) |
| political_fracture | ruling_authority; administrative capacity (court/council institutions); legitimacy ≥ Approved | succession_void co-active slows; faction captureState ≥ corrupted slows |
| indebtedness | trade_connectivity; craft capacity; bank/merchant-guild institution (renegotiation) | market_shock co-active slows |
| betrayal | social_trust; internal security (counter-intelligence purges fast) | already transient; **a corrupted security-relevant institution slows it** (the patron shields conspirators — Concept B link) |
| infiltration | internal security; watch/garrison institutions; information_flow channels | thieves-guild strength slows (already modeled in exposure; mirror it here) |
| succession_void | administrative capacity; religious_authority (legitimating coronation); clear governanceLedger label | rival claimant factions (power delta ≤ 8) slows |
| monster_raider_pressure | defense_readiness; walls/garrison; allied military_protection; ranger-flavored institutions | |
| insurgency | public_legitimacy (grievance redress resolves it *well*); internal security (suppression resolves it *badly* — same speed, different residuals, see variants) | occupation co-active feeds it |
| religious_conversion_fracture | religious_authority (orthodoxy suppresses) OR multiple distinct temples (pluralism absorbs) — two flavors, different residuals; social_trust | famine/plague co-active slow it (apocalypticism) |
| slave_revolt | resolution flavor split: defense+security (suppression) vs legitimacy (manumission); counterforce either, residuals differ | |
| rebellion | overlord-side: legitimacy + defense; vassal-side strain already modeled in relationshipEvolution — couple them | |
| wartime | allied backing (pactStrength); defense_readiness; legitimacy; **couple to relationship label**: hostile→cold_war transition should massively boost wartime/siege resolution (see Concept D) | |
| mass_migration | housing_pressure score (absorptive capacity); labor demand; administrative capacity; social_trust | |
| market_shock | trade_connectivity; craft capacity; count of trade_partner edges (diverse partners = fast rebound); bank institution | already transient |
| criminal_corridor | internal security; legitimacy; labor_capacity (employment) | guild strength slows |
| magical_instability | magical_stability; arcane institutions (college/sanctum); magical capacity band | |

### Guards

- Cap combined modifier: `resolutionChance` clamp [0.01, 0.85]; effectiveDecay
  multiplier clamp [0.5, 2.5].
- Extend the world-pulse soak: a strong settlement and a weak settlement seeded
  with the same stressor; assert median lifetime strictly shorter for the
  strong one across N seeds, and that no stressor becomes unkillable/instakill.
- Note: residual outcomes currently route through `rollCandidates` with the
  volatility multiplier — under `calm` (×0.6) a resolved stressor's residual is
  silently dropped ~40% of the time (stressors.js residuals vs
  advanceCampaignWorld.js:263-267). Fix alongside: residuals should bypass the
  volatility roll like party-directed resolutions already do.

---

## Concept B — The corruption/security duality

**User's design:** if a named institution is corrupted, internal security gets
repressed (criminals have a patron) — yet stronger internal security still
means more organic exposure of corrupt NPCs.

What exists: exposure already rises with security (+0.20·security) and falls
with guild strength (−0.22·guild) (corruption.js:119-129). The guild drag
(×(1−strength·0.5)) is the "patron" effect — but it's keyed to faction
captureState, institutions never get a corrupted state, and the *same dragged
security* feeds both onset suppression and exposure, so the patron effect
double-dips against discovery.

### Design

1. **Give institutions a corruption state.** The vocabulary already exists
   unused: impairment type `'corruption'` is in the InstitutionImpairmentType
   list (entities/status.js:32) with a propagation mapping
   (propagate.js:45) — but no code ever emits it. Emit it when: a faction
   holding seats in/over the institution reaches captureState ≥ 'corrupted',
   or a corrupt NPC of dotRank 3 is housed there, or via DM IMPOSE event.

2. **Repression channel (onset side):** `readCorruptionClimate` gains a
   *patronage drag*: corruption-impaired security-relevant institutions
   (watch/garrison/court regex class) reduce effective security for **onset
   suppression** — on top of the guild drag, capped (e.g. total drag never
   below 40% of base). Criminals with a patron operate more freely. This also
   finally makes impairments sim-relevant instead of display-only.

3. **Exposure channel (discovery side):** exposure uses **raw** security, not
   the dragged value — the −0.22·guild term already models shielding once;
   don't double-dip. Add a proximity bonus: a corrupt NPC whose *home
   institution* is corruption-impaired gets +visibility (scandals cluster,
   investigators circle).

4. **Close the loop into the causal layer:** organic exposures currently
   create no condition. Emit the existing-but-underused `corruption_exposed`
   condition archetype (ruling_authority −18·sev) on ousted-rank exposures, so
   purges actually shake the government — and feed Concept C's hooks.

**Resulting dynamic** — exactly the story wanted: high security + corrupted
institution = *fewer new* corruptions than a lawless town, but a steady drum
of exposures, demotions, scandals, and impairment cascades. A purge state.
Low security + corrupted institution = quiet rot: few exposures, steady
capture-ladder climb, guild consolidation. Two very different campaigns from
one dial pair.

Damping stays structural (existing clamps, saturation, honest successors) —
but note the soak test that guards this is currently vacuous (fixture uses
plural `flaws: ['greedy']`; `npcCorruptibleFlaw` reads only singular fields) —
fix the fixture before trusting any retuning.

---

## Concept C — Multi-stressor composition

Three layers, cheapest-first. The emergent score coupling (famine → crime
pressure → criminal_corridor birth) already exists and stays; these add the
authored relationships on top.

### C1. Synergy table (mechanical)

Per-catalog `synergies` map, evaluated only for **co-located** stressors
(intersecting affectedSettlementIds):

```js
// on famine:
synergies: {
  disease_outbreak: { decayMult: 0.6, escalationBonus: 0.10, note: 'the hungry sicken' },
  siege:            { blocksResolution: true, note: 'blockade — famine cannot lift while besieged' },
},
```

- Modifiers touch decay, resolutionChance, escalation probability — same
  levers as counterforces, opposite sign. Counterforces and synergies compose
  multiplicatively then clamp (same guard rails as Concept A).
- `blocksResolution` for hard causal dependencies (famine under siege).
- Keep the table small and authored — famine↔disease, famine↔siege,
  plague↔mass_migration, market_shock↔indebtedness, occupation↔insurgency
  (positive for insurgency), criminal_corridor↔infiltration. Default: no
  interaction, exactly as today.

### C2. Compound signatures (narrative)

A detection pass over co-located active stressor type-sets, matching named
patterns — this fulfills the UI copy's existing promise of named compound
conditions:

| Signature | Types | Surface |
|---|---|---|
| The Wasting | famine + disease_outbreak | joint realm arc, "the hungry sicken faster" hooks, compound condition |
| God's Abandonment | famine + disease + religious_conversion_fracture | flagellant movements, scapegoating, false-prophet NPC hooks |
| The Starving City | siege + famine | surrender-pressure clock, smuggling hooks |
| The Calling of Debts | market_shock + indebtedness | creditor faction hooks, asset seizures |
| The Shadow Court | criminal_corridor + infiltration + captureState ≥ corrupted | the guild *is* the government hooks |

Implementation home: `realmEvents.js` (currently same-type-only aggregation —
extend to cross-type signature matching), plus a compound entry in the hook
tables. Each signature can optionally emit one compound condition (severity =
f(member severities)) replacing nothing — additive narrative, bounded
mechanics.

### C3. Context-conditioned spawns (variants)

When a stressor candidate is born, an interpreter snapshots context and stamps
`originContext` on the stressor record — which selects a **variant**: same
catalog type, different instantiation, residuals, hooks, counterforces.

**The betrayed worked example:**

- `betrayal` births while **no** hostile/cold_war/rival edge exists (and no
  recent hostile memory — see Concept D): → variant `internal_conspiracy`.
  Seed **one corrupted NPC** "dependent on already existing factors": run the
  existing spawn machinery (corruptible flaw required; reuse
  IMPOSE_CORRUPTION's data shapes) — but the traitor's `corruptTies` points to
  a new `foreignPatron: null / factionId` field rather than requiring a
  criminal institution. Hooks: who turned, why, loyalty tests.
- `betrayal` births **while hostile** with a neighbor: → variant
  `foreign_sponsored`, stamps `sponsorSettlementId` (also pioneering attacker
  identity, which sieges currently lack entirely). The corrupted NPC's patron
  is the hostile neighbor. Hooks: spy networks, border incidents, casus belli;
  residuals shift toward diplomatic_distrust; counterforce shifts toward
  counter-intelligence (internal security) over social_trust.

Same pattern generalizes: siege born while hostile edge exists → stamp the
attacker; insurgency born under occupation → resistance variant; famine born
with supplier-in-famine context → import-collapse variant.

---

## Concept D — Recent memory: echoes and aftermath

**User's case:** betrayal started while hostile, but the hostility fizzled
(label relaxed to cold_war/neutral). Still in recent memory — impactful, not
presently active.

### D1. Stressor echoes (revive the dead lifecycle states)

On resolution, instead of dropping the stressor from `worldState.stressors`,
transition it to the **already-defined but never-reached** `residual` status /
`dormant_residual` policy:

```
active → resolved → ECHO (status 'residual', memoryStrength = severity at resolution,
        decays 0.5^(age/HALF_LIFE), HALF_LIFE ≈ 6 ticks, pruned < 0.1)
      → graduated (dropped from worldState; optionally appended to settlement.history)
```

While an echo:

- **No pressure, no conditions** — mechanically quiet, exactly as resolved
  stressors are today (the 6-tick `stressor_residual` condition still fires
  as the immediate aftermath; the echo is the longer shadow).
- **Read by the Concept C3 interpreter.** This is the fizzled-hostility
  answer: betrayal's variant logic consults both live edges *and* echoes +
  `relState.history` (which already records label transitions with ticks).
  Hostile-until-3-ticks-ago + betrayal → variant `abandoned_agent`: the
  traitor's patron made peace and cut them loose — blackmail, defection
  offers, a sleeper with no handler. Genuinely different story than either
  live-hostile or never-hostile, derived from data that already exists.
- **Synergy at reduced weight:** echoes participate in C1 at
  memoryStrength-scaled weight (war echo + new market_shock → reparations
  flavor, slower recovery).
- **Re-ignition:** a new stressor of the same type born while its echo is
  warm starts at partial severity inherited from the echo (grudge mechanics) —
  bounded by the same birth gates.
- **Narrative:** dossier/chronicle surfaces "in living memory" framing —
  historyGenerator already has exactly this register for 30–80-year-old
  events (ECHO_PREFIXES).

### D2. Couple relationship transitions to stressor lifecycle

The missing handshake that makes wars end:

- When hostile→cold_war/neutral applies between A and B, any
  siege/wartime/betrayal stressor whose `originContext.sponsorSettlementId`
  is the other party gets a large one-time resolution bonus (or direct ease
  below the structural 0.25 gate) — the war winds down because the *war*
  ended, not because severity bled out at 0.02/tick.
- Symmetrically, resolving a foreign-sponsored stressor writes a
  `recentIncidents` entry on the edge (the machinery exists), feeding
  relationshipMemory — which finally gets a second mechanical consumer.

### D3. Graduation into permanent history (later phase)

`settlement.history` is frozen at generation — campaign events never become
"history." When an echo expires, append a compact historicalEvent (the shape
already supports yearsAgo/severity/plotHooks), so `historyBeats.definingCrisis`
and `recentDisruption` can eventually be *campaign* events. This completes the
ladder: **active → echo (mechanical, decaying) → history beat (permanent,
narrative-only)** — matching the relationship system's
recentIncidents → history → posture ladder.

---

## Worked example: plague + famine + religious schism

- **Math (C1):** famine×disease synergy: each multiplies the other's decay
  ×0.6 and adds escalation bonus; religious_conversion_fracture joins with a
  milder modifier keyed off either. Counterforces (A) still pull the other
  way — a settlement with resilienceScore-strong food and 3+ healers can hold
  the line; one missing both spirals. Caps keep the spiral bounded.
- **Signature (C2):** all three co-located ≥ threshold severity → "God's
  Abandonment" arc: compound hooks (flagellants, scapegoating of a minority
  faction, false-prophet NPC seed), one compound condition hitting
  social_trust + public_legitimacy.
- **Aftermath (D):** when the last member resolves, each leaves an echo;
  the signature itself can leave a named echo ("the Abandonment is over, but
  every sermon references it") that the interpreter and hook tables read for
  HALF_LIFE ticks.

---

## Phasing

1. **Phase 1 — Counterforces** (highest value/effort ratio): generalize
   stressors.js:293-301 into catalog-driven `counterforces`; decayBoost for
   structural; conjunctive siege gate; consume resilienceScore + healerCount;
   soak assertions. Pure additive to one file + catalog data.
2. **Phase 2 — Corruption duality:** emit institution corruption impairments;
   split onset(dragged)/exposure(raw) security; proximity visibility;
   corruption_exposed condition on ousts. Fix the vacuous soak fixture first.
3. **Phase 3 — Synergies + signatures** (C1 then C2).
4. **Phase 4 — Variants + echoes + coupling** (C3, D1, D2) — the deepest cut,
   touches birth, resolution, and relationship apply paths.
5. **Phase 5 — History graduation** (D3).

## Bugs/dead-ends found during the audit (fix independently)

- Vacuous corruption soak: worldPulseSoak.test.js:339 `flaws: ['greedy']`
  (plural) vs singular-only `npcCorruptibleFlaw` — the runaway guard exercises
  zero corruption iterations.
- Residual conditions are volatility-rolled: under calm, ~40% of resolved
  stressors leave no aftermath (probability-1 outcomes shouldn't be scaled).
- Catalog `affectedSystems` vocabulary drift: `faction_stability`,
  `law_order`, `tax_revenue` are not causal SYSTEM_VARIABLES — residuals
  carrying them silently no-op.
- Generation stress types `recently_betrayed`, `indebted`, `infiltrated`,
  `politically_fractured`, `succession_void`, `monster_pressure` have no
  conditionPromotion rule — they never enter the sim loop at all (relevant to
  the betrayed scenario: today a "recently betrayed" settlement's betrayal is
  pure flavor text).
- Stressor aging is tick-interval-blind (age+=1 whether the tick is a week or
  a year) while conditions age interval-scaled — counterforce tuning should
  decide on one model.
- `wartime`/`mass_migration`/`insurgency` promotion regexes don't match their
  own type names (word-boundary / substring misses).

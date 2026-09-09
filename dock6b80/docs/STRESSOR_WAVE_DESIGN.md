# Stressor Wave — organic births, resolution shoring, magic deadzone

> Owner directive (2026-06-11): every stressor should have an organic situation or set of
> criteria for emerging or being blocked; gating and gradient RNG per type; partner/parallel
> stressor mutation where circumstances fit; combine redundant types; new `magic_deadzone`
> gated to magic-dependent settlements and roaming; **and shore up the resolution side for
> everything as well**. Execution delegated ("do everything in the way you think it would
> flow best").

## Thesis

The engine's resolution side already encodes settlement strength (counterforces,
`stressorDynamics.js`); the birth side is a bare pressure threshold. This wave completes the
symmetry: **births read the same source vocabulary counterforces read, inverted** — low
healing invites the outbreak that high healing ends. One vocabulary, two directions, and the
gate's reasons land on the candidate so the paid surface explains *why this crisis, here*.

Mechanism: generalize the coup's `spawnGate` (the one politics-gated birth) into a per-type
gate catalog (`stressorGates.js`). A gate returns `null` (birth blocked — context contradicts
the story) or `{ probabilityMult, reasons }` (gradient odds from continuous reads of ledgers,
causal scores, institutions, relationships, co-located stressors, and echoes). The mult feeds
the existing candidate probability formula — RNG is preserved, never bypassed.

## Per-type birth gates

Factors multiply; final mult clamped to [0.1, 3]. "Block" = return null. All reads are
deterministic snapshot reads (no RNG, no Date inside gates).

| Type | Boosts | Suppressions | Blocks |
|---|---|---|---|
| siege | hostile neighbour ×1.4 (cold_war ×1.15); wartime here/at neighbour ×1.3; frontier/plagued `monsterThreat` ×1.2 | defense_readiness ≥70 ×0.8; no hostile context ×0.4 (unattributed warbands stay possible) | — |
| famine | food deficit >15% ×1.5; active siege here ×1.6 (blockade starves) | storage ≥4 months ×0.25 (≥2 ×0.6); ≥2 food institutions ×0.75 | — (blights happen) |
| occupation | active siege here ×1.8 (sieges end in occupation); hostile neighbour ×1.2; wartime ×1.2 | defense_readiness ≥70 ×0.7 | **no plausible occupier** (no siege, no hostile/cold_war neighbour, no wartime) |
| political_fracture | legitimacy <45 ×1.3 (<30 ×1.6); succession_void active ×1.4; coup echo ×1.3 | ≥2 admin institutions ×0.7; legitimacy ≥70 ×0.4 | — |
| indebtedness | trade_connectivity <40 ×1.4 (<25 ×1.7) — **the owner's low-economy criterion**; market_shock active/echo ×1.5 | trade_connectivity ≥70 ×0.6 | — |
| betrayal | hostile neighbour ×1.3; recent hostile memory ×1.2; criminal_opportunity ≥60 ×1.2 | social_trust ≥70 ×0.6 | — |
| infiltration | criminal_opportunity ≥60 ×1.4; hostile/cold_war neighbour ×1.3 | ≥2 security institutions ×0.7 | — |
| disease_outbreak | healing_capacity <35 ×1.5; **zero healer institutions ×1.4** (owner criterion); mass_migration active ×1.4; famine active ×1.3; ≥3 trade routes ×1.15 (contagion by road) | healing ≥70 with ≥2 healers ×0.55 | — |
| succession_void | coup echo ×1.4; betrayal echo ×1.2; ruling_authority <40 ×1.3 | ruling_authority ≥70 ×0.6 | **active coup** (the coup IS the succession contest) |
| monster_raider_pressure | `monsterThreat` plagued ×1.7 / frontier ×1.35 (**owner: embattled-region criterion**); war stressor at any neighbour ×1.3 | heartland ×0.5; defense ≥70 ×0.7; ≥2 defense institutions ×0.85 | — |
| insurgency | **occupation active ×2.0** (resistance variant); legitimacy <30 ×1.5 | — | **legitimacy ≥75** (no insurgency against a beloved regime) |
| religious_conversion_fracture | **occupation active ×1.6** (owner: conversion rides occupation); religious_authority <40 ×1.3; plural (≥2) religious institutions ×1.25 | religious_authority ≥75 ×0.6; zero religious institutions ×0.7 (nothing to fracture) | — |
| rebellion | legitimacy <45 ×1.3 (<30 ×1.7); famine or indebtedness active ×1.3 (bread riots); wartime active ×1.25 (war taxes) | — | **active occupation** (insurgency models resistance); **legitimacy ≥75** |
| wartime | hostile neighbour ×1.5 (cold_war ×1.2); war stressor at neighbour ×1.3; raider pressure active ×1.2 | no conflict context at all ×0.3 | — |
| mass_migration | crisis (famine/war/plague/occupation) at any neighbour ×1.6 (their people arrive) | no neighbour crises ×0.7; occupation here ×0.5 (movement controlled) | **active siege here** (owner rule: the siege stops all migration) |
| market_shock | ≥3 trade routes ×1.3 (exposure); entrepôt ×1.3; neighbour market_shock ×1.4 (contagion); indebtedness active ×1.3 | zero trade routes ×0.3; ≥2 finance institutions ×0.8 | — |
| criminal_corridor | criminal_opportunity ≥60 ×1.4; infiltration active ×1.25; legitimacy <40 ×1.2 | no trade traffic ×0.35 (a corridor needs a road); ≥2 security institutions ×0.75 | — |
| magical_instability | ≥2 arcane institutions ×1.3 (experiments); magical_stability <40 ×1.4 | — | **no-magic world**; **no arcane presence at all**; **active magic_deadzone** (mutual exclusion) |
| coup_detat | (existing gate unchanged: legitimacy bands × authority, occupier block, challenger requirement) | | |
| magic_deadzone | **magical_instability echo ×1.5** (a burned-out surge leaves dead ground — the owner's "one stressor mutates into a partner") ; heavy magic dependence ×1.3 | ≥2 arcane institutions ×0.8 (wards hold) | **no-magic world**; **not magic-dependent** (see below); **active magical_instability** |

Companion/partner emergence is implemented as **gate boosts from co-located stressors and
echoes** (occupation→conversion, occupation→insurgency, siege→famine, famine/migration→disease,
market_shock↔indebtedness, instability-echo→deadzone) rather than direct spawn chains — one
candidate pipeline, no second spawn path, and the boost reason is printed on the candidate.

Legacy snapshot-less path (`stressorCandidateForPressure`): gates that can hard-block carry
`requiresSnapshot = true` and are skipped there (the coup already behaved this way); the rest
are treated as neutral in that path.

## New type: `magic_deadzone`

The inverse of `magical_instability` — absence, not wildness. Mutually exclusive with it at
birth, both directions.

- **Catalog:** episodic; pressureKinds `['legitimacy','trade','disease']`, birthThreshold 0.6;
  affectedSystems `['healing_capacity','trade_connectivity','public_legitimacy']`; residuals
  `['scorched_leylines','hedge_wizard_exodus','mundane_adaptation']`; spreadChannels
  `['arcane_network','information_network']`. Major (proposal-gated) birth.
- **Magic-dependence gate** ("magic-only settlements"): requires `magicLedger.magicExists` AND
  at least one of — arcane institutions present; `defenseProfile.magicDependency`; a
  `magically_sustained` chain (or `magicNote`); magic trade infra (`magicTradeChannel` /
  `_magicTradeOnly` / teleport-pattern institutions); `magicLevel` medium+ with
  `magical_stability` derivable. Settlements where magic doesn't matter never see it.
- **Roaming = wandering footprint** (new, catalog-driven `wander: { chance, maxFootprint }`):
  on each aging tick, fork `wander:${id}`; on success the zone creeps to one connected
  neighbour (information_flow/trade_route adjacency) and, past `maxFootprint`, vacates its
  oldest settlement — which gets a one-time residual ("the magic returns, slowly"). Bounded,
  deterministic, order-independent. Ordinary spread channels still apply on top.
- **Counterforce (resolution):** external arcane relief — incoming information_flow from
  settlements with arcane institutions — plus local arcane ritual knowledge and admin
  adaptation. Synergies: drags disease_outbreak (×0.8 decay — the healers' magic is gone) and
  market_shock (×0.85 — teleport commerce dark) at magic-dependent hosts.
- Aftermath history type `magical_controversy`; realm label added; condition promotion uses
  the existing `custom_crisis` fallback carrying catalog affectedSystems (same as
  magical_instability — mechanically live through the pressure loop's affectedSystems read).

## Redundancy reconciliation

- **slave_revolt → folded out of organic births only.** It stays in both catalogs (19
  generation files consume it; DM authoring and legacy saves keep working — `deprecated:
  true` only removes it from `stressorTypesForPressure`). Organic uprisings now birth as
  **rebellion** with origin variants: `servile_uprising` (labor_capacity <35 + legitimacy
  <40), `tax_revolt` (indebtedness/market_shock active or echo), else `popular_revolt`. Each
  variant gets hooks. Counterforce/aftermath/realm entries for slave_revolt remain for
  legacy records.
- **rebellion vs insurgency** — kept distinct, differentiated by gates: insurgency is the
  occupied/foreign-rule form (occupation ×2.0, resistance variant), rebellion the domestic
  form (blocked under occupation).
- betrayal/infiltration, wartime/siege — reviewed, kept (shock vs network; footing vs
  blockade).

## Resolution shoring (every type)

1. **Resolution receipts.** `counterforceAssessment` now returns a per-source breakdown;
   resolved stressors (rolled AND directed) carry `resolutionContext` — counterforce score,
   the named strengths that led recovery, synergy companions that dragged, and a one-line
   narrative. Residual outcomes print it, so "why did this end" is explainable like
   everything else.
2. **New synergies:** wartime↔siege sustain each other; occupation drags
   religious_conversion_fracture (the occupier sponsors the new faith); **insurgency
   accelerates occupation's end** (first accelerating synergy: decayMult 1.25,
   resolutionDelta +0.04 — the resistance bleeds the garrison); magic_deadzone drags
   disease_outbreak and market_shock.
3. **`resolutionRules` deleted** — confirmed write-only (`{}` serialized on every stressor,
   zero readers). Dead config is where drift hides.
4. **Wall-clock fallbacks removed** from `ageRoamingStressors` (two `new Date()` defaults;
   the orchestrator always threads `now` — the fallback now preserves the prior stamp).
5. **Profile audit:** every type (incl. magic_deadzone) has a counterforce profile; occupation
   stays sticky by design (decayBoost 1.2); structural break paths verified ≥1.4 elsewhere.
6. Indebtedness' "borrows prosperity first": its **birth** candidate carries an explicit
   early-boom reason and the residual keeps `merchant_leverage`; a signed-by-stage causal
   effect is deferred — conditions are the only mechanical carrier and a positive-polarity
   condition archetype is a Wave-7-class modeling addition. Documented here as the honest
   boundary.

## Migration dispersion (same wave, separate commit)

`populationDynamics.js` destination weighting gains a relationship multiplier on the
canonical edge label between source and destination: allied ×1.5, patron/client/vassal
×1.35, trade_partner ×1.25, neutral/other ×1.0, rival ×0.7, cold_war ×0.45, hostile ×0.15.
Applied in both concentrated (sort) and distributed (weights) modes; deterministic;
`canonicalRelationshipLabel` via the `relationshipTypeOf` idiom from stressorDynamics.

## Verification

- New pins: `stressorGates.test.js`, `magicDeadzone.test.js`, resolution-receipt +
  new-synergy pins, migration-weighting pins (existing hand-built snapshot scaffold).
- **Balance probe** `tmp_stressor_wave_probe.mjs` (the `tmp_soak_probe.mjs` idiom): 40/120
  ticks across the soak fixtures + a magic-flavoured fixture; reports births per type,
  blocks/boosts fired, lifetimes, co-occurrence — run before and after; the soak bounds must
  hold (probe reports, the soak test pins).
- Full `npm run check` + adversarial review of the diff before commit.

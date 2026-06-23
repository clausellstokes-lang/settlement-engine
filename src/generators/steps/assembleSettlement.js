/**
 * Step 15: assembleSettlement
 *
 * Assembles the final settlement object from all accumulated context,
 * runs narrative overlays, defense profile, legitimacy patching,
 * and coherence generation.
 *
 * Final assembly step for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import { generateSettlementName } from '../npcGenerator.js';
import { generatePressureSentence, generateArrivalScene, generateCoherence } from '../narrativeGenerator.js';
import { generateDefenseProfile } from '../defenseGenerator.js';
// Faction-to-NPC coupling: synthesizes structural NPCs (high priestess,
// watch captain, etc.) for any faction archetype that lacks them. Runs
// at assembly so existing pipeline NPCs are deduplicated against.
import { ensureFactionStructuralNpcs } from '../factionRoles.js';
// Canonical-shape adapter. Stamps version fields, mints a
// stable id, defaults canonical containers. Pure — does not restructure
// legacy fields. Every freshly-generated settlement passes through here
// so downstream consumers (save/load, PDF, AI overlay, trace layer)
// can rely on the canonical contract.
import { normalizeSettlement } from '../../domain/normalizeSettlement.js';
// Promote live-crisis stressors (plague/famine/siege/…) into canonical
// activeConditions so the causal substrate + AI overlay react to a settlement
// generated mid-crisis — closing the "generated plague town has activeConditions:[]"
// gap. Pure + deterministic + idempotent.
import { promoteStressorsToConditions, reapplyEventConditions } from '../../domain/conditionPromotion.js';
// The canonical defense-readiness -> legitimacy table. This file used to carry a
// stale local copy that LACKED 'Lightly Defended', so the real-label patch below
// reverted that band's provisional contribution to 0 on every generated settlement.
import { DEFENSE_CONTRIB } from '../factionDynamics.js';

registerStep('assembleSettlement', {
  // structuralValidationPass provides ctx.structural — the coherence receipt
  // for the FINAL roster (moved out of assembleInstitutions).
  deps: ['generateNarratives', 'generatePopulation', 'corruptionPass', 'structuralValidationPass'],
  reads: ['availableServices', 'conflicts', 'culture', 'economicState', 'economicViability', 'effectiveConfig', 'factions', 'history', 'institutions', 'neighbourProfile', 'npcs', 'population', 'powerStructure', 'rawNeighbour', 'relationships', 'resourceAnalysis', 'settlementReason', 'spatialLayout', 'stress', 'structural', 'tier'], // ctx keys this step consumes that another step produces
  provides: ['settlement'],
  mutates: ['powerStructure'], // normalizes the power roster in place
  phase: 'assembly',
}, (ctx) => {
  const {
    tier, population, institutions, effectiveConfig,
    neighbourProfile, rawNeighbour,
    economicState, spatialLayout, availableServices, powerStructure,
    settlementReason, npcs, relationships, factions, conflicts,
    resourceAnalysis, economicViability, history, stress, structural,
    culture,
  } = ctx;
  const config = ctx.config || {};

  const settlement = {
    name: (effectiveConfig.customName?.trim()) || generateSettlementName(culture),
    tier,
    population,
    institutions,
    structuralViolations: structural?.violations || [],
    structuralSuggestions: structural?.suggestions || [],
    neighborRelationship: neighbourProfile || (rawNeighbour ? {
      name: rawNeighbour.name,
      tier: rawNeighbour.tier,
      relationshipType: config._neighbourRelType || 'neutral',
      npcs:    rawNeighbour.npcs    || [],
      factions: rawNeighbour.factions || [],
    } : null),
    economicState,
    spatialLayout,
    availableServices,
    // Seam fix: conflicts are generated top-level (below) but several readers
    // — aiLayer, dailyLifeLogic, and the generate-narrative edge function the
    // owner deploys separately — expect powerStructure.conflicts. Dual-write
    // so both addresses are live.
    powerStructure: powerStructure ? { ...powerStructure, conflicts: powerStructure.conflicts ?? conflicts ?? [] } : powerStructure,
    settlementReason,
    npcs,
    relationships,
    factions,
    conflicts,
    resourceAnalysis,
    economicViability,
    history,
    // Dual-write the stress array under both the legacy
    // `stress` name AND the canonical `stressors` name. Consumers that
    // bypass normalizeSettlement (e.g. UI components that read directly
    // from a freshly-generated settlement) now see the canonical shape
    // without going through the adapter.
    stress,
    stressors: stress,
    // RESOLVED effectiveConfig snapshot — carries derived keys (stressTypes,
    // _magicTradeOnly, tier, …) that display/validator/sim readers depend on.
    // It is NEVER a valid generation input: applyChange regenerates from
    // _config below, and its legacy fallback strips the derived keys
    // (store/settlementSlice.js DERIVED_CONFIG_KEYS) so emergent stress
    // can't echo back in as user-forced stress.
    config: { ...effectiveConfig },
    // The RAW pre-resolution config, sentinels intact ('random',
    // 'random_culture', …). `config` above holds the RESOLVED choices for
    // this generation; treating it as a generation input is what pinned
    // random settings to their first roll. Save/load and applyChange flows
    // read _config first so 'random' stays random across regenerations.
    _config: { ...config },
  };

  // Narrative overlays
  settlement.pressureSentence = generatePressureSentence(settlement);
  settlement.arrivalScene     = generateArrivalScene(settlement);
  settlement.defenseProfile   = generateDefenseProfile(settlement);

  // Patch publicLegitimacy with real defense readiness
  if (settlement.powerStructure?.publicLegitimacy && settlement.defenseProfile?.readiness?.label) {
    const realDefLabel = settlement.defenseProfile.readiness.label;
    const provLeg      = settlement.powerStructure.publicLegitimacy;
    const realDefContrib = DEFENSE_CONTRIB[realDefLabel] ?? 0;
    const delta = realDefContrib - (provLeg.breakdown?.defense ?? 0);

    if (delta !== 0) {
      const newScore = Math.max(0, Math.min(100, provLeg.score + delta));
      provLeg.score = newScore;
      provLeg.breakdown.defense = realDefContrib;

      if      (newScore >= 75) { provLeg.label = 'Endorsed';          provLeg.color = '#1a5a28'; provLeg.govMultiplier = 1.30; provLeg.crimMultiplier = 0.75; }
      else if (newScore >= 60) { provLeg.label = 'Approved';          provLeg.color = '#4a7a2a'; provLeg.govMultiplier = 1.15; provLeg.crimMultiplier = 0.90; }
      else if (newScore >= 45) { provLeg.label = 'Tolerated';         provLeg.color = '#a0762a'; provLeg.govMultiplier = 1.00; provLeg.crimMultiplier = 1.00; }
      else if (newScore >= 30) { provLeg.label = 'Contested';         provLeg.color = '#8a4010'; provLeg.govMultiplier = 0.80; provLeg.crimMultiplier = 1.15; }
      else                     { provLeg.label = 'Legitimacy Crisis'; provLeg.color = '#8b1a1a'; provLeg.govMultiplier = 0.60; provLeg.crimMultiplier = 1.30; }
      provLeg.isEndorsed          = newScore >= 75;
      provLeg.isApproved          = newScore >= 60;
      provLeg.isTolerated         = newScore >= 45 && newScore < 60;
      provLeg.isContested         = newScore >= 30 && newScore < 45;
      provLeg.isLegitimacyCrisis  = newScore < 30;
      provLeg.governanceFractured = newScore < 30;
    }
  }

  const coherenceUpdates = generateCoherence(settlement);
  Object.assign(settlement, coherenceUpdates);

  // Faction-to-NPC coupling. Walks every faction; for each archetype
  // (temple, watch, merchant, thieves, noble, arcane) ensures the
  // implied structural NPCs exist with the right importance tier and
  // institution/faction linkage. Idempotent — won't duplicate NPCs
  // the population step already generated for the same role + faction.
  const withStructural = ensureFactionStructuralNpcs(settlement);
  Object.assign(settlement, withStructural);

  // Propagate the in-pipeline causal trace onto the settlement so
  // downstream consumers (PipelineRail, AI overlay, PDF) can read it.
  // The trace is built up across the run by `recordTrace(ctx, ...)`
  // calls inside individual steps; we copy it through here so the
  // settlement carries the receipt of its own generation.
  if (Array.isArray(ctx.simulationTrace) && ctx.simulationTrace.length) {
    settlement.simulationTrace = ctx.simulationTrace;
  }

  // Deterministic id: normalizeSettlement uses `_seed` to mint a stable
  // settlement id (idFromSeed). Without _seed on the object at the
  // normalize step, every regeneration of the same config gets a
  // different id — which the review flagged as a determinism gap.
  // Attach _seed BEFORE normalize so the id derives from it.
  if (ctx._seed && !settlement._seed) {
    settlement._seed = ctx._seed;
  }

  // Wire the canonical-shape adapter at the assembly boundary. This is
  // the *only* point at which a newly-generated settlement enters the
  // wider app; normalizing here means every consumer downstream
  // (Zustand store, save layer, PDF, AI overlay) sees a settlement with
  // version stamps and a stable id. The legacy shape is preserved —
  // normalize only adds, never restructures.
  // Normalize first (version stamps, stable id, canonical containers incl. a
  // defaulted activeConditions: []), THEN promote stressors into conditions so
  // the crisis is durable substrate state, not just a stressor label, THEN
  // re-promote the event-authored conditions recorded in
  // config.eventConditions — the authored record (mutate.js dual-writes it to
  // config + _config) that keeps a what-if regeneration from erasing what the
  // DM's events did. Order matters: re-promotion dedupes against the
  // GENERATION-stamped twins the stressor promotion just minted.
  return { settlement: reapplyEventConditions(promoteStressorsToConditions(normalizeSettlement(settlement))) };
});

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
// F8: re-render stress summaries with the real settlement name. resolveStress
// (step 3) rolled them 16 steps ago with an empty name and stashed the
// rng-derived choice in each entry's `summaryRoll`; we re-render here now that
// the name exists.
import { renderStressSummary } from '../stressNarrative.js';
import { generatePressureSentence, generateArrivalScene, generateCoherence } from '../narrativeGenerator.js';
import { generateDefenseProfile } from '../defenseGenerator.js';
// Faction-to-NPC coupling: synthesizes structural NPCs (high priestess,
// watch captain, etc.) for any faction archetype that lacks them. Runs
// at assembly so existing pipeline NPCs are deduplicated against.
import { ensureFactionStructuralNpcs } from '../factionRoles.js';
// Canonical-shape adapter (Tier 1.3). Stamps version fields, mints a
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
import {
  clearActiveRng,
  setActiveRng,
} from '../../kernel/rngContext.js';
import { culturalNotesFor } from '../../domain/cultureProfiles.js';
import {
  buildGenerationCoherenceReceipt,
} from '../generationCoherence.js';
import {
  assertPowerEconomyFreshness,
  reconcilePowerStructure,
  refreshPowerGenerationTraces,
} from '../power/economyReconciliation.js';

/**
 * Run one assembly concern on its own deterministic child stream.
 *
 * Assembly contains both presentation writers and canonical coherence
 * enrichment. Some presentation branches legitimately draw a different number
 * of prose variants when a custom display label changes. Without a stream
 * boundary, those cosmetic draws move the later NPC-secret and relationship
 * draws. A named child stream makes that dependency impossible while retaining
 * the fail-closed global RNG contract used by the existing generators.
 *
 * @template T
 * @param {{fork:(label:string)=>any}} stepRng
 * @param {string} label
 * @param {(rng:any) => T} operation
 * @returns {T}
 */
function inAssemblySubstream(stepRng, label, operation) {
  const substreamRng = stepRng.fork(label);
  const previousRng = setActiveRng(substreamRng);
  try {
    return operation(substreamRng);
  } finally {
    clearActiveRng(previousRng);
  }
}

registerStep('assembleSettlement', {
  // structuralValidationPass provides ctx.structural — the coherence receipt
  // for the FINAL roster (Wave 4b moved it out of assembleInstitutions).
  deps: ['generateNarratives', 'generatePopulation', 'corruptionPass', 'structuralValidationPass'],
  reads: ['availableServices', 'conflicts', 'culture', 'culturalIdentity', 'economicState', 'economicViability', 'effectiveConfig', 'factions', 'generationContext', 'generationRepairs', 'history', 'institutions', 'isolationSupport', 'neighbourProfile', 'npcs', 'population', 'powerIntent', 'powerStructure', 'rawNeighbour', 'relationships', 'resourceAnalysis', 'settlementReason', 'spatialLayout', 'stress', 'structural', 'tier'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  provides: ['settlement'],
  // normalizes the power roster in place; F8 also re-renders each stress entry's
  // summary in place with the real name (resolveStress rolled them name-blind) and
  // deletes the transient summaryRoll token — a declared in-place write of `stress`
  // (A+ P1.7 contract).
  mutates: ['powerStructure', 'stress'],
  phase: 'assembly',
}, (ctx, rng) => {
  const {
    tier, population, institutions, effectiveConfig,
    neighbourProfile, rawNeighbour,
    economicState, spatialLayout, availableServices, powerStructure,
    settlementReason, npcs, relationships, factions, conflicts,
    resourceAnalysis, economicViability, history, stress, structural,
    isolationSupport,
    culture, culturalIdentity,
  } = ctx;
  const config = ctx.config || {};

  // F8: mint the settlement name up front so the stress summaries — rolled with
  // an empty name back in resolveStress (step 3) — can be re-rendered with the
  // real name below. generateSettlementName draws rng (prefix + suffix indices);
  // keeping the mint here, immediately before the settlement literal, preserves
  // its exact draw position — nothing between the ctx destructure and the literal
  // consumes rng, so the customName short-circuit and draw order are unchanged.
  const settlementName = (effectiveConfig.customName?.trim()) || generateSettlementName(culture);

  const settlement = {
    name: settlementName,
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
    isolationSupport,
    // Materialized rather than inferred in the UI: every consumer now reads
    // the same local expression of the culture choice. culturalNotes keeps the
    // established PDF/AI compatibility field while the structured record gives
    // future engineers the seven explicit dimensions behind it.
    culturalIdentity,
    culturalNotes: culturalNotesFor(culturalIdentity),
    // Tier 1.2 — dual-write the stress array under both the legacy
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

  // F8: re-render each stress entry's summary with the real settlement name.
  // resolveStress baked a PROVISIONAL empty-name summary (leading-space prose
  // like " is under active siege…") and stashed the sole rng-derived choice
  // (wartime's profit coin) in `summaryRoll`. Now that the name exists we
  // re-render from that token and delete the transient field so it never
  // persists or enters the golden hash. Handles both dual-written containers
  // (stress + stressors — same object refs) and both shapes (bare object vs
  // array). Entries WITHOUT an own summaryRoll (custom-authored stressors that
  // carry their own summary) are left untouched.
  const rerenderStressSummary = (container) => {
    if (!container) return;
    const entries = Array.isArray(container) ? container : [container];
    for (const e of entries) {
      if (e && typeof e === 'object'
          && Object.prototype.hasOwnProperty.call(e, 'summaryRoll')) {
        e.summary = renderStressSummary(e.type, settlementName, e.summaryRoll);
        delete e.summaryRoll;
      }
    }
  };
  rerenderStressSummary(settlement.stress);
  rerenderStressSummary(settlement.stressors);

  // Narrative overlays
  settlement.pressureSentence = generatePressureSentence(settlement);
  settlement.arrivalScene     = generateArrivalScene(settlement);
  settlement.defenseProfile   = generateDefenseProfile(settlement);

  // The final-economy pass already proved that power consumed the final
  // prosperity/safety/food tuple. Assert that proof before applying the one
  // remaining late input: defenseProfile's real readiness label.
  assertPowerEconomyFreshness(
    settlement.powerStructure,
    settlement.economicState,
    tier,
  );
  if (settlement.defenseProfile?.readiness?.label) {
    const { beforeFactions } = reconcilePowerStructure(
      settlement.powerStructure,
      settlement.economicState,
      ctx.powerIntent,
      { defenseLabel: settlement.defenseProfile.readiness.label },
    );
    refreshPowerGenerationTraces(
      ctx,
      beforeFactions,
      settlement.powerStructure,
      ctx.powerIntent,
    );
  }
  assertPowerEconomyFreshness(
    settlement.powerStructure,
    settlement.economicState,
    tier,
  );

  // Coherence mutates canonical NPC/faction mechanics. Give it a dedicated
  // stream so variable draw counts in pressure/arrival/defense presentation
  // cannot silently rewrite those mechanics.
  const coherenceUpdates = inAssemblySubstream(
    rng,
    'canonical-coherence',
    coherenceRng => generateCoherence(settlement, coherenceRng),
  );
  Object.assign(settlement, coherenceUpdates);

  // Faction-to-NPC coupling. Walks every faction; for each archetype
  // (temple, watch, merchant, thieves, noble, arcane) ensures the
  // implied structural NPCs exist with the right importance tier and
  // institution/faction linkage. Idempotent — won't duplicate NPCs
  // the population step already generated for the same role + faction.
  const withStructural = ensureFactionStructuralNpcs(
    settlement,
    ctx.generationContext,
  );
  Object.assign(settlement, withStructural);

  // A durable, seed-stable receipt over the FINAL player-facing dossier.
  // Repairs happen in their owning passes; this boundary proves that the
  // resulting world law, prose, structure, food verdict, identity roster, and
  // isolation support agree. Explicit by-design premises stay visible without
  // turning a deliberately strange settlement into a failed generation.
  settlement.generationCoherenceReceipt = buildGenerationCoherenceReceipt(
    settlement,
    {
      seed: ctx._seed,
      generationContext: ctx.generationContext,
      generationRepairs: ctx.generationRepairs,
    },
  );

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

/**
 * Step 10: generatePower
 *
 * Generates power structure (government, factions, legitimacy).
 *
 * Power-structure step for the settlement generation pipeline.
 *
 * Tier 4.1: emits structured faction traces after the legacy power
 * generator finishes. The generator itself is not refactored — the
 * traces are layered on top via deriveFactionProfile, which is the
 * same Strangler Fig pattern the rest of the simulator's causality
 * work follows.
 */

import { registerStep } from '../pipeline.js';
import { generatePowerStructure } from '../powerGenerator.js';
import { recordTrace } from '../../domain/trace.js';
import { deriveFactionProfile } from '../../domain/factionProfile.js';

registerStep('generatePower', {
  deps: ['generateEconomy', 'resolveNeighbour'],
  provides: ['powerStructure'],
  phase: 'power',
}, (ctx) => {
  const {
    tier, economicState, effectiveConfig, institutions,
  } = ctx;

  // Note: neighbour faction influence is consumed by the separate
  // neighbourFactions step (ctx.neighbourFacBias); generatePowerStructure
  // itself reads no neighbour bias, so none is threaded into its config.
  //
  // The 3rd arg (tradeRoute) drives the hostile-neighbour stability band and the
  // "Ongoing tensions with {neighbour}" recentConflict line. resolveNeighbour writes
  // effectiveConfig.neighborRelationship = { neighborName, relationshipType } when a
  // neighbour is bound. Pass it ONLY for adversarial relationships — the recentConflict
  // branch fires for ANY truthy value, so an allied/trade_partner neighbour must be
  // passed as null to avoid a false "ongoing tensions" claim.
  const neighbourRel = effectiveConfig.neighborRelationship;
  const ADVERSARIAL_REL = new Set(['hostile_rival', 'Hostile rival', 'cold_war', 'Cold war', 'tense']);
  const tradeRouteArg = neighbourRel && ADVERSARIAL_REL.has(neighbourRel.relationshipType)
    ? neighbourRel
    : null;
  const powerStructure = generatePowerStructure(
    tier, economicState, tradeRouteArg,
    { ...effectiveConfig },
    institutions
  );

  // ── Trace recording (Tier 4.1) ───────────────────────────────────────
  // Emit one trace per faction the generator produced. Causes describe
  // what gave the faction its power; downstream describes what
  // subsystems the faction's archetype influences. The
  // deriveFactionProfile call enriches the legacy shape with archetype
  // + resource bands so the trace carries the meaningful classification.

  const factionsList = powerStructure?.factions || [];

  for (const f of factionsList) {
    const profile = deriveFactionProfile(f, { powerStructure });
    if (!profile) continue;

    // The generator marks the governing entry directly; name-matching
    // against powerStructure.governingName would readmit substring false
    // positives (e.g. Merchant Guilds under a Merchant oligarchy).
    const isGoverning = f.isGoverning === true;

    const causes = [];
    causes.push({
      source: `tier.${tier}`,
      effect: `power ${profile.power}`,
      reason: `Tier baseline plus tier-scaled archetype multiplier for ${profile.archetype}.`,
    });
    if (isGoverning) {
      causes.push({
        source: 'governingFaction',
        effect: 'inherits public legitimacy',
        reason: `As the governing faction, ${profile.name} inherits the settlement's public-legitimacy score (${profile.legitimacy}).`,
      });
    }
    if (Array.isArray(institutions) && institutions.length) {
      // Mention the institutional ground-truth that the power generator
      // keys off. We don't try to attribute specific institutions to
      // specific factions here — that's a Tier 4.2 concern.
      causes.push({
        source: 'institutionMix',
        effect: 'archetype context',
        reason: `Power derives in part from the institution mix (${institutions.length} institutions across ${new Set(institutions.map(i => i.category).filter(Boolean)).size} categories).`,
      });
    }

    // Downstream effects derived from the archetype. Mirrors the
    // institution-tag downstream logic in assembleInstitutions.
    const downstreamEffects = [];
    switch (profile.archetype) {
      case 'military':
      case 'occupation':
        downstreamEffects.push({ target: 'publicOrder',      effect: 'reinforced' });
        downstreamEffects.push({ target: 'defenseCapacity',  effect: 'reinforced' });
        break;
      case 'religious':
        downstreamEffects.push({ target: 'welfareCapacity',  effect: 'reinforced' });
        downstreamEffects.push({ target: 'publicLegitimacy', effect: 'influenced' });
        break;
      case 'merchant':
        downstreamEffects.push({ target: 'tradeConnectivity', effect: 'reinforced' });
        downstreamEffects.push({ target: 'economy',           effect: 'influenced' });
        break;
      case 'craft':
        downstreamEffects.push({ target: 'craftCapacity', effect: 'reinforced' });
        break;
      case 'criminal':
        downstreamEffects.push({ target: 'publicOrder', effect: 'eroded'     });
        downstreamEffects.push({ target: 'blackMarket', effect: 'reinforced' });
        break;
      case 'arcane':
        downstreamEffects.push({ target: 'magicCapacity', effect: 'reinforced' });
        break;
      case 'government':
        downstreamEffects.push({ target: 'publicLegitimacy', effect: isGoverning ? 'anchored' : 'influenced' });
        break;
      default:
        // 'other' — no canonical downstream
        break;
    }

    recordTrace(ctx, {
      targetType: 'faction',
      targetId:   profile.id,
      step:       'generatePower',
      result:     isGoverning ? 'governing' : 'formed',
      causes,
      downstreamEffects,
    });
  }

  return { powerStructure };
});

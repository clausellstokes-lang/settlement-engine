/**
 * Step 13: generatePopulation
 *
 * Generates NPCs, relationships, NPC faction groups, and links them
 * to power factions. Also generates conflicts.
 *
 * Population step for the settlement generation pipeline.
 *
 * ⛔ ONE REGISTRATION, ONE STREAM (EM-P0). The root/derive seam below is INTERNAL: two
 * functions in this file, the step's own stream object passed to both. It is deliberately
 * not two registered steps, because a fork is `createPRNG` over a derived seed — a fresh
 * stream at position 0, never a continuation — so two registrations can never share one
 * stream position, and splitting the registration moved 41 of 41 sampled golden rows when
 * it was tried. Fresh generation is byte-identical here BY CONSTRUCTION: the same
 * registration, the same stream, the same draws in the same order.
 */

import { chooseOrPin, registerStep } from '../pipeline.js';
import { generateNPCs, generateRelationships } from '../npcGenerator.js';
import { generateFactions, generateConflicts } from '../powerGenerator.js';
import { rollNamedMass } from '../density/applyDensityLaw.js';
import { recordTrace } from '../../domain/trace.js';

const FACTION_ATTRACTION = {
  government: ['government', 'other'],
  military:   ['military', 'government', 'other'],
  economy:    ['economy', 'crafts', 'government', 'other'],
  religious:  ['religious', 'magic', 'other'],
  criminal:   ['criminal', 'other'],
  magic:      ['magic', 'religious', 'other'],
  crafts:     ['crafts', 'economy', 'other'],
  noble:      ['government', 'military', 'other'],
};

/**
 * The category index — the ONE power-faction lookup that is read on EVERY path, including the
 * held one: the faction-linkage TRACE's direct/attraction classifier reads it after the
 * chooser has already returned. Lifted out of `powerLinkage` VERBATIM (EM-R2 §0.R), so it is
 * built once, outside the draw thunk, and a held roster still gets its own trace reading.
 * Pure — it takes no draw.
 */
function powerFactionsByCategory(pfList) {
  return pfList.reduce((acc, pf) => {
    const cat = pf.category || 'other';
    if (!acc[cat] || pf.power > acc[cat].power) acc[cat] = pf;
    return acc;
  }, {});
}

/**
 * The FOUR linkage-only lookups — `pfList`, `governingPF`, `pfAttractionMap` and `totalPower`
 * are read by `linkFactions` and by nothing else, so under a held `factions` key this whole
 * object is dead work. It is built INSIDE the draw thunk (EM-R2 §0.R: a SPLIT, not a
 * deletion — the category index above survives because the trace still reads it).
 * Pure — it takes no draw.
 */
function powerLinkage(powerStructure, byCategory) {
  const pfList = powerStructure?.factions || [];
  const topPowerFaction = [...pfList].sort((a, b) => (b.power || 0) - (a.power || 0))[0];
  return {
    pfList,
    governingPF: pfList.find(f => f.isGoverning) || topPowerFaction,
    powerFactionsByCategory: byCategory,
    pfAttractionMap: pfList.map(pf => ({
      pf, profile: FACTION_ATTRACTION[pf.category || 'government'] || ['other'],
    })),
    totalPower: pfList.reduce((s, f) => s + (f.power || 0), 0) || 1,
  };
}

/** Link NPC faction groups → power factions, in place. The scatter draws on the step's stream. */
function linkFactions(factions, power, rng) {
  const { pfList, powerFactionsByCategory, governingPF, pfAttractionMap, totalPower } = power;
  const pfLoadCount = new Map(pfList.map(f => [f.faction, 0]));

  factions.forEach(fg => {
    const cat = fg.dominantCategory || 'other';

    // 1. Direct category match
    const direct = powerFactionsByCategory[cat];
    if (direct) {
      fg.powerFactionName  = direct.faction;
      fg.powerFactionPower = direct.power;
      fg.powerFactionCat   = direct.category;
      pfLoadCount.set(direct.faction, (pfLoadCount.get(direct.faction) || 0) + 1);
      return;
    }

    // 2. Attraction profile match
    let bestMatch = null, bestPriority = 999;
    for (const { pf, profile } of pfAttractionMap) {
      const priority = profile.indexOf(cat);
      if (priority !== -1 && priority < bestPriority) {
        bestPriority = priority;
        bestMatch = pf;
      }
    }
    if (bestMatch && bestPriority < 2) {
      fg.powerFactionName  = bestMatch.faction;
      fg.powerFactionPower = bestMatch.power;
      fg.powerFactionCat   = bestMatch.category;
      pfLoadCount.set(bestMatch.faction, (pfLoadCount.get(bestMatch.faction) || 0) + 1);
      return;
    }

    // 3. Power-weighted scatter
    const roll = rng.random() * totalPower;
    let cumulative = 0;
    let scattered = governingPF;
    for (const pf of pfList) {
      cumulative += pf.power || 0;
      if (roll <= cumulative) { scattered = pf; break; }
    }
    // No power factions at all (empty powerStructure.factions ⇒ governingPF
    // undefined and the loop never runs): nothing to attribute this group to, so
    // leave it unassigned rather than dereferencing undefined and crashing the step.
    if (!scattered) return;
    fg.powerFactionName     = scattered.faction;
    fg.powerFactionPower    = scattered.power;
    fg.powerFactionCat      = scattered.category;
    fg.powerFactionFallback = true;
    pfLoadCount.set(scattered.faction, (pfLoadCount.get(scattered.faction) || 0) + 1);
  });

  return factions;
}

/**
 * THE ROOT HALF — the density band and the roster. Takes the step's own stream object.
 * @param {Object} ctx @param {Object} rng @param {?Record<string, unknown>} pins
 */
function drawPopulation(ctx, rng, pins) {
  const { tier, institutions, culture, effectiveConfig, generationContext, powerStructure, economicState } = ctx;
  return chooseOrPin(pins, 'npcs', () => {
    // ── ODQ §810 SEAM 1 (population): the tier-gated density law's MASS band.
    // Version-gated — a world whose own config carries no density-law marker gets
    // `null` here with no draw taken, and `generateNPCs` keeps its own roll.
    // The roster SIZING is deliberately NOT here: the power roster is replayed and
    // identity-asserted by `reconcilePowerStructure` at assembly, so it is resized
    // after that, in assembleSettlement.
    const densityMassTarget = rollNamedMass({
      tier,
      config: effectiveConfig,
      stress: ctx.stress,
      powerStructure,
      economicState,
      rng,
    });

    // generateNPCs reads settlement.powerStructure (noble roles) and
    // settlement.economicState (goal commodity/faction tokens). This step depends on
    // generatePower, so both are present on ctx — pass them through or those branches
    // silently fall back.
    return generateNPCs(
      { tier, institutions, powerStructure, economicState },
      culture,
      effectiveConfig,
      generationContext,
      densityMassTarget,
    );
  });
}

/**
 * THE DERIVE HALF — relationships, faction groups with their power linkage, and conflicts.
 * ⛔ It takes THE SAME `rng` OBJECT the root half took: these 67 draws (62 + 2 + 3) land on
 * the step's own stream, ambiently through `rngContext` and directly at the scatter.
 * @param {Object} ctx @param {Object} rng @param {?Record<string, unknown>} pins
 * @param {Array} npcs
 */
function derivePopulation(ctx, rng, pins, npcs) {
  const { tier, institutions, effectiveConfig, powerStructure } = ctx;

  const relationships = chooseOrPin(pins, 'relationships',
    () => generateRelationships(npcs, effectiveConfig, institutions));

  // The category index is built on EVERY path because the trace below reads it; the four
  // linkage-only lookups are built INSIDE the thunk, so a held `factions` key never builds
  // them. `powerLinkage` still evaluates BEFORE `generateFactions`, exactly as it did, so no
  // draw moves.
  const byCategory = powerFactionsByCategory(powerStructure?.factions || []);
  const factions = chooseOrPin(pins, 'factions', () => {
    const power = powerLinkage(powerStructure, byCategory);
    return linkFactions(generateFactions(npcs, relationships), power, rng);
  });

  const conflicts = chooseOrPin(pins, 'conflicts',
    () => generateConflicts(factions, relationships, effectiveConfig, institutions));

  // Summary traces — one per category, not one per entity. Per-entity
  // traces would flood the rail (50+ NPCs is normal at metropolis tier)
  // and the AI grounding pass does not need that level of detail.
  recordTrace(ctx, {
    targetType: 'npc',
    targetId: `npcs.summary`,
    step: 'generatePopulation',
    result: 'populated',
    causes: [{
      source: `tier.${tier}`,
      effect: `${npcs.length} npcs`,
      reason: `Population scaled from tier; institutions seeded named roles.`,
    }],
    downstreamEffects: [
      { target: 'relationships', effect: `${relationships.length} edges` },
      { target: 'factions',      effect: `${factions.length} npc faction groups` },
    ],
  });

  // Faction-linkage trace — the strategic decision is how NPC faction
  // groups attached to power factions (direct/attraction/scatter).
  const linkCounts = factions.reduce((acc, fg) => {
    const mode = fg.powerFactionFallback ? 'scatter'
               : byCategory[fg.dominantCategory || 'other'] ? 'direct'
               : 'attraction';
    acc[mode] = (acc[mode] || 0) + 1;
    return acc;
  }, {});
  if (factions.length) {
    recordTrace(ctx, {
      targetType: 'faction',
      targetId: 'factions.npcGroupLinkage',
      step: 'generatePopulation',
      result: 'linked',
      causes: [{
        source: 'powerStructure.factions',
        effect: `${factions.length} groups linked`,
        reason: `Direct=${linkCounts.direct || 0}, attraction=${linkCounts.attraction || 0}, power-weighted scatter=${linkCounts.scatter || 0}.`,
      }],
      downstreamEffects: [
        { target: 'conflicts', effect: `${conflicts.length} surfaced` },
      ],
    });
  }

  return { npcs, relationships, factions, conflicts };
}

registerStep('generatePopulation', {
  deps: ['coherenceRepairPass', 'powerEconomyReconcilePass'],
  reads: ['culture', 'economicState', 'effectiveConfig', 'generationContext', 'institutions', 'powerStructure', 'tier'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  readsVersion: { economicState: 'reconciled' },
  provides: ['npcs', 'relationships', 'factions', 'conflicts'],
  phase: 'population',
}, (ctx, rng) => {
  // The runner hands the pins through the context under its reserved key; absent pins mean
  // today's behaviour exactly, and the partial-pin refusal already fired in the runner.
  const pins = ctx.__pins || null;
  // ⛔ THE SAME `rng` OBJECT REACHES BOTH HALVES. No stream is minted in this file.
  const npcs = drawPopulation(ctx, rng, pins);
  return derivePopulation(ctx, rng, pins, npcs);
});

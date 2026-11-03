/**
 * Step 13: generatePopulation
 *
 * Generates NPCs and their relationships.
 *
 * ⭐ NO FACTION GROUPS AND NO CONFLICTS HERE ANY MORE (GS-2, ODQ §934.101). They were minted
 * here as tie-components with invented names, bound to power factions by a scatter draw, and
 * paired into conflicts on this stream. The power factions are the factions now, and an NPC's
 * power affiliation is decided later (the coherence tail's merge, the density dispersal and
 * the structural seats), so `assembleSettlement` derives both from the FINAL roster. Dropping
 * them takes the name-pick retry loop, the scatter and the conflict draws off this stream;
 * npcs and relationships draw first and do not move.
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
import { rollNamedMass } from '../density/applyDensityLaw.js';
import { recordTrace } from '../../domain/trace.js';

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
 * THE DERIVE HALF — relationships.
 * ⛔ It takes THE SAME `rng` OBJECT the root half took: the relationship draws land on the
 * step's own stream, ambiently through `rngContext`.
 * @param {Object} ctx @param {Object} rng @param {?Record<string, unknown>} pins
 * @param {Array} npcs
 */
function derivePopulation(ctx, rng, pins, npcs) {
  const { tier, institutions, effectiveConfig } = ctx;

  const relationships = chooseOrPin(pins, 'relationships',
    () => generateRelationships(npcs, effectiveConfig, institutions));

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
    ],
  });

  return { npcs, relationships };
}

registerStep('generatePopulation', {
  deps: ['coherenceRepairPass', 'powerEconomyReconcilePass'],
  reads: ['culture', 'economicState', 'effectiveConfig', 'generationContext', 'institutions', 'powerStructure', 'tier'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  readsVersion: { economicState: 'reconciled' },
  provides: ['npcs', 'relationships'],
  phase: 'population',
}, (ctx, rng) => {
  // The runner hands the pins through the context under its reserved key; absent pins mean
  // today's behaviour exactly, and the partial-pin refusal already fired in the runner.
  const pins = ctx.__pins || null;
  // ⛔ THE SAME `rng` OBJECT REACHES BOTH HALVES. No stream is minted in this file.
  const npcs = drawPopulation(ctx, rng, pins);
  return derivePopulation(ctx, rng, pins, npcs);
});

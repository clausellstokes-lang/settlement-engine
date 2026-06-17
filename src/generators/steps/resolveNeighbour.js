/**
 * Step 4: resolveNeighbour
 *
 * Extracts structured relationship data from the imported neighbour settlement.
 *
 * Neighbour-resolution step for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import {
  ECONOMY_MODE_MARKET_MULT,
  REL_DYNAMICS,
  extractNeighbourProfile,
  getNeighbourEconomicBias,
  getNeighbourFactionBias,
} from '../neighbourGenerator.js';
import { recordTrace } from '../../domain/trace.js';

// priorityHelpers' neighborMilMult/neighborEconMult move only for these
// relationship families (substring match, mirroring the reader); everything
// else — neutral, patron, client — multiplies both effective scores by
// exactly 1.0, so the receipt must not claim a score shift for them.
const SCORE_SHIFTING_RELTYPES = ['hostile', 'rival', 'cold_war', 'tense', 'allied', 'trade_partner'];

registerStep('resolveNeighbour', {
  deps: ['resolveConfig'],
  provides: ['neighbourProfile', 'neighbourEconBias', 'neighbourFacBias', 'rawNeighbour'],
  mutates: ['effectiveConfig'], // threads neighborRelationship onto effectiveConfig in place when a neighbour is bound (H14 / A+ P1.7)
  phase: 'config',
}, (ctx) => {
  const config = ctx.config || {};
  const importedNeighbor = ctx.importedNeighbour || null;

  const rawNeighbour = config._importedNeighbor || importedNeighbor || null;
  const relType = config._neighbourRelType || config.neighbourRelType || 'neutral';
  const neighbourProfile = rawNeighbour
    ? extractNeighbourProfile(rawNeighbour, relType)
    : null;
  const neighbourEconBias = getNeighbourEconomicBias(neighbourProfile);
  // Government-type bias was computed and plumbed here for years but no
  // generator ever read it — the receipt below claimed an influence that
  // never existed. The neighbour's real power-structure influence is the
  // faction mirroring done by the neighbourFactions step (neighbourFacBias).
  const neighbourFacBias  = getNeighbourFactionBias(neighbourProfile);

  // H14 (R3): config.neighborRelationship was read by getInstFlags (the
  // military/economy effective-score modifiers) and generateHistory (the
  // external-threat/trade-dispute tensions) but NEVER written — the
  // hostile-neighbour militarization path was dead on this half. Thread it
  // into effectiveConfig in place, the same way generateEconomy threads
  // _neighbourEconBias. No-neighbour generations leave the key absent, so
  // the default path is untouched (identity).
  if (rawNeighbour && ctx.effectiveConfig) {
    ctx.effectiveConfig.neighborRelationship = {
      neighborName: rawNeighbour.name || null,
      relationshipType: relType,
    };
  }

  // Only emit a trace when an actual neighbour was bound — a missing
  // neighbour is a non-decision and would just be noise in the rail.
  if (rawNeighbour && neighbourProfile) {
    // Honest receipts (triage wave): each claim below is gated on its
    // mechanism actually being non-identity for THIS relationship. A neutral
    // neighbour binds but shifts nothing — REL_DYNAMICS.neutral is
    // militaryBias 0 / economyMode 'independent' (market mult 1.0) and the
    // effective-score multipliers are exactly 1.0 — so its receipt must not
    // promise defense/market/score shifts that never happen.
    const dyn = neighbourProfile.dynamics || REL_DYNAMICS.neutral;
    const downstreamEffects = [];
    if (Object.keys(neighbourEconBias || {}).length > 0) {
      // Mirrors generateEconomy's threading gate (bias with no goods overlap
      // is an empty object and never reaches the economy).
      downstreamEffects.push({ target: 'economicState', effect: 'neighbour econ bias applied' });
    }
    if (neighbourFacBias) {
      // Mirrors neighbourFactions' gate; every REL_DYNAMICS row carries
      // non-zero mirror/oppose weights (even neutral rolls at 0.05).
      downstreamEffects.push({ target: 'factions', effect: 'neighbour faction bias applied' });
    }
    const shiftsDefense = (dyn.militaryBias || 0) > 0;
    const shiftsMarket = (ECONOMY_MODE_MARKET_MULT[dyn.economyMode] ?? 1.0) !== 1.0;
    if (shiftsDefense || shiftsMarket) {
      const axes = [shiftsDefense ? 'defense' : null, shiftsMarket ? 'market' : null].filter(Boolean).join('/');
      downstreamEffects.push({ target: 'institutions', effect: `relationship dynamics shift ${axes} odds` });
    }
    const relTypeLower = String(relType).toLowerCase();
    if (SCORE_SHIFTING_RELTYPES.some(k => relTypeLower.includes(k))) {
      downstreamEffects.push({ target: 'effectiveScores', effect: 'relationship modifies military/economy scores' });
    }
    if (downstreamEffects.length === 0) {
      downstreamEffects.push({ target: 'generation', effect: `no mechanical bias — ${relType} relationship dynamics are identity` });
    }
    recordTrace(ctx, {
      targetType: 'condition',
      targetId: `neighbour.${rawNeighbour.name || 'unnamed'}.${relType}`,
      step: 'resolveNeighbour',
      result: 'bound',
      causes: [{
        source: 'config._importedNeighbor',
        reason: `Linked to ${rawNeighbour.name || 'a previously generated settlement'} (tier ${rawNeighbour.tier}) as ${relType}.`,
      }],
      downstreamEffects,
    });
  }

  return { neighbourProfile, neighbourEconBias, neighbourFacBias, rawNeighbour };
});

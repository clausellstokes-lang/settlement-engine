/**
 * Step 11: neighbourFactions
 *
 * Injects mirror and opposition factions from neighbour influence.
 *
 * Neighbour-faction step for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import { getMirrorFactionLabel, getOpposeFactionLabel } from '../neighbourGenerator.js';
import { recordTrace } from '../../domain/trace.js';

// Mirror applyLegitimacyMultipliers' label bands (factionDynamics.js) — injected
// neighbour factions are added AFTER that pass runs (in generatePower), so they
// must self-label or PowerTab/PDF show a blank powerLabel + missing rawPower.
function powerLabelFor(power) {
  return power >= 35 ? 'Dominant'
       : power >= 25 ? 'Strong'
       : power >= 18 ? 'Significant'
       : power >= 10 ? 'Minor'
       : 'Suppressed';
}

registerStep('neighbourFactions', {
  deps: ['generatePower', 'resolveNeighbour'],
  reads: ['neighbourFacBias', 'neighbourProfile'], // ctx keys this step consumes that another step produces
  provides: [],
  mutates: ['powerStructure'], // mirrors neighbour-derived factions into powerStructure.factions in place when a neighbour is bound
  phase: 'power',
}, (ctx, rng) => {
  const { neighbourFacBias, neighbourProfile, powerStructure } = ctx;

  if (!neighbourFacBias || !powerStructure?.factions?.length) return {};

  const initialCount = powerStructure.factions.length;
  const existingTypes = new Set(
    powerStructure.factions.map(f => (f.category || f.type || '').toLowerCase())
  );
  const { mirrorFactions, opposeFactions, mirrorWeight, opposeWeight } = neighbourFacBias;
  const relType = neighbourProfile?.relationshipType || 'neutral';

  // Mirror factions
  for (const fType of mirrorFactions) {
    if (!existingTypes.has(fType) && rng.chance(mirrorWeight)) {
      const mirrorLabel = getMirrorFactionLabel(fType, relType, neighbourProfile?.name);
      if (mirrorLabel) {
        const power = rng.randInt(10, 30);
        powerStructure.factions.push({
          faction:       mirrorLabel,
          category:      fType,
          power,
          rawPower:      power,
          powerLabel:    powerLabelFor(power),
          desc:          `${mirrorLabel}. Presence from ${neighbourProfile.name} (${neighbourProfile.relationshipType.replace(/_/g,' ')}).`,
          source:        'neighbour_mirror',
          neighbourName: neighbourProfile.name,
          isGoverning:   false,
        });
        existingTypes.add(fType);
        recordTrace(ctx, {
          targetType: 'faction',
          targetId: `faction.${mirrorLabel}`,
          step: 'neighbourFactions',
          result: 'mirrored',
          causes: [{
            source: `neighbour.${neighbourProfile.name}`,
            effect: `${fType} influence`,
            reason: `Influence from ${neighbourProfile.name} (${relType.replace(/_/g, ' ')}) seeded a mirror ${fType} faction here.`,
          }],
          downstreamEffects: [
            { target: 'powerStructure.factions', effect: 'count +1' },
          ],
        });
      }
    }
  }

  // Oppose factions
  for (const fType of opposeFactions) {
    if (!existingTypes.has(fType) && rng.chance(opposeWeight)) {
      const opposeLabel = getOpposeFactionLabel(fType, relType, neighbourProfile?.name);
      if (opposeLabel) {
        const power = rng.randInt(8, 26);
        powerStructure.factions.push({
          faction:       opposeLabel,
          category:      fType,
          power,
          rawPower:      power,
          powerLabel:    powerLabelFor(power),
          desc:          `${opposeLabel}. Formed in reaction to ${neighbourProfile.name}'s influence.`,
          source:        'neighbour_opposition',
          neighbourName: neighbourProfile.name,
          isGoverning:   false,
        });
        recordTrace(ctx, {
          targetType: 'faction',
          targetId: `faction.${opposeLabel}`,
          step: 'neighbourFactions',
          result: 'opposed',
          causes: [{
            source: `neighbour.${neighbourProfile.name}`,
            effect: `${fType} reaction`,
            reason: `Resistance to ${neighbourProfile.name}'s influence (${relType.replace(/_/g, ' ')}) spawned an opposition ${fType} faction.`,
          }],
          downstreamEffects: [
            { target: 'powerStructure.factions', effect: 'count +1' },
            { target: 'conflicts',               effect: 'tension source' },
          ],
        });
      }
    }
  }

  // Re-sort by effective power so injected factions take their real rank rather
  // than always trailing the list (matches applyLegitimacyMultipliers' final order).
  if (powerStructure.factions.length > initialCount) {
    powerStructure.factions.sort((a, b) => (b.power || 0) - (a.power || 0));
  }

  return {};
});

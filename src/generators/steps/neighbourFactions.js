/**
 * Step 11: neighbourFactions
 *
 * Injects mirror and opposition factions from neighbour influence.
 *
 * Extracted from generateSettlement.js lines 804–849.
 */

import { registerStep } from '../pipeline.js';
import { getMirrorFactionLabel, getOpposeFactionLabel } from '../neighbourGenerator.js';
import { recordTrace } from '../../domain/trace.js';

registerStep('neighbourFactions', {
  deps: ['generatePower', 'resolveNeighbour'],
  provides: [],
  phase: 'power',
}, (ctx, rng) => {
  const { neighbourFacBias, neighbourProfile, powerStructure } = ctx;

  if (!neighbourFacBias || !powerStructure?.factions?.length) return {};

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
        powerStructure.factions.push({
          faction:       mirrorLabel,
          category:      fType,
          power:         rng.randInt(10, 30),
          desc:          `${mirrorLabel} — presence from ${neighbourProfile.name} (${neighbourProfile.relationshipType.replace(/_/g,' ')}).`,
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
        powerStructure.factions.push({
          faction:       opposeLabel,
          category:      fType,
          power:         rng.randInt(8, 26),
          desc:          `${opposeLabel} — formed in reaction to ${neighbourProfile.name}'s influence.`,
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

  return {};
});

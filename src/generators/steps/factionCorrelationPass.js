/**
 * Step 12: factionCorrelationPass
 *
 * Faction-institution correlation feedback loop + demand imports.
 * Also runs arcane institution strip for no-magic worlds.
 *
 * Faction correlation pass for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import { deriveFactionBoosts, applyFactionInstitutionBoosts } from '../factionCorrelation.js';
import { computeDemandImports } from '../demandProfile.js';
import { stripArcaneInstitutions } from '../isolationGenerator.js';
import { recordTrace } from '../../domain/trace.js';

function instId(name) {
  return `institution.${String(name).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase()}`;
}

registerStep('factionCorrelationPass', {
  deps: ['neighbourFactions', 'generateEconomy'],
  provides: [],
  phase: 'power',
}, (ctx) => {
  const {
    institutions, tier, effectiveConfig,
    institutionToggles, categoryToggles,
    powerStructure, economicState,
  } = ctx;

  // Demand imports — faction purchasing power + culture shapes imports
  const _hasMagicTrade = institutions.some(i => /teleport|airship|planar/i.test(i.name));
  if (effectiveConfig.tradeRouteAccess !== 'isolated' || _hasMagicTrade) {
    const demandImports = computeDemandImports(
      powerStructure?.factions || [],
      effectiveConfig.culture,
      economicState.activeChains || [],
      tier,
      economicState.primaryImports || []
    );
    if (demandImports.length > 0) {
      economicState.primaryImports = [
        ...(economicState.primaryImports || []),
        ...demandImports,
      ].slice(0, 10);
    }
  }

  // Faction-institution correlation loop
  const factionBoosts = deriveFactionBoosts(powerStructure?.factions || [], tier);
  if (factionBoosts.length > 0) {
    const boostAdditions = applyFactionInstitutionBoosts(
      factionBoosts, institutions, tier, effectiveConfig,
      institutionToggles, categoryToggles
    );
    if (boostAdditions.length > 0) {
      institutions.push(...boostAdditions);
      // Tier 2.1 — trace each faction-boost addition. The cause is the
      // dominant faction that pulled the institution into existence.
      // Powers the "why is this institution here?" answer when the
      // root cause is a sociopolitical fit rather than a base roll.
      for (const add of /** @type {Array<any>} */ (boostAdditions)) {
        const triggerFaction = add.boostedBy || add.factionTrigger ||
          (factionBoosts[0]?.faction?.faction || 'a dominant faction');
        recordTrace(ctx, {
          targetType: 'institution',
          targetId:   instId(add.name),
          step:       'factionCorrelationPass',
          result:     'faction_pulled',
          causes: [
            { source: `faction.${String(triggerFaction).toLowerCase().replace(/\s+/g, '_')}`,
              effect: 'pulled in',
              reason: `${triggerFaction} had enough power + the right archetype to demand "${add.name}" as an institutional ally.` },
          ],
        });
      }
    }
  }

  // Arcane institution safety-net — strips arcane institutions when
  // the world's magicExists flag is false.
  const beforeStrip = new Set(institutions.map(i => i.name));
  stripArcaneInstitutions(institutions, effectiveConfig);
  const afterStrip = new Set(institutions.map(i => i.name));
  for (const name of beforeStrip) {
    if (!afterStrip.has(name)) {
      recordTrace(ctx, {
        targetType: 'institution',
        targetId:   instId(name),
        step:       'factionCorrelationPass',
        result:     'arcane_stripped',
        causes: [
          { source: 'world.magicExists=false', effect: 'removed',
            reason: `"${name}" was an arcane institution; this world has magic disabled.` },
        ],
      });
    }
  }

  return {};
});

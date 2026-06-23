/**
 * Step 12: factionCorrelationPass
 *
 * Faction-institution correlation feedback loop. A dominant non-governing
 * faction can pull one signature institution onto the roster; the pull is
 * followed by the SAME subsumption + upgrade-ladder collapse the cascade
 * pass applies, so a faction can never seat a lesser alongside its greater.
 * Also runs the arcane institution strip for no-magic worlds.
 *
 * Ordering note: this pass genuinely needs powerStructure (faction
 * powers derive from the economy via generatePower), so it cannot run before
 * generateEconomy. Instead it records whether it changed the roster
 * (_rosterChangedAfterEconomy); economyReconcilePass then re-derives the
 * economy/services/spatial from the FINAL roster so faction-pulled
 * institutions join chains, income, and services. Demand imports moved to
 * economyReconcilePass for the same reason.
 */

import { registerStep } from '../pipeline.js';
import { deriveFactionBoosts, applyFactionInstitutionBoosts } from '../factionCorrelation.js';
import { stripArcaneInstitutions, cullPlanarWithoutCircle } from '../isolationGenerator.js';
import { applySubsumption } from './subsumptionPass.js';
import { collapseUpgradeChains } from './assembleInstitutions.js';
import { recordTrace } from '../../domain/trace.js';

function instId(name) {
  return `institution.${String(name).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase()}`;
}

registerStep('factionCorrelationPass', {
  deps: ['neighbourFactions', 'generateEconomy'],
  reads: ['categoryToggles', 'effectiveConfig', 'institutionToggles', 'institutions', 'powerStructure', 'tier'], // ctx keys this step consumes that another step produces
  provides: [],
  mutates: ['institutions'],                 // re-correlates roster vs factions in place
  scratch: ['_rosterChangedAfterEconomy'],   // internal flag for downstream steps
  phase: 'power',
}, (ctx) => {
  const {
    institutions, tier, effectiveConfig,
    institutionToggles, categoryToggles,
    powerStructure,
  } = ctx;

  // Snapshot so economyReconcilePass knows whether the economy (computed at
  // step 9 from the pre-pull roster) must be re-derived.
  const beforeRoster = institutions.map(i => i.name);

  // Faction-institution correlation loop
  const factionBoosts = deriveFactionBoosts(powerStructure?.factions || [], tier);
  if (factionBoosts.length > 0) {
    const boostAdditions = applyFactionInstitutionBoosts(
      factionBoosts, institutions, tier, effectiveConfig,
      institutionToggles, categoryToggles
    );
    if (boostAdditions.length > 0) {
      institutions.push(...boostAdditions);
      // Trace each faction-boost addition. The cause is the
      // dominant faction that pulled the institution into existence.
      // Powers the "why is this institution here?" answer when the
      // root cause is a sociopolitical fit rather than a base roll.
      for (const add of /** @type {Array<any>} */ (boostAdditions)) {
        const triggerFaction = add.boostedBy || add.factionTrigger ||
          add.factionSource ||
          (factionBoosts[0]?.factionName || 'a dominant faction');
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

      // Re-run subsumption on the expanded list — a faction pull must obey
      // the same redundancy rules as every other addition path (a faction
      // pulling "Mages' guild" absorbs an existing "Wizard's tower"; a pulled
      // lesser is absorbed by an existing greater). MUST go through the
      // shared guarded matcher.
      applySubsumption(institutions, ctx, {
        step: 'factionCorrelationPass', result: 'subsumed_after_faction_pull',
      });

      // A faction pull can seat a planar institution on a roster with no
      // teleportation circle — re-apply the same prerequisite cull
      // isolationPass ran.
      for (const removedName of cullPlanarWithoutCircle(institutions)) {
        recordTrace(ctx, {
          targetType: 'institution',
          targetId:   instId(removedName),
          step:       'factionCorrelationPass',
          result:     'requires_teleportation_circle',
          causes: [
            { source: instId('Teleportation circle'), effect: 'missing prerequisite',
              reason: `"${removedName}" trades with other planes through a permanent teleportation circle. No circle exists here, so the institution cannot operate.` },
          ],
        });
      }

      // ...and the UPGRADE_CHAINS ladder the assembly + cascade already
      // collapsed — without this a pull can re-list a lesser scale tier.
      for (const removedName of collapseUpgradeChains(institutions)) {
        recordTrace(ctx, {
          targetType: 'institution',
          targetId:   instId(removedName),
          step:       'factionCorrelationPass',
          result:     'upgrade_collapsed_after_faction_pull',
          causes: [
            { source: 'factionInstitutionBoost', effect: 'collapsed',
              reason: `"${removedName}" sits below an upgraded form already on the roster; the larger institution covers it.` },
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

  const afterRoster = institutions.map(i => i.name);
  const rosterChanged = beforeRoster.length !== afterRoster.length
    || beforeRoster.some((n, i) => n !== afterRoster[i]);

  return { _rosterChangedAfterEconomy: rosterChanged };
});

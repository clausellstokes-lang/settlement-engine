/**
 * Step 7: cascadePass
 *
 * Boosts chain-adjacent institutions after subsumption. Handles airship
 * overrides and re-runs subsumption on the expanded list.
 *
 * Cascade pass for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import { applyCascadeInstitutions } from '../cascadeGenerator.js';
import { applySubsumption } from './subsumptionPass.js';
import { collapseUpgradeChains } from './assembleInstitutions.js';
import { recordTrace } from '../../domain/trace.js';

function instId(name) {
  return `institution.${String(name).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase()}`;
}

registerStep('cascadePass', {
  deps: ['subsumptionPass'],
  reads: ['institutionToggles', 'institutions', 'terrainType', 'tier', 'tradeRoute'], // ctx keys this step consumes that another step produces
  provides: [],
  mutates: ['institutions'], // re-rolls/adds catalog entries on the roster in place
  phase: 'institutions',
}, (ctx, rng) => {
  // terrainType comes from resolveConfig — the cascade re-rolls catalog
  // entries, so it must honour the same geography gates as assemble.
  const { institutions, tier, tradeRoute, terrainType, institutionToggles } = ctx;

  // Snapshot the pre-cascade name set so we can identify what the
  // cascade added (and therefore needs traces explaining why).
  const preCascadeNames = new Set(institutions.map(i => (i.name || '').toLowerCase()));

  const cascadeAdditions = applyCascadeInstitutions(institutions, tier, { tradeRoute, terrainType, institutionToggles });
  if (cascadeAdditions.length > 0) {
    institutions.push(...cascadeAdditions);

    // Emit a trace per cascade addition. Cascade additions
    // are chain-adjacent institutions: "you got a smelter, so you also
    // got a charcoal burner." The cause is the existence of whichever
    // institution triggered the chain — we surface that as a coarse
    // "supply chain demand" cause rather than the specific trigger,
    // because the cascade rules in cascadeGenerator don't currently
    // surface which one fired.
    for (const add of cascadeAdditions) {
      recordTrace(ctx, {
        targetType: 'institution',
        targetId:   instId(add.name),
        step:       'cascadePass',
        result:     'cascaded',
        causes: [
          { source: 'supplyChainCascade',
            effect: 'added',
            reason: `"${add.name}" was pulled in by the cascade pass — a chain-adjacent institution already on the roster created demand for this one.` },
        ],
        downstreamEffects: Array.isArray(add.tags)
          ? add.tags.slice(0, 3).map(t => ({ target: `tag.${t}`, effect: 'reinforced' }))
          : [],
      });
    }

    // Re-run subsumption on the expanded list — emit "subsumed_after_cascade"
    // traces for anything the post-cascade dedup removes. MUST go through the
    // shared guarded matcher: the rules table is only safe under exact lesser
    // matching, self-exclusion, and required/forced/custom protection.
    applySubsumption(institutions, ctx, { step: 'cascadePass', result: 'subsumed_after_cascade' });

    // The cascade must also obey the UPGRADE_CHAINS ladder assembly already
    // collapsed — the cascade tables are chain-adjacency, not scale-aware, so
    // without this a cascade routinely re-adds the LESSER member of a ladder
    // (a city listing both "Town hall" and "City hall"). Runs BEFORE the
    // airship override below: the docks/warehouse pair in the ladder must not
    // eat the override's aerial docks.
    for (const removedName of collapseUpgradeChains(institutions)) {
      recordTrace(ctx, {
        targetType: 'institution',
        targetId:   instId(removedName),
        step:       'cascadePass',
        result:     'upgrade_collapsed_after_cascade',
        causes: [
          { source: 'supplyChainCascade', effect: 'collapsed',
            reason: `Cascade-added "${removedName}" sits below an upgraded form already on the roster; the larger institution covers it.` },
        ],
      });
    }
  }

  // Airship override: if airship docking exists, maritime institutions are
  // permitted regardless of trade route. Airship docking is rolled in main
  // generation — independent of whether the cascade added anything — so this
  // must NOT sit inside the cascade-additions guard. Docks and the harbour
  // master's office are complementary infrastructure, not a scale ladder; no
  // subsumption rule may collapse one into the other.
  const hasAirship = institutions.some(i =>
    (i.name || '').toLowerCase().includes('airship')
  );
  if (hasAirship && tradeRoute !== 'port' && tradeRoute !== 'river') {
    const MARITIME_INSTS = [
      { category: 'Economy', name: 'Docks/port facilities',
        desc: 'Airship-era dock facilities handling both aerial and surface freight.',
        tags: ['port','trade'], priorityCategory: 'economy', baseChance: 0.75 },
      { category: 'Economy', name: "Harbour master's office",
        desc: 'Regulates port and airship traffic, assigns berths, collects anchorage fees.',
        tags: ['law_enforcement','port'], priorityCategory: 'military', baseChance: 0.65 },
    ];
    const existingNames = new Set(institutions.map(i => i.name));
    MARITIME_INSTS.forEach(inst => {
      if (!existingNames.has(inst.name) && rng.chance(inst.baseChance)) {
        institutions.push({ ...inst, source: 'generated' });
        // Trace the airship-triggered maritime additions.
        recordTrace(ctx, {
          targetType: 'institution',
          targetId:   instId(inst.name),
          step:       'cascadePass',
          result:     'airship_triggered',
          causes: [
            { source: 'institution.airship', effect: 'enables maritime',
              reason: `Airship docking is on the roster, so "${inst.name}" is permitted even without a port/river trade route.` },
          ],
        });
      }
    });
  }

  // Silence unused — the pre-cascade snapshot is currently used only
  // by future delta-trace work (e.g. tagging which adds were genuinely
  // new vs upgrades). Kept here so a follow-up pass can use it without
  // re-snapshotting.
  void preCascadeNames;

  return {};
});

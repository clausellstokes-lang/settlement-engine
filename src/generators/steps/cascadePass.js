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
import { SUBSUMPTION_RULES } from './subsumptionPass.js';
import { recordTrace } from '../../domain/trace.js';

function instId(name) {
  return `institution.${String(name).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase()}`;
}

registerStep('cascadePass', {
  deps: ['subsumptionPass'],
  provides: [],
  phase: 'institutions',
}, (ctx, rng) => {
  // terrainType comes from resolveConfig — the cascade re-rolls catalog
  // entries, so it must honour the same geography gates as assemble.
  const { institutions, tier, tradeRoute, terrainType } = ctx;

  // Snapshot the pre-cascade name set so we can identify what the
  // cascade added (and therefore needs traces explaining why).
  const preCascadeNames = new Set(institutions.map(i => (i.name || '').toLowerCase()));

  const cascadeAdditions = applyCascadeInstitutions(institutions, tier, { tradeRoute, terrainType });
  if (cascadeAdditions.length > 0) {
    institutions.push(...cascadeAdditions);

    // Tier 2.1 — emit a trace per cascade addition. Cascade additions
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

    // Re-run subsumption on expanded list — emit "subsumed" traces for
    // anything the post-cascade dedup removes. Same shape as
    // subsumptionPass's primary emission.
    SUBSUMPTION_RULES.forEach(({ greater, lesser }) => {
      const names = institutions.map(i => i.name.toLowerCase());
      const hasGreater = names.some(n => n.includes(greater.toLowerCase()));
      if (!hasGreater) return;
      const toRemove = [];
      institutions.forEach((inst, idx) => {
        if (lesser.some(l => inst.name.toLowerCase().includes(l.toLowerCase())))
          toRemove.push(idx);
      });
      for (const idx of toRemove) {
        const inst = institutions[idx];
        if (inst) {
          recordTrace(ctx, {
            targetType: 'institution',
            targetId:   instId(inst.name),
            step:       'cascadePass',
            result:     'subsumed_after_cascade',
            causes: [
              { source: instId(greater), effect: 'absorbed',
                reason: `Cascade-added "${inst.name}" was immediately absorbed by larger "${greater}".` },
            ],
          });
        }
      }
      [...toRemove].sort((a, b) => b - a).forEach(idx => institutions.splice(idx, 1));
    });
  }

  // Airship override: if airship docking exists, maritime institutions are
  // permitted regardless of trade route. Airship docking is rolled in main
  // generation — independent of whether the cascade added anything — so this
  // must NOT sit inside the cascade-additions guard. It must also run AFTER
  // the post-cascade re-subsumption: the "harbour master's office" rule
  // absorbs 'docks/port facilities', and for an aerial port those are
  // complementary infrastructure, not a scale ladder.
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

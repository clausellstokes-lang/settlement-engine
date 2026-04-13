/**
 * Step 7: cascadePass
 *
 * Boosts chain-adjacent institutions after subsumption. Handles airship
 * overrides and re-runs subsumption on the expanded list.
 *
 * Extracted from generateSettlement.js lines 742–785.
 */

import { registerStep } from '../pipeline.js';
import { applyCascadeInstitutions } from '../cascadeGenerator.js';
import { SUBSUMPTION_RULES } from './subsumptionPass.js';

registerStep('cascadePass', {
  deps: ['subsumptionPass'],
  provides: [],
  phase: 'institutions',
}, (ctx, rng) => {
  const { institutions, tier, tradeRoute } = ctx;

  const cascadeAdditions = applyCascadeInstitutions(institutions, tier);
  if (cascadeAdditions.length > 0) {
    institutions.push(...cascadeAdditions);

    // Airship override: if airship docking exists, maritime institutions are permitted
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
        }
      });
    }

    // Re-run subsumption on expanded list
    SUBSUMPTION_RULES.forEach(({ greater, lesser }) => {
      const names = institutions.map(i => i.name.toLowerCase());
      const hasGreater = names.some(n => n.includes(greater.toLowerCase()));
      if (!hasGreater) return;
      const toRemove = [];
      institutions.forEach((inst, idx) => {
        if (lesser.some(l => inst.name.toLowerCase().includes(l.toLowerCase())))
          toRemove.push(idx);
      });
      [...toRemove].sort((a, b) => b - a).forEach(idx => institutions.splice(idx, 1));
    });
  }

  return {};
});

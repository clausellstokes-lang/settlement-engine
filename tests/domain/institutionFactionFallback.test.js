/**
 * institutionFactionFallback.test.js — [domain-top-3].
 *
 * IMPAIR/DESTROY_INSTITUTION propagate an impairment to linked factions, but
 * generated settlements NEVER write the explicit controls/funds/staffs/protects
 * link lists — so the designed second link of the cascade ("the granary burned →
 * the controlling merchant faction suffers") was a silent no-op on every generated
 * settlement. The fix implements the documented fallback: a faction whose canonical
 * archetype matches an unlinked institution's category takes a low default
 * impairment. Explicit link lists still win; unmappable categories never fire it.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { propagateImpairment } from '../../src/domain/entities/propagate.js';

const gen = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });
const factionsOf = (s) => s.powerStructure?.factions || s.factions || [];
const instId = (i) => i?.id || i?.name || '';
const impairedFactions = (s) => factionsOf(s).filter((f) => (f.impairments || []).length > 0);

function destroy(s, inst) {
  return propagateImpairment({
    settlement: s,
    origin: { entityType: 'institution', entityId: instId(inst), impairment: { type: 'capacity', severity: 0.9, causeEventId: 'evt.destroy', description: 'razed' } },
  });
}

describe('[domain-top-3] institution→faction impairment fires on generated settlements', () => {
  test('generated factions carry NO explicit institution link lists (the fallback is what must fire)', () => {
    const s = gen({ settType: 'city', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' }, 'dt3-links');
    const anyExplicit = factionsOf(s).some((f) =>
      (f.controlsInstitutionIds || f.fundsInstitutionIds || f.staffsInstitutionIds || f.protectsInstitutionIds || []).length > 0);
    expect(anyExplicit).toBe(false);
  });

  test('destroying a category-mappable institution lands at least one faction impairment', () => {
    const s = gen({ settType: 'city', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' }, 'dt3-hit');
    // Government/Religious/Defense/Criminal/Magic/Crafts/Economy all map to a faction archetype.
    const inst = (s.institutions || []).find((i) => ['Government', 'Religious', 'Defense', 'Criminal', 'Magic'].includes(i.category));
    expect(inst, 'settlement should have a mappable institution').toBeTruthy();
    const after = destroy(s, inst);
    expect(impairedFactions(after).length).toBeGreaterThan(0);
  });

  test('destroying an UNMAPPABLE-category institution impairs no faction via the fallback', () => {
    const s = gen({ settType: 'city', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' }, 'dt3-neg');
    const inst = (s.institutions || []).find((i) => ['Entertainment', 'Adventuring', 'Infrastructure', 'Exotic'].includes(i.category));
    if (!inst) return; // vacuously fine if none present this seed
    const after = destroy(s, inst);
    expect(impairedFactions(after).length).toBe(0);
  });
});

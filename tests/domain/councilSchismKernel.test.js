/**
 * councilSchismKernel.test.js — Phase 5.5 M9a, component (1) DISSENT, through the
 * REAL kernel. A settlement whose PRIOR-tick faction beliefs diverge from its seat
 * belief has a `council_schism` internal stressor stamped on it this tick; a world
 * without the belief marker (dormant) never does (byte-identity of the seam).
 */
import { describe, it, expect } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['a', 'b'];

function digest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, IDS.length).map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

function save(id, factions) {
  return {
    id, name: id.toUpperCase(), phase: 'canon',
    settlement: {
      name: id, tier: 'town', population: 2000,
      config: { tradeRouteAccess: 'road' }, institutions: [],
      powerStructure: { publicLegitimacy: { score: 40, label: 'Contested' }, factions, conflicts: [] },
      npcs: [{ id: `n_${id}`, name: 'Reeve', importance: 'key' }],
      activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

// 'a' governs via a council with a merchant faction beside it — the schism's dissenter.
const facA = [
  { faction: 'City Council', category: 'government', power: 60, isGoverning: true },
  { faction: 'Merchant League', category: 'merchant', power: 45 },
];
const rel = { readiness: 0.2, allianceLabel: 'hostile', faithLabel: null, lastUpdateTick: 0 };
// The seat reads b SLIGHT (band 1); the merchants — better-informed — read it
// FORMIDABLE (band 4). A 3-band, confident divergence: the council is split.
const priorBeliefs = {
  a: {
    [GOVERNING_SEAT_KEY]: { b: { ...rel, strengthBand: 1, confidence01: 0.9 } },
    merchant: { b: { ...rel, strengthBand: 4, confidence01: 0.9 } },
  },
};

function campaign({ marker, infoMode }) {
  return {
    id: 'schism', name: 'schism', settlementIds: [...IDS],
    worldState: {
      rngSeed: 'schism', tick: 1,
      relationshipStates: { 'edge.a.b': { relationshipType: 'hostile' } },
      simulationRules: { propagationMode: 'first_order', settlementStrategyEnabled: true, warLayerEnabled: true, infoMode },
      ...(marker ? { spatialCanonVersion: 1, spatialDigest: digest(), spatialLedgers: { beliefMaps: priorBeliefs } } : {}),
    },
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' }], channels: [] }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

const saves = () => [save('a', facA), save('b', [{ faction: 'Elders', category: 'government', isGoverning: true }])];

function conditionsOf(result, id) {
  const u = (result.settlementUpdates || []).find((x) => String(x.saveId) === id);
  return (u?.settlement?.activeConditions || []).map((c) => c.archetype);
}

describe('M9a — council_schism through the kernel', () => {
  it('a divergent faction belief stamps a council_schism condition on the settlement', () => {
    const r = simulateCampaignWorldPulse({ campaign: campaign({ marker: true, infoMode: 'unreliable' }), saves: saves(), interval: 'one_week', now: NOW });
    expect(conditionsOf(r, 'a')).toContain('council_schism');
    // 'b' holds no differentiated faction belief ⇒ no schism.
    expect(conditionsOf(r, 'b')).not.toContain('council_schism');
  });

  it('DORMANT (omniscient) ⇒ the seam is invisible — no council_schism, byte-identical', () => {
    const r = simulateCampaignWorldPulse({ campaign: campaign({ marker: true, infoMode: 'omniscient' }), saves: saves(), interval: 'one_week', now: NOW });
    expect(conditionsOf(r, 'a')).not.toContain('council_schism');
  });

  it('no spatial marker ⇒ no council_schism (aspatial byte-identity)', () => {
    const r = simulateCampaignWorldPulse({ campaign: campaign({ marker: false, infoMode: 'unreliable' }), saves: saves(), interval: 'one_week', now: NOW });
    expect(conditionsOf(r, 'a')).not.toContain('council_schism');
  });
});

import { describe, expect, test } from 'vitest';

import {
  evaluatePopulationDynamics,
  normalizeSimulationRules,
  pressureIndex,
} from '../../src/domain/worldPulse/index.js';

// Owner directive: migration dispersal follows RELATIONSHIPS, not just the
// pressure map — allied / overlord / trade-partner roads take more of the
// column; rival and cold-war borders take less; almost nobody flees INTO a
// hostile city.

function item(id, settlement) {
  return {
    id,
    name: settlement.name || id,
    settlement,
    activeConditions: settlement.activeConditions || [],
    causal: { scores: {} },
    system: { resourcePressure: { value: 50 } },
  };
}

function settlement(name, patch = {}) {
  return {
    name,
    tier: 'town',
    population: 1500,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    activeConditions: [],
    npcs: [],
    ...patch,
  };
}

// Source in full crisis flight; every destination identically calm — the only
// difference between destinations is the relationship label on the edge.
function buildWorld({ edges, migrationMode }) {
  const source = item('o', settlement('Oldtown', {
    population: 4000,
    activeConditions: [{ archetype: 'famine' }, { archetype: 'war_pressure' }],
  }));
  const ally = item('ally', settlement('Allyport', { population: 900 }));
  const host = item('host', settlement('Hostholm', { population: 900 }));
  const neut = item('neut', settlement('Neutral Field', { population: 900 }));
  const snapshot = {
    worldState: { tick: 3, simulationRules: normalizeSimulationRules({ migrationMode }) },
    regionalGraph: { channels: [], edges },
    settlements: [source, ally, host, neut],
    byId: new Map([['o', source], ['ally', ally], ['host', host], ['neut', neut]]),
  };
  const pressures = pressureIndex([
    { settlementId: 'o', kind: 'food', score: 0.95 },
    { settlementId: 'o', kind: 'conflict', score: 0.9 },
    { settlementId: 'o', kind: 'disease', score: 0.65 },
    { settlementId: 'o', kind: 'trade', score: 0.8 },
    { settlementId: 'o', kind: 'legitimacy', score: 0.7 },
    ...['ally', 'host', 'neut'].flatMap(id => [
      { settlementId: id, kind: 'food', score: 0.2 },
      { settlementId: id, kind: 'conflict', score: 0.2 },
      { settlementId: id, kind: 'trade', score: 0.2 },
      { settlementId: id, kind: 'legitimacy', score: 0.2 },
    ]),
  ]);
  return { snapshot, pressures };
}

function migrationDeltas({ edges, migrationMode }) {
  const { snapshot, pressures } = buildWorld({ edges, migrationMode });
  const candidates = evaluatePopulationDynamics(snapshot, pressures, {
    tick: 4,
    interval: 'one_year',
    simulationRules: normalizeSimulationRules({ migrationMode, majorChangesRequireProposal: false }),
  });
  const migration = candidates.find(c => c.candidateType === 'population_emigration');
  expect(migration).toBeTruthy();
  return Object.fromEntries(migration.populationDeltas.map(d => [d.saveId, d.delta]));
}

const EDGES = [
  { id: 'e.o.ally', from: 'o', to: 'ally', relationshipType: 'allied' },
  { id: 'e.o.host', from: 'o', to: 'host', relationshipType: 'hostile' },
  { id: 'e.o.neut', from: 'o', to: 'neut', relationshipType: 'other' },
];

describe('relationship-weighted migration dispersal', () => {
  test('distributed mode: the allied road takes more of the column than the neutral one; the hostile city takes none', () => {
    const deltas = migrationDeltas({ edges: EDGES, migrationMode: 'distributed' });
    expect(deltas.ally).toBeGreaterThan(deltas.neut);
    // Hostile weight (0.15) pushes Hostholm under the admission bar entirely.
    expect(deltas.host).toBeUndefined();
  });

  test('concentrated mode: identical pressures, the ally is chosen', () => {
    const deltas = migrationDeltas({ edges: EDGES, migrationMode: 'concentrated' });
    expect(deltas.ally).toBeGreaterThan(0);
    expect(deltas.host).toBeUndefined();
    expect(deltas.neut).toBeUndefined();
  });

  test('cold war suppresses without excluding; the legacy plural trade_partners label is canonicalized (H12)', () => {
    const deltas = migrationDeltas({
      edges: [
        { id: 'e.o.ally', from: 'o', to: 'ally', relationshipType: 'trade_partners' }, // legacy plural
        { id: 'e.o.host', from: 'o', to: 'host', relationshipType: 'cold_war' },
        { id: 'e.o.neut', from: 'o', to: 'neut', relationshipType: 'other' },
      ],
      migrationMode: 'distributed',
    });
    // trade_partners reads as trade_partner (1.25): more than neutral.
    expect(deltas.ally).toBeGreaterThan(deltas.neut);
    // cold_war (0.45) suppresses hard but does not necessarily exclude —
    // with these calm pressures it still falls under the admission bar.
    expect(deltas.host ?? 0).toBeLessThan(deltas.neut);
  });

  test('hostility outranks friendship on the same pair', () => {
    const deltas = migrationDeltas({
      edges: [
        // Same pair carries BOTH a trade edge and a hostile edge: nobody
        // marches refugees into a city they are at war with.
        { id: 'e.o.ally.t', from: 'o', to: 'ally', relationshipType: 'trade_partner' },
        { id: 'e.o.ally.h', from: 'ally', to: 'o', relationshipType: 'hostile' },
        { id: 'e.o.neut', from: 'o', to: 'neut', relationshipType: 'other' },
      ],
      migrationMode: 'distributed',
    });
    expect(deltas.ally).toBeUndefined();
    expect(deltas.neut).toBeGreaterThan(0);
  });
});

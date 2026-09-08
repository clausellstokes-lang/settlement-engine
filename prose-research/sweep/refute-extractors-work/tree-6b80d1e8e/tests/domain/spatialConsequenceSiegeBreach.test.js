/**
 * spatialConsequenceSiegeBreach.test.js — DOOR 1 consumer (b), the PRODUCER side: a
 * relieved siege stamps a deterministic wall-breach (wallSegmentId + districtId) INTO
 * the siege_lifted cause, gated on the flag + a substrate. Dark ⇒ the cause is
 * byte-identical to the pre-door-1 shape.
 *
 * (The fabric READER side — the scar lifting that cause into a precise scar — is pinned
 * in tests/domain/spatialConsequenceKernel.test.js.)
 */
import { describe, it, expect } from 'vitest';
import { deploymentReturnOutcomes } from '../../src/domain/worldPulse/deploymentReturn.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { deriveSpatialSubstrate } from '../../src/domain/spatial/spatialSubstrate.js';

function walledHome() {
  return {
    _seed: 'breach-home-1', name: 'Home', tier: 'city', population: 9000,
    config: { tradeRouteAccess: 'road', terrainType: 'plains' },
    defenseProfile: { hasWalls: true, fortificationLevel: 'walled' },
    spatialLayout: { quarters: [
      { name: 'Temple Ward', location: 'central', category: 'religious' },
      { name: 'Merchant Row', location: 'east', category: 'merchant' },
      { name: 'The Tanneries', location: 'south', category: 'industrial' },
      { name: 'Shadow Docks', location: 'west', category: 'criminal' },
    ] },
    institutions: [{ name: 'Town Hall', required: true, category: 'civic' }],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { publicLegitimacy: { score: 55 }, factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }], conflicts: [] },
    npcs: [], activeConditions: [],
  };
}
const save = (id, name, settlement) => ({ id, name, phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const STRONG_DEP = { maxStartStrength: 60, currentEffectiveStrength: 60, targetId: 'foe', sinceTick: 1, role: 'siege' };
// A confirmed war_front FROM 'foe' INTO 'home' makes isBesieged('home') true.
const BESIEGED_GRAPH = { channels: [{ type: 'war_front', status: 'confirmed', from: 'foe', to: 'home' }] };

function relief({ lit }) {
  const home = walledHome();
  const saves = [save('home', 'Home', home), save('foe', 'Foe', { name: 'Foe', tier: 'town', population: 3000, config: {}, institutions: [], economicState: {}, powerStructure: { factions: [] }, npcs: [], activeConditions: [] })];
  const campaign = {
    id: 'breach', name: 'breach', settlementIds: ['home', 'foe'],
    worldState: { rngSeed: 'breach', tick: 5, simulationRules: {} },
    regionalGraph: ensureRegionalGraph({ edges: [] }),
    wizardNews: { currentTick: 5, entries: [] },
  };
  const snap = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
  const worldState = lit
    ? { simulationRules: { spatialConsequenceEnabled: true }, spatialLedgers: { spatialSubstrate: { home: deriveSpatialSubstrate(buildTownMapModel(home, null)) } } }
    : null;
  return deploymentReturnOutcomes({
    resolvedDeployments: [{ attackerId: 'home', deployment: STRONG_DEP, targetId: 'foe', outcome: 'conquest' }],
    snapshot: snap,
    graph: BESIEGED_GRAPH,
    rng: createPRNG('c'), // seed 'c' rolls inside the strong-army relief success band
    tick: 5,
    worldState,
  });
}
const siegeLiftedCause = (out) => out.find((o) => o.candidateType === 'siege_lifted')?.condition?.causes?.[0];

describe('DOOR 1 consumer (b) producer — the relieved siege stamps a wall breach', () => {
  it('LIT + substrate ⇒ the siege_lifted cause carries a deterministic wallSegmentId + districtId', () => {
    const cause = siegeLiftedCause(relief({ lit: true }));
    expect(cause, 'a siege_lifted outcome must be produced (isBesieged + strong relief)').toBeTruthy();
    expect(typeof cause.wallSegmentId).toBe('number');
    expect(cause.wallSegmentId).toBeGreaterThanOrEqual(0);
    expect('districtId' in cause).toBe(true);
    // Deterministic — a re-run stamps the identical breach.
    expect(siegeLiftedCause(relief({ lit: true }))).toEqual(cause);
  });

  it('DARK ⇒ the cause has NO wallSegmentId/districtId (byte-identical to pre-door-1)', () => {
    const cause = siegeLiftedCause(relief({ lit: false }));
    expect(cause).toBeTruthy();
    expect('wallSegmentId' in cause).toBe(false);
    expect('districtId' in cause).toBe(false);
    // Exactly the legacy cause shape.
    expect(Object.keys(cause).sort()).toEqual(['effect', 'reason', 'source']);
  });
});

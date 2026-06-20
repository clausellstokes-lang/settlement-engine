import { describe, expect, test } from 'vitest';

import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

// ─────────────────────────────────────────────────────────────────────────────
// Phase B1 — the HARD GATE, end to end through the war layer:
//   • a thorpe besieging a fortified city deterministically does NOT win — across
//     MANY seeds, no siege victory, no power transfer. RNG never gets the chance.
//   • a PLAUSIBLE matchup still goes to RNG (the gate doesn't break real sieges).
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name, tier: patch.tier || 'town', population: patch.population || 5000,
    config: { tradeRouteAccess: 'road' }, institutions: patch.institutions || [],
    economicState: patch.economicState || { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 75, label: 'Stable' },
      factions: patch.factions || [{ faction: 'Council', category: 'civic', power: 50, isGoverning: true }],
      conflicts: [],
    },
    npcs: [], activeConditions: patch.activeConditions || [],
  };
}
function save(id, name, patch = {}) {
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

// A bare thorpe — tiny, no walls, no garrison, fragile.
function thorpe(id, name) {
  return save(id, name, { tier: 'thorpe', population: 40, legitimacy: 55,
    factions: [{ faction: 'Elders', category: 'civic', power: 20, isGoverning: true }] });
}
// A fortified, legitimate, well-found city — citadel, walls, garrison, armory.
function fortifiedCity(id, name) {
  return save(id, name, {
    tier: 'city', population: 80000, legitimacy: 88,
    institutions: [{ name: 'Great Citadel' }, { name: 'City Garrison' }, { name: 'Royal Armory' }, { name: 'War College' }],
    economicState: { prosperity: 'Prosperous', primaryExports: [{ name: 'Siege Engines' }, { name: 'Forged Weapons' }, { name: 'Plate Armor' }], primaryImports: [], foodSecurity: { storageMonths: 9, resilienceScore: 85 } },
    factions: [{ faction: 'High Command', category: 'military', power: 96, isGoverning: true }],
  });
}

function snapFor(saves, { deployments = {}, channels = [] } = {}) {
  const worldState = {
    rngSeed: 'gate', tick: 4,
    relationshipStates: { 'edge.x.y': { relationshipType: 'hostile' } },
    deployments, simulationRules: { warLayerEnabled: true },
  };
  const campaign = {
    id: 'gate', settlementIds: saves.map(s => s.id), worldState,
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.x.y', from: saves[0].id, to: saves[1].id, relationshipType: 'hostile' }],
      channels,
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
  return buildWorldSnapshot({ campaign, saves, worldState });
}

describe('hard gate — a thorpe cannot storm a fortified city on a lucky roll', () => {
  test('across 60 seeds, a thorpe besieging a fortified city NEVER produces a conquest', () => {
    const saves = [thorpe('tiny', 'Mudfen'), fortifiedCity('big', 'Highwall')];
    // The thorpe already has a committed army + a war_front (a pre-existing siege) —
    // the most generous setup for it. The hard gate must STILL forbid a victory.
    const channels = [{ type: 'war_front', from: 'tiny', to: 'big', status: 'confirmed' }];
    const deployments = { tiny: { targetId: 'big', sinceTick: 1, role: 'siege' } };

    let everConquered = false;
    for (let seed = 0; seed < 60; seed += 1) {
      const snap = snapFor(saves, { deployments: { ...deployments }, channels });
      const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG(`seed-${seed}`), tick: 5 + seed, now: NOW, rules: { warLayerEnabled: true } });
      if (war.outcomes.some(o => o.candidateType === 'conquest')) everConquered = true;
    }
    expect(everConquered).toBe(false); // the gate held across every seed.
  });

  test('a thorpe at a war-ready posture still cannot OPEN a siege on the city (deploy gate blocks it)', () => {
    const saves = [thorpe('tiny', 'Mudfen'), fortifiedCity('big', 'Highwall')];
    const snap = snapFor(saves, {}); // no pre-existing siege
    // Force the thorpe war-ready so ONLY the feasibility gate can stop the deploy.
    snap.worldState.warPosture = { tiny: { state: 'mobilized', progress: 1, sinceTick: 0 } };
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('open'), tick: 6, now: NOW, rules: { warLayerEnabled: true } });
    // No front minted, no deployment opened against the city.
    expect(war.deployments.tiny).toBeUndefined();
    expect(war.graphChannels.some(c => c.type === 'war_front' && c.from === 'tiny')).toBe(false);
  });

  test('a PLAUSIBLE matchup (a peer city) DOES go to RNG and can resolve — the gate does not break real sieges', () => {
    const saves = [fortifiedCity('alpha', 'Alpha'), fortifiedCity('beta', 'Beta')];
    const channels = [{ type: 'war_front', from: 'alpha', to: 'beta', status: 'confirmed' }];
    const deployments = { alpha: { targetId: 'beta', sinceTick: 1, role: 'siege' } };
    // Across enough seeds a peer siege resolves at least once (it reached the RNG).
    let everConquered = false;
    for (let seed = 0; seed < 40 && !everConquered; seed += 1) {
      const snap = snapFor(saves, { deployments: { ...deployments }, channels });
      const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG(`peer-${seed}`), tick: 5 + seed, now: NOW, rules: { warLayerEnabled: true } });
      if (war.outcomes.some(o => o.candidateType === 'conquest')) everConquered = true;
    }
    expect(everConquered).toBe(true); // a real contest reaches and passes the roll.
  });
});

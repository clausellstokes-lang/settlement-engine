/**
 * occupationConversion.test.js — the conquest → religious-conversion coupling.
 *
 * A conquered settlement tends to adopt its occupier's faith ("the creed follows
 * the garrison"). The pull:
 *   - rises under occupation vs a peacetime carrier alone,
 *   - scales with the SIZE of the occupying force (occupier military capacity),
 *   - is amplified when the occupier's deity is WARBOUND (warlike temperament),
 *   - is COUNTERED by an incumbent faith of opposed nature (full force only against a
 *     warlike or adjacent creed; a peaceful / alignment-opposed faith digs in).
 *
 * Determinism-safe: each trial forks a fresh PRNG per tick; we count how often the
 * occupier wins C's faith across a tick sweep and compare scenario counts.
 */
import { describe, expect, test } from 'vitest';

import { evaluateReligiousContest } from '../../src/domain/worldPulse/religiousContest.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';
const TICKS = 60;

function deity(name, { rank = 'major', alignment = 'neutral', temper = 'neutral' } = {}) {
  return { _deityRef: `custom:lu_${name.toLowerCase()}`, name, alignmentAxis: alignment, temperamentAxis: temper, rankAxis: rank };
}

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population ?? 3500,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: patch.priorityMilitary ?? 40,
      ...(patch.deity ? { primaryDeityRef: patch.deity._deityRef, primaryDeitySnapshot: patch.deity } : {}),
    },
    institutions: patch.institutions || [],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 55, label: 'Stable' },
      factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [], activeConditions: patch.activeConditions || [],
  };
}
const save = (id, name, patch = {}) => ({ id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

// Count how often occupier A wins the faith of city C across a tick sweep. A always
// reaches C via an allied carrier, so the contest runs in BOTH cases; occupation
// only ADDS its force-scaled pull on top.
function occupierWins({ occupierDeity, incumbentDeity, occupied, occupierTier = 'city', occupierPop = 26000, resistance = 0.1 }) {
  const saves = [
    save('aocc', 'Aocc', { deity: occupierDeity, tier: occupierTier, population: occupierPop, priorityMilitary: 80 }),
    save('ccity', 'Ccity', { deity: incumbentDeity, tier: 'town', population: 3000, legitimacy: 28 }),
  ];
  const worldState = {
    rngSeed: 'occ', tick: 1, simulationRules: { religionDynamicsEnabled: true },
    ...(occupied ? { occupations: { ccity: { occupierId: 'aocc', state: 'vassalized', sinceTick: 1, stateHeld: 4, resistance, benefitYield: 0.3, lastTick: 1 } } } : {}),
  };
  const campaign = {
    id: 'occ', name: 'occ', settlementIds: ['aocc', 'ccity'], worldState,
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.aocc.ccity', from: 'aocc', to: 'ccity', relationshipType: 'allied' }] }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  let wins = 0, occCause = 0;
  for (let t = 1; t <= TICKS; t++) {
    const snap = buildWorldSnapshot({ campaign, saves, worldState });
    const res = evaluateReligiousContest({ snapshot: snap, worldState, rng: createPRNG(`occ-${t}`), tick: t, now: NOW, rules: { religionDynamicsEnabled: true } });
    for (const o of res.outcomes) {
      if (String(o.targetSaveId) === 'ccity' && o.deityReembed?.fromSettlementId === 'aocc') {
        wins++;
        if (o.metadata?.conversionCause === 'occupation') occCause++;
      }
    }
  }
  return { wins, occCause };
}

describe('conquest → conversion coupling', () => {
  const warlikeEvil = deity('Korl', { rank: 'major', alignment: 'evil', temper: 'warlike' });

  test('occupation increases the occupier’s conversion of the conquered city', () => {
    const incumbent = deity('Faded', { rank: 'cult', alignment: 'neutral', temper: 'neutral' });
    const free = occupierWins({ occupierDeity: warlikeEvil, incumbentDeity: incumbent, occupied: false });
    const held = occupierWins({ occupierDeity: warlikeEvil, incumbentDeity: incumbent, occupied: true });
    expect(held.wins).toBeGreaterThan(free.wins);
    expect(held.occCause).toBeGreaterThan(0);            // attributed to occupation
    expect(free.occCause).toBe(0);                        // none attributed when not occupied
  });

  test('a larger occupying force converts more readily than a small one', () => {
    const incumbent = deity('Faded', { rank: 'cult' });
    const big = occupierWins({ occupierDeity: warlikeEvil, incumbentDeity: incumbent, occupied: true, occupierTier: 'metropolis', occupierPop: 80000 });
    const small = occupierWins({ occupierDeity: warlikeEvil, incumbentDeity: incumbent, occupied: true, occupierTier: 'village', occupierPop: 300 });
    expect(big.wins).toBeGreaterThanOrEqual(small.wins);
  });

  test('a warbound (warlike) occupier deity converts more than a peaceful one', () => {
    const incumbent = deity('Mild', { rank: 'minor', alignment: 'neutral', temper: 'neutral' }); // adjacent → full force
    const warbound = occupierWins({ occupierDeity: deity('Var', { rank: 'major', alignment: 'neutral', temper: 'warlike' }), incumbentDeity: incumbent, occupied: true });
    const peaceful = occupierWins({ occupierDeity: deity('Calm', { rank: 'major', alignment: 'neutral', temper: 'peaceful' }), incumbentDeity: incumbent, occupied: true });
    expect(warbound.wins).toBeGreaterThanOrEqual(peaceful.wins);
  });

  test('an opposed incumbent faith counters the conversion (full force only vs warlike/adjacent)', () => {
    // Same warbound occupier; adjacent (warlike) incumbent vs opposed (peaceful good) incumbent.
    const adjacent = occupierWins({ occupierDeity: warlikeEvil, incumbentDeity: deity('Brand', { rank: 'minor', alignment: 'evil', temper: 'warlike' }), occupied: true });
    const opposed = occupierWins({ occupierDeity: warlikeEvil, incumbentDeity: deity('Lumen', { rank: 'minor', alignment: 'good', temper: 'peaceful' }), occupied: true });
    expect(adjacent.wins).toBeGreaterThanOrEqual(opposed.wins);
  });
});

import { describe, expect, test } from 'vitest';

import {
  evaluateRelationshipRules,
  pressureIndex,
} from '../../src/domain/worldPulse/index.js';

function item(id, patch = {}) {
  return {
    id,
    name: patch.name || id,
    settlement: {
      name: patch.name || id,
      tier: patch.tier || 'town',
      population: patch.population || 2000,
    },
    activeConditions: [],
    causal: { scores: patch.scores || {} },
  };
}

function pressureRows(ids, patch = {}) {
  return ids.flatMap(id => {
    const p = {
      food: 0.1,
      disease: 0.1,
      conflict: 0.1,
      hostility: 0,
      trade: 0.1,
      legitimacy: 0.1,
      crime: 0.1,
      economy: 0.1,
      defense: 0.1,
      ...(patch[id] || {}),
    };
    return Object.entries(p).map(([kind, score]) => ({ settlementId: id, kind, score }));
  });
}

function snapshot({ edges, states, channels = [], items = {} }) {
  const ids = new Set(edges.flatMap(edge => [edge.from, edge.to]));
  for (const channel of channels) {
    ids.add(channel.from);
    ids.add(channel.to);
  }
  const byId = new Map([...ids].map(id => [id, items[id] || item(id)]));
  return {
    worldState: { tick: 8, relationshipStates: states || {}, stressors: [] },
    regionalGraph: { edges, channels },
    byId,
  };
}

describe('relationship dynamics rulebook', () => {
  test('vassals support overlord cold wars in the background', () => {
    const snap = snapshot({
      edges: [
        { id: 'edge.o.v', from: 'o', to: 'v', relationshipType: 'vassal' },
        { id: 'edge.o.c', from: 'o', to: 'c', relationshipType: 'cold_war' },
      ],
      states: {
        'edge.o.v': { relationshipType: 'vassal', dependency: 0.8, leverage: 0.75, pactStrength: 0.55, resentment: 0.32 },
        'edge.o.c': { relationshipType: 'cold_war', resentment: 0.78, fear: 0.62 },
      },
    });

    const candidates = evaluateRelationshipRules(snap, pressureIndex(pressureRows(['o', 'v', 'c'])), { tick: 9 });
    const support = candidates.find(c => c.ruleId === 'vassal_cold_war_support');

    expect(support).toBeTruthy();
    expect(support.metadata).toMatchObject({ overlordSaveId: 'o', vassalSaveId: 'v', thirdPartyId: 'c' });
  });

  test('weak overlords accumulate independence pressure in strong vassals', () => {
    const snap = snapshot({
      edges: [{ id: 'edge.o.v', from: 'o', to: 'v', relationshipType: 'vassal' }],
      states: {
        'edge.o.v': {
          relationshipType: 'vassal',
          trust: 0.22,
          resentment: 0.56,
          dependency: 0.72,
          leverage: 0.64,
          overlordWeaknessStreak: 3,
        },
      },
      items: {
        o: item('o', { tier: 'town', population: 1200 }),
        v: item('v', { tier: 'city', population: 9000 }),
      },
    });

    const candidates = evaluateRelationshipRules(snap, pressureIndex(pressureRows(['o', 'v'], {
      o: { conflict: 0.85, legitimacy: 0.9, defense: 0.88, economy: 0.82 },
      v: { conflict: 0.18, legitimacy: 0.28, defense: 0.2, economy: 0.2 },
    })), { tick: 9 });

    expect(candidates.some(c => c.ruleId === 'vassal_overlord_weakness_memory')).toBe(true);
    expect(candidates.some(c => c.candidateType === 'vassal_rebellion')).toBe(true);
  });

  test('cold wars can squeeze exposed supply relationships through sanctions', () => {
    const snap = snapshot({
      edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'cold_war' }],
      states: {
        'edge.a.b': { relationshipType: 'cold_war', resentment: 0.72, fear: 0.6, tradeBalance: 0.18, leverage: 0.48 },
      },
      channels: [{ id: 'ch.trade.a.b', type: 'trade_dependency', from: 'a', to: 'b', status: 'confirmed', strength: 0.76 }],
    });

    const candidates = evaluateRelationshipRules(snap, pressureIndex(pressureRows(['a', 'b'], {
      a: { trade: 0.52 },
      b: { trade: 0.58 },
    })), { tick: 9 });

    expect(candidates.some(c => c.ruleId === 'cold_war_supply_sanctions')).toBe(true);
  });

  test('allies support cold wars but hesitate against their own trade partners', () => {
    const snap = snapshot({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'cold_war' },
        { id: 'edge.a.c', from: 'a', to: 'c', relationshipType: 'trade_partner' },
      ],
      states: {
        'edge.a.b': { relationshipType: 'allied', trust: 0.78, pactStrength: 0.78, resentment: 0.08 },
        'edge.b.c': { relationshipType: 'cold_war', resentment: 0.76, fear: 0.62 },
        'edge.a.c': { relationshipType: 'trade_partner', trust: 0.7 },
      },
    });

    const candidates = evaluateRelationshipRules(snap, pressureIndex(pressureRows(['a', 'b', 'c'])), { tick: 9 });
    const support = candidates.find(c => c.ruleId === 'allied_cold_war_support');

    expect(support).toBeTruthy();
    expect(support.metadata.hesitation).toBeLessThan(1);
  });

  test('patronage forms only from stronger settlements after sustained trade dependence', () => {
    const pressures = pressureIndex(pressureRows(['p', 'c'], {
      p: { economy: 0.12, defense: 0.16 },
      c: { economy: 0.82, defense: 0.66 },
    }));

    const eligible = evaluateRelationshipRules(snapshot({
      edges: [{ id: 'edge.p.c', from: 'p', to: 'c', relationshipType: 'trade_partner' }],
      states: { 'edge.p.c': { relationshipType: 'trade_partner', trust: 0.62, leverage: 0.55, dependency: 0.62, tradeBalance: 0.68 } },
      items: {
        p: item('p', { tier: 'city', population: 12000 }),
        c: item('c', { tier: 'village', population: 600 }),
      },
    }), pressures, { tick: 9 });

    const ineligible = evaluateRelationshipRules(snapshot({
      edges: [{ id: 'edge.c.p', from: 'c', to: 'p', relationshipType: 'trade_partner' }],
      states: { 'edge.c.p': { relationshipType: 'trade_partner', trust: 0.62, leverage: 0.55, dependency: 0.62, tradeBalance: 0.68 } },
      items: {
        p: item('p', { tier: 'city', population: 12000 }),
        c: item('c', { tier: 'village', population: 600 }),
      },
    }), pressures, { tick: 9 });

    expect(eligible.some(c => c.ruleId === 'trade_to_patron_client')).toBe(true);
    expect(ineligible.some(c => c.ruleId === 'trade_to_patron_client')).toBe(false);
  });

  test('patronage can mature into alliance when the patron economy is exposed through the client', () => {
    const snap = snapshot({
      edges: [{ id: 'edge.p.c', from: 'p', to: 'c', relationshipType: 'patron' }],
      states: {
        'edge.p.c': { relationshipType: 'patron', trust: 0.48, dependency: 0.74, pactStrength: 0.44, resentment: 0.22 },
      },
    });

    const candidates = evaluateRelationshipRules(snap, pressureIndex(pressureRows(['p', 'c'], {
      p: { economy: 0.58, trade: 0.52 },
      c: { conflict: 0.72, trade: 0.62 },
    })), { tick: 9 });

    expect(candidates.some(c => c.ruleId === 'patron_to_allied_interest_protection')).toBe(true);
  });

  test('rivals escalate when one side gains enough confidence and power', () => {
    const snap = snapshot({
      edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' }],
      states: { 'edge.a.b': { relationshipType: 'rival', resentment: 0.68, fear: 0.2, trust: 0.18 } },
      items: {
        a: item('a', { tier: 'metropolis', population: 50000 }),
        b: item('b', { tier: 'village', population: 700 }),
      },
    });

    const candidates = evaluateRelationshipRules(snap, pressureIndex(pressureRows(['a', 'b'], {
      a: { economy: 0.06, defense: 0.08, legitimacy: 0.12 },
      b: { economy: 0.78, defense: 0.74, legitimacy: 0.7 },
    })), { tick: 9 });

    expect(candidates.some(c => c.ruleId === 'rival_power_play')).toBe(true);
  });

  test('hostility can de-escalate to cold war when attrition is too high', () => {
    const snap = snapshot({
      edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' }],
      states: { 'edge.a.b': { relationshipType: 'hostile', resentment: 0.64, fear: 0.62, trust: 0.12, militaryBurden: 0.7 } },
    });

    const candidates = evaluateRelationshipRules(snap, pressureIndex(pressureRows(['a', 'b'], {
      a: { economy: 0.8, defense: 0.75, legitimacy: 0.72 },
    })), { tick: 9 });

    expect(candidates.some(c => c.ruleId === 'hostile_attrition_deescalation')).toBe(true);
  });

  test('protector backing can block otherwise plausible subjugation into vassalage', () => {
    const basePressures = pressureIndex(pressureRows(['o', 'v', 'p'], {
      o: { economy: 0.08, defense: 0.08, conflict: 0.12 },
      v: { economy: 0.9, defense: 0.9, conflict: 0.88 },
      p: { economy: 0.08, defense: 0.08, conflict: 0.08 },
    }));

    const noProtector = evaluateRelationshipRules(snapshot({
      edges: [{ id: 'edge.o.v', from: 'o', to: 'v', relationshipType: 'hostile' }],
      states: { 'edge.o.v': { relationshipType: 'hostile', resentment: 0.9, fear: 0.82, leverage: 0.7 } },
      items: {
        o: item('o', { tier: 'city', population: 18000 }),
        v: item('v', { tier: 'village', population: 500 }),
      },
    }), basePressures, { tick: 9 });

    const withProtector = evaluateRelationshipRules(snapshot({
      edges: [
        { id: 'edge.o.v', from: 'o', to: 'v', relationshipType: 'hostile' },
        { id: 'edge.p.v', from: 'p', to: 'v', relationshipType: 'vassal' },
        { id: 'edge.p.o', from: 'p', to: 'o', relationshipType: 'cold_war' },
      ],
      states: {
        'edge.o.v': { relationshipType: 'hostile', resentment: 0.9, fear: 0.82, leverage: 0.7 },
        'edge.p.v': { relationshipType: 'vassal', pactStrength: 0.86, leverage: 0.86, trust: 0.64 },
        'edge.p.o': { relationshipType: 'cold_war', resentment: 0.76 },
      },
      items: {
        o: item('o', { tier: 'city', population: 18000 }),
        v: item('v', { tier: 'village', population: 500 }),
        p: item('p', { tier: 'metropolis', population: 80000 }),
      },
    }), basePressures, { tick: 9 });

    expect(noProtector.some(c => c.ruleId === 'hostile_occupation_pressure')).toBe(true);
    expect(withProtector.some(c => c.ruleId === 'hostile_occupation_pressure')).toBe(false);
  });
});

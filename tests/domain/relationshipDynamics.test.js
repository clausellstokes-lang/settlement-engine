import { describe, expect, test } from 'vitest';

import {
  applyRelationshipPatch,
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

  // Reconciled with H16 (R3 decided): patronage forms from the STRONGER side
  // regardless of which side the save authored at 'from'. The old pin asserted
  // the reversed-authored edge produced NO candidate — that was the authoring
  // artifact itself. Now both orientations produce the candidate and BOTH name
  // the strong city as patron; what stays pinned is that a pair with no
  // stronger side produces nothing.
  test('patronage forms only from the stronger side, regardless of edge authoring order', () => {
    const pressures = pressureIndex(pressureRows(['p', 'c'], {
      p: { economy: 0.12, defense: 0.16 },
      c: { economy: 0.82, defense: 0.66 },
    }));
    const states = key => ({ [key]: { relationshipType: 'trade_partner', trust: 0.62, leverage: 0.55, dependency: 0.62, tradeBalance: 0.68 } });
    const items = {
      p: item('p', { tier: 'city', population: 12000 }),
      c: item('c', { tier: 'village', population: 600 }),
    };

    const forward = evaluateRelationshipRules(snapshot({
      edges: [{ id: 'edge.p.c', from: 'p', to: 'c', relationshipType: 'trade_partner' }],
      states: states('edge.p.c'),
      items,
    }), pressures, { tick: 9 });

    const reversed = evaluateRelationshipRules(snapshot({
      edges: [{ id: 'edge.c.p', from: 'c', to: 'p', relationshipType: 'trade_partner' }],
      states: states('edge.c.p'),
      items,
    }), pressures, { tick: 9 });

    const forwardPatronage = forward.find(c => c.ruleId === 'trade_to_patron_client');
    const reversedPatronage = reversed.find(c => c.ruleId === 'trade_to_patron_client');
    expect(forwardPatronage).toBeTruthy();
    expect(reversedPatronage).toBeTruthy();
    for (const candidate of [forwardPatronage, reversedPatronage]) {
      expect(candidate.relationshipPatch).toMatchObject({ patronSaveId: 'p', clientSaveId: 'c' });
      expect(candidate.targetSaveId).toBe('c');
    }

    // No stronger side -> no patronage, whichever way it is authored.
    const peers = evaluateRelationshipRules(snapshot({
      edges: [{ id: 'edge.p.c', from: 'p', to: 'c', relationshipType: 'trade_partner' }],
      states: states('edge.p.c'),
      items: { p: item('p'), c: item('c') },
    }), pressures, { tick: 9 });
    expect(peers.some(c => c.ruleId === 'trade_to_patron_client')).toBe(false);
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

  // H16 pin: a hostile pair where the STRONGER settlement sits at 'to' can
  // still subjugate — edge orientation is an authoring artifact for symmetric
  // types; the consequence follows the state.
  test('the stronger settlement subjugates even when the save authored it at to', () => {
    const pressures = pressureIndex(pressureRows(['v', 'o'], {
      o: { economy: 0.08, defense: 0.08, conflict: 0.12 },
      v: { economy: 0.9, defense: 0.9, conflict: 0.88 },
    }));
    const items = {
      o: item('o', { tier: 'city', population: 18000 }),
      v: item('v', { tier: 'village', population: 500 }),
    };

    const candidates = evaluateRelationshipRules(snapshot({
      edges: [{ id: 'edge.v.o', from: 'v', to: 'o', relationshipType: 'hostile' }],
      states: { 'edge.v.o': { relationshipType: 'hostile', resentment: 0.9, fear: 0.82, leverage: 0.7 } },
      items,
    }), pressures, { tick: 9 });

    const subjugation = candidates.find(c => c.ruleId === 'hostile_occupation_pressure');
    expect(subjugation).toBeTruthy();
    expect(subjugation.proposalPayload).toMatchObject({ kind: 'relationship_label_change', toType: 'vassal' });
    expect(subjugation.relationshipPatch).toMatchObject({ overlordSaveId: 'o', vassalSaveId: 'v' });
    expect(subjugation.metadata).toMatchObject({ overlordSaveId: 'o', vassalSaveId: 'v' });
    expect(subjugation.targetSaveId).toBe('v');

    // Same world, forward authoring: identical consequence.
    const forward = evaluateRelationshipRules(snapshot({
      edges: [{ id: 'edge.o.v', from: 'o', to: 'v', relationshipType: 'hostile' }],
      states: { 'edge.o.v': { relationshipType: 'hostile', resentment: 0.9, fear: 0.82, leverage: 0.7 } },
      items,
    }), pressures, { tick: 9 });
    const forwardSubjugation = forward.find(c => c.ruleId === 'hostile_occupation_pressure');
    expect(forwardSubjugation.relationshipPatch).toMatchObject({ overlordSaveId: 'o', vassalSaveId: 'v' });
    expect(forwardSubjugation.targetSaveId).toBe('v');
  });

  // H16 pin: raids hit both directions across ticks on a symmetric war —
  // seeded, deterministic, and independent of edge authoring order.
  test('a symmetric war raids in both directions across ticks, deterministically', () => {
    const pressures = pressureIndex(pressureRows(['a', 'b'], {
      a: { conflict: 0.7 },
      b: { conflict: 0.7 },
    }));
    const run = (edge) => Array.from({ length: 10 }, (_, i) => {
      const candidates = evaluateRelationshipRules(snapshot({
        edges: [edge],
        states: { [edge.id]: { relationshipType: 'hostile', resentment: 0.78, fear: 0.72 } },
      }), pressures, { tick: i + 1 });
      return candidates.find(c => c.ruleId === 'hostile_raid').metadata.aggressorSaveId;
    });

    const aggressors = run({ id: 'edge.war', from: 'a', to: 'b', relationshipType: 'hostile' });
    expect(new Set(aggressors)).toEqual(new Set(['a', 'b']));
    // Deterministic replay.
    expect(run({ id: 'edge.war', from: 'a', to: 'b', relationshipType: 'hostile' })).toEqual(aggressors);
    // Reversed authoring: identical aggressor per tick (composes with the R4
    // saves-order-independence pin).
    expect(run({ id: 'edge.war', from: 'b', to: 'a', relationshipType: 'hostile' })).toEqual(aggressors);
  });

  // H16 pin: asymmetric types stay strictly directional — a DM-authored vassal
  // edge keeps from = overlord even when the vassal side is stronger.
  test('an asymmetric vassal edge keeps strict direction without a state stamp', () => {
    const candidates = evaluateRelationshipRules(snapshot({
      edges: [{ id: 'edge.o.v', from: 'o', to: 'v', relationshipType: 'vassal' }],
      states: { 'edge.o.v': { relationshipType: 'vassal', dependency: 0.7, leverage: 0.66 } },
      items: {
        o: item('o', { tier: 'village', population: 700 }),
        v: item('v', { tier: 'city', population: 16000 }),
      },
    }), pressureIndex(pressureRows(['o', 'v'])), { tick: 9 });

    const extraction = candidates.find(c => c.candidateType === 'vassal_tribute_extraction');
    expect(extraction).toBeTruthy();
    expect(extraction.targetSaveId).toBe('v');
    expect(extraction.metadata).toMatchObject({ overlordSaveId: 'o', vassalSaveId: 'v' });
  });

  // H16 pin: reversed edge authoring produces identical directional
  // consequences for tribute (dominant side extracts) and alliance burden
  // (the side carrying the cost takes the condition).
  test('tribute and alliance burden land on the same settlements under reversed authoring', () => {
    const hostilePressures = pressureIndex(pressureRows(['a', 'b'], {
      a: { economy: 0.7 },
      b: { economy: 0.2 },
    }));
    const tributeFor = (edge) => evaluateRelationshipRules(snapshot({
      edges: [edge],
      states: { [edge.id]: { relationshipType: 'hostile', resentment: 0.7, fear: 0.6, leverage: 0.6 } },
    }), hostilePressures, { tick: 9 }).find(c => c.ruleId === 'hostile_forced_tribute');

    for (const edge of [
      { id: 'edge.pair', from: 'a', to: 'b', relationshipType: 'hostile' },
      { id: 'edge.pair', from: 'b', to: 'a', relationshipType: 'hostile' },
    ]) {
      const tribute = tributeFor(edge);
      expect(tribute).toBeTruthy();
      // 'b' carries the healthier economy (lower economic pressure): it extracts.
      expect(tribute.metadata).toMatchObject({ extractorSaveId: 'b', victimSaveId: 'a' });
      expect(tribute.targetSaveId).toBe('a');
    }

    const alliedPressures = pressureIndex(pressureRows(['a', 'b'], {
      a: { conflict: 0.2 },
      b: { food: 0.84, disease: 0.6, conflict: 0.7 },
    }));
    const burdenFor = (edge) => evaluateRelationshipRules(snapshot({
      edges: [edge],
      states: { [edge.id]: { relationshipType: 'allied', trust: 0.74, pactStrength: 0.7 } },
    }), alliedPressures, { tick: 9 }).find(c => c.ruleId === 'allied_aid_buffer');

    for (const edge of [
      { id: 'edge.ally', from: 'a', to: 'b', relationshipType: 'allied' },
      { id: 'edge.ally', from: 'b', to: 'a', relationshipType: 'allied' },
    ]) {
      const burden = burdenFor(edge);
      expect(burden).toBeTruthy();
      // 'a' is the quiet partner supporting distressed 'b': it carries the cost.
      expect(burden.targetSaveId).toBe('a');
      expect(burden.condition).toMatchObject({ archetype: 'alliance_burden', relatedSettlementId: 'b' });
      expect(burden.metadata).toMatchObject({ supporterSaveId: 'a', supportedSaveId: 'b' });
    }
  });

  // H16 pin (R3 must-fix): patronRules resolves patron/client from the STATE
  // stamps like vassalRules — both authoring orientations of the same
  // semantic world (patron 'p' strained, client 'c' calm) produce IDENTICAL
  // rule outcomes. Pre-fix, the reversed edge simulated with the sides
  // swapped: the patron's own strain fired patron_intervenes/patron_overreach
  // and patron_forces_alignment went dead.
  test('patron rules fire identically for both authoring orientations of the same world', () => {
    const pressures = pressureIndex(pressureRows(['p', 'c'], {
      p: { conflict: 0.7, food: 0.6, trade: 0.6, legitimacy: 0.6, economy: 0.5 },
    }));
    const state = {
      relationshipType: 'patron', trust: 0.3, resentment: 0.5, dependency: 0.7,
      leverage: 0.5, tradeBalance: 0.5, pactStrength: 0.2,
      patronSaveId: 'p', clientSaveId: 'c',
    };
    const outcomesFor = (edge) => evaluateRelationshipRules(snapshot({
      edges: [edge],
      states: { [edge.id]: { ...state } },
    }), pressures, { tick: 9 })
      .map(({ ruleId, targetSaveId, severity, probability, relationshipPatch }) =>
        ({ ruleId, targetSaveId, severity, probability, relationshipPatch }))
      .sort((a, b) => a.ruleId.localeCompare(b.ruleId));

    const forward = outcomesFor({ id: 'edge.pair', from: 'p', to: 'c', relationshipType: 'patron' });
    const reversed = outcomesFor({ id: 'edge.pair', from: 'c', to: 'p', relationshipType: 'patron' });
    const forwardRuleIds = forward.map(c => c.ruleId);
    // The strained patron forces alignment; the calm client triggers neither
    // intervention nor overreach.
    expect(forwardRuleIds).toContain('patron_forces_alignment');
    expect(forwardRuleIds).not.toContain('patron_intervenes');
    expect(forwardRuleIds).not.toContain('patron_overreach');
    expect(reversed).toEqual(forward);
    // Every patron-family outcome lands on the patron side regardless of authoring.
    for (const c of forward.filter(o => o.ruleId.startsWith('patron'))) {
      expect(c.targetSaveId).toBe('p');
    }
  });

  // H16 pin: a label change OUT of vassal/patron clears all four seniority
  // stamps — a later re-subjugation can never inherit a stale senior side.
  test('leaving vassalage or patronage nulls the seniority stamps', () => {
    const worldState = {
      tick: 12,
      relationshipStates: {
        'edge.pair': {
          relationshipType: 'vassal',
          overlordSaveId: 'o', vassalSaveId: 'v',
          patronSaveId: 'o', clientSaveId: 'v',
        },
      },
    };
    const next = applyRelationshipPatch(worldState, {
      id: 'outcome.rebellion',
      relationshipKey: 'edge.pair',
      relationshipPatch: { trajectory: 'rupturing' },
      proposalPayload: { kind: 'relationship_label_change', fromType: 'vassal', toType: 'rival', reason: 'rebellion' },
    }, '2026-06-11T00:00:00.000Z');

    expect(next.relationshipStates['edge.pair']).toMatchObject({
      relationshipType: 'rival',
      overlordSaveId: null,
      vassalSaveId: null,
      patronSaveId: null,
      clientSaveId: null,
    });

    // …while the subjugation that MINTS the stamps still lands them.
    const stamped = applyRelationshipPatch(worldState, {
      id: 'outcome.subjugation',
      relationshipKey: 'edge.pair',
      relationshipPatch: { overlordSaveId: 'v', vassalSaveId: 'o' },
      proposalPayload: { kind: 'relationship_label_change', fromType: 'hostile', toType: 'vassal', reason: 'occupation' },
    }, '2026-06-11T00:00:00.000Z');
    expect(stamped.relationshipStates['edge.pair']).toMatchObject({
      relationshipType: 'vassal',
      overlordSaveId: 'v',
      vassalSaveId: 'o',
      // vassalage carries no patron stamps.
      patronSaveId: null,
      clientSaveId: null,
    });
  });
});

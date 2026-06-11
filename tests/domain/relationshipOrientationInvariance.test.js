/**
 * tests/domain/relationshipOrientationInvariance.test.js — the class-wide
 * orientation pin (regional triage wave, completing R3/H16).
 *
 * For SYMMETRIC relationship types the from/to orientation of an edge is a
 * pure authoring artifact (save iteration order). R3 made raids, subjugation,
 * patronage, tribute, and alliance burden act on STATE; the adversarial
 * verifier then swept 400 random worlds per type and found the residual
 * direction-locked rules (hostile_attrition_deescalation,
 * allied_conflict_obligation, cold_war_supply_sanctions) plus a long tail of
 * attribution-only flips (cold_war_espionage 400/400, rival_arms_race
 * 394/400). This file is the pin that keeps the whole class dead: a seeded
 * sweep over randomized worlds asserts that EVERY symmetric type produces
 * IDENTICAL candidate sets whichever side the save authored at 'from' —
 * severities, targets, prose, conditions, and all.
 *
 * The only fields allowed to differ are metadata.fromSaveId/toSaveId, which
 * by design record the edge's authored orientation; the comparison folds them
 * into a sorted pair. Asymmetric types (vassal, patron) are pinned the other
 * way: an unstamped DM-authored edge keeps STRICT edge direction, so
 * reversing the authoring reverses the outcome.
 */
import { describe, expect, test } from 'vitest';

import {
  evaluateRelationshipRules,
  pressureIndex,
} from '../../src/domain/worldPulse/index.js';
import { createPRNG } from '../../src/generators/prng.js';

const SYMMETRIC_TYPES = ['neutral', 'trade_partner', 'allied', 'rival', 'cold_war', 'hostile', 'criminal_network'];
const PRESSURE_KINDS = ['food', 'disease', 'conflict', 'hostility', 'trade', 'legitimacy', 'crime', 'economy', 'defense'];
const TIERS = ['village', 'town', 'city', 'metropolis'];
const THIRD_PARTY_TYPES = ['cold_war', 'hostile', 'trade_partner', 'allied', 'vassal'];
const WORLDS_PER_TYPE = 60;

// Quantized 0..0.9 — exact ties happen regularly, exercising every
// sorted-pair tiebreak alongside the strict-inequality paths.
const q = (rng) => Math.round(rng.random() * 9) / 10;

function item(id, rng) {
  const tier = rng.pick(TIERS);
  const population = rng.randInt(300, 40000);
  return {
    id,
    name: id,
    settlement: { name: id, tier, population },
    activeConditions: [],
    causal: { scores: {} },
  };
}

function relStateFor(type, rng) {
  return {
    relationshipType: type,
    trust: q(rng),
    resentment: q(rng),
    dependency: q(rng),
    leverage: q(rng),
    fear: q(rng),
    tradeBalance: q(rng),
    militaryBurden: q(rng),
    aidBurden: q(rng),
    obligationFatigue: q(rng),
    pactStrength: q(rng),
  };
}

/**
 * One seeded semantic world: the pair under test ('aa'/'bb'), randomized
 * pressures and relationship state, an optional confirmed supply channel
 * (exercising the sanctions gate), and an optional third settlement 'cc'
 * whose edges exercise shared-enemy, ally cold-war support, and protector
 * backing — everything that scans the graph around the flipped edge.
 */
function worldFor(type, seed) {
  const rng = createPRNG(seed);
  const ids = ['aa', 'bb'];
  const byId = new Map(ids.map(id => [id, item(id, rng)]));
  const pressurePatch = {};
  for (const id of ids) pressurePatch[id] = Object.fromEntries(PRESSURE_KINDS.map(kind => [kind, q(rng)]));

  const channels = [];
  if (rng.chance(0.5)) {
    channels.push({ id: 'ch.pair', type: 'trade_dependency', from: 'aa', to: 'bb', status: 'confirmed', strength: q(rng) });
  }

  const extraEdges = [];
  const extraStates = {};
  if (rng.chance(0.6)) {
    byId.set('cc', item('cc', rng));
    pressurePatch.cc = Object.fromEntries(PRESSURE_KINDS.map(kind => [kind, q(rng)]));
    for (const target of ids) {
      if (!rng.chance(0.75)) continue;
      const thirdType = rng.pick(THIRD_PARTY_TYPES);
      const key = `edge.cc.${target}`;
      extraEdges.push({ id: key, from: 'cc', to: target, relationshipType: thirdType });
      extraStates[key] = relStateFor(thirdType, rng);
    }
  }

  const rows = Object.entries(pressurePatch).flatMap(([id, kinds]) =>
    Object.entries(kinds).map(([kind, score]) => ({ settlementId: id, kind, score })));

  return {
    tick: rng.randInt(1, 40),
    state: relStateFor(type, rng),
    extraEdges,
    extraStates,
    channels,
    byId,
    pressures: pressureIndex(rows),
  };
}

function evaluateOrientation(type, world, reversed) {
  const [from, to] = reversed ? ['bb', 'aa'] : ['aa', 'bb'];
  // Same edge id in both orientations: candidate ids, relationship keys, and
  // conflict tags are directly comparable, so any residual difference is a
  // real semantic divergence, not an id artifact.
  const edge = { id: 'edge.pair', from, to, relationshipType: type };
  const snapshot = {
    worldState: {
      tick: world.tick,
      relationshipStates: { 'edge.pair': { ...world.state }, ...world.extraStates },
      stressors: [],
    },
    regionalGraph: { edges: [edge, ...world.extraEdges], channels: world.channels },
    byId: world.byId,
  };
  return evaluateRelationshipRules(snapshot, world.pressures, { tick: world.tick });
}

// metadata.fromSaveId/toSaveId record the authored orientation by design —
// fold them into a sorted pair; EVERYTHING else must match exactly.
function normalized(candidates) {
  return candidates
    .map((candidate) => {
      const { fromSaveId, toSaveId, ...metadata } = candidate.metadata || {};
      return { ...candidate, metadata, authoredPair: [String(fromSaveId), String(toSaveId)].sort() };
    })
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

// Anti-vacuity: the sweep must actually reach the rules the verifier caught —
// a sweep that never fires the fixed gates would pin nothing.
const MUST_FIRE = {
  neutral: ['neutral_border_incident', 'neutral_to_rival'],
  trade_partner: ['trade_route_disruption', 'trade_smuggling_pressure'],
  allied: ['allied_conflict_obligation', 'allied_aid_buffer', 'allied_cold_war_support'],
  rival: ['rival_arms_race', 'rival_sabotage', 'rival_power_play'],
  cold_war: ['cold_war_espionage', 'cold_war_supply_sanctions', 'cold_war_proxy_conflict'],
  hostile: ['hostile_raid', 'hostile_attrition_deescalation', 'hostile_forced_tribute'],
  criminal_network: ['criminal_smuggling_expands', 'criminal_protection_racket'],
};

describe('relationship rule orientation invariance (class-wide pin)', () => {
  for (const type of SYMMETRIC_TYPES) {
    test(`${type}: A->B and B->A authoring yield identical candidate sets across ${WORLDS_PER_TYPE} seeded worlds`, () => {
      const fired = new Set();
      let total = 0;
      for (let i = 0; i < WORLDS_PER_TYPE; i += 1) {
        const world = worldFor(type, `orientation.${type}.${i}`);
        const forward = evaluateOrientation(type, world, false);
        const reversed = evaluateOrientation(type, world, true);
        expect(normalized(reversed)).toEqual(normalized(forward));
        total += forward.length;
        for (const candidate of forward) fired.add(candidate.ruleId);
      }
      expect(total).toBeGreaterThan(WORLDS_PER_TYPE);
      for (const ruleId of MUST_FIRE[type]) {
        expect([...fired]).toContain(ruleId);
      }
    });
  }

  // Asymmetric types are the CONTROL: a DM-authored vassal/patron edge has no
  // seniority stamp, so it keeps strict edge direction — reversing the
  // authoring legitimately reverses who extracts from whom.
  test('asymmetric vassal and patron edges keep strict direction when unstamped', () => {
    const rng = createPRNG('orientation.asymmetric');
    const byId = new Map([['oo', item('oo', rng)], ['jj', item('jj', rng)]]);
    const pressures = pressureIndex(['oo', 'jj'].flatMap(id =>
      PRESSURE_KINDS.map(kind => ({ settlementId: id, kind, score: 0.2 }))));
    const evaluate = (edge, type) => evaluateRelationshipRules({
      worldState: { tick: 7, relationshipStates: { [edge.id]: { relationshipType: type } }, stressors: [] },
      regionalGraph: { edges: [edge], channels: [] },
      byId,
    }, pressures, { tick: 7 });

    // Vassal: tribute extraction always drains the authored 'to' side.
    const vassalForward = evaluate({ id: 'edge.pair', from: 'oo', to: 'jj', relationshipType: 'vassal' }, 'vassal')
      .find(c => c.candidateType === 'vassal_tribute_extraction');
    expect(vassalForward.targetSaveId).toBe('jj');
    expect(vassalForward.metadata).toMatchObject({ overlordSaveId: 'oo', vassalSaveId: 'jj' });
    const vassalReversed = evaluate({ id: 'edge.pair', from: 'jj', to: 'oo', relationshipType: 'vassal' }, 'vassal')
      .find(c => c.candidateType === 'vassal_tribute_extraction');
    expect(vassalReversed.targetSaveId).toBe('oo');
    expect(vassalReversed.metadata).toMatchObject({ overlordSaveId: 'jj', vassalSaveId: 'oo' });

    // Patron: tribute extraction is attributed to the authored 'from' patron.
    const patronForward = evaluate({ id: 'edge.pair', from: 'oo', to: 'jj', relationshipType: 'patron' }, 'patron')
      .find(c => c.ruleId === 'patron_extracts_tribute');
    expect(patronForward.targetSaveId).toBe('oo');
    const patronReversed = evaluate({ id: 'edge.pair', from: 'jj', to: 'oo', relationshipType: 'patron' }, 'patron')
      .find(c => c.ruleId === 'patron_extracts_tribute');
    expect(patronReversed.targetSaveId).toBe('jj');
  });
});

/**
 * tests/domain/display/relationshipChronicle.test.js — LONG TAIL #39 car 2.
 *
 * THE ONE THAT MATTERS is "a 40-tick-old turning point still renders". Everything
 * else here is hygiene; that arm is the reason the module exists, because the
 * read model it would have been easiest to reuse (buildRelationshipPostures'
 * `recentMemory`) drops every row older than 24 ticks and would have shipped a
 * "what this alliance survived" panel that silently forgot what the alliance
 * survived.
 *
 * Also pinned: the two local copies of engine rules agree with their canonical
 * sources (imported ONLY here, so the relationship is frozen without coupling the
 * display chunk to the engine chunk), the triple-write dedupe, determinism under
 * input reordering, the honest-memory proposal rule, and total-on-garbage.
 */
import { describe, expect, it } from 'vitest';

import {
  relationshipChronicle, relationshipLines, relationshipKeyOf, hasRelationshipChronicle,
} from '../../../src/domain/display/relationshipChronicle.js';
import { relationshipKeyFromEdge } from '../../../src/domain/worldPulse/relationshipState.js';
import { RELATIONSHIP_MEMORY_MAX_LOOKBACK_TICKS } from '../../../src/domain/worldPulse/relationshipMemory.js';

const edge = { from: 'ash', to: 'calder' };
const KEY = 'rel.ash.calder';

/** A world with one edge and whatever relationship state the case needs. */
const world = (relState, extra = {}) => ({
  worldState: { tick: 60, relationshipStates: { [KEY]: relState }, ...extra },
  regionalGraph: { edges: [edge] },
});

describe('relationshipChronicle — the empty off-state', () => {
  it('a fresh world yields an empty chronicle', () => {
    expect(relationshipChronicle({ worldState: {}, regionalGraph: {} })).toEqual([]);
    expect(relationshipChronicle()).toEqual([]);
    expect(hasRelationshipChronicle({}, {})).toBe(false);
  });

  it('an edge with a relationship state but NO recorded line is omitted, not rendered empty', () => {
    const rows = relationshipChronicle(world({ relationshipType: 'allied', recentIncidents: [], history: [] }));
    expect(rows).toEqual([]);
  });
});

describe('relationshipChronicle — ⛔ THE DECAY TRAP (the negative control this car exists for)', () => {
  it('a turning point 40 ticks old STILL appears', () => {
    // 40 > RELATIONSHIP_MEMORY_MAX_LOOKBACK_TICKS, so relationshipMemory's
    // memoryEntry would have returned null for this row and the panel would have
    // forgotten the alliance it was asked to remember.
    const age = 40;
    expect(age).toBeGreaterThan(RELATIONSHIP_MEMORY_MAX_LOOKBACK_TICKS);
    const rows = relationshipChronicle(world({
      relationshipType: 'allied',
      turningPoints: [{ tick: 60 - age, type: 'label_proposal_applied', fromType: 'neutral', toType: 'allied', reason: 'The pact was sworn.' }],
    }));
    expect(rows).toHaveLength(1);
    expect(rows[0].lines).toHaveLength(1);
    expect(rows[0].lines[0]).toMatchObject({
      tick: 20, type: 'label_proposal_applied', source: 'turning-point', fromType: 'neutral', toType: 'allied',
    });
  });

  it('an alliance call and a coalition settlement 50 ticks old still appear', () => {
    const rows = relationshipChronicle(world({
      relationshipType: 'allied',
      allianceCalls: [{ callId: 'coalition_call.ash.calder.gorm.10', tick: 10, decision: 'refused', enemyId: 'gorm' }],
      coalitionSettlements: [{ actionId: 'cs1.cl1.reimbursement', tick: 12, action: 'reimbursement', status: 'unpaid', toId: 'calder' }],
    }));
    expect(rows[0].lines.map((l) => [l.tick, l.type, l.source])).toEqual([
      [12, 'coalition_reimbursement_unpaid', 'coalition-settlement'],
      [10, 'alliance_call_refused', 'alliance-call'],
    ]);
    expect(rows[0].firstTick).toBe(10);
    expect(rows[0].lastTick).toBe(12);
  });
});

describe('relationshipChronicle — the dedupe (one world event, up to three stores)', () => {
  it('one event written to incident + history + turningPoints appears EXACTLY once', () => {
    const row = { tick: 30, type: 'label_proposal_applied', outcomeId: 'o_pact', fromType: 'neutral', toType: 'allied' };
    const rows = relationshipChronicle(world({
      relationshipType: 'allied',
      recentIncidents: [{ tick: 30, type: 'label_proposal_applied', outcomeId: 'o_pact', severity: 0.6 }],
      history: [row],
      turningPoints: [row],
    }));
    expect(rows[0].lines).toHaveLength(1);
    // The INCIDENT claimed it (first store in the order), so its severity survives.
    expect(rows[0].lines[0]).toMatchObject({ source: 'incident', outcomeId: 'o_pact', severity: 0.6 });
  });

  it('the pulse outcome claims an event the archives repeat, even at a different tick (the LAG case)', () => {
    // A proposal selected at T and accepted at T' lands its archive rows at T'.
    // The outcome id joins FIRST, so the pair is one line and not two.
    const lines = relationshipLines({
      worldState: {
        proposals: [{ status: 'applied', outcome: { id: 'o_lag' } }],
        pulseHistory: [{
          tick: 18,
          selectedOutcomes: [{
            id: 'o_lag', relationshipKey: KEY, applyMode: 'proposal', severity: 0.7,
            metadata: { incidentType: 'raid' },
            proposalPayload: { kind: 'relationship_label_change', fromType: 'neutral', toType: 'hostile', reason: 'A raid on the border.' },
          }],
        }],
      },
      relationshipKey: KEY,
      relState: { recentIncidents: [{ tick: 25, type: 'raid', outcomeId: 'o_lag' }] },
    });
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ source: 'pulse', tick: 18, type: 'raid', outcomeId: 'o_lag', toType: 'hostile' });
  });

  it('two genuinely different events at the same tick both survive', () => {
    // Non-vacuity for the dedupe: it must collapse a repeat, never a pair.
    const lines = relationshipLines({
      worldState: {},
      relationshipKey: KEY,
      relState: { recentIncidents: [{ tick: 7, type: 'raid' }, { tick: 7, type: 'espionage' }] },
    });
    expect(lines.map((l) => l.type).sort()).toEqual(['espionage', 'raid']);
  });
});

describe('relationshipChronicle — honest memory (S3): a question is not an event', () => {
  const pendingWorld = {
    pulseHistory: [{
      tick: 40,
      selectedOutcomes: [{
        id: 'o_pending', relationshipKey: KEY, applyMode: 'proposal', candidateType: 'relationship_shift',
        proposalPayload: { kind: 'relationship_label_change', toType: 'hostile' },
      }],
    }],
  };

  it('a pending proposal never becomes a chronicle line', () => {
    expect(relationshipLines({ worldState: pendingWorld, relationshipKey: KEY, relState: {} })).toEqual([]);
  });

  it('…and the SAME outcome marked applied does become one (the arm is not vacuous)', () => {
    const applied = { ...pendingWorld, proposals: [{ status: 'applied', outcome: { id: 'o_pending' } }] };
    const lines = relationshipLines({ worldState: applied, relationshipKey: KEY, relState: {} });
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ tick: 40, type: 'relationship_shift', source: 'pulse' });
  });

  it('an auto outcome needs no marker at all', () => {
    const auto = {
      pulseHistory: [{ tick: 41, selectedOutcomes: [{ id: 'o_auto', relationshipKey: KEY, applyMode: 'auto', candidateType: 'border_incident' }] }],
    };
    expect(relationshipLines({ worldState: auto, relationshipKey: KEY, relState: {} })).toHaveLength(1);
  });
});

describe('relationshipChronicle — determinism and totality', () => {
  const relState = {
    relationshipType: 'allied',
    recentIncidents: [{ tick: 5, type: 'raid' }, { tick: 9, type: 'border_incident' }],
    turningPoints: [{ tick: 2, type: 'label_proposal_applied', toType: 'allied' }],
    allianceCalls: [{ callId: 'coalition_call.ash.calder.gorm.4', tick: 4, decision: 'joined', enemyId: 'gorm' }],
  };

  it('rows and lines are byte-stable across input reordering', () => {
    const a = relationshipChronicle(world(relState));
    const b = relationshipChronicle(world({
      ...relState,
      recentIncidents: [...relState.recentIncidents].reverse(),
    }));
    expect(JSON.stringify(b)).toBe(JSON.stringify(a));
    expect(a[0].lines.map((l) => l.tick)).toEqual([9, 5, 4, 2]);
  });

  it('two edges order by recorded depth, then by key — never by graph order', () => {
    const quiet = { from: 'ash', to: 'dunmar' };
    const states = {
      [KEY]: relState,
      'rel.ash.dunmar': { relationshipType: 'trade_partner', recentIncidents: [{ tick: 3, type: 'trade_reroute' }] },
    };
    const forward = relationshipChronicle({ worldState: { relationshipStates: states }, regionalGraph: { edges: [edge, quiet] } });
    const reversed = relationshipChronicle({ worldState: { relationshipStates: states }, regionalGraph: { edges: [quiet, edge] } });
    expect(forward.map((r) => r.relationshipKey)).toEqual([KEY, 'rel.ash.dunmar']);
    expect(reversed).toEqual(forward);
  });

  it('the posture words come from the persisted blob, and are null when it was never stamped', () => {
    const stamped = relationshipChronicle(world({
      ...relState, posture: 'strained_alliance',
      relationshipMemory: { posture: 'strained_alliance', postureLabel: 'strained alliance posture' },
    }));
    expect(stamped[0]).toMatchObject({ posture: 'strained_alliance', postureLabel: 'strained alliance posture' });
    const legacy = relationshipChronicle(world(relState));
    expect(legacy[0]).toMatchObject({ posture: null, postureLabel: null, relationshipType: 'allied' });
  });

  it('garbage and absent state return [] rather than throwing', () => {
    for (const bad of [null, undefined, 0, 'x', [], { relationshipStates: 'nope', regionalGraph: 7 }]) {
      expect(relationshipChronicle({ worldState: bad, regionalGraph: bad })).toEqual([]);
    }
    expect(relationshipChronicle({
      worldState: { relationshipStates: { [KEY]: { recentIncidents: [null, 3, { nothing: true }], history: 'no' } } },
      regionalGraph: { edges: [edge, null, { from: 'a' }] },
    })).toEqual([]);
  });

  it('an undated row survives (it is history) and sorts oldest', () => {
    // relationshipMemory drops an undated row outright — weight 0. The chronicle
    // keeps it, because "we know it happened but not when" is a fact about the
    // record, not a reason to delete the event.
    const lines = relationshipLines({
      worldState: {}, relationshipKey: KEY,
      relState: { recentIncidents: [{ type: 'sabotage' }, { tick: 3, type: 'raid' }] },
    });
    expect(lines.map((l) => [l.type, l.tick])).toEqual([['raid', 3], ['sabotage', null]]);
  });
});

describe('relationshipChronicle — the local copies agree with the engine they mirror', () => {
  it('relationshipKeyOf === relationshipKeyFromEdge on every shape the engine handles', () => {
    for (const e of [
      { from: 'a', to: 'b' }, { source: 'a', target: 'b' }, { a: 'a', b: 'b' },
      { id: 'edge-77', from: 'a', to: 'b' }, { id: 'edge-77' }, {}, null, undefined,
    ]) {
      expect(relationshipKeyOf(e), JSON.stringify(e)).toBe(relationshipKeyFromEdge(e));
    }
  });

  it('⛔ and the key is NOT a pair whenever the edge carries an id', () => {
    // The pin that says why nothing downstream may read names out of the key.
    expect(relationshipKeyOf({ id: 'edge-77', from: 'ash', to: 'calder' })).toBe('edge-77');
    const rows = relationshipChronicle({
      worldState: { relationshipStates: { 'edge-77': { recentIncidents: [{ tick: 1, type: 'raid' }] } } },
      regionalGraph: { edges: [{ id: 'edge-77', from: 'ash', to: 'calder' }] },
    });
    // anchored: the row above is asserted present, so the from/to below are read off a live row rather than an empty result.
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ relationshipKey: 'edge-77', from: 'ash', to: 'calder' });
  });

  it('the mechanical-outcome rule mirrors pulseHelpers: consequenceOutcomes wins over selectedOutcomes', () => {
    const record = {
      tick: 6,
      consequenceOutcomes: [{ id: 'c1', relationshipKey: KEY, candidateType: 'raid' }],
      selectedOutcomes: [{ id: 's1', relationshipKey: KEY, candidateType: 'espionage' }],
    };
    const lines = relationshipLines({ worldState: { pulseHistory: [record] }, relationshipKey: KEY, relState: {} });
    expect(lines.map((l) => l.outcomeId)).toEqual(['c1']);
  });
});

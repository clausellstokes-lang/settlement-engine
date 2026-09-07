/**
 * rumorNetwork.test.js — STEP 3.5 unit contract for the trade-carrier rumor
 * network (src/domain/spatial/rumorNetwork.js).
 *
 * The §3.3 pins covered here:
 *   • THE FALSE-CORROBORATION PIN (PART V §V.3): five relays of ONE origin ⇒
 *     independence 1; two independent witness lineages ⇒ 2.
 *   • Lineage rooting: every record's lineageIds[0] is the canonical event id.
 *   • Perfect-but-Delayed: latency only, NO rng touch (poisoned rng), two-run
 *     byte identity.
 *   • Unreliable: same-seed byte identity + different-seed divergence.
 *   • Dormancy: omniscient / no-marker ⇒ unchanged state, zero forks, zero new
 *     keys; an existing ledger is PRESERVED when dialled back to omniscient.
 *   • Expiry by TICK-AGE (never createdAt — the record shape carries no
 *     wall-clock field at all).
 *   • Top-K bounding; continuation guard (a settlement relays a telling once).
 *   • PROSPECTIVE application: the rulesetLog infoMode receipt floors seeding.
 */
import { describe, expect, it } from 'vitest';

import {
  RUMOR_SEED_LOOKBACK_TICKS,
  RUMOR_TOP_K,
  RUMOR_TTL_TICKS,
  advanceRumorLedgers,
  degradeTelling,
  magnitudeBandOf,
  maxHopsFor,
  mergeArrival,
  prospectiveFloorTick,
  rumorEventKey,
  tradeNeighbours,
  smugglePathNeighbourMap,
  RUMOR_CARRIER_CRIMINAL,
} from '../../src/domain/spatial/rumorNetwork.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { createPRNG } from '../../src/kernel/prng.js';

// ── Fixtures ─────────────────────────────────────────────────────────────────

/** A frozen digest whose settlement ids are the given ids. */
function digestFor(ids) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, ids.length).map((p, i) => ({ id: ids[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

const tradeChannel = (id, from, to) => ({ id, type: 'trade_route', from, to, status: 'confirmed' });

/** A significance-gated feed entry witnessed at `witnesses`. */
function majorEntry({ ref = 'evt1', tick = 5, witnesses = ['a'], score = 90, severity = 0.8, extra = {} } = {}) {
  return {
    id: `wizard_news.${tick}.applied.${ref}`,
    tick,
    significance: 'major',
    score,
    severity,
    scope: 'regional',
    kind: 'applied',
    impactKind: 'import_shortage',
    settlementIds: witnesses,
    sourceEventId: ref,
    tags: ['world_pulse'],
    ...extra,
  };
}

/** Drive N ticks of the pure advance and return the final ledgers. */
function drive({ ids, graph, entries, mode, seed = 'rumor-test', from = 5, to = 20, worldExtra = {}, smugglePaths = null }) {
  const digest = digestFor(ids);
  let ledgers = null;
  for (let tick = from; tick <= to; tick += 1) {
    const rng = createPRNG(`${seed}::tick:${tick}`);
    const result = advanceRumorLedgers({
      worldState: {
        simulationRules: { infoMode: mode },
        spatialCanonVersion: 1,
        spatialDigest: digest,
        ...(ledgers ? { spatialLedgers: { rumorLedgers: ledgers } } : {}),
        ...worldExtra,
      },
      feedEntries: entries,
      graph,
      tick,
      rng,
      smugglePaths,
    });
    if (result.changed) ledgers = result.next;
  }
  return ledgers;
}

/** An rng that fails the test the moment anything touches it. */
const poisonedRng = () => ({
  fork: () => { throw new Error('rng was forked on a no-roll path'); },
  random: () => { throw new Error('rng was drawn on a no-roll path'); },
  chance: () => { throw new Error('rng was drawn on a no-roll path'); },
  randInt: () => { throw new Error('rng was drawn on a no-roll path'); },
});

// ── THE FALSE-CORROBORATION PIN ──────────────────────────────────────────────

describe('false corroboration (PART V §V.3 — THE pin)', () => {
  it('five relays of ONE origin corroborate as independence 1', () => {
    // A diamond-and-a-half: every road leads back to the single witness 'a'.
    //   a→b, a→c, a→d, b→e, c→e, d→e  — 'e' hears the event via THREE paths,
    // and with transitions re-seeding over the lookback window it receives
    // multiple arrivals — but every telling roots at t0@a.
    const ids = ['a', 'b', 'c', 'd', 'e'];
    const graph = { channels: [
      tradeChannel('ch.a.b', 'a', 'b'),
      tradeChannel('ch.a.c', 'a', 'c'),
      tradeChannel('ch.a.d', 'a', 'd'),
      tradeChannel('ch.b.e', 'b', 'e'),
      tradeChannel('ch.c.e', 'c', 'e'),
      tradeChannel('ch.d.e', 'd', 'e'),
    ] };
    const ledgers = drive({ ids, graph, entries: [majorEntry({ witnesses: ['a'] })], mode: 'perfect_delayed' });
    const atE = ledgers?.e?.[rumorEventKey('evt1')];
    expect(atE).toBeTruthy();
    // Multiple lineage CHAINS converged on e (3 paths), yet independence is 1:
    // they all share the one origin telling.
    expect(atE.corroborationRoots).toEqual(['t0:evt1@a']);
    expect(atE.corroborationRoots.length).toBe(1);
  });

  it('two INDEPENDENT witness lineages corroborate as independence 2', () => {
    // The same event witnessed at BOTH 'a' and 'e' (a two-ended shock); the
    // middle settlement 'c' hears both tellings.
    const ids = ['a', 'b', 'c', 'd', 'e'];
    const graph = { channels: [
      tradeChannel('ch.a.b', 'a', 'b'),
      tradeChannel('ch.b.c', 'b', 'c'),
      tradeChannel('ch.c.d', 'c', 'd'),
      tradeChannel('ch.d.e', 'd', 'e'),
    ] };
    const ledgers = drive({ ids, graph, entries: [majorEntry({ witnesses: ['a', 'e'] })], mode: 'perfect_delayed' });
    const atC = ledgers?.c?.[rumorEventKey('evt1')];
    expect(atC).toBeTruthy();
    expect(atC.corroborationRoots).toEqual(['t0:evt1@a', 't0:evt1@e']);
    expect(atC.corroborationRoots.length).toBe(2);
  });

  it('a relayed packet carries ONLY its own origin root (echo chains cannot inflate)', () => {
    // Even after 'c' merges two roots, what it relays onward descends from the
    // ONE telling it adopted — 'd' next door still reads its packet's root(s),
    // never a synthetic count.
    const ids = ['a', 'b', 'c', 'd', 'e'];
    const graph = { channels: [
      tradeChannel('ch.a.c', 'a', 'c'),
      tradeChannel('ch.e.c', 'e', 'c'),
      tradeChannel('ch.c.d', 'c', 'd'),
    ] };
    const ledgers = drive({ ids, graph, entries: [majorEntry({ witnesses: ['a', 'e'] })], mode: 'perfect_delayed' });
    const atD = ledgers?.d?.[rumorEventKey('evt1')];
    expect(atD).toBeTruthy();
    expect(atD.corroborationRoots.length).toBe(1);
  });
});

// ── Lineage threading ────────────────────────────────────────────────────────

describe('lineage (PART VI §VI.2-1 — non-deferrable, rooted at the canonical id)', () => {
  it('every arrival record roots at the canonical event id and grows one telling per relay', () => {
    const ids = ['a', 'b', 'c', 'd'];
    const graph = { channels: [
      tradeChannel('ch.a.b', 'a', 'b'),
      tradeChannel('ch.b.c', 'b', 'c'),
      tradeChannel('ch.c.d', 'c', 'd'),
    ] };
    const ledgers = drive({ ids, graph, entries: [majorEntry({ witnesses: ['a'] })], mode: 'perfect_delayed' });
    for (const sid of ['a', 'b', 'c', 'd']) {
      const record = ledgers?.[sid]?.[rumorEventKey('evt1')];
      expect(record, `record at ${sid}`).toBeTruthy();
      expect(record.lineageIds[0]).toBe('evt1');
      expect(record.lineageIds[1]).toBe('t0:evt1@a');
      // hop N ⇒ the root + the origin telling + N relay tellings.
      expect(record.lineageIds.length).toBe(record.hopCount + 2);
      expect(record.eventRef).toBe('evt1');
    }
  });
});

// ── Perfect-but-Delayed ──────────────────────────────────────────────────────

describe('Perfect-but-Delayed (the §11 sleeper — latency only)', () => {
  const ids = ['a', 'b', 'c', 'd'];
  const graph = { channels: [
    tradeChannel('ch.a.b', 'a', 'b'),
    tradeChannel('ch.b.c', 'b', 'c'),
    tradeChannel('ch.c.d', 'c', 'd'),
  ] };

  it('never touches rng (a poisoned rng survives the whole run)', () => {
    const digest = digestFor(ids);
    let ledgers = null;
    for (let tick = 5; tick <= 20; tick += 1) {
      const result = advanceRumorLedgers({
        worldState: {
          simulationRules: { infoMode: 'perfect_delayed' },
          spatialCanonVersion: 1,
          spatialDigest: digest,
          ...(ledgers ? { spatialLedgers: { rumorLedgers: ledgers } } : {}),
        },
        feedEntries: [majorEntry({ witnesses: ['a'] })],
        graph,
        tick,
        rng: poisonedRng(),
      });
      if (result.changed) ledgers = result.next;
    }
    expect(ledgers?.d).toBeTruthy();
  });

  it('is pure latency: fidelity stays perfect, arrival lags the event by hop distance', () => {
    const ledgers = drive({ ids, graph, entries: [majorEntry({ witnesses: ['a'] })], mode: 'perfect_delayed' });
    const chain = ['a', 'b', 'c', 'd'].map((sid) => ledgers?.[sid]?.[rumorEventKey('evt1')]);
    for (const record of chain) {
      expect(record.completeness01).toBe(1);
      expect(record.accuracy01).toBe(1);
      expect(record.content.magnitude).toBe(magnitudeBandOf(0.8));
    }
    // Strictly increasing arrival down the chain: distance IS the delay.
    for (let i = 1; i < chain.length; i += 1) {
      expect(chain[i].arrivalTick).toBeGreaterThan(chain[i - 1].arrivalTick);
    }
    expect(chain[0].arrivalTick).toBe(5); // the witness knows at the event tick
  });

  it('two runs are byte-identical', () => {
    const one = drive({ ids, graph, entries: [majorEntry({ witnesses: ['a'] })], mode: 'perfect_delayed' });
    const two = drive({ ids, graph, entries: [majorEntry({ witnesses: ['a'] })], mode: 'perfect_delayed' });
    expect(JSON.stringify(one)).toBe(JSON.stringify(two));
  });
});

// ── Unreliable ───────────────────────────────────────────────────────────────

describe('Unreliable (organic degradation — round 13)', () => {
  const ids = ['a', 'b', 'c', 'd', 'e', 'f'];
  const graph = { channels: [
    tradeChannel('ch.a.b', 'a', 'b'),
    tradeChannel('ch.b.c', 'b', 'c'),
    tradeChannel('ch.c.d', 'c', 'd'),
    tradeChannel('ch.d.e', 'd', 'e'),
  ] };
  // Several events so at least one weathering roll lands differently per seed.
  const entries = [
    majorEntry({ ref: 'evt1', witnesses: ['a'] }),
    majorEntry({ ref: 'evt2', witnesses: ['a'], score: 96 }),
    majorEntry({ ref: 'evt3', witnesses: ['b'], severity: 0.6 }),
  ];

  it('same seed ⇒ byte-identical ledgers; different seed ⇒ divergence', () => {
    const one = drive({ ids, graph, entries, mode: 'unreliable', seed: 's1' });
    const two = drive({ ids, graph, entries, mode: 'unreliable', seed: 's1' });
    const other = drive({ ids, graph, entries, mode: 'unreliable', seed: 's2' });
    expect(JSON.stringify(one)).toBe(JSON.stringify(two));
    expect(JSON.stringify(one)).not.toBe(JSON.stringify(other));
  });

  it('fidelity decays down the chain (monotone non-increasing completeness)', () => {
    const ledgers = drive({ ids, graph, entries, mode: 'unreliable', seed: 's1' });
    const chain = ['a', 'b', 'c', 'd'].map((sid) => ledgers?.[sid]?.[rumorEventKey('evt1')]).filter(Boolean);
    expect(chain.length).toBeGreaterThanOrEqual(3);
    for (let i = 1; i < chain.length; i += 1) {
      expect(chain[i].completeness01).toBeLessThanOrEqual(chain[i - 1].completeness01);
    }
    expect(chain[0].completeness01).toBe(1); // the witness is never degraded
  });

  it('degradeTelling name-swaps only to REAL in-world settlement ids', () => {
    const digest = digestFor(ids);
    const record = {
      eventRef: 'evt1', eventTick: 5, carrier: 'trade', arrivalTick: 5, hopCount: 0,
      lineageIds: ['evt1', 't0:evt1@a'], corroborationRoots: ['t0:evt1@a'],
      provenance: { originId: 'a', relayIds: [] },
      completeness01: 1, accuracy01: 1, framing: [], significance: 'major', score: 90,
      content: { what: 'import_shortage', whereId: 'a', scope: 'regional', magnitude: 3, partyIds: ['a', 'b'], causeClass: null, deityName: null },
      relayedTick: null,
    };
    const real = new Set(ids);
    // Sweep many forks: whatever mutation fires, party ids stay in-world and
    // magnitude stays a 0..3 band.
    for (let i = 0; i < 200; i += 1) {
      const out = degradeTelling(record, createPRNG(`sweep:${i}`), digest);
      for (const id of out.content.partyIds) expect(real.has(id)).toBe(true);
      expect(out.content.magnitude).toBeGreaterThanOrEqual(0);
      expect(out.content.magnitude).toBeLessThanOrEqual(3);
      expect(out.completeness01).toBeGreaterThan(0);
      expect(out.accuracy01).toBeGreaterThan(0);
    }
  });
});

// ── Dormancy ─────────────────────────────────────────────────────────────────

describe('dormancy (omniscient / no marker ⇒ byte-identical, zero forks)', () => {
  const ids = ['a', 'b'];
  const graph = { channels: [tradeChannel('ch.a.b', 'a', 'b')] };

  it('omniscient (virtual profile) materializes nothing and never touches rng', () => {
    const result = advanceRumorLedgers({
      worldState: { simulationRules: {}, spatialCanonVersion: 1, spatialDigest: digestFor(ids) },
      feedEntries: [majorEntry({ witnesses: ['a'] })],
      graph,
      tick: 5,
      rng: poisonedRng(),
    });
    expect(result.changed).toBe(false);
    expect(result.next).toBe(null);
  });

  it('a live mode WITHOUT the spatial marker materializes nothing', () => {
    const result = advanceRumorLedgers({
      worldState: { simulationRules: { infoMode: 'unreliable' } },
      feedEntries: [majorEntry({ witnesses: ['a'] })],
      graph,
      tick: 5,
      rng: poisonedRng(),
    });
    expect(result.changed).toBe(false);
    expect(result.next).toBe(null);
  });

  it('dialling back to omniscient PRESERVES an existing ledger untouched (never deletes)', () => {
    const ledgers = drive({ ids, graph, entries: [majorEntry({ witnesses: ['a'] })], mode: 'perfect_delayed' });
    expect(ledgers).toBeTruthy();
    const result = advanceRumorLedgers({
      worldState: {
        simulationRules: { infoMode: 'omniscient' },
        spatialCanonVersion: 1,
        spatialDigest: digestFor(ids),
        spatialLedgers: { rumorLedgers: ledgers },
      },
      feedEntries: [majorEntry({ ref: 'evt9', tick: 30, witnesses: ['a'] })],
      graph,
      tick: 30,
      rng: poisonedRng(),
    });
    expect(result.changed).toBe(false);
    expect(result.next).toBe(ledgers); // the SAME reference — untouched
  });
});

// ── Expiry, bounding, guards ─────────────────────────────────────────────────

describe('expiry / top-K / continuation guard / significance gate', () => {
  const ids = ['a', 'b'];
  const graph = { channels: [tradeChannel('ch.a.b', 'a', 'b')] };

  it('expires by TICK-AGE since arrival; records carry NO wall-clock field', () => {
    const ledgers = drive({ ids, graph, entries: [majorEntry({ witnesses: ['a'] })], mode: 'perfect_delayed', from: 5, to: 6 });
    const record = ledgers?.a?.[rumorEventKey('evt1')];
    expect(record).toBeTruthy();
    // The record shape is exactly the documented field set — no createdAt.
    expect(Object.keys(record).sort()).toEqual([
      'accuracy01', 'arrivalTick', 'carrier', 'completeness01', 'content',
      'corroborationRoots', 'eventRef', 'eventTick', 'framing', 'hopCount',
      'lineageIds', 'provenance', 'relayedTick', 'score', 'significance',
    ].sort());
    // Advance far past the major TTL with an empty feed: everything expires
    // and the ledger drains back to null (the conditional key drops).
    let current = ledgers;
    for (let tick = 7; tick <= 7 + RUMOR_TTL_TICKS.major + 10; tick += 1) {
      const result = advanceRumorLedgers({
        worldState: {
          simulationRules: { infoMode: 'perfect_delayed' },
          spatialCanonVersion: 1,
          spatialDigest: digestFor(ids),
          ...(current ? { spatialLedgers: { rumorLedgers: current } } : {}),
        },
        feedEntries: [],
        graph,
        tick,
      });
      if (result.changed) current = result.next;
    }
    expect(current).toBe(null);
  });

  it('bounds each settlement to the top-K by the total order', () => {
    const entries = [];
    for (let i = 0; i < RUMOR_TOP_K + 12; i += 1) {
      entries.push(majorEntry({ ref: `evt${i}`, tick: 5, witnesses: ['a'], score: 80 + (i % 10) }));
    }
    const ledgers = drive({ ids, graph, entries, mode: 'perfect_delayed', from: 5, to: 6 });
    expect(Object.keys(ledgers?.a || {}).length).toBe(RUMOR_TOP_K);
    // Deterministic: the same overflow twice keeps the same set.
    const again = drive({ ids, graph, entries, mode: 'perfect_delayed', from: 5, to: 6 });
    expect(Object.keys(again?.a || {})).toEqual(Object.keys(ledgers?.a || {}));
  });

  it('the continuation guard stamps relayedTick once (a telling relays once per settlement)', () => {
    const ledgers = drive({ ids, graph, entries: [majorEntry({ witnesses: ['a'] })], mode: 'perfect_delayed' });
    expect(ledgers?.a?.[rumorEventKey('evt1')].relayedTick).toBe(5);
    // Re-advancing with the same feed window never re-relays or re-seeds:
    // the ledger is a fixed point until expiry.
    const digest = digestFor(ids);
    const result = advanceRumorLedgers({
      worldState: {
        simulationRules: { infoMode: 'perfect_delayed' },
        spatialCanonVersion: 1, spatialDigest: digest, spatialLedgers: { rumorLedgers: ledgers },
      },
      feedEntries: [majorEntry({ witnesses: ['a'] })],
      graph,
      tick: 8,
    });
    expect(result.changed).toBe(false);
  });

  it('routine noise never enters the network (the significance gate)', () => {
    const routine = {
      ...majorEntry({ witnesses: ['a'] }),
      significance: 'notable',
      score: 20,
    };
    const proposal = {
      ...majorEntry({ ref: 'evt.prop', witnesses: ['a'] }),
      tags: ['world_pulse', 'proposal'],
    };
    const ledgers = drive({ ids, graph, entries: [routine, proposal], mode: 'perfect_delayed', from: 5, to: 8 });
    expect(ledgers).toBe(null);
  });

  it('DM-only and covert facts never seed, while an equally salient public sibling does', () => {
    const entries = [
      majorEntry({ ref: 'evt.dm-only', witnesses: ['a'], extra: { audience: 'dm-only' } }),
      majorEntry({ ref: 'evt.covert', witnesses: ['a'], extra: { covert: true } }),
      majorEntry({ ref: 'evt.public', witnesses: ['a'], extra: { audience: 'public' } }),
    ];
    const ledgers = drive({
      ids,
      graph,
      entries,
      mode: 'perfect_delayed',
      from: 5,
      to: 6,
    });
    expect(ledgers?.a?.[rumorEventKey('evt.public')]).toBeTruthy();
    expect(ledgers?.a?.[rumorEventKey('evt.dm-only')]).toBeUndefined();
    expect(ledgers?.a?.[rumorEventKey('evt.covert')]).toBeUndefined();
  });

  it('hop budget: a notable telling fades after 2 hops; a major travels farther', () => {
    const lineIds = ['a', 'b', 'c', 'd', 'e', 'f'];
    const lineGraph = { channels: [
      tradeChannel('ch.a.b', 'a', 'b'),
      tradeChannel('ch.b.c', 'b', 'c'),
      tradeChannel('ch.c.d', 'c', 'd'),
      tradeChannel('ch.d.e', 'd', 'e'),
      tradeChannel('ch.e.f', 'e', 'f'),
    ] };
    const notable = { ...majorEntry({ ref: 'evtN', witnesses: ['a'], score: 70 }), significance: 'notable' };
    // Assert BEFORE the notable TTL (13 ticks from arrival) starts expiring the
    // short-lived chain — the hop budget is what's under test here, not expiry.
    const ledgers = drive({ ids: lineIds, graph: lineGraph, entries: [notable, majorEntry({ ref: 'evtM', witnesses: ['a'], score: 90 })], mode: 'perfect_delayed', to: 15 });
    // notable: hops 0,1,2 ⇒ reaches c and STOPS.
    expect(ledgers?.c?.[rumorEventKey('evtN')]).toBeTruthy();
    expect(ledgers?.d?.[rumorEventKey('evtN')]).toBeUndefined();
    // major (score 90 ⇒ 4 hops) ⇒ reaches e and stops before f.
    expect(ledgers?.e?.[rumorEventKey('evtM')]).toBeTruthy();
    expect(ledgers?.f?.[rumorEventKey('evtM')]).toBeUndefined();
    expect(maxHopsFor({ significance: 'notable', score: 70 })).toBe(2);
    expect(maxHopsFor({ significance: 'major', score: 90 })).toBe(4);
    expect(maxHopsFor({ significance: 'major', score: 96 })).toBe(5);
  });
});

// ── Prospective application ──────────────────────────────────────────────────

describe('prospective application (§11 — historical reports never gain lineage)', () => {
  it('the rulesetLog infoMode receipt floors seeding', () => {
    const ids = ['a', 'b'];
    const graph = { channels: [tradeChannel('ch.a.b', 'a', 'b')] };
    const worldExtra = {
      rulesetLog: {
        rc_10_0: { tick: 10, changedKeys: ['infoMode'], from: { infoMode: null }, to: { infoMode: 'perfect_delayed' } },
      },
    };
    // An event from BEFORE the mode change (tick 9, within the lookback of the
    // tick-10 advance) must NOT seed…
    const historical = majorEntry({ ref: 'evtOld', tick: 9, witnesses: ['a'] });
    // …while an event at/after the change does.
    const fresh = majorEntry({ ref: 'evtNew', tick: 10, witnesses: ['a'] });
    const ledgers = drive({
      ids, graph, entries: [historical, fresh], mode: 'perfect_delayed',
      from: 10, to: 12, worldExtra,
    });
    expect(ledgers?.a?.[rumorEventKey('evtOld')]).toBeUndefined();
    expect(ledgers?.a?.[rumorEventKey('evtNew')]).toBeTruthy();
    expect(prospectiveFloorTick({ ...worldExtra })).toBe(10);
    expect(prospectiveFloorTick({})).toBe(0);
  });
});

// ── Small helpers ────────────────────────────────────────────────────────────

describe('helpers', () => {
  it('tradeNeighbours reads confirmed trade channels both ways, deduped + sorted', () => {
    const graph = { channels: [
      tradeChannel('ch.a.b', 'a', 'b'),
      tradeChannel('ch.b.a2', 'b', 'a'),                    // second edge to the same neighbour
      { id: 'ch.a.c', type: 'trade_route', from: 'a', to: 'c', status: 'suggested' }, // not confirmed
      { id: 'ch.a.d', type: 'war_front', from: 'a', to: 'd', status: 'confirmed' },   // not trade
      tradeChannel('ch.e.a', 'e', 'a'),                     // inbound ⇒ neighbour too
    ] };
    expect(tradeNeighbours(graph, 'a')).toEqual([
      { neighbourId: 'b', edgeId: 'ch.a.b' }, // codepoint-first edge id wins the dedup
      { neighbourId: 'e', edgeId: 'ch.e.a' },
    ]);
    expect(tradeNeighbours(null, 'a')).toEqual([]);
  });

  it('mergeArrival unions roots, keeps the better telling, preserves the guard stamp', () => {
    const base = {
      eventRef: 'evt1', eventTick: 5, carrier: 'trade', arrivalTick: 8, hopCount: 2,
      lineageIds: ['evt1', 't0:evt1@a', 't1:evt1@a', 't2:evt1@b'], corroborationRoots: ['t0:evt1@a'],
      provenance: { originId: 'a', relayIds: ['a', 'b'] },
      completeness01: 0.6, accuracy01: 0.9, framing: ['merchant'], significance: 'major', score: 90,
      content: { what: 'import_shortage', whereId: 'a', scope: 'regional', magnitude: 2, partyIds: ['a'], causeClass: null, deityName: null },
      relayedTick: 8,
    };
    const better = { ...base, completeness01: 0.95, hopCount: 1, arrivalTick: 9, lineageIds: ['evt1', 't0:evt1@e', 't1:evt1@e'], corroborationRoots: ['t0:evt1@e'], relayedTick: null };
    const merged = mergeArrival(base, better);
    expect(merged.completeness01).toBe(0.95);           // the better telling supersedes
    expect(merged.corroborationRoots).toEqual(['t0:evt1@a', 't0:evt1@e']); // union, sorted
    expect(merged.relayedTick).toBe(8);                 // the guard stamp survives
    expect(merged.arrivalTick).toBe(8);                 // FIRST-HEARD wins (min of 8, 9) — never un-heard
  });

  it('mergeArrival keeps the EARLIEST arrival so a settlement never un-hears a known rumor', () => {
    // 'arrived' was received at tick 3 (already known + relayed). 'inTransit' is a
    // more-complete telling still on the road (future arrivalTick 11) that wins
    // pickBetterTelling on completeness/hops. The merged record must keep arrivalTick 3 —
    // else the read model (arrivalTick <= tick) drops the rumor for ticks 3..10.
    const arrived = {
      eventRef: 'evt1', eventTick: 1, carrier: 'trade', arrivalTick: 3, hopCount: 3,
      lineageIds: ['evt1', 't0:evt1@o', 't1:evt1@b', 't2:evt1@a'], corroborationRoots: ['t0:evt1@o'],
      provenance: { originId: 'o', relayIds: ['o', 'b', 'a'] },
      completeness01: 0.6, accuracy01: 0.9, framing: ['merchant'], significance: 'major', score: 80,
      content: { what: 'import_shortage', whereId: 'o', scope: 'regional', magnitude: 2, partyIds: ['o'], causeClass: null, deityName: null },
      relayedTick: 3,
    };
    const inTransit = { ...arrived, completeness01: 0.95, hopCount: 2, arrivalTick: 11, lineageIds: ['evt1', 't0:evt1@o', 't1:evt1@a'], corroborationRoots: ['t0:evt1@o'], relayedTick: null };
    const merged = mergeArrival(arrived, inTransit);
    expect(merged.completeness01).toBe(0.95);  // still adopts the better content
    expect(merged.arrivalTick).toBe(3);         // but NEVER un-hears — earliest arrival wins
  });
});

// ── M7 — the CRIMINAL / underground rumor carrier (round 9) ───────────────────
describe('M7 — the criminal rumor carrier (smuggle runs carry news)', () => {
  it('smugglePathNeighbourMap links a run\'s endpoints both ways with a crime-prefixed edge', () => {
    const map = smugglePathNeighbourMap([['harbor', 'freehold']]);
    expect(map.get('harbor').map((n) => n.neighbourId)).toEqual(['freehold']);
    expect(map.get('freehold').map((n) => n.neighbourId)).toEqual(['harbor']);
    // Codepoint-stable, shared both directions, never colliding with the trade/army lanes.
    expect(map.get('harbor')[0].edgeId).toBe('crime.freehold.harbor');
    expect(map.get('freehold')[0].edgeId).toBe('crime.freehold.harbor');
  });

  it('is EMPTY (dormant) when no smuggle paths are supplied — the criminal lane is off', () => {
    expect(smugglePathNeighbourMap(null).size).toBe(0);
    expect(smugglePathNeighbourMap([]).size).toBe(0);
    expect(RUMOR_CARRIER_CRIMINAL).toBe('criminal');
  });

  it('a smuggle run carries news to a town NO trade channel reaches (the underground conduit)', () => {
    // 'a' and 'b' share NO trade channel — the honest network never connects them. A smuggle
    // run a↔b is the only conduit; the criminal carrier delivers the rumor of the event at 'a'.
    const ids = ['a', 'b'];
    const graph = { channels: [] }; // no trade edges at all
    const noCarrier = drive({ ids, graph, entries: [majorEntry({ witnesses: ['a'] })], mode: 'perfect_delayed' });
    const withCarrier = drive({ ids, graph, entries: [majorEntry({ witnesses: ['a'] })], mode: 'perfect_delayed', smugglePaths: [['a', 'b']] });
    // Without the criminal lane, 'b' never hears it.
    expect(noCarrier?.b?.[rumorEventKey('evt1')]).toBeFalsy();
    // With a smuggle run a↔b, the criminal carrier relays it (framing 'criminal').
    const atB = withCarrier?.b?.[rumorEventKey('evt1')];
    expect(atB).toBeTruthy();
    expect(atB.framing).toContain('criminal');
  });
});

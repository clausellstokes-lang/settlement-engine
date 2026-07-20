/**
 * migrationRumors.test.js — D-0 (deep-couplings): THE MIGRATION RUMOR CARRIER unit contract.
 *
 * The §4 pins covered here:
 *   • migrationRumorsActive gate (the virtual flag idiom — absent/false ⇒ dark).
 *   • rumorCarrierParams: DARK (flag off) ⇒ migrantPaths null + flightEntries [] (byte-identical
 *     inputs to advanceRumorLedgers); LIT ⇒ the in-flight columns' [origin,dest] legs + the
 *     banded migration_flight feed entries; army/smuggle params preserved verbatim.
 *   • The refugee RELAY: an existing rumor at a column's origin reaches its destination tagged
 *     with the 'refugee' framing (a column carries news of the towns it crosses).
 *   • The flight EVENT: a column seeds a migration_flight rumor at its endpoints and it relays
 *     out with degrading fidelity at distance (the D-1 demographic feeder's substrate).
 */
import { describe, expect, it } from 'vitest';

import {
  advanceRumorLedgers,
  rumorEventKey,
  RUMOR_CARRIER_REFUGEE,
  migrantPathNeighbourMap,
} from '../../src/domain/spatial/rumorNetwork.js';
import {
  rumorCarrierParams,
  migrationRumorsActive,
  MIGRATION_RUMOR_TUNING,
} from '../../src/domain/spatial/migrationRumors.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { createPRNG } from '../../src/kernel/prng.js';

// ── Fixtures ─────────────────────────────────────────────────────────────────
function digestFor(ids) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, ids.length).map((p, i) => ({ id: ids[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}
const tradeChannel = (id, from, to) => ({ id, type: 'trade_route', from, to, status: 'confirmed' });

/** A migration column ledger entry (the migration.js MigrationColumn shape). */
const column = (originId, destId, arrivals, departTick) => ({ originId, destId, arrivals, departTick, arrivalTick: departTick + 6 });

/** A worldState carrying an in-flight migration ledger, spatial marker + digest. */
function migrationWorld(ids, columns, extra = {}) {
  const ledger = {};
  for (const c of columns) ledger[`${c.originId}:${c.destId}:${c.departTick}`] = c;
  return {
    simulationRules: { infoMode: 'perfect_delayed', migrationRumorsEnabled: true },
    spatialCanonVersion: 1,
    spatialDigest: digestFor(ids),
    spatialLedgers: { migration: ledger },
    ...extra,
  };
}

// ── The gate ─────────────────────────────────────────────────────────────────
describe('migrationRumorsActive — the virtual flag gate (law 1 idiom)', () => {
  it('is false when absent / not exactly true; true only for === true', () => {
    expect(migrationRumorsActive(undefined)).toBe(false);
    expect(migrationRumorsActive(null)).toBe(false);
    expect(migrationRumorsActive({})).toBe(false);
    expect(migrationRumorsActive({ migrationRumorsEnabled: false })).toBe(false);
    expect(migrationRumorsActive({ migrationRumorsEnabled: 'true' })).toBe(false);
    expect(migrationRumorsActive({ migrationRumorsEnabled: 1 })).toBe(false);
    expect(migrationRumorsActive({ migrationRumorsEnabled: true })).toBe(true);
  });
});

// ── rumorCarrierParams ───────────────────────────────────────────────────────
describe('rumorCarrierParams — the carrier assembly', () => {
  const carrierState = {
    spatialLedgers: {
      armyTransit: { army1: { path: ['a', 'b', 'c'] }, army2: { path: ['x'] } },
      supplyShipments: {
        run1: { smuggle: true, sourceId: 'a', settlementId: 'b' },
        run2: { smuggle: false, sourceId: 'c', settlementId: 'd' },
      },
    },
  };

  it('army + smuggle params are preserved verbatim (read from the carrier state)', () => {
    const out = rumorCarrierParams({ carrierState, migrationState: {}, rules: {} });
    // Army: only multi-node paths survive (army2's single node is filtered).
    expect(out.armyPaths).toEqual([['a', 'b', 'c']]);
    // Smuggle: only smuggle:true runs with distinct source/dest, as [source, dest] legs.
    expect(out.smugglePaths).toEqual([['a', 'b']]);
  });

  it('DARK (flag off): migrantPaths null, flightEntries empty — even with columns present', () => {
    const migrationState = migrationWorld(['a', 'b'], [column('a', 'b', 500, 3)]);
    const out = rumorCarrierParams({ carrierState, migrationState, rules: { migrationRumorsEnabled: false } });
    expect(out.migrantPaths).toBeNull();
    expect(out.flightEntries).toEqual([]);
  });

  it('LIT: in-flight columns produce [origin,dest] relay legs + banded flight entries', () => {
    const migrationState = migrationWorld(['a', 'b', 'c'], [
      column('a', 'b', 500, 3), // exodus
      column('c', 'b', 120, 4), // notable
    ]);
    const out = rumorCarrierParams({ carrierState: migrationState, migrationState, rules: { migrationRumorsEnabled: true } });
    // Codepoint-sorted column keys ⇒ 'a:b:3' before 'c:b:4'.
    expect(out.migrantPaths).toEqual([['a', 'b'], ['c', 'b']]);
    expect(out.flightEntries.length).toBe(2);
    const exodus = out.flightEntries[0];
    expect(exodus.id).toBe('migration.a.b.3');
    expect(exodus.sourceEventId).toBe('migration.a.b.3');
    expect(exodus.impactKind).toBe('migration_flight');
    expect(exodus.tick).toBe(3);
    expect(exodus.settlementIds).toEqual(['a', 'b']);
    expect(exodus.significance).toBe('major'); // exodus is realm-shaking
    expect(exodus.severity).toBe(0.85);
    expect(exodus.causeClass).toBe('exodus');
    const notable = out.flightEntries[1];
    expect(notable.id).toBe('migration.c.b.4');
    expect(notable.significance).toBe('notable');
    expect(notable.causeClass).toBe('displacement');
  });

  it('band classification: small trickle barely enters, exodus above the floor is major', () => {
    const small = migrationWorld(['a', 'b'], [column('a', 'b', MIGRATION_RUMOR_TUNING.NOTABLE_FLOOR - 1, 1)]);
    const out = rumorCarrierParams({ carrierState: small, migrationState: small, rules: { migrationRumorsEnabled: true } });
    expect(out.flightEntries[0].causeClass).toBe('departure');
    expect(out.flightEntries[0].significance).toBe('notable');
    expect(out.flightEntries[0].score).toBeGreaterThanOrEqual(60); // enters the significance gate
  });

  it('degenerate columns (self-loop / zero arrivals) are dropped', () => {
    const bad = migrationWorld(['a', 'b'], [column('a', 'a', 500, 1), column('a', 'b', 0, 1)]);
    const out = rumorCarrierParams({ carrierState: bad, migrationState: bad, rules: { migrationRumorsEnabled: true } });
    expect(out.migrantPaths).toBeNull();
    expect(out.flightEntries).toEqual([]);
  });
});

// ── The refugee relay (part a) ───────────────────────────────────────────────
describe('the refugee carrier relays existing rumors along a column path', () => {
  it('a rumor witnessed at the origin reaches the destination tagged refugee', () => {
    const ids = ['origin', 'dest'];
    const digest = digestFor(ids);
    // An existing rumor about some event, witnessed at the origin, no trade edges at all —
    // so ONLY the refugee carrier can move it (proves the new lane, not the trade lane).
    const entry = {
      id: 'evt.shock', tick: 5, significance: 'major', score: 90, severity: 0.8,
      scope: 'regional', kind: 'applied', impactKind: 'import_shortage',
      settlementIds: ['origin'], sourceEventId: 'evt.shock', tags: ['world_pulse'],
    };
    let ledgers = null;
    const migrantPaths = [['origin', 'dest']];
    for (let tick = 5; tick <= 12; tick += 1) {
      const r = advanceRumorLedgers({
        worldState: {
          simulationRules: { infoMode: 'perfect_delayed' },
          spatialCanonVersion: 1, spatialDigest: digest,
          ...(ledgers ? { spatialLedgers: { rumorLedgers: ledgers } } : {}),
        },
        feedEntries: [entry], graph: { channels: [] }, tick,
        rng: createPRNG(`refugee::${tick}`), migrantPaths,
      });
      if (r.changed) ledgers = r.next;
    }
    const atDest = ledgers?.dest?.[rumorEventKey('evt.shock')];
    expect(atDest, 'the rumor crossed to the destination via the column').toBeTruthy();
    expect(atDest.framing).toContain('refugee');
    expect(atDest.hopCount).toBeGreaterThanOrEqual(1);
  });

  it('migrantPathNeighbourMap links endpoints both ways with a migr-prefixed edge', () => {
    const map = migrantPathNeighbourMap([['origin', 'dest']]);
    expect(map.get('origin')).toEqual([{ neighbourId: 'dest', edgeId: 'migr.dest.origin' }]);
    expect(map.get('dest')).toEqual([{ neighbourId: 'origin', edgeId: 'migr.dest.origin' }]);
    expect(migrantPathNeighbourMap(null).size).toBe(0);
  });
});

// ── The flight event (part b) ────────────────────────────────────────────────
describe('the column itself becomes a migration_flight rumor', () => {
  it('seeds at both endpoints and relays to a trade neighbour with degraded fidelity', () => {
    const ids = ['origin', 'dest', 'watcher'];
    const digest = digestFor(ids);
    // A trade edge origin↔watcher so the flight event, once seeded at origin, relays to watcher.
    const graph = { channels: [tradeChannel('ch.o.w', 'origin', 'watcher')] };
    const migrationState = migrationWorld(ids, [column('origin', 'dest', 500, 5)]);
    const carrier = rumorCarrierParams({ carrierState: migrationState, migrationState, rules: { migrationRumorsEnabled: true } });
    let ledgers = null;
    for (let tick = 5; tick <= 11; tick += 1) {
      const r = advanceRumorLedgers({
        worldState: {
          simulationRules: { infoMode: 'unreliable' },
          spatialCanonVersion: 1, spatialDigest: digest,
          ...(ledgers ? { spatialLedgers: { rumorLedgers: ledgers } } : {}),
        },
        feedEntries: carrier.flightEntries, graph, tick,
        rng: createPRNG(`flight::${tick}`), migrantPaths: carrier.migrantPaths,
      });
      if (r.changed) ledgers = r.next;
    }
    const key = rumorEventKey('migration.origin.dest.5');
    // Witnessed firsthand at both endpoints.
    expect(ledgers?.origin?.[key], 'origin witnessed the exodus').toBeTruthy();
    expect(ledgers?.origin?.[key].content.what).toBe('migration_flight');
    expect(ledgers?.dest?.[key], 'destination witnessed the incoming column').toBeTruthy();
    // Relayed to the trade watcher at a distance (heard, not witnessed).
    const atWatcher = ledgers?.watcher?.[key];
    expect(atWatcher, 'the watcher heard of the flight').toBeTruthy();
    expect(atWatcher.hopCount).toBeGreaterThanOrEqual(1);
    expect(atWatcher.content.what).toBe('migration_flight');
    expect(atWatcher.content.whereId === 'origin' || atWatcher.content.partyIds.includes('origin')).toBe(true);
  });

  it('the refugee lane fires ONLY behind the carrier params (dark ⇒ no flight rumor)', () => {
    const ids = ['origin', 'dest', 'watcher'];
    const digest = digestFor(ids);
    const graph = { channels: [tradeChannel('ch.o.w', 'origin', 'watcher')] };
    const migrationState = migrationWorld(ids, [column('origin', 'dest', 500, 5)]);
    // Flag OFF ⇒ no flight entries, no migrant paths ⇒ nothing about the migration enters.
    const carrier = rumorCarrierParams({ carrierState: migrationState, migrationState, rules: { migrationRumorsEnabled: false } });
    let ledgers = null;
    for (let tick = 5; tick <= 11; tick += 1) {
      const r = advanceRumorLedgers({
        worldState: {
          simulationRules: { infoMode: 'unreliable' },
          spatialCanonVersion: 1, spatialDigest: digest,
          ...(ledgers ? { spatialLedgers: { rumorLedgers: ledgers } } : {}),
        },
        feedEntries: carrier.flightEntries, graph, tick,
        rng: createPRNG(`flight-dark::${tick}`), migrantPaths: carrier.migrantPaths,
      });
      if (r.changed) ledgers = r.next;
    }
    expect(ledgers).toBeNull(); // no events ⇒ no ledger materialized at all
  });
});

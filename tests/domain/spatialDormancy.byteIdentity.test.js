/**
 * spatialDormancy.byteIdentity.test.js — Phase 5.5 KEYSTONE dormancy contract.
 *
 * The constitutional pin: a campaign that never opts into the spatial canon must
 * be BYTE-IDENTICAL after this wave bolts on the marker + digest. The gate is the
 * PRESENCE of `spatialCanonVersion` — absent ⇒ no marker, no digest, no new keys.
 * Old saves have no marker ⇒ byte-identical forever (II.3-2).
 *
 * Uses the load-bearing dormancy oracle (normalizeForDormancy: absent === {} ===
 * [], key-sorted) that every "byte-identical" gate references, plus a raw
 * key-presence check that ensureWorldState adds ZERO spatial keys to an aspatial
 * save (the oracle would forgive an empty ledger; the raw check proves none is
 * even written).
 */
import { describe, expect, test } from 'vitest';

import { ensureWorldState, canonizeWorldState } from '../../src/domain/worldPulse/worldState.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

// A representative pre-KEYSTONE (aspatial) worldState: canonized, with the older
// conditional ledgers present, but NO spatial marker/digest anywhere.
function aspatialRaw() {
  return {
    schemaVersion: 1,
    rngSeed: 'aspatial-seed',
    tick: 9,
    calendar: { elapsedWeeks: 36, elapsedMonths: 9, month: 10, year: 1, season: 'autumn' },
    canonizedAt: '2026-01-01T00:00:00.000Z',
    volatility: 'normal',
    stressors: [{ id: 'world_stressor.famine.a', type: 'famine', severity: 0.6, age: 2, affectedSettlementIds: ['a'] }],
    relationshipStates: { 'edge.a.b': { label: 'rival', score: 10 } },
    proposals: [{ id: 'world_proposal.x', status: 'pending' }],
    dispositionStats: { 'edge.a.b': { trust: -2 } },
    // A present conditional ledger (rulesetLog) to prove spatial keys don't ride
    // in on the conditional pass unless actually present.
    rulesetLog: { rc_0_0: { tick: 0, changedKeys: ['warLayerEnabled'] } },
  };
}

const SPATIAL_KEYS = ['spatialCanonVersion', 'spatialDigest'];

describe('KEYSTONE dormancy — an aspatial save is byte-identical', () => {
  test('ensureWorldState adds ZERO spatial keys to an aspatial raw', () => {
    const ws = ensureWorldState(aspatialRaw(), { id: 'c1' });
    for (const key of SPATIAL_KEYS) expect(key in ws).toBe(false);
  });

  test('canonizeWorldState (the PLAIN canonize) adds ZERO spatial keys', () => {
    const ws = canonizeWorldState(aspatialRaw(), '2026-02-01T00:00:00.000Z', { id: 'c1' });
    for (const key of SPATIAL_KEYS) expect(key in ws).toBe(false);
    expect(ws.canonizedAt).toBe('2026-02-01T00:00:00.000Z');
  });

  test('normalized bytes are identical WITH vs WITHOUT the (absent) spatial layer', () => {
    // The oracle sees the same structure whether or not the spatial machinery
    // exists, because an un-opted-in campaign materializes none of it.
    const ws = ensureWorldState(aspatialRaw(), { id: 'c1' });
    const normalized = JSON.stringify(normalizeForDormancy(ws));
    // An identical raw that ALSO carries empty/garbage spatial fields must
    // normalize to the SAME bytes (empty/invalid ⇒ absent).
    const withEmptySpatial = ensureWorldState(
      { ...aspatialRaw(), spatialDigest: {}, spatialCanonVersion: 0 },
      { id: 'c1' },
    );
    expect(JSON.stringify(normalizeForDormancy(withEmptySpatial))).toBe(normalized);
  });

  test('idempotent round-trip — an aspatial save re-normalizes byte-identically', () => {
    const once = ensureWorldState(aspatialRaw(), { id: 'c1' });
    const twice = ensureWorldState(once, { id: 'c1' });
    expect(JSON.stringify(twice)).toBe(JSON.stringify(once));
    for (const key of SPATIAL_KEYS) expect(key in twice).toBe(false);
  });

  test('a garbage marker (string / negative / float) never materializes', () => {
    for (const bad of ['1', -1, 0, 1.5, null, {}, []]) {
      const ws = ensureWorldState({ ...aspatialRaw(), spatialCanonVersion: bad }, { id: 'c1' });
      expect('spatialCanonVersion' in ws).toBe(false);
    }
  });

  test('a VALID marker + digest DOES materialize (the oracle does real work)', () => {
    const ws = ensureWorldState({
      ...aspatialRaw(),
      spatialCanonVersion: 1,
      spatialDigest: { spatialGeometryVersion: 1, costLawVersion: 1, overlayVersion: 1, territory: [0, 1], reserved: {} },
    }, { id: 'c1' });
    expect(ws.spatialCanonVersion).toBe(1);
    expect(ws.spatialDigest).toBeTruthy();
    // …and its bytes differ from the aspatial normalization (non-vacuous).
    const aspatial = JSON.stringify(normalizeForDormancy(ensureWorldState(aspatialRaw(), { id: 'c1' })));
    expect(JSON.stringify(normalizeForDormancy(ws))).not.toBe(aspatial);
  });
});

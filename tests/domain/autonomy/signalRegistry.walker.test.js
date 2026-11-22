/**
 * tests/domain/autonomy/signalRegistry.walker.test.js — THE SIGNAL REGISTRY walker +
 * the ADDITIVE-ONLY ratchet (SURVEYOR S7).
 *
 *  1. THE WALKER: every registered signal RESOLVES against a real world state (the
 *     pulse-kernel-shaped fixture) and its value honors the entry's declared type,
 *     range, and closed vocabulary. A signal that cannot resolve is a registry lie —
 *     the walker makes honest registration structural.
 *  2. THE ADDITIVE-ONLY PIN (the inventory-shrinks-never pattern, inverted): the v1
 *     seed ids below are LITERALS, independent of the source constants — every pinned
 *     id must exist with its pinned meaning (type/scope/read) forever. Removing or
 *     re-meaning one fails here; ADDING entries never does. registerSignal itself
 *     refuses meaning drift.
 *  3. PURITY: resolution runs against a deep-frozen fixture — a single write throws.
 */

import { describe, expect, test, afterEach } from 'vitest';

import {
  signalRegistryEntries, signalById, registerSignal, resetMintedSignalsForTest,
  prepareSignalFrame, resolveSignal,
} from '../../../src/domain/autonomy/signalRegistry.js';
import { autonomyFixture, deepFreeze } from './fixture.js';

// ── the additive-only baseline: LITERAL ids (never derived from the source) ──────
const CAUSAL_VARIABLES = [
  'food_security', 'labor_capacity', 'public_legitimacy', 'ruling_authority',
  'faction_power', 'trade_connectivity', 'healing_capacity', 'defense_readiness',
  'criminal_opportunity', 'religious_authority', 'housing_pressure',
  'infrastructure_condition', 'magical_stability', 'social_trust',
  'economic_capacity', 'law_order',
];
const PRESSURES = ['food', 'disease', 'conflict', 'hostility', 'trade', 'economy', 'legitimacy', 'defense', 'crime'];

/** id → { type, scope, readKind, readKey } — the frozen v1 meaning. */
const SEED_BASELINE = new Map([
  ...CAUSAL_VARIABLES.flatMap((v) => [
    [`causal.${v}.score`, { type: 'number', scope: 'settlement', readKind: 'causalScore', readKey: v }],
    [`causal.${v}.band`, { type: 'band', scope: 'settlement', readKind: 'causalBand', readKey: v }],
  ]),
  ...PRESSURES.map((k) => [`pressure.${k}`, { type: 'number', scope: 'settlement', readKind: 'pressure', readKey: k }]),
  ['settlement.prosperity.band', { type: 'band', scope: 'settlement', readKind: 'prosperityBand', readKey: undefined }],
  ['settlement.legitimacy.score', { type: 'number', scope: 'settlement', readKind: 'legitimacyScore', readKey: undefined }],
  ['settlement.atWar', { type: 'bool', scope: 'settlement', readKind: 'atWar', readKey: undefined }],
  ['pair.relationship', { type: 'state', scope: 'pair', readKind: 'pairRelationship', readKey: undefined }],
  ['world.tick', { type: 'number', scope: 'world', readKind: 'tick', readKey: undefined }],
  ['world.season', { type: 'state', scope: 'world', readKind: 'season', readKey: undefined }],
]);

afterEach(() => resetMintedSignalsForTest());

describe('the additive-only ratchet (ids never vanish, meanings never drift)', () => {
  test('every baseline id is registered with its pinned meaning — 47 seed signals', () => {
    expect(SEED_BASELINE.size).toBe(47);
    for (const [id, meaning] of SEED_BASELINE) {
      const entry = signalById(id);
      expect(entry, `signal "${id}" vanished — the additive-only law forbids removal`).toBeTruthy();
      expect(entry.type, `${id} type drifted`).toBe(meaning.type);
      expect(entry.scope, `${id} scope drifted`).toBe(meaning.scope);
      expect(entry.read.kind, `${id} read.kind drifted`).toBe(meaning.readKind);
      expect(entry.read.key, `${id} read.key drifted`).toBe(meaning.readKey);
    }
  });

  test('the registry may GROW past the seed, never shrink below it', () => {
    expect(signalRegistryEntries().length).toBeGreaterThanOrEqual(SEED_BASELINE.size);
  });

  test('registerSignal refuses meaning drift on an existing id', () => {
    expect(() => registerSignal({
      id: 'world.tick', source: 'somewhere else', type: 'bool', scope: 'world',
      read: { kind: 'tick' }, description: 'drifted', origin: 'minted',
    })).toThrow(/never change meaning/i);
  });

  test('registerSignal is idempotent on a byte-identical re-registration', () => {
    const existing = signalById('world.tick');
    const again = registerSignal({ ...existing, read: { ...existing.read } });
    expect(again).toBe(existing);
    expect(signalRegistryEntries().length).toBe(47);
  });

  test('the tuning-window mint lane: a NEW data entry registers additively', () => {
    const minted = registerSignal({
      id: 'knob.test_example', source: 'tuning window (test)', type: 'number',
      scope: 'world', read: { kind: 'tick' }, min: 0, description: 'a minted knob entry', origin: 'minted',
    });
    expect(minted.origin).toBe('minted');
    expect(signalRegistryEntries().length).toBe(48);
    expect(signalById('knob.test_example')).toBe(minted);
  });
});

describe('THE WALKER: every registered signal resolves against a real world state', () => {
  const { campaign, saves } = autonomyFixture();
  deepFreeze(saves); // purity teeth: resolution must never write the world
  const frame = prepareSignalFrame({ campaign, saves });

  test('every entry resolves ok and honors its declared type/range/vocabulary', () => {
    for (const entry of signalRegistryEntries()) {
      const res = resolveSignal(entry, frame, { settlementId: 'ashford', otherId: 'bramwick' });
      expect(res.ok, `signal "${entry.id}" failed to resolve: ${res.ok ? '' : res.reason}`).toBe(true);
      const value = res.value;
      if (entry.type === 'number') {
        expect(typeof value, `${entry.id} must resolve a number`).toBe('number');
        expect(Number.isFinite(value), `${entry.id} resolved a non-finite number`).toBe(true);
        if (typeof entry.min === 'number') expect(value).toBeGreaterThanOrEqual(entry.min);
        if (typeof entry.max === 'number') expect(value).toBeLessThanOrEqual(entry.max);
      } else if (entry.type === 'band' || entry.type === 'state') {
        expect(typeof value, `${entry.id} must resolve a string`).toBe('string');
        expect(entry.values, `${entry.id} declares no vocabulary`).toBeTruthy();
        expect(entry.values.includes(value), `${entry.id} resolved "${value}" outside its vocabulary (${entry.values.join('/')})`).toBe(true);
      } else if (entry.type === 'bool') {
        expect(typeof value, `${entry.id} must resolve a boolean`).toBe('boolean');
      }
    }
  });

  test('the evolved relationship wins over the edge baseline (the pair read)', () => {
    const res = resolveSignal('pair.relationship', frame, { settlementId: 'ashford', otherId: 'bramwick' });
    expect(res).toEqual({ ok: true, value: 'rival' });
    // Symmetric: the pair reads the same from either side.
    const flipped = resolveSignal('pair.relationship', frame, { settlementId: 'bramwick', otherId: 'ashford' });
    expect(flipped).toEqual({ ok: true, value: 'rival' });
  });

  test('the legitimacy signal reads the SCORE, never the stale-prone label', () => {
    const res = resolveSignal('settlement.legitimacy.score', frame, { settlementId: 'ashford' });
    expect(res).toEqual({ ok: true, value: 54 });
  });

  test('scope discipline: settlement signals refuse a missing settlementId; pair refuses a missing otherId', () => {
    expect(resolveSignal('causal.food_security.score', frame, {})).toEqual({ ok: false, reason: 'settlement_required' });
    expect(resolveSignal('pair.relationship', frame, { settlementId: 'ashford' })).toEqual({ ok: false, reason: 'pair_required' });
  });

  test('an unknown settlement resolves ok:false — never a throw, never a value', () => {
    expect(resolveSignal('pressure.food', frame, { settlementId: 'ghost' })).toEqual({ ok: false, reason: 'unknown_settlement' });
  });

  test('an unregistered id resolves ok:false (the wall holds at the read layer too)', () => {
    expect(resolveSignal('not.a.signal', frame, { settlementId: 'ashford' })).toEqual({ ok: false, reason: 'unregistered_signal' });
  });

  test('determinism: two resolutions of the whole registry are JSON-identical', () => {
    const sweep = () => signalRegistryEntries().map((e) =>
      resolveSignal(e, frame, { settlementId: 'ashford', otherId: 'bramwick' }));
    expect(JSON.stringify(sweep())).toBe(JSON.stringify(sweep()));
  });
});

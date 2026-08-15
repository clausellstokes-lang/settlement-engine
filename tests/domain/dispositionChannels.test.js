import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  DISPOSITION_CHANNELS,
  DISPOSITION_CHANNEL_TUNING,
  advanceDispositionChannels,
  migrateDispositionStats,
  readDispositionChannel,
} from '../../src/domain/worldPulse/dispositionLedger.js';
import {
  DEITY_DOMAIN_PRESSURE,
  DEITY_THRESHOLD_CAP,
  deityPressureOf,
  thresholdFactorOf,
} from '../../src/domain/worldPulse/dispositionProfile.js';
import { ensureWorldState, WORLD_STATE_SCHEMA_VERSION } from '../../src/domain/worldPulse/worldState.js';
import { normalizeSimulationRules, SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';

const legacy = () => ({
  keep: { wins: 7, losses: 2, score: 5 },
  lose: { wins: 1, losses: 5, score: -4 },
});

describe('WR-2 disposition channels — the one-writer ledger', () => {
  it('migrates legacy score into martial and starts the other closed channels neutral', () => {
    const migrated = migrateDispositionStats(legacy(), 17);
    expect(Object.keys(migrated.keep.channels)).toEqual(DISPOSITION_CHANNELS);
    expect(migrated.keep).toMatchObject({ wins: 7, losses: 2, score: 5, updatedTick: 17 });
    expect(migrated.keep.channels.martial.stock01).toBeCloseTo(0.5 + 5 / 24, 10);
    for (const channel of ['mercantile', 'diplomatic', 'insular']) {
      expect(migrated.keep.channels[channel]).toEqual({ stock01: 0.5, band: 'settled' });
    }
    expect(migrateDispositionStats(migrated, 99)).toEqual(migrated);
  });

  it('decays each learned channel halfway toward neutral on the generational half-life', () => {
    const start = migrateDispositionStats({ a: { wins: 6, losses: 0, score: 6 } }, 0);
    start.a.channels.mercantile = { stock01: 0.9, band: 'dominant' };
    const { ledger } = advanceDispositionChannels(start, [], {
      enabled: true,
      tick: DISPOSITION_CHANNEL_TUNING.HALF_LIFE_TICKS,
    });
    expect(ledger.a.channels.martial.stock01 - 0.5)
      .toBeCloseTo((start.a.channels.martial.stock01 - 0.5) / 2, 6);
    expect(ledger.a.channels.mercantile.stock01).toBeCloseTo(0.7, 6);
    expect(ledger.a.score).toBeCloseTo(3, 5); // outer compatibility mirror follows martial
  });

  it('learns from outcomes only, reverses, and gives insularity the weaker inverse lesson', () => {
    const first = advanceDispositionChannels({}, [
      { id: 'a', channel: 'martial', outcome: 'win', magnitude: 2 },
      // This is not an outcome and cannot directly assign stock.
      { id: 'a', channel: 'mercantile', stock01: 1 },
    ], { enabled: true, tick: 1 });
    const martialShift = first.ledger.a.channels.martial.stock01 - 0.5;
    const insularShift = 0.5 - first.ledger.a.channels.insular.stock01;
    expect(martialShift).toBeGreaterThan(0);
    expect(insularShift).toBeGreaterThan(0);
    expect(insularShift).toBeLessThan(martialShift);
    expect(first.ledger.a.channels.mercantile.stock01).toBe(0.5);
    expect(first.ledger.a).toMatchObject({ wins: 1, losses: 0 });

    const reversed = advanceDispositionChannels(first.ledger, [
      { id: 'a', channel: 'martial', outcome: 'loss', magnitude: 3 },
    ], { enabled: true, tick: 2 });
    expect(reversed.ledger.a.channels.martial.stock01).toBeLessThan(0.5);
    expect(reversed.ledger.a).toMatchObject({ wins: 1, losses: 1 });
    expect(reversed.transitions).toContainEqual(expect.objectContaining({
      kind: 'reversal', id: 'a', channel: 'martial', direction: 'down', tick: 2,
    }));
  });

  it('keeps non-martial outcomes out of the legacy outer counters and folds permutations identically', () => {
    const deltas = [
      { id: 'b', channel: 'diplomatic', outcome: 'win', magnitude: 2 },
      { id: 'a', channel: 'mercantile', outcome: 'loss', magnitude: 1 },
      { id: 'b', channel: 'diplomatic', outcome: 'loss', magnitude: 0.5 },
    ];
    const forward = advanceDispositionChannels({}, deltas, { enabled: true, tick: 4 });
    const reverse = advanceDispositionChannels({}, [...deltas].reverse(), { enabled: true, tick: 4 });
    expect(reverse).toEqual(forward);
    expect(forward.ledger.b).toMatchObject({ wins: 0, losses: 0, score: 0 });
    expect(forward.ledger.b.channels.diplomatic.stock01).toBeGreaterThan(0.5);
  });

  it('lets identical realms diverge over a century only because their resolved histories differ', () => {
    const channels = ['martial', 'mercantile', 'diplomatic'];
    const advanceCentury = (outcome) => {
      let ledger = migrateDispositionStats({ seat: { wins: 0, losses: 0, score: 0 } }, 0);
      for (let year = 1; year <= 100; year += 1) {
        ledger = advanceDispositionChannels(ledger, [{
          id: 'seat',
          channel: channels[(year - 1) % channels.length],
          outcome,
        }], { enabled: true, tick: year * 52 }).ledger;
      }
      return ledger.seat;
    };

    const successfulHistory = advanceCentury('win');
    const failedHistory = advanceCentury('loss');
    expect(advanceCentury('win')).toEqual(successfulHistory); // no RNG or wall-clock input
    for (const channel of channels) {
      expect(successfulHistory.channels[channel].stock01, channel)
        .toBeGreaterThan(failedHistory.channels[channel].stock01);
    }
    expect(successfulHistory.channels.insular.stock01)
      .toBeLessThan(failedHistory.channels.insular.stock01);
    expect(successfulHistory.wins).toBeGreaterThan(failedHistory.wins);
    expect(successfulHistory.losses).toBeLessThan(failedHistory.losses);
  });

  it('disabled rich writer is exactly the legacy writer shape and never materializes channels', () => {
    const input = legacy();
    const result = advanceDispositionChannels(input, [
      { id: 'keep', channel: 'martial', outcome: 'win' },
    ], { enabled: false, tick: 99 });
    expect(result.transitions).toEqual([]);
    expect(result.ledger.keep).toEqual({ wins: 8, losses: 2, score: 6 });
    expect(result.ledger.keep.channels).toBeUndefined();
  });
});

describe('WR-2 disposition profile — bounded bars and ratified deity domains', () => {
  it('caps threshold reads and keeps absent/unknown channels exactly neutral', () => {
    expect(thresholdFactorOf(null, 'martial')).toMatchObject({
      factor: 1, channel: 'martial', direction: 'neutral',
    });
    expect(thresholdFactorOf(null, 'martial').receipt).toMatch(/balanced/i);
    expect(thresholdFactorOf({ channels: { martial: { stock01: 1 } } }, 'martial').factor)
      .toBe(1 - DISPOSITION_CHANNEL_TUNING.THRESHOLD_FACTOR_CAP);
    expect(thresholdFactorOf({ channels: { martial: { stock01: 0 } } }, 'martial').factor)
      .toBe(1 + DISPOSITION_CHANNEL_TUNING.THRESHOLD_FACTOR_CAP);
    expect(thresholdFactorOf({ channels: { martial: { stock01: 1 } } }, 'victim'))
      .toMatchObject({ factor: 1, direction: 'neutral' });
  });

  it('gives mechanics only to war, conquest, hunt, and harvest domains', () => {
    expect(DEITY_DOMAIN_PRESSURE).toEqual({ war: 1, conquest: 1, hunt: 0.5, harvest: -1 });
    const pressure = (domain) => deityPressureOf({
      config: { primaryDeitySnapshot: { name: 'Patron', domain } },
    });
    expect(pressure('War')).toMatchObject({ domain: 'war', direction: 'war', pressure: 1 });
    expect(pressure('conquest').thresholdFactor).toBe(1 - DEITY_THRESHOLD_CAP);
    expect(pressure('hunt').pressure).toBe(0.5);
    expect(pressure('harvest')).toMatchObject({ direction: 'peace', pressure: -1 });
    expect(pressure('storms')).toEqual({
      domain: null, direction: 'neutral', pressure: 0, warPressure01: 0,
      thresholdFactor: 1, suppressed: false, contradictions: [],
      receipt: 'No supported local patron domain changes this court\'s bar for war.',
    });
  });

  it('gives every threshold/deity scorer result a qualitative causal receipt', () => {
    const entry = migrateDispositionStats({ a: { wins: 5, losses: 1, score: 4 } }, 0).a;
    const thresholdReads = [
      ...DISPOSITION_CHANNELS.map((channel) => thresholdFactorOf(entry, channel)),
      thresholdFactorOf(entry, 'unsupported'),
    ];
    const deityReads = ['war', 'conquest', 'hunt', 'harvest', 'storms'].map((domain) => deityPressureOf({
      config: { primaryDeitySnapshot: { name: 'Patron', domain } },
    }, entry));
    for (const read of [...thresholdReads, ...deityReads]) {
      expect(read.receipt).toEqual(expect.any(String));
      expect(read.receipt.trim().length).toBeGreaterThan(0);
      expect(read.receipt).not.toMatch(/\d|%|×/);
    }
  });

  it('makes peaceable culture + harvest patron + losses incoherent as war pressure', () => {
    const entry = migrateDispositionStats({ a: { wins: 1, losses: 6, score: -5 } }, 0).a;
    const read = deityPressureOf({
      config: { primaryDeitySnapshot: { name: 'The Sower', domain: 'harvest' } },
    }, entry);
    expect(read).toMatchObject({
      direction: 'peace', pressure: -1, warPressure01: 0, suppressed: true,
      contradictions: ['peaceable_culture', 'harvest_patron', 'loss_history'],
    });
    expect(read.thresholdFactor).toBeGreaterThan(1);
  });

  it('has no graph, relationship, candidate, or target-selector import surface', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/domain/worldPulse/dispositionProfile.js'), 'utf8');
    const imports = [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((match) => match[1]);
    expect(imports).toEqual(['./dispositionLedger.js']);
    expect(imports.some((path) => /graph|relationship|candidate|target|selector/i.test(path))).toBe(false);
  });
});

describe('WR-2 lifecycle — virtual flag and same-schema migration', () => {
  const raw = () => ({
    schemaVersion: WORLD_STATE_SCHEMA_VERSION,
    tick: 23,
    simulationRules: { warLayerEnabled: true },
    dispositionStats: legacy(),
  });

  it('keeps absent and explicit false byte-exact at the legacy ledger boundary', () => {
    const absent = ensureWorldState(raw());
    const explicitFalse = ensureWorldState({
      ...raw(),
      simulationRules: { warLayerEnabled: true, dispositionChannelsEnabled: false },
    });
    expect(absent.dispositionStats).toEqual(legacy());
    expect(explicitFalse.dispositionStats).toEqual(legacy());
    for (const entry of Object.values(absent.dispositionStats)) expect(entry.channels).toBeUndefined();
  });

  it('migrates only on an explicit true mid-world flip, without a schema bump', () => {
    const before = ensureWorldState(raw());
    const after = ensureWorldState({
      ...before,
      simulationRules: { ...before.simulationRules, dispositionChannelsEnabled: true },
    });
    expect(after.schemaVersion).toBe(before.schemaVersion);
    expect(after.schemaVersion).toBe(WORLD_STATE_SCHEMA_VERSION);
    expect(after.dispositionStats.keep.score).toBe(5);
    expect(Object.keys(after.dispositionStats.keep.channels)).toEqual(DISPOSITION_CHANNELS);
    expect(after.dispositionStats.keep.updatedTick).toBe(23);
  });

  it('round-trips old and extended JSON, never re-derives an extended shape, and preserves it when later dark', () => {
    const oldRoundTrip = ensureWorldState(JSON.parse(JSON.stringify(raw())));
    expect(oldRoundTrip.dispositionStats).toEqual(legacy());

    const lit = ensureWorldState({
      ...raw(),
      simulationRules: { warLayerEnabled: true, dispositionChannelsEnabled: true },
    });
    lit.dispositionStats.keep.channels.mercantile = { stock01: 0.83, band: 'dominant' };
    const extendedRoundTrip = ensureWorldState(JSON.parse(JSON.stringify(lit)));
    expect(extendedRoundTrip.dispositionStats).toEqual(lit.dispositionStats);

    const darkAgain = ensureWorldState({
      ...extendedRoundTrip,
      simulationRules: { ...extendedRoundTrip.simulationRules, dispositionChannelsEnabled: false },
    });
    expect(darkAgain.dispositionStats).toEqual(extendedRoundTrip.dispositionStats);
  });

  it('preserves every learned channel across lit → dark outcome → relight', () => {
    const learned = migrateDispositionStats({ keep: { wins: 3, losses: 1, score: 2 } }, 7);
    learned.keep.channels.mercantile = { stock01: 0.83, band: 'dominant' };
    learned.keep.channels.diplomatic = { stock01: 0.24, band: 'measured' };
    learned.keep.channels.insular = { stock01: 0.71, band: 'marked' };
    const remembered = JSON.parse(JSON.stringify(learned.keep.channels));

    const darkOutcome = advanceDispositionChannels(learned, [
      { id: 'keep', channel: 'martial', outcome: 'loss' },
    ], { enabled: false, tick: 7 });
    expect(darkOutcome.ledger.keep.channels).toEqual(remembered);

    const relit = advanceDispositionChannels(darkOutcome.ledger, [], { enabled: true, tick: 7 });
    expect(relit.ledger.keep.channels).toEqual(remembered);
    expect(relit.ledger.keep).toMatchObject({ wins: 3, losses: 2 });
  });

  it('keeps the flag virtual by default and declares Full Simulation dark', () => {
    expect(normalizeSimulationRules().dispositionChannelsEnabled).toBeUndefined();
    expect(SIMULATION_RULE_PRESETS.full_simulation.rules.dispositionChannelsEnabled).toBe(false);
  });
});

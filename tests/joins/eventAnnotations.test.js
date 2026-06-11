/**
 * Join harness — the population/strike event annotations survive
 * regeneration.
 *
 * The seam: REFUGEE_WAVE, PLAGUE, and RAID_OR_MONSTER_ATTACK record
 * themselves as settlement-level annotations (config._refugeeWaves /
 * _activePlague / _raidHistory) that downstream reruns and the AI grounding
 * read. Unlike CUT_TRADE_ROUTE's _cutRoutes, they were written into config
 * ONLY — and applyChange regenerates from the raw _config first, so the
 * annotations died on the first what-if regeneration while their promoted
 * conditions survived via config.eventConditions. The handlers now mirror
 * the annotation into _config (the withCustomTradeGoods dual-write
 * discipline); the pipeline's effectiveConfig spreads unknown keys through,
 * which is what carries them across a full regeneration.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { stripDerivedConfigKeys } from '../../src/store/settlementSlice.js';

const NOW = '2026-06-11T00:00:00.000Z';

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

const BASE_CFG = {
  settType: 'town',
  culture: 'germanic',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
};

const SEED = 'ec-rt-1';

/** Exactly how settlementSlice.applyChange rebuilds the next run's input. */
const buildNextConfig = (settlement) => ({
  ...(settlement?._config
    || stripDerivedConfigKeys(settlement?.config)
    || {}),
});

const ev = (type, overrides = {}) => ({
  id: `ev_${type.toLowerCase()}`,
  type,
  targetId: '',
  payload: {},
  cause: 'player_action',
  ...overrides,
});

function deepFreeze(o) {
  if (o && typeof o === 'object') {
    Object.freeze(o);
    for (const k of Object.keys(o)) deepFreeze(o[k]);
  }
  return o;
}

const mutate = (settlement, event) =>
  mutateSettlement({ settlement: deepFreeze(settlement), event, now: NOW });

describe('join: REFUGEE_WAVE annotation survives a full regeneration', () => {
  test('the wave lands in BOTH config formats and rides through the regen', () => {
    const s1 = gen(BASE_CFG, SEED);
    const wave = mutate(s1, ev('REFUGEE_WAVE', {
      id: 'ev-wave', targetId: 'the_burned_coast', payload: { size: 'large' },
    }));
    expect(wave.config._refugeeWaves).toHaveLength(1);
    expect(wave.config._refugeeWaves[0]).toMatchObject({ size: 'large', fromRegion: 'the_burned_coast', atEventId: 'ev-wave' });
    // The mirror — without it the annotation died on the first applyChange.
    expect(wave._config._refugeeWaves).toEqual(wave.config._refugeeWaves);

    const s2 = gen(buildNextConfig(wave), SEED);
    expect(s2.config._refugeeWaves).toEqual(wave.config._refugeeWaves);
    expect(s2._config._refugeeWaves).toEqual(wave.config._refugeeWaves);
  });

  test('a second wave on the REGENERATED settlement accumulates — chained what-ifs keep working', () => {
    const s1 = gen(BASE_CFG, SEED);
    const s2 = gen(buildNextConfig(mutate(s1, ev('REFUGEE_WAVE', {
      id: 'ev-wave-1', targetId: 'the_burned_coast', payload: { size: 'large' },
    }))), SEED);

    const again = mutate(s2, ev('REFUGEE_WAVE', {
      id: 'ev-wave-2', targetId: 'the_salt_marches', payload: { size: 'small' },
    }));
    expect(again.config._refugeeWaves.map(w => w.atEventId)).toEqual(['ev-wave-1', 'ev-wave-2']);
    expect(again._config._refugeeWaves).toHaveLength(2);

    const s3 = gen(buildNextConfig(again), SEED);
    expect(s3._config._refugeeWaves.map(w => w.atEventId)).toEqual(['ev-wave-1', 'ev-wave-2']);
  });
});

describe('join: PLAGUE annotation survives a full regeneration', () => {
  test('_activePlague lands in BOTH config formats and rides through the regen', () => {
    const s1 = gen(BASE_CFG, SEED);
    const sick = mutate(s1, ev('PLAGUE', {
      id: 'ev-plague', targetId: 'Red sweat', payload: { severity: 0.8 },
    }));
    expect(sick.config._activePlague).toMatchObject({ name: 'Red sweat', severity: 0.8, atEventId: 'ev-plague' });
    expect(sick._config._activePlague).toEqual(sick.config._activePlague);

    const s2 = gen(buildNextConfig(sick), SEED);
    expect(s2.config._activePlague).toEqual(sick.config._activePlague);
    expect(s2._config._activePlague).toEqual(sick.config._activePlague);
  });
});

describe('join: RAID_OR_MONSTER_ATTACK annotation survives a full regeneration', () => {
  test('_raidHistory lands in BOTH config formats, rides through, and accumulates', () => {
    const s1 = gen(BASE_CFG, SEED);
    const raided = mutate(s1, ev('RAID_OR_MONSTER_ATTACK', {
      id: 'ev-raid-1', targetId: 'goblin_warband', payload: { severity: 0.6 },
    }));
    expect(raided.config._raidHistory).toHaveLength(1);
    expect(raided._config._raidHistory).toEqual(raided.config._raidHistory);

    const s2 = gen(buildNextConfig(raided), SEED);
    expect(s2._config._raidHistory).toHaveLength(1);

    const again = mutate(s2, ev('RAID_OR_MONSTER_ATTACK', {
      id: 'ev-raid-2', targetId: 'the_pale_wyrm', payload: { severity: 0.8 },
    }));
    const s3 = gen(buildNextConfig(again), SEED);
    expect(s3._config._raidHistory.map(r => r.atEventId)).toEqual(['ev-raid-1', 'ev-raid-2']);
    expect(s3.config._raidHistory).toEqual(s3._config._raidHistory);
  });
});

describe('join: the mirror never invents a _config', () => {
  test('a legacy settlement without _config does not grow one', () => {
    const legacy = {
      name: 'Oldsave', tier: 'town', institutions: [], npcs: [],
      activeConditions: [], config: {},
    };
    const wave = mutate(legacy, ev('REFUGEE_WAVE', { id: 'ev-w', targetId: 'x', payload: { size: 'small' } }));
    expect(wave.config._refugeeWaves).toHaveLength(1);
    expect('_config' in wave).toBe(false);

    const sick = mutate(legacy, ev('PLAGUE', { id: 'ev-p', targetId: 'pox' }));
    expect('_config' in sick).toBe(false);

    const raided = mutate(legacy, ev('RAID_OR_MONSTER_ATTACK', { id: 'ev-r', targetId: 'raiders' }));
    expect('_config' in raided).toBe(false);
  });
});

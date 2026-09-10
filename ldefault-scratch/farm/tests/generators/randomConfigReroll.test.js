/**
 * tests/generators/randomConfigReroll.test.js — 'random' settings re-roll.
 *
 * The user-reported bug: settings chosen as 'random' pre-generation kept the
 * FIRST generation's concrete choice on every regenerate. Root cause: the
 * pipeline resolved sentinels into effectiveConfig, persisted that as
 * settlement.config, and downstream flows treated it as the generation input.
 * Pins:
 *   • the settlement now carries the RAW config (sentinels intact) as
 *     settlement._config, alongside the resolved settlement.config;
 *   • regenerating from the RAW config with fresh seeds re-rolls the
 *     random fields (and stays deterministic for a repeated seed);
 *   • the 'Random' slider mode (_randomizePriorities) actually rolls
 *     priorities — previously a documented no-op that always produced 50s.
 */

import { describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const RANDOM_CONFIG = Object.freeze({
  settType: 'random',
  culture: 'random_culture',
  tradeRouteAccess: 'random_trade',
  monsterThreat: 'random_threat',
  terrainOverride: 'auto',
});

function generate(config, seed) {
  return generateSettlementPipeline({ ...config }, null, { seed, customContent: {} });
}

describe('random sentinels survive and re-roll', () => {
  test('the settlement carries the raw config with sentinels intact', () => {
    const s = generate(RANDOM_CONFIG, 'reroll-A');
    expect(s._config.culture).toBe('random_culture');
    expect(s._config.settType).toBe('random');
    expect(s._config.tradeRouteAccess).toBe('random_trade');
    expect(s._config.monsterThreat).toBe('random_threat');
    // The resolved config holds concrete choices for THIS generation.
    expect(s.config.culture).not.toBe('random_culture');
    expect(s.config.tradeRouteAccess).not.toBe('random_trade');
    expect(s.config.monsterThreat).not.toBe('random_threat');
  });

  test('regenerating from the RAW config with fresh seeds varies the random fields', () => {
    const first = generate(RANDOM_CONFIG, 'reroll-A');
    // Simulate the fixed regenerate flow: feed settlement._config (NOT the
    // resolved settlement.config) back into the pipeline with new seeds.
    const runs = ['reroll-B', 'reroll-C', 'reroll-D', 'reroll-E', 'reroll-F']
      .map(seed => generate(first._config, seed));
    const signatures = new Set([first, ...runs].map(s =>
      `${s.tier}|${s.config.culture}|${s.config.tradeRouteAccess}|${s.config.monsterThreat}`));
    // Six fresh seeds across four random dimensions: collisions on every
    // dimension simultaneously would mean the sentinels were lost.
    expect(signatures.size).toBeGreaterThan(1);
  });

  test('the OLD bug shape: regenerating from the RESOLVED config pins the choices', () => {
    const first = generate(RANDOM_CONFIG, 'reroll-A');
    const again = generate(first.config, 'reroll-Z');
    // Documents why _config matters: the resolved config has no sentinels
    // left (settType excepted), so culture/route/threat can never re-roll.
    expect(again.config.culture).toBe(first.config.culture);
    expect(again.config.tradeRouteAccess).toBe(first.config.tradeRouteAccess);
    expect(again.config.monsterThreat).toBe(first.config.monsterThreat);
  });

  test('a repeated seed reproduces the same resolution (determinism preserved)', () => {
    const a = generate(RANDOM_CONFIG, 'reroll-same');
    const b = generate(RANDOM_CONFIG, 'reroll-same');
    expect(b.config.culture).toBe(a.config.culture);
    expect(b.config.tradeRouteAccess).toBe(a.config.tradeRouteAccess);
    expect(b.tier).toBe(a.tier);
  });
});

describe('random slider mode actually rolls', () => {
  const PRIORITY_KEYS = ['priorityEconomy', 'priorityMilitary', 'priorityReligion', 'priorityCriminal', 'priorityMagic'];

  test('without the flag, priorities default flat (legacy behavior)', () => {
    const s = generate({ settType: 'town' }, 'slider-A');
    for (const key of PRIORITY_KEYS) {
      expect(s.config[key]).toBe(50);
    }
  });

  test('with the flag, priorities roll per seed and reproduce for a repeated seed', () => {
    const a = generate({ settType: 'town', _randomizePriorities: true }, 'slider-A');
    const b = generate({ settType: 'town', _randomizePriorities: true }, 'slider-B');
    const a2 = generate({ settType: 'town', _randomizePriorities: true }, 'slider-A');
    // Rolled, not flat:
    expect(PRIORITY_KEYS.some(key => a.config[key] !== 50)).toBe(true);
    // Fresh seed -> different rolls (across five dials, identical sets would
    // mean the roll isn't seeded per generation):
    expect(PRIORITY_KEYS.map(k => a.config[k]).join(','))
      .not.toBe(PRIORITY_KEYS.map(k => b.config[k]).join(','));
    // Same seed -> identical rolls:
    expect(PRIORITY_KEYS.map(k => a2.config[k]).join(','))
      .toBe(PRIORITY_KEYS.map(k => a.config[k]).join(','));
  });

  test('no-magic mode still zeroes the magic priority even when rolling', () => {
    const s = generate({ settType: 'town', magicExists: false, _randomizePriorities: true }, 'slider-C');
    expect(s.config.priorityMagic).toBe(0);
  });
});

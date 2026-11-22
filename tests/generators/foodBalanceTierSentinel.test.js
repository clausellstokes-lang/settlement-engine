/**
 * foodBalanceTierSentinel.test.js — [generators-domain-5].
 *
 * Same tier-sentinel class as servicesGeneratorTierSentinel: the magic-agriculture
 * production boost in deriveFoodBalanceAnalysis keyed off the RAW settType
 * ('town'/'city'/'metropolis'), so on the default 'random' path (settType='random',
 * tier='town') it was dead — the +0.3 agriMod boost never applied even at magic 90
 * with a druid/wizard institution present, but DID apply when the user explicitly
 * picked 'town'. The fix reads config.tier || config.settType.
 *
 * Observable: the +0.3 agriMod boost lifts foodBalance.dailyProduction. A
 * random-mode town+ with high magic must now match the explicit town's production,
 * and exceed the same settlement's low-magic production. A small resolved tier
 * gets no boost regardless of magic level.
 */

import { describe, test, expect } from 'vitest';
import { deriveFoodBalanceAnalysis } from '../../src/generators/economy/foodBalance.js';

const TERRAIN = { agricultureCapacity: 1 };
const MAGIC_INSTS = [{ name: 'Druid grove' }, { name: 'Grain granary' }];
const prod = (config) => deriveFoodBalanceAnalysis(2000, TERRAIN, MAGIC_INSTS, config).foodBalance.dailyProduction;

describe('[generators-domain-5] magic-agriculture boost reads the resolved tier', () => {
  test('a random-mode town (tier=town) gets the same magic boost as an explicit town', () => {
    // Pre-fix the random path (settType=random) missed the boost; now both match.
    expect(prod({ settType: 'random', tier: 'town', priorityMagic: 90 }))
      .toBe(prod({ settType: 'town', priorityMagic: 90 }));
  });

  test('the boost genuinely lifts production on the random town+ path (non-vacuous)', () => {
    expect(prod({ settType: 'random', tier: 'town', priorityMagic: 90 }))
      .toBeGreaterThan(prod({ settType: 'random', tier: 'town', priorityMagic: 50 }));
  });

  test('a small resolved tier (village) gets no magic boost even at high magic', () => {
    // isMagicHighTier is false for village → high and low magic produce the same.
    expect(prod({ settType: 'random', tier: 'village', priorityMagic: 90 }))
      .toBe(prod({ settType: 'random', tier: 'village', priorityMagic: 50 }));
  });
});

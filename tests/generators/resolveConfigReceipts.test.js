/**
 * resolveConfig receipt honesty (Wave 6 #1b).
 *
 * Two overrides fired on EXPLICIT user choices with no trace at all:
 *   - the isolated→road rewrite (town-plus + no-magic) was only traced on the
 *     random_trade pool path;
 *   - the plagued military floor was only traced on the random_threat path.
 * And one receipt lied: the random_threat trace claimed priorityMilitary was
 * 'floored to 25' for EVERY plagued roll, even when the user's slider was
 * already ≥ 25 and nothing changed.
 *
 * Pins: explicit overrides leave receipts; receipts only claim the floor when
 * it actually bound; untouched explicit choices leave no override receipt.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

const BASE_CFG = {
  culture: 'germanic',
  monsterThreat: 'frontier',
  tradeRouteAccess: 'road',
};

const configTraces = (s) => (s.simulationTrace || []).filter(t => t.step === 'resolveConfig');
const floorEffects = (s) => configTraces(s).flatMap(t =>
  (t.downstreamEffects || []).filter(e => e.target === 'priorityMilitary' && /floored/i.test(e.effect || '')),
);

// ── Explicit isolated → road rewrite ─────────────────────────────────────────

describe('explicit isolated rewrite carries a receipt', () => {
  test('town + no-magic + explicit isolated → road, with an overridden trace', () => {
    const s = gen(
      { ...BASE_CFG, settType: 'town', magicExists: false, tradeRouteAccess: 'isolated' },
      'receipts-iso-town',
    );
    expect(s.config.tradeRouteAccess).toBe('road');

    const receipt = configTraces(s).find(t => t.result === 'overridden' && t.targetId === 'tradeRoute.road');
    expect(receipt, 'the explicit rewrite must leave a receipt').toBeTruthy();
    expect((receipt.causes || []).map(c => c.source)).toContain('config.tradeRouteAccess=isolated');
    expect((receipt.downstreamEffects || []).map(e => e.target)).toContain('economicViability');
  });

  test('village + no-magic keeps explicit isolated — no override receipt', () => {
    const s = gen(
      { ...BASE_CFG, settType: 'village', magicExists: false, tradeRouteAccess: 'isolated' },
      'receipts-iso-village',
    );
    expect(s.config.tradeRouteAccess).toBe('isolated');
    expect(configTraces(s).filter(t => t.result === 'overridden' && t.targetId.startsWith('tradeRoute.'))).toEqual([]);
  });

  test('town WITH magic keeps explicit isolated — no override receipt', () => {
    const s = gen(
      { ...BASE_CFG, settType: 'town', magicExists: true, priorityMagic: 60, tradeRouteAccess: 'isolated' },
      'receipts-iso-magic',
    );
    expect(s.config.tradeRouteAccess).toBe('isolated');
    expect(configTraces(s).filter(t => t.result === 'overridden' && t.targetId.startsWith('tradeRoute.'))).toEqual([]);
  });
});

// ── Explicit plagued military floor ──────────────────────────────────────────

describe('explicit plagued floor carries a receipt only when it binds', () => {
  test('explicit plagued + low slider → floored, with an overridden trace', () => {
    const s = gen(
      { ...BASE_CFG, settType: 'town', monsterThreat: 'plagued', priorityMilitary: 10 },
      'receipts-floor-low',
    );
    expect(s.config.priorityMilitary).toBe(25);

    const receipt = configTraces(s).find(t => t.result === 'overridden' && t.targetId === 'monsterThreat.plagued');
    expect(receipt, 'the explicit floor must leave a receipt').toBeTruthy();
    expect((receipt.causes || []).map(c => c.source)).toContain('config.monsterThreat=plagued');
    expect(floorEffects(s).length).toBeGreaterThan(0);
  });

  test("legacy 'high' (normalizes to plagued) is receipted under its own name", () => {
    const s = gen(
      { ...BASE_CFG, settType: 'town', monsterThreat: 'high', priorityMilitary: 10 },
      'receipts-floor-high',
    );
    expect(s.config.priorityMilitary).toBe(25);
    const receipt = configTraces(s).find(t => t.result === 'overridden' && t.targetId === 'monsterThreat.plagued');
    expect(receipt).toBeTruthy();
    expect((receipt.causes || []).map(c => c.source)).toContain('config.monsterThreat=high');
  });

  test('explicit plagued + slider already ≥ 25 → no floor, no floor claim', () => {
    const s = gen(
      { ...BASE_CFG, settType: 'town', monsterThreat: 'plagued', priorityMilitary: 60 },
      'receipts-floor-none',
    );
    expect(s.config.priorityMilitary).toBe(60);
    expect(floorEffects(s)).toEqual([]);
    expect(configTraces(s).filter(t => t.result === 'overridden' && t.targetId.startsWith('monsterThreat.'))).toEqual([]);
  });
});

// ── The false receipt on the rolled path ─────────────────────────────────────

describe('random_threat receipt only claims the floor when it bound', () => {
  // Scan a fixed seed list for a random_threat roll that lands 'plagued'.
  // Deterministic: fixed list, first hit wins. priorityMilitary does not
  // draw rng, so the same seed rolls the same threat for both slider values.
  const findPlaguedSeed = () => {
    for (let i = 1; i <= 20; i++) {
      const seed = `receipts-rolled-${i}`;
      const s = gen({ ...BASE_CFG, settType: 'town', monsterThreat: 'random_threat', priorityMilitary: 80 }, seed);
      if (s.config.monsterThreat === 'plagued') return seed;
    }
    return null;
  };

  test('rolled plagued: floor claim tracks whether the slider was under 25', () => {
    const seed = findPlaguedSeed();
    expect(seed, 'no plagued roll found in seed list').toBeTruthy();

    // Slider ≥ 25: the rolled receipt exists but must NOT claim a floor.
    const high = gen({ ...BASE_CFG, settType: 'town', monsterThreat: 'random_threat', priorityMilitary: 80 }, seed);
    expect(high.config.monsterThreat).toBe('plagued');
    expect(high.config.priorityMilitary).toBe(80);
    const rolled = configTraces(high).find(t => t.result === 'rolled' && t.targetId === 'monsterThreat.plagued');
    expect(rolled, 'the rolled-threat receipt must still exist').toBeTruthy();
    expect(floorEffects(high)).toEqual([]);

    // Slider < 25: same roll, and now the floor claim is true.
    const low = gen({ ...BASE_CFG, settType: 'town', monsterThreat: 'random_threat', priorityMilitary: 10 }, seed);
    expect(low.config.monsterThreat).toBe('plagued');
    expect(low.config.priorityMilitary).toBe(25);
    expect(floorEffects(low).length).toBeGreaterThan(0);
    // The explicit-path receipt must NOT also fire for rolled threats.
    expect(configTraces(low).filter(t => t.result === 'overridden' && t.targetId.startsWith('monsterThreat.'))).toEqual([]);
  });
});

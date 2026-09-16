/**
 * realmScaling.test.js — D2 THE SCALING LAW pins (DESIGN_SIM_DEPTH_R2 §D2).
 *
 * Realm-global budgets grow √-sublinearly in realm size N, reducing to their exact base
 * value at N ≤ BASE_REALM (dormancy by ARITHMETIC — every existing golden/soak runs N ≤ 12,
 * so the whole estate is byte-identical). Design pins: (1) N ≤ BASE ⇒ base exactly (the
 * load-bearing golden — proven estate-wide by tempo/worldpulseSpatial/cacophonySoak staying
 * green); (2) monotone sublinearity; (5) determinism. supplyShipments top-k (D2b) is VERIFIED
 * realm-size-invariant (local per-destination k), so it is deliberately left unchanged.
 */
import { describe, it, expect } from 'vitest';
import { sublinearBonus, sublinearBudget, REALM_SCALING } from '../../src/domain/worldPulse/realmScaling.js';
import { buildTempoContext, TEMPO_BUDGETS } from '../../src/domain/worldPulse/narrativeTempo.js';
import { rankSupplySources, SUPPLY_TUNING } from '../../src/domain/spatial/supplyShipments.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const B = REALM_SCALING.BASE_REALM;

describe('D2 — the sublinear scaler', () => {
  it('PIN 1: N ≤ BASE_REALM ⇒ the base value EXACTLY (byte-identity by arithmetic)', () => {
    for (const n of [0, 1, 8, 12, B - 1, B]) {
      expect(sublinearBonus(n)).toBe(0);
      expect(sublinearBudget(7, n)).toBe(7);
      expect(sublinearBudget(5, n)).toBe(5);
    }
    expect(sublinearBonus(NaN)).toBe(0); // non-finite ⇒ 0 (never rides through)
  });

  it('PIN 2: monotone non-decreasing, and SUBLINEAR (√) — 4× the excess only 2× the bonus', () => {
    expect(sublinearBonus(B + 1)).toBe(1);
    expect(sublinearBonus(B + 100)).toBe(10); // √100
    expect(sublinearBonus(B + 400)).toBe(20); // √400 — quadrupling excess doubles the bonus
    // Monotone across the base boundary:
    expect(sublinearBudget(7, B + 100)).toBeGreaterThan(sublinearBudget(7, B + 25));
    expect(sublinearBudget(7, B + 25)).toBeGreaterThanOrEqual(sublinearBudget(7, B));
    // The design's bound (active scaling, base 0): budget(100) < 2 × budget(25).
    expect(sublinearBudget(7, 100, 0, 1)).toBeLessThan(2 * sublinearBudget(7, 25, 0, 1));
  });

  it('PIN 5: deterministic and order-independent (reads only the scalar N)', () => {
    expect(sublinearBudget(5, 137)).toBe(sublinearBudget(5, 137));
    expect(sublinearBonus(200, 24, 1)).toBe(sublinearBonus(200, 24, 1));
  });
});

describe('D2a — tempo classMax scaling (attention density stays realm-invariant)', () => {
  const ctx = (n) => buildTempoContext({ calendar: { elapsedWeeks: 10 } }, { narrativeTempo: 'dramatic_campaign' }, n);
  it('N ≤ BASE returns the FROZEN budgets object unchanged (byte-identical classMax)', () => {
    const small = ctx(8);
    expect(small.budgets).toBe(TEMPO_BUDGETS.dramatic_campaign); // same frozen reference, no scaled copy
    expect(small.budgets.classMax).toBe(3);
  });
  it('N > BASE raises classMax by the sublinear bonus (a big realm gets more attention)', () => {
    const big = ctx(B + 100);
    expect(big.budgets.classMax).toBe(TEMPO_BUDGETS.dramatic_campaign.classMax + 10);
    expect(big.budgets.arcMax).toBe(TEMPO_BUDGETS.dramatic_campaign.arcMax); // arcMax unchanged (classMax only)
  });
});

describe('D2c — decision throughput scaling (the exact expressions the pulse uses)', () => {
  it('maxAuto/maxProposals are 7/5 at N ≤ BASE and grow √-sublinearly above it', () => {
    const A = REALM_SCALING.AUTO_SCALE_PER_ROOT;
    const P = REALM_SCALING.PROPOSAL_SCALE_PER_ROOT;
    expect(sublinearBudget(7, B, B, A)).toBe(7);
    expect(sublinearBudget(5, B, B, P)).toBe(5);
    expect(sublinearBudget(7, B + 100, B, A)).toBe(17); // 7 + √100
    expect(sublinearBudget(5, B + 100, B, P)).toBe(15); // 5 + √100
  });
});

describe('D2b — supplyShipments top-k is realm-size-INVARIANT (verified local, unchanged)', () => {
  it('rankSupplySources keeps at most K_SOURCES regardless of how many producers exist', () => {
    const pack = makeGridPack({ cols: 24, rows: 18 });
    const ids = Array.from({ length: 20 }, (_, i) => `s${i}`);
    const placed = placeSettlements(pack, ids.length);
    const digest = buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: ids[i], cellId: p.cellId })) });
    const producers = ids.slice(1); // 19 candidate producers for one consumer
    const ranked = rankSupplySources(digest, ids[0], producers);
    // Local per-destination cap — the realm can be arbitrarily large; the fan-in stays K.
    expect(ranked.length).toBeLessThanOrEqual(SUPPLY_TUNING.K_SOURCES);
  });
});

/**
 * tests/generators/settlementReason.test.js — founding-reason deficit honesty.
 *
 * generateSettlementReason seeds the AI grounding pass: when the food ledger
 * records a meaningful deficit (>= 5% of daily need), the isolated/city
 * wording must acknowledge the gap instead of claiming self-sufficiency —
 * otherwise the dossier narrates a granary the math says is empty. Below the
 * 5% threshold (rounding noise) and for legacy callers passing no foodBalance,
 * the old self-sufficient wording stays.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementReason } from '../../src/generators/narrativeGenerator.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { ORIGIN_POOLS } from '../../src/generators/narrative/settlementOriginProse.js';
import { SMALL_PLACE_TIER_LINES } from '../../src/generators/narrativeGenerator.js';

describe('generateSettlementReason deficit honesty', () => {
  it('an isolated settlement with a meaningful deficit acknowledges it', () => {
    const lines = generateSettlementReason('village', 'isolated', null, {}, { dailyNeed: 1000, rawDeficit: 200 });
    expect(lines[0]).toMatch(/cannot fully feed itself/);
    // The deficit acknowledgement above proves lines[0] is the live isolated-founding
    // sentence, so this exclusion measures wording rather than an empty line.
    // anchored: lines[0] is pinned live by the 'cannot fully feed itself' assertion
    expect(lines[0]).not.toMatch(/Self-sufficiency/);
  });

  it('legacy callers (no foodBalance) keep the self-sufficient wording', () => {
    const lines = generateSettlementReason('village', 'isolated', null, {});
    expect(lines[0]).toMatch(/Self-sufficiency is not an aspiration here/);
  });

  it('a sub-5% gap is rounding noise and does not flip the founding narrative', () => {
    const lines = generateSettlementReason('village', 'isolated', null, {}, { dailyNeed: 1000, rawDeficit: 40 });
    expect(lines[0]).toMatch(/Self-sufficiency is not an aspiration here/);
  });

  it('the residual deficit (after imports) also counts as a meaningful gap', () => {
    const lines = generateSettlementReason('village', 'isolated', null, {}, { dailyNeed: 1000, rawDeficit: 0, deficit: 120 });
    expect(lines[0]).toMatch(/cannot fully feed itself/);
  });

  it("the city tier line stops claiming 'produces what it consumes' under deficit", () => {
    const deficit = generateSettlementReason('city', 'road', null, {}, { dailyNeed: 20000, rawDeficit: 4000 });
    expect(deficit[1]).toMatch(/appetites outrun its fields/);
    const fed = generateSettlementReason('city', 'road', null, {}, { dailyNeed: 20000, rawDeficit: 0 });
    // The style law (W5 HIS 2026-11-07): the mechanism wording "produce what it consumes" became plain.
    expect(fed[1]).toMatch(/feed itself/);
  });
});

// #10 (STYLE-RULINGS §1, W5 HIS 2026-11-07): A RECORD DEFECT, not a wording. A port route with no
// docks or wharf institution on the roster printed "A port. The wharves are the reason the place
// exists" over a mountain thorp with no docks. The port reason now reads whether a docks/wharf
// institution exists (`hasDocks`, from the roster's port-infrastructure flag); with none, the arm
// its terrain gives prints (riverside -> the river arm, else the road arm).
describe('#10 — the port reason is gated on a docks or wharf institution', () => {
  const PORT_BODIES = new Set(Object.entries(ORIGIN_POOLS)
    .filter(([arm]) => arm.startsWith('port.')).flatMap(([, pool]) => pool));
  it('a port route WITHOUT docks prints no port reason', () => {
    for (const terrainType of [null, 'mountains', 'coastal', 'plains']) {
      const [reason] = generateSettlementReason('thorp', 'port', null, { terrainType }, null, { hasDocks: false });
      expect(PORT_BODIES.has(reason), `terrain ${terrainType}: ${reason}`).toBe(false);
    }
  });
  it('STYLE-2 A·O16: a port route without docks founds on the ground the record names, never "roadside"', () => {
    // soak1k-0 (a mountain thorp), soak1k-5 (a metropolis on the plains), soak1k-7 (a desert hamlet):
    // each printed a road reason ("Founded roadside…", "A road settlement…") under the strip's "port"
    const cases = [['thorp', 'mountain', 'on the mountainside'], ['metropolis', 'plains', 'out on the open plain'], ['hamlet', 'desert', 'in the desert'], ['village', 'coastal', 'on the shore']];
    // seed loop collected (STYLE-2-MERGE at the SW-B2 merge): every case runs, every failure is reported
    const runs = cases.flatMap(([tier, terrainType, ground]) => ['soak1k-0', 'soak1k-5', 'soak1k-7', 'a', 'b'].map((seed) => ({ tier, terrainType, ground, seed })));
    const failures = collectSeedFailures(runs, ({ tier, terrainType, ground, seed }) => {
      const [reason] = generateSettlementReason(tier, 'port', null, { terrainType, _seed: seed }, null, { hasDocks: false });
      expect(reason, `${terrainType} ${seed}`).toContain(ground);
      expect(reason).toMatch(/wharf|docks/);
      expect(ORIGIN_POOLS.road.includes(reason), `${terrainType} ${seed}: a road reason`).toBe(false);
    });
    expectNoSeedFailures(failures, 'a port route without docks founds on the named ground');
  });
  it('STYLE-2 A·O16 THROUGH THE PIPELINE: the port reason prints exactly where the roster holds docks (the flag was never read)', async () => {
    // generateNarratives read `getInstFlags(...).hasPort`, which is undefined (the flag lives at
    // `.inst.hasPort`), so hasDocks was false on every birth: a coastal town WITH "Docks/port
    // facilities" printed a road reason. Both directions, over the real roster.
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const PORT_INFRA = /\b(?:port|docks?|harbou?r|shipyard|navy)\b/i;
    const portBodies = new Set(Object.entries(ORIGIN_POOLS).filter(([arm]) => arm.startsWith('port.')).flatMap(([, pool]) => pool));
    let withDocks = 0; let without = 0;
    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city']) {
      for (let i = 0; i < 4; i++) {
        const s = generateSettlementPipeline({ settType: tier, tier, tradeRouteAccess: 'port', culture: 'germanic' }, null, { seed: `sw-b2-docks-${tier}-${i}` });
        const docks = (s.institutions || []).some((x) => PORT_INFRA.test(String(x?.name || '')));
        const [reason] = s.settlementReason;
        if (docks) { withDocks += 1; expect(portBodies.has(reason), `${tier} ${i} has docks: ${reason}`).toBe(true); }
        else { without += 1; expect(portBodies.has(reason), `${tier} ${i} has no docks: ${reason}`).toBe(false); }
      }
    }
    expect(withDocks, 'the corpus holds a port with docks').toBeGreaterThan(0);
    expect(without, 'the corpus holds a port without docks').toBeGreaterThan(0);
  }, 120_000);
  it('a riverside port route without docks takes the river reason', () => {
    const [reason] = generateSettlementReason('village', 'port', null, { terrainType: 'riverside' }, null, { hasDocks: false });
    expect(ORIGIN_POOLS.river).toContain(reason);
  });
  it('a port route WITH docks keeps its port reason, and a caller that does not say keeps it too', () => {
    expect(PORT_BODIES.has(generateSettlementReason('town', 'port', null, {}, null, { hasDocks: true })[0])).toBe(true);
    expect(PORT_BODIES.has(generateSettlementReason('town', 'port', null, {})[0])).toBe(true);
  });
});

// #11 (STYLE-AUDIT §2a, W5 HIS 2026-11-07): the small-place tier line is a pool of five vantages,
// chosen by the settlement's seed, so the 334-town frame no longer prints one sentence everywhere.
describe('#11 — the small-place tier line is a seeded pool of five vantages', () => {
  it('a seedless caller keeps index 0, and a seeded one keeps its own line forever', () => {
    expect(generateSettlementReason('thorp', 'road', null, {})[1]).toBe(SMALL_PLACE_TIER_LINES[0]);
    const once = generateSettlementReason('hamlet', 'road', null, { _seed: 'w5-a' })[1];
    expect(generateSettlementReason('hamlet', 'road', null, { _seed: 'w5-a' })[1]).toBe(once);
  });
  it('the seed family reaches every one of the five', () => {
    const seen = new Set();
    for (let i = 0; i < 200; i += 1) seen.add(generateSettlementReason('thorp', 'road', null, { _seed: `w5-${i}` })[1]);
    expect([...seen].sort()).toEqual([...SMALL_PLACE_TIER_LINES].sort());
  });
});


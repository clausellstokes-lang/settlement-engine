/**
 * traditionGenesis.test.js — THE TRADITIONS wave (T-1). Pins the pure genesis leaf:
 *   • DETERMINISM — same seed ⇒ byte-identical TraditionRec[] across 200+ configs.
 *   • NO MUTATION — a deeply-frozen settlement passes through untouched.
 *   • TIER BANDS — the design §2 count-by-tier bands (with seeded jitter).
 *   • WINDOW VALIDITY — startWeekOfYear 1..52, weeks ∈ {1,2}, for every record.
 *   • GENESIS SHAPE — the campaign-time fields are null/empty (T-2/T-3/T-4 fill).
 *   • WINDOW PHRASE — the seasonForTick-derived register prose.
 */
import { describe, it, expect } from 'vitest';
import { deriveFoundingTraditions, describeTraditionWindow } from '../../src/domain/traditions/genesis.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis', 'capital'];
const CULTURES = ['germanic', 'celtic', 'norse', 'latin', 'arabic', 'steppe', 'east_asian', 'slavic'];
const TERRAINS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'];
const ROUTES = ['road', 'river', 'port', 'crossroads', 'isolated', 'none'];
const POP = { thorp: 60, hamlet: 200, village: 700, town: 3000, city: 15000, metropolis: 60000, capital: 90000 };
// Design §2 count bands per tier.
const BAND = { thorp: [1, 2], hamlet: [1, 2], village: [2, 2], town: [3, 3], city: [4, 5], metropolis: [5, 7], capital: [6, 8] };

/** A varied draft settlement fixture (no engine state), indexed for spread. */
function fixture(i, seed) {
  const tier = TIERS[i % TIERS.length];
  return {
    _seed: seed ?? `gen-${i}`,
    tier,
    population: POP[tier],
    config: {
      culture: CULTURES[i % CULTURES.length],
      terrainType: TERRAINS[i % TERRAINS.length],
      tradeRouteAccess: ROUTES[i % ROUTES.length],
      ...(i % 3 === 0
        ? { primaryDeitySnapshot: { _deityRef: `deity.${i}`, alignmentAxis: i % 2 ? 'good' : 'evil', lawAxis: i % 2 ? 'lawful' : 'chaotic' } }
        : {}),
    },
  };
}

describe('deriveFoundingTraditions — determinism', () => {
  it('same seed ⇒ byte-identical TraditionRec[] across 200 varied configs', () => {
    let mismatches = 0;
    for (let i = 0; i < 220; i += 1) {
      const a = JSON.stringify(deriveFoundingTraditions(fixture(i)));
      const b = JSON.stringify(deriveFoundingTraditions(fixture(i)));
      if (a !== b) mismatches += 1;
    }
    expect(mismatches).toBe(0);
  });

  it('a different seed changes the set (not a constant)', () => {
    const a = JSON.stringify(deriveFoundingTraditions(fixture(0, 'seed-A')));
    const b = JSON.stringify(deriveFoundingTraditions(fixture(0, 'seed-B')));
    expect(a).not.toBe(b);
  });
});

describe('deriveFoundingTraditions — no settlement mutation', () => {
  it('a deeply-frozen settlement passes through untouched', () => {
    const cfg = Object.freeze({ culture: 'celtic', terrainType: 'forest', tradeRouteAccess: 'isolated' });
    const s = Object.freeze({ _seed: 'freeze-1', tier: 'town', population: 3000, config: cfg });
    const before = JSON.stringify(s);
    const recs = deriveFoundingTraditions(s);
    expect(recs.length).toBeGreaterThan(0);
    expect(JSON.stringify(s)).toBe(before); // input object identical after derivation
  });
});

describe('deriveFoundingTraditions — tier bands (design §2)', () => {
  for (const tier of TIERS) {
    it(`${tier} count stays inside its band, across seeds`, () => {
      const [lo, hi] = BAND[tier];
      const seen = new Set();
      for (let i = 0; i < 60; i += 1) {
        const n = deriveFoundingTraditions({ _seed: `${tier}-${i}`, tier, population: POP[tier], config: { culture: 'germanic', terrainType: 'plains', tradeRouteAccess: 'road' } }).length;
        expect(n, `${tier} seed ${i} produced ${n}`).toBeGreaterThanOrEqual(lo);
        expect(n).toBeLessThanOrEqual(hi);
        seen.add(n);
      }
      // The whole band should be reachable when it spans more than one value.
      if (hi > lo) expect(seen.size).toBeGreaterThan(1);
    });
  }
});

describe('deriveFoundingTraditions — window validity + genesis shape', () => {
  it('every record has a valid window, an immutable motif, and null campaign-time fields', () => {
    let count = 0;
    for (let i = 0; i < 200; i += 1) {
      const recs = deriveFoundingTraditions(fixture(i));
      const ids = new Set();
      recs.forEach((r, idx) => {
        count += 1;
        // window
        expect(Number.isInteger(r.window.startWeekOfYear)).toBe(true);
        expect(r.window.startWeekOfYear).toBeGreaterThanOrEqual(1);
        expect(r.window.startWeekOfYear).toBeLessThanOrEqual(52);
        expect([1, 2]).toContain(r.window.weeks);
        // motif
        expect(typeof r.coreMotif.element).toBe('string');
        expect(typeof r.coreMotif.act).toBe('string');
        // ids unique within the set
        expect(ids.has(r.id)).toBe(false);
        ids.add(r.id);
        // genesis shape — campaign-time fields empty
        expect(r.ownerKey).toBeNull();
        expect(r.ownerKind).toBeNull();
        expect(r.lastHeldYear).toBeNull();
        expect(r.lastOutcome).toBeNull();
        expect(r.suppressedBy).toBeNull();
        expect(r.adoptedFrom).toBeNull();
        expect(r.mutationLog).toEqual([]);
        // scaleBand within tier index range (0..6)
        expect(r.scaleBand).toBeGreaterThanOrEqual(0);
        expect(r.scaleBand).toBeLessThanOrEqual(6);
        // the singular origin is record 0
        if (idx === 0) expect(r.foundedYear).toBe(1);
        // names non-empty
        expect(typeof r.name).toBe('string');
        expect(r.name.length).toBeGreaterThan(0);
      });
      // names unique within the set
      expect(new Set(recs.map((r) => r.name)).size).toBe(recs.length);
    }
    expect(count).toBeGreaterThan(200);
  });

  it('deity dedication only appears when a patron snapshot is present', () => {
    const withDeity = deriveFoundingTraditions({ _seed: 'd-1', tier: 'metropolis', population: 60000, config: { culture: 'latin', terrainType: 'plains', tradeRouteAccess: 'road', primaryDeitySnapshot: { _deityRef: 'deity.x', alignmentAxis: 'good', lawAxis: 'lawful' } } });
    const noDeity = deriveFoundingTraditions({ _seed: 'd-1', tier: 'metropolis', population: 60000, config: { culture: 'latin', terrainType: 'plains', tradeRouteAccess: 'road' } });
    expect(noDeity.every((r) => r.deityRef === null)).toBe(true);
    expect(withDeity.some((r) => r.deityRef === 'deity.x')).toBe(true);
  });
});

describe('deriveFoundingTraditions — null-safety', () => {
  it('null / non-object ⇒ empty; a bare object still derives via fallbacks', () => {
    expect(deriveFoundingTraditions(null)).toEqual([]);
    expect(deriveFoundingTraditions(undefined)).toEqual([]);
    expect(deriveFoundingTraditions('nope')).toEqual([]);
    expect(deriveFoundingTraditions({}).length).toBeGreaterThan(0);
  });
});

describe('describeTraditionWindow — register prose', () => {
  it('renders single-week windows as "Season, the Nth week"', () => {
    // week 34 (1-based) → autumn (Harvest), weekOfSeason 8
    expect(describeTraditionWindow({ startWeekOfYear: 34, weeks: 1 })).toBe('Harvest, the eighth week');
    // week 1 → spring (Seedtime), weekOfSeason 1
    expect(describeTraditionWindow({ startWeekOfYear: 1, weeks: 1 })).toBe('Seedtime, the first week');
  });
  it('renders a two-week window inside a season as a range', () => {
    // week 17 → summer (Highsun), weekOfSeason 4; +1 → weekOfSeason 5
    expect(describeTraditionWindow({ startWeekOfYear: 17, weeks: 2 })).toBe('Highsun, the fourth and fifth weeks');
  });
  it('phrases a two-week window that crosses a season boundary', () => {
    // week 13 → spring wk 13; +1 crosses into summer wk 1
    expect(describeTraditionWindow({ startWeekOfYear: 13, weeks: 2 })).toBe('Seedtime, the thirteenth week, into Highsun');
  });
  it('is total on garbage input', () => {
    expect(typeof describeTraditionWindow(null)).toBe('string');
    expect(typeof describeTraditionWindow({})).toBe('string');
  });
});

/**
 * marketPrices.test.js — Phase 5.5 round-21 Wave 7: the MARKET-PRICE display
 * read-model. Prices are a pure LAZY read over economicState + the M6a stock
 * bands (commodityStocks) + the M6d flow drift — read-only, zero engine feedback,
 * zero persistence. GENERATION IS SACRED: the selector never mutates a thing.
 *
 * Pins (the design's set): purity (no rng/clock/locale), determinism (same inputs
 * ⇒ same quotes), band MONOTONICITY (shortage > adequate > surplus for every
 * good, always), catalog TOTALITY (every good prices), the REGISTER guard (no
 * bare decimals in rendered copy), DORMANCY (aspatial ⇒ generation-band prices,
 * no crash), and byte-inertness (no numeric price leaks the spoken quote).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  deriveMarketPrices, deriveMarketQuote, denominate, basePriceFor, unitFor,
  resolveGood, commodityBandForGood, strongestDeviation,
  BASE_PRICE_BY_CLASS, SCARCITY_MULTIPLIER, DEFAULT_BASE_COPPERS,
  BAND_STOCKPILE_TARGET, BAND_SHORTAGE_FRAC, BAND_SURPLUS_FRAC,
} from '../../src/domain/display/marketPrices.js';
import { GOOD_CATALOG } from '../../src/domain/region/goodsCatalog.js';
// The CANONICAL M6a band source — imported HERE (tests are outside the
// first-paint closure) to parity-pin marketPrices.js's local mirror. The
// display module itself must NEVER import commodityFlow (chunk weight).
import { COMMODITY_TUNING, commodityBand } from '../../src/domain/spatial/commodityFlow.js';

// A worldState carrying the commodity-stock ledger (the M6a band source), the
// spatialLedgers namespace exactly as the kernel nests it.
/** @param {Record<string, Record<string, number>>|null} stocks */
const world = (stocks) => ({ spatialLedgers: stocks ? { commodityStocks: stocks } : {} });
const ECO = { primaryExports: ['Grain', 'Milled flour'], primaryImports: ['Iron', 'Salt'] };

const NO_DECIMAL = /\d\.\d/; // the "spreadsheet tell" the register guard forbids

describe('Wave 7 marketPrices — catalog TOTALITY (the walker)', () => {
  it('every catalog GOOD resolves to a finite positive base, a unit, and a valid quote', () => {
    for (const entry of Object.values(GOOD_CATALOG)) {
      if (entry.kind !== 'good') continue; // services are not cried by the bushel
      const good = resolveGood(entry.id);
      expect(good, `${entry.id} resolves`).not.toBeNull();
      const base = basePriceFor(good);
      expect(Number.isFinite(base) && base >= 1, `${entry.id} base=${base}`).toBe(true);
      expect(typeof unitFor(/** @type {NonNullable<typeof good>} */ (good))).toBe('string');
      const q = deriveMarketQuote({ good: /** @type {NonNullable<typeof good>} */ (good), settlementId: 'town', band: 'adequate' });
      expect(q.coppers).toBeGreaterThanOrEqual(1);
      expect(q.spoken.length).toBeGreaterThan(0);
      expect(q.priced).toContain(q.unit);
    }
  });

  it('every BASE_PRICE_BY_CLASS anchor is a positive number, DEFAULT is the floor', () => {
    for (const v of Object.values(BASE_PRICE_BY_CLASS)) expect(v).toBeGreaterThan(0);
    expect(DEFAULT_BASE_COPPERS).toBeGreaterThan(0);
    // A good whose class is unknown falls back to the default (total function).
    expect(basePriceFor('no_such_class')).toBe(DEFAULT_BASE_COPPERS);
  });
});

describe('Wave 7 marketPrices — band MONOTONICITY', () => {
  it('the scarcity multiplier is strictly monotone: shortage > adequate > surplus', () => {
    expect(SCARCITY_MULTIPLIER.shortage).toBeGreaterThan(SCARCITY_MULTIPLIER.adequate);
    expect(SCARCITY_MULTIPLIER.adequate).toBeGreaterThan(SCARCITY_MULTIPLIER.surplus);
  });

  it('for EVERY good, price(shortage) > price(adequate) > price(surplus) at one market', () => {
    for (const entry of Object.values(GOOD_CATALOG)) {
      if (entry.kind !== 'good') continue;
      const good = /** @type {NonNullable<ReturnType<typeof resolveGood>>} */ (resolveGood(entry.id));
      const dear = deriveMarketQuote({ good, settlementId: 'town', band: 'shortage' }).coppers;
      const mid = deriveMarketQuote({ good, settlementId: 'town', band: 'adequate' }).coppers;
      const cheap = deriveMarketQuote({ good, settlementId: 'town', band: 'surplus' }).coppers;
      expect(dear, `${entry.id} shortage>adequate`).toBeGreaterThan(mid);
      expect(mid, `${entry.id} adequate>surplus`).toBeGreaterThan(cheap);
    }
  });
});

describe('Wave 7 marketPrices — DETERMINISM (no rng, no clock)', () => {
  it('same inputs ⇒ byte-identical view model', () => {
    const a = deriveMarketPrices({ economicState: ECO, worldState: world(null), settlementId: 'forge' });
    const b = deriveMarketPrices({ economicState: ECO, worldState: world(null), settlementId: 'forge' });
    expect(a).toEqual(b);
  });

  it('the same (settlement, good) always quotes the same coin; different markets differ', () => {
    const grain = /** @type {NonNullable<ReturnType<typeof resolveGood>>} */ (resolveGood('Grain'));
    const one = deriveMarketQuote({ good: grain, settlementId: 'aaa', band: 'adequate' }).coppers;
    const oneAgain = deriveMarketQuote({ good: grain, settlementId: 'aaa', band: 'adequate' }).coppers;
    expect(one).toBe(oneAgain);
    // The local-colour jitter makes distinct markets generally quote distinct
    // prices — sample a spread of ids so the assertion is not a coin-flip.
    const prices = ['bbb', 'ccc', 'ddd', 'eee', 'fff'].map(id =>
      deriveMarketQuote({ good: grain, settlementId: id, band: 'adequate' }).coppers);
    expect(new Set([one, ...prices]).size).toBeGreaterThan(1);
  });
});

describe('Wave 7 marketPrices — the REGISTER guard (crier, not spreadsheet)', () => {
  it('denominate renders coin words, NEVER a bare decimal', () => {
    for (let cp = 1; cp <= 5000; cp += 7) {
      const s = denominate(cp);
      expect(s, `cp=${cp} → "${s}"`).not.toMatch(NO_DECIMAL);
      expect(s).not.toMatch(/NaN|undefined|Infinity/);
      expect(s).toMatch(/copper|silver|gold/);
    }
    expect(denominate(1)).toBe('a copper');
    expect(denominate(5)).toBe('five copper');
    expect(denominate(15)).toBe('a silver and a half');
    expect(denominate(40)).toBe('four silver');
    expect(denominate(45)).toBe('four silver and a half');
    expect(denominate(100)).toBe('a gold');
  });

  it('no rendered quote or crier line carries a bare decimal', () => {
    const stocks = { forge: { grain: 1, iron: 40 } }; // grain short, iron glut
    const m = deriveMarketPrices({ economicState: ECO, worldState: world(stocks), settlementId: 'forge' });
    for (const q of [...m.exports, ...m.imports]) {
      expect(q.priced, q.priced).not.toMatch(NO_DECIMAL);
      expect(q.spoken).not.toMatch(NO_DECIMAL);
    }
    if (m.highlight) expect(m.highlight.crierLine).not.toMatch(NO_DECIMAL);
  });

  it('the flagship reads as coarse silver — grain in shortage runs ~four silver the bushel', () => {
    const grain = /** @type {NonNullable<ReturnType<typeof resolveGood>>} */ (resolveGood('Grain'));
    const q = deriveMarketQuote({ good: grain, settlementId: 'riverside', band: 'shortage' });
    expect(q.unit).toBe('bushel');
    expect(q.coppers).toBeGreaterThanOrEqual(38);
    expect(q.coppers).toBeLessThanOrEqual(48);
    expect(q.spoken).toMatch(/^(three|four|five) silver/);
    expect(q.priced).toMatch(/silver.*bushel$/);
  });
});

describe('Wave 7 marketPrices — the M6a BAND read (commodityStocks)', () => {
  it('a low stock reads shortage (dear); a high stock reads surplus (cheap); absent ⇒ null', () => {
    const stocks = { forge: { grain: 1, iron: 40 } };
    expect(commodityBandForGood(world(stocks), 'forge', 'grain')).toBe('shortage');
    expect(commodityBandForGood(world(stocks), 'forge', 'iron')).toBe('surplus');
    expect(commodityBandForGood(world(stocks), 'forge', 'salt')).toBeNull(); // no entry
    expect(commodityBandForGood(world(null), 'forge', 'grain')).toBeNull();  // no ledger
  });

  it('a shortage-banded export is dearer than the same good adequate; a glut is cheaper', () => {
    const dear = deriveMarketPrices({ economicState: ECO, worldState: world({ forge: { grain: 1 } }), settlementId: 'forge' });
    const flat = deriveMarketPrices({ economicState: ECO, worldState: world(null), settlementId: 'forge' });
    const glut = deriveMarketPrices({ economicState: ECO, worldState: world({ forge: { grain: 40 } }), settlementId: 'forge' });
    const grainOf = (m) => m.exports.find((/** @type {{id:string}} */ q) => q.id === 'grain');
    expect(grainOf(dear).band).toBe('shortage');
    expect(grainOf(flat).band).toBe('adequate');
    expect(grainOf(glut).band).toBe('surplus');
    expect(grainOf(dear).coppers).toBeGreaterThan(grainOf(flat).coppers);
    expect(grainOf(flat).coppers).toBeGreaterThan(grainOf(glut).coppers);
  });
});

describe('Wave 7 marketPrices — M6a THRESHOLD PARITY (the anti-drift pin)', () => {
  // marketPrices.js mirrors commodityFlow's band thresholds LOCALLY (chunk-weight
  // law: the display leaf must not import the heavy engine module). This pin is
  // the drift-proof: a COMMODITY_TUNING retune that is not mirrored REDS here.
  it('the mirrored constants EQUAL the canonical COMMODITY_TUNING values', () => {
    expect(BAND_STOCKPILE_TARGET, 'STOCKPILE_TARGET drifted — update the marketPrices.js mirror').toBe(COMMODITY_TUNING.STOCKPILE_TARGET);
    expect(BAND_SHORTAGE_FRAC, 'SHORTAGE_FRAC drifted — update the marketPrices.js mirror').toBe(COMMODITY_TUNING.SHORTAGE_FRAC);
    expect(BAND_SURPLUS_FRAC, 'SURPLUS_FRAC drifted — update the marketPrices.js mirror').toBe(COMMODITY_TUNING.SURPLUS_FRAC);
  });

  it('commodityBandForGood AGREES with the real commodityBand() for every stock 0..40 (formula parity, not just constants)', () => {
    for (let stock = 0; stock <= 40; stock++) {
      const mine = commodityBandForGood(world({ forge: { grain: stock } }), 'forge', 'grain');
      const canon = commodityBand(stock, COMMODITY_TUNING.STOCKPILE_TARGET);
      expect(mine, `stock=${stock}: display=${mine} canonical=${canon}`).toBe(canon);
    }
  });
});

describe('Wave 7 marketPrices — the M6d DRIFT nudge', () => {
  it('a shortage flow-drift shades every quote dearer; a surplus drift cheaper; absent ⇒ no change', () => {
    const grain = /** @type {NonNullable<ReturnType<typeof resolveGood>>} */ (resolveGood('Grain'));
    const flat = deriveMarketQuote({ good: grain, settlementId: 'forge', band: 'adequate' }).coppers;
    const dearer = deriveMarketQuote({ good: grain, settlementId: 'forge', band: 'adequate', driftBand: 'shortage' }).coppers;
    const cheaper = deriveMarketQuote({ good: grain, settlementId: 'forge', band: 'adequate', driftBand: 'surplus' }).coppers;
    expect(dearer).toBeGreaterThanOrEqual(flat);
    expect(cheaper).toBeLessThanOrEqual(flat);
    expect(dearer).toBeGreaterThan(cheaper);
  });

  it('the flow-drift band flows through deriveMarketPrices to the whole board', () => {
    const noDrift = deriveMarketPrices({ economicState: ECO, worldState: world(null), settlementId: 'forge' });
    const withDrift = deriveMarketPrices({ economicState: ECO, worldState: world(null), settlementId: 'forge', flowDrift: { band: 'shortage' } });
    const sum = (m) => [...m.exports, ...m.imports].reduce((/** @type {number} */ a, /** @type {{coppers:number}} */ q) => a + q.coppers, 0);
    expect(sum(withDrift)).toBeGreaterThan(sum(noDrift));
  });
});

describe('Wave 7 marketPrices — DORMANCY / INERT-NOT-CRASH', () => {
  it('aspatial (no ledger) ⇒ prices from generation bands at adequate, never crashes', () => {
    const m = deriveMarketPrices({ economicState: ECO, worldState: world(null), settlementId: 'forge' });
    expect(m.present).toBe(true);
    expect(m.exports.every((/** @type {{band:string}} */ q) => q.band === 'adequate')).toBe(true);
    expect(m.imports.every((/** @type {{band:string}} */ q) => q.band === 'adequate')).toBe(true);
    expect(m.highlight).toBeNull(); // all steady ⇒ nothing dear/cheap to cry
  });

  it('absent / garbage inputs ⇒ an empty present:false model, no throw', () => {
    expect(deriveMarketPrices({ economicState: null, settlementId: 'forge' })).toEqual({ present: false, exports: [], imports: [], highlight: null });
    expect(deriveMarketPrices({ economicState: ECO, settlementId: null }).present).toBe(false);
    expect(() => deriveMarketPrices({ economicState: ECO, worldState: /** @type {never} */ ('garbage'), settlementId: 'forge' })).not.toThrow();
    expect(() => deriveMarketPrices({ economicState: { primaryExports: [null, '', {}, 42] }, worldState: world(null), settlementId: 'forge' })).not.toThrow();
  });

  it('SERVICES never price (a crier does not cry "four silver the financial service")', () => {
    expect(resolveGood('Financial services')).toBeNull();
    const m = deriveMarketPrices({ economicState: { primaryExports: ['Financial services', 'Grain'], primaryImports: [] }, worldState: world(null), settlementId: 'forge' });
    expect(m.exports.map((/** @type {{id:string}} */ q) => q.id)).toEqual(['grain']);
  });
});

describe('Wave 7 marketPrices — the strongest-deviation HIGHLIGHT', () => {
  it('a dear good outranks a cheap one; the crier line is well-formed', () => {
    const stocks = { forge: { grain: 1, iron: 40 } }; // grain dear, iron cheap
    const m = deriveMarketPrices({ economicState: ECO, worldState: world(stocks), settlementId: 'forge', flowDrift: { band: 'shortage' } });
    expect(m.highlight).not.toBeNull();
    expect(m.highlight?.tag).toBe('dear');
    expect(m.highlight?.crierLine).toMatch(/runs .* — dear, for the roads are cut\.$/);
  });

  it('a steady-only board has no highlight', () => {
    expect(strongestDeviation([], null)).toBeNull();
  });
});

describe('Wave 7 marketPrices — PURITY (source scan)', () => {
  it('the module uses no wall clock, rng, or host-locale formatting', () => {
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../../src/domain/display/marketPrices.js'), 'utf8');
    expect(src).not.toMatch(/Date\.now|new Date\b/);
    expect(src).not.toMatch(/Math\.random/);
    expect(src).not.toMatch(/toLocale[A-Z]/);
    expect(src).not.toMatch(/localeCompare/);
  });
});

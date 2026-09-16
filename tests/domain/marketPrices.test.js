/**
 * marketPrices.test.js — the MARKET-MOVEMENT display read-model (Phase 5.5
 * round-21 Wave 7, rebuilt under the PRICE-HEURISTICS LAW, ODQ §776: no
 * in-world surface states an absolute price; movements against the settlement's
 * own norm only). Movements are a pure LAZY read over economicState + the M6a
 * stock bands (commodityStocks) + the M6d flow drift — read-only, zero engine
 * feedback, zero persistence. GENERATION IS SACRED: the selector never mutates.
 *
 * Pins (the design's set): purity (no rng/clock/locale), determinism (same
 * inputs ⇒ same movements), band MONOTONICITY (shortage reads dearer than
 * adequate, adequate than surplus, for every good, always), catalog TOTALITY
 * (every good moves), THE §776 REGISTER guard (no digits, no coin words, no
 * absolute value anywhere in rendered copy — the currency-amount class this
 * surface can never regress into), DORMANCY (aspatial ⇒ generation-band
 * movements, no crash), and the M6a threshold parity anti-drift pin.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  deriveMarketPrices, deriveMarketQuote, movementFor, resolveGood,
  commodityBandForGood, strongestDeviation, CRIER_FRAMES, MOVEMENTS,
  MOVEMENT_ORDER, BAND_STOCKPILE_TARGET, BAND_SHORTAGE_FRAC, BAND_SURPLUS_FRAC,
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

// THE §776 TELLS: an absolute value is a digit, a decimal, or a coin word.
// Rendered market copy may carry NONE of them. (The currency-amount detector
// class chartered to T9 grows from exactly this predicate.)
const ABSOLUTE_TELL = /\d|gold|silver|copper|\bgp\b|\bsp\b|\bcp\b|coin/i;

/** Rank on the dear→cheap axis (lower index = dearer). @param {string} m */
const rank = (m) => MOVEMENT_ORDER.indexOf(/** @type {never} */ (m));

describe('Wave 7 marketPrices — catalog TOTALITY (the walker)', () => {
  it('every catalog GOOD resolves and moves — a typed movement with a spoken phrase, at every band', () => {
    for (const entry of Object.values(GOOD_CATALOG)) {
      if (entry.kind !== 'good') continue; // services are not cried in the market
      const good = resolveGood(entry.id);
      expect(good, `${entry.id} resolves`).not.toBeNull();
      for (const band of ['shortage', 'adequate', 'surplus']) {
        const q = deriveMarketQuote({ good: /** @type {NonNullable<typeof good>} */ (good), settlementId: 'town', band: /** @type {never} */ (band) });
        expect(MOVEMENT_ORDER.includes(q.movement), `${entry.id}@${band} movement=${q.movement}`).toBe(true);
        expect(q.phrase).toBe(/** @type {Record<string,string>} */ (MOVEMENTS)[q.movement]);
        expect(q.phrase.length).toBeGreaterThan(0);
      }
    }
  });

  it('the movement vocabulary is total over every (band, drift) shape — junk included', () => {
    const bands = ['shortage', 'adequate', 'surplus', null, undefined, 'garbage'];
    for (const band of bands) for (const drift of bands) {
      const m = movementFor(/** @type {never} */ (band), /** @type {never} */ (drift));
      expect(MOVEMENT_ORDER.includes(m), `band=${band} drift=${drift} → ${m}`).toBe(true);
    }
  });
});

describe('Wave 7 marketPrices — band MONOTONICITY on the movement axis', () => {
  it('for EVERY good, shortage reads dearer than adequate, adequate dearer than surplus', () => {
    for (const entry of Object.values(GOOD_CATALOG)) {
      if (entry.kind !== 'good') continue;
      const good = /** @type {NonNullable<ReturnType<typeof resolveGood>>} */ (resolveGood(entry.id));
      const dear = rank(deriveMarketQuote({ good, settlementId: 'town', band: 'shortage' }).movement);
      const mid = rank(deriveMarketQuote({ good, settlementId: 'town', band: 'adequate' }).movement);
      const cheap = rank(deriveMarketQuote({ good, settlementId: 'town', band: 'surplus' }).movement);
      expect(dear, `${entry.id} shortage dearer than adequate`).toBeLessThan(mid);
      expect(mid, `${entry.id} adequate dearer than surplus`).toBeLessThan(cheap);
    }
  });

  it('the vocabulary itself is ordered dear → cheap with "usual" at its centre', () => {
    expect(MOVEMENT_ORDER[Math.floor(MOVEMENT_ORDER.length / 2)]).toBe('usual');
    // Every movement names a phrase; every phrase measures against the norm.
    for (const m of MOVEMENT_ORDER) {
      const phrase = /** @type {Record<string,string>} */ (MOVEMENTS)[m];
      expect(typeof phrase).toBe('string');
      expect(phrase).toContain('usual price');
    }
  });
});

describe('Wave 7 marketPrices — DETERMINISM (no rng, no clock)', () => {
  it('same inputs ⇒ byte-identical view model', () => {
    const a = deriveMarketPrices({ economicState: ECO, worldState: world(null), settlementId: 'forge' });
    const b = deriveMarketPrices({ economicState: ECO, worldState: world(null), settlementId: 'forge' });
    expect(a).toEqual(b);
  });

  it('the same bands always speak the same phrase, in every market', () => {
    const grain = /** @type {NonNullable<ReturnType<typeof resolveGood>>} */ (resolveGood('Grain'));
    const phrases = ['aaa', 'bbb', 'ccc'].map(id =>
      deriveMarketQuote({ good: grain, settlementId: id, band: 'shortage' }).phrase);
    expect(new Set(phrases).size).toBe(1);
    expect(phrases[0]).toBe(MOVEMENTS.near_double);
  });
});

describe('Wave 7 marketPrices — THE §776 REGISTER GUARD (movement, never coin)', () => {
  it('no movement phrase carries a digit, a decimal, or a coin word', () => {
    for (const phrase of Object.values(MOVEMENTS)) {
      expect(phrase, phrase).not.toMatch(ABSOLUTE_TELL);
    }
  });

  it('no rendered quote or crier line carries an absolute-value tell, at any band mix', () => {
    const stocks = { forge: { grain: 1, iron: 40 } }; // grain short, iron glut
    const m = deriveMarketPrices({ economicState: ECO, worldState: world(stocks), settlementId: 'forge', flowDrift: { band: 'shortage' } });
    for (const q of [...m.exports, ...m.imports]) {
      expect(q.phrase, q.phrase).not.toMatch(ABSOLUTE_TELL);
      // The quote shape itself carries no numeric price field to leak.
      expect('coppers' in q).toBe(false);
      expect('raw' in q).toBe(false);
    }
    expect(m.highlight).not.toBeNull();
    expect(m.highlight?.crierLine).not.toMatch(ABSOLUTE_TELL);
  });

  it('the flagship reads as movement — grain in shortage runs nearly double its usual price', () => {
    const grain = /** @type {NonNullable<ReturnType<typeof resolveGood>>} */ (resolveGood('Grain'));
    const q = deriveMarketQuote({ good: grain, settlementId: 'riverside', band: 'shortage' });
    expect(q.movement).toBe('near_double');
    expect(q.phrase).toBe('nearly double its usual price');
    expect(q.tag).toBe('dear');
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

  it('a shortage-banded export reads dearer than the same good adequate; a glut cheaper', () => {
    const dear = deriveMarketPrices({ economicState: ECO, worldState: world({ forge: { grain: 1 } }), settlementId: 'forge' });
    const flat = deriveMarketPrices({ economicState: ECO, worldState: world(null), settlementId: 'forge' });
    const glut = deriveMarketPrices({ economicState: ECO, worldState: world({ forge: { grain: 40 } }), settlementId: 'forge' });
    const grainOf = (m) => m.exports.find((/** @type {{id:string}} */ q) => q.id === 'grain');
    expect(grainOf(dear).band).toBe('shortage');
    expect(grainOf(flat).band).toBe('adequate');
    expect(grainOf(glut).band).toBe('surplus');
    expect(rank(grainOf(dear).movement)).toBeLessThan(rank(grainOf(flat).movement));
    expect(rank(grainOf(flat).movement)).toBeLessThan(rank(grainOf(glut).movement));
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

describe('Wave 7 marketPrices — the M6d DRIFT shade', () => {
  it('a shortage flow-drift shades a steady good above the usual; a surplus drift under; absent ⇒ usual', () => {
    const grain = /** @type {NonNullable<ReturnType<typeof resolveGood>>} */ (resolveGood('Grain'));
    const flat = deriveMarketQuote({ good: grain, settlementId: 'forge', band: 'adequate' });
    const above = deriveMarketQuote({ good: grain, settlementId: 'forge', band: 'adequate', driftBand: 'shortage' });
    const under = deriveMarketQuote({ good: grain, settlementId: 'forge', band: 'adequate', driftBand: 'surplus' });
    expect(flat.movement).toBe('usual');
    expect(above.movement).toBe('shade_above');
    expect(under.movement).toBe('shade_under');
    expect(rank(above.movement)).toBeLessThan(rank(flat.movement));
    expect(rank(flat.movement)).toBeLessThan(rank(under.movement));
  });

  it('a good already dear or cheap keeps its class — the road shade never jumps a whole class', () => {
    const grain = /** @type {NonNullable<ReturnType<typeof resolveGood>>} */ (resolveGood('Grain'));
    for (const drift of ['shortage', 'surplus', null]) {
      expect(deriveMarketQuote({ good: grain, settlementId: 'f', band: 'shortage', driftBand: /** @type {never} */ (drift) }).movement).toBe('near_double');
      expect(deriveMarketQuote({ good: grain, settlementId: 'f', band: 'surplus', driftBand: /** @type {never} */ (drift) }).movement).toBe('third_under');
    }
  });

  it('the flow-drift band flows through deriveMarketPrices to the whole steady board', () => {
    const noDrift = deriveMarketPrices({ economicState: ECO, worldState: world(null), settlementId: 'forge' });
    const withDrift = deriveMarketPrices({ economicState: ECO, worldState: world(null), settlementId: 'forge', flowDrift: { band: 'shortage' } });
    expect(noDrift.exports.every((/** @type {{movement:string}} */ q) => q.movement === 'usual')).toBe(true);
    expect(withDrift.exports.every((/** @type {{movement:string}} */ q) => q.movement === 'shade_above')).toBe(true);
  });
});

describe('Wave 7 marketPrices — DORMANCY / INERT-NOT-CRASH', () => {
  it('aspatial (no ledger) ⇒ movements from generation bands at the usual, never crashes', () => {
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

  it('SERVICES never move (a crier does not cry the financial service)', () => {
    expect(resolveGood('Financial services')).toBeNull();
    const m = deriveMarketPrices({ economicState: { primaryExports: ['Financial services', 'Grain'], primaryImports: [] }, worldState: world(null), settlementId: 'forge' });
    expect(m.exports.map((/** @type {{id:string}} */ q) => q.id)).toEqual(['grain']);
  });
});

describe('Wave 7 marketPrices — the strongest-deviation HIGHLIGHT', () => {
  it('a dear good outranks a cheap one; the crier line is well-formed and coin-free', () => {
    const stocks = { forge: { grain: 1, iron: 40 } }; // grain dear, iron cheap
    const m = deriveMarketPrices({ economicState: ECO, worldState: world(stocks), settlementId: 'forge', flowDrift: { band: 'shortage' } });
    expect(m.highlight).not.toBeNull();
    expect(m.highlight?.tag).toBe('dear');
    // The crier FRAME varies view-time (content-vt-2, seeded on the good id); the
    // FACTS are pinned — a DEAR line carrying the movement phrase and the
    // shortage receipt, ending as a spoken sentence, with no absolute tell.
    const line = m.highlight?.crierLine ?? '';
    expect(line).toContain('dear');
    expect(line).toContain('nearly double its usual price');
    expect(line).toContain('for the roads are cut');
    expect(line.endsWith('.')).toBe(true);
    expect(line).not.toMatch(ABSOLUTE_TELL);
  });

  it('a steady-only board has no highlight', () => {
    expect(strongestDeviation([], null)).toBeNull();
  });

  // ── CRIER-LINE frame variety (content-vt-2) ──────────────────────────────────
  const quote = (id, tag) => ({
    id, label: 'Grain',
    band: tag === 'dear' ? 'shortage' : 'surplus',
    movement: tag === 'dear' ? 'near_double' : 'third_under',
    phrase: tag === 'dear' ? MOVEMENTS.near_double : MOVEMENTS.third_under,
    tag,
  });

  it('CANONICAL-AT-ZERO: index 0 of each pool is the pool\'s plainest line', () => {
    expect(CRIER_FRAMES.dear[0]).toBe('{label} runs {phrase}: dear, {receipt}.');
    expect(CRIER_FRAMES.cheap[0]).toBe('{label} runs {phrase}: cheap, {receipt}.');
    for (const [tag, pool] of Object.entries(CRIER_FRAMES)) {
      expect(pool.length, `${tag} has variety`).toBeGreaterThanOrEqual(2);
      for (const frame of pool) {
        for (const slot of ['{label}', '{phrase}', '{receipt}']) {
          expect(frame.includes(slot), `${tag}: "${frame}" carries ${slot}`).toBe(true);
        }
        expect(frame.includes(tag), `${tag}: "${frame}" names the tag`).toBe(true);
        expect(/[.!?]$/.test(frame), `${tag}: "${frame}" terminal punct`).toBe(true);
      }
    }
  });

  it('DETERMINISM: the same good is always cried the same way', () => {
    const a = strongestDeviation([quote('grain', 'dear')], 'shortage')?.crierLine;
    const b = strongestDeviation([quote('grain', 'dear')], 'shortage')?.crierLine;
    expect(a).toBe(b);
    // The facts (movement + receipt) ride whatever frame the good draws.
    expect(a).toContain('nearly double its usual price');
    expect(a).toContain('for the roads are cut');
  });

  it('ANTI-REPETITION: distinct goods reach the whole frame pool of each tag', () => {
    for (const tag of ['dear', 'cheap']) {
      const drift = tag === 'dear' ? 'shortage' : 'surplus';
      const seen = new Set();
      for (let i = 0; i < 300; i++) seen.add(strongestDeviation([quote(`g_${i}`, tag)], drift)?.crierLine);
      expect(seen.size, `${tag} fully reachable`).toBe(CRIER_FRAMES[tag].length);
    }
  });
});

describe('Wave 7 marketPrices — PURITY + THE COIN MACHINERY STAYS DEAD (source scan)', () => {
  const src = () => readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../../src/domain/display/marketPrices.js'), 'utf8');

  it('the module uses no wall clock, rng, or host-locale formatting', () => {
    expect(src()).not.toMatch(/Date\.now|new Date\b/);
    expect(src()).not.toMatch(/Math\.random/);
    expect(src()).not.toMatch(/toLocale[A-Z]/);
    expect(src()).not.toMatch(/localeCompare/);
  });

  it('no absolute-coin derivation returns to this module (§776 — the deletion holds)', () => {
    // The old coin machinery by its load-bearing identifiers. A revival of any
    // of these names is a §776 regression walking back in the front door.
    // (Positive control: the movement vocabulary IS here.)
    const text = src();
    expect(text).toContain('MOVEMENTS');
    for (const dead of ['BASE_PRICE_BY_CLASS', 'denominate(', 'basePriceFor', 'localColor', 'coppers', 'SCARCITY_MULTIPLIER']) {
      expect(text.includes(dead), `"${dead}" must stay deleted`).toBe(false);
    }
  });
});

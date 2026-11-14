/**
 * tests/generators/famineHookMarket.test.js — R2-CODE-A-4, the independent reader's A26 (REVIEW-R3-STAGES, stage A2,
 * finding 1; `foodBalance.js :: deriveFoodBalanceAnalysis`, the import plot hook): rr3-thorp-famine-port-0
 * (Brahmakund, thorp of 11), "…The settlement must decide what it can still afford to import, and the merchants are
 * watching it decide." beside the page's own "No market or fair stands in Brahmakund"; in 21 of the 55 towns it
 * printed in, #152's and #48's own towns among them. RULED: a line that names merchants or a market reads the roster
 * (the market home, `facts/market.js :: hasMarketInstitution`); where the town holds none, a twin true of it prints.
 * The "poor harvest somewhere else" hook carries the same clause and the same condition (record 386 (2)).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { hasMarketInstitution } from '../../src/domain/facts/market.js';

describe('the import hook reads the roster for its merchants, born as the app births them', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {string} seed */
  const born = (seed) => {
    const m = /** @type {RegExpMatchArray} */ (seed.match(/^(?:rww|rr2s)-(\w+)-([a-z_+]+)-(?:rand-)?\d+$/));
    return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
  };
  /** @param {any} s */
  const hook = (s) => (s.economicViability?.plotHooks || []).map((/** @type {any} */ h) => h?.hook).find((/** @type {string} */ h) => /watching it decide\.$/.test(h || ''));
  it('no market, so no merchants (every row)', () => {
    for (const seed of ['rr2s-thorp-famine-rand-1', 'rww-village-famine-1']) {
      const s = born(seed);
      expect(hasMarketInstitution(s.institutions), `${seed}: no market`).toBe(false);
      expect(hook(s), `${seed}: no merchants`).toMatch(/and whoever brings the food in is watching it decide\.$/);
    }
  });
  it('a market stands, and the merchants watch (every row)', () => {
    for (const seed of ['rww-town-famine-1', 'rww-city-famine-1']) {
      const s = born(seed);
      expect(hasMarketInstitution(s.institutions), `${seed}: a market stands`).toBe(true);
      expect(hook(s), `${seed}: the merchants watch`).toMatch(/and the merchants are watching it decide\.$/);
    }
  });
});

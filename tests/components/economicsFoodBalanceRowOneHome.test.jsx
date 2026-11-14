/** @vitest-environment jsdom */
/**
 * economicsFoodBalanceRowOneHome.test.jsx — W2-C-LEAVES-5 item 4 (the chair's ruling on the food balance row: the
 * round-three cut's #442, #785, #1040, #1366 and the increment's rww-metropolis-famine-1). The Food Security row
 * ("Production: N lbs/day + N imported + N by … provision · Need · Short") reads ONE home with the sentence beside it,
 * the food record (`economicState.foodSecurity`); its figures add up as printed; a remainder of rounding is never
 * printed as an import; under a siege the row follows the sentence (no food comes in by trade, a port's own ships
 * apart). The leaf is `domain/display/foodRowShown.js`.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** The app's own shape (the readers' cfgFor). @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^(?:rww|rr2s|fr4)-(\w+)-([a-z_+]+)(?:-(rand|port|river|road|isolated|crossroads))?-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] && m[3] !== 'rand' ? { tradeRouteAccess: m[3] } : {};
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses,
    _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** @param {string} t @param {RegExp} re @returns {number | null} */
const figure = (t, re) => { const m = t.match(re); return m ? Number(m[1].replace(/,/g, '')) : null; };
/** The Food Security stat row, as printed, and its figures. @param {any} town */
const rowOf = (town) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  const text = [...container.querySelectorAll('div')].map((d) => d.textContent || '').find((x) => /^Production: [\d,]+ lbs\/day/.test(x) && x.length < 200) || '';
  unmount();
  return {
    text,
    production: figure(text, /^Production: ([\d,]+) lbs\/day/),
    imported: figure(text, /\+ ([\d,]+) imported/),
    provision: figure(text, /\+ ([\d,]+) by \w+ provision/),
    need: figure(text, /Need: ([\d,]+) lbs\/day/),
    short: figure(text, /Short: ([\d,]+) lbs\/day/),
  };
};
/** @param {ReturnType<typeof rowOf>} r */
const addsUp = (r) => (r.production ?? 0) + (r.imported ?? 0) + (r.provision ?? 0) + (r.short ?? 0);

afterEach(cleanup);

describe('the food balance row reads the food record and adds up as printed (item 4)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the row prints the food record\'s own pounds, and they add up (#785, #1040, #1366, rww-metropolis-famine-1)', () => {
    for (const seed of ['rr2s-city-famine-rand-1', 'rr2s-city-occupied-rand-1', 'rr2s-metropolis-plague_onset-port-1', 'rww-metropolis-famine-1']) {
      const town = birthApp(seed); const fs = town.economicState.foodSecurity; const via = town.economicViability.metrics.foodBalance;
      expect(via.importCoverage, `anchored: ${seed}'s two homes disagree on the import`).not.toBe(fs.importCoverage);
      const r = rowOf(town);
      expect(r.production, `${seed}: ${r.text}`).toBe(fs.dailyProduction);
      expect(r.need, seed).toBe(fs.dailyNeed);
      expect(r.imported, `${seed}: the food record's import`).toBe(fs.importCoverage);
      expect(r.provision ?? 0, `${seed}: the food record's provision`).toBe(fs.magicOffset);
      expect(addsUp(r), `${seed}: the row adds up as printed: ${r.text}`).toBe(r.need);
    }
  }, 120000);

  test('no remainder of rounding is printed as an import under a siege that imports nothing (#442)', () => {
    const town = birthApp('rr2s-town-under_siege-rand-1');
    expect(town.economicState.foodSecurity.importCoverage, 'anchored: the record imports nothing').toBe(0);
    const r = rowOf(town);
    expect(r.text, 'the row prints').toMatch(/^Production: [\d,]+ lbs\/day/);
    expect(r.text).not.toContain('imported'); // anchored: the line above finds the row
    expect(r.short, r.text).toBe(town.economicState.foodSecurity.dailyNeed - town.economicState.foodSecurity.dailyProduction);
    expect(addsUp(r)).toBe(r.need);
  }, 60000);

  test('under a siege the row follows the sentence: a record that keeps an import share in a town that is no port prints none (fr4-town-under_siege+famine-5)', () => {
    const town = birthApp('fr4-town-under_siege+famine-5');
    expect(town.economicState.foodSecurity.importCoverage, 'anchored: the record still counts an import').toBeGreaterThan(0);
    expect(town.economicState.tradeAccess, 'anchored: no port').not.toBe('port');
    const r = rowOf(town);
    expect(r.text, 'the row prints').toMatch(/^Production: [\d,]+ lbs\/day/);
    expect(r.text).not.toContain('imported'); // anchored: the line above finds the row
    expect(addsUp(r), r.text).toBe(r.need);
  }, 60000);

  test('a pound of rounding is not printed as a shortfall where the record has none (fr4-thorp-calm-1)', () => {
    const town = birthApp('fr4-thorp-calm-1'); const fs = town.economicState.foodSecurity;
    expect(fs.deficit, 'anchored: the record has no shortfall').toBe(0);
    expect(fs.dailyProduction + fs.importCoverage + fs.magicOffset, 'anchored: its rounded parts fall a pound short').toBe(fs.dailyNeed - 1);
    const r = rowOf(town);
    expect(r.text, 'the row prints').toMatch(/^Production: [\d,]+ lbs\/day/);
    expect(r.text).not.toContain('imported'); // anchored: the line above finds the row
    expect(r.text).not.toContain('Short'); // anchored: the row was found two lines above
  }, 60000);
});

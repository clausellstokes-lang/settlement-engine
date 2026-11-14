/** @vitest-environment jsdom */
/**
 * R2-CODE-B item 4 — THE DAILY LIFE FOOD TILE READS THE FOOD RECORD'S BAND (the cold list
 * REVIEW-W2A-3, f385d487b: MEDIUM #848 "Surplus" on a village whose record reads `foodSecurity.label`
 * "Secure", `isSurplus` false, `surplusPct` 15; Overview "Food Security Secure").
 *
 * Two homes said whether the place has food to spare: the tile's own percent from the viability
 * metrics (dailyLifeLogic.js :: foodSurplus, cut at 10) and the food record's band (the home the
 * Overview reads, cut at the band ladder's own surplus point). The tile reads the band.
 */
import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => (typeof selector === 'function' ? selector(mocks.store) : mocks.store);
  useStore.subscribe = () => () => {};
  useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import { DailyLifeTab } from '../../src/components/new/tabs/DailyLifeTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { composeTonightSheet } from '../../src/domain/summary/tonightSheet.js';

afterEach(cleanup);

/** The Food tile's value, as the tab prints it. @param {HTMLElement} c */
const foodTile = (c) => {
  const label = [...c.querySelectorAll('div')].find((d) => d.textContent === 'Food' && d.nextElementSibling);
  return label?.nextElementSibling?.textContent ?? null;
};

describe('the Food tile and the food record', () => {
  test('generated towns: "Surplus" exactly where the record\'s band is surplus', () => {
    const wrong = [];
    let surplus = 0, secureWithSpare = 0;
    for (let i = 0; i < 24; i++) {
      const s = generateSettlementPipeline({ settType: ['village', 'town', 'hamlet'][i % 3] }, null, { seed: `r2b-tile-${i}`, customContent: {} });
      mocks.store = { settlement: s, savedSettlements: [], auth: { tier: 'premium' }, getCost: () => 0 };
      const { container } = render(<DailyLifeTab settlement={s} />);
      const tile = foodTile(container);
      cleanup();
      const band = s.economicState.foodSecurity.foodRecord?.band;
      if (band === 'surplus') surplus += 1;
      if (band === 'secure' && Number(s.economicState.foodSecurity.surplusPct) > 10) secureWithSpare += 1;
      if ((tile === 'Surplus') !== (band === 'surplus') && (tile === 'Surplus' || tile === 'Adequate')) wrong.push(`r2b-tile-${i}: tile ${tile}, band ${band}`);
    }
    expect(surplus + secureWithSpare, 'no generated town tested the cut').toBeGreaterThan(0);
    expect(wrong).toEqual([]);
  }, 120000);
});

/**
 * ROUND THREE item 2b (the chair's ruling on the cut's #843 #1102 #1297 and the increment's #472 #668 #769): THE FOOD LABEL ON
 * EVERY SURFACE READS ONE HOME (tonightSheet.js :: foodBandOf, the food record the Economics tab's stores sentence reads),
 * and a label of plenty never stands beside a deficit. The readers' towns, born in their own shape.
 */
describe('ROUND THREE · the food label reads one home on the Daily Life tile and the Tonight sheet', () => {
  /** @param {string} seed */
  const cfgFor = (seed) => {
    let m = seed.match(/^rr2s-(\w+)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
    if (m) return birthConfig({ ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
    m = /** @type {RegExpMatchArray} */ (seed.match(/^rpf-(\w+)-([a-z_+]+)-(\d+)$/));
    return birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
  };
  const SEEDS = ['rr2s-city-famine-rand-1', 'rr2s-city-occupied-rand-1', 'rr2s-metropolis-wartime-rand-1', 'rpf-thorp-occupied-13', 'rpf-thorp-succession_void-13', 'rpf-thorp-under_siege-13'];
  /** @param {any} s */
  const tileOf = (s) => {
    mocks.store = { settlement: s, savedSettlements: [], auth: { tier: 'premium' }, getCost: () => 0 };
    const { container } = render(<DailyLifeTab settlement={s} />);
    const tile = foodTile(container);
    cleanup();
    return tile;
  };
  test('each reader town: the tile prints the Tonight sheet\'s food word, and never "Secure" or "Surplus" beside a deficit', async () => {
    await loadGenerationLawPayloads();
    /** @type {Record<string, { tile: string | null, tonight: string, gap: number }>} */
    const got = {};
    for (const seed of SEEDS) {
      const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
      const tonight = String(composeTonightSheet(s).facts.find((f) => f.id === 'food')?.text || '').split('. ')[0];
      got[seed] = { tile: tileOf(s), tonight, gap: Number(s.economicState.foodSecurity.foodRecord.gapPct) };
    }
    for (const seed of SEEDS) expect(got[seed].tile, seed).toBe(got[seed].tonight);
    expect(got['rr2s-city-famine-rand-1'].tile).toBe('Deficit — Active Famine');
    expect(got['rpf-thorp-occupied-13']).toMatchObject({ tile: 'Pressured', gap: 2 });
    expect(got['rpf-thorp-succession_void-13']).toMatchObject({ tile: 'Pressured', gap: 5 });
    expect(got['rpf-thorp-under_siege-13'].tile).toBe('Deficit');
    for (const seed of SEEDS) if (got[seed].gap > 0) expect(['Secure', 'Surplus'], seed).not.toContain(got[seed].tile); // anchored: each tile is asserted equal to its Tonight word above
  }, 300000);
  test('GUARD: a town whose record leaves no need unmet keeps "Secure" on both', async () => {
    await loadGenerationLawPayloads();
    const s = generateSettlementPipeline(cfgFor('rpf-city-calm-13'), null, { seed: 'rpf-city-calm-13', customContent: {} });
    expect(s.economicState.foodSecurity.foodRecord).toMatchObject({ band: 'secure', gapPct: 0 });
    expect(tileOf(s)).toBe('Secure');
    expect(composeTonightSheet(s).facts.find((f) => f.id === 'food')?.text).toMatch(/^Secure\. /);
  }, 300000);
});

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

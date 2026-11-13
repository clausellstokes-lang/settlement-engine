/** @vitest-environment jsdom */
/**
 * economicsSiegeAccessOnlyCard.test.jsx — W2-C-LEAVES-4 item 1 (the chair's ruling of 2026-11-13: under a siege in
 * force that the page itself says has cut the roads and taken the outlying fields, a chain that draws on a ground
 * outside the walls, or that runs only through an "Access to ..." row, is not printed as Running).
 *
 * The ground class already reads Impaired (`chainStateShown.js`, W2-C-LEAVES item 4(c)). The class left: a chain whose
 * only house is a neighbour's, reached through an "Access to ..." row ("Faith & Worship · ○ Operational" in a thorp
 * whose roster holds "Access to parish church" and no church, rww-thorp-under_siege-1). Its card prints NO state chip
 * (the siege's own note stands on the tab); no new state word. Guard: a siege town whose own church stands keeps its
 * chip (rww-village-under_siege-1).
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

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

/** The app's own shape, as the increment's reader (ROUND-3-CUT/increment/render.rww.jsx :: cfgFor). @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rww-(\w+)-([a-z_+]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses,
    _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** The header row of each card titled `label`, as text, the Economic Flows section opened. @param {any} town @param {string} label */
const cardHeaders = (town, label) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  for (const e of [...container.querySelectorAll('[aria-expanded="false"]')]) if (/Economic Flows/.test(e.textContent || '')) fireEvent.click(e);
  const rows = [...container.querySelectorAll('span')].filter((s) => s.textContent === label).map((s) => s.parentElement?.textContent || '');
  unmount();
  return rows;
};
const CHIPS = ['✓ Running', '○ Operational', 'Impaired', 'Vulnerable', 'Entrepôt'];
/** @param {any} town */
const names = (town) => town.institutions.map((/** @type {any} */ i) => i.name);

afterEach(cleanup);

describe('under a siege, a chain that runs only through an "Access to ..." row prints no state chip (item 1)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the thorp reaches its church only by access: Faith & Worship prints no chip (rww-thorp-under_siege-1)', () => {
    const town = birthApp('rww-thorp-under_siege-1');
    expect(names(town), 'anchored: the access row').toContain('Access to parish church');
    expect(names(town).some((n) => /^parish church$/i.test(n)), 'anchored: no church of its own').toBe(false);
    expect(town.economicState.activeChains.find((/** @type {any} */ c) => c.chainId === 'parish')?.status, 'anchored: the record keeps its calm state').toBe('operational');
    const rows = cardHeaders(town, 'Faith & Worship');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.map((r) => CHIPS.filter((w) => r.includes(w)))).toEqual(rows.map(() => []));
  }, 60000);

  test('guard: a siege town whose own church stands keeps its chip (rww-village-under_siege-1)', () => {
    const town = birthApp('rww-village-under_siege-1');
    expect(names(town), 'anchored: its own church').toContain('Parish church');
    const rows = cardHeaders(town, 'Faith & Worship');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.includes('✓ Running'))).toBe(true);
  }, 60000);
});

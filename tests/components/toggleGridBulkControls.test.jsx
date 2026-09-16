/** @vitest-environment jsdom */
/**
 * toggleGridBulkControls.test.jsx — the constraint grids' bulk controls
 * (dead-op dispositions, wiring half: `bulkSetGoods`, `bulkSetServices`,
 * `resetAllToggles`).
 *
 * WHAT THIS HOLDS. Three registered operations described a capability the store
 * really had and no surface reached. Two of them — bulkSetGoods / bulkSetServices —
 * had a grid-shaped sibling that DID route properly: InstitutionalGrid sends its
 * Force All / Reset / Exclude All through `bulkSetInstitutions`, while the Goods and
 * Services grids hand-rolled the same three presses as per-key loops inside the
 * component. The third, `resetAllToggles`, had no control at all: each grid could
 * clear its own bag and nothing cleared them together.
 *
 * PARITY IS THE POINT, so these are BEHAVIOR pins, not call-argument spies. Each
 * asserts the exact bag the old in-component loop produced:
 *
 *   Force All   → every visible key set to { allow:true,  force:true,  forceExclude:false }
 *   Exclude All → every visible key set to { allow:false, force:false, forceExclude:true  }
 *   Reset       → the bag emptied whole
 *
 * and the goods key SPELLING is derived here from the data module, independently of
 * the component, so a drift between what a bulk press writes and what a card reads
 * fails here rather than showing up as a grid that will not force.
 *
 * The bulkSetServices signature changed in the same wave (it now takes the caller's
 * key list). That was not cosmetic: rewriting only the bag's EXISTING entries made
 * Force All a no-op on a clean bag, which is exactly why no surface could have used
 * it. The clean-bag case below is that repair's pin.
 *
 * COST NOTE. Both grids are expensive to MOUNT against the real 274-institution
 * catalog (the services panel's catalog match runs ~9s under jsdom), so each grid
 * gets ONE mount and walks its three presses in sequence, with an explicit timeout.
 * Re-mounting per assertion bought no coverage and tripled the file's runtime.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import TradeDynamicsPanel from '../../src/components/TradeDynamicsPanel.jsx';
import ServicesTogglePanel from '../../src/components/ServicesTogglePanel.jsx';
import ResetConstraintsButton from '../../src/components/generate/ResetConstraintsButton.jsx';
import { useStore } from '../../src/store/index.js';
import { GOODS_MODIFIERS_BY_TIER } from '../../src/data/tradeGoodsData.js';

const TIER = 'town';
const SLOW = 120000;

/** The goods-toggle keys the grid's own cards read at this tier (getKey's rule). */
const expectedGoodKeys = Object.keys(GOODS_MODIFIERS_BY_TIER[TIER] || {})
  .map(name => `${TIER}_good_${name}`).sort();

const FORCED = { allow: true, force: true, forceExclude: false };
const EXCLUDED = { allow: false, force: false, forceExclude: true };

function resetBags() {
  useStore.setState({
    institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  });
}

beforeEach(() => {
  useStore.setState({ config: { ...useStore.getState().config, settType: TIER } });
  resetBags();
});
afterEach(() => { cleanup(); resetBags(); });

const press = (name) => fireEvent.click(screen.getByRole('button', { name }));

describe('the goods grid routes its strip through bulkSetGoods', () => {
  test('force, exclude and reset write exactly the tier keys the cards read', () => {
    render(<TradeDynamicsPanel />);
    expect(expectedGoodKeys.length).toBeGreaterThan(0);

    press('Force All');
    const forced = useStore.getState().goodsToggles;
    expect(Object.keys(forced).sort()).toEqual(expectedGoodKeys);
    for (const key of expectedGoodKeys) expect(forced[key]).toEqual(FORCED);

    press('Exclude All');
    const excluded = useStore.getState().goodsToggles;
    expect(Object.keys(excluded).sort()).toEqual(expectedGoodKeys);
    for (const key of expectedGoodKeys) expect(excluded[key]).toEqual(EXCLUDED);

    // Reset clears the WHOLE bag, including a key from a tier this grid is not
    // showing — the same thing the old `setGoodsToggles({})` did.
    useStore.setState(state => ({
      goodsToggles: { ...state.goodsToggles, 'city_good_Silk': { ...FORCED } },
    }));
    press('Reset');
    expect(useStore.getState().goodsToggles).toEqual({});
  }, SLOW);
});

describe('the services grid routes its strip through bulkSetServices', () => {
  test('force, exclude and reset reach services nobody has touched yet', () => {
    expect(useStore.getState().servicesToggles).toEqual({});
    render(<ServicesTogglePanel />);

    // FORCE on a CLEAN bag — the repair. The previous implementation rewrote only
    // entries the bag already had, so this press wrote nothing whatsoever.
    press('Force All');
    const forced = useStore.getState().servicesToggles;
    const keys = Object.keys(forced).sort();
    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) {
      // The svcKey-keyed spelling the panel's own cards read.
      expect(key).toMatch(/_service_/);
      expect(forced[key]).toEqual(FORCED);
    }

    press('Exclude All');
    const excluded = useStore.getState().servicesToggles;
    expect(Object.keys(excluded).sort()).toEqual(keys);
    for (const key of keys) expect(excluded[key]).toEqual(EXCLUDED);

    press('Reset');
    expect(useStore.getState().servicesToggles).toEqual({});
  }, SLOW);
});

// A guard against the pins above quietly measuring nothing: if a later refactor
// re-inlines the per-key loops, every bag assertion would still pass. These two
// prove the registered operations are what the strips actually dispatch.
describe('the grids dispatch the registered operations, not a re-inlined loop', () => {
  const realGoods = useStore.getState().bulkSetGoods;
  const realServices = useStore.getState().bulkSetServices;
  afterEach(() => {
    useStore.setState({ bulkSetGoods: realGoods, bulkSetServices: realServices });
  });

  test('the goods strip calls bulkSetGoods for all three presses', () => {
    const spy = vi.fn();
    useStore.setState({ bulkSetGoods: spy });
    render(<TradeDynamicsPanel />);
    press('Force All');
    press('Exclude All');
    press('Reset');
    expect(spy.mock.calls.map(c => c[0])).toEqual(['force', 'exclude', 'reset']);
    // Force/exclude carry the tier-grouped catalog; reset needs no payload.
    expect(spy.mock.calls[0][1]).toHaveProperty(TIER);
  }, SLOW);

  test('the services strip calls bulkSetServices with its own key list', () => {
    const spy = vi.fn();
    useStore.setState({ bulkSetServices: spy });
    render(<ServicesTogglePanel />);
    press('Force All');
    press('Reset');
    expect(spy.mock.calls.map(c => c[0])).toEqual(['force', 'reset']);
    const keys = spy.mock.calls[0][1];
    expect(Array.isArray(keys)).toBe(true);
    expect(keys.length).toBeGreaterThan(0);
    expect(keys.every(k => typeof k === 'string' && k.includes('_service_'))).toBe(true);
  }, SLOW);
});

describe('the Create panel clears every constraint through resetAllToggles', () => {
  test('the control is inert, and says so, while nothing is set', () => {
    render(<ResetConstraintsButton />);
    expect(screen.getByRole('button', { name: 'Clear all' }).disabled).toBe(true);
    expect(screen.getByText(/nothing forced or forbidden yet/i)).toBeTruthy();
  });

  test('it counts what is set across the three grids and clears all four bags', () => {
    useStore.setState({
      institutionToggles: { 'town::Economy::Market': { allow: true, require: true, forceExclude: false } },
      categoryToggles: { 'town::Economy': false },
      goodsToggles: { 'town_good_Iron': { ...EXCLUDED } },
      servicesToggles: { 'Smithy_service_Repairs': { ...FORCED } },
    });
    render(<ResetConstraintsButton />);
    expect(screen.getByText(/4 set across the three/)).toBeTruthy();
    const button = screen.getByRole('button', { name: 'Clear all' });
    expect(button.disabled).toBe(false);
    fireEvent.click(button);

    const state = useStore.getState();
    expect(state.institutionToggles).toEqual({});
    expect(state.categoryToggles).toEqual({});
    expect(state.goodsToggles).toEqual({});
    expect(state.servicesToggles).toEqual({});
    // The control re-reads its own emptiness rather than staying stale.
    expect(screen.getByRole('button', { name: 'Clear all' }).disabled).toBe(true);
  });
});

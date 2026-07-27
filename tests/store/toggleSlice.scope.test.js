/**
 * tests/store/toggleSlice.scope.test.js — Wave R-3 Lane C: owner-queue #9
 * verdict pins. The toggle surface is store-GLOBAL BY DESIGN (generation
 * settings, the `config` class), and that verdict is only coherent while
 * the four layers below keep agreeing. Each pin guards one layer, so a
 * refactor that silently breaks the coherence (the thing that WOULD turn
 * global scope into a cross-settlement-bleed bug) fails here first.
 *
 * Pins:
 *   • DECLARED SCOPE — every registered toggleSlice op says
 *     targetScope:'global', and the op inventory is exactly the 15 the
 *     verdict covered (a new toggle op must re-face this contract).
 *   • PER-SETTLEMENT CAPTURE — generateSettlement stamps all four live
 *     bags into the pipeline config (_institutionToggles …), and
 *     resolveConfig consumes all four snapshot keys. This capture is what
 *     makes global scope safe: an existing settlement's generation inputs
 *     are immutable provenance, so bag edits can never rewrite it.
 *   • ROUND-TRIP RESTORE — the Library load path restores all four
 *     save-captured bags into the global store, so re-generation from a
 *     loaded save reproduces its settings.
 *   • GLOBAL KEY SHAPE — toggle writes key on the content catalog
 *     (tier::category::name), never on a save identity; resets clear
 *     whole bags.
 *
 * Source scans follow the fieldManifest.js walking-test idiom (regex over
 * the file's text, paths repo-root-relative).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { OPERATIONS, EXEMPT_OPERATIONS } from '../../src/store/operationRegistry.js';
import { createToggleSlice } from '../../src/store/toggleSlice.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const EXPECTED_TOGGLE_OPS = [
  'toggleInstitution', 'setInstitutionToggles', 'mergeInstitutionToggles',
  'toggleCategory', 'setCategoryToggles',
  'toggleGood', 'setGoodsToggles',
  'toggleService', 'setServiceToggles',
  'resetToggles', 'resetGoodsServices', 'resetAllToggles',
  'bulkSetInstitutions', 'bulkSetServices', 'bulkSetGoods',
];

const BAGS = ['institutionToggles', 'categoryToggles', 'goodsToggles', 'servicesToggles'];

describe('declared scope — the registry layer', () => {
  test('the toggleSlice op inventory is exactly the 15 the verdict covered', () => {
    const registered = Object.values(OPERATIONS)
      .filter(op => op.slice === 'toggleSlice')
      .map(op => op.opType)
      .sort();
    expect(registered).toEqual([...EXPECTED_TOGGLE_OPS].sort());
  });

  test('every toggleSlice op declares targetScope:global', () => {
    for (const name of EXPECTED_TOGGLE_OPS) {
      expect(OPERATIONS[name]?.targetScope, `${name} must stay store-global or re-face queue #9`).toBe('global');
    }
  });

  test('hydrateServicesToggles stays exempt-with-reason (the 16th surface)', () => {
    expect(EXEMPT_OPERATIONS.hydrateServicesToggles?.reason).toMatch(/loaded save/);
  });
});

describe('per-settlement capture — the generation seam', () => {
  test('generateSettlement snapshots all four live bags into the pipeline config', () => {
    const src = read('src/store/settlementSlice.js');
    for (const bag of BAGS) {
      const probe = new RegExp(`_${bag}:\\s*${bag}`);
      expect(probe.test(src), `settlementSlice must stamp _${bag} into fullConfig`).toBe(true);
    }
  });

  test('resolveConfig consumes all four snapshot keys', () => {
    const src = read('src/generators/steps/resolveConfig.js');
    for (const bag of BAGS) {
      const probe = new RegExp(`config\\._${bag}`);
      expect(probe.test(src), `resolveConfig must read config._${bag}`).toBe(true);
    }
  });
});

describe('round-trip restore — the Library load seam', () => {
  test('onLoad restores all four save-captured bags into the global store', () => {
    const src = read('src/components/SettlementsPanel.jsx');
    expect(/setInstitutionToggles\(data\.institutionToggles\)/.test(src)).toBe(true);
    expect(/setCategoryToggles\(data\.categoryToggles\)/.test(src)).toBe(true);
    expect(/setGoodsToggles\(data\.goodsToggles\)/.test(src)).toBe(true);
    expect(/setServiceToggles\(data\.servicesToggles\)/.test(src)).toBe(true);
  });
});

describe('global key shape — the slice behavior', () => {
  function makeSlice() {
    const state = {};
    const set = (fn) => fn(state);
    const get = () => ({ ...state, ...slice });
    const slice = createToggleSlice(set, get);
    Object.assign(state, {
      institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
    });
    return { state, slice };
  }

  test('toggle writes key on the content catalog, never a save identity', () => {
    const { state, slice } = makeSlice();
    slice.toggleInstitution('town', 'trade', 'Market', 'require');
    slice.toggleCategory('town', 'trade');
    slice.toggleGood('town_good_Iron', true);
    slice.toggleService('Smithy_service_Repairs', true);
    expect(Object.keys(state.institutionToggles)).toEqual(['town::trade::Market']);
    expect(Object.keys(state.categoryToggles)).toEqual(['town::trade']);
    expect(Object.keys(state.goodsToggles)).toEqual(['town_good_Iron']);
    expect(Object.keys(state.servicesToggles)).toEqual(['Smithy_service_Repairs']);
  });

  test('resetAllToggles clears every bag whole', () => {
    const { state, slice } = makeSlice();
    slice.toggleInstitution('town', 'trade', 'Market');
    slice.toggleGood('town_good_Iron', true);
    slice.resetAllToggles();
    for (const bag of BAGS) expect(state[bag]).toEqual({});
  });
});

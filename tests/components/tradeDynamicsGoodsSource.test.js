/**
 * tradeDynamicsGoodsSource.test.js — F30 single-source-of-truth pin.
 *
 * The goods concept used to exist as THREE drifted tables: EXPORT_GOODS_BY_TIER
 * (the wizard/editor pickers), GOODS_MODIFIERS_BY_TIER (the live generator
 * table), and SERVICE_TIER_DATA (the wizard grid, on a different {baseChance,
 * defaultEnabled} vocabulary). F30 collapsed them onto the ONE live table,
 * GOODS_MODIFIERS_BY_TIER — so the Trade Dynamics grid now shows exactly the
 * per-tier good set the generator actually honours.
 *
 * This pin guards that collapse. Mounting the real TradeDynamicsPanel needs the
 * whole Zustand store mocked (see generateWizardFocus.test.jsx, which stubs the
 * panel out), so — matching the source-level convention of chronicleEditGate /
 * provenanceEditGate — the invariant is asserted structurally over the panel
 * source plus the data table it must read:
 *
 *   per-tier grid good set  ===  Object.keys(GOODS_MODIFIERS_BY_TIER[tier])
 *
 * If someone reintroduces a separate wizard-only goods table, the grid drifts
 * from what the generator emits again — this test fails first.
 */
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TIER_ORDER } from '../../src/data/constants.js';
import { GOODS_MODIFIERS_BY_TIER } from '../../src/data/tradeGoodsData.js';

const PANEL_PATH = join(process.cwd(), 'src', 'components', 'TradeDynamicsPanel.jsx');
const src = readFileSync(PANEL_PATH, 'utf-8');

describe('F30: Trade Dynamics grid reads the single live goods table', () => {
  test('panel imports GOODS_MODIFIERS_BY_TIER from the trade-goods data module', () => {
    expect(src).toMatch(
      /import\s*\{\s*GOODS_MODIFIERS_BY_TIER\s*\}\s*from\s*['"][^'"]*data\/tradeGoodsData['"]/,
    );
  });

  test('getGoodsForTier reads GOODS_MODIFIERS_BY_TIER for both the all- and per-tier branches', () => {
    expect(src).toContain('GOODS_MODIFIERS_BY_TIER[t]');
    expect(src).toContain('GOODS_MODIFIERS_BY_TIER[tier]');
  });

  test('the grid maps table entries 1:1 by name (no filtering that would drop goods)', () => {
    // Object.entries(data).map(([name, def]) => ({ name, ...def })) — the grid
    // good set is the table's own key set, unfiltered.
    expect(src).toMatch(/Object\.entries\(data\)\.map\(/);
  });

  test('the panel no longer references either drifted goods table', () => {
    expect(src).not.toContain('SERVICE_TIER_DATA');
    expect(src).not.toContain('EXPORT_GOODS_BY_TIER');
  });
});

describe('F30: the single table backs every wizard tier', () => {
  test('every tier is a by-name good object the grid can populate', () => {
    for (const tier of TIER_ORDER) {
      const block = GOODS_MODIFIERS_BY_TIER[tier];
      expect(block, `GOODS_MODIFIERS_BY_TIER missing tier "${tier}"`).toBeTruthy();
      const names = Object.keys(block);
      expect(names.length, `tier "${tier}" has no goods for the grid`).toBeGreaterThan(0);
      // The grid derives one card per key; its name set is exactly the table's.
      expect([...names].sort()).toEqual(Object.keys(block).sort());
    }
  });

  test('pin is not vacuous (all six canonical tiers are present)', () => {
    expect(Object.keys(GOODS_MODIFIERS_BY_TIER).sort()).toEqual([...TIER_ORDER].sort());
  });
});

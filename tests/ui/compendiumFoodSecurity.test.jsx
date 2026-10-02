/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumFoodSecurity.test.jsx — Compendium-completion Wave G pin.
 *
 * THE GAP: the dossier binds a headline stat to the foodGenerator's Food Security band
 * ladder (Surplus / Secure / Pressured / Import-Dependent / Deficit / Active Famine),
 * but the Compendium never defined it. This pins the new ladder to the PRODUCER labels
 * so a rename in the ladder's one home reds the copy, and confirms it renders on the Economy tab.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';
import { EconomyTab } from '../../src/components/compendium/CatalogTabs.jsx';
import { FOOD_SECURITY_BANDS } from '../../src/data/bandLadders.js';

afterEach(cleanup);

describe('compendium food security — bound to the foodGenerator labels', () => {
  const ladder = CD.bandLadders.find((l) => l.id === 'food-security');

  test('the ladder exists with all six rungs', () => {
    expect(ladder, 'food-security ladder present').toBeTruthy();
    expect(ladder.levels.map((x) => x.name)).toEqual([
      'Surplus', 'Secure', 'Pressured', 'Import-Dependent', 'Deficit', 'Active Famine',
    ]);
  });

  test('every rung name is a real foodGenerator label (drift guard)', () => {
    // The Compendium's top rung is `Active Famine` and the producer's is
    // `Deficit — Active Famine`, so the relation the old `src.includes(name)` had by
    // accident is stated on purpose here: a rung name is a SUBSTRING of a real label.
    const produced = Object.values(FOOD_SECURITY_BANDS).map((band) => band.label);
    for (const { name } of ladder.levels) {
      expect(produced.some((label) => label.includes(name)), `the food ladder no longer stamps the label "${name}"`).toBe(true);
    }
  });

  test('the Economy tab renders the Food Security ladder', () => {
    const { container } = render(<EconomyTab />);
    const text = container.textContent || '';
    expect(text.includes('Food Security')).toBe(true);
    for (const lvl of ladder.levels) {
      expect(text.includes(lvl.name), `Economy tab missing rung "${lvl.name}"`).toBe(true);
      expect(text.includes(lvl.reading), `Economy tab missing reading for "${lvl.name}"`).toBe(true);
    }
  });
});

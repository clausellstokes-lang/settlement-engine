/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumSafetyDefense.test.jsx — Compendium-completion Wave J pin.
 *
 * The dossier shows a Safety band and a per-arm Defense readiness badge throughout, but
 * neither vocabulary was defined in the Compendium. This pins the two new ladders to
 * their producers (safetyProfile labels, defenseDisplay readinessBadge) so a rename reds
 * the copy, and confirms they render on the Stress tab.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';
import { StressTab } from '../../src/components/compendium/CatalogTabs.jsx';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

afterEach(cleanup);

describe('compendium safety + defense — bound to their producers', () => {
  test('the Safety ladder rung names are the real safetyProfile labels', () => {
    const ladder = CD.bandLadders.find((l) => l.id === 'safety');
    expect(ladder, 'safety ladder present').toBeTruthy();
    expect(ladder.levels.map((x) => x.name)).toEqual(['Very Safe', 'Safe', 'Moderate', 'Unsafe', 'Dangerous']);
    const src = read('src/generators/safetyProfile.js');
    for (const { name } of ladder.levels) {
      expect(src.includes(`'${name}'`), `safetyProfile no longer stamps "${name}"`).toBe(true);
    }
  });

  // R-5b item #20 re-pointed this scan: the four badge words moved out of
  // defenseDisplay.js into display/defenseScoreBands.js, THE ONE ladder every
  // score surface (OverviewTab, DefenseTab, SummaryTab, the PDF readiness rows)
  // now reads. The contract is unchanged — the compendium ladder must still name
  // exactly what the producer stamps — only the producer's address moved.
  test('the Defense Readiness badges are the real defenseScoreBands bands', () => {
    const ladder = CD.bandLadders.find((l) => l.id === 'defense-readiness');
    expect(ladder, 'defense-readiness ladder present').toBeTruthy();
    expect(ladder.levels.map((x) => x.name)).toEqual(['Strong', 'Adequate', 'Weak', 'Critical']);
    const src = read('src/domain/display/defenseScoreBands.js');
    for (const { name } of ladder.levels) {
      expect(src.includes(`'${name.toUpperCase()}'`), `defenseScoreBands no longer stamps badge "${name.toUpperCase()}"`).toBe(true);
    }
    // ...and defenseDisplay must reach it through the shared leaf, never a twin.
    expect(read('src/domain/display/defenseDisplay.js')).toContain("from './defenseScoreBands.js'");
  });

  test('the Stress tab renders both ladders', () => {
    const { container } = render(<StressTab />);
    const text = container.textContent || '';
    for (const id of ['safety', 'defense-readiness']) {
      const l = CD.bandLadders.find((x) => x.id === id);
      expect(text.includes(l.concept), `Stress tab missing "${l.concept}"`).toBe(true);
      for (const lvl of l.levels) expect(text.includes(lvl.name), `Stress tab missing rung "${lvl.name}"`).toBe(true);
    }
  });
});

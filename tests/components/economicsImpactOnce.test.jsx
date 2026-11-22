/** @vitest-environment jsdom */
/**
 * X-50 on the Economics tab (the owner, 2026-11-03: BOILERPLATE ONCE). Each dependent chain
 * card printed "Needs {resource} - {impact}", and generation gives every chain of a settlement
 * the same impact sentence, so "Dependent on trade routes. Siege, road closure, or blockade
 * would impair operations." printed up to thirteen times on one tab. The impact prints once,
 * on the first card that carries it; every card keeps its own "Needs {resource}".
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = ['germanic', 'mediterranean', 'norse', 'celtic', 'slavic'];
const SEEDS = Array.from({ length: 60 }, (_, i) => ({
  seed: `x50-trim-${i}`,
  config: { settType: TIERS[i % TIERS.length], culture: CULTURES[i % CULTURES.length] },
}));

/** @param {string} hay @param {string} needle */
const countOf = (hay, needle) => hay.split(needle).length - 1;

const ROWS = [];
beforeAll(() => {
  for (const { seed, config } of SEEDS) {
    const s = generateSettlementPipeline(config, null, { seed, customContent: {} });
    const { container } = render(<EconomicsTab economicState={s.economicState} settlement={s} />);
    const deps = (s.economicState?.activeChains || []).map((c) => c?.dependency).filter(Boolean);
    ROWS.push({ seed, text: container.textContent || '', deps });
    cleanup();
  }
}, 600000);
afterEach(cleanup);

describe('X-50: the Economics impact line prints once per tab', () => {
  test('each dependency impact sentence prints once on the Economics tab, and every card keeps its need', () => {
    const offenders = [];
    let shared = 0;
    let needLines = 0;
    for (const { seed, text, deps } of ROWS) {
      const impacts = [...new Set(deps.map((d) => d.impact).filter(Boolean))];
      if (deps.length > impacts.length) shared += 1;
      // the cards a tab renders carry a need line each; a tab that renders no dependent card
      // prints no impact either way
      const shown = countOf(text, 'Needs ');
      if (shown > 0) needLines += shown;
      for (const impact of impacts) {
        const n = countOf(text, impact);
        if (shown > 0 && n !== 1) offenders.push(`${seed}: printed ${n}x: ${impact}`);
      }
    }
    expect(needLines, 'the tabs rendered almost no need line').toBeGreaterThan(100);
    expect(shared, 'no settlement had two chains under one impact').toBeGreaterThan(10);
    expect(offenders, offenders.slice(0, 60).join('\n')).toEqual([]);
  });
});

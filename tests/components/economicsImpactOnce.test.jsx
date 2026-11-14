/** @vitest-environment jsdom */
/**
 * X-50 on the Economics tab (the owner, 2026-11-03: BOILERPLATE ONCE). Each dependent chain
 * card printed "Needs {resource} - {impact}", and generation gives every chain of a settlement
 * the same impact sentence, so "Dependent on trade routes. Siege, road closure, or blockade
 * would impair operations." printed up to thirteen times on one tab. The impact prints once,
 * on the first card that carries it; every card keeps its own "Needs {resource}".
 * RE-KEYED BY IDENTITY (W2-C-LEAVES-6 item 6, the chair's ruling on #920 #1044 #1047 #1049): the card states its need in
 * ONE sentence (domain/display/chainNeedShown.js :: chainNeedLine) and the impact's boilerplate is now that sentence's
 * shared clause (", which a siege, a closed road or a blockade would cut off" in calm; ": no trade road reaches <town>"
 * on an isolated route): it prints once per tab, on the first card that states a need; every card keeps its own need.
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

describe('X-50: the Economics need sentence\'s shared clause prints once per tab', () => {
  test('the shared clause of the need sentence prints once on the Economics tab, and every card keeps its need', () => {
    const offenders = [];
    let shared = 0;
    let needLines = 0;
    const SHARED = [', which a siege, a closed road or a blockade would cut off', ': no trade road reaches '];
    for (const { seed, text, deps } of ROWS) {
      if (deps.length > 1) shared += 1;
      const shown = countOf(text, ' here depend on ') + countOf(text, ' here run on ');
      needLines += shown;
      const clauses = SHARED.reduce((n, c) => n + countOf(text, c), 0);
      if (clauses > 1 || (shown > 0 && clauses === 0 && !text.includes('which the siege has cut off'))) offenders.push(`${seed}: the shared clause printed ${clauses}x beside ${shown} need lines`);
    }
    expect(needLines, 'the tabs rendered almost no need line').toBeGreaterThan(100);
    expect(shared, 'no settlement had two dependent chains').toBeGreaterThan(10);
    expect(offenders, offenders.slice(0, 60).join('\n')).toEqual([]);
  });
});

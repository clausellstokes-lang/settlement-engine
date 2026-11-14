/** @vitest-environment jsdom */
/**
 * ITEM 3′ (COHERENCE-AGREE-4, the chair's ruling of 2026-11-12): a chain card on the Economics tab prints its
 * table's outputs under "Outputs" only where the chain yields them. A chain the exporter refuses (impaired, or its
 * primary input depleted: `domain/chainYield.js :: chainYieldRefused`, the exporter's own predicate) prints the
 * same outputs under "Normally yields": what it makes when whole, not what it makes now.
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { NORMALLY_YIELDS, chainYieldRefused } from '../../src/domain/chainYield.js';
import { chainOutputsShown } from '../../src/domain/display/tradeListDisplay.js';

const TIERS = ['village', 'town', 'city', 'metropolis'];
const SEEDS = Array.from({ length: 24 }, (_, i) => ({ seed: `yield-label-${i}`, config: { settType: TIERS[i % TIERS.length] } }));
const countOf = (hay, needle) => hay.split(needle).length - 1;

const ROWS = [];
beforeAll(() => {
  for (const { seed, config } of SEEDS) {
    const s = generateSettlementPipeline(config, null, { seed, customContent: {} });
    const { container } = render(<EconomicsTab economicState={s.economicState} settlement={s} />);
    // the Economic Flows section opens by default only when a chain is impaired: open it where it is shut
    const toggle = [...container.querySelectorAll('[aria-expanded]')].find((b) => /Economic Flows/.test(b.textContent || ''));
    if (toggle && toggle.getAttribute('aria-expanded') === 'false') fireEvent.click(toggle);
    // W2-C-LEAVES-13, re-keyed by identity: a card prints a header over the outputs it bears out (tradeListDisplay.js ::
    // chainOutputsShown, W2-C-LEAVES-6 item 7; no maker row, no output, W2-C-LEAVES-12); a card with none prints neither
    const chains = (s.economicState?.activeChains || []).filter((c) => chainOutputsShown(c, s).length > 0);
    ROWS.push({ seed, text: container.textContent || '', refused: chains.filter((c) => chainYieldRefused(c)).length, whole: chains.filter((c) => !chainYieldRefused(c)).length });
    cleanup();
  }
}, 600000);
afterEach(cleanup);

describe('item 3′: the chain card labels a refused chain\'s outputs as what it normally yields', () => {
  test('one "Normally yields" per refused chain, one "Outputs" per chain that yields', () => {
    const offenders = ROWS.filter((r) => countOf(r.text, NORMALLY_YIELDS) !== r.refused || countOf(r.text, 'Outputs') !== r.whole)
      .map((r) => `${r.seed}: yields ${countOf(r.text, NORMALLY_YIELDS)}/${r.refused}, outputs ${countOf(r.text, 'Outputs')}/${r.whole}`);
    expect(ROWS.reduce((n, r) => n + r.refused, 0), 'no refused chain in the sample').toBeGreaterThan(5);
    expect(offenders).toEqual([]);
  });
});

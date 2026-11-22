/**
 * @vitest-environment jsdom
 *
 * tests/components/customPopulationNoCap.test.jsx — X-46 car 1b, THE UI CAP (the owner,
 * 2026-11-04: "wait, we have a cap on metropolis? it should not have a cap."). The DM's custom
 * population input carries a floor (min 10) and no ceiling; the engine passes the number through
 * unclamped and the stamp calls anything at or above 15,000 a metropolis, however large.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';

import ConfigurationPanel from '../../src/components/ConfigurationPanel.jsx';
import { useStore } from '../../src/store/index.js';
import { popToTier } from '../../src/data/constants.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

afterEach(cleanup);

describe('the custom population has no ceiling', () => {
  test('the custom population input carries min 10 and no max attribute', () => {
    act(() => {
      useStore.setState({
        config: { ...useStore.getState().config, settType: 'custom', population: 130000 },
        canCustomizePreGeneration: () => true,
      });
    });
    const { getByLabelText } = render(<ConfigurationPanel />);
    const input = getByLabelText('Custom Population');
    expect(input.getAttribute('min')).toBe('10');
    expect(input.hasAttribute('max')).toBe(false);
  });

  test('the stamp reads 130,000 and 1,500,000 as a metropolis, and the engine keeps the number', () => {
    expect(popToTier(130000)).toBe('metropolis');
    expect(popToTier(1500000)).toBe('metropolis');
    const record = generateSettlementPipeline({ settType: 'custom', population: 1500000 }, null, { seed: 'x46-1b-custom-1500000', customContent: {} });
    expect(record.tier).toBe('metropolis');
    expect(record.population).toBe(1500000);
  }, 60000);
});

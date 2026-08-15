/**
 * @vitest-environment jsdom
 *
 * worldCertificationPanel.test.jsx — VISION V-10, the panel renders the honest
 * pending state and states no claim (DOM-level claims-parity). With the shipped
 * empty manifest, whatever preset the world runs, the panel shows PENDING and no
 * number/proof-vocabulary reaches the DOM.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';

const storeState = {
  campaigns: [{ id: 'c1', worldState: { simulationRules: { presetId: 'realistic_regional' } } }],
  activeCampaignId: 'c1',
};
import { vi } from 'vitest';
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

import WorldCertificationPanel from '../../src/components/settlement/WorldCertificationPanel.jsx';

afterEach(() => cleanup());

const PROOF_VOCAB = /\b(certified|proven|proof|guaranteed|soaked|byte-for-byte|endur\w*)\b/i;

describe('WorldCertificationPanel — inert-honest pending', () => {
  it('renders the Pending badge and the incomplete headline', () => {
    render(<WorldCertificationPanel />);
    expect(screen.getByTestId('certification-status').textContent).toBe('Pending');
    expect(screen.getByText(/long-horizon proving is not yet complete/i)).toBeTruthy();
  });

  it('the rendered DOM states no number and no proof vocabulary', () => {
    const { container } = render(<WorldCertificationPanel />);
    const text = container.textContent || '';
    expect(/\d/.test(text), `pending panel rendered a number: "${text}"`).toBe(false);
    expect(PROOF_VOCAB.test(text), `pending panel used proof vocabulary: "${text}"`).toBe(false);
  });
});

/** @vitest-environment jsdom */
/**
 * PlaceInRegionCard — W4f. The birth-time campaign + patron-deity picker and its
 * PREMIUM GATE. A non-premium (free / anon) user sees a read-only teaser with an
 * Upgrade CTA and NEVER an interactive control; only a premium user
 * (canUseCustomContent) gets the campaign / deity selects.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = {};
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  useStore.__reset = () => {
    for (const k of Object.keys(data)) delete data[k];
    Object.assign(data, {
      config: {},
      updateConfig: () => {},
      campaigns: [],
      customContent: {},
      canUseCustomContent: () => false,
      setPurchaseModalOpen: () => {},
    });
  };
  return { useStore };
});

import { useStore } from '../../src/store/index.js';
import PlaceInRegionCard from '../../src/components/generate/PlaceInRegionCard.jsx';

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('PlaceInRegionCard — premium gate', () => {
  it('free / non-premium sees the teaser + Upgrade, and NO interactive control', () => {
    useStore.__set({ canUseCustomContent: () => false });
    render(<PlaceInRegionCard />);
    expect(screen.getByTestId('place-in-region-card')).toBeTruthy();
    expect(screen.getByText('Upgrade')).toBeTruthy();
    // The interactive deity/campaign controls must NOT render for a free user.
    expect(document.getElementById('place-campaign')).toBeNull();
    expect(document.getElementById('place-deity')).toBeNull();
  });

  it('premium sees the interactive campaign + patron-deity selects', () => {
    useStore.__set({ canUseCustomContent: () => true });
    render(<PlaceInRegionCard />);
    expect(document.getElementById('place-campaign')).toBeTruthy();
    expect(document.getElementById('place-deity')).toBeTruthy();
    // No upgrade CTA for a premium user.
    expect(screen.queryByText('Upgrade')).toBeNull();
  });
});

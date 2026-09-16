/**
 * @vitest-environment jsdom
 *
 * tests/ui/accountPreferencesSection.test.jsx — Phase A2 Product Preferences UI.
 *
 * Pins that each product-default control persists to the store via
 * setProductPref. Email choices live in the separate durable category section.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';

afterEach(cleanup);

const setProductPref = vi.fn();
const storeState = {
  productPrefs: {
    aiPolishDefault: false,
    pdfStyle: 'classic',
    campaignMapAutosave: true,
  },
  setProductPref,
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

let AccountPreferencesSection;
beforeEach(async () => {
  vi.clearAllMocks();
  ({ default: AccountPreferencesSection } = await import('../../src/components/account/AccountPreferencesSection.jsx'));
});

describe('AccountPreferencesSection — persistence', () => {
  it('narrate-by-default persists via setProductPref', () => {
    render(<AccountPreferencesSection />);
    // Label moved to the house voice ("Narrate ...", never "AI"); the pref key is unchanged.
    fireEvent.click(screen.getByLabelText('Narrate new settlements by default'));
    expect(setProductPref).toHaveBeenCalledWith('aiPolishDefault', true);
  });

  it('PDF style persists via setProductPref', () => {
    render(<AccountPreferencesSection />);
    fireEvent.change(screen.getByLabelText('Default PDF style'), { target: { value: 'parchment' } });
    expect(setProductPref).toHaveBeenCalledWith('pdfStyle', 'parchment');
  });

  it('campaign map autosave persists via setProductPref', () => {
    render(<AccountPreferencesSection />);
    fireEvent.click(screen.getByLabelText('Auto-save campaign map edits'));
    expect(setProductPref).toHaveBeenCalledWith('campaignMapAutosave', false);
  });

  it('does not duplicate the retired generic email-notifications toggle', () => {
    render(<AccountPreferencesSection />);
    expect(screen.queryByLabelText('Email notifications preference')).toBeNull();
  });
});

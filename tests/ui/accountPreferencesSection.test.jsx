/**
 * @vitest-environment jsdom
 *
 * tests/ui/accountPreferencesSection.test.jsx — Phase A2 Product Preferences UI.
 *
 * Pins that each preference control persists to the store via setProductPref
 * (durable productPrefs), and that the notification toggle reuses the profile
 * emailNotifications handler passed from AccountPage.
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
    render(<AccountPreferencesSection emailNotifications setEmailNotifications={vi.fn()} />);
    // Label moved to the house voice ("Narrate ...", never "AI"); the pref key is unchanged.
    fireEvent.click(screen.getByLabelText('Narrate new settlements by default'));
    expect(setProductPref).toHaveBeenCalledWith('aiPolishDefault', true);
  });

  it('PDF style persists via setProductPref', () => {
    render(<AccountPreferencesSection emailNotifications setEmailNotifications={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Default PDF style'), { target: { value: 'parchment' } });
    expect(setProductPref).toHaveBeenCalledWith('pdfStyle', 'parchment');
  });

  it('campaign map autosave persists via setProductPref', () => {
    render(<AccountPreferencesSection emailNotifications setEmailNotifications={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Auto-save campaign map edits'));
    expect(setProductPref).toHaveBeenCalledWith('campaignMapAutosave', false);
  });

  it('email-notifications toggle reuses the profile handler (not productPrefs)', () => {
    const setEmailNotifications = vi.fn();
    render(<AccountPreferencesSection emailNotifications setEmailNotifications={setEmailNotifications} />);
    fireEvent.click(screen.getByLabelText('Email notifications preference'));
    expect(setEmailNotifications).toHaveBeenCalledWith(false);
    expect(setProductPref).not.toHaveBeenCalled();
  });
});

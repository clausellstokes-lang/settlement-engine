/** @vitest-environment jsdom */
/**
 * accountAutoReload.test.jsx — the auto-reload account panel (M-3e, §4.6).
 * Drives the self-fetch + save flow (lazy autoReloadClient mocked), asserting the
 * form renders, the toggle + save maps to set_auto_reload_settings, the open-attempt
 * status shows, save errors surface, and a signed-out visitor sees nothing.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  fetchSettings: vi.fn(),
  fetchStatus: vi.fn(),
  saveSettings: vi.fn(),
}));

vi.mock('../../src/lib/autoReloadClient.js', () => ({
  AUTO_RELOAD_DEFAULTS: { enabled: false, thresholdCredits: 5, targetCredits: 25, monthlyCapCents: 4000 },
  AUTO_RELOAD_LIMITS: { threshold: { min: 1, max: 500 }, target: { min: 2, max: 1000 }, capCents: { min: 500, max: 20000 } },
  fetchAutoReloadSettings: (...a) => mocks.fetchSettings(...a),
  fetchAutoReloadStatus: (...a) => mocks.fetchStatus(...a),
  saveAutoReloadSettings: (...a) => mocks.saveSettings(...a),
}));

import AccountAutoReloadPanel from '../../src/components/account/AccountAutoReloadPanel.jsx';

beforeEach(() => {
  mocks.fetchSettings.mockReset();
  mocks.fetchStatus.mockReset();
  mocks.saveSettings.mockReset();
  mocks.fetchSettings.mockResolvedValue({ enabled: false, thresholdCredits: 5, targetCredits: 25, monthlyCapCents: 4000, exists: false });
  mocks.fetchStatus.mockResolvedValue({ thisMonthSpentCents: 0, openAttempt: null });
  mocks.saveSettings.mockResolvedValue(true);
});
afterEach(cleanup);

describe('AccountAutoReloadPanel', () => {
  test('renders the form after load and saves mapped settings', async () => {
    render(<AccountAutoReloadPanel auth={{ user: { id: 'u1' } }} />);
    const toggle = await screen.findByLabelText(/enable auto-reload/i);
    expect(toggle.checked).toBe(false);
    fireEvent.click(toggle);
    fireEvent.change(screen.getByLabelText(/when balance falls below/i), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText(/top up to/i), { target: { value: '40' } });
    fireEvent.change(screen.getByLabelText(/monthly spending cap/i), { target: { value: '60' } });
    fireEvent.click(screen.getByRole('button', { name: /save auto-reload/i }));
    await waitFor(() => expect(mocks.saveSettings).toHaveBeenCalledWith({
      enabled: true, thresholdCredits: 8, targetCredits: 40, monthlyCapCents: 6000,
    }));
    expect(await screen.findByText(/saved\./i)).toBeTruthy();
  });

  test('forces target above threshold on save', async () => {
    mocks.fetchSettings.mockResolvedValue({ enabled: true, thresholdCredits: 5, targetCredits: 25, monthlyCapCents: 4000, exists: true });
    render(<AccountAutoReloadPanel auth={{ user: { id: 'u1' } }} />);
    await screen.findByLabelText(/enable auto-reload/i);
    fireEvent.change(screen.getByLabelText(/when balance falls below/i), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText(/top up to/i), { target: { value: '30' } }); // == threshold
    fireEvent.click(screen.getByRole('button', { name: /save auto-reload/i }));
    await waitFor(() => expect(mocks.saveSettings).toHaveBeenCalled());
    expect(mocks.saveSettings.mock.calls[0][0].targetCredits).toBe(31); // bumped above threshold
  });

  test('shows the open-attempt verification line for a requires_action attempt', async () => {
    mocks.fetchStatus.mockResolvedValue({ thisMonthSpentCents: 459, openAttempt: { state: 'requires_action', creditsDelta: 23, amountCents: 459 } });
    render(<AccountAutoReloadPanel auth={{ user: { id: 'u1' } }} />);
    expect(await screen.findByText(/needs card verification/i)).toBeTruthy();
    expect(screen.getByText(/\$4\.59 of/i)).toBeTruthy();
  });

  test('surfaces a save error', async () => {
    mocks.saveSettings.mockRejectedValue(new Error('target_credits must exceed threshold_credits'));
    render(<AccountAutoReloadPanel auth={{ user: { id: 'u1' } }} />);
    await screen.findByLabelText(/enable auto-reload/i);
    fireEvent.click(screen.getByRole('button', { name: /save auto-reload/i }));
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/exceed threshold/i);
  });

  test('renders nothing for a signed-out visitor', () => {
    const { container } = render(<AccountAutoReloadPanel auth={{}} />);
    expect(container.firstChild).toBeNull();
    expect(mocks.fetchSettings).not.toHaveBeenCalled();
  });
});

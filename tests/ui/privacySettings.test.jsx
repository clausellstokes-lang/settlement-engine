/**
 * @vitest-environment jsdom
 *
 * tests/ui/privacySettings.test.jsx — the disclosure lives HERE, silently.
 *
 * The research opt-out has no pop-up and no first-run notice anywhere. The one
 * and only disclosure surface is the Privacy & data section, in the owner's copy.
 * This pins:
 *   - the owner's research-block heading ("You're helping improve the generator")
 *     and body render;
 *   - the research toggle defaults ON (opt-out) absent DNT / an explicit choice;
 *   - no floating "Research contribution notice" is rendered by this section.
 *
 * It also pins the SERVER MIRROR half (consentSync.js): a toggle writes locally AND pushes
 * the whole record to the account, and a failed push tells the user without reverting the
 * toggle they just set. The reconcile direction is pinned in tests/lib/consentSync.test.js.
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import PrivacySettings from '../../src/components/PrivacySettings.jsx';
import { getConsent } from '../../src/lib/consent.js';
import { pushTelemetryConsent } from '../../src/lib/consentSync.js';

// Consent changes are SERVICE compliance records, never product analytics. Keep
// a mock here as a guard: no toggle may call the analytics lane.
const track = vi.hoisted(() => vi.fn());
const storeState = vi.hoisted(() => ({
  auth: {
    user: { id: 'user-1' },
    session: { session_id: 'login-1', access_token: 'token-1' },
    loading: false,
  },
}));
vi.mock('../../src/lib/analytics.js', () => ({
  track,
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// The mirror is a network call; stub the module so the toggle path is observable without
// a Supabase client. Its own contract is pinned in tests/lib/consentSync.test.js.
vi.mock('../../src/lib/consentSync.js', () => ({
  pushTelemetryConsent: vi.fn(async () => ({ ok: true })),
}));
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  return { useStore };
});

function setDNT(on) {
  try { Object.defineProperty(navigator, 'doNotTrack', { value: on ? '1' : null, configurable: true }); } catch { /* ignore */ }
}

beforeEach(() => {
  storeState.auth = {
    user: { id: 'user-1' },
    session: { session_id: 'login-1', access_token: 'token-1' },
    loading: false,
  };
  localStorage.clear();
  setDNT(false);
  pushTelemetryConsent.mockReset().mockResolvedValue({ ok: true });
  track.mockReset();
});
afterEach(cleanup);

describe('PrivacySettings — the silent research disclosure', () => {
  test('renders the owner research-block heading and body', () => {
    render(<PrivacySettings />);
    expect(screen.getByText(/You're helping improve the generator/i)).toBeTruthy();
    expect(screen.getByText(/studies the anonymous structure of settlements/i)).toBeTruthy();
    expect(screen.getByText(/Never your names, prose, or secrets/i)).toBeTruthy();
    expect(screen.getByText(/turn it off here at any time/i)).toBeTruthy();
  });

  test('research toggle defaults ON (opt-out) absent DNT and any stored choice', () => {
    render(<PrivacySettings />);
    const research = screen.getByRole('switch', { name: /You're helping improve the generator/i });
    expect(research.getAttribute('aria-checked')).toBe('true');
  });

  test('does not render a floating first-run research notice', () => {
    render(<PrivacySettings />);
    expect(screen.queryByLabelText(/Research contribution notice/i)).toBeNull();
  });

  test('standalone renders the self-contained card with an <h3> title', () => {
    render(<PrivacySettings />);
    // The card title is a real heading, so screen readers announce a section.
    expect(screen.getByRole('heading', { name: /Privacy & data/i })).toBeTruthy();
  });

  test('a toggle writes locally AND mirrors the whole record to the account', async () => {
    render(<PrivacySettings />);
    fireEvent.click(screen.getByRole('switch', { name: /You're helping improve the generator/i }));

    // Local first: the choice is in force whatever the network does.
    expect(getConsent().research).toBe(false);
    // Then mirrored, as the WHOLE record (not a one-key patch) so the row is complete.
    await waitFor(() => expect(pushTelemetryConsent).toHaveBeenCalledTimes(1));
    const sent = pushTelemetryConsent.mock.calls[0][0];
    expect(sent.research).toBe(false);
    expect(sent.essential).toBe(true);
    expect(sent.market).toBe(false);
    expect(track).not.toHaveBeenCalled();
  });

  test('a failed mirror tells the user and never reverts the toggle', async () => {
    pushTelemetryConsent.mockResolvedValue({ ok: false, reason: 'rls denied' });
    render(<PrivacySettings />);
    fireEvent.click(screen.getByRole('switch', { name: /You're helping improve the generator/i }));

    const notice = await screen.findByRole('status');
    expect(notice.textContent).toMatch(/could not reach your account/i);
    // The toggle stays where the user put it, and so does the stored record.
    expect(screen.getByRole('switch', { name: /You're helping improve the generator/i })
      .getAttribute('aria-checked')).toBe('false');
    expect(getConsent().research).toBe(false);
  });

  test('no failure notice is rendered while the mirror is succeeding', async () => {
    render(<PrivacySettings />);
    fireEvent.click(screen.getByRole('switch', { name: /Anonymous market research/i }));
    await waitFor(() => expect(pushTelemetryConsent).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole('status')).toBeNull();
  });

  test('serializes rapid changes so an older grant cannot arrive after a newer opt-out', async () => {
    let releaseFirst;
    pushTelemetryConsent
      .mockImplementationOnce(() => new Promise(resolve => { releaseFirst = resolve; }))
      .mockResolvedValueOnce({ ok: true });
    render(<PrivacySettings />);
    const research = screen.getByRole('switch', { name: /You're helping improve the generator/i });

    fireEvent.click(research); // on -> off
    fireEvent.click(research); // off -> on
    await waitFor(() => expect(pushTelemetryConsent).toHaveBeenCalledTimes(1));
    expect(pushTelemetryConsent.mock.calls[0][0].research).toBe(false);

    releaseFirst({ ok: true });
    await waitFor(() => expect(pushTelemetryConsent).toHaveBeenCalledTimes(2));
    expect(pushTelemetryConsent.mock.calls[1][0].research).toBe(true);
  });

  test('a same-owner re-login warns when an authorized mirror was dropped', async () => {
    let release;
    pushTelemetryConsent.mockImplementationOnce(() => new Promise(resolve => { release = resolve; }));
    const view = render(<PrivacySettings />);
    fireEvent.click(screen.getByRole('switch', { name: /You're helping improve the generator/i }));
    await waitFor(() => expect(pushTelemetryConsent).toHaveBeenCalledTimes(1));

    storeState.auth = {
      ...storeState.auth,
      session: { session_id: 'login-2', access_token: 'token-new-login' },
    };
    view.rerender(<PrivacySettings />);
    expect((await screen.findByRole('status')).textContent).toMatch(/could not reach your account/i);
    release({ ok: true });
  });

  test('bare flattens to a borderless sub-group: inline title, no heading', () => {
    render(<PrivacySettings bare />);
    // No concentric card chrome ⇒ the title demotes from <h3> to an inline
    // keyword-row that sits level with the sibling sub-group headers.
    expect(screen.queryByRole('heading', { name: /Privacy/i })).toBeNull();
    expect(screen.getByText(/Privacy & analytics/i)).toBeTruthy();
    // The toggle rows still render regardless of chrome.
    expect(screen.getByRole('switch', { name: /You're helping improve the generator/i })).toBeTruthy();
  });
});

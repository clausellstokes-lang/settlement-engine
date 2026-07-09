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
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import PrivacySettings from '../../src/components/PrivacySettings.jsx';

// Analytics is fire-and-forget; stub it so mount stays quiet (PrivacySettings
// imports track/EVENTS on the toggle path).
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

function setDNT(on) {
  try { Object.defineProperty(navigator, 'doNotTrack', { value: on ? '1' : null, configurable: true }); } catch { /* ignore */ }
}

beforeEach(() => {
  localStorage.clear();
  setDNT(false);
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
});

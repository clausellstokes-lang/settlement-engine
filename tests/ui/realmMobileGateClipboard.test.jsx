/** @vitest-environment jsdom */
/**
 * Mobile Realm clipboard-status tests.
 *
 * The browser clipboard API is asynchronous. These tests hold or reject the
 * real promise seam to prove the UI never announces success before persistence
 * and exposes a retryable failure when permission or platform support rejects.
 */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
vi.mock('../../src/components/map/RealmDashboard.jsx', () => ({ default: () => null }));

import RealmMobileGate from '../../src/components/map/RealmMobileGate.jsx';

const originalClipboard = navigator.clipboard;

function installClipboard(writeText) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: originalClipboard,
  });
});

function renderGate() {
  return render(
    <RealmMobileGate
      campaign={null}
      canManageCampaigns={false}
      tier="anon"
      nameById={new Map()}
    />,
  );
}

describe('RealmMobileGate clipboard status', () => {
  test('does not report success until the clipboard promise resolves', async () => {
    let resolveCopy;
    const pending = new Promise(resolve => {
      resolveCopy = resolve;
    });
    const writeText = vi.fn(() => pending);
    installClipboard(writeText);
    renderGate();

    fireEvent.click(screen.getByRole('button', { name: /copy the desktop link/i }));
    expect(screen.queryByRole('button', { name: /link copied/i })).toBeNull();
    expect(writeText).toHaveBeenCalledWith(expect.stringMatching(/\/realm$/));

    await act(async () => {
      resolveCopy();
      await pending;
    });
    expect(await screen.findByRole('button', { name: /link copied/i })).toBeTruthy();
  });

  test('reports a rejected clipboard write as a retryable failure', async () => {
    installClipboard(vi.fn().mockRejectedValue(new Error('permission denied')));
    renderGate();

    fireEvent.click(screen.getByRole('button', { name: /copy the desktop link/i }));

    expect(await screen.findByRole('button', { name: /copy failed/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /link copied/i })).toBeNull();
    expect(screen.getByRole('status').textContent).toMatch(/could not be copied/i);
  });
});

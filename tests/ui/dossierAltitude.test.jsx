/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render, fireEvent, waitFor } from '@testing-library/react';

// Analytics is fire-and-forget; stub it so the mount path stays quiet.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import OutputContainer from '../../src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

afterEach(cleanup);

let town;
beforeAll(() => {
  town = generateSettlementPipeline(
    { size: 'town', tradeRouteAccess: 'road' },
    null,
    { seed: 99001, customContent: {} },
  );
});

// Click into the Systems group so its sub-tab strip resolves (Substrate / Magic
// live there). Returns the strip text after the click.
function openSystemsGroup(container) {
  const systemsBtn = [...container.querySelectorAll('button')]
    .find(b => /^Systems/.test((b.textContent || '').trim()));
  if (systemsBtn) fireEvent.click(systemsBtn);
  return container.textContent || '';
}

describe('Dossier IA — no global detail toggle; Substrate is a normal tab', () => {
  test('the dossier does NOT mount a global altitude control in its chrome', () => {
    // Lands on the Summary group by default, so the Substrate tab (which owns a
    // LOCAL altitude control) is not mounted — there should be no altitude
    // control anywhere in the dossier chrome.
    const { container } = render(<OutputContainer settlement={town} readOnly saveId={null} />);
    expect(container.querySelector('[data-testid="altitude-control"]')).toBeNull();
  });

  test('the Systems strip always includes Substrate alongside Magic', () => {
    const { container } = render(<OutputContainer settlement={town} readOnly saveId={null} />);
    const text = openSystemsGroup(container);
    expect(text).toMatch(/Magic/);
    expect(text).toMatch(/Substrate/);
  });

  test('opening the Substrate tab mounts its local depth control', async () => {
    const { container } = render(<OutputContainer settlement={town} readOnly saveId={null} />);
    openSystemsGroup(container);
    const substrateTab = [...container.querySelectorAll('[role="tab"], button')]
      .find(b => /^Substrate$/.test((b.textContent || '').trim()));
    // Loud precondition: if the Substrate tab is missing, fail HERE at the real
    // cause rather than letting the waitFor below expire into a confusing
    // "altitude-control never appeared" timeout.
    expect(substrateTab).toBeTruthy();
    fireEvent.click(substrateTab);
    // SubstrateTab is lazy; wait for it. The local control lives ON the tab now
    // (not in the dossier header). The generous 15s waitFor mirrors the
    // testTimeout reasoning in vite.config.js: the pre-push hook runs the FULL
    // suite (~9k tests across ~127 files in parallel), and under that CPU
    // contention the lazy dynamic-import chunk for SubstrateTab can take well
    // over RTL's 1s waitFor default to resolve + render — a false timeout, not a
    // real failure (AltitudeControl renders synchronously once the chunk lands).
    // The 30s per-test timeout (third arg below) keeps the 15s waitFor from ever
    // colliding with the 20s suite-level testTimeout under extreme load.
    await waitFor(
      () => expect(container.querySelector('[data-testid="altitude-control"]')).toBeTruthy(),
      { timeout: 15_000 },
    );
  }, 30_000);

  test('the dossier mounts without throwing', () => {
    const { container } = render(<OutputContainer settlement={town} readOnly saveId={null} />);
    expect(container.firstChild).not.toBeNull();
  });
});

/** @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

const harness = vi.hoisted(() => ({
  simulatePendingFuture: vi.fn(),
  forecastDigest: vi.fn(),
  saves: [{
    id: 'ashford',
    name: 'Ashford',
    settlement: { id: 'ashford', name: 'Ashford', population: 1200 },
  }],
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector({ savedSettlements: harness.saves }),
}));

vi.mock('../../src/domain/worldPulse/forecastRun.js', () => ({
  simulatePendingFuture: harness.simulatePendingFuture,
  forecastDigest: harness.forecastDigest,
  // MB-1: the pane now builds a worker-backed runner and hands it to the forecast. This mock
  // must offer the export or the pane throws before it renders anything — but the runner it
  // returns is NEVER exercised here, because simulatePendingFuture is itself mocked.
  // ⛔ THIS SUITE THEREFORE PROVES NOTHING ABOUT THE TRANSPORT SEAM and may never be cited as
  // evidence for it; the byte-identity proof lives in tests/domain/advanceWorkerByteIdentity.test.js.
  // It stays exactly what it was: the epistemic-boundary copy guard.
  workerBackedRunner: () => harness.simulatePendingFuture,
}));

import RealmForecast from '../../src/components/map/RealmForecast.jsx';

const campaign = {
  id: 'campaign-1',
  settlementIds: ['ashford'],
  regionalGraph: { edges: [], channels: [] },
  worldState: {
    tick: 8,
    pendingEvents: [{
      queueId: 'queue-1',
      saveId: 'ashford',
      queuedAt: '2026-07-01T00:00:00.000Z',
      event: { type: 'REMOVE_TRADE_GOOD' },
    }],
  },
};

beforeEach(() => {
  harness.simulatePendingFuture.mockReset();
  harness.forecastDigest.mockReset();
  harness.simulatePendingFuture.mockResolvedValue({
    refusals: [{
      queueId: 'queue-1',
      saveId: 'ashford',
      eventType: 'REMOVE_TRADE_GOOD',
      code: 'trade_good_not_found',
      detail: 'Moon sugar is no longer imported.',
    }],
  });
  harness.forecastDigest.mockReturnValue({
    members: [{
      saveId: 'ashford',
      name: 'Ashford',
      populationBefore: 1200,
      populationAfter: 1194,
      tierBefore: 'town',
      tierAfter: 'town',
      beats: [],
    }],
    realm: [],
    pauseMarkers: [],
  });
});

afterEach(() => cleanup());

describe('Realm forecast epistemic boundary', () => {
  test('names the interval and every refused order without claiming certainty', async () => {
    render(<RealmForecast campaign={campaign} />);

    fireEvent.click(screen.getByRole('button', { name: 'Run forecast' }));

    await waitFor(() => {
      expect(screen.getByTestId('realm-forecast-boundary').textContent)
        .toBe('Projected interval: Month');
    });
    expect(screen.getByText(
      /Ashford: remove trade good\. Reason: trade good not found/i,
    )).toBeTruthy();
    expect(screen.getByText(/Moon sugar is no longer imported/i)).toBeTruthy();
    expect(screen.getByText(/deterministic, bounded projection/i)).toBeTruthy();
    expect(screen.getByText(/wider realm ripple is not included/i)).toBeTruthy();

    const text = document.body.textContent;
    expect(text).not.toMatch(/exact if nothing else changes/i);
    expect(text).not.toMatch(/this is the next tick/i);
  });
});

/** @vitest-environment jsdom */
/**
 * analyticsQueueSnapshotPurge.test.js — research-consent revocation purge (lib#16).
 *
 * purgeRevoked() (run at the top of flush) drops research-plane records when the
 * user revokes research consent. Structural snapshots are research-plane, so they
 * MUST be purged too. The purge keys on `consentTier === 'research'`; enqueueSnapshot
 * therefore has to stamp that tier, matching enqueueEdit / enqueuePulseEffect —
 * otherwise the snapshot filter is a silent no-op and revoked structural fingerprints
 * keep flushing.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true }));

// Mutable consent so we can flip research off mid-test (the static always-consent
// mock in the sibling suites can't exercise the purge branch).
let _consent = { essential: true, research: true };
vi.mock('../../src/lib/consent.js', () => ({ getConsent: () => _consent }));

import {
  enqueueSnapshot, flush, debugSnapshot, __resetQueueForTests,
} from '../../src/lib/analyticsQueue.js';

beforeEach(() => {
  _consent = { essential: true, research: true };
  __resetQueueForTests();
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
  vi.unstubAllGlobals();
});

afterEach(() => { vi.useRealTimers(); });

describe('snapshot purge on research-consent revocation', () => {
  test('revoking research consent drops enqueued snapshots (they carry consentTier=research)', () => {
    const fetchMock = vi.fn(() => new Promise(() => {})); // never resolves
    vi.stubGlobal('fetch', fetchMock);

    enqueueSnapshot({ id: 's1', v: 1 });
    enqueueSnapshot({ id: 's2', v: 2 });
    expect(debugSnapshot().depth).toBe(2);

    // User revokes research consent, then a flush runs.
    _consent = { essential: true, research: false };
    flush();

    // purgeRevoked() cleared the snapshot lane, so nothing was POSTed.
    expect(debugSnapshot().depth).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('snapshots survive while research consent is still granted', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    enqueueSnapshot({ id: 's1', v: 1 });
    flush(); // research still granted → snapshot delivered, not purged

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    // The record carries the research tier stamp.
    expect(sent.snapshots?.[0]?.consentTier).toBe('research');
  });
});

/**
 * founderChairRequest.test.js — the letterbox's standing rule (§5b).
 *
 * ONE OPEN REQUEST PER ACCOUNT, with a long resubmission band after closure.
 * `standingFromRow` is the whole rule as a pure function of the account's most
 * recent letter, so the band is provable without a backend — and the fail-OPEN
 * direction is pinned deliberately, because a read failure must never be able to
 * silently deny a would-be founder the only door they have.
 */
import { describe, expect, test } from 'vitest';
import { standingFromRow, CHAIR_REQUEST_BAND_DAYS } from '../../src/lib/founderChairRequest.js';

const NOW = Date.UTC(2026, 7, 3);
const daysAgo = (n) => new Date(NOW - n * 86_400_000).toISOString();

describe('standing to write a letter', () => {
  test('an account that never wrote may write', () => {
    expect(standingFromRow(null, NOW)).toEqual({ canWrite: true, state: 'none', since: null, daysLeft: null });
  });

  test('a letter still in hand blocks a second — every open lifecycle status counts', () => {
    for (const status of ['new', 'triage', 'assigned', 'in_progress', 'waiting_on_user', 'reopened', 'read', 'replied']) {
      const s = standingFromRow({ status, created_at: daysAgo(2) }, NOW);
      expect(s.canWrite, `status "${status}" should be OPEN`).toBe(false);
      expect(s.state).toBe('open');
    }
  });

  test('a status nobody has invented yet reads as OPEN, not as a reopened letterbox', () => {
    // The closed set is spelled, not the open set, so the fail-safe direction is
    // "still in hand" when the lifecycle grows a status this code never saw.
    const s = standingFromRow({ status: 'escalated_to_owner', created_at: daysAgo(2) }, NOW);
    expect(s.state).toBe('open');
    expect(s.canWrite).toBe(false);
  });

  test('a closed letter starts the band, and the band holds until it expires', () => {
    for (const status of ['resolved', 'closed']) {
      const fresh = standingFromRow({ status, created_at: daysAgo(1) }, NOW);
      expect(fresh.canWrite).toBe(false);
      expect(fresh.state).toBe('cooling');
      expect(fresh.daysLeft).toBe(CHAIR_REQUEST_BAND_DAYS - 1);
    }
  });

  test('past the band, the account may write again', () => {
    const past = standingFromRow({ status: 'closed', created_at: daysAgo(CHAIR_REQUEST_BAND_DAYS) }, NOW);
    expect(past.canWrite).toBe(true);
    expect(past.state).toBe('none');
  });

  test('the boundary is inclusive on the far side and exclusive on the near side', () => {
    expect(standingFromRow({ status: 'closed', created_at: daysAgo(CHAIR_REQUEST_BAND_DAYS - 1) }, NOW).canWrite).toBe(false);
    expect(standingFromRow({ status: 'closed', created_at: daysAgo(CHAIR_REQUEST_BAND_DAYS + 1) }, NOW).canWrite).toBe(true);
  });

  test('daysLeft never counts down to zero — a band of "0 days" reads as an error, not a wait', () => {
    const nearly = standingFromRow({ status: 'closed', created_at: daysAgo(CHAIR_REQUEST_BAND_DAYS - 0.4) }, NOW);
    expect(nearly.daysLeft).toBeGreaterThanOrEqual(1);
  });

  test('an unparseable date does not trap an account in a permanent band', () => {
    const s = standingFromRow({ status: 'closed', created_at: 'whenever' }, NOW);
    expect(s.canWrite).toBe(true);
    expect(s.state).toBe('none');
  });

  test('the band is the ruled length', () => {
    expect(CHAIR_REQUEST_BAND_DAYS).toBe(180);
  });
});

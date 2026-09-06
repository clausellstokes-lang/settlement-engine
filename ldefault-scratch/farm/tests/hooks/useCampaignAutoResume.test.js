/**
 * Campaign auto-resume identity boundary.
 *
 * Remembered ids can cross local/cloud storage as numbers or strings. The hook
 * must match them by value but return the campaign's canonical stored id so
 * downstream selection does not silently change identifier type.
 */

import { describe, expect, test } from 'vitest';

import { resumeCampaignTarget } from '../../src/hooks/useCampaignAutoResume.js';

describe('resumeCampaignTarget id boundary', () => {
  test('returns the canonical campaign id for a string/numeric remembered match', () => {
    const campaigns = [
      { id: 9, name: 'Newest' },
      { id: 42, name: 'Remembered' },
    ];

    expect(resumeCampaignTarget(campaigns, '42')).toBe(42);
  });
});

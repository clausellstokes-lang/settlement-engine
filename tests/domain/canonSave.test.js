import { describe, expect, test } from 'vitest';

import { isCanonSave, savePhase } from '../../src/domain/campaign/canon.js';

describe('campaign canon save helpers', () => {
  test('detects canon state across save envelope and nested settlement shapes', () => {
    expect(isCanonSave({ phase: 'canon' })).toBe(true);
    expect(isCanonSave({ campaignState: { phase: 'canon' } })).toBe(true);
    expect(isCanonSave({ settlement: { phase: 'canon' } })).toBe(true);
    expect(isCanonSave({ settlement: { campaignState: { phase: 'canon' } } })).toBe(true);
    expect(isCanonSave({ campaignState: { canonizedAt: '2026-01-01T00:00:00.000Z' } })).toBe(true);
  });

  test('defaults unknown saves to draft', () => {
    expect(savePhase({})).toBe('draft');
    expect(isCanonSave({ campaignState: { phase: 'draft' } })).toBe(false);
  });
});

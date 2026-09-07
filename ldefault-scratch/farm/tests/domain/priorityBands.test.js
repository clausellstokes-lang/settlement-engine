import { describe, expect, it } from 'vitest';
import {
  PRIORITY_BANDS,
  priorityBand,
  priorityBandLabel,
} from '../../src/domain/priorityBands.js';
import { priorityToCategory } from '../../src/generators/economy/prosperity.js';

describe('priority bands — one semantic vocabulary', () => {
  it.each([
    [5, 'very_low', 'Very Low'],
    [15, 'very_low', 'Very Low'],
    [16, 'low', 'Low'],
    [35, 'low', 'Low'],
    [36, 'medium', 'Medium'],
    [65, 'medium', 'Medium'],
    [66, 'high', 'High'],
    [85, 'high', 'High'],
    [86, 'very_high', 'Very High'],
    [95, 'very_high', 'Very High'],
  ])('labels setting %s as %s', (setting, key, label) => {
    expect(priorityBand(setting)).toBe(key);
    expect(priorityBandLabel(setting)).toBe(label);
  });

  it('preserves the generator public API and its null/default behavior', () => {
    for (let setting = 0; setting <= 100; setting += 1) {
      expect(priorityToCategory(setting)).toBe(priorityBand(setting));
    }
    expect(priorityToCategory()).toBe('medium');
    expect(priorityToCategory(null)).toBe('medium');
  });

  it('keeps every band key paired with a human label', () => {
    expect(PRIORITY_BANDS.map(({ key, label }) => [key, label])).toEqual([
      ['very_low', 'Very Low'],
      ['low', 'Low'],
      ['medium', 'Medium'],
      ['high', 'High'],
      ['very_high', 'Very High'],
    ]);
  });
});

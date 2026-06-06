/**
 * aiLayer flattenServices — regression for the AI narrative crash
 * "(s.availableServices || []).slice is not a function".
 *
 * availableServices is generated as a category-keyed OBJECT
 * ({ lodging:[], food:[], … }), so `|| []` never kicked in and an object has
 * no `.slice`. flattenServices normalizes object/array/empty into one list.
 */

import { describe, test, expect } from 'vitest';
import { flattenServices } from '../../src/generators/aiLayer.js';

describe('flattenServices (AI context normalizer)', () => {
  test('flattens the category-keyed object shape into one list', () => {
    const services = {
      lodging: [{ name: 'The Gilded Rest' }],
      food: [{ name: 'Bakehouse' }, { name: 'Alehouse' }],
      magic: [],
    };
    expect(flattenServices(services).map(s => s.name)).toEqual([
      'The Gilded Rest', 'Bakehouse', 'Alehouse',
    ]);
  });

  test('passes a plain array through unchanged', () => {
    const arr = [{ name: 'A' }, { name: 'B' }];
    expect(flattenServices(arr)).toBe(arr);
  });

  test('returns [] for null / undefined / non-object', () => {
    expect(flattenServices(null)).toEqual([]);
    expect(flattenServices(undefined)).toEqual([]);
    expect(flattenServices(42)).toEqual([]);
  });

  test('the result is always sliceable (the actual crash guard)', () => {
    // An object used to reach .slice directly and throw.
    expect(() => flattenServices({ lodging: [{ name: 'X' }] }).slice(0, 8)).not.toThrow();
    expect(() => flattenServices(null).slice(0, 8)).not.toThrow();
    expect(flattenServices({ a: [{ name: 'X' }], b: [{ name: 'Y' }] }).slice(0, 1)).toEqual([{ name: 'X' }]);
  });
});

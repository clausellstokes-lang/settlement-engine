/**
 * elevation.test.js - P141 / V-4 contract over the elevation token scale.
 *
 * Pins that the 3-tier elevation scale is real and reaches components through
 * the legacy theme shim (so `import { ELEV } from '.../theme.js'` works), and
 * that the tiers stay ordered default < hover < modal by blur radius.
 */

import { describe, it, expect } from 'vitest';
import { elevation } from '../../src/design/tokens.js';
import { ELEV } from '../../src/components/theme.js';

describe('elevation tokens', () => {
  it('defines exactly the three tiers', () => {
    expect(Object.keys(elevation).sort()).toEqual(['1', '2', '3']);
  });

  it('is re-exported unchanged through the components theme shim', () => {
    expect(ELEV).toBe(elevation);
    expect(ELEV[1]).toBe(elevation['1']);
    expect(ELEV[3]).toBe(elevation['3']);
  });

  it('every tier is a non-empty box-shadow string', () => {
    for (const tier of ['1', '2', '3']) {
      expect(typeof ELEV[tier]).toBe('string');
      expect(ELEV[tier]).toMatch(/rgba?\(/);
    }
  });

  it('blur radius grows with the tier (default < hover < modal)', () => {
    // 2nd length in "0 <y> <blur>px ..." is the blur radius.
    const blur = (s) => Number(/^\S+\s+\S+\s+(\d+)px/.exec(s)[1]);
    expect(blur(ELEV[1])).toBeLessThan(blur(ELEV[2]));
    expect(blur(ELEV[2])).toBeLessThan(blur(ELEV[3]));
  });
});

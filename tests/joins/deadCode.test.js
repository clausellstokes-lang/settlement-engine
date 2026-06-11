import { describe, expect, test } from 'vitest';

import { readFileSync } from 'node:fs';

// Dead-code guard (cohesion wave 6#5): symbols purged from the tree must STAY
// purged. Each entry below was verified zero-caller (grep across src/ + tests/)
// immediately before deletion; dead config is where drift hides, so if one of
// these names reappears in its file the resurrection is either deliberate
// (update this list with the new consumer in hand) or rot creeping back in.
//
//   _resolveUpgrades       — auto-fix layer that never ran; survival gaps are
//                            surfaced-not-fixed by design (audit 6#5).
//   generateSpatialLayout  — servicesGenerator carried a stale shadow copy;
//                            the real one lives in spatialGenerator.js.
//   ITEM_CATEGORIES        — unexported "By Category" map with zero consumers.
const PURGED = [
  ['src/generators/structuralValidator.js', '_resolveUpgrades'],
  ['src/generators/servicesGenerator.js', 'generateSpatialLayout'],
  ['src/data/supplyChainData.js', 'ITEM_CATEGORIES'],
];

describe('joins: purged dead code stays deleted', () => {
  test.each(PURGED)('%s no longer mentions %s', (file, symbol) => {
    const src = readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
    expect(src.includes(symbol), `${file} mentions purged symbol ${symbol} again`).toBe(false);
  });

  test('the real generateSpatialLayout (spatialGenerator.js) is still alive', () => {
    // Guard the guard: the shadow purge must never be "satisfied" by the live
    // implementation disappearing too.
    const src = readFileSync(new URL('../../src/generators/spatialGenerator.js', import.meta.url), 'utf8');
    expect(src).toContain('export const generateSpatialLayout');
  });
});

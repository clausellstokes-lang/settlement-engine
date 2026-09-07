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
//   NPC_ROLES              — a role→goal map that was a byte-identical dead
//                            duplicate of NPC_FACTION_GOALS (data-tables-6); zero
//                            importers, deletion behavior-inert (goldens identical).
//   _migrateConfig         — a zero-caller copy of the saved-config forward migration
//                            (MG-3f / leak L8). The rule decides whether a legacy save
//                            is magical AT ALL, and it had rotted into a third spelling
//                            nobody called; it now lives once in
//                            src/lib/settlementConfigMigration.js.
const PURGED = [
  ['src/generators/structuralValidator.js', '_resolveUpgrades'],
  ['src/generators/servicesGenerator.js', 'generateSpatialLayout'],
  ['src/data/supplyChainData.js', 'ITEM_CATEGORIES'],
  ['src/data/npcData.js', 'NPC_ROLES'],
  ['src/components/SettlementDetail.jsx', '_migrateConfig'],
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

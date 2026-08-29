/**
 * tests/components/changeViewDepthGate.test.jsx — the change-view DERIVATION stays
 * tier-blind (THE FREELY-GIVEN RULINGS, 2026-07-17: change-view depth is PREMIUM /
 * Cartographer).
 *
 * ⚠ NARROWED BY TE-STRIP-1 (owner ruling, ODQ §725). The affordance half — free tier
 * sees the newest change per band with the deeper history VISIBLE-as-locked, and the
 * lock fires the purchase modal — mounted src/components/townMap/SettlementMapNotes,
 * which left with the legacy settlement map, so those arms have no subject and are
 * removed. The DERIVATION half survives verbatim over retained code:
 * src/domain/townMap/changeView.js must never learn about tiers or auth. The ladder
 * rows themselves are STRIP-5's subject, untouched here.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('the change-view derivation stays tier-blind (source scan)', () => {
  const FORBIDDEN = /TIER_GATE|canUseMapChains|ELEVATED_ROLES|useStore|authSlice|\bauth\b|entitled|canEdit/;
  test('src/domain/townMap/changeView.js carries no auth/tier-gate concept', () => {
    const src = readFileSync(join(ROOT, 'src/domain/townMap/changeView.js'), 'utf8');
    expect(src).not.toMatch(FORBIDDEN);
  });
});

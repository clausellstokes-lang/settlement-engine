/**
 * tests/components/dmPinsTierGate.test.jsx — the DM-PIN (annotation) DERIVATION
 * stays tier-blind (THE FREELY-GIVEN RULINGS, 2026-07-17: DM pins are PREMIUM /
 * Cartographer).
 *
 * ⚠ NARROWED BY TE-STRIP-1 (owner ruling, ODQ §725). The affordance half — free
 * tier sees a VISIBLE locked pin control, clicking it fires the purchase modal and
 * never an annotate write — mounted src/components/townMap/SettlementMapEditControls,
 * which left with the legacy settlement map, so those arms and the pane-wiring scan
 * have no subject and are removed. The DERIVATION half survives verbatim over
 * retained code: src/domain/townMap/mapEdits.js must never learn about tiers or
 * auth. The ladder rows themselves are STRIP-5's subject, untouched here.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('the annotation derivation stays tier-blind (source scan)', () => {
  // The DM-pin DERIVATION (mapEdits.js annotation read/write) must never learn about
  // tiers/auth — the gate wraps the affordance only (the fog/mapChains law, verbatim).
  const FORBIDDEN = /TIER_GATE|canUseMapChains|ELEVATED_ROLES|useStore|authSlice|\bauth\b|entitled|canEdit/;

  test('src/domain/townMap/mapEdits.js carries no auth/tier-gate concept', () => {
    const src = readFileSync(join(ROOT, 'src/domain/townMap/mapEdits.js'), 'utf8');
    expect(src).not.toMatch(FORBIDDEN);
  });
});

/**
 * tests/components/fogTierGate.test.jsx — DOOR 2 the fog table-layer DERIVATION
 * stays tier-blind (THE FREELY-GIVEN RULINGS, 2026-07-17: fog is PREMIUM /
 * Cartographer).
 *
 * ⚠ NARROWED BY TE-STRIP-1 (owner ruling, ODQ §725). This file used to pin BOTH
 * halves of the premium-seam law: that the free tier SEES a locked fog affordance
 * (rendering SettlementMapFogChrome) and that the derivation never learns about
 * tiers. The affordance half mounted src/components/townMap/, which left with the
 * legacy settlement map, so those arms have no subject and are removed along with
 * the pane-wiring scan. The DERIVATION half survives verbatim and still guards
 * retained code. The ladder rows themselves are STRIP-5's subject, untouched here.
 *
 * ⚰ NARROWED AGAIN BY TE-STRIP-3 (owner grant ODQ §731 / Q-S1). The roster was FOUR
 * modules; the two under src/store/ — fogEditSlice.js and fogEditBody.js — were the
 * fog WRITE path into the save blob, and they were deleted when `applyFogEdit` was
 * retired. So the roster is the two surviving src/domain/townMap/fog*.js READERS, and
 * the totality discovery narrows to that one directory with it.
 * ⭐ THE DISCOVERY ARM IS WHY THIS FILE HAD TO BE TOUCHED AT ALL, and it worked exactly
 * as designed: it globs `^fogEdit.*\.js$` under src/store, so the deletion made the
 * discovered set disagree with the spelled roster and reddened HERE rather than leaving
 * two arms silently reading files that no longer exist. Its src/store limb is removed
 * rather than left to glob an empty directory — a limb that can only ever return []
 * is a limb that can never red, and a scan that cannot fail is not a guard.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('the derivation stays tier-blind (source scan)', () => {
  // The fog DERIVATION must never learn about tiers/auth — the gate wraps the
  // affordances only (the mapChains law, verbatim).
  const FORBIDDEN = /TIER_GATE|canUseMapChains|ELEVATED_ROLES|useStore|authSlice|\bauth\b|entitled|canEdit/;

  // ⭐ SPELLED OUT, NOT TABLE-DRIVEN, AND THE REASON IS MEASURED. A `test.each` callback
  // that takes a parameter parks the WHOLE FILE out of the estate's lighting census
  // (the walker's TEST_CONTEXT_PARAM rule), so every title in this security-adjacent
  // suite was invisible to every title-keyed instrument while it sat here as evidence.
  // ⛔ Re-pointing the table at a LIVE source would not have fixed it: a static literal
  // table is what EARNS credit, and the walker's credit predicate only ever removes.
  // The loop belongs INSIDE a named test (the SP-D idiom), which is what the roster
  // totality guard at the bottom of this describe is.
  const TIER_BLIND_MODULES = Object.freeze([
    'src/domain/townMap/fogGeometry.js',
    'src/domain/townMap/fogSessions.js',
  ]);

  /** Read one tier-blind module, refusing an empty read so the scan cannot go vacuous. */
  function tierBlindSource(rel) {
    const src = readFileSync(join(ROOT, rel), 'utf8');
    expect(src.length, `${rel} read as empty — the scan below would pass for the wrong reason`).toBeGreaterThan(0);
    return src;
  }

  test('fogGeometry.js carries no auth/tier-gate concept', () => {
    // anchored: tierBlindSource throws on absence and refuses an empty read, and the roster totality test below proves this path is part of the whole fog derivation rather than a stale address.
    expect(tierBlindSource(TIER_BLIND_MODULES[0])).not.toMatch(FORBIDDEN);
  });

  test('fogSessions.js carries no auth/tier-gate concept', () => {
    // anchored: tierBlindSource throws on absence and refuses an empty read, and the roster totality test below proves this path is part of the whole fog derivation rather than a stale address.
    expect(tierBlindSource(TIER_BLIND_MODULES[1])).not.toMatch(FORBIDDEN);
  });

  // ANTI-DRIFT — the charter's "live table" intent, kept without the parking cost. The
  // spelled roster must BE the fog derivation, not a snapshot of it: a new fog module
  // reds HERE rather than slipping past the hand-spelled cases forever.
  test('the tier-blind roster IS the whole fog derivation (a new module reds)', () => {
    const discovered = readdirSync(join(ROOT, 'src/domain/townMap'))
      .filter((f) => /^fog.*\.js$/.test(f))
      .map((f) => `src/domain/townMap/${f}`)
      .sort();
    expect(discovered.length, 'the discovery found nothing — the scan would be vacuous').toBeGreaterThan(0);
    expect(discovered).toEqual([...TIER_BLIND_MODULES].sort());
    // ⚰ AND THE WRITE PATH IS GONE, ASSERTED rather than assumed (TE-STRIP-3, ODQ §731).
    // The roster shrank because two modules were DELETED, not because the glob was
    // quietly narrowed to hide them. If either comes back, it comes back unguarded —
    // so their absence is pinned here, at the guard that used to cover them.
    expect(readdirSync(join(ROOT, 'src/store')).filter((f) => /^fogEdit.*\.js$/.test(f)))
      .toEqual([]);
  });
});

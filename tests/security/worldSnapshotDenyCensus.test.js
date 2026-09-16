/**
 * worldSnapshotDenyCensus.test.js — the public-snapshot hard-deny registration walker
 * (security-privacy-r2-1).
 *
 * The public world-snapshot serializer (worldSnapshotPublic.js) is allowlist-based, so a
 * conditional-ledger key is never SPREAD into the output — but WORLD_SNAPSHOT_HARD_DENY is
 * the defensive documentation + absence-pin that proves it, and it had lagged the engine by
 * ~15 waves (spatialLedgers / politicsLedgers / warPosture / religionStates and more were
 * unlisted). This walker keeps the deny list in lockstep with the engine: it DERIVES the
 * expected hard-deny set from worldState's CONDITIONAL_LEDGER_KEYS minus the explicit public
 * allowlist, and reds if a new conditional ledger (a new wave's key) is neither hard-denied
 * nor allowlisted. Discovery is automatic (CONDITIONAL_LEDGER_KEYS), the decision is manual
 * (deny or allowlist), and this test forces them together.
 */
import { describe, expect, test } from 'vitest';
import { CONDITIONAL_LEDGER_KEYS } from '../../src/domain/worldPulse/worldState.js';
import {
  WORLD_SNAPSHOT_HARD_DENY,
  WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST,
} from '../../src/domain/display/worldSnapshotPublic.js';

describe('public-snapshot hard-deny census (security-privacy-r2-1)', () => {
  const deny = new Set(WORLD_SNAPSHOT_HARD_DENY);
  const allow = new Set(WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST);

  test('every conditional ledger is hard-denied OR public-allowlisted (no silent gap)', () => {
    const unclassified = CONDITIONAL_LEDGER_KEYS.filter((k) => !deny.has(k) && !allow.has(k));
    // A new conditional ledger landed unlisted. Add it to WORLD_SNAPSHOT_HARD_DENY (default
    // — private), or to WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST if its scrubbed derivation is
    // deliberately surfaced under its own name (like pantheon).
    expect(unclassified).toEqual([]);
  });

  test('the public allowlist references only real conditional ledgers (no phantom)', () => {
    const phantom = WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST.filter((k) => !CONDITIONAL_LEDGER_KEYS.includes(k));
    expect(phantom).toEqual([]);
  });

  test('a public-allowlisted ledger is never ALSO hard-denied (disjoint)', () => {
    const overlap = WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST.filter((k) => deny.has(k));
    expect(overlap).toEqual([]);
  });

  test('the four waves the finding named are now hard-denied', () => {
    for (const k of ['spatialLedgers', 'politicsLedgers', 'warPosture', 'religionStates']) {
      expect(deny.has(k), `${k} must be hard-denied`).toBe(true);
    }
  });
});

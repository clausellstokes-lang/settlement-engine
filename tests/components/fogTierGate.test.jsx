/**
 * @vitest-environment jsdom
 *
 * tests/components/fogTierGate.test.jsx — DOOR 2 the fog table-layer tier gate
 * (THE FREELY-GIVEN RULINGS, 2026-07-17: fog is PREMIUM / Cartographer).
 *
 * THE PREMIUM-SEAM LAW this pins (the mapChainsTierGate precedent): the gate wraps
 * the AFFORDANCE, never the derivation.
 *   • Free tier SEES the gate moment: the Table/Fog panel stays VISIBLE with a drawn
 *     lock glyph + teaser; clicking fires the purchase modal (the cosmetic-edit
 *     gate's own moment); NO fog interaction mounts and stored fogSessions are
 *     never rewritten.
 *   • Premium passes: the working chrome renders (the engage checkbox).
 *   • The derivation (fogSessions / fogGeometry) is TIER-BLIND — a source scan
 *     proves no auth/tier-gate concept ever reaches it.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

afterEach(cleanup);

// ── Fake store (selector-driven, the mapChainsTierGate idiom) ───────────────
const { useStore, storeState } = vi.hoisted(() => {
  const storeState = {
    setPurchaseModalOpen: null, // per-test vi.fn()
    applyFogEdit: null,         // per-test vi.fn() — must NEVER fire while locked
  };
  const useStore = (selector) => selector(storeState);
  useStore.getState = () => storeState;
  return { useStore, storeState };
});
vi.mock('../../src/store/index.js', () => ({ useStore }));

import SettlementMapFogChrome from '../../src/components/townMap/fog/SettlementMapFogChrome.jsx';

/** A minimal fog-controller stub (the useMapFog surface the chrome consumes). */
function fogStub(over = {}) {
  const noop = () => {};
  return {
    sessionIds: [], activeSessionId: null, sessionName: '', activeEntry: null,
    activeReveal: null, hasReveal: false, fogActive: false, toggleFog: noop,
    selectSession: noop, brushMode: 'reveal', setBrushMode: noop, brushKind: 'auto',
    setBrushKind: noop, brushEnabled: false, onBrushDown: noop, onBrushMove: noop,
    onBrushUp: noop, createSession: noop, renameActive: noop, deleteActive: noop,
    revealAll: noop, hideAll: noop, ...over,
  };
}

const SETTLEMENT = { id: 't1', name: 'Fogton', fogSessions: { 'friday': { name: 'Friday', districts: ['dA'] } } };

beforeEach(() => {
  vi.clearAllMocks();
  storeState.setPurchaseModalOpen = vi.fn();
  storeState.applyFogEdit = vi.fn();
});

describe('free tier — the locked state is VISIBLE, never absent', () => {
  test('the panel renders locked: drawn lock glyph + teaser + the premium button', () => {
    render(<SettlementMapFogChrome fog={fogStub()} editing={false} entitled={false} settlement={SETTLEMENT} activeLens="parchment" fire={() => {}} />);
    expect(screen.getByTestId('fog-controls-lock')).toBeTruthy();               // the lock glyph
    expect(screen.getByText(/Run a live table session/)).toBeTruthy();          // the teaser
    expect(screen.getByText('Unlocks with Cartographer.')).toBeTruthy();        // the upgrade hint
    // NO working chrome mounts while locked (the engage checkbox is premium chrome)
    expect(screen.queryByLabelText('Engage fog of war')).toBeNull();
  });

  test('clicking the locked affordance fires the purchase modal and NEVER a fog write', () => {
    render(<SettlementMapFogChrome fog={fogStub()} editing={false} entitled={false} settlement={SETTLEMENT} activeLens="parchment" fire={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Cartographer premium feature/ }));
    expect(storeState.setPurchaseModalOpen).toHaveBeenCalledWith(true);
    expect(storeState.applyFogEdit).not.toHaveBeenCalled(); // stored fogSessions untouched — an upgrade restores them
  });
});

describe('premium — the gate passes', () => {
  test('the working chrome renders (the engage checkbox), no lock glyph', () => {
    render(<SettlementMapFogChrome fog={fogStub()} editing={true} entitled={true} settlement={SETTLEMENT} activeLens="parchment" fire={() => {}} />);
    expect(screen.getByLabelText('Engage fog of war')).toBeTruthy();
    expect(screen.queryByTestId('fog-controls-lock')).toBeNull();
    expect(storeState.setPurchaseModalOpen).not.toHaveBeenCalled();
  });
});

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
    'src/store/fogEditBody.js',
    'src/store/fogEditSlice.js',
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

  test('fogEditBody.js carries no auth/tier-gate concept', () => {
    // anchored: tierBlindSource throws on absence and refuses an empty read, and the roster totality test below proves this path is part of the whole fog derivation rather than a stale address.
    expect(tierBlindSource(TIER_BLIND_MODULES[2])).not.toMatch(FORBIDDEN);
  });

  test('fogEditSlice.js carries no auth/tier-gate concept', () => {
    // anchored: tierBlindSource throws on absence and refuses an empty read, and the roster totality test below proves this path is part of the whole fog derivation rather than a stale address.
    expect(tierBlindSource(TIER_BLIND_MODULES[3])).not.toMatch(FORBIDDEN);
  });

  // ANTI-DRIFT — the charter's "live table" intent, kept without the parking cost. The
  // spelled roster must BE the fog derivation, not a snapshot of it: a new fog module
  // reds HERE rather than slipping past four hand-spelled cases forever.
  test('the tier-blind roster IS the whole fog derivation (a new module reds)', () => {
    const discovered = [
      ...readdirSync(join(ROOT, 'src/domain/townMap')).filter((f) => /^fog.*\.js$/.test(f))
        .map((f) => `src/domain/townMap/${f}`),
      ...readdirSync(join(ROOT, 'src/store')).filter((f) => /^fogEdit.*\.js$/.test(f))
        .map((f) => `src/store/${f}`),
    ].sort();
    expect(discovered.length, 'the discovery found nothing — the scan would be vacuous').toBeGreaterThan(0);
    expect(discovered).toEqual([...TIER_BLIND_MODULES].sort());
  });

  test('the pane wires the gate from its OWN canEdit prop (the cosmetic-edit predicate)', () => {
    const src = readFileSync(join(ROOT, 'src/components/townMap/SettlementMapPane.jsx'), 'utf8');
    expect(src).toMatch(/entitled=\{!!canEdit\}/);
  });
});

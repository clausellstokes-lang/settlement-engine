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
import { readFileSync } from 'node:fs';
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
    expect(screen.getByTitle(/Cartographer \(premium\) feature/)).toBeTruthy(); // the upgrade hint
    // NO working chrome mounts while locked (the engage checkbox is premium chrome)
    expect(screen.queryByLabelText('Engage fog of war')).toBeNull();
  });

  test('clicking the locked affordance fires the purchase modal and NEVER a fog write', () => {
    render(<SettlementMapFogChrome fog={fogStub()} editing={false} entitled={false} settlement={SETTLEMENT} activeLens="parchment" fire={() => {}} />);
    fireEvent.click(screen.getByTitle(/Cartographer \(premium\) feature/));
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

  test.each([
    'src/domain/townMap/fogSessions.js',
    'src/domain/townMap/fogGeometry.js',
    'src/store/fogEditBody.js',
  ])('%s carries no auth/tier-gate concept', (rel) => {
    const src = readFileSync(join(ROOT, rel), 'utf8');
    expect(src).not.toMatch(FORBIDDEN);
  });

  test('the pane wires the gate from its OWN canEdit prop (the cosmetic-edit predicate)', () => {
    const src = readFileSync(join(ROOT, 'src/components/townMap/SettlementMapPane.jsx'), 'utf8');
    expect(src).toMatch(/entitled=\{!!canEdit\}/);
  });
});

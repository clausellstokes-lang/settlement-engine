/**
 * @vitest-environment jsdom
 *
 * tests/components/dmPinsTierGate.test.jsx — the DM pin/annotation tier gate
 * (THE FREELY-GIVEN RULINGS, 2026-07-17: DM pins are PREMIUM / Cartographer).
 *
 * THE PREMIUM-SEAM LAW this pins (the fog/mapChains precedent): the gate wraps the
 * AFFORDANCE, never the derivation.
 *   • Free tier SEES the gate moment: on a saved map the Markers affordance stays
 *     VISIBLE with a drawn lock glyph + teaser; clicking fires the purchase modal
 *     (the cosmetic-edit gate's own moment); NO annotate mode mounts and the annotate
 *     toggle is never called (stored annotations are never rewritten).
 *   • Premium passes: the working Markers toggle renders, no lock glyph.
 *   • Anon / public gallery (no saveId) sees NOTHING extra — the locked teaser only
 *     mounts on a saved map.
 *   • The annotation DERIVATION (mapEdits.js) is TIER-BLIND — a source scan proves no
 *     auth/tier-gate concept ever reaches it.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

afterEach(cleanup);

// ── Fake store (selector-driven, the fogTierGate idiom) ─────────────────────
const { useStore, storeState } = vi.hoisted(() => {
  const storeState = { setPurchaseModalOpen: null }; // per-test vi.fn()
  const useStore = (selector) => selector(storeState);
  useStore.getState = () => storeState;
  return { useStore, storeState };
});
vi.mock('../../src/store/index.js', () => ({ useStore }));

import SettlementMapEditControls from '../../src/components/townMap/SettlementMapEditControls.jsx';

/** The controls' required props; overridable per test. */
function props(over = {}) {
  const noop = () => {};
  return {
    editing: false, showLegend: false,
    legendPrefs: { showLabels: false, showLegend: false }, hasEdits: false,
    districts: [], onReroll: noop, onToggleLabels: noop, onToggleLegend: noop,
    onReset: noop, annotating: false, onToggleAnnotate: vi.fn(),
    entitled: false, savedMap: false, ...over,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  storeState.setPurchaseModalOpen = vi.fn();
});

describe('free tier on a saved map — the locked state is VISIBLE, never absent', () => {
  test('the DM-pins affordance renders locked: drawn lock glyph + teaser + the premium button', () => {
    render(<SettlementMapEditControls {...props({ entitled: false, savedMap: true })} />);
    expect(screen.getByTestId('dm-pins-lock')).toBeTruthy();                    // the lock glyph
    expect(screen.getByText(/Drop labelled pins/)).toBeTruthy();                // the teaser
    expect(screen.getByText('Unlocks with Cartographer.')).toBeTruthy();        // the upgrade hint
    // NO working annotate toggle mounts while locked.
    expect(screen.queryByLabelText(/Toggle DM marker placement/)).toBeNull();
  });

  test('clicking the locked affordance fires the purchase modal and NEVER an annotate write', () => {
    const p = props({ entitled: false, savedMap: true });
    render(<SettlementMapEditControls {...p} />);
    fireEvent.click(screen.getByRole('button', { name: /DM markers are a Cartographer premium feature/ }));
    expect(storeState.setPurchaseModalOpen).toHaveBeenCalledWith(true);
    expect(p.onToggleAnnotate).not.toHaveBeenCalled(); // stored annotations untouched — an upgrade restores them
  });
});

describe('premium — the gate passes', () => {
  test('the working Markers toggle renders, no lock glyph, no purchase moment', () => {
    render(<SettlementMapEditControls {...props({ entitled: true, savedMap: true, editing: true })} />);
    expect(screen.getByLabelText(/Toggle DM marker placement/)).toBeTruthy();
    expect(screen.queryByTestId('dm-pins-lock')).toBeNull();
    expect(storeState.setPurchaseModalOpen).not.toHaveBeenCalled();
  });
});

describe('anon / public gallery — no saved map, nothing extra', () => {
  test('with no saveId the locked teaser never mounts (caps-on-actions-never-render)', () => {
    const { container } = render(<SettlementMapEditControls {...props({ entitled: false, savedMap: false })} />);
    expect(container.querySelector('[data-town-pins-locked]')).toBeNull();
    expect(screen.queryByTestId('dm-pins-lock')).toBeNull();
  });
});

describe('the annotation derivation stays tier-blind (source scan)', () => {
  // The DM-pin DERIVATION (mapEdits.js annotation read/write) must never learn about
  // tiers/auth — the gate wraps the affordance only (the fog/mapChains law, verbatim).
  const FORBIDDEN = /TIER_GATE|canUseMapChains|ELEVATED_ROLES|useStore|authSlice|\bauth\b|entitled|canEdit/;

  test('src/domain/townMap/mapEdits.js carries no auth/tier-gate concept', () => {
    const src = readFileSync(join(ROOT, 'src/domain/townMap/mapEdits.js'), 'utf8');
    expect(src).not.toMatch(FORBIDDEN);
  });

  test('the pane wires the gate from its owner-authorized edit identity', () => {
    const src = readFileSync(join(ROOT, 'src/components/townMap/SettlementMapPane.jsx'), 'utf8');
    expect(src).toMatch(/entitled=\{!!canEdit\}/);
    // `authoringSaveId` is `saveId` only for the DM projection. Player/public
    // views must not see an owner-only purchase/edit affordance merely because
    // the underlying settlement happens to be saved.
    expect(src).toMatch(/savedMap=\{authoringSaveId != null\}/);
  });
});

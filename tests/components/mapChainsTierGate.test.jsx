/**
 * @vitest-environment jsdom
 *
 * tests/components/mapChainsTierGate.test.jsx — the mapChains tier gate
 * (Owner Ruling #5, 2026-07-17: "enforce mapChains" — the recorded
 * paid-surface gap closed at its recorded veto handle, reconciliation #4).
 *
 * THE PREMIUM-SEAM LAW this pins: the gate wraps the AFFORDANCE, never the
 * derivation.
 *   • Free tier SEES the gate moment: the Supply-chains toggles stay visible
 *     with a Lock, clicking fires the map_realm_teaser pricing moment, and
 *     nothing toggles; <ChainEdges/> never mounts.
 *   • Premium passes: toggles work, <ChainEdges/> mounts.
 *   • The derivation (computeMapChains / supplyChains) is TIER-BLIND — a
 *     source scan proves no auth/tier concept ever reaches it.
 *
 * The stored layers.chains value is deliberately NOT rewritten while locked,
 * so an upgrade restores the layer without re-toggling.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

afterEach(cleanup);

// ── Fake store (selector-driven, per mapOverlayTransformContract.test.jsx) ──
const { useStore, storeState } = vi.hoisted(() => {
  const noop = () => {};
  const storeState = {
    // shared / MapOverlay selectors
    mapMode: 'view',
    annotateTool: null,
    isDraggingOver: false,
    updateLabel: noop,
    updateMarker: noop,
    pushMapUndo: noop,
    setMapViewport: noop,
    mapState: {
      placements: {},
      // chains STAYS true in stored state — the gate must not rewrite it.
      layers: { chains: true, placements: false },
      customBackdrop: { imageUrl: 'blob:test-image', w: 800, h: 600 },
      viewport: null,
    },
    // LayersPanel / RoutesToolbar selectors
    toggleLayer: null,      // per-test vi.fn()
    setLayerFilter: noop,
    settlement: null,
    auth: { tier: 'free' },
    setActivePricingMoment: noop,
    // the gate — flipped per test
    canUseMapChains: () => false,
  };
  const useStore = (selector) => selector(storeState);
  useStore.getState = () => storeState;
  return { useStore, storeState };
});

vi.mock('../../src/store/index.js', () => ({ useStore }));

vi.mock('../../src/lib/pricingMoments.js', () => ({
  triggerPricingMoment: vi.fn(),
}));

// Sentinel for the gated layer; heavy uninvolved siblings render nothing so
// this pin stays about the ChainEdges conditional.
vi.mock('../../src/components/map/ChainEdges.jsx', () => ({
  default: () => <g data-testid="chain-edges-sentinel" />,
}));
vi.mock('../../src/components/map/WarFaithMapOverlay.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/RegionalCausalityLayer.jsx', () => ({ default: () => null }));

import { triggerPricingMoment } from '../../src/lib/pricingMoments.js';
import MapOverlay from '../../src/components/MapOverlay.jsx';
import LayersPanel from '../../src/components/map/LayersPanel.jsx';
import RoutesToolbar from '../../src/components/map/RoutesToolbar.jsx';

beforeEach(() => {
  vi.clearAllMocks();
  storeState.toggleLayer = vi.fn();
  storeState.mapState.layers = { chains: true, placements: false };
  storeState.auth = { tier: 'free' };
  storeState.canUseMapChains = () => false;
});

describe('MapOverlay — ChainEdges renders only through the tier gate', () => {
  test('free tier: layers.chains true but ChainEdges does NOT mount', () => {
    render(<MapOverlay bridge={null} transformOut={{ current: null }} />);
    expect(screen.queryByTestId('chain-edges-sentinel')).toBeNull();
  });

  test('premium: ChainEdges mounts', () => {
    storeState.canUseMapChains = () => true;
    render(<MapOverlay bridge={null} transformOut={{ current: null }} />);
    expect(screen.getByTestId('chain-edges-sentinel')).toBeTruthy();
  });
});

describe('LayersPanel — the Supply-chains toggle is the gate moment', () => {
  test('free tier SEES the gate: row visible, unchecked, locked; click fires the pricing moment, never toggles', () => {
    render(<LayersPanel onClose={() => {}} />);
    const checkbox = screen.getByLabelText(/Supply chains — Supply chains unlock with Cartographer/);
    expect(checkbox.checked).toBe(false);            // displayed OFF while locked (stored value untouched)
    expect(screen.getByTestId('layer-toggle-supply-chains-lock')).toBeTruthy();
    fireEvent.click(checkbox);
    expect(storeState.toggleLayer).not.toHaveBeenCalled();
    expect(triggerPricingMoment).toHaveBeenCalledWith('map_realm_teaser', storeState.setActivePricingMoment, { tier: 'free' });
    // the stored layer flag was not rewritten by the locked interaction
    expect(storeState.mapState.layers.chains).toBe(true);
  });

  test('premium passes: checked reflects the stored layer and click toggles', () => {
    storeState.canUseMapChains = () => true;
    render(<LayersPanel onClose={() => {}} />);
    const checkbox = screen.getByLabelText('Supply chains');
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(storeState.toggleLayer).toHaveBeenCalledWith('chains');
    expect(triggerPricingMoment).not.toHaveBeenCalled();
  });
});

describe('RoutesToolbar — the Chains toggle twin', () => {
  test('free tier: locked hint shown, not pressed; click fires the pricing moment, never toggles', () => {
    render(<RoutesToolbar />);
    // NOTE: the Lock GLYPH rides Button's `icon` prop, which only renders
    // inside the map's icons Provider (useIconsOn) — the visible gate moment
    // in this bare render is the locked title hint + unpressed state.
    const btn = screen.getByTitle('Supply chains unlock with Cartographer');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(btn);
    expect(storeState.toggleLayer).not.toHaveBeenCalled();
    expect(triggerPricingMoment).toHaveBeenCalledWith('map_realm_teaser', storeState.setActivePricingMoment, { tier: 'free' });
  });

  test('premium passes: click toggles the chains layer', () => {
    storeState.canUseMapChains = () => true;
    render(<RoutesToolbar />);
    const btn = screen.getByTitle('Toggle the supply-chain layer');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(btn);
    expect(storeState.toggleLayer).toHaveBeenCalledWith('chains');
    expect(triggerPricingMoment).not.toHaveBeenCalled();
  });
});

describe('the derivation stays tier-blind (source scan)', () => {
  // The chain DERIVATION must never learn about tiers/auth — the gate wraps
  // the affordances only. (`tier` alone is NOT scanned for: settlements have a
  // legitimate game tier. These are the auth-gate concepts.)
  const FORBIDDEN = /TIER_GATE|canUseMapChains|ELEVATED_ROLES|useStore|authSlice|\bauth\b/;

  test.each([
    'src/lib/computeMapChains.js',
    'src/lib/supplyChains.js',
  ])('%s carries no auth/tier-gate concept', (rel) => {
    const src = readFileSync(join(ROOT, rel), 'utf8');
    expect(src).not.toMatch(FORBIDDEN);
  });

  test('ChainEdges.jsx (the draw component) consults no gate — the gate lives outside it', () => {
    const src = readFileSync(join(ROOT, 'src/components/map/ChainEdges.jsx'), 'utf8');
    expect(src).not.toMatch(/TIER_GATE|canUseMapChains|ELEVATED_ROLES/);
  });

  test('MapOverlay renders ChainEdges only behind the gate conditional', () => {
    const src = readFileSync(join(ROOT, 'src/components/MapOverlay.jsx'), 'utf8');
    expect(src).toMatch(/layers\.chains && mapChainsUnlocked && <ChainEdges \/>/);
    // and never ungated:
    expect(src).not.toMatch(/\{layers\.chains\s+&& <ChainEdges/);
  });
});

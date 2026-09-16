/**
 * @vitest-environment jsdom
 *
 * tests/components/changeViewDepthGate.test.jsx — the change-view HISTORY DEPTH gate
 * (THE FREELY-GIVEN RULINGS, 2026-07-17: change-view depth is PREMIUM / Cartographer).
 *
 * THE PREMIUM-SEAM LAW this pins (the fog/mapChains precedent): the VIEW renders for
 * everyone (reading stays free); the DEPTH gates.
 *   • Free tier SEES the change view but only the most-recent change per band; the
 *     deeper history is VISIBLE-as-locked (a drawn padlock + the hidden count), and
 *     clicking fires the purchase modal. No stored state is touched (pure view slice).
 *   • Premium passes: the full derived depth renders, no lock.
 *   • The DERIVATION (changeView.js) is TIER-BLIND — a source scan proves no auth/tier
 *     concept ever reaches it (the slice is a pure view-time affordance).
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
// The dark-fabric whisper isn't under test — stub it to keep the render store-free.
vi.mock('../../src/components/guidance/SurveyorNote.jsx', () => ({ default: () => null }));

import SettlementMapNotes from '../../src/components/townMap/SettlementMapNotes.jsx';

// A change view with 2 rows in each band — one shown free, one behind the depth lock.
const CHANGES = {
  hasFabric: true,
  hasAny: true,
  rebuilt: [
    { label: 'Temple quarter', detail: 'rebuilt after fire' },
    { label: 'Market quarter', detail: 'rebuilt after flood' },
  ],
  rebuiltClasses: [],
  scars: [
    { label: 'Fire damage', detail: 'severe scarring' },
    { label: 'Blight damage', detail: 'heavy scarring' },
  ],
  calamities: [
    { label: 'The Long Winter', detail: 'year 812 · 40 dead' },
    { label: 'Red Fever', detail: 'year 830' },
  ],
};

/** Render the notes drawer and open it (the change section only mounts when open). */
function renderOpen(over = {}) {
  const res = render(
    <SettlementMapNotes settlement={{ id: 't1' }} story={null} changes={CHANGES} roads={null} {...over} />,
  );
  fireEvent.click(screen.getByRole('button', { name: /Read the map/ }));
  return res;
}

beforeEach(() => {
  vi.clearAllMocks();
  storeState.setPurchaseModalOpen = vi.fn();
});

describe('free tier — the view renders, the deeper history gates', () => {
  test('only the most-recent change per band shows; the rest is a VISIBLE depth lock', () => {
    renderOpen({ entitled: false });
    // The newest per band renders (reading is free)…
    expect(screen.getByText('Temple quarter')).toBeTruthy();
    expect(screen.getByText('Fire damage')).toBeTruthy();
    expect(screen.getByText('The Long Winter')).toBeTruthy();
    // …but the second row of each band is behind the lock (3 hidden total).
    expect(screen.queryByText('Market quarter')).toBeNull();
    expect(screen.queryByText('Blight damage')).toBeNull();
    expect(screen.queryByText('Red Fever')).toBeNull();
    expect(screen.getByTestId('change-view-lock')).toBeTruthy();
    expect(screen.getByText('See 3 earlier changes (Premium)')).toBeTruthy();
  });

  test('clicking the depth lock fires the purchase modal', () => {
    renderOpen({ entitled: false });
    fireEvent.click(screen.getByText('See 3 earlier changes (Premium)'));
    expect(storeState.setPurchaseModalOpen).toHaveBeenCalledWith(true);
  });
});

describe('premium — the full depth renders', () => {
  test('every band row shows and there is no depth lock', () => {
    renderOpen({ entitled: true });
    expect(screen.getByText('Temple quarter')).toBeTruthy();
    expect(screen.getByText('Market quarter')).toBeTruthy();
    expect(screen.getByText('Blight damage')).toBeTruthy();
    expect(screen.getByText('Red Fever')).toBeTruthy();
    expect(screen.queryByTestId('change-view-lock')).toBeNull();
    expect(storeState.setPurchaseModalOpen).not.toHaveBeenCalled();
  });
});

describe('the change-view derivation stays tier-blind (source scan)', () => {
  const FORBIDDEN = /TIER_GATE|canUseMapChains|ELEVATED_ROLES|useStore|authSlice|\bauth\b|entitled|canEdit/;
  test('src/domain/townMap/changeView.js carries no auth/tier-gate concept', () => {
    const src = readFileSync(join(ROOT, 'src/domain/townMap/changeView.js'), 'utf8');
    expect(src).not.toMatch(FORBIDDEN);
  });
});

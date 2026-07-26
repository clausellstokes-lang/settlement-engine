/** @vitest-environment jsdom */
/**
 * DeityAssignmentPanel — Phase 5 W-C4 patron/cult assignment control.
 *
 * Pins the TIER MATRIX (the constitutional walls):
 *   • PREMIUM        — the write picker: assign a patron, "No patron (latent)"
 *                      clears back to dormant (setPrimaryDeity(null)).
 *   • FREE / ANON    — the in-place upsell (never a dead control), naming NO deity.
 *   • LAPSED premium — read-only view of the OWNED embed, no write control.
 *   • NO-LIVE-FAITH-FOR-FREE — a free viewer of a latent-only settlement never
 *                      sees a deity name (the panel reads primaryDeitySnapshot
 *                      only, never config.latentPantheon).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = {};
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  useStore.__reset = () => {
    for (const k of Object.keys(data)) delete data[k];
    Object.assign(data, {
      settlement: null,
      customContent: { deities: [] },
      setPrimaryDeity: vi.fn(),
      imposeCult: vi.fn(),
      canUseCustomContent: () => false,
      setPurchaseModalOpen: vi.fn(),
    });
  };
  return { useStore };
});

import { useStore } from '../../src/store/index.js';
import DeityAssignmentPanel from '../../src/components/settlement/DeityAssignmentPanel.jsx';

const DEITY = { name: 'Aurelion', localUid: 'lu_aur', alignmentAxis: 'good', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun' };
const DEITY_REF = 'custom:lu_aur';
const LATENT_NAME = 'Zzyraxil the Unnamed';

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('DeityAssignmentPanel — tier matrix', () => {
  it('PREMIUM renders the write picker with the clear option and the authored deity', () => {
    const setPrimaryDeity = vi.fn();
    useStore.__set({
      settlement: { tier: 'town', config: {} },
      customContent: { deities: [DEITY] },
      canUseCustomContent: () => true,
      setPrimaryDeity,
    });
    const { container } = render(<DeityAssignmentPanel />);
    const select = screen.getByTestId('patron-deity-select');
    expect(select).toBeTruthy();
    expect(container.textContent).toMatch(/No patron \(latent\)/);
    expect(container.textContent).toMatch(/Aurelion/);

    // Assign the deity → setPrimaryDeity(refId).
    fireEvent.change(select, { target: { value: DEITY_REF } });
    expect(setPrimaryDeity).toHaveBeenCalledWith(DEITY_REF);

    // "No patron (latent)" clears back to dormant → setPrimaryDeity(null).
    fireEvent.change(select, { target: { value: '' } });
    expect(setPrimaryDeity).toHaveBeenCalledWith(null);
  });

  it('FREE renders the in-place upsell (no picker, no deity name)', () => {
    useStore.__set({
      settlement: { tier: 'town', config: {} },
      customContent: { deities: [DEITY] },
      canUseCustomContent: () => false,
    });
    const { container } = render(<DeityAssignmentPanel />);
    expect(screen.getByTestId('deity-assignment-upsell')).toBeTruthy();
    expect(screen.queryByTestId('patron-deity-select')).toBeNull();
    expect(container.textContent).toMatch(/Upgrade to premium/i);
    // A free user is never shown an authored deity name in the control.
    expect(container.textContent).not.toContain('Aurelion');
  });

  it('FREE upgrade button opens the purchase modal', () => {
    const setPurchaseModalOpen = vi.fn();
    useStore.__set({ settlement: { config: {} }, canUseCustomContent: () => false, setPurchaseModalOpen });
    render(<DeityAssignmentPanel />);
    fireEvent.click(screen.getByText(/Upgrade to premium/i));
    expect(setPurchaseModalOpen).toHaveBeenCalledWith(true);
  });

  it('LAPSED premium (not premium, but owns a live embed) is read-only — no write control', () => {
    useStore.__set({
      settlement: { tier: 'town', config: { primaryDeityRef: 'deity:lu_aur:aurelion', primaryDeitySnapshot: { name: 'Aurelion', alignmentAxis: 'good', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun' } } },
      canUseCustomContent: () => false,
    });
    const { container } = render(<DeityAssignmentPanel />);
    expect(screen.getByTestId('deity-assignment-readonly')).toBeTruthy();
    // The owned embed IS shown read-only (lapsed keeps its data).
    expect(container.textContent).toMatch(/Aurelion/);
    expect(container.textContent).toMatch(/premium has lapsed/i);
    // But there is NO write control.
    expect(screen.queryByTestId('patron-deity-select')).toBeNull();
    expect(screen.queryByTestId('deity-assignment-upsell')).toBeNull();
  });

  it('translates embedded deity axes through the canonical authored labels', () => {
    useStore.__set({
      settlement: {
        tier: 'town',
        config: {
          primaryDeityRef: 'deity:lu_aur:aurelion',
          primaryDeitySnapshot: {
            name: 'Aurelion',
            alignmentAxis: 'good',
            rankAxis: 'major',
            lawAxis: 'lawful',
            domain: 'sun',
          },
        },
      },
      canUseCustomContent: () => false,
    });

    const { container } = render(<DeityAssignmentPanel />);
    expect(container.textContent).toContain('Good · Major · Lawful · sun');
    expect(container.textContent).not.toContain('good · major · lawful');
  });

  it('omits an unknown legacy axis instead of exposing its stored enum key', () => {
    useStore.__set({
      settlement: {
        tier: 'town',
        config: {
          primaryDeitySnapshot: {
            name: 'Old Star',
            alignmentAxis: 'legacy_moral_key',
            rankAxis: 'minor',
            lawAxis: 'neutral',
          },
        },
      },
      canUseCustomContent: () => false,
    });

    const { container } = render(<DeityAssignmentPanel />);
    expect(container.textContent).toContain('Old Star · Minor');
    expect(container.textContent).not.toContain('legacy_moral_key');
  });

  it('NO-LIVE-FAITH-FOR-FREE: a free viewer of a latent-only settlement never sees a deity name', () => {
    useStore.__set({
      settlement: { config: { latentPantheon: { patron: { name: LATENT_NAME } } } },
      customContent: { deities: [] },
      canUseCustomContent: () => false,
    });
    const { container } = render(<DeityAssignmentPanel />);
    // The upsell (latent gives no live embed), and the latent name never leaks.
    expect(screen.getByTestId('deity-assignment-upsell')).toBeTruthy();
    expect(container.textContent).not.toContain(LATENT_NAME);
  });
});

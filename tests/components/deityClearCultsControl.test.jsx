/** @vitest-environment jsdom */
/**
 * tests/components/deityClearCultsControl.test.jsx — Wave R-2 Lane C (atlas
 * Gap 2b): the clear-ALL-cults capability (`imposeCult(null)`) gets its UI
 * door in <DeityAssignmentPanel />.
 *
 * Pins:
 *   • ENTITLED + owned cults: the "Remove all cults" control renders and
 *     dispatches imposeCult(null) — exactly the clear-all arity (no removeRef).
 *   • HONEST EMPTY: with zero cults the control does not render (nothing to
 *     clear ⇒ no dead control).
 *   • ORPHAN-CULT REACHABILITY: cults with NO patron (patron cleared first)
 *     still get the cults section — per-cult Remove AND clear-all stay
 *     reachable (previously the section required a seated patron, stranding
 *     owned cults invisibly).
 *   • FREE: the upsell branch — no clear control, ever.
 *   • LAPSED: the read-only branch shows the owned cults but NO clear control —
 *     surfacing shed controls to lapsed users is the owner-parked product call
 *     from Wave R-0; the STORE seam still allows the lapsed clear (pinned in
 *     tests/store/deityClearCults.test.js).
 *
 * Store-mock idiom: tests/components/deityPanelManifestParity.test.jsx.
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
import { mintDeityRef } from '../../src/lib/customRegistry.js';
import { td } from '../../src/copy/deityAuthoring.js';

const DEITY = { name: 'Aurelion', localUid: 'lu_aur', alignmentAxis: 'good', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun' };
const MINTED = mintDeityRef(DEITY);
const CULT_A = { _deityRef: 'deity:lu_a:ash_choir', name: 'Ash Choir', alignmentAxis: 'evil', lawAxis: 'chaotic', rankAxis: 'cult' };
const CULT_B = { _deityRef: 'deity:lu_b:tide_kin', name: 'Tide Kin', alignmentAxis: 'neutral', lawAxis: 'neutral', rankAxis: 'cult' };

const PATRON_SNAP = { _deityRef: MINTED, name: DEITY.name, alignmentAxis: 'good', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun' };

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('the clear-all-cults door — entitled users', () => {
  it('renders with owned cults and dispatches imposeCult(null) — the clear-ALL arity', () => {
    const imposeCult = vi.fn();
    useStore.__set({
      settlement: { tier: 'town', config: { primaryDeityRef: MINTED, primaryDeitySnapshot: PATRON_SNAP, cultDeitySnapshots: [CULT_A, CULT_B] } },
      customContent: { deities: [DEITY] },
      canUseCustomContent: () => true,
      imposeCult,
    });
    render(<DeityAssignmentPanel />);

    const btn = screen.getByTestId('cult-clear-all');
    expect(btn.textContent).toBe(td('assign.clearAll'));
    fireEvent.click(btn);
    expect(imposeCult).toHaveBeenCalledTimes(1);
    expect(imposeCult).toHaveBeenCalledWith(null);
  });

  it('HONEST EMPTY: zero cults ⇒ no clear control (the section itself still offers the impose write)', () => {
    useStore.__set({
      settlement: { tier: 'town', config: { primaryDeityRef: MINTED, primaryDeitySnapshot: PATRON_SNAP } },
      customContent: { deities: [DEITY] },
      canUseCustomContent: () => true,
    });
    render(<DeityAssignmentPanel />);
    expect(screen.queryByTestId('cult-clear-all')).toBeNull();
  });

  it('ORPHAN-CULT REACHABILITY: no patron, owned cults ⇒ Remove + clear-all stay reachable', () => {
    const imposeCult = vi.fn();
    useStore.__set({
      settlement: { tier: 'town', config: { cultDeitySnapshots: [CULT_A] } },
      customContent: { deities: [DEITY] },
      canUseCustomContent: () => true,
      imposeCult,
    });
    render(<DeityAssignmentPanel />);

    // The shed direction survives a cleared patron: both controls mount.
    expect(screen.getByLabelText(`${td('assign.remove')} ${CULT_A.name}`)).toBeTruthy();
    fireEvent.click(screen.getByTestId('cult-clear-all'));
    expect(imposeCult).toHaveBeenCalledWith(null);
  });
});

describe('the clear-all-cults door — unentitled branches never render it', () => {
  it('FREE (no embeds): upsell branch, no clear control', () => {
    useStore.__set({
      settlement: { tier: 'town', config: {} },
      customContent: { deities: [DEITY] },
      canUseCustomContent: () => false,
    });
    render(<DeityAssignmentPanel />);
    expect(screen.getByTestId('deity-assignment-upsell')).toBeTruthy();
    expect(screen.queryByTestId('cult-clear-all')).toBeNull();
  });

  it('LAPSED (owns cults): read-only branch names the cults but offers NO clear control (owner-parked product call)', () => {
    useStore.__set({
      settlement: { tier: 'town', config: { primaryDeitySnapshot: PATRON_SNAP, cultDeitySnapshots: [CULT_A] } },
      customContent: { deities: [DEITY] },
      canUseCustomContent: () => false,
    });
    const { container } = render(<DeityAssignmentPanel />);
    expect(screen.getByTestId('deity-assignment-readonly')).toBeTruthy();
    expect(container.textContent).toContain(CULT_A.name);
    expect(screen.queryByTestId('cult-clear-all')).toBeNull();
  });
});

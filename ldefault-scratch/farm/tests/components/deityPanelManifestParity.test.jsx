/** @vitest-environment jsdom */
/**
 * tests/components/deityPanelManifestParity.test.jsx — Wave R-0 Lane D
 * (owner-queue #27, atlas Gap #14): the panel lane runs the SAME
 * AFFORDANCE_MANIFEST availability predicates the composer runs, and BOTH
 * mounts of <DeityAssignmentPanel /> keep working for entitled users.
 *
 * Pins:
 *   • HARD CAPACITY GUARD (Wave R-0 verifier fix #1) — a capacity-0 settlement
 *     hides the cult write control and shows td('assign.tooSmall')
 *     UNCONDITIONALLY, regardless of what the IMPOSE_CULT probe predicate says
 *     (the probe's niche-neutral test deity reports 'replaced' — available —
 *     when a stale cult sits in its neutral:neutral niche, which would re-open
 *     the silent no-op the guard closes).
 *   • MANIFEST PARITY — above zero capacity, an unavailable verb gets the
 *     manifest's OWN grayed-with-reason sentences (computed from the live
 *     predicate, never a hand-copied string); a slotted tier still gets the
 *     write control.
 *   • SECOND MOUNT (AssignDeityFromMap ← HeraldBody) — the map/Herald mount
 *     hydrates a save into the live slot and mounts the same panel: entitled
 *     users get the working write picker (dispatch reaches setPrimaryDeity),
 *     free users get the upsell and never a deity name.
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
      savedSettlements: [],
      activeSaveId: null,
      hydrateFromSave: vi.fn(),
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
import AssignDeityFromMap from '../../src/components/map/AssignDeityFromMap.jsx';
import { AFFORDANCE_MANIFEST } from '../../src/domain/events/affordanceManifest.js';
import { mintDeityRef } from '../../src/lib/customRegistry.js';
import { td } from '../../src/copy/deityAuthoring.js';

const DEITY = { name: 'Aurelion', localUid: 'lu_aur', alignmentAxis: 'good', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun' };
const DEITY_TWO = { name: 'Vaelith', localUid: 'lu_vae', alignmentAxis: 'evil', rankAxis: 'cult', lawAxis: 'chaotic', domain: 'rot' };
const DEITY_REF = 'custom:lu_aur';
const MINTED = mintDeityRef(DEITY); // deity:lu_aur:aurelion

/** A settlement that already worships DEITY as patron, at the given tier. */
const withPatron = (tier) => ({
  tier,
  config: {
    primaryDeityRef: MINTED,
    primaryDeitySnapshot: { _deityRef: MINTED, name: DEITY.name, alignmentAxis: 'good', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun' },
  },
});

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('DeityAssignmentPanel — hard capacity guard + manifest parity (never a silent no-op)', () => {
  it('a slotless tier (thorp + patron) hides the cult control behind the HARD guard (tooSmall copy)', () => {
    const settlement = withPatron('thorp'); // thorp holds 1 slot; the patron takes it.
    useStore.__set({
      settlement,
      customContent: { deities: [DEITY, DEITY_TWO] },
      canUseCustomContent: () => true,
    });
    render(<DeityAssignmentPanel />);

    // Non-vacuity: the manifest predicate agrees no slot exists here — but the
    // capacity-0 guard is what hides the control, checked BEFORE the predicate.
    const p = AFFORDANCE_MANIFEST.IMPOSE_CULT.predicate(settlement, { canUseCustom: true });
    expect(p.available).toBe(false);

    expect(screen.getByTestId('cult-too-small').textContent).toBe(td('assign.tooSmall'));
    expect(screen.queryByTestId('cult-deity-select')).toBeNull();
    expect(screen.queryByTestId('cult-verb-unavailable')).toBeNull();
  });

  it('capacity-0 hides the cult control REGARDLESS of the probe predicate (stale cult in the probe niche)', () => {
    // A thorp (1 slot, patron seated ⇒ 0 cult slots) carrying a STALE cult —
    // e.g. left behind by a tier demotion — whose niche is the probe deity's
    // own neutral:neutral. reconcileCultImposition answers 'replaced' for the
    // probe, so the manifest predicate reports AVAILABLE at zero capacity; a
    // real same-different-niche imposition would then silently no-op at the
    // store seam. The hard guard must win.
    const settlement = withPatron('thorp');
    settlement.config.cultDeitySnapshots = [
      { _deityRef: 'deity:lu_stale:old_way', name: 'Old Way', alignmentAxis: 'neutral', lawAxis: 'neutral', rankAxis: 'cult' },
    ];
    useStore.__set({
      settlement,
      customContent: { deities: [DEITY, DEITY_TWO] },
      canUseCustomContent: () => true,
    });
    render(<DeityAssignmentPanel />);

    // Non-vacuity: the probe predicate really WOULD have offered the write.
    const p = AFFORDANCE_MANIFEST.IMPOSE_CULT.predicate(settlement, { canUseCustom: true });
    expect(p.available).toBe(true);

    expect(screen.getByTestId('cult-too-small').textContent).toBe(td('assign.tooSmall'));
    expect(screen.queryByTestId('cult-deity-select')).toBeNull();
    expect(screen.queryByTestId('cult-verb-unavailable')).toBeNull();
    // The stale cult keeps its Remove affordance (the shed direction stays open).
    expect(screen.getByLabelText('Remove Old Way')).toBeTruthy();
  });

  it('a slotted tier (town + patron) keeps the cult write control — no reason note', () => {
    const settlement = withPatron('town');
    useStore.__set({
      settlement,
      customContent: { deities: [DEITY, DEITY_TWO] },
      canUseCustomContent: () => true,
    });
    render(<DeityAssignmentPanel />);
    expect(AFFORDANCE_MANIFEST.IMPOSE_CULT.predicate(settlement, { canUseCustom: true }).available).toBe(true);
    expect(screen.getByTestId('cult-deity-select')).toBeTruthy();
    expect(screen.queryByTestId('cult-verb-unavailable')).toBeNull();
  });

  it('the patron picker stays enabled while the manifest predicate allows the verb', () => {
    const settlement = withPatron('town');
    useStore.__set({
      settlement,
      customContent: { deities: [DEITY] },
      canUseCustomContent: () => true,
    });
    render(<DeityAssignmentPanel />);
    expect(AFFORDANCE_MANIFEST.SET_PRIMARY_DEITY.predicate(settlement, { canUseCustom: true }).available).toBe(true);
    expect(screen.getByTestId('patron-deity-select').disabled).toBe(false);
    expect(screen.queryByTestId('patron-verb-unavailable')).toBeNull();
  });
});

describe('AssignDeityFromMap — the second mount stays wired', () => {
  const SAVE = { id: 's1', name: 'Fordton', settlement: { tier: 'town', config: {} } };
  const CAMPAIGN = { settlementIds: ['s1'] };

  it('ENTITLED: hydrates the picked save and the mounted panel dispatches setPrimaryDeity', () => {
    const hydrateFromSave = vi.fn();
    const setPrimaryDeity = vi.fn();
    useStore.__set({
      savedSettlements: [SAVE],
      activeSaveId: 's1', // the member is already the live slot ⇒ the panel mounts
      hydrateFromSave,
      settlement: { tier: 'town', config: {} },
      customContent: { deities: [DEITY] },
      canUseCustomContent: () => true,
      setPrimaryDeity,
    });
    render(<AssignDeityFromMap campaign={CAMPAIGN} />);

    // Re-picking a settlement routes through hydrateFromSave (the live-slot bridge).
    fireEvent.change(screen.getByLabelText('Settlement to assign a deity'), { target: { value: 's1' } });
    expect(hydrateFromSave).toHaveBeenCalledWith(SAVE);

    // The same W-C4 write picker mounts and dispatches for an entitled user.
    const select = screen.getByTestId('patron-deity-select');
    expect(select.disabled).toBe(false);
    fireEvent.change(select, { target: { value: DEITY_REF } });
    expect(setPrimaryDeity).toHaveBeenCalledWith(DEITY_REF);
  });

  it('FREE: the map mount shows the upsell — no write control, no deity name', () => {
    useStore.__set({
      savedSettlements: [SAVE],
      activeSaveId: 's1',
      settlement: { tier: 'town', config: {} },
      customContent: { deities: [DEITY] },
      canUseCustomContent: () => false,
    });
    const { container } = render(<AssignDeityFromMap campaign={CAMPAIGN} />);
    expect(screen.getByTestId('deity-assignment-upsell')).toBeTruthy();
    expect(screen.queryByTestId('patron-deity-select')).toBeNull();
    expect(container.textContent).not.toContain('Aurelion');
  });
});

/** @vitest-environment jsdom */
/**
 * tests/components/deityPanelManifestParity.test.jsx — Wave R-0 Lane D
 * (owner-queue #27, atlas Gap #14): the panel lane runs the SAME
 * AFFORDANCE_MANIFEST availability predicates the composer runs, and BOTH
 * mounts of <DeityAssignmentPanel /> keep working for entitled users.
 *
 * Pins:
 *   • MANIFEST PARITY — a premium user on a settlement whose tier holds no cult
 *     slot gets the manifest's OWN grayed-with-reason sentences (computed from
 *     the live predicate, never a hand-copied string) instead of the former
 *     hand-derived capacity note; a slotted tier still gets the write control.
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

describe('DeityAssignmentPanel — manifest parity (grayed-with-reason, never a silent no-op)', () => {
  it('a slotless tier (thorp + patron) shows the manifest predicate\'s own sentences, no cult control', () => {
    const settlement = withPatron('thorp'); // thorp holds 1 slot; the patron takes it.
    useStore.__set({
      settlement,
      customContent: { deities: [DEITY, DEITY_TWO] },
      canUseCustomContent: () => true,
    });
    render(<DeityAssignmentPanel />);

    // The EXACT sentences the composer would show for this verb, computed from
    // the live manifest predicate — parity by construction, not by copy.
    const p = AFFORDANCE_MANIFEST.IMPOSE_CULT.predicate(settlement, { canUseCustom: true });
    expect(p.available).toBe(false);
    const expected = [...p.reasons, ...p.unlocks].join(' ');
    expect(expected).toContain('No cult slot'); // non-vacuity: the predicate really refused

    expect(screen.getByTestId('cult-verb-unavailable').textContent).toBe(expected);
    expect(screen.queryByTestId('cult-deity-select')).toBeNull();
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

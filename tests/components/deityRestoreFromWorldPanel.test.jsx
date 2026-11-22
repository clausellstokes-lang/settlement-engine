/** @vitest-environment jsdom */
/**
 * DeityAssignmentPanel — the RESTORE-FROM-WORLD door (Wave R-5b, item 13b).
 *
 * When the living world converts a settlement away from its patron, the ousted
 * god survives only in the campaign's own religion record. The authoring pickers
 * list account-authored deities only, so that patron — pool-seeded, or a shared
 * campaign's foreign homebrew — had no way back onto the seat. The panel now
 * offers the settlement's recorded faiths as a second group in the same patron
 * picker, and hands the pick to the store seam's restore lane.
 *
 * Pinned here: the group appears only when there is something to offer, it never
 * re-offers the deity already seated, choosing one dispatches the recorded state
 * key with the restore flag, an ordinary authored pick is untouched, and a
 * standalone (non-campaign) settlement shows no group at all.
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
      campaigns: [],
      activeSaveId: null,
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

const OUSTED_REF = 'deity:core:the-quiet-flame';
const RIVAL_REF = 'deity:core:storm-eater';
const SAVE_ID = 'save-7';

const snap = (ref, name) => ({ _deityRef: ref, name, alignmentAxis: 'neutral', temperamentAxis: 'peacelike', rankAxis: 'minor', lawAxis: 'lawful' });

/** A campaign whose record carries the seated rival and the converted-away patron. */
const CAMPAIGNS = [{
  id: 'camp-1',
  worldState: {
    religionStates: {
      [SAVE_ID]: {
        patronRef: RIVAL_REF,
        deities: {
          [RIVAL_REF]: { snapshot: snap(RIVAL_REF, 'Storm-Eater'), share: 72 },
          [OUSTED_REF]: { snapshot: snap(OUSTED_REF, 'The Quiet Flame'), share: 28 },
        },
      },
    },
  },
}];

/** Premium, seated on the rival the world installed, with the record present. */
function premiumConverted(extra = {}) {
  return {
    settlement: { tier: 'town', config: { primaryDeityRef: RIVAL_REF, primaryDeitySnapshot: snap(RIVAL_REF, 'Storm-Eater') } },
    customContent: { deities: [DEITY] },
    canUseCustomContent: () => true,
    campaigns: CAMPAIGNS,
    activeSaveId: SAVE_ID,
    ...extra,
  };
}

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('DeityAssignmentPanel — restore from the world record', () => {
  it('offers the settlement’s recorded faiths, minus the one already seated', () => {
    useStore.__set(premiumConverted());
    render(<DeityAssignmentPanel />);
    const group = screen.getByTestId('world-faiths-group');
    const offered = [...group.querySelectorAll('option')].map((o) => o.textContent);
    expect(offered).toEqual(['The Quiet Flame']);   // Storm-Eater is seated — never re-offered
    expect(screen.getByTestId('world-faiths-hint')).toBeTruthy();
  });

  it('choosing a recorded faith dispatches its STATE KEY with the restore flag', () => {
    const setPrimaryDeity = vi.fn();
    useStore.__set(premiumConverted({ setPrimaryDeity }));
    render(<DeityAssignmentPanel />);
    fireEvent.change(screen.getByTestId('patron-deity-select'), { target: { value: `world::${OUSTED_REF}` } });
    expect(setPrimaryDeity).toHaveBeenCalledWith(OUSTED_REF, { fromWorld: true });
  });

  it('an authored pick is untouched: the registry lane still dispatches its ref alone', () => {
    const setPrimaryDeity = vi.fn();
    useStore.__set(premiumConverted({ setPrimaryDeity }));
    render(<DeityAssignmentPanel />);
    fireEvent.change(screen.getByTestId('patron-deity-select'), { target: { value: DEITY_REF } });
    expect(setPrimaryDeity).toHaveBeenCalledWith(DEITY_REF);
    fireEvent.change(screen.getByTestId('patron-deity-select'), { target: { value: '' } });
    expect(setPrimaryDeity).toHaveBeenCalledWith(null);
  });

  it('a standalone settlement has no record, so no group and no hint appear', () => {
    useStore.__set(premiumConverted({ campaigns: [], activeSaveId: null }));
    render(<DeityAssignmentPanel />);
    expect(screen.getByTestId('patron-deity-select')).toBeTruthy();
    expect(screen.queryByTestId('world-faiths-group')).toBeNull();
    expect(screen.queryByTestId('world-faiths-hint')).toBeNull();
  });

  it('with NO authored deities the picker still opens, because the world has faiths to offer', () => {
    // Before this lane the empty library short-circuited to "no deities authored"
    // — which stranded a converted settlement with no control at all.
    useStore.__set(premiumConverted({ customContent: { deities: [] } }));
    const { container } = render(<DeityAssignmentPanel />);
    expect(screen.getByTestId('patron-deity-select')).toBeTruthy();
    expect(screen.getByTestId('world-faiths-group')).toBeTruthy();
    expect(container.textContent).not.toMatch(/No deities authored yet/);
  });
});

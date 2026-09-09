/**
 * @vitest-environment jsdom
 *
 * tests/ui/gatheredDocketSession.test.jsx — WHEN the gathered adjudication screen
 * opens (realm directive 7 / J-D7, wave F).
 *
 * The screen's CONTENT is pinned in tests/components/gatheredAdjudication.test.jsx
 * and its DURABILITY in tests/store/heldDocketDurability.test.js. This file pins
 * the third leg — the session rule in useAdvanceSession that decides when the
 * surface appears — because that rule is the whole of "re-surfaces on the NEXT
 * advance":
 *
 *   • it opens whenever the realm holds unruled matters;
 *   • dismissing closes it for THIS world clock only;
 *   • an advance moves the clock, so held matters return by themselves — the
 *     directive's re-surface, expressed as a condition rather than a scheduler;
 *   • an empty docket never opens it, which is why full auto-resolve (which
 *     empties the docket) provably cannot raise it;
 *   • the Herald pointer's onOpen re-opens it without moving the clock.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';

afterEach(cleanup);

vi.mock('../../src/lib/flags.js', () => ({
  flag: (name) => name === 'advanceMultiTick',
}));

// The hook reads four store actions; none of them runs in these tests except
// advanceCampaignWorld, which stands in for a real advance by moving the clock.
const storeState = vi.hoisted(() => ({
  advanceCampaignWorld: vi.fn(),
  resolveIntervalMajors: vi.fn(),
  undoLastPulse: vi.fn(),
  canonizeCampaignWorld: vi.fn(),
}));

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  return { useStore };
});

import { useAdvanceSession } from '../../src/hooks/useAdvanceSession.js';

const pending = (id, tick) => ({
  id, status: 'pending', tick, createdAt: `2026-01-0${tick}T00:00:00.000Z`,
  headline: `Matter ${id}`, summary: '', severity: 0.8, reasons: [],
  outcome: { id: `${id}:o`, candidateType: 'relationship_label_change' },
});

const campaignAt = (tick, proposals) => ({
  id: 'camp-1',
  worldState: { tick, canonizedAt: '2026-01-01T00:00:00.000Z', proposals },
});

function mount(campaign) {
  return renderHook(
    (props) => useAdvanceSession({
      activeCampaignId: 'camp-1',
      worldPulseInterval: 'one_month',
      openInspectorAt: vi.fn(),
      showToast: vi.fn(),
      campaign: props.campaign,
    }),
    { initialProps: { campaign } },
  );
}

beforeEach(() => {
  for (const fn of Object.values(storeState)) fn.mockReset();
});

describe('the gathered screen opens off the realm’s own docket', () => {
  test('unruled matters open it; the count is the docket’s', () => {
    const { result } = mount(campaignAt(4, [pending('a', 2), pending('b', 4)]));
    expect(result.current.gatheredDocket.open).toBe(true);
    expect(result.current.gatheredDocket.count).toBe(2);
  });

  test('an EMPTY docket never opens it (so full auto-resolve provably cannot)', () => {
    const { result } = mount(campaignAt(4, []));
    expect(result.current.gatheredDocket.open).toBe(false);
    expect(result.current.gatheredDocket.count).toBe(0);
  });

  test('a resolved-only docket never opens it', () => {
    const applied = { ...pending('a', 2), status: 'applied', adjudicatedBy: 'engine_auto' };
    const { result } = mount(campaignAt(4, [applied]));
    expect(result.current.gatheredDocket.open).toBe(false);
  });
});

describe('dismissal is for THIS clock only — the re-surface rule', () => {
  test('dismissing closes it, and the SAME world keeps it closed', () => {
    const { result, rerender } = mount(campaignAt(4, [pending('a', 2)]));
    expect(result.current.gatheredDocket.open).toBe(true);

    act(() => result.current.gatheredDocket.onClose());
    expect(result.current.gatheredDocket.open).toBe(false);

    // A re-render with the same world (a filter change, a repaint) must not nag.
    rerender({ campaign: campaignAt(4, [pending('a', 2)]) });
    expect(result.current.gatheredDocket.open).toBe(false);
    // ...and the matter is still counted, so the line above is about the SURFACE,
    // not about the docket having quietly emptied.
    expect(result.current.gatheredDocket.count).toBe(1);
  });

  test('the NEXT advance moves the clock, so the held matter RE-SURFACES', () => {
    const { result, rerender } = mount(campaignAt(4, [pending('a', 2)]));
    act(() => result.current.gatheredDocket.onClose());
    expect(result.current.gatheredDocket.open).toBe(false);

    // The advance committed: same held row, later clock, one new matter on top.
    rerender({ campaign: campaignAt(8, [pending('a', 2), pending('b', 8)]) });

    expect(result.current.gatheredDocket.open).toBe(true);
    expect(result.current.gatheredDocket.count).toBe(2);
  });

  test('an advance that rules everything leaves it closed even after the clock moves', () => {
    const { result, rerender } = mount(campaignAt(4, [pending('a', 2)]));
    act(() => result.current.gatheredDocket.onClose());
    rerender({ campaign: campaignAt(8, [{ ...pending('a', 2), status: 'applied' }]) });
    expect(result.current.gatheredDocket.open).toBe(false);
  });

  test('the Herald pointer re-opens it without moving the clock', () => {
    const { result } = mount(campaignAt(4, [pending('a', 2)]));
    act(() => result.current.gatheredDocket.onClose());
    expect(result.current.gatheredDocket.open).toBe(false);

    act(() => result.current.gatheredDocket.onOpen());
    expect(result.current.gatheredDocket.open).toBe(true);
  });
});

describe('the advance pins the clock the screen reports against', () => {
  test('a completed advance records the STARTING clock as sinceTick', async () => {
    storeState.advanceCampaignWorld.mockResolvedValue({
      ok: true, status: 'complete', proposals: [], autoApplied: [],
      worldState: { proposals: [pending('a', 6)] },
    });
    const { result } = mount(campaignAt(4, [pending('a', 2)]));
    expect(result.current.gatheredDocket.sinceTick).toBe(null);

    await act(async () => { await result.current.performAdvanceRealm(); });

    expect(storeState.advanceCampaignWorld).toHaveBeenCalledWith('camp-1', 'one_month');
    expect(result.current.gatheredDocket.sinceTick).toBe(4);
  });

  test('the advance popup stands down when the gathered screen will report instead', async () => {
    const showToast = vi.fn();
    storeState.advanceCampaignWorld.mockResolvedValue({
      ok: true, status: 'complete', proposals: [{ id: 'a' }], autoApplied: [],
      worldState: { proposals: [pending('a', 6)] },
    });
    const { result } = renderHook(() => useAdvanceSession({
      activeCampaignId: 'camp-1',
      worldPulseInterval: 'one_month',
      openInspectorAt: vi.fn(),
      showToast,
      campaign: campaignAt(4, []),
    }));

    await act(async () => { await result.current.performAdvanceRealm(); });
    // anchored: the very next test proves this same call path DOES toast when the
    // advance leaves nothing to rule, so an unfired toast here is the suppression
    // under test rather than a dead handler.
    expect(showToast).not.toHaveBeenCalled();
  });

  test('an advance that leaves NOTHING to rule still reports through the toast', async () => {
    const showToast = vi.fn();
    storeState.advanceCampaignWorld.mockResolvedValue({
      ok: true, status: 'complete', proposals: [], autoApplied: [],
      worldState: { proposals: [] },
    });
    const { result } = renderHook(() => useAdvanceSession({
      activeCampaignId: 'camp-1',
      worldPulseInterval: 'one_month',
      openInspectorAt: vi.fn(),
      showToast,
      campaign: campaignAt(4, []),
    }));

    await act(async () => { await result.current.performAdvanceRealm(); });
    expect(showToast).toHaveBeenCalledWith('success', expect.stringContaining('Realm advanced'));
  });

  test('a cloud-pending advance still warns, gathered screen or not', async () => {
    const showToast = vi.fn();
    storeState.advanceCampaignWorld.mockResolvedValue({
      ok: true, status: 'complete', cloudPending: true, proposals: [], autoApplied: [],
      worldState: { proposals: [pending('a', 6)] },
    });
    const { result } = renderHook(() => useAdvanceSession({
      activeCampaignId: 'camp-1',
      worldPulseInterval: 'one_month',
      openInspectorAt: vi.fn(),
      showToast,
      campaign: campaignAt(4, []),
    }));

    await act(async () => { await result.current.performAdvanceRealm(); });
    expect(showToast).toHaveBeenCalledWith('error', expect.stringContaining('has not finished saving'));
  });
});

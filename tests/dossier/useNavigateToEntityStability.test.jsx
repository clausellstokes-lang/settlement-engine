/**
 * @vitest-environment jsdom
 *
 * tests/dossier/useNavigateToEntityStability.test.jsx — regression lock-in for
 * the regenerate-blackout bug (React #185, max update depth).
 *
 * ROOT CAUSE: useDossierEntityNav was called with a fresh-every-render `tabs`
 * array and an unmemoized `setActiveTab` closure. The internal navigateToEntity
 * useCallback depended on both raw inputs, so it changed identity every render,
 * so the returned {index, navigateToEntity} memo returned a NEW object every
 * render. That object is the DossierEntityContext.Provider value computed above
 * the inner error boundary, so once narrative prose with EntityLinks mounted it
 * drove an unbounded re-render loop that escaped to root and blanked the app.
 *
 * FIX: stabilize the two unstable inputs — a stable joined tab-id signature +
 * a ref-backed setActiveTab wrapper — so the returned value is referentially
 * stable across renders when nothing real changed.
 *
 * These tests assert that stability directly (the loop cannot form) AND that
 * navigation behaviour is unchanged (clicking still switches tab + scrolls +
 * focuses the entity).
 */
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';

afterEach(cleanup);

// Store mock: the hook pulls only `focusEntity`. A module-level spy keeps a
// STABLE identity across renders (mirroring the real zustand selector), so any
// instability the test observes comes from the hook itself, not the mock.
const focusEntitySpy = vi.fn();
vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector({ focusEntity: focusEntitySpy }),
}));

const { useDossierEntityNav } = await import('../../src/components/dossier/useNavigateToEntity.js');

// A settlement whose index resolves a couple of known entities. The shape only
// needs enough for buildDossierEntityIndex to assign ids/anchors; we read the
// real resolved entries back out of the returned index to drive navigation.
const SETTLEMENT = Object.freeze({
  name: 'Brackenfell',
  npcs: [{ id: 'npc-aldric', name: 'Aldric the Grey' }],
  factions: [{ name: 'The Ash Compact' }],
});

beforeEach(() => {
  focusEntitySpy.mockClear();
});

describe('useDossierEntityNav referential stability', () => {
  test('value is stable across re-renders with fresh setActiveTab + tabs refs', () => {
    // Each render passes a BRAND NEW setActiveTab closure and a BRAND NEW tabs
    // array — exactly what OutputContainer does (unmemoized setter, array
    // rebuilt every render). The fix must absorb that churn.
    const makeProps = () => ({
      setActiveTab: (id, via) => { void id; void via; }, // new identity each call
      tabs: [{ id: 'overview', label: 'Overview' }, { id: 'people', label: 'People' }], // new array each call
    });

    const { result, rerender } = renderHook(
      ({ setActiveTab, tabs }) => useDossierEntityNav(SETTLEMENT, setActiveTab, tabs),
      { initialProps: makeProps() },
    );

    const first = result.current;
    rerender(makeProps());
    rerender(makeProps());
    const after = result.current;

    // The whole context value, the index, AND the navigator must be referentially
    // stable — a new {} here is what fed the #185 loop.
    expect(after).toBe(first);
    expect(after.navigateToEntity).toBe(first.navigateToEntity);
    expect(after.index).toBe(first.index);
  });

  test('value changes only when the settlement or the tab SET actually changes', () => {
    const { result, rerender } = renderHook(
      ({ settlement, tabs }) => useDossierEntityNav(settlement, () => {}, tabs),
      { initialProps: { settlement: SETTLEMENT, tabs: [{ id: 'overview' }, { id: 'people' }] } },
    );
    const base = result.current;

    // Same id set, reordered labels / new array -> still stable (signature equal).
    rerender({ settlement: SETTLEMENT, tabs: [{ id: 'overview', label: 'X' }, { id: 'people' }] });
    expect(result.current.navigateToEntity).toBe(base.navigateToEntity);

    // A real change to which tabs exist -> navigator may re-derive.
    rerender({ settlement: SETTLEMENT, tabs: [{ id: 'overview' }] });
    expect(result.current.navigateToEntity).not.toBe(base.navigateToEntity);

    // A new settlement -> index + navigator re-derive.
    const other = { ...SETTLEMENT, name: 'Other' };
    const beforeSettlementSwap = result.current;
    rerender({ settlement: other, tabs: [{ id: 'overview' }] });
    expect(result.current.index).not.toBe(beforeSettlementSwap.index);
  });

  test('navigation still switches tab, focuses the entity, and scrolls', () => {
    vi.useFakeTimers();
    const setActiveTab = vi.fn();
    const { result } = renderHook(
      () => useDossierEntityNav(SETTLEMENT, setActiveTab, [{ id: 'overview' }, { id: 'people' }]),
      {},
    );

    // Resolve a real id the index produced, plus the tab it lives on, so the
    // gating check passes and the test stays decoupled from id-scheme details.
    const npcId = 'npc-aldric';
    const entry = result.current.index.resolve(npcId);
    expect(entry).toBeTruthy();
    expect(entry.tab).toBeTruthy();

    // Stub the anchor so the belt-and-braces scroll has a target.
    const el = document.createElement('div');
    el.id = entry.anchor;
    const scrollSpy = vi.fn();
    el.scrollIntoView = scrollSpy;
    document.body.appendChild(el);

    // Make the entry tab present so navigation isn't gated out.
    const { result: r2 } = renderHook(
      () => useDossierEntityNav(SETTLEMENT, setActiveTab, [{ id: entry.tab }]),
      {},
    );
    r2.current.navigateToEntity(npcId);

    expect(setActiveTab).toHaveBeenCalledWith(entry.tab, 'entity_link');
    expect(focusEntitySpy).toHaveBeenCalledWith(npcId);

    if (entry.anchor) {
      vi.advanceTimersByTime(200);
      expect(scrollSpy).toHaveBeenCalled();
    }

    document.body.removeChild(el);
    vi.useRealTimers();
  });

  test('navigation to a gated-out tab is a no-op', () => {
    const setActiveTab = vi.fn();
    const { result } = renderHook(
      () => useDossierEntityNav(SETTLEMENT, setActiveTab, [{ id: 'overview' }]),
      {},
    );
    const entry = result.current.index.resolve('npc-aldric');
    // 'overview' is the only present tab; an npc lives elsewhere -> no-op.
    if (entry && entry.tab !== 'overview') {
      result.current.navigateToEntity('npc-aldric');
      expect(setActiveTab).not.toHaveBeenCalled();
      expect(focusEntitySpy).not.toHaveBeenCalled();
    }
  });
});

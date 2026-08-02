/**
 * @vitest-environment jsdom
 *
 * tests/ui/mapTabShell.test.jsx — TC-0, THE MAP TAB SUB-TAB SHELL
 * (DESIGN_TOWN_CARTOGRAPHY.md §12 / J-TC-8).
 *
 * tests/lib/mapSubTabs.test.js pins what the rules DECIDE; this file pins that the
 * shell OBEYS them, and the three things only a mounted shell can prove:
 *
 *   • PRESENCE — a sub-tab whose content cannot exist is absent from the strip,
 *     never present and inert (the ai_notes lesson);
 *   • the DEEP LINK resolves, and a stale one degrades to the plan rather than to
 *     an empty panel;
 *   • the preference PERSISTS — written through the real displayPrefs slice, then
 *     carried through the real partialize → JSON → rehydrate-merge hop, then
 *     honoured by a freshly-mounted shell;
 *   • WAI-ARIA tab semantics and arrow/Home/End keyboard navigation;
 *   • a presentation change reported from BELOW (the pane's silent scene
 *     fallback) moves the strip, so it can never claim a view nobody can see.
 *
 * The two map bodies are stubbed. What they render is their own business; what
 * this file is about is which one is mounted, with which presentation, and what
 * the chrome around it says.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
  createDisplayPrefsSlice,
  DEFAULT_DISPLAY_PREFS,
} from '../../src/store/displayPrefsSlice.js';
import { mergePersistedState } from '../../src/store/persistMerge.js';
import { readLastMapView } from '../../src/lib/lastMapView.js';

// ── The seams this file drives ───────────────────────────────────────────────

const h = vi.hoisted(() => ({
  // The REAL display-preference slice behind the mocked store hook, so a click in
  // the strip travels the shipped write path instead of a test double.
  prefs: null,
  capability: { available: false, reason: 'webgl2-unavailable' },
  paneProps: [],
}));

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(h.prefs.getState()); }
  useStore.getState = () => h.prefs.getState();
  return { useStore };
});

vi.mock('../../src/lib/townScene/viewPolicy.js', async (importOriginal) => ({
  ...(await importOriginal()),
  detectTownSceneCapability: () => h.capability,
}));

vi.mock('../../src/components/townMap/SettlementMapPane.jsx', () => ({
  default: (props) => {
    h.paneProps.push(props);
    return <div data-testid="map-pane" data-presentation={props.presentation} />;
  },
}));

vi.mock('../../src/components/townMap/subtabs/MapPlayerSubTab.jsx', () => ({
  default: () => <div data-testid="map-player" />,
}));

const { default: MapTabShell } = await import('../../src/components/townMap/MapTabShell.jsx');

const SETTLEMENT = { id: 'alderport', name: 'Alderport' };

function makePrefsStore() {
  return create(immer((...a) => ({ ...createDisplayPrefsSlice(...a) })));
}

function setLocation(search) {
  window.history.replaceState({}, '', `/settlements/alderport${search}`);
}

/** Mount the shell and wait for the lazy body to resolve. */
async function mountShell(props = {}) {
  const utils = render(
    <MapTabShell settlement={SETTLEMENT} audience="dm" saveId="save-1" {...props} />,
  );
  // Both bodies are lazy; awaiting one settled microtask flush lets React commit.
  await act(async () => {});
  return utils;
}

const tabNames = () => screen.getAllByRole('tab').map((el) => el.textContent);
const selectedTab = () => screen.getAllByRole('tab').find((el) => el.getAttribute('aria-selected') === 'true');

beforeEach(() => {
  h.prefs = makePrefsStore();
  h.capability = { available: false, reason: 'webgl2-unavailable' };
  h.paneProps = [];
  localStorage.clear();
  setLocation('');
});
afterEach(cleanup);

describe('TC-0 shell — PRESENCE, never a disabled tab', () => {
  test('a machine with no WebGL2 gets no 3D Portrait tab at all', async () => {
    await mountShell();
    // Non-vacuous: the strip really rendered, and its siblings really are there.
    expect(tabNames()).toEqual(['Plan', 'Panorama', 'Player View']);
    expect(screen.queryByRole('tab', { name: '3D Portrait' })).toBe(null);
  });

  test('a capable machine gains the 3D Portrait tab', async () => {
    h.capability = { available: true, reason: null };
    await mountShell();
    expect(tabNames()).toEqual(['Plan', 'Panorama', '3D Portrait', 'Player View']);
  });

  test('a player-audience dossier has no Player View tab', async () => {
    await mountShell({ audience: 'player' });
    expect(tabNames()).toEqual(['Plan', 'Panorama']);
    expect(screen.queryByRole('tab', { name: 'Player View' })).toBe(null);
  });

  test('an unsaved draft has no Player View tab', async () => {
    await mountShell({ saveId: null });
    expect(tabNames()).toEqual(['Plan', 'Panorama']);
  });
});

describe('TC-0 shell — which body is mounted', () => {
  test('a presentation sub-tab mounts the map pane, driven and switch-suppressed', async () => {
    await mountShell();
    expect(screen.getByTestId('map-pane').getAttribute('data-presentation')).toBe('plan');
    const last = h.paneProps[h.paneProps.length - 1];
    expect(last.presentation).toBe('plan');
    expect(typeof last.onPresentationChange).toBe('function');
    // The props the dossier used to thread straight to the pane still arrive.
    expect(last.settlement).toBe(SETTLEMENT);
    expect(last.saveId).toBe('save-1');
    expect(last.audience).toBe('dm');
  });

  test('the Player View sub-tab mounts its own leaf, not the pane', async () => {
    await mountShell();
    await act(async () => { fireEvent.click(screen.getByRole('tab', { name: 'Player View' })); });
    expect(screen.getByTestId('map-player')).toBeTruthy();
    expect(screen.queryByTestId('map-pane')).toBe(null);
  });

  test('switching between plan projections keeps ONE pane mounted', async () => {
    const { container } = await mountShell();
    const before = container.querySelector('[data-testid="map-pane"]');
    await act(async () => { fireEvent.click(screen.getByRole('tab', { name: 'Panorama' })); });
    const after = container.querySelector('[data-testid="map-pane"]');
    // Same DOM node ⇒ React kept the element (and therefore the pane's camera,
    // pinned card and fog session) across the projection switch.
    expect(after).toBe(before);
    expect(after.getAttribute('data-presentation')).toBe('panorama');
  });
});

describe('TC-0 shell — the deep link', () => {
  test('a link naming a present sub-tab opens on it', async () => {
    setLocation('?mapview=panorama');
    await mountShell();
    expect(selectedTab().textContent).toBe('Panorama');
    expect(screen.getByTestId('map-pane').getAttribute('data-presentation')).toBe('panorama');
  });

  test('a STALE link naming a sub-tab this machine cannot show falls back to Plan', async () => {
    // The exact field case: a link minted on a WebGL machine, opened on one
    // without. Never an empty panel, never a tab that is not on the strip.
    setLocation('?mapview=portrait3d');
    await mountShell();
    expect(screen.queryByRole('tab', { name: '3D Portrait' })).toBe(null);
    expect(selectedTab().textContent).toBe('Plan');
    expect(screen.getByTestId('map-pane').getAttribute('data-presentation')).toBe('plan');
  });

  test('a junk link falls back to Plan without disturbing the strip', async () => {
    setLocation('?mapview=illustrated');
    await mountShell();
    expect(selectedTab().textContent).toBe('Plan');
    expect(tabNames()).toEqual(['Plan', 'Panorama', 'Player View']);
  });

  test('a link beats a stored preference; a link naming NOTHING does not', async () => {
    h.prefs.getState().setMapSubTab('player');
    setLocation('?mapview=panorama');
    const first = await mountShell();
    expect(selectedTab().textContent).toBe('Panorama');
    first.unmount();

    setLocation('?other=panorama');
    await mountShell();
    expect(selectedTab().textContent).toBe('Player View');
  });
});

describe('TC-0 shell — the persisted display preference', () => {
  test('a choice is written through the real slice and survives a reload', async () => {
    await mountShell();
    expect(h.prefs.getState().displayPrefs.mapSubTab).toBe('plan');

    await act(async () => { fireEvent.click(screen.getByRole('tab', { name: 'Panorama' })); });
    expect(h.prefs.getState().displayPrefs.mapSubTab).toBe('panorama');

    // THE RELOAD HOP, through the shipped pair: partialize → JSON → rehydrate merge.
    const blob = JSON.parse(JSON.stringify({ displayPrefs: h.prefs.getState().displayPrefs }));
    const merged = mergePersistedState(blob, { displayPrefs: { ...DEFAULT_DISPLAY_PREFS } });
    expect(merged.displayPrefs.mapSubTab).toBe('panorama');
  });

  test('a rehydrated preference opens the next dossier on that sub-tab', async () => {
    const merged = mergePersistedState(
      JSON.parse(JSON.stringify({ displayPrefs: { mapSubTab: 'player' } })),
      { displayPrefs: { ...DEFAULT_DISPLAY_PREFS } },
    );
    h.prefs.getState().setMapSubTab(merged.displayPrefs.mapSubTab);
    await mountShell();
    expect(selectedTab().textContent).toBe('Player View');
    expect(screen.getByTestId('map-player')).toBeTruthy();
  });

  test('a persisted sub-tab this surface does not have opens on Plan and is not honoured blindly', async () => {
    h.prefs.getState().setMapSubTab('player');
    await mountShell({ audience: 'public', saveId: null });
    expect(selectedTab().textContent).toBe('Plan');
  });
});

describe('TC-0 shell — the living-backdrop sidecar mirror', () => {
  test('a presentation choice is recorded, preserving the lens already stored', async () => {
    localStorage.setItem('sf.lastMapView.save-1', JSON.stringify({ view: 'plan', lens: 'ink' }));
    await mountShell();
    await act(async () => { fireEvent.click(screen.getByRole('tab', { name: 'Panorama' })); });
    expect(readLastMapView('save-1')).toEqual({ view: 'panorama', lens: 'ink' });
  });

  test('the Player View choice records NOTHING rather than silently recording the plan', async () => {
    localStorage.setItem('sf.lastMapView.save-1', JSON.stringify({ view: 'panorama', lens: 'ink' }));
    await mountShell();
    await act(async () => { fireEvent.click(screen.getByRole('tab', { name: 'Player View' })); });
    // Untouched: `player` is not in the sidecar's vocabulary, and a blind write
    // would have coerced it to 'plan' and washed the wrong composition.
    expect(readLastMapView('save-1')).toEqual({ view: 'panorama', lens: 'ink' });
  });
});

describe('TC-0 shell — accessibility', () => {
  test('the strip is a named tablist whose tabs point at the mounted panel', async () => {
    await mountShell();
    const list = screen.getByRole('tablist', { name: 'Map views' });
    expect(list).toBeTruthy();
    const panel = screen.getByRole('tabpanel');
    const active = selectedTab();
    expect(active.getAttribute('aria-controls')).toBe(panel.getAttribute('id'));
    expect(panel.getAttribute('aria-labelledby')).toBe(active.getAttribute('id'));
    // Roving tabIndex: exactly one tab is in the tab order.
    expect(screen.getAllByRole('tab').filter((el) => el.getAttribute('tabindex') === '0')).toHaveLength(1);
  });

  test('arrows, Home and End move the selection', async () => {
    await mountShell();
    const list = screen.getByRole('tablist', { name: 'Map views' });
    await act(async () => { fireEvent.keyDown(list, { key: 'ArrowRight' }); });
    expect(selectedTab().textContent).toBe('Panorama');
    await act(async () => { fireEvent.keyDown(list, { key: 'End' }); });
    expect(selectedTab().textContent).toBe('Player View');
    await act(async () => { fireEvent.keyDown(list, { key: 'Home' }); });
    expect(selectedTab().textContent).toBe('Plan');
    await act(async () => { fireEvent.keyDown(list, { key: 'ArrowLeft' }); });
    expect(selectedTab().textContent).toBe('Player View');
  });

  test('the panel is a focus stop so a keyboard reader can enter and scroll it', async () => {
    await mountShell();
    expect(screen.getByRole('tabpanel').getAttribute('tabindex')).toBe('0');
  });
});

describe('TC-0 shell — the strip follows the pane down', () => {
  test('a scene fallback reported from below moves the selection back to Plan', async () => {
    h.capability = { available: true, reason: null };
    setLocation('?mapview=portrait3d');
    await mountShell();
    expect(selectedTab().textContent).toBe('3D Portrait');

    // What useTownMapPresentation's fallbackToPlan does when WebGL or the scene
    // chunk fails. Without this notifier the strip would keep claiming a Portrait
    // the pane had already abandoned.
    const last = h.paneProps[h.paneProps.length - 1];
    await act(async () => { last.onPresentationChange('plan'); });
    expect(selectedTab().textContent).toBe('Plan');
    expect(screen.getByTestId('map-pane').getAttribute('data-presentation')).toBe('plan');
  });
});

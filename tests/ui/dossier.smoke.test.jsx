/**
 * @vitest-environment jsdom
 *
 * tests/ui/dossier.smoke.test.jsx — Decomposition lock-in.
 *
 * OutputContainer.jsx (the dossier) was decomposed: cohesive chunks of its
 * render — the AI narrative button cluster, the dark header bar, the
 * narrative thesis/lens banner, and the two tab strips — moved into
 * presentational siblings under src/components/dossier/* (DossierNarrative-
 * Buttons, DossierHeaderRow, DossierNarrativeBanner, DossierTabStrip,
 * DossierGroupTabStrip). This is a behavior-preserving move, so the
 * regression net is simply: the module still evaluates and its default
 * export is the dossier component, wiring the extracted imports together.
 * If a relative-path/import got broken in the split, the import below
 * throws and this test fails.
 *
 * We mock the store (the dossier reads ~30 selectors via useStore),
 * supabase (the module reads isConfigured at eval), and analytics
 * (fire-and-forget) so the import path stays quiet and doesn't pull
 * network/Supabase wiring into the test. We assert on the module surface
 * (default export is a function) rather than rendering, since a full render
 * needs a populated settlement and resolves a pile of lazy tab chunks.
 */

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { describe, test, expect, vi } from 'vitest';

// Supabase singleton — isConfigured is read at module-eval; stub it false so
// the dossier takes the local-dev (ungated) narrative path and no client is
// created during the import.
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: false,
  supabase: {},
}));

// Analytics is fire-and-forget; stub it so nothing tries to phone home.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Feature flags — default off keeps the legacy chrome path.
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(() => false),
}));

// Store mock. A mutable singleton drives every selector; subscribe and
// getState are stubbed for the analytics/effect paths.
const storeState = {
  settlement: null,
  aiSettlement: null,
  setAiSettlement: vi.fn(),
  clearAiSettlement: vi.fn(),
  regenSection: vi.fn(),
  requestNarrative: vi.fn(),
  getCost: vi.fn(() => 0),
  creditBalance: 0,
  aiLoading: false,
  aiRegenerating: false,
  aiError: null,
  aiProgress: '',
  aiPartialFailure: null,
  aiViolations: null,
  clearAiViolations: vi.fn(),
  lastRegenerationDelta: null,
  clearLastRegenerationDelta: vi.fn(),
  showNarrative: false,
  setShowNarrative: vi.fn(),
  savedSettlements: [],
  pinNpc: vi.fn(),
  unpinNpc: vi.fn(),
  queueEdit: vi.fn(),
  userPrefs: { tableViewOpen: false },
  setUserPref: vi.fn(),
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

describe('OutputContainer (dossier) — decomposition smoke', () => {
  test('module imports and the default export is a component function', async () => {
    const mod = await import('../../src/components/OutputContainer.jsx');
    expect(typeof mod.default).toBe('function');
  });

  // Phase 5 W4e — the dossier-depth tabs register into the Systems group,
  // and the OURS-ahead mounted Versions tab is NOT displaced from Notes.
  // §805 moved War & Faith OUT of Systems into two WORLD-group tabs; the old
  // combined id must never resurface in any group.
  test('Systems keeps Substrate / Magic; World registers the split War and Faith tabs', async () => {
    const mod = await import('../../src/components/OutputContainer.jsx');
    expect(mod.TAB_GROUPS.systems.tabs).toEqual(
      expect.arrayContaining(['substrate', 'magic']),
    );
    expect(mod.TAB_GROUPS.world.tabs).toEqual(
      expect.arrayContaining(['war', 'faith']),
    );
    // anchored: the arrayContaining assertions above prove both groups resolve
    // with live tab populations, so this absence cannot pass vacuously.
    expect(Object.values(mod.TAB_GROUPS).flatMap((g) => g.tabs)).not.toContain('war_faith'); // anchored: the arrayContaining assertions above pin both groups' live populations, so this absence cannot pass vacuously.
  });

  test('the mounted Versions tab (F26) stays registered under Notes', async () => {
    const mod = await import('../../src/components/OutputContainer.jsx');
    expect(mod.TAB_GROUPS.notes.tabs).toContain('versions');
  });

  // W2-c made the Map group a first-class fifth tab; TE-STRIP-1 (owner ruling, ODQ §725)
  // REMOVED it with the rest of the legacy settlement map. The dossier reads Summary /
  // Systems / World / Notes, and the pin is INVERTED rather than deleted: the group order
  // is still asserted (Object insertion order), and the absence of a `map` group is now
  // asserted BY NAME so a re-introduction reds here instead of arriving silently.
  test('the tab groups run Summary / Systems / World / Notes, with no Map group', async () => {
    const mod = await import('../../src/components/OutputContainer.jsx');
    expect(Object.keys(mod.TAB_GROUPS)).toEqual(['summary', 'systems', 'world', 'notes']);
    // The exact-equality assertion on the line above pins the WHOLE key set, so a TAB_GROUPS
    // that drifted away or emptied reds there before this absence is ever reached.
    // anchored: the preceding toEqual pins the complete key set, so an empty or drifted TAB_GROUPS reds first.
    expect(mod.TAB_GROUPS).not.toHaveProperty('map');
    // …and no surviving group smuggles the map tab back in under another heading. Anchored on
    // a sibling tab that travels the same registry path, so an empty flatMap cannot pass it.
    expectAbsentWithAnchor(
      Object.values(mod.TAB_GROUPS).flatMap((g) => g.tabs), 'map', 'versions', 'dossier tab registry',
    );
  });
});

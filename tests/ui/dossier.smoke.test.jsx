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
import { afterEach, describe, test, expect, vi } from 'vitest';
import { cleanup, render, fireEvent, waitFor, within } from '@testing-library/react';

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
  // Read once the dossier RENDERS (the search tests below mount it whole).
  auth: { tier: 'free', modelPreference: null },
  isElevated: () => false,
  isSettlementClockBound: () => false,
  setActivePricingMoment: vi.fn(),
  focusEntity: vi.fn(),
  focusedEntity: null,
  phase: 'draft',
  creditLedger: [],
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
  // X-12 (2026-10-30, ODQ §934.101): Substrate (labelled Foundations) moved to the Summary
  // group as its second tab; X-5 and X-6 removed `summary` and `neighbours`.
  test('Summary leads with Overview and Foundations; Systems keeps Magic; World registers the split War and Faith tabs', async () => {
    const mod = await import('../../src/components/OutputContainer.jsx');
    expect(mod.TAB_GROUPS.summary.tabs).toEqual(['overview', 'substrate', 'plot_hooks', 'dm_compass']);
    expect(mod.TAB_GROUPS.systems.tabs).toEqual(
      expect.arrayContaining(['magic']),
    );
    const all = Object.values(mod.TAB_GROUPS).flatMap((g) => g.tabs);
    for (const gone of ['summary', 'neighbours']) expect(all).not.toContain(gone); // anchored: the exact summary list above pins a live group population
    expect(mod.TAB_GROUPS.systems.tabs).not.toContain('substrate'); // anchored: the arrayContaining above pins the Systems group's live population
    expect(mod.TAB_GROUPS.world.tabs).toEqual(
      expect.arrayContaining(['war', 'faith']),
    );
    // anchored: the arrayContaining assertions above prove both groups resolve
    // with live tab populations, so this absence cannot pass vacuously.
    expect(Object.values(mod.TAB_GROUPS).flatMap((g) => g.tabs)).not.toContain('war_faith'); // anchored: the arrayContaining assertions above pin both groups' live populations, so this absence cannot pass vacuously.
  });

  // X-17 (wave 2, BUILD-W2-BLOCKLAW U1): within a group the tabs run from the broadest reading to
  // the narrowest. The ids are unchanged; only the declared order moves, and it is pinned whole.
  test('each group runs general to specific, the epistemic run kept at the World tail', async () => {
    const mod = await import('../../src/components/OutputContainer.jsx');
    expect(mod.TAB_GROUPS.summary.tabs).toEqual(['overview', 'substrate', 'plot_hooks', 'dm_compass']);
    expect(mod.TAB_GROUPS.systems.tabs).toEqual(
      ['services', 'institutions', 'economics', 'resources', 'power', 'defense', 'magic', 'viability'],
    );
    expect(mod.TAB_GROUPS.world.tabs).toEqual(
      ['npcs', 'relationships', 'daily_life', 'traditions', 'history', 'rumors', 'war', 'faith'],
    );
    expect(mod.TAB_GROUPS.notes.tabs).toEqual(['dm_notes', 'ai_notes', 'chronicle', 'versions']);
  });

  // X-25c: the dossier search breaks its group ties in the strip's own order; one order, not two.
  test('the search tie order is the strip order (SEARCH_TAB_ORDER is a subsequence of TAB_GROUPS)', async () => {
    const mod = await import('../../src/components/OutputContainer.jsx');
    const { SEARCH_TAB_ORDER } = await import('../../src/domain/dossier/dossierSearch.js');
    const strip = Object.values(mod.TAB_GROUPS).flatMap((g) => g.tabs);
    const at = SEARCH_TAB_ORDER.map((tab) => strip.indexOf(tab));
    expect(SEARCH_TAB_ORDER.length).toBeGreaterThan(0);
    expect(at.every((i) => i >= 0)).toBe(true);
    expect(at).toEqual([...at].sort((a, b) => a - b));
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

/**
 * THE DOSSIER SEARCH, mounted (RULINGS-CROSS X-19b; BUILD-W2-SEARCH U4). The bar sits above the
 * group strip; a query swaps the tab body for the results, one section per owning tab, each
 * object drawn by its own tab component; Escape clears and the reader is back on the tab they
 * were reading; Enter opens the best result's tab; a player view never renders a secret.
 */
describe('the dossier search bar: mount, results in the body, keyboard path, audience', () => {
  afterEach(cleanup);
  const SECRET = 'She buried the tithe ledger under the mill race.';
  function searchTown() {
    return {
      id: 's-search', name: 'Ashford', tier: 'town', population: 900,
      npcs: [
        { id: 'npc_1', name: 'Mara Voss', role: 'Reeve', influence: 'high', secret: SECRET,
          plotHooks: ['Mara Voss needs the ledger found before the audit.'] },
        { id: 'npc_2', name: 'Odo Penn', role: 'Clerk', influence: 'low' },
      ],
      relationships: [
        { type: 'rival', typeName: 'Rivals', npc1Name: 'Mara Voss', npc2Name: 'Odo Penn', npc1Role: 'Reeve', npc2Role: 'Clerk', strength: 'strong', description: 'An old quarrel.' },
      ],
      institutions: [],
    };
  }
  const activeTabId = (container) =>
    (container.querySelector('[id^="sf-tab-"][aria-selected="true"]')?.getAttribute('id') || '').replace(/^sf-tab-/, '');

  test('a query swaps the body for results grouped by owning tab; Escape returns to the tab the reader was on', async () => {
    const { default: OutputContainer } = await import('../../src/components/OutputContainer.jsx');
    const town = searchTown();
    const { container, findByRole, queryByRole } = render(<OutputContainer settlement={town} readOnly saveId="save-1" />);
    const field = await findByRole('searchbox', { name: 'Search this dossier' }, { timeout: 15000 });
    // The bar renders ABOVE the group strip.
    const groupStrip = container.querySelector('[role="tablist"][aria-label="Dossier sections"]');
    expect(field.compareDocumentPosition(groupStrip) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    // The reader is on Plot Hooks when they start typing.
    fireEvent.click(container.querySelector('#sf-tab-plot_hooks'));
    expect(activeTabId(container)).toBe('plot_hooks');

    fireEvent.change(field, { target: { value: 'Mara Voss' } });
    const results = await findByRole('region', { name: 'Search results for Mara Voss' }, { timeout: 15000 });
    const groups = [...results.querySelectorAll('[data-testid^="search-group-"]')].map((g) => g.dataset.testid);
    // The three groups tie (each names her exactly) and run in the strip's own order (X-25c).
    expect(groups).toEqual(['search-group-plot_hooks', 'search-group-npcs', 'search-group-relationships']);
    // Each group is headed by its tab's name, and each object is its tab's own component: the
    // person's card, the tie card, the hook card.
    const people = within(results.querySelector('[data-testid="search-group-npcs"]'));
    expect(people.getByRole('button', { name: 'NPCs' })).toBeTruthy();
    expect(people.getByText('Mara Voss')).toBeTruthy();
    expect(within(results).getByRole('button', { name: 'Toggle relationship between Mara Voss and Odo Penn' })).toBeTruthy();
    // The hook card's text is whole, and her name inside it is a door to her card (X-20).
    const hooks = within(results.querySelector('[data-testid="search-group-plot_hooks"]'));
    expect(hooks.getByText((_, el) => el?.tagName === 'DIV' && el.textContent === 'Mara Voss needs the ledger found before the audit.')).toBeTruthy();
    expect(hooks.getAllByRole('button', { name: 'Go to Mara Voss' }).length).toBeGreaterThan(0);
    expect(field.getAttribute('aria-controls')).toBe(results.id);

    // Escape clears the query; the results leave and the tab the reader was on is still open.
    fireEvent.keyDown(field, { key: 'Escape' });
    await waitFor(() => expect(queryByRole('region', { name: /Search results/ })).toBeNull());
    expect(field.value).toBe('');
    expect(activeTabId(container)).toBe('plot_hooks');
    expect(container.querySelector('#sf-panel-plot_hooks')).toBeTruthy();
  });

  test('Enter opens the best result\'s owning tab and ends the search; a group header opens its tab', async () => {
    const { default: OutputContainer } = await import('../../src/components/OutputContainer.jsx');
    const { container, findByRole } = render(<OutputContainer settlement={searchTown()} readOnly saveId="save-1" />);
    const field = await findByRole('searchbox', { name: 'Search this dossier' }, { timeout: 15000 });
    expect(activeTabId(container)).toBe('overview');

    fireEvent.change(field, { target: { value: 'Odo Penn' } });
    await findByRole('region', { name: 'Search results for Odo Penn' }, { timeout: 15000 });
    fireEvent.keyDown(field, { key: 'Enter' });
    await waitFor(() => expect(activeTabId(container)).toBe('npcs'));
    expect(field.value).toBe('');

    fireEvent.change(field, { target: { value: 'quarrel' } });
    const results = await findByRole('region', { name: 'Search results for quarrel' }, { timeout: 15000 });
    fireEvent.click(within(results).getByRole('button', { name: 'Relationships' }));
    await waitFor(() => expect(activeTabId(container)).toBe('relationships'));
    expect(field.value).toBe('');
  });

  test('a player view never renders a secret, never lists a hook, and cannot be searched by a secret', async () => {
    const { default: OutputContainer } = await import('../../src/components/OutputContainer.jsx');
    const { container, findByRole } = render(<OutputContainer settlement={searchTown()} readOnly playerView />);
    const field = await findByRole('searchbox', { name: 'Search this dossier' }, { timeout: 15000 });

    fireEvent.change(field, { target: { value: 'Mara Voss' } });
    const results = await findByRole('region', { name: 'Search results for Mara Voss' }, { timeout: 15000 });
    const card = results.querySelector('[data-search-object="npc"]');
    fireEvent.click(within(card).getAllByRole('button')[0]); // open the person's card
    expect(card.textContent).toMatch(/Reeve/);
    // anchored: the line above proves the opened card's live text is read, so the absent secret cannot be vacuous
    expect(container.textContent).not.toMatch(/tithe ledger/);
    expect(results.querySelector('[data-testid="search-group-npcs"]')).toBeTruthy();
    expect(results.querySelector('[data-testid="search-group-plot_hooks"]')).toBeNull();

    fireEvent.change(field, { target: { value: 'tithe ledger' } });
    const none = await findByRole('region', { name: 'Search results for tithe ledger' }, { timeout: 15000 });
    expect(none.textContent).toBe('Nothing in this dossier matches "tithe ledger".');
  });
});

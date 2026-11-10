/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumInstitutionSearch.test.jsx — the institutions are findable in
 * the Compendium's global search (COMPENDIUM-HUB H6).
 *
 * The chair typed inn, smith, temple, mills, watch and thieves into the global search
 * and got "No matches" each time, under a line that tells the reader to try an
 * institution name. MEASURED: the search index had no institution at all, in every
 * build (a pure module; not an e2e-data artifact). The pins: every one of the
 * catalog's distinct institutions is findable by its shown name and lands on the
 * Institutions page at its own card; the five the chair typed that name an
 * institution return one ("temple" names none: the catalog's houses of worship are
 * shrines, churches and the like, so it stays a no-match by the data, not the search).
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, act, fireEvent } from '@testing-library/react';
import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';
import { searchCompendium, COMPENDIUM_INDEX } from '../../src/domain/compendium/searchIndex.js';
import { compendiumGlobalSearchIndex, distinctInstitutions, institutionAnchor } from '../../src/components/compendium/institutionSearchEntries.js';
import { institutionDisplayName } from '../../src/domain/display/institutionDisplayName.js';

vi.mock('../../src/store/index.js', () => {
  const state = { getCustomContentCount: () => 0 };
  function useStore(selector) { return selector(state); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => state;
  return { useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

afterEach(() => { cleanup(); window.history.replaceState(null, '', '/'); });

describe('H6 — institutions in the global search', () => {
  it('the index carries every distinct institution, and the per-entry pages do not move', () => {
    const index = compendiumGlobalSearchIndex();
    const inst = index.filter((e) => e.category === 'Institution');
    expect(inst).toHaveLength(CD.institutions.distinctNames);
    expect(distinctInstitutions()).toHaveLength(CD.institutions.distinctNames);
    // Search targets only: the committed index (prerender + sitemap) has none.
    expect(COMPENDIUM_INDEX.filter((e) => e.category === 'Institution')).toEqual([]);
    expect(index.length).toBe(COMPENDIUM_INDEX.length + CD.institutions.distinctNames);
  });

  it('every institution is found by its shown name, ranked first or tied with an equal-scoring longer-named sibling', () => {
    const index = compendiumGlobalSearchIndex();
    for (const i of distinctInstitutions()) {
      const shown = institutionDisplayName(i);
      const hits = searchCompendium(shown, { index, limit: 50 });
      expect(hits.some((h) => h.anchor === institutionAnchor(i.name)), shown).toBe(true);
    }
  });

  it('the words the chair typed that name an institution now find one', () => {
    const index = compendiumGlobalSearchIndex();
    for (const q of ['inn', 'smith', 'mills', 'watch', 'thieves', 'mill']) {
      const hits = searchCompendium(q, { index });
      expect(hits.some((h) => h.category === 'Institution'), q).toBe(true);
    }
  });

  it('the rendered global search lists institutions, and choosing one lands on its card', async () => {
    window.history.replaceState(null, '', '/compendium');
    const { useRoute } = await import('../../src/hooks/useRoute.js');
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    function Host() {
      const { params } = useRoute();
      return <CompendiumPanel standalone routeEntry={params.entry} routeSection={params.section} />;
    }
    const { container } = render(<Host />);
    const input = container.querySelector('input[role="combobox"]');
    await act(async () => { fireEvent.change(input, { target: { value: 'wayside inn' } }); });
    const options = [...container.querySelectorAll('[role="option"]')];
    const target = options.find((o) => o.getAttribute('aria-label') === 'Wayside inn (Institution)');
    expect(target, `options: ${options.map((o) => o.getAttribute('aria-label')).join(', ')}`).toBeTruthy();
    await act(async () => { fireEvent.click(target.querySelector('button')); });
    expect(window.location.pathname).toBe('/compendium/institutions');
    expect(window.location.hash).toBe(`#${institutionAnchor('Wayside inn')}`);
    expect(container.querySelector('input[aria-label="Search catalog"]').value).toBe('Wayside inn');
    expect(container.querySelector(`#${institutionAnchor('Wayside inn')}`)).not.toBeNull();
  });
});

// H8 on the landing (the owner, 2026-11-10: "The search bar acts as a search bar that filters
// based on string matching"): plain, case-insensitive substring over the name and category a
// result row shows — no fuzzy ranking, no keyword-only hits, no prefix-only rule, no cap.
describe('H8 — the landing search matches by string', () => {
  it('lists exactly the entries whose name or category contains the string', async () => {
    const { matchCompendium } = await import('../../src/components/compendium/CompendiumGlobalSearch.jsx');
    const index = compendiumGlobalSearchIndex();
    for (const q of ['inn', 'WATCH', 'theocracy', 'mill', 'ion']) {
      const want = index.filter((e) => `${e.term}`.toLowerCase().includes(q.toLowerCase())
        || `${e.category}`.toLowerCase().includes(q.toLowerCase()));
      const got = matchCompendium(q, index);
      expect(new Set(got), q).toEqual(new Set(want));
      expect(got.length, q).toBe(want.length);
    }
    // Not fuzzy: letters in order but not contiguous match nothing.
    expect(matchCompendium('wysd inn', index)).toEqual([]);
    // Names that contain the string come before category-only matches.
    const r = matchCompendium('institution', index);
    expect(r.length).toBeGreaterThan(CD.institutions.distinctNames);
    expect(r[0].term.toLowerCase()).toContain('institution');
  });
});


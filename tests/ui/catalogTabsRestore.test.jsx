/** @vitest-environment jsdom */
/**
 * tests/ui/catalogTabsRestore.test.jsx — RESTORATION #11 pins.
 *
 * The composite dropped two honest-affordance guards from the compendium
 * catalog tabs; these pin them back:
 *   1. PowerTab_ dead-first-click guard — a routed global-search jump reveals
 *      its target even when a stale category filter is active (search forces
 *      the effective category to 'All'), so the first click is never dead (P8).
 *   2. InstitutionsTab distinguishes a catalog LOAD FAILURE (role=alert + a
 *      reload affordance) from a zero-result SEARCH (the honest "no matches"
 *      copy), so the reader is never told to clear a search that isn't the
 *      problem (P10).
 */
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';

// Configurable lookups mock so the InstitutionsTab tests can drive the catalog
// load down both the success and the throw path.
const lookupMocks = vi.hoisted(() => ({
  getFullCatalogWithTierMeta: vi.fn(),
  getInstitutionalCatalog: vi.fn(),
}));
vi.mock('../../src/generators/lookups.js', () => lookupMocks);

afterEach(cleanup);

describe('PowerTab_ — dead-first-click guard (RESTORATION #11)', () => {
  test('a routed search reveals a match from another category despite an active filter', async () => {
    const { PowerTab_ } = await import('../../src/components/compendium/CatalogTabs.jsx');
    const entries = CD.archetypes.entries;
    const a = entries[0];
    const b = entries.find((e) => e.cat !== a.cat && e.name !== a.name);
    expect(b, 'need two archetypes in different categories').toBeTruthy();

    const { rerender } = render(<PowerTab_ search="" />);
    // Narrow to a's category — b (a different category) is now hidden.
    fireEvent.click(screen.getByRole('button', { name: a.cat }));
    expect(screen.queryByText(b.name)).toBeNull();

    // A routed search for b: the guard forces the effective category to 'All',
    // so b surfaces instead of landing on an empty grid.
    rerender(<PowerTab_ search={b.name.toLowerCase()} />);
    expect(screen.getByText(b.name)).toBeTruthy();
  });
});

describe('InstitutionsTab — load failure vs empty search (RESTORATION #11)', () => {
  beforeEach(() => {
    lookupMocks.getFullCatalogWithTierMeta.mockReset();
    lookupMocks.getInstitutionalCatalog.mockReset();
  });

  test('a catalog LOAD FAILURE shows a role=alert with a reload affordance', async () => {
    lookupMocks.getFullCatalogWithTierMeta.mockImplementation(() => { throw new Error('boom'); });
    lookupMocks.getInstitutionalCatalog.mockImplementation(() => { throw new Error('boom'); });
    const { InstitutionsTab } = await import('../../src/components/compendium/CatalogTabs.jsx');

    render(<InstitutionsTab search="" />);
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText(/could not load/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /reload/i })).toBeTruthy();
  });

  test('a zero-result SEARCH shows the honest no-match copy, not a load error', async () => {
    lookupMocks.getFullCatalogWithTierMeta.mockReturnValue({ Economy: { 'Merchant Guilds': { desc: 'trade' } } });
    const { InstitutionsTab } = await import('../../src/components/compendium/CatalogTabs.jsx');

    render(<InstitutionsTab search="zzzznomatchxyz" />);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText(/No institutions match your search/i)).toBeTruthy();
  });
});

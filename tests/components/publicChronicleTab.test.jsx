/** @vitest-environment jsdom */
/**
 * tests/components/publicChronicleTab.test.jsx — the Chronicle on public
 * gallery dossiers (migration 032).
 *
 * The Chronicle tab used to be blanket-hidden from the player view — and even
 * un-hidden it would have rendered permanently empty, because a public dossier
 * has no saved campaignState to read the eventLog from. The gallery RPC now
 * ships an allowlist-projected `chronicle` column, threaded
 * PublicDossierView → OutputContainer as `publicChronicle`. These tests pin:
 *   - the public player view shows the Chronicle (fed by publicChronicle)
 *     while DM Summary / DM Notes / AI Notes stay hidden;
 *   - the owner path is untouched: collectChronicle consults publicChronicle
 *     ONLY when there is no save entry at all.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  storeState: {
    settlement: null,
    savedSettlements: [],
    userPrefs: {},
  },
}));

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.storeState);
  useStore.getState = () => mocks.storeState;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runAiLayer: vi.fn() }));
// The default landing tab — not under test; stub so the suite doesn't depend
// on OverviewTab's data needs.
vi.mock('../../src/components/new/tabs/OverviewTab', () => ({
  default: () => <div data-testid="overview-stub" />,
}));

import PublicDossierView from '../../src/components/PublicDossierView.jsx';
import { collectChronicle } from '../../src/components/OutputContainer.jsx';

// What gallery.js sanitizeChronicle hands the view: allowlisted entries only.
const publicChronicle = [
  {
    appliedAt: '2026-02-03T00:00:00Z',
    narrativeSummary: 'A tremor damaged the granary.',
    event: { id: 'evt-1', type: 'natural_disaster', cause: 'world_event' },
  },
  {
    appliedAt: '2026-02-10T00:00:00Z',
    narrativeSummary: 'The party cleared the flooded mine.',
    event: { id: 'evt-2', type: 'mine_cleared', cause: 'party_action', partyCaused: true },
  },
];

const dossier = () => ({
  name: 'Bramblefen',
  tier: 'town',
  publishedAt: '2026-01-01T00:00:00Z',
  viewCount: 3,
  shareDm: false, // → playerView
  settlement: { name: 'Bramblefen', tier: 'town', population: 1200 },
  chronicle: publicChronicle,
});

afterEach(cleanup);

describe('public gallery dossier — Chronicle tab', () => {
  test('player view surfaces the Chronicle with the projected entries', async () => {
    render(<PublicDossierView dossier={dossier()} showHeader={false} />);

    // The Notes group exists for the public viewer (its only sub-tab is the
    // Chronicle), while the owner-private tabs stay hidden.
    fireEvent.click(await screen.findByText('Notes'));

    // Entering the group auto-selects its first visible sub-tab → Chronicle.
    expect(await screen.findByText('A tremor damaged the granary.')).toBeTruthy();
    expect(screen.getByText('The party cleared the flooded mine.')).toBeTruthy();
    // Titles derive from the allowlisted event.type.
    expect(screen.getByText('natural disaster')).toBeTruthy();
    // Party attribution survives the projection.
    expect(screen.getByTitle('Caused by the party')).toBeTruthy();

    // Owner-private surfaces stay off the public page.
    expect(screen.queryByText('DM Notes')).toBeNull();
    expect(screen.queryByText('AI Instructions')).toBeNull(); // the ai_notes tab (renamed from 'Narrative Notes')
    expect(screen.queryByText('Campaign Context')).toBeNull();
    expect(screen.queryByText('DM Summary')).toBeNull();
  });

  test('an empty chronicle renders the tab with its empty state (no crash)', async () => {
    render(<PublicDossierView dossier={{ ...dossier(), chronicle: [] }} showHeader={false} />);
    fireEvent.click(await screen.findByText('Notes'));
    expect(await screen.findByText(/No chronicle yet/)).toBeTruthy();
  });
});

describe('collectChronicle — owner path unchanged, public path fed', () => {
  const settlement = { recentEvents: [] };
  const ownerEntry = {
    appliedAt: '2026-01-05T00:00:00Z',
    narrativeSummary: 'Owner-authored festival.',
    event: { id: 'own-1', type: 'festival', cause: 'authoring' },
  };

  test('a save entry makes publicChronicle inert — owner feed is identical', () => {
    const withLog = { campaignState: { startedAt: '2026-01-01T00:00:00Z', eventLog: [ownerEntry] } };
    const intruder = [{ narrativeSummary: 'SHOULD NOT APPEAR', event: { id: 'x', type: 'intruder' } }];
    expect(collectChronicle(withLog, settlement, intruder)).toEqual(collectChronicle(withLog, settlement));

    // Even a save entry WITHOUT an eventLog never falls through to the prop.
    const withoutLog = { campaignState: { startedAt: '2026-01-01T00:00:00Z' } };
    expect(collectChronicle(withoutLog, settlement, intruder)).toEqual(collectChronicle(withoutLog, settlement));
  });

  test('a public dossier (no save entry) reads the projected chronicle as manual events', () => {
    const feed = collectChronicle(null, settlement, publicChronicle);
    expect(feed).toHaveLength(2);
    // Newest first; normalized by the shared chronicleFeed helper.
    expect(feed[0]).toMatchObject({
      id: 'evt-2', title: 'mine_cleared', summary: 'The party cleared the flooded mine.',
      partyCaused: true, source: 'party',
    });
    expect(feed[1]).toMatchObject({
      id: 'evt-1', title: 'natural_disaster', summary: 'A tremor damaged the granary.',
      source: 'manual',
    });
  });

  test('no save entry and no public chronicle stays an empty feed', () => {
    expect(collectChronicle(null, settlement)).toEqual([]);
  });
});

describe('campaign-context confirm copy (sibling rename pin)', () => {
  test('the pre-narration confirm speaks Campaign Context, not AI guidance', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    // import.meta.url is not a file: URL under jsdom; vitest runs from the repo root.
    const src = readFileSync(join(process.cwd(), 'src', 'components', 'OutputContainer.jsx'), 'utf8');
    // Syntax-agnostic: the ConfirmDialog title prop is now JSX (title="…") after
    // the createElement→JSX conversion (A+ components-core.2); match either form.
    expect(src).toMatch(/title[:=]\s*['"]Send campaign context\?['"]/);
    expect(src).toMatch(/woven into the narration as established lore\. Settlement facts still take precedence\. DM Notes stay private and are not included\./);
    expect(src).not.toMatch(/Send AI guidance\?/);
  });
});

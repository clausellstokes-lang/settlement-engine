/**
 * tests/lib/galleryChronicle.test.js — the public gallery event chronicle.
 *
 * Migration 032 ships the chronicle as a SEPARATE allowlist-projected RPC
 * column (the data sanitizers strip /chronicle/i keys, and their denylists
 * only grow). These tests pin the client half of that contract end-to-end:
 * fetchPublicDossier must surface row.chronicle WITHOUT routing it through
 * toPublicSafe, while re-applying the server's per-entry allowlist so a
 * drifted or malicious row can never smuggle extra keys to the viewer.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(() => Promise.resolve({ data: [], error: null })),
  },
  isConfigured: true,
}));

import { supabase } from '../../src/lib/supabase.js';
import { fetchPublicDossier } from '../../src/lib/gallery.js';

afterEach(() => vi.clearAllMocks());

/** Queue the four RPC responses fetchPublicDossier makes for one dossier row. */
function queueDossierRow(row) {
  supabase.rpc
    .mockResolvedValueOnce({ data: [row], error: null })            // get_gallery_dossier
    .mockResolvedValueOnce({ data: null, error: null })             // bump_public_view
    .mockResolvedValueOnce({ data: [{ net_votes: 0, voted: false }], error: null }) // vote state
    .mockResolvedValueOnce({ data: [], error: null });              // more by creator
}

const baseRow = () => ({
  id: '1', public_slug: 's1', name: 'Bramblefen', tier: 'town',
  data: { name: 'Bramblefen', population: 1200 },
  published_at: '2026-01-01', view_count: 3,
});

describe('fetchPublicDossier — chronicle column (migration 032)', () => {
  it('surfaces well-formed chronicle entries un-stripped (separate column, not toPublicSafe)', async () => {
    queueDossierRow({
      ...baseRow(),
      // The settlement data ALSO carries a chronicle key — the toPublicSafe
      // denylist must keep stripping that one while the column survives.
      data: { name: 'Bramblefen', chronicle: ['leak-if-present'] },
      chronicle: [
        {
          appliedAt: '2026-02-03T00:00:00Z',
          narrativeSummary: 'A tremor damaged the granary.',
          event: { id: 'evt-1', type: 'natural_disaster', cause: 'world_event' },
        },
        {
          appliedAt: '2026-02-10T00:00:00Z',
          narrativeSummary: 'The party cleared the flooded mine.',
          partyCaused: true,
          event: { id: 'evt-2', type: 'mine_cleared', cause: 'party_action', partyCaused: true },
        },
      ],
    });
    const dossier = await fetchPublicDossier('s1');
    expect(dossier.chronicle).toEqual([
      {
        appliedAt: '2026-02-03T00:00:00Z',
        narrativeSummary: 'A tremor damaged the granary.',
        event: { id: 'evt-1', type: 'natural_disaster', cause: 'world_event' },
      },
      {
        appliedAt: '2026-02-10T00:00:00Z',
        narrativeSummary: 'The party cleared the flooded mine.',
        partyCaused: true,
        event: { id: 'evt-2', type: 'mine_cleared', cause: 'party_action', partyCaused: true },
      },
    ]);
    // The in-data chronicle key stays stripped — the column is the only path.
    expect(dossier.settlement.chronicle).toBeUndefined();
  });

  it('filters a malicious entry down to the allowlist end-to-end (defense in depth)', async () => {
    queueDossierRow({
      ...baseRow(),
      chronicle: [{
        // Allowlisted keys survive…
        id: 'log-1',
        appliedAt: '2026-02-03T00:00:00Z',
        narrativeSummary: 'A tremor damaged the granary.',
        cause: 'world_event',
        partyCaused: false,
        // …raw EventLogEntry baggage must NOT reach the viewer, even if a
        // drifted server ships it.
        beforeState: { prosperity: 3 },
        afterState: { prosperity: 1 },
        deltas: [{ key: 'prosperity', change: -2 }],
        factionResponses: [{ factionName: 'Salt Guild', hookSeed: 'SECRET seed' }],
        undo: { records: ['snapshot'] },
        event: {
          id: 'evt-1',
          type: 'natural_disaster',
          cause: 'world_event',
          // Event-level extras (free-text DM context, type-specific extras)
          // are not allowlisted either.
          description: 'DM-only context',
          payload: { dmSecret: true },
          targetId: 'institution.granary',
        },
        // An object smuggled into an allowlisted key is dropped, not passed.
        timestamp: { nested: 'object' },
      }],
    });
    const dossier = await fetchPublicDossier('s1');
    expect(dossier.chronicle).toHaveLength(1);
    const entry = dossier.chronicle[0];
    expect(Object.keys(entry).sort()).toEqual(['appliedAt', 'cause', 'event', 'id', 'narrativeSummary', 'partyCaused']);
    expect(Object.keys(entry.event).sort()).toEqual(['cause', 'id', 'type']);
    expect(JSON.stringify(dossier.chronicle)).not.toMatch(/beforeState|afterState|deltas|hookSeed|undo|snapshot|dmSecret|DM-only|prosperity|Salt Guild/);
  });

  it('tolerates a missing or malformed chronicle column (older server, bad row)', async () => {
    queueDossierRow(baseRow()); // no chronicle column at all (pre-032 server)
    expect((await fetchPublicDossier('s1')).chronicle).toEqual([]);

    queueDossierRow({ ...baseRow(), chronicle: 'not-an-array' });
    expect((await fetchPublicDossier('s1')).chronicle).toEqual([]);

    queueDossierRow({ ...baseRow(), chronicle: [null, 'string-entry', 42, {}, [1, 2]] });
    expect((await fetchPublicDossier('s1')).chronicle).toEqual([]);
  });

  it('caps a runaway chronicle at the newest 50 entries client-side too', async () => {
    const entries = Array.from({ length: 80 }, (_, i) => ({
      id: `log-${i}`,
      appliedAt: `2026-01-01T00:00:${String(i % 60).padStart(2, '0')}Z`,
      narrativeSummary: `Event ${i}`,
    }));
    queueDossierRow({ ...baseRow(), chronicle: entries });
    const dossier = await fetchPublicDossier('s1');
    expect(dossier.chronicle).toHaveLength(50);
    // Newest = the array tail (append-ordered log).
    expect(dossier.chronicle[0].id).toBe('log-30');
    expect(dossier.chronicle[49].id).toBe('log-79');
  });
});

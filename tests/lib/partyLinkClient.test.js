/**
 * tests/lib/partyLinkClient.test.js — the party link's client read (SW-B7a).
 *
 * (d) THE VEIL REACHES THE PLAYERS: fetchPublicDossier's unlisted branch hands
 *     sanitizeDossier the row's gallery_share_dm and gallery_member_overrides (the
 *     veil's deltas ride their reserved key), so a planted veil hides the same rows
 *     on the party link as on the gallery copy. The server twin is pinned by
 *     execution in tests/security/galleryUnlisted.pglite.test.js.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => {
  const builder = () => {
    const b = {};
    for (const m of ['select', 'eq', 'in', 'order', 'range', 'limit', 'maybeSingle', 'single', 'update']) b[m] = vi.fn(() => b);
    b.then = (resolve) => resolve({ data: [], error: null, count: 0 });
    return b;
  };
  return {
    supabase: { from: vi.fn(() => builder()), rpc: vi.fn(() => Promise.resolve({ data: [], error: null })) },
    isConfigured: true,
  };
});

import { supabase } from '../../src/lib/supabase.js';
import { fetchPublicDossier } from '../../src/lib/gallery.js';
import { writeShareVeil } from '../../src/domain/display/galleryVeil.js';

afterEach(() => vi.clearAllMocks());

const SETTLEMENT = {
  id: 'set-1', name: 'Highkeep', tier: 'city', population: 4200, config: {},
  npcs: [
    { id: 'npc_1', name: 'Ada Thorne', role: 'Smith', personality: 'patient-with-apprentices' },
    { id: 'npc_2', name: 'Bo Marsh', role: 'Fence', personality: 'sly-and-grasping' },
  ],
};
// The planted veil: the DM hid Bo's personality on this share.
const OVERRIDES = writeShareVeil({}, [{ address: 'field:npc:npc_2:personality', hidden: true }]);

/** Route rpc calls by name: the gallery read hits or misses, the unlisted read answers. */
function serve({ galleryRow, unlistedRow }) {
  supabase.rpc.mockImplementation((name) => {
    if (name === 'get_gallery_dossier') return Promise.resolve({ data: galleryRow ? [galleryRow] : [], error: null });
    if (name === 'get_unlisted_dossier') return Promise.resolve({ data: unlistedRow, error: null });
    return Promise.resolve({ data: null, error: null });
  });
}

describe('the party link honours the veil on the client (row (d))', () => {
  it('a planted veil hides the same rows on both reads', async () => {
    serve({ galleryRow: {
      id: 'set-1', public_slug: 'highkeep01', name: 'Highkeep', tier: 'city', data: SETTLEMENT,
      gallery_share_dm: false, gallery_member_overrides: OVERRIDES,
    } });
    const listed = await fetchPublicDossier('highkeep01');

    serve({ galleryRow: null, unlistedRow: {
      id: 'set-1', name: 'Highkeep', tier: 'city', slug: 'u'.repeat(42), unlisted: true, author_name: 'The Owner',
      dossier: SETTLEMENT, gallery_share_dm: false, gallery_member_overrides: OVERRIDES,
    } });
    const linked = await fetchPublicDossier('u'.repeat(42));

    expect(linked.unlisted).toBe(true);
    expect(linked.settlement).toEqual(listed.settlement);
    expect(linked.shareDm).toBe(listed.shareDm);
    const printed = JSON.stringify(linked.settlement);
    expect(printed).toContain('patient-with-apprentices');
    expect(printed).toContain('Bo Marsh');
    expect(printed).not.toContain('sly-and-grasping'); // the veil reached the players
  });

  it('the DM\'s "Reveal DM content" switch travels: the players\' page renders as the gallery copy does', async () => {
    serve({ galleryRow: null, unlistedRow: {
      id: 'set-1', name: 'Highkeep', tier: 'city', slug: 'u'.repeat(42), unlisted: true,
      dossier: SETTLEMENT, gallery_share_dm: true, gallery_member_overrides: {},
    } });
    const linked = await fetchPublicDossier('u'.repeat(42));
    expect(linked.shareDm).toBe(true);
  });
});

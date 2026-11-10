/**
 * tests/lib/partyLinkClient.test.js — the party link's client read (SW-B7a).
 *
 * (d) THE VEIL REACHES THE PLAYERS: fetchPublicDossier's unlisted branch hands
 *     sanitizeDossier the row's gallery_share_dm and gallery_member_overrides (the
 *     veil's deltas ride their reserved key), so a planted veil hides the same rows
 *     on the party link as on the gallery copy. The server twin is pinned by
 *     execution in tests/security/galleryUnlisted.pglite.test.js.
 * (f) THE OWNER IS TOLD: the read's is_owner travels as `isOwner` (the redirect's
 *     server word; false when absent).
 * R1  THE PARTY LINK NEVER WIDENS (VEIL-FIX, the chair's ruling R1 of 2026-11-10 on the
 *     pre-deploy review's finding 1): the unlisted branch is ALWAYS the player view — no
 *     full mode by gallery_share_dm, no per-member revealDm restore — even if a server
 *     (or an old one) sends DM content. The pin that asserted "the Reveal DM switch
 *     travels" is INVERTED with R1 as its cause.
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
    expect(printed).not.toContain('sly-and-grasping'); // anchored: the two toContain lines above prove `printed` is the live card text; the veil reached the players
  });

  // INVERTED by R1 (was: "the DM's Reveal DM content switch travels: shareDm true")
  it('R1: the DM\'s "Reveal DM content" switch never reaches the players: player view, DM fields stripped', async () => {
    const dmFull = {
      ...SETTLEMENT, secrets: ['the vault'], plotHooks: ['a hook'],
      npcs: SETTLEMENT.npcs.map((n) => ({ ...n, secret: `${n.id}-secret-text`, goals: [`${n.id}-goal-text`] })),
    };
    serve({ galleryRow: null, unlistedRow: {
      id: 'set-1', name: 'Highkeep', tier: 'city', slug: 'u'.repeat(42), unlisted: true,
      dossier: dmFull, gallery_share_dm: true, gallery_member_overrides: {},
    } });
    const linked = await fetchPublicDossier('u'.repeat(42));
    expect(linked.shareDm).toBe(false);
    const printed = JSON.stringify(linked.settlement);
    expect(printed).toContain('Ada Thorne');
    expect(printed).not.toContain('the vault'); // anchored: `printed` is pinned to hold the live card ('Ada Thorne') just above
    expect(printed).not.toContain('a hook'); // anchored: `printed` is pinned to hold the live card ('Ada Thorne') just above
    expect(printed).not.toContain('secret-text'); // anchored: `printed` is pinned to hold the live card ('Ada Thorne') just above
    expect(printed).not.toContain('goal-text'); // anchored: `printed` is pinned to hold the live card ('Ada Thorne') just above
  });

  it('R1: a revealDm member override never widens the players\' page', async () => {
    const dmFull = {
      ...SETTLEMENT,
      npcs: SETTLEMENT.npcs.map((n) => ({ ...n, secret: `${n.id}-secret-text`, goals: [`${n.id}-goal-text`] })),
    };
    serve({ galleryRow: null, unlistedRow: {
      id: 'set-1', name: 'Highkeep', tier: 'city', slug: 'u'.repeat(42), unlisted: true,
      dossier: dmFull, gallery_share_dm: false, gallery_member_overrides: { 'npc_1': { revealDm: true } },
    } });
    const linked = await fetchPublicDossier('u'.repeat(42));
    expect(linked.shareDm).toBe(false);
    const printed = JSON.stringify(linked.settlement);
    expect(printed).toContain('Ada Thorne');
    expect(printed).not.toContain('npc_1-secret-text'); // anchored: `printed` is pinned to hold the live card ('Ada Thorne') just above
    expect(printed).not.toContain('npc_1-goal-text'); // anchored: `printed` is pinned to hold the live card ('Ada Thorne') just above
  });
});

describe('the owner bit travels to the client (row (f))', () => {
  it('is_owner true → isOwner true; absent → false', async () => {
    const row = { id: 'set-1', name: 'Highkeep', tier: 'city', slug: 'u'.repeat(42), unlisted: true, dossier: SETTLEMENT };
    serve({ galleryRow: null, unlistedRow: { ...row, is_owner: true } });
    expect((await fetchPublicDossier('u'.repeat(42))).isOwner).toBe(true);
    serve({ galleryRow: null, unlistedRow: row });
    expect((await fetchPublicDossier('u'.repeat(42))).isOwner).toBe(false);
  });
});

// R4 (VEIL-FIX, the chair's ruling of 2026-11-10 on the review's finding 3, its second gap): THE VEIL
// FAILS CLOSED ON THE LINK. Only the gallery export writes the `$veil` marker, so a town shared by link
// alone carried no veil at all. With no marker the party link projects the DEFAULT veil — the same one
// the export writes (galleryVeil.js :: writeShareVeil with no deltas), from that one builder. The
// gallery read keeps an unmarked listed page as it is (pinned below) until the owner rules on the
// already-listed pre-veil pages (the lane's STOP of 2026-11-10).
describe('R4: the party link fails closed to the default veil', () => {
  const WITH_HOUSEKEEPING = { ...SETTLEMENT, coherenceNotes: ['housekeeping-note-text'] };
  it('a link-only town that was never exported hides what the default hides', async () => {
    serve({ galleryRow: null, unlistedRow: {
      id: 'set-1', name: 'Highkeep', tier: 'city', slug: 'u'.repeat(42), unlisted: true,
      dossier: WITH_HOUSEKEEPING, gallery_member_overrides: {},
    } });
    const linked = await fetchPublicDossier('u'.repeat(42));
    const printed = JSON.stringify(linked.settlement);
    expect(printed).toContain('Ada Thorne');
    expect(printed).not.toContain('housekeeping-note-text'); // anchored: the live card is asserted present on the line above
    // the same projection the export's own marker produces
    serve({ galleryRow: null, unlistedRow: {
      id: 'set-1', name: 'Highkeep', tier: 'city', slug: 'u'.repeat(42), unlisted: true,
      dossier: WITH_HOUSEKEEPING, gallery_member_overrides: writeShareVeil({}, []),
    } });
    expect((await fetchPublicDossier('u'.repeat(42))).settlement).toEqual(linked.settlement);
  });
  it('an unmarked LISTED gallery page is unchanged (the owner rules on the pre-veil pages)', async () => {
    serve({ galleryRow: {
      id: 'set-1', public_slug: 'highkeep01', name: 'Highkeep', tier: 'city', data: WITH_HOUSEKEEPING,
      gallery_share_dm: false, gallery_member_overrides: {},
    } });
    const listed = await fetchPublicDossier('highkeep01');
    expect(JSON.stringify(listed.settlement)).toContain('housekeeping-note-text');
  });
});

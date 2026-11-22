/**
 * tests/lib/galleryRealmArc.test.js — the public realm-arc summary (§S4).
 *
 * The war/pantheon epic is a PUBLIC-SAFE digest carried on its OWN column
 * (gallery_realm_arc_summary), DERIVED from the public ledgers — never the raw
 * chronicle, which stays DM-private and stripped by both sanitizers. These tests
 * pin the client half: fetchPublicDossier surfaces the digest as a sanitized,
 * bounded scalar string, while the raw chronicle is never exposed through it.
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

describe('fetchPublicDossier — realm-arc summary (§S4)', () => {
  it('surfaces the realm-arc digest from its own column, NOT the raw chronicle', async () => {
    queueDossierRow({
      ...baseRow(),
      gallery_realm_arc_summary: 'The Ascendancy of Vael — 4 settlements hold the faith. The War of Caldmere — a coalition besieges the walls.',
      // The settlement data carries a private chronicle — it must stay stripped.
      data: { name: 'Bramblefen', chronicle: ['leak-if-present'], worldState: { secretLedger: 1 } },
      chronicle: [{ appliedAt: '2026-02-03T00:00:00Z', narrativeSummary: 'private DM event' }],
    });
    const dossier = await fetchPublicDossier('s1');
    expect(dossier.realmArcSummary).toMatch(/Ascendancy of Vael/);
    expect(dossier.realmArcSummary).toMatch(/War of Caldmere/);
    // The raw chronicle key inside settlement data stays stripped (the digest is
    // a derived field, NOT the raw chronicle).
    expect(dossier.settlement.chronicle).toBeUndefined();
  });

  it('sanitizes the digest to plain bounded text (strips markup, caps length)', async () => {
    queueDossierRow({
      ...baseRow(),
      gallery_realm_arc_summary: `<script>alert(1)</script>The War of X — ${'A'.repeat(900)}`,
    });
    const dossier = await fetchPublicDossier('s1');
    // No angle brackets ⇒ no renderable markup (GalleryDetail prints it as plain
    // text in a <p>, never dangerouslySetInnerHTML), so a tag becomes inert text.
    expect(dossier.realmArcSummary).not.toMatch(/[<>]/);
    expect(dossier.realmArcSummary.length).toBeLessThanOrEqual(600);
  });

  it('tolerates a missing or malformed digest column (older server, bad row)', async () => {
    queueDossierRow(baseRow()); // no column at all
    expect((await fetchPublicDossier('s1')).realmArcSummary).toBe('');

    queueDossierRow({ ...baseRow(), gallery_realm_arc_summary: { not: 'a string' } });
    expect((await fetchPublicDossier('s1')).realmArcSummary).toBe('');
  });
});

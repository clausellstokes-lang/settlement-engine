/**
 * publicPayloadVeilTotality.test.js — THE VEIL COVERS THE WHOLE PAYLOAD, NOT ONE FIELD
 * (DESIGN_PROFILE_IMAGE.md §9, VEIL mode; the one-resolver law).
 *
 * WHY THIS PIN EXISTS — the defect it was written from, stated plainly so nobody
 * re-derives it. `toPublicSafe` veiled the settlement it projected, and a comment in
 * that module claimed the gallery dossier read and the world export "both already flow
 * through this one function, so veiling here covers both by construction". They did
 * not. Each of those payload builders HOISTED a raw display name beside the projected
 * settlement — `row.name` in lib/gallery.js, the member/realm names in lib/worldExport.js
 * — and the raw sibling is the one the page actually renders (GalleryDetail's
 * `{dossier.name || dossier.settlement?.name}`: the veiled copy was only the FALLBACK).
 * One export payload therefore carried the SAME string veiled in one field and plain in
 * its sibling. The veil was not missing; its SEAM was in the wrong place.
 *
 * WHY THE PIN IS SHAPED LIKE THIS. A pin that checked the three known fields would be
 * satisfied by the fix and silent about the fourth field somebody adds next month —
 * which is the entire failure mode, since the bug was never "we forgot to veil", it was
 * "we veiled at a seam a new field can be added outside of". So the fixture stamps a
 * flagged vector term into EVERY string-bearing input of every public payload builder
 * and asserts the SERIALIZED payload carries ZERO plain occurrences. A newly hoisted raw
 * field inherits the term from the fixture and reds this file on arrival.
 *
 * NON-VACUITY. An absence assertion over a payload is worthless if the payload is empty
 * or the fixture never carried the term (this repo has bitten itself on exactly that —
 * the vacuous-absence-pin class). Every case therefore asserts THREE things: the raw
 * input really does carry the term (the fixture is live), the output carries the veil
 * MARK (text genuinely flowed through and was masked, not dropped), and only then that
 * the output carries zero plain occurrences.
 *
 * IDENTIFIERS ARE VEILED TOO, deliberately — see `veilPublicPayload`'s contract in
 * src/domain/display/publicSafe.js. The two identifiers that round-trip to the server
 * (`public_slug`, the row `id`) cannot carry a flaggable token by construction, and
 * masking the rest keeps both sides of an in-payload join matching, because the mask is
 * deterministic.
 *
 * @enforced-by src/domain/display/publicSafe.js (veilPublicPayload)
 */
import { describe, expect, test, vi, afterEach } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { from: vi.fn(), rpc: vi.fn(() => Promise.resolve({ data: [], error: null })) },
  isConfigured: true,
}));

import { supabase } from '../../src/lib/supabase.js';
import {
  fetchPublicDossier, fetchDossierForImport, fetchMyGallery, fetchGalleryReports,
} from '../../src/lib/gallery.js';
import { buildWorldExport } from '../../src/lib/worldExport.js';
import { toPublicSafe, veilPublicPayload } from '../../src/domain/display/publicSafe.js';
import { VEIL_MARK } from '../../src/lib/civility.js';
import { TERMS } from '../../src/data/civilityLists.js';

afterEach(() => vi.clearAllMocks());

/**
 * The flagged token every fixture carries. Read from the SHARED list rather than
 * spelled inline, so retiring a term from the guard cannot leave a dead pin behind
 * that passes because its literal no longer means anything.
 */
const TERM = TERMS[0];

/** How many plain (unveiled) occurrences of the term a serialized value carries. */
function plainOccurrences(value) {
  const json = JSON.stringify(value) || '';
  return json.split(TERM).length - 1;
}

/**
 * The three-part assertion every builder gets. `raw` is the builder's INPUT, so the
 * fixture's own liveness is proved rather than assumed.
 */
function expectFullyVeiled(label, raw, payload) {
  expect(plainOccurrences(raw), `${label}: the FIXTURE must carry the term, or this pin proves nothing`).toBeGreaterThan(0);
  expect(JSON.stringify(payload), `${label}: text must have flowed through the veil, not been dropped`).toContain(VEIL_MARK);
  expect(plainOccurrences(payload), `${label}: public payload carries a PLAIN flagged term`).toBe(0);
}

/** A settlement whose every string-bearing field carries the term. */
const flaggedSettlement = () => ({
  id: `stl.port_of_${TERM}`,
  name: `Port of ${TERM}`,
  tier: 'town',
  thesis: `A ${TERM} of a town.`,
  dailyLife: `Nobody says ${TERM} in the square.`,
  settlementReason: `Founded by ${TERM}-cutters.`,
  coherenceNotes: `The ${TERM} note that is nonetheless public.`,
  history: { founding: `Settled by ${TERM}-cutters.`, currentTensions: [`The ${TERM} tithe.`] },
  npcs: [{
    id: `npc.borin_${TERM}_ab12`,
    name: `Borin the ${TERM}`,
    role: `${TERM}-reeve`,
    personality: `Gruff as ${TERM}`,
    goal: `To ruin that ${TERM} of a magistrate`,
    secret: `He is the ${TERM} in the old war`,
    plotHooks: [`The reeve wants that ${TERM} gone`],
  }],
  factions: [{ name: `The ${TERM} Guild`, members: [{ id: 'npc.borin', name: `Borin the ${TERM}`, role: 'reeve' }] }],
});

/** A gallery row whose every string column carries the term. */
const flaggedRow = () => ({
  id: '11111111-1111-1111-1111-111111111111',
  public_slug: 'a1b2c3d4e5f6',
  name: `Port of ${TERM}`,
  tier: 'town',
  data: flaggedSettlement(),
  gallery_description: `<p>A ${TERM} of a town.</p>`,
  gallery_image_alt: `A ${TERM} on the quay`,
  gallery_tags: ['coastal'],
  gallery_realm_arc_summary: `The realm turned ${TERM} in the third age.`,
  published_at: '2026-01-01',
  updated_at: '2026-01-02',
  view_count: 3,
  culture: `${TERM}-folk`,
  government_type: `A ${TERM} of a council`,
  primary_resource: `${TERM}-weed`,
  chronicle: [{
    id: 'evt-1',
    appliedAt: '2026-02-03T00:00:00Z',
    narrativeSummary: `A ${TERM} of a tremor damaged the granary.`,
    event: { id: 'evt-1', type: 'natural_disaster', cause: 'world_event' },
  }],
});

/** Queue the four RPC responses fetchPublicDossier makes for one dossier row. */
function queueDossierRow(row, moreByCreator = []) {
  supabase.rpc
    .mockResolvedValueOnce({ data: [row], error: null })                              // get_gallery_dossier
    .mockResolvedValueOnce({ data: null, error: null })                               // bump_public_view
    .mockResolvedValueOnce({ data: [{ net_votes: 0, voted: false }], error: null })    // vote state
    .mockResolvedValueOnce({ data: [], error: null })                                 // reaction state
    .mockResolvedValueOnce({ data: moreByCreator, error: null });                     // more by creator
}

describe('the public-payload veil seam — totality', () => {
  test('buildWorldExport (player variant) carries ZERO plain occurrences', () => {
    const world = {
      name: `Realm of ${TERM}`,
      settlements: [{ id: `save.port_of_${TERM}`, name: `Port of ${TERM}`, settlement: flaggedSettlement() }],
    };
    expectFullyVeiled('world export / player', world, buildWorldExport(world, { variant: 'player' }));
  });

  test('buildWorldExport (dm variant) carries ZERO plain occurrences', () => {
    const world = {
      name: `Realm of ${TERM}`,
      seed: 'seed-1',
      settlements: [{ id: `save.port_of_${TERM}`, name: `Port of ${TERM}`, settlement: flaggedSettlement() }],
    };
    expectFullyVeiled('world export / dm', world, buildWorldExport(world, { variant: 'dm' }));
  });

  test('the export veils the HOISTED names, not only the projected dossier', () => {
    // The precise regression: before the seam moved, `settlements[].name` and
    // `realm.name` were plain while `settlements[].dossier.name` beside them was
    // veiled. Assert the hoisted fields directly, so a re-regression names itself.
    const world = {
      name: `Realm of ${TERM}`,
      settlements: [{ id: 'save.a', name: `Port of ${TERM}`, settlement: flaggedSettlement() }],
    };
    const out = buildWorldExport(world, { variant: 'player' });
    expect(out.realm.name).toBe(`Realm of ${VEIL_MARK}`);
    expect(out.settlements[0].name).toBe(`Port of ${VEIL_MARK}`);
    expect(out.settlements[0].name).toBe(out.settlements[0].dossier.name);
  });

  test('an in-payload join still matches after veiling (ids masked identically)', () => {
    // Veiling identifiers is safe ONLY because the mask is deterministic: the same raw
    // id must veil to the same string wherever it appears, or a consumer joining the
    // export's sections would silently find nothing.
    const settlement = flaggedSettlement();
    const world = { name: 'Realm', settlements: [{ id: settlement.id, name: 'Port', settlement }] };
    const out = buildWorldExport(world, { variant: 'player' });
    expect(out.settlements[0].id).toBe(out.settlements[0].dossier.id);
    expect(out.settlements[0].id).toContain(VEIL_MARK);
  });

  test('fetchPublicDossier carries ZERO plain occurrences (incl. the chronicle column)', async () => {
    const row = flaggedRow();
    queueDossierRow(row, [flaggedRow()]);
    const dossier = await fetchPublicDossier('a1b2c3d4e5f6');
    expectFullyVeiled('public dossier', row, dossier);
    // The chronicle rides a SEPARATE server-projected column that deliberately does not
    // route through toPublicSafe — before the seam moved it was unveiled prose sitting
    // beside a veiled settlement body. The payload boundary covers it without the
    // chronicle needing its own rule.
    expect(dossier.chronicle[0].narrativeSummary).toContain(VEIL_MARK);
    // The nested more-by-creator tiles are veiled too (a tile is its own builder; the
    // outer seam re-walking them must be a no-op, never a double mask).
    expect(dossier.moreByCreator[0].name).toBe(`Port of ${VEIL_MARK}`);
  });

  test('the routing identifiers survive the veil verbatim', async () => {
    // The slug and row id must reach the server byte-intact or the page cannot be
    // fetched. They are safe by construction (12 hex chars from _make_public_slug,
    // and a uuid), and this pin holds that assumption honest.
    const row = flaggedRow();
    queueDossierRow(row);
    const dossier = await fetchPublicDossier('a1b2c3d4e5f6');
    expect(dossier.slug).toBe(row.public_slug);
    expect(dossier.id).toBe(row.id);
  });

  test('fetchDossierForImport carries ZERO plain occurrences (§9 IMPORT PAYLOAD)', async () => {
    const row = { id: 'row-1', name: `Port of ${TERM}`, tier: 'town', data: flaggedSettlement() };
    supabase.rpc.mockResolvedValueOnce({ data: [row], error: null });
    expectFullyVeiled('import payload', row, await fetchDossierForImport('a1b2c3d4e5f6'));
  });

  test('gallery listing tiles carry ZERO plain occurrences', async () => {
    const rows = [flaggedRow(), flaggedRow()];
    supabase.rpc.mockResolvedValueOnce({ data: rows, error: null });
    expectFullyVeiled('my-gallery tiles', rows, await fetchMyGallery());
  });

  test('toPublicSafe carries ZERO plain occurrences in BOTH modes', () => {
    const settlement = flaggedSettlement();
    expectFullyVeiled('toPublicSafe default', settlement, toPublicSafe(settlement));
    expectFullyVeiled('toPublicSafe full', settlement, toPublicSafe(settlement, { full: true }));
  });

  test('the ADMIN report queue is exempt — moderators read the report verbatim', async () => {
    // The deliberate exemption, pinned so it cannot be "fixed" into a leak of the
    // opposite kind: masking a report would blind the backstop lane the civility
    // guard's own header names as its second layer.
    supabase.rpc.mockResolvedValueOnce({
      data: [{ report_id: 'r1', settlement_id: 's1', settlement_name: `Port of ${TERM}`, report_body: `they named it ${TERM}` }],
      error: null,
    });
    const reports = await fetchGalleryReports();
    expect(reports[0].name).toBe(`Port of ${TERM}`);
    expect(reports[0].body).toBe(`they named it ${TERM}`);
  });
});

describe('the seam itself — negative controls', () => {
  test('the pin FIRES on an unveiled payload (the shape the defect had)', () => {
    // The control that makes every assertion above meaningful: reconstruct the OLD
    // shape — a veiled sub-object with a raw name hoisted beside it — and prove
    // plainOccurrences catches it. Without this, a bug in the detector would make the
    // whole file pass vacuously.
    const settlement = flaggedSettlement();
    const asShippedBroken = { name: settlement.name, dossier: toPublicSafe(settlement) };
    expect(plainOccurrences(asShippedBroken)).toBeGreaterThan(0);
    expect(plainOccurrences(veilPublicPayload(asShippedBroken))).toBe(0);
  });

  test('veilPublicPayload is idempotent — a second pass masks nothing further', () => {
    // Payload builders nest (tiles inside a dossier), so the seam runs over already
    // veiled values. If the mark itself were flaggable, nesting would corrupt text.
    const once = veilPublicPayload(toPublicSafe(flaggedSettlement()));
    expect(veilPublicPayload(once)).toBe(once);
  });

  test('clean text is returned by IDENTITY, so the seam costs nothing on the common path', () => {
    const clean = { name: 'Ashfen', npcs: [{ id: 'npc.borin', name: 'Borin', role: 'Reeve' }] };
    expect(veilPublicPayload(clean)).toBe(clean);
  });
});

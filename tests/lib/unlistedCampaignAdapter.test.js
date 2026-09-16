/**
 * unlistedCampaignAdapter.test.js — V-25b THE CAMPAIGN PLAYER VIEW seam. adaptUnlistedCampaign
 * reshapes a flat get_unlisted_map payload into the {world:{snapshot,sections}} shape the
 * read-only player face consumes — and is FAIL-CLOSED: it renders a campaign view ONLY for a
 * genuine map_with_campaign share that carries an opted-in living world, and copies ONLY a fixed
 * set of already-sanitized fields (never the DM's ledger). The world_snapshot itself was projected
 * through serializeWorldSnapshotPublic at share time; this pins that the CLIENT adapter adds no
 * leak of its own and gates the surface closed on anything else.
 */
import { describe, it, expect } from 'vitest';
import { adaptUnlistedCampaign } from '../../src/lib/galleryUnlisted.js';

// A realistic get_unlisted_map campaign payload — plus adversarial top-level junk the adapter
// must NOT pass through (only the known, sanitized fields survive).
function campaignPayload(extra = {}) {
  return {
    id: 'm1', name: 'The Ashfall Reaches', slug: 'a'.repeat(42), unlisted: true,
    share_kind: 'map_with_campaign',
    description: 'A realm three winters deep.',
    tags: ['grim', 'coastal'],
    image_url: 'https://example.test/map.png',
    realm_arc_summary: 'A famine broke, and a friendship held.',
    world_snapshot: { worldClock: { year: 3 }, chronicle: [{ id: 'c1', text: 'The granary opened.' }] },
    world_sections: ['worldClock', 'chronicle'],
    // adversarial extras — a would-be leak the adapter must drop by construction:
    owner_id: 'user-SECRET-42', gallery_world_snapshot_raw: { npcStates: { secret: true } },
    ...extra,
  };
}

describe('V-25b adaptUnlistedCampaign — the read-only player face seam', () => {
  it('reshapes a campaign share into the nested {world:{snapshot,sections}} shape', () => {
    const out = adaptUnlistedCampaign(campaignPayload());
    expect(out).not.toBeNull();
    expect(out.name).toBe('The Ashfall Reaches');
    expect(out.realmArcSummary).toBe('A famine broke, and a friendship held.');
    expect(out.imageUrl).toBe('https://example.test/map.png');
    expect(out.world.snapshot).toEqual({ worldClock: { year: 3 }, chronicle: [{ id: 'c1', text: 'The granary opened.' }] });
    expect(out.world.sections).toEqual(['worldClock', 'chronicle']);
  });

  it('copies ONLY the known sanitized fields — top-level junk never rides through', () => {
    const out = adaptUnlistedCampaign(campaignPayload());
    expect(Object.keys(out).sort()).toEqual(['description', 'imageUrl', 'name', 'realmArcSummary', 'slug', 'world']);
    const serialized = JSON.stringify(out);
    expect(serialized.includes('owner_id')).toBe(false);
    expect(serialized.includes('user-SECRET-42')).toBe(false);
    expect(serialized.includes('gallery_world_snapshot_raw')).toBe(false);
    expect(serialized.includes('npcStates')).toBe(false); // the raw-ledger decoy never reaches the view
  });

  it('FAIL-CLOSED: a plain unlisted map (no campaign world) yields null', () => {
    expect(adaptUnlistedCampaign(campaignPayload({ share_kind: 'map' }))).toBeNull();
    expect(adaptUnlistedCampaign(campaignPayload({ world_snapshot: null }))).toBeNull();
    expect(adaptUnlistedCampaign(campaignPayload({ world_snapshot: undefined }))).toBeNull();
    expect(adaptUnlistedCampaign(campaignPayload({ world_snapshot: [] }))).toBeNull(); // an array is not a snapshot
  });

  it('FAIL-CLOSED: a non-object / null / array input yields null', () => {
    expect(adaptUnlistedCampaign(null)).toBeNull();
    expect(adaptUnlistedCampaign(undefined)).toBeNull();
    expect(adaptUnlistedCampaign('a'.repeat(42))).toBeNull();
    expect(adaptUnlistedCampaign([campaignPayload()])).toBeNull();
  });

  it('missing optional fields degrade gracefully (no throw, sane defaults)', () => {
    const out = adaptUnlistedCampaign({ share_kind: 'map_with_campaign', world_snapshot: { worldClock: { year: 1 } } });
    expect(out.name).toBe('A shared world');
    expect(out.description).toBeNull();
    expect(out.realmArcSummary).toBeNull();
    expect(out.imageUrl).toBeNull();
    expect(out.world.sections).toEqual([]);
  });
});

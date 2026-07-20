/**
 * galleryUnlisted.js — Vision V-20 UNLISTED SHARING + V-13 featured maps client
 * API (migration 168). Extracted from gallery.js (hot-file ceiling): the RPC
 * wrappers for party-link sharing (share / rotate / revoke / list-mine / read),
 * for both settlements AND maps (a shared campaign IS a map_with_campaign row),
 * plus the per-section featured-maps helpers. gallery.js re-exports these.
 *
 * An unlisted row is is_public=false + a crypto-random unlisted_slug, so it is
 * absent from every public browse by construction; the OWNER alone sees their own
 * unlisted rows (list_my_unlisted_*), and anyone with the exact link reads it
 * (get_unlisted_*). Revoke = slug rotation. All RLS pinned by
 * tests/security/galleryUnlisted.pglite.test.js.
 */
import { supabase, isConfigured } from './supabase.js';

// ── Featured maps (per-section featured) ─────────────────────────────────────

/** Fetch the featured MAPS. Backed by list_featured_maps(). */
export async function fetchFeaturedMaps() {
  if (!isConfigured) return [];
  const { data, error } = await supabase.rpc('list_featured_maps');
  if (error) { console.error('[gallery] featured maps listing failed:', error); return []; }
  return (data || []).map(row => ({
    id: row.id, slug: row.public_slug, name: row.name, shareKind: row.share_kind,
    publishedAt: row.published_at, viewCount: row.view_count ?? 0, featured: true,
  }));
}

/** Admin-only: feature/unfeature a public map (set_featured_map). */
export async function setFeaturedMap(mapId, featured, sortOrder = null) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('set_featured_map', { target_id: mapId, featured, sort_order: sortOrder });
  if (error) throw new Error(error.message || 'Featured toggle failed');
}

// ── Settlement unlisted sharing ──────────────────────────────────────────────

/**
 * Share a settlement as UNLISTED: reachable ONLY by the returned crypto-random
 * link, absent from every public browse, revocable by rotation. Returns the slug.
 */
export async function shareSettlementUnlisted(settlementId) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.rpc('share_settlement_unlisted', { target_id: settlementId });
  if (error) throw new Error(error.message || 'Could not create the unlisted link');
  return data;
}

/** Rotate an unlisted settlement's slug — the old link dies, a new one is issued. */
export async function rotateSettlementUnlistedSlug(settlementId) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.rpc('rotate_settlement_unlisted_slug', { target_id: settlementId });
  if (error) throw new Error(error.message || 'Could not rotate the link');
  return data;
}

/** Stop sharing a settlement unlisted (kills the link). */
export async function revokeSettlementUnlisted(settlementId) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('revoke_settlement_unlisted', { target_id: settlementId });
  if (error) throw new Error(error.message || 'Could not stop the unlisted share');
}

/**
 * The owner's own unlisted dossiers — the gallery's PRIVATE/UNLISTED filter (the
 * RLS pair's owner half: only the owner ever sees these). Tiles carry
 * `unlisted: true` so the card shows the badge.
 */
export async function fetchMyUnlistedDossiers() {
  if (!isConfigured) return [];
  const { data, error } = await supabase.rpc('list_my_unlisted_dossiers');
  if (error) { console.error('[gallery] my-unlisted listing failed:', error); return []; }
  return (data || []).map(row => ({
    id: row.id, slug: row.unlisted_slug, name: row.name, tier: row.tier,
    publishedAt: row.published_at, unlisted: true,
  }));
}

/** Read an unlisted dossier by its exact slug (get_unlisted_dossier). */
export async function fetchUnlistedDossier(slug) {
  if (!isConfigured || !slug || typeof slug !== 'string') return null;
  const { data, error } = await supabase.rpc('get_unlisted_dossier', { p_slug: slug });
  if (error) { console.error('[gallery] unlisted dossier fetch failed:', error); return null; }
  return data || null;
}

// ── Map / campaign unlisted sharing (map_with_campaign = the campaign case) ───

/** Share a map (or map_with_campaign) as unlisted (share_map_unlisted). */
export async function shareMapUnlisted(mapId) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.rpc('share_map_unlisted', { target_id: mapId });
  if (error) throw new Error(error.message || 'Could not create the unlisted link');
  return data;
}

/** Rotate an unlisted map's slug. */
export async function rotateMapUnlistedSlug(mapId) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.rpc('rotate_map_unlisted_slug', { target_id: mapId });
  if (error) throw new Error(error.message || 'Could not rotate the link');
  return data;
}

/** The owner's own unlisted maps/campaigns (the maps PRIVATE/UNLISTED filter). */
export async function fetchMyUnlistedMaps() {
  if (!isConfigured) return [];
  const { data, error } = await supabase.rpc('list_my_unlisted_maps');
  if (error) { console.error('[gallery] my-unlisted maps listing failed:', error); return []; }
  return (data || []).map(row => ({
    id: row.id, slug: row.unlisted_slug, name: row.name, shareKind: row.share_kind,
    publishedAt: row.published_at, unlisted: true,
  }));
}

/** Read an unlisted map/campaign by its exact slug (get_unlisted_map). */
export async function fetchUnlistedMap(slug) {
  if (!isConfigured || !slug || typeof slug !== 'string') return null;
  const { data, error } = await supabase.rpc('get_unlisted_map', { p_slug: slug });
  if (error) { console.error('[gallery] unlisted map fetch failed:', error); return null; }
  return data || null;
}

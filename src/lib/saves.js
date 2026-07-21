/**
 * saves.js — Settlement save/load service.
 *
 * Uses Supabase when configured, falls back to localStorage.
 * Both backends expose the same async API so components are
 * agnostic to the storage layer.
 *
 * Toggle fields (institutionToggles, categoryToggles, goodsToggles,
 * servicesToggles) are bundled into a single `toggles` JSONB column
 * in Supabase and spread back out when loading.
 */

import { supabase, isConfigured } from './supabase.js';
import { ACTIVE_SAVE_STATE, activeSaveCount, isSaveActive } from './saveAccess.js';
import { buildNeighbourBackLink } from '../domain/relationships/neighbourBackLink.js';

const LOCAL_KEY = 'dnd_settlement_saves';

/**
 * normalizeSettlement wraps the ~30 kB settlement-migration closure. It's only
 * needed on POST-first-paint paths (loading / saving / importing settlements —
 * never on the anon landing), so we lazy-load it rather than statically import
 * it. saves.js is pulled into the eager first-paint chain (store → saves), and
 * a static edge from here to normalizeSettlement dragged that closure into the
 * first-paint bundle non-deterministically (build-determinism + first-paint
 * budget regression). The dynamic import keeps it out of the entry's static
 * closure. migrateSettlementShape stays SYNCHRONOUS, reading the memoized ref;
 * every async caller awaits loadNormalize() ONCE before mapping with it.
 */
let _normalize = null;
async function loadNormalize() {
  if (!_normalize) {
    _normalize = (await import('../domain/normalizeSettlement.js')).normalizeSettlement;
  }
  return _normalize;
}

/** Generate a client-side UUID for saves we must reference before insert
 *  (the bidirectional link embeds the new save's id in both rows). */
function newSaveId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`;
}

// ── Local storage helpers ───────────────────────────────────────────────────

function localLoad() {
  // Non-array stored value (drifted/corrupt row) yields [] rather than letting
  // a later .map/.filter crash (ported master fix).
  try {
    const v = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch { return []; }
}

function localWrite(saves) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(saves));
}

// ── Toggle helpers ─────────────────────────────────────────────────────────

function bundleToggles(entry) {
  if (!entry.institutionToggles && !entry.categoryToggles &&
      !entry.goodsToggles && !entry.servicesToggles) return entry.toggles || null;
  return {
    institutionToggles: entry.institutionToggles || {},
    categoryToggles:    entry.categoryToggles || {},
    goodsToggles:       entry.goodsToggles || {},
    servicesToggles:    entry.servicesToggles || {},
  };
}

function spreadToggles(toggles) {
  if (!toggles) return {};
  return {
    institutionToggles: toggles.institutionToggles || {},
    categoryToggles:    toggles.categoryToggles || {},
    goodsToggles:       toggles.goodsToggles || {},
    servicesToggles:    toggles.servicesToggles || {},
  };
}

function mutationRow(entry, includeId = true) {
  const row = {};
  if (includeId) row.id = entry.id;
  if (entry.name !== undefined) row.name = entry.name;
  if (entry.tier !== undefined) row.tier = entry.tier;
  if (entry.settlement !== undefined) {
    row.data = entry.settlement;
    row.neighbour_links = entry.settlement?.neighbourNetwork || null;
  }
  if (entry.config !== undefined) row.config = entry.config;
  if (entry.seed !== undefined) row.seed = entry.seed;
  if (entry.aiData !== undefined) row.ai_data = entry.aiData;
  if (entry.campaignState !== undefined) row.campaign_state = entry.campaignState;
  if (entry.versionHistory !== undefined) {
    row.version_history = Array.isArray(entry.versionHistory) ? entry.versionHistory : null;
  }
  const toggles = bundleToggles(entry);
  if (toggles) row.toggles = toggles;
  return row;
}

// ── Save migration ──────────────────────────────────────────────────────────

/**
 * Migrate an arbitrary save record to the v2 shape, which adds a single
 * new field — `campaignState` — holding lifecycle data that used to
 * live globally on the slice (phase, eventLog, systemState, locks,
 * provenance timestamps, narrative-drift flags, export state).
 *
 * Older saves with no campaignState get default-populated. This means
 * a settlement canonized before this migration shipped will return as
 * draft on first reload — no way to recover state that was never
 * persisted. New saves round-trip cleanly.
 *
 * The `campaign_state` JSONB column needs to exist in Supabase. Add via:
 *   ALTER TABLE settlements ADD COLUMN IF NOT EXISTS campaign_state JSONB;
 * Until that migration runs, the column read returns null and we fall
 * through to the defaults — the app keeps working.
 */
function migrateSaveToV2(entry) {
  if (!entry) return entry;
  // Seed is part of the save contract, not an optional column (finding F2).
  // Lift it from the settlement blob's stamped `_seed` (or config._seed) so no
  // save path can drop the "same seed => same settlement" guarantee for the
  // objects users keep. Because migrateSaveToV2 runs on every read AND write
  // path, this also RECOVERS the seed for already-saved rows whose `seed`
  // column is null but whose blob still carries `_seed`. Explicit entry.seed
  // wins (campaign import). null is honest when truly unknown.
  const seed = entry.seed ?? entry.settlement?._seed ?? entry.config?._seed ?? null;
  if (entry.campaignState && entry.campaignState.phase) {
    return entry.seed === seed ? entry : { ...entry, seed };
  }
  return {
    ...entry,
    seed,
    campaignState: {
      phase: 'draft',
      eventLog: [],
      systemState: null,
      locks: {},
      generatedAt: entry.timestamp || (entry.savedAt ? new Date(entry.savedAt).toISOString() : null),
      editedAt: entry.timestamp || null,
      canonizedAt: null,
      lastExportAt: null,
      narrativeDrift: null,
      exportState: null,
    },
  };
}

/**
 * Derive the settlement's own neighbourNetwork entry from its generated
 * `neighborRelationship` if it isn't already represented. The only code that did
 * this lived in SettlementsPanel.saveCurrentSettlement, which is now dead — so
 * settlements saved via the canonical path (SaveToLibraryButton / the
 * save-settlement auth intent) lost their neighbour link. Pure + idempotent
 * (guarded by name), so it's safe on every save and re-read.
 *
 * NOTE: this only derives *this* settlement's own entry. The *bidirectional*
 * partner back-link (updating the neighbour's own save row) is a multi-row write
 * handled by the save methods below via buildNeighbourBackLink + a batch write.
 */
function withNeighbourNetworkFromRelationship(settlement) {
  if (!settlement) return settlement;
  const nr = settlement.neighborRelationship;
  if (!nr?.name) return settlement;
  const net = settlement.neighbourNetwork || [];
  if (net.some(n => n.name === nr.name)) return settlement;
  return {
    ...settlement,
    neighbourNetwork: [{
      id: `generated_${String(nr.name).replace(/\s+/g, '_')}`,
      name: nr.name,
      neighbourName: nr.name,
      neighbourTier: nr.tier || '',
      tier: nr.tier || '',
      relationshipType: nr.relationshipType || 'neutral',
      description: `Generated as ${(nr.relationshipType || 'neutral').replace(/_/g, ' ')} of this settlement.`,
      fromGeneration: true,
    }, ...net],
  };
}

/**
 * Run the canonical-shape adapter on the embedded settlement of a save
 * entry. Save entries themselves are a separate envelope (id, name,
 * timestamp, campaignState, etc.); the settlement object lives at
 * `entry.settlement`. Older entries pre-date schemaVersion stamps —
 * normalize on read so the rest of the app sees a uniform shape.
 *
 * Pure / idempotent — already-canonical settlements pass through
 * unchanged after the first normalize.
 */
function migrateSettlementShape(entry) {
  if (!entry || !entry.settlement) return entry;
  return { ...entry, settlement: _normalize(entry.settlement) };
}

// ── Supabase methods ────────────────────────────────────────────────────────

async function supabaseList() {
  const { data, error } = await supabase
    .from('settlements')
    .select('id, name, tier, data, config, toggles, seed, neighbour_links, ai_data, gallery_share_narrated, gallery_share_dm, gallery_importable, gallery_member_overrides, is_public, public_slug, visibility, unlisted_slug, gallery_description, gallery_title, gallery_image_url, gallery_image_alt, gallery_tags, campaign_state, version_history, access_state, inactive_reason, inactive_since, retention_expires_at, reactivated_free_at, created_at, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  await loadNormalize(); // migrateSettlementShape reads _normalize synchronously
  return data.map(row => {
    const accessState = row.access_state || ACTIVE_SAVE_STATE;
    const usable = accessState === ACTIVE_SAVE_STATE;
    return migrateSettlementShape(migrateSaveToV2({
    id:        row.id,
    name:      row.name,
    tier:      row.tier,
    timestamp: row.updated_at,
    savedAt:   new Date(row.updated_at).getTime(),
    settlement: usable ? row.data : null,
    config:    usable ? row.config : null,
    ...(usable ? spreadToggles(row.toggles) : {}),
    seed:      usable ? row.seed : null,
    aiData:    usable ? (row.ai_data || {}) : {},
    gallery_share_narrated: row.gallery_share_narrated || false,
    gallery_share_dm: row.gallery_share_dm || false,
    // The two owner opt-ins ShareToGallery seeds from this entry and re-writes
    // on every "Save gallery details" — dropping them here silently cleared
    // the import opt-in + per-member overrides after a reload.
    gallery_importable: row.gallery_importable || false,
    gallery_member_overrides: (row.gallery_member_overrides && typeof row.gallery_member_overrides === 'object') ? row.gallery_member_overrides : null,
    is_public: row.is_public || false,
    public_slug: row.public_slug || null,
    // V-20 unlisted (party-link) state — read back so a reload re-seeds
    // ShareToGallery's unlisted mode. Dropping these silently reset the owner to
    // the non-unlisted UI, whose "Unlisted link" button re-mints a FRESH slug
    // (share_settlement_unlisted always rotates), killing the party link already
    // handed out. Now the reloaded entry shows the copy/rotate/stop bar instead.
    visibility: row.visibility || 'public',
    unlisted_slug: row.unlisted_slug || null,
    gallery_description: row.gallery_description || '',
    gallery_title: row.gallery_title || '',
    gallery_image_url: row.gallery_image_url || '',
    gallery_image_alt: row.gallery_image_alt || '',
    gallery_tags: Array.isArray(row.gallery_tags) ? row.gallery_tags : [],
    campaignState: row.campaign_state || null,
    versionHistory: Array.isArray(row.version_history) ? row.version_history : [],
    accessState,
    inactiveReason: row.inactive_reason || null,
    inactiveSince: row.inactive_since || null,
    retentionExpiresAt: row.retention_expires_at || null,
    reactivatedFreeAt: row.reactivated_free_at || null,
  }));
  });
}

/**
 * F42: metadata-only projection for painting the library grid. Selects ONLY the
 * light columns needed for cards + access/gallery state — deliberately NONE of
 * the blob columns (data, config, toggles, ai_data, campaign_state,
 * version_history, neighbour_links), which on a full library run 84–220 kB per
 * row and carry a 50-snapshot version history. Returns the same envelope shape
 * as list() with the blob-derived fields nulled/emptied and an `isMeta` flag, so
 * a caller can paint cards from meta and hydrate the full blob per-save when a
 * settlement is actually opened. Callers that genuinely need blobs in memory
 * (cross-save link/rename/delete, campaign simulation) keep using list().
 *
 * DISPOSITION (lib-infra-6, Analytics-v2 A1): this projection is BUILT but has zero
 * grid consumers today — deliberately. It is the F42 slice's second half: the
 * targeted-neighbour-query half shipped; the SettlementsPanel grid → listMeta +
 * per-open hydration was consciously deferred because per-save blob hydration on card
 * open is a genuine feature the slice declined, not an oversight. This is deferred F42
 * INFRA, not dead code to re-find. Do NOT wire the grid or delete this in a cleanup
 * pass — resurrecting the grid adoption is an owner-scoped feature (needs the
 * per-open hydration path). See the A1 wave report + memory for the standing deferral.
 */
async function supabaseListMeta() {
  const { data, error } = await supabase
    .from('settlements')
    .select('id, name, tier, seed, gallery_share_narrated, gallery_share_dm, gallery_importable, gallery_member_overrides, is_public, public_slug, gallery_description, gallery_title, gallery_image_url, gallery_image_alt, gallery_tags, access_state, inactive_reason, inactive_since, retention_expires_at, reactivated_free_at, created_at, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id:        row.id,
    name:      row.name,
    tier:      row.tier,
    timestamp: row.updated_at,
    savedAt:   new Date(row.updated_at).getTime(),
    settlement: null,
    config:    null,
    seed:      row.seed ?? null,
    aiData:    {},
    gallery_share_narrated: row.gallery_share_narrated || false,
    gallery_share_dm: row.gallery_share_dm || false,
    // Same opt-in carry-through as supabaseList — the meta projection feeds
    // the same ShareToGallery seeding paths.
    gallery_importable: row.gallery_importable || false,
    gallery_member_overrides: (row.gallery_member_overrides && typeof row.gallery_member_overrides === 'object') ? row.gallery_member_overrides : null,
    is_public: row.is_public || false,
    public_slug: row.public_slug || null,
    gallery_description: row.gallery_description || '',
    gallery_title: row.gallery_title || '',
    gallery_image_url: row.gallery_image_url || '',
    gallery_image_alt: row.gallery_image_alt || '',
    gallery_tags: Array.isArray(row.gallery_tags) ? row.gallery_tags : [],
    campaignState: null,
    versionHistory: [],
    accessState: row.access_state || ACTIVE_SAVE_STATE,
    inactiveReason: row.inactive_reason || null,
    inactiveSince: row.inactive_since || null,
    retentionExpiresAt: row.retention_expires_at || null,
    reactivatedFreeAt: row.reactivated_free_at || null,
    isMeta: true,
  }));
}

/**
 * F42: fetch only the ACTIVE saves whose name matches `name`, with the full
 * settlement blob (the neighbour back-link needs the partner's npcs /
 * neighbourNetwork / interSettlementRelationships). Used to resolve a single
 * neighbour partner on save instead of pulling the ENTIRE library (every blob +
 * 50-snapshot version history) just to find one row. The `name` column is the
 * canonical save name (set from the settlement name on write), so an equality
 * filter on it mirrors findSaveByName's primary match without an egress blowup.
 */
async function supabaseListActiveByName(name) {
  const { data, error } = await supabase
    .from('settlements')
    .select('id, name, tier, data, access_state')
    .eq('name', name);
  if (error) throw error;
  await loadNormalize(); // migrateSettlementShape reads _normalize synchronously
  return (data || []).map(row => migrateSettlementShape(migrateSaveToV2({
    id:         row.id,
    name:       row.name,
    tier:       row.tier,
    settlement: row.data,
    accessState: row.access_state || ACTIVE_SAVE_STATE,
  }))).filter(isSaveActive);
}

async function supabaseSave(entry) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const v2 = migrateSaveToV2(entry);
  const settlement = withNeighbourNetworkFromRelationship(v2.settlement);

  // Bidirectional neighbour link: if this settlement was generated against an
  // existing save, both rows must reference each other. That needs a multi-row
  // write, so we pre-mint the id, compute both sides, and create+update
  // atomically via the batch RPC. Skipped (single insert) when there's no
  // generated neighbour or no matching active partner. F42: resolve the partner
  // with a targeted name query, not a full-library refetch.
  if (settlement?.neighborRelationship?.name) {
    const saveId = newSaveId();
    const existing = await supabaseListActiveByName(settlement.neighborRelationship.name);
    const link = buildNeighbourBackLink({ ...v2, id: saveId, settlement }, existing);
    if (link) {
      await supabaseMutateBatch({
        creates: [{ ...v2, id: saveId, settlement: link.settlement }],
        updates: [{ id: link.partner.id, settlement: link.partner.settlement }],
      });
      return saveId;
    }
  }

  const row = {
    user_id:         user.id,
    name:            v2.name,
    tier:            v2.tier,
    data:            settlement,
    config:          v2.config || null,
    toggles:         bundleToggles(v2),
    seed:            v2.seed || null,
    neighbour_links: settlement?.neighbourNetwork || null,
    ai_data:         v2.aiData || {},
    campaign_state:  v2.campaignState || null,
    version_history: Array.isArray(v2.versionHistory) ? v2.versionHistory : null,
  };

  const { data, error } = await supabase
    .from('settlements')
    .insert(row)
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

async function supabaseUpdate(id, partial) {
  const updates = {};
  if (partial.name       !== undefined) updates.name = partial.name;
  if (partial.tier       !== undefined) updates.tier = partial.tier;
  if (partial.settlement !== undefined) {
    updates.data = partial.settlement;
    updates.neighbour_links = partial.settlement.neighbourNetwork || null;
  }
  if (partial.config !== undefined) updates.config = partial.config;
  if (partial.seed   !== undefined) updates.seed = partial.seed;
  if (partial.aiData !== undefined) updates.ai_data = partial.aiData;
  if (partial.campaignState !== undefined) updates.campaign_state = partial.campaignState;
  if (partial.versionHistory !== undefined) updates.version_history = Array.isArray(partial.versionHistory) ? partial.versionHistory : null;

  const toggles = bundleToggles(partial);
  if (toggles) updates.toggles = toggles;

  if (Object.keys(updates).length === 0) return;
  const { error } = await supabase.from('settlements').update(updates).eq('id', id);
  if (error) throw error;
}

async function supabaseDelete(id) {
  const { error } = await supabase.from('settlements').delete().eq('id', id);
  if (error) throw error;
}

async function supabaseCount() {
  const { count, error } = await supabase
    .from('settlements')
    .select('id', { count: 'exact', head: true })
    .eq('access_state', ACTIVE_SAVE_STATE);
  if (error) throw error;
  return count || 0;
}

async function supabaseReactivateFreeSettlement(id) {
  const { data, error } = await supabase.rpc('reactivate_free_settlement', {
    target_settlement_id: id,
  });
  if (error) throw error;
  return data;
}

async function supabaseMutateBatch({ updates = [], deletes = [], creates = [] } = {}) {
  const { data, error } = await supabase.rpc('mutate_settlement_batch', {
    updates: updates.map(entry => mutationRow(entry)),
    delete_ids: deletes,
    creates: creates.map(entry => mutationRow(migrateSaveToV2(entry))),
  });
  if (error) throw error;
  return data;
}

// ── Local methods ───────────────────────────────────────────────────────────

async function localList() {
  // Run the v2 migration + canonical-shape adapter on every read so
  // older locally-saved entries surface with both a campaignState block
  // and a normalized settlement shape (version stamps, stable id,
  // default canonical containers). Cost is trivial — both adapters are
  // pure object spreads — and it makes the rest of the app symmetric
  // with the Supabase path.
  await loadNormalize(); // migrateSettlementShape reads _normalize synchronously
  return localLoad().map(entry => ({ accessState: ACTIVE_SAVE_STATE, ...entry })).map(migrateSaveToV2).map(migrateSettlementShape);
}

/**
 * F42: local-mode mirror of supabaseListMeta — same light envelope with blob
 * fields stripped and the `isMeta` flag set, so both backends expose one meta
 * contract. Local mode has no network egress; this exists purely to keep the
 * API symmetric for callers that opt into the metadata projection.
 */
async function localListMeta() {
  return (await localList()).map(entry => ({
    ...entry,
    settlement: null,
    config: null,
    aiData: {},
    campaignState: null,
    versionHistory: [],
    isMeta: true,
  }));
}

async function localSaveEntry(entry) {
  const v2 = migrateSaveToV2(entry);
  const settlement = withNeighbourNetworkFromRelationship(v2.settlement);
  const saves = localLoad();
  const id = v2.id || Date.now();

  // Bidirectional neighbour link (see supabaseSave): when the named neighbour
  // already exists as an active save, write the reciprocal back-link onto the
  // partner row alongside the new save.
  if (settlement?.neighborRelationship?.name) {
    const existing = saves.filter(isSaveActive);
    const link = buildNeighbourBackLink({ ...v2, id, settlement }, existing);
    if (link) {
      const next = saves.map(s => String(s.id) === String(link.partner.id)
        ? { ...s, settlement: link.partner.settlement }
        : s);
      next.unshift({ ...v2, settlement: link.settlement, id, savedAt: Date.now() });
      localWrite(next);
      return id;
    }
  }

  saves.unshift({ ...v2, settlement, id, savedAt: Date.now() });
  localWrite(saves);
  return id;
}

async function localUpdate(id, partial) {
  const saves = localLoad();
  // String() both sides (ported master fix): a numeric id passed as a string
  // must still match — the module's other id compares already coerce.
  const idx = saves.findIndex(s => String(s.id) === String(id));
  if (idx !== -1) {
    Object.assign(saves[idx], partial);
    localWrite(saves);
  }
}

async function localDelete(id) {
  localWrite(localLoad().filter(s => String(s.id) !== String(id)));
}

async function localCount() {
  return activeSaveCount(localLoad());
}

async function localReactivateFreeSettlement(id) {
  const saves = localLoad();
  const idx = saves.findIndex(save => String(save.id) === String(id));
  if (idx === -1) return { ok: false, reason: 'not_found' };
  saves[idx] = {
    ...saves[idx],
    accessState: ACTIVE_SAVE_STATE,
    inactiveReason: null,
    inactiveSince: null,
    retentionExpiresAt: null,
    reactivatedFreeAt: new Date().toISOString(),
  };
  localWrite(saves);
  return { ok: true };
}

/** Batch-write the full saves array (local mode only). */
async function localWriteAll(entries) {
  localWrite(entries);
}

async function localMutateBatch({ updates = [], deletes = [], creates = [] } = {}) {
  const deleted = new Set(deletes.map(String));
  const updateMap = new Map(updates.map(entry => [String(entry.id), entry]));
  const next = localLoad()
    .filter(entry => !deleted.has(String(entry.id)))
    .map(entry => {
      const patch = updateMap.get(String(entry.id));
      return patch ? { ...entry, ...patch } : entry;
    });
  for (const entry of creates) next.unshift({ ...migrateSaveToV2(entry), savedAt: Date.now() });
  localWrite(next);
  return updates.length + deletes.length + creates.length;
}

// ── Exported API ────────────────────────────────────────────────────────────

export const saves = {
  list:     isConfigured ? supabaseList     : localList,
  /** F42: metadata-only library projection (no blob columns) for grid paint. */
  listMeta: isConfigured ? supabaseListMeta : localListMeta,
  save:     isConfigured ? supabaseSave     : localSaveEntry,
  update:   isConfigured ? supabaseUpdate   : localUpdate,
  delete:   isConfigured ? supabaseDelete   : localDelete,
  count:    isConfigured ? supabaseCount    : localCount,
  reactivateFreeSettlement: isConfigured ? supabaseReactivateFreeSettlement : localReactivateFreeSettlement,
  mutateBatch: isConfigured ? supabaseMutateBatch : localMutateBatch,
  /** Write entire saves array — only available in local mode. */
  writeAll: isConfigured ? null             : localWriteAll,
  isConfigured,
};

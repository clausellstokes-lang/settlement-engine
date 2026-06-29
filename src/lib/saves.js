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

import { supabase, isConfigured, withTimeout } from './supabase.js';
import { normalizeSettlement } from '../domain/normalizeSettlement.js';
import { ACTIVE_SAVE_STATE, activeSaveCount, isSaveActive } from './saveAccess.js';
import { buildNeighbourBackLink } from '../domain/relationships/neighbourBackLink.js';

const LOCAL_KEY = 'dnd_settlement_saves';

/** Generate a client-side UUID for saves we must reference before insert
 *  (the bidirectional link embeds the new save's id in both rows; the
 *  interactive Save button mints one per dossier so a timeout-retry upserts
 *  the same row instead of duplicating). */
export function newSaveId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`;
}

// ── Local storage helpers ───────────────────────────────────────────────────

function localLoad() {
  try { const v = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
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
  if (entry.campaignState && entry.campaignState.phase) return entry;
  return {
    ...entry,
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
  return { ...entry, settlement: normalizeSettlement(entry.settlement) };
}

// ── Supabase methods ────────────────────────────────────────────────────────

async function supabaseList() {
  const { data, error } = await supabase
    .from('settlements')
    .select('id, name, tier, data, config, toggles, seed, neighbour_links, ai_data, gallery_share_narrated, gallery_share_dm, gallery_importable, is_public, public_slug, gallery_description, gallery_image_url, gallery_image_alt, gallery_tags, campaign_state, version_history, access_state, inactive_reason, inactive_since, retention_expires_at, reactivated_free_at, created_at, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;
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
    gallery_importable: row.gallery_importable || false,
    is_public: row.is_public || false,
    public_slug: row.public_slug || null,
    gallery_description: row.gallery_description || '',
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
 * Fetch only the ACTIVE save row(s) whose name matches `name`, mapped to the
 * lean save shape buildNeighbourBackLink needs (id, name, tier, settlement,
 * accessState). The partner is matched by the row `name` column OR the embedded
 * settlement name (data->>name) — mirroring findSaveByName — so we filter on both.
 *
 * This replaces the previous full-table supabaseList() read on the back-link path:
 * that pulled every save's data/config/toggles blobs and ran the v2 + canonical
 * adapters on all of them just to find one partner by name. The remaining
 * read-modify-write race (the back-link is computed from a snapshot read OUTSIDE
 * the batch RPC's transaction) needs a server-side fix — see crossBundleNotes.
 */
async function fetchActivePartnersByName(name) {
  if (!name) return [];
  const cols = 'id, name, tier, data, access_state';
  const toSave = (row) => ({
    id: row.id,
    name: row.name,
    tier: row.tier,
    settlement: row.data,
    accessState: row.access_state || ACTIVE_SAVE_STATE,
  });
  // Two parameterized .eq() queries (row name + embedded settlement name), merged
  // on id. .eq() values are escaped by the client, so a settlement name containing
  // a comma/paren — which would break a single .or() filter string — is safe here.
  const byName = supabase
    .from('settlements').select(cols)
    .eq('access_state', ACTIVE_SAVE_STATE).eq('name', name);
  const byDataName = supabase
    .from('settlements').select(cols)
    .eq('access_state', ACTIVE_SAVE_STATE).eq('data->>name', name);
  const [a, b] = await Promise.all([byName, byDataName]);
  if (a.error) throw a.error;
  if (b.error) throw b.error;
  const merged = new Map();
  for (const row of [...(a.data || []), ...(b.data || [])]) merged.set(row.id, toSave(row));
  return [...merged.values()];
}

async function supabaseSave(entry) {
  // Every leg below is timeout-guarded: getUser, the insert, and the batch RPC
  // can each implicitly trigger a token refresh that, if it stalls, hangs the
  // Save button forever (see withTimeout in supabase.js). On timeout the promise
  // rejects and SaveToLibraryButton's catch/finally re-enables the button and
  // surfaces the error instead of wedging.
  const { data: { user } } = await withTimeout(supabase.auth.getUser(), 15000, 'Authentication check');
  if (!user) throw new Error('Not authenticated');

  const v2 = migrateSaveToV2(entry);
  const settlement = withNeighbourNetworkFromRelationship(v2.settlement);

  // Bidirectional neighbour link: if this settlement was generated against an
  // existing save, both rows must reference each other. That needs a multi-row
  // write, so we pre-mint the id, compute both sides, and create+update
  // atomically via the batch RPC. Skipped (single insert) when there's no
  // generated neighbour or no matching active partner.
  if (settlement?.neighborRelationship?.name) {
    const saveId = newSaveId();
    // Targeted single-name lookup instead of a full-table read (see helper).
    const existing = (await fetchActivePartnersByName(settlement.neighborRelationship.name)).filter(isSaveActive);
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
    // When the caller mints a stable id (the interactive Save button), persist it
    // so a timeout-retry can upsert the SAME row instead of duplicating. Absent
    // for other callers (post-login intent, account import), where the DB default
    // generates the id on a plain insert.
    ...(entry.clientSaveId ? { id: entry.clientSaveId } : {}),
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

  // Idempotent retry: with a client-minted id we upsert on the primary key so a
  // save that actually landed server-side just after the client timed out is
  // re-written, not duplicated, when the user retries. Other callers keep a plain
  // insert (DB-generated id). RLS gates on user_id only, so an explicit id is safe;
  // an upsert that resolves to UPDATE does not re-trip the per-tier save-limit.
  const query = entry.clientSaveId
    ? supabase.from('settlements').upsert(row, { onConflict: 'id' }).select('id').single()
    : supabase.from('settlements').insert(row).select('id').single();
  const { data, error } = await withTimeout(query, 20000, 'Save settlement');
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
  const { data, error } = await withTimeout(
    supabase.rpc('mutate_settlement_batch', {
      updates: updates.map(entry => mutationRow(entry)),
      delete_ids: deletes,
      creates: creates.map(entry => mutationRow(migrateSaveToV2(entry))),
    }),
    20000,
    'Save settlement',
  );
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
  return localLoad().map(entry => ({ accessState: ACTIVE_SAVE_STATE, ...entry })).map(migrateSaveToV2).map(migrateSettlementShape);
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
  // String()=== both sides: a numeric local id round-tripped as a string (route
  // param, JSON re-parse, a caller that String()s the id) must still match, or the
  // update silently no-ops ("my edit didn't save"). Mirrors the other methods here.
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

/**
 * Batch-write the full saves array (local mode only). Retained as part of the
 * local-backend API surface (exercised by saves.smoke.test.js) and exposed as
 * `null` in supabase mode so callers can branch on backend capability.
 */
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
  save:     isConfigured ? supabaseSave     : localSaveEntry,
  update:   isConfigured ? supabaseUpdate   : localUpdate,
  delete:   isConfigured ? supabaseDelete   : localDelete,
  count:    isConfigured ? supabaseCount    : localCount,
  reactivateFreeSettlement: isConfigured ? supabaseReactivateFreeSettlement : localReactivateFreeSettlement,
  mutateBatch: isConfigured ? supabaseMutateBatch : localMutateBatch,
  /** Write entire saves array — local-only API surface (null in supabase mode). */
  writeAll: isConfigured ? null             : localWriteAll,
  isConfigured,
};

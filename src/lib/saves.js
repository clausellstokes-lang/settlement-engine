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
import { normalizeSettlement } from '../domain/normalizeSettlement.js';
import { ACTIVE_SAVE_STATE, activeSaveCount } from './saveAccess.js';

const LOCAL_KEY = 'dnd_settlement_saves';

// ── Local storage helpers ───────────────────────────────────────────────────

function localLoad() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; }
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
    .select('id, name, tier, data, config, toggles, seed, neighbour_links, ai_data, campaign_state, version_history, access_state, inactive_reason, inactive_since, retention_expires_at, reactivated_free_at, created_at, updated_at')
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

async function supabaseSave(entry) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const v2 = migrateSaveToV2(entry);
  const row = {
    user_id:         user.id,
    name:            v2.name,
    tier:            v2.tier,
    data:            v2.settlement,
    config:          v2.config || null,
    toggles:         bundleToggles(v2),
    seed:            v2.seed || null,
    neighbour_links: v2.settlement?.neighbourNetwork || null,
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
  const saves = localLoad();
  const id = v2.id || Date.now();
  saves.unshift({ ...v2, id, savedAt: Date.now() });
  localWrite(saves);
  return id;
}

async function localUpdate(id, partial) {
  const saves = localLoad();
  const idx = saves.findIndex(s => s.id === id);
  if (idx !== -1) {
    Object.assign(saves[idx], partial);
    localWrite(saves);
  }
}

async function localDelete(id) {
  localWrite(localLoad().filter(s => s.id !== id));
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

// ── Exported API ────────────────────────────────────────────────────────────

export const saves = {
  list:     isConfigured ? supabaseList     : localList,
  save:     isConfigured ? supabaseSave     : localSaveEntry,
  update:   isConfigured ? supabaseUpdate   : localUpdate,
  delete:   isConfigured ? supabaseDelete   : localDelete,
  count:    isConfigured ? supabaseCount    : localCount,
  reactivateFreeSettlement: isConfigured ? supabaseReactivateFreeSettlement : localReactivateFreeSettlement,
  /** Write entire saves array — only available in local mode. */
  writeAll: isConfigured ? null             : localWriteAll,
  isConfigured,
};

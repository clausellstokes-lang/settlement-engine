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

// ── Supabase methods ────────────────────────────────────────────────────────

async function supabaseList() {
  const { data, error } = await supabase
    .from('settlements')
    .select('id, name, tier, data, config, toggles, seed, neighbour_links, created_at, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id:        row.id,
    name:      row.name,
    tier:      row.tier,
    timestamp: row.updated_at,
    savedAt:   new Date(row.updated_at).getTime(),
    settlement: row.data,
    config:    row.config,
    ...spreadToggles(row.toggles),
    seed:      row.seed,
  }));
}

async function supabaseSave(entry) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const row = {
    user_id:         user.id,
    name:            entry.name,
    tier:            entry.tier,
    data:            entry.settlement,
    config:          entry.config || null,
    toggles:         bundleToggles(entry),
    seed:            entry.seed || null,
    neighbour_links: entry.settlement?.neighbourNetwork || null,
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
    .select('id', { count: 'exact', head: true });
  if (error) throw error;
  return count || 0;
}

// ── Local methods ───────────────────────────────────────────────────────────

async function localList() {
  return localLoad();
}

async function localSaveEntry(entry) {
  const saves = localLoad();
  const id = entry.id || Date.now();
  saves.unshift({ ...entry, id, savedAt: Date.now() });
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
  return localLoad().length;
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
  /** Write entire saves array — only available in local mode. */
  writeAll: isConfigured ? null             : localWriteAll,
  isConfigured,
};

/**
 * mapSaves.js — Campaign / saved map persistence layer.
 *
 * CRUD for the saved_maps table. Each saved map (campaign) captures:
 *   - Map seed (for FMG reproducibility)
 *   - Burg↔settlement mappings
 *   - Supply chain overlay configuration
 *   - Arbitrary map_data for future expansion
 *
 * Falls back to localStorage when Supabase is not configured.
 */

import { supabase, isConfigured } from './supabase.js';

const LOCAL_KEY = 'sf_saved_maps';

// ── Local storage helpers ───────────────────────────────────────────────────

function localLoad() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; }
}

function localWrite(maps) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(maps));
}

// ── Supabase methods ────────────────────────────────────────────────────────

async function supabaseList() {
  const { data, error } = await supabase
    .from('saved_maps')
    .select('id, name, map_seed, map_data, burg_settlement_map, supply_chain_config, created_at, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(row => ({
    id:                row.id,
    name:              row.name,
    mapSeed:           row.map_seed,
    mapData:           row.map_data || {},
    burgSettlementMap: row.burg_settlement_map || {},
    supplyChainConfig: row.supply_chain_config || [],
    createdAt:         row.created_at,
    updatedAt:         row.updated_at,
  }));
}

async function supabaseSave(entry) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const row = {
    user_id:              user.id,
    name:                 entry.name,
    map_seed:             entry.mapSeed || null,
    map_data:             entry.mapData || {},
    burg_settlement_map:  entry.burgSettlementMap || {},
    supply_chain_config:  entry.supplyChainConfig || [],
  };

  const { data, error } = await supabase
    .from('saved_maps')
    .insert(row)
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

async function supabaseUpdate(id, partial) {
  const updates = {};
  if (partial.name !== undefined)              updates.name = partial.name;
  if (partial.mapSeed !== undefined)           updates.map_seed = partial.mapSeed;
  if (partial.mapData !== undefined)           updates.map_data = partial.mapData;
  if (partial.burgSettlementMap !== undefined)  updates.burg_settlement_map = partial.burgSettlementMap;
  if (partial.supplyChainConfig !== undefined)  updates.supply_chain_config = partial.supplyChainConfig;

  if (Object.keys(updates).length === 0) return;
  const { error } = await supabase.from('saved_maps').update(updates).eq('id', id);
  if (error) throw error;
}

async function supabaseDelete(id) {
  const { error } = await supabase.from('saved_maps').delete().eq('id', id);
  if (error) throw error;
}

// ── Local methods ───────────────────────────────────────────────────────────

async function localList() {
  return localLoad();
}

async function localSave(entry) {
  const maps = localLoad();
  const id = entry.id || `local_${Date.now()}`;
  maps.unshift({ ...entry, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  localWrite(maps);
  return id;
}

async function localUpdate(id, partial) {
  const maps = localLoad();
  const idx = maps.findIndex(m => m.id === id);
  if (idx !== -1) {
    Object.assign(maps[idx], partial, { updatedAt: new Date().toISOString() });
    localWrite(maps);
  }
}

async function localDelete(id) {
  localWrite(localLoad().filter(m => m.id !== id));
}

// ── Exported API ────────────────────────────────────────────────────────────

export const mapSaves = {
  list:   isConfigured ? supabaseList   : localList,
  save:   isConfigured ? supabaseSave   : localSave,
  update: isConfigured ? supabaseUpdate : localUpdate,
  delete: isConfigured ? supabaseDelete : localDelete,
  isConfigured,
};

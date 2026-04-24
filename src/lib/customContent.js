/**
 * customContent.js — Custom content persistence service.
 *
 * Mirrors the pattern from saves.js: dual-backend with Supabase when
 * configured, localStorage fallback otherwise. The service is category-
 * aware so the slice can fetch grouped sets in one call.
 *
 * Premium gate is enforced at the slice/UI layer — this service has no
 * opinion about who is allowed to read/write. Free users with grandfathered
 * local items still load through `localList()`.
 */

import { supabase, isConfigured } from './supabase.js';

const LOCAL_KEY = 'sf_custom_content';

// ── Local storage helpers ───────────────────────────────────────────────────

function localLoadAll() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
  } catch { return {}; }
}

function localWriteAll(content) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(content));
}

function makeId(category) {
  return `${category.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

const EMPTY_CONTENT = {
  institutions: [],
  resources: [],
  stressors: [],
  tradeGoods: [],
  tradeRoutes: [],
  powerPresets: [],
  defensePresets: [],
};

// ── Supabase methods ────────────────────────────────────────────────────────

async function supabaseList() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ...EMPTY_CONTENT };

  const { data, error } = await supabase
    .from('custom_content')
    .select('id, category, data, created_at, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;

  const grouped = { ...EMPTY_CONTENT };
  for (const row of data || []) {
    if (!grouped[row.category]) grouped[row.category] = [];
    grouped[row.category].push({
      ...row.data,
      id: row.id,
      isCustom: true,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
  return grouped;
}

async function supabaseAdd(category, item) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Strip metadata fields from the item before storing — those live in columns
  const { id: _id, createdAt: _c, updatedAt: _u, isCustom: _ic, ...payload } = item;

  const { data, error } = await supabase
    .from('custom_content')
    .insert({ user_id: user.id, category, data: payload })
    .select('id, created_at, updated_at')
    .single();
  if (error) throw error;
  return {
    ...payload,
    id: data.id,
    isCustom: true,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

async function supabaseUpdate(id, partial) {
  // Strip metadata that lives in columns (don't store in `data`)
  const { id: _id, createdAt: _c, updatedAt: _u, isCustom: _ic, ...payload } = partial;
  const { data, error } = await supabase
    .from('custom_content')
    .update({ data: payload })
    .eq('id', id)
    .select('updated_at')
    .single();
  if (error) throw error;
  return { id, updatedAt: data.updated_at };
}

async function supabaseDelete(id) {
  const { error } = await supabase.from('custom_content').delete().eq('id', id);
  if (error) throw error;
}

async function supabaseBulkInsert(items) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  if (!items?.length) return [];

  const rows = items
    .filter(({ category, item }) => category && item)
    .map(({ category, item }) => {
      const { id: _id, createdAt: _c, updatedAt: _u, isCustom: _ic, ...payload } = item;
      return { user_id: user.id, category, data: payload };
    });

  if (!rows.length) return [];

  const { data, error } = await supabase
    .from('custom_content')
    .insert(rows)
    .select('id, category, data, created_at, updated_at');
  if (error) throw error;

  return data.map(row => ({
    category: row.category,
    item: {
      ...row.data,
      id: row.id,
      isCustom: true,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
  }));
}

// ── Local methods ───────────────────────────────────────────────────────────

async function localList() {
  const raw = localLoadAll();
  return { ...EMPTY_CONTENT, ...raw };
}

async function localAdd(category, item) {
  const all = await localList();
  const entry = {
    ...item,
    id: makeId(category),
    isCustom: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  all[category] = [entry, ...(all[category] || [])];
  localWriteAll(all);
  return entry;
}

async function localUpdate(id, partial) {
  const all = await localList();
  for (const cat of Object.keys(all)) {
    const idx = all[cat].findIndex(x => x.id === id);
    if (idx !== -1) {
      Object.assign(all[cat][idx], partial, { updatedAt: new Date().toISOString() });
      localWriteAll(all);
      return { id, updatedAt: all[cat][idx].updatedAt };
    }
  }
  return null;
}

async function localDelete(id) {
  const all = await localList();
  for (const cat of Object.keys(all)) {
    all[cat] = all[cat].filter(x => x.id !== id);
  }
  localWriteAll(all);
}

async function localClear() {
  localWriteAll({});
}

/** One-shot read of localStorage as a flat list — used for migration to cloud. */
function readLocalForMigration() {
  const raw = localLoadAll();
  const out = [];
  for (const [category, items] of Object.entries(raw)) {
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      out.push({ category, item });
    }
  }
  return out;
}

// ── Exported API ────────────────────────────────────────────────────────────

export const customContentService = {
  list:        isConfigured ? supabaseList   : localList,
  add:         isConfigured ? supabaseAdd    : localAdd,
  update:      isConfigured ? supabaseUpdate : localUpdate,
  delete:      isConfigured ? supabaseDelete : localDelete,
  bulkInsert:  isConfigured ? supabaseBulkInsert : null,
  // Local-only helpers (always available)
  localList,
  localClear,
  readLocalForMigration,
  isConfigured,
};

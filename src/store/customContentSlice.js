/**
 * customContentSlice — User-created custom content persistence.
 *
 * Stores custom institutions, resources, stressors, trade goods,
 * trade routes, power presets, and defense presets.
 *
 * Storage rules:
 *   - Premium users: cloud-synced via Supabase (custom_content table).
 *   - Free / anon users: read-only of grandfathered localStorage items
 *     (any items they created before the gate landed). Cannot create new.
 *   - Developers / admins: full CRUD access (cloud).
 *
 * On sign-in as premium, any local items are migrated to the cloud once,
 * tagged via a user-scoped migrated flag in localStorage so the push only
 * happens once per account/device.
 */

import { customContentService } from '../lib/customContent.js';
import { migrateCustomContent } from '../domain/customContentMigrations.js';

const LOCAL_KEY = 'sf_custom_content';
const LOCAL_KEY_PREFIX = 'sf_custom_content:';
const MIGRATED_FLAG_PREFIX = 'sf_custom_content_migrated:';

function scopedLocalKey(ownerId = 'anon') {
  const owner = String(ownerId || 'anon');
  if (owner === 'anon') return LOCAL_KEY;
  return `${LOCAL_KEY_PREFIX}${owner.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

function migrationFlag(ownerId = 'anon') {
  return `${MIGRATED_FLAG_PREFIX}${String(ownerId || 'anon').replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

function ownerIdFromState(state) {
  return state?.auth?.user?.id ? String(state.auth.user.id) : 'anon';
}

function localLoad(ownerId = 'anon') {
  try {
    return JSON.parse(localStorage.getItem(scopedLocalKey(ownerId)) || '{}');
  } catch { return {}; }
}

function localWrite(content, ownerId = 'anon') {
  localStorage.setItem(scopedLocalKey(ownerId), JSON.stringify(content));
}

function flattenLocalContent(ownerId = 'anon') {
  const raw = localLoad(ownerId);
  const out = [];
  for (const [category, items] of Object.entries(raw)) {
    if (!Array.isArray(items)) continue;
    for (const item of items) out.push({ category, item });
  }
  return out;
}

const EMPTY = {
  institutions: [],
  services: [],
  resources: [],
  stressors: [],
  tradeGoods: [],
  factions: [],
  supplyChains: [],
  tradeRoutes: [],
  powerPresets: [],
  defensePresets: [],
};

/**
 * Ensure every item in a category bucket has a stable `localUid`. Mutates
 * in place. Called when hydrating from local or cloud so older rows get a
 * deterministic ref id derived from their existing `id`.
 */
function backfillLocalUids(grouped) {
  if (!grouped || typeof grouped !== 'object') return grouped;
  for (const cat of Object.keys(grouped)) {
    const arr = grouped[cat];
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      if (item && !item.localUid) {
        // Derive from id when present so the same row gets the same uid on
        // subsequent loads. Prefix with `bf_` to distinguish from fresh uids.
        item.localUid = item.id ? `bf_${item.id}` : `lu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      }
    }
  }
  return grouped;
}

function loadAll(ownerId = 'anon') {
  const raw = localLoad(ownerId);
  return backfillLocalUids(migrateCustomContent({ ...EMPTY, ...raw }));
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Stable uid that survives Supabase round-trip.
 *
 * The Supabase row's `id` column is rewritten from a local string to a cloud
 * UUID after `add()` resolves — that breaks any dependency reference stored
 * by `id`. `localUid` lives inside the JSONB body, so it stays put. Used by
 * the customRegistry resolver as the canonical reference for custom items.
 */
function makeLocalUid() {
  return `lu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export const createCustomContentSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  customContent: loadAll('anon'),
  customContentLoading: false,
  customContentError: null,
  customContentSyncedAt: null,    // timestamp of last successful cloud load

  // ── Generic CRUD ──────────────────────────────────────────────────────────
  // These run optimistically against local state and fire-and-forget the cloud
  // sync when premium. UI surfaces errors via customContentError.

  /** Add a custom item to a category. */
  addCustomItem: (category, item) => {
    // Optimistic local insert
    const entry = {
      ...item,
      id: makeId(category.slice(0, 4)),
      // Stable cross-cloud reference id — never reassigned. Preserved if the
      // caller already supplied one (unlikely outside of test fixtures).
      localUid: item?.localUid || makeLocalUid(),
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(state => {
      state.customContent[category].unshift(entry);
      localWrite(state.customContent, ownerIdFromState(state));
    });
    // Cloud write (premium / elevated only)
    if (get().canUseCustomContent?.() && customContentService.isConfigured) {
      customContentService.add(category, entry).then(saved => {
        // Replace local id with cloud id so subsequent updates target the right row
        set(state => {
          const idx = state.customContent[category].findIndex(x => x.id === entry.id);
          if (idx !== -1) {
            state.customContent[category][idx] = saved;
            localWrite(state.customContent, ownerIdFromState(state));
          }
        });
      }).catch(err => {
        console.error('customContent.add failed:', err);
        set(state => { state.customContentError = err.message; });
      });
    }
  },

  /** Update a custom item. */
  updateCustomItem: (category, id, partial) => {
    set(state => {
      const list = state.customContent[category];
      const idx = list.findIndex(x => x.id === id);
      if (idx !== -1) {
        Object.assign(list[idx], partial, { updatedAt: new Date().toISOString() });
        localWrite(state.customContent, ownerIdFromState(state));
      }
    });
    if (get().canUseCustomContent?.() && customContentService.isConfigured) {
      // Send the updated full item (cloud stores the whole jsonb body)
      const updated = get().customContent[category].find(x => x.id === id);
      if (updated) {
        customContentService.update(id, updated).catch(err => {
          console.error('customContent.update failed:', err);
          set(state => { state.customContentError = err.message; });
        });
      }
    }
  },

  /** Delete a custom item. */
  deleteCustomItem: (category, id) => {
    set(state => {
      state.customContent[category] = state.customContent[category].filter(x => x.id !== id);
      localWrite(state.customContent, ownerIdFromState(state));
    });
    if (get().canUseCustomContent?.() && customContentService.isConfigured) {
      customContentService.delete(id).catch(err => {
        console.error('customContent.delete failed:', err);
        set(state => { state.customContentError = err.message; });
      });
    }
  },

  /** Get all items in a category. */
  getCustomItems: (category) => {
    return get().customContent[category] || [];
  },

  /** Count items across all categories. */
  getCustomContentCount: () => {
    const cc = get().customContent;
    return Object.values(cc).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  },

  // ── Cloud sync ─────────────────────────────────────────────────────────────

  /**
   * Hydrate customContent from the cloud (premium / elevated only).
   * Call this after auth state resolves to a premium user.
   */
  loadCustomContentFromCloud: async () => {
    if (!customContentService.isConfigured) return;
    if (!get().canUseCustomContent?.()) return;
    const ownerId = ownerIdFromState(get());
    set(state => { state.customContentLoading = true; state.customContentError = null; });
    try {
      const grouped = await customContentService.list();
      const merged = backfillLocalUids(migrateCustomContent({ ...EMPTY, ...grouped }));
      if (ownerIdFromState(get()) !== ownerId) return;
      set(state => {
        state.customContent = merged;
        state.customContentLoading = false;
        state.customContentSyncedAt = new Date().toISOString();
      });
      // Mirror to local for offline read-only access on this device
      localWrite(get().customContent, ownerId);
    } catch (err) {
      console.error('loadCustomContentFromCloud failed:', err);
      set(state => {
        state.customContentLoading = false;
        state.customContentError = err.message;
      });
    }
  },

  /**
   * Migrate localStorage items to the cloud once when a user upgrades to premium.
   * Idempotent — checks the migrated flag first.
   */
  migrateLocalCustomContentToCloud: async () => {
    if (!customContentService.isConfigured) return;
    if (!get().canUseCustomContent?.()) return;
    const ownerId = ownerIdFromState(get());
    const flag = migrationFlag(ownerId);
    if (localStorage.getItem(flag) === '1') return;

    // Grandfathered custom content lives in the ANON bucket (created before sign-in);
    // content authored while signed-in-but-pre-cloud lives in the owner bucket.
    // Read both so grandfathered items actually reach the cloud.
    const anonItems = flattenLocalContent('anon');
    const ownerItems = ownerId === 'anon' ? [] : flattenLocalContent(ownerId);
    const items = [...anonItems, ...ownerItems];
    if (!items.length) {
      localStorage.setItem(flag, '1');
      return;
    }

    try {
      if (customContentService.bulkInsert) {
        const inserted = await customContentService.bulkInsert(items);
        // Reload from cloud to get the canonical state (includes the new uuid ids)
        await get().loadCustomContentFromCloud();
        console.info(`Migrated ${inserted.length} custom items to the cloud.`);
      } else {
        // Service has no bulk method — fall back to per-item add
        for (const { category, item } of items) {
          await customContentService.add(category, item);
        }
        await get().loadCustomContentFromCloud();
      }
      localStorage.setItem(flag, '1');
    } catch (err) {
      console.error('migrateLocalCustomContentToCloud failed:', err);
      set(state => { state.customContentError = err.message; });
    }
  },

  /** Reset slice to local-only state on sign-out. */
  clearCloudCustomContent: () => {
    set(state => {
      state.customContent = loadAll();
      state.customContentLoading = false;
      state.customContentSyncedAt = null;
      state.customContentError = null;
    });
  },
});

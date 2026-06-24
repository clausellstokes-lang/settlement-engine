/**
 * accountImport.js — Hostile-input validation + per-record hardening for the
 * "Import my data" flow (the complement to accountData.downloadAccountExport).
 *
 * The uploaded file is USER-SUPPLIED and treated as HOSTILE: it may be
 * truncated, oversized, the wrong shape, from a newer build, or deliberately
 * tampered to claim another user's ids / publication slugs. This module is the
 * PURE, testable half of the pipeline (no React, no network, no store): it
 * parses, validates fail-closed, and prepares ownership-remapped save entries.
 * The store action `importAccountData` consumes its output and performs the
 * server-authoritative writes (see store/accountImportSlice.js).
 *
 * Security contract (mirrors the gallery single-settlement importer):
 *   • VALIDATE the envelope + version before touching anything; reject
 *     malformed / oversized / wrong-shape / newer-than-this-build with a clear
 *     message. Never partially import garbage.
 *   • MIGRATE old per-settlement shapes forward via normalizeSettlement (which
 *     runs the settlementMigrations chain), exactly as saves.js does on every
 *     read/write. A throwing record is DROPPED with a notice, never aborts.
 *   • REMAP ALL OWNERSHIP to the importing user: the prepared entry carries NO
 *     id, user_id, owner field, public_slug, is_public or gallery flag. The
 *     server stamps the owner on insert and mints the row id.
 *   • Strip cross-settlement refs + every generation seed (the exact scrub the
 *     gallery importer applies) so an imported copy lands DORMANT and can't
 *     re-wire into the importer's unrelated saves or resurrect foreign content.
 */

import { ACCOUNT_EXPORT_VERSION } from './accountData.js';
import { normalizeSettlement } from '../domain/normalizeSettlement.js';

/**
 * Hard read cap (bytes). Well above any legitimate export — a free user holds 3
 * settlements; even a large premium library is far under this. Anything bigger
 * is rejected before parse to bound DoS surface.
 */
export const MAX_IMPORT_BYTES = 5 * 1024 * 1024; // 5 MB

/** Upper bound on record counts, to bound work before the pipeline runs. */
export const MAX_IMPORT_SETTLEMENTS = 1000;
export const MAX_IMPORT_CAMPAIGNS = 1000;

/**
 * Parse + validate the import envelope, fail-closed. Returns a discriminated
 * result rather than throwing, so the UI can surface the specific message in a
 * role="alert" block.
 *
 * @param {string} text raw file contents (already size-checked by the caller)
 * @returns {{ ok: true, value: { version: number, settlements: any[], campaigns: any[] } }
 *          | { ok: false, error: string }}
 */
export function validateAccountImport(text) {
  if (typeof text !== 'string' || text.length === 0) {
    return { ok: false, error: 'This file is empty.' };
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "This file isn't valid JSON. Choose an export file downloaded from SettlementForge." };
  }

  // Top-level must be a plain object (not an array / primitive / null).
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: "This file isn't a SettlementForge export." };
  }

  // Version must be a finite number; a newer envelope has NO down-migration, so
  // reject it rather than guess at a shape this build can't read.
  if (!Number.isFinite(parsed.version)) {
    return { ok: false, error: "This file is missing its version and may not be a SettlementForge export." };
  }
  if (parsed.version > ACCOUNT_EXPORT_VERSION) {
    return { ok: false, error: 'This file is from a newer version of SettlementForge. Update the app to import it.' };
  }

  // settlements / campaigns must be arrays; missing defaults to empty. Any other
  // shape (object, string) is rejected — we never coerce unknown shapes.
  const settlements = parsed.settlements === undefined ? [] : parsed.settlements;
  const campaigns = parsed.campaigns === undefined ? [] : parsed.campaigns;
  if (!Array.isArray(settlements) || !Array.isArray(campaigns)) {
    return { ok: false, error: "This file's contents are not in the expected shape." };
  }

  // Bound the work before anything downstream touches the records.
  if (settlements.length > MAX_IMPORT_SETTLEMENTS) {
    return { ok: false, error: 'This file holds too many settlements to import at once.' };
  }
  if (campaigns.length > MAX_IMPORT_CAMPAIGNS) {
    return { ok: false, error: 'This file holds too many campaigns to import at once.' };
  }

  // NOTE: `profile` is intentionally NOT trusted or returned. It is display-only
  // in the export and must never set tier / role / identity on import.
  return { ok: true, value: { version: parsed.version, settlements, campaigns } };
}

/**
 * Canonicalize + harden ONE raw settlement save envelope into a fresh,
 * ownership-remapped save entry — the multi-record sibling of the scrub
 * `importGallerySettlement` performs (campaignSlice.js).
 *
 * Fail-closed per record: a malformed entry or a settlement that throws while
 * normalizing returns `{ ok: false }` so the batch can DROP it with a notice
 * rather than abort. The returned entry deliberately carries NO id / user_id /
 * owner / publication field — the server stamps the owner and mints the id.
 *
 * @param {any} rawEntry one element of the export's `settlements` array
 * @param {{ sourceName?: string|null, importedAt?: string }} [meta]
 * @returns {{ ok: true, entry: object } | { ok: false, reason: string }}
 */
export function prepareSettlementEntry(rawEntry, meta = {}) {
  if (!rawEntry || typeof rawEntry !== 'object' || Array.isArray(rawEntry)) {
    return { ok: false, reason: 'Not a settlement record.' };
  }
  const rawSettlement = rawEntry.settlement;
  if (!rawSettlement || typeof rawSettlement !== 'object' || Array.isArray(rawSettlement)) {
    return { ok: false, reason: 'Missing settlement data.' };
  }

  // Migrate-forward + canonicalize. normalizeSettlement runs the migration chain
  // (forward-version guard included) as its final step; a record this build
  // can't read throws and is dropped, never mis-migrated into the library.
  let normalized;
  try {
    normalized = normalizeSettlement(rawSettlement);
  } catch {
    return { ok: false, reason: 'Could not read this settlement (unsupported shape).' };
  }

  const importedAt = meta.importedAt || new Date().toISOString();
  const sourceName = meta.sourceName || null;
  const displayName = (typeof rawEntry.name === 'string' && rawEntry.name.trim())
    || (typeof rawSettlement.name === 'string' && rawSettlement.name.trim())
    || 'Imported settlement';

  // Strip cross-settlement refs + EVERY generation seed + the religion embed
  // bridge — the exact scrub from importGallerySettlement (campaignSlice.js
  // L470–489). An imported copy must arrive DORMANT: it can't re-wire neighbour
  // back-links into the importer's saves, and can't regenerate the unsanitized
  // original via the deterministic engine.
  const config = normalized.config
    ? (() => {
        // eslint-disable-next-line no-unused-vars -- intentional drop of seed + deity bridge
        const { _seed, primaryDeityRef, primaryDeitySnapshot, ...rest } = normalized.config;
        return rest;
      })()
    : normalized.config;

  const settlement = {
    ...normalized,
    neighbourNetwork: [],
    neighborRelationship: null,
    interSettlementRelationships: [],
    _seed: undefined,
    config,
    importedFrom: { source: 'account-export', sourceName, importedAt },
  };

  // The entry handed to savesService.save. NO id / user_id / owner / public_slug
  // / is_public / gallery flag is carried — the server stamps the owner on
  // insert (014 trigger gates the slot), so import is additive + ownership-safe.
  const entry = {
    name: displayName,
    tier: typeof rawEntry.tier === 'string' ? rawEntry.tier : rawSettlement.tier,
    settlement,
    config: null,
    seed: null,
    aiData: {},
    // Don't trust embedded world-state wiring across an import boundary; reset
    // to a clean draft (matches the gallery importer's campaignState).
    campaignState: { phase: 'draft', eventLog: [] },
    versionHistory: [],
  };

  return { ok: true, entry };
}

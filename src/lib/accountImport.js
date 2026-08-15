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

import { scrubImportedConfig } from './importScrub.js';
import {
  validateCustomContentArchive,
} from './customContentArchive.js';
import {
  parseContentJson,
} from '../domain/content/contentFingerprint.js';
import {
  ACCOUNT_EXPORT_VERSION,
  MAX_IMPORT_BYTES,
  MAX_IMPORT_CAMPAIGNS,
  MAX_IMPORT_SETTLEMENTS,
  accountTransferByteLength,
} from './accountTransferContract.js';

export {
  MAX_IMPORT_BYTES,
  MAX_IMPORT_CAMPAIGNS,
  MAX_IMPORT_SETTLEMENTS,
};

/**
 * normalizeSettlement wraps the ~30 kB settlement-migration closure — only ever
 * exercised once the user is actively importing. The store action now loads
 * the whole import body lazily; this second boundary keeps the migration graph
 * deferred within that body until validation has accepted an import attempt.
 * prepareSettlementEntry stays a SYNCHRONOUS pure function reading the memoized
 * ref, and the async caller awaits ensureNormalizeLoaded() once before its loop.
 */
let _normalize = null;
export async function ensureNormalizeLoaded() {
  if (!_normalize) {
    _normalize = (await import('../domain/normalizeSettlement.js')).normalizeSettlement;
  }
  return _normalize;
}

/**
 * The shared hard read cap is large enough for the independently bounded
 * 16 MiB constitutional archive plus ordinary settlement/campaign data.
 * Anything larger is rejected before parse to bound memory and validation work.
 */
/**
 * Parse + validate the import envelope, fail-closed. Returns a discriminated
 * result rather than throwing, so the UI can surface the specific message in a
 * role="alert" block.
 *
 * @param {string} text raw file contents (already size-checked by the caller)
 * @returns {{ ok: true, value: {
 *   version: number,
 *   settlements: any[],
 *   campaigns: any[],
 *   customContentArchive: object|null,
 *   customContentPack: object|null,
 * } }
 *          | {
 *              ok: false,
 *              error: string,
 *              failureKind?: 'json_boundary_invalid',
 *            }}
 */
export function validateAccountImport(text) {
  if (typeof text !== 'string' || text.length === 0) {
    return { ok: false, error: 'This file is empty.' };
  }
  if (accountTransferByteLength(text) > MAX_IMPORT_BYTES) {
    return {
      ok: false,
      error: 'This file is too large to import safely.',
    };
  }

  let parsed;
  try {
    parsed = parseContentJson(text);
  } catch (error) {
    if (
      error instanceof Error
      && error.message.includes('ambiguous object keys')
    ) {
      return {
        ok: false,
        error:
          'This file contains ambiguous duplicate fields and cannot be imported safely.',
        failureKind: 'json_boundary_invalid',
      };
    }
    return {
      ok: false,
      error: "This file isn't valid JSON. Choose an export file downloaded from SettlementForge.",
      failureKind: 'json_boundary_invalid',
    };
  }

  // Top-level must be a plain object (not an array / primitive / null).
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: "This file isn't a SettlementForge export." };
  }
  const envelope = /** @type {Record<string, any>} */ (parsed);

  // Version must be a finite number; a newer envelope has NO down-migration, so
  // reject it rather than guess at a shape this build can't read.
  if (
    !Number.isInteger(envelope.version)
    || envelope.version < 1
  ) {
    return { ok: false, error: "This file is missing its version and may not be a SettlementForge export." };
  }
  if (envelope.version > ACCOUNT_EXPORT_VERSION) {
    return { ok: false, error: 'This file is from a newer version of SettlementForge. Update the app to import it.' };
  }

  // settlements / campaigns must be arrays; missing defaults to empty. Any other
  // shape (object, string) is rejected — we never coerce unknown shapes.
  const settlements = envelope.settlements === undefined
    ? []
    : envelope.settlements;
  const campaigns = envelope.campaigns === undefined
    ? []
    : envelope.campaigns;
  if (!Array.isArray(settlements) || !Array.isArray(campaigns)) {
    return { ok: false, error: "This file's contents are not in the expected shape." };
  }
  const customContentPack = envelope.customContentPack == null
    ? null
    : envelope.customContentPack;
  const customContentArchive = envelope.customContentArchive == null
    ? null
    : envelope.customContentArchive;
  if (
    customContentPack != null
    && (
      typeof customContentPack !== 'object'
      || Array.isArray(customContentPack)
    )
  ) {
    return {
      ok: false,
      error: "This file's custom content is not in the expected shape.",
    };
  }
  if (
    customContentArchive != null
    && (
      typeof customContentArchive !== 'object'
      || Array.isArray(customContentArchive)
    )
  ) {
    return {
      ok: false,
      error: "This file's custom-content archive is not in the expected shape.",
    };
  }
  if (customContentArchive && customContentPack) {
    return {
      ok: false,
      error: 'This file carries two competing custom-content sources.',
    };
  }
  if (customContentArchive && envelope.version < 3) {
    return {
      ok: false,
      error: 'This older account-export version cannot carry a custom-content archive.',
    };
  }
  if (customContentPack && envelope.version >= 3) {
    return {
      ok: false,
      error: 'This account-export version requires the full custom-content archive format.',
    };
  }
  let admittedCustomContentArchive = null;
  if (customContentArchive) {
    const archiveAdmission = validateCustomContentArchive(customContentArchive);
    if (archiveAdmission.ok === false) {
      return {
        ok: false,
        error: `This file's custom-content archive is invalid: ${
          archiveAdmission.message || archiveAdmission.reason
        }`,
      };
    }
    admittedCustomContentArchive = archiveAdmission.archive;
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
  return {
    ok: true,
    value: {
      version: envelope.version,
      settlements,
      campaigns,
      customContentArchive: admittedCustomContentArchive,
      customContentPack,
    },
  };
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
 * @param {{
 *   sourceName?: string|null,
 *   importedAt?: string|null,
 *   sourceChecksum?: string|null,
 *   sourceId?: string|null,
 * }} [meta]
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
  // can't read throws and is dropped, never mis-migrated into the library. The
  // caller (importAccountData) awaits ensureNormalizeLoaded() before this loop,
  // so the lazily-imported ref is populated; a null ref throws here and is caught
  // as an unsupported-shape drop — fail-closed, same as any migration throw.
  let normalized;
  try {
    normalized = _normalize(rawSettlement);
  } catch {
    return { ok: false, reason: 'Could not read this settlement (unsupported shape).' };
  }

  // Reconciliation sessions pass an explicit null so their normalized command
  // input is deterministic across re-runs. The existing direct-account import
  // path omits the field and keeps its historical "time of import" stamp.
  const importedAt = Object.hasOwn(meta, 'importedAt')
    ? (meta.importedAt || null)
    : new Date().toISOString();
  const sourceName = meta.sourceName || null;
  const displayName = (typeof rawEntry.name === 'string' && rawEntry.name.trim())
    || (typeof rawSettlement.name === 'string' && rawSettlement.name.trim())
    || 'Imported settlement';

  // Strip cross-settlement refs + EVERY generation seed + the religion/faith embed
  // bridge — the SAME single-writer scrub the gallery importer applies. An imported
  // copy must arrive DORMANT: it can't re-wire neighbour back-links into the
  // importer's saves, can't regenerate the unsanitized original via the deterministic
  // engine, and (store-4) carries no cultDeitySnapshots / faithProfile that would
  // activate the religion subsystem with a foreign pantheon.
  const config = scrubImportedConfig(normalized.config);

  const settlement = {
    ...normalized,
    neighbourNetwork: [],
    neighborRelationship: null,
    interSettlementRelationships: [],
    _seed: undefined,
    config,
    importedFrom: {
      source: 'account-export',
      sourceName,
      importedAt,
      ...(meta.sourceChecksum ? { sourceChecksum: meta.sourceChecksum } : {}),
      ...(meta.sourceId ? { sourceId: String(meta.sourceId) } : {}),
    },
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

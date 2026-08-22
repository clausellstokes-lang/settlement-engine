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
 *
 * THE SURFACE IS THE PROVENANCE (§359.10, closing §66.4's owner-gated Q4).
 * Two surfaces read the same bytes and mean different things:
 *   • GALLERY import (a stranger's published world) keeps the distrust reset
 *     verbatim — it lives in store/galleryImportSettlement.js and this module
 *     does not touch it.
 *   • ACCOUNT import ("Import my data") is the user's OWN exporter-produced
 *     estate, internally consistent, and the reset there destroys their own
 *     lived history on their own transfer. That surface RESTORES
 *     `campaignState.phase`, `campaignState.eventLog`, `versionHistory` and
 *     `aiData` — ADMISSION-WALLED PER FIELD, FAIL CLOSED PER FIELD: each field
 *     passes the live save-admission wall (lib/saveAdmission.js, the same
 *     validator every read path runs) and a field that fails falls back to the
 *     RESET value for that field alone, with a surfaced per-item notice. Never
 *     a silent partial; never a whole-file rejection for one bad field.
 *
 * Restore is OPT-IN (`meta.restoreLifecycle`). The default is the historical
 * reset, so the OTHER caller of prepareSettlementEntry — the import
 * reconciliation slice, whose admission machinery declares campaignState /
 * aiData / versionHistory UNSUPPORTED on its own boundary
 * (importReconciliationAdmission.js) — keeps its contract byte-identically.
 *
 * What is NEVER restored on either surface: `id` / `user_id` / owner /
 * `public_slug` / `is_public` / gallery flags (the server stamps ownership —
 * the 014 trigger), `serviceRecords` (importable:false is the contract), and
 * the `_seed` / `scrubImportedConfig` dormancy strip. Cross-settlement wiring
 * is re-addressed ONLY intra-envelope, after the batch's fresh ids are known
 * (restoreIntraEnvelopeWiring below); `neighborRelationship` stays null so the
 * save path can never name-match an imported settlement onto an unrelated save
 * already in the importer's library.
 */

import { scrubImportedConfig } from './importScrub.js';
import { admitSavedSettlementEntries } from './saveAdmission.js';
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

/** @param {unknown} value @returns {value is Record<string, any>} */
function isPlainRecord(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * The distrust reset — the exact triple both import surfaces have always
 * written. A FACTORY rather than a frozen constant: the entry it seeds is
 * handed to the store and to migrateSaveToV2, both of which expect ordinary
 * mutable objects, and every call site historically built its own.
 */
function resetLifecycle() {
  return {
    aiData: {},
    campaignState: { phase: 'draft', eventLog: [] },
    versionHistory: [],
  };
}

/**
 * Run ONE candidate save envelope through the LIVE save-admission wall — the
 * same `admitSavedSettlementEntries` every Supabase and local read path runs
 * (lib/saves.js). Nothing restored reaches the store without passing it.
 *
 * @param {Record<string, any>} candidate
 * @returns {boolean}
 */
function passesSaveAdmission(candidate) {
  const { entries } = admitSavedSettlementEntries(
    [{ id: 'account-import-restore-probe', settlement: {}, ...candidate }],
    {
      source: 'account-import-restore',
      requireSettlement: true,
      targetSchemaVersion: null,
    },
  );
  return entries.length === 1;
}

/**
 * Admit the four restorable lifecycle fields from ONE source save row, per
 * field and fail-closed per field.
 *
 * The per-field predicates mirror the live wall's own predicate for each key
 * (`aiData`/`campaignState` records, `versionHistory` array, `campaignState
 * .phase` string). `campaignState.eventLog` is the one field with NO existing
 * validator anywhere in the live modules — measured, not assumed: the import
 * reconciliation machinery carries a NOTICE for it, never a check — so its wall
 * is stated here at the shape the persisted schema declares (`Object[]`) and
 * the readers assume (domain/canonStatus.js, domain/causalViews.js walk the
 * array and read fields off each entry).
 *
 * The whole candidate is re-checked against the live wall before it is
 * returned, so a per-field pass can never assemble an envelope the read path
 * would reject.
 *
 * @param {Record<string, any>} rawEntry one element of the export's `settlements`
 * @returns {{
 *   aiData: Record<string, any>,
 *   campaignState: Record<string, any>,
 *   versionHistory: any[],
 *   notices: Array<{ field: string, reason: string }>,
 * }}
 */
export function admitRestoredLifecycle(rawEntry) {
  const reset = resetLifecycle();
  /** @type {Array<{ field:string, reason:string }>} */
  const notices = [];
  const source = isPlainRecord(rawEntry) ? rawEntry : {};

  // ── aiData ────────────────────────────────────────────────────────────────
  let aiData = reset.aiData;
  if (source.aiData != null) {
    if (isPlainRecord(source.aiData)) {
      aiData = source.aiData;
    } else {
      notices.push({
        field: 'aiData',
        reason: 'Its saved AI prose was not in a readable shape and was not restored.',
      });
    }
  }

  // ── campaignState (container, then phase and eventLog independently) ──────
  let campaignState = reset.campaignState;
  if (source.campaignState != null) {
    if (!isPlainRecord(source.campaignState)) {
      notices.push({
        field: 'campaignState',
        reason: 'Its saved campaign state was not in a readable shape; the settlement was restored as a draft.',
      });
    } else {
      const sourceState = source.campaignState;
      let phase = reset.campaignState.phase;
      if (typeof sourceState.phase === 'string' && sourceState.phase.trim() !== '') {
        phase = sourceState.phase;
      } else if (sourceState.phase != null) {
        notices.push({
          field: 'campaignState.phase',
          reason: 'Its saved campaign phase was not readable; the settlement was restored as a draft.',
        });
      }
      let eventLog = reset.campaignState.eventLog;
      if (sourceState.eventLog != null) {
        if (
          Array.isArray(sourceState.eventLog)
          && sourceState.eventLog.every(isPlainRecord)
        ) {
          eventLog = sourceState.eventLog;
        } else {
          notices.push({
            field: 'campaignState.eventLog',
            reason: 'Its saved event history was not in a readable shape and was not restored.',
          });
        }
      }
      // Everything else the block carries (systemState, locks, the provenance
      // timestamps, narrativeDrift, exportState) is the user's own lived
      // history and is carried whole — narrowing the block here would hand the
      // store a shape no live writer produces.
      campaignState = { ...sourceState, phase, eventLog };
    }
  }

  // ── versionHistory ────────────────────────────────────────────────────────
  let versionHistory = reset.versionHistory;
  if (source.versionHistory != null) {
    if (Array.isArray(source.versionHistory)) {
      versionHistory = source.versionHistory;
    } else {
      notices.push({
        field: 'versionHistory',
        reason: 'Its saved version history was not in a readable shape and was not restored.',
      });
    }
  }

  const candidate = { aiData, campaignState, versionHistory };
  if (!passesSaveAdmission(candidate)) {
    // Belt-and-braces: a per-field pass must never assemble an envelope the
    // read path would reject. Fall all the way back rather than store it.
    return {
      ...resetLifecycle(),
      notices: [...notices, {
        field: 'campaignState',
        reason: 'Its restored campaign data did not pass the save validator; the settlement was restored as a draft.',
      }],
    };
  }
  return { ...candidate, notices };
}

/**
 * The link id an imported bilateral neighbour edge carries after re-addressing.
 *
 * Derived from the ORDERED pair of fresh save ids so BOTH sides of the same
 * edge compute the identical value — the source `linkId` is the join key that
 * ties a neighbourNetwork entry to its interSettlementRelationships rows, and
 * a per-side mint would split that join in half.
 *
 * @param {unknown} left @param {unknown} right
 */
export function importedNeighbourLinkId(left, right) {
  return `link_${[String(left), String(right)].sort().join('_')}`;
}

/**
 * Re-address ONE restored settlement's cross-settlement wiring, INTRA-ENVELOPE
 * ONLY, against the batch's completed old-id → new-id map.
 *
 * Fail-closed by construction: an edge survives only when EVERY save id it
 * carries — the partner id and, when the entry carries canonical direction,
 * `relationshipFrom` / `relationshipTo` — resolves to a settlement that landed
 * from this same envelope. A dangling endpoint (a partner left behind in the
 * source account, dropped by the slot cap, or refused by admission) rebuilds
 * empty; no foreign id ever reaches the store, so an imported copy still cannot
 * re-wire itself into the importer's unrelated saves.
 *
 * `neighborRelationship` is deliberately NOT restored: it is matched BY NAME at
 * the save boundary (domain/relationships/neighbourBackLink.js#findSaveByName),
 * so restoring it would let an imported settlement bind to a same-named save
 * the user already owns.
 *
 * Pure. Returns fresh arrays and never mutates its inputs.
 *
 * @param {any} rawSettlement the SOURCE settlement blob (pre-scrub)
 * @param {{ idMap: Record<string, any>, ownSaveId: unknown }} context
 * @returns {{
 *   neighbourNetwork: any[],
 *   interSettlementRelationships: any[],
 *   droppedNeighbours: number,
 *   droppedRelationships: number,
 * }}
 */
export function restoreIntraEnvelopeWiring(rawSettlement, { idMap, ownSaveId }) {
  const sourceNetwork = Array.isArray(rawSettlement?.neighbourNetwork)
    ? rawSettlement.neighbourNetwork
    : [];
  const sourceLinks = Array.isArray(rawSettlement?.interSettlementRelationships)
    ? rawSettlement.interSettlementRelationships
    : [];
  const map = idMap || Object.create(null);
  // OWN keys only. Every id read here comes from the user-supplied file, so
  // `__proto__` / `constructor` / `valueOf` would otherwise resolve against the
  // map's PROTOTYPE and read as a landed partner. The production caller already
  // builds its map with Object.create(null); this makes the function's own
  // contract fail-closed for any caller rather than resting on that.
  /** @param {unknown} id */
  const resolve = (id) => (
    id != null && Object.prototype.hasOwnProperty.call(map, String(id))
      ? map[String(id)]
      : undefined
  );

  /** @type {Map<string, string>} */
  const linkIdRemap = new Map();
  /** @type {any[]} */
  const neighbourNetwork = [];
  let droppedNeighbours = 0;
  for (const neighbour of sourceNetwork) {
    if (!isPlainRecord(neighbour)) {
      droppedNeighbours += 1;
      continue;
    }
    const partnerId = resolve(neighbour.id);
    if (!partnerId) {
      // Includes the `generated_<Name>` stub, whose id is a name token rather
      // than a save id and therefore names no envelope member.
      droppedNeighbours += 1;
      continue;
    }
    const from = neighbour.relationshipFrom == null
      ? null
      : resolve(neighbour.relationshipFrom);
    const to = neighbour.relationshipTo == null
      ? null
      : resolve(neighbour.relationshipTo);
    if (
      (neighbour.relationshipFrom != null && !from)
      || (neighbour.relationshipTo != null && !to)
    ) {
      // The canonical direction is stated in save ids; an unmappable endpoint
      // means the edge's direction cannot be reconstructed truthfully.
      droppedNeighbours += 1;
      continue;
    }
    const linkId = importedNeighbourLinkId(ownSaveId, partnerId);
    if (typeof neighbour.linkId === 'string' && neighbour.linkId !== '') {
      linkIdRemap.set(neighbour.linkId, linkId);
    }
    neighbourNetwork.push({
      ...neighbour,
      id: partnerId,
      linkId,
      ...(from ? { relationshipFrom: String(from) } : {}),
      ...(to ? { relationshipTo: String(to) } : {}),
    });
  }

  /** @type {any[]} */
  const interSettlementRelationships = [];
  let droppedRelationships = 0;
  for (const link of sourceLinks) {
    const nextLinkId = isPlainRecord(link) && typeof link.linkId === 'string'
      ? linkIdRemap.get(link.linkId)
      : undefined;
    if (!nextLinkId) {
      droppedRelationships += 1;
      continue;
    }
    interSettlementRelationships.push({ ...link, linkId: nextLinkId });
  }

  return {
    neighbourNetwork,
    interSettlementRelationships,
    droppedNeighbours,
    droppedRelationships,
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
 *   restoreLifecycle?: boolean,
 * }} [meta]
 * @returns {{
 *   ok: true,
 *   entry: object,
 *   restoreNotices?: Array<{ field: string, reason: string }>,
 * } | { ok: false, reason: string }}
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

  // On the ACCOUNT surface the file is the user's OWN exporter-produced estate,
  // so their lived history is restored through the per-field admission wall
  // (§359.10). Every other caller — the reconciliation slice, which declares
  // these fields unsupported on its own boundary — keeps the distrust reset:
  // "don't trust embedded world-state wiring across an import boundary; reset
  // to a clean draft" (the same value the gallery importer writes).
  const lifecycle = meta.restoreLifecycle === true
    ? admitRestoredLifecycle(rawEntry)
    : { ...resetLifecycle(), notices: [] };

  // The entry handed to savesService.save. NO id / user_id / owner / public_slug
  // / is_public / gallery flag is carried — the server stamps the owner on
  // insert (014 trigger gates the slot), so import is additive + ownership-safe.
  const entry = {
    name: displayName,
    tier: typeof rawEntry.tier === 'string' ? rawEntry.tier : rawSettlement.tier,
    settlement,
    config: null,
    seed: null,
    aiData: lifecycle.aiData,
    campaignState: lifecycle.campaignState,
    versionHistory: lifecycle.versionHistory,
  };

  return lifecycle.notices.length > 0
    ? { ok: true, entry, restoreNotices: lifecycle.notices }
    : { ok: true, entry };
}

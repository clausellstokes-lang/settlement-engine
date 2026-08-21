/**
 * Runtime admission for saved-settlement persistence payloads.
 *
 * Save loading is already asynchronous and post-first-paint, so this parser is
 * loaded with that boundary instead of joining the eager store graph. It owns
 * raw local envelopes and raw Supabase JSONB rows; migration and canonical
 * normalization remain in saves.js after admission succeeds.
 */

import { ACTIVE_SAVE_STATE } from './saveAccess.js';

const ADMISSION_STATUS = Object.freeze({
  CURRENT: 'current',
  MIGRATED: 'migrated',
  REJECTED: 'rejected',
});

/**
 * @typedef {{
 *   status: string,
 *   index: number|null,
 *   id: string|null,
 *   code: string,
 *   sourceVersion?: number,
 *   targetVersion?: number|null,
 * }} SaveAdmissionEntry
 */

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {boolean} */
function isSaveId(value) {
  return (
    (typeof value === 'string' && value.trim() !== '')
    || (typeof value === 'number' && Number.isFinite(value))
  );
}

/**
 * Freeze the diagnostic envelope exposed to persistence callers and operator
 * tooling. Accepted entries themselves remain untouched for migration.
 *
 * @param {string} source
 * @param {SaveAdmissionEntry[]} entries
 */
export function saveAdmissionDiagnostics(source, entries) {
  const counts = { current: 0, migrated: 0, rejected: 0 };
  for (const entry of entries) counts[entry.status] += 1;
  return Object.freeze({
    source,
    ...counts,
    entries: Object.freeze(entries.map((entry) => Object.freeze(entry))),
  });
}

/**
 * @param {number|null} index
 * @param {unknown} entry
 * @param {string} code
 * @returns {SaveAdmissionEntry}
 */
function rejection(index, entry, code) {
  const record = isRecord(entry) ? entry : null;
  return {
    status: ADMISSION_STATUS.REJECTED,
    index,
    id: isSaveId(record?.id) ? String(record.id) : null,
    code,
  };
}

/**
 * Admit save envelopes before migration or rendering. Historical numeric IDs
 * and versionless settlements remain valid; a malformed sibling is isolated
 * instead of causing the entire owner cache to disappear.
 *
 * @param {unknown} value
 * @param {{
 *   source?:string,
 *   requireSettlement?:boolean,
 *   targetSchemaVersion?:number|null,
 * }} [options]
 */
export function admitSavedSettlementEntries(
  value,
  {
    source = 'saved-settlement-cache',
    requireSettlement = true,
    targetSchemaVersion = null,
  } = {},
) {
  if (!Array.isArray(value)) {
    return {
      entries: [],
      diagnostics: saveAdmissionDiagnostics(source, [{
        status: ADMISSION_STATUS.REJECTED,
        index: null,
        id: null,
        code: 'cache_root_not_array',
      }]),
    };
  }

  const entries = [];
  const diagnostics = [];
  value.forEach((entry, index) => {
    if (!isRecord(entry)) {
      diagnostics.push(rejection(index, entry, 'save_envelope_not_object'));
      return;
    }
    if (!isSaveId(entry.id)) {
      diagnostics.push(rejection(index, entry, 'save_id_invalid'));
      return;
    }
    if (entry.name != null && typeof entry.name !== 'string') {
      diagnostics.push(rejection(index, entry, 'save_name_invalid'));
      return;
    }
    const settlement = isRecord(entry.settlement) ? entry.settlement : null;
    const campaignState = isRecord(entry.campaignState)
      ? entry.campaignState
      : null;
    const config = isRecord(entry.config) ? entry.config : null;
    if (
      requireSettlement
      && (entry.accessState || ACTIVE_SAVE_STATE) === ACTIVE_SAVE_STATE
      && !settlement
    ) {
      diagnostics.push(rejection(index, entry, 'settlement_blob_invalid'));
      return;
    }

    const recordFields = [
      'settlement',
      'config',
      'aiData',
      'campaignState',
      'institutionToggles',
      'categoryToggles',
      'goodsToggles',
      'servicesToggles',
      'toggles',
    ];
    const invalidRecordField = recordFields.find(
      (field) => entry[field] != null && !isRecord(entry[field]),
    );
    if (invalidRecordField) {
      diagnostics.push(rejection(index, entry, `${invalidRecordField}_invalid`));
      return;
    }
    if (entry.versionHistory != null && !Array.isArray(entry.versionHistory)) {
      diagnostics.push(rejection(index, entry, 'version_history_invalid'));
      return;
    }
    if (
      campaignState?.phase != null
      && typeof campaignState.phase !== 'string'
    ) {
      diagnostics.push(rejection(index, entry, 'campaign_phase_invalid'));
      return;
    }

    const schemaVersion = settlement?.schemaVersion;
    if (
      schemaVersion != null
      && (!Number.isInteger(Number(schemaVersion)) || Number(schemaVersion) < 0)
    ) {
      diagnostics.push(rejection(index, entry, 'settlement_schema_version_invalid'));
      return;
    }

    const migrationCodes = [];
    if (entry.accessState == null) migrationCodes.push('legacy_access_state');
    if (!campaignState?.phase) migrationCodes.push('legacy_campaign_state');
    if (
      schemaVersion == null
      || Number(schemaVersion) === 0
      || (
        targetSchemaVersion != null
        && Number(schemaVersion) < targetSchemaVersion
      )
    ) {
      migrationCodes.push('legacy_settlement_schema');
    } else if (
      targetSchemaVersion != null
      && Number(schemaVersion) > targetSchemaVersion
    ) {
      migrationCodes.push('forward_settlement_version_passthrough');
    }
    if (
      entry.seed == null
      && (settlement?._seed != null || config?._seed != null)
    ) {
      migrationCodes.push('legacy_seed_lift');
    }

    entries.push(entry);
    diagnostics.push({
      status: migrationCodes.some((code) => code.startsWith('legacy_'))
        ? ADMISSION_STATUS.MIGRATED
        : ADMISSION_STATUS.CURRENT,
      index,
      id: String(entry.id),
      code: migrationCodes.join(',') || 'current',
      sourceVersion: schemaVersion == null ? 0 : Number(schemaVersion),
      targetVersion: targetSchemaVersion,
    });
  });

  return {
    entries,
    diagnostics: saveAdmissionDiagnostics(source, diagnostics),
  };
}

function invalidSupabaseSaveRow(row) {
  if (!isRecord(row)) return 'supabase_row_not_object';
  if (!isSaveId(row.id)) return 'save_id_invalid';
  const recordColumns = [
    'data',
    'config',
    'toggles',
    'ai_data',
    'campaign_state',
    'gallery_member_overrides',
  ];
  const invalidRecordColumn = recordColumns.find(
    (column) => row[column] != null && !isRecord(row[column]),
  );
  if (invalidRecordColumn) return `${invalidRecordColumn}_jsonb_invalid`;
  if (row.version_history != null && !Array.isArray(row.version_history)) {
    return 'version_history_jsonb_invalid';
  }
  if (row.gallery_tags != null && !Array.isArray(row.gallery_tags)) {
    return 'gallery_tags_jsonb_invalid';
  }
  if (
    (row.access_state || ACTIVE_SAVE_STATE) === ACTIVE_SAVE_STATE
    && !isRecord(row.data)
  ) {
    return 'settlement_blob_invalid';
  }
  return null;
}

/**
 * Validate raw Supabase rows before mapping defaults can hide malformed JSONB.
 *
 * @param {unknown} value
 * @param {{
 *   mapRow:(row:Record<string, unknown>)=>Record<string, unknown>,
 *   targetSchemaVersion?:number|null,
 * }} options
 */
export function admitSupabaseSaveRows(
  value,
  { mapRow, targetSchemaVersion = null },
) {
  if (!Array.isArray(value)) {
    return {
      entries: [],
      diagnostics: saveAdmissionDiagnostics('supabase', [{
        status: ADMISSION_STATUS.REJECTED,
        index: null,
        id: null,
        code: 'supabase_result_not_array',
      }]),
    };
  }

  const mapped = [];
  const originalIndexes = [];
  const rejected = [];
  value.forEach((row, index) => {
    const code = invalidSupabaseSaveRow(row);
    if (code) {
      rejected.push(rejection(index, row, code));
      return;
    }
    mapped.push(mapRow(row));
    originalIndexes.push(index);
  });

  const admitted = admitSavedSettlementEntries(mapped, {
    source: 'supabase',
    requireSettlement: true,
    targetSchemaVersion,
  });
  const acceptedDiagnostics = admitted.diagnostics.entries.map((diagnostic) => ({
    ...diagnostic,
    index: originalIndexes[diagnostic.index],
  }));
  return {
    entries: admitted.entries,
    diagnostics: saveAdmissionDiagnostics(
      'supabase',
      [...acceptedDiagnostics, ...rejected].sort(
        (left, right) => Number(left.index ?? -1) - Number(right.index ?? -1),
      ),
    ),
  };
}

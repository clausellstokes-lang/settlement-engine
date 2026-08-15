/**
 * Shared constants and structural vocabulary for full-fidelity custom-content
 * archives. Semantic graph proof lives in the adjacent validation module.
 */

import {
  detachContentJson,
  isPlainContentRecord,
} from '../domain/content/contentFingerprint.js';
import { compareCodepoint } from '../domain/deterministicSort.js';

export const CUSTOM_CONTENT_ARCHIVE_FORMAT =
  'settlementforge.custom-content-ledger';
export const CUSTOM_CONTENT_ARCHIVE_VERSION = 1;

export const CUSTOM_CONTENT_ARCHIVE_LIMITS = Object.freeze({
  maxBytes: 16 * 1024 * 1024,
  maxNodes: 500_000,
  definitions: 2_000,
  revisions: 20_000,
  packs: 128,
  packVersions: 1_024,
  packEntries: 20_000,
  environments: 2_000,
  commandReceipts: 10_000,
  auditProvenance: 128,
});

export const ARCHIVE_CONTENT_CATEGORIES = Object.freeze([
  'institutions',
  'services',
  'resources',
  'stressors',
  'tradeGoods',
  'factions',
  'deities',
  'traditions',
  // Reviewed-derived artifact lane. This category is transferable because its
  // immutable history and environment references are user data; it remains
  // excluded from pack/Surveyor authoring by their AUTHORABLE-only contracts.
  'supplyChains',
]);

export const SHA256_RE = /^[0-9a-f]{64}$/;

export const ARCHIVE_KEYS = new Set([
  'format',
  'formatVersion',
  'source',
  'ledger',
  'auditProvenance',
  'archiveFingerprint',
]);
export const SOURCE_KEYS = new Set([
  'type',
  'key',
  'exportedAt',
  'ledgerFingerprint',
]);
export const LEDGER_KEYS = new Set([
  'schemaVersion',
  'definitions',
  'revisions',
  'packs',
  'packVersions',
  'packEntryDefinitions',
  'packVersionEntries',
  'environments',
  'activeEnvironmentRevisionId',
  'commandReceipts',
]);
export const DEFINITION_KEYS = new Set([
  'id',
  'category',
  'localUid',
  'headRevisionId',
  'archivedAt',
  'createdAt',
  'updatedAt',
  'legacyContentId',
]);
export const REVISION_KEYS = new Set([
  'schemaVersion',
  'id',
  'definitionId',
  'category',
  'revisionNumber',
  'parentRevisionId',
  'contentHash',
  'data',
  'createdAt',
]);
export const PACK_KEYS = new Set([
  'packId',
  'name',
  'activePackVersion',
  'activeManifestHash',
  'createdAt',
  'updatedAt',
]);
export const PACK_VERSION_KEYS = new Set([
  'packId',
  'packVersion',
  'manifestHash',
  'importPlanHash',
  'manifest',
  'createdAt',
]);
export const PACK_MAPPING_KEYS = new Set([
  'packId',
  'packEntryId',
  'definitionId',
]);
export const PACK_VERSION_ENTRY_KEYS = new Set([
  'packId',
  'packVersion',
  'packEntryId',
  'definitionId',
  'revisionId',
  'category',
  'ordinal',
]);
export const COMMAND_RECEIPT_KEYS = new Set([
  'commandId',
  'fingerprint',
  'receipt',
]);
export const PROVENANCE_KEYS = new Set([
  'archiveFingerprint',
  'source',
  'commandReceipts',
  'auditProvenance',
]);

/**
 * @typedef {Record<string, unknown>} JsonRecord
 * @typedef {{
 *   id:string, category:string, localUid:string, headRevisionId:string,
 *   archivedAt:string|null, createdAt:string|null, updatedAt:string|null,
 *   legacyContentId:string|null,
 * }} ArchiveDefinition
 * @typedef {{
 *   schemaVersion:number, id:string, definitionId:string, category:string,
 *   revisionNumber:number, parentRevisionId:string|null, contentHash:string,
 *   data:JsonRecord, createdAt:string|null,
 * }} ArchiveRevision
 * @typedef {{
 *   packId:string, name:string, activePackVersion:string|null,
 *   activeManifestHash:string|null, createdAt:string|null,
 *   updatedAt:string|null,
 * }} ArchivePack
 * @typedef {{
 *   packId:string, packVersion:string, manifestHash:string,
 *   importPlanHash:string, manifest:JsonRecord, createdAt:string|null,
 * }} ArchivePackVersion
 * @typedef {{
 *   packId:string, packEntryId:string, definitionId:string,
 * }} ArchivePackMapping
 * @typedef {{
 *   packId:string, packVersion:string, packEntryId:string,
 *   definitionId:string, revisionId:string, category:string, ordinal:number,
 * }} ArchivePackVersionEntry
 * @typedef {{
 *   commandId:string, fingerprint:string, receipt:JsonRecord,
 * }} ArchiveCommandReceipt
 * @typedef {{
 *   type:string, key:string, exportedAt:string|null, ledgerFingerprint:string,
 * }} ArchiveSource
 * @typedef {{
 *   archiveFingerprint:string, source:ArchiveSource,
 *   commandReceipts:ArchiveCommandReceipt[], auditProvenance:unknown[],
 * }} ArchiveProvenance
 * @typedef {{
 *   schemaVersion:number,
 *   definitions:ArchiveDefinition[],
 *   revisions:ArchiveRevision[],
 *   packs:ArchivePack[],
 *   packVersions:ArchivePackVersion[],
 *   packEntryDefinitions:ArchivePackMapping[],
 *   packVersionEntries:ArchivePackVersionEntry[],
 *   environments:JsonRecord[],
 *   activeEnvironmentRevisionId:string|null,
 *   commandReceipts:ArchiveCommandReceipt[],
 * }} CustomContentArchiveLedger
 * @typedef {{
 *   format:string, formatVersion:number, source:ArchiveSource,
 *   ledger:CustomContentArchiveLedger,
 *   auditProvenance:ArchiveProvenance[], archiveFingerprint:string,
 * }} CustomContentArchive
 */

/** @param {unknown} value */
export function cleanArchiveText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value @param {string} field */
export function requiredArchiveText(value, field) {
  const text = cleanArchiveText(value);
  if (!text || text.length > 240) {
    throw new TypeError(`${field} is invalid.`);
  }
  return text;
}

/** @param {unknown} value @param {string} field */
export function requiredArchiveHash(value, field) {
  const hash = String(value || '');
  if (!SHA256_RE.test(hash)) {
    throw new TypeError(`${field} must be a lowercase SHA-256 fingerprint.`);
  }
  return hash;
}

/**
 * Archive timestamps are SQL-bound facts, not opaque labels. Requiring the
 * canonical UTC spelling prevents a client-admitted file from failing later
 * during a PostgreSQL timestamptz cast.
 *
 * @param {unknown} value
 * @param {string} [field]
 */
export function canonicalArchiveTimestamp(value, field = 'timestamp') {
  if (value == null) return null;
  if (typeof value !== 'string' || !value || value.length > 100) {
    throw new TypeError(`${field} must be a canonical UTC timestamp or null.`);
  }
  try {
    if (new Date(value).toISOString() !== value) {
      throw new TypeError();
    }
  } catch {
    throw new TypeError(`${field} must be a canonical UTC timestamp or null.`);
  }
  return value;
}

/**
 * @param {unknown} value
 * @param {Set<string>} keys
 * @param {string} field
 * @returns {asserts value is JsonRecord}
 */
export function assertExactArchiveKeys(value, keys, field) {
  if (!isPlainContentRecord(value)) {
    throw new TypeError(`${field} must be an object.`);
  }
  const actual = Object.keys(value);
  if (
    actual.length !== keys.size
    || actual.some(key => !keys.has(key))
  ) {
    throw new TypeError(`${field} has a non-canonical shape.`);
  }
}

/**
 * @template T
 * @param {T[]} values
 * @param {(value:T)=>string} address
 * @returns {T[]}
 */
export function sortedArchiveValues(values, address) {
  return [...values]
    .sort((left, right) => compareCodepoint(address(left), address(right)))
    .map(value => /** @type {T} */ (detachContentJson(value, {
      maxNodes: CUSTOM_CONTENT_ARCHIVE_LIMITS.maxNodes,
    })));
}

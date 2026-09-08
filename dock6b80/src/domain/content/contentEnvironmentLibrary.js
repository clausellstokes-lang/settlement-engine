/**
 * Library-to-environment projection primitives.
 *
 * These helpers translate editable Compendium heads into immutable addresses
 * and create the closed empty runtime shape used by failed/vanilla resolution.
 * They stay separate from environment identity and campaign admission so the
 * main environment module remains a readable coordinator.
 */

import {
  authoredDataOf,
  contentRevisionHash,
} from './customContentVersioning.js';
import {
  PERSISTED_RUNTIME_CONTENT_CATEGORIES,
} from './reviewedSupplyChainPersistence.js';

/** @typedef {Record<string, unknown>} ContentRecord */
/** @typedef {Readonly<Record<string,
 *   ReadonlyArray<ContentRecord>>>} ReadonlyContentLibrary */
/** @typedef {{
 *   definitionId:string,
 *   revisionId:string,
 *   contentHash:string,
 *   category:string,
 *   data:ContentRecord,
 * }} LegacyDefinitionEntry */

/**
 * @param {string} category
 * @param {unknown} item
 * @returns {LegacyDefinitionEntry}
 */
export function legacyDefinitionEntry(category, item) {
  const data = authoredDataOf(item);
  const record = /** @type {ContentRecord} */ (item);
  const contentHash = contentRevisionHash(category, data);
  if (
    record.contentHash != null
    && String(record.contentHash) !== contentHash
  ) {
    throw new TypeError(
      `Definition "${String(record.definitionId || record.id || record.localUid || '')}" `
      + 'does not match its declared content hash.',
    );
  }
  const address = String(
    record.definitionId
    || record.id
    || record.localUid
    || `legacy:${contentHash.slice(0, 24)}`,
  );
  return {
    definitionId: address,
    revisionId: String(record.revisionId || `legacy-revision:${contentHash}`),
    contentHash,
    category,
    data,
  };
}

/** @returns {ReadonlyContentLibrary} */
export function emptyRuntimeContent() {
  /** @type {Record<string, ReadonlyArray<ContentRecord>>} */
  const grouped = {};
  for (const category of PERSISTED_RUNTIME_CONTENT_CATEGORIES) {
    grouped[category] = Object.freeze([]);
  }
  return Object.freeze(grouped);
}

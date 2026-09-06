/**
 * Content-pack identity construction kept separate from hostile-file parsing.
 *
 * Pack lineage and source revision lineage solve different problems: pack IDs
 * identify an authored release stream, while source tuples let account restore
 * reconcile receiving-account command receipts with campaign snapshots.
 */

import {
  fingerprintContent,
} from '../domain/content/contentFingerprint.js';

/**
 * @param {unknown} name
 * @param {Record<string, Array<Record<string, unknown>>>} content
 * @param {ReadonlyArray<string>} buckets
 */
export function defaultContentPackId(name, content, buckets) {
  const identities = [];
  for (const bucket of buckets) {
    for (const item of content[bucket] || []) {
      identities.push([
        bucket,
        item.definitionId
          || item.localUid
          || item.packEntryId
          || item.name
          || '',
      ]);
    }
  }
  const hash = fingerprintContent({
    name: String(name || 'Custom content pack'),
    identities,
  });
  return `pack:${hash.slice(0, 32)}`;
}

/**
 * Construct the explicit source tuple carried as transport metadata.
 *
 * @param {string} bucket
 * @param {Record<string, unknown>} source
 * @param {Record<string, unknown>} portable
 * @param {string} contentHash
 */
export function contentPackSourceIdentity(
  bucket,
  source,
  portable,
  contentHash,
) {
  const sourceDefinitionId = String(
    source.definitionId
    || source.id
    || portable.localUid
    || `legacy:${contentHash.slice(0, 24)}`,
  ).trim();
  const sourceRevisionId = String(
    source.revisionId || `legacy-revision:${contentHash}`,
  ).trim();
  if (
    !sourceDefinitionId
    || sourceDefinitionId.length > 240
    || !sourceRevisionId
    || sourceRevisionId.length > 240
  ) {
    throw new TypeError(
      `${bucket} source definition and revision identities must stay within 240 characters.`,
    );
  }
  return { sourceDefinitionId, sourceRevisionId };
}

/**
 * Read and bound a source tuple from an admitted or legacy-v2 pack entry.
 *
 * @param {string} bucket
 * @param {Record<string, unknown>} entry
 * @param {string} packEntryId
 * @param {string} path
 */
export function readContentPackSourceIdentity(
  bucket,
  entry,
  packEntryId,
  path,
) {
  const contentHash = String(entry.contentHash || '');
  const sourceDefinitionId = String(
    entry.sourceDefinitionId || entry.localUid || packEntryId,
  ).trim();
  const sourceRevisionId = String(
    entry.sourceRevisionId || `legacy-revision:${contentHash}`,
  ).trim();
  if (
    !sourceDefinitionId
    || sourceDefinitionId.length > 240
    || !sourceRevisionId
    || sourceRevisionId.length > 240
  ) {
    throw new TypeError(
      `${path || bucket} source definition and revision identities must stay within 240 characters.`,
    );
  }
  return { sourceDefinitionId, sourceRevisionId, contentHash };
}

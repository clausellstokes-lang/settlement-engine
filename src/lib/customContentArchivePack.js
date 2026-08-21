/**
 * Canonical pack-manifest projection for archive pack versions.
 *
 * The archive row and its manifest describe the same destination graph. The
 * original imported archive remains separately retained as audit provenance;
 * a manifest is never used as an opaque provenance blob.
 */

import {
  authoredDataOf,
  contentRevisionHash,
} from '../domain/content/customContentVersioning.js';
import {
  canonicalContentJson,
  detachContentJson,
  isPlainContentRecord,
} from '../domain/content/contentFingerprint.js';
import {
  CONTENT_PACK_FORMAT,
  CONTENT_PACK_FORMAT_VERSION,
  CONTENT_PACK_SCHEMA_VERSION,
  PACK_BUCKETS,
  contentPackManifestHash,
  parseContentPack,
} from './contentPacks.js';
import {
  canonicalArchiveTimestamp,
  requiredArchiveText,
} from './customContentArchiveContract.js';

const ADAPTED_PACK_EPOCH = '1970-01-01T00:00:00.000Z';
const DEFAULT_COMPATIBILITY = Object.freeze({
  minAppVersion: '1.0.0',
  maxAppVersion: null,
  minSimulationVersion: 1,
  maxSimulationVersion: null,
});

/**
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).ArchivePackVersionEntry} ArchivePackVersionEntry
 * @typedef {import(
 *   './customContentArchiveContract.js'
 * ).ArchiveRevision} ArchiveRevision
 * @typedef {{
 *   packId:string,
 *   packVersion:string,
 *   name:string,
 *   storedManifestHash:string,
 *   sourceManifest:unknown,
 *   createdAt:string|null,
 *   entries:ArchivePackVersionEntry[],
 *   revisionById:Map<string, ArchiveRevision>,
 * }} ArchiveManifestInput
 */

/** @param {unknown} sourceManifest */
function admittedMetadata(sourceManifest) {
  const admission = parseContentPack(sourceManifest);
  return admission.ok === true ? admission.pack : null;
}

/**
 * Construct a complete v2 manifest from the immutable closure that is actually
 * stored. Historical reduced manifests receive explicit adapted provenance.
 *
 * @param {ArchiveManifestInput} input
 */
export function buildArchivePackManifest(input) {
  const packId = requiredArchiveText(input.packId, 'manifest.packId');
  const packVersion = requiredArchiveText(
    input.packVersion,
    'manifest.packVersion',
  );
  const createdAt = canonicalArchiveTimestamp(
    input.createdAt,
    'packVersion.createdAt',
  );
  const admitted = admittedMetadata(input.sourceManifest);
  /** @type {Record<string, Array<Record<string, unknown>>>} */
  const content = {};
  for (const bucket of PACK_BUCKETS) content[bucket] = [];

  const entries = [...input.entries].sort(
    (left, right) => Number(left.ordinal) - Number(right.ordinal),
  );
  for (const entry of entries) {
    const revision = input.revisionById.get(entry.revisionId);
    if (!revision || revision.definitionId !== entry.definitionId) {
      throw new TypeError(
        `Pack entry "${entry.packEntryId}" has no matching immutable revision.`,
      );
    }
    if (!PACK_BUCKETS.includes(entry.category)) {
      throw new TypeError(
        `Pack entry "${entry.packEntryId}" has an unsupported category.`,
      );
    }
    content[entry.category].push({
      .../** @type {Record<string, unknown>} */ (
        detachContentJson(revision.data)
      ),
      packEntryId: entry.packEntryId,
      sourceDefinitionId: entry.definitionId,
      sourceRevisionId: entry.revisionId,
      contentHash: contentRevisionHash(entry.category, revision.data),
    });
  }

  const adaptedSource = {
    archiveAdaptedFromReducedManifest: true,
    storedManifestHash: input.storedManifestHash,
  };
  const core = {
    format: CONTENT_PACK_FORMAT,
    formatVersion: CONTENT_PACK_FORMAT_VERSION,
    packId,
    packVersion,
    contentSchemaVersion: CONTENT_PACK_SCHEMA_VERSION,
    name: String(admitted?.name || input.name || packId),
    description: admitted?.description ?? null,
    authorship: admitted?.authorship ?? null,
    license: admitted?.license ?? null,
    source: admitted?.source ?? adaptedSource,
    compatibility: admitted?.compatibility || DEFAULT_COMPATIBILITY,
    dependencies: admitted?.dependencies || [],
    tunables: admitted?.tunables || {},
    visualSelection: admitted?.visualSelection || {},
    exportedAt: admitted?.exportedAt || createdAt || ADAPTED_PACK_EPOCH,
    content,
  };
  const manifest = {
    ...core,
    manifestHash: contentPackManifestHash(core),
  };
  const admission = parseContentPack(manifest);
  if (admission.ok === false) {
    throw new TypeError(
      `Archive pack manifest could not be canonicalized: ${admission.error}`,
    );
  }
  return admission.pack;
}

/**
 * Prove that the stored manifest hash and every manifest entry describe the
 * exact same ordered closure and immutable revision data as the archive rows.
 *
 * @param {import(
 *   './customContentArchiveContract.js'
 * ).ArchivePackVersion} version
 * @param {ArchivePackVersionEntry[]} entries
 * @param {Map<string, ArchiveRevision>} revisionById
 */
export function validateArchivePackManifest(
  version,
  entries,
  revisionById,
) {
  const admission = parseContentPack(version.manifest);
  if (admission.ok === false) {
    throw new TypeError(`Archive pack manifest is invalid: ${admission.error}`);
  }
  const manifest = admission.pack;
  if (
    manifest.packId !== version.packId
    || manifest.packVersion !== version.packVersion
    || manifest.manifestHash !== version.manifestHash
    || contentPackManifestHash(manifest) !== version.manifestHash
  ) {
    throw new TypeError(
      'Archive pack manifest identity or manifest hash does not match its row.',
    );
  }

  const manifestEntries = PACK_BUCKETS.flatMap(category => (
    manifest.content[category].map(entry => ({ category, entry }))
  ));
  const orderedEntries = [...entries].sort(
    (left, right) => Number(left.ordinal) - Number(right.ordinal),
  );
  if (manifestEntries.length !== orderedEntries.length) {
    throw new TypeError(
      'Archive pack manifest and immutable closure have different sizes.',
    );
  }
  for (const [index, closure] of orderedEntries.entries()) {
    const candidate = manifestEntries[index];
    const entry = candidate?.entry;
    const revision = revisionById.get(closure.revisionId);
    if (
      !isPlainContentRecord(entry)
      || candidate.category !== closure.category
      || entry.packEntryId !== closure.packEntryId
      || entry.sourceDefinitionId !== closure.definitionId
      || entry.sourceRevisionId !== closure.revisionId
      || !revision
      || entry.contentHash !== revision.contentHash
      || canonicalContentJson(authoredDataOf(entry))
        !== canonicalContentJson(revision.data)
    ) {
      throw new TypeError(
        `Archive pack manifest entry ${index} does not match its closure.`,
      );
    }
  }
  return manifest;
}

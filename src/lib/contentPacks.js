/**
 * Strict SettlementForge custom-content pack format.
 *
 * Format version answers "how is this file encoded?" Pack id/version answer
 * "which authored release is this?" Keeping those concepts separate permits
 * compatible parser evolution, deterministic re-import, and immutable campaign
 * bindings without treating every downloaded JSON file as a new identity.
 *
 * This module is pure: it parses hostile input, verifies the manifest hash,
 * diagnoses dependency closure, and builds an atomic import preview. Persistence
 * happens through the custom-content command service.
 */

import {
  contentRevisionHash,
  validateVersionedContent,
} from '../domain/content/customContentVersioning.js';
import {
  detachContentJson,
  fingerprintContent,
  isPlainContentRecord,
  parseContentJson,
} from '../domain/content/contentFingerprint.js';
import { validateUserContentTunables } from '../domain/content/userContentTunables.js';
import {
  validateUserVisualSelection,
} from '../domain/content/userVisualSelection.js';
import {
  admitCustomContentDefinition,
  AUTHORABLE_CONTENT_BUCKETS,
  CUSTOM_CONTENT_MANIFEST,
} from '../domain/content/customContentManifest.js';
import {
  contentPackSourceIdentity,
  defaultContentPackId,
  readContentPackSourceIdentity,
} from './contentPackIdentity.js';

export const PACK_BUCKETS = Object.freeze([...AUTHORABLE_CONTENT_BUCKETS]);

// Pack dependency traversal follows the same admitted fields as authoring. A
// pack may narrow this set for a particular import, but it cannot introduce a
// relationship field that the manifest does not register.
export const PACK_DEP_FIELDS = Object.freeze([
  ...new Set(CUSTOM_CONTENT_MANIFEST.categories.flatMap(
    category => category.dependencies.map(dependency => dependency.field),
  )),
]);

export const CONTENT_PACK_FORMAT = 'settlementforge.content-pack';
export const CONTENT_PACK_FORMAT_VERSION = 2;
// Backward-compatible export name. This is the FILE format version, not the
// authored pack release.
export const CONTENT_PACK_VERSION = CONTENT_PACK_FORMAT_VERSION;
export const CONTENT_PACK_SCHEMA_VERSION = 1;

const DEFAULT_COMPATIBILITY = Object.freeze({
  minAppVersion: '1.0.0',
  maxAppVersion: null,
  minSimulationVersion: 1,
  maxSimulationVersion: null,
});
export const MAX_PACK_BYTES = 2 * 1024 * 1024;
export const MAX_PACK_ITEMS = 1_000;
const MAX_PACK_DEPTH = 40;
const MAX_PACK_NODES = 30_000;
const MAX_PACK_NAME_CHARS = 160;
const MAX_PACK_DESCRIPTION_CHARS = 8_000;
const MAX_METADATA_DEPTH = 8;
const MAX_METADATA_NODES = 500;
const MAX_METADATA_STRING_CHARS = 4_000;
const MAX_METADATA_KEYS_PER_OBJECT = 64;
const MAX_METADATA_ITEMS_PER_ARRAY = 100;
const MAX_METADATA_KEY_CHARS = 120;
const IDENTIFIER_RE = /^[a-zA-Z0-9][a-zA-Z0-9:._-]{0,239}$/;
const PACK_VERSION_RE = /^[0-9]+\.[0-9]+\.[0-9]+(?:-[a-zA-Z0-9.-]+)?$/;
const MANIFEST_HASH_RE = /^[a-f0-9]{64}$/;
const V2_TOP_LEVEL_FIELDS = Object.freeze([
  'format', 'formatVersion', 'packId', 'packVersion', 'contentSchemaVersion',
  'name', 'description', 'authorship', 'license', 'source',
  'compatibility', 'dependencies', 'tunables', 'visualSelection', 'exportedAt', 'content', 'manifestHash',
]);
const COMPATIBILITY_FIELDS = Object.freeze([
  'minAppVersion', 'maxAppVersion', 'minSimulationVersion', 'maxSimulationVersion',
]);

/**
 * A pack after hostile-input normalization and hash verification.
 *
 * Entries remain unknown until `prepareContentPackImport` performs manifest
 * admission; the pack envelope fields below are already cleaned here.
 *
 * @typedef {Record<string, unknown> & {
 *   format:string,
 *   formatVersion:number,
 *   packId:string,
 *   packVersion:string,
 *   contentSchemaVersion:number,
 *   name:string,
 *   manifestHash:string,
 *   content:Record<string, Array<Record<string, unknown>>>,
 *   importWarnings?:string[],
 *   legacyAdapted?:boolean,
 * }} ValidatedContentPack
 */

/** Mint a fresh legacy uid. Pack-v2 imports instead use stable pack entry ids. */
export function makePackLocalUid() {
  return `lu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function identifierOrNull(value) {
  const text = typeof value === 'string' ? value.trim() : '';
  return IDENTIFIER_RE.test(text) ? text : null;
}

function cleanIdentifier(value, field) {
  const identifier = identifierOrNull(value);
  if (!identifier) throw new TypeError(`${field} is invalid.`);
  return identifier;
}

function cleanPackVersion(value) {
  if (typeof value !== 'string' || !PACK_VERSION_RE.test(value)) {
    throw new TypeError('packVersion must be a semantic version.');
  }
  return value;
}

function cleanLocalUid(value, field) {
  if (typeof value !== 'string') {
    throw new TypeError(`${field} must be text.`);
  }
  const uid = value.trim();
  if (!uid || uid.length > 240) {
    throw new TypeError(`${field} must contain 1 to 240 characters.`);
  }
  return uid;
}

function assertRecognizedFields(
  value,
  recognizedFields,
  label,
  { requireAll = false } = {},
) {
  const recognized = new Set(recognizedFields);
  const unknown = Object.keys(value)
    .filter(field => !recognized.has(field))
    .sort();
  if (unknown.length) {
    throw new TypeError(
      `${label} contains unsupported fields: ${unknown.join(', ')}.`,
    );
  }
  if (!requireAll) return;
  const missing = recognizedFields.filter(field => !Object.hasOwn(value, field));
  if (missing.length) {
    throw new TypeError(
      `${label} is missing required fields: ${missing.join(', ')}.`,
    );
  }
}

function characterCount(value) { return Array.from(value).length; }

function cleanRequiredText(value, field, maxChars) {
  if (typeof value !== 'string') {
    throw new TypeError(`${field} must be text.`);
  }
  const text = value.trim();
  if (!text) throw new TypeError(`${field} must not be empty.`);
  if (characterCount(text) > maxChars) {
    throw new TypeError(`${field} exceeds the ${maxChars}-character limit.`);
  }
  return text;
}

function cleanOptionalText(value, field, maxChars) {
  if (value == null) return null;
  if (typeof value !== 'string') {
    throw new TypeError(`${field} must be text or null.`);
  }
  const text = value.trim();
  if (!text) return null;
  if (characterCount(text) > maxChars) {
    throw new TypeError(`${field} exceeds the ${maxChars}-character limit.`);
  }
  return text;
}

function assertBoundedMetadataValue(value, path) {
  if (typeof value === 'string') {
    if (characterCount(value) > MAX_METADATA_STRING_CHARS) {
      throw new TypeError(
        `${path} exceeds the ${MAX_METADATA_STRING_CHARS}-character metadata limit.`,
      );
    }
    return;
  }
  if (value == null || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    if (value.length > MAX_METADATA_ITEMS_PER_ARRAY) {
      throw new TypeError(
        `${path} exceeds the ${MAX_METADATA_ITEMS_PER_ARRAY}-item metadata limit.`,
      );
    }
    value.forEach((entry, index) => {
      assertBoundedMetadataValue(entry, `${path}[${index}]`);
    });
    return;
  }
  const keys = Object.keys(value);
  if (keys.length > MAX_METADATA_KEYS_PER_OBJECT) {
    throw new TypeError(
      `${path} exceeds the ${MAX_METADATA_KEYS_PER_OBJECT}-field metadata limit.`,
    );
  }
  for (const key of keys) {
    if (characterCount(key) > MAX_METADATA_KEY_CHARS) {
      throw new TypeError(
        `${path} contains a metadata key longer than ${MAX_METADATA_KEY_CHARS} characters.`,
      );
    }
    assertBoundedMetadataValue(value[key], `${path}.${key}`);
  }
}

function cleanMetadata(value, field) {
  if (value == null) return null;
  if (
    typeof value !== 'string'
    && !Array.isArray(value)
    && !isPlainContentRecord(value)
  ) {
    throw new TypeError(`${field} must be text, an array, an object, or null.`);
  }
  const detached = detachContentJson(value, {
    maxDepth: MAX_METADATA_DEPTH,
    maxNodes: MAX_METADATA_NODES,
  });
  assertBoundedMetadataValue(detached, field);
  return detached;
}

function cleanDependencies(value) {
  if (!Array.isArray(value)) {
    throw new TypeError('dependencies must be an array.');
  }
  if (value.length > 0) {
    throw new TypeError(
      'Pack dependencies are not supported until dependency resolution is implemented.',
    );
  }
  return [];
}

function cleanExportedAt(value) {
  if (typeof value !== 'string') {
    throw new TypeError('exportedAt must be a canonical ISO timestamp.');
  }
  try {
    if (new Date(value).toISOString() !== value) {
      throw new TypeError('exportedAt must be a canonical ISO timestamp.');
    }
  } catch {
    throw new TypeError('exportedAt must be a canonical ISO timestamp.');
  }
  return value;
}

function stripForPack(item) {
  if (!isPlainContentRecord(item)) return item;
  const {
    id: _id,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    archivedAt: _archivedAt,
    isCustom: _isCustom,
    _schemaVersion: _schemaVersion,
    definitionId: _definitionId,
    revisionId: _revisionId,
    revisionNumber: _revisionNumber,
    contentHash: _contentHash,
    commandReceipt: _commandReceipt,
    ...portable
  } = item;
  return portable;
}

function normalizeCompatibility(value = {}, { requireAll = false } = {}) {
  if (!isPlainContentRecord(value)) {
    throw new TypeError('compatibility must be an object.');
  }
  assertRecognizedFields(
    value,
    COMPATIBILITY_FIELDS,
    'compatibility',
    { requireAll },
  );
  const minAppVersion = value.minAppVersion
    ?? DEFAULT_COMPATIBILITY.minAppVersion;
  const maxAppVersion = value.maxAppVersion == null
    ? null
    : value.maxAppVersion;
  if (
    typeof minAppVersion !== 'string'
    || !PACK_VERSION_RE.test(minAppVersion)
  ) {
    throw new TypeError('compatibility.minAppVersion is invalid.');
  }
  if (
    maxAppVersion != null
    && (
      typeof maxAppVersion !== 'string'
      || !PACK_VERSION_RE.test(maxAppVersion)
    )
  ) {
    throw new TypeError('compatibility.maxAppVersion is invalid.');
  }
  const minSimulationVersion = value.minSimulationVersion
    ?? DEFAULT_COMPATIBILITY.minSimulationVersion;
  const maxSimulationVersion = value.maxSimulationVersion == null
    ? null
    : value.maxSimulationVersion;
  if (
    typeof minSimulationVersion !== 'number'
    || !Number.isInteger(minSimulationVersion)
    || minSimulationVersion < 1
  ) {
    throw new TypeError('compatibility.minSimulationVersion is invalid.');
  }
  if (
    maxSimulationVersion != null
    && (typeof maxSimulationVersion !== 'number'
      || !Number.isInteger(maxSimulationVersion)
      || maxSimulationVersion < minSimulationVersion)
  ) {
    throw new TypeError('compatibility.maxSimulationVersion is invalid.');
  }
  return {
    minAppVersion,
    maxAppVersion,
    minSimulationVersion,
    maxSimulationVersion,
  };
}

function entryForPack(bucket, source) {
  const portable = stripForPack(source);
  if (portable.localUid != null) {
    portable.localUid = cleanLocalUid(portable.localUid, `${bucket}.localUid`);
  }
  const dataHash = contentRevisionHash(bucket, portable);
  const { sourceDefinitionId, sourceRevisionId } =
    contentPackSourceIdentity(bucket, source, portable, dataHash);
  const packEntryId = [
    source?.packEntryId,
    source?.definitionId,
    portable.localUid,
    source?.id,
  ].map(identifierOrNull).find(Boolean)
    // Names remain fully authorable, including whitespace and Unicode. When no
    // authored identifier is portable, the content hash provides stable
    // identity without turning a display name into an unsafe file identifier.
    || `entry:${bucket}:${dataHash.slice(0, 32)}`;
  return {
    ...portable,
    packEntryId,
    sourceDefinitionId,
    sourceRevisionId,
    contentHash: dataHash,
  };
}

/**
 * Return the behavior-bearing v2 manifest projection.
 *
 * Archive import/export uses this same authority when identities are remapped.
 * Keeping the projection public prevents a second implementation from drifting
 * away from the uploaded-pack verifier.
 *
 * @param {Record<string, unknown>} pack
 */
export function contentPackManifestCore(pack) {
  return {
    format: CONTENT_PACK_FORMAT,
    formatVersion: CONTENT_PACK_FORMAT_VERSION,
    packId: pack.packId,
    packVersion: pack.packVersion,
    contentSchemaVersion: pack.contentSchemaVersion,
    name: pack.name,
    description: pack.description || null,
    authorship: pack.authorship || null,
    license: pack.license || null,
    source: pack.source || null,
    compatibility: pack.compatibility,
    dependencies: pack.dependencies || [],
    tunables: pack.tunables || {},
    visualSelection: pack.visualSelection || {},
    content: pack.content,
  };
}

/** @param {Record<string, unknown>} pack */
export function contentPackManifestHash(pack) {
  return fingerprintContent(contentPackManifestCore(pack));
}

/**
 * Build a strict v2 pack.
 *
 * @param {Record<string, unknown[]>} customContent
 * @param {{
 *   buckets?:string[], name?:string, description?:string, packId?:string,
 *   packVersion?:string, authorship?:unknown, license?:unknown, source?:unknown,
 *   compatibility?:unknown, dependencies?:unknown[], tunables?:unknown,
 *   visualSelection?:unknown,
 * }} [options]
 */
export function buildContentPack(customContent, options = {}) {
  const wanted = Array.isArray(options.buckets) && options.buckets.length
    ? options.buckets
    : PACK_BUCKETS;
  const content = {};
  for (const bucket of PACK_BUCKETS) {
    const included = wanted.includes(bucket);
    const source = included && Array.isArray(customContent?.[bucket])
      ? customContent[bucket]
      : [];
    content[bucket] = source.map(item => entryForPack(bucket, item));
  }
  const portableContent =
    /** @type {Record<string, Array<Record<string, unknown>>>} */ (content);

  const name = cleanRequiredText(
    options.name ?? 'Custom content pack',
    'name',
    MAX_PACK_NAME_CHARS,
  );
  const packVersion = cleanPackVersion(options.packVersion ?? '1.0.0');
  const pack = {
    format: CONTENT_PACK_FORMAT,
    formatVersion: CONTENT_PACK_FORMAT_VERSION,
    packId: cleanIdentifier(
      options.packId || defaultContentPackId(name, portableContent, PACK_BUCKETS),
      'packId',
    ),
    packVersion,
    contentSchemaVersion: CONTENT_PACK_SCHEMA_VERSION,
    name,
    description: cleanOptionalText(
      options.description,
      'description',
      MAX_PACK_DESCRIPTION_CHARS,
    ),
    authorship: cleanMetadata(options.authorship, 'authorship'),
    license: cleanMetadata(options.license, 'license'),
    source: cleanMetadata(options.source, 'source'),
    compatibility: normalizeCompatibility(options.compatibility ?? {}),
    dependencies: cleanDependencies(options.dependencies ?? []),
    tunables: (() => {
      const validation = validateUserContentTunables(options.tunables ?? {});
      if (!validation.ok) {
        throw new TypeError(
          `Pack contains unsupported tunables: ${validation.rejected.map(
            entry => entry.key,
          ).join(', ')}.`,
        );
      }
      return validation.tunables;
    })(),
    visualSelection: (() => {
      const validation = validateUserVisualSelection(
        options.visualSelection ?? {},
      );
      if (!validation.ok) {
        throw new TypeError(
          `Pack contains unsupported visual selections: ${validation.rejected
            .map(entry => entry.key)
            .join(', ')}.`,
        );
      }
      return validation.selection;
    })(),
    exportedAt: new Date().toISOString(),
    content,
  };
  return Object.freeze({
    ...pack,
    manifestHash: contentPackManifestHash(pack),
  });
}

function byteLength(text) {
  if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(text).length;
  return String(text).length;
}

function legacyPackToV2(pack) {
  const content = {};
  for (const bucket of PACK_BUCKETS) {
    const items = Array.isArray(pack.content?.[bucket]) ? pack.content[bucket] : [];
    content[bucket] = items.map(item => entryForPack(bucket, item));
  }
  const name = cleanRequiredText(
    String(pack.name || 'Legacy custom content pack'),
    'name',
    MAX_PACK_NAME_CHARS,
  );
  let exportedAt = null;
  if (pack.exportedAt != null) {
    try {
      exportedAt = cleanExportedAt(pack.exportedAt);
    } catch {
      // V1 did not define timestamp canonicalization. Invalid historical
      // display metadata is dropped rather than promoted into v2 provenance.
    }
  }
  const converted = {
    format: CONTENT_PACK_FORMAT,
    formatVersion: CONTENT_PACK_FORMAT_VERSION,
    packId: `legacy:${fingerprintContent({
      name,
      content: pack.content || {},
    }).slice(0, 32)}`,
    packVersion: '0.0.0-legacy',
    contentSchemaVersion: CONTENT_PACK_SCHEMA_VERSION,
    name,
    description: null,
    authorship: null,
    license: null,
    source: { legacyFormatVersion: 1 },
    compatibility: { ...DEFAULT_COMPATIBILITY },
    dependencies: [],
    tunables: {},
    visualSelection: {},
    exportedAt,
    content,
    legacyAdapted: true,
    importWarnings: [
      'Legacy pack v1 was adapted to v2.',
      'Legacy packs did not carry traditions, pack lineage, or dependency diagnostics.',
    ],
  };
  return {
    ...converted,
    manifestHash: contentPackManifestHash(converted),
  };
}

function parseObject(raw) {
  let serialized = raw;
  if (typeof raw !== 'string') {
    try {
      serialized = JSON.stringify(raw);
    } catch {
      throw new TypeError('Pack must contain serializable JSON.');
    }
    if (typeof serialized !== 'string') {
      throw new TypeError('Pack must contain serializable JSON.');
    }
  }
  if (byteLength(serialized) > MAX_PACK_BYTES) {
    throw new TypeError('Pack exceeds the 2 MiB import limit.');
  }
  if (typeof raw !== 'string') return raw;
  try {
    return parseContentJson(serialized);
  } catch {
    throw new TypeError('Not valid JSON.');
  }
}

/** @param {unknown} raw @returns {ValidatedContentPack} */
function validatePackObject(raw) {
  if (!isPlainContentRecord(raw)) throw new TypeError('Not a content pack.');
  if (raw.format !== CONTENT_PACK_FORMAT) {
    throw new TypeError('Unrecognized file. Not a SettlementForge content pack.');
  }
  if (
    raw.formatVersion == null
    && Number(raw.version) === 1
    && isPlainContentRecord(raw.content)
  ) {
    return /** @type {ValidatedContentPack} */ (
      /** @type {unknown} */ (legacyPackToV2(raw))
    );
  }
  if (Number(raw.formatVersion) !== CONTENT_PACK_FORMAT_VERSION) {
    throw new TypeError(`Unsupported content-pack format version "${String(raw.formatVersion)}".`);
  }

  const pack = /** @type {Record<string, unknown>} */ (detachContentJson(
    raw,
    { maxDepth: MAX_PACK_DEPTH, maxNodes: MAX_PACK_NODES },
  ));
  assertRecognizedFields(
    pack,
    V2_TOP_LEVEL_FIELDS,
    'Content pack',
    { requireAll: true },
  );
  if (pack.formatVersion !== CONTENT_PACK_FORMAT_VERSION) {
    throw new TypeError(`Unsupported content-pack format version "${String(pack.formatVersion)}".`);
  }
  pack.packId = cleanIdentifier(pack.packId, 'packId');
  pack.packVersion = cleanPackVersion(pack.packVersion);
  if (pack.contentSchemaVersion !== CONTENT_PACK_SCHEMA_VERSION) {
    throw new TypeError('Unsupported content schema version.');
  }
  pack.name = cleanRequiredText(pack.name, 'name', MAX_PACK_NAME_CHARS);
  pack.description = cleanOptionalText(
    pack.description,
    'description',
    MAX_PACK_DESCRIPTION_CHARS,
  );
  pack.authorship = cleanMetadata(pack.authorship, 'authorship');
  pack.license = cleanMetadata(pack.license, 'license');
  pack.source = cleanMetadata(pack.source, 'source');
  pack.compatibility = normalizeCompatibility(
    pack.compatibility,
    { requireAll: true },
  );
  pack.dependencies = cleanDependencies(pack.dependencies);
  pack.exportedAt = cleanExportedAt(pack.exportedAt);
  if (
    typeof pack.manifestHash !== 'string'
    || !MANIFEST_HASH_RE.test(pack.manifestHash)
  ) {
    throw new TypeError('manifestHash must be a lowercase SHA-256 hash.');
  }
  if (!isPlainContentRecord(pack.tunables)) {
    throw new TypeError('tunables must be an object.');
  }
  const tunableValidation = validateUserContentTunables(pack.tunables);
  if (!tunableValidation.ok) {
    throw new TypeError(
      `Pack contains unsupported tunables: ${tunableValidation.rejected.map(
        entry => entry.key,
      ).join(', ')}.`,
    );
  }
  pack.tunables = tunableValidation.tunables;
  if (!isPlainContentRecord(pack.visualSelection)) {
    throw new TypeError('visualSelection must be an object.');
  }
  const visualValidation = validateUserVisualSelection(
    pack.visualSelection,
  );
  if (!visualValidation.ok) {
    throw new TypeError(
      `Pack contains unsupported visual selections: ${visualValidation.rejected
        .map(entry => entry.key)
        .join(', ')}.`,
    );
  }
  pack.visualSelection = visualValidation.selection;
  if (!isPlainContentRecord(pack.content)) {
    throw new TypeError('Pack has no content.');
  }
  const content = /** @type {Record<string, unknown>} */ (pack.content);
  const unknownBuckets = Object.keys(content)
    .filter(bucket => !PACK_BUCKETS.includes(bucket));
  if (unknownBuckets.length) {
    throw new TypeError(`Pack contains unsupported categories: ${unknownBuckets.join(', ')}.`);
  }

  let itemCount = 0;
  const entryIds = new Set();
  const localUids = new Set();
  for (const bucket of PACK_BUCKETS) {
    const entries = content[bucket] ?? [];
    if (!Array.isArray(entries)) throw new TypeError(`content.${bucket} must be an array.`);
    for (const [index, entry] of entries.entries()) {
      itemCount += 1;
      if (itemCount > MAX_PACK_ITEMS) {
        throw new TypeError(`Pack exceeds the ${MAX_PACK_ITEMS}-item import limit.`);
      }
      if (!isPlainContentRecord(entry)) {
        throw new TypeError(`content.${bucket}[${index}] must be an object.`);
      }
      const entryId = cleanIdentifier(
        entry.packEntryId,
        `content.${bucket}[${index}].packEntryId`,
      );
      if (entryIds.has(entryId)) throw new TypeError(`Duplicate packEntryId "${entryId}".`);
      entryIds.add(entryId);
      if (entry.localUid != null) {
        const uid = cleanLocalUid(
          entry.localUid,
          `content.${bucket}[${index}].localUid`,
        );
        if (localUids.has(uid)) throw new TypeError(`Duplicate localUid "${uid}".`);
        entry.localUid = uid;
        localUids.add(uid);
      }
      readContentPackSourceIdentity(bucket, entry, entryId, `content.${bucket}[${index}]`);
      const expectedHash = contentRevisionHash(bucket, entry);
      if (entry.contentHash !== expectedHash) {
        throw new TypeError(`content.${bucket}[${index}] has a content hash mismatch.`);
      }
    }
  }
  const expectedManifestHash = contentPackManifestHash(pack);
  if (pack.manifestHash !== expectedManifestHash) {
    throw new TypeError('Pack manifest hash does not match its contents.');
  }
  return /** @type {ValidatedContentPack} */ (
    /** @type {unknown} */ (pack)
  );
}

/**
 * Parse and strictly admit an uploaded pack. Legacy v1 files are converted
 * through a one-way adapter with explicit warnings.
 */
export function parseContentPack(raw) {
  try {
    const pack = validatePackObject(parseObject(raw));
    return {
      ok: true,
      pack,
      warnings: Array.isArray(pack.importWarnings) ? pack.importWarnings : [],
      adaptedFromVersion: pack.legacyAdapted ? 1 : null,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Invalid content pack.',
    };
  }
}

function defaultItemValidation(bucket, item) {
  // The versioning validator checks the immutable record envelope. The
  // manifest is the sole authority for category fields and admitted values.
  const basic = validateVersionedContent(bucket, item);
  if (!basic.ok) return basic;
  const manifest = admitCustomContentDefinition(bucket, item, {
    allowSystemFields: true,
  });
  if (!manifest.ok) {
    return {
      ok: false,
      errors: manifest.errors.map(error => (
        error.field ? `${error.field}: ${error.code}` : error.code
      )),
    };
  }
  return { ok: true, errors: [] };
}

function stableImportedUid(packId, packEntryId) {
  return `lu_pack_${fingerprintContent({ packId, packEntryId }).slice(0, 24)}`;
}

function remapDependencyValue(value, refMap, missing, context) {
  const remapOne = (ref) => {
    if (typeof ref !== 'string') return ref;
    if (!ref.startsWith('custom:')) return ref;
    const resolved = refMap.get(ref);
    if (resolved) return resolved;
    missing.push({ ...context, refId: ref });
    return ref;
  };
  return Array.isArray(value) ? value.map(remapOne) : remapOne(value);
}

/**
 * Build an atomic import preview.
 *
 * Missing custom dependencies are retained in diagnostics and reject the
 * affected entry; they are never silently removed. V2 entry identity yields a
 * stable imported localUid so a later version can update the same pack-owned
 * definition instead of cloning it.
 */
export function prepareImport(pack, options = {}) {
  const content = pack?.content && isPlainContentRecord(pack.content)
    ? pack.content
    : {};
  const dependencyFields = Array.isArray(options.dependencyFields)
    ? options.dependencyFields.filter(field => PACK_DEP_FIELDS.includes(field))
    : PACK_DEP_FIELDS;
  const validateItem = typeof options.validateItem === 'function'
    ? options.validateItem
    : defaultItemValidation;
  const existingByPackEntry = options.existingByPackEntry instanceof Map
    ? options.existingByPackEntry
    : new Map(Object.entries(options.existingByPackEntry || {}));

  const refMap = new Map();
  const staged = [];
  for (const bucket of PACK_BUCKETS) {
    const entries = Array.isArray(content[bucket]) ? content[bucket] : [];
    for (const source of entries) {
      const packEntryId = String(source.packEntryId);
      const importedUid = stableImportedUid(pack.packId, packEntryId);
      if (source.localUid) {
        refMap.set(`custom:${source.localUid}`, `custom:${importedUid}`);
      }
      staged.push({
        bucket,
        packEntryId,
        source,
        item: {
          ...stripForPack(source),
          localUid: importedUid,
        },
      });
    }
  }

  const missingDependencies = [];
  for (const entry of staged) {
    for (const field of dependencyFields) {
      if (!Object.hasOwn(entry.item, field)) continue;
      entry.item[field] = remapDependencyValue(
        entry.item[field],
        refMap,
        missingDependencies,
        {
          bucket: entry.bucket,
          packEntryId: entry.packEntryId,
          field,
        },
      );
    }
  }

  const missingEntryIds = new Set(
    missingDependencies.map(diagnostic => diagnostic.packEntryId),
  );
  const items = [];
  const rejected = [];
  for (const entry of staged) {
    const item = entry.item;
    const sourceIdentity = readContentPackSourceIdentity(
      entry.bucket, entry.source, entry.packEntryId, entry.bucket,
    );
    // Pack-only identity never enters authored definition JSON.
    delete item.packEntryId;
    delete item.sourceDefinitionId;
    delete item.sourceRevisionId;
    delete item.contentHash;

    const verdict = validateItem(entry.bucket, item);
    const errors = verdict?.ok === true
      ? []
      : Array.isArray(verdict?.errors)
        ? verdict.errors.map(String)
        : ['The category manifest rejected this item.'];
    if (missingEntryIds.has(entry.packEntryId)) {
      errors.push('One or more custom dependencies are not included in this pack.');
    }
    if (errors.length) {
      rejected.push({
        bucket: entry.bucket,
        packEntryId: entry.packEntryId,
        name: String(item.name || '(unnamed)'),
        errors,
      });
      continue;
    }
    const existing = existingByPackEntry.get(entry.packEntryId) || null;
    items.push({
      bucket: entry.bucket,
      packEntryId: entry.packEntryId,
      sourceDefinitionId: sourceIdentity.sourceDefinitionId,
      sourceRevisionId: sourceIdentity.sourceRevisionId,
      sourceContentHash: sourceIdentity.contentHash,
      definitionId: existing?.definitionId || null,
      expectedHeadRevisionId: existing?.revisionId || null,
      operation: existing ? 'update' : 'create',
      item,
    });
  }

  const counts = {};
  for (const entry of items) counts[entry.bucket] = (counts[entry.bucket] || 0) + 1;
  const diagnostics = {
    missingDependencies,
    warnings: Array.isArray(pack.importWarnings) ? [...pack.importWarnings] : [],
    atomic: rejected.length === 0,
  };
  const preview = {
    packId: pack.packId,
    packVersion: pack.packVersion,
    manifestHash: pack.manifestHash,
    entries: items.map(entry => ({
      definitionId: entry.definitionId,
      expectedHeadRevisionId: entry.expectedHeadRevisionId,
      packEntryId: entry.packEntryId,
      category: entry.bucket,
      data: entry.item,
    })),
  };
  return {
    items,
    rejected,
    counts,
    diagnostics,
    preview,
    previewFingerprint: fingerprintContent(preview),
  };
}

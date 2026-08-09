/**
 * Fail-closed schema-3 baseline envelope for the observed-shape ratchet.
 *
 * The baseline is an executable governance input, not a bag of ceilings.  A
 * malformed row, missing migration genesis, disabled sentinel, or unbound scan
 * path must stop the gate before the expensive producer corpus executes.
 */
import {
  FULL_GIT_SHA,
  SHA256,
  assertManifest,
  assertTreeRelations,
  canonicalJson,
  digestOf,
  governedLegacyAlgorithmOf,
  isFindingSite,
  LEGACY_ALGORITHM_BASE_SHA,
  scannerToolDigestOf,
} from './observed-shape-governance.mjs';

export const BASELINE_SCHEMA = 3;
export const MIN_ROWS = 40;
export const ORIGIN_MIN_ROWS = 8;

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const CANONICAL_SRC_PATH = /^src\/(?!.*(?:^|\/)\.\.?(?:\/|$))(?!.*\/\/)[^\\\0]+$/;
const REQUIRED_POSITIVE_SENTINEL = [
  'usableShapes', 'totalKeys', 'usableOrigins', 'originKeys', 'transitions',
  'resolvedReads', 'resolvedOrigins',
];
const REQUIRED_ZERO_SENTINEL = [
  'corpusDepthTruncations', 'resolverDepthTruncations', 'depthTruncations',
  'corpusCycleCuts', 'resolverCycleCuts', 'cycleCuts',
];
const REQUIRED_RECEIPT_DIGESTS = [
  'bundleDigest', 'reportDigest', 'reviewDigest', 'predecessorBaselineDigest',
  'predecessorBaselineTextSha256', 'predecessorInventoryDigest',
  'legacyArtifactDigest', 'currentArtifactDigest', 'sourceTreeDigest',
  'scanTreeDigest', 'detectorTreeDigest', 'executionTreeDigest', 'corpusDigest',
  'scanConfigDigest', 'targetInventoryDigest', 'currentFindingsDigest',
  'legacyDetectorDigest', 'legacyScannerToolDigest', 'currentDetectorDigest',
  'currentScannerToolDigest',
];
const REQUIRED_RECEIPT_SHAS = [
  'subjectSha', 'legacyScannerSha', 'currentScannerSha', 'legacyAlgorithmBaseSha',
];

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`observed-shape baseline ${label} must be an object`);
  }
  return value;
}

function assertExactKeys(value, label, expected) {
  assertObject(value, label);
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (canonicalJson(actual) !== canonicalJson(wanted)) {
    throw new Error(`observed-shape baseline ${label} has noncanonical fields: ${canonicalJson(actual)}`);
  }
}

function positiveSafeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(`observed-shape baseline ${label} must be a positive safe integer; received ${JSON.stringify(value)}`);
  }
  return value;
}

function nonNegativeSafeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`observed-shape baseline ${label} must be a non-negative safe integer; received ${JSON.stringify(value)}`);
  }
  return value;
}

export function parseExactBaselineIdentity(identity) {
  if (typeof identity !== 'string' || !identity) {
    throw new Error('observed-shape baseline identity must be a nonempty string');
  }
  const siteSeparator = identity.lastIndexOf(' # ');
  const originSeparator = identity.lastIndexOf(' @ ', siteSeparator - 1);
  const site = identity.slice(siteSeparator + 3);
  if (siteSeparator < 1 || originSeparator < 1 || siteSeparator <= originSeparator + 3
    || !isFindingSite(site)) {
    throw new Error(`observed-shape baseline identity is malformed: ${JSON.stringify(identity)}`);
  }
  const encodedSiteKey = site.slice(site.lastIndexOf('|key=') + 5);
  let key;
  try {
    key = decodeURIComponent(encodedSiteKey);
  } catch (error) {
    throw new Error(`observed-shape baseline identity has an invalid encoded key: ${JSON.stringify(identity)}`, { cause: error });
  }
  const prefix = `${key} on `;
  if (!identity.startsWith(prefix) || originSeparator <= prefix.length) {
    throw new Error(`observed-shape baseline identity is malformed: ${JSON.stringify(identity)}`);
  }
  const parsed = {
    key,
    shape: identity.slice(prefix.length, originSeparator),
    origin: identity.slice(originSeparator + 3, siteSeparator),
    site,
  };
  if (!parsed.key || !parsed.shape || !parsed.origin || !isFindingSite(parsed.site)) {
    throw new Error(`observed-shape baseline identity is malformed: ${JSON.stringify(identity)}`);
  }
  if (encodedSiteKey !== encodeURIComponent(parsed.key)
    || `${parsed.key} on ${parsed.shape} @ ${parsed.origin} # ${parsed.site}` !== identity) {
    throw new Error(`observed-shape baseline identity is noncanonical: ${JSON.stringify(identity)}`);
  }
  return parsed;
}

function validateMigrationReceipt(receipt, baseline) {
  assertObject(receipt, 'migrationReview');
  assertExactKeys(receipt, 'migrationReview', [
    ...REQUIRED_RECEIPT_DIGESTS, ...REQUIRED_RECEIPT_SHAS,
  ]);
  for (const key of REQUIRED_RECEIPT_DIGESTS) {
    if (!SHA256.test(receipt[key] || '')) {
      throw new Error(`observed-shape baseline migrationReview.${key} must be a SHA-256 digest`);
    }
  }
  for (const key of REQUIRED_RECEIPT_SHAS) {
    if (!FULL_GIT_SHA.test(receipt[key] || '')) {
      throw new Error(`observed-shape baseline migrationReview.${key} must be a full Git SHA`);
    }
  }
  if (receipt.legacyAlgorithmBaseSha !== LEGACY_ALGORITHM_BASE_SHA) {
    throw new Error('observed-shape baseline migration receipt names an ungoverned legacy algorithm');
  }
  if (receipt.subjectSha !== receipt.currentScannerSha
    || receipt.subjectSha !== receipt.legacyScannerSha
    || receipt.detectorTreeDigest !== receipt.currentDetectorDigest
    || receipt.detectorTreeDigest !== receipt.legacyDetectorDigest) {
    throw new Error('observed-shape baseline migration receipt does not bind one committed detector execution');
  }
  const legacyAlgorithm = governedLegacyAlgorithmOf(baseline.manifests.detectorTree);
  const expectedCurrentToolDigest = scannerToolDigestOf({
    scannerSha: receipt.currentScannerSha,
    detectorTreeDigest: receipt.currentDetectorDigest,
  });
  const expectedLegacyToolDigest = scannerToolDigestOf({
    scannerSha: receipt.legacyScannerSha,
    detectorTreeDigest: receipt.legacyDetectorDigest,
    legacyAlgorithm,
  });
  const expectedScanConfigDigest = digestOf({
    corpusGraphSchema: 2,
    minRows: baseline.minRows,
    originMinRows: baseline.originMinRows,
  });
  if (receipt.currentScannerToolDigest !== expectedCurrentToolDigest
    || receipt.legacyScannerToolDigest !== expectedLegacyToolDigest
    || receipt.scanConfigDigest !== expectedScanConfigDigest) {
    throw new Error('observed-shape baseline migration receipt has unreconstructable scanner-tool or scan-config provenance');
  }

  // At migration genesis the baseline is frozen against the schema-2 subject
  // commit itself. Later shrink-only maintenance advances frozenAtSha while the
  // immutable migration receipt remains unchanged, so only the genesis envelope
  // can (and must) prove these artifact-to-baseline relations directly.
  if (baseline.frozenAtSha === receipt.subjectSha) {
    if (receipt.scanTreeDigest !== baseline.manifests.scanTree.digest
      || receipt.sourceTreeDigest !== baseline.manifests.sourceTree.digest
      || receipt.detectorTreeDigest !== baseline.manifests.detectorTree.digest
      || receipt.executionTreeDigest !== baseline.manifests.executionTree.digest
      || receipt.targetInventoryDigest !== digestOf(baseline.inventory)) {
      throw new Error('observed-shape migration-genesis receipt disagrees with its frozen manifests or target inventory');
    }
  }
  return receipt;
}

function validateSentinel(sentinel) {
  assertExactKeys(sentinel, 'sentinel', [
    ...REQUIRED_POSITIVE_SENTINEL, ...REQUIRED_ZERO_SENTINEL,
  ]);
  for (const key of REQUIRED_POSITIVE_SENTINEL) positiveSafeInteger(sentinel[key], `sentinel.${key}`);
  for (const key of REQUIRED_ZERO_SENTINEL) {
    nonNegativeSafeInteger(sentinel[key], `sentinel.${key}`);
    if (sentinel[key] !== 0) {
      throw new Error(`observed-shape baseline sentinel.${key} must be zero; traversal loss cannot be frozen`);
    }
  }
  return sentinel;
}

function validateStats(stats, scanTree, sentinel) {
  assertObject(stats, 'scanStats');
  for (const key of ['files', 'reads', 'resolved', 'resolvedOrigins']) {
    positiveSafeInteger(stats[key], `scanStats.${key}`);
  }
  nonNegativeSafeInteger(stats.unresolved, 'scanStats.unresolved');
  if (stats.files !== scanTree.entries.length
    || stats.reads !== stats.resolved + stats.unresolved
    || stats.resolved !== sentinel.resolvedReads
    || stats.resolvedOrigins !== sentinel.resolvedOrigins) {
    throw new Error('observed-shape baseline scanStats disagree with its scan tree or sentinel');
  }
  for (const key of [
    'depthTruncations', 'cycleCuts', 'computedRecordUnknown', 'objectValuesRecordUnknown',
  ]) {
    nonNegativeSafeInteger(stats[key], `scanStats.${key}`);
    if (stats[key] !== 0) throw new Error(`observed-shape baseline scanStats.${key} must be zero`);
  }
  return stats;
}

function validateInventory(inventory, scanTree) {
  assertObject(inventory, 'inventory');
  const files = Object.keys(inventory);
  if (!files.length) throw new Error('observed-shape baseline inventory must not be empty');
  const scanPaths = new Set(scanTree.entries.map((entry) => entry.path));
  let identities = 0;
  for (const file of files) {
    if (!CANONICAL_SRC_PATH.test(file) || !scanPaths.has(file)) {
      throw new Error(`observed-shape baseline inventory file is not a canonical scanned source: ${JSON.stringify(file)}`);
    }
    const row = assertObject(inventory[file], `inventory row ${file}`);
    const entries = Object.entries(row);
    if (!entries.length) throw new Error(`observed-shape baseline inventory row is empty: ${file}`);
    for (const [identity, count] of entries) {
      parseExactBaselineIdentity(identity);
      if (count !== 1) {
        throw new Error(`observed-shape baseline exact identity count must be exactly 1: ${file} / ${identity}`);
      }
      identities += 1;
    }
  }
  return identities;
}

export function validateSchema3Baseline(baseline) {
  assertExactKeys(baseline, 'schema-3 envelope', [
    '_doc', 'corpusMeta', 'digests', 'frozen', 'frozenAtSha', 'identities',
    'inventory', 'manifests', 'migrationReview', 'minRows', 'originMinRows',
    'scanStats', 'scannerProvenance', 'schema', 'sentinel', 'total',
  ]);
  if (baseline.schema !== BASELINE_SCHEMA) throw new Error('observed-shape baseline is not schema 3');
  if (!Array.isArray(baseline._doc) || !baseline._doc.length
    || baseline._doc.some((line) => typeof line !== 'string' || !line)) {
    throw new Error('observed-shape baseline documentation is malformed');
  }
  if (!DATE.test(baseline.frozen || '') || !FULL_GIT_SHA.test(baseline.frozenAtSha || '')) {
    throw new Error('observed-shape baseline freeze provenance is malformed');
  }
  if (baseline.minRows !== MIN_ROWS || baseline.originMinRows !== ORIGIN_MIN_ROWS) {
    throw new Error('observed-shape baseline threshold constants drifted');
  }
  assertObject(baseline.corpusMeta, 'corpusMeta');
  if (!Object.keys(baseline.corpusMeta).length) throw new Error('observed-shape baseline corpusMeta is empty');
  assertExactKeys(baseline.manifests, 'manifests', [
    'detectorTree', 'executionTree', 'scanTree', 'sourceTree',
  ]);
  for (const [name, manifest] of Object.entries(baseline.manifests)) assertManifest(manifest, name);
  assertTreeRelations(baseline.manifests);
  const sentinel = validateSentinel(baseline.sentinel);
  validateStats(baseline.scanStats, baseline.manifests.scanTree, sentinel);
  const identities = validateInventory(baseline.inventory, baseline.manifests.scanTree);
  if (baseline.total !== identities || baseline.identities !== identities) {
    throw new Error(`observed-shape baseline totals are inconsistent: total=${baseline.total}, identities=${baseline.identities}, rows=${identities}`);
  }
  const receipt = validateMigrationReceipt(baseline.migrationReview, baseline);
  assertExactKeys(baseline.scannerProvenance, 'scannerProvenance', [
    'detectorDigest', 'executionTreeDigest', 'scanTreeDigest', 'sourceTreeDigest',
    'unscannedInputDigest',
  ]);
  const scannedPaths = new Set(baseline.manifests.scanTree.entries.map((entry) => entry.path));
  const expectedProvenance = {
    detectorDigest: baseline.manifests.detectorTree.digest,
    executionTreeDigest: baseline.manifests.executionTree.digest,
    scanTreeDigest: baseline.manifests.scanTree.digest,
    sourceTreeDigest: baseline.manifests.sourceTree.digest,
    unscannedInputDigest: digestOf(baseline.manifests.sourceTree.entries
      .filter((entry) => !scannedPaths.has(entry.path))),
  };
  if (canonicalJson(baseline.scannerProvenance) !== canonicalJson(expectedProvenance)
    || receipt.currentDetectorDigest !== expectedProvenance.detectorDigest) {
    throw new Error('observed-shape baseline scanner provenance disagrees with its manifests or migration genesis');
  }
  assertExactKeys(baseline.digests, 'digests', [
    'corpusMeta', 'inventory', 'manifests', 'migrationReview', 'scanStats', 'sentinel',
  ]);
  for (const [name, value] of Object.entries({
    corpusMeta: baseline.corpusMeta,
    inventory: baseline.inventory,
    manifests: baseline.manifests,
    migrationReview: baseline.migrationReview,
    scanStats: baseline.scanStats,
    sentinel: baseline.sentinel,
  })) {
    if (!SHA256.test(baseline.digests[name] || '') || baseline.digests[name] !== digestOf(value)) {
      throw new Error(`observed-shape baseline ${name} digest mismatch`);
    }
  }
  return baseline;
}

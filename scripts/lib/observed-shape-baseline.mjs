/**
 * Fail-closed baseline envelopes for the observed-shape ratchet.
 *
 * The baseline is an executable governance input, not a bag of ceilings.  A
 * malformed row, missing migration genesis, disabled sentinel, or unbound scan
 * path must stop the gate before the expensive producer corpus executes.
 *
 * ── ⭐⭐ THREE IDENTITY DEFINITIONS LIVE HERE, AND ONLY ONE IS THE AUTHORITY ──
 *
 * `BASELINE_SCHEMA` is **5**: the EXPLAINED-WRITER-FILTERED heuristic-leaf
 * identity. Same SPELLING as schema 4 (`<key> on <shape>` with a per-identity
 * MULTIPLICITY) and the same byte-frozen `legacy-reader-shape-scan.mjs`
 * detector, but the finding set is the detector's output NARROWED by the two
 * declared, controlled post-filters in `check-observed-shape-readers.mjs`:
 * CR-OSR-FREEZE-6's shape-family union (M6) and the EXPLAINED-WRITER exemption
 * (M8/M9). It is the full-tree gate authority.
 *
 * `RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA` is **4**: the SAME spelling with the
 * detector's RAW output. Retired, never redefined, never deleted.
 *
 * `RETIRED_EXACT_BASELINE_SCHEMA` is **3**: the exact per-site identity
 * (`<key> on <shape> @ <origin> # <semantic-site>`), always singular. It is
 * RETIRED, never redefined and never deleted — CR-OSR-FREEZE-1 keeps the exact
 * scanner a TARGETED INSTRUMENT, and redefining schema 3 in place would falsify
 * every recorded reference to it (the no-history-rewriting ethos).
 *
 * ⚠ `validateSchema3Baseline` and its `validateMigrationReceipt` are
 * DELIBERATELY NOT SHARED with the leaf pair below. The duplication is the
 * point: a retired definition that a live definition can move is not retired.
 * This is not the doubled-law shape CR-OSR-FREEZE-8 refuses — that was one LIVE
 * law with two homes and one test. Here the live row law has exactly ONE home
 * (`assertBaselineRow`, consumed by both the envelope validator and the gate's
 * `rowOf`), and each definition carries its own executed pins.
 *
 * ⚠⚠ SCHEMAS 4 AND 5 *DO* SHARE ONE ENVELOPE VALIDATOR, AND THAT IS THE OPPOSITE
 * CALL FOR THE OPPOSITE REASON. Schema 3's shape genuinely differs (exact
 * identity, thirteen-field sentinel, `count === 1`), so a shared validator would
 * have had to be a parameterised superset of two different laws. Schemas 4 and 5
 * have the IDENTICAL envelope, identity grammar, telemetry record and receipt —
 * only the finding-set PRODUCER differs — so two copies would be one live law
 * with two homes, which is exactly the CR-OSR-FREEZE-8 shape. The one thing that
 * must not be shared is the schema NUMBER, so `validateLeafBaseline` takes it as
 * an argument and each entry point pins its own; a pin proves each refuses the
 * other's number.
 *
 * ⚠⚠ WHY SCHEMA 4 EXISTED AT ALL (CR-OSR-FREEZE-3-R1, measured): schema 3 IS the
 * exact per-site identity by definition, so its validator refuses 2168/2168
 * heuristic rows, and the exact detector cannot complete a full-tree scan (it
 * walls at `src/data/constants.js:56`, abstract-state growth 16385 > 16384).
 * Minting a fourth schema is what let the heuristic leg become the authority
 * without either weakening schema 3 or shipping a scan that cannot finish.
 *
 * ⚠⚠ WHY SCHEMA 5 EXISTS (CR-OSR-FREEZE-6-R2, measured): a detector change is
 * not lane-executable. `check-observed-shape-readers.mjs` refuses any run whose
 * live detectorTree digest differs from the frozen one, `--write` THROWS on a
 * clean committed tree, and `--migrate-schema=<live>` is refused as ordinary
 * maintenance. Every governed scanner path is inside that digest, so the ONLY
 * lawful way to change what the detector reports is to mint a new schema. Five
 * pending changes were each individually not worth a mint and together plainly
 * were; this is that consolidated mint.
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

export const BASELINE_SCHEMA = 5;
/** The RETIRED exact per-site definition. Never redefined, never deleted. */
export const RETIRED_EXACT_BASELINE_SCHEMA = 3;
/** The RETIRED UNFILTERED heuristic-leaf definition — schema 5's predecessor.
 *  Same identity grammar, raw detector output. Never redefined, never deleted. */
export const RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA = 4;
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

/**
 * ⭐ THE LEAF IDENTITY (schemas 4 and 5): `<key> on <shape>`, one ` on ` separator and
 * no interior whitespace on either side. Both halves are minted by
 * `artifactIdentityOf('legacy-leaf', …)` as `${key} on ${shapes.join('|')}`,
 * and `assertLegacyFinding` already pins `shapes.length === 1`, so a `|` can
 * only reach a row through a spelling this module does not mint. MEASURED over
 * both real inventories (the schema-2 predecessor's 1,296 distinct identities
 * and the live heuristic scan's 840): every one matches, none carries `|`.
 *
 * ⚠ The exact schema-3 spelling is REFUSED here, structurally rather than by a
 * blocklist: `<key> on <shape> @ <origin> # <site>` carries interior spaces, so
 * `\S+ on \S+` cannot match it. A schema-3 row hand-pasted into a leaf
 * baseline therefore fails closed instead of being read as a leaf identity
 * whose "shape" is a truncated origin.
 *
 * ⚠⚠ SCHEMA 5 DID NOT CHANGE THIS GRAMMAR, AND THAT IS WHY THE 4→5 MIGRATION IS
 * A RECONCILIATION RATHER THAN A RE-SPELLING: the alphabet is identical, so the
 * predecessor's rows and the target's rows are directly comparable and the whole
 * review is `predecessorRows`. What schema 5 changed is which findings the
 * instrument EMITS, not how any of them is addressed.
 */
const LEAF_IDENTITY = /^(\S+) on (\S+)$/;

export function parseLeafBaselineIdentity(identity) {
  if (typeof identity !== 'string' || !identity) {
    throw new Error('observed-shape baseline identity must be a nonempty string');
  }
  const match = LEAF_IDENTITY.exec(identity);
  if (!match) {
    throw new Error(`observed-shape baseline heuristic identity is malformed: ${JSON.stringify(identity)}.`
      + ` Schema-${BASELINE_SCHEMA} rows are "<key> on <shape>". The exact`
      + ' "<key> on <shape> @ <executed-origin> # <semantic-site>" spelling belongs to the'
      + ` RETIRED schema-${RETIRED_EXACT_BASELINE_SCHEMA} exact definition and cannot be frozen here.`);
  }
  const parsed = { key: match[1], shape: match[2] };
  if (`${parsed.key} on ${parsed.shape}` !== identity) {
    throw new Error(`observed-shape baseline identity is noncanonical: ${JSON.stringify(identity)}`);
  }
  return parsed;
}

/**
 * ⭐⭐ CR-OSR-FREEZE-8 — THE ONE HOME OF THE LIVE ROW LAW.
 *
 * Two copies of the `count` law used to exist — one inside this module's
 * inventory validation and one inside the gate's `rowOf` — and only the first
 * was tested. An untested twin is the recorded unreachable-arm shape: it can
 * drift arbitrarily far from its sibling and nothing reds. The gate's `rowOf`
 * now DELEGATES here, so there is exactly one live definition and both callers
 * exercise it.
 *
 * ⚠ THE LAW ITSELF CHANGED WITH THE SCHEMA, AND THAT IS NOT A WEAKENING. Schema
 * 3's law was `count === 1`, because an exact per-SITE identity is singular by
 * construction. A heuristic leaf identity is a MULTIPLICITY — one `<key> on
 * <shape>` legitimately covers several reads in one file (MEASURED: up to 24 in
 * the schema-2 predecessor, up to 10 in the live heuristic scan). So the leaf
 * schemas pin a positive safe integer, and the anti-swap property is carried by
 * the IDENTITY being frozen per file rather than by the count being 1.
 */
export function assertBaselineRow(row, file = '') {
  if (!row || typeof row !== 'object' || Array.isArray(row)) {
    throw new Error(`observed-shape baseline: row for "${file}" is the RETIRED count-only form (${JSON.stringify(row)}).`
      + ' Rows are now {"<key> on <shape>": multiplicity} so an identity SWAP at constant count reds.'
      + ' Re-freeze with `node scripts/check-observed-shape-readers.mjs --write`.');
  }
  const entries = Object.entries(row);
  if (!entries.length) throw new Error(`observed-shape baseline: row for "${file}" is empty.`);
  for (const [identity, count] of entries) {
    parseLeafBaselineIdentity(identity);
    if (!Number.isSafeInteger(count) || count < 1) {
      throw new Error(`observed-shape baseline: multiplicity for "${file}" / ${JSON.stringify(identity)}`
        + ` must be a positive safe integer; received ${JSON.stringify(count)}.`);
    }
  }
  return row;
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

/**
 * ⛔ RETIRED — the exact per-site definition. Kept executable so historical
 * schema-3 envelopes and the exact instrument's targeted receipts stay
 * verifiable; NEVER redefined in place. The live authority is
 * `validateSchema4Baseline` below.
 */
export function validateSchema3Baseline(baseline) {
  assertExactKeys(baseline, 'schema-3 envelope', [
    '_doc', 'corpusMeta', 'digests', 'frozen', 'frozenAtSha', 'identities',
    'inventory', 'manifests', 'migrationReview', 'minRows', 'originMinRows',
    'scanStats', 'scannerProvenance', 'schema', 'sentinel', 'total',
  ]);
  if (baseline.schema !== RETIRED_EXACT_BASELINE_SCHEMA) throw new Error('observed-shape baseline is not schema 3');
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

/* ══ THE HEURISTIC-LEAF ENVELOPE — schema 4 (retired) and 5 (live) ═════════ */

/**
 * ⛔ RETIRED — the UNFILTERED heuristic-leaf definition (CR-OSR-FREEZE-3-R1).
 * Kept executable so the committed schema-4 genesis stays verifiable and so the
 * schema-4 → schema-5 migration validates its own predecessor envelope with the
 * governed law rather than an ad-hoc one. NEVER redefined in place.
 */
export function validateSchema4Baseline(baseline) {
  return validateLeafBaseline(baseline, RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA);
}

/** The LIVE authority — the EXPLAINED-WRITER-FILTERED heuristic-leaf definition. */
export function validateSchema5Baseline(baseline) {
  return validateLeafBaseline(baseline, BASELINE_SCHEMA);
}

/** The heuristic detector emits exactly these four telemetry fields. Requiring
 *  the key set EXACTLY (a total positive predicate, never a blocklist of
 *  exact-only fields) means a mode mix-up — an exact-origin stats record pasted
 *  into a schema-4 envelope — fails closed instead of validating on a subset. */
const HEURISTIC_STATS_KEYS = ['files', 'reads', 'resolved', 'unresolved'];
/** `scanSentinelOf('legacy-leaf', …)` returns exactly these three. */
const HEURISTIC_SENTINEL_KEYS = ['usableShapes', 'totalKeys', 'resolvedReads'];

function validateHeuristicSentinel(sentinel) {
  assertExactKeys(sentinel, 'sentinel', HEURISTIC_SENTINEL_KEYS);
  for (const key of HEURISTIC_SENTINEL_KEYS) positiveSafeInteger(sentinel[key], `sentinel.${key}`);
  return sentinel;
}

function validateHeuristicStats(stats, scanTree, sentinel) {
  assertExactKeys(stats, 'scanStats', HEURISTIC_STATS_KEYS);
  for (const key of ['files', 'reads', 'resolved']) {
    positiveSafeInteger(stats[key], `scanStats.${key}`);
  }
  nonNegativeSafeInteger(stats.unresolved, 'scanStats.unresolved');
  if (stats.files !== scanTree.entries.length
    || stats.reads !== stats.resolved + stats.unresolved
    || stats.resolved !== sentinel.resolvedReads) {
    throw new Error('observed-shape baseline scanStats disagree with its scan tree or sentinel');
  }
  return stats;
}

function validateHeuristicInventory(inventory, scanTree) {
  assertObject(inventory, 'inventory');
  const files = Object.keys(inventory);
  if (!files.length) throw new Error('observed-shape baseline inventory must not be empty');
  const scanPaths = new Set(scanTree.entries.map((entry) => entry.path));
  let identities = 0;
  let total = 0;
  for (const file of files) {
    if (!CANONICAL_SRC_PATH.test(file) || !scanPaths.has(file)) {
      throw new Error(`observed-shape baseline inventory file is not a canonical scanned source: ${JSON.stringify(file)}`);
    }
    for (const count of Object.values(assertBaselineRow(inventory[file], file))) {
      identities += 1;
      total += count;
      if (!Number.isSafeInteger(total)) {
        throw new Error('observed-shape baseline inventory totals exceed safe integer range');
      }
    }
  }
  return { identities, total };
}

/**
 * ⭐⭐ THE HEURISTIC-LEAF MIGRATION RECEIPT — ONE GOVERNED HEURISTIC DETECTOR.
 *
 * Deliberately NOT the schema-3 receipt validator with a flag: see the module
 * header. The key set is identical (so the receipt stays one shape across all
 * three definitions and `validateGovernedMigration` needs no new assembly), but
 * the EQUALITIES are stronger, and they say what the leaf schemas actually
 * claim:
 *
 *   schema 3    "current" = the exact detector, "legacy" = the governed heuristic
 *               detector; the two tool digests DIFFER (only the legacy one folds
 *               in `legacyAlgorithm`).
 *   schema 4/5  there is no second detector. The heuristic leg IS the current
 *               authority, so current* === legacy* in EVERY field — including the
 *               artifact digest and the scanner-tool digest, which must both
 *               reconstruct from the FROZEN legacy algorithm. A receipt naming an
 *               exact-detector tool digest as "current" is refused: that would be
 *               a leaf baseline claiming provenance from an instrument that
 *               cannot complete a full-tree scan.
 *
 * ⭐ WHERE SCHEMA 5's POST-FILTERS ARE CONTENT-ADDRESSED, since they are not a
 * field of their own: `SHAPE_FAMILY_FILTER`, `CLASS_A_PROTECTED_IDENTITIES` and
 * `EXPLAINED_WRITER_EXEMPTIONS` all live in `check-observed-shape-readers.mjs`,
 * which is one of the eleven governed `scannerToolFiles()` paths and therefore
 * inside `detectorTreeDigest` — a field this receipt binds and the gate compares
 * against the live tree on every run. Retuning a threshold or adding an
 * exemption MOVES that digest and reds the gate, exactly as editing the detector
 * does. The filters are governed by the same mechanism as the detector, not by a
 * second one.
 */
function validateHeuristicMigrationReceipt(receipt, baseline) {
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
  if (receipt.currentArtifactDigest !== receipt.legacyArtifactDigest
    || receipt.currentScannerToolDigest !== receipt.legacyScannerToolDigest) {
    throw new Error(`observed-shape schema-${baseline.schema} migration receipt does not bind ONE heuristic authority:`
      + ' the current artifact and scanner tool must be the governed legacy-leaf detector itself');
  }
  const legacyAlgorithm = governedLegacyAlgorithmOf(baseline.manifests.detectorTree);
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
  if (receipt.legacyScannerToolDigest !== expectedLegacyToolDigest
    || receipt.scanConfigDigest !== expectedScanConfigDigest) {
    throw new Error('observed-shape baseline migration receipt has unreconstructable scanner-tool or scan-config provenance');
  }

  // At migration genesis the baseline is frozen against the subject commit
  // itself. Later shrink-only maintenance advances frozenAtSha while the
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

/**
 * The heuristic-leaf envelope. Same 16 keys as schema 3; leaf identities with
 * multiplicity, heuristic telemetry, and a one-detector migration receipt.
 *
 * ⚠ `schema` IS AN ARGUMENT, NOT A CONSTANT READ FROM MODULE SCOPE. Schemas 4
 * and 5 share this law exactly (see the module header for why sharing is right
 * here and wrong for schema 3); what must never be shared is WHICH number each
 * accepts, so each entry point below supplies its own and a pin drives both
 * directions of the refusal.
 */
function validateLeafBaseline(baseline, schema) {
  assertExactKeys(baseline, `schema-${schema} envelope`, [
    '_doc', 'corpusMeta', 'digests', 'frozen', 'frozenAtSha', 'identities',
    'inventory', 'manifests', 'migrationReview', 'minRows', 'originMinRows',
    'scanStats', 'scannerProvenance', 'schema', 'sentinel', 'total',
  ]);
  if (baseline.schema !== schema) {
    throw new Error(`observed-shape baseline is not schema ${schema}`);
  }
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
  const sentinel = validateHeuristicSentinel(baseline.sentinel);
  validateHeuristicStats(baseline.scanStats, baseline.manifests.scanTree, sentinel);
  const { identities, total } = validateHeuristicInventory(
    baseline.inventory,
    baseline.manifests.scanTree,
  );
  if (baseline.total !== total || baseline.identities !== identities) {
    throw new Error(`observed-shape baseline totals are inconsistent: total=${baseline.total}, identities=${baseline.identities}, rows=${identities}, counts=${total}`);
  }
  const receipt = validateHeuristicMigrationReceipt(baseline.migrationReview, baseline);
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

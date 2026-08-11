/**
 * Canonical, content-addressed envelopes for observed-shape scans.
 *
 * A migration report is only meaningful when its corpus, findings, inventory,
 * detector and scanned source tree are immutable inputs.  This module owns the
 * deterministic spelling and validation of those inputs; it deliberately has
 * no dependency on the baseline or on the migration CLI.
 */
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { relative, resolve } from 'node:path';

export const SCAN_ARTIFACT_SCHEMA = 2;
export const FINDING_SITE_SCHEMA = 'semantic-ast-v2';
export const LEGACY_FINDING_SITE_SCHEMA = 'source-position-v1';
export const FULL_GIT_SHA = /^[0-9a-f]{40}$/;
export const FINDING_SITE_PATTERN = /^v2\|owner=[^|]+\|context=[a-f0-9]{64}\|expr=[a-f0-9]{64}\|ordinal=\d+\|kind=(?:dot|element)\|key=[^|]+$/;
export const LEGACY_ALGORITHM_BASE_SHA = '6e7acc4dd88a43cb608f40bc77db3b2130a1e2de';
export const LEGACY_ALGORITHM_BLOB_SHA = '0310fa9fdda873c1b382cf18c3936707e8e4addf';
export const LEGACY_ALGORITHM_ENRICHMENT = 'node-name-start-v1';
export const LEGACY_ALGORITHM_MODULE_PATH = 'scripts/lib/legacy-reader-shape-scan.mjs';

const LEGACY_DETECTOR_FILE = fileURLToPath(new URL('./legacy-reader-shape-scan.mjs', import.meta.url));
const LEGACY_ORIGINAL_EMISSION = 'file: rel, line: line + 1, key, shapes: objects.sort(),';
const LEGACY_POSITION_EMISSION = 'file: rel, line: line + 1, pos: node.name.getStart(sf), key, shapes: objects.sort(),';

export const SHA256 = /^[0-9a-f]{64}$/;
const CANONICAL_PATH = /^(?!\/)(?!.*(?:^|\/)\.\.?(?:\/|$))(?!.*\/\/)[^\\\0]+$/;
const MANIFEST_ALGORITHM = 'sha256-canonical-path-type-mode-size-content-v2';
const MODE = Object.freeze({
  'legacy-leaf': Object.freeze({
    baselineSchema: 2,
    siteSchema: LEGACY_FINDING_SITE_SCHEMA,
    posEnrichment: LEGACY_ALGORITHM_ENRICHMENT,
  }),
  'exact-origin': Object.freeze({
    baselineSchema: 3,
    siteSchema: FINDING_SITE_SCHEMA,
  }),
});

/** Kept as one exported predicate because the scanner owns this wire format. */
export function isFindingSite(value) {
  return typeof value === 'string' && FINDING_SITE_PATTERN.test(value);
}

/**
 * The ARTIFACT schema a scan mode emits — never the BASELINE schema in force.
 *
 * ⚠⚠ These two numbers are not the same thing and were briefly conflated. The
 * scan artifact's `baselineSchema` names the IDENTITY SPELLING its findings
 * carry (`legacy-leaf` → 2, `exact-origin` → 3) and is pinned by
 * `createScanArtifact`. The gate's `BASELINE_SCHEMA` names the ENVELOPE in
 * force, now 4. Deriving the artifact number from this table instead of writing
 * it beside `BASELINE_SCHEMA` is what stops a schema bump from silently minting
 * `baselineSchema: 4` exact artifacts that the mode table refuses.
 */
export function artifactBaselineSchemaOf(scanMode) {
  const mode = MODE[scanMode];
  if (!mode) throw new Error(`observed-shape scan mode is unsupported: ${JSON.stringify(scanMode)}`);
  return mode.baselineSchema;
}

function canonicalValue(value, stack = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error(`cannot canonically encode non-finite number ${value}`);
    return value;
  }
  if (Array.isArray(value)) {
    if (stack.has(value)) throw new Error('cannot canonically encode a cyclic array');
    stack.add(value);
    const out = value.map((entry) => canonicalValue(entry, stack));
    stack.delete(value);
    return out;
  }
  if (value && typeof value === 'object') {
    if (stack.has(value)) throw new Error('cannot canonically encode a cyclic object');
    stack.add(value);
    // A normal object is not an inert JSON dictionary: assigning `__proto__`
    // invokes Object.prototype's legacy setter and silently drops that own key.
    // A null-prototype accumulator preserves every JSON key, including
    // `__proto__`, `constructor`, and `prototype`, so canonicalization remains
    // injective over parsed JSON instead of admitting digest collisions.
    const out = Object.create(null);
    for (const key of Object.keys(value).sort()) {
      if (value[key] === undefined) {
        throw new Error(`cannot canonically encode undefined at key ${JSON.stringify(key)}`);
      }
      out[key] = canonicalValue(value[key], stack);
    }
    stack.delete(value);
    return out;
  }
  throw new Error(`cannot canonically encode ${typeof value}`);
}

export function canonicalJson(value, space = 0) {
  return JSON.stringify(canonicalValue(value), null, space);
}

export function digestOf(value) {
  return createHash('sha256').update(canonicalJson(value)).digest('hex');
}

/**
 * Verify the checked-in legacy detector against its historical Git blob. The
 * only admitted source delta is the exact property-name position field needed
 * to pair old and new findings without line/text guesses.
 */
export function assertGovernedLegacyDetectorSource(source) {
  if (typeof source !== 'string' || !source) {
    throw new Error('governed legacy observed-shape detector source must be nonempty text');
  }
  const enrichments = source.split(LEGACY_POSITION_EMISSION).length - 1;
  if (enrichments !== 1 || source.includes(LEGACY_ORIGINAL_EMISSION)) {
    throw new Error('legacy observed-shape detector must contain exactly the sole node-name-start-v1 enrichment');
  }
  const restored = source.replace(LEGACY_POSITION_EMISSION, LEGACY_ORIGINAL_EMISSION);
  const body = Buffer.from(restored, 'utf8');
  const blobSha = createHash('sha1')
    .update(`blob ${body.length}\0`)
    .update(body)
    .digest('hex');
  if (blobSha !== LEGACY_ALGORITHM_BLOB_SHA) {
    throw new Error(`legacy observed-shape detector does not reconstruct governed Git blob ${LEGACY_ALGORITHM_BLOB_SHA}`);
  }
  return createHash('sha256').update(source, 'utf8').digest('hex');
}

export function governedLegacyDetectorSha256() {
  return assertGovernedLegacyDetectorSource(readFileSync(LEGACY_DETECTOR_FILE, 'utf8'));
}

export function fileManifestOf(root, files) {
  const absoluteRoot = resolve(root);
  const entries = [...new Set(files.map((file) => resolve(file)))].map((file) => {
    const path = relative(absoluteRoot, file).split('\\').join('/');
    if (!path || !CANONICAL_PATH.test(path)) {
      throw new Error(`observed-shape input lies outside its declared root: ${file}`);
    }
    const stat = lstatSync(file);
    if (!stat.isFile()) {
      throw new Error(`observed-shape input must be a regular file, not a symlink or special node: ${path}`);
    }
    return {
      path,
      type: 'file',
      mode: stat.mode & 0o111 ? '100755' : '100644',
      size: stat.size,
      sha256: createHash('sha256').update(readFileSync(file)).digest('hex'),
    };
  });
  return fileManifestFromEntries(entries);
}

/** Build the same canonical manifest from already content-addressed file rows. */
export function fileManifestFromEntries(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error('observed-shape file manifest requires at least one entry');
  }
  const canonicalEntries = entries
    .map((entry) => ({ ...entry }))
    .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  const manifest = {
    algorithm: MANIFEST_ALGORITHM,
    entries: canonicalEntries,
    digest: digestOf(canonicalEntries),
  };
  assertManifest(manifest, 'constructed');
  return manifest;
}

function assertCanonicalPath(path, label) {
  if (typeof path !== 'string' || !path || !CANONICAL_PATH.test(path)) {
    throw new Error(`observed-shape ${label} has a noncanonical path: ${JSON.stringify(path)}`);
  }
  return path;
}

function assertExactKeys(value, label, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`observed-shape ${label} must be an object`);
  }
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (canonicalJson(actual) !== canonicalJson(expected)) {
    throw new Error(`observed-shape ${label} has noncanonical fields: ${canonicalJson(actual)}`);
  }
}

export function assertExactFinding(finding) {
  if (!finding || typeof finding !== 'object') throw new Error('observed-shape finding must be an object');
  assertExactKeys(finding, 'exact finding', [
    'file', 'key', 'line', 'origins', 'pos', 'shapes', 'site', 'text',
  ]);
  assertCanonicalPath(finding.file, 'finding');
  if (!finding.file.startsWith('src/')) throw new Error(`observed-shape finding is outside src/: ${finding.file}`);
  if (!Number.isInteger(finding.pos) || finding.pos < 0) {
    throw new Error(`observed-shape finding lacks an exact source position: ${JSON.stringify(finding)}`);
  }
  if (!Number.isInteger(finding.line) || finding.line < 1
    || typeof finding.text !== 'string' || !finding.text) {
    throw new Error(`observed-shape finding lacks exact line/text review provenance: ${JSON.stringify(finding)}`);
  }
  if (typeof finding.key !== 'string' || !finding.key || !Array.isArray(finding.shapes)
    || finding.shapes.length !== 1 || typeof finding.shapes[0] !== 'string'
    || !finding.shapes[0]
    || !Array.isArray(finding.origins) || finding.origins.length !== 1
    || typeof finding.origins[0] !== 'string' || !finding.origins[0]) {
    throw new Error(`observed-shape finding lacks singleton shape/origin provenance: ${JSON.stringify(finding)}`);
  }
  if (!isFindingSite(finding.site)) {
    throw new Error(`observed-shape finding lacks a ${FINDING_SITE_SCHEMA} site address: ${JSON.stringify(finding)}`);
  }
  const encodedKey = finding.site.slice(finding.site.lastIndexOf('|key=') + 5);
  if (encodedKey !== encodeURIComponent(finding.key)) {
    throw new Error(`observed-shape finding site/key mismatch: ${JSON.stringify(finding)}`);
  }
  return finding;
}

export function assertExactFindings(findings) {
  if (!Array.isArray(findings)) throw new Error('observed-shape findings must be an array');
  const addresses = new Set();
  for (const finding of findings) {
    assertExactFinding(finding);
    const address = [finding.file, finding.site, finding.key, finding.origins[0]].join('\u0000');
    if (addresses.has(address)) {
      throw new Error(`duplicate observed-shape site/origin finding: ${address.split('\u0000').join(' | ')}`);
    }
    addresses.add(address);
  }
  return findings;
}

export function assertLegacyFinding(finding) {
  if (!finding || typeof finding !== 'object') throw new Error('observed-shape finding must be an object');
  assertExactKeys(finding, 'legacy finding', ['file', 'key', 'line', 'pos', 'shapes', 'text']);
  assertCanonicalPath(finding.file, 'finding');
  if (!finding.file.startsWith('src/')) throw new Error(`observed-shape finding is outside src/: ${finding.file}`);
  if (!Number.isInteger(finding.pos) || finding.pos < 0
    || !Number.isInteger(finding.line) || finding.line < 1
    || typeof finding.key !== 'string' || !finding.key
    || !Array.isArray(finding.shapes) || finding.shapes.length !== 1
    || typeof finding.shapes[0] !== 'string' || !finding.shapes[0]
    || typeof finding.text !== 'string' || !finding.text
    || finding.site != null || finding.origins != null) {
    throw new Error(`legacy observed-shape finding lacks exact position/key/shape provenance: ${JSON.stringify(finding)}`);
  }
  return finding;
}

export function assertLegacyFindings(findings) {
  if (!Array.isArray(findings)) throw new Error('observed-shape findings must be an array');
  const addresses = new Set();
  for (const finding of findings) {
    assertLegacyFinding(finding);
    const address = [finding.file, finding.pos, finding.key].join('\u0000');
    if (addresses.has(address)) {
      throw new Error(`duplicate legacy observed-shape site finding: ${address.split('\u0000').join(' | ')}`);
    }
    addresses.add(address);
  }
  return findings;
}

function assertFindingsForMode(scanMode, findings) {
  if (scanMode === 'exact-origin') return assertExactFindings(findings);
  if (scanMode === 'legacy-leaf') return assertLegacyFindings(findings);
  throw new Error(`observed-shape scan mode is unsupported: ${JSON.stringify(scanMode)}`);
}

export function artifactIdentityOf(scanMode, finding) {
  if (scanMode === 'exact-origin') {
    assertExactFinding(finding);
    return `${finding.key} on ${finding.shapes[0]} @ ${finding.origins[0]} # ${finding.site}`;
  }
  if (scanMode === 'legacy-leaf') {
    assertLegacyFinding(finding);
    return `${finding.key} on ${finding.shapes.join('|')}`;
  }
  throw new Error(`observed-shape scan mode is unsupported: ${JSON.stringify(scanMode)}`);
}

export function artifactInventoryOf(scanMode, findings) {
  assertFindingsForMode(scanMode, findings);
  const inventory = {};
  for (const finding of findings) {
    const identity = artifactIdentityOf(scanMode, finding);
    if (!inventory[finding.file]) inventory[finding.file] = {};
    inventory[finding.file][identity] = (inventory[finding.file][identity] || 0) + 1;
  }
  const sortedObject = (object) => Object.fromEntries(
    Object.entries(object).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  );
  return Object.fromEntries(
    Object.entries(sortedObject(inventory))
      .map(([file, identities]) => [file, sortedObject(identities)]),
  );
}

export function assertManifest(manifest, label) {
  assertExactKeys(manifest, `${label} manifest`, ['algorithm', 'digest', 'entries']);
  if (!manifest || manifest.algorithm !== MANIFEST_ALGORITHM
    || !Array.isArray(manifest.entries) || manifest.entries.length === 0
    || !SHA256.test(manifest.digest || '')) {
    throw new Error(`observed-shape ${label} manifest is malformed`);
  }
  const paths = new Set();
  let previousPath = null;
  for (const entry of manifest.entries) {
    if (!entry || !CANONICAL_PATH.test(entry.path || '') || entry.type !== 'file'
      || !['100644', '100755'].includes(entry.mode)
      || !Number.isSafeInteger(entry.size) || entry.size < 0
      || !SHA256.test(entry.sha256 || '')
      || Object.keys(entry).sort().join(',') !== 'mode,path,sha256,size,type') {
      throw new Error(`observed-shape ${label} manifest entry is malformed: ${JSON.stringify(entry)}`);
    }
    if (paths.has(entry.path)) throw new Error(`observed-shape ${label} manifest repeats ${entry.path}`);
    if (previousPath !== null && entry.path < previousPath) {
      throw new Error(`observed-shape ${label} manifest paths are not in canonical order`);
    }
    paths.add(entry.path);
    previousPath = entry.path;
  }
  if (digestOf(manifest.entries) !== manifest.digest) {
    throw new Error(`observed-shape ${label} manifest digest mismatch`);
  }
}

export function assertTreeRelations({ scanTree, sourceTree, detectorTree, executionTree }) {
  const mapOf = (tree) => new Map(tree.entries.map((entry) => [entry.path, entry]));
  const scanEntries = mapOf(scanTree);
  const sourceEntries = mapOf(sourceTree);
  const detectorEntries = mapOf(detectorTree);
  const executionEntries = mapOf(executionTree);
  for (const [path, entry] of scanEntries) {
    if (canonicalJson(sourceEntries.get(path)) !== canonicalJson(entry)) {
      throw new Error(`observed-shape scan input is absent from or differs in source tree: ${path}`);
    }
  }
  const classified = new Map([...sourceEntries, ...detectorEntries]);
  for (const [path, entry] of classified) {
    if (canonicalJson(executionEntries.get(path)) !== canonicalJson(entry)) {
      throw new Error(`observed-shape execution tree omits or differs from bound input: ${path}`);
    }
  }
  if (executionEntries.size !== classified.size) {
    throw new Error('observed-shape execution tree contains an unclassified input');
  }
}

function assertSourceBinding(scanTree, findings, stats) {
  if (stats?.files !== scanTree.entries.length) {
    throw new Error(`observed-shape scan stats.files ${JSON.stringify(stats?.files)} does not match its ${scanTree.entries.length}-file scan manifest`);
  }
  const sourcePaths = new Set(scanTree.entries.map((entry) => entry.path));
  for (const finding of findings) {
    if (!sourcePaths.has(finding.file)) {
      throw new Error(`observed-shape finding is outside the bound source tree: ${finding.file}`);
    }
  }
}

function integerTelemetry(value, label, { positive = false } = {}) {
  if (!Number.isSafeInteger(value) || value < (positive ? 1 : 0)) {
    const expectation = positive ? 'a positive integer' : 'a non-negative integer';
    throw new Error(`observed-shape scan ${label} must be ${expectation}; received ${JSON.stringify(value)}`);
  }
  return value;
}

export function assertScanConfig(scanConfig) {
  assertExactKeys(scanConfig, 'scan config', [
    'corpusGraphSchema', 'minRows', 'originMinRows',
  ]);
  integerTelemetry(scanConfig.minRows, 'config.minRows', { positive: true });
  integerTelemetry(scanConfig.originMinRows, 'config.originMinRows', { positive: true });
  if (scanConfig.corpusGraphSchema !== 2) {
    throw new Error(`observed-shape scan config has unsupported corpus graph schema ${JSON.stringify(scanConfig.corpusGraphSchema)}`);
  }
  return scanConfig;
}

/** Derive, never trust, the anti-vacuity record stored in scan artifacts. */
export function scanSentinelOf(scanMode, corpus, stats, scanConfig) {
  assertScanConfig(scanConfig);
  integerTelemetry(stats?.resolved, 'stats.resolved');
  const usable = Object.values(corpus?.shapes || {})
    .filter((shape) => Number.isSafeInteger(shape?.rows) && shape.rows >= scanConfig.minRows);
  const base = {
    usableShapes: usable.length,
    totalKeys: usable.reduce((sum, shape) => sum + (Array.isArray(shape.keys) ? shape.keys.length : 0), 0),
    resolvedReads: stats?.resolved,
  };
  if (scanMode === 'legacy-leaf') return base;
  if (scanMode !== 'exact-origin') {
    throw new Error(`observed-shape scan mode is unsupported: ${JSON.stringify(scanMode)}`);
  }
  const origins = Object.values(corpus?.graph?.origins || {})
    .filter((origin) => Number.isSafeInteger(origin?.rows)
      && origin.rows >= scanConfig.originMinRows);
  const corpusDepthTruncations = corpus?.graph?.meta?.depthTruncations;
  const corpusCycleCuts = corpus?.graph?.meta?.cycleCuts;
  const resolverDepthTruncations = stats?.depthTruncations;
  const resolverCycleCuts = stats?.cycleCuts;
  for (const [label, value] of Object.entries({
    corpusDepthTruncations,
    corpusCycleCuts,
    resolverDepthTruncations,
    resolverCycleCuts,
    transitions: corpus?.graph?.meta?.transitions,
    resolvedOrigins: stats?.resolvedOrigins,
  })) integerTelemetry(value, label);
  return {
    ...base,
    usableOrigins: origins.length,
    originKeys: origins.reduce((sum, origin) => sum
      + (Array.isArray(origin.keys) ? origin.keys.length : 0), 0),
    transitions: corpus?.graph?.meta?.transitions,
    resolvedOrigins: stats?.resolvedOrigins,
    corpusDepthTruncations,
    resolverDepthTruncations,
    depthTruncations: corpusDepthTruncations + resolverDepthTruncations,
    corpusCycleCuts,
    resolverCycleCuts,
    cycleCuts: corpusCycleCuts + resolverCycleCuts,
  };
}

/**
 * Scan artifacts are migration evidence, so absence of provenance is not a
 * valid zero. Refuse missing telemetry, empty executed graphs, and either
 * corpus-side or resolver-side traversal loss before an artifact is written.
 */
export function assertHealthyScanProvenance({
  scanMode = 'exact-origin', corpus, stats, sentinel, scanConfig,
}) {
  if (!MODE[scanMode]) {
    throw new Error(`observed-shape scan mode is unsupported: ${JSON.stringify(scanMode)}`);
  }
  if (!stats || !sentinel || !scanConfig) throw new Error('observed-shape scan lacks stats, sentinel, or config provenance');
  assertScanConfig(scanConfig);
  for (const key of ['files', 'reads', 'resolved']) {
    integerTelemetry(stats[key], `stats.${key}`, { positive: true });
  }
  integerTelemetry(stats.unresolved, 'stats.unresolved');
  for (const key of ['usableShapes', 'totalKeys', 'resolvedReads']) {
    integerTelemetry(sentinel[key], `sentinel.${key}`, { positive: true });
  }
  if (!corpus?.shapes || Object.keys(corpus.shapes).length === 0) {
    throw new Error('observed-shape scan requires a nonempty executed shape corpus');
  }
  if (stats.resolved !== sentinel.resolvedReads
    || stats.reads !== stats.resolved + stats.unresolved) {
    throw new Error('observed-shape scan stats/sentinel provenance is inconsistent');
  }
  const derivedSentinel = scanSentinelOf(scanMode, corpus, stats, scanConfig);
  if (canonicalJson(sentinel) !== canonicalJson(derivedSentinel)) {
    throw new Error('observed-shape scan sentinel is not derived from its corpus, stats, and config');
  }
  if (scanMode === 'legacy-leaf') return {
    corpus, stats, sentinel, scanConfig,
  };

  const graph = corpus?.graph;
  if (!graph || graph.schema !== 2 || !graph.origins || !graph.roots
    || Object.keys(graph.origins).length === 0 || Object.keys(graph.roots).length === 0) {
    throw new Error('observed-shape scan requires a nonempty executed provenance graph schema 2');
  }
  integerTelemetry(stats.resolvedOrigins, 'stats.resolvedOrigins', { positive: true });
  for (const key of [
    'usableOrigins', 'originKeys', 'transitions', 'resolvedOrigins',
  ]) {
    integerTelemetry(sentinel[key], `sentinel.${key}`, { positive: true });
  }

  const loss = {
    corpusDepthTruncations: graph.meta?.depthTruncations,
    resolverDepthTruncations: stats.depthTruncations,
    corpusCycleCuts: graph.meta?.cycleCuts,
    resolverCycleCuts: stats.cycleCuts,
    computedRecordUnknown: stats.computedRecordUnknown,
    objectValuesRecordUnknown: stats.objectValuesRecordUnknown,
  };
  for (const [key, value] of Object.entries(loss)) integerTelemetry(value, key);
  for (const key of [
    'corpusDepthTruncations', 'resolverDepthTruncations', 'depthTruncations',
    'corpusCycleCuts', 'resolverCycleCuts', 'cycleCuts',
  ]) {
    integerTelemetry(sentinel[key], `sentinel.${key}`);
  }

  if (integerTelemetry(graph.meta?.transitions, 'graph.meta.transitions', { positive: true })
    !== sentinel.transitions
    || stats.resolved !== sentinel.resolvedReads
    || stats.resolvedOrigins !== sentinel.resolvedOrigins
    || loss.corpusDepthTruncations !== sentinel.corpusDepthTruncations
    || loss.resolverDepthTruncations !== sentinel.resolverDepthTruncations
    || loss.corpusCycleCuts !== sentinel.corpusCycleCuts
    || loss.resolverCycleCuts !== sentinel.resolverCycleCuts
    || sentinel.depthTruncations
      !== sentinel.corpusDepthTruncations + sentinel.resolverDepthTruncations
    || sentinel.cycleCuts !== sentinel.corpusCycleCuts + sentinel.resolverCycleCuts) {
    throw new Error('observed-shape scan stats/sentinel provenance is inconsistent');
  }
  if (sentinel.depthTruncations !== 0 || sentinel.cycleCuts !== 0
    || loss.computedRecordUnknown !== 0 || loss.objectValuesRecordUnknown !== 0) {
    throw new Error('observed-shape scan lost provenance '
      + `(depthTruncations=${sentinel.depthTruncations}, cycleCuts=${sentinel.cycleCuts}, `
      + `computedRecordUnknown=${loss.computedRecordUnknown}, `
      + `objectValuesRecordUnknown=${loss.objectValuesRecordUnknown})`);
  }
  return {
    corpus, stats, sentinel, scanConfig,
  };
}

export function governedLegacyAlgorithmOf(detectorTree) {
  assertManifest(detectorTree, 'detector-tree');
  const moduleEntry = detectorTree.entries.find(
    (entry) => entry.path === LEGACY_ALGORITHM_MODULE_PATH,
  );
  if (!moduleEntry) {
    throw new Error(`legacy detector manifest omits ${LEGACY_ALGORITHM_MODULE_PATH}`);
  }
  const moduleSha256 = governedLegacyDetectorSha256();
  if (moduleEntry.sha256 !== moduleSha256) {
    throw new Error('legacy observed-shape detector manifest does not match the runtime-verified governed module');
  }
  return {
    baseSha: LEGACY_ALGORITHM_BASE_SHA,
    sourceBlobSha: LEGACY_ALGORITHM_BLOB_SHA,
    enrichment: LEGACY_ALGORITHM_ENRICHMENT,
    modulePath: LEGACY_ALGORITHM_MODULE_PATH,
    moduleSha256,
  };
}

function assertLegacyAlgorithm(legacyAlgorithm, detectorTree) {
  assertExactKeys(legacyAlgorithm, 'legacy algorithm', [
    'baseSha', 'enrichment', 'modulePath', 'moduleSha256', 'sourceBlobSha',
  ]);
  const governed = governedLegacyAlgorithmOf(detectorTree);
  if (canonicalJson(legacyAlgorithm) !== canonicalJson(governed)) {
    throw new Error('legacy observed-shape artifact does not name the governed detector and sole position enrichment');
  }
  return legacyAlgorithm;
}

function assertFindingCorpusBinding(scanMode, corpus, findings) {
  if (scanMode === 'exact-origin') {
    for (const finding of findings) {
      if (finding.origins[0] === 'syntax/local-object' && finding.shapes[0] === 'localObject') {
        continue;
      }
      const origin = corpus.graph?.origins?.[finding.origins[0]];
      if (!origin || origin.label !== finding.shapes[0]) {
        throw new Error(`observed-shape finding names an origin/shape absent from its corpus: ${finding.origins[0]} / ${finding.shapes[0]}`);
      }
    }
    return;
  }
  for (const finding of findings) {
    if (!corpus.shapes?.[finding.shapes[0]]) {
      throw new Error(`legacy observed-shape finding names a shape absent from its corpus: ${finding.shapes[0]}`);
    }
  }
}

export function scannerToolDigestOf({ scannerSha, detectorTreeDigest, legacyAlgorithm }) {
  if (!FULL_GIT_SHA.test(scannerSha || '') || !SHA256.test(detectorTreeDigest || '')) {
    throw new Error('observed-shape scanner tool digest requires full scanner and detector provenance');
  }
  return digestOf({
    scannerSha,
    detectorTreeDigest,
    ...(legacyAlgorithm ? { legacyAlgorithm } : {}),
  });
}

function provenanceOf({
  subjectSha, scannerSha, scanTree, sourceTree, detectorTree, executionTree,
  legacyAlgorithm,
}) {
  return {
    subjectSha,
    scannerSha,
    scanTreeDigest: scanTree.digest,
    sourceTreeDigest: sourceTree.digest,
    detectorDigest: detectorTree.digest,
    executionTreeDigest: executionTree.digest,
    scannerToolDigest: scannerToolDigestOf({
      scannerSha,
      detectorTreeDigest: detectorTree.digest,
      legacyAlgorithm,
    }),
  };
}

export function createScanArtifact({
  scanMode = 'exact-origin',
  baselineSchema,
  subjectSha,
  scannerSha,
  scanTree,
  sourceTree,
  detectorTree,
  executionTree,
  scanConfig,
  legacyAlgorithm,
  corpus,
  findings,
  stats,
  sentinel,
  inventory,
}) {
  if (!FULL_GIT_SHA.test(subjectSha || '')) {
    throw new Error(`observed-shape scan subjectSha must be a full 40-character Git SHA; received ${JSON.stringify(subjectSha)}`);
  }
  if (!FULL_GIT_SHA.test(scannerSha || '')) {
    throw new Error(`observed-shape scan scannerSha must be a full 40-character Git SHA; received ${JSON.stringify(scannerSha)}`);
  }
  const mode = MODE[scanMode];
  if (!mode || baselineSchema !== mode.baselineSchema) {
    throw new Error(`observed-shape scan artifact mode/schema mismatch: ${JSON.stringify({ scanMode, baselineSchema })}`);
  }
  assertManifest(scanTree, 'scan-tree');
  assertManifest(sourceTree, 'source-tree');
  assertManifest(detectorTree, 'detector-tree');
  assertManifest(executionTree, 'execution-tree');
  assertTreeRelations({ scanTree, sourceTree, detectorTree, executionTree });
  assertScanConfig(scanConfig);
  if (scanMode === 'legacy-leaf') assertLegacyAlgorithm(legacyAlgorithm, detectorTree);
  else if (legacyAlgorithm !== undefined) {
    throw new Error('exact-origin observed-shape artifacts cannot carry legacy algorithm authority');
  }
  assertFindingsForMode(scanMode, findings);
  assertSourceBinding(scanTree, findings, stats);
  assertFindingCorpusBinding(scanMode, corpus, findings);
  assertHealthyScanProvenance({ scanMode, corpus, stats, sentinel, scanConfig });
  const artifact = {
    artifactSchema: SCAN_ARTIFACT_SCHEMA,
    kind: 'observed-shape-reader-scan',
    mode: 'scan-only',
    scanMode,
    baselineSchema,
    siteSchema: mode.siteSchema,
    ...(mode.posEnrichment ? { posEnrichment: mode.posEnrichment } : {}),
    ...(legacyAlgorithm ? { legacyAlgorithm } : {}),
    scanConfig,
    provenance: provenanceOf({
      subjectSha, scannerSha, scanTree, sourceTree, detectorTree, executionTree,
      legacyAlgorithm,
    }),
    digests: {
      scanConfig: digestOf(scanConfig),
      corpus: digestOf(corpus),
      findings: digestOf(findings),
      inventory: digestOf(inventory),
      stats: digestOf(stats),
      sentinel: digestOf(sentinel),
    },
    scanTree,
    sourceTree,
    detectorTree,
    executionTree,
    corpus,
    findings,
    stats,
    sentinel,
    inventory,
  };
  validateScanArtifact(artifact);
  return artifact;
}

export function validateScanArtifact(artifact) {
  const mode = MODE[artifact?.scanMode];
  const posEnrichmentMatches = mode?.posEnrichment
    ? artifact?.posEnrichment === mode.posEnrichment
    : !Object.hasOwn(artifact || {}, 'posEnrichment');
  if (!artifact || artifact.artifactSchema !== SCAN_ARTIFACT_SCHEMA
    || artifact.kind !== 'observed-shape-reader-scan'
    || artifact.mode !== 'scan-only'
    || !mode || artifact.baselineSchema !== mode.baselineSchema
    || artifact.siteSchema !== mode.siteSchema
    || !posEnrichmentMatches) {
    throw new Error('observed-shape scan artifact has an unsupported schema or mode');
  }
  const artifactKeys = [
    'artifactSchema', 'baselineSchema', 'corpus', 'detectorTree', 'digests',
    'executionTree', 'findings', 'inventory', 'kind', 'mode', 'provenance',
    'scanConfig', 'scanMode', 'scanTree', 'sentinel', 'siteSchema', 'sourceTree',
    'stats',
    ...(mode.posEnrichment ? ['legacyAlgorithm', 'posEnrichment'] : []),
  ];
  assertExactKeys(artifact, 'scan artifact', artifactKeys);
  if (!FULL_GIT_SHA.test(artifact.provenance?.subjectSha || '')) {
    throw new Error('observed-shape scan artifact has an invalid subjectSha');
  }
  if (!FULL_GIT_SHA.test(artifact.provenance?.scannerSha || '')) {
    throw new Error('observed-shape scan artifact has an invalid scannerSha');
  }
  assertManifest(artifact.scanTree, 'scan-tree');
  assertManifest(artifact.sourceTree, 'source-tree');
  assertManifest(artifact.detectorTree, 'detector-tree');
  assertManifest(artifact.executionTree, 'execution-tree');
  assertTreeRelations(artifact);
  assertScanConfig(artifact.scanConfig);
  if (artifact.scanMode === 'legacy-leaf') {
    assertLegacyAlgorithm(artifact.legacyAlgorithm, artifact.detectorTree);
  }
  const expectedProvenance = provenanceOf({
    subjectSha: artifact.provenance.subjectSha,
    scannerSha: artifact.provenance.scannerSha,
    scanTree: artifact.scanTree,
    sourceTree: artifact.sourceTree,
    detectorTree: artifact.detectorTree,
    executionTree: artifact.executionTree,
    legacyAlgorithm: artifact.legacyAlgorithm,
  });
  assertExactKeys(artifact.provenance, 'scan artifact provenance', Object.keys(expectedProvenance));
  if (canonicalJson(artifact.provenance) !== canonicalJson(expectedProvenance)) {
    throw new Error('observed-shape scan artifact provenance digest mismatch');
  }
  assertFindingsForMode(artifact.scanMode, artifact.findings);
  assertSourceBinding(artifact.scanTree, artifact.findings, artifact.stats);
  assertFindingCorpusBinding(artifact.scanMode, artifact.corpus, artifact.findings);
  assertHealthyScanProvenance(artifact);
  if (canonicalJson(artifact.inventory) !== canonicalJson(artifactInventoryOf(
    artifact.scanMode, artifact.findings,
  ))) {
    throw new Error('observed-shape scan artifact inventory is not derived from its findings');
  }
  for (const [name, value] of Object.entries({
    scanConfig: artifact.scanConfig,
    corpus: artifact.corpus,
    findings: artifact.findings,
    inventory: artifact.inventory,
    stats: artifact.stats,
    sentinel: artifact.sentinel,
  })) {
    if (!SHA256.test(artifact.digests?.[name] || '') || digestOf(value) !== artifact.digests[name]) {
      throw new Error(`observed-shape scan artifact ${name} digest mismatch`);
    }
  }
  assertExactKeys(artifact.digests, 'scan artifact digests', [
    'corpus', 'findings', 'inventory', 'scanConfig', 'sentinel', 'stats',
  ]);
  return artifact;
}

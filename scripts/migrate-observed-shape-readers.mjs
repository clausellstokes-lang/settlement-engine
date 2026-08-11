#!/usr/bin/env node
/**
 * Governed observed-reader baseline migrations.
 *
 * TWO TARGETS LIVE HERE, and they are different arguments:
 *
 *   schema 2 -> 3  (RETIRED) `migrationReport`. Pairs the governed heuristic
 *     detector against the EXACT detector site-by-site, so the target inventory
 *     is a NEW alphabet and every paired site needs its own reviewed row.
 *
 *   schema 2 -> 4  (RETIRED) `heuristicMigrationReport`. CR-OSR-FREEZE-3-R1: the
 *     heuristic leaf identity becomes its own schema, so the target inventory is
 *     the heuristic artifact's OWN inventory — the SAME alphabet the schema-2
 *     predecessor is spelled in. There is no cross-detector pairing to review,
 *     and therefore no `rows`: the whole reconciliation is the predecessorRows
 *     ledger that already exists. It needs NO exact artifact, which is the point
 *     — the exact detector cannot complete a full-tree scan.
 *
 *   schema 4 -> 5  (LIVE)    the SAME function with a different target. The
 *     alphabet did not move again — schema 5 is schema 4's identity with the
 *     detector's output NARROWED by two declared post-filters — so the whole
 *     review is once more `predecessorRows`, and the code path is genuinely the
 *     same argument rather than a copy of it. The only two things that differ
 *     are which schema the predecessor envelope must be, and which number the
 *     target claims; both are parameters, and `LEAF_MIGRATION_PREDECESSOR`
 *     is the one table that binds them so no caller can pair 5 with a schema-2
 *     predecessor or 4 with a schema-4 one.
 *
 * In both, the predecessor schema-2 baseline and every scan artifact are
 * canonical, content-addressed inputs sharing one committed source, execution
 * tree, executed corpus and scan configuration. The legacy detector is the
 * governed 6e7acc4d algorithm with one semantic-neutral addition:
 * `pos: node.name.getStart(sf)`. That lets the retired path pair by an exact
 * source address; text and nearest-line guesses are deliberately forbidden
 * because repeated reads make either ambiguous.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  parseExactFlags,
  planExternalArtifactOutputs,
  publishJsonExclusive,
} from './lib/governed-artifact-io.mjs';
import {
  canonicalJson,
  digestOf,
  LEGACY_ALGORITHM_BASE_SHA,
  LEGACY_ALGORITHM_BLOB_SHA,
  LEGACY_ALGORITHM_ENRICHMENT,
  validateScanArtifact,
} from './lib/observed-shape-governance.mjs';
import {
  RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA,
  validateSchema4Baseline,
} from './lib/observed-shape-baseline.mjs';

export const MIGRATION_REPORT_SCHEMA = 2;
export const MIGRATION_REVIEW_SCHEMA = 2;
export const MIGRATION_BUNDLE_SCHEMA = 2;

/** The RETIRED exact target. Named rather than hand-keyed so the two target
 *  schemas can never be confused at a call site, and so a reader grepping for
 *  "3" finds a definition instead of a literal. */
export const RETIRED_EXACT_TARGET_SCHEMA = 3;
/** The RETIRED UNFILTERED heuristic-leaf target. */
export const HEURISTIC_TARGET_SCHEMA = 4;
/** The LIVE EXPLAINED-WRITER-FILTERED heuristic-leaf target. */
export const FILTERED_TARGET_SCHEMA = 5;

/**
 * ⭐⭐ THE ONE TABLE THAT PAIRS A LEAF TARGET WITH ITS PREDECESSOR SCHEMA.
 *
 * Both leaf migrations run the same reconciliation, so the only way to keep them
 * from being confusable is to make the pairing DATA that every entry point reads
 * — never two hand-written literals at two call sites. A caller cannot migrate a
 * schema-2 baseline to schema 5, nor re-run the retired 2→4 against a schema-4
 * predecessor, because neither pairing exists here.
 */
export const LEAF_MIGRATION_PREDECESSOR = Object.freeze({
  [HEURISTIC_TARGET_SCHEMA]: 2,
  [FILTERED_TARGET_SCHEMA]: HEURISTIC_TARGET_SCHEMA,
});

const RETIRED_EXACT_MIGRATION_KIND = `observed-shape-schema-2-to-${RETIRED_EXACT_TARGET_SCHEMA}-migration`;
const leafMigrationKindOf = (targetSchema) => (
  `observed-shape-schema-${LEAF_MIGRATION_PREDECESSOR[targetSchema]}-to-${targetSchema}-migration`
);

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const GOVERNED_LEGACY_ALGORITHM = Object.freeze({
  baseSha: LEGACY_ALGORITHM_BASE_SHA,
  sourceBlobSha: LEGACY_ALGORITHM_BLOB_SHA,
  enrichment: LEGACY_ALGORITHM_ENRICHMENT,
});

const ABBREVIATED_GIT_SHA = /^[0-9a-f]{7,40}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const normalizedText = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const sortedUnique = (values) => [...new Set(values)].sort();
const equalArrays = (a, b) => a.length === b.length && a.every((value, i) => value === b[i]);
const exactAddress = (finding) => [finding.file, finding.pos, finding.key].join('\u0000');
const predecessorAddress = (file, identity) => [file, identity].join('\u0000');
const isRecord = (value) => value != null && typeof value === 'object'
  && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;

function positiveSafeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(`schema-2 predecessor ${label} must be a positive safe integer; received ${JSON.stringify(value)}`);
  }
  return value;
}

function nonNegativeSafeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`schema-2 predecessor ${label} must be a non-negative safe integer; received ${JSON.stringify(value)}`);
  }
  return value;
}

function canonicalPredecessorBaseline(predecessorBaseline, predecessorSchema = 2) {
  if (!isRecord(predecessorBaseline) || predecessorBaseline.schema !== predecessorSchema) {
    throw new Error(`observed-shape predecessor baseline must be a schema-${predecessorSchema} object`);
  }
  // ⭐ A SCHEMA-4 PREDECESSOR IS VALIDATED BY ITS OWN GOVERNED ENVELOPE LAW, not
  // by the loose structural checks below, which exist because the schema-2
  // predecessor was UNGOVERNED and had no validator of its own. Re-deriving a
  // second, weaker definition of an envelope that already has a governed one is
  // the doubled-law shape; this defers to the real law and then continues with
  // the shared structural checks, which the governed envelope also satisfies.
  if (predecessorSchema === RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA) {
    validateSchema4Baseline(predecessorBaseline);
  }
  // Canonicalization is itself part of validation: it refuses cycles,
  // undefined values and non-finite numbers before any digest is authoritative.
  const canonical = JSON.parse(canonicalJson(predecessorBaseline));
  if (!ISO_DATE.test(canonical.frozen || '')) {
    throw new Error('schema-2 predecessor frozen date must use YYYY-MM-DD');
  }
  if (canonical.frozenAtSha !== null
    && !ABBREVIATED_GIT_SHA.test(canonical.frozenAtSha || '')) {
    throw new Error('schema-2 predecessor frozenAtSha must be null or a 7-40 character lowercase Git SHA');
  }
  positiveSafeInteger(canonical.minRows, 'minRows');
  if (!isRecord(canonical.inventory) || Object.keys(canonical.inventory).length === 0) {
    throw new Error('schema-2 predecessor inventory must be a nonempty object');
  }

  let total = 0;
  let identities = 0;
  for (const [file, row] of Object.entries(canonical.inventory)) {
    if (!file.startsWith('src/') || file.includes('\\') || file.includes('\u0000')
      || file.split('/').some((part) => !part || part === '.' || part === '..')) {
      throw new Error(`schema-2 predecessor inventory has an unsafe file path: ${JSON.stringify(file)}`);
    }
    if (!isRecord(row) || Object.keys(row).length === 0) {
      throw new Error(`schema-2 predecessor inventory row is empty or malformed: ${file}`);
    }
    for (const [identity, count] of Object.entries(row)) {
      if (!identity || identity.includes('\u0000')) {
        throw new Error(`schema-2 predecessor inventory has an invalid identity in ${file}`);
      }
      positiveSafeInteger(count, `inventory[${JSON.stringify(file)}][${JSON.stringify(identity)}]`);
      total += count;
      identities += 1;
      if (!Number.isSafeInteger(total) || !Number.isSafeInteger(identities)) {
        throw new Error('schema-2 predecessor inventory totals exceed safe integer range');
      }
    }
  }
  positiveSafeInteger(canonical.total, 'total');
  positiveSafeInteger(canonical.identities, 'identities');
  if (canonical.total !== total || canonical.identities !== identities) {
    throw new Error(`schema-2 predecessor totals disagree with inventory: ${JSON.stringify({
      declaredTotal: canonical.total,
      measuredTotal: total,
      declaredIdentities: canonical.identities,
      measuredIdentities: identities,
    })}`);
  }

  if (!isRecord(canonical.scanStats)) {
    throw new Error('schema-2 predecessor scanStats must be an object');
  }
  for (const key of ['files', 'reads', 'resolved']) {
    positiveSafeInteger(canonical.scanStats[key], `scanStats.${key}`);
  }
  nonNegativeSafeInteger(canonical.scanStats.unresolved, 'scanStats.unresolved');
  if (canonical.scanStats.reads
    !== canonical.scanStats.resolved + canonical.scanStats.unresolved) {
    throw new Error('schema-2 predecessor scanStats reads do not conserve resolved plus unresolved');
  }

  if (!isRecord(canonical.sentinel)) {
    throw new Error('schema-2 predecessor sentinel must be an object');
  }
  for (const key of ['usableShapes', 'totalKeys', 'resolvedReads']) {
    positiveSafeInteger(canonical.sentinel[key], `sentinel.${key}`);
  }
  if (canonical.sentinel.resolvedReads !== canonical.scanStats.resolved) {
    throw new Error('schema-2 predecessor sentinel does not match scanStats.resolved');
  }

  if (!isRecord(canonical.corpusMeta)) {
    throw new Error('schema-2 predecessor corpusMeta must be an object');
  }
  for (const key of ['seeds', 'configs', 'generations', 'pulseIntervals', 'shapeCount']) {
    positiveSafeInteger(canonical.corpusMeta[key], `corpusMeta.${key}`);
  }
  for (const key of ['simulationFlagsLit', 'steadingsMinted']) {
    nonNegativeSafeInteger(canonical.corpusMeta[key], `corpusMeta.${key}`);
  }
  return canonical;
}

export function validatePredecessorBaseline(predecessorBaseline, predecessorSchema = 2) {
  return canonicalPredecessorBaseline(predecessorBaseline, predecessorSchema);
}

function predecessorInputOf(predecessorBaseline, predecessorBaselineText, predecessorSchema = 2) {
  const predecessor = canonicalPredecessorBaseline(predecessorBaseline, predecessorSchema);
  if (typeof predecessorBaselineText !== 'string' || !predecessorBaselineText) {
    throw new Error('observed-shape migration requires the exact predecessor baseline text');
  }
  let parsed;
  try {
    parsed = JSON.parse(predecessorBaselineText);
  } catch (error) {
    throw new Error(
      `observed-shape predecessor baseline text is not valid JSON: ${error.message}`,
      { cause: error },
    );
  }
  const parsedPredecessor = canonicalPredecessorBaseline(parsed, predecessorSchema);
  if (canonicalJson(parsedPredecessor) !== canonicalJson(predecessor)) {
    throw new Error('observed-shape predecessor baseline object does not match its exact input text');
  }
  return {
    predecessor,
    predecessorBaselineTextSha256: createHash('sha256')
      .update(Buffer.from(predecessorBaselineText, 'utf8'))
      .digest('hex'),
  };
}

function assertLegacyFinding(finding) {
  if (!finding || typeof finding !== 'object'
    || typeof finding.file !== 'string' || !finding.file || finding.file.includes('\\')
    || !Number.isInteger(finding.line) || finding.line < 1
    || !Number.isInteger(finding.pos) || finding.pos < 0
    || typeof finding.key !== 'string'
    || !Array.isArray(finding.shapes) || finding.shapes.length !== 1
    || typeof finding.shapes[0] !== 'string'
    || typeof finding.text !== 'string') {
    throw new Error(`legacy observed-shape finding lacks exact pos/leaf provenance: ${JSON.stringify(finding)}`);
  }
}

/**
 * ONE HOME for "this is the governed heuristic detector's own artifact". Both
 * migration targets need exactly this claim — the retired path as the LEGACY
 * half of a pair, the live path as the WHOLE authority — and a second copy of a
 * detector-governance check is the doubled-law shape.
 */
function assertGovernedLegacyArtifact(legacy) {
  validateScanArtifact(legacy);
  if (legacy.scanMode !== 'legacy-leaf' || legacy.baselineSchema !== 2) {
    throw new Error('legacy migration input must be a validated legacy-leaf/schema-2 scan artifact');
  }
  if (legacy.posEnrichment !== 'node-name-start-v1') {
    throw new Error('legacy migration input must record the governed node-name-start-v1 position enrichment');
  }
  if (legacy.legacyAlgorithm?.baseSha !== GOVERNED_LEGACY_ALGORITHM.baseSha
    || legacy.legacyAlgorithm?.sourceBlobSha !== GOVERNED_LEGACY_ALGORITHM.sourceBlobSha
    || legacy.legacyAlgorithm?.enrichment !== GOVERNED_LEGACY_ALGORITHM.enrichment
    || legacy.legacyAlgorithm?.modulePath !== 'scripts/lib/legacy-reader-shape-scan.mjs') {
    throw new Error('legacy migration input is not the governed 6e7acc4d detector with the sole node-name-start-v1 enrichment');
  }
  for (const finding of legacy.findings) assertLegacyFinding(finding);
  return legacy;
}

function assertArtifactPair(legacy, current) {
  assertGovernedLegacyArtifact(legacy);
  validateScanArtifact(current);
  if (current.scanMode !== 'exact-origin'
    || current.baselineSchema !== RETIRED_EXACT_TARGET_SCHEMA) {
    throw new Error('current migration input must be a validated exact-origin/schema-3 scan artifact');
  }
  if (legacy.provenance.subjectSha !== current.provenance.subjectSha) {
    throw new Error(`migration artifacts describe different subject commits: ${legacy.provenance.subjectSha} != ${current.provenance.subjectSha}`);
  }
  if (legacy.provenance.sourceTreeDigest !== current.provenance.sourceTreeDigest
    || canonicalJson(legacy.sourceTree) !== canonicalJson(current.sourceTree)) {
    throw new Error('migration artifacts do not describe the exact same source tree');
  }
  for (const [label, field] of [
    ['scan tree', 'scanTree'],
    ['detector tree', 'detectorTree'],
    ['execution tree', 'executionTree'],
  ]) {
    if (canonicalJson(legacy[field]) !== canonicalJson(current[field])) {
      throw new Error(`migration artifacts do not describe the exact same ${label}`);
    }
  }
  if (legacy.provenance.scannerSha !== current.provenance.scannerSha) {
    throw new Error('migration artifacts were not emitted by the same committed scanner toolchain');
  }
  if (legacy.digests.corpus !== current.digests.corpus
    || canonicalJson(legacy.corpus) !== canonicalJson(current.corpus)) {
    throw new Error('migration artifacts do not bind the exact same canonical executed corpus');
  }
  if (canonicalJson(legacy.scanConfig) !== canonicalJson(current.scanConfig)) {
    throw new Error('migration artifacts do not bind the exact same thresholds and scan configuration');
  }
}

/**
 * The corpus keys that define the EXPERIMENT. A change here means the two sides
 * observed different worlds, so no reconciliation between them is meaningful.
 */
const CORPUS_EXECUTION_KEYS = ['seeds', 'configs', 'generations', 'pulseIntervals'];

/**
 * The corpus keys that describe WHAT THE EXPERIMENT SAW. These legitimately move
 * when the corpus BUILDER gains reach without the corpus DEFINITION changing —
 * which is exactly what happened, and exactly what nothing recorded.
 */
const CORPUS_OBSERVATION_KEYS = ['simulationFlagsLit', 'steadingsMinted', 'shapeCount'];

/**
 * ⚠⚠ THE CORPUS DEFINITION MOVED UNDER THE RECONCILIATION AND NOTHING SAW IT.
 * The first spelling compared four keys — seeds/configs/generations/pulseIntervals
 * — and never `shapeCount`. Between the schema-2 freeze and HEAD the corpus
 * builder gained the graph-schema-2 origins and `shapeCount` went 305 -> 1,321,
 * which grows `known`/`singleHome`/`rootShapes` and therefore re-grounds receivers
 * that previously resolved to nothing. That is the measured driver of the growth
 * rows the freeze had to review, and the compatibility check was BLIND to it.
 *
 * ⚠ AND THE HOLE WAS WORSE THAN AN OMITTED KEY: nothing validates an artifact's
 * `corpus.meta` at all, so a key that is simply ABSENT compared `undefined` and
 * the migration accepted a corpus that never declared its own definition. Presence
 * is now REQUIRED for every key on both sides.
 *
 * Execution keys must MATCH. Observation keys are RECORDED, not refused — a
 * genesis is entitled to bank a corpus that saw more, but never silently.
 */
function corpusCompatibilityOf(predecessor, legacyArtifact) {
  const current = legacyArtifact.corpus?.meta;
  if (!isRecord(current)) {
    throw new Error('observed-shape migration artifact corpus does not declare its executed meta record');
  }
  const keys = {};
  for (const key of [...CORPUS_EXECUTION_KEYS, ...CORPUS_OBSERVATION_KEYS]) {
    const before = predecessor.corpusMeta[key];
    const after = current[key];
    nonNegativeSafeInteger(before, `corpusMeta.${key}`);
    if (!Number.isSafeInteger(after) || after < 0) {
      throw new Error(`observed-shape migration artifact corpus meta ${key} is missing or not a non-negative safe integer; received ${JSON.stringify(after)}`);
    }
    keys[key] = { predecessor: before, current: after, moved: before !== after };
  }
  for (const key of CORPUS_EXECUTION_KEYS) {
    if (keys[key].moved) {
      throw new Error(`schema-2 predecessor corpus configuration ${key} does not match the legacy artifact`);
    }
  }
  return {
    executionKeys: [...CORPUS_EXECUTION_KEYS],
    observationKeys: [...CORPUS_OBSERVATION_KEYS],
    keys,
    moved: Object.entries(keys)
      .filter(([, value]) => value.moved)
      .map(([key, value]) => `${key}: ${value.predecessor} -> ${value.current}`),
  };
}

function assertPredecessorExecutionCompatibility(predecessor, legacyArtifact) {
  if (predecessor.minRows !== legacyArtifact.scanConfig.minRows) {
    throw new Error(`schema-2 predecessor minRows ${predecessor.minRows} does not match the legacy artifact threshold ${legacyArtifact.scanConfig.minRows}`);
  }
  return corpusCompatibilityOf(predecessor, legacyArtifact);
}

function legacySitesOf(findings) {
  const sites = new Map();
  for (const finding of findings) {
    const address = exactAddress(finding);
    if (sites.has(address)) {
      throw new Error(`legacy migration input repeats exact site ${finding.file}:${finding.pos}:${finding.key}`);
    }
    sites.set(address, finding);
  }
  return sites;
}

function currentSitesOf(findings) {
  const sites = new Map();
  const exactRows = new Set();
  for (const finding of findings) {
    const origin = finding.origins?.[0];
    const rowAddress = [finding.file, finding.site, finding.key, origin].join('\u0000');
    if (exactRows.has(rowAddress)) {
      throw new Error(`current migration input repeats site/origin ${finding.file} | ${finding.site} | ${finding.key} | ${origin}`);
    }
    exactRows.add(rowAddress);
    const address = exactAddress(finding);
    let site = sites.get(address);
    if (!site) {
      site = {
        file: finding.file,
        line: finding.line,
        pos: finding.pos,
        key: finding.key,
        site: finding.site,
        text: normalizedText(finding.text),
        rows: [],
      };
      sites.set(address, site);
    } else if (site.site !== finding.site || site.line !== finding.line
      || site.text !== normalizedText(finding.text)) {
      throw new Error(`current migration rows disagree at exact site ${finding.file}:${finding.pos}:${finding.key}`);
    }
    site.rows.push(finding);
  }
  for (const site of sites.values()) {
    site.rows.sort((a, b) => a.origins[0].localeCompare(b.origins[0]));
  }
  return sites;
}

function predecessorRowsOf(predecessorBaseline, legacyInventory) {
  const addresses = new Map();
  const add = (file, identity) => {
    const address = predecessorAddress(file, identity);
    if (!addresses.has(address)) addresses.set(address, { file, identity });
  };
  for (const [file, row] of Object.entries(predecessorBaseline.inventory)) {
    for (const identity of Object.keys(row)) add(file, identity);
  }
  for (const [file, row] of Object.entries(legacyInventory)) {
    for (const identity of Object.keys(row)) add(file, identity);
  }
  return [...addresses.values()]
    .sort((a, b) => a.file.localeCompare(b.file) || a.identity.localeCompare(b.identity))
    .map(({ file, identity }) => {
      const predecessorCount = predecessorBaseline.inventory[file]?.[identity] || 0;
      const legacyCount = legacyInventory[file]?.[identity] || 0;
      const reconciliation = predecessorCount === legacyCount
        ? 'same'
        : predecessorCount === 0
          ? 'new'
          : legacyCount === 0
            ? 'gone'
            : legacyCount < predecessorCount ? 'decreased' : 'increased';
      const core = {
        address: { file, identity },
        predecessorCount,
        legacyCount,
        delta: legacyCount - predecessorCount,
        reconciliation,
      };
      return { rowId: `osr-predecessor-row-v1:${digestOf(core)}`, ...core };
    });
}

function legacyView(finding) {
  if (!finding) return null;
  return {
    line: finding.line,
    shapes: sortedUnique(finding.shapes),
    text: normalizedText(finding.text),
  };
}

function currentView(site) {
  if (!site) return null;
  return {
    line: site.line,
    site: site.site,
    text: site.text,
    origins: site.rows.map((finding) => ({
      origin: finding.origins[0],
      shape: finding.shapes[0],
    })),
  };
}

function rowOf(address, legacy, current) {
  const [file, rawPos, key] = address.split('\u0000');
  const legacyShapes = legacy ? sortedUnique(legacy.shapes) : [];
  const currentShapes = current
    ? sortedUnique(current.rows.map((finding) => finding.shapes[0]))
    : [];
  if (legacy && current && (legacy.line !== current.line
    || normalizedText(legacy.text) !== current.text)) {
    throw new Error(`same-source migration text/line mismatch at ${file}:${rawPos}:${key}`);
  }
  const core = {
    address: { file, pos: Number(rawPos), key },
    legacy: legacyView(legacy),
    current: currentView(current),
    facets: {
      presence: legacy && current ? 'paired' : (legacy ? 'legacy-only' : 'current-only'),
      exactOrigins: !current ? 'none' : (current.rows.length === 1 ? 'single' : 'split'),
      leafShapes: !legacy || !current
        ? 'not-comparable'
        : (equalArrays(legacyShapes, currentShapes) ? 'same' : 'corrected'),
    },
  };
  return { rowId: `osr-migration-row-v1:${digestOf(core)}`, ...core };
}

function assertConservation(report) {
  const c = report.conservation;
  if (c.legacySitesCovered !== c.legacyFindings
    || c.currentSitesCovered !== c.currentSites
    || c.currentFindingsCovered !== c.currentFindings
    || c.paired + c.legacyOnly !== c.legacyFindings
    || c.paired + c.currentOnly !== c.currentSites
    || c.predecessorIdentitiesCovered !== c.predecessorIdentities
    || c.predecessorCountsCovered !== c.predecessorCount
    || c.legacyInventoryIdentitiesCovered !== c.legacyInventoryIdentities
    || c.legacyInventoryCountsCovered !== c.legacyInventoryCount
    || c.legacyInventoryCount !== c.legacyFindings
    || c.predecessorRows !== report.predecessorRows.length) {
    throw new Error(`observed-shape migration conservation failed: ${JSON.stringify(c)}`);
  }
  const allRows = [...report.predecessorRows, ...report.rows];
  const rowIds = new Set(allRows.map((row) => row.rowId));
  if (rowIds.size !== allRows.length) {
    throw new Error('observed-shape migration produced duplicate row IDs');
  }
}

/** Build the canonical report. Both artifacts are validated before any pairing. */
export function migrationReport(
  predecessorBaseline,
  legacyArtifact,
  currentArtifact,
  predecessorBaselineText,
) {
  const { predecessor, predecessorBaselineTextSha256 } = predecessorInputOf(
    predecessorBaseline,
    predecessorBaselineText,
  );
  assertArtifactPair(legacyArtifact, currentArtifact);
  const corpusCompatibility = assertPredecessorExecutionCompatibility(predecessor, legacyArtifact);
  const legacySites = legacySitesOf(legacyArtifact.findings);
  const currentSites = currentSitesOf(currentArtifact.findings);
  const addresses = sortedUnique([...legacySites.keys(), ...currentSites.keys()])
    .sort((a, b) => {
      const aa = a.split('\u0000');
      const bb = b.split('\u0000');
      return aa[0].localeCompare(bb[0]) || Number(aa[1]) - Number(bb[1]) || aa[2].localeCompare(bb[2]);
    });
  const rows = addresses.map((address) => rowOf(
    address,
    legacySites.get(address),
    currentSites.get(address),
  ));
  const predecessorRows = predecessorRowsOf(predecessor, legacyArtifact.inventory);
  const count = (facet, value) => rows.filter((row) => row.facets[facet] === value).length;
  const predecessorCount = (value) => predecessorRows
    .filter((row) => row.reconciliation === value).length;
  const legacyInventoryIdentities = Object.values(legacyArtifact.inventory)
    .reduce((n, row) => n + Object.keys(row).length, 0);
  const legacyInventoryCount = Object.values(legacyArtifact.inventory)
    .reduce((n, row) => n + Object.values(row).reduce((sum, value) => sum + value, 0), 0);
  // ⚠⚠ AN ISSUE CARRIES ITS ROW ID BECAUSE AN ISSUE IS DISCHARGEABLE BY REVIEW.
  // The first spelling emitted bare strings, and `validateReviewLedger` threw on
  // any of them BEFORE reading a single decision (the check sat above the
  // decisions loop). That made the review ledger unable to mean what the freeze
  // ruling assumed it meant: a COMPLETE, fully-accepted ledger with a real note on
  // every row still threw while any growth row existed — control-proven, both
  // directions, by the refusal lane. Carrying `rowId` lets the SAME issue be
  // discharged by the SAME row's reviewed decision, and by nothing else.
  const predecessorIssues = predecessorRows
    .filter((row) => row.reconciliation === 'new' || row.reconciliation === 'increased')
    .map((row) => ({
      rowId: row.rowId,
      file: row.address.file,
      identity: row.address.identity,
      reconciliation: row.reconciliation,
      predecessorCount: row.predecessorCount,
      legacyCount: row.legacyCount,
      message: `${row.address.file}: ${JSON.stringify(row.address.identity)} is ${row.reconciliation}`
        + ` against the schema-2 predecessor (${row.predecessorCount} -> ${row.legacyCount})`,
    }));
  const report = {
    reportSchema: MIGRATION_REPORT_SCHEMA,
    kind: RETIRED_EXACT_MIGRATION_KIND,
    inputs: {
      subjectSha: currentArtifact.provenance.subjectSha,
      predecessorBaselineDigest: digestOf(predecessor),
      predecessorBaselineTextSha256,
      predecessorInventoryDigest: digestOf(predecessor.inventory),
      predecessorFrozenAtSha: predecessor.frozenAtSha,
      sourceTreeDigest: currentArtifact.provenance.sourceTreeDigest,
      scanTreeDigest: currentArtifact.scanTree.digest,
      detectorTreeDigest: currentArtifact.detectorTree.digest,
      executionTreeDigest: currentArtifact.executionTree.digest,
      corpusDigest: currentArtifact.digests.corpus,
      scanConfigDigest: digestOf(currentArtifact.scanConfig),
      legacyArtifactDigest: digestOf(legacyArtifact),
      legacyAlgorithm: legacyArtifact.legacyAlgorithm,
      legacyAlgorithmDigest: digestOf(legacyArtifact.legacyAlgorithm),
      currentArtifactDigest: digestOf(currentArtifact),
      legacyFindingsDigest: legacyArtifact.digests.findings,
      currentFindingsDigest: currentArtifact.digests.findings,
      legacyScannerSha: legacyArtifact.provenance.scannerSha,
      legacyDetectorDigest: legacyArtifact.provenance.detectorDigest,
      legacyScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
      currentScannerSha: currentArtifact.provenance.scannerSha,
      currentDetectorDigest: currentArtifact.provenance.detectorDigest,
      currentScannerToolDigest: currentArtifact.provenance.scannerToolDigest,
    },
    target: {
      baselineSchema: RETIRED_EXACT_TARGET_SCHEMA,
      inventoryDigest: currentArtifact.digests.inventory,
      findingsDigest: currentArtifact.digests.findings,
    },
    predecessorRows,
    rows,
    summary: {
      paired: count('presence', 'paired'),
      legacyOnly: count('presence', 'legacy-only'),
      currentOnly: count('presence', 'current-only'),
      singleOrigin: count('exactOrigins', 'single'),
      splitOrigin: count('exactOrigins', 'split'),
      sameLeafShape: count('leafShapes', 'same'),
      correctedLeafShape: count('leafShapes', 'corrected'),
      predecessorSame: predecessorCount('same'),
      predecessorDecreased: predecessorCount('decreased'),
      predecessorGone: predecessorCount('gone'),
      predecessorIncreased: predecessorCount('increased'),
      predecessorNew: predecessorCount('new'),
    },
    conservation: {
      predecessorIdentities: predecessor.identities,
      predecessorCount: predecessor.total,
      legacyInventoryIdentities,
      legacyInventoryCount,
      predecessorRows: predecessorRows.length,
      predecessorIdentitiesCovered: predecessorRows
        .filter((row) => row.predecessorCount > 0).length,
      predecessorCountsCovered: predecessorRows
        .reduce((n, row) => n + row.predecessorCount, 0),
      legacyInventoryIdentitiesCovered: predecessorRows
        .filter((row) => row.legacyCount > 0).length,
      legacyInventoryCountsCovered: predecessorRows
        .reduce((n, row) => n + row.legacyCount, 0),
      legacyFindings: legacyArtifact.findings.length,
      currentFindings: currentArtifact.findings.length,
      currentSites: currentSites.size,
      legacySitesCovered: rows.filter((row) => row.legacy).length,
      currentSitesCovered: rows.filter((row) => row.current).length,
      currentFindingsCovered: rows.reduce((n, row) => n + (row.current?.origins.length || 0), 0),
      paired: count('presence', 'paired'),
      legacyOnly: count('presence', 'legacy-only'),
      currentOnly: count('presence', 'current-only'),
    },
    corpusCompatibility,
    issues: predecessorIssues,
  };
  assertConservation(report);
  return report;
}

export function migrationReportDigest(report) {
  return digestOf(report);
}

export function validateMigrationReport(
  report,
  predecessorBaseline,
  legacyArtifact,
  currentArtifact,
  predecessorBaselineText,
) {
  const expected = migrationReport(
    predecessorBaseline,
    legacyArtifact,
    currentArtifact,
    predecessorBaselineText,
  );
  if (canonicalJson(report) !== canonicalJson(expected)) {
    throw new Error('observed-shape migration report is not the canonical report for its bound inputs');
  }
  assertConservation(report);
  return report;
}

/* ══ SCHEMA 2 -> 4 — THE LIVE HEURISTIC MIGRATION ══════════════════════════ */

/**
 * ⚠⚠ THE SCHEMA-4 REPORT CARRIES NO SITE-MIGRATION ROWS, AND THAT IS THE WHOLE
 * SHAPE OF THE ARGUMENT — not an omission.
 *
 * `rows` exists in the retired 2->3 report because that migration RE-SPELLS every
 * finding: a legacy leaf identity becomes an exact per-site identity, so each
 * pairing is a fresh claim a reviewer has to accept. Schema 4 does not re-spell
 * anything. The target inventory IS the heuristic artifact's own inventory, in
 * the SAME alphabet the schema-2 predecessor is written in, so the only thing
 * that moved is which reads the detector found — which is exactly what
 * `predecessorRows` reconciles, row by row, with `new`/`increased` rows raised as
 * `issues` that a reviewed decision must discharge.
 *
 * `assertHeuristicConservation` therefore PINS `rows.length === 0` rather than
 * leaving it implied: an empty array that nobody asserts is empty is one refactor
 * away from becoming an unreviewed row set, and `validateReviewLedger` derives
 * its expected row list from `predecessorRows.concat(rows)`.
 */
function assertHeuristicConservation(report) {
  const c = report.conservation;
  if (report.rows.length !== 0) {
    throw new Error(`observed-shape heuristic migration carries site-migration rows; the schema-${report.target?.baselineSchema} target is`
      + ' the heuristic inventory itself and has no cross-detector pairing to review');
  }
  if (c.predecessorIdentitiesCovered !== c.predecessorIdentities
    || c.predecessorCountsCovered !== c.predecessorCount
    || c.legacyInventoryIdentitiesCovered !== c.legacyInventoryIdentities
    || c.legacyInventoryCountsCovered !== c.legacyInventoryCount
    || c.legacyInventoryCount !== c.legacyFindings
    || c.targetIdentities !== c.legacyInventoryIdentities
    || c.targetCount !== c.legacyInventoryCount
    || c.predecessorRows !== report.predecessorRows.length) {
    throw new Error(`observed-shape heuristic migration conservation failed: ${JSON.stringify(c)}`);
  }
  const rowIds = new Set(report.predecessorRows.map((row) => row.rowId));
  if (rowIds.size !== report.predecessorRows.length) {
    throw new Error('observed-shape migration produced duplicate row IDs');
  }
}

/** Build the canonical leaf migration report — schema 2 -> 4 (retired) or
 *  schema 4 -> 5 (live), chosen by `targetSchema`, which is REQUIRED so no
 *  caller can fall into the wrong migration by omission. ONE artifact,
 *  validated before any reconciliation, and it must be the governed detector's. */
export function heuristicMigrationReport(
  predecessorBaseline,
  legacyArtifact,
  predecessorBaselineText,
  targetSchema,
) {
  const predecessorSchema = LEAF_MIGRATION_PREDECESSOR[targetSchema];
  if (predecessorSchema === undefined) {
    throw new Error(`observed-shape leaf migration target must be ${Object.keys(LEAF_MIGRATION_PREDECESSOR).join(' or ')};`
      + ` received ${JSON.stringify(targetSchema)}`);
  }
  const { predecessor, predecessorBaselineTextSha256 } = predecessorInputOf(
    predecessorBaseline,
    predecessorBaselineText,
    predecessorSchema,
  );
  assertGovernedLegacyArtifact(legacyArtifact);
  const corpusCompatibility = assertPredecessorExecutionCompatibility(predecessor, legacyArtifact);
  const predecessorRows = predecessorRowsOf(predecessor, legacyArtifact.inventory);
  const predecessorCount = (value) => predecessorRows
    .filter((row) => row.reconciliation === value).length;
  const legacyInventoryIdentities = Object.values(legacyArtifact.inventory)
    .reduce((n, row) => n + Object.keys(row).length, 0);
  const legacyInventoryCount = Object.values(legacyArtifact.inventory)
    .reduce((n, row) => n + Object.values(row).reduce((sum, value) => sum + value, 0), 0);
  const artifactDigest = digestOf(legacyArtifact);
  // An issue carries its row id because an issue is DISCHARGEABLE BY REVIEW —
  // see the identical note on the retired path; the mechanism is shared because
  // the ledger it feeds is shared.
  const predecessorIssues = predecessorRows
    .filter((row) => row.reconciliation === 'new' || row.reconciliation === 'increased')
    .map((row) => ({
      rowId: row.rowId,
      file: row.address.file,
      identity: row.address.identity,
      reconciliation: row.reconciliation,
      predecessorCount: row.predecessorCount,
      legacyCount: row.legacyCount,
      message: `${row.address.file}: ${JSON.stringify(row.address.identity)} is ${row.reconciliation}`
        + ` against the schema-2 predecessor (${row.predecessorCount} -> ${row.legacyCount})`,
    }));
  const report = {
    reportSchema: MIGRATION_REPORT_SCHEMA,
    kind: leafMigrationKindOf(targetSchema),
    inputs: {
      subjectSha: legacyArtifact.provenance.subjectSha,
      predecessorBaselineDigest: digestOf(predecessor),
      predecessorBaselineTextSha256,
      predecessorInventoryDigest: digestOf(predecessor.inventory),
      predecessorFrozenAtSha: predecessor.frozenAtSha,
      sourceTreeDigest: legacyArtifact.provenance.sourceTreeDigest,
      scanTreeDigest: legacyArtifact.scanTree.digest,
      detectorTreeDigest: legacyArtifact.detectorTree.digest,
      executionTreeDigest: legacyArtifact.executionTree.digest,
      corpusDigest: legacyArtifact.digests.corpus,
      scanConfigDigest: digestOf(legacyArtifact.scanConfig),
      legacyArtifactDigest: artifactDigest,
      legacyAlgorithm: legacyArtifact.legacyAlgorithm,
      legacyAlgorithmDigest: digestOf(legacyArtifact.legacyAlgorithm),
      // ⭐ current* === legacy* THROUGHOUT. Schema 4 has one detector, and the
      // receipt says so in every field rather than leaving "current" undefined —
      // an absent binding cannot be checked, an equal one can.
      currentArtifactDigest: artifactDigest,
      legacyFindingsDigest: legacyArtifact.digests.findings,
      currentFindingsDigest: legacyArtifact.digests.findings,
      legacyScannerSha: legacyArtifact.provenance.scannerSha,
      legacyDetectorDigest: legacyArtifact.provenance.detectorDigest,
      legacyScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
      currentScannerSha: legacyArtifact.provenance.scannerSha,
      currentDetectorDigest: legacyArtifact.provenance.detectorDigest,
      currentScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
    },
    target: {
      baselineSchema: targetSchema,
      inventoryDigest: legacyArtifact.digests.inventory,
      findingsDigest: legacyArtifact.digests.findings,
    },
    predecessorRows,
    rows: [],
    summary: {
      predecessorSame: predecessorCount('same'),
      predecessorDecreased: predecessorCount('decreased'),
      predecessorGone: predecessorCount('gone'),
      predecessorIncreased: predecessorCount('increased'),
      predecessorNew: predecessorCount('new'),
    },
    conservation: {
      predecessorIdentities: predecessor.identities,
      predecessorCount: predecessor.total,
      legacyInventoryIdentities,
      legacyInventoryCount,
      targetIdentities: legacyInventoryIdentities,
      targetCount: legacyInventoryCount,
      predecessorRows: predecessorRows.length,
      predecessorIdentitiesCovered: predecessorRows
        .filter((row) => row.predecessorCount > 0).length,
      predecessorCountsCovered: predecessorRows
        .reduce((n, row) => n + row.predecessorCount, 0),
      legacyInventoryIdentitiesCovered: predecessorRows
        .filter((row) => row.legacyCount > 0).length,
      legacyInventoryCountsCovered: predecessorRows
        .reduce((n, row) => n + row.legacyCount, 0),
      legacyFindings: legacyArtifact.findings.length,
    },
    corpusCompatibility,
    issues: predecessorIssues,
  };
  assertHeuristicConservation(report);
  return report;
}

export function validateHeuristicMigrationReport(
  report,
  predecessorBaseline,
  legacyArtifact,
  predecessorBaselineText,
  targetSchema,
) {
  const expected = heuristicMigrationReport(
    predecessorBaseline,
    legacyArtifact,
    predecessorBaselineText,
    targetSchema,
  );
  if (canonicalJson(report) !== canonicalJson(expected)) {
    throw new Error('observed-shape migration report is not the canonical report for its bound inputs');
  }
  assertHeuristicConservation(report);
  return report;
}

/** The schema-4 authorization. Same receipt KEY SET as the retired path so the
 *  baseline envelope needs no new shape; every `current*` field is bound to the
 *  one governed heuristic artifact. */
function validateGovernedHeuristicMigration({
  predecessorBaseline,
  predecessorBaselineText,
  legacyArtifact,
  currentArtifact,
  report,
  review,
  targetSchema,
}) {
  const { predecessor, predecessorBaselineTextSha256 } = predecessorInputOf(
    predecessorBaseline,
    predecessorBaselineText,
    LEAF_MIGRATION_PREDECESSOR[targetSchema],
  );
  // ⛔ A leaf bundle that carries a DIFFERENT "current" artifact is refused
  // outright rather than quietly ignored: the bundle keeps both fields so the
  // consumer needs no branch, and this is what stops that convenience from
  // becoming a hole through which an unreviewed second artifact travels.
  if (currentArtifact !== undefined
    && canonicalJson(currentArtifact) !== canonicalJson(legacyArtifact)) {
    throw new Error(`observed-shape schema-${targetSchema} migration bundle carries a current artifact that is not`
      + ' the governed heuristic artifact itself');
  }
  validateHeuristicMigrationReport(
    report,
    predecessor,
    legacyArtifact,
    predecessorBaselineText,
    targetSchema,
  );
  return {
    ...validateReviewLedger(review, report),
    predecessorBaselineDigest: digestOf(predecessor),
    predecessorBaselineTextSha256,
    predecessorInventoryDigest: digestOf(predecessor.inventory),
    legacyArtifactDigest: report.inputs.legacyArtifactDigest,
    currentArtifactDigest: report.inputs.currentArtifactDigest,
    legacyScannerSha: legacyArtifact.provenance.scannerSha,
    legacyAlgorithmBaseSha: legacyArtifact.legacyAlgorithm.baseSha,
    legacyDetectorDigest: legacyArtifact.provenance.detectorDigest,
    legacyScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
    currentFindingsDigest: legacyArtifact.digests.findings,
    currentScannerSha: legacyArtifact.provenance.scannerSha,
    currentDetectorDigest: legacyArtifact.provenance.detectorDigest,
    currentScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
  };
}

export function reviewTemplateOf(report) {
  if (!report || report.reportSchema !== MIGRATION_REPORT_SCHEMA
    || !Array.isArray(report.predecessorRows) || !Array.isArray(report.rows)) {
    throw new Error('cannot create a review template for a malformed migration report');
  }
  return {
    reviewSchema: MIGRATION_REVIEW_SCHEMA,
    kind: 'observed-shape-migration-review',
    bindings: {
      reportDigest: migrationReportDigest(report),
      subjectSha: report.inputs.subjectSha,
      predecessorBaselineDigest: report.inputs.predecessorBaselineDigest,
      predecessorBaselineTextSha256: report.inputs.predecessorBaselineTextSha256,
      predecessorInventoryDigest: report.inputs.predecessorInventoryDigest,
      sourceTreeDigest: report.inputs.sourceTreeDigest,
      scanTreeDigest: report.inputs.scanTreeDigest,
      detectorTreeDigest: report.inputs.detectorTreeDigest,
      executionTreeDigest: report.inputs.executionTreeDigest,
      corpusDigest: report.inputs.corpusDigest,
      scanConfigDigest: report.inputs.scanConfigDigest,
      targetInventoryDigest: report.target.inventoryDigest,
    },
    decisions: [
      ...report.predecessorRows.map((row) => ({
        rowId: row.rowId,
        subject: 'predecessor-reconciliation',
        decision: 'pending',
        note: '',
      })),
      ...report.rows.map((row) => ({
        rowId: row.rowId,
        subject: 'site-migration',
        decision: 'pending',
        note: '',
      })),
    ],
  };
}

export function validateReviewLedger(review, report) {
  if (!review || review.reviewSchema !== MIGRATION_REVIEW_SCHEMA
    || review.kind !== 'observed-shape-migration-review') {
    throw new Error('observed-shape migration review has an unsupported schema');
  }
  const expectedBindings = reviewTemplateOf(report).bindings;
  if (canonicalJson(review.bindings) !== canonicalJson(expectedBindings)) {
    throw new Error('observed-shape migration review is not bound to this report and target inventory');
  }
  if (!Array.isArray(review.decisions)) throw new Error('observed-shape migration review decisions are missing');
  const expectedRows = [
    ...report.predecessorRows.map((row) => [row.rowId, 'predecessor-reconciliation']),
    ...report.rows.map((row) => [row.rowId, 'site-migration']),
  ];
  const expectedIds = new Map(expectedRows);
  const seen = new Set();
  for (const decision of review.decisions) {
    if (!decision || !expectedIds.has(decision.rowId)) {
      throw new Error(`observed-shape migration review contains an unknown row: ${JSON.stringify(decision?.rowId)}`);
    }
    if (seen.has(decision.rowId)) throw new Error(`observed-shape migration review repeats ${decision.rowId}`);
    seen.add(decision.rowId);
    if (decision.subject !== expectedIds.get(decision.rowId)) {
      throw new Error(`observed-shape migration row ${decision.rowId} has the wrong review subject`);
    }
    if (decision.decision !== 'accept') {
      throw new Error(`observed-shape migration row ${decision.rowId} is ${JSON.stringify(decision.decision)}, not accepted`);
    }
    if (typeof decision.note !== 'string' || !decision.note.trim()) {
      throw new Error(`observed-shape migration row ${decision.rowId} lacks a review note`);
    }
  }
  const missing = [...expectedIds.keys()].filter((rowId) => !seen.has(rowId));
  if (missing.length) throw new Error(`observed-shape migration review is missing ${missing.length} row(s)`);

  // ⚠⚠ THE ISSUE GATE RUNS *AFTER* THE DECISIONS, AND THAT ORDER IS THE FIX.
  // `issues` used to mean "the reconciliation is not CLEAN"; it now means "the
  // reconciliation is not REVIEWED". Say that out loud rather than let a later
  // reader conclude the gate weakened by accident: it did not weaken, it moved
  // its authority from a mechanical filter over the reconciliation to the
  // reviewed disposition of the SAME rows. Every growth row must still be
  // dispositioned by an ACCEPTED decision carrying a note; an issue whose row is
  // missing, pending, or rejected still FAILS CLOSED here — and the loop above
  // has already refused any decision that is not `accept` with a real note, so
  // reaching this line at all means every enumerated row was reviewed.
  const accepted = new Set(review.decisions
    .filter((decision) => decision.decision === 'accept')
    .map((decision) => decision.rowId));
  const undispositioned = (report.issues || []).filter((issue) => !accepted.has(issue?.rowId));
  if (undispositioned.length) {
    throw new Error('observed-shape migration report has unresolved issues: '
      + undispositioned.map((issue) => issue?.message || JSON.stringify(issue)).join('; '));
  }
  return {
    reportDigest: expectedBindings.reportDigest,
    reviewDigest: digestOf(review),
    subjectSha: expectedBindings.subjectSha,
    predecessorBaselineDigest: expectedBindings.predecessorBaselineDigest,
    predecessorBaselineTextSha256: expectedBindings.predecessorBaselineTextSha256,
    predecessorInventoryDigest: expectedBindings.predecessorInventoryDigest,
    sourceTreeDigest: expectedBindings.sourceTreeDigest,
    scanTreeDigest: expectedBindings.scanTreeDigest,
    detectorTreeDigest: expectedBindings.detectorTreeDigest,
    executionTreeDigest: expectedBindings.executionTreeDigest,
    corpusDigest: expectedBindings.corpusDigest,
    scanConfigDigest: expectedBindings.scanConfigDigest,
    targetInventoryDigest: expectedBindings.targetInventoryDigest,
  };
}

/**
 * The check gate consumes this authorization before writing a governed baseline.
 *
 * ⚠ THE TARGET SCHEMA IS READ FROM THE REPORT, NEVER FROM A FLAG THE CALLER
 * PASSES. The report is the digest-bound artifact; a caller-supplied target
 * would be the one input in this whole chain nothing content-addresses, and it
 * would decide which validator runs.
 */
export function validateGovernedMigration({
  predecessorBaseline,
  predecessorBaselineText,
  legacyArtifact,
  currentArtifact,
  report,
  review,
}) {
  if (LEAF_MIGRATION_PREDECESSOR[report?.target?.baselineSchema] !== undefined) {
    return validateGovernedHeuristicMigration({
      predecessorBaseline,
      predecessorBaselineText,
      legacyArtifact,
      currentArtifact,
      report,
      review,
      targetSchema: report.target.baselineSchema,
    });
  }
  const { predecessor, predecessorBaselineTextSha256 } = predecessorInputOf(
    predecessorBaseline,
    predecessorBaselineText,
  );
  validateMigrationReport(
    report,
    predecessor,
    legacyArtifact,
    currentArtifact,
    predecessorBaselineText,
  );
  return {
    ...validateReviewLedger(review, report),
    predecessorBaselineDigest: digestOf(predecessor),
    predecessorBaselineTextSha256,
    predecessorInventoryDigest: digestOf(predecessor.inventory),
    legacyArtifactDigest: report.inputs.legacyArtifactDigest,
    currentArtifactDigest: report.inputs.currentArtifactDigest,
    legacyScannerSha: legacyArtifact.provenance.scannerSha,
    legacyAlgorithmBaseSha: legacyArtifact.legacyAlgorithm.baseSha,
    legacyDetectorDigest: legacyArtifact.provenance.detectorDigest,
    legacyScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
    currentFindingsDigest: currentArtifact.digests.findings,
    currentScannerSha: currentArtifact.provenance.scannerSha,
    currentDetectorDigest: currentArtifact.provenance.detectorDigest,
    currentScannerToolDigest: currentArtifact.provenance.scannerToolDigest,
  };
}

/** One self-contained file is the only migration authority the freeze gate accepts. */
export function migrationBundleOf({
  predecessorBaseline,
  predecessorBaselineText,
  legacyArtifact,
  currentArtifact,
  report,
  review,
}) {
  const { predecessor, predecessorBaselineTextSha256 } = predecessorInputOf(
    predecessorBaseline,
    predecessorBaselineText,
    LEAF_MIGRATION_PREDECESSOR[report?.target?.baselineSchema] ?? 2,
  );
  validateGovernedMigration({
    predecessorBaseline: predecessor,
    predecessorBaselineText,
    legacyArtifact,
    currentArtifact,
    report,
    review,
  });
  const payload = {
    predecessorBaseline: predecessor,
    predecessorBaselineText,
    predecessorBaselineTextSha256,
    legacyArtifact,
    currentArtifact,
    report,
    review,
  };
  return {
    bundleSchema: MIGRATION_BUNDLE_SCHEMA,
    kind: 'observed-shape-migration-review-bundle',
    bundleDigest: digestOf(payload),
    ...payload,
  };
}

export function validateMigrationBundle(bundle) {
  if (!bundle || bundle.bundleSchema !== MIGRATION_BUNDLE_SCHEMA
    || bundle.kind !== 'observed-shape-migration-review-bundle'
    || bundle.bundleDigest !== digestOf({
      predecessorBaseline: bundle.predecessorBaseline,
      predecessorBaselineText: bundle.predecessorBaselineText,
      predecessorBaselineTextSha256: bundle.predecessorBaselineTextSha256,
      legacyArtifact: bundle.legacyArtifact,
      currentArtifact: bundle.currentArtifact,
      report: bundle.report,
      review: bundle.review,
    })) {
    throw new Error('observed-shape migration review bundle has an unsupported schema');
  }
  const authorization = validateGovernedMigration(bundle);
  if (bundle.predecessorBaselineTextSha256 !== authorization.predecessorBaselineTextSha256) {
    throw new Error('observed-shape migration bundle predecessor text digest mismatch');
  }
  return { ...authorization, bundleDigest: bundle.bundleDigest };
}

export function run(argv = process.argv.slice(2)) {
  const command = parseExactFlags(argv, {
    '--predecessor': { kind: 'value', name: 'predecessorPath' },
    '--legacy': { kind: 'value', name: 'legacyPath' },
    '--current': { kind: 'value', name: 'currentPath' },
    '--target-schema': { kind: 'value', name: 'targetSchema' },
    '--json': { kind: 'value', name: 'jsonPath' },
    '--review-template': { kind: 'value', name: 'templatePath' },
    '--review': { kind: 'value', name: 'reviewPath' },
    '--bundle': { kind: 'value', name: 'bundlePath' },
  });
  const { predecessorPath, legacyPath, currentPath } = command;
  // The target is DERIVED FROM THE INPUTS unless stated: an exact `--current`
  // artifact can only mean the retired 2->3 pairing, and its absence can only
  // mean the live heuristic 2->4 re-freeze. `--target-schema` makes it explicit
  // and turns any mismatch into a refusal rather than a silent mode switch.
  const targetSchema = command.targetSchema
    ? Number(command.targetSchema)
    : (currentPath ? RETIRED_EXACT_TARGET_SCHEMA : FILTERED_TARGET_SCHEMA);
  if (![RETIRED_EXACT_TARGET_SCHEMA, HEURISTIC_TARGET_SCHEMA, FILTERED_TARGET_SCHEMA]
    .includes(targetSchema)) {
    throw new Error(`observed-shape --target-schema must be ${FILTERED_TARGET_SCHEMA} (live filtered leaf),`
      + ` ${HEURISTIC_TARGET_SCHEMA} (retired unfiltered leaf)`
      + ` or ${RETIRED_EXACT_TARGET_SCHEMA} (retired exact); received ${JSON.stringify(command.targetSchema)}`);
  }
  const heuristicTarget = LEAF_MIGRATION_PREDECESSOR[targetSchema] !== undefined;
  if (!predecessorPath || !legacyPath || (!heuristicTarget && !currentPath)) {
    throw new Error('usage: migrate-observed-shape-readers.mjs --predecessor=<predecessor-baseline.json> --legacy=<legacy-artifact.json> [--target-schema=5] [--current=<exact-artifact.json> --target-schema=3] [--json=<report.json>] [--review-template=<review.json>] [--review=<completed-review.json> --bundle=<governed-review.json>]');
  }
  if (heuristicTarget && currentPath) {
    throw new Error(`observed-shape --current is only valid for the retired --target-schema=${RETIRED_EXACT_TARGET_SCHEMA} pairing;`
      + ` the schema-${targetSchema} target IS the governed heuristic artifact`);
  }
  if (command.bundlePath && !command.reviewPath) {
    throw new Error('--bundle requires a completed --review ledger');
  }
  if (command.templatePath && command.reviewPath) {
    throw new Error('--review-template and --review are conflicting phases');
  }
  const outputEntries = [
    ['json', command.jsonPath],
    ['template', command.templatePath],
    ['bundle', command.bundlePath],
  ].filter(([, path]) => path);
  const plans = outputEntries.length ? planExternalArtifactOutputs({
    root: ROOT,
    outputs: outputEntries.map(([, path]) => path),
    inputs: [
      predecessorPath,
      legacyPath,
      ...(currentPath ? [currentPath] : []),
      ...(command.reviewPath ? [command.reviewPath] : []),
    ],
  }) : [];
  const planByName = new Map(outputEntries.map(([name], index) => [name, plans[index]]));
  const predecessorBaselineText = readFileSync(predecessorPath, 'utf8');
  const predecessorBaseline = JSON.parse(predecessorBaselineText);
  const legacy = JSON.parse(readFileSync(legacyPath, 'utf8'));
  // Under the heuristic target the governed heuristic artifact IS the current
  // authority, so it fills both roles rather than a second artifact being read.
  const current = currentPath ? JSON.parse(readFileSync(currentPath, 'utf8')) : legacy;
  const report = heuristicTarget
    ? heuristicMigrationReport(predecessorBaseline, legacy, predecessorBaselineText, targetSchema)
    : migrationReport(predecessorBaseline, legacy, current, predecessorBaselineText);
  const template = command.templatePath ? reviewTemplateOf(report) : null;
  const review = command.reviewPath
    ? JSON.parse(readFileSync(command.reviewPath, 'utf8'))
    : null;
  if (review) validateReviewLedger(review, report);
  let governedBundle = null;
  if (command.bundlePath) {
    governedBundle = migrationBundleOf({
      predecessorBaseline,
      predecessorBaselineText,
      legacyArtifact: legacy,
      currentArtifact: current,
      report,
      review,
    });
  }
  if (command.jsonPath) publishJsonExclusive(planByName.get('json'), report, {
    stringify: (value) => canonicalJson(value, 2),
  });
  if (command.templatePath) publishJsonExclusive(planByName.get('template'), template, {
    stringify: (value) => canonicalJson(value, 2),
  });
  if (command.bundlePath) {
    publishJsonExclusive(planByName.get('bundle'), governedBundle, {
      stringify: (value) => canonicalJson(value, 2),
    });
  }
  console.log(canonicalJson(report.summary, 2));
  return report;
}

const invokedDirectly = process.argv[1]
  && relative(process.argv[1], fileURLToPath(import.meta.url)) === '';
if (invokedDirectly) run();

#!/usr/bin/env node
/**
 * Governed schema-2 -> schema-3 observed-reader migration.
 *
 * The predecessor schema-2 baseline and both versioned scan artifacts are
 * canonical, content-addressed inputs. Legacy and exact scans must share the
 * same committed source, complete execution tree, executed corpus and scan
 * configuration. The legacy detector is the governed 6e7acc4d algorithm with
 * one semantic-neutral addition: `pos: node.name.getStart(sf)`. That lets this
 * tool pair by an exact source address; text and nearest-line guesses are
 * deliberately forbidden because repeated reads make either ambiguous.
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

export const MIGRATION_REPORT_SCHEMA = 2;
export const MIGRATION_REVIEW_SCHEMA = 2;
export const MIGRATION_BUNDLE_SCHEMA = 2;

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

function canonicalPredecessorBaseline(predecessorBaseline) {
  if (!isRecord(predecessorBaseline) || predecessorBaseline.schema !== 2) {
    throw new Error('observed-shape predecessor baseline must be a schema-2 object');
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

export function validatePredecessorBaseline(predecessorBaseline) {
  return canonicalPredecessorBaseline(predecessorBaseline);
}

function predecessorInputOf(predecessorBaseline, predecessorBaselineText) {
  const predecessor = canonicalPredecessorBaseline(predecessorBaseline);
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
  const parsedPredecessor = canonicalPredecessorBaseline(parsed);
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

function assertArtifactPair(legacy, current) {
  validateScanArtifact(legacy);
  validateScanArtifact(current);
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
  if (current.scanMode !== 'exact-origin' || current.baselineSchema !== 3) {
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
  for (const finding of legacy.findings) assertLegacyFinding(finding);
}

function assertPredecessorExecutionCompatibility(predecessor, legacyArtifact) {
  if (predecessor.minRows !== legacyArtifact.scanConfig.minRows) {
    throw new Error(`schema-2 predecessor minRows ${predecessor.minRows} does not match the legacy artifact threshold ${legacyArtifact.scanConfig.minRows}`);
  }
  for (const key of ['seeds', 'configs', 'generations', 'pulseIntervals']) {
    if (predecessor.corpusMeta[key] !== legacyArtifact.corpus.meta?.[key]) {
      throw new Error(`schema-2 predecessor corpus configuration ${key} does not match the legacy artifact`);
    }
  }
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
  assertPredecessorExecutionCompatibility(predecessor, legacyArtifact);
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
  const predecessorIssues = predecessorRows
    .filter((row) => row.reconciliation === 'new' || row.reconciliation === 'increased')
    .map((row) => `${row.address.file}: ${JSON.stringify(row.address.identity)} is ${row.reconciliation}`
      + ` against the schema-2 predecessor (${row.predecessorCount} -> ${row.legacyCount})`);
  const report = {
    reportSchema: MIGRATION_REPORT_SCHEMA,
    kind: 'observed-shape-schema-2-to-3-migration',
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
      baselineSchema: 3,
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
  if (report.issues?.length) {
    throw new Error(`observed-shape migration report has unresolved issues: ${report.issues.join('; ')}`);
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

/** The check gate consumes this authorization before writing a schema-3 baseline. */
export function validateGovernedMigration({
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
    '--json': { kind: 'value', name: 'jsonPath' },
    '--review-template': { kind: 'value', name: 'templatePath' },
    '--review': { kind: 'value', name: 'reviewPath' },
    '--bundle': { kind: 'value', name: 'bundlePath' },
  });
  const { predecessorPath, legacyPath, currentPath } = command;
  if (!predecessorPath || !legacyPath || !currentPath) {
    throw new Error('usage: migrate-observed-shape-readers.mjs --predecessor=<schema-2-baseline.json> --legacy=<legacy-artifact.json> --current=<exact-artifact.json> [--json=<report.json>] [--review-template=<review.json>] [--review=<completed-review.json> --bundle=<governed-review.json>]');
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
      currentPath,
      ...(command.reviewPath ? [command.reviewPath] : []),
    ],
  }) : [];
  const planByName = new Map(outputEntries.map(([name], index) => [name, plans[index]]));
  const predecessorBaselineText = readFileSync(predecessorPath, 'utf8');
  const predecessorBaseline = JSON.parse(predecessorBaselineText);
  const legacy = JSON.parse(readFileSync(legacyPath, 'utf8'));
  const current = JSON.parse(readFileSync(currentPath, 'utf8'));
  const report = migrationReport(
    predecessorBaseline,
    legacy,
    current,
    predecessorBaselineText,
  );
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

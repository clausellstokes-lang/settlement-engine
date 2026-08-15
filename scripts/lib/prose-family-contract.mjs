import { createHash } from 'node:crypto';

import { OBSERVED_SCALAR_FIELDS, VOLATILE_SCALAR_KEYS } from './observed-shape-corpus.mjs';

export const PROSE_FAMILY_PROTECTED_SUBSTRATE = Object.freeze([
  'scripts/lib/observed-shape-corpus.mjs',
  'scripts/lib/prose-family-contract.mjs',
  'src/domain/events/applyEvent.js',
  'src/domain/events/eventPipeline.js',
  'src/domain/events/prepareCanonEvent.js',
  'src/domain/events/registry.js',
  'src/domain/region/graph.js',
  'src/domain/region/propagation.js',
  'src/domain/worldPulse/advanceInterval.js',
  'src/domain/worldPulse/provenanceKernel.js',
  'src/domain/worldPulse/pulseKernel.js',
  'src/domain/worldPulse/warTermination.js',
  'src/domain/worldPulse/worldState.js',
  'src/lib/chronicle.js',
  'tests/lint/.prose-family-contract-baseline.json',
]);

const FAMILIES = Object.freeze(['chronicle', 'pulseHistory', 'regionalLog', 'timeline']);
const CORPUS_KEYS = Object.freeze([
  'scalarRows', 'canonEventLogEntries', 'wizardNewsFinalEntries',
  'wizardNewsAccumulatedEntries', 'wizardNewsUnique', 'pulseHistory',
  'regionalEventLog', 'regionalEventLogUnique', 'aiChronicle',
]);
const META_KEYS = CORPUS_KEYS.slice(1);
const ROW_KEYS = Object.freeze(['family', 'path', 'field', 'distinctValues', 'occurrences']);
const FAMILY_KEYS = Object.freeze(['family', 'identities', 'distinctValues', 'occurrences']);
const TOTAL_KEYS = Object.freeze(['families', 'identities', 'distinctValues', 'occurrences']);
const SEGMENT_KEYS = Object.freeze(['kind', 'value']);
const EXPECTED_ROOTS = new Map([
  ['pulseResult', [...Array(12).keys()]], ['worldState', [12]], ['wizardNews', [13]],
  ['canonEventResult', [14]], ['aiChronicle', [15]],
]);
const EXPECTED_CORPUS = Object.freeze({
  scalarRows: 26076, canonEventLogEntries: 1, wizardNewsFinalEntries: 240,
  wizardNewsAccumulatedEntries: 1567, wizardNewsUnique: 272, pulseHistory: 12,
  regionalEventLog: 109, regionalEventLogUnique: 109, aiChronicle: 1,
});
const EXPECTED_FAMILY_TOTALS = Object.freeze([
  { family: 'chronicle', identities: 7, distinctValues: 7, occurrences: 7 },
  { family: 'pulseHistory', identities: 50, distinctValues: 1286, occurrences: 5665 },
  { family: 'regionalLog', identities: 2, distinctValues: 7, occurrences: 201 },
  { family: 'timeline', identities: 4, distinctValues: 8, occurrences: 12 },
]);
const EXPECTED_TOTALS = Object.freeze({ families: 4, identities: 63, distinctValues: 1308, occurrences: 5885 });
const EXPECTED_ROWS_BYTES = 8280;
const EXPECTED_ROWS_SHA256 = '8f83fa6ca2fc1411376220e55235ea392e76d98596f1bfd8c3eb52480b8469ae';
const codepoint = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const identityOf = (row) => `${row.family}\0${row.path}\0${row.field}`;

function exactKeys(value, keys, label, ordered = false) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  const actual = Object.keys(value);
  if (ordered ? !same(actual, keys) : !same(actual.sort(codepoint), [...keys].sort(codepoint))) {
    throw new Error(`${label} must have exactly keys ${keys.join(', ')}`);
  }
  return value;
}

function count(value, label, positive = false) {
  if (!Number.isSafeInteger(value) || value < (positive ? 1 : 0)) {
    throw new Error(`${label} must be a ${positive ? 'positive' : 'non-negative'} safe integer`);
  }
  return value;
}

function segmentOf(raw, label) {
  const segment = exactKeys(raw, SEGMENT_KEYS, label);
  if (segment.kind === 'field' && typeof segment.value === 'string' && segment.value.trim()) return segment;
  if (segment.kind === 'index' && Number.isSafeInteger(segment.value) && segment.value >= 0) return segment;
  throw new Error(`${label} is not a lawful typed segment`);
}

function familyOf(row) {
  const path = row.path;
  if (row.root === 'canonEventResult' && row.rootOrdinal === 14
      && path[0]?.kind === 'field' && path[0].value === 'nextEventLog') return 'timeline';
  if (row.root === 'worldState' && row.rootOrdinal === 12
      && path[0]?.kind === 'field' && path[0].value === 'pulseHistory') return 'pulseHistory';
  if (row.root === 'pulseResult' && row.rootOrdinal >= 0 && row.rootOrdinal < 12
      && path[0]?.kind === 'field' && path[0].value === 'regionalGraph'
      && path[1]?.kind === 'field' && path[1].value === 'eventLog') return 'regionalLog';
  if (row.root === 'aiChronicle' && row.rootOrdinal === 15) return 'chronicle';
  return null;
}

function validateRows(rows, label = 'rows') {
  if (!Array.isArray(rows) || rows.length === 0) throw new Error(`${label} must be a nonempty array`);
  let previous = null;
  return rows.map((raw, index) => {
    const row = exactKeys(raw, ROW_KEYS, `${label}[${index}]`, true);
    if (!FAMILIES.includes(row.family)) throw new Error(`${label}[${index}].family is not governed`);
    for (const key of ['path', 'field']) {
      if (typeof row[key] !== 'string' || !row[key].trim() || row[key].includes('\0')) {
        throw new Error(`${label}[${index}].${key} must be a nonblank collision-safe string`);
      }
    }
    if (!OBSERVED_SCALAR_FIELDS.includes(row.field)) throw new Error(`${label}[${index}].field is not observed`);
    count(row.distinctValues, `${label}[${index}].distinctValues`, true);
    count(row.occurrences, `${label}[${index}].occurrences`, true);
    if (row.occurrences < row.distinctValues) throw new Error(`${label}[${index}] has more values than occurrences`);
    const identity = identityOf(row);
    if (previous !== null && codepoint(previous, identity) >= 0) {
      throw new Error(`${label} identities must be unique and codepoint-sorted: ${identity}`);
    }
    previous = identity;
    return row;
  });
}

function totalsOf(rows) {
  return {
    families: new Set(rows.map((row) => row.family)).size,
    identities: rows.length,
    distinctValues: rows.reduce((sum, row) => sum + row.distinctValues, 0),
    occurrences: rows.reduce((sum, row) => sum + row.occurrences, 0),
  };
}

function familyTotalsOf(rows) {
  return FAMILIES.map((family) => {
    const selected = rows.filter((row) => row.family === family);
    return {
      family,
      identities: selected.length,
      distinctValues: selected.reduce((sum, row) => sum + row.distinctValues, 0),
      occurrences: selected.reduce((sum, row) => sum + row.occurrences, 0),
    };
  });
}

export function proseFamilyRowsSha256(rows) {
  return createHash('sha256').update(JSON.stringify(validateRows(rows))).digest('hex');
}

export function deriveProseFamilyContract(scalarRows, scalarMeta) {
  if (!Array.isArray(scalarRows) || scalarRows.length === 0) throw new Error('scalarRows must be a nonempty array');
  exactKeys(scalarMeta, META_KEYS, 'scalarMeta');
  const roots = new Map([...EXPECTED_ROOTS].map(([root]) => [root, new Set()]));
  const selected = []; const exactAddresses = new Set();
  for (const [index, raw] of scalarRows.entries()) {
    const row = exactKeys(raw, ['root', 'rootOrdinal', 'path', 'value'], `scalarRows[${index}]`);
    if (typeof row.root !== 'string' || !row.root.trim() || !EXPECTED_ROOTS.has(row.root)) {
      throw new Error(`scalarRows[${index}].root is outside the AO-0 topology`);
    }
    count(row.rootOrdinal, `scalarRows[${index}].rootOrdinal`);
    roots.get(row.root).add(row.rootOrdinal);
    if (!Array.isArray(row.path) || row.path.length === 0) throw new Error(`scalarRows[${index}].path is empty`);
    row.path.forEach((segment, offset) => segmentOf(segment, `scalarRows[${index}].path[${offset}]`));
    const family = familyOf(row); if (!family) continue;
    if (row.value !== null && (typeof row.value !== 'string' || !row.value.trim())) {
      throw new Error(`scalarRows[${index}].value must be null or a nonblank string`);
    }
    const fields = row.path.filter((segment) => segment.kind === 'field').map((segment) => segment.value);
    if (fields.some((field) => ['.', '[', ']'].some((delimiter) => field.includes(delimiter)))) throw new Error(`scalarRows[${index}] has a delimiter-bearing field`);
    if (fields.some((field) => VOLATILE_SCALAR_KEYS.includes(field))) throw new Error(`scalarRows[${index}] selects a volatile field`);
    const field = [...fields].reverse().find((name) => OBSERVED_SCALAR_FIELDS.includes(name));
    if (!field) throw new Error(`scalarRows[${index}] has no observed scalar field`);
    if (family === 'timeline' && (row.path[1]?.kind !== 'index' || row.path[1].value !== 0)) throw new Error('timeline must reach exact entry index 0');
    if (family === 'pulseHistory' && (row.path[1]?.kind !== 'index' || row.path[1].value >= 12)) throw new Error('pulseHistory must reach exact record indexes 0..11');
    if (family === 'regionalLog' && row.path[2]?.kind !== 'index') throw new Error('regionalLog must reach a typed event index');
    if (family === 'chronicle' && (row.path[0]?.kind !== 'index' || row.path[0].value !== 0)) throw new Error('chronicle must reach exact entry index 0');
    const typed = JSON.stringify(row.path.map(({ kind, value }) => [kind, value]));
    const address = `${row.root}\0${row.rootOrdinal}\0${typed}`;
    if (exactAddresses.has(address)) throw new Error(`duplicate exact scalar address ${address}`);
    exactAddresses.add(address);
    const path = row.path.map((segment) => (segment.kind === 'index' ? '[]' : segment.value))
      .reduce((out, part) => (part === '[]' ? `${out}[]` : out ? `${out}.${part}` : part), '');
    selected.push({ family, path, field, value: row.value, source: row });
  }
  for (const [root, expected] of EXPECTED_ROOTS) {
    const actual = [...roots.get(root)].sort((a, b) => a - b);
    if (!same(actual, expected)) throw new Error(`${root} root ordinals drifted: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
  const pulseIndexes = new Set(selected.filter(({ family }) => family === 'pulseHistory').map(({ source }) => source.path[1].value));
  const regional = selected.filter(({ family }) => family === 'regionalLog');
  const regionalRecords = new Set(regional.map(({ source }) => `${source.rootOrdinal}\0${source.path[2].value}`));
  if (!same([...pulseIndexes].sort((a, b) => a - b), [...Array(12).keys()])) throw new Error('pulseHistory record reach is not exactly 0..11');
  if (regionalRecords.size !== scalarMeta.regionalEventLog || scalarMeta.regionalEventLog !== scalarMeta.regionalEventLogUnique) throw new Error('regionalLog record reach disagrees with scalar meta');
  const regionalRoots = [...new Set(regional.map(({ source }) => source.rootOrdinal))].sort((a, b) => a - b);
  if (!same(regionalRoots, [...Array(12).keys()])) throw new Error('regionalLog root reach is not exactly 0..11');
  for (const rootOrdinal of regionalRoots) {
    const indexes = [...new Set(regional.filter(({ source }) => source.rootOrdinal === rootOrdinal)
      .map(({ source }) => source.path[2].value))].sort((a, b) => a - b);
    if (!same(indexes, [...Array(indexes.at(-1) + 1).keys()])) throw new Error(`regionalLog root ${rootOrdinal} event indexes are not contiguous`);
  }
  const buckets = new Map();
  for (const row of selected) {
    const identity = identityOf(row);
    if (!buckets.has(identity)) buckets.set(identity, { family: row.family, path: row.path, field: row.field, values: new Set(), occurrences: 0 });
    const bucket = buckets.get(identity); bucket.values.add(JSON.stringify(row.value)); bucket.occurrences += 1;
  }
  const rows = [...buckets.values()].map(({ values, ...row }) => ({
    family: row.family, path: row.path, field: row.field,
    distinctValues: values.size, occurrences: row.occurrences,
  })).sort((left, right) => codepoint(identityOf(left), identityOf(right)));
  validateRows(rows);
  const corpus = { scalarRows: scalarRows.length, ...Object.fromEntries(META_KEYS.map((key) => [key, count(scalarMeta[key], `scalarMeta.${key}`)])) };
  const familyTotals = familyTotalsOf(rows);
  if (familyTotals.some((row) => row.identities === 0)) throw new Error('every governed prose family must be nonempty');
  return { corpus, familyTotals, rows, rowsSha256: proseFamilyRowsSha256(rows), totals: totalsOf(rows) };
}

export function validateProseFamilyBaseline(value) {
  exactKeys(value, ['schemaVersion', 'corpus', 'familyTotals', 'rows', 'rowsSha256', 'totals'], 'baseline');
  if (value.schemaVersion !== 1) throw new Error('baseline.schemaVersion must equal 1');
  exactKeys(value.corpus, CORPUS_KEYS, 'baseline.corpus', true);
  for (const key of CORPUS_KEYS) count(value.corpus[key], `baseline.corpus.${key}`);
  const rows = validateRows(value.rows, 'baseline.rows');
  if (!Array.isArray(value.familyTotals) || value.familyTotals.length !== FAMILIES.length) throw new Error('baseline.familyTotals must cover four families');
  value.familyTotals.forEach((row, index) => {
    exactKeys(row, FAMILY_KEYS, `baseline.familyTotals[${index}]`, true);
    if (row.family !== FAMILIES[index]) throw new Error('baseline.familyTotals must be codepoint-sorted and complete');
    for (const key of FAMILY_KEYS.slice(1)) count(row[key], `baseline.familyTotals[${index}].${key}`);
  });
  exactKeys(value.totals, TOTAL_KEYS, 'baseline.totals', true);
  for (const key of TOTAL_KEYS) count(value.totals[key], `baseline.totals.${key}`);
  if (!same(value.familyTotals, familyTotalsOf(rows)) || !same(value.totals, totalsOf(rows))) throw new Error('baseline totals disagree with rows');
  const bytes = Buffer.byteLength(JSON.stringify(rows)); const digest = proseFamilyRowsSha256(rows);
  if (!same(value.corpus, EXPECTED_CORPUS) || !same(value.familyTotals, EXPECTED_FAMILY_TOTALS)
      || !same(value.totals, EXPECTED_TOTALS) || rows.length !== EXPECTED_TOTALS.identities
      || bytes !== EXPECTED_ROWS_BYTES || digest !== EXPECTED_ROWS_SHA256
      || value.rowsSha256 !== EXPECTED_ROWS_SHA256) {
    throw new Error('baseline moved from the immutable AO-5 denominator');
  }
  return value;
}

export function compareProseFamilyRows(liveRows, frozenRows) {
  const live = validateRows(liveRows, 'live rows'); const frozen = validateRows(frozenRows, 'frozen rows');
  const left = new Map(live.map((row) => [identityOf(row), row])); const right = new Map(frozen.map((row) => [identityOf(row), row])); const failures = [];
  for (const identity of new Set([...left.keys(), ...right.keys()])) {
    const actual = left.get(identity); const expected = right.get(identity);
    if (!expected) failures.push(`new ${identity}: live=${JSON.stringify(actual)} frozen=missing`);
    else if (!actual) failures.push(`vanished ${identity}: live=missing frozen=${JSON.stringify(expected)}`);
    else for (const key of ['distinctValues', 'occurrences']) if (actual[key] !== expected[key]) {
      failures.push(`${actual[key] > expected[key] ? 'grown' : 'shrunk'} ${identity}.${key}: live=${actual[key]} frozen=${expected[key]}`);
    }
  }
  if (failures.length) throw new Error(`prose family rows moved:\n${failures.sort(codepoint).join('\n')}`);
  return true;
}

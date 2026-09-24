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
// ── RE-RECORDED 2026-08-17 BY TE36 (THE P4 POPULATION RECONCILIATION), CHAIR-AUTHORIZED
// UNDER ODQ §271. THE DENOMINATOR MOVED; THE CONTRACT DID NOT ────────────────────────────
// ⭐ THE SHAPE IS UNTOUCHED AND THAT IS THE WHOLE POINT: 63 identities before, 63 after,
// ZERO added and ZERO removed, four families still nonempty, `chronicle` and `timeline`
// byte-identical. Every moved figure is a COUNT on a path the contract already governed,
// and every one moves DOWN.
// THE CAUSE, in one row: `pulseHistory[].*.populationDeltas[].reason` goes distinctValues
// 2 → 1 and occurrences 41 → 5 (consequence) / 40 → 4 (mechanical). WAVE P4 (ODQ §219.3)
// retired the bare `population_decline` candidate under `demographicsEnabled`, and this
// corpus lights EVERY `*Enabled` flag, so the reason vocabulary of the population lane
// collapses to what a conserved TRANSFER still writes. Everything else follows from that
// one retirement: `consequenceOutcomes[].type` 9 → 8 distinct and `mechanicalOutcomes[].type`
// 3 → 2 (the retired candidateType), the headline/summary/reasons counts on both lanes, the
// rumour-seed family the retired outcomes used to seed, and `regionalGraph.eventLog[]`
// 109 → 73. THE NEWS LAYER DOES NOT MOVE — wizardNewsFinalEntries 240, accumulated 1567,
// unique 272 are all unchanged — because ordinary population drift was already `state_only`.
// ⚠ SCOPE: `demographicsEnabled` is virtual and false in every shipped preset. This
// denominator is the ONLY place in the estate that observes the lit engine, so no player,
// no shipped golden and no dark-control cell sees any of this.
// ── RE-RECORDED 2026-09-01 BY T8 · SHIFT (ODQ §858 + §860, the cited-companion clause), IN THE
// SAME ACT AS `tests/lint/.prose-family-contract-baseline.json` ─────────────────────────────────
// ⭐ THE SHAPE IS AGAIN UNTOUCHED, WHICH IS THE ONE THING WORTH SAYING FIRST: 63 identities before
// and after, ZERO added and ZERO removed, four families still nonempty, `chronicle` (7/7/7) and
// `timeline` (4/8/12) byte-identical. 26 of the 63 rows moved, every one of them a COUNT on a path
// this contract already governed. Reviewed row by row against the predecessor before the write;
// the review is in laneT8ROUTE-receipt.md, not summarised away here.
// ⚠ THE ROWS DIGEST IS THE ONE FIGURE THAT CANNOT BE PATCHED BY HAND. It is the sha256 of the
// regenerated rows, and `EXPECTED_ROWS_BYTES` is `Buffer.byteLength(JSON.stringify(rows))` of the
// same array — both are re-derived from ONE `deriveProseFamilyContract` run, never transcribed.
//
// THE CAUSES, DECOMPOSED BY SINGLE-VARIABLE CONTROL RATHER THAN BY ARGUMENT. Restoring ONLY
// src/domain/prosperityRank.js + src/domain/corruption.js to the landing base `598642981` (cars 2,
// 3, both addenda and the F6 bundle bill left at the tip) measures scalarRows 25438, pulseHistory
// {1057, 5063}, regionalLog {7, 165} — the FROZEN regionalLog exactly. So:
//   cars 2 + 3    scalarRows −13, pulseHistory distinctValues −141 / occurrences −13, regionalLog 0.
//                 Car 3's priorityCategory relabel is the distinctValues half (the `reasons[]`
//                 vocabularies: consequence 110 → 74, impactDigest 118 → 80, mechanical 47 → 25,
//                 rumour-seed 33 → 20, selected 118 → 80 — backing factions re-spelling their
//                 reasons); car 2's rumour dedup is the occurrences half.
//   car 1         scalarRows −39, pulseHistory {−9, −45}, and ALL of regionalLog {7 → 8, 165 → 169}
//                 plus ALL of the news layer (accumulated 1567 → 1565, unique 272 → 268). The
//                 corruption-onset shift §858 priced (~9 → ~33 ticks) reaches a 12-interval corpus:
//                 `pulseHistory[].corruptionEvents[].kind` occurrences 3 → 1 is that shift, read
//                 directly.
// ⚠ SCOPE, unchanged from the TE36 note above: `demographicsEnabled` is virtual and false in every
// shipped preset, and this denominator is the ONLY place in the estate that observes the lit
// engine. No player, no shipped golden and no dark-control cell sees any of this.
// ── RE-RECORDED 2026-09-24 BY FP BATCH LANDING 4 (the FP chair, session 87797a6a), IN THE SAME ACT AS THE NEWS-VOICE AND
// NEWS-HEADLINE CONTRACTS AND THE OSR WALKER'S PINS ──────────────────────────────────────────────────────────────────
// scalarRows 25549 → 26329; wizardNewsFinalEntries 240 → 272; wizardNewsAccumulatedEntries 1567 → 1604;
// wizardNewsUnique 273 and every FAMILY ROW HOLD (the 63 identities, their counts, the bytes and the digest are unmoved —
// the kept news entries live under wizardNews.entries, which this contract excludes by law). ONE CAUSE: the Herald lens U2
// (32315e384, FP-31 = P1), the 52-week window under the 240 cap; attributed by equality with the U2 seat's own measurement.
// ── RE-RECORDED 2026-09-24 BY FP BATCH LANDING 3 (the FP chair, session 87797a6a), IN THE SAME ACT AS THE OSR
// WALKER'S PIN AND THE NEWS-VOICE CONTRACT ─────────────────────────────────────────────────────────────────
// scalarRows 25527 → 25549; wizardNewsUnique 272 → 273; pulseHistory 1051/5075 → 1055/5097; totals
// 1074/5270 → 1078/5292; rows bytes 8271 → 8271. ⭐ THE SHAPE IS UNTOUCHED FOR THE FOURTH RE-RECORD RUNNING: 63 identities
// before and after, the same four families, chronicle 7/7/7, regionalLog 2/8/176 and timeline 4/8/12 unmoved —
// only pulseHistory's counts grow. ONE CAUSE, ATTRIBUTED BY BISECT (the corpus builder run per sha over the
// fourteen commits since landing 2, then these walkers run at the culprit): CURE-PEACE-1 U1 (c9b24fe51) — a
// peacetime suit retires when a war opens against its court, and the feed's reconcile of the superseded proposal
// mints ONE new wizard-news id, whose impact digest lands in the twelve pulse-history records (channelType
// 150 → 151, the +22 scalar rows). The walkers at c9b24fe51 and at the landing tip 98e0d8664 measure every
// figure identically; no other batch-3 pick moves any of them.
// ── RE-RECORDED 2026-09-01 BY THE WAR LANDING (§876), IN THE SAME ACT AS
// `tests/lint/.prose-family-contract-baseline.json` ────────────────────────────────────────────
// ⭐ THE SHAPE IS UNTOUCHED FOR THE THIRD RE-RECORD RUNNING: 63 identities before and after, ZERO
// added and ZERO removed, four families still nonempty, `chronicle` (7/7/7) and `timeline` (4/8/12)
// byte-identical yet again. 25 of the 63 rows moved, every one a COUNT on a path this contract
// already governed. The row-by-row review is in the lane receipt, not summarised away here.
// ⚠⚠ `EXPECTED_ROWS_BYTES` DID NOT MOVE, AND THAT IS A COINCIDENCE OF DIGIT WIDTHS, NOT A
// DORMANCY PROOF. 25 rows changed their counts and the digit-count changes happen to cancel to
// zero, so the array is 8271 bytes at both ends. THE DIGEST MOVES — that is the pin that is
// actually load-bearing here, and a byte pin alone would have read GREEN over a real movement.
// Both figures are re-derived from ONE `deriveProseFamilyContract` run and never transcribed.
//
// THE CAUSE, BY FIVE-ARM SINGLE-VARIABLE CONTROL RATHER THAN BY ARGUMENT, and it is ONE CAR.
// `6308a27b8` (landing base) and `ca7a6ba6a` (T4 SEAT-5) both measure the FROZEN denominator
// exactly — scalarRows 25399, pulseHistory {1048, 5018}, regionalLog {8, 169}, digest
// `687ae7e5…`. `5a529f100` (T4 SEAT-2b) measures the ENTIRE tip: 25527, {1051, 5075}, {8, 176},
// digest `4cf433b2…`. `0e27b7742`, `fc155e476`, `105c65cd1` and all three WAR mini-window cars
// move it by EXACTLY ZERO — every artifact byte-identical to the picks-only arm.
// ⛔ SO THE TWO CAUSES THE LANE BRIEF NAMED ARE FALSIFIED: W-MEM's `publishRuling` funnel is
// unreached by a 12-interval AO-0 corpus, and T4's occupation-authority prose moves nothing here.
// SEAT-2b mints `legitimacyUpheavalEnabled` with its first reader `stressorGates.upheavalLit`;
// this corpus lights every `*Enabled` flag, so the key is live HERE and nowhere else.
// ⭐ REGIONALLOG IS THE CLEANEST READING IN THE FILE: `distinctValues` HOLDS AT 8 while
// occurrences go 169 → 176. The audit log records the same eight KINDS of change, seven more
// times — an upheaval re-deal, not a new kind of event, and the car's own "redistribution, not
// inflation" invariant measured from the far side of the estate.
// ⚠ SCOPE, unchanged from both notes above: `demographicsEnabled` and now
// `legitimacyUpheavalEnabled` are virtual and false in every shipped preset, and this denominator
// is the ONLY place in the estate that observes the lit engine. No player, no shipped golden and
// no dark-control cell sees any of this.
const EXPECTED_CORPUS = Object.freeze({
  scalarRows: 26329, canonEventLogEntries: 1, wizardNewsFinalEntries: 272,
  wizardNewsAccumulatedEntries: 1604, wizardNewsUnique: 273, pulseHistory: 12,
  regionalEventLog: 77, regionalEventLogUnique: 77, aiChronicle: 1,
});
const EXPECTED_FAMILY_TOTALS = Object.freeze([
  { family: 'chronicle', identities: 7, distinctValues: 7, occurrences: 7 },
  { family: 'pulseHistory', identities: 50, distinctValues: 1055, occurrences: 5097 },
  { family: 'regionalLog', identities: 2, distinctValues: 8, occurrences: 176 },
  { family: 'timeline', identities: 4, distinctValues: 8, occurrences: 12 },
]);
const EXPECTED_TOTALS = Object.freeze({ families: 4, identities: 63, distinctValues: 1078, occurrences: 5292 });
const EXPECTED_ROWS_BYTES = 8271;
const EXPECTED_ROWS_SHA256 = '438fe9c4a22d184c4133f0151216611d6a554e9673b063637b215f85f64f7466';
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

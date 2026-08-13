import { createHash } from 'node:crypto';

const ADDRESS_KEYS = Object.freeze(['home', 'field', 'voiceClass', 'distinctValues', 'occurrences']);
const REWRITE_KEYS = Object.freeze(['source', 'flags', 'replacement', 'distinctValues', 'occurrences']);
const INERT_KEYS = Object.freeze(['source', 'flags', 'replacement', 'reason']);
const RAW_KEYS = Object.freeze(['rootOrdinal', 'pulseIndex', 'field', 'outcomeIndex', 'headline']);
const LANES = Object.freeze({ mechanicalOutcomes: 8, selectedOutcomes: 24 });
const CORPUS = Object.freeze({ pulseRoots: 12, introductions: 272, retirements: 32, finalEntries: 240, homes: 53 });
const ADDRESS_TOTALS = Object.freeze({ homes: 53, fields: 2, identities: 106, prospectiveIdentities: 14, indicativeIdentities: 92, distinctValues: 400, occurrences: 544 });
const RAW_LIVENESS = Object.freeze({
  pulseRecords: 12,
  lanes: Object.freeze([
    Object.freeze({ field: 'mechanicalOutcomes', capPerPulse: 8, headlineOccurrences: 77, distinctValues: 24, prospectiveOccurrences: 73, prospectiveDistinctValues: 23, indicativeOccurrences: 4, indicativeDistinctValues: 1 }),
    Object.freeze({ field: 'selectedOutcomes', capPerPulse: 24, headlineOccurrences: 151, distinctValues: 80, prospectiveOccurrences: 95, prospectiveDistinctValues: 66, indicativeOccurrences: 56, indicativeDistinctValues: 14 }),
  ]),
  union: Object.freeze({ headlineOccurrences: 228, distinctValues: 83, prospectiveOccurrences: 168, prospectiveDistinctValues: 69, indicativeOccurrences: 60, indicativeDistinctValues: 14 }),
});
const REWRITE_TOTALS = Object.freeze({ rules: 26, activeRules: 17, inertRules: 9, distinctValues: 69, occurrences: 168 });

export const KNOWN_INERT_HEADLINE_REWRITES = Object.freeze([
  { source: '\\bmay close its doors\\b', flags: '', replacement: 'closes its doors', reason: 'institutionLifecycle.js::evaluateInstitutionLifecycle is the live institution-closure authoring seam; the executed AO-0 12-record persisted public+mechanical union contains no closure headline.' },
  { source: '\\bmay defect\\b', flags: '', replacement: 'defects', reason: 'npcAgency.js::deriveNpcCandidates exposes NPC_ACTION_FAMILIES.defect through candidateForAction; the executed AO-0 12-record persisted public+mechanical union contains no defect headline.' },
  { source: '\\bmay grow\\b', flags: '', replacement: 'grows', reason: 'populationDynamics.js::populationCandidate is the live growth authoring seam; the executed AO-0 12-record persisted public+mechanical union contains no growth headline.' },
  { source: '\\bmay hoard\\b', flags: '', replacement: 'hoards', reason: 'npcAgency.js::deriveNpcCandidates exposes NPC_ACTION_FAMILIES.hoard through candidateForAction; the executed AO-0 12-record persisted public+mechanical union contains no hoard headline.' },
  { source: '\\bmay raise a\\b', flags: '', replacement: 'raises a', reason: 'institutionLifecycle.js::evaluateInstitutionLifecycle is the live institution-build authoring seam; the executed AO-0 12-record persisted public+mechanical union contains no build headline.' },
  { source: '\\bmay recover\\b', flags: '', replacement: 'recovering', reason: 'tierResourceDynamics.js::evaluateTierResourceDynamics is the live resource-recovery authoring seam; the executed AO-0 12-record persisted public+mechanical union contains no recovery headline.' },
  { source: '\\bmay rise\\b', flags: '', replacement: 'rises', reason: "tierResourceDynamics.js::tierCandidate and relationshipRulesCore.js's vassal-rebellion candidate are live rise authoring seams; the executed AO-0 12-record persisted public+mechanical union contains no rise headline." },
  { source: '\\bmay spread\\b', flags: '', replacement: 'spreads', reason: 'stressors.js::evaluateStressorRules is the live stressor-spread authoring seam; the executed AO-0 12-record persisted public+mechanical union contains births and escalations but no spread headline.' },
  { source: '\\bmay undermine\\b', flags: '', replacement: 'undermines', reason: 'npcAgency.js::deriveNpcCandidates exposes TARGETED_ACTION_PHRASING.undermine_rival through candidateForAction; the executed AO-0 12-record persisted public+mechanical union contains no undermine headline.' },
].map((row) => Object.freeze(row)));

const codepoint = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const exactKeys = (value, keys, label) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || !same(Object.keys(value).sort(codepoint), [...keys].sort(codepoint))) throw new Error(`${label} must have exactly keys ${keys.join(', ')}`);
  return value;
};
const nonblank = (value, label, mustBeTrimmed = false) => {
  if (typeof value !== 'string' || !value.trim() || (mustBeTrimmed && value !== value.trim())) throw new Error(`${label} must be a nonblank${mustBeTrimmed ? ' trimmed' : ''} string`);
  return value;
};
const safeCount = (value, label) => {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${label} must be a non-negative safe integer`);
  return value;
};
const addressIdentity = (row) => `${row.home}|${row.field}|${row.voiceClass}`;
const rewriteIdentity = (row) => `${row.source}|${row.flags}|${row.replacement}`;
const rawAddress = (row) => `${row.rootOrdinal}|${row.pulseIndex}|${row.field}|${row.outcomeIndex}`;
const compareRaw = (left, right) => left.pulseIndex - right.pulseIndex || codepoint(left.field, right.field)
  || left.outcomeIndex - right.outcomeIndex || codepoint(left.headline, right.headline);

function validateRows(rows, keys, identityOf, label, validate) {
  if (!Array.isArray(rows)) throw new Error(`${label} must be an array`);
  let previous = null;
  return rows.map((raw, index) => {
    const row = exactKeys(raw, keys, `${label}[${index}]`); validate(row, `${label}[${index}]`);
    const identity = identityOf(row);
    if (previous !== null && codepoint(previous, identity) >= 0) throw new Error(`${label} identities must be unique and codepoint-sorted: ${identity}`);
    previous = identity; return row;
  });
}
const validateAddressRows = (rows, label = 'address rows') => validateRows(rows, ADDRESS_KEYS, addressIdentity, label, (row, at) => {
  for (const key of ADDRESS_KEYS.slice(0, 3)) nonblank(row[key], `${at}.${key}`, true);
  if (!['headline', 'summary'].includes(row.field) || !['indicative', 'prospective'].includes(row.voiceClass)) throw new Error(`${at} is outside the closed address vocabulary`);
  if (safeCount(row.distinctValues, `${at}.distinctValues`) < 1 || safeCount(row.occurrences, `${at}.occurrences`) < row.distinctValues) throw new Error(`${at} carries impossible address counts`);
});
const validateRewriteRows = (rows, label = 'rewrite rows') => validateRows(rows, REWRITE_KEYS, rewriteIdentity, label, (row, at) => {
  nonblank(row.source, `${at}.source`, true); nonblank(row.replacement, `${at}.replacement`, true);
  if (row.flags !== '') throw new Error(`${at}.flags must be empty`);
  safeCount(row.distinctValues, `${at}.distinctValues`); safeCount(row.occurrences, `${at}.occurrences`);
  if ((row.distinctValues === 0) !== (row.occurrences === 0) || row.occurrences < row.distinctValues) throw new Error(`${at} carries split or impossible liveness counts`);
});
const validateInertRows = (rows, label = 'knownInert') => validateRows(rows, INERT_KEYS, rewriteIdentity, label, (row, at) => {
  nonblank(row.source, `${at}.source`, true); nonblank(row.replacement, `${at}.replacement`, true); nonblank(row.reason, `${at}.reason`, true);
  if (row.flags !== '') throw new Error(`${at}.flags must be empty`);
});

export function deriveNewsAddressRows(introductions) {
  if (!Array.isArray(introductions) || introductions.length === 0) throw new Error('introduced entries must be a nonempty array');
  const buckets = new Map();
  for (const [index, entry] of introductions.entries()) {
    const fields = entry?.fields;
    if (!fields || typeof fields !== 'object') throw new Error(`introduction ${index} has no fields`);
    for (const key of ['kind', 'headline', 'summary']) nonblank(fields[key], `introduction ${index}.${key}`);
    if (!Object.hasOwn(fields, 'impactKind') || fields.impactKind === undefined) throw new Error(`introduction ${index}.impactKind must be present`);
    const impactToken = fields.impactKind === null ? 'null' : nonblank(fields.impactKind, `introduction ${index}.impactKind`);
    if (fields.kind.includes('|') || impactToken.includes('|') || fields.impactKind === 'null') throw new Error(`introduction ${index} has a colliding home token`);
    const home = `${fields.kind}|${impactToken}`;
    for (const field of ['headline', 'summary']) {
      const value = fields[field]; const voiceClass = (field === 'headline' ? /\bmay\b/ : /\bcan advance through\b/).test(value) ? 'prospective' : 'indicative'; const key = `${home}|${field}`;
      if (!buckets.has(key)) buckets.set(key, { home, field, voiceClass, values: new Set(), occurrences: 0 });
      const bucket = buckets.get(key); if (bucket.voiceClass !== voiceClass) throw new Error(`mixed voice classes at ${key}: ${bucket.voiceClass} and ${voiceClass}`);
      bucket.values.add(value); bucket.occurrences += 1;
    }
  }
  const rows = [...buckets.values()].map((bucket) => ({ home: bucket.home, field: bucket.field, voiceClass: bucket.voiceClass, distinctValues: bucket.values.size, occurrences: bucket.occurrences }))
    .sort((left, right) => codepoint(addressIdentity(left), addressIdentity(right)));
  return validateAddressRows(rows);
}

export function addressRowsSha256(rows) {
  return createHash('sha256').update(JSON.stringify(validateAddressRows(rows))).digest('hex');
}

function validateRawRows(rows, label = 'persisted headline rows') {
  if (!Array.isArray(rows)) throw new Error(`${label} must be an array`);
  const addresses = new Set(); let previous = null;
  return rows.map((raw, index) => {
    const row = exactKeys(raw, RAW_KEYS, `${label}[${index}]`);
    safeCount(row.rootOrdinal, `${label}[${index}].rootOrdinal`); safeCount(row.pulseIndex, `${label}[${index}].pulseIndex`); safeCount(row.outcomeIndex, `${label}[${index}].outcomeIndex`); nonblank(row.headline, `${label}[${index}].headline`);
    if (!Object.hasOwn(LANES, row.field)) throw new Error(`${label}[${index}].field is not a persisted liveness lane`);
    if (row.outcomeIndex >= LANES[row.field]) throw new Error(`${label}[${index}] breaches the ${row.field} cap ${LANES[row.field]}`);
    if (previous && compareRaw(previous, row) >= 0) throw new Error(`${label} must use numeric pulse/field/outcome/headline order`);
    const address = rawAddress(row); if (addresses.has(address)) throw new Error(`${label} repeats typed address ${address}`);
    addresses.add(address); previous = row; return row;
  });
}

export function selectPersistedHeadlineRows(scalarRows) {
  if (!Array.isArray(scalarRows)) throw new Error('scalar observations must be an array');
  const selected = scalarRows.filter((row) => row?.root === 'worldState' && row.path?.length === 5
    && row.path[0]?.kind === 'field' && row.path[0].value === 'pulseHistory' && row.path[1]?.kind === 'index'
    && row.path[2]?.kind === 'field' && Object.hasOwn(LANES, row.path[2].value) && row.path[3]?.kind === 'index'
    && row.path[4]?.kind === 'field' && row.path[4].value === 'headline');
  if (selected.length === 0) throw new Error('persisted headline scalar set is empty');
  const rows = selected.map((row, index) => {
    if (!Number.isSafeInteger(row.rootOrdinal) || row.rootOrdinal < 0 || !Number.isSafeInteger(row.path[1].value) || row.path[1].value < 0 || !Number.isSafeInteger(row.path[3].value) || row.path[3].value < 0) throw new Error(`malformed persisted headline row ${index}: ${JSON.stringify(row)}`);
    nonblank(row.value, `persisted headline row ${index}.value`);
    return { rootOrdinal: row.rootOrdinal, pulseIndex: row.path[1].value, field: row.path[2].value, outcomeIndex: row.path[3].value, headline: row.value };
  }).sort(compareRaw);
  const roots = [...new Set(rows.map((row) => row.rootOrdinal))]; const pulses = [...new Set(rows.map((row) => row.pulseIndex))].sort((a, b) => a - b);
  if (roots.length !== 1 || !same(pulses, [...Array(CORPUS.pulseRoots).keys()])) throw new Error(`persisted headline roots/pulses drifted: roots=${JSON.stringify(roots)} pulses=${JSON.stringify(pulses)}`);
  for (const field of Object.keys(LANES)) for (const pulse of pulses) {
    const indexes = rows.filter((row) => row.field === field && row.pulseIndex === pulse).map((row) => row.outcomeIndex);
    if (indexes.length > LANES[field] || !same(indexes, [...Array(indexes.length).keys()])) throw new Error(`${field} pulse ${pulse} violates contiguity or cap ${LANES[field]}`);
  }
  return validateRawRows(rows);
}

function validateRegistry(registry) {
  if (!Array.isArray(registry) || registry.length === 0) throw new Error('headline rewrite registry must be a nonempty array');
  const seen = new Map();
  return registry.map((entry, index) => {
    if (!Array.isArray(entry) || entry.length !== 2 || !(entry[0] instanceof RegExp)) throw new Error(`headline rewrite ${index} must be [RegExp, string]`);
    const [pattern, replacement] = entry; nonblank(replacement, `headline rewrite ${index} replacement`, true);
    if (pattern.flags !== '') throw new Error(`headline rewrite ${index} flags must be empty`);
    const sourceKey = `${pattern.source}|${pattern.flags}`; if (seen.has(sourceKey)) throw new Error(`duplicate or conflicting headline rewrite source ${sourceKey}: ${seen.get(sourceKey)} / ${replacement}`);
    seen.set(sourceKey, replacement); return { pattern, source: pattern.source, flags: pattern.flags, replacement, values: new Set(), occurrences: 0 };
  });
}

export function rawHeadlineLivenessOf(rawRows) {
  const rows = validateRawRows(rawRows); const metrics = (subset) => {
    const prospective = subset.filter((row) => /\bmay\b/.test(row.headline)); const indicative = subset.filter((row) => !/\bmay\b/.test(row.headline));
    return { headlineOccurrences: subset.length, distinctValues: new Set(subset.map((row) => row.headline)).size, prospectiveOccurrences: prospective.length, prospectiveDistinctValues: new Set(prospective.map((row) => row.headline)).size, indicativeOccurrences: indicative.length, indicativeDistinctValues: new Set(indicative.map((row) => row.headline)).size };
  };
  return { pulseRecords: new Set(rows.map((row) => row.pulseIndex)).size, lanes: Object.keys(LANES).map((field) => ({ field, capPerPulse: LANES[field], ...metrics(rows.filter((row) => row.field === field)) })), union: metrics(rows) };
}

export function analyzeHeadlineRewriteLiveness(rawRows, registry) {
  const rows = validateRawRows(rawRows); const rules = validateRegistry(registry); const gaps = []; const overlaps = []; const indicativeMatches = [];
  for (const row of rows) {
    const matches = rules.filter((rule) => rule.pattern.test(row.headline)); const location = `${row.pulseIndex}/${row.field}/${row.outcomeIndex}`;
    if (!/\bmay\b/.test(row.headline)) { if (matches.length) indicativeMatches.push({ location, headline: row.headline, matches: matches.map(rewriteIdentity) }); continue; }
    if (matches.length === 0) gaps.push({ location, headline: row.headline }); if (matches.length > 1) overlaps.push({ location, headline: row.headline, matches: matches.map(rewriteIdentity) });
    if (matches.length === 1) { matches[0].values.add(row.headline); matches[0].occurrences += 1; }
  }
  const measured = rules.map((rule) => ({ source: rule.source, flags: rule.flags, replacement: rule.replacement, distinctValues: rule.values.size, occurrences: rule.occurrences }))
    .sort((left, right) => codepoint(rewriteIdentity(left), rewriteIdentity(right))); const activeRules = measured.filter((row) => row.occurrences > 0).length;
  return { rows: validateRewriteRows(measured), totals: { rules: measured.length, activeRules, inertRules: measured.length - activeRules, distinctValues: measured.reduce((sum, row) => sum + row.distinctValues, 0), occurrences: measured.reduce((sum, row) => sum + row.occurrences, 0) }, gaps, overlaps, indicativeMatches };
}

export function measureHeadlineRewriteLiveness(rawRows, registry) {
  const result = analyzeHeadlineRewriteLiveness(rawRows, registry); const failures = [...result.gaps.map((row) => `uncovered ${row.location}: ${row.headline}`), ...result.overlaps.map((row) => `overlap ${row.location}: ${row.headline}`), ...result.indicativeMatches.map((row) => `indicative match ${row.location}: ${row.headline}`)];
  if (failures.length) throw new Error(`headline rewrite liveness failed:\n${failures.join('\n')}`); return result;
}

const addressTotalsOf = (rows) => ({ homes: new Set(rows.map((row) => row.home)).size, fields: new Set(rows.map((row) => row.field)).size, identities: rows.length, prospectiveIdentities: rows.filter((row) => row.voiceClass === 'prospective').length, indicativeIdentities: rows.filter((row) => row.voiceClass === 'indicative').length, distinctValues: rows.reduce((sum, row) => sum + row.distinctValues, 0), occurrences: rows.reduce((sum, row) => sum + row.occurrences, 0) });
export function validateNewsHeadlineBaseline(value) {
  exactKeys(value, ['schemaVersion', 'corpus', 'addressTotality', 'rewriteLiveness'], 'baseline'); if (value.schemaVersion !== 1) throw new Error('baseline.schemaVersion must equal 1');
  exactKeys(value.corpus, Object.keys(CORPUS), 'baseline.corpus'); if (!same(value.corpus, CORPUS) || value.corpus.introductions - value.corpus.retirements !== value.corpus.finalEntries) throw new Error('baseline corpus drifted or failed conservation');
  exactKeys(value.addressTotality, ['rows', 'rowsSha256', 'totals'], 'baseline.addressTotality'); const addresses = validateAddressRows(value.addressTotality.rows, 'baseline.addressTotality.rows'); nonblank(value.addressTotality.rowsSha256, 'baseline.addressTotality.rowsSha256', true);
  if (value.addressTotality.rowsSha256 !== addressRowsSha256(addresses) || !same(value.addressTotality.totals, ADDRESS_TOTALS) || !same(addressTotalsOf(addresses), ADDRESS_TOTALS)) throw new Error('baseline address digest or totals drifted');
  exactKeys(value.rewriteLiveness, ['raw', 'rows', 'totals', 'knownInert'], 'baseline.rewriteLiveness'); if (!same(value.rewriteLiveness.raw, RAW_LIVENESS)) throw new Error('baseline raw liveness denominator drifted');
  const rewrites = validateRewriteRows(value.rewriteLiveness.rows, 'baseline.rewriteLiveness.rows'); const activeRules = rewrites.filter((row) => row.occurrences > 0).length; const totals = { rules: rewrites.length, activeRules, inertRules: rewrites.length - activeRules, distinctValues: rewrites.reduce((sum, row) => sum + row.distinctValues, 0), occurrences: rewrites.reduce((sum, row) => sum + row.occurrences, 0) };
  if (!same(value.rewriteLiveness.totals, REWRITE_TOTALS) || !same(totals, REWRITE_TOTALS)) throw new Error('baseline rewrite totals drifted'); const inert = validateInertRows(value.rewriteLiveness.knownInert, 'baseline.rewriteLiveness.knownInert');
  if (!same(inert, KNOWN_INERT_HEADLINE_REWRITES) || !same(inert.map(rewriteIdentity), rewrites.filter((row) => row.occurrences === 0).map(rewriteIdentity))) throw new Error('known-inert reasons disagree with zero-count rewrite identities'); return value;
}

function compareRows(liveRows, frozenRows, validate, identityOf, label) {
  const live = validate(liveRows, `live ${label}`); const frozen = validate(frozenRows, `frozen ${label}`); const left = new Map(live.map((row) => [identityOf(row), row])); const right = new Map(frozen.map((row) => [identityOf(row), row])); const failures = [];
  for (const id of new Set([...left.keys(), ...right.keys()])) if (!right.has(id)) failures.push(`new ${label} ${id}: ${JSON.stringify(left.get(id))}`); else if (!left.has(id)) failures.push(`vanished ${label} ${id}: ${JSON.stringify(right.get(id))}`); else if (!same(left.get(id), right.get(id))) failures.push(`changed ${label} ${id}: live=${JSON.stringify(left.get(id))} frozen=${JSON.stringify(right.get(id))}`);
  if (failures.length) throw new Error(`${label} moved:\n${failures.sort(codepoint).join('\n')}`); return true;
}
export const compareNewsAddressRows = (live, frozen) => compareRows(live, frozen, validateAddressRows, addressIdentity, 'address row');
export const compareHeadlineRewriteRows = (live, frozen) => compareRows(live, frozen, validateRewriteRows, rewriteIdentity, 'rewrite row');

const ROW_KEYS = Object.freeze([
  'home', 'field', 'expectedVoiceClass', 'observedVoiceClass', 'distinctValues', 'occurrences',
]);
const TOTAL_KEYS = Object.freeze(['identities', 'distinctValues', 'occurrences']);
const CORPUS = Object.freeze({
  pulseRoots: 12, introductions: 272, retirements: 32, finalEntries: 240, homes: 53,
});

export const NEWS_VOICE_PROTECTED_SUBSTRATE = Object.freeze([
  'scripts/lib/observed-shape-corpus.mjs',
  'scripts/lib/news-voice-contract.mjs',
  'src/domain/region/wizardNews.js',
  'src/domain/worldPulse/applyWorldPulse.js',
  'src/domain/worldPulse/npcAgency.js',
  'src/domain/worldPulse/pulseKernel.js',
  'src/domain/worldPulse/worldPulseFeedCuration.js',
  'tests/lint/.news-voice-baseline.json',
]);

export const NEWS_VOICE_RETRO_ROWS = Object.freeze([
  { home: 'applied|npc_bargain', field: 'summary', expectedVoiceClass: 'indicative', observedVoiceClass: 'prospective', distinctValues: 5, occurrences: 5 },
  { home: 'applied|npc_exploit', field: 'summary', expectedVoiceClass: 'indicative', observedVoiceClass: 'prospective', distinctValues: 3, occurrences: 3 },
  { home: 'applied|npc_expose', field: 'summary', expectedVoiceClass: 'indicative', observedVoiceClass: 'prospective', distinctValues: 1, occurrences: 1 },
  { home: 'applied|npc_mobilize', field: 'summary', expectedVoiceClass: 'indicative', observedVoiceClass: 'prospective', distinctValues: 5, occurrences: 5 },
  { home: 'applied|npc_protect', field: 'summary', expectedVoiceClass: 'indicative', observedVoiceClass: 'prospective', distinctValues: 8, occurrences: 8 },
  { home: 'applied|npc_reform', field: 'summary', expectedVoiceClass: 'indicative', observedVoiceClass: 'prospective', distinctValues: 21, occurrences: 23 },
  { home: 'applied|npc_suppress', field: 'summary', expectedVoiceClass: 'indicative', observedVoiceClass: 'prospective', distinctValues: 5, occurrences: 8 },
].map((row) => Object.freeze(row)));

export const NEWS_VOICE_ADDRESSES = Object.freeze(
  NEWS_VOICE_RETRO_ROWS.map((row) => row.home),
);

const ADDRESS_SET = new Set(NEWS_VOICE_ADDRESSES);
const codepoint = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const exactKeys = (value, keys, label) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || JSON.stringify(Object.keys(value).sort(codepoint)) !== JSON.stringify([...keys].sort(codepoint))) {
    throw new Error(`${label} must have exactly keys ${keys.join(', ')}`);
  }
  return value;
};
const safeCount = (value, label) => {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${label} must be a non-negative safe integer`);
  return value;
};
const identityOf = (row) => `${row.home}|${row.field}|${row.observedVoiceClass}`;
const totalsOf = (rows) => ({
  identities: rows.length,
  distinctValues: rows.reduce((sum, row) => sum + row.distinctValues, 0),
  occurrences: rows.reduce((sum, row) => sum + row.occurrences, 0),
});
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

function leafKey(path) {
  if (!Array.isArray(path) || path.length === 0) throw new Error('entry scalar leaf has an empty relative path');
  return JSON.stringify(path.map((segment) => {
    if (segment?.kind === 'field' && typeof segment.value === 'string' && segment.value) return ['field', segment.value];
    if (segment?.kind === 'index' && Number.isSafeInteger(segment.value) && segment.value >= 0) return ['index', segment.value];
    throw new Error(`entry scalar leaf has a malformed typed path: ${JSON.stringify(path)}`);
  }));
}

function entryOf(rows, rootOrdinal, sourceIndex) {
  const leaves = rows.map((row) => [leafKey(row.path.slice(3)), row.value])
    .sort((left, right) => codepoint(left[0], right[0]));
  if (new Set(leaves.map(([path]) => path)).size !== leaves.length) {
    throw new Error(`duplicate scalar leaf at pulse ${rootOrdinal} entry ${sourceIndex}`);
  }
  const fields = Object.fromEntries(leaves.filter(([path]) => JSON.parse(path).length === 1)
    .map(([path, value]) => [JSON.parse(path)[0][1], value]));
  for (const field of ['kind', 'impactKind', 'headline', 'summary']) {
    if (!Object.hasOwn(fields, field)) throw new Error(`pulse ${rootOrdinal} entry ${sourceIndex} is missing ${field}`);
  }
  return { rootOrdinal, sourceIndex, signature: JSON.stringify(leaves), fields, leaves };
}

export function introducedDeltaOf(previousEntries, currentEntries) {
  const counts = (entries) => {
    const out = new Map();
    for (const entry of entries) {
      if (typeof entry?.signature !== 'string' || !entry.signature
          || !Number.isSafeInteger(entry.sourceIndex) || entry.sourceIndex < 0) {
        throw new Error('snapshot entry must carry a nonblank signature and non-negative sourceIndex');
      }
      out.set(entry.signature, (out.get(entry.signature) || 0) + 1);
    }
    return out;
  };
  const previous = counts(previousEntries);
  const current = counts(currentEntries);
  let retirements = 0;
  const introductions = [];
  for (const signature of new Set([...previous.keys(), ...current.keys()])) {
    const delta = (current.get(signature) || 0) - (previous.get(signature) || 0);
    if (delta < 0) retirements += -delta;
    if (delta > 0) introductions.push(...currentEntries.filter((entry) => entry.signature === signature)
      .sort((left, right) => left.sourceIndex - right.sourceIndex).slice(0, delta));
  }
  return { introductions, retirements };
}

export function reconstructWizardNewsIntroductions(scalarRows) {
  if (!Array.isArray(scalarRows)) throw new Error('scalar observations must be an array');
  const selected = scalarRows.filter((row) => row?.root === 'pulseResult'
    && row.path?.[0]?.kind === 'field' && row.path[0].value === 'wizardNews'
    && row.path?.[1]?.kind === 'field' && row.path[1].value === 'entries');
  if (selected.length === 0) throw new Error('Wizard News pulse-root scalar set is empty');
  const grouped = new Map();
  for (const row of selected) {
    if (!Number.isSafeInteger(row.rootOrdinal) || row.rootOrdinal < 0
        || row.path?.[2]?.kind !== 'index' || !Number.isSafeInteger(row.path[2].value)
        || row.path[2].value < 0) throw new Error(`malformed Wizard News scalar row: ${JSON.stringify(row)}`);
    const key = `${row.rootOrdinal}|${row.path[2].value}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }
  const rootOrdinals = [...new Set(selected.map((row) => row.rootOrdinal))].sort((a, b) => a - b);
  if (!same(rootOrdinals, [...Array(CORPUS.pulseRoots).keys()])) {
    throw new Error(`Wizard News pulse roots drifted: ${JSON.stringify(rootOrdinals)}`);
  }
  const snapshots = rootOrdinals.map((rootOrdinal) => {
    const entries = [...grouped.entries()].filter(([key]) => key.startsWith(`${rootOrdinal}|`))
      .map(([key, rows]) => entryOf(rows, rootOrdinal, Number(key.split('|')[1])))
      .sort((left, right) => left.sourceIndex - right.sourceIndex);
    if (!same(entries.map((entry) => entry.sourceIndex), [...Array(entries.length).keys()])) {
      throw new Error(`pulse ${rootOrdinal} entry indexes are not contiguous`);
    }
    return entries;
  });
  let previous = [];
  let retirements = 0;
  const introductions = [];
  for (const entries of snapshots) {
    const delta = introducedDeltaOf(previous, entries);
    introductions.push(...delta.introductions);
    retirements += delta.retirements;
    previous = entries;
  }
  introductions.sort((left, right) => left.rootOrdinal - right.rootOrdinal
    || left.sourceIndex - right.sourceIndex || codepoint(left.signature, right.signature));
  const finalEntries = previous.length;
  const homes = new Set(introductions.map(({ fields }) => `${fields.kind}|${fields.impactKind}`)).size;
  const result = { pulseRoots: snapshots.length, introductions: introductions.length, retirements, finalEntries, homes, entries: introductions };
  for (const [key, expected] of Object.entries(CORPUS)) {
    if (result[key] !== expected) throw new Error(`Wizard News ${key} drifted: expected ${expected}, got ${result[key]}`);
  }
  if (result.introductions - result.retirements !== result.finalEntries) throw new Error('Wizard News snapshot conservation failed');
  return result;
}

export function voiceClassOf(summary) {
  if (typeof summary !== 'string' || summary.trim() === '') throw new Error('owned summary must be a nonblank string');
  return /\bcan advance through\b/.test(summary) ? 'prospective' : 'indicative';
}

export function measureNewsVoiceDebt(entries) {
  if (!Array.isArray(entries)) throw new Error('introduced entries must be an array');
  const buckets = new Map();
  for (const { fields = {} } of entries) {
    const home = `${fields.kind}|${fields.impactKind}`;
    if (!ADDRESS_SET.has(home)) continue;
    const observedVoiceClass = voiceClassOf(fields.summary);
    if (observedVoiceClass === 'indicative') continue;
    const id = `${home}|summary|${observedVoiceClass}`;
    if (!buckets.has(id)) buckets.set(id, { home, field: 'summary', expectedVoiceClass: 'indicative', observedVoiceClass, values: new Set(), occurrences: 0 });
    const bucket = buckets.get(id);
    bucket.values.add(fields.summary);
    bucket.occurrences += 1;
  }
  return [...buckets.values()].map(({ values, ...row }) => ({ ...row, distinctValues: values.size }))
    .sort((left, right) => codepoint(identityOf(left), identityOf(right)));
}

function validateRows(rows, label) {
  if (!Array.isArray(rows)) throw new Error(`${label} must be an array`);
  let previous = null;
  return rows.map((raw, index) => {
    const row = exactKeys(raw, ROW_KEYS, `${label}[${index}]`);
    for (const key of ROW_KEYS.slice(0, 4)) {
      if (typeof row[key] !== 'string' || row[key] !== row[key].trim() || !row[key]) throw new Error(`${label}[${index}].${key} must be a nonblank trimmed string`);
    }
    safeCount(row.distinctValues, `${label}[${index}].distinctValues`);
    safeCount(row.occurrences, `${label}[${index}].occurrences`);
    const identity = identityOf(row);
    if (previous !== null && codepoint(previous, identity) >= 0) throw new Error(`${label} identities must be unique and codepoint-sorted: ${identity}`);
    previous = identity;
    return row;
  });
}

export function validateNewsVoiceBaseline(value) {
  exactKeys(value, ['schemaVersion', 'corpus', 'retroDetection', 'current'], 'baseline');
  if (value.schemaVersion !== 1) throw new Error('baseline.schemaVersion must equal 1');
  exactKeys(value.corpus, Object.keys(CORPUS), 'baseline.corpus');
  for (const [key, expected] of Object.entries(CORPUS)) if (value.corpus[key] !== expected) throw new Error(`baseline.corpus.${key} must equal ${expected}`);
  if (value.corpus.introductions - value.corpus.retirements !== value.corpus.finalEntries) throw new Error('baseline corpus conservation failed');
  const validateSection = (section, rowsKey, label) => {
    exactKeys(section, [rowsKey, 'totals'], label);
    const rows = validateRows(section[rowsKey], `${label}.${rowsKey}`);
    exactKeys(section.totals, TOTAL_KEYS, `${label}.totals`);
    for (const key of TOTAL_KEYS) safeCount(section.totals[key], `${label}.totals.${key}`);
    if (!same(section.totals, totalsOf(rows))) throw new Error(`${label}.totals disagree with rows`);
    return rows;
  };
  const retro = validateSection(value.retroDetection, 'rows', 'baseline.retroDetection');
  if (!same(retro, NEWS_VOICE_RETRO_ROWS)) throw new Error('baseline.retroDetection.rows moved from the immutable seven-row denominator');
  const current = validateSection(value.current, 'outstanding', 'baseline.current');
  const retroById = new Map(retro.map((row) => [identityOf(row), row]));
  for (const row of current) if (!same(row, retroById.get(identityOf(row)))) throw new Error(`current debt is not an exact retro subset: ${identityOf(row)}`);
  return value;
}

export function compareNewsVoiceDebt(liveRows, expectedRows) {
  const live = validateRows(liveRows, 'live debt');
  const expected = validateRows(expectedRows, 'expected debt');
  const liveById = new Map(live.map((row) => [identityOf(row), row]));
  const expectedById = new Map(expected.map((row) => [identityOf(row), row]));
  const failures = [];
  for (const id of new Set([...liveById.keys(), ...expectedById.keys()])) {
    const actual = liveById.get(id); const frozen = expectedById.get(id);
    if (!frozen) failures.push(`new identity ${id}: live=${JSON.stringify(actual)} expected=missing`);
    else if (!actual) failures.push(`vanished identity ${id}: live=missing expected=${JSON.stringify(frozen)}`);
    else if (!same(actual, frozen)) {
      for (const key of ROW_KEYS) if (actual[key] !== frozen[key]) failures.push(`${['distinctValues', 'occurrences'].includes(key) ? (actual[key] > frozen[key] ? 'grown' : 'shrunk') : 'changed'} ${id}.${key}: live=${JSON.stringify(actual[key])} expected=${JSON.stringify(frozen[key])}`);
    }
  }
  if (failures.length) throw new Error(`news voice debt moved:\n${failures.sort(codepoint).join('\n')}`);
  return true;
}

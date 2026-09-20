/**
 * p6-onrecord-counts.mjs — THE CHAIR'S Q-5: `onRecord` is measured over the SAMPLE like
 * everything else. One execution fills every Tier-1 field: stepDraws, keyMoves, and the
 * per-row onRecord COUNTS {absent, same, transformed} with a derived label that is one of the
 * three when unanimous and 'varies' otherwise.
 *
 * It ALSO measures, at no extra cost, the POST-STEP comparand (what THIS step produced, vs the
 * record) beside the FINAL-CONTEXT comparand (the recon's own ladder), so the chair can see
 * how many rows would differ if the register asked the other question. Nothing is switched.
 */
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

globalThis.__EMP2_MINTS__ = null; globalThis.__EMP2_HASH__ = null; globalThis.__EMP2_FNV__ = null;

const { TREE, getStepMeta, getStepOrder, instrumentedRoot, runHeadless } = await import('./harness.mjs');
const { goldenCorpus, keyOf } = await import(`${TREE}/tests/helpers/goldenMasterCorpus.js`);

const order = getStepOrder();
const meta = new Map(getStepMeta().map((m) => [m.name, m]));
const ser = (v) => { try { const s = JSON.stringify(v); return s === undefined ? ' undefined' : s; } catch { return String(v); } };
const h = (v) => createHash('sha1').update(ser(v)).digest('hex').slice(0, 16);
const hs = (s) => createHash('sha1').update(s).digest('hex').slice(0, 16);

function structuredMin(all) {
  const tail = all.slice(504);
  const oneEach = []; const seen = new Set();
  for (const r of all.slice(0, 504)) {
    const k = `${r.settType}|${r.terrainOverride}`;
    if (seen.has(k)) continue; seen.add(k); oneEach.push(r);
  }
  return [...oneEach, ...tail];
}
const ALL = goldenCorpus();
const SAMPLE = structuredMin(ALL);
const OBJECTS_ONLY = process.env.EMP2_OBJECTS_ONLY === '1';
console.log(`### value-hash index admits ${OBJECTS_ONLY ? 'OBJECTS/ARRAYS ONLY' : 'any serialisation >= 12 bytes (the recon\u2019s literal rule)'}`);

/** One walk of the record per row: value-hash index and first-occurrence name index, depth <= 4. */
function buildIndex(record) {
  const byHash = new Map(); const byName = new Map();
  const visit = (node, path, depth) => {
    if (depth > 4 || node === null || typeof node !== 'object') return;
    for (const [k, v] of Object.entries(node)) {
      const p = `${path}.${k}`;
      if (!byName.has(k)) byName.set(k, p);
      // ⛔ THE RECON'S STATED INTENT was "serialisations >= 12 bytes only, SO A SCALAR CANNOT
      // MATCH BY COINCIDENCE". A byte floor does not deliver it: 'crossroads' and
      // 'mountain_pass' serialise to 12 and 15 bytes, so a long enum string DOES match a
      // coincidental sibling. OBJECTS-ONLY implements the stated intent exactly.
      const structural = v !== null && typeof v === 'object';
      const s = ser(v);
      const admit = OBJECTS_ONLY ? (structural && s.length >= 12) : (s.length >= 12);
      if (admit) { const key = hs(s); if (!byHash.has(key)) byHash.set(key, p); }
      visit(v, p, depth + 1);
    }
  };
  visit(record, 'record', 0);
  return { byHash, byName };
}

/** The recon's ladder, against a pre-built index. Returns { onRecord, recordPath }. */
function verdict(index, record, key, valueHash, valueBytes, valueStructural) {
  if (key === 'settlement') return { onRecord: 'same', recordPath: 'record' };
  if (Object.prototype.hasOwnProperty.call(record, key)) {
    return h(record[key]) === valueHash
      ? { onRecord: 'same', recordPath: `record.${key}` }
      : { onRecord: 'transformed', recordPath: `record.${key}` };
  }
  if (valueBytes >= 12 && valueStructural) {
    const found = index.byHash.get(valueHash);
    if (found) return { onRecord: 'same', recordPath: found };
  }
  const named = index.byName.get(key);
  if (named) return { onRecord: 'transformed', recordPath: named };
  return { onRecord: 'absent', recordPath: null };
}

const PAIRS = [];
for (const name of order) {
  const m = meta.get(name);
  const seen = new Set();
  for (const k of m.provides) { PAIRS.push({ step: name, key: k, via: 'provides' }); seen.add(k); }
  for (const k of m.mutates) if (!seen.has(k)) PAIRS.push({ step: name, key: k, via: 'mutates' });
}
const rec = new Map(PAIRS.map((p) => [`${p.step}|${p.key}`, {
  ...p, moved: 0, run: 0,
  fin: { absent: 0, same: 0, transformed: 0 }, finPaths: new Map(),
  post: { absent: 0, same: 0, transformed: 0 }, postPaths: new Map(), pathDiff: 0, pathDiffEg: [],
}]));
const stepDrew = new Map(order.map((n) => [n, 0]));

const t0 = Date.now();
for (const row of SAMPLE) {
  const inst = instrumentedRoot(row._seed);
  const postHash = new Map(); const postBytes = new Map(); const postStruct = new Map(); const baseSeen = new Map();
  const ctx = runHeadless(row, inst.root, {
    onStep: (name, c) => {
      const m = meta.get(name);
      const bag = {};
      for (const k of new Set([...m.provides, ...m.mutates])) {
        const present = k in c;
        bag[k] = present ? h(c[k]) : ' ABSENT';
        if (present) { postHash.set(`${name}|${k}`, h(c[k])); postBytes.set(`${name}|${k}`, ser(c[k]).length); postStruct.set(`${name}|${k}`, c[k] !== null && typeof c[k] === 'object'); }
      }
      baseSeen.set(name, bag);
    },
  });
  for (const n of order) if ((inst.perStep.get(n)?.draws || 0) > 0) stepDrew.set(n, stepDrew.get(n) + 1);

  const record = ctx.settlement;
  const index = buildIndex(record);
  for (const p of PAIRS) {
    const id = `${p.step}|${p.key}`; const r = rec.get(id);
    // FINAL-CONTEXT comparand — the recon's ladder, the register's field.
    const fv = p.key in ctx ? { hash: h(ctx[p.key]), bytes: ser(ctx[p.key]).length, st: ctx[p.key] !== null && typeof ctx[p.key] === 'object' } : null;
    const f = fv ? verdict(index, record, p.key, fv.hash, fv.bytes, OBJECTS_ONLY ? fv.st : true) : { onRecord: 'absent', recordPath: null };
    r.fin[f.onRecord] += 1;
    if (f.recordPath) r.finPaths.set(f.recordPath, (r.finPaths.get(f.recordPath) || 0) + 1);
    // POST-STEP comparand — what THIS step produced, measured but NOT switched to.
    const ph = postHash.get(id);
    const pd = ph === undefined ? { onRecord: 'absent', recordPath: null } : verdict(index, record, p.key, ph, postBytes.get(id), OBJECTS_ONLY ? postStruct.get(id) : true);
    r.post[pd.onRecord] += 1;
    if (pd.recordPath) r.postPaths.set(pd.recordPath, (r.postPaths.get(pd.recordPath) || 0) + 1);
    // Does the POST-STEP value LAND somewhere different from where the FINAL value lands?
    // Only a row where BOTH land counts: a null is not a landing, it is an absence the
    // producedOnRecord triple already reports.
    if (f.recordPath && pd.recordPath && f.recordPath !== pd.recordPath) {
      r.pathDiff += 1;
      if (r.pathDiffEg.length < 2) r.pathDiffEg.push(`${keyOf(row)} final=${f.recordPath} post=${pd.recordPath}`);
    }
  }

  for (const name of order) {
    const per = instrumentedRoot(row._seed, { perturbStep: name });
    const perSeen = new Map();
    runHeadless(row, per.root, {
      onStep: (n2, c) => {
        if (n2 !== name) return;
        const m = meta.get(n2);
        const bag = {};
        for (const k of new Set([...m.provides, ...m.mutates])) bag[k] = k in c ? h(c[k]) : ' ABSENT';
        perSeen.set(n2, bag);
      },
    });
    const m = meta.get(name);
    for (const k of new Set([...m.provides, ...m.mutates])) {
      const r = rec.get(`${name}|${k}`);
      r.run += 1;
      if (baseSeen.get(name)[k] !== perSeen.get(name)[k]) r.moved += 1;
    }
  }
}
const wall = Date.now() - t0;
const ROWS = SAMPLE.length;

const labelOf = (c) => (c.absent === ROWS ? 'absent' : c.same === ROWS ? 'same' : c.transformed === ROWS ? 'transformed' : 'varies');
const classOf = (d, m) => (m === 0 ? 'pure' : (d > 0 ? 'drawn' : 'label'));
const pathOf = (paths) => {
  if (paths.size === 0) return { path: null, unanimous: true };
  if (paths.size === 1) return { path: [...paths.keys()][0], unanimous: true };
  return { path: [...paths.entries()].sort((a, b) => b[1] - a[1])[0][0], unanimous: false };
};

console.log(`ROWS=${ROWS} wall=${wall} ms per-row=${(wall / ROWS).toFixed(1)} ms`);
console.log(`\n=== EVERY ROW WHOSE onRecord IS 'varies' (final-context comparand) ===`);
let variesCount = 0; let pathSplit = 0;
for (const p of PAIRS) {
  const r = rec.get(`${p.step}|${p.key}`);
  const lab = labelOf(r.fin);
  if (lab === 'varies') {
    variesCount += 1;
    console.log(`  ${p.step}|${p.key}\tabsent=${r.fin.absent} same=${r.fin.same} transformed=${r.fin.transformed}\tpaths=[${[...r.finPaths.entries()].map(([k, v]) => `${k}x${v}`).join(' , ')}]`);
  }
  if (pathOf(r.finPaths).unanimous === false) pathSplit += 1;
}
console.log(`varies rows = ${variesCount} of ${PAIRS.length}; rows whose non-absent recordPath is NOT unanimous = ${pathSplit}`);

const tally = { absent: 0, same: 0, transformed: 0, varies: 0 };
for (const p of PAIRS) tally[labelOf(rec.get(`${p.step}|${p.key}`).fin)] += 1;
console.log(`label tally (final-context): ${JSON.stringify(tally)}`);

console.log(`\n=== THE OTHER COMPARAND, measured not switched: post-step vs final-context ===`);
let differ = 0; const differRows = [];
for (const p of PAIRS) {
  const r = rec.get(`${p.step}|${p.key}`);
  if (labelOf(r.fin) !== labelOf(r.post)) { differ += 1; differRows.push(`${p.step}|${p.key}: final=${labelOf(r.fin)} post=${labelOf(r.post)}`); }
}
console.log(`rows whose LABEL differs between the two comparands = ${differ} of ${PAIRS.length}`);
for (const d of differRows) console.log(`  ${d}`);

console.log(`\n=== DOES THE POST-STEP VALUE EVER LAND AT A DIFFERENT PATH THAN THE FINAL ONE? ===`);
let anyPathDiff = 0;
for (const p of PAIRS) {
  const r = rec.get(`${p.step}|${p.key}`);
  if (r.pathDiff > 0) { anyPathDiff += 1; console.log(`  ${p.step}|${p.key}: ${r.pathDiff}/${ROWS} rows  eg ${r.pathDiffEg[0]}`); }
}
console.log(`rows with ANY differing landing path (both non-null) = ${anyPathDiff} of ${PAIRS.length}`);
console.log(`=> a separate producedPath field is ${anyPathDiff === 0 ? 'NOT NEEDED' : 'REQUIRED'}`);

const ptally = { absent: 0, same: 0, transformed: 0, varies: 0 };
for (const p of PAIRS) ptally[labelOf(rec.get(`${p.step}|${p.key}`).post)] += 1;
console.log(`producedOnRecordClass tally: ${JSON.stringify(ptally)}`);

// ── class counts ────────────────────────────────────────────────────────────
const cls = { drawn: 0, pure: 0, label: 0 };
for (const p of PAIRS) cls[classOf(stepDrew.get(p.step), rec.get(`${p.step}|${p.key}`).moved)] += 1;
console.log(`\nclass tally: ${JSON.stringify(cls)}  (steps that draw = ${order.filter((n) => stepDrew.get(n) > 0).length})`);

// ── emit the leaf with the RULED shape ──────────────────────────────────────
const S = (v) => (v === null ? 'null' : `'${v}'`);
const t1 = PAIRS.map((p) => {
  const r = rec.get(`${p.step}|${p.key}`);
  const lab = labelOf(r.fin);
  const { path } = pathOf(r.finPaths);
  const rp = lab === 'absent' ? null : path;
  return `  { step: '${p.step}', key: '${p.key}', via: '${p.via}', stepDraws: ${stepDrew.get(p.step)}, keyMoves: ${r.moved}, rows: ${ROWS}, class: '${classOf(stepDrew.get(p.step), r.moved)}', onRecord: { absent: ${r.fin.absent}, same: ${r.fin.same}, transformed: ${r.fin.transformed} }, onRecordClass: '${lab}', producedOnRecord: { absent: ${r.post.absent}, same: ${r.post.same}, transformed: ${r.post.transformed} }, producedOnRecordClass: '${labelOf(r.post)}', recordPath: ${S(rp)} },`;
});
const TIER2 = [
  ['institution', 'institutions[].name', 'assembleInstitutions', 'institutions', 'src/generators/steps/assembleInstitutions.js', 'assembleInstitutions', 'drawn'],
  ['institution', 'institutions[].category', 'assembleInstitutions', 'institutions', 'src/generators/steps/assembleInstitutions.js', 'assembleInstitutions', 'drawn'],
  ['npc', 'npcs[].name', 'generatePopulation', 'npcs', 'src/generators/steps/generatePopulation.js', 'generatePopulation', 'drawn'],
  ['npc', 'npcs[].role', 'generatePopulation', 'npcs', 'src/generators/steps/generatePopulation.js', 'generatePopulation', 'drawn'],
  ['npc', 'npcs[].status', 'generatePopulation', 'npcs', 'src/generators/steps/generatePopulation.js', 'generatePopulation', 'drawn'],
  ['faction', 'powerStructure.factions[].faction', 'generatePower', 'powerStructure', 'src/generators/steps/generatePower.js', 'generatePower', 'computed'],
  ['faction', 'powerStructure.factions[].category', 'generatePower', 'powerStructure', 'src/generators/steps/generatePower.js', 'generatePower', 'computed'],
  ['faction', 'powerStructure.factions[].power', 'generatePower', 'powerStructure', 'src/generators/steps/generatePower.js', 'generatePower', 'computed'],
  ['powerSeat', 'powerStructure.governingName', 'generatePower', 'powerStructure', 'src/generators/steps/generatePower.js', 'generatePower', 'computed'],
  ['powerSeat', 'powerStructure.factions[].isGoverning', 'generatePower', 'powerStructure', 'src/generators/steps/generatePower.js', 'generatePower', 'computed'],
];
const t2 = TIER2.map(([card, out, fork, key, mod, sym, origin]) => `  { cardShape: '${card}', outputKey: '${out}', forkId: '${fork}', step: '${fork}', key: '${key}', module: '${mod}', symbol: '${sym}', origin: '${origin}' },`);

const FILE = `/**
 * src/domain/generation/generationForkRegistry.js — GENERATION'S CHOSEN FACTS, in two tiers.
 * (header JSDoc — the packet specifies its content; counted as COMMENT by max-lines)
 */
export const GENERATION_CENSUS_ROWS = ${ROWS};

export const GENERATION_TIER1 = Object.freeze([
${t1.join('\n')}
].map(Object.freeze));

export const GENERATION_TIER2 = Object.freeze([
${t2.join('\n')}
].map(Object.freeze));

export const GENERATION_BLIND_HALVES = Object.freeze([
  Object.freeze({ id: 'field-rootness', statement: 'x', refutableBy: 'y' }),
  Object.freeze({ id: 'hash-channel', statement: 'x', refutableBy: 'y' }),
  Object.freeze({ id: 'corpus-ceiling', statement: 'x', refutableBy: 'y' }),
  Object.freeze({ id: 'second-seedrandom-importer', statement: 'x', refutableBy: 'y' }),
]);

export const GENERATION_CHANNELS = Object.freeze({
  mints: Object.freeze({ direct: 4, rootSeedPrefixed: true }),
  hash: Object.freeze({ instrument: 'src/kernel/proseHash.js#pickVariant', fnv1a32External: 6 }),
});

export function tier1For(step, key) {
  return GENERATION_TIER1.find((r) => r.step === step && r.key === key) || null;
}

export function tier2For(cardShape, outputKey) {
  return GENERATION_TIER2.filter((r) => r.cardShape === cardShape && r.outputKey === outputKey);
}
`;
writeFileSync(new URL('./generationForkRegistry.SPEC.js', import.meta.url), FILE);
writeFileSync(new URL('./p6-result.json', import.meta.url), JSON.stringify({
  rows: ROWS, wall, stepDrew: Object.fromEntries(stepDrew),
  dump: PAIRS.map((p) => { const r = rec.get(`${p.step}|${p.key}`); return { ...p, moved: r.moved, run: r.run, fin: r.fin, post: r.post, finPaths: [...r.finPaths.entries()] }; }),
}, null, 2));

function effectiveLines(src) {
  let inBlock = false; let n = 0;
  for (const raw of src.split('\n')) {
    const line = raw.trim();
    if (inBlock) { if (line.includes('*/')) { inBlock = false; if (!line.split('*/')[1]?.trim()) continue; } else continue; }
    if (!line) continue;
    if (line.startsWith('//')) continue;
    if (line.startsWith('/*')) { if (!line.includes('*/')) inBlock = true; continue; }
    n += 1;
  }
  return n;
}
console.log(`\n=== THE LEAF, RE-MEASURED with the ruled onRecord shape and producer STRUCK ===`);
console.log(`Tier 1 rows = ${t1.length}  Tier 2 rows = ${t2.length}`);
console.log(`raw lines = ${FILE.split('\n').length}`);
console.log(`EFFECTIVE lines = ${effectiveLines(FILE)}   <= 250 ? ${effectiveLines(FILE) <= 250}  (split needed? ${effectiveLines(FILE) > 250})`);
console.log(`longest line = ${Math.max(...FILE.split('\n').map((l) => l.length))} chars`);

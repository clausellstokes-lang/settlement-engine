/**
 * p5-emit.mjs — (A) re-measure `onRecord` over three tiers (the recon's M4 ladder, re-executed);
 * (B) EMIT the registry leaf exactly as the packet specifies it; (C) measure its EFFECTIVE LINES
 * under eslint's own max-lines semantics (skipBlankLines + skipComments) so the budget is a
 * measurement, not an estimate.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

globalThis.__EMP2_MINTS__ = null; globalThis.__EMP2_HASH__ = null; globalThis.__EMP2_FNV__ = null;
const { TREE, getStepMeta, getStepOrder, instrumentedRoot, runHeadless } = await import('./harness.mjs');

const order = getStepOrder();
const meta = new Map(getStepMeta().map((m) => [m.name, m]));
const h = (v) => { let s; try { s = JSON.stringify(v); } catch { s = String(v); } if (s === undefined) s = ' u'; return createHash('sha1').update(s).digest('hex').slice(0, 16); };
const bytes = (v) => { try { return JSON.stringify(v)?.length ?? 0; } catch { return 0; } };

// ── (A) onRecord, the recon's ladder re-executed over three tiers ────────────
const TIER_ROWS = [
  { settType: 'village', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized', _seed: 'golden-master-v3' },
  { settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized', _seed: 'golden-master-v3' },
  { settType: 'city', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized', _seed: 'golden-master-v3' },
];

/** Walk the record depth-first; yield [path, value]. */
function* walkRecord(node, path = 'record', depth = 0) {
  if (depth > 4 || node === null || typeof node !== 'object') return;
  for (const [k, v] of Object.entries(node)) {
    yield [`${path}.${k}`, v];
    yield* walkRecord(v, `${path}.${k}`, depth + 1);
  }
}

function verdictFor(ctx, record, key) {
  if (key === 'settlement') return { onRecord: 'same', recordPath: 'record' };
  const want = ctx[key];
  if (Object.prototype.hasOwnProperty.call(record, key)) {
    return h(record[key]) === h(want)
      ? { onRecord: 'same', recordPath: `record.${key}` }
      : { onRecord: 'transformed', recordPath: `record.${key}` };
  }
  const wantHash = h(want);
  const big = bytes(want) >= 12;
  let nameElsewhere = null;
  for (const [p, v] of walkRecord(record)) {
    if (big && h(v) === wantHash) return { onRecord: 'same', recordPath: p };
    if (!nameElsewhere && p.endsWith(`.${key}`)) nameElsewhere = p;
  }
  if (nameElsewhere) return { onRecord: 'transformed', recordPath: nameElsewhere };
  return { onRecord: 'absent', recordPath: null };
}

const ALLKEYS = [...new Set([...meta.values()].flatMap((m) => [...m.provides, ...m.mutates]))];
const perKey = new Map(ALLKEYS.map((k) => [k, []]));
for (const row of TIER_ROWS) {
  const ctx = runHeadless(row, instrumentedRoot(row._seed).root);
  for (const k of ALLKEYS) perKey.get(k).push(verdictFor(ctx, ctx.settlement, k));
}
console.log('=== (A) onRecord, re-executed over village/town/city (TOWN is the register’s column) ===');
console.log('key\tvillage\ttown\tcity\ttier-dependent?\trecordPath (town)');
const onRecordOf = new Map();
for (const k of ALLKEYS) {
  const v = perKey.get(k);
  const dep = new Set(v.map((x) => x.onRecord)).size > 1;
  onRecordOf.set(k, { onRecord: v[1].onRecord, recordPath: v[1].recordPath, tierDependent: dep });
  console.log(`${k}\t${v[0].onRecord}\t${v[1].onRecord}\t${v[2].onRecord}\t${dep ? 'YES' : ''}\t${v[1].recordPath ?? 'null'}`);
}
const absent = ALLKEYS.filter((k) => onRecordOf.get(k).onRecord === 'absent');
const transformed = ALLKEYS.filter((k) => onRecordOf.get(k).onRecord === 'transformed');
console.log(`\ndistinct keys = ${ALLKEYS.length} ; absent = ${absent.length} [${absent.join(', ')}]`);
console.log(`transformed = ${transformed.length} [${transformed.join(', ')}]`);

// ── (B) emit the leaf ────────────────────────────────────────────────────────
const sample = JSON.parse(readFileSync(new URL('./p2-sample-result.json', import.meta.url), 'utf-8'));
const ROWS = sample.rows;
const classOf = (stepDraws, keyMoves) => (keyMoves === 0 ? 'pure' : (stepDraws > 0 ? 'drawn' : 'label'));

const tier1 = sample.dump.map((d) => ({
  step: d.step, key: d.key, via: d.via === 'provides+mutates' ? 'provides' : d.via,
  stepDraws: d.drewIn, keyMoves: d.moved, rows: ROWS,
  class: classOf(d.drewIn, d.moved),
  onRecord: onRecordOf.get(d.key).onRecord,
  recordPath: onRecordOf.get(d.key).recordPath,
}));

const S = (v) => (v === null ? 'null' : `'${v}'`);
const t1lines = tier1.map((r) => `  { step: '${r.step}', key: '${r.key}', via: '${r.via}', stepDraws: ${r.stepDraws}, keyMoves: ${r.keyMoves}, rows: ${r.rows}, class: '${r.class}', onRecord: '${r.onRecord}', recordPath: ${S(r.recordPath)} },`);

const TIER2 = [
  ['institution', 'institutions[].name', 'assembleInstitutions', 'institutions', 'src/generators/steps/assembleInstitutions.js', 'assembleInstitutions', 'drawn', null],
  ['institution', 'institutions[].category', 'assembleInstitutions', 'institutions', 'src/generators/steps/assembleInstitutions.js', 'assembleInstitutions', 'drawn', null],
  ['npc', 'npcs[].name', 'generatePopulation', 'npcs', 'src/generators/steps/generatePopulation.js', 'generatePopulation', 'drawn', 'src/generators/npcGenerator.js#pickFirst'],
  ['npc', 'npcs[].role', 'generatePopulation', 'npcs', 'src/generators/steps/generatePopulation.js', 'generatePopulation', 'drawn', null],
  ['npc', 'npcs[].status', 'generatePopulation', 'npcs', 'src/generators/steps/generatePopulation.js', 'generatePopulation', 'drawn', null],
  ['faction', 'powerStructure.factions[].faction', 'generatePower', 'powerStructure', 'src/generators/steps/generatePower.js', 'generatePower', 'computed', 'src/generators/power/rulingStructure.js#generatePowerStructure'],
  ['faction', 'powerStructure.factions[].category', 'generatePower', 'powerStructure', 'src/generators/steps/generatePower.js', 'generatePower', 'computed', 'src/generators/power/rulingStructure.js#generatePowerStructure'],
  ['faction', 'powerStructure.factions[].power', 'generatePower', 'powerStructure', 'src/generators/steps/generatePower.js', 'generatePower', 'computed', 'src/generators/power/rulingStructure.js#generatePowerStructure'],
  ['powerSeat', 'powerStructure.governingName', 'generatePower', 'powerStructure', 'src/generators/steps/generatePower.js', 'generatePower', 'computed', 'src/generators/power/rulingStructure.js#generatePowerStructure'],
  ['powerSeat', 'powerStructure.factions[].isGoverning', 'generatePower', 'powerStructure', 'src/generators/steps/generatePower.js', 'generatePower', 'computed', 'src/generators/power/rulingStructure.js#generatePowerStructure'],
];
const t2lines = TIER2.map(([card, outKey, forkId, key, mod, sym, origin, producer]) => `  { cardShape: '${card}', outputKey: '${outKey}', forkId: '${forkId}', step: '${forkId}', key: '${key}', module: '${mod}', symbol: '${sym}', origin: '${origin}', producer: ${producer ? `'${producer}'` : 'null'} },`);

const HEADER = `/**
 * src/domain/generation/generationForkRegistry.js — GENERATION'S CHOSEN FACTS, in two tiers.
 * (header JSDoc — the packet specifies its content; counted as COMMENT by max-lines)
 */
`;
const BODY = `export const GENERATION_CENSUS_ROWS = ${ROWS};

export const GENERATION_TIER1 = Object.freeze([
${t1lines.join('\n')}
].map(Object.freeze));

export const GENERATION_TIER2 = Object.freeze([
${t2lines.join('\n')}
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
const FILE = HEADER + BODY;
writeFileSync(new URL('./generationForkRegistry.SPEC.js', import.meta.url), FILE);

/** eslint max-lines semantics: skipBlankLines + skipComments (a line that is ONLY a comment). */
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
console.log('\n=== (C) THE LEAF’S BUDGET, measured ===');
console.log(`Tier 1 rows = ${t1lines.length}  Tier 2 rows = ${t2lines.length}`);
console.log(`raw lines = ${FILE.split('\n').length}`);
console.log(`EFFECTIVE lines (eslint max-lines, skipBlankLines+skipComments) = ${effectiveLines(FILE)}`);
console.log(`domain layer ceiling = 800 ; new-leaf packet budget = 250 ; ONE LEAF? ${effectiveLines(FILE) <= 250}`);
console.log(`longest line = ${Math.max(...FILE.split('\n').map((l) => l.length))} chars (no max-len rule in eslint.config.js)`);

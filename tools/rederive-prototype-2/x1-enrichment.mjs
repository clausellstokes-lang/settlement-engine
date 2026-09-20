/**
 * X1 — the anatomy of the enrichment.
 *
 * CONTROL: the enrichment loader is inert (the committed golden manifest's own hash).
 * A: ctx → record, path by path, for the four `onRecord:'transformed'` keys (+ every other
 *    held roster), over 9 rows (one per tier + EM-P0's acceptance config).
 * B: attribution — which FUNCTION inside assembleSettlement produced each added/changed path,
 *    from the loader-injected enrichment census.
 * C: IDEMPOTENCE — feed the RECORD's values back into ctx just before assembleSettlement and
 *    compare the resulting record against the original.
 * D: INVERTIBILITY — strip the measured added-path shapes off the record's value and compare
 *    with the ctx value.
 *
 * usage: node --import ./hook2.mjs x1-enrichment.mjs
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { instrumentedRoot, runHeadless, generateSettlementPipeline, TREE } from './instrument.mjs';
import { h, clone, pathDiff, fmtTally, tally, collapse, keyOf, rows9 } from './lib.mjs';

const EC = globalThis.__ENRICH_CENSUS__;
const KEYS = ['npcs', 'factions', 'history', 'powerStructure', 'institutions', 'relationships', 'conflicts', 'stress', 'economicState'];
const PRE = 'generateNarratives'; // the step immediately before assembleSettlement

// ── CONTROL ─────────────────────────────────────────────────────────────────
{
  const manifest = JSON.parse(readFileSync(`${TREE}/tests/fixtures/generator-golden-master.json`, 'utf-8'));
  const GR = { settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized', _seed: 'golden-master-v3' };
  const { _seed, ...cfg } = GR;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  const hash = createHash('sha256').update(JSON.stringify(s)).digest('hex');
  const k = [GR.settType, GR.culture, GR.terrainOverride, GR.tradeRouteAccess, GR.monsterThreat, GR._seed].join('|');
  console.log('=== CONTROL — the enrichment loader is inert over the committed golden ===');
  console.log(`manifest = ${manifest[k]}`);
  console.log(`measured = ${hash}`);
  console.log(`EQUAL    = ${manifest[k] === hash}\n`);
}

const ROWS = rows9();

// ── A: ctx → record, path by path ───────────────────────────────────────────
console.log('=== X1.A — ctx (after generateNarratives) vs the RECORD, per key ===');
const perKeyAdded = new Map(KEYS.map(k => [k, new Map()]));
const perKeyChanged = new Map(KEYS.map(k => [k, new Map()]));
const perKeyRemoved = new Map(KEYS.map(k => [k, new Map()]));
const rowData = [];
for (const row of ROWS) {
  let pre = null;
  const ctx = runHeadless(row, instrumentedRoot(row._seed).root, {
    onStep: (name, c) => { if (name === PRE) pre = Object.fromEntries(KEYS.map(k => [k, clone(c[k])])); },
  });
  const rec = ctx.settlement;
  const per = {};
  for (const k of KEYS) {
    const d = pathDiff(pre[k], rec[k]);
    per[k] = d;
    for (const p of d.added) { const m = perKeyAdded.get(k); m.set(collapse(p), (m.get(collapse(p)) || 0) + 1); }
    for (const p of d.changed) { const m = perKeyChanged.get(k); m.set(collapse(p), (m.get(collapse(p)) || 0) + 1); }
    for (const p of d.removed) { const m = perKeyRemoved.get(k); m.set(collapse(p), (m.get(collapse(p)) || 0) + 1); }
  }
  rowData.push({ row, pre, rec, per });
  const summary = KEYS.map(k => `${k}:${per[k].added.length}+/${per[k].changed.length}~/${per[k].removed.length}-`).join(' ');
  console.log(`${keyOf(row)}\n    ${summary}`);
}
console.log('\n--- ADDED path shapes (rows of 9 in which the shape appears is the ×count over all entities) ---');
for (const k of KEYS) {
  const a = [...perKeyAdded.get(k).entries()].sort((x, y) => y[1] - x[1]);
  if (a.length) console.log(`  ${k}: ${a.map(([p, n]) => `${p}×${n}`).join(' ')}`);
}
console.log('--- CHANGED path shapes ---');
for (const k of KEYS) {
  const a = [...perKeyChanged.get(k).entries()].sort((x, y) => y[1] - x[1]);
  if (a.length) console.log(`  ${k}: ${a.map(([p, n]) => `${p}×${n}`).join(' ')}`);
}
console.log('--- REMOVED path shapes ---');
for (const k of KEYS) {
  const a = [...perKeyRemoved.get(k).entries()].sort((x, y) => y[1] - x[1]);
  if (a.length) console.log(`  ${k}: ${a.map(([p, n]) => `${p}×${n}`).join(' ')}`);
}

// ── B: attribution ──────────────────────────────────────────────────────────
console.log('\n=== X1.B — WHICH FUNCTION (enrichment census, 3 rows: town / city / metropolis) ===');
const ATTR_ROWS = [ROWS[0], ROWS[6], ROWS[7]];
for (const row of ATTR_ROWS) {
  EC.reset(); EC.on = true;
  const ctx = runHeadless(row, instrumentedRoot(row._seed).root);
  EC.on = false;
  const rec = ctx.settlement;
  console.log(`\n${keyOf(row)}   calls=${EC.calls.length}`);
  for (const c of EC.calls) {
    // arg0 in-place delta
    const d = pathDiff(c.before, c.after);
    const inplace = d.added.length + d.changed.length + d.removed.length;
    let retNote = '';
    if (c.ret !== undefined && !c.retIsArg0 && typeof c.ret === 'object' && c.ret !== null && !Array.isArray(c.ret)) {
      const dr = pathDiff(c.before, c.ret);
      retNote = ` ret:{${Object.keys(c.ret).slice(0, 8).join(',')}}${Object.keys(c.ret).length > 8 ? '…' : ''} retDelta=${dr.added.length}+/${dr.changed.length}~/${dr.removed.length}-`;
    } else if (c.retIsArg0) {
      retNote = ' ret===arg0';
    } else if (typeof c.ret === 'string') {
      retNote = ` ret="${String(c.ret).slice(0, 40)}…"`;
    }
    console.log(`  ${c.fn.padEnd(30)} inplace=${inplace}${inplace ? ` [${fmtTally([...d.added, ...d.changed, ...d.removed], 8)}]` : ''}${retNote}`);
  }
  console.log(`  record keys=${Object.keys(rec).length}`);
}

// ── C: IDEMPOTENCE — the enrichment applied to its own output ───────────────
console.log('\n=== X1.C — IDEMPOTENCE: overwrite ctx with the RECORD\'s values just before assembleSettlement ===');
console.log('row\tkeysIdentical\twhichDiffer\tfullRecordIdentical');
let idem = 0;
for (const { row, rec } of rowData) {
  const recVals = Object.fromEntries(KEYS.map(k => [k, clone(rec[k])]));
  const ctx2 = runHeadless(row, instrumentedRoot(row._seed).root, {
    onStep: (name, c) => { if (name === PRE) for (const k of KEYS) c[k] = clone(recVals[k]); },
  });
  const rec2 = ctx2.settlement;
  const differ = KEYS.filter(k => h(rec2[k]) !== h(rec[k]));
  const same = h(rec2) === h(rec);
  if (differ.length === 0) idem += 1;
  console.log(`${keyOf(row)}\t${differ.length === 0}\t[${differ.join('|')}]\t${same}`);
}
console.log(`IDEMPOTENT on the nine held keys: ${idem}/${rowData.length}`);

// ── D: INVERTIBILITY — strip the added shapes, compare with ctx ─────────────
console.log('\n=== X1.D — INVERTIBILITY: record-form minus the measured ADDED shapes vs the ctx form ===');
const ADDED_SHAPES = new Map(KEYS.map(k => [k, new Set([...perKeyAdded.get(k).keys()])]));
function stripShapes(value, shapes, prefix = '') {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((v, i) => stripShapes(v, shapes, `${prefix}[${i}]`));
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (shapes.has(collapse(p))) continue;
    out[k] = stripShapes(v, shapes, p);
  }
  return out;
}
console.log('row\tkey\tafterStrip == ctx?\tresidual changed shapes');
let invertible = 0; let attempts = 0;
for (const { row, pre, rec } of rowData) {
  for (const k of KEYS) {
    const shapes = ADDED_SHAPES.get(k);
    const stripped = stripShapes(clone(rec[k]), shapes);
    const d = pathDiff(pre[k], stripped);
    const ok = d.added.length === 0 && d.changed.length === 0 && d.removed.length === 0;
    attempts += 1; if (ok) invertible += 1;
    if (!ok) console.log(`${keyOf(row)}\t${k}\tNO\t${fmtTally([...d.added, ...d.changed, ...d.removed], 8)}`);
  }
}
console.log(`INVERTIBLE BY FIELD-STRIPPING: ${invertible}/${attempts} (row,key) pairs`);

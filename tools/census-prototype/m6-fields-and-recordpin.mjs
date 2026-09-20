/**
 * (A) THE RECORD-PIN EXPERIMENT — EM-B2a's central premise, executed.
 *     EM-P0's A2 pins `generatePopulation` from the CONTEXT and reproduces the record.
 *     `rederive(record, …)` can only pin from the RECORD. Does that reproduce?
 * (B) M6 — field-level sensitivity on EM-A1's declared root fields (§1c.2's ten).
 *
 * usage: node --import ./hook.mjs m6-fields-and-recordpin.mjs [stride]
 */
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

import { instrumentedRoot, runHeadless, getStepOrder, TREE } from './instrument.mjs';

const { goldenCorpus, keyOf } = await import(`${TREE}/tests/helpers/goldenMasterCorpus.js`);
const order = getStepOrder();
const h = (v) => { let s; try { s = JSON.stringify(v); } catch { s = String(v); } return createHash('sha1').update(String(s)).digest('hex').slice(0, 16); };

// ── (A) the record-pin experiment ───────────────────────────────────────────
const CHOOSERS = ['npcs', 'relationships', 'factions', 'conflicts'];
const PROBE_ROWS = goldenCorpus().filter((_, i) => i % 97 === 0);
console.log('=== (A) PIN FROM THE CONTEXT vs PIN FROM THE RECORD ===');
console.log('row\tctxPinReproduces\trecordPinReproduces\tkeysThatDifferCtxVsRecord\trecordPinThrew');
let ctxOk = 0; let recOk = 0; let threw = 0;
for (const row of PROBE_ROWS) {
  const base = runHeadless(row, instrumentedRoot(row._seed).root);
  const rec = base.settlement;
  const diff = CHOOSERS.filter(k => h(base[k]) !== h(rec[k]));
  const fromCtx = Object.fromEntries(CHOOSERS.map(k => [k, base[k]]));
  const fromRecord = Object.fromEntries(CHOOSERS.map(k => [k, rec[k]]));
  const a = runHeadless(row, instrumentedRoot(row._seed).root, { pins: fromCtx });
  let bHash = 'THREW'; let didThrow = false;
  try {
    const b = runHeadless(row, instrumentedRoot(row._seed).root, { pins: fromRecord });
    bHash = h(b.settlement);
  } catch (e) { didThrow = true; threw += 1; bHash = `THREW: ${String(e.message).slice(0, 60)}`; }
  const target = h(rec);
  const ctxRep = h(a.settlement) === target;
  const recRep = bHash === target;
  if (ctxRep) ctxOk += 1;
  if (recRep) recOk += 1;
  console.log(`${keyOf(row)}\t${ctxRep}\t${recRep}\t[${diff.join('|')}]\t${didThrow}`);
}
console.log(`ctx-pin reproduces the record in ${ctxOk}/${PROBE_ROWS.length} rows; RECORD-pin in ${recOk}/${PROBE_ROWS.length} (threw in ${threw})`);

// ── (B) M6 — EM-A1's ten declared fields ────────────────────────────────────
const FIELDS = [
  ['institution', 'name', s => (s.institutions || []).map(i => i?.name), 'assembleInstitutions'],
  ['institution', 'category', s => (s.institutions || []).map(i => i?.category), 'assembleInstitutions'],
  ['institution', 'state (CREATE)', s => (s.institutions || []).map(i => i?.state).filter(v => v !== undefined), 'EM-B1a (absent)'],
  ['npc', 'name', s => (s.npcs || []).map(n => n?.name), 'generatePopulation'],
  ['npc', 'role', s => (s.npcs || []).map(n => n?.role), 'generatePopulation'],
  ['npc', 'status', s => (s.npcs || []).map(n => n?.status).filter(v => v !== undefined), 'ops layer'],
  ['faction', 'faction', s => (s.powerStructure?.factions || []).map(f => f?.faction), 'generatePower'],
  ['faction', 'category', s => (s.powerStructure?.factions || []).map(f => f?.category), 'generatePower'],
  ['faction', 'power', s => (s.powerStructure?.factions || []).map(f => f?.power), 'generatePower'],
  ['power seat', 'governingName', s => [s.powerStructure?.governingName], 'generatePower'],
  ['power seat', 'factions[].isGoverning', s => (s.powerStructure?.factions || []).map(f => f?.isGoverning), 'generatePower'],
];

const stride = Number(process.argv[2] || 5);
const rows = goldenCorpus().filter((_, i) => i % stride === 0);
const res = FIELDS.map(([card, field, , home]) => ({
  card, field, home, resolvedRows: 0, nTotal: 0, nMax: 0, movedBy: new Map(),
}));

const t0 = Date.now();
for (const row of rows) {
  const base = runHeadless(row, instrumentedRoot(row._seed).root).settlement;
  const baseVals = FIELDS.map(([, , get]) => { try { return get(base); } catch { return undefined; } });
  baseVals.forEach((v, i) => {
    const arr = Array.isArray(v) ? v.filter(x => x !== undefined && x !== null) : [];
    if (arr.length) { res[i].resolvedRows += 1; res[i].nTotal += arr.length; if (arr.length > res[i].nMax) res[i].nMax = arr.length; }
  });
  for (const step of order) {
    const per = runHeadless(row, instrumentedRoot(row._seed, { perturbStep: step }).root).settlement;
    FIELDS.forEach(([, , get], i) => {
      let pv; try { pv = get(per); } catch { pv = undefined; }
      if (h(baseVals[i]) !== h(pv)) res[i].movedBy.set(step, (res[i].movedBy.get(step) || 0) + 1);
    });
  }
}
const elapsed = Date.now() - t0;

console.log(`\n=== (B) M6 — field-level sensitivity, ${rows.length} rows (stride ${stride}), wall=${elapsed} ms ===`);
console.log('card\tfield\tresolvesIn\tn(total/max per row)\tdeclared home\tsteps whose perturbation MOVES it (rows/total)');
const dump = [];
for (const r of res) {
  const movers = [...r.movedBy.entries()].sort((a, b) => b[1] - a[1]).map(([s, c]) => `${s}:${c}`);
  console.log(`${r.card}\t${r.field}\t${r.resolvedRows}/${rows.length}\t${r.nTotal}/${r.nMax}\t${r.home}\t${movers.join(' , ') || 'NONE'}`);
  dump.push({ ...r, movedBy: Object.fromEntries(r.movedBy) });
}
writeFileSync(new URL(`./m6-result-stride${stride}.json`, import.meta.url), JSON.stringify({ stride, rows: rows.length, dump }, null, 2));

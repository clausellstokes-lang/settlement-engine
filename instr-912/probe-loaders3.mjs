import * as C from '../laneINSTR/tests/helpers/dossierCorpus.js';
const show = (label, rows, probeAll) => {
  const pools = new Set(rows.map(r=>r.poolId)).size;
  const distinct = new Set(rows.map(r=>r.text)).size;
  const singles = [...new Set(rows.filter(r=>r.poolId.endsWith('::single')).map(r=>r.poolId))].size;
  console.log(`${label.padEnd(28)} rows ${String(rows.length).padStart(5)} | pools ${String(pools).padStart(4)} | distinct ${String(distinct).padStart(5)} | singleton-pools ${singles}   ${probeAll?`[PROBE_ALL: ${probeAll}]`:''}`);
};
const ch = await C.loadChronicle(); show('chronicle R11/R12', ch, 'R11 n=216, R12 n=108');
const r4b = await C.loadHeraldDisclosure(); show('R4b herald disclosure', r4b, 'R4b n=50');
const r6 = await C.loadNpcLadder(); show('R6 npc ladder', r6, 'R6 n=1659; seat 1,662/1,104 pools');
const r7 = await C.loadInstitutionGazetteer(); show('R7 gazetteer', r7, 'R7 n=2169');
const dd = await C.loadDmHooks(); show('D-d dm hooks', dd, '(no PROBE_ALL column)');
const r5 = await C.loadCrierVoice(); show('R5 crier', r5, 'R5 n=373');
console.log('\nR6 by table:');
for (const t of ['ROLE_CONTENT','CLASS_CONTENT','FULL_CONTENT']) {
  const rows = r6.filter(r=>r.block===t);
  console.log(`   ${t.padEnd(16)} rows ${String(rows.length).padStart(5)} pools ${new Set(rows.map(r=>r.poolId)).size}`);
}
console.log('\nchronicle by block:');
for (const b of [...new Set(ch.map(r=>r.block))]) { const rows=ch.filter(r=>r.block===b); console.log(`   ${b.padEnd(26)} rows ${rows.length} pools ${new Set(rows.map(r=>r.poolId)).size}`); }

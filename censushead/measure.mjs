import { readFileSync } from 'node:fs';
const DOCK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const { WAR_RECEIPTS } = await import(`${DOCK}/src/domain/worldPulse/warReceiptPools.js`);
const src = readFileSync(`${DOCK}/docs/content/RECEIPT_POOLS_WAR.md`,'utf8');
// annex row count per ### block (non-pointer)
const annex = {};
let cur=null;
for (const ln of src.split('\n')) {
  if (/^#{1,3} /.test(ln)) { cur = ln.startsWith('### ') ? ln.slice(4).split(' ')[0] : null; if(cur) annex[cur]={rows:0,ptr:false}; continue; }
  if (!cur) continue;
  if (/^\d+\. /.test(ln)) annex[cur].rows++;
  if (ln.startsWith('→ pool lives in')) annex[cur].ptr=true;
}
const rows=[];
for (const [kind, v] of Object.entries(WAR_RECEIPTS)) {
  if (!Array.isArray(v)) continue;
  const a = annex[kind];
  rows.push({kind, src:v.length, annex:a? (a.ptr?'PTR':a.rows) : 'ABSENT'});
}
const mismatched = rows.filter(r => typeof r.annex === 'number' && r.annex !== r.src);
console.log('WAR_RECEIPTS array kinds:', rows.length);
console.log('kinds present as non-pointer annex blocks:', rows.filter(r=>typeof r.annex==='number').length);
console.log('MISMATCHES (src pool length != annex rows):', mismatched.length);
for (const r of mismatched) console.log(`  ${r.kind}: src=${r.src} annex=${r.annex}`);
console.log('\nFOUR CENSUS KINDS:');
for (const k of ['war_trajectory_winning','war_trajectory_losing','trajectory_misread','succession_demand_inherited']) {
  const r = rows.find(x=>x.kind===k);
  console.log(' ', k, JSON.stringify(r));
}
console.log('\nSAMPLE of kinds where src pool > 5 (proves wiring past five exists):');
console.log(rows.filter(r=>r.src>5).slice(0,25).map(r=>`${r.kind}=${r.src}/${r.annex}`).join('  '));
console.log('count src>5:', rows.filter(r=>r.src>5).length, ' count src==5:', rows.filter(r=>r.src===5).length);

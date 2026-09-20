/** Price each candidate against the golden-master hash, in memory. */
import { createHash } from 'node:crypto';
import { runHeadless, instrumentedRoot, TREE } from './instrument.mjs';
import { keyOf, sample63 } from './lib.mjs';
const { catalogIdForName } = await import(`${TREE}/src/data/institutionalCatalog.js`);
const RT=(o)=>JSON.parse(JSON.stringify(o));
const H=(v)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const slug=(s)=>String(s).toLowerCase().replace(/\s+/g,'_');
const gen = async (row) => (await runHeadless(row, instrumentedRoot(row._seed ?? keyOf(row)).root)).settlement;

const cands = {
  'Q3(a) faction id = faction.<slug>': (s)=>{s.powerStructure.factions.forEach(f=>{f.id=`faction.${slug(f.faction||f.name)}`;});},
  'Q3(b) faction id = fac_<n>':        (s)=>{s.powerStructure.factions.forEach((f,i)=>{f.id=`fac_${i+1}`;});},
  'Q3(c) faction: no mint':            ()=>{},
  'Q4 cure: re-stamp catalogId late':  (s)=>{for(const i of s.institutions){if(i.isCustom||i.source==='custom')continue;if(i.catalogId)continue;const c=catalogIdForName(i.name);if(c)i.catalogId=c;}},
  'EM-P1 as written: id on inst+fac':  (s)=>{s.powerStructure.factions.forEach((f,i)=>{f.id=`fac_${i+1}`;});s.institutions.forEach((x,i)=>{x.id=`inst_${i+1}`;});},
};
const moved = Object.fromEntries(Object.keys(cands).map(k=>[k,0]));
let n=0, instStamped=0;
for (const row of sample63()) {
  const base = await gen(row); const h0 = H(base); n++;
  for (const [k,fn] of Object.entries(cands)) { const c=RT(base); fn(c); if(H(c)!==h0) moved[k]++; }
  const c=RT(base); cands['Q4 cure: re-stamp catalogId late'](c);
  instStamped += c.institutions.filter((x,i)=>x.catalogId && !base.institutions[i].catalogId).length;
}
console.log(`=== rows measured: ${n} (the 63-row sample; the committed golden has 525) ===`);
for (const [k,v] of Object.entries(moved)) console.log(`   ${String(v).padStart(3)}/${n} rows move   ${k}`);
console.log(`\n   Q4 cure stamps ${instStamped} institutions across the sample (census: 2083 of 17361 over 525 rows).`);

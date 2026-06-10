import { institutionalCatalog } from './src/data/institutionalCatalog.js';
import { INSTITUTION_SERVICES } from './src/data/institutionServices.js';

// Collect all generated institution names across all tiers
const instNames = new Set();
for (const tier of Object.keys(institutionalCatalog)) {
  for (const cat of Object.keys(institutionalCatalog[tier])) {
    for (const name of Object.keys(institutionalCatalog[tier][cat])) {
      instNames.add(name);
    }
  }
}

const svcKeys = Object.keys(INSTITUTION_SERVICES);
const svcKeysLower = new Map(svcKeys.map(k => [k.toLowerCase(), k]));

// Replicate the fuzzy match from getServicesForInstitution
function tokens(s){return s.toLowerCase().split(/[\s'(),/-]+/).filter(c=>c.length>2);}
function fuzzy(name){
  const m = tokens(name);
  let h=null,g=0;
  for (const C of svcKeys){
    const T = tokens(C);
    let M=0;
    for (const v of T) for (const j of m)
      j===v ? (M+=2) : ((v.length>3 && j.startsWith(v))||(j.length>4 && v.startsWith(j))) && (M+=1);
    const A = M/(T.length*2);
    const S = h ? tokens(h).length : 1;
    const y = g/(S*2);
    (M>g || (M===g && M>0 && A>y)) && ((g=M),(h=C));
  }
  return g>0 ? h : null;
}

const exact=[], fuzzed=[], orphan=[];
for (const name of [...instNames].sort()){
  const ek = svcKeysLower.get(name.toLowerCase());
  if (ek){ exact.push([name, ek]); continue; }
  const f = fuzzy(name);
  if (f){ fuzzed.push([name, f]); } else { orphan.push(name); }
}

console.log('=== TOTAL generated institutions:', instNames.size);
console.log('=== EXACT service map:', exact.length);
console.log('=== FUZZY service map:', fuzzed.length);
console.log('=== ORPHAN (no service mapping at all):', orphan.length);
console.log('\n--- ORPHANS ---');
orphan.forEach(o=>console.log('  '+o));
console.log('\n--- SUSPICIOUS FUZZY MATCHES (possible mis-map) ---');
fuzzed.forEach(([n,f])=>{
  // flag when the matched key shares no strong token
  const nt=new Set(tokens(n)), ft=tokens(f);
  const shared = ft.filter(t=>nt.has(t));
  if (shared.length===0) console.log(`  "${n}"  ->  "${f}"  (NO shared token)`);
});

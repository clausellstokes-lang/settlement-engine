// condcheck.mjs <tree> <births.gz> <hits.json>: every town each line prints in, its declared atoms read through the tree's own
// factsOf + declarationAdmits on the FINAL record; prints held/refused counts and the refused towns.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [T, births, hf] = process.argv.slice(2);
const { factsOf } = await import(T+'/src/domain/facts/factsOf.js'); const { declarationAdmits } = await import(T+'/src/domain/facts/factVocabulary.js');
const H = JSON.parse(fs.readFileSync(hf));
const NEEDS = { L02:['institution: mill','institution: docks'], L03:['market'], L04:['market','population: ≥ middling'], L05:['population: ≥ middling'], L06:['tier: ≥ town'], L07:['population: ≥ middling'], L08:['institution: temple','population: ≥ middling'], L09:['sacredHouse'], L10:['population: ≥ middling'], L14:['market'], L15:['tier: ≥ village'], L16:['tier: ≥ village'], L17:['tier: ≥ village'], L18:['tier: ≥ village'], L20:['market'], L37:['market'], L38:['population: ≥ middling'], L41:['population: ≥ middling'], L42:['market'], L45:['gate','guardPresence'], L46:['gate','market','guardPresence'] };
const want = new Map(); for (const id of Object.keys(NEEDS)) for (const h of H[id].hits) (want.get(h.seed)||want.set(h.seed,[]).get(h.seed)).push(id);
const res = Object.fromEntries(Object.keys(NEEDS).map(k=>[k,{held:0,refused:[]}]));
const rl=readline.createInterface({input:fs.createReadStream(births).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ const seed=line.slice(9, line.indexOf('","s"')); if(!want.has(seed)) continue; const {s}=JSON.parse(line); const f=factsOf(s);
  for(const id of want.get(seed)){ const d=declarationAdmits({needs:NEEDS[id],excludes:[],crisis:[]}, f); if(d.admitted) res[id].held++; else res[id].refused.push(`${seed}(${s.tier} ${s.population}: ${JSON.stringify(d.reasons||d.refusedBy||d).slice(0,160)})`); } }
for(const [k,v] of Object.entries(res)) console.log(`${k}\theld ${v.held}\trefused ${v.refused.length}\t${v.refused.slice(0,4).join(' | ')}`);

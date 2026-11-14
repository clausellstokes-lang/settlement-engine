// one house renamed in a born record; the part's full and the profile scores before/after. TREE=<tree> node swap.mjs <rec.json.gz> "<from>" "<to>" <part>
import fs from 'node:fs'; import zlib from 'node:zlib'; const T=process.env.TREE;
const { defencePartsOf, generateDefenseProfile } = await import(T+'/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T+'/src/domain/facts/keep.js');
const [f,from,to,part]=process.argv.slice(2); const s=JSON.parse(zlib.gunzipSync(fs.readFileSync(f)));
if(!s.institutions.some(i=>i.name===from)) { console.log('NO', from); process.exit(0); }
const s1={...s,institutions:s.institutions.map(i=>i.name===from?{...i,name:to}:i)};
const full=(x)=>defencePartsOf(x).find(p=>p.id===part)?.full; const sc=(x)=>{const p=generateDefenseProfile(x,keepOfRecord(x.economicState)); return {...p.scores,traditions:undefined,readiness:p.readiness.score};};
console.log(f.split('/').pop(), s.tier, `${part} full: "${from}" ${full(s)?.toFixed(2)} -> "${to}" ${full(s1)?.toFixed(2)}`, JSON.stringify(sc(s)), '->', JSON.stringify(sc(s1)));

// parts (dims) before/after one change (add a house, or rename one): TREE=<tree> node why3.mjs <rec.json.gz> add|ren "<house>" ["<to>"]
import fs from 'node:fs'; import zlib from 'node:zlib'; const T=process.env.TREE;
const { defencePartsOf, generateDefenseProfile } = await import(T+'/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T+'/src/domain/facts/keep.js');
const [f,op,h,to]=process.argv.slice(2); const s=JSON.parse(zlib.gunzipSync(fs.readFileSync(f)));
const s1= op==='add' ? {...s,institutions:[...s.institutions,{name:h,category:'x'}]} : {...s,institutions:s.institutions.map(i=>i.name===h?{...i,name:to}:i)};
const k=keepOfRecord(s.economicState);
const show=(x)=>Object.fromEntries(defencePartsOf(x,k).map(p=>[p.id,p.points]));
const a=show(s), b=show(s1);
for(const id of new Set([...Object.keys(a),...Object.keys(b)])) if(a[id]!==b[id]) console.log('  ',id, a[id], '->', b[id]);
const sc=(x)=>{const p=generateDefenseProfile(x,k); return {mil:p.scores.military,mon:p.scores.monster,int:p.scores.internal,sup:p.scores.economic,mag:p.scores.magical,R:p.readiness.score};};
console.log('  scores', JSON.stringify(sc(s)),'->',JSON.stringify(sc(s1)), '| tier', s.tier, 'pop', s.population, '| stress', JSON.stringify((Array.isArray(s.stress)?s.stress:[s.stress]).map(x=>x?.type)));

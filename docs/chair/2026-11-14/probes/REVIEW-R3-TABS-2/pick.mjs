// pick.mjs <facts.jsonl> <seed list on stdin>: smallest tier, largest tier, a siege, a famine, an occupation (when present).
import fs from 'node:fs';
const F=new Map(fs.readFileSync(process.argv[2],'utf8').trim().split('\n').map(JSON.parse).map(o=>[o.seed,o]));
const seeds=[...new Set(fs.readFileSync(0,'utf8').trim().split('\n'))].filter(Boolean); const T=['thorp','hamlet','village','town','city','metropolis'];
const r=seeds.map(s=>F.get(s)).sort((a,b)=>T.indexOf(a.tier)-T.indexOf(b.tier)||a.pop-b.pop); const pick=new Map();
const add=(k,o)=>{ if(o&&![...pick.values()].includes(o.seed)) pick.set(k,o.seed); };
add('smallest',r[0]); add('largest',r[r.length-1]); for(const c of ['under_siege','famine','occupied']) add(c,r.find(o=>o.stress.includes(c)));
for(const [k,v] of pick) console.log(k+'\t'+v);

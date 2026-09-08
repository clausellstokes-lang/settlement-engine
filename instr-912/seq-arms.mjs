import { readFileSync } from 'node:fs';
import { armA, armsB, ceilingFor, runCeilingFor } from '../laneINSTR/src/domain/prose/grammarWalker.js';
const { towns, sequences } = JSON.parse(readFileSync('reading-sequence.json','utf8'));
const flat = sequences.flatMap(s=>s.orders);
const n = new Set(flat).size;
const a = armA(flat, `composed dossier reading · ${towns} towns`, n);
console.log(`towns ${towns} | lines ${flat.length} | realised orders n=${n} | ceiling(n)=${ceilingFor(n).toFixed(4)}`);
console.log('ARM A fails:'); for (const f of a.fails) console.log('   ', f.detail);
// B over the concatenated per-town readings
let repeats=0, pairs=0; const trans=new Map();
for (const s of sequences) for (let i=1;i<s.orders.length;i++){pairs++; if(s.orders[i]===s.orders[i-1])repeats++;
  const from=s.orders[i-1]; if(!trans.has(from))trans.set(from,new Map()); const r=trans.get(from); r.set(s.orders[i],(r.get(s.orders[i])||0)+1);}
const rc = runCeilingFor(n, pairs);
console.log(`ARM B1: run ${repeats}/${pairs} = ${(repeats/pairs).toFixed(4)} vs ceiling ${rc.toFixed(4)} -> ${repeats/pairs>rc?'FAIL':'pass'}`);
const b = armsB(sequences[0].orders, 'town 0', n);
console.log(`ARM B3 rows (first town): ${b.figures.transitions.length}`);
// the whole-corpus B3 over the concatenation
let b3=0; for (const [from,row] of trans){const total=[...row.values()].reduce((x,y)=>x+y,0); const top=[...row].sort((x,y)=>y[1]-x[1])[0]; if(total>=3 && top[1]/total>0.5) b3++;}
console.log(`ARM B3: ${b3} of ${trans.size} transition rows concentrate above 0.50`);

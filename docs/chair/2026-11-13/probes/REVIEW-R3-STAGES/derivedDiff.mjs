// derivedDiff.mjs <base.derived.jsonl> <tip.derived.jsonl> [seedRx]: per field (daily.<slot>, cond, threats, vantage), towns whose value moved; then each moved value, tip text with base text.
import fs from 'node:fs';
const rd=(f)=>new Map(fs.readFileSync(f,'utf8').trim().split('\n').map(JSON.parse).map(o=>[o.seed,o]));
const A=rd(process.argv[2]), B=rd(process.argv[3]); const RX=process.argv[4]?new RegExp(process.argv[4]):null;
const flat=(o)=>{ const m={}; for(const [k,v] of Object.entries(o.daily||{})) m['daily.'+k]=v; m.cond=o.cond; m.threats=(o.threats||[]).join(' ; '); m.vantage=(o.vantage||[]).join(' ;; '); return m; };
const tally={}; const rows=[];
for(const [seed,b] of B){ if(RX&&!RX.test(seed)) continue; const fa=flat(A.get(seed)), fb=flat(b); for(const k of new Set([...Object.keys(fa),...Object.keys(fb)])) if(fa[k]!==fb[k]){ (tally[k]??=new Set()).add(seed); rows.push({seed,k,base:fa[k],tip:fb[k]}); } }
console.log(Object.entries(tally).map(([k,v])=>`${k}: ${v.size}`).join('\n'));
fs.writeFileSync(process.argv[3]+'.diff.jsonl', rows.map(r=>JSON.stringify(r)).join('\n')+'\n');

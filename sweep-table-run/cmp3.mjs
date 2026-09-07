import { readFileSync } from 'node:fs';
const DOC = process.argv[2], TBL = process.argv[3];
const doc = readFileSync(DOC,'utf8').split('\n');
// find §3 table
let i = doc.findIndex(l => l.startsWith('## 3.'));
let start = doc.findIndex((l,k) => k>i && l.startsWith('| metric |'));
let rows = [];
for (let k=start; k<doc.length; k++){ if(!doc[k].startsWith('|')) break; rows.push(doc[k]); }
const parse = (l)=> l.replace(/^\|/,'').replace(/\|$/,'').split('|').map(s=>s.replace(/\*\*/g,'').trim());
const pub = rows.filter(r=>!/^\|\s*-+/.test(r)).map(parse);
const mine = readFileSync(TBL,'utf8').trim().split('\n').filter(r=>!/^\|-/.test(r)).map(parse);
console.log('published rows:', pub.length, ' mine rows:', mine.length);
console.log('published cols:', pub[0].length, ' mine cols:', mine[0].length);
console.log('HDR pub :', pub[0].join(' '));
console.log('HDR mine:', mine[0].join(' '));
const pubMap = new Map(pub.slice(1).map(r=>[r[0], r]));
const mineMap = new Map(mine.slice(1).map(r=>[r[0], r]));
let diffs=0, cells=0;
for (const [label, mrow] of mineMap){
  const prow = pubMap.get(label);
  if(!prow){ console.log('ROW MISSING IN PUBLISHED:', label); continue; }
  for(let c=1;c<mrow.length;c++){
    cells++;
    const col = mine[0][c];
    const a = prow[c], b = mrow[c];
    const na=Number(a), nb=Number(b);
    const eq = (a===b) || (Number.isFinite(na)&&Number.isFinite(nb)&&Math.abs(na-nb)<1e-9);
    if(!eq){ diffs++; console.log(`DIFF  ${label.padEnd(34)} ${col.padEnd(16)} published=${a}  measured=${b}`); }
  }
}
for (const label of pubMap.keys()) if(!mineMap.has(label)) console.log('ROW MISSING IN MINE:', label);
console.log(`\ncells compared: ${cells}   diffs: ${diffs}`);

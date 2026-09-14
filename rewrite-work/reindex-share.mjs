import { readFileSync } from 'node:fs';
import { classifyCell } from '../laneREWRITE/scripts/prose-manifest-diff.mjs';
const [b, t] = process.argv.slice(2);
const base = new Map(JSON.parse(readFileSync(b,'utf8')).cells.map(c=>[c.cell,c]));
const tip  = JSON.parse(readFileSync(t,'utf8')).cells;
const byBlock = new Map(); const byAud = new Map(); const byPoolLen = new Map();
let total=0, reindexed=0;
for (const c of tip) {
  const bc = base.get(c.cell); if (!bc) continue;
  const v = classifyCell(bc, c); total++;
  const k = c.block; const seat = byBlock.get(k) || {n:0,r:0}; seat.n++;
  const aud = c.cell.split('::')[1]; const as = byAud.get(aud) || {n:0,r:0}; as.n++;
  if (v==='RE-INDEXED'){ reindexed++; seat.r++; as.r++; }
  byBlock.set(k,seat); byAud.set(aud,as);
}
console.log(`RE-INDEXED SHARE · ${reindexed} of ${total} cells = ${(reindexed/total*100).toFixed(2)} %`);
console.log('\nBY AUDIENCE');
for (const [k,s] of [...byAud].sort()) console.log(`  ${k.padEnd(8)} ${String(s.r).padStart(6)} / ${String(s.n).padStart(6)} = ${(s.r/s.n*100).toFixed(2)} %`);
console.log('\nBY BLOCK (every block, share descending)');
const rows=[...byBlock].sort((x,y)=> (y[1].r/y[1].n)-(x[1].r/x[1].n) || y[1].n-x[1].n);
for (const [k,s] of rows) console.log(`  ${k.padEnd(12)} ${String(s.r).padStart(6)} / ${String(s.n).padStart(6)} = ${(s.r/s.n*100).toFixed(2)} %`);
const zero = rows.filter(([,s])=>s.r===0);
console.log(`\nblocks with ZERO re-indexed cells: ${zero.length} of ${rows.length}` + (zero.length? ' -> ' + zero.map(([k])=>k).join(' '): ''));

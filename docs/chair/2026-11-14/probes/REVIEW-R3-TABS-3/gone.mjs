import fs from 'node:fs';
const rd=(f)=>new Map(fs.readFileSync(f,'utf8').trim().split('\n').map(JSON.parse).map(o=>[o.seed,o]));
const B=rd('desk.base.jsonl'), F=rd('facts2.jsonl');
const rows=fs.readFileSync('deskdiff.base-tip.jsonl','utf8').trim().split('\n').map(JSON.parse);
for(const r of rows){ const b=B.get(r.seed).lines[r.k]; const f=F.get(r.seed);
  console.log([r.k, r.seed, f.tier, f.pop, f.stress.join('+'), 'mil='+f.mil, 'rdy='+f.readiness, 'W'+(+f.walls)+'G'+(+f.garrison)+'M'+(+f.militia)+'w'+(+f.watch)+'m'+(+f.merc), b.pool, 'v'+b.vid, (b.beside||b.sentence)].join('\t')); }

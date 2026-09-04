// OPUS-AUTHORED read-only: which corpus blocks are DIMENSION-BEARING (a mount row over
// one must declare the dimension, and the desk must ANSWER it or the kernel fails closed).
import fs from 'fs';
const DIM = {minor:'severity',major:'severity',catastrophic:'severity',
  deficit:'deficit','no deficit':'deficit',anchored:'anchor','not anchored':'anchor'};
const leaves=['defense','economy','general','power','stressors','warFaith'];
const out=[];
for (const l of leaves){
  const body = fs.readFileSync(`leaf-${l}.js`,'utf8');
  const blockRe=/^  "(DS-[A-Z]+-\d+)": \{/gm; const blocks=[]; let m;
  while((m=blockRe.exec(body))) blocks.push({id:m[1],at:m.index});
  for(let i=0;i<blocks.length;i++){
    const seg=body.slice(blocks[i].at, i+1<blocks.length?blocks[i+1].at:body.length);
    const marks=[...seg.matchAll(/"marks":\s*\[([^\]]*)\]/g)]
      .flatMap(x=>[...x[1].matchAll(/"([^"]+)"/g)].map(y=>y[1]));
    const dims=[...new Set(marks.map(w=>DIM[w]).filter(Boolean))].sort();
    if(dims.length) out.push({leaf:l,id:blocks[i].id,dims:dims.join('+')});
  }
}
console.log('DIMENSION-BEARING BLOCKS:', out.length, 'of 68');
for(const r of out) console.log(' ', r.leaf.padEnd(10), r.id.padEnd(10), r.dims);

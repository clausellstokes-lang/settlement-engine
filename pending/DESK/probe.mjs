// OPUS-AUTHORED read-only probe. Parses the generated leaves as JSON-ish text (no import,
// because the leaves import a live engine string). Counts blocks, pools, variants.
import fs from 'fs';
const leaves = ['defense','economy','general','power','stressors','warFaith'];
let totB=0,totP=0,totV=0;
const rows=[];
for (const l of leaves) {
  const src = fs.readFileSync(`leaf-${l}.js`,'utf8');
  // strip to the object literal
  const start = src.indexOf('Object.freeze({');
  const body = src.slice(start);
  // block ids at 2-space indent
  const blockRe = /^  "(DS-[A-Z]+-\d+)": \{/gm;
  const blocks=[]; let m;
  while ((m=blockRe.exec(body))) blocks.push({id:m[1], at:m.index});
  for (let i=0;i<blocks.length;i++){
    const seg = body.slice(blocks[i].at, i+1<blocks.length?blocks[i+1].at:body.length);
    const pools = [...seg.matchAll(/^      "([^"]+)": \[/gm)].map(x=>x[1]);
    const variants = (seg.match(/"angle":/g)||[]).length;
    rows.push({leaf:l, id:blocks[i].id, pools:pools.length, variants});
    totP+=pools.length; totV+=variants;
  }
  totB+=blocks.length;
}
const byLeaf={};
for (const r of rows){ byLeaf[r.leaf]=byLeaf[r.leaf]||{blocks:0,pools:0,variants:0}; const b=byLeaf[r.leaf]; b.blocks++; b.pools+=r.pools; b.variants+=r.variants; }
console.log('LEAF        blocks pools variants');
for (const l of leaves){ const b=byLeaf[l]; console.log(l.padEnd(11), String(b.blocks).padStart(5), String(b.pools).padStart(5), String(b.variants).padStart(8)); }
console.log('TOTAL      ', String(totB).padStart(5), String(totP).padStart(5), String(totV).padStart(8));
console.log('\n--- economy per-block (the 4 mounted vs the 11 dark) ---');
const mounted=new Set(['DS-ECO-1','DS-ECO-2','DS-ECO-8','DS-ECO-9']);
for (const r of rows.filter(r=>r.leaf==='economy')) console.log(r.id.padEnd(10), 'pools',String(r.pools).padStart(3),'variants',String(r.variants).padStart(3), mounted.has(r.id)?'MOUNTED':'dark');
console.log('\n--- pools carried by the 64 DARK blocks ---');
let dp=0,dv=0;
for (const r of rows) if (!mounted.has(r.id)) { dp+=r.pools; dv+=r.variants; }
console.log('dark blocks', rows.filter(r=>!mounted.has(r.id)).length, 'pools', dp, 'variants', dv);

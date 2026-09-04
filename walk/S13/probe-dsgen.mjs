import { readFileSync } from 'node:fs';
const W = process.argv[2];
let blocks=0, pools=0, variants=0, markedVariants=0, poolsWithMarks=0, poolsUnmarked=0;
const perBlock = [];
for (const f of ['defense','economy','general','power','stressors','warFaith']) {
  let src = readFileSync(`${W}/leaves/${f}.generated.js`, 'utf8');
  // strip the import line and the export wrapper to reach the object literal
  src = src.replace(/^import[^\n]*\n/m, '');
  const start = src.indexOf('Object.freeze(');
  const end = src.lastIndexOf(')');
  const obj = src.slice(start + 'Object.freeze('.length, end);
  let data;
  try { data = Function('ECONOMY_FRESHNESS_SENTENCES', `return (${obj});`)([]); } catch (e) { console.log('PARSE FAIL', f, e.message.slice(0,120)); continue; }
  for (const [id, block] of Object.entries(data)) {
    blocks++;
    const ps = block.pools || {};
    let bpools=0, bmarked=0;
    for (const [pk, vs] of Object.entries(ps)) {
      pools++; bpools++;
      const arr = Array.isArray(vs) ? vs : [];
      variants += arr.length;
      const m = arr.filter(v => Array.isArray(v.marks) && v.marks.length).length;
      markedVariants += m;
      if (m) { poolsWithMarks++; bmarked++; } else poolsUnmarked++;
    }
    perBlock.push(`${id}:${bpools}p/${bmarked}m`);
  }
}
console.log({blocks, pools, variants, markedVariants, poolsWithMarks, poolsUnmarked});
console.log(perBlock.filter(s=>!/\/0m$/.test(s)).join(' '));

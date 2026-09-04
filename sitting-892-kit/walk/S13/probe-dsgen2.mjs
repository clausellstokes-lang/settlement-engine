import { readFileSync } from 'node:fs';
const W = process.argv[2];
const markKinds = {}; let poolsNonDm=0, poolsDmOnlyOnly=0, poolsNone=0, total=0;
for (const f of ['defense','economy','general','power','stressors','warFaith']) {
  let src = readFileSync(`${W}/leaves/${f}.generated.js`, 'utf8').replace(/^import[^\n]*\n/m, '');
  const s = src.indexOf('Object.freeze('), e = src.lastIndexOf(')');
  const data = Function('ECONOMY_FRESHNESS_SENTENCES', `return (${src.slice(s+14, e)});`)([]);
  for (const block of Object.values(data)) for (const vs of Object.values(block.pools||{})) {
    total++;
    const marks = new Set();
    for (const v of (vs||[])) for (const m of (v.marks||[])) { marks.add(m); markKinds[m]=(markKinds[m]||0)+1; }
    const nonDm = [...marks].filter(m => m !== 'dm-only');
    if (nonDm.length) poolsNonDm++; else if (marks.size) poolsDmOnlyOnly++; else poolsNone++;
  }
}
console.log({total, poolsNonDm, poolsDmOnlyOnly, poolsNone, markKinds});

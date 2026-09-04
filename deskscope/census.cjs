const path = require('path');
const { loadLeaf } = require('./load.cjs');
const DIR = process.env.DOCK;
const LEAVES = ['defense','economy','general','power','stressors','warFaith'];
const MOUNTED = new Set(['DS-ECO-1','DS-ECO-2','DS-ECO-8','DS-ECO-9']);
const all = {};
for (const leaf of LEAVES) {
  all[leaf] = loadLeaf(path.join(DIR, 'src/data/dossierStateProse', leaf + '.generated.js'));
}
module.exports = { all, LEAVES, MOUNTED };
if (require.main === module) {
  let gTot = 0, gVar = 0, gPool = 0;
  for (const leaf of LEAVES) {
    const c = all[leaf];
    const ids = Object.keys(c);
    let variants = 0, pools = 0;
    const slotSet = new Set();
    for (const id of ids) {
      for (const [k, v] of Object.entries(c[id].pools)) {
        pools++; variants += v.length;
        for (const x of v) for (const s of (x.slots || [])) slotSet.add(s);
      }
      for (const s of (c[id].slots || [])) slotSet.add(s);
    }
    const dark = ids.filter((i) => !MOUNTED.has(i)).length;
    gTot += ids.length; gVar += variants; gPool += pools;
    console.log(`${leaf.padEnd(10)} blocks=${String(ids.length).padStart(2)} dark=${String(dark).padStart(2)} pools=${String(pools).padStart(3)} variants=${String(variants).padStart(3)} slots=[${[...slotSet].sort().join(' ')}]`);
  }
  console.log(`TOTAL      blocks=${gTot} pools=${gPool} variants=${gVar}`);
}

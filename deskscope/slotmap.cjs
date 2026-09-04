const { all, LEAVES, MOUNTED } = require('./census.cjs');
const TARGET = process.argv[3] || 'band';
const byLeaf = {};
let blocks = 0, sites = 0;
for (const leaf of LEAVES) {
  const c = all[leaf];
  const hits = [];
  for (const id of Object.keys(c)) {
    let n = 0;
    for (const v of Object.values(c[id].pools)) {
      for (const x of v) if ((x.slots || []).includes(TARGET)) n++;
    }
    if (n) { hits.push(`${id}(${n}${MOUNTED.has(id) ? ',LIT' : ''})`); blocks++; sites += n; }
  }
  if (hits.length) byLeaf[leaf] = hits;
}
console.log(`SLOT {${TARGET}}: ${blocks} blocks, ${sites} variant-sites`);
for (const [leaf, h] of Object.entries(byLeaf)) console.log(`  ${leaf.padEnd(10)} ${h.length} blocks: ${h.join(' ')}`);

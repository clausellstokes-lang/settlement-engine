const m = await import(process.argv[2]+'/scripts/wiring-census.mjs');
const { cites } = m.producerCitations();
for (const t of ['ledger','church']) {
  const c = cites.get(t) || [];
  const files=[...new Set(c.map(x=>x.split(':')[0]))];
  console.log(t,'citations',c.length,'distinct files',files.length);
  files.forEach(f=>console.log('   ',f));
}
// tokens ONLY holderTable writes
const own='src/domain/prose/holderTable.js';
const onlyOwn=[...cites.entries()].filter(([t,c])=>c.every(x=>x.startsWith(own))).map(([t])=>t);
console.log('tokens ONLY holderTable.js writes:', onlyOwn.length, JSON.stringify(onlyOwn));

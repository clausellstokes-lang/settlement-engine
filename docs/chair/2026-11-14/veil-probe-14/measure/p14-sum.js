// sum2.js <json>... : per probe file, diff path-classes (ids and indexes folded), how many shares/reads, one example
const fs = require('fs');
for (const f of process.argv.slice(2)) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  const g = new Map();
  for (const r of j.diffs) {
    const cls = r.path.replace(/\[id=[^\]]+\]/g, '[id]').replace(/\[#\d+\]/g, '[#]').replace(/\[name=[^\]]+\]/g, '[name]');
    if (!g.has(cls)) g.set(cls, { n: 0, tags: new Set(), ex: r });
    const e = g.get(cls); e.n += 1; e.tags.add(`${r.read}:${r.tag}`);
  }
  console.log(`${f.split('/').slice(-2).join('/')}: faults ${j.faults.length}, diffs ${j.diffs.length}, classes ${g.size}`);
  for (const [k, v] of [...g].slice(0, 12)) console.log(`  ${k}: ${v.n} rows over ${v.tags.size} read/shares (e.g. ${[...v.tags].slice(0, 3).join(', ')}) :: 210=${JSON.stringify(v.ex.at210).slice(0, 50)} live=${JSON.stringify(v.ex.live).slice(0, 50)}`);
}

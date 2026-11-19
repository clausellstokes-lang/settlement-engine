// vt.mjs <tree> <tsv> <blockRegex> : the live sweep rows of the matching blocks, each lacking variant's text and marks
import fs from 'node:fs'; import path from 'node:path';
const [tree, tsv, re] = process.argv.slice(2); const R = new RegExp(re);
const C = {};
for (const desk of ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith']) {
  const leaf = Object.values(await import(path.join(tree, `src/data/dossierStateProse/${desk}.generated.js`))).find((v) => v && typeof v === 'object');
  Object.assign(C, leaf);
}
const lines = fs.readFileSync(tsv, 'utf8').trim().split('\n'); const H = lines.shift().split('\t');
for (const l of lines) {
  const r = Object.fromEntries(l.split('\t').map((x, i) => [H[i], x]));
  if (!R.test(r.block) || +r.failDrawn === 0) continue;
  console.log(`\n## ${r.block}::${r.pool} | cond «${r.cond}» on v${r.carriers} | lacking drawn where it fails: ${r.byVid}`);
  for (const m of r.byVid.split(' ')) {
    const vid = +m.split(':')[0].slice(1); const v = (C[r.block].pools[r.pool] || []).find((x) => x.vid === vid);
    console.log(`  v${vid} [${(v.marks || []).join(' · ')}] ${v.text}`);
  }
  console.log('  e.g. ' + r.towns.slice(0, 300));
}

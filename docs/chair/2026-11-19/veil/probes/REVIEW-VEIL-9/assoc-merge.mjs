// merge the association shards; keep a sentence form when, in SOME size, it occurs in >= MIN towns holding a hideable
// house, the size has >= 3 towns holding none, and the form occurs in NO town of ANY size holding none.
import { readFileSync } from 'node:fs';
const files = process.argv.slice(2); const MIN = Number(process.env.MIN || 2);
const sizeTot = {}; const all = {};
for (const f of files) { const x = JSON.parse(readFileSync(f, 'utf8'));
  for (const t of x.townList) if (t.size) { const s = sizeTot[t.size] = sizeTot[t.size] || [0, 0]; s[t.hideable?.length ? 0 : 1] += 1; }
  for (const [form, r] of Object.entries(x.formsAll)) { const a = all[form] = all[form] || { sentGone: 0, paths: new Set(), ex: r.ex, by: {} }; a.sentGone += r.sentGone; r.paths.forEach((p) => a.paths.add(p));
    for (const [z, [c, cl]] of Object.entries(r.by)) { const b = a.by[z] = a.by[z] || [0, 0]; b[0] += c; b[1] += cl; } } }
console.log('towns by size [with a hideable house, with none]:', JSON.stringify(sizeTot));
const kept = Object.entries(all).filter(([, a]) => Object.values(a.by).every(([, cl]) => cl === 0) && Object.entries(a.by).some(([z, [c]]) => c >= MIN && sizeTot[z][1] >= 3));
kept.sort((p, q) => Math.max(...Object.values(q[1].by).map((b) => b[0])) - Math.max(...Object.values(p[1].by).map((b) => b[0])));
console.log('forms sent with every hideable house withheld:', Object.keys(all).length, '| kept:', kept.length);
for (const [f, a] of kept) console.log(`${JSON.stringify(a.by)} sent-all-gone ${a.sentGone} | ${f.slice(0, 200)} | ${[...a.paths].slice(0, 2).join(' ')}`);

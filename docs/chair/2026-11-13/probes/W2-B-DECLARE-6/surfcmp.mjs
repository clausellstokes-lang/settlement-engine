// node surfcmp.mjs <surfaces.txt> <base.json> <baseRoot> <tip.json> <tipRoot> — each surface: status and failure messages, paths/timings stripped, base vs tip
import fs from 'node:fs'; import crypto from 'node:crypto';
const [surf, bj, broot, tj, troot] = process.argv.slice(2);
const load = (f, root) => { const m = new Map(); for (const t of JSON.parse(fs.readFileSync(f, 'utf8')).testResults) { const file = t.name.replace(/^.*?\/(tests\/)/, '$1');
  const fails = t.assertionResults.filter((a) => a.status === 'failed');
  const msg = fails.map((a) => `${a.title}\n${a.failureMessages.join('\n').split('\n').filter((l) => !/^\s+at /.test(l)).join('\n')}`).join('\n') + (t.status === 'failed' && !fails.length ? t.message || '' : '');
  const counts = ['passed', 'failed', 'skipped', 'pending'].map((s) => t.assertionResults.filter((a) => a.status === s).length).join('/');
  m.set(file, { counts, msg: msg.split(root).join('<TREE>').replace(/\d+(\.\d+)?\s?ms/g, '<ms>').replace(/\d+(\.\d+)?\s?s\b/g, '<s>') }); } return m; };
const B = load(bj, broot); const T = load(tj, troot);
const h = (x) => (x ? crypto.createHash('sha256').update(x).digest('hex').slice(0, 10) : 'green');
for (const l of fs.readFileSync(surf, 'utf8').trim().split('\n')) { const [name, suite] = l.trim().split(/\s+/); const b = B.get(suite); const t = T.get(suite);
  console.log(name.padEnd(30), 'base', b ? `${b.counts} ${h(b.msg)}` : 'not run', '| tip', t ? `${t.counts} ${h(t.msg)}` : 'not run', b && t && b.msg === t.msg && b.counts === t.counts ? 'IDENTICAL' : 'DIFFER'); }

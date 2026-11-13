// REVIEW-W2B-3 item 7: for each red registered surface, its failure messages at each tree, stripped of paths and
// timings, compared. node goldenmsg.mjs <surfaces.txt> <tip.json> <b9d.json> <b1f.json>
import fs from 'node:fs'; import crypto from 'node:crypto';
const [surf, ...reps] = process.argv.slice(2);
const load = (f) => { const m = new Map(); for (const t of JSON.parse(fs.readFileSync(f, 'utf8')).testResults) { const file = t.name.replace(/^.*?\/(tests\/)/, '$1');
  const msg = t.assertionResults.filter((a) => a.status === 'failed').map((a) => `${a.title}\n${a.failureMessages.join('\n').split('\n').filter((l) => !/^\s+at /.test(l)).join('\n')}`).join('\n') + (t.status === 'failed' ? t.message || '' : '');
  m.set(file, msg.replace(/\/tmp\/\S+?\/wt\/\w+/g, '<TREE>').replace(/\d+(\.\d+)?ms/g, '<ms>')); } return m; };
const [tip, b9d, b1f] = reps.map(load);
for (const l of fs.readFileSync(surf, 'utf8').trim().split('\n')) { const [name, suite] = l.trim().split(/\s+/); const t = tip.get(suite) || '';
  if (!t.trim()) continue; const h = (x) => (x == null ? 'not run' : x.trim() ? crypto.createHash('sha256').update(x).digest('hex').slice(0, 10) : 'green');
  console.log(name.padEnd(34), 'tip', h(t), '| 9d5d6e091', h(b9d.get(suite)), '| 1fb15980d', h(b1f.get(suite)), t === b9d.get(suite) && t === b1f.get(suite) ? 'IDENTICAL' : 'DIFFER'); }

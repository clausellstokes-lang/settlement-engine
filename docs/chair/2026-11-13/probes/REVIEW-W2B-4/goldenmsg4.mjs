// REVIEW-W2B-4 part D: each red golden surface's failure messages at two trees, stripped of tree paths, stack lines and
// timings, compared. node goldenmsg4.mjs <surfaces.txt> <base.json> <tip.json>   (goldenmsg.mjs of REVIEW-W2B-3, two trees)
import fs from 'node:fs'; import crypto from 'node:crypto';
const [surf, ...reps] = process.argv.slice(2);
const load = (f) => { const m = new Map(); for (const t of JSON.parse(fs.readFileSync(f, 'utf8')).testResults) { const file = t.name.replace(/^.*?\/(tests\/)/, '$1');
  const msg = t.assertionResults.filter((a) => a.status === 'failed').map((a) => `${a.title}\n${a.failureMessages.join('\n').split('\n').filter((l) => !/^\s+at /.test(l)).join('\n')}`).join('\n') + (t.status === 'failed' ? t.message || '' : '');
  m.set(file, msg.replace(/\/tmp\/\S+?\/scratchpad\/(tip|base)/g, '<TREE>').replace(/\d+(\.\d+)?ms/g, '<ms>')); } return m; };
const [base, tip] = reps.map(load);
const h = (x) => (x == null ? 'not run' : x.trim() ? crypto.createHash('sha256').update(x).digest('hex').slice(0, 10) : 'green');
for (const l of fs.readFileSync(surf, 'utf8').trim().split('\n')) { const [name, suite] = l.trim().split(/\s+/);
  console.log(name.padEnd(34), 'c3913f999', h(base.get(suite)), '| 9f83ffbb2', h(tip.get(suite)), base.get(suite) === tip.get(suite) ? 'IDENTICAL' : 'DIFFER'); }

import { readFileSync } from 'node:fs';
const [tip, w9d, base] = process.argv.slice(2).map((p) => JSON.parse(readFileSync(p, 'utf8')));
const key = (n) => n.replace(/.*\/(lane|w9d|base)\//, '');
const idx = (r) => { const m = new Map(); for (const f of r.testResults) m.set(key(f.name), f); return m; };
const W = idx(w9d), B = idx(base);
const st = (m, file, title) => { const f = m.get(file); if (!f) return 'NOFILE'; if (title == null) return f.status; const a = f.assertionResults.find((x) => x.fullName === title); return a ? a.status : 'NOTITLE'; };
const tally = {};
for (const f of tip.testResults) {
  const file = key(f.name); const fails = f.assertionResults.filter((a) => a.status === 'failed');
  if (f.status !== 'failed' && !fails.length) continue;
  const rows = fails.length ? fails.map((a) => [a.fullName, st(W, file, a.fullName), st(B, file, a.fullName)]) : [['(file-level: ' + (f.message || '').slice(0, 120).replace(/\n/g, ' ') + ')', st(W, file), st(B, file)]];
  for (const [t, w, b] of rows) { const c = `${w}|${b}`; tally[c] = (tally[c] || 0) + 1; if (w !== 'failed') console.log('LANE?', file, '::', t.slice(0, 140), '| 9d5:', w, '| 1fb:', b); }
}
console.log(JSON.stringify(tally));
const fm = (m) => { const out = {}; for (const [k, f] of m) out[k] = f.status; return out; };
for (const [k, f] of W) if (f.status === 'failed' && !f.assertionResults.some((a) => a.status === 'failed')) console.log('w9d file-level', k, (f.message || '').slice(0, 150).replace(/\n/g, ' '));

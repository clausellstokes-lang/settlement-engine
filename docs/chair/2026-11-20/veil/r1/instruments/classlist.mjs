// VEIL-R1: the gate's in-class paths (any veil), one line each: path | max B | max C | veils | example
import { readFileSync } from 'node:fs';
const rows = {};
for (const f of process.argv.slice(2)) { const x = JSON.parse(readFileSync(f, 'utf8')); for (const r of x.rows) { const a = rows[r.path] = rows[r.path] || { B: {}, C: {}, ex: {} };
  for (const [v, n] of Object.entries(r.B)) a.B[v] = (a.B[v] || 0) + n; for (const [v, n] of Object.entries(r.C)) a.C[v] = (a.C[v] || 0) + n; for (const [k, e] of Object.entries(r.ex)) a.ex[k] = a.ex[k] || e; } }
const out = [];
for (const [p, a] of Object.entries(rows)) { const vs = Object.keys(a.B).filter((v) => (a.B[v] || 0) >= 2 && (a.C[v] || 0) * 3 <= a.B[v]); if (!vs.length) continue;
  const bm = Math.max(...vs.map((v) => a.B[v])); const ex = a.ex[`B ${vs[0]}`] || Object.values(a.ex)[0];
  out.push(`${p} | B${bm} C${Math.max(0, ...vs.map((v) => a.C[v] || 0))} | ${vs.length === 6 ? 'all6' : vs.join(',')} | ${String(ex).replace(/^[^:]*: /, '').slice(0, Number(process.env.W || 150))}`); }
out.sort(); console.log(out.join('\n')); console.error(`in class ${out.length}`);

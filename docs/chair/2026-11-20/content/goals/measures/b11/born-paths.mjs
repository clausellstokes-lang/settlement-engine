import fs from 'node:fs'; import readline from 'node:readline';
const [, , A, B] = process.argv;
const rd = async (f) => { const m = new Map(); for await (const l of readline.createInterface({ input: fs.createReadStream(f) })) { if (!l.trim()) continue; const r = JSON.parse(l); m.set(r.key, r.doc); } return m; };
const walk = (a, b, p, out) => { if (JSON.stringify(a) === JSON.stringify(b)) return; if (a && b && typeof a === 'object' && typeof b === 'object') { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], Array.isArray(a) ? `${p}[]` : `${p}.${k}`, out); } else out.push(p); };
for (const c of ['golden', 'census']) {
  const a = await rd(`${A}/${c}.jsonl`), b = await rd(`${B}/${c}.jsonl`); const paths = new Map(); let docs = 0;
  for (const [k, x] of a) { const out = []; walk(x, b.get(k), '', out); if (out.length) docs++; for (const p of new Set(out)) paths.set(p, (paths.get(p) || 0) + 1); }
  console.log(`${c}: docs moved ${docs}`); for (const [p, n] of [...paths].sort()) console.log(`  ${p} ${n}`);
}

// GOALS-4 builder 10 (2026-11-20), a scratch tool kept as the receipt of its output beside it.
// every non-string difference between two births, grouped by field (the confine.mjs walk, all of them kept)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const [A, B] = process.argv.slice(2);
const fieldOf = (p) => p.replace(/\[\d+\]/g, '[]');
function diff(x, y, path, acc) {
  if (typeof x === 'string' && typeof y === 'string') { if (x !== y) acc.s.push(path); return; }
  if (x === null || y === null || typeof x !== 'object' || typeof y !== 'object') { if (!(Number.isNaN(x) && Number.isNaN(y)) && x !== y) acc.o.push([path, `${JSON.stringify(x) === undefined ? 'undef' : x === null ? 'null' : typeof x}->${y === null ? 'null' : typeof y}`]); return; }
  if (Array.isArray(x) !== Array.isArray(y)) { acc.o.push([path, 'array/object']); return; }
  if (Array.isArray(x)) { if (x.length !== y.length) acc.o.push([path, 'length']); for (let i = 0; i < Math.min(x.length, y.length); i++) diff(x[i], y[i], `${path}[${i}]`, acc); return; }
  const kx = Object.keys(x), ky = Object.keys(y);
  if (kx.join('\u0000') !== ky.join('\u0000')) acc.o.push([path, 'keys']);
  for (const k of kx) if (Object.hasOwn(y, k)) diff(x[k], y[k], path ? `${path}.${k}` : k, acc);
}
const read = (d, c) => readFileSync(join(d, `${c}.jsonl`), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
for (const c of ['golden', 'census']) {
  const before = read(A, c), after = new Map(read(B, c).map((d) => [JSON.stringify(d.key), d.doc]));
  const by = new Map(); let docs = 0, n = 0, outside = 0, sOutside = 0; const sf = new Map();
  for (const b of before) {
    const acc = { s: [], o: [] }; diff(b.doc, after.get(JSON.stringify(b.key)), '', acc);
    if (acc.o.length) docs++;
    for (const [p, kind] of acc.o) { n++; const k = `${fieldOf(p)} (${kind})`; by.set(k, (by.get(k) || 0) + 1); if (!/^npcs\[\d+\]\.goal\./.test(p)) outside++; }
    for (const p of acc.s) { const f = fieldOf(p); sf.set(f, (sf.get(f) || 0) + 1); if (!/^npcs\[\d+\]\.goal\./.test(p)) sOutside++; }
  }
  console.log(`## ${c}: docs with a non-string difference ${docs}; non-string differences ${n}; OUTSIDE npcs[].goal: ${outside}; string differences outside npcs[].goal: ${sOutside}`);
  for (const [k, v] of [...by].sort((x, y) => y[1] - x[1])) console.log(`  ${v}  ${k}`);
}

// Itemize the first-paint static closure by source file, from a sourcemapped build. Usage: node itemize.mjs <distA> <distB>
import { readFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/home/user/settlement-engine/package.json');
const { SourceMapConsumer } = require('source-map-js');

function closure(dist) {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  const entry = [...html.matchAll(/<script[^>]*type="module"[^>]*src="\/?([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set();
  const todo = [...entry];
  while (todo.length) {
    const rel = todo.pop();
    if (seen.has(rel)) continue;
    seen.add(rel);
    const text = readFileSync(join(dist, rel), 'utf8');
    // static imports only: `import ... from"./x.js"`, `import"./x.js"`, `export ... from"./x.js"` (not `import(`)
    for (const m of text.matchAll(/(?:\bfrom\s*|\bimport\s*)["'](\.\/[^"']+\.js)["']/g)) todo.push(join(rel, '..', m[1]).replace(/^\.\//, ''));
  }
  return [...seen];
}

function bySource(dist, rel) {
  const code = readFileSync(join(dist, rel), 'utf8').replace(/\n\/\/# sourceMappingURL=.*$/, '');
  const mapPath = join(dist, rel + '.map');
  const out = {};
  if (!existsSync(mapPath)) { out['(no map)'] = Buffer.byteLength(code); return out; }
  const smc = new SourceMapConsumer(JSON.parse(readFileSync(mapPath, 'utf8')));
  const lines = code.split('\n');
  const segs = [];
  smc.eachMapping((m) => segs.push(m), null, SourceMapConsumer.GENERATED_ORDER);
  // attribute each generated span [col, nextCol) to the mapping's source
  for (let i = 0; i < segs.length; i++) {
    const m = segs[i], n = segs[i + 1];
    const line = lines[m.generatedLine - 1] ?? '';
    const end = n && n.generatedLine === m.generatedLine ? n.generatedColumn : line.length;
    const bytes = Buffer.byteLength(line.slice(m.generatedColumn, end));
    const src = (m.source || '(none)').replace(/^.*?\/(src|node_modules)\//, '$1/');
    out[src] = (out[src] || 0) + bytes;
  }
  return out;
}

function itemize(dist) {
  const files = closure(dist);
  const tot = {}; let total = 0;
  for (const f of files) {
    const code = readFileSync(join(dist, f), 'utf8').replace(/\n\/\/# sourceMappingURL=.*$/, '');
    total += Buffer.byteLength(code);
    for (const [s, b] of Object.entries(bySource(dist, f))) tot[s] = (tot[s] || 0) + b;
  }
  return { files: files.map((f) => basename(f).replace(/-[\w-]{8}\.js$/, '')), total, tot };
}

const [a, b] = process.argv.slice(2).map(itemize);
console.log('A chunks', a.files.sort().join(' '), 'total', a.total);
console.log('B chunks', b.files.sort().join(' '), 'total', b.total);
console.log('DELTA total (B - A)', b.total - a.total);
const keys = new Set([...Object.keys(a.tot), ...Object.keys(b.tot)]);
const rows = [...keys].map((k) => [k, (b.tot[k] || 0) - (a.tot[k] || 0), a.tot[k] || 0, b.tot[k] || 0]).filter((r) => r[1] !== 0).sort((x, y) => Math.abs(y[1]) - Math.abs(x[1]));
let sum = 0;
for (const [k, d, x, y] of rows) { sum += d; console.log(String(d).padStart(7), String(x).padStart(8), '->', String(y).padStart(8), k); }
console.log('sum of attributed deltas', sum);

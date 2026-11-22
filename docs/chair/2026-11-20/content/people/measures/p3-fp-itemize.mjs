// node fp-itemize.mjs <distA> <distB>: first-paint closure bytes by source file, A vs B (raw, from sourcemaps)
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/home/user/settlement-engine/package.json');
const { SourceMapConsumer } = require('source-map-js');

function closure(dist) {
  const assets = join(dist, 'assets');
  const html = readFileSync(join(dist, 'index.html'), 'utf-8');
  const entry = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/)[1];
  const seen = new Set([entry]); const q = [entry];
  while (q.length) {
    const f = q.shift(); const code = readFileSync(join(assets, f), 'utf-8');
    const specs = new Set(); let m;
    const a = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g; const b = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
    while ((m = a.exec(code))) specs.add(m[1].slice(2));
    while ((m = b.exec(code))) specs.add(m[1].slice(2));
    for (const d of specs) if (!seen.has(d)) { seen.add(d); q.push(d); }
  }
  return { assets, files: [...seen] };
}

function bySource(dist) {
  const { assets, files } = closure(dist);
  const out = new Map(); let total = 0; const chunks = {};
  for (const f of files) {
    const code = readFileSync(join(assets, f), 'utf-8');
    const raw = Buffer.byteLength(code.replace(/\n?\/\/# sourceMappingURL=.*\s*$/, ''));
    total += raw; chunks[f.replace(/-[A-Za-z0-9_-]{8}\.js$/, '')] = raw;
    const mp = join(assets, f + '.map'); if (!existsSync(mp)) { out.set(`(nomap) ${f}`, raw); continue; }
    const smc = new SourceMapConsumer(JSON.parse(readFileSync(mp, 'utf-8')));
    const lines = code.split('\n');
    const maps = []; smc.eachMapping((x) => maps.push(x));
    maps.sort((p, q) => p.generatedLine - q.generatedLine || p.generatedColumn - q.generatedColumn);
    for (let i = 0; i < maps.length; i++) {
      const x = maps[i]; const n = maps[i + 1];
      const line = lines[x.generatedLine - 1] || '';
      const end = n && n.generatedLine === x.generatedLine ? n.generatedColumn : line.length;
      const bytes = Buffer.byteLength(line.slice(x.generatedColumn, end));
      const key = (x.source || '(none)').replace(/^.*?\/(src|node_modules)\//, '$1/');
      out.set(key, (out.get(key) || 0) + bytes);
    }
  }
  return { out, total, chunks };
}

const A = bySource(process.argv[2]); const B = bySource(process.argv[3]);
console.log(`closure raw A ${A.total} B ${B.total} delta ${B.total - A.total}`);
const ck = new Set([...Object.keys(A.chunks), ...Object.keys(B.chunks)]);
for (const k of ck) { const d = (B.chunks[k] || 0) - (A.chunks[k] || 0); if (d) console.log(`chunk ${k}: ${A.chunks[k] || 0} -> ${B.chunks[k] || 0} (${d > 0 ? '+' : ''}${d})`); }
const keys = new Set([...A.out.keys(), ...B.out.keys()]);
const rows = [...keys].map((k) => [k, (B.out.get(k) || 0) - (A.out.get(k) || 0)]).filter(([, d]) => d !== 0).sort((p, q) => Math.abs(q[1]) - Math.abs(p[1]));
for (const [k, d] of rows) console.log(`${d > 0 ? '+' : ''}${d}\t${k}`);
console.log(`sum of source deltas ${rows.reduce((s, [, d]) => s + d, 0)}`);

// meter.mjs <dist dir>: the entry's static closure, read the way tests/build/vendorPdfLazy.test.js reads it
// (raw bytes; gzip -9; Brotli q11), with the closure's file list.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync, brotliCompressSync, constants as Z } from 'node:zlib';
const dist = process.argv[2]; const assets = join(dist, 'assets');
const specsOf = (code) => { const s = new Set(); let m; const a = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g, b = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
  while ((m = a.exec(code))) s.add(m[1].replace('./', '')); while ((m = b.exec(code))) s.add(m[1].replace('./', '')); return [...s]; };
const entry = readFileSync(join(dist, 'index.html'), 'utf-8').match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/)[1];
const seen = new Set([entry]); const q = [entry];
while (q.length) { const f = q.shift(); for (const d of specsOf(readFileSync(join(assets, f), 'utf-8'))) if (!seen.has(d)) { seen.add(d); q.push(d); } }
let raw = 0, gz = 0, br = 0; const files = [];
for (const f of [...seen].sort()) { const b = readFileSync(join(assets, f)); raw += b.length; const g = gzipSync(b, { level: 9 }).length; const r = brotliCompressSync(b, { params: { [Z.BROTLI_PARAM_QUALITY]: 11 } }).length; gz += g; br += r; files.push({ f, raw: b.length, g, r }); }
console.log(JSON.stringify({ entry, files: files.length, raw, gzip: gz, brotli: br, list: files }, null, 1));

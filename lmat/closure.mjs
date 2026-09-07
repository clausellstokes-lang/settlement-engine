import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';
const DIST = join(process.argv[2], 'dist');
const ASSETS = join(DIST, 'assets');
const html = readFileSync(join(DIST, 'index.html'), 'utf8');
const m = html.match(/<script[^>]+src="\/assets\/([^"]+\.js)"/);
if (!m) { console.error('no entry found'); process.exit(1); }
const entry = m[1];
function specs(code) {
  const out = new Set();
  for (const x of code.matchAll(/\bfrom\s*["'](\.\/[^"']+\.js)["']/g)) out.add(x[1].slice(2));
  for (const x of code.matchAll(/(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g)) out.add(x[1].slice(2));
  return [...out];
}
const seen = new Set([entry]); const q = [entry];
while (q.length) {
  const f = q.shift();
  let code; try { code = readFileSync(join(ASSETS, f), 'utf8'); } catch { continue; }
  for (const s of specs(code)) if (!seen.has(s)) { seen.add(s); q.push(s); }
}
let raw = 0, gz = 0, br = 0;
const rows = [];
for (const f of [...seen].sort()) {
  const buf = readFileSync(join(ASSETS, f));
  raw += buf.length;
  gz += gzipSync(buf, { level: 9 }).length;
  br += brotliCompressSync(buf, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length;
  rows.push([f, buf.length]);
}
console.log('ENTRY=' + entry);
console.log('CLOSURE_FILES=' + seen.size);
console.log('RAW=' + raw + ' / 1048000  margin=' + (1048000 - raw));
console.log('GZIP=' + gz + ' / 337000  margin=' + (337000 - gz));
console.log('BROTLI=' + br + ' / 283000  margin=' + (283000 - br));
for (const [f, n] of rows) console.log('  ' + n + '\t' + f);

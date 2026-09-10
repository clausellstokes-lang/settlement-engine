import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const distDir = process.argv[2];
const assetsDir = join(distDir, 'assets');
function staticImportSpecifiers(code) {
  const specs = new Set();
  const fromRe = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g;
  const bareRe = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
  let m;
  while ((m = fromRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  while ((m = bareRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  return [...specs];
}
const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
const entry = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/)[1];
const seen = new Set([entry]); const q = [entry];
while (q.length) {
  const f = q.shift();
  const code = readFileSync(join(assetsDir, f), 'utf-8');
  for (const d of staticImportSpecifiers(code)) if (!seen.has(d)) { seen.add(d); q.push(d); }
}
const files = [...seen].sort();
let total = 0;
const KEYS = ['customContentRoster', 'customContentProvenance', '_livingContentLawVersion'];
for (const f of files) {
  const b = readFileSync(join(assetsDir, f));
  total += b.length;
  const t = b.toString('utf-8');
  const hits = KEYS.map(k => `${k}=${t.split(k).length - 1}`).join(' ');
  console.log(String(b.length).padStart(9), f, ' | ', hits);
}
console.log('FILES', files.length, 'RAW TOTAL', total);
// emitted file count
let n = 0;
const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) { if (e.isDirectory()) walk(join(d, e.name)); else n++; } };
walk(distDir);
console.log('EMITTED FILES', n);

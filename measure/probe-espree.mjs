import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'espree';
const ROOT = process.argv[2];
function jsFiles(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const abs = join(dir, n);
    if (statSync(abs).isDirectory()) { jsFiles(abs, out); continue; }
    if (abs.endsWith('.js')) out.push(abs);
  }
  return out;
}
const files = [...jsFiles(join(ROOT, 'src/generators')), ...jsFiles(join(ROOT, 'src/domain'))];
const t0 = Date.now();
let failed = [];
let bytes = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  bytes += src.length;
  try { parse(src, { ecmaVersion: 2024, sourceType: 'module', loc: true }); } catch (e) { failed.push(`${f}: ${e.message}`); }
}
console.log(`files ${files.length} · bytes ${bytes} · parse ${Date.now() - t0} ms · parse failures ${failed.length}`);
for (const f of failed.slice(0, 5)) console.log('  ' + f);

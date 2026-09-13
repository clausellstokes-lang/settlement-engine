import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
const ROOT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepLIGHT';
const SRC = join(ROOT, 'src');
function files(dir = SRC, out = []) {
  for (const n of readdirSync(dir)) { const f = join(dir, n);
    if (statSync(f).isDirectory()) { files(f, out); continue; }
    if (!/\.(js|jsx)$/.test(n)) continue; out.push(relative(ROOT, f).split(sep).join('/')); }
  return out;
}
const all = files();
console.log('src files scanned:', all.length);
// broad scan: any mention at all (comments included), then any mention of the module PATH
const byName = all.filter(r => /generateSettlementPipeline/.test(readFileSync(join(ROOT, r), 'utf8')));
const byPath = all.filter(r => /generators\/generateSettlementPipeline\.js/.test(readFileSync(join(ROOT, r), 'utf8')));
console.log('\nfiles IMPORTING the pipeline module by path (static or dynamic):');
for (const r of byPath) console.log('  ', r);
console.log('\nfiles calling the symbol (crude: "generateSettlementPipeline(" outside a comment line):');
for (const r of byName) {
  const lines = readFileSync(join(ROOT, r), 'utf8').split('\n')
    .filter(l => /generateSettlementPipeline\s*\(/.test(l) && !/^\s*(\*|\/\/)/.test(l));
  if (lines.length) console.log('  ', r, '->', lines.length, 'call-shaped line(s)');
}

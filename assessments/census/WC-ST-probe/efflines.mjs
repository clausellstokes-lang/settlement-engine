// effective lines (eslint max-lines skipBlankLines+skipComments approximation) + size baseline
import { readFileSync, existsSync } from 'node:fs';
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963';
const base = JSON.parse(readFileSync(`${M}/scripts/.size-baseline.json`, 'utf8'));
const flat = base.files || base.ceilings || base;
function eff(src) {
  let n = 0, inBlock = false;
  for (const raw of src.split('\n')) {
    let line = raw.trim();
    if (!line) continue;
    let code = '';
    let i = 0;
    while (i < line.length) {
      if (inBlock) { const e = line.indexOf('*/', i); if (e < 0) { i = line.length; } else { inBlock = false; i = e + 2; } continue; }
      if (line.startsWith('/*', i)) { inBlock = true; i += 2; continue; }
      if (line.startsWith('//', i)) break;
      code += line[i]; i++;
    }
    if (code.trim()) n++;
  }
  return n;
}
for (const f of process.argv.slice(2)) {
  const p = `${M}/${f}`;
  if (!existsSync(p)) { console.log(`${f} MISSING`); continue; }
  const s = readFileSync(p, 'utf8');
  const b = flat[f] ?? '';
  console.log(`${f} raw=${s.split('\n').length} eff=${eff(s)} baseline=${b}`);
}

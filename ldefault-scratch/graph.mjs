// transitive import closure of generateSettlementPipeline.js, pure static read
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
const ROOT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLDEFAULT';
const seen = new Set(); const stack = [ROOT + '/src/generators/generateSettlementPipeline.js'];
while (stack.length) {
  const f = stack.pop();
  if (seen.has(f) || !existsSync(f)) continue;
  seen.add(f);
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/from\s+'([^']+)'|import\s*\(\s*'([^']+)'/g)) {
    const spec = m[1] || m[2];
    if (!spec || !spec.startsWith('.')) continue;
    let p = resolve(dirname(f), spec);
    if (!existsSync(p) && existsSync(p + '.js')) p += '.js';
    stack.push(p);
  }
}
console.log('closure size =', seen.size);
const hits = [...seen].filter(p => /simulationRules\.js$/.test(p));
console.log('reaches simulationRules.js =', hits.length ? hits : 'NO');

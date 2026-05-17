// One-shot: print line:col for each strict-mode react-hooks warning
// in the eslint JSON output piped on stdin. Used by the React 19 sweep.
import { readFileSync } from 'node:fs';

const strict = new Set([
  'refs', 'static-components', 'purity', 'immutability', 'set-state-in-effect',
]);

const results = JSON.parse(readFileSync(0, 'utf8'));
for (const f of results) {
  const rel = f.filePath
    .replace(/^.*settlement_work[\\/]/, '')
    .replace(/\\/g, '/');
  for (const m of f.messages) {
    if (!m.ruleId?.startsWith('react-hooks/')) continue;
    const tail = m.ruleId.slice('react-hooks/'.length);
    if (!strict.has(tail)) continue;
    console.log(`${rel}:${m.line}:${m.column} [${tail}]`);
  }
}

// One-shot: print line:col + message for each react-hooks/exhaustive-deps
// warning in the eslint JSON output piped on stdin. Used by Item 3 sweep.
import { readFileSync } from 'node:fs';

const results = JSON.parse(readFileSync(0, 'utf8'));
for (const f of results) {
  const rel = f.filePath
    .replace(/^.*settlement_work[\\/]/, '')
    .replace(/\\/g, '/');
  for (const m of f.messages) {
    if (m.ruleId !== 'react-hooks/exhaustive-deps') continue;
    const oneLineMsg = String(m.message || '')
      .replace(/\s+/g, ' ')
      .slice(0, 140);
    console.log(`${rel}:${m.line}:${m.column}\n  ${oneLineMsg}\n`);
  }
}

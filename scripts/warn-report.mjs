// One-shot: read eslint JSON output from stdin and print react-hooks
// warnings grouped by file (descending), with a per-rule breakdown.
// Used by Phase 2 to pick what to fix first.
import { readFileSync } from 'node:fs';

const raw = readFileSync(0, 'utf8');
const results = JSON.parse(raw);

const byFile = {};
for (const file of results) {
  if (!file.messages?.length) continue;
  const rel = file.filePath
    .replace(/^.*settlement_work[\\/]/, '')
    .replace(/\\/g, '/');
  for (const m of file.messages) {
    if (!m.ruleId?.startsWith('react-hooks/')) continue;
    byFile[rel] ??= {};
    byFile[rel][m.ruleId] = (byFile[rel][m.ruleId] || 0) + 1;
  }
}

const rows = Object.entries(byFile)
  .map(([f, rules]) => ({
    f,
    total: Object.values(rules).reduce((a, b) => a + b, 0),
    rules,
  }))
  .sort((a, b) => b.total - a.total);

let grand = 0;
for (const { f, total, rules } of rows) {
  grand += total;
  const rs = Object.entries(rules)
    .map(([k, v]) => `${k.replace('react-hooks/', '')}:${v}`)
    .join(' ');
  console.log(`  ${String(total).padStart(3)}  ${f.padEnd(60)}  ${rs}`);
}
console.log(`\nTotal react-hooks warnings: ${grand} across ${rows.length} files`);

// REVIEW-W2B-3 item 6: the red rows of a vitest JSON report — each failed title, and each file that failed at file level
// (a load error: status failed with no failed assertion). node redrows.mjs <report.json> [--files]
import fs from 'node:fs';
const j = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const rows = [];
for (const f of j.testResults) {
  const file = f.name.replace(/^.*?\/(tests\/)/, '$1');
  const failed = f.assertionResults.filter((a) => a.status === 'failed');
  for (const a of failed) rows.push(`${file} › ${[...(a.ancestorTitles || []), a.title].join(' › ')}`);
  if (f.status === 'failed' && !failed.length) rows.push(`${file} › [FILE-LEVEL] ${String(f.message || '').split('\n')[0].slice(0, 120)}`);
}
if (process.argv.includes('--files')) console.log([...new Set(rows.map((r) => r.split(' › ')[0]))].join('\n'));
else console.log(rows.sort().join('\n'));

// VEIL-43: list failing tests by file and full title from a vitest JSON report, classed against RED-AT-LINE.tsv (containment, spaces and " > " ignored).
// node fails.mjs <report.json> <RED-AT-LINE.tsv>
import fs from 'node:fs';
const r = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const norm = (s) => s.replace(/ > /g, '').replace(/\s+/g, '');
const rows = fs.readFileSync(process.argv[3], 'utf8').split('\n').slice(1).filter(Boolean).map((l) => l.split('\t')).filter((c) => c.length >= 3).map((c) => ({ file: c[1], title: norm(c[2]) }));
let n = 0;
for (const f of r.testResults) {
  const file = f.name.replace(/^.*?\/(tests\/)/, '$1');
  const failed = f.assertionResults.filter((a) => a.status === 'failed');
  if (!failed.length && f.status === 'failed') { console.log(`FILE-FAIL\t${file}\t${(f.message || '').split('\n')[0].slice(0, 160)}`); n++; }
  for (const a of failed) {
    const t = norm(a.fullName || a.title);
    const listed = rows.some((x) => x.file === file && (t.includes(x.title) || x.title.includes(t)));
    console.log(`${listed ? 'LISTED' : 'UNLISTED'}\t${file}\t${a.fullName || a.title}`); n++;
  }
}
console.log(`TOTAL failing ${n}; files ${r.numTotalTestSuites ?? ''}; tests ${r.numTotalTests} passed ${r.numPassedTests} failed ${r.numFailedTests}`);

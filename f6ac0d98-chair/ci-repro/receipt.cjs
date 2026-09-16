const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const enc = (s) => String(s).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
const log = fs.existsSync('test-ratchet.log') ? fs.readFileSync('test-ratchet.log', 'utf8') : '(no test-ratchet.log)';
console.log(`::error title=test-ratchet verdict (last 60 KB)::${enc(log.slice(-60000))}`);
// The ratchet copies the runner's JSON report of the LAST red to a stable path outside the tree.
const stable = path.join(os.tmpdir(), 'test-ratchet-last-red.json');
if (!fs.existsSync(stable)) {
  console.log(`::warning title=test-ratchet report::no ${stable}; the red came before the runner report, or the run was cut by the job timeout`);
  process.exit(0);
}
const report = JSON.parse(fs.readFileSync(stable, 'utf8'));
const rows = [];
for (const file of report.testResults || []) {
  for (const t of file.assertionResults || []) {
    if (t.status !== 'failed') continue;
    const msg = String((t.failureMessages || [])[0] || '').replace(/\u001b\[[0-9;]*m/g, '').split('\n').find((l) => l.trim()) || '(no message)';
    rows.push(`${path.relative(process.cwd(), file.name || '')} :: ${t.fullName || t.title}  [${t.duration ?? '?'} ms]\n    ${msg.slice(0, 300)}`);
  }
}
const totals = { tests: report.numTotalTests, failed: report.numFailedTests, passed: report.numPassedTests, pending: report.numPendingTests, files: report.numTotalTestSuites, failedFiles: report.numFailedTestSuites };
const body = [`${rows.length} failed test(s); runner totals ${JSON.stringify(totals)}`, ...rows].join('\n');
fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '## failed tests from the runner report\n\n```\n' + body + '\n```\n');
console.log(`::error title=test-ratchet failed tests::${enc(body.slice(0, 60000))}`);

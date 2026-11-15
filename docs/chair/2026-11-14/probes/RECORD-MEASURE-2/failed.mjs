// node failed.mjs <vitest json>: every failed test, file :: name (first line of the message)
import fs from 'node:fs'; const j = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
console.log(`files ${j.numTotalTestSuites ?? ''} tests ${j.numTotalTests} failed ${j.numFailedTests}`);
for (const f of j.testResults) for (const a of f.assertionResults) if (a.status === 'failed') console.log(`${f.name.replace(/.*\/tests\//, 'tests/')} :: ${a.fullName.slice(0, 120)} :: ${String(a.failureMessages?.[0] || '').split('\n')[0].slice(0, 160)}`);

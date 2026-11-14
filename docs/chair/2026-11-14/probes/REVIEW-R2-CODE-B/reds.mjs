// reds.mjs <vitest json>...: per test file, passed/failed and the failed titles (first 3).
import fs from 'node:fs';
for (const f of process.argv.slice(2)) { let j; try { j = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { console.log(f, 'NO JSON', e.message); continue; }
  console.log('##', f.split('/').pop(), 'files', j.testResults.length, 'passed', j.numPassedTests, 'failed', j.numFailedTests);
  for (const r of j.testResults) { const fl = r.assertionResults.filter((a) => a.status === 'failed'); const p = r.assertionResults.filter((a) => a.status === 'passed').length;
    const short = r.name.replace(/.*\/(tests\/)/, '$1'); if (fl.length || r.status === 'failed') console.log(`  RED ${short} ${p}/${p + fl.length} :: ${fl.map((a) => a.title).slice(0, 3).join(' | ').slice(0, 220)}${r.message ? ' MSG ' + r.message.slice(0, 120) : ''}`); } }

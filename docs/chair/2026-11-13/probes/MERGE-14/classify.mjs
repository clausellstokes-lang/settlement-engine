// usage: node classify.mjs — STYLE-2-MERGE-14: read the six shard JSONs; check each shard's files equal its plan (vitest's own
// sha1 partition) and the union equals `vitest list`; print the counts and every red (file > title; load failures) with its first message lines.
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
const D = '/home/user/rec14', ROOT = '/home/user/wt-s49c/';
let tot = { p: 0, f: 0, s: 0, files: 0, loadFail: 0 }, all = new Set(), reds = [];
for (let i = 1; i <= 6; i++) {
  const jf = `${D}/shard-${i}.json`; if (!existsSync(jf)) { console.log(`shard ${i}: NO JSON`); continue; }
  const j = JSON.parse(readFileSync(jf, 'utf8'));
  const files = j.testResults.map((r) => r.name.replace(ROOT, '')).sort();
  const plan = readFileSync(`${D}/plan-s${i}.txt`, 'utf8').split('\n').filter(Boolean);
  const eq = files.length === plan.length && files.every((f, k) => f === plan[k]);
  console.log(`shard ${i}: files ${files.length} plan ${plan.length} ${eq ? 'EQUAL' : 'DIFFER'} · passed ${j.numPassedTests} failed ${j.numFailedTests} pending ${j.numPendingTests + j.numTodoTests} · failed suites ${j.numFailedTestSuites}`);
  tot.p += j.numPassedTests; tot.f += j.numFailedTests; tot.s += j.numPendingTests + j.numTodoTests; tot.files += files.length;
  for (const f of files) all.add(f);
  for (const r of j.testResults) {
    const file = r.name.replace(ROOT, '');
    const failedA = r.assertionResults.filter((a) => a.status === 'failed');
    if (r.status === 'failed' && failedA.length === 0) { tot.loadFail++; reds.push({ file, title: '[FILE FAILED TO LOAD]', msg: (r.message || '').slice(0, 600) }); }
    for (const a of failedA) reds.push({ file, title: a.fullName, msg: (a.failureMessages || []).join('\n').slice(0, 1500) });
  }
}
const list = readFileSync(`${D}/files-all.txt`, 'utf8').split('\n').filter(Boolean);
console.log(`TOTAL passed ${tot.p} failed ${tot.f} skipped ${tot.s} · files ${tot.files} (distinct ${all.size}; vitest list ${list.length}; ${list.every((f) => all.has(f)) && all.size === list.length ? 'UNION EQUAL' : 'UNION DIFFERS'}) · files failed at load ${tot.loadFail}`);
writeFileSync(`${D}/reds.json`, JSON.stringify(reds, null, 1));
for (const r of reds) console.log(`RED ${r.file} > ${r.title}`);

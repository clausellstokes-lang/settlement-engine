// usage: node dump.mjs <json> <match.tsv> -> every NEW red: file, full title, first 6 message lines
import { readFileSync } from 'node:fs';
const [json, m] = process.argv.slice(2);
const isNew = new Set(readFileSync(m, 'utf8').split('\n').filter((l) => l.startsWith('NEW')).map((l) => l.split('\t').slice(1, 3).join('\t')));
const j = JSON.parse(readFileSync(json, 'utf8'));
for (const f of j.testResults) { const file = f.name.replace(/.*?\/tests\//, 'tests/');
  for (const a of f.assertionResults) { if (a.status !== 'failed') continue; const full = a.fullName.replace(/\s+/g, ' ').trim();
    if (!isNew.has(`${file}\t${full.slice(0, 200)}`)) continue;
    console.log(`### ${file}\n${full}\n${(a.failureMessages[0] || '').split('\n').filter((x) => !/^\s+at /.test(x)).slice(0, 6).join('\n').slice(0, 900)}\n`); } }

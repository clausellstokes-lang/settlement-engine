// usage: node match.mjs <vitest json> <red tsv> -> each failed test ON/NEW against the list (file + title, a title may be the full name's tail or a prefix)
import { readFileSync } from 'node:fs';
const [json, tsv] = process.argv.slice(2);
const j = JSON.parse(readFileSync(json, 'utf8'));
const rows = readFileSync(tsv, 'utf8').split('\n').map((l) => l.split('\t')).filter((r) => r.length >= 3);
const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();
for (const f of j.testResults || []) {
  const file = f.name.replace(/.*?\/tests\//, 'tests/');
  for (const a of f.assertionResults || []) {
    if (a.status !== 'failed') continue;
    const full = norm(a.fullName), title = norm(a.title);
    const on = rows.some((r) => r[1] === file && (() => { const t = norm(r[2]); return t && (full === t || full.endsWith(t) || t.endsWith(title) || full.startsWith(t) || t.startsWith(full.slice(0, 80)) || title.startsWith(t.split(' ').slice(-6).join(' ').slice(0, 40)) ); })());
    console.log(`${on ? 'ON ' : 'NEW'}\t${file}\t${full.slice(0, 200)}`);
  }
}

// node b3read.mjs <out> seed...: per town, the PDF's RESOURCE CHAINS rows, the journal's Exploitation rows and the Resources tab's cards, as the dump holds them
import fs from 'node:fs'; import zlib from 'node:zlib';
const [out, ...seeds] = process.argv.slice(2); const want = new Set(seeds); const recs = {};
for (const l of zlib.gunzipSync(fs.readFileSync(out + '/corpus.ndjson.gz')).toString().split('\n')) { if (!l) continue; const seed = l.slice(9, l.indexOf('"', 9)); if (want.has(seed)) recs[seed] = JSON.parse(l).s; }
const views = (t) => { const V = {}; let cur = '_'; for (const line of t.split('\n')) { const m = /^== (.+) ==$/.exec(line); if (m) { cur = m[1]; V[cur] = []; } else (V[cur] ||= []).push(line); } return V; };
for (const seed of seeds) { const r = recs[seed]; const V = views(fs.readFileSync(`${out}/dumps/${seed}.txt`, 'utf8'));
  const st = (Array.isArray(r.stress) ? r.stress : r.stress ? [r.stress] : []).map((x) => x?.type).join(',') || '-';
  console.log(`\n### ${seed} | ${r.tier} ${r.population} | stress ${st}`);
  const P = V['PDF/ResourcesProduction'] || []; const i = P.indexOf('RESOURCE CHAINS'); const rows = []; let cur = [];
  if (i >= 0) for (const x of P.slice(i + 1)) { if (/^(NEARBY RESOURCES|IMPORTS|EXPORT|TERRAIN|GAPS)/.test(x)) break; if (/^(FULLY|PARTIALLY) EXPLOITED$|^UNEXPLOITED$/.test(x)) { if (cur.length) rows.push(cur.join(' ')); cur = [x]; continue; } cur.push(x); if (/^(full|partial|unexploited)$/.test(x)) { rows.push(cur.join(' ')); cur = []; } }
  if (cur.length) rows.push(cur.join(' ')); rows.forEach((x) => console.log('  PDF ' + x));
  for (const l of (V['Journal/Resources & Production'] || []).filter((x) => /^\|/.test(x) && !/^\| (Resource|---)/.test(x))) console.log('  JNL ' + l);
  const T = V['Systems/Resources'] || []; const a = T.findIndex((x) => /^Resource Exploitation/.test(x)); const b = T.findIndex((x, k) => k > a && /^Nearby Resources/.test(x));
  if (a >= 0) T.slice(a + 1, b < 0 ? a + 14 : b).filter((x) => /exploited|^Partial|^Unexploited|^Needs:|→/.test(x)).forEach((x) => console.log('  TAB ' + x.slice(0, 160))); }

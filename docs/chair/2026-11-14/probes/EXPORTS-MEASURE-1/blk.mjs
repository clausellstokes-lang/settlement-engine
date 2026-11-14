// EXPORTS-MEASURE-1 reading tool: node blk.mjs <out-dir> <B1|B2|B3|B4|B5|B6> seed... -> per town: the record in brief and the block's lines
// as the PDF and the journal print them (at most the block). Reads <out>/corpus.ndjson.gz and <out>/dumps/<seed>.txt.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [out, blk, ...seeds] = process.argv.slice(2); const want = new Set(seeds);
const recs = {}; for (const l of zlib.gunzipSync(fs.readFileSync(out + '/corpus.ndjson.gz')).toString().split('\n')) { if (!l) continue; const seed = l.slice(9, l.indexOf('"', 9)); if (want.has(seed)) recs[seed] = JSON.parse(l).s; }
const views = (t) => { const V = {}; let cur = '_'; for (const line of t.split('\n')) { const m = /^== (.+) ==$/.exec(line); if (m) { cur = m[1]; V[cur] = []; } else (V[cur] ||= []).push(line); } return V; };
const after = (ls, head, n) => { const i = (ls || []).findIndex((x) => x.trim() === head); return i < 0 ? [] : ls.slice(i + 1, i + 1 + n); };
for (const seed of seeds) { const r = recs[seed]; if (!r) { console.log(seed, 'NO RECORD'); continue; }
  const V = views(fs.readFileSync(`${out}/dumps/${seed}.txt`, 'utf8'));
  const st = (Array.isArray(r.stress) ? r.stress : r.stress ? [r.stress] : []).map((x) => x?.type).join(',') || '-';
  const inst = (r.institutions || []).map((x) => x.name).join('; ');
  console.log(`\n### ${seed} | ${r.tier} ${r.population} | ${r.culturalIdentity?.key} | stress ${st} | food ${r.economicState?.foodSecurity?.foodRecord?.band} | ${r.config?.monsterThreat}\n  roster: ${inst.slice(0, 900)}`);
  if (blk === 'B1') { const a = after(V['PDF/DefenseSecurity'], 'THREAT ASSESSMENT', 16).slice(1); for (let i = 0; i + 2 < a.length + 1; i += 3) if (a[i]) console.log(`  PDF ${a[i]} [${a[i + 1]}]: ${a[i + 2]}`); }
  if (blk === 'B2') { const a = after(V['PDF/IdentityDailyLife'], 'CULTURAL IDENTITY', 20); const k = a.indexOf('DAILY LIFE'); console.log('  PDF ' + (k < 0 ? a : a.slice(0, k)).join(' | '));
    const cn = (V['PDF/IdentityDailyLife'] || []).indexOf('CULTURAL NOTES'); if (cn >= 0) console.log('  PDF notes: ' + V['PDF/IdentityDailyLife'][cn + 1]);
    console.log('  TAB overview identity: ' + ((V['Summary/Overview'] || []).find((x) => /inspired/.test(x)) || '-').slice(0, 300)); }
  if (blk === 'B3') { for (const l of (V['Journal/Resources & Production'] || []).filter((x) => /^\|/.test(x) && !/^\| (Resource|---)/.test(x))) console.log('  JNL ' + l);
    const t = V['Systems/Resources'] || []; for (const l of t.filter((x) => /^Needs:|Fully exploited|Partial|Unexploited/i.test(x)).slice(0, 12)) console.log('  TAB ' + l.slice(0, 200)); }
  if (blk === 'B4') for (const l of (V['Journal/Defense & Security'] || []).filter((x) => /\(/.test(x))) console.log('  JNL ' + l.slice(0, 220));
}

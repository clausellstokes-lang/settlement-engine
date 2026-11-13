// REVIEW-W2B-3: the `quarters` lines whose only quarters word is a neighbourhood or urban word (not quarters, not
// districts), by tier — the chair's standard puts neighbourhoods and suburbs in a thorp or hamlet only.
// TREE=<tip> node sizecheck.mjs <pm.json> <corpus dir>
import fs from 'node:fs'; import zlib from 'node:zlib';
const res = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const tiers = new Map(); for (const l of zlib.gunzipSync(fs.readFileSync(`${process.argv[3]}/corpus.ndjson.gz`)).toString().trim().split('\n')) { const o = JSON.parse(l); tiers.set(o.seed, `${o.s.tier}`); }
const QD = /\bdistricts?\b|\bquarters?\b/i;
const q = res.findings.filter((f) => f.word === 'quarters');
const other = q.filter((f) => !QD.test(f.quote));
const by = {}; for (const f of other) { const t = tiers.get(f.seed); const w = (/neighbou?rhoods?|urban|metropolitan|slums?|tenements?/i.exec(f.quote) || ['?'])[0].toLowerCase(); const k = `${t}\t${w}`; by[k] = (by[k] || 0) + 1; }
console.log('quarters lines', q.length, '| with no quarters/district word', other.length); console.log(by);
const vill = other.filter((f) => !['thorp', 'hamlet'].includes(tiers.get(f.seed)));
for (const f of [...new Map(vill.map((f) => [f.quote, f])).values()].slice(0, 8)) console.log(' ', tiers.get(f.seed), f.seed, '|', f.quote.slice(0, 160));
console.log('village-or-larger lines flagged by a neighbourhood word alone:', vill.filter((f) => /neighbou?rhood/i.test(f.quote)).length, 'in', new Set(vill.filter((f) => /neighbou?rhood/i.test(f.quote)).map((f) => f.seed)).size, 'towns');

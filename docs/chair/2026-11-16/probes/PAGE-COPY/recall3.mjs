// CENSUS-3 recall on the bar's first read (REVIEW-BAR-0-LIST.json): its ten towns re-born and re-rendered at the
// counted tree (census3.sh --seeds seeds.bar0.txt), every HIGH and MEDIUM row placed by the bar's own placer (place.mjs:
// a sentence over 12 characters is a substring of a page line; else the whole line or its edge; else its first 60
// characters), and for the rows that STILL PRINT: does any pattern of the instrument fire on a line that holds it?
// By the reader's kind (READER-BRIEF-BAR0: a lacks, b denies, c a state, d a size, e a count, f a figure, g two places
// disagree, h broken text) and by severity; the rows no pattern catches grouped by mechanism.
//   node recall3.mjs <bar0-run-dir> <REVIEW-BAR-0-LIST.json> [groups=5]
import fs from 'node:fs';
const [OUTD, LF, G = '5'] = process.argv.slice(2);
const L = JSON.parse(fs.readFileSync(LF, 'utf8')).filter((r) => r.severity === 'HIGH' || r.severity === 'MED');
const H = JSON.parse(fs.readFileSync(OUTD + '/hits.json', 'utf8'));
const hitsBy = {}; for (const h of H) (hitsBy[`${h.seed}|${h.view}|${h.line}`] ||= []).push(h);
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const pages = {}; const page = (seed) => pages[seed] ??= (() => { const out = []; let v = '_'; for (const l of fs.readFileSync(`${OUTD}/dumps/${seed}.txt`, 'utf8').split('\n')) { const m = l.match(/^== (.*) ==$/); if (m) { v = m[1]; continue; } if (l && !l.startsWith('[STYLE]')) out.push({ v, l, n: norm(l) }); } return out; })();
const rows = []; const res = {}; const miss = {};
for (const r of L) { const p = page(r.town); const s = norm(r.sentence); let where = s.length > 12 ? p.filter((x) => x.n.includes(s)) : p.filter((x) => x.n === s || x.n.startsWith(s + ' ') || x.n.endsWith(' ' + s));
  if (!where.length && s.length > 12) { const head = s.slice(0, Math.min(60, s.length)); where = p.filter((x) => x.n.includes(head)); }
  const fired = new Set(); for (const x of where) for (const h of hitsBy[`${r.town}|${x.v}|${x.l}`] || []) fired.add(h.pattern);
  const kinds = String(r.kind).split(/[|,]/); const k0 = kinds[0];
  for (const k of [k0, '*']) { const b = (res[`${k}|${r.severity}`] ||= { rows: 0, printing: 0, fired: 0 }); b.rows++; if (where.length) { b.printing++; if (fired.size) b.fired++; } }
  rows.push({ n: r.n, town: r.town, severity: r.severity, kind: r.kind, printing: where.length > 0, fired: [...fired] });
  if (where.length && !fired.size) { const g = String(r.mechanism || '').replace(/^other:\s*/, '').split(/[:;(]/)[0].trim().toLowerCase().slice(0, 60); (miss[g] ||= []).push(r.n); } }
const pr = (k) => Object.entries(res).filter(([key]) => key.startsWith(k + '|')).map(([key, b]) => `${key.split('|')[1]} ${b.fired}/${b.printing} printing (of ${b.rows})`).join(' · ');
console.log(`ALL: ${pr('*')}`); for (const k of [...new Set(L.map((r) => String(r.kind).split(/[|,]/)[0]))].sort()) console.log(`reader kind ${k}: ${pr(k)}`);
const groups = Object.entries(miss).sort((a, b) => b[1].length - a[1].length); console.log('the largest groups no pattern catches:'); for (const [g, ns] of groups.slice(0, +G)) console.log(`  ${ns.length}\t${g}\t(rows ${ns.slice(0, 8).join(', ')})`);
const firedBy = {}; for (const r of rows) for (const k of r.fired) firedBy[k] = (firedBy[k] || 0) + 1; console.log('rows caught, by the instrument\'s kind:', JSON.stringify(firedBy));
fs.writeFileSync(OUTD + '/recall3.json', JSON.stringify({ res, groups: groups.map(([g, ns]) => ({ mechanism: g, rows: ns })), rows, firedBy }, null, 1));

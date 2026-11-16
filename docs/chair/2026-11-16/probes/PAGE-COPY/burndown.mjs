// CENSUS-3 burn-down: the known rows, placed at the counted tree.
//  - the bar's first read (REVIEW-BAR-0-LIST.json): each row's sentence in its own town (the bar0 run's dumps), by the
//    bar's placer (place.mjs's rule: > 12 characters, a substring of a page line; else the whole line or its edge;
//    else its first 60 characters), with names and figures folded (the town's names and every figure as one token)
//  - the join's table (JOIN-ROWS.json, 191 rows, no town): each quoted run of 12 characters or more in the row's
//    sentence (the readers quote the page in "..."), counted on the 720 (the run's dumps): a row PRINTS when any of its
//    runs prints in any town; the towns are counted. A row with no quoted run is NOT PLACEABLE (counted apart).
//   node burndown.mjs <bar0-run-dir> <REVIEW-BAR-0-LIST.json> <run-720-dir> <JOIN-ROWS.json>
import fs from 'node:fs';
const [B0, LF, R7, JF] = process.argv.slice(2);
const norm = (s) => String(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
const fig = (s) => s.replace(/\d[\d,.]*/g, '#');
const pageOf = (dir, seed) => { try { return fs.readFileSync(`${dir}/dumps/${seed}.txt`, 'utf8').split('\n').filter((l) => l && !l.startsWith('== ') && !l.startsWith('[STYLE]')).map((l) => fig(norm(l))); } catch { return null; } };
const L = JSON.parse(fs.readFileSync(LF, 'utf8')); const res = {}; const barRows = [];
for (const r of L) { const p = pageOf(B0, r.town); if (!p) continue; const s = fig(norm(r.sentence)); let at = s.length > 12 ? p.some((l) => l.includes(s)) : p.some((l) => l === s || l.startsWith(s + ' ') || l.endsWith(' ' + s));
  if (!at && s.length > 12) { const head = s.slice(0, Math.min(60, s.length)); at = p.some((l) => l.includes(head)); }
  const b = (res[`bar|${r.severity}`] ||= { printing: 0, gone: 0 }); at ? b.printing++ : b.gone++; barRows.push({ n: r.n, severity: r.severity, printing: at }); }
const J = JSON.parse(fs.readFileSync(JF, 'utf8')); const seeds = fs.readdirSync(R7 + '/dumps').map((f) => f.replace(/\.txt$/, ''));
const texts = seeds.map((s) => [s, fig(norm(fs.readFileSync(`${R7}/dumps/${s}.txt`, 'utf8')))]);
const joinRows = [];
for (const r of J) { const runs = [...String(r.sentence).matchAll(/["“]([^"”]{12,})["”]/g)].map((m) => fig(norm(m[1]))).filter((t) => !/^\(?[a-z_]+\)?$/.test(t) || t.includes('_'));
  const sev = String(r.severity || '').replace(/\?$/, '').toUpperCase() || '?'; const b = (res[`join|${sev}`] ||= { printing: 0, gone: 0, unplaceable: 0, towns: 0 });
  if (!runs.length) { b.unplaceable++; joinRows.push({ id: r.id, severity: sev, placeable: false }); continue; }
  const towns = texts.filter(([, t]) => runs.some((x) => t.includes(x))).length; towns ? b.printing++ : b.gone++; b.towns += towns; joinRows.push({ id: r.id, severity: sev, placeable: true, runs, towns }); }
for (const [k, v] of Object.entries(res).sort()) console.log(k.padEnd(14), JSON.stringify(v));
console.log('join rows printing in the most towns:'); for (const r of joinRows.filter((x) => x.towns).sort((a, b) => b.towns - a.towns).slice(0, 10)) console.log(`  ${r.towns}\t${r.id}\t${r.severity}\t"${r.runs[0].slice(0, 70)}"`);
fs.writeFileSync(R7 + '/burndown.json', JSON.stringify({ res, barRows, joinRows }, null, 1));

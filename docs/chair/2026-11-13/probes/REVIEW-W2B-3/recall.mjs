// REVIEW-W2B-3 item 2: recall of the page member against a cold list (the earlier reviews' match rule: same town; either
// text, normalised, holds the other's first 50 characters).
//   node recall.mjs <cold-list.json> <pagemeasure result.json> <out.json> [severities=HIGH,MED]
import fs from 'node:fs';
const [, , COLD, PAGE, OUTF, SEV = 'HIGH,MED'] = process.argv;
const sev = new Set(SEV.split(','));
const cold = JSON.parse(fs.readFileSync(COLD, 'utf8')).lines;
const { findings } = JSON.parse(fs.readFileSync(PAGE, 'utf8'));
const norm = (s) => String(s).toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
const bySeed = new Map(); for (const f of findings) { if (!bySeed.has(f.seed)) bySeed.set(f.seed, []); bySeed.get(f.seed).push(f); }
const rows = [];
for (const c of cold) {
  const seed = bySeed.has(c.town.seed) ? c.town.seed : c.town.id; const cs = norm(c.sentence);
  const hits = (bySeed.get(seed) || []).filter((f) => { const q = norm(f.quote); return q.includes(cs.slice(0, 50)) || cs.includes(q.slice(0, 50)); });
  rows.push({ n: c.n, seed, severity: c.severity, mechanism: c.mechanism, sentence: c.sentence, found: hits.length > 0, words: [...new Set(hits.map((f) => f.word))] });
}
const pick = rows.filter((r) => sev.has(r.severity));
const tab = {}; for (const r of pick) { tab[r.mechanism] ||= { lines: 0, found: 0, HIGH: 0, HIGHfound: 0 }; const t = tab[r.mechanism]; t.lines++; if (r.found) t.found++; if (r.severity === 'HIGH') { t.HIGH++; if (r.found) t.HIGHfound++; } }
const sum = (k) => Object.values(tab).reduce((a, t) => a + t[k], 0);
fs.writeFileSync(OUTF, JSON.stringify({ cold: COLD, page: PAGE, severities: [...sev], total: { lines: pick.length, found: pick.filter((r) => r.found).length, HIGH: sum('HIGH'), HIGHfound: sum('HIGHfound') }, all: { lines: rows.length, found: rows.filter((r) => r.found).length }, byMechanism: tab, rows }, null, 1));
console.log('severities', [...sev].join('+'), 'lines', pick.length, 'found', pick.filter((r) => r.found).length, '| HIGH', sum('HIGH'), 'found', sum('HIGHfound'), '| all severities', rows.length, 'found', rows.filter((r) => r.found).length);
for (const [m, t] of Object.entries(tab).sort((a, b) => b[1].lines - a[1].lines)) console.log(String(t.lines).padStart(5), String(t.found).padStart(4), ` HIGH ${t.HIGH}/${t.HIGHfound}`.padEnd(14), m);
const wf = {}; for (const r of pick.filter((x) => x.found)) for (const w of r.words) wf[w] = (wf[w] || 0) + 1; console.log('found by word', JSON.stringify(wf));

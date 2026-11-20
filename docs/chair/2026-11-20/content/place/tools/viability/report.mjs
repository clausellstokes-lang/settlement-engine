// PLACE-1 · viability MEASURE: the figures of viability-MEASURE.md, from the rows measure.mjs wrote.
//   node report.mjs <repo> rows-plain.json rows-capture.json ../situationDesc/census100-before.json > report.out.txt
// Per sub-field and size: places holding it, the commonest masked sentence and its places (a place counted once a sentence),
// checked against the chair's census; then the same over the rows a page PRINTS (`viabilityFilter.js :: isViabilityItem`,
// the one routing rule the Outlook tab and the PDF share: a dependency-severity row and the 'Trade Dependencies' note never print).
import { readFileSync } from 'node:fs';

const [, , L, plainPath, capPath, censusPath] = process.argv;
const plain = JSON.parse(readFileSync(plainPath, 'utf8'));
const cap = JSON.parse(readFileSync(capPath, 'utf8'));
const census = JSON.parse(readFileSync(censusPath, 'utf8'));
const { isViabilityItem } = await import(`${L}/src/domain/display/viabilityFilter.js`);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const FIELDS = [
  ['economicViability.dependencies[].title', 'deps', (c) => [c.m.title]],
  ['economicViability.dependencies[].description', 'deps', (c) => [c.m.description]],
  ['economicViability.dependencies[].impact', 'deps', (c) => [c.m.impact]],
  ['economicViability.dependencies[].suggestedFixes[]', 'deps', (c) => c.m.fixes],
  ['economicViability.warnings[].description', 'warns', (c) => [c.m.description]],
];
const long = (s) => typeof s === 'string' && s.length >= 25 && s.includes(' '); // the census's sentence rule
const top = (rows, bucket, pick, filter) => {
  const by = new Map(); const holders = new Set();
  for (const r of rows) for (const c of r[bucket]) { if (!filter(c)) continue; for (const s of pick(c)) { if (!long(s)) continue; holders.add(r.seed); if (!by.has(s)) by.set(s, new Set()); by.get(s).add(r.seed); } }
  let best = ['', 0]; for (const [s, st] of by) if (st.size > best[1]) best = [s, st.size];
  return { holders: holders.size, top: best[1], sentence: best[0], distinct: by.size };
};
const asItem = (c) => ({ title: c.title, severity: c.severity, category: c.category ?? undefined });

console.log('## BEFORE, every row the record holds (masked as the census masks; top places / holders · distinct) vs the chair\'s census100-before.json');
for (const [path, bucket, pick] of FIELDS) {
  console.log(`\n${path}`);
  for (const s of SIZES) {
    const t = top(plain.filter((r) => r.size === s), bucket, pick, () => true);
    const c = census[s].find((x) => x.path === path);
    console.log(`  ${s.padEnd(10)} ${t.top}/${t.holders} · d${t.distinct} · census ${c ? `${c.topN}/${c.holders} d${c.distinct}` : '-'} · ${c ? (c.topN === t.top && c.holders === t.holders ? 'AGREES' : 'DIFFERS') : (t.holders < 5 ? 'AGREES (under the census\'s 5-holder floor)' : 'DIFFERS')} · "${t.sentence.slice(0, 90)}"`);
  }
}
console.log('\n## THE SUMMARY (economicViability.summary): masked top vs raw distinct, by size');
for (const s of SIZES) {
  const rows = plain.filter((r) => r.size === s); const m = new Map(); for (const r of rows) m.set(r.summaryMasked, (m.get(r.summaryMasked) || 0) + 1);
  const [ts, tn] = [...m].sort((a, b) => b[1] - a[1])[0];
  console.log(`  ${s.padEnd(10)} masked top ${tn}/100 · raw distinct ${new Set(rows.map((r) => r.summary)).size} · "${ts.slice(0, 80)}"`);
}
console.log('\n## WHAT A PAGE PRINTS: the same, over the rows isViabilityItem routes to the Outlook tab / PDF');
for (const [path, bucket, pick] of FIELDS) {
  console.log(`${path}: ${SIZES.map((s) => { const t = top(plain.filter((r) => r.size === s), bucket, pick, (c) => isViabilityItem(asItem(c))); return `${s} ${t.top}/${t.holders}`; }).join(' · ')}`);
}
const titles = new Map(); for (const r of plain) for (const c of r.warns) { const k = `${c.title} (severity ${c.severity}, printed ${isViabilityItem(asItem(c))})`; titles.set(k, (titles.get(k) || 0) + 1); }
console.log(`warning rows by title on the 600: ${[...titles].map(([k, n]) => `${n}× ${k}`).join('; ')}`);
const dtitles = new Map(); for (const r of plain) for (const c of r.deps) { const k = c.title.replace(/^Imports .*/, (x) => (/bulk materials|staple food|finished goods/.test(x) ? x : 'Imports <a mustImport resource>')); dtitles.set(k, (dtitles.get(k) || 0) + 1); }
console.log(`dependency rows by title on the 600: ${[...dtitles].map(([k, n]) => `${n}× ${k}`).join('; ')}`);

let same = 0; for (const r of cap) { const p = plain.find((x) => x.seed === r.seed); if (p && JSON.stringify(p.deps) === JSON.stringify(r.deps) && JSON.stringify(p.warns) === JSON.stringify(r.warns) && p.summary === r.summary) same++; }
console.log(`\n## INSTRUMENT: ${same}/${cap.length} births identical (every dependency and warning row, the summary) with and without the writer wrapped`);
const calls = cap.map((r) => r.caps.length);
console.log(`writer calls a birth: ${[...new Set(calls)].join(',')} · config._seed at the writer: ${cap.filter((r) => r.caps.some((c) => c.seedAtWriter)).length}/600 · imports at the writer != final: ${cap.filter((r) => JSON.stringify(r.caps.at(-1).impAtWriter) !== JSON.stringify(r.imports)).length}/600 · exports != final: ${cap.filter((r) => JSON.stringify(r.caps.at(-1).expAtWriter) !== JSON.stringify(r.exports)).length}/600`);

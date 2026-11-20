/**
 * BAR6-AUDIT seat F: the 525 reference configurations (tests/helpers/goldenMasterCorpus.js), born exactly as the golden
 * master births them (`generateSettlementPipeline(cfg, null, { seed, customContent: {} })`), and LAW 10's record-side
 * pairs counted on each: how many configurations hold the condition a draw-side cure (an exclusion at the draw) would
 * re-draw. That is the FLOOR of what such a cure moves; a re-draw that consumes the shared stream moves more (say so).
 *   node docs/chair/2026-11-16/bar6/AUDIT/ref525-F.mjs <out.json>
 * Pure reading of the tree; writes only <out.json>.
 */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
const { generateSettlementPipeline } = await import(path.join(ROOT, 'src/generators/generateSettlementPipeline.js'));
const { loadGenerationLawPayloads } = await import(path.join(ROOT, 'src/domain/density/densityCreateBoundary.js'));
const { goldenCorpus, keyOf } = await import(path.join(ROOT, 'tests/helpers/goldenMasterCorpus.js'));
const { LAW10 } = await import(path.join(ROOT, 'tests/helpers/pageLaws/law10.mjs'));
await loadGenerationLawPayloads();
const [, , outFile] = process.argv;
const rows = goldenCorpus();
const hits = {}; const field = {};
const add = (rule, key, f) => { (hits[rule] ||= new Set()).add(key); field[rule] = f; };
const spanOf = (s) => { const m = /\bfor (\d+|one|two|three|four|five|six) (seasons?|years?)\b/i.exec(s || ''); return m ? m[1].toLowerCase() + ' ' + m[2].toLowerCase().replace(/s$/, '') : null; };
const W = { one: '1', two: '2', three: '3', four: '4', five: '5', six: '6' };
let born = 0, errors = 0;
for (const row of rows) {
  const key = keyOf(row); const { _seed, ...cfg } = row; let s;
  try { s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} }); born++; } catch (e) { errors++; continue; }
  const t = { record: s, tabs: {}, town: key };
  for (const x of LAW10.law10a(t)) add('10a', key, 'npcs[].allegiance (dealAllegiances)');
  for (const x of LAW10.law10b(t)) add('10b', key, 'economicState.safetyProfile.plotHooks (or the pronoun printed from the roster: display only)');
  for (const x of LAW10.law10d(t)) if (/seat/.test(x.why)) add('10d-seat', key, 'relationships[].tension (createTieProseDraw)');
  for (const x of LAW10.law10e(t)) if (/^10e-temper/.test(x.rule)) add(x.rule, key, 'npcs[].secret or npcs[].personality (the later draw: the secret overlay)');
  for (const x of LAW10.law10f(t)) if (/^10f-(kind|tier|weight)$/.test(x.rule)) add(x.rule, key, 'powerStructure.factions[].desc');
  for (const n of s.npcs || []) if (/\bdraws pay\b|\bnames that never\b/i.test(n.secret?.what || '')) add('10e-house(secret drawn)', key, 'npcs[].secret (TITLE_SECRETS; settleTitleLines)');
  const H = s.history || {}; const by = {};
  for (const e of [...(H.historicalEvents || []).map((e) => [e.templateType, e.description]), ...(H.currentTensions || []).map((e) => [e.type, e.description])]) { const sp = spanOf(e[1]); if (e[0] && sp) (by[e[0]] ||= new Set()).add(sp.replace(/^(\w+)/, (w) => W[w] || w)); }
  if (Object.values(by).some((v) => v.size > 1)) add('10g-span', key, 'history.currentTensions[].description (the tension\'s "three")');
}
const counts = Object.fromEntries(Object.entries(hits).sort().map(([k, v]) => [k, { configurations: v.size, field: field[k] }]));
fs.writeFileSync(outFile, JSON.stringify({ rows: rows.length, born, errors, counts, keys: Object.fromEntries(Object.entries(hits).map(([k, v]) => [k, [...v]])) }, null, 1));
console.log(`525 reference: rows ${rows.length} · born ${born} · errors ${errors}`);
for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(24)} ${String(v.configurations).padStart(4)} of ${rows.length} · ${v.field}`);
process.exit(errors ? 1 : 0);

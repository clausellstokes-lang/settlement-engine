// PLACE-1 · viability MEASURE, SECTION 0 (the chair's rule of 16:25 UTC: prove each sub-field prints before measuring it).
// Births the census rows that `run.mjs <tree> <out> render --seeds=…` rendered (the same `configOf(row, DEFAULT_CONFIG,
// birthConfig)` and seed as `render.census.jsx`), reads each stored string of the viability card, and looks for it in every
// rendered view (`<out>/views/<seed>.json`: { views: { 'Group/Tab': [lines] } }, the page census's `walkDossier`, the DM's own
// view through the real OutputContainer). A string counts as printed where a view's joined text holds it whole.
//
//   node printed.mjs <repo> <render-out> <seed,seed,…> > printed.out.txt
import { readFileSync } from 'node:fs';

const [, , L, OUT, seedsArg] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
await loadGenerationLawPayloads();
const plan = censusPlan('r2');
const tally = {};
const hit = (field, where) => { const t = (tally[field] ||= { strings: 0, printed: 0, where: {} }); t.strings++; if (where.length) t.printed++; for (const w of where) t.where[w] = (t.where[w] || 0) + 1; };
for (const seed of seedsArg.split(',')) {
  const row = plan.find((r) => r.seed === seed);
  const t = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
  const { views } = JSON.parse(readFileSync(`${OUT}/views/${seed}.json`, 'utf8'));
  const text = Object.fromEntries(Object.entries(views).map(([k, lines]) => [k, (Array.isArray(lines) ? lines : []).join('\n')]));
  const find = (s) => (s && s.length > 3 ? Object.keys(text).filter((k) => text[k].includes(s)) : []);
  const v = t.economicViability || {};
  console.log(`\n## ${seed} (${t.tier}): ${(v.dependencies || []).length} dependencies, ${(v.warnings || []).length} warnings`);
  for (const [bucket, list] of [['dependencies', v.dependencies || []], ['warnings', v.warnings || []]]) {
    for (const d of list) {
      const parts = [['title', d.title], ['description', d.description], ['impact', d.impact], ...(d.suggestedFixes || []).map((x) => ['suggestedFixes[]', x])];
      for (const [k, s] of parts) {
        if (typeof s !== 'string') continue;
        const where = find(s);
        hit(`${bucket}[].${k}`, where);
        console.log(`${bucket}[].${k.padEnd(16)} ${where.length ? where.join(', ') : 'NOWHERE'} :: ${s.slice(0, 90)}`);
      }
    }
  }
  const sw = find(String(v.summary || '')), body = String(v.summary || '').replace(/^\s*[✗✓△]?\s*(?:NOT VIABLE|VIABLE(?: [A-Z][A-Z ]*)?)\s*:\s*/, '');
  hit('summary (whole)', sw);
  hit('summary (body, token stripped)', find(body.charAt(0).toUpperCase() + body.slice(1)));
  console.log(`summary          ${sw.length ? sw.join(', ') : 'NOWHERE'} :: ${String(v.summary).slice(0, 110)}`);
  const outlook = text['Systems/Outlook'] || '';
  console.log(`  (the Outlook tab's own verdict line: ${outlook.split('\n').slice(0, 3).join(' | ').slice(0, 200)})`);
}
console.log('\n## TALLY: sub-field: strings / printed somewhere / where');
for (const [f, t] of Object.entries(tally)) console.log(`${f.padEnd(32)} ${t.strings} / ${t.printed} / ${JSON.stringify(t.where)}`);
